"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const clingojs_1 = __importDefault(require("clingojs"));
const clingowasm = __importStar(require("clingo-wasm"));
const child = __importStar(require("child_process"));
const fs_1 = __importDefault(require("fs"));
const utils_1 = require("./utils");
const clingo = new clingojs_1.default();
const app = express_1.default();
app.use(cors_1.default());
app.use("*", cors_1.default());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.enable("trust proxy");
const port = 8000;
app.post("/wasm", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reqBody = req.body;
    const currentModel = reqBody.currentModel.join("");
    const changes = reqBody.changes.join("");
    const revision = currentModel + changes;
    const model = fs_1.default.readFileSync("src/control.lp", "utf8");
    const actions = fs_1.default.readFileSync("src/actions.lp", "utf8");
    const newModels = yield clingowasm.run(model + actions + revision, 0);
    console.log("models: ", newModels);
    res.status(200).json({ models: newModels });
}));
app.get("/test", (req, res) => {
    const models = [];
    clingo
        .solve({
        inputFiles: ["src/model.lp", "src/actions.lp"],
    })
        .on("model", (model) => {
        models.push(model);
    })
        .on("end", () => {
        res.status(200).json(models);
    });
});
// TODO: Fix .lp file linking. All .lp files should be placed in /src and include the correct files.
app.post("/revise", (req, res) => {
    const reqBody = req.body;
    const currentModel = reqBody.currentModel.join("");
    const changes = reqBody.changes.join("");
    clingo.config({
        maxModels: 0,
    });
    const newModels = [];
    const revision = currentModel + changes;
    console.log("REVISION", revision);
    clingo
        .solve({
        inputFiles: ["src/d2/control.lp", currentModel + changes],
    })
        .on("model", (model) => {
        console.log("model", model);
        // const parsedModel = parseModel(model);
        // newModels.push(parsedModel);
    })
        .on("end", () => {
        res.status(200).json({ model: newModels });
    });
});
app.post("/asp-parser", (req, res) => {
    const reqBody = req.body;
    const taxonomyData = reqBody.taxonomy;
    const procedureData = reqBody.procedure;
    let aspString = "";
    let predString = "";
    let taxonomyString = "";
    procedureData.map((el) => {
        const precedence = el.precedence;
        const abbreviation = el.abbreviation;
        const role = el.role;
        const agents = el.agent.split(",");
        if (agents.length > 1) {
            aspString += `collaborative(${abbreviation}) . \n`;
            agents.map((agent) => {
                // TODO:Tasks with roles does not support collaborative tasks, and the task will be ignored
                const parsedAgent = utils_1.createReadableConst(agent);
                console.log("PARSED AGENT:: ", parsedAgent);
                aspString += `delegate(${abbreviation}, ${el.quantity}, ${parsedAgent}) :- deploy(${abbreviation}),  member(Ag, ${parsedAgent}). \n`;
            });
        }
        else {
            aspString += `primitive(${abbreviation}) . \n`;
            const parsedAgent = utils_1.createReadableConst(agents[0]);
            if (role) {
                // TODO:Backend does not support multiple roles for a single task
                const parsedRole = utils_1.createReadableConst(role);
                aspString += `responsible(${abbreviation}, Ag) :- deploy(${abbreviation}), property(Ag, ${parsedRole}), member(Ag, ${parsedAgent}) .\n`;
            }
            else {
                aspString += `delegate(${abbreviation}, ${el.quantity}, ${parsedAgent}) :- deploy(${abbreviation}), member(Ag, ${parsedAgent}).\n`;
            }
        }
        aspString += ``;
        aspString += `description(${abbreviation}, "${el.action}") .\nmandatory(${abbreviation}) .\n\n`;
        if (precedence !== "None") {
            predString += `pred(${abbreviation}, ${precedence}) .\n`;
        }
    });
    const parents = [];
    taxonomyData.map((el) => {
        if (!el.hasOwnProperty("parentId")) {
            /**
             * Means that the element should be considered top-level.
             * The parents should be added to an array for easy lookup.
             */
            taxonomyString += utils_1.isSubClass(el.agent, "agent");
            parents[el.id] = el.agent;
        }
        else if (el.hasOwnProperty("role")) {
            // What happens if eg. driver is added as subclass to ae_crew twice?
            taxonomyString += utils_1.isSubClass(el.role, parents[el.parentId]);
            taxonomyString += utils_1.property(el.agent, el.role);
            taxonomyString += utils_1.isA(el.agent, el.role);
        }
        else {
            taxonomyString += utils_1.isA(el.agent, parents[el.parentId]);
        }
    });
    aspString += `${predString}\n\n`;
    aspString += `${taxonomyString}\n\n`;
    fs_1.default.writeFile("src/actions.lp", aspString, (err) => {
        if (err)
            throw err;
        console.log("Model saved to actions.lp");
    });
    const spawn = child.spawn;
    const pythonProcess = spawn("python3", ["src/proxy.py"]);
    pythonProcess.stdout.on("data", () => {
        let sortedModels;
        let models;
        try {
            models = fs_1.default.readFileSync("./src/res.json", "utf8");
            sortedModels = utils_1.sortModels(JSON.parse(models));
        }
        catch (error) {
            console.error("Unable to parse model file:: ", error);
            console.error("Model file:: ", models);
            sortedModels = {
                status: 500,
                body: error,
            };
            res.status(sortedModels.status);
            res.send(sortedModels.body);
        }
        res.status(sortedModels.status).json(sortedModels.body);
    });
});
// start the Express server
app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http:// localhost:${port}`);
});
//# sourceMappingURL=index.js.map