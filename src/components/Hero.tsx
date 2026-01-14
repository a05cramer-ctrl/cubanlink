import { useState, useEffect, useRef } from 'react';
import wojakImage from '../985ef4bb-f491-47d1-8525-510fee137c2f.png';

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number; size: number }>>([]);
  const [cameraDrift, setCameraDrift] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const sparkleIdRef = useRef(0);
  const driftRef = useRef({ x: 0, y: 0, vx: 0, vy: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    // Camera drift animation
    const driftInterval = setInterval(() => {
      driftRef.current.vx += (Math.random() - 0.5) * 0.1;
      driftRef.current.vy += (Math.random() - 0.5) * 0.1;
      driftRef.current.vx *= 0.95;
      driftRef.current.vy *= 0.95;
      driftRef.current.x += driftRef.current.vx;
      driftRef.current.y += driftRef.current.vy;
      setCameraDrift({ x: driftRef.current.x, y: driftRef.current.y });
    }, 16);

    // Random diamond sparkles on jewelry
    const sparkleInterval = setInterval(() => {
      const rect = imageRef.current?.getBoundingClientRect();
      if (rect) {
        // Chain area sparkles
        const chainX = rect.left + rect.width * (0.3 + Math.random() * 0.4);
        const chainY = rect.top + rect.height * (0.4 + Math.random() * 0.2);
        
        // Grills area sparkles
        const grillsX = rect.left + rect.width * (0.4 + Math.random() * 0.2);
        const grillsY = rect.top + rect.height * (0.5 + Math.random() * 0.15);

        const sparklePositions = [
          { x: chainX - rect.left, y: chainY - rect.top },
          { x: grillsX - rect.left, y: grillsY - rect.top },
        ];

        sparklePositions.forEach((pos) => {
          if (Math.random() > 0.5) {
            const newSparkle = {
              id: sparkleIdRef.current++,
              x: pos.x,
              y: pos.y,
              size: Math.random() * 8 + 4,
            };
            setSparkles((prev) => {
              const updated = [...prev, newSparkle];
              return updated.slice(-20);
            });
            setTimeout(() => {
              setSparkles((prev) => prev.filter((s) => s.id !== newSparkle.id));
            }, 1500);
          }
        });
      }
    }, 800);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(driftInterval);
      clearInterval(sparkleInterval);
    };
  }, []);

  const handleImageHover = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // More aggressive sparkles on hover
    if ((x > 25 && x < 75 && y > 35 && y < 65)) {
      if (Math.random() > 0.6) {
        const newSparkle = {
          id: sparkleIdRef.current++,
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          size: Math.random() * 10 + 5,
        };
        setSparkles((prev) => {
          const updated = [...prev, newSparkle];
          return updated.slice(-25);
        });
        setTimeout(() => {
          setSparkles((prev) => prev.filter((s) => s.id !== newSparkle.id));
        }, 1200);
      }
    }
  };

  const parallaxX = (mousePosition.x - window.innerWidth / 2) * 0.015 + cameraDrift.x;
  const parallaxY = (mousePosition.y - window.innerHeight / 2) * 0.015 + cameraDrift.y;

  return (
    <div className="hero-container">
      <div
        className="hero-image-wrapper"
        onMouseMove={handleImageHover}
        style={{
          transform: `translate(${parallaxX}px, ${parallaxY}px) rotate(-3deg)`,
        }}
      >
        {/* Chain glow */}
        <div className="chain-glow" />
        {/* Grills glow */}
        <div className="grills-glow" />
        
        <img
          ref={imageRef}
          src={wojakImage}
          alt="Cuban Link"
          className="hero-image"
        />
        
        {sparkles.map((sparkle) => (
          <div
            key={sparkle.id}
            className="diamond-sparkle-jewelry"
            style={{
              left: `${sparkle.x}px`,
              top: `${sparkle.y}px`,
              width: `${sparkle.size}px`,
              height: `${sparkle.size}px`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
