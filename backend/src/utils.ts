import {
  collaborative,
  delegate,
  isA,
  isSubClass,
  member,
  primitive,
  property,
  responsible,
  roleProperty,
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
      for (const agent of agents) {
        // TODO:Tasks with roles does not support collaborative tasks, and the task will be ignored
        aspActions += delegate(abbreviation, el.quantity, agent);
        aspActions += member(agent);
      }
    } else {
      aspActions += primitive(abbreviation);
      if (role) {
        // TODO:Backend does not support multiple roles for a single task
        aspActions += responsible(abbreviation);
        aspActions += roleProperty(role);
        aspActions += member(agents[0]);
      } else {
        aspActions += delegate(abbreviation, el.quantity, agents[0]);
        aspActions += member(agents[0]);
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
    } else if (el.hasOwnProperty("role") && el.role !== "") {
      // What happens if eg. driver is added as subclass to ae_crew twice?
      aspTaxonomy += isSubClass(el.role, parents[el.parentId]);
      aspTaxonomy += property(el.agent, el.role);
      aspTaxonomy += isA(el.agent, el.role);
    } else {
      aspTaxonomy += isA(el.agent, parents[el.parentId]);
    }
  }

  return [aspTaxonomy, null];
};
