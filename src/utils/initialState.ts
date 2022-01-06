import { RootState } from "../types";

const initialState: RootState = {
  previousModel: [],
  activeTaxonomy: "East aurora",
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
  acceptedActions: [],
  revisionOptions: { key: "", agents: [] },
};

export default initialState;
