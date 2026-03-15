import React, { useRef, useEffect } from 'react';
import { SKIP_COST } from '../../data/spinData';

export const VideoPanel = ({ 
  userProfile, 
  connectedProfile, 
  isConnecting, 
  stream, 
  remoteStream, 
  connectionState, 
  micOn, 
  camOn, 
  sparks, 
  onSkip, 
  onToggleMic, 
  onToggleCamera 
}) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // Set local video stream
  useEffect(() => {
    if (localVideoRef.current && stream) {
      localVideoRef.current.srcObject = stream;
    }
  }, [stream]);

  // Set remote video stream
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return (
    <div className="video-panel">
      {/* Main video area - other person */}
      <div className="main-video-area">
        {isConnecting ? (
          <div className="connecting-state">
            <div className="spin-logo">
              <div className="spin-circle"></div>
              <div className="spin-text">Spin</div>
            </div>
            <div className="connecting-text">Finding someone...</div>
          </div>
        ) : connectedProfile ? (
          <>
            {remoteStream ? (
              <video 
                ref={remoteVideoRef}
                autoPlay 
                playsInline
                className="main-video"
              />
            ) : (
              <div className="waiting-video">
                <div className="video-placeholder">
                  <div className="person-avatar">
                    <img src={connectedProfile.photo} alt={connectedProfile.name} />
                  </div>
                  <div className="video-info">
                    <div className="person-name">{connectedProfile.name}</div>
                    <div className="person-status">Starting video...</div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Person info overlay when video is active */}
            {remoteStream && (
              <div className="video-overlay">
                <div className="person-info">
                  <div className="person-name">{connectedProfile.name}</div>
                  <div className="person-location">{connectedProfile.location}</div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-emoji">👤</div>
            <div className="empty-text">No one connected</div>
          </div>
        )}
        
        {/* Connection indicator */}
        {!isConnecting && connectedProfile && (
          <div className="connection-indicator">
            <div className={`status-dot ${connectionState === 'connected' ? 'connected' : 'connecting'}`}></div>
            <span>{connectionState === 'connected' ? 'Connected' : 'Connecting...'}</span>
          </div>
        )}

        {/* Your camera - small overlay frame */}
        {connectedProfile && (
          <div className="my-camera-frame">
            {stream && camOn ? (
              <video 
                ref={localVideoRef}
                autoPlay 
                muted 
                playsInline
                className="my-video"
              />
            ) : userProfile?.photo ? (
              <img 
                src={userProfile.photo} 
                alt="You"
                className="my-video"
              />
            ) : (
              <div className="my-video-placeholder">
                <div className="empty-emoji">👤</div>
                <div className="empty-text">Camera off</div>
              </div>
            )}
            
            {/* Your camera controls */}
            <div className="my-camera-controls">
              <button 
                className={`control-btn ${micOn ? 'on' : 'off'}`}
                onClick={onToggleMic}
                title={micOn ? 'Mute microphone' : 'Unmute microphone'}
              >
                {micOn ? '🎤' : '🔇'}
              </button>
              <button 
                className={`control-btn ${camOn ? 'on' : 'off'}`}
                onClick={onToggleCamera}
                title={camOn ? 'Turn off camera' : 'Turn on camera'}
              >
                {camOn ? '📹' : '📷'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Skip button */}
      <div className="skip-section">
        <div className="sparks-display">
          <span className="spark-icon">⚡</span>
          <span className="spark-count">{sparks}</span>
        </div>
        <button className="skip-btn" onClick={onSkip}>
          Spin → <span className="skip-cost">(-⚡ {SKIP_COST})</span>
        </button>
      </div>
    </div>
  );
};
