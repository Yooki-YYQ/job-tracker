import { useState } from 'react';
import { Modal } from 'antd';
import JobSubmissionForm from './JobSubmissionForm';
import type { JobSubmissionForm as JobSubmissionFormType } from '@/types';

interface JobSubmissionModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: JobSubmissionFormType) => Promise<void>;
}

export default function JobSubmissionModal({ 
  open, 
  onClose, 
  onSubmit 
}: JobSubmissionModalProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: JobSubmissionFormType) => {
    try {
      setLoading(true);
      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error('Failed to submit job application:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Add New Job Application"
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
      destroyOnHidden
    >
      <JobSubmissionForm
        onSubmit={handleSubmit}
        onCancel={onClose}
        loading={loading}
      />
    </Modal>
  );
}

