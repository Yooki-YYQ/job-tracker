import { useState } from 'react';
import { Modal } from 'antd';
import ColumnManagerForm from './ColumnManagerForm';
import type { ColumnDefinition } from '@/types';

interface ColumnManagerModalProps {
  open: boolean;
  onClose: () => void;
  columns: ColumnDefinition[];
  onAddColumn: (column: ColumnDefinition) => void;
  onUpdateColumn: (id: string, updates: Partial<ColumnDefinition>) => void;
  onRemoveColumn: (id: string) => void;
}

export default function ColumnManagerModal({ 
  open, 
  onClose, 
  columns,
  onAddColumn,
  onUpdateColumn,
  onRemoveColumn
}: ColumnManagerModalProps) {
  const [loading, setLoading] = useState(false);

  const handleAddColumn = async (column: ColumnDefinition) => {
    try {
      setLoading(true);
      onAddColumn(column);
    } catch (error) {
      console.error('Failed to add column:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateColumn = async (id: string, updates: Partial<ColumnDefinition>) => {
    try {
      setLoading(true);
      onUpdateColumn(id, updates);
    } catch (error) {
      console.error('Failed to update column:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveColumn = async (id: string) => {
    try {
      setLoading(true);
      onRemoveColumn(id);
    } catch (error) {
      console.error('Failed to remove column:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Manage Columns"
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
      destroyOnHidden
    >
      <ColumnManagerForm
        columns={columns}
        onAddColumn={handleAddColumn}
        onUpdateColumn={handleUpdateColumn}
        onRemoveColumn={handleRemoveColumn}
        onClose={onClose}
        loading={loading}
      />
    </Modal>
  );
}




