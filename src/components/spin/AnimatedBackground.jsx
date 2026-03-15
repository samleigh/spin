import React, { useState, useEffect, useRef } from 'react';
import './AnimatedBackground.css';

export const AnimatedBackground = () => {
  const [circles] = useState([
    { id: 1, x: 20, y: 30, found: false, vx: 0, vy: 0 },
    { id: 2, x: 80, y: 70, found: false, vx: 0, vy: 0 }
  ]);
  const [positions, setPositions] = useState(circles);
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const animationRef = useRef(null);
  const timeRef = useRef(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      setMousePos({ x, y });
      setIsHovering(true);
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
      setMousePos({ x: -100, y: -100 });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  useEffect(() => {
    const animate = () => {
      timeRef.current += 0.02;
      
      setPositions(prev => {
        const newPositions = [...prev];
        let allFound = true;
        
        newPositions.forEach((circle, index) => {
          let newX = circle.x;
          let newY = circle.y;
          let newVx = circle.vx * 0.95; // Damping
          let newVy = circle.vy * 0.95;
          
          if (!circle.found) {
            if (isHovering) {
              // Magnetic attraction to mouse
              const dx = mousePos.x - circle.x;
              const dy = mousePos.y - circle.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              if (distance < 30 && distance > 0) {
                // Strong attraction when close
                const force = 0.8 / distance;
                newVx += (dx / distance) * force;
                newVy += (dy / distance) * force;
              } else if (distance < 60) {
                // Gentle attraction at medium range
                const force = 0.2 / distance;
                newVx += (dx / distance) * force;
                newVy += (dy / distance) * force;
              }
            } else {
              // Random wandering when not hovering
              const speed = 0.3;
              const wobbleX = Math.sin(timeRef.current * 2 + index) * speed;
              const wobbleY = Math.cos(timeRef.current * 1.5 + index) * speed;
              const driftX = Math.sin(timeRef.current * 0.5 + index * 2) * 0.1;
              const driftY = Math.cos(timeRef.current * 0.3 + index * 3) * 0.1;
              
              newVx += wobbleX + driftX;
              newVy += wobbleY + driftY;
            }
            
            // Apply velocity
            newX += newVx;
            newY += newVy;
            
            // Keep within bounds with bounce
            if (newX < 5 || newX > 95) {
              newVx *= -0.8;
              newX = Math.max(5, Math.min(95, newX));
            }
            if (newY < 5 || newY > 95) {
              newVy *= -0.8;
              newY = Math.max(5, Math.min(95, newY));
            }
            
            allFound = false;
          } else {
            // Move together in unison towards top-right
            const targetX = 85;
            const targetY = 15;
            const speed = 0.5;
            
            const dx = targetX - circle.x;
            const dy = targetY - circle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 1) {
              newX = circle.x + (dx / distance) * speed;
              newY = circle.y + (dy / distance) * speed;
            }
          }
          
          newPositions[index] = { 
            ...circle, 
            x: newX, 
            y: newY, 
            vx: newVx, 
            vy: newVy 
          };
        });
        
        // Check if circles should "find each other"
        if (!newPositions[0].found && !newPositions[1].found) {
          const dx = newPositions[0].x - newPositions[1].x;
          const dy = newPositions[0].y - newPositions[1].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // If circles are close enough, they "find each other"
          if (distance < 15) {
            const centerX = (newPositions[0].x + newPositions[1].x) / 2;
            const centerY = (newPositions[0].y + newPositions[1].y) / 2;
            
            newPositions[0] = { ...newPositions[0], x: centerX, y: centerY, found: true, vx: 0, vy: 0 };
            newPositions[1] = { ...newPositions[1], x: centerX + 5, y: centerY + 5, found: true, vx: 0, vy: 0 };
          }
        }
        
        return newPositions;
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mousePos, isHovering]);

  return (
    <div className="animated-background" ref={containerRef}>
      <div className="circles-container">
        {positions.map((circle, index) => (
          <div
            key={circle.id}
            className={`circle circle-${circle.id} ${circle.found ? 'found' : 'searching'} ${isHovering ? 'interactive' : ''}`}
            style={{
              left: `${circle.x}%`,
              top: `${circle.y}%`,
              transform: `translate(-50%, -50%) rotate(${timeRef.current * 100 + index * 180}deg)`,
              transition: isHovering ? 'none' : 'transform 0.3s ease'
            }}
          >
            <div className="circle-inner"></div>
            <div className="circle-pulse"></div>
            {isHovering && (
              <div className="magnetic-field"></div>
            )}
          </div>
        ))}
      </div>
      
      {/* Connection line when circles find each other */}
      {positions[0].found && positions[1].found && (
        <svg className="connection-line" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none'
        }}>
          <line
            x1={`${positions[0].x}%`}
            y1={`${positions[0].y}%`}
            x2={`${positions[1].x}%`}
            y2={`${positions[1].y}%`}
            stroke="url(#gradient)"
            strokeWidth="2"
            strokeDasharray="5,5"
            opacity="0.6"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="10"
              dur="1s"
              repeatCount="indefinite"
            />
          </line>
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff4757" />
              <stop offset="100%" stopColor="#5f27cd" />
            </linearGradient>
          </defs>
        </svg>
      )}
      
      {/* Mouse follower when hovering */}
      {isHovering && (
        <div 
          className="mouse-follower"
          style={{
            left: `${mousePos.x}%`,
            top: `${mousePos.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        />
      )}
      
      {/* Floating particles */}
      <div className="particles">
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${6 + Math.random() * 4}s`,
              background: i % 3 === 0 ? '#ff4757' : i % 3 === 1 ? '#5f27cd' : '#00d2d3',
              opacity: isHovering ? 0.2 : 0.1
            }}
          />
        ))}
      </div>
    </div>
  );
};
