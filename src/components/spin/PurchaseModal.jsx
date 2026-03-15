import React, { useState } from 'react';
import { SPARK_PACKAGES } from '../../data/spinData';

export const PurchaseModal = ({ isOpen, onClose, onSuccess }) => {
  const [selectedPackage, setSelectedPackage] = useState(SPARK_PACKAGES[1]); // Default to popular
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 16);
    value = value.replace(/(.{4})/g, '$1 ').trim();
    setCardNumber(value);
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (value.length > 2) {
      value = value.slice(0, 2) + ' / ' + value.slice(2);
    }
    setCardExpiry(value);
  };

  const handlePay = async () => {
    // Basic validation
    if (cardNumber.replace(/\s/g, '').length < 15) {
      alert('Please enter a valid card number.');
      return;
    }

    setIsProcessing(true);

    // Mock payment processing
    setTimeout(() => {
      const bonus = Math.floor(selectedPackage.sparks * 0.2);
      const totalSparks = selectedPackage.sparks + bonus;
      
      setIsProcessing(false);
      onSuccess(totalSparks);
      
      // Reset form
      setCardNumber('');
      setCardExpiry('');
      setCardCvc('');
    }, 1800);
  };

  const bonus = Math.floor(selectedPackage.sparks * 0.2);
  const totalSparks = selectedPackage.sparks + bonus;

  return (
    <div className="modal-ov open" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-handle"></div>
        <div className="modal-head">
          <h3>⚡ Top up Sparks</h3>
          <p>Sparks let you keep the conversations going</p>
        </div>
        <div className="modal-body">
          <div className="sel-display">
            <div className="sel-amt">{totalSparks.toLocaleString()}</div>
            <div className="sel-price">${selectedPackage.price.toFixed(2)}</div>
            <div className="sel-bonus">🔥 Streak bonus: +{bonus.toLocaleString()} free sparks</div>
          </div>

          <div className="mpkg-list">
            {SPARK_PACKAGES.map(pkg => (
              <div
                key={pkg.id}
                className={`pkg ${selectedPackage.id === pkg.id ? 'pop' : ''}`}
                onClick={() => handlePackageSelect(pkg)}
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

          <div className="frow">
            <div className="flbl">Card Number</div>
            <input
              className="fin"
              value={cardNumber}
              onChange={handleCardNumberChange}
              placeholder="4242 4242 4242 4242"
              maxLength={19}
            />
          </div>
          <div className="frow2">
            <div className="frow" style={{ marginBottom: 0 }}>
              <div className="flbl">Expiry</div>
              <input
                className="fin"
                value={cardExpiry}
                onChange={handleExpiryChange}
                placeholder="MM / YY"
                maxLength={7}
              />
            </div>
            <div className="frow" style={{ marginBottom: 0 }}>
              <div className="flbl">CVC</div>
              <input
                className="fin"
                value={cardCvc}
                onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="•••"
                maxLength={4}
                type="password"
              />
            </div>
          </div>

          <button className="pay-btn" onClick={handlePay} disabled={isProcessing}>
            <span>🔒</span>
            <span>
              {isProcessing 
                ? 'Processing…' 
                : `Pay $${selectedPackage.price.toFixed(2)} — Get ${totalSparks.toLocaleString()} Sparks`
              }
            </span>
          </button>
          <div className="pay-secure">
            🔒 &nbsp;Secured by Stripe · 256-bit SSL · No subscriptions
          </div>
        </div>
      </div>
    </div>
  );
};
