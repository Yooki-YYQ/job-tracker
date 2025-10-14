import React from 'react';

interface TableHeaderProps {
  title: string;
}

export default function TableHeader({ title }: TableHeaderProps) {
  return (
    <div style={{ 
      padding: '8px 16px', 
      background: 'white', 
      borderBottom: '1px solid #e9ecef',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '16px', cursor: 'pointer', color: '#6c757d' }}>☰</span>
        <span style={{ fontSize: '14px', fontWeight: '500', color: '#212529' }}>{title}</span>
        <span style={{ fontSize: '12px', color: '#6c757d' }}>🔒 Private</span>
        <span style={{ fontSize: '12px', color: '#6c757d', cursor: 'pointer' }}>⌄</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '12px', color: '#6c757d' }}>Edited 1d ago</span>
        <button style={{ 
          padding: '4px 8px', 
          background: 'transparent', 
          border: '1px solid #dee2e6', 
          borderRadius: '4px',
          fontSize: '12px',
          cursor: 'pointer',
          color: '#6c757d'
        }}>Share</button>
        <span style={{ fontSize: '16px', cursor: 'pointer', color: '#6c757d' }}>⭐</span>
        <span style={{ fontSize: '16px', cursor: 'pointer', color: '#6c757d' }}>⋯</span>
      </div>
    </div>
  );
}
