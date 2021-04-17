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
