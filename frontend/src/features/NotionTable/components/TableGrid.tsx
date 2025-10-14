import React from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { Application, ColumnDefinition } from '@/types';

interface TableGridProps {
  data: Application[];
  columns: ColumnDefinition[];
  loading: boolean;
  onRowClick?: (record: Application) => void;
}

export default function TableGrid({
  data,
  columns,
  loading,
  onRowClick
}: TableGridProps) {
  const antColumns: ColumnsType<Application> = [
    {
      title: '#',
      key: 'rowNumber',
      width: 60,
      fixed: 'left',
      render: (_, __, index) => index + 1  // Auto-recalculates on delete
    },
    ...columns.map(col => ({
    title: col.name,
    key: col.id,
    width: col.width,
    render: (_, record) => {
      // Handle nested data fields
      if (col.id.startsWith('data.')) {
        const field = col.id.replace('data.', '');
        const value = record.data?.[field];
        
        // Special handling for different field types
        if (col.id === 'data.status') {
          let color = '#6c757d';
          if (value === 'APPLIED' || value === 'INTERVIEW_SCHEDULED') color = '#1890ff';
          if (value === 'OFFER_RECEIVED' || value === 'ACCEPTED') color = '#52c41a';
          if (value === 'REJECTED' || value === 'WITHDRAWN') color = '#ff4d4f';
          
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: color }}></span>
              <span>{value}</span>
            </div>
          );
        }
        
        if (col.id === 'data.jobUrl') {
          if (!value || value === 'none') {
            return <span style={{ color: '#6c757d' }}>none</span>;
          }
          return (
            <a href={value} target="_blank" rel="noopener noreferrer" style={{ color: '#1890ff' }}>
              {value.length > 30 ? value.substring(0, 30) + '...' : value}
            </a>
          );
        }
        
        if (col.id === 'data.jobDescription' || col.id === 'data.qualifications') {
          const text = String(value || '');
          const truncated = text.length > 50 ? text.substring(0, 50) + '...' : text;
          return <span style={{ color: '#6c757d' }}>{truncated}</span>;
        }
        
        return value || '-';
      }
      
      // Handle file fields
      if (col.id.startsWith('files.')) {
        const field = col.id.replace('files.', '');
        const file = record.files?.[0];
        if (!file) return 'No files';
        return file[field as keyof typeof file] || '-';
      }
      
      // Handle system fields (id, createdAt, updatedAt)
      if (col.id === 'id') {
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 12, color: '#6c757d' }}>Aa</span>
            <span>{record.id?.substring(0, 8) || ''}</span>
          </div>
        );
      }
      
      return record[col.id as keyof Application] || '-';
    }
  }))
  ];

  return (
    <div style={{ 
      padding: '0 16px 16px 16px',
      background: 'white'
    }}>
      <Table
        columns={antColumns}
        dataSource={data}
        loading={loading}
        rowKey="id"
        onRow={(record) => ({
          onClick: () => onRowClick?.(record),
          style: { cursor: 'pointer' }
        })}
        scroll={{ x: 'max-content' }}
        pagination={{ pageSize: 10, showSizeChanger: true }}
        size="small"
      />
    </div>
  );
}