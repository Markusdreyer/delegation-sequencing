import express from "express";
import cors from "cors";
import * as clingo from "clingo-wasm";
import fs from "fs";
import { generateAspString, sortModels } from "./utils";
import { Response } from "./types";

const app = express();

app.use(cors());
app.use("*", cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.enable("trust proxy");
const port = 8000;

app.post("/revise", async (req, res) => {
  const reqBody = req.body;
  const previousModel = reqBody.previousModel.join("");
  const changes = reqBody.changes.join("");
  const revision = previousModel + changes;

  const control = fs.readFileSync("src/asp/control.lp", "utf8");
  const actions = fs.readFileSync("src/asp/actions.lp", "utf8");
  const newModels: clingo.ClingoResult | clingo.ClingoError = await clingo.run(
    control + actions + revision,
    0
  );
  console.log("models: ", newModels);
  res.status(200).json(newModels);
});

app.post("/initial", async (req, res) => {
  const reqBody = req.body;
  const [aspString, error] = generateAspString(reqBody);
  if (error) {
    const response = error as Response;
    res.status(response.status).json(response.body);
  }

  if (aspString) {
    const control = fs.readFileSync("src/asp/control.lp", "utf8");
    const models: clingo.ClingoResult | clingo.ClingoError = await clingo.run(
      control + aspString,
      0
    );
    console.log(models);
    const sortedModels = sortModels(models);
    res.status(sortedModels.status).json(sortedModels.body);
  }
});

// start the Express server
app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http:// localhost:${port}`);
});
