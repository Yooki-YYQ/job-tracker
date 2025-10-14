// Table domain types
export interface ColumnDefinition {
  id: string;
  name: string;
  type: ColumnType;
  required?: boolean;
  editable?: boolean;
  width?: number;
  options?: string[];
}

export type ColumnType = 
  | 'text' 
  | 'date' 
  | 'select' 
  | 'number' 
  | 'url' 
  | 'file' 
  | 'files';

export interface TableConfig {
  columns: ColumnDefinition[];
  rowHeight: number;
  headerHeight: number;
  enableSort: boolean;
  enableFilter: boolean;
  enableResize: boolean;
}

export interface TableCellProps {
  value: unknown;
  rowData: Record<string, unknown>;
  column: ColumnDefinition;
  onEdit?: (value: unknown) => void;
}

export interface TableRowProps {
  data: Record<string, unknown>;
  columns: ColumnDefinition[];
  onRowClick?: (id: string) => void;
  onCellEdit?: (id: string, field: string, value: unknown) => void;
}

// Default column definitions
export const DEFAULT_COLUMNS: ColumnDefinition[] = [
  { id: 'id', name: 'ID', type: 'text', editable: false, width: 80 },
  { id: 'data.applicationDate', name: 'Date', type: 'date', editable: true, width: 120 },
  { id: 'data.positionTitle', name: 'Position', type: 'text', required: true, editable: true, width: 200 },
  { id: 'data.companyName', name: 'Company', type: 'text', required: true, editable: true, width: 150 },
  { id: 'data.status', name: 'Status', type: 'select', editable: true, width: 120, options: ['APPLIED', 'INTERVIEW_SCHEDULED', 'INTERVIEWED', 'OFFER_RECEIVED', 'REJECTED', 'WITHDRAWN', 'ACCEPTED'] },
  { id: 'data.jobUrl', name: 'URL', type: 'url', editable: true, width: 200 },
  { id: 'data.jobDescription', name: 'Job Description', type: 'text', editable: true, width: 250 },
  { id: 'data.qualifications', name: 'Requirements', type: 'text', editable: true, width: 250 },
  { id: 'files.cv', name: 'CV', type: 'file', editable: false, width: 100 },
  { id: 'files.cl', name: 'CL', type: 'file', editable: false, width: 100 },
  { id: 'data.salary', name: 'Pay', type: 'text', editable: true, width: 120 },
  { id: 'data.notes', name: 'Notes', type: 'text', editable: true, width: 200 },
];
