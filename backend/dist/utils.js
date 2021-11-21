"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAspString = exports.parseModel = exports.sortModels = void 0;
const aspFunctions_1 = require("./aspFunctions");
const fs_1 = __importDefault(require("fs"));
const sortModels = (models) => {
    if (!models) {
        const error = {
            status: 500,
            body: {
                function: "sortModels",
                reason: "No models to sort",
            },
        };
        return error;
    }
    if (Object.keys(models.Call[0]).length < 1) {
        const error = {
            status: 400,
            body: models,
        };
        console.log("UNSATISFIABLE MODEL: ", models);
        return error;
    }
    if (models.Call.length > 1) {
        const error = {
            status: 500,
            body: {
                function: "sortModels",
                reason: "Could not sort models because multiple calls were detected",
            },
        };
        return error;
    }
    models.Call[0].Witnesses.map((model) => {
        model.Value.sort((a, b) => a.split(",")[2].localeCompare(b.split(",")[2], "en", { numeric: true }));
    });
    const success = {
        status: 200,
        body: models,
    };
    return success;
};
exports.sortModels = sortModels;
const parseModel = (model) => {
    const parsedModel = model.split(")");
    parsedModel.filter((el) => el);
    const resList = [];
    parsedModel.forEach((el) => {
        let res = el.trim();
        if (res.slice(-1) !== ")") {
            res += ")";
        }
        resList.push(res);
    });
    return resList;
};
exports.parseModel = parseModel;
const generateAspString = ({ taxonomy, procedure, }) => {
    const [aspActions, actionsError] = generateAspActions(procedure);
    const [aspTaxonomy, taxonomyError] = generateAspTaxonomy(taxonomy);
    console.log("taxonomyError", taxonomyError);
    console.log("actionsError", actionsError);
    if (actionsError || taxonomyError) {
        const error = {
            status: 400,
            body: (actionsError ? actionsError : taxonomyError),
        };
        return [null, error];
    }
    const aspString = `${aspActions}\n\n${aspTaxonomy}`;
    fs_1.default.writeFile("src/asp/actions.lp", aspString, (err) => {
        if (err)
            throw err;
        console.log("Model saved to actions.lp");
    });
    return [aspString, null];
};
exports.generateAspString = generateAspString;
const generateAspActions = (procedure) => {
    let aspActions = "";
    let aspPrecendence = "";
    for (const el of procedure) {
        if (el.role === "") {
            delete el.role;
        }
        if (Object.values(el).some((val) => val === "")) {
            const error = {
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
            aspActions += aspFunctions_1.collaborative(abbreviation);
            const [superClassName, superClassSection] = aspFunctions_1.generateSuperClassSection(agents, aspActions); // Generate a single class out of all the possible agents
            aspActions += superClassSection;
            if (role) {
                // TODO:Backend does not support multiple roles for a single task
                aspActions += aspFunctions_1.responsible(abbreviation, role, superClassName);
            }
            else {
                aspActions += aspFunctions_1.delegate(abbreviation, el.quantity, superClassName);
            }
        }
        else {
            aspActions += aspFunctions_1.primitive(abbreviation);
            if (role) {
                // TODO:Backend does not support multiple roles for a single task
                aspActions += aspFunctions_1.responsible(abbreviation, role, el.agent);
            }
            else {
                aspActions += aspFunctions_1.delegate(abbreviation, el.quantity, el.agent);
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
const generateAspTaxonomy = (taxonomy) => {
    let aspTaxonomy = "";
    const parents = [];
    for (const el of taxonomy) {
        if (el.role === "") {
            delete el.role;
        }
        if (Object.values(el).some((val) => val === "")) {
            const error = {
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
            aspTaxonomy += aspFunctions_1.isSubClass(el.agent, "agent");
            parents[el.id] = el.agent;
        }
        else {
            aspTaxonomy += aspFunctions_1.isA(el.agent, parents[el.parentId]);
        }
        if (el.hasOwnProperty("role") && el.role !== "") {
            aspTaxonomy += aspFunctions_1.property(el.agent, el.role);
            aspTaxonomy += aspFunctions_1.isA(el.agent, el.role);
        }
    }
    return [aspTaxonomy, null];
};
//# sourceMappingURL=utils.js.map