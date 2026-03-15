import React, { useState, useEffect, useRef } from 'react';
import { SpinLanding } from '../components/spin/SpinLanding';
import { AgeGate } from '../components/spin/AgeGate';
import { OnboardingFlow } from '../components/spin/OnboardingFlow';
import { MainApp } from '../components/spin/MainApp';
import { PurchaseModal } from '../components/spin/PurchaseModal';
import { SuccessScreen } from '../components/spin/SuccessScreen';
import { ToastProvider } from '../components/ui/Toast';
import { StorageManager } from '../utils/storage';
import '../styles/spin.css';
import '../styles/toast.css';

const SCREENS = {
  LANDING: 'landing',
  AGE_GATE: 'age-gate',
  ONBOARDING: 'onboarding',
  MAIN_APP: 'main-app',
  PURCHASE: 'purchase',
  SUCCESS: 'success'
};

export const Spin = () => {
  const [currentScreen, setCurrentScreen] = useState(SCREENS.LANDING);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [stream, setStream] = useState(null);
  
  // Load saved data on mount
  const [userProfile, setUserProfile] = useState(() => {
    const saved = StorageManager.loadUserProfile();
    return saved || {
      gender: '',
      age: '',
      lookingFor: '',
      interests: [],
      cameraEnabled: false,
      photo: null
    };
  });
  
  const [appState, setAppState] = useState(() => {
    const saved = StorageManager.loadAppState();
    return saved || {
      sparks: 50,
      skipCount: 0,
      liveCount: 14203,
      micOn: true,
      camOn: true,
      connectedProfile: null,
      isConnecting: false
    };
  });

  // Handle screen transitions
  const goToScreen = (screen) => {
    setCurrentScreen(screen);
  };

  // Handle age gate
  const handleAgeGate = (isAdult) => {
    if (isAdult) {
      goToScreen(SCREENS.ONBOARDING);
    } else {
      goToScreen(SCREENS.LANDING);
    }
  };

  // Handle onboarding completion
  const handleOnboardingComplete = (profile, mediaStream) => {
    setUserProfile(profile);
    setStream(mediaStream);
    goToScreen(SCREENS.MAIN_APP);
  };

  // Handle purchase modal
  const handleOpenPurchase = () => {
    setShowPurchaseModal(true);
  };

  const handleClosePurchase = () => {
    setShowPurchaseModal(false);
  };

  const handlePurchaseSuccess = (sparksGained) => {
    setAppState(prev => ({
      ...prev,
      sparks: prev.sparks + sparksGained
    }));
    setShowPurchaseModal(false);
    goToScreen(SCREENS.SUCCESS);
  };

  // Handle exit from app
  const handleExit = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    goToScreen(SCREENS.LANDING);
  };

  // Save app state when it changes
  useEffect(() => {
    StorageManager.saveAppState(appState);
  }, [appState.sparks, appState.skipCount]);

  // Save user profile when it changes
  useEffect(() => {
    if (userProfile.gender || userProfile.age || userProfile.interests.length > 0) {
      StorageManager.saveUserProfile(userProfile);
    }
  }, [userProfile]);

  // Update live count periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setAppState(prev => ({
        ...prev,
        liveCount: Math.max(12000, prev.liveCount + Math.floor(Math.random() * 40) - 20)
      }));
    }, 3800);

    return () => clearInterval(interval);
  }, []);

  // Cleanup stream on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const renderScreen = () => {
    switch (currentScreen) {
      case SCREENS.LANDING:
        return <SpinLanding onStart={() => goToScreen(SCREENS.AGE_GATE)} />;
      
      case SCREENS.AGE_GATE:
        return <AgeGate onConfirm={handleAgeGate} />;
      
      case SCREENS.ONBOARDING:
        return (
          <OnboardingFlow
            onComplete={handleOnboardingComplete}
            onCancel={() => goToScreen(SCREENS.LANDING)}
          />
        );
      
      case SCREENS.MAIN_APP:
        return (
          <MainApp
            userProfile={userProfile}
            appState={appState}
            setAppState={setAppState}
            stream={stream}
            setStream={setStream}
            onOpenPurchase={handleOpenPurchase}
            onExit={handleExit}
          />
        );
      
      case SCREENS.SUCCESS:
        return (
          <SuccessScreen
            sparksGained={appState.sparks}
            onBack={() => goToScreen(SCREENS.MAIN_APP)}
          />
        );
      
      default:
        return <SpinLanding onStart={() => goToScreen(SCREENS.AGE_GATE)} />;
    }
  };

  return (
    <ToastProvider>
      <div className="spin-app">
        <div className={`screen ${currentScreen === SCREENS.LANDING ? 'active' : ''}`}>
          {currentScreen === SCREENS.LANDING && renderScreen()}
        </div>
        
        <div className={`screen ${currentScreen === SCREENS.AGE_GATE ? 'active' : ''}`}>
          {currentScreen === SCREENS.AGE_GATE && renderScreen()}
        </div>
        
        <div className={`screen ${currentScreen === SCREENS.ONBOARDING ? 'active' : ''}`}>
          {currentScreen === SCREENS.ONBOARDING && renderScreen()}
        </div>
        
        <div className={`screen ${currentScreen === SCREENS.MAIN_APP ? 'active' : ''}`}>
          {currentScreen === SCREENS.MAIN_APP && renderScreen()}
        </div>
        
        <div className={`screen ${currentScreen === SCREENS.SUCCESS ? 'active' : ''}`}>
          {currentScreen === SCREENS.SUCCESS && renderScreen()}
        </div>

        {/* Purchase Modal - shown overlay */}
        <PurchaseModal
          isOpen={showPurchaseModal}
          onClose={handleClosePurchase}
          onSuccess={handlePurchaseSuccess}
        />
      </div>
    </ToastProvider>
  );
};
