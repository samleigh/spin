import React, { useState, useEffect } from 'react';

export const SpinLanding = ({ onStart }) => {
  const [liveCount, setLiveCount] = useState(14203);
  const [pastConnections, setPastConnections] = useState([
    { name: 'Alex, 25', location: '📍 San Francisco', photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&auto=format', lastConnected: '2 hours ago' },
    { name: 'Jordan, 29', location: '📍 Austin', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&auto=format', lastConnected: 'Yesterday' },
    { name: 'Casey, 27', location: '📍 Seattle', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&auto=format', lastConnected: '3 days ago' }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount((prev) => {
        const change = Math.floor(Math.random() * 600) - 300;
        return Math.max(14000, prev + change);
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="spin-landing">
      <div className="land-wrap">
        <div className="land-left">
          <div className="wordmark">
            Spin <span className="dot"></span>
          </div>

          <h1 className="land-tagline">
            Meet someone <em>worth meeting.</em>
          </h1>

          <p className="land-sub">
            Live video conversations with real people who share your interests.
            No swiping, no ghosting — just genuine connection, face to face.
          </p>

          <div className="land-actions">
            <button className="btn-warm" onClick={onStart}>
              Get Started — It&apos;s Free
            </button>
            <button className="btn-outline" onClick={onStart}>
              See how Spin works
            </button>
          </div>

          <div className="land-proof">
            <div className="proof-avatars">
              <div className="proof-av">🧑</div>
              <div className="proof-av">👩</div>
              <div className="proof-av">👨</div>
              <div className="proof-av">🧑‍🦱</div>
              <div className="proof-av">👩‍🦰</div>
            </div>
            <div className="proof-text">
              <strong>{liveCount.toLocaleString()}+ people</strong> are live right now
            </div>
          </div>
        </div>

        <div className="land-right">
          <div className="land-right-pattern"></div>

          <div className="float-cards">
            <div className="fcard fcard-1">
              <div className="fcard-avatar">
                <img
                  src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=1200&h=1200&fit=crop&auto=format"
                  alt="Sarah"
                />
              </div>
              <div className="fcard-spark">⚡ Connected</div>
              <div className="fcard-name">Sarah, 28</div>
              <div className="fcard-loc">📍 Los Angeles</div>
            </div>

            <div className="fcard fcard-2">
              <div className="fcard-avatar">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=1200&fit=crop&auto=format"
                  alt="Marcus"
                />
              </div>
              <div className="fcard-spark">⚡ Live</div>
              <div className="fcard-name">Marcus, 32</div>
              <div className="fcard-loc">📍 New York</div>
            </div>

            <div className="fcard fcard-3">
              <div className="fcard-avatar">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1200&h=1200&fit=crop&auto=format"
                  alt="Emma"
                />
              </div>
              <div className="fcard-spark">⚡ Live</div>
              <div className="fcard-name">Emma, 26</div>
              <div className="fcard-loc">📍 Chicago</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Friends Section */}
      <div className="friends-section">
        <h3 className="friends-title">Recent Connections</h3>
        <div className="friends-grid">
          {pastConnections.map((friend, index) => (
            <div key={index} className="friend-card">
              <div className="friend-avatar">
                <img src={friend.photo} alt={friend.name} />
              </div>
              <div className="friend-info">
                <div className="friend-name">{friend.name}</div>
                <div className="friend-loc">{friend.location}</div>
                <div className="friend-time">{friend.lastConnected}</div>
              </div>
              <button className="reconnect-btn">Reconnect</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};