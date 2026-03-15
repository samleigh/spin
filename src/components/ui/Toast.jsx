import React, { useState, useEffect } from 'react';
import '../../styles/toast.css';

const ToastContext = React.createContext();

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, options = {}) => {
    const id = Date.now() + Math.random();
    const toast = {
      id,
      message,
      type: options.type || 'info', // 'success', 'error', 'info', 'warning'
      duration: options.duration || 3000,
      persistent: options.persistent || false
    };

    setToasts(prev => [...prev, toast]);

    // Auto-remove after duration (unless persistent)
    if (!toast.persistent) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration);
    }

    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const clearAllToasts = () => {
    setToasts([]);
  };

  // Convenience methods
  const success = (message, options) => addToast(message, { ...options, type: 'success' });
  const error = (message, options) => addToast(message, { ...options, type: 'error', duration: 5000 });
  const warning = (message, options) => addToast(message, { ...options, type: 'warning' });
  const info = (message, options) => addToast(message, { ...options, type: 'info' });

  return (
    <ToastContext.Provider value={{
      addToast,
      removeToast,
      clearAllToasts,
      success,
      error,
      warning,
      info,
      toasts
    }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

const ToastContainer = ({ toasts, onRemove }) => {
  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
};

const ToastItem = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onRemove(toast.id), 300);
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      default: return 'ℹ️';
    }
  };

  return (
    <div className={`toast toast-${toast.type} ${isVisible ? 'toast-visible' : ''}`}>
      <div className="toast-icon">{getIcon()}</div>
      <div className="toast-message">{toast.message}</div>
      {!toast.persistent && (
        <button className="toast-close" onClick={handleClose}>
          ×
        </button>
      )}
    </div>
  );
};
