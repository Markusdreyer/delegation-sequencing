import express from "express";
import cors from "cors";
import * as child from "child_process";
import fs from "fs";
import { isA, isSubClass, property, sortModels } from "./utils";
import { Models } from "./types";

const app = express();
app.use(cors());
app.use("*", cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.enable("trust proxy");
const port = 8000;

interface ProcedureData {
  action: string;
  agents: string;
  quantity: number;
  abbreviation: string;
  precedence: string;
}

interface TaxonomyData {
  id: number;
  parentId: number;
  role?: string;
  agent: string;
}

app.post("/asp-parser", (req, res) => {
  const reqBody = req.body;
  const taxonomyData: TaxonomyData[] = reqBody.taxonomy;
  const procedureData: ProcedureData[] = reqBody.procedure;
  let aspString: string = "";
  let predString: string = "";
  let taxonomyString: string = "";
  procedureData.map((el) => {
    const precedence = el.precedence;
    const abbreviation = el.abbreviation;
    const agents = el.agents.split(",");
    if (agents.length > 1) {
      aspString += `collaborative(${abbreviation}) . \n`;
    } else {
      aspString += `primitive(${abbreviation}) . \n`;
    }
    aspString += `description(${abbreviation}, \"${el.action}\") .\ndelegate(${abbreviation}, ${el.quantity}, ${agents}) :- deploy(${abbreviation}) . \nmandatory(${abbreviation}) .\n\n`;

    if (precedence !== "None") {
      predString += `pred(${abbreviation}, ${precedence}) .\n`;
    }
  });

  const parents: string[] = [];
  taxonomyData.map((el) => {
    if (!el.hasOwnProperty("parentId")) {
      /**
       * Means that the element should be considered top-level.
       * The parents should be added to an array for easy lookup.
       */
      taxonomyString += isSubClass(el.agent, "agent");
      parents[el.id] = el.agent;
    } else if (el.hasOwnProperty("role")) {
      // What happens if eg. driver is added as subclass to ae_crew twice?
      taxonomyString += isSubClass(el.role, parents[el.parentId]);
      taxonomyString += property(el.agent, el.role);
      taxonomyString += isA(el.agent, el.role);
    } else {
      taxonomyString += isA(el.agent, parents[el.parentId]);
    }
  });

  aspString += `${predString}\n\n`;
  aspString += `${taxonomyString}\n\n`;

  fs.writeFile("src/model.lp", aspString, (err) => {
    if (err) throw err;
    console.log("Model saved to model.lp");
  });

  const spawn = child.spawn;
  const pythonProcess = spawn("python3", ["src/proxy.py"]);
  pythonProcess.stdout.on("data", () => {
    let sortedModels;
    let models;
    try {
      models = fs.readFileSync("res.json", "utf8");
      sortedModels = sortModels(JSON.parse(models));
    } catch (error) {
      console.error("Unable to parse model file:: ", error);
      console.error("Model file:: ", models);
    }

    res.status(sortedModels.status).json(sortedModels.body);
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
