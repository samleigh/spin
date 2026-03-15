// WebRTC Manager for peer-to-peer video connections
export class WebRTCManager {
  constructor() {
    this.localStream = null;
    this.remoteStream = null;
    this.peerConnection = null;
    this.isInitiator = false;
    this.onRemoteStreamCallback = null;
    this.onConnectionStateCallback = null;
    this.onErrorCallback = null;
  }

  async initializeLocalStream(videoConstraints = true, audioConstraints = true) {
    try {
      const constraints = {
        video: videoConstraints ? {
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } : false,
        audio: audioConstraints
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
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:stun3.l.google.com:19302' },
        { urls: 'stun:stun4.l.google.com:19302' }
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
      if (event.candidate && this.onIceCandidateCallback) {
        this.onIceCandidateCallback(event.candidate);
      }
    };

    // Handle errors
    this.peerConnection.onerror = (error) => {
      if (this.onErrorCallback) {
        this.onErrorCallback(error);
      }
    };

    return this.peerConnection;
  }

  async createOffer() {
    this.isInitiator = true;
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    return offer;
  }

  async createAnswer(offer) {
    this.isInitiator = false;
    await this.peerConnection.setRemoteDescription(offer);
    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);
    return answer;
  }

  async handleAnswer(answer) {
    await this.peerConnection.setRemoteDescription(answer);
  }

  async handleIceCandidate(candidate) {
    await this.peerConnection.addIceCandidate(candidate);
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

  getConnectionStats() {
    if (this.peerConnection) {
      return this.peerConnection.getStats();
    }
    return Promise.resolve(new Map());
  }

  close() {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
    }
    if (this.peerConnection) {
      this.peerConnection.close();
    }
    this.localStream = null;
    this.remoteStream = null;
    this.peerConnection = null;
  }

  // Callback setters
  onRemoteStream(callback) {
    this.onRemoteStreamCallback = callback;
  }

  onConnectionState(callback) {
    this.onConnectionStateCallback = callback;
  }

  onIceCandidate(callback) {
    this.onIceCandidateCallback = callback;
  }

  onError(callback) {
    this.onErrorCallback = callback;
  }
}

// Simulated connection manager for demo purposes
export class SimulatedConnectionManager {
  constructor() {
    this.localStream = null;
    this.onRemoteStreamCallback = null;
    this.onConnectionStateCallback = null;
  }

  async initializeLocalStream(videoConstraints = true, audioConstraints = true) {
    try {
      const constraints = {
        video: videoConstraints ? {
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } : false,
        audio: audioConstraints
      };

      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      return this.localStream;
    } catch (error) {
      console.error('Failed to get local stream:', error);
      throw error;
    }
  }

  simulateConnection() {
    // Simulate connection delay
    setTimeout(() => {
      if (this.onConnectionStateCallback) {
        this.onConnectionStateCallback('connected');
      }
    }, 2000);

    // Create a fake remote stream for demo
    setTimeout(() => {
      const canvas = document.createElement('canvas');
      canvas.width = 1280;
      canvas.height = 720;
      const ctx = canvas.getContext('2d');
      
      // Animate something
      let frame = 0;
      const draw = () => {
        ctx.fillStyle = '#f3f1ee';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw animated placeholder
        ctx.fillStyle = '#c4623a';
        ctx.font = '48px DM Sans';
        ctx.textAlign = 'center';
        ctx.fillText('👋 Connected!', canvas.width / 2, canvas.height / 2);
        
        frame++;
        if (frame < 300) { // 5 seconds at 60fps
          requestAnimationFrame(draw);
        }
      };
      draw();

      const stream = canvas.captureStream(30);
      if (this.onRemoteStreamCallback) {
        this.onRemoteStreamCallback(stream);
      }
    }, 2000);
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
    this.localStream = null;
  }

  onRemoteStream(callback) {
    this.onRemoteStreamCallback = callback;
  }

  onConnectionState(callback) {
    this.onConnectionStateCallback = callback;
  }
}
