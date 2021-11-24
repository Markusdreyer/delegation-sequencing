import { ProcedureData, TaxonomyData } from "./types";

export const setActiveTaxonomy = (activeTaxonomy: string) => {
  return {
    type: "SET_ACTIVE_TAXONOMY",
    payload: {
      activeTaxonomy,
    },
  };
};

export const renderTable = (
  type: string,
  key: string,
  data: ProcedureData[] | TaxonomyData[]
) => {
  return {
    type: "RENDER_TABLE",
    payload: {
      type,
      key,
      data,
    },
  };
};

export const setProcedure = (key: string, procedure: ProcedureData[]) => {
  return {
    type: "SET_PROCEDURE",
    payload: {
      key,
      procedure,
    },
  };
};

export const setTaxonomy = (key: string, taxonomy: TaxonomyData[]) => {
  return {
    type: "SET_TAXONOMY",
    payload: {
      key,
      taxonomy,
    },
  };
};

export const toggleSidebar = () => {
  return {
    type: "TOGGLE_SIDEBAR",
  };
};

export const toggleDialog = (options?: { title: string; label: string }) => {
  return {
    type: "TOGGLE_DIALOG",
    payload: {
      options,
    },
  };
};

export const toggleProcedures = () => {
  return {
    type: "TOGGLE_PROCEDURES",
  };
};

export const setPreviousModel = (model: string[]) => {
  return {
    type: "SET_PREVIOUS_MODEL",
    payload: {
      previousModel: model,
    },
  };
};
