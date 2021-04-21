import { combineReducers } from "redux";
import initialState from "./utils/initialState";

const proceduresReducer = (state = initialState.procedures, action: any) => {
  switch (action.type) {
    case "ADD_PROCEDURE":
      return [...state, action.payload];
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
    case "SET_TABLE_DATA":
      return {
        ...state,
        [action.payload.procedure]: [...action.payload.data],
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
  currentProcedure: currentProcedureReducer,
  tableData: tableDataReducer,
});

export default allReducers;
