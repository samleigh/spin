import React from 'react';

export const AgeGate = ({ onConfirm }) => {
  const handleYes = () => onConfirm(true);
  const handleNo = () => onConfirm(false);

  return (
    <div className="center-wrap">
      <div className="form-card age-content">
        <div className="age-emoji">👋</div>
        <h2>Welcome to Spin</h2>
        <p className="fc-sub">
          Spin is for adults 18 and older. By continuing you confirm you meet this requirement and agree to our community guidelines — which are pretty simple: be respectful, be yourself.
        </p>
        <button className="btn-warm" onClick={handleYes}>
          I'm 18 or older — Let's go
        </button>
        <button className="btn-outline" onClick={handleNo}>
          Exit
        </button>
        <p style={{ fontSize: '11px', color: 'var(--muted2)', marginTop: '20px', lineHeight: '1.7' }}>
          By continuing you agree to our <a href="#" style={{ color: 'var(--warm)', textDecoration: 'none' }}>Terms</a>,{' '}
          <a href="#" style={{ color: 'var(--warm)', textDecoration: 'none' }}>Privacy Policy</a>, and{' '}
          <a href="#" style={{ color: 'var(--warm)', textDecoration: 'none' }}>Community Guidelines</a>. COPPA-compliant · US operated.
        </p>
      </div>
    </div>
  );
};
