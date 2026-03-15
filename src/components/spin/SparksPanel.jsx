import React from 'react';
import { SPARK_PACKAGES, SKIP_COST } from '../../data/spinData';

export const SparksPanel = ({ sparks, onOpenPurchase }) => {
  return (
    <div className="sparks-pane">
      <div className="bal-card">
        <div className="bal-lbl">Your Sparks</div>
        <div className="bal-amt">{sparks.toLocaleString()}</div>
        <div className="bal-unit">⚡ sparks available</div>
      </div>

      <div className="streak-row">
        <div className="sr-icon">🔥</div>
        <div>
          <div className="sr-n">3-day streak</div>
          <div className="sr-l">+20% bonus sparks on your next purchase</div>
        </div>
      </div>

      <div className="pane-hd">Top up sparks</div>
      <div className="pkg-list">
        {SPARK_PACKAGES.map(pkg => (
          <div 
            key={pkg.id} 
            className={`pkg ${pkg.pop ? 'pop' : ''}`}
            onClick={onOpenPurchase}
          >
            {pkg.pop && <div className="pkg-badge">Most popular</div>}
            <div className="pkg-icon">{pkg.icon}</div>
            <div style={{ flex: 1 }}>
              <div className="pkg-sparks">
                {pkg.sparks.toLocaleString()} <span>{pkg.label}</span>
              </div>
              <div className="pkg-note">{pkg.note}</div>
            </div>
            <div>
              <div className="pkg-price">${pkg.price.toFixed(2)}</div>
              <div className="pkg-per">{(pkg.price / pkg.sparks * 100).toFixed(1)}¢ each</div>
            </div>
          </div>
        ))}
      </div>

      <div className="pane-hd">What sparks buy you</div>
      <div className="spend-list">
        <div className="si-row">
          <div className="si-ico">⟳</div>
          <div>
            <div className="si-name">Skip to next person</div>
            <div className="si-sub">Move on whenever you want</div>
          </div>
          <div className="si-cost">{SKIP_COST} ⚡</div>
        </div>
        <div className="si-row">
          <div className="si-ico">⭐</div>
          <div>
            <div className="si-name">Featured profiles</div>
            <div className="si-sub">Skip the queue, meet top picks</div>
          </div>
          <div className="si-cost">50 ⚡</div>
        </div>
        <div className="si-row">
          <div className="si-ico">🎁</div>
          <div>
            <div className="si-name">Send a reaction</div>
            <div className="si-sub">Heart, laugh, fire…</div>
          </div>
          <div className="si-cost">5 ⚡</div>
        </div>
        <div className="si-row">
          <div className="si-ico">⚡</div>
          <div>
            <div className="si-name">Boost your profile</div>
            <div className="si-sub">Get seen by more people for 1 hr</div>
          </div>
          <div className="si-cost">120 ⚡</div>
        </div>
      </div>
    </div>
  );
};
