import {
  collaborative,
  delegate,
  generateSuperClassSection,
  isA,
  isSubClass,
  primitive,
  property,
  responsible,
} from "./aspFunctions";
import {
  FailureReason,
  ProcedureData,
  Response,
  TaxonomyData,
  Witnesses,
} from "./types";
import fs from "fs";

export const sortModels = (models: any): Response => {
  if (!models) {
    const error: Response = {
      status: 500,
      body: {
        function: "sortModels",
        reason: "No models to sort",
      },
    };
    return error;
  }

  if (Object.keys(models.Call[0]).length < 1) {
    const error: Response = {
      status: 400,
      body: models,
    };
    console.log("UNSATISFIABLE MODEL: ", models);
    return error;
  }

  if (models.Call.length > 1) {
    const error: Response = {
      status: 500,
      body: {
        function: "sortModels",
        reason: "Could not sort models because multiple calls were detected",
      },
    };
    return error;
  }

  models.Call[0].Witnesses.map((model: Witnesses) => {
    model.Value.sort((a, b) =>
      a.split(",")[2].localeCompare(b.split(",")[2], "en", { numeric: true })
    );
  });

  const success: Response = {
    status: 200,
    body: models,
  };

  return success;
};

export const parseModel = (model: string) => {
  const parsedModel = model.split(")");
  parsedModel.filter((el) => el);
  const resList: string[] = [];
  parsedModel.forEach((el) => {
    let res = el.trim();
    if (res.slice(-1) !== ")") {
      res += ")";
    }
    resList.push(res);
  });
  return resList;
};

export const generateAspString = ({
  taxonomy,
  procedure,
}: {
  taxonomy: TaxonomyData[];
  procedure: ProcedureData[];
}): (string | Response)[] => {
  const [aspActions, actionsError] = generateAspActions(procedure);
  const [aspTaxonomy, taxonomyError] = generateAspTaxonomy(taxonomy);

  console.log("taxonomyError", taxonomyError);
  console.log("actionsError", actionsError);
  if (actionsError || taxonomyError) {
    const error: Response = {
      status: 400,
      body: (actionsError ? actionsError : taxonomyError) as FailureReason,
    };

    return [null, error];
  }

  const aspString: string = `${aspActions}\n\n${aspTaxonomy}`;

  fs.writeFile("src/asp/actions.lp", aspString, (err) => {
    if (err) throw err;
    console.log("Model saved to actions.lp");
  });

  return [aspString, null];
};

const generateAspActions = (
  procedure: ProcedureData[]
): (string | FailureReason)[] => {
  let aspActions: string = "";
  let aspPrecendence: string = "";
  for (const el of procedure) {
    if (el.role === "") {
      delete el.role;
    }
    if (Object.values(el).some((val) => val === "")) {
      const error: FailureReason = {
        function: "generateAspActions",
        reason: `Detected missing value in element: ${JSON.stringify(el)}`,
      };
      console.log("Error: ", error);
      return [null, error];
    }
    const precedence = el.precedence;
    const abbreviation = el.abbreviation;
    const agents = el.agent.split(",");
    const role = el.role;

    if (agents.length > 1) {
      aspActions += collaborative(abbreviation);
      const [superClassName, superClassSection] = generateSuperClassSection(
        agents,
        aspActions
      ); // Generate a single class out of all the possible agents
      aspActions += superClassSection;
      aspActions += delegate(abbreviation, el.quantity, superClassName);
    } else {
      aspActions += primitive(abbreviation);
      if (role) {
        // TODO:Backend does not support multiple roles for a single task
        aspActions += responsible(abbreviation, role, el.agent);
      } else {
        aspActions += delegate(abbreviation, el.quantity, el.agent);
      }
    }

    aspActions += ``;
    aspActions += `description(${abbreviation}, "${el.action}") .\nmandatory(${abbreviation}) .\n\n`;

    if (precedence !== "None") {
      aspPrecendence += `pred(${abbreviation}, ${precedence}) .\n`;
    }
  }

  return [aspActions + aspPrecendence, null];
};

const generateAspTaxonomy = (
  taxonomy: TaxonomyData[]
): (string | FailureReason)[] => {
  let aspTaxonomy: string = "";
  const parents: string[] = [];
  for (const el of taxonomy) {
    if (el.role === "") {
      delete el.role;
    }
    if (Object.values(el).some((val) => val === "")) {
      const error: FailureReason = {
        function: "generateAspActions",
        reason: `Detected missing value in element: ${JSON.stringify(el)}`,
      };
      console.log("Error: ", error);
      return [null, error];
    }

    if (!el.hasOwnProperty("parentId")) {
      /**
       * Means that the element should be considered top-level.
       * The parents should be added to an array for easy lookup.
       */
      aspTaxonomy += isSubClass(el.agent, "agent");
      parents[el.id] = el.agent;
    } else {
      aspTaxonomy += isA(el.agent, parents[el.parentId]);
    }

    if (el.hasOwnProperty("role") && el.role !== "") {
      aspTaxonomy += property(el.agent, el.role);
      aspTaxonomy += isA(el.agent, el.role);
    }
  }

  return [aspTaxonomy, null];
};
