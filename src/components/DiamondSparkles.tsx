import { useEffect, useState, useRef } from 'react';

interface DiamondSparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  opacity: number;
  duration: number;
  delay: number;
}

interface DiamondSparklesProps {
  accelerate?: boolean;
}

export default function DiamondSparkles({ accelerate = false }: DiamondSparklesProps) {
  const [sparkles, setSparkles] = useState<DiamondSparkle[]>([]);
  const accelerationRef = useRef(1);

  useEffect(() => {
    const createSparkle = (): DiamondSparkle => ({
      id: Math.random(),
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 15 + 5,
      rotation: Math.random() * 360,
      opacity: Math.random() * 0.8 + 0.2,
      duration: Math.random() * 2000 + 1000,
      delay: Math.random() * 3000,
    });

    // Create initial sparkles
    const initialSparkles = Array.from({ length: 30 }, createSparkle);
    setSparkles(initialSparkles);

    // Continuously add new sparkles
    let intervalId: NodeJS.Timeout;
    
    const updateSparkles = () => {
      // Accelerate if transitioning, otherwise slow down gradually
      if (accelerate) {
        accelerationRef.current = Math.min(accelerationRef.current * 1.1, 20);
      } else {
        // Gradually slow down to normal speed
        accelerationRef.current = Math.max(accelerationRef.current * 0.97, 1);
      }

      setSparkles((prev) => {
        const newSparkle = createSparkle();
        return [...prev.slice(-25), newSparkle];
      });
    };

    intervalId = setInterval(updateSparkles, 500);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [accelerate]);

  return (
    <div className={`diamond-sparkles-container ${accelerate ? 'diamond-sparkles-accelerating' : ''}`}>
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="diamond-sparkle"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            opacity: sparkle.opacity,
            animationDelay: `${sparkle.delay}ms`,
            animationDuration: `${sparkle.duration}ms`,
            transform: `rotate(${sparkle.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
}
