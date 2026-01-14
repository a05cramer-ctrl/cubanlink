import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  speed: number;
}

interface StarfieldProps {
  accelerate?: boolean;
}

export default function Starfield({ accelerate = false }: StarfieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animationFrameRef = useRef<number>();
  const accelerationRef = useRef(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize stars - DENSE for chaotic luxury feel
    const numStars = 500;
    starsRef.current = Array.from({ length: numStars }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      z: Math.random() * 2000,
      size: Math.random() * 1.5 + 0.5,
      speed: Math.random() * 0.5 + 0.1,
    }));

    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      // Accelerate if transitioning, otherwise slow down gradually
      if (accelerate) {
        accelerationRef.current = Math.min(accelerationRef.current * 1.15, 50);
      } else {
        // Gradually slow down to normal speed
        accelerationRef.current = Math.max(accelerationRef.current * 0.95, 1);
      }

      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      starsRef.current.forEach((star) => {
        // Move star with acceleration
        star.z -= star.speed * accelerationRef.current;
        if (star.z <= 0) {
          star.z = 2000;
          star.x = Math.random() * canvas.width;
          star.y = Math.random() * canvas.height;
        }

        // Parallax effect based on mouse position
        const parallaxX = (mouseX - centerX) * 0.0001 * (2000 - star.z);
        const parallaxY = (mouseY - centerY) * 0.0001 * (2000 - star.z);

        // Project 3D to 2D
        const k = 128 / star.z;
        const x = (star.x + parallaxX - centerX) * k + centerX;
        const y = (star.y + parallaxY - centerY) * k + centerY;

        // Draw star
        const size = star.size * k;
        const opacity = 1 - star.z / 2000;

        // Draw star with more intensity
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.9})`;
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();

        // More frequent sparkles for flashy effect
        if (Math.random() > 0.95) {
          ctx.beginPath();
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
          ctx.arc(x, y, size * 3, 0, Math.PI * 2);
          ctx.fill();
          
          // Add cross sparkle
          ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.6})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x - size * 2, y);
          ctx.lineTo(x + size * 2, y);
          ctx.moveTo(x, y - size * 2);
          ctx.lineTo(x, y + size * 2);
          ctx.stroke();
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [accelerate]);

  return (
    <canvas
      ref={canvasRef}
      className={`starfield ${accelerate ? 'starfield-accelerating' : ''}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none',
      }}
    />
  );
}
