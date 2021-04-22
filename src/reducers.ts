import { combineReducers } from "redux";
import initialState from "./utils/initialState";

const proceduresReducer = (state = initialState.procedures, action: any) => {
  switch (action.type) {
    case "SET_PROCEDURE":
      return {
        ...state,
        [action.key]: [...action.procedure],
      };
    default:
      return state;
  }
};

const tableDataReducer = (state: any = initialState.tableData, action: any) => {
  switch (action.type) {
    case "SET_EXISTING_TABLE_DATA":
      console.log("TYPE: ", action.payload.type);
      console.log("KEY: ", action.payload.key);
      console.log("state: ", state);
      const contents = state[action.payload.type][action.payload.key];
      return {
        ...state,
        type: action.payload.type,
        key: action.payload.key,
        contents: contents,
      };
    case "SET_NEW_TABLE_DATA":
      return {
        type: action.payload.type,
        key: action.payload.key,
        contents: action.payload.data,
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
  tableData: tableDataReducer,
});

export default allReducers;
