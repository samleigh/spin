import React from 'react';
import { getRandomProfile, getRandomItem, MOCK_PHOTOS } from '../../data/spinData';

export const PeoplePanel = () => {
  // Generate mock people list
  const people = Array.from({ length: 12 }, () => {
    const profile = getRandomProfile();
    return {
      ...profile,
      isOnline: true
    };
  });

  return (
    <div className="ppl-list">
      {people.map((person, index) => (
        <div key={index} className="pitem">
          <div className="pav-wrap">
            <div className="pav">
              {person.photo ? (
                <img 
                  src={person.photo} 
                  alt={person.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '50%'
                  }}
                />
              ) : (
                person.emoji
              )}
            </div>
            <div className="ponline-dot"></div>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="pname">{person.name}</div>
            <div className="ploc">📍 {person.location.split(',')[0]}</div>
            <div className="pinterests">
              {person.interests.slice(0, 2).join(' · ')}
            </div>
          </div>
          <span style={{ color: 'var(--green)', fontSize: '11px', flexShrink: 0 }}>
            Live
          </span>
        </div>
      ))}
    </div>
  );
};
