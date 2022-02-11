import * as functions from "firebase-functions";
import * as express from "express";
import * as clingo from "clingo-wasm";
import * as fs from "fs";
import { generateAspActions, generateAspString, sortModels } from "./utils";
import { FailureReason, Response } from "./types";

const app = express();

const cors = require("cors");
app.use(cors());
app.use("*", cors());
app.enable("trust proxy");
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

exports.api = functions.https.onRequest(app);

app.post("/revise", async (req, res) => {
  console.log("Revise endpoint reached");
  const reqBody = req.body;
  const previousModel = reqBody.previousModel.join("");
  const changes = reqBody.changes.join("");
  const revision = previousModel + changes;
  const control = fs.readFileSync("src/asp/control.lp", "utf8");
  let actions = fs.readFileSync("src/asp/actions.lp", "utf8");
  const newActions = reqBody.newActions;
  const taxonomy = reqBody.taxonomy;

  if (reqBody && taxonomy) {
    const [newAspActions, actionsError] = generateAspActions(
      taxonomy,
      newActions
    );

    if (actionsError) {
      const error: Response = {
        status: 400,
        body: actionsError as FailureReason,
      };
      console.log("ActionsError", actionsError);
      res.status(error.status).json(error.body);
      return;
    }
    console.log("NEW ASP ACTIONS:: ", newAspActions);
    actions += newAspActions;
  }

  const aspString = control + actions + revision;
  const newModels: clingo.ClingoResult | clingo.ClingoError = await clingo.run(
    aspString,
    0
  );
  console.log("models: ", newModels);
  res.status(200).json(newModels);
});

app.post("/initial", async (req, res) => {
  console.log("/initial request received");
  const reqBody = req.body;
  const [aspString, error] = generateAspString(reqBody);
  if (error) {
    const response = error as Response;
    res.status(response.status).json(response.body);
  }

  console.log("Successfully generated asp strings");
  if (aspString) {
    console.log("Reading as control file");
    const control = fs.readFileSync("src/asp/control.lp", "utf8");
    console.log("Running clingo on asp files");
    const models: clingo.ClingoResult | clingo.ClingoError = await clingo.run(
      control + aspString,
      0
    );
    console.log(models);
    if (models.Result === "ERROR") {
      res
        .status(500)
        .json({ function: "clingo.run", reason: "invalid asp format" });
    } else {
      const sortedModels = sortModels(models);
      res.status(sortedModels.status).json(sortedModels.body);
    }
  }
});
