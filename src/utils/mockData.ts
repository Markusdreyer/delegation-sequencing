export const tableMockData = [
  {
    action: "Operation central receives fire alert",
    agents: "OPC",
    abbreviation: "1",
    precedence: 0,
  },
  {
    action: "Operation central gathers building information",
    agents: "OPC",
    abbreviation: 2,
    precedence: 1,
  },
  {
    action: "Operation central alerts fire department",
    agents: "OPC, F1",
    abbreviation: 3,
    precedence: 1,
  },
  {
    action: "Fire department move to scene",
    agents: "F1",
    abbreviation: 4,
    precedence: 2,
  },
  {
    action: "Operation central relays building information to fire chief",
    agents: "OPC",
    abbreviation: 4,
    precedence: 2,
  },
  {
    action: "Smoke dive team are briefed about the layout of the burning house",
    agents: "OPC",
    abbreviation: 5,
    precedence: 2,
  },
];

export const sunburstMockData = [
  {
    id: "0.0",
    parent: "",
    name: "Incident call is received",
    value: 100,
  },
  {
    id: "1.1",
    parent: "0.0",
    name: "OPC answer call",
    value: 50,
  },
  {
    id: "1.2",
    parent: "0.0",
    name: "OPC wait answering call",
    value: 50,
  },
  {
    id: "2.1",
    parent: "1.1",
    name: "OPC alert fire dept",
    value: 25,
  },
  {
    id: "2.2",
    parent: "1.1",
    name: "OPC alert fire dept",
    value: 25,
  },
  {
    id: "2.3",
    parent: "1.2",
    name: "OPC don't alert fire dept",
    value: 50,
  },
  {
    id: "3.1",
    parent: "2.3",
    name: "OPC don't alert fire dept",
    value: 25,
  },
  {
    id: "3.2",
    parent: "2.3",
    name: "OPC alert fire dept",
    value: 25,
  },
];
