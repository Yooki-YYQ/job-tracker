import { useState, useCallback } from 'react';
import type { ColumnDefinition } from '@/types';
import { DEFAULT_COLUMNS } from '@/types';

export function useColumns() {
  const [columns, setColumns] = useState<ColumnDefinition[]>(DEFAULT_COLUMNS);
  
  const addColumn = useCallback((column: ColumnDefinition) => {
    setColumns(prev => [...prev, column]);
  }, []);

  const updateColumn = useCallback((id: string, updates: Partial<ColumnDefinition>) => {
    setColumns(prev => prev.map(col => 
      col.id === id ? { ...col, ...updates } : col
    ));
  }, []);

  const removeColumn = useCallback((id: string) => {
    setColumns(prev => prev.filter(col => col.id !== id));
  }, []);

  const reorderColumns = useCallback((fromIndex: number, toIndex: number) => {
    setColumns(prev => {
      const newColumns = [...prev];
      const [movedColumn] = newColumns.splice(fromIndex, 1);
      newColumns.splice(toIndex, 0, movedColumn);
      return newColumns;
    });
  }, []);

  const resetColumns = useCallback(() => {
    setColumns(DEFAULT_COLUMNS);
  }, []);

  const getColumnById = useCallback((id: string): ColumnDefinition | undefined => {
    return columns.find(col => col.id === id);
  }, [columns]);

  return {
    columns,
    addColumn,
    updateColumn,
    removeColumn,
    reorderColumns,
    resetColumns,
    getColumnById
  };
}
