import React from 'react';

interface AddPropertyButtonProps {
  onAddProperty: () => void;
}

export default function AddPropertyButton({ onAddProperty }: AddPropertyButtonProps) {
  return (
    <div style={{ 
      padding: '16px',
      background: 'white',
      display: 'flex',
      justifyContent: 'flex-end'
    }}>
      <button 
        onClick={onAddProperty}
        style={{ 
          padding: '8px 16px', 
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
        + Add property
      </button>
    </div>
  );
}
