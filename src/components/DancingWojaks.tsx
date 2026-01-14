import { useEffect, useState } from 'react';
import soyjakDance from '../soyjak-dance.gif';

interface WojakPosition {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
}

export default function DancingWojaks() {
  const [wojaks, setWojaks] = useState<Array<WojakPosition & { src: string }>>([]);

  useEffect(() => {
    // Create multiple instances of the soyjak dance GIF
    const numWojaks = 6;
    const initialWojaks = Array.from({ length: numWojaks }, (_, index) => ({
      src: soyjakDance,
      x: Math.random() * (window.innerWidth - 250),
      y: Math.random() * (window.innerHeight - 250),
      vx: (Math.random() - 0.5) * 0.15, // Slower movement
      vy: (Math.random() - 0.5) * 0.15, // Slower movement
      size: Math.random() * 100 + 150, // 150-250px (bigger)
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 0.8, // Slower rotation
    }));

    setWojaks(initialWojaks);

    const animate = () => {
      setWojaks((prev) =>
        prev.map((wojak) => {
          let newX = wojak.x + wojak.vx;
          let newY = wojak.y + wojak.vy;
          let newRotation = wojak.rotation + wojak.rotationSpeed;

          // Bounce off edges
          if (newX <= 0 || newX >= window.innerWidth - wojak.size) {
            wojak.vx *= -1;
            newX = Math.max(0, Math.min(newX, window.innerWidth - wojak.size));
          }
          if (newY <= 0 || newY >= window.innerHeight - wojak.size) {
            wojak.vy *= -1;
            newY = Math.max(0, Math.min(newY, window.innerHeight - wojak.size));
          }
          
          // Add slight random direction changes for more organic movement
          if (Math.random() > 0.98) {
            wojak.vx += (Math.random() - 0.5) * 0.05;
            wojak.vy += (Math.random() - 0.5) * 0.05;
            // Limit max speed (slower)
            wojak.vx = Math.max(-0.3, Math.min(0.3, wojak.vx));
            wojak.vy = Math.max(-0.3, Math.min(0.3, wojak.vy));
          }

          // Keep rotation between 0-360
          if (newRotation >= 360) newRotation -= 360;
          if (newRotation < 0) newRotation += 360;

          return {
            ...wojak,
            x: newX,
            y: newY,
            rotation: newRotation,
          };
        })
      );

      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div className="dancing-wojaks-container">
      {wojaks.map((wojak, index) => (
        <img
          key={index}
          src={wojak.src}
          alt="Dancing Wojak"
          className="dancing-wojak"
          style={{
            position: 'fixed',
            left: `${wojak.x}px`,
            top: `${wojak.y}px`,
            width: `${wojak.size}px`,
            height: 'auto',
            transform: `rotate(${wojak.rotation}deg)`,
            opacity: 0.6,
            pointerEvents: 'none',
            zIndex: 5,
            filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))',
            transition: 'transform 0.1s ease-out',
          }}
        />
      ))}
    </div>
  );
}
