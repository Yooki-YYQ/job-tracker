import { useState } from 'react';
import { Button, Card, Space, Tag, Typography, Divider, Input, Select } from 'antd';
import { DownloadOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Application } from '@/types';
import { DEFAULT_COLUMNS } from '@/types/table.types';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

interface ApplicationDetailViewProps {
  application: Application;
  onClose: () => void;
  onEdit?: (application: Application) => void;
  onDelete?: (application: Application) => void;
}

export default function ApplicationDetailView({ 
  application, 
  onClose,
  onEdit,
  onDelete
}: ApplicationDetailViewProps) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPLIED':
      case 'INTERVIEW_SCHEDULED':
        return 'blue';
      case 'INTERVIEWED':
        return 'orange';
      case 'OFFER_RECEIVED':
      case 'ACCEPTED':
        return 'green';
      case 'REJECTED':
      case 'WITHDRAWN':
        return 'red';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not specified';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
      });
    } catch {
      return dateString;
    }
  };

  const getFieldValue = (columnId: string) => {
    if (columnId === 'createdAt') {
      return application.createdAt;
    }
    if (columnId.startsWith('data.')) {
      const field = columnId.replace('data.', '');
      return application.data?.[field];
    }
    if (columnId.startsWith('files.')) {
      const files = application.files || [];
      const field = columnId.replace('files.', '');
      if (field === 'cv') {
        const cvFile = files.find(f => 
          f.fileName?.toLowerCase().includes('cv') || 
          f.fileName?.toLowerCase().includes('resume')
        );
        return cvFile;
      }
      if (field === 'cl') {
        const clFile = files.find(f => 
          f.fileName?.toLowerCase().includes('cover') || 
          f.fileName?.toLowerCase().includes('letter')
        );
        return clFile;
      }
    }
    return null;
  };

  const handleFieldClick = (columnId: string) => {
    const value = getFieldValue(columnId);
    setEditingField(columnId);
    setEditValue(value || '');
  };

  const handleFieldSave = () => {
    if (!editingField) return;
    
    // Update the application data
    const updatedApplication = { ...application };
    
    if (editingField.startsWith('data.')) {
      const field = editingField.replace('data.', '');
      updatedApplication.data = {
        ...updatedApplication.data,
        [field]: editValue
      };
    }
    
    // Call the onEdit handler to save to backend
    onEdit?.(updatedApplication);
    
    setEditingField(null);
    setEditValue('');
  };

  const handleFieldCancel = () => {
    setEditingField(null);
    setEditValue('');
  };

  const renderField = (columnId: string, label: string) => {
    const value = getFieldValue(columnId);
    const isEditing = editingField === columnId;

    if (isEditing) {
      if (columnId === 'data.status') {
        return (
          <Select
            value={editValue}
            onChange={setEditValue}
            onBlur={handleFieldSave}
            onPressEnter={handleFieldSave}
            style={{ width: '100%' }}
            options={[
              { value: 'APPLIED', label: 'Applied' },
              { value: 'INTERVIEW_SCHEDULED', label: 'Interview Scheduled' },
              { value: 'INTERVIEWED', label: 'Interviewed' },
              { value: 'OFFER_RECEIVED', label: 'Offer Received' },
              { value: 'REJECTED', label: 'Rejected' },
              { value: 'WITHDRAWN', label: 'Withdrawn' },
              { value: 'ACCEPTED', label: 'Accepted' }
            ]}
            autoFocus
          />
        );
      }
      
      if (columnId === 'data.jobDescription' || columnId === 'data.qualifications' || columnId === 'data.notes') {
        return (
          <TextArea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleFieldSave}
            onPressEnter={handleFieldSave}
            rows={4}
            autoFocus
          />
        );
      }
      
      return (
        <Input
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleFieldSave}
          onPressEnter={handleFieldSave}
          autoFocus
        />
      );
    }

    // Display mode
    if (columnId === 'createdAt') {
      return (
        <span 
          onClick={() => handleFieldClick(columnId)}
          style={{ cursor: 'pointer', padding: '4px 8px', borderRadius: '4px' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          {formatDate(value)}
        </span>
      );
    }

    if (columnId === 'data.status') {
      return (
        <Tag 
          color={getStatusColor(value)}
          onClick={() => handleFieldClick(columnId)}
          style={{ cursor: 'pointer' }}
        >
          {value?.replace('_', ' ') || 'Not specified'}
        </Tag>
      );
    }

    if (columnId === 'data.jobUrl') {
      if (!value || value === 'none') {
        return (
          <span 
            onClick={() => handleFieldClick(columnId)}
            style={{ cursor: 'pointer', padding: '4px 8px', borderRadius: '4px', color: '#6c757d' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            none
          </span>
        );
      }
      return (
        <a 
          href={value} 
          target="_blank" 
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          style={{ color: '#1890ff' }}
        >
          {value.length > 30 ? value.substring(0, 30) + '...' : value}
        </a>
      );
    }

    if (columnId.startsWith('files.')) {
      const file = value;
      if (!file) {
        return (
          <span style={{ color: '#6c757d' }}>No files</span>
        );
      }
      return (
        <Button
          size="small"
          icon={<DownloadOutlined />}
          onClick={() => {
            // Download file logic
            const link = document.createElement('a');
            link.href = `http://localhost:5000/api/files/${file.id}/download`;
            link.download = file.fileName;
            link.click();
          }}
        >
          {file.fileName}
        </Button>
      );
    }

    // Default text field
    return (
      <span 
        onClick={() => handleFieldClick(columnId)}
        style={{ cursor: 'pointer', padding: '4px 8px', borderRadius: '4px' }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        {value || 'Not specified'}
      </span>
    );
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '24px' 
      }}>
        <Title level={3} style={{ margin: 0 }}>
          Application Details
        </Title>
        <Space>
          <Button 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => onDelete?.(application)}
          >
            Delete
          </Button>
          <Button onClick={onClose}>
            Close
          </Button>
        </Space>
      </div>

      <Card>
        <div style={{ display: 'grid', gap: '16px' }}>
          {DEFAULT_COLUMNS.filter(col => col.id !== 'id').map((column) => (
            <div key={column.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ 
                minWidth: '120px', 
                fontWeight: 'bold', 
                color: '#666',
                paddingTop: '4px'
              }}>
                {column.name}:
              </div>
              <div style={{ flex: 1 }}>
                {renderField(column.id, column.name)}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}