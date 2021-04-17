import { SunburstData, TableData } from "../types";

export const tableMockData: any = {
  "Car fires": [
    {
      action: "Operation central receives fire alert",
      agents: "ae_crew",
      quantity: "1",
      abbreviation: "1",
      precedence: "0",
    },
    {
      action: "Operation central gathers location information",
      agents: "ae_crew",
      quantity: "1",
      abbreviation: "2",
      precedence: "1",
    },
    {
      action: "Operation central alerts fire department",
      agents: "ae_crew, se_crew",
      quantity: "1",
      abbreviation: "3",
      precedence: "1",
    },
    {
      action: "Fire department move to scene",
      agents: "se_crew",
      quantity: "2",
      abbreviation: "4",
      precedence: "2",
    },
    {
      action: "Operation central requests police resources to redirect traffic",
      agents: "ae_crew, lt_crew",
      quantity: "1",
      abbreviation: "4",
      precedence: "2",
    },
    {
      action:
        "Operation central requests ambulance resources to take care of wounded",
      agents: "ae_crew, lt_crew",
      quantity: "1",
      abbreviation: "5",
      precedence: "2",
    },
  ],
  "Mulch/Compost fires": [
    {
      action: "Operation central receives fire alert",
      agents: "ae_crew",
      quantity: "1",
      abbreviation: "1",
      precedence: "0",
    },
    {
      action: "Operation central alerts fire department",
      agents: "ae_crew, se_crew",
      quantity: "1",
      abbreviation: "3",
      precedence: "1",
    },
    {
      action: "Fire department move to scene",
      agents: "se_crew",
      quantity: "1",
      abbreviation: "4",
      precedence: "2",
    },
  ],
  "Aircraft emergencies": [
    {
      action: "Operation central receives aircraft indicent alert",
      agents: "ae_crew",
      quantity: "1",
      abbreviation: "1",
      precedence: "0",
    },
    {
      action: "Operation central gathers technical aircraft information",
      agents: "ae_crew",
      quantity: "1",
      abbreviation: "2",
      precedence: "1",
    },
    {
      action: "Operation central alerts fire department",
      agents: "ae_crew, se_crew",
      quantity: "1",
      abbreviation: "3",
      precedence: "1",
    },
    {
      action: "Fire department move to scene",
      agents: "se_crew",
      quantity: "1",
      abbreviation: "4",
      precedence: "2",
    },
    {
      action: "Operation central requests additional firefighting resources",
      agents: "ae_crew, lt_crew",
      quantity: "1",
      abbreviation: "5",
      precedence: "2",
    },
  ],
  "Brush and Wildland fires": [
    {
      action: "Operation central receives fire alert",
      agents: "ae_crew",
      abbreviation: "1",
      precedence: "0",
    },
    {
      action: "Operation central gathers geographical information",
      agents: "ae_crew",
      abbreviation: "2",
      precedence: "1",
    },
    {
      action: "Operation central alerts fire department",
      agents: "ae_crew, se_crew",
      abbreviation: "3",
      precedence: "1",
    },
    {
      action: "Fire department move to scene",
      agents: "se_crew",
      abbreviation: "4",
      precedence: "2",
    },
    {
      action:
        "Operation central requests air resources to survey the scope of damage",
      agents: "ae_crew, lt_crew",
      abbreviation: "4",
      precedence: "2",
    },
    {
      action: "Operation central requests additional firefighting resources",
      agents: "ae_crew, lt_crew",
      abbreviation: "5",
      precedence: "2",
    },
  ],
};

export const sunburstMockData: SunburstData[] = [
  {
    id: "0.0",
    parent: "",
    name: "Title of action",
    value: 100,
  },
  {
    id: "1.0",
    parent: "0.0",
    name: "expedite(1, john, 2)",
    value: 75,
  },
  {
    id: "1.1",
    parent: "0.0",
    name: "expedite(1, john, 1)",
    value: 25,
  },
  {
    id: "2.0",
    parent: "1.0",
    name: "expedite(0, barry, 1)",
    value: 75,
  },
];

export const sunburstMockDataPH: SunburstData[] = [
  {
    id: "0.0",
    parent: "",
    name: "Incident call is received",
    value: 100,
  },
  {
    id: "1.1",
    parent: "0.0",
    name: "ae_crew answer call",
    value: 50,
  },
  {
    id: "1.2",
    parent: "0.0",
    name: "ae_crew wait answering call",
    value: 50,
  },
  {
    id: "2.1",
    parent: "1.1",
    name: "ae_crew alert fire dept",
    value: 25,
  },
  {
    id: "2.2",
    parent: "1.1",
    name: "ae_crew alert fire dept",
    value: 25,
  },
  {
    id: "2.3",
    parent: "1.2",
    name: "ae_crew don't alert fire dept",
    value: 50,
  },
  {
    id: "3.1",
    parent: "2.3",
    name: "ae_crew don't alert fire dept",
    value: 25,
  },
  {
    id: "3.2",
    parent: "2.3",
    name: "ae_crew alert fire dept",
    value: 25,
  },
];
