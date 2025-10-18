import { useState } from 'react';
import { Form, Input, Upload, Button, message, Progress } from 'antd';
import { UploadOutlined, LinkOutlined, FileTextOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import type { JobSubmissionForm, UploadedFile } from '@/types';

interface JobSubmissionFormProps {
  onSubmit: (data: JobSubmissionForm) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function JobSubmissionForm({ 
  onSubmit, 
  onCancel, 
  loading = false 
}: JobSubmissionFormProps) {
  const [form] = Form.useForm<JobSubmissionForm>();
  const [cvFile, setCvFile] = useState<UploadFile | null>(null);
  const [clFile, setClFile] = useState<UploadFile | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleCvFileChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
    setCvFile(newFileList[0] || null);
  };

  const handleClFileChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
    setClFile(newFileList[0] || null);
  };

  const beforeUpload = (file: File) => {
    const isValidType = file.type.startsWith('application/') || 
                       file.type.startsWith('text/') || 
                       file.type === 'application/pdf';
    
    if (!isValidType) {
      message.error('You can only upload PDF, Word, or text files!');
      return false;
    }

    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error('File must be smaller than 10MB!');
      return false;
    }

    return false; // Prevent auto upload
  };

  const handleSubmit = async (values: JobSubmissionForm) => {
    // Files are now optional - no validation required

    const uploadedFiles: UploadedFile[] = [];
    
    if (cvFile?.originFileObj) {
      uploadedFiles.push({
        id: cvFile.uid,
        name: cvFile.name,
        size: cvFile.size || 0,
        type: cvFile.type || 'application/octet-stream',
        file: cvFile.originFileObj as File
      });
    }
    
    if (clFile?.originFileObj) {
      uploadedFiles.push({
        id: clFile.uid,
        name: clFile.name,
        size: clFile.size || 0,
        type: clFile.type || 'application/octet-stream',
        file: clFile.originFileObj as File
      });
    }

    const formData: JobSubmissionForm = {
      ...values,
      files: uploadedFiles
    };

    await onSubmit(formData);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      style={{ marginTop: 16 }}
    >
      <Form.Item
        name="jobUrl"
        label="Job URL (Optional)"
        rules={[
          { type: 'url', message: 'Please enter a valid URL' }
        ]}
      >
        <Input
          prefix={<LinkOutlined />}
          placeholder="https://company.com/job-posting"
        />
      </Form.Item>

      <Form.Item
        name="jobDescription"
        label="Job Description (Optional)"
      >
        <Input.TextArea
          rows={8}
          placeholder="Paste the complete job description here (Ctrl+A, Ctrl+V from the job posting)..."
          style={{ fontFamily: 'monospace' }}
        />
      </Form.Item>

      <Form.Item label="CV / Resume (Optional)">
        <Upload
          fileList={cvFile ? [cvFile] : []}
          onChange={handleCvFileChange}
          beforeUpload={beforeUpload}
          maxCount={1}
          listType="text"
        >
          <Button icon={<UploadOutlined />}>
            Upload CV
          </Button>
        </Upload>
      </Form.Item>

      <Form.Item label="Cover Letter (Optional)">
        <Upload
          fileList={clFile ? [clFile] : []}
          onChange={handleClFileChange}
          beforeUpload={beforeUpload}
          maxCount={1}
          listType="text"
        >
          <Button icon={<UploadOutlined />}>
            Upload CL
          </Button>
        </Upload>
      </Form.Item>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        gap: 8, 
        marginTop: 24 
      }}>
        <Button onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          type="primary" 
          htmlType="submit" 
          loading={loading}
          icon={<FileTextOutlined />}
        >
          Parse with AI
        </Button>
      </div>
    </Form>
  );
}

