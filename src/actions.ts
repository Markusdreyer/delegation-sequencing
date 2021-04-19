export const setCurrentProcedure = (currentProcedure: any) => {
  return {
    type: "SET_CURRENT_PROCEDURE",
    payload: currentProcedure,
  };
};

export const addTableData = (tableData: any) => {
  return {
    type: "ADD_TABLE_DATA",
    payload: tableData,
  };
};

export const deleteTableData = (tableData: any) => {
  return {
    type: "DELETE_TABLE_DATA",
    payload: tableData,
  };
};

export const updateTableData = (tableData: any) => {
  return {
    type: "UPDATE_TABLE_DATA",
    payload: tableData,
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

export const toggleDialog = () => {
  return {
    type: "TOGGLE_DIALOG",
  };
};

export const toggleProcedures = () => {
  return {
    type: "TOGGLE_PROCEDURES",
  };
};
