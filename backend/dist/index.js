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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const child = __importStar(require("child_process"));
const fs_1 = __importDefault(require("fs"));
const utils_1 = require("./utils");
const app = express_1.default();
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.enable("trust proxy");
app.use(cors_1.default());
const port = 8000;
app.post("/asp-parser", (req, res) => {
    const reqBody = req.body;
    const taxonomyData = reqBody.taxonomy;
    const procedureData = reqBody.procedure;
    console.log("PROCEDURE DATA:: ", procedureData);
    console.log("TAXONOMY DATA:: ", taxonomyData);
    let aspString = "";
    let predString = "";
    let taxonomyString = "";
    procedureData.map((el) => {
        const precedence = el.precedence;
        const abbreviation = el.abbreviation;
        const agents = el.agents.split(",");
        if (agents.length > 1) {
            aspString += `collaborative(${abbreviation}) . \n`;
        }
        else {
            aspString += `primitive(${abbreviation}) . \n`;
        }
        aspString += `description(${abbreviation}, \"${el.action}\") .\ndelegate(${abbreviation}, ${el.quantity}, ${agents}) :- deploy(${abbreviation}) . \nmandatory(${abbreviation}) .\n\n`;
        if (precedence !== "None") {
            predString += `pred(${abbreviation}, ${precedence}) .\n`;
        }
    });
    const parents = [];
    taxonomyData.map((el) => {
        /**
         * Means that the element should be considered top-level.
         * The parents should be added to an array for easy lookup.
         */
        if (!el.hasOwnProperty("parentId")) {
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
        console.log("EL:: ", el);
        console.log("PARENTS:: ", parents[1]);
    });
    aspString += `${predString}\n\n`;
    aspString += `${taxonomyString}\n\n`;
    fs_1.default.writeFile("src/model.lp", aspString, (err) => {
        if (err)
            throw err;
        console.log("Model saved to model.lp");
    });
    const spawn = child.spawn;
    const pythonProcess = spawn("python3", ["src/proxy.py"]);
    let models;
    pythonProcess.stdout.on("data", (data) => {
        console.log(data.toString());
        models = JSON.parse(fs_1.default.readFileSync("src/res.json", "utf8"));
        console.log(models);
        res.json(models);
    });
    /* const foo: child.ChildProcess = child.exec(
    "clingo --outf=2 src/model.lp src/actions.lp",
    (error: any, stdout: string, stderr: string) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    }
  ); */
});
// start the Express server
app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http:// localhost:${port}`);
});
//# sourceMappingURL=index.js.map