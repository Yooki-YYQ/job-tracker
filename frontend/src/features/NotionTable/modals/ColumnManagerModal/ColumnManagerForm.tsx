import { useState } from 'react';
import { Form, Input, Select, Button, List, Card, Space, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnDefinition, ColumnType } from '@/types';

interface ColumnManagerFormProps {
  columns: ColumnDefinition[];
  onAddColumn: (column: ColumnDefinition) => void;
  onUpdateColumn: (id: string, updates: Partial<ColumnDefinition>) => void;
  onRemoveColumn: (id: string) => void;
  onClose: () => void;
  loading?: boolean;
}

const COLUMN_TYPES: { value: ColumnType; label: string }[] = [
  { value: 'text', label: 'Text' },
  { value: 'date', label: 'Date' },
  { value: 'select', label: 'Select' },
  { value: 'number', label: 'Number' },
  { value: 'url', label: 'URL' },
  { value: 'file', label: 'File' },
  { value: 'files', label: 'Files' },
];

export default function ColumnManagerForm({ 
  columns,
  onAddColumn,
  onUpdateColumn,
  onRemoveColumn,
  onClose,
  loading = false 
}: ColumnManagerFormProps) {
  const [form] = Form.useForm<ColumnDefinition>();
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddColumn = async (values: ColumnDefinition) => {
    const newColumn: ColumnDefinition = {
      ...values,
      id: `custom_${Date.now()}`,
      editable: values.editable ?? true,
      required: values.required ?? false,
    };
    
    onAddColumn(newColumn);
    form.resetFields();
    message.success('Column added successfully');
  };

  const handleUpdateColumn = async (id: string, values: Partial<ColumnDefinition>) => {
    onUpdateColumn(id, values);
    setEditingId(null);
    message.success('Column updated successfully');
  };

  const handleRemoveColumn = (id: string) => {
    onRemoveColumn(id);
    message.success('Column removed successfully');
  };

  const startEditing = (column: ColumnDefinition) => {
    setEditingId(column.id);
    form.setFieldsValue(column);
  };

  const cancelEditing = () => {
    setEditingId(null);
    form.resetFields();
  };

  return (
    <div>
      <Card title="Add New Column" style={{ marginBottom: 16 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddColumn}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <Form.Item
              name="name"
              label="Column Name"
              rules={[{ required: true, message: 'Column name is required' }]}
            >
              <Input placeholder="Column name" />
            </Form.Item>

            <Form.Item
              name="type"
              label="Column Type"
              rules={[{ required: true, message: 'Column type is required' }]}
            >
              <Select placeholder="Select type">
                {COLUMN_TYPES.map(type => (
                  <Select.Option key={type.value} value={type.value}>
                    {type.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="width"
              label="Width"
            >
              <Input type="number" placeholder="Column width" />
            </Form.Item>
          </div>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              icon={<PlusOutlined />}
              loading={loading}
            >
              Add Column
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title="Existing Columns">
        <List
          dataSource={columns}
          renderItem={(column) => (
            <List.Item
              actions={[
                <Button
                  key="edit"
                  size="small"
                  icon={<EditOutlined />}
                  onClick={() => startEditing(column)}
                >
                  Edit
                </Button>,
                <Popconfirm
                  key="delete"
                  title="Are you sure you want to delete this column?"
                  onConfirm={() => handleRemoveColumn(column.id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                  >
                    Delete
                  </Button>
                </Popconfirm>
              ]}
            >
              <List.Item.Meta
                title={column.name}
                description={
                  <Space>
                    <span>Type: {column.type}</span>
                    {column.width && <span>Width: {column.width}px</span>}
                    {column.required && <span style={{ color: 'red' }}>Required</span>}
                    {!column.editable && <span style={{ color: 'orange' }}>Read-only</span>}
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        marginTop: 24 
      }}>
        <Button onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
}

