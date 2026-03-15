import React, { useState, useRef, useEffect } from 'react';
import { useToast } from '../ui/Toast';

export const PhotoCapture = ({ onPhotoCapture, onPhotoConfirm, initialPhoto = null }) => {
  const { success, error } = useToast();
  const [photo, setPhoto] = useState(initialPhoto);
  const [stream, setStream] = useState(null);
  const [isCapturing, setIsCapturing] = useState(!initialPhoto);
  const [facingMode, setFacingMode] = useState('user');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (isCapturing) {
      startCamera();
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCapturing, facingMode]);

  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: facingMode
        }
      };
      
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Camera access failed:', err);
      error('Camera access denied. Please allow camera permissions.');
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert to blob and create URL
      canvas.toBlob((blob) => {
        const photoUrl = URL.createObjectURL(blob);
        setPhoto(photoUrl);
        setIsCapturing(false);
        success('Photo captured! 👍');
        
        // Stop camera stream
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
          setStream(null);
        }
        
        // Don't call onPhotoCapture here - wait for user confirmation
      }, 'image/jpeg', 0.8);
    }
  };

  const retakePhoto = () => {
    if (photo) {
      URL.revokeObjectURL(photo);
      setPhoto(null);
    }
    setIsCapturing(true);
  };

  const switchCamera = () => {
    const newMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newMode);
    
    // Stop current stream and restart with new facing mode
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const confirmPhoto = () => {
    if (photo) {
      onPhotoConfirm(photo);
    }
  };

  return (
    <div style={{ textAlign: 'center', width: '100%' }}>
      <h3 style={{ marginBottom: '20px', fontFamily: 'Fraunces, serif', fontSize: '24px', fontWeight: '700' }}>
        Your Profile Photo
      </h3>
      <p style={{ color: 'var(--muted)', marginBottom: '30px', lineHeight: '1.6' }}>
        This is what others will see before connecting. Make sure it clearly shows your face!
      </p>

      {isCapturing ? (
        <div style={{ position: 'relative', maxWidth: '400px', margin: '0 auto' }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: '100%',
              borderRadius: '20px',
              background: 'var(--bg2)',
              transform: facingMode === 'user' ? 'scaleX(-1)' : 'none'
            }}
          />
          
          {/* Camera overlay frame */}
          <div style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            borderRadius: '20px',
            border: '3px solid rgba(196, 98, 58, 0.3)',
            background: 'radial-gradient(circle at center, transparent 60%, rgba(196, 98, 58, 0.1) 100%)'
          }}></div>
          
          {/* Controls */}
          <div style={{ marginTop: '20px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={switchCamera}
              style={{
                padding: '12px 20px',
                border: '1.5px solid var(--border2)',
                borderRadius: '12px',
                background: 'var(--bg2)',
                color: 'var(--text)',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              🔄 Switch Camera
            </button>
            
            <button
              onClick={capturePhoto}
              style={{
                padding: '12px 24px',
                border: 'none',
                borderRadius: '12px',
                background: 'var(--warm)',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                boxShadow: '0 4px 16px var(--warm-glow)'
              }}
            >
              📸 Capture Photo
            </button>
          </div>
        </div>
      ) : (
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
          {photo && (
            <img
              src={photo}
              alt="Your profile photo"
              style={{
                width: '100%',
                borderRadius: '20px',
                border: '3px solid var(--warm)',
                marginBottom: '20px'
              }}
            />
          )}
          
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={retakePhoto}
              style={{
                padding: '12px 20px',
                border: '1.5px solid var(--border2)',
                borderRadius: '12px',
                background: 'var(--bg2)',
                color: 'var(--text)',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              🔄 Retake
            </button>
            
            <button
              onClick={confirmPhoto}
              style={{
                padding: '12px 24px',
                border: 'none',
                borderRadius: '12px',
                background: 'var(--green)',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                boxShadow: '0 4px 16px rgba(45, 158, 107, 0.2)'
              }}
            >
              ✅ Use This Photo
            </button>
          </div>
        </div>
      )}

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};
