// Local storage utilities for Spin app persistence
export const StorageKeys = {
  USER_PROFILE: 'spin_user_profile',
  APP_STATE: 'spin_app_state',
  CHAT_HISTORY: 'spin_chat_history',
  SETTINGS: 'spin_settings'
};

export class StorageManager {
  static saveUserProfile(profile) {
    try {
      localStorage.setItem(StorageKeys.USER_PROFILE, JSON.stringify(profile));
    } catch (error) {
      console.error('Failed to save user profile:', error);
    }
  }

  static loadUserProfile() {
    try {
      const stored = localStorage.getItem(StorageKeys.USER_PROFILE);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to load user profile:', error);
      return null;
    }
  }

  static saveAppState(state) {
    try {
      const data = {
        sparks: state.sparks,
        skipCount: state.skipCount,
        lastActive: new Date().toISOString()
      };
      localStorage.setItem(StorageKeys.APP_STATE, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save app state:', error);
    }
  }

  static loadAppState() {
    try {
      const stored = localStorage.getItem(StorageKeys.APP_STATE);
      if (stored) {
        const data = JSON.parse(stored);
        // Check if data is recent (within 24 hours)
        const lastActive = new Date(data.lastActive);
        const now = new Date();
        const hoursDiff = (now - lastActive) / (1000 * 60 * 60);
        
        if (hoursDiff < 24) {
          return data;
        }
      }
      return null;
    } catch (error) {
      console.error('Failed to load app state:', error);
      return null;
    }
  }

  static saveChatHistory(messages) {
    try {
      // Keep only last 50 messages
      const recentMessages = messages.slice(-50);
      localStorage.setItem(StorageKeys.CHAT_HISTORY, JSON.stringify(recentMessages));
    } catch (error) {
      console.error('Failed to save chat history:', error);
    }
  }

  static loadChatHistory() {
    try {
      const stored = localStorage.getItem(StorageKeys.CHAT_HISTORY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load chat history:', error);
      return [];
    }
  }

  static saveSettings(settings) {
    try {
      localStorage.setItem(StorageKeys.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }

  static loadSettings() {
    try {
      const stored = localStorage.getItem(StorageKeys.SETTINGS);
      return stored ? JSON.parse(stored) : {
        soundEnabled: true,
        notificationsEnabled: true,
        autoStartVideo: true,
        autoStartAudio: true
      };
    } catch (error) {
      console.error('Failed to load settings:', error);
      return {
        soundEnabled: true,
        notificationsEnabled: true,
        autoStartVideo: true,
        autoStartAudio: true
      };
    }
  }

  static clearAllData() {
    try {
      Object.values(StorageKeys).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  }
}
