import { ProcedureData, TableData, TaxonomyData } from "./types";

export const setTableData = (
  type: string,
  key: string,
  data?: TableData[] | TaxonomyData[]
) => {
  if (!data) {
    return {
      type: "SET_EXISTING_TABLE_DATA",
      payload: {
        type,
        key,
      },
    };
  } else {
    return {
      type: "SET_NEW_TABLE_DATA",
      payload: {
        type,
        key,
        data,
      },
    };
  }
};

export const setProcedure = (key: string, procedure?: ProcedureData[]) => {
  return {
    type: "SET_PROCEDURE",
    payload: {
      key,
      procedure,
    },
  };
};

export const toggleSidebar = () => {
  return {
    type: "TOGGLE_SIDEBAR",
  };
};

export const toggleDialog = (show: boolean, title?: string, label?: string) => {
  return {
    type: "TOGGLE_DIALOG",
    payload: {
      show,
      title,
      label,
    },
  };
};

export const toggleProcedures = () => {
  return {
    type: "TOGGLE_PROCEDURES",
  };
};
