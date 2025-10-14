import { Button, Card, Descriptions, Space, Tag, Typography, Divider } from 'antd';
import { EditOutlined, DownloadOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Application } from '@/types';

const { Title, Paragraph } = Typography;

interface ApplicationDetailViewProps {
  application: Application;
  onClose: () => void;
}

export default function ApplicationDetailView({ 
  application, 
  onClose 
}: ApplicationDetailViewProps) {
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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 24 
      }}>
        <Title level={3} style={{ margin: 0 }}>
          {application.positionTitle}
        </Title>
        <Space>
          <Button icon={<EditOutlined />}>
            Edit
          </Button>
          <Button danger icon={<DeleteOutlined />}>
            Delete
          </Button>
        </Space>
      </div>

      <Card>
        <Descriptions column={2} bordered>
          <Descriptions.Item label="Company">
            {application.companyName}
          </Descriptions.Item>
          <Descriptions.Item label="Position">
            {application.positionTitle}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={getStatusColor(application.status)}>
              {application.status.replace('_', ' ')}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Application Date">
            {formatDate(application.applicationDate)}
          </Descriptions.Item>
          <Descriptions.Item label="Location">
            {application.location || 'Not specified'}
          </Descriptions.Item>
          <Descriptions.Item label="Salary">
            {application.salary || 'Not specified'}
          </Descriptions.Item>
          <Descriptions.Item label="Job Type">
            {application.jobType || 'Not specified'}
          </Descriptions.Item>
          <Descriptions.Item label="Job URL">
            {application.jobUrl ? (
              <a href={application.jobUrl} target="_blank" rel="noopener noreferrer">
                View Job Posting
              </a>
            ) : (
              'Not provided'
            )}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {application.jobDescription && (
        <>
          <Divider />
          <Card title="Job Description">
            <Paragraph style={{ whiteSpace: 'pre-wrap' }}>
              {application.jobDescription}
            </Paragraph>
          </Card>
        </>
      )}

      {application.qualifications && (
        <>
          <Divider />
          <Card title="Qualifications">
            <Paragraph style={{ whiteSpace: 'pre-wrap' }}>
              {application.qualifications}
            </Paragraph>
          </Card>
        </>
      )}

      {application.notes && (
        <>
          <Divider />
          <Card title="Notes">
            <Paragraph style={{ whiteSpace: 'pre-wrap' }}>
              {application.notes}
            </Paragraph>
          </Card>
        </>
      )}

      {application.files && application.files.length > 0 && (
        <>
          <Divider />
          <Card title="Uploaded Files">
            <Space direction="vertical" style={{ width: '100%' }}>
              {application.files.map((file) => (
                <div key={file.id} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '8px 12px',
                  border: '1px solid #f0f0f0',
                  borderRadius: '4px'
                }}>
                  <span>{file.originalName}</span>
                  <Button 
                    size="small" 
                    icon={<DownloadOutlined />}
                    onClick={() => {
                      // TODO: Implement file download
                      console.log('Download file:', file.id);
                    }}
                  >
                    Download
                  </Button>
                </div>
              ))}
            </Space>
          </Card>
        </>
      )}

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

