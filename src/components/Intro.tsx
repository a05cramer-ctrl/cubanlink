import { useEffect, useState, useRef, useCallback } from 'react';

interface IntroProps {
  onEnter: () => void;
}

export default function Intro({ onEnter }: IntroProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [showPressEnter, setShowPressEnter] = useState(false);
  const introRef = useRef<HTMLDivElement>(null);

  const handleEnter = useCallback(() => {
    if (!isExiting) {
      setIsExiting(true);
      // Call onEnter immediately to start transition
      onEnter();
    }
  }, [isExiting, onEnter]);

  useEffect(() => {
    // Show button immediately
    setShowPressEnter(true);

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !isExiting) {
        handleEnter();
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isExiting, handleEnter]);

  return (
    <div 
      ref={introRef}
      className={`intro-screen ${isExiting ? 'intro-exiting' : ''}`}
    >
      <div className="intro-content">
        <h1 className="intro-title">CUBAN LINK</h1>
        <p className="intro-subtitle">PURE ICE. ZERO UTILITY.</p>
        {showPressEnter && !isExiting && (
          <button className="enter-button" onClick={handleEnter}>
            <span className="enter-button-text">ENTER</span>
            <span className="enter-button-glow" />
          </button>
        )}
      </div>
      <div className={`intro-vortex ${isExiting ? 'intro-vortex-active' : ''}`} />
    </div>
  );
}
