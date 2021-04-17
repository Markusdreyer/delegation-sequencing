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
const app = express_1.default();
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.enable("trust proxy");
app.use(cors_1.default());
const port = 8000;
app.post("/asp-parser", (req, res) => {
    const tableData = req.body;
    console.log(tableData);
    let aspString = "";
    let predString = "";
    tableData.map((el) => {
        const precedence = el.precedence;
        const abbreviation = el.abbreviation;
        const agents = el.agents.split(",");
        if (agents.length > 1) {
            aspString = aspString.concat(`collaborative(${abbreviation}) . \n`);
        }
        else {
            aspString = aspString.concat(`primitive(${abbreviation}) . \n`);
        }
        aspString = aspString.concat(`description(${abbreviation}, \"${el.action}\") .\ndelegate(${abbreviation}, ${el.quantity}, ${agents}) :- deploy(${abbreviation}) . \nmandatory(${abbreviation}) .\n\n`);
        if (precedence !== "None") {
            predString = predString.concat(`pred(${abbreviation}, ${precedence}) .\n`);
        }
    });
    aspString = aspString.concat(predString);
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
    console.log(`server started at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map