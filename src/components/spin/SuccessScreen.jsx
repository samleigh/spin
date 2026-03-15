import React from 'react';

export const SuccessScreen = ({ sparksGained, onBack }) => {
  return (
    <div className="center-wrap">
      <div className="success-inner">
        <span className="s-icon">⚡</span>
        <h2>Sparks added!</h2>
        <p>
          {sparksGained.toLocaleString()} Sparks are now in your account.
        </p>
        <button 
          className="btn-warm" 
          onClick={onBack}
          style={{ margin: 'auto' }}
        >
          Back to Spin
        </button>
      </div>
    </div>
  );
};
