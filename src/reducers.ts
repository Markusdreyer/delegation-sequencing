import { combineReducers } from "redux";
import { ProcedureData, TaxonomyData } from "./types";
import { createReducer } from "@reduxjs/toolkit";
import initialState from "./utils/initialState";

const tableReducer = (state = initialState.tableData, action: any) => {
  switch (action.type) {
    case "RENDER_TABLE":
      return {
        type: action.payload.type,
        key: action.payload.key,
        data: action.payload.data,
      };
    default:
      return state;
  }
};

const proceduresReducer = (state = initialState.procedures, action: any) => {
  switch (action.type) {
    case "SET_PROCEDURE":
      return {
        ...state,
        [action.payload.key]: [...action.payload.procedure],
      };
    default:
      return state;
  }
};

const showSidebarReducer = (state: boolean = false, action: any) => {
  switch (action.type) {
    case "TOGGLE_SIDEBAR":
      return !state;
    default:
      return state;
  }
};

const dialogReducer = (state = initialState.dialog, action: any) => {
  switch (action.type) {
    case "TOGGLE_DIALOG":
      return {
        show: !state.show,
        title: action.payload.title,
        label: action.payload.label,
      };
    default:
      return state;
  }
};

const showProceduresReducer = (state: boolean = false, action: any) => {
  switch (action.type) {
    case "TOGGLE_PROCEDURES":
      return !state;
    default:
      return state;
  }
};

const allReducers = combineReducers({
  showSidebar: showSidebarReducer,
  showProcedures: showProceduresReducer,
  dialog: dialogReducer,
  procedures: proceduresReducer,
  tableData: tableReducer,
});

export default allReducers;
