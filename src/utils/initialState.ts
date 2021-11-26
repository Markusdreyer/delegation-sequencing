import { RootState } from "../types";

const initialState: RootState = {
  previousModel: [],
  activeTaxonomy: "Land fire incidents",
  dialog: {
    show: false,
    title: "",
    label: "",
  },
  showSidebar: false,
  showProcedures: false,
  sunburstData: [],
  tableMetaData: {
    type: "procedures",
    key: "EA fire",
  },
};

export default initialState;
