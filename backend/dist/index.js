"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = express_1.default();
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.enable("trust proxy");
app.use(cors_1.default());
const port = 8000;
app.post("/asp-parser", (req, res) => {
    const tableData = req.body;
    let aspString = "";
    tableData.map((el) => {
        const precedence = el.precedence;
        const agents = el.agents.split(",");
        if (agents.length > 1) {
            aspString = aspString.concat(`collaborative(${precedence})`);
        }
        else {
            aspString = aspString.concat(`primitive(${precedence})`);
        }
        aspString = aspString.concat(`description(${precedence}, ${el.action}) delegate(${precedence}, ${el.quantity}, ${agents}):-deploy(${precedence}) mandatory(${precedence})`);
    });
    res.json(aspString);
});
// start the Express server
app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map