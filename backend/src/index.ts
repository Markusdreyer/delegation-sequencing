import express from "express";
import cors from "cors";
import clingojs from "clingojs";
import * as clingowasm from "clingo-wasm";
import * as child from "child_process";
import fs from "fs";
import {
  createReadableConst,
  isA,
  isSubClass,
  parseModel,
  property,
  sortModels,
} from "./utils";
import { Models, Response } from "./types";

const clingo = new clingojs();
const app = express();

app.use(cors());
app.use("*", cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.enable("trust proxy");
const port = 8000;

interface ProcedureData {
  action: string;
  agent: string;
  quantity: number;
  abbreviation: string;
  precedence: string;
  role?: string;
}

interface TaxonomyData {
  id: number;
  parentId: number;
  role?: string;
  agent: string;
}

app.post("/wasm", async (req, res) => {
  const reqBody = req.body;
  const currentModel = reqBody.currentModel.join("");
  const changes = reqBody.changes.join("");
  const revision = currentModel + changes;

  const control = fs.readFileSync("src/asp/control.lp", "utf8");
  const actions = fs.readFileSync("src/asp/actions.lp", "utf8");
  const newModels: clingowasm.ClingoResult | clingowasm.ClingoError =
    await clingowasm.run(control + actions + revision, 0);
  console.log("models: ", newModels);
  res.status(200).json({ models: newModels });
});

app.get("/test", (req, res) => {
  const models: any = [];

  clingo
    .solve({
      inputFiles: ["src/model.lp", "src/actions.lp"],
    })
    .on("model", (model: any) => {
      models.push(model);
    })
    .on("end", () => {
      res.status(200).json(models);
    });
});

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
    const role = el.role;
    const agents = el.agent.split(",");

    if (agents.length > 1) {
      aspString += `collaborative(${abbreviation}) . \n`;
      agents.map((agent) => {
        // TODO:Tasks with roles does not support collaborative tasks, and the task will be ignored
        const parsedAgent = createReadableConst(agent);
        console.log("PARSED AGENT:: ", parsedAgent);
        aspString += `delegate(${abbreviation}, ${el.quantity}, ${parsedAgent}) :- deploy(${abbreviation}),  member(Ag, ${parsedAgent}). \n`;
      });
    } else {
      aspString += `primitive(${abbreviation}) . \n`;
      const parsedAgent = createReadableConst(agents[0]);
      if (role) {
        // TODO:Backend does not support multiple roles for a single task
        const parsedRole = createReadableConst(role);
        aspString += `responsible(${abbreviation}, Ag) :- deploy(${abbreviation}), property(Ag, ${parsedRole}), member(Ag, ${parsedAgent}) .\n`;
      } else {
        aspString += `delegate(${abbreviation}, ${el.quantity}, ${parsedAgent}) :- deploy(${abbreviation}), member(Ag, ${parsedAgent}).\n`;
      }
    }

    aspString += ``;
    aspString += `description(${abbreviation}, "${el.action}") .\nmandatory(${abbreviation}) .\n\n`;

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

  fs.writeFile("src/actions.lp", aspString, (err) => {
    if (err) throw err;
    console.log("Model saved to actions.lp");
  });

  const spawn = child.spawn;
  const pythonProcess = spawn("python3", ["src/proxy.py"]);
  pythonProcess.stdout.on("data", () => {
    let sortedModels: Response;
    let models;
    try {
      models = fs.readFileSync("./src/res.json", "utf8");
      sortedModels = sortModels(JSON.parse(models));
    } catch (error) {
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
