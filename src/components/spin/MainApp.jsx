import React, { useState, useEffect, useRef } from 'react';
import { TopNav } from './TopNav';
import { VideoPanel } from './VideoPanel';
import { SidebarTabs } from './SidebarTabs';
import { useToast } from '../ui/Toast';
import { SKIP_COST, getRandomProfile, getRandomItem } from '../../data/spinData';
import { SimplePeerConnection, RoomManager } from '../../utils/simplePeer';
import { StorageManager } from '../../utils/storage';

export const MainApp = ({ userProfile, appState, setAppState, stream, onOpenPurchase, onExit, setStream }) => {
  const { success, error, warning } = useToast();
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState(() => {
    const saved = StorageManager.loadChatHistory();
    return saved.length > 0 ? saved : [
      { id: 1, type: 'system', text: 'Connecting you to real people — say hi 👋' }
    ];
  });
  const [connectionTimeout, setConnectionTimeout] = useState(null);
  const [peerConnection] = useState(() => new SimplePeerConnection());
  const [remoteStream, setRemoteStream] = useState(null);
  const [connectionState, setConnectionState] = useState('disconnected');

  // Initialize peer connection
  useEffect(() => {
    peerConnection.onRemoteStream(setRemoteStream);
    peerConnection.onConnectionState(setConnectionState);
    
    return () => {
      peerConnection.close();
    };
  }, [peerConnection]);

  // Handle connection to new person
  const connectToPerson = async () => {
    setAppState(prev => ({ ...prev, isConnecting: true, connectedProfile: null }));
    
    // Clear any existing timeout
    if (connectionTimeout) {
      clearTimeout(connectionTimeout);
    }

    try {
      // Initialize local stream if not already done
      if (!stream) {
        const localStream = await peerConnection.initializeLocalStream();
        setStream(localStream);
      }

      // Create peer connection
      await peerConnection.createPeerConnection();

      // Show spinning logo for 2 seconds, then connect to person
      const timeout = setTimeout(() => {
        const newProfile = getRandomProfile();
        setAppState(prev => ({ 
          ...prev, 
          isConnecting: false, 
          connectedProfile: newProfile 
        }));
        
        // Add system message
        addSystemMessage(`Connected · ${newProfile.name} · ${newProfile.location}`);
        
        // Show toast
        success(`👋 Say hello to ${newProfile.name.split(',')[0]}!`);
        
        // Start simulated video stream after connection
        setTimeout(() => {
          // Simulate remote video stream
          peerConnection.simulateRemoteStream();
          
          // Simulate greeting after delay
          setTimeout(() => {
            addMessage('them', newProfile.emoji, getRandomItem([
              'hey! 👋', 'hi there!', 'what\'s up?', 'hey, where are you from?', 'hi! how\'s your day going?'
            ]));
          }, Math.random() * 1600 + 600);
        }, 500);
      }, 2000); // Fixed 2 second connection time

      setConnectionTimeout(timeout);
    } catch (err) {
      error('Failed to initialize camera. Please check permissions.');
      setAppState(prev => ({ ...prev, isConnecting: false }));
    }
  };

  // Handle skip
  const handleSkip = () => {
    if (appState.sparks < SKIP_COST) {
      warning('⚡ Out of sparks — top up to keep going!');
      onOpenPurchase();
      return;
    }

    // Clear any existing connection
    if (connectionTimeout) {
      clearTimeout(connectionTimeout);
    }
    
    // Reset connection state
    setRemoteStream(null);
    setConnectionState('disconnected');

    setAppState(prev => {
      const newSkipCount = prev.skipCount + 1;
      const sparksAfterSkip = prev.sparks - SKIP_COST;
      
      // Award streak bonus every 10 skips
      let finalSparks = sparksAfterSkip;
      if (newSkipCount % 10 === 0) {
        finalSparks += 30;
        success('🔥 10-skip streak! +30 bonus sparks');
      }
      
      return {
        ...prev,
        sparks: finalSparks,
        skipCount: newSkipCount
      };
    });

    addSystemMessage('Skipped — finding your next match…');
    connectToPerson();
  };

  // Handle message sending
  const handleSendMessage = (text) => {
    addMessage('me', '😊', text);
    
    // Simulate reply
    setTimeout(() => {
      addMessage('them', getRandomItem(['😊', '🤙', '😄', '👋', '🙌']), getRandomItem([
        'haha that\'s so true', 'same actually 😄', 'where are you from?', 'I love that',
        'no way, really?', 'agreed honestly', 'lol right?', 'that\'s wild', 'fair point', 'totally'
      ]));
    }, Math.random() * 1500 + 700);
  };

  // Add message
  const addMessage = (sender, avatar, text) => {
    const newMessage = {
      id: Date.now(),
      type: 'message',
      sender,
      avatar,
      text,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => {
      const updated = [...prev, newMessage];
      StorageManager.saveChatHistory(updated);
      return updated;
    });
  };

  // Add system message
  const addSystemMessage = (text) => {
    const newMessage = {
      id: Date.now(),
      type: 'system',
      text,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => {
      const updated = [...prev, newMessage];
      StorageManager.saveChatHistory(updated);
      return updated;
    });
  };

  // Show toast (simple implementation)
  const showToast = (message) => {
    // This would be implemented with a proper toast system
    console.log('Toast:', message);
  };

  // Handle media controls
  const toggleMic = () => {
    if (stream) {
      const audioTracks = stream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !appState.micOn;
      });
    }
    if (peerConnection) {
      peerConnection.toggleAudio(!appState.micOn);
    }
    setAppState(prev => ({ ...prev, micOn: !prev.micOn }));
  };

  const toggleCamera = () => {
    if (stream) {
      const videoTracks = stream.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !appState.camOn;
      });
    }
    if (peerConnection) {
      peerConnection.toggleVideo(!appState.camOn);
    }
    setAppState(prev => ({ ...prev, camOn: !prev.camOn }));
  };

  // Initialize connection
  useEffect(() => {
    connectToPerson();
    
    return () => {
      if (connectionTimeout) {
        clearTimeout(connectionTimeout);
      }
    };
  }, []);

  return (
    <div className="main-app">
      <TopNav
        sparks={appState.sparks}
        liveCount={appState.liveCount}
        onOpenPurchase={onOpenPurchase}
        onExit={onExit}
      />
      
      <div className="app-body">
        <VideoPanel
          userProfile={userProfile}
          connectedProfile={appState.connectedProfile}
          isConnecting={appState.isConnecting}
          stream={stream}
          remoteStream={remoteStream}
          connectionState={connectionState}
          micOn={appState.micOn}
          camOn={appState.camOn}
          sparks={appState.sparks}
          onSkip={handleSkip}
          onToggleMic={toggleMic}
          onToggleCamera={toggleCamera}
        />
        
        <SidebarTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          messages={messages}
          sparks={appState.sparks}
          onSendMessage={handleSendMessage}
          onOpenPurchase={onOpenPurchase}
        />
      </div>
    </div>
  );
};
