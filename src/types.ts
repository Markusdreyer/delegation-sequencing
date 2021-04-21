export interface State {
  showSidebar: boolean;
  showProcedures: boolean;
  dialog: Dialog;
  tableMeta: TableMeta;
  tableData: {
    [key: string]: TableData[];
  };
  sunburstData: SunburstData[];
}

export interface TableMeta {
  type: string;
  key: string;
}

export interface Dialog {
  show: boolean;
  title?: string;
  label?: string;
}
export interface TableData {
  action: string;
  agents: string;
  quantity: number;
  abbreviation: string;
  precedence: string;
}
export interface SunburstData {
  id: string;
  parent: string;
  name: string;
  value?: number;
}
