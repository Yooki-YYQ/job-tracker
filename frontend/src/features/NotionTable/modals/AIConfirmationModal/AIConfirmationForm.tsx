import { useState, useEffect, useCallback } from 'react';
import { Form, Input, Select, Button, Card, Space, Tag, Alert, Spin } from 'antd';
import { CheckCircleOutlined, EditOutlined, SettingOutlined } from '@ant-design/icons';
import type { ParsedJobData, JobSubmissionForm } from '@/types';
import { parseJobWithAI, parseJobWithMock, aiConfig } from '@/services/aiService';
import { AISettings } from '@/shared/components';

interface AIConfirmationFormProps {
  submissionData: JobSubmissionForm | null;
  onSubmit: (data: ParsedJobData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function AIConfirmationForm({ 
  submissionData,
  onSubmit, 
  onCancel, 
  loading = false 
}: AIConfirmationFormProps) {
  const [form] = Form.useForm<ParsedJobData>();
  const [parsedData, setParsedData] = useState<ParsedJobData | null>(null);
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAISettings, setShowAISettings] = useState(false);

  const parseJobData = useCallback(async () => {
    if (!submissionData) return;
    
    setParsing(true);
    setError(null);
    
    try {
      const config = aiConfig.get();
      let result;
      
      if (config.apiKey) {
        // Use real AI API
        const aiResponse = await parseJobWithAI(submissionData.jobDescription, config);
        
        if (aiResponse.success && aiResponse.data) {
          result = {
            companyName: aiResponse.data.companyName || '',
            positionTitle: aiResponse.data.positionTitle || '',
            jobUrl: submissionData.jobUrl || '',
            applicationDate: new Date().toISOString().split('T')[0],
            status: 'APPLIED',
            location: aiResponse.data.location,
            salary: aiResponse.data.salary,
            jobType: aiResponse.data.jobType,
            jobDescription: aiResponse.data.jobDescription,
            qualifications: aiResponse.data.qualifications,
            notes: `AI Parsed with ${Math.round((aiResponse.confidence || 0) * 100)}% confidence`,
            confidence: aiResponse.confidence,
          };
        } else {
          throw new Error(aiResponse.error || 'AI parsing failed');
        }
      } else {
        // Use mock parsing
        const mockResponse = await parseJobWithMock(submissionData.jobDescription);
        
        if (mockResponse.success && mockResponse.data) {
          result = {
            companyName: mockResponse.data.companyName || '',
            positionTitle: mockResponse.data.positionTitle || '',
            jobUrl: submissionData.jobUrl || '',
            applicationDate: new Date().toISOString().split('T')[0],
            status: 'APPLIED',
            location: mockResponse.data.location,
            salary: mockResponse.data.salary,
            jobType: mockResponse.data.jobType,
            jobDescription: mockResponse.data.jobDescription,
            qualifications: mockResponse.data.qualifications,
            notes: `Mock parsing (${Math.round((mockResponse.confidence || 0) * 100)}% confidence)`,
            confidence: mockResponse.confidence,
          };
        } else {
          throw new Error('Mock parsing failed');
        }
      }
      
      setParsedData(result);
      form.setFieldsValue(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse job description. Please try again.');
    } finally {
      setParsing(false);
    }
  }, [submissionData, form]);

  useEffect(() => {
    if (submissionData) {
      parseJobData();
    }
  }, [submissionData, parseJobData]);

  const handleConfirm = (values: ParsedJobData) => {
    // Convert ParsedJobData to the new JSONB structure
    const applicationData = {
      data: {
        companyName: values.companyName,
        positionTitle: values.positionTitle,
        jobUrl: values.jobUrl,
        applicationDate: values.applicationDate,
        status: values.status,
        notes: values.notes,
        location: values.location,
        salary: values.salary,
        jobType: values.jobType,
        jobDescription: values.jobDescription,
        qualifications: values.qualifications
      }
    };
    
    onSubmit(applicationData as any);
    form.resetFields();
    setParsedData(null);
    setError(null);
  };

  const handleCancel = () => {
    onCancel();
    form.resetFields();
    setParsedData(null);
    setError(null);
  };

  if (parsing) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16, fontSize: 16 }}>
          Parsing job description with AI...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px 0' }}>
        <Alert
          message="Parsing Failed"
          description={error}
          type="error"
          showIcon
          action={
            <Space>
              <Button size="small" onClick={parseJobData}>
                Retry
              </Button>
              <Button size="small" onClick={() => setShowAISettings(true)}>
                <SettingOutlined /> AI Settings
              </Button>
            </Space>
          }
        />
      </div>
    );
  }

  return (
    <div>
      {parsedData && (
        <Alert
          message="AI Parsing Complete"
          description="Please review and edit the parsed data below before confirming."
          type="success"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleConfirm}
        style={{ marginTop: 16 }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Form.Item
            name="companyName"
            label="Company Name"
            rules={[{ required: true, message: 'Company name is required' }]}
          >
            <Input placeholder="Company name" />
          </Form.Item>

          <Form.Item
            name="positionTitle"
            label="Position Title"
            rules={[{ required: true, message: 'Position title is required' }]}
          >
            <Input placeholder="Job title" />
          </Form.Item>

          <Form.Item
            name="location"
            label="Location"
          >
            <Input placeholder="Job location" />
          </Form.Item>

          <Form.Item
            name="salary"
            label="Salary"
          >
            <Input placeholder="Salary range" />
          </Form.Item>

          <Form.Item
            name="jobType"
            label="Job Type"
          >
            <Select placeholder="Select job type">
              <Select.Option value="Full-time">Full-time</Select.Option>
              <Select.Option value="Part-time">Part-time</Select.Option>
              <Select.Option value="Contract">Contract</Select.Option>
              <Select.Option value="Internship">Internship</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Status is required' }]}
          >
            <Select placeholder="Select status">
              <Select.Option value="APPLIED">Applied</Select.Option>
              <Select.Option value="INTERVIEW_SCHEDULED">Interview Scheduled</Select.Option>
              <Select.Option value="INTERVIEWED">Interviewed</Select.Option>
              <Select.Option value="OFFER_RECEIVED">Offer Received</Select.Option>
              <Select.Option value="REJECTED">Rejected</Select.Option>
              <Select.Option value="WITHDRAWN">Withdrawn</Select.Option>
              <Select.Option value="ACCEPTED">Accepted</Select.Option>
            </Select>
          </Form.Item>
        </div>

        <Form.Item
          name="jobDescription"
          label="Job Description"
        >
          <Input.TextArea rows={4} placeholder="Job description" />
        </Form.Item>

        <Form.Item
          name="qualifications"
          label="Qualifications"
        >
          <Input.TextArea rows={3} placeholder="Required qualifications" />
        </Form.Item>

        <Form.Item
          name="notes"
          label="Notes"
        >
          <Input.TextArea rows={2} placeholder="Additional notes" />
        </Form.Item>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginTop: 24 
        }}>
          <Button onClick={() => setShowAISettings(true)}>
            <SettingOutlined /> AI Settings
          </Button>
          
          <Space>
            <Button onClick={handleCancel}>
              Cancel
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              icon={<CheckCircleOutlined />}
            >
              Confirm & Add Application
            </Button>
          </Space>
        </div>
      </Form>

      <AISettings
        open={showAISettings}
        onClose={() => setShowAISettings(false)}
      />
    </div>
  );
}
