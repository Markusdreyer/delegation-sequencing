export interface RootState {
  activeTaxonomy: string;
  showSidebar: boolean;
  showProcedures: boolean;
  dialog: Dialog;
  tableData: TableData;
  procedures: {
    [key: string]: ProcedureData[];
  };
  taxonomies: {
    [key: string]: TaxonomyData[];
  };
  sunburstData: SunburstData[];
}

export interface TableData {
  type: string;
  key: string;
  data: ProcedureData[] | TaxonomyData[];
}

export interface ProcedureData {
  id: number;
  parentId?: number;
  action: string;
  agent: string[] | string;
  quantity: string;
  abbreviation: string;
  precedence: string;
  role: string[] | string;
}

export interface MultiselectValues {
  role: string[];
  agent: string[];
}

export interface TaxonomyData {
  id: number;
  parentId?: number;
  agent: string;
  role: string;
  parent: string;
}

export interface Dialog {
  show: boolean;
  title?: string;
  label?: string;
}
export interface SunburstData {
  id: string;
  parent: string;
  name: string;
  value?: number;
}

export interface Action {
  name: string;
  agent: string;
  time: number;
}

export interface MaterialTableData {
  tableData: {
    childRows: number;
    editing: boolean;
    id: number;
    isTreeExpanded: boolean;
    markedForTreeRemove: boolean;
    path: number[];
  };
}
export interface ColumnDef {
  field: string;
  lookup: boolean;
}

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
