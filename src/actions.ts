export const increment = (number: number) => {
  return {
    type: "INCREMENT",
    payload: number,
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
