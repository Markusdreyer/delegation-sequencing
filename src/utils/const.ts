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
      lookup: {},
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
      lookup: {},
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
