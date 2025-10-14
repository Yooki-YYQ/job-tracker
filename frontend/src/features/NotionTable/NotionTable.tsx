import React, { useState } from 'react';
import { useApplications } from './hooks/useApplications';
import { useColumns } from './hooks/useColumns';
// Removed useTableGrid import - using Ant Design Table directly
import { TableHeader, TableToolbar, TableGrid, AddPropertyButton } from './components';
import { 
  JobSubmissionModal, 
  AIConfirmationModal, 
  ApplicationDetailModal, 
  ColumnManagerModal 
} from './modals';
import type { JobSubmissionForm, ParsedJobData, Application } from '@/types';

export default function NotionTable() {
  const { 
    applications, 
    loading, 
    createApplication, 
    updateApplication, 
    deleteApplication, 
    refreshApplications 
  } = useApplications();
  
  const { columns, addColumn, updateColumn, removeColumn } = useColumns();
  // Remove useTableGrid hook - no longer needed with Ant Design Table
  
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);
  const [isAIConfirmationModalOpen, setIsAIConfirmationModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isColumnManagerModalOpen, setIsColumnManagerModalOpen] = useState(false);
  const [submissionData, setSubmissionData] = useState<JobSubmissionForm | null>(null);

  const handleRowClick = (record: Application) => {
    setSelectedAppId(record.id);
    setIsDetailModalOpen(true);
  };

  const handleAddRecord = () => {
    setIsSubmissionModalOpen(true);
  };

  const handleAddProperty = () => {
    setIsColumnManagerModalOpen(true);
  };

  const handleJobSubmission = async (data: JobSubmissionForm) => {
    setSubmissionData(data);
    setIsSubmissionModalOpen(false);
    setIsAIConfirmationModalOpen(true);
  };

  const handleAIConfirmation = async (data: any) => {
    try {
      await createApplication(data);
      setIsAIConfirmationModalOpen(false);
      setSubmissionData(null);
      refreshApplications(); // Refresh data after successful submission
    } catch (error) {
      console.error('Failed to create application:', error);
    }
  };

  return (
    <div className="notion-table">
      <TableHeader title="Job Tracker" />
      <TableToolbar 
        onAddRecord={handleAddRecord}
        onRefresh={refreshApplications}
      />
      <TableGrid
        data={applications}
        columns={columns}
        loading={loading}
        onRowClick={handleRowClick}
      />
      <AddPropertyButton onAddProperty={handleAddProperty} />
      
      {/* Modals */}
      <JobSubmissionModal 
        open={isSubmissionModalOpen}
        onClose={() => setIsSubmissionModalOpen(false)}
        onSubmit={handleJobSubmission}
      />
      
      <AIConfirmationModal
        open={isAIConfirmationModalOpen}
        onClose={() => {
          setIsAIConfirmationModalOpen(false);
          setSubmissionData(null);
        }}
        onSubmit={handleAIConfirmation}
        submissionData={submissionData}
      />
      
      <ApplicationDetailModal 
        open={isDetailModalOpen}
        applicationId={selectedAppId}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedAppId(null);
        }}
      />
      
      <ColumnManagerModal
        open={isColumnManagerModalOpen}
        onClose={() => setIsColumnManagerModalOpen(false)}
        columns={columns}
        onAddColumn={addColumn}
        onUpdateColumn={updateColumn}
        onRemoveColumn={removeColumn}
      />
    </div>
  );
}
