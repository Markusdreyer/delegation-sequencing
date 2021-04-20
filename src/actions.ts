export const setCurrentProcedure = (procedure: string) => {
  return {
    type: "SET_CURRENT_PROCEDURE",
    payload: procedure,
  };
};

export const setTableData = (procedure: string, data: any) => {
  return {
    type: "SET_TABLE_DATA",
    payload: {
      procedure,
      data,
    },
  };
};

export const addProcedure = (procedure: any) => {
  return {
    type: "ADD_PROCEDURE",
    payload: procedure,
  };
};

export const deleteProcedure = (procedure: any) => {
  return {
    type: "DELETE_PROCEDURE",
    payload: procedure,
  };
};

export const updateProcedure = (procedure: any) => {
  return {
    type: "UPDATE_PROCEDURE",
    payload: procedure,
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
