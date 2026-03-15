import React from 'react';

export const ConnectionIndicator = ({ connectionState, quality }) => {
  const getStateColor = () => {
    switch (connectionState) {
      case 'connected': return 'var(--green)';
      case 'connecting': return 'var(--warm)';
      case 'disconnected': return 'var(--muted)';
      default: return 'var(--muted)';
    }
  };

  const getStateText = () => {
    switch (connectionState) {
      case 'connected': return quality ? `Good (${quality}ms)` : 'Connected';
      case 'connecting': return 'Connecting...';
      case 'disconnected': return 'Disconnected';
      default: return 'Unknown';
    }
  };

  return (
    <div className="connection-indicator" style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '6px',
      fontSize: '11px',
      color: getStateColor(),
      fontWeight: '500'
    }}>
      <div className="connection-dot" style={{
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        background: getStateColor(),
        animation: connectionState === 'connecting' ? 'blink 1.5s ease-in-out infinite' : 'none'
      }}></div>
      <span>{getStateText()}</span>
    </div>
  );
};
