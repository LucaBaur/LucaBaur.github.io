"use client";

import { useEffect, useRef } from "react";

/** Punktraster, das vor dem Mauszeiger ausweicht. Ohne Bewegung bei reduced motion. */
export default function HeroField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const gap = 34;
    const mouse = { x: -9999, y: -9999 };
    let w = 0;
    let h = 0;
    let raf = 0;
    let t = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      t += 0.012;
      for (let x = gap / 2; x < w; x += gap) {
        for (let y = gap / 2; y < h; y += gap) {
          const wave = still ? 0 : Math.sin(x * 0.012 + t) * Math.cos(y * 0.012 - t) * 3;
          const dx = x - mouse.x;
          const dy = y - mouse.y;
          const d = Math.hypot(dx, dy);
          const push = d < 170 ? (1 - d / 170) * 26 : 0;
          const px = x + (d ? (dx / d) * push : 0);
          const py = y + wave + (d ? (dy / d) * push : 0);
          const a = 0.1 + (push / 26) * 0.7;
          ctx.fillStyle = `rgba(110,150,222,${a})`;
          ctx.beginPath();
          ctx.arc(px, py, 1.4 + (push / 26) * 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      if (!still) raf = requestAnimationFrame(draw);
    };

    const move = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      if (still) draw();
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", move);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", move);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" />;
}
