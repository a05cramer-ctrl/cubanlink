import { useEffect, useState } from 'react';

interface LightFlare {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
}

interface LightFlaresProps {
  accelerate?: boolean;
}

export default function LightFlares({ accelerate = false }: LightFlaresProps) {
  const [flares, setFlares] = useState<LightFlare[]>([]);

  useEffect(() => {
    const createFlare = (): LightFlare => ({
      id: Math.random(),
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 200 + 100,
      opacity: Math.random() * 0.3 + 0.1,
      duration: Math.random() * 4000 + 3000,
    });

    const initialFlares = Array.from({ length: 8 }, createFlare);
    setFlares(initialFlares);

    const interval = setInterval(() => {
      setFlares((prev) => {
        const newFlare = createFlare();
        return [...prev.slice(-7), newFlare];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [accelerate]);

  return (
    <div className={`light-flares-container ${accelerate ? 'light-flares-accelerating' : ''}`}>
      {flares.map((flare) => (
        <div
          key={flare.id}
          className="light-flare"
          style={{
            left: `${flare.x}%`,
            top: `${flare.y}%`,
            width: `${flare.size}px`,
            height: `${flare.size}px`,
            opacity: flare.opacity,
            animationDuration: `${flare.duration}ms`,
          }}
        />
      ))}
    </div>
  );
}
