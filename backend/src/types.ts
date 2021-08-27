export interface Models {
  Solver: string;
  Input: string[];
  Call: Call[];
  Calls: number;
  Time: Time;
}

export interface Call {
  Witnesses: Witnesses[];
  Result: string;
  Models: ModelMetaData;
}

export interface Witnesses {
  Value: string[];
  Costs: number[];
}

export interface ModelMetaData {
  Number: number;
  More: string;
  Optimum: string;
  Optimal: number;
  Costs: number[];
}

export interface Time {
  Total: number;
  Solve: number;
  Model: number;
  Unsat: number;
  CPU: number;
}

export interface Response {
  status: number;
  body: string | Models;
}
