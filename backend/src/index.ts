import express from "express";
import cors from "cors";
import bodyParser, { json } from "body-parser";
import * as child from "child_process";
import fs from "fs";

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.enable("trust proxy");
app.use(cors());
const port = 8000;

interface TableData {
  action: string;
  agents: string;
  quantity: number;
  abbreviation: string;
  precedence: string;
}

app.post("/asp-parser", (req, res) => {
  const tableData: TableData[] = req.body;
  console.log(tableData);
  let aspString: string = "";
  let predString: string = "";
  tableData.map((el) => {
    const precedence = el.precedence;
    const abbreviation = el.abbreviation;
    const agents = el.agents.split(",");
    if (agents.length > 1) {
      aspString = aspString.concat(`collaborative(${abbreviation}) . \n`);
    } else {
      aspString = aspString.concat(`primitive(${abbreviation}) . \n`);
    }
    aspString = aspString.concat(
      `description(${abbreviation}, \"${el.action}\") .\ndelegate(${abbreviation}, ${el.quantity}, ${agents}) :- deploy(${abbreviation}) . \nmandatory(${abbreviation}) .\n\n`
    );

    if (precedence !== "None") {
      predString = predString.concat(
        `pred(${abbreviation}, ${precedence}) .\n`
      );
    }
  });

  aspString = aspString.concat(predString);

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
  console.log(`server started at http://localhost:${port}`);
});
