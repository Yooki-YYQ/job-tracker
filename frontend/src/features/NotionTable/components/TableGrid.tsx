import React from 'react';
import { Table, Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Application, ColumnDefinition } from '@/types';

interface TableGridProps {
  data: Application[];
  columns: ColumnDefinition[];
  loading: boolean;
  onRowClick?: (record: Application) => void;
  onDelete?: (record: Application) => void;
  pagination?: { current: number; pageSize: number };
  onPaginationChange?: (pagination: { current: number; pageSize: number }) => void;
}

export default function TableGrid({
  data,
  columns,
  loading,
  onRowClick,
  onDelete,
  pagination = { current: 1, pageSize: 10 },
  onPaginationChange
}: TableGridProps) {
  const antColumns: ColumnsType<Application> = [
    {
      title: '#',
      key: 'rowNumber',
      width: 60,
      fixed: 'left',
      render: (_, __, index) => {
        // Calculate row number based on pagination
        const current = pagination.current || 1;
        const pageSize = pagination.pageSize || 10;
        return (current - 1) * pageSize + index + 1;
      }
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
        
        // Add date formatting for applicationDate field
        if (col.id === 'data.applicationDate') {
          if (!value) return '-';
          try {
            const date = new Date(value);
            return date.toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: '2-digit', 
              day: '2-digit' 
            });
          } catch {
            return value; // fallback to raw value if date parsing fails
          }
        }
        
        return value || '-';
      }
      
      // Handle file fields
      if (col.id.startsWith('files.')) {
        const files = record.files || [];
        
        if (col.id === 'files.cv') {
          const cvFile = files.find(f => f.fileName.toLowerCase().includes('cv') || f.fileName.toLowerCase().includes('resume'));
          if (!cvFile) return <span style={{ color: '#6c757d' }}>No files</span>;
          
          return (
            <Button 
              size="small" 
              icon={<DownloadOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                window.open(`http://localhost:5000/api/files/${cvFile.id}/download`, '_blank');
              }}
            >
              {cvFile.fileName}
            </Button>
          );
        }
        
        if (col.id === 'files.cl') {
          const clFile = files.find(f => f.fileName.toLowerCase().includes('cover'));
          if (!clFile) return <span style={{ color: '#6c757d' }}>No files</span>;
          
          return (
            <Button 
              size="small" 
              icon={<DownloadOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                window.open(`http://localhost:5000/api/files/${clFile.id}/download`, '_blank');
              }}
            >
              {clFile.fileName}
            </Button>
          );
        }
        
        // Fallback for other file fields
        const field = col.id.replace('files.', '');
        const file = files[0];
        if (!file) return <span style={{ color: '#6c757d' }}>No files</span>;
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
      
      // Handle createdAt date formatting
      if (col.id === 'createdAt') {
        const value = record.createdAt;
        if (!value) return '-';
        try {
          const date = new Date(value);
          return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit' 
          });
        } catch {
          return value;
        }
      }
      
      return record[col.id as keyof Application] || '-';
    }
  })),
  {
    title: 'Actions',
    key: 'actions',
    width: 80,
    fixed: 'right',
    render: (_, record) => (
      <Button 
        size="small" 
        danger
        onClick={(e) => {
          e.stopPropagation();
          onDelete?.(record);
        }}
      >
        Delete
      </Button>
    )
  }
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
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          onChange: (page, size) => {
            onPaginationChange?.({ current: page, pageSize: size || 10 });
          },
          onShowSizeChange: (current, size) => {
            onPaginationChange?.({ current: 1, pageSize: size });
          }
        }}
        size="small"
      />
    </div>
  );
}