import React, { useState, useRef, useEffect } from 'react';
import { INTERESTS_ALL } from '../../data/spinData';
import { PhotoCapture } from './PhotoCapture';

const OnboardingStep1 = ({ onNext }) => {
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [lookingFor, setLookingFor] = useState('');

  const handleNext = () => {
    onNext({ gender, age, lookingFor });
  };

  return (
    <>
      <h2>Quick setup</h2>
      <p className="sub">Tell us a bit about yourself so we can show you to the right people.</p>
      <div className="field-row">
        <div>
          <div className="field-lbl">I'm</div>
          <select 
            className="field-select" 
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">My gender…</option>
            <option>A man</option>
            <option>A woman</option>
            <option>Non-binary</option>
            <option>Prefer not to say</option>
          </select>
        </div>
        <div>
          <div className="field-lbl">Age</div>
          <select 
            className="field-select"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          >
            <option value="">My age…</option>
            {Array.from({ length: 38 }, (_, i) => (
              <option key={i}>{i + 18}</option>
            ))}
          </select>
        </div>
      </div>
      <div style={{ marginTop: '8px' }}>
        <div className="field-lbl" style={{ marginBottom: '8px' }}>Looking for</div>
        <select 
          className="field-select"
          value={lookingFor}
          onChange={(e) => setLookingFor(e.target.value)}
        >
          <option value="">I'm open to…</option>
          <option>Dating & relationships</option>
          <option>Making new friends</option>
          <option>Casual conversation</option>
          <option>Networking</option>
          <option>Just exploring</option>
        </select>
      </div>
      <button 
        className="btn-warm" 
        onClick={handleNext}
        style={{ marginTop: '28px', maxWidth: '100%', width: '100%' }}
      >
        Continue
      </button>
    </>
  );
};

const OnboardingStep2 = ({ onNext, initialInterests = [] }) => {
  const [selectedInterests, setSelectedInterests] = useState(initialInterests);

  const toggleInterest = (interest) => {
    setSelectedInterests(prev => {
      if (prev.includes(interest)) {
        return prev.filter(i => i !== interest);
      } else {
        return [...prev, interest];
      }
    });
  };

  const handleNext = () => {
    onNext(selectedInterests);
  };

  return (
    <>
      <h2>What are you into?</h2>
      <p className="sub">Pick a few interests — we'll match you with people who share them. You can always change these later.</p>
      <div className="int-grid" id="intGrid">
        {INTERESTS_ALL.map(interest => (
          <button
            key={interest}
            className={`itag ${selectedInterests.includes(interest) ? 'on' : ''}`}
            onClick={() => toggleInterest(interest)}
          >
            {interest}
          </button>
        ))}
      </div>
      <button 
        className="btn-warm" 
        onClick={handleNext}
        style={{ maxWidth: '100%', width: '100%' }}
      >
        Continue
      </button>
    </>
  );
};

const OnboardingStep3 = ({ onNext, onCancel }) => {
  const [stream, setStream] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  const videoRef = useRef(null);

  const enableCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setCameraReady(true);
    } catch (error) {
      console.log('Camera access denied:', error);
      setCameraReady(true); // Allow continuing without camera
    }
  };

  const handleNext = () => {
    onNext({ stream, cameraReady });
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <>
      <h2>Set up your camera</h2>
      <p className="sub">Allow camera and mic access to start meeting people. You're in control — turn them off any time.</p>
      <div className="cam-preview">
        <div className="cam-ph" id="camPh" style={{ display: stream ? 'none' : 'flex' }}>
          <div className="ci">📷</div>
          <p>Your camera preview</p>
        </div>
        <video 
          ref={videoRef}
          id="setupVid" 
          autoPlay 
          muted 
          playsInline
          style={{ display: stream ? 'block' : 'none' }}
        />
      </div>
      <button 
        className="cam-btn" 
        onClick={enableCamera}
        style={{ 
          borderColor: cameraReady ? 'var(--green)' : 'var(--border2)',
          color: cameraReady ? 'var(--green)' : 'var(--text)',
          background: cameraReady ? 'var(--green-light)' : 'var(--bg2)'
        }}
      >
        {cameraReady ? '✓ Camera & Mic Enabled' : 'Enable Camera & Microphone'}
      </button>
      <button 
        className="btn-warm" 
        onClick={handleNext}
        style={{ maxWidth: '100%', width: '100%' }}
      >
        Enter Spin →
      </button>
    </>
  );
};

const OnboardingStep4 = ({ onNext, onCancel }) => {
  const [photo, setPhoto] = useState(null);

  const handlePhotoCapture = (photoUrl) => {
    setPhoto(photoUrl);
  };

  const handlePhotoConfirm = (photoUrl) => {
    setPhoto(photoUrl);
    onNext({ photo: photoUrl });
  };

  return (
    <PhotoCapture
      onPhotoCapture={handlePhotoCapture}
      onPhotoConfirm={handlePhotoConfirm}
      initialPhoto={photo}
    />
  );
};

// Photo preview component for navigation
const PhotoPreview = ({ photo }) => {
  if (!photo) return null;
  
  return (
    <img 
      src={photo} 
      alt="Profile preview"
      style={{
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        objectFit: 'cover',
        border: '2px solid var(--warm)',
        marginLeft: '8px'
      }}
    />
  );
};

export const OnboardingFlow = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState(1);
  const [profileData, setProfileData] = useState({
    step1: {},
    step2: [],
    step3: {},
    step4: {}
  });

  const handleStep1Next = (data) => {
    setProfileData(prev => ({ ...prev, step1: data }));
    setStep(2);
  };

  const handleStep2Next = (interests) => {
    setProfileData(prev => ({ ...prev, step2: interests }));
    setStep(3);
  };

  const handleStep3Next = ({ stream, cameraReady }) => {
    setProfileData(prev => ({ ...prev, step3: { stream, cameraReady } }));
    setStep(4);
  };

  const handleStep4Next = ({ photo }) => {
    setProfileData(prev => ({ ...prev, step4: { photo } }));
    
    const finalProfile = {
      ...profileData.step1,
      interests: profileData.step2,
      cameraEnabled: profileData.step3.cameraReady,
      photo: profileData.step4.photo
    };
    
    onComplete(finalProfile, profileData.step3.stream);
  };

  const getStepLabel = () => {
    switch (step) {
      case 1: return 'Step 1 of 4';
      case 2: return 'Step 2 of 4';
      case 3: return 'Step 3 of 4';
      case 4: return 'Step 4 of 4';
      default: return '';
    }
  };

  return (
    <div className="spin-onboarding">
      <div className="onboard-nav">
        <div className="on-logo">
          Spin
          <PhotoPreview photo={profileData.step4?.photo} />
        </div>
        <div className="on-step">{getStepLabel()}</div>
      </div>
      <div className="onboard-body">
        <div className="onboard-card" id="onboardCard">
          {step === 1 && <OnboardingStep1 onNext={handleStep1Next} />}
          {step === 2 && <OnboardingStep2 onNext={handleStep2Next} initialInterests={profileData.step2} />}
          {step === 3 && <OnboardingStep3 onNext={handleStep3Next} onCancel={onCancel} />}
          {step === 4 && <OnboardingStep4 onNext={handleStep4Next} onCancel={onCancel} />}
        </div>
      </div>
    </div>
  );
};
