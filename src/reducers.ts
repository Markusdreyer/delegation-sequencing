import { combineReducers } from "redux";
import initialState from "./utils/initialState";

const activeTaxonomyReducer = (
  state = initialState.activeTaxonomy,
  action: any
) => {
  switch (action.type) {
    case "SET_ACTIVE_TAXONOMY":
      return action.payload.activeTaxonomy;
    default:
      return state;
  }
};

const tableReducer = (state = initialState.tableMetaData, action: any) => {
  switch (action.type) {
    case "RENDER_TABLE":
      return {
        type: action.payload.type,
        key: action.payload.key,
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
        title: action.payload.options?.title,
        label: action.payload.options?.label,
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

const previousModelReducer = (
  state = initialState.previousModel,
  action: any
) => {
  switch (action.type) {
    case "SET_PREVIOUS_MODEL":
      return action.payload.previousModel;
    default:
      return state;
  }
};

const allReducers = combineReducers({
  showSidebar: showSidebarReducer,
  showProcedures: showProceduresReducer,
  dialog: dialogReducer,
  tableMetaData: tableReducer,
  activeTaxonomy: activeTaxonomyReducer,
  previousModel: previousModelReducer,
});

export default allReducers;
