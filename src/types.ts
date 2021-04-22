export interface State {
  showSidebar: boolean;
  showProcedures: boolean;
  dialog: Dialog;
  tableData: TableData;
  sunburstData: SunburstData[];
}

export interface TableData {
  type: string;
  key: string;
  contents: ProcedureData[] | TaxonomyData[];
}

export interface ProcedureData {
  action: string;
  agents: string;
  quantity: number;
  abbreviation: string;
  precedence: string;
}

export interface TaxonomyData {
  action: string;
  agents: string;
  quantity: number;
  abbreviation: string;
  precedence: string;
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
