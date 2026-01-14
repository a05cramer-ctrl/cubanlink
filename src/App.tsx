import { useState, useRef } from 'react';
import Starfield from './components/Starfield';
import StarOfDavid from './components/StarOfDavid';
import Hero from './components/Hero';
import DiamondSparkles from './components/DiamondSparkles';
import LightFlares from './components/LightFlares';
import MetallicButton from './components/MetallicButton';
import Intro from './components/Intro';
// import LiveChat from './components/LiveChat';
import DancingWojaks from './components/DancingWojaks';
import musicFile from './Lil_uzi_vert_-_Just_wanna_rock_(mp3.pm).mp3';
import './App.css';

function App() {
  const [showMain, setShowMain] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleIntroEnter = () => {
    setIsTransitioning(true);
    
    // Start music at 19.5 seconds INSTANTLY - no delay
    if (!audioRef.current) {
      audioRef.current = new Audio(musicFile);
      audioRef.current.volume = 1.0; // Maximum volume (0.0 to 1.0)
      audioRef.current.loop = true; // Loop the song
      audioRef.current.preload = 'auto'; // Preload for instant start
    }
    
    // Set time and play immediately
    audioRef.current.currentTime = 19.5;
    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.error('Error playing audio:', error);
      });
    }
    
    // Show main content immediately but hidden (for zoom animation)
    setShowMain(true);
    
    // Reset transition state after animation completes to slow down background
    setTimeout(() => {
      setIsTransitioning(false);
    }, 2100);
  };

  return (
    <div className={`app ${isTransitioning ? 'app-transitioning' : ''}`}>
      {!showMain && <Intro onEnter={handleIntroEnter} />}
      
      {/* Show background elements immediately when transitioning starts */}
      {(showMain || isTransitioning) && (
        <>
          <Starfield accelerate={isTransitioning} />
          <StarOfDavid accelerate={isTransitioning} />
          <DiamondSparkles accelerate={isTransitioning} />
          <LightFlares accelerate={isTransitioning} />
          {showMain && <DancingWojaks />}
        </>
      )}
      
      {showMain && (
        <>
          <main className={`main-content ${showMain ? 'main-content-visible' : ''}`}>
            <Hero />
            
            <div className="hero-text-section">
              <h1 className="main-title">PURE ICE.</h1>
              <h2 className="main-subtitle">ZERO UTILITY.</h2>
              <p className="tagline">THE MEME COIN THAT FLEXES</p>
            </div>

            <div className="glass-panel">
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-value">∞</div>
                  <div className="stat-label">DIAMONDS</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">100%</div>
                  <div className="stat-label">CHAOS</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">$0</div>
                  <div className="stat-label">UTILITY</div>
                </div>
              </div>
            </div>

            <div className="button-group">
              <MetallicButton>BUY NOW</MetallicButton>
              <MetallicButton>JOIN COMMUNITY</MetallicButton>
            </div>
          </main>
          
          {/* <LiveChat /> */}
        </>
      )}
    </div>
  );
}

export default App;
