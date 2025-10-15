import { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Alert, Space, Typography, Divider } from 'antd';
import { SettingOutlined, KeyOutlined, RobotOutlined } from '@ant-design/icons';
import { aiConfig } from '@/services/aiService';
import type { AIConfig } from '@/types';

const { TextArea } = Input;
const { Title, Text } = Typography;

interface AISettingsProps {
  open: boolean;
  onClose: () => void;
}

export default function AISettings({ open, onClose }: AISettingsProps) {
  const [form] = Form.useForm<AIConfig>();
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<AIConfig>(aiConfig.get());

  useEffect(() => {
    if (open) {
      const currentConfig = aiConfig.get();
      setConfig(currentConfig);
      form.setFieldsValue(currentConfig);
    }
  }, [open, form]);

  const handleSave = async (values: AIConfig) => {
    setLoading(true);
    try {
      aiConfig.set(values);
      setConfig(values);
      onClose();
    } catch (error) {
      console.error('Failed to save AI config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async () => {
    if (!config.apiKey) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
        },
      });

      if (response.ok) {
        alert('✅ API connection successful!');
      } else {
        alert('❌ API connection failed. Please check your API key.');
      }
    } catch (error) {
      alert('❌ Network error. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <SettingOutlined />
          AI Settings
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
        initialValues={config}
      >
        <Alert
          message="AI Configuration"
          description="Configure your OpenAI API key and customize the AI parsing prompt for consistent job description extraction."
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        <Form.Item
          name="apiKey"
          label="Enable AI Parsing"
          help="Enter your OpenAI API key to enable AI-powered job parsing"
        >
          <Input.Password
            placeholder="sk-..."
            addonAfter={
              <Button 
                size="small" 
                onClick={() => {
                  const apiKey = form.getFieldValue('apiKey');
                  if (apiKey) {
                    // Test API key
                    console.log('Testing API key...');
                  }
                }}
              >
                Test
              </Button>
            }
          />
        </Form.Item>

        <Divider />

        <Title level={4}>
          <KeyOutlined style={{ marginRight: 8 }} />
          API Configuration
        </Title>

        <Form.Item
          name="apiKey"
          label="OpenAI API Key"
          rules={[
            { required: false, message: 'API key is optional but recommended for better accuracy' }
          ]}
        >
          <Input.Password
            placeholder="sk-..."
            addonAfter={
              <Button 
                size="small" 
                onClick={handleTestConnection}
                loading={loading}
                disabled={!config.apiKey}
              >
                Test
              </Button>
            }
          />
        </Form.Item>

        <Form.Item
          name="model"
          label="AI Model"
          rules={[{ required: true, message: 'Please select a model' }]}
        >
          <Input placeholder="gpt-4" />
        </Form.Item>

        <Form.Item
          name="geminiApiKey"
          label="Google Gemini API Key (Free)"
          help="Get your free API key from https://makersuite.google.com/app/apikey"
        >
          <Input.Password
            placeholder="Enter your Gemini API key for free AI parsing"
            onChange={(e) => {
              localStorage.setItem('gemini_api_key', e.target.value);
            }}
          />
        </Form.Item>

        <Alert
          message="Getting Your API Key"
          description={
            <div>
              <p>1. Go to <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">OpenAI API Keys</a></p>
              <p>2. Create a new API key</p>
              <p>3. Copy and paste it above</p>
              <p><strong>Note:</strong> API usage will be charged to your OpenAI account.</p>
            </div>
          }
          type="warning"
          showIcon
          style={{ marginBottom: 24 }}
        />

        <Divider />

        <Title level={4}>
          <RobotOutlined style={{ marginRight: 8 }} />
          AI Prompt Configuration
        </Title>

        <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
          This prompt is used by the AI to extract job information. It's stored locally and will persist when you restart the application.
        </Text>

        <Form.Item
          name="customPrompt"
          label="AI Parsing Prompt"
          rules={[{ required: true, message: 'Prompt is required' }]}
        >
          <TextArea
            rows={20}
            placeholder="Enter your AI parsing prompt..."
            style={{ fontFamily: 'monospace', fontSize: '12px' }}
          />
        </Form.Item>

        <Alert
          message="Prompt Persistence"
          description="Your custom prompt is automatically saved and will be used every time you restart the application. You can modify it anytime to improve AI parsing results."
          type="success"
          showIcon
          style={{ marginBottom: 24 }}
        />

        <Form.Item style={{ marginBottom: 0 }}>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              Save Configuration
            </Button>
            <Button onClick={onClose}>
              Cancel
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}

