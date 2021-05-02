import express from "express";
import cors from "cors";
import bodyParser, { json } from "body-parser";
import * as child from "child_process";
import fs from "fs";
import { isA, isSubClass, property } from "./utils";

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.enable("trust proxy");
app.use(cors());
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
  console.log("PROCEDURE DATA:: ", procedureData);
  console.log("TAXONOMY DATA:: ", taxonomyData);
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
    /**
     * Means that the element should be considered top-level.
     * The parents should be added to an array for easy lookup.
     */

    if (!el.hasOwnProperty("parentId")) {
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
    console.log("EL:: ", el);
    console.log("PARENTS:: ", parents[1]);
  });

  aspString += `${predString}\n\n`;
  aspString += `${taxonomyString}\n\n`;

  fs.writeFile("src/model.lp", aspString, (err) => {
    if (err) throw err;
    console.log("Model saved to model.lp");
  });

  const spawn = child.spawn;
  const pythonProcess = spawn("python3", ["src/proxy.py"]);
  let models: any;
  pythonProcess.stdout.on("data", (data) => {
    console.log(data.toString());
    models = JSON.parse(fs.readFileSync("src/res.json", "utf8"));
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
