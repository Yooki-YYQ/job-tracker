import { useMemo, useCallback } from 'react';
import type { ColDef, ICellRendererParams } from 'ag-grid-community';
import type { Application, ColumnDefinition } from '@/types';

export function useTableGrid(columns: ColumnDefinition[]) {
  const columnDefs = useMemo((): ColDef[] => {
    return columns.map((col): ColDef => ({
      headerName: col.name,
      field: col.id,
      width: col.width || 150,
      resizable: true,
      sortable: true,
      filter: true,
      editable: col.editable,
      cellRenderer: getCellRenderer(col),
      valueGetter: (params) => {
        // Handle nested field access for JSONB data
        if (col.id.startsWith('data.')) {
          const fieldName = col.id.replace('data.', '');
          return params.data?.data?.[fieldName];
        }
        if (col.id.startsWith('files.')) {
          const fieldName = col.id.replace('files.', '');
          return params.data?.files?.[0]?.[fieldName] || 'No files';
        }
        // System fields (id, createdAt, updatedAt)
        return params.data?.[col.id];
      }
    }));
  }, [columns]);

  const defaultColDef = useMemo((): ColDef => ({
    resizable: true,
    sortable: true,
    filter: true,
    flex: 1,
    minWidth: 100,
  }), []);

  const onGridReady = useCallback((params: any) => {
    console.log('Grid ready with', params.api.getDisplayedRowCount(), 'rows');
  }, []);

  const onRowClicked = useCallback((event: any) => {
    if (event.data) {
      console.log('Row clicked:', event.data.id);
    }
  }, []);

  return {
    columnDefs,
    defaultColDef,
    onGridReady,
    onRowClicked
  };
}

function getCellRenderer(column: ColumnDefinition) {
  return (params: ICellRendererParams) => {
    const value = params.value || '';
    
    switch (column.type) {
      case 'url':
        if (!value || value === 'none') {
          return `<span style="color: #6c757d;">none</span>`;
        }
        return `<div style="display: flex; align-items: center; gap: 4px; height: 100%;">
          <span style="font-size: 12px; color: #6c757d;">🔗</span>
          <a href="${value}" target="_blank" style="color: #1890ff; text-decoration: underline;">${value.length > 30 ? value.substring(0, 30) + '...' : value}</a>
        </div>`;

      case 'file':
        return `<div style="display: flex; align-items: center; gap: 4px; height: 100%;">
          <span style="font-size: 12px; color: #6c757d;">📎</span>
          <span style="color: #6c757d;">${value.length > 20 ? value.substring(0, 20) + '...' : value}</span>
        </div>`;

      case 'date':
        const date = value ? new Date(value).toLocaleString() : '';
        return `<div style="display: flex; align-items: center; gap: 4px; height: 100%;">
          <span style="font-size: 12px; color: #6c757d;">🕐</span>
          <span style="color: #6c757d;">${date}</span>
        </div>`;

      case 'select':
        if (column.id === 'data.status') {
          let color = '#6c757d';
          if (value === 'APPLIED' || value === 'INTERVIEW_SCHEDULED') color = '#1890ff';
          if (value === 'OFFER_RECEIVED' || value === 'ACCEPTED') color = '#52c41a';
          if (value === 'REJECTED' || value === 'WITHDRAWN') color = '#ff4d4f';
          
          return `<div style="display: flex; align-items: center; gap: 6px; height: 100%;">
            <span style="width: 8px; height: 8px; border-radius: 50%; background: ${color};"></span>
            <span>${value}</span>
          </div>`;
        }
        return `<span>${value}</span>`;

      default:
        if (column.id === 'id') {
          return `<div style="display: flex; align-items: center; gap: 4px; height: 100%;">
            <span style="font-size: 12px; color: #6c757d;">Aa</span>
            <span>${value?.substring(0, 8) || ''}</span>
          </div>`;
        }
        
        const text = String(value);
        const truncated = text.length > 50 ? text.substring(0, 50) + '...' : text;
        const color = column.id === 'data.jobDescription' || column.id === 'data.qualifications' ? '#6c757d' : '#212529';
        
        return `<div style="display: flex; align-items: center; gap: 4px; height: 100%;">
          <span style="font-size: 12px; color: #6c757d;">≡</span>
          <span style="color: ${color};">${truncated}</span>
        </div>`;
    }
  };
}
