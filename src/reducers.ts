import { combineReducers } from "redux";
import initialState from "./utils/initialState";

const proceduresReducer = (state = initialState.procedures, action: any) => {
  switch (action.type) {
    case "ADD_PROCEDURE":
      return {
        ...state,
        procedures: [...state, action.payload],
      };
    case "DELETE_PROCEDURE": //NOT IMPLEMENTED
      return {
        ...state,
        procedures: [...state, action.payload],
      };
    case "UPDATE_PROCEDURE": //NOT IMPLEMENTED
      return {
        ...state,
        procedures: [...state, action.payload],
      };
    default:
      return state;
  }
};

const currentProcedureReducer = (
  state: string = initialState.procedures[0],
  action: any
) => {
  switch (action.type) {
    case "SET_CURRENT_PROCEDURE":
      return action.payload;
    default:
      return state;
  }
};

const tableDataReducer = (state: any = initialState.tableData, action: any) => {
  switch (action.type) {
    case "ADD_PROCEDURE":
      return action.payload;
    case "DELETE_PROCEDURE": //NOT IMPLEMENTED
      return {
        ...state,
        tableData: [...state, action.payload],
      };
    case "UPDATE_PROCEDURE": //NOT IMPLEMENTED
      return {
        ...state,
        tableData: [...state, action.payload],
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

const showDialogReducer = (state: boolean = false, action: any) => {
  switch (action.type) {
    case "TOGGLE_DIALOG":
      return !state;
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
  showDialog: showDialogReducer,
  showProcedures: showProceduresReducer,
  procedures: proceduresReducer,
  currentProcedure: currentProcedureReducer,
  tableData: tableDataReducer,
});

export default allReducers;
