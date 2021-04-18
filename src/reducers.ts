import { combineReducers } from "redux";

const initialState = {
  procedures: [
    "EA fire",
    "Car fires",
    "Mulch/Compost fires",
    "Aircraft emergencies",
    "Brush and Wildland fires",
  ],
};

const loggedReducer = (state = false, action: any) => {
  switch (action.type) {
    case "SIGN_IN":
      return !state;
    default:
      return state;
  }
};

const toggleSidebar = (state: boolean = false, action: any) => {
  switch (action.type) {
    case "TOGGLE_SIDEBAR":
      return !state;
    default:
      return state;
  }
};

const toggleDialog = (state: boolean = false, action: any) => {
  switch (action.type) {
    case "TOGGLE_DIALOG":
      return !state;
    default:
      return state;
  }
};

const counterReducer = (state = 0, action: any) => {
  switch (action.type) {
    case "INCREMENT":
      return state + 1;
    case "DECREMENT":
      return state - 1;
    default:
      return state;
  }
};

const allReducers = combineReducers({
  sidebar: toggleSidebar,
  dialog: toggleDialog,
});

export default allReducers;
