import { ProcedureData } from "./types";

export const renderTable = (type: string, key: string) => {
  return {
    type: "RENDER_TABLE",
    payload: {
      type,
      key,
    },
  };
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
