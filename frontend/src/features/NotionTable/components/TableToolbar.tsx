import React from 'react';

interface TableToolbarProps {
  onAddRecord: () => void;
  onRefresh: () => void;
  onAISettings: () => void;
}

export default function TableToolbar({ onAddRecord, onRefresh, onAISettings }: TableToolbarProps) {
  return (
    <div style={{ 
      padding: '16px 16px 0 16px',
      background: 'white'
    }}>
      <div style={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <h1 style={{ 
          margin: 0, 
          fontSize: '24px', 
          fontWeight: '600',
          color: '#212529'
        }}>
          Job Tracker
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            onClick={onAISettings}
            style={{ 
              padding: '6px 12px', 
              background: '#f8f9fa', 
              border: '1px solid #dee2e6', 
              borderRadius: '4px',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#6c757d'
            }}
          >
            <span>⚙️</span> AI Settings
          </button>
          <button 
            onClick={onAddRecord}
            style={{ 
              padding: '6px 12px', 
              background: '#1890ff', 
              color: 'white',
              border: 'none', 
              borderRadius: '4px',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            New <span>⌄</span>
          </button>
        </div>
      </div>
    </div>
  );
}
