import { State } from "../types";

const initialState: State = {
  dialog: {
    show: false,
    title: "",
    label: "",
  },
  showSidebar: false,
  showProcedures: false,
  sunburstData: [],
  procedures: {
    "EA fire": [
      {
        action: "Attack engine crew turn-out",
        agents: "ae_crew",
        quantity: 1,
        abbreviation: "a",
        precedence: "None",
      },
      {
        action: "Second attack engine crew turn-out",
        agents: "se_crew",
        quantity: 1,
        abbreviation: "b",
        precedence: "None",
      },
      {
        action: "Ladder department turn-out",
        agents: "lt_crew",
        quantity: 1,
        abbreviation: "c",
        precedence: "None",
      },
      {
        action: "Travel of attack engine crew to 911 address",
        agents: "ae_crew",
        quantity: 1,
        abbreviation: "d",
        precedence: "a",
      },
      {
        action: "Travel of second engine crew to 911 address",
        agents: "se_crew",
        quantity: 1,
        abbreviation: "e",
        precedence: "b",
      },
      {
        action: "Travel of ladder tower crew to 911 address",
        agents: "lt_crew",
        quantity: 1,
        abbreviation: "f",
        precedence: "c",
      },
      {
        action: "Attack engine crew advance 1.75 inch hose to seat of fire",
        agents: "ae_crew",
        quantity: 1,
        abbreviation: "g",
        precedence: "d",
      },
      {
        action: "Attack engine driver prepare to pump water",
        agents: "ae_crew",
        quantity: 1,
        abbreviation: "h",
        precedence: "g",
      },
      {
        action: "Attack fire with tank water aboard attack engine",
        agents: "ae_crew",
        quantity: 1,
        abbreviation: "i",
        precedence: "h",
      },
      {
        action: "Second engine crew member prepare nearest hydrant for hook-up",
        agents: "se_crew",
        quantity: 1,
        abbreviation: "j",
        precedence: "e",
      },
      {
        action:
          "Second engine drop 5 inch hose between attack engine and nearest hydrant",
        agents: "se_crew",
        quantity: 1,
        abbreviation: "k",
        precedence: "e",
      },
      {
        action:
          "Second engine hook to hydrant and attack engine and prepare to pump water",
        agents: "se_crew",
        quantity: 1,
        abbreviation: "l",
        precedence: "k",
      },
      {
        action: "Attack fire with hydrant water",
        agents: "se_crew",
        quantity: 1,
        abbreviation: "m",
        precedence: "l",
      },
      {
        action: "Set up ladder tower",
        agents: "lt_crew",
        quantity: 1,
        abbreviation: "n",
        precedence: "f",
      },
    ],
    "Car fires": [
      {
        action: "Operation central receives fire alert",
        agents: "ae_crew",
        quantity: 1,
        abbreviation: "1",
        precedence: "0",
      },
      {
        action: "Operation central gathers location information",
        agents: "ae_crew",
        quantity: 1,
        abbreviation: "2",
        precedence: "1",
      },
      {
        action: "Operation central alerts fire department",
        agents: "ae_crew, se_crew",
        quantity: 1,
        abbreviation: "3",
        precedence: "1",
      },
      {
        action: "Fire department move to scene",
        agents: "se_crew",
        quantity: 2,
        abbreviation: "4",
        precedence: "2",
      },
      {
        action:
          "Operation central requests police resources to redirect traffic",
        agents: "ae_crew, lt_crew",
        quantity: 1,
        abbreviation: "5",
        precedence: "2",
      },
      {
        action:
          "Operation central requests ambulance resources to take care of wounded",
        agents: "ae_crew, lt_crew",
        quantity: 1,
        abbreviation: "6",
        precedence: "2",
      },
    ],
    "Mulch/Compost fires": [
      {
        action: "Operation central receives fire alert",
        agents: "ae_crew",
        quantity: 1,
        abbreviation: "1",
        precedence: "0",
      },
      {
        action: "Operation central alerts fire department",
        agents: "ae_crew, se_crew",
        quantity: 1,
        abbreviation: "3",
        precedence: "1",
      },
      {
        action: "Fire department move to scene",
        agents: "se_crew",
        quantity: 1,
        abbreviation: "4",
        precedence: "2",
      },
    ],
    "Aircraft emergencies": [
      {
        action: "Operation central receives aircraft indicent alert",
        agents: "ae_crew",
        quantity: 1,
        abbreviation: "1",
        precedence: "0",
      },
      {
        action: "Operation central gathers technical aircraft information",
        agents: "ae_crew",
        quantity: 1,
        abbreviation: "2",
        precedence: "1",
      },
      {
        action: "Operation central alerts fire department",
        agents: "ae_crew, se_crew",
        quantity: 1,
        abbreviation: "3",
        precedence: "1",
      },
      {
        action: "Fire department move to scene",
        agents: "se_crew",
        quantity: 1,
        abbreviation: "4",
        precedence: "2",
      },
      {
        action: "Operation central requests additional firefighting resources",
        agents: "ae_crew, lt_crew",
        quantity: 1,
        abbreviation: "5",
        precedence: "2",
      },
    ],
    "Brush and Wildland fires": [
      {
        action: "Operation central receives fire alert",
        agents: "ae_crew",
        quantity: 1,
        abbreviation: "1",
        precedence: "0",
      },
      {
        action: "Operation central gathers geographical information",
        agents: "ae_crew",
        quantity: 1,
        abbreviation: "2",
        precedence: "1",
      },
      {
        action: "Operation central alerts fire department",
        agents: "ae_crew, se_crew",
        quantity: 1,
        abbreviation: "3",
        precedence: "1",
      },
      {
        action: "Fire department move to scene",
        agents: "se_crew",
        quantity: 1,
        abbreviation: "4",
        precedence: "2",
      },
      {
        action:
          "Operation central requests air resources to survey the scope of damage",
        agents: "ae_crew, lt_crew",
        quantity: 1,
        abbreviation: "4",
        precedence: "2",
      },
      {
        action: "Operation central requests additional firefighting resources",
        agents: "ae_crew, lt_crew",
        quantity: 1,
        abbreviation: "5",
        precedence: "2",
      },
    ],
  },
  taxonomies: {
    "Land fire incidents": [],
    "Offshore incidents": [],
    "Terror incidents": [],
  },
  tableData: {
    type: "procedures",
    key: "EA fire",
    data: [
      {
        action: "Attack engine crew turn-out",
        agents: "ae_crew",
        quantity: 1,
        abbreviation: "a",
        precedence: "None",
      },
      {
        action: "Second attack engine crew turn-out",
        agents: "se_crew",
        quantity: 1,
        abbreviation: "b",
        precedence: "None",
      },
      {
        action: "Ladder department turn-out",
        agents: "lt_crew",
        quantity: 2,
        abbreviation: "c",
        precedence: "None",
      },
      {
        action: "Travel of attack engine crew to 911 address",
        agents: "ae_crew",
        quantity: 2,
        abbreviation: "d",
        precedence: "a",
      },
      {
        action: "Travel of second engine crew to 911 address",
        agents: "se_crew",
        quantity: 2,
        abbreviation: "e",
        precedence: "b",
      },
      {
        action: "Travel of ladder tower crew to 911 address",
        agents: "lt_crew",
        quantity: 2,
        abbreviation: "f",
        precedence: "c",
      },
      {
        action: "Attack engine crew advance 1.75 inch hose to seat of fire",
        agents: "ae_crew",
        quantity: 2,
        abbreviation: "g",
        precedence: "d",
      },
      {
        action: "Attack engine driver prepare to pump water",
        agents: "ae_crew",
        quantity: 2,
        abbreviation: "h",
        precedence: "g",
      },
      {
        action: "Attack fire with tank water aboard attack engine",
        agents: "ae_crew",
        quantity: 2,
        abbreviation: "i",
        precedence: "h",
      },
      {
        action: "Second engine crew member prepare nearest hydrant for hook-up",
        agents: "se_crew",
        quantity: 2,
        abbreviation: "j",
        precedence: "e",
      },
      {
        action:
          "Second engine drop 5 inch hose between attack engine and nearest hydrant",
        agents: "se_crew",
        quantity: 2,
        abbreviation: "k",
        precedence: "e",
      },
      {
        action:
          "Second engine hook to hydrant and attack engine and prepare to pump water",
        agents: "se_crew",
        quantity: 2,
        abbreviation: "l",
        precedence: "k",
      },
      {
        action: "Attack fire with hydrant water",
        agents: "se_crew",
        quantity: 2,
        abbreviation: "m",
        precedence: "l",
      },
      {
        action: "Set up ladder tower",
        agents: "lt_crew",
        quantity: 2,
        abbreviation: "n",
        precedence: "f",
      },
    ],
  },
};

export default initialState;
