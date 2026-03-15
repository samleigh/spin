import React from 'react';
import { useToast } from '../ui/Toast';

export const RoomInfo = ({ roomId, onShare }) => {
  const { success } = useToast();
  
  const handleShare = async () => {
    const roomUrl = `${window.location.origin}/spin?room=${roomId}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join my Spin room!',
          text: `Let's connect on Spin. Room: ${roomId}`,
          url: roomUrl
        });
      } catch (err) {
        // User cancelled share
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(roomUrl);
        success('Room URL copied to clipboard!');
      } catch (err) {
        success('Room ID: ' + roomId);
      }
    }
  };

  if (!roomId) return null;

  return (
    <div style={{
      position: 'absolute',
      top: '80px',
      right: '20px',
      background: 'var(--bg2)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      padding: '16px',
      zIndex: 100,
      maxWidth: '300px'
    }}>
      <div style={{
        fontSize: '14px',
        fontWeight: '600',
        marginBottom: '8px',
        color: 'var(--text)'
      }}>
        🏠 Room: {roomId}
      </div>
      <div style={{
        fontSize: '12px',
        color: 'var(--muted)',
        marginBottom: '12px',
        lineHeight: '1.4'
      }}>
        Share this room with a friend to connect!
      </div>
      <button
        onClick={handleShare}
        style={{
          width: '100%',
          padding: '8px 12px',
          border: 'none',
          borderRadius: '8px',
          background: 'var(--warm)',
          color: 'white',
          fontSize: '12px',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'opacity 0.2s'
        }}
        onMouseOver={(e) => e.target.style.opacity = '0.8'}
        onMouseOut={(e) => e.target.style.opacity = '1'}
      >
        📤 Share Room
      </button>
    </div>
  );
};
