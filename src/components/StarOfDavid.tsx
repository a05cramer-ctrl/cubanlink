import { useEffect, useState, useRef } from 'react';

interface StarShape {
  x: number;
  y: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  driftX: number;
  driftY: number;
  opacity: number;
  depth: number;
}

interface StarOfDavidProps {
  accelerate?: boolean;
}

export default function StarOfDavid({ accelerate = false }: StarOfDavidProps) {
  const [stars, setStars] = useState<StarShape[]>([]);
  const accelerationRef = useRef(1);

  useEffect(() => {
    const numStars = 15; // More stars for chaotic luxury feel
    const initialStars: StarShape[] = Array.from({ length: numStars }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 40 + 20,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 0.5,
      driftX: (Math.random() - 0.5) * 0.2,
      driftY: (Math.random() - 0.5) * 0.2,
      opacity: Math.random() * 0.3 + 0.1,
      depth: i < numStars / 2 ? 1 : 2, // Foreground and background
    }));

    setStars(initialStars);

    const animate = () => {
      // Accelerate if transitioning, otherwise slow down gradually
      if (accelerate) {
        accelerationRef.current = Math.min(accelerationRef.current * 1.12, 30);
      } else {
        // Gradually slow down to normal speed
        accelerationRef.current = Math.max(accelerationRef.current * 0.96, 1);
      }

      setStars((prevStars) =>
        prevStars.map((star) => {
          let newX = star.x + star.driftX * accelerationRef.current;
          let newY = star.y + star.driftY * accelerationRef.current;
          let newRotation = star.rotation + star.rotationSpeed * accelerationRef.current;

          // Wrap around edges
          if (newX > 110) newX = -10;
          if (newX < -10) newX = 110;
          if (newY > 110) newY = -10;
          if (newY < -10) newY = 110;

          return {
            ...star,
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
  }, [accelerate]);

  const drawStar = (size: number) => {
    const points = 6;
    const outerRadius = size / 2;
    const innerRadius = outerRadius * 0.5;
    const path = [];

    for (let i = 0; i < points * 2; i++) {
      const angle = (i * Math.PI) / points;
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      path.push(`${x},${y}`);
    }

    return path.join(' ');
  };

  return (
    <div className={`star-of-david-container ${accelerate ? 'star-of-david-accelerating' : ''}`}>
      {stars.map((star, index) => (
        <svg
          key={index}
          className={`star-shape depth-${star.depth}`}
          width={star.size}
          height={star.size}
          viewBox="-50 -50 100 100"
          style={{
            position: 'absolute',
            left: `${star.x}vw`,
            top: `${star.y}vh`,
            opacity: star.opacity,
            filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))',
            transform: `rotate(${star.rotation}deg)`,
            transition: 'transform 0.1s ease-out',
          }}
        >
          <polygon
            points={drawStar(100)}
            fill="none"
            stroke="rgba(255, 255, 255, 0.4)"
            strokeWidth="1"
            className="star-glow"
          />
        </svg>
      ))}
    </div>
  );
}
