import { useState } from 'react';
import { Modal } from 'antd';
import AIConfirmationForm from '../AIConfirmationModal/AIConfirmationForm';
import type { Application, ParsedJobData } from '@/types';

interface EditApplicationModalProps {
  open: boolean;
  onClose: () => void;
  application: Application | null;
  onSave: (data: ParsedJobData) => Promise<void>;
}

export default function EditApplicationModal({ 
  open, 
  onClose, 
  application,
  onSave 
}: EditApplicationModalProps) {
  const [loading, setLoading] = useState(false);

  const handleSave = async (data: ParsedJobData) => {
    try {
      setLoading(true);
      await onSave(data);
      onClose();
    } catch (error) {
      console.error('Failed to update application:', error);
    } finally {
      setLoading(false);
    }
  };

  // Convert application to JobSubmissionForm format for editing
  const submissionData = application ? {
    jobUrl: application.data?.jobUrl || '',
    jobDescription: application.data?.jobDescription || '',
    files: []
  } : null;

  return (
    <Modal
      title="Edit Application"
      open={open}
      onCancel={onClose}
      footer={null}
      width={900}
      destroyOnHidden
    >
      <AIConfirmationForm
        submissionData={submissionData}
        onSubmit={handleSave}
        onCancel={onClose}
        loading={loading}
      />
    </Modal>
  );
}
