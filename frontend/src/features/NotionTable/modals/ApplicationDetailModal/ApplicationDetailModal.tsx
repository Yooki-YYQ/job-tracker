import { useState, useEffect } from 'react';
import { Modal, Spin, Alert } from 'antd';
import ApplicationDetailView from './ApplicationDetailView';
import { applicationApi } from '@/services/api';
import type { Application } from '@/types';

interface ApplicationDetailModalProps {
  open: boolean;
  onClose: () => void;
  applicationId: string | null;
  onEdit?: (application: Application) => void;
  onDelete?: (application: Application) => void;
}

export default function ApplicationDetailModal({ 
  open, 
  onClose, 
  applicationId,
  onEdit,
  onDelete
}: ApplicationDetailModalProps) {
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && applicationId) {
      loadApplication();
    }
  }, [open, applicationId]);

  const loadApplication = async () => {
    if (!applicationId) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await applicationApi.getById(applicationId);
      setApplication(data);
    } catch (err) {
      setError('Failed to load application details');
      console.error('Error loading application:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setApplication(null);
    setError(null);
    onClose();
  };

  return (
    <Modal
      title="Application Details"
      open={open}
      onCancel={handleClose}
      footer={null}
      width={800}
      destroyOnClose
    >
      {loading && (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spin size="large" />
        </div>
      )}
      
      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}
      
      {application && !loading && (
        <ApplicationDetailView
          application={application}
          onClose={handleClose}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    </Modal>
  );
}

