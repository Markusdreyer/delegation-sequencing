import { ColumnDef, ProcedureData, TaxonomyData } from "../types";

export const tableTypes = {
  PROCEDURES: "procedures",
  TAXONOMIES: "taxonomies",
};

export const modelTypes = {
  SUNBURST: "sunburst",
  ACTION_CARDS: "action-cards",
};

export const dialogOptions = {
  PROCEDURE: {
    label: "Create new procedure",
    title: "Name of procedure",
  },
  TAXONOMY: {
    label: "Create new taxonomy",
    title: "Name of taxonomy",
  },
};

export enum ExpanderOptions {
  EXPAND,
  COLLAPSE,
}

export const initialLookup: Record<string, any> = {
  Hamar: {
    None: "None",
    "1st Attack Engine Crew": "1st Attack Engine Crew",
    "2nd Attack Engine Crew": "2nd Attack Engine Crew",
    "Patrol Vehicle": "Patrol Vehicle",
    "1st Ambulance": "1st Ambulance",
    "2nd Ambulance": "2nd Ambulance",
  },
  "Land fire incidents": {
    None: "None",
    ae_crew: "ae_crew",
    se_crew: "ae_crew",
    lt_crew: "ae_crew",
  },
};

export const tableColumns: Record<string, ColumnDef[]> = {
  procedures: [
    { title: "Action", field: "action" },
    {
      title: "Role",
      field: "role",
    },
    {
      title: "Agent",
      field: "agent",
      lookup: {
        ae_crew: "ae_crew",
        se_crew: "se_crew",
        lt_crew: "lt_crew",
      },
    },
    {
      title: "Quantity",
      field: "quantity",
      type: "numeric",
    },
    {
      title: "Abbreviation",
      field: "abbreviation",
    },

    {
      title: "Precedence",
      field: "precedence",
      lookup: {
        None: "None",
        a: "a",
        b: "b",
        c: "c",
        d: "d",
        e: "e",
        f: "f",
        g: "g",
        h: "h",
        i: "i",
        j: "j",
        k: "k",
        l: "l",
        m: "m",
        n: "n",
      },
    },
  ],
  taxonomies: [
    {
      title: "Agent",
      field: "agent",
    },
    {
      title: "Role",
      field: "role",
    },
    {
      title: "Parent",
      field: "parent",
    },
  ],
};
