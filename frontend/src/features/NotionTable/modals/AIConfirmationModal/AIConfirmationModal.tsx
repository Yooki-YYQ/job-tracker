import { useState } from 'react';
import { Modal } from 'antd';
import AIConfirmationForm from './AIConfirmationForm';
import type { JobSubmissionForm, ParsedJobData } from '@/types';

interface AIConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ParsedJobData) => Promise<void>;
  submissionData: JobSubmissionForm | null;
}

export default function AIConfirmationModal({ 
  open, 
  onClose, 
  onSubmit,
  submissionData 
}: AIConfirmationModalProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: ParsedJobData) => {
    try {
      setLoading(true);
      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error('Failed to confirm job application:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Confirm AI-Parsed Data"
      open={open}
      onCancel={onClose}
      footer={null}
      width={900}
      destroyOnHidden
    >
      <AIConfirmationForm
        submissionData={submissionData}
        onSubmit={handleSubmit}
        onCancel={onClose}
        loading={loading}
      />
    </Modal>
  );
}

