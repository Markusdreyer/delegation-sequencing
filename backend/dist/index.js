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
const clingo = __importStar(require("clingo-wasm"));
const fs_1 = __importDefault(require("fs"));
const utils_1 = require("./utils");
const app = express_1.default();
app.use(cors_1.default());
app.use("*", cors_1.default());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.enable("trust proxy");
const port = 8000;
app.post("/revise", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reqBody = req.body;
    const previousModel = reqBody.previousModel.join("");
    const changes = reqBody.changes.join("");
    const revision = previousModel + changes;
    const control = fs_1.default.readFileSync("src/asp/control.lp", "utf8");
    const actions = fs_1.default.readFileSync("src/asp/actions.lp", "utf8");
    const newModels = yield clingo.run(control + actions + revision, 0);
    console.log("models: ", newModels);
    res.status(200).json(newModels);
}));
app.post("/initial", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reqBody = req.body;
    const [aspString, error] = utils_1.generateAspString(reqBody);
    if (error) {
        const response = error;
        res.status(response.status).json(response.body);
    }
    if (aspString) {
        const control = fs_1.default.readFileSync("src/asp/control.lp", "utf8");
        const models = yield clingo.run(control + aspString, 0);
        console.log(models);
        const sortedModels = utils_1.sortModels(models);
        res.status(sortedModels.status).json(sortedModels.body);
    }
}));
// start the Express server
app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http:// localhost:${port}`);
});
//# sourceMappingURL=index.js.map