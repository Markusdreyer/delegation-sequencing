import { RootState } from "../types";

const initialState: RootState = {
  activeTaxonomy: "Land fire incidents",
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
        id: 1,
        action: "Attack engine crew turn-out",
        agents: "ae_crew",
        quantity: 1,
        abbreviation: "a",
        precedence: "None",
      },
      {
        id: 1,
        action: "Second attack engine crew turn-out",
        agents: "se_crew",
        quantity: 1,
        abbreviation: "b",
        precedence: "None",
      },
      {
        id: 1,
        action: "Ladder department turn-out",
        agents: "lt_crew",
        quantity: 1,
        abbreviation: "c",
        precedence: "None",
      },
      {
        id: 1,
        action: "Travel of attack engine crew to 911 address",
        agents: "ae_crew",
        quantity: 1,
        abbreviation: "d",
        precedence: "a",
      },
      {
        id: 1,
        action: "Travel of second engine crew to 911 address",
        agents: "se_crew",
        quantity: 1,
        abbreviation: "e",
        precedence: "b",
      },
      {
        id: 1,
        action: "Travel of ladder tower crew to 911 address",
        agents: "lt_crew",
        quantity: 1,
        abbreviation: "f",
        precedence: "c",
      },
      {
        id: 1,
        action: "Attack engine crew advance 1.75 inch hose to seat of fire",
        agents: "ae_crew",
        quantity: 1,
        abbreviation: "g",
        precedence: "d",
      },
      {
        id: 1,
        action: "Attack engine driver prepare to pump water",
        agents: "ae_crew",
        quantity: 1,
        abbreviation: "h",
        precedence: "g",
      },
      {
        id: 1,
        action: "Attack fire with tank water aboard attack engine",
        agents: "ae_crew",
        quantity: 1,
        abbreviation: "i",
        precedence: "h",
      },
      {
        id: 1,
        action: "Second engine crew member prepare nearest hydrant for hook-up",
        agents: "se_crew",
        quantity: 1,
        abbreviation: "j",
        precedence: "e",
      },
      {
        id: 1,
        action:
          "Second engine drop 5 inch hose between attack engine and nearest hydrant",
        agents: "se_crew",
        quantity: 1,
        abbreviation: "k",
        precedence: "e",
      },
      {
        id: 1,
        action:
          "Second engine hook to hydrant and attack engine and prepare to pump water",
        agents: "se_crew",
        quantity: 1,
        abbreviation: "l",
        precedence: "k",
      },
      {
        id: 1,
        action: "Attack fire with hydrant water",
        agents: "se_crew",
        quantity: 1,
        abbreviation: "m",
        precedence: "l",
      },
      {
        id: 1,
        action: "Set up ladder tower",
        agents: "lt_crew",
        quantity: 1,
        abbreviation: "n",
        precedence: "f",
      },
    ],
    "Car fires": [
      {
        id: 1,
        action: "Operation central receives fire alert",
        agents: "ae_crew",
        quantity: 1,
        abbreviation: "1",
        precedence: "0",
      },
      {
        id: 1,
        action: "Operation central gathers location information",
        agents: "ae_crew",
        quantity: 1,
        abbreviation: "2",
        precedence: "1",
      },
      {
        id: 1,
        action: "Operation central alerts fire department",
        agents: "ae_crew, se_crew",
        quantity: 1,
        abbreviation: "3",
        precedence: "1",
      },
      {
        id: 1,
        action: "Fire department move to scene",
        agents: "se_crew",
        quantity: 2,
        abbreviation: "4",
        precedence: "2",
      },
      {
        id: 1,
        action:
          "Operation central requests police resources to redirect traffic",
        agents: "ae_crew, lt_crew",
        quantity: 1,
        abbreviation: "5",
        precedence: "2",
      },
      {
        id: 1,
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
        id: 1,
        action: "Operation central receives fire alert",
        agents: "ae_crew",
        quantity: 1,
        abbreviation: "1",
        precedence: "0",
      },
      {
        id: 1,
        action: "Operation central alerts fire department",
        agents: "ae_crew, se_crew",
        quantity: 1,
        abbreviation: "3",
        precedence: "1",
      },
      {
        id: 1,
        action: "Fire department move to scene",
        agents: "se_crew",
        quantity: 1,
        abbreviation: "4",
        precedence: "2",
      },
    ],
    "Aircraft emergencies": [
      {
        id: 1,
        action: "Operation central receives aircraft indicent alert",
        agents: "ae_crew",
        quantity: 1,
        abbreviation: "1",
        precedence: "0",
      },
      {
        id: 1,
        action: "Operation central gathers technical aircraft information",
        agents: "ae_crew",
        quantity: 1,
        abbreviation: "2",
        precedence: "1",
      },
      {
        id: 1,
        action: "Operation central alerts fire department",
        agents: "ae_crew, se_crew",
        quantity: 1,
        abbreviation: "3",
        precedence: "1",
      },
      {
        id: 1,
        action: "Fire department move to scene",
        agents: "se_crew",
        quantity: 1,
        abbreviation: "4",
        precedence: "2",
      },
      {
        id: 1,
        action: "Operation central requests additional firefighting resources",
        agents: "ae_crew, lt_crew",
        quantity: 1,
        abbreviation: "5",
        precedence: "2",
      },
    ],
    "Brush and Wildland fires": [
      {
        id: 1,
        action: "Operation central receives fire alert",
        agents: "ae_crew",
        quantity: 1,
        abbreviation: "1",
        precedence: "0",
      },
      {
        id: 1,
        action: "Operation central gathers geographical information",
        agents: "ae_crew",
        quantity: 1,
        abbreviation: "2",
        precedence: "1",
      },
      {
        id: 1,
        action: "Operation central alerts fire department",
        agents: "ae_crew, se_crew",
        quantity: 1,
        abbreviation: "3",
        precedence: "1",
      },
      {
        id: 1,
        action: "Fire department move to scene",
        agents: "se_crew",
        quantity: 1,
        abbreviation: "4",
        precedence: "2",
      },
      {
        id: 1,
        action:
          "Operation central requests air resources to survey the scope of damage",
        agents: "ae_crew, lt_crew",
        quantity: 1,
        abbreviation: "4",
        precedence: "2",
      },
      {
        id: 1,
        action: "Operation central requests additional firefighting resources",
        agents: "ae_crew, lt_crew",
        quantity: 1,
        abbreviation: "5",
        precedence: "2",
      },
    ],
  },
  taxonomies: {
    Cooking: [
      {
        agent: "Chefs",
        parent: "None",
        id: 1,
        role: "N/A",
      },
      {
        agent: "Eivind Hellstrøm",
        role: "Cook",
        parent: "Chefs",
        parentId: 1,
        id: 2,
      },
    ],
    "Land fire incidents": [
      {
        id: 1,
        agent: "ae_crew",
        parent: "None",
      },
      {
        id: 2,
        parentId: 1,
        agent: "barry",
        parent: "ae_crew",
        role: "driver",
      },
      {
        id: 3,
        parentId: 1,
        agent: "john",
        parent: "ae_crew",
      },
      {
        id: 4,
        parentId: 1,
        agent: "frank",
        parent: "ae_crew",
      },
      {
        id: 5,
        agent: "se_crew",
        parent: "None",
      },
      {
        id: 6,
        parentId: 5,
        agent: "jan",
        parent: "se_crew",
      },
      {
        id: 7,
        parentId: 5,
        agent: "liz",
        parent: "se_crew",
      },
      {
        id: 7,
        parentId: 5,
        agent: "kathrin",
        parent: "se_crew",
      },
      {
        id: 9,
        agent: "lt_crew",
        parent: "None",
      },
      {
        id: 10,
        parentId: 9,
        agent: "xi",
        parent: "lt_crew",
      },
      {
        id: 11,
        parentId: 9,
        agent: "lin",
        parent: "lt_crew",
      },
      {
        id: 12,
        parentId: 9,
        agent: "dahn",
        parent: "lt_crew",
      },
    ],
    "Offshore incidents": [],
    "Terror incidents": [],
  },
  tableData: {
    type: "procedures",
    key: "EA fire",
    data: [
      {
        id: 1,
        action: "Attack engine crew turn-out",
        agents: "ae_crew",
        quantity: 1,
        abbreviation: "a",
        precedence: "None",
      },
      {
        id: 2,
        action: "Second attack engine crew turn-out",
        agents: "se_crew",
        quantity: 1,
        abbreviation: "b",
        precedence: "None",
        parentId: 1,
      },
      {
        id: 3,
        action: "Ladder department turn-out",
        agents: "lt_crew",
        quantity: 2,
        abbreviation: "c",
        precedence: "None",
      },
      {
        id: 4,
        action: "Travel of attack engine crew to 911 address",
        agents: "ae_crew",
        quantity: 2,
        abbreviation: "d",
        precedence: "a",
      },
      {
        id: 5,
        action: "Travel of second engine crew to 911 address",
        agents: "se_crew",
        quantity: 2,
        abbreviation: "e",
        precedence: "b",
      },
      {
        id: 6,
        action: "Travel of ladder tower crew to 911 address",
        agents: "lt_crew",
        quantity: 2,
        abbreviation: "f",
        precedence: "c",
      },
      {
        id: 7,
        action: "Attack engine crew advance 1.75 inch hose to seat of fire",
        agents: "ae_crew",
        quantity: 2,
        abbreviation: "g",
        precedence: "d",
      },
      {
        id: 8,
        action: "Attack engine driver prepare to pump water",
        agents: "ae_crew",
        quantity: 2,
        abbreviation: "h",
        precedence: "g",
      },
      {
        id: 9,
        action: "Attack fire with tank water aboard attack engine",
        agents: "ae_crew",
        quantity: 2,
        abbreviation: "i",
        precedence: "h",
      },
      {
        id: 10,
        action: "Second engine crew member prepare nearest hydrant for hook-up",
        agents: "se_crew",
        quantity: 2,
        abbreviation: "j",
        precedence: "e",
      },
      {
        id: 11,
        action:
          "Second engine drop 5 inch hose between attack engine and nearest hydrant",
        agents: "se_crew",
        quantity: 2,
        abbreviation: "k",
        precedence: "e",
      },
      {
        id: 12,
        action:
          "Second engine hook to hydrant and attack engine and prepare to pump water",
        agents: "se_crew",
        quantity: 2,
        abbreviation: "l",
        precedence: "k",
      },
      {
        id: 13,
        action: "Attack fire with hydrant water",
        agents: "se_crew",
        quantity: 2,
        abbreviation: "m",
        precedence: "l",
      },
      {
        id: 14,
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
