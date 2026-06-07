"use client";

import { useEffect, useRef } from "react";

const CHARS =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン01ﾊﾐ";

export function MatrixRain({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const FONT_SIZE = 14;
    let drops: number[] = [];
    let animId: number;
    let lastTime = 0;
    const INTERVAL = 80; // ms between frames — keeps it subtle

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const cols = Math.floor(canvas.width / FONT_SIZE);
      drops = Array.from({ length: cols }, () => Math.random() * -50);
    };

    const draw = (now: number) => {
      animId = requestAnimationFrame(draw);
      if (now - lastTime < INTERVAL) return;
      lastTime = now;

      // Fade trail
      ctx.fillStyle = "rgba(8, 5, 15, 0.04)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${FONT_SIZE}px "Geist Mono", monospace`;

      for (let i = 0; i < drops.length; i++) {
        const y = drops[i] * FONT_SIZE;
        // Head: bright cyan
        const headBrightness = drops[i] > 0 ? 1 : 0;
        if (headBrightness > 0) {
          ctx.fillStyle = `rgba(0, 212, 255, 0.95)`;
          ctx.fillText(
            CHARS[Math.floor(Math.random() * CHARS.length)],
            i * FONT_SIZE,
            y,
          );
        }
        // Trail: violet
        ctx.fillStyle = `rgba(108, 99, 255, 0.55)`;
        ctx.fillText(
          CHARS[Math.floor(Math.random() * CHARS.length)],
          i * FONT_SIZE,
          y - FONT_SIZE,
        );

        // Reset when past bottom
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i] += 0.5;
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: "100%", height: "100%" }}
      aria-hidden
    />
  );
}
