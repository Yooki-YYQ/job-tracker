import React, { useState } from 'react';
import { message } from 'antd';
import { useApplications } from './hooks/useApplications';
import { useColumns } from './hooks/useColumns';
// Removed useTableGrid import - using Ant Design Table directly
import { TableHeader, TableToolbar, TableGrid, AddPropertyButton } from './components';
import { 
  JobSubmissionModal, 
  AIConfirmationModal, 
  ApplicationDetailModal, 
  ColumnManagerModal,
  EditApplicationModal
} from './modals';
import { AISettings } from '@/shared/components';
import { applicationApi } from '@/services/api';
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
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [isColumnManagerModalOpen, setIsColumnManagerModalOpen] = useState(false);
  const [isAISettingsModalOpen, setIsAISettingsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState<Application | null>(null);
  const [submissionData, setSubmissionData] = useState<JobSubmissionForm | null>(null);
  const [deletedAppId, setDeletedAppId] = useState<string | null>(null);

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

  const handleAISettings = () => {
    setIsAISettingsModalOpen(true);
  };

  const handleEditApplication = (application: Application) => {
    setEditingApplication(application);
    setIsEditModalOpen(true);
    setIsDetailModalOpen(false);
  };

  const handleDeleteApplication = async (application: Application) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await deleteApplication(application.id);
        setDeletedAppId(application.id);
        refreshApplications();
        setIsDetailModalOpen(false);
        
        // Show undo message
        message.success({
          content: 'Application deleted',
          duration: 30,
          action: (
            <button 
              onClick={handleUndoDelete}
              style={{ 
                background: 'transparent', 
                border: 'none', 
                color: '#1890ff', 
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Undo
            </button>
          )
        });
      } catch (error) {
        console.error('Failed to delete application:', error);
      }
    }
  };

  const handleUndoDelete = async () => {
    if (!deletedAppId) return;
    
    try {
      await applicationApi.restore(deletedAppId);
      setDeletedAppId(null);
      refreshApplications();
      message.success('Application restored');
    } catch (error) {
      console.error('Failed to restore application:', error);
      message.error('Failed to restore application');
    }
  };

  const handleSaveEdit = async (data: ParsedJobData) => {
    if (!editingApplication) return;
    
    try {
      await updateApplication(editingApplication.id, { data });
      refreshApplications();
      setIsEditModalOpen(false);
      setEditingApplication(null);
    } catch (error) {
      console.error('Failed to update application:', error);
      throw error;
    }
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
        onAISettings={handleAISettings}
      />
      <TableGrid
        data={applications}
        columns={columns}
        loading={loading}
        onRowClick={handleRowClick}
        pagination={pagination}
        onPaginationChange={setPagination}
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
        onEdit={handleEditApplication}
        onDelete={handleDeleteApplication}
      />
      
      <ColumnManagerModal
        open={isColumnManagerModalOpen}
        onClose={() => setIsColumnManagerModalOpen(false)}
        columns={columns}
        onAddColumn={addColumn}
        onUpdateColumn={updateColumn}
        onRemoveColumn={removeColumn}
      />
      
      <AISettings
        open={isAISettingsModalOpen}
        onClose={() => setIsAISettingsModalOpen(false)}
      />
      
      <EditApplicationModal
        open={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingApplication(null);
        }}
        application={editingApplication}
        onSave={handleSaveEdit}
      />
    </div>
  );
}
