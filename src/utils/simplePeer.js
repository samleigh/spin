// Simple peer-to-peer connection for testing
export class SimplePeerConnection {
  constructor() {
    this.localStream = null;
    this.remoteStream = null;
    this.peerConnection = null;
    this.roomId = null;
    this.isInitiator = false;
    this.onRemoteStreamCallback = null;
    this.onConnectionStateCallback = null;
    this.onMessageCallback = null;
    this.ws = null;
  }

  async initializeLocalStream() {
    try {
      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: true
      };

      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      return this.localStream;
    } catch (error) {
      console.error('Failed to get local stream:', error);
      throw error;
    }
  }

  createPeerConnection() {
    const config = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' }
      ]
    };

    this.peerConnection = new RTCPeerConnection(config);

    // Add local tracks
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        this.peerConnection.addTrack(track, this.localStream);
      });
    }

    // Handle remote tracks
    this.peerConnection.ontrack = (event) => {
      this.remoteStream = event.streams[0];
      if (this.onRemoteStreamCallback) {
        this.onRemoteStreamCallback(this.remoteStream);
      }
    };

    // Handle connection state changes
    this.peerConnection.onconnectionstatechange = () => {
      if (this.onConnectionStateCallback) {
        this.onConnectionStateCallback(this.peerConnection.connectionState);
      }
    };

    // Handle ICE candidates
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate && this.ws) {
        this.sendSignalingMessage({
          type: 'ice-candidate',
          candidate: event.candidate,
          roomId: this.roomId
        });
      }
    };

    return this.peerConnection;
  }

  async connectToRoom(roomId, isInitiator = false) {
    this.roomId = roomId;
    this.isInitiator = isInitiator;

    // Connect to signaling server
    this.ws = new WebSocket('wss://simple-peer-signaling.onrender.com');
    
    this.ws.onopen = () => {
      this.sendSignalingMessage({
        type: 'join-room',
        roomId: roomId,
        isInitiator: isInitiator
      });
    };

    this.ws.onmessage = async (event) => {
      const message = JSON.parse(event.data);
      await this.handleSignalingMessage(message);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      // Fallback to demo mode if WebSocket fails
      this.startDemoMode();
    };
  }

  async handleSignalingMessage(message) {
    switch (message.type) {
      case 'offer':
        await this.handleOffer(message.offer);
        break;
      case 'answer':
        await this.handleAnswer(message.answer);
        break;
      case 'ice-candidate':
        await this.handleIceCandidate(message.candidate);
        break;
      case 'room-joined':
        if (this.isInitiator) {
          await this.createAndSendOffer();
        }
        break;
      case 'peer-disconnected':
        if (this.onConnectionStateCallback) {
          this.onConnectionStateCallback('disconnected');
        }
        break;
    }
  }

  async createAndSendOffer() {
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    
    this.sendSignalingMessage({
      type: 'offer',
      offer: offer,
      roomId: this.roomId
    });
  }

  async handleOffer(offer) {
    await this.peerConnection.setRemoteDescription(offer);
    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);
    
    this.sendSignalingMessage({
      type: 'answer',
      answer: answer,
      roomId: this.roomId
    });
  }

  async handleAnswer(answer) {
    await this.peerConnection.setRemoteDescription(answer);
  }

  async handleIceCandidate(candidate) {
    await this.peerConnection.addIceCandidate(candidate);
  }

  sendSignalingMessage(message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  startDemoMode() {
    // Fallback demo mode with simulated connection
    console.log('Starting demo mode - no real peer connection');
    
    // Create a simulated remote stream
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');
    
    let frame = 0;
    const draw = () => {
      ctx.fillStyle = '#141414';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#ff4757';
      ctx.font = '48px DM Sans';
      ctx.textAlign = 'center';
      ctx.fillText('Demo Mode', canvas.width / 2, canvas.height / 2 - 40);
      ctx.font = '24px DM Sans';
      ctx.fillText('Waiting for another user...', canvas.width / 2, canvas.height / 2 + 20);
      
      frame++;
      if (frame < 300) {
        requestAnimationFrame(draw);
      }
    };
    draw();

    const stream = canvas.captureStream(30);
    this.remoteStream = stream;
    
    if (this.onRemoteStreamCallback) {
      this.onRemoteStreamCallback(stream);
    }
    
    if (this.onConnectionStateCallback) {
      this.onConnectionStateCallback('connected');
    }
  }

  simulateRemoteStream() {
    // Create a simulated remote video stream
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    
    // Create animated video simulation
    let frame = 0;
    const drawFrame = () => {
      // Clear canvas
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw animated circle
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = 50 + Math.sin(frame * 0.05) * 20;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.fillStyle = '#e74c3c';
      ctx.fill();
      
      // Draw text
      ctx.fillStyle = 'white';
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Video Call', centerX, centerY + 100);
      
      frame++;
    };
    
    // Create stream from canvas
    const stream = canvas.captureStream(30);
    this.remoteStream = stream;
    
    // Start animation
    const animate = () => {
      drawFrame();
      requestAnimationFrame(animate);
    };
    animate();
    
    // Notify about remote stream
    if (this.onRemoteStreamCallback) {
      this.onRemoteStreamCallback(stream);
    }
    
    if (this.onConnectionStateCallback) {
      this.onConnectionStateCallback('connected');
    }
  }

  toggleAudio(enabled) {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach(track => {
        track.enabled = enabled;
      });
    }
  }

  toggleVideo(enabled) {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach(track => {
        track.enabled = enabled;
      });
    }
  }

  close() {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
    }
    if (this.peerConnection) {
      this.peerConnection.close();
    }
    if (this.ws) {
      this.ws.close();
    }
    this.localStream = null;
    this.remoteStream = null;
    this.peerConnection = null;
    this.ws = null;
  }

  onRemoteStream(callback) {
    this.onRemoteStreamCallback = callback;
  }

  onConnectionState(callback) {
    this.onConnectionStateCallback = callback;
  }

  onMessage(callback) {
    this.onMessageCallback = callback;
  }
}

// Room management for testing
export class RoomManager {
  static generateRoomId() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  static async createRoom() {
    const roomId = this.generateRoomId();
    return {
      roomId,
      roomUrl: `${window.location.origin}/spin?room=${roomId}`,
      isInitiator: true
    };
  }

  static joinRoom(roomId) {
    return {
      roomId,
      isInitiator: false
    };
  }
}
