import React from 'react';
import { useToast } from '../ui/Toast';

export const TopNav = ({ sparks, liveCount, onOpenPurchase, onExit }) => {
  const { info } = useToast();
  
  const handleReport = () => {
    info('⚑ Report feature coming soon');
  };

  return (
    <nav className="app-nav">
      <div className="app-logo">Spin</div>
      <div className="nav-center">
        <div className="live-chip">
          <div className="ldot"></div>
          <span>{liveCount.toLocaleString()}</span>&nbsp;live
        </div>
        <div className="spark-chip" onClick={onOpenPurchase}>
          <span style={{ fontSize: '14px' }}>⚡</span>
          <span className="sn">{sparks.toLocaleString()}</span>
          <span className="sl">sparks</span>
        </div>
        <button className="btn-topup" onClick={onOpenPurchase}>
          + Top up
        </button>
      </div>
      <div className="nav-r">
        <button className="ibtn" title="Report" onClick={handleReport}>
          ⚑
        </button>
        <button className="ibtn" onClick={onExit}>
          ✕
        </button>
      </div>
    </nav>
  );
};
