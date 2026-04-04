"use client";
import { useEffect, useRef } from "react";

const PARTICLE_CONFIG = [
  { color: "#facc15", count: 30, minSize: 0.4, maxSize: 1.5 },
  { color: "#f472b6", count: 15, minSize: 0.3, maxSize: 1.2 },
  { color: "#22d3ee", count: 15, minSize: 0.3, maxSize: 1.0 },
];

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    const onResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
    };
    window.addEventListener("resize", onResize, { passive: true });

    // Initialize particles inside effect to avoid hydration mismatch
    const particles = PARTICLE_CONFIG.flatMap(({ color, count, minSize, maxSize }) =>
      Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -(Math.random() * 0.5 + 0.1),
        opacity: Math.random() * 0.4 + 0.1,
        color,
        size: Math.random() * (maxSize - minSize) + minSize,
      }))
    );

    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -5) { p.y = H + 5; p.x = Math.random() * W; }
        if (p.x < -5) p.x = W + 5;
        if (p.x > W + 5) p.x = -5;
      }
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0, opacity: 0.7 }}
    />
  );
}
