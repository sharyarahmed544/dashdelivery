"use client";

import { useEffect, useRef } from "react";

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let reqId: number;

    const sz = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    sz();
    window.addEventListener("resize", sz);

    const pts = Array.from({ length: 60 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.4 + 0.3,
      o: Math.random() * 0.25 + 0.05,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      const pc = "255,107,0";
      const lc = isDark ? "255,107,0" : "255,120,20";

      pts.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${pc},${p.o * (isDark ? 1 : 0.6)})`;
        ctx.fill();
      });

      pts.forEach((p, i) =>
        pts.slice(i + 1).forEach((q) => {
          const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(${lc},${0.045 * (1 - d / 110) * (isDark ? 1 : 0.6)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        })
      );
      reqId = requestAnimationFrame(draw);
    };

    reqId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", sz);
      cancelAnimationFrame(reqId);
    };
  }, []);

  return <canvas ref={canvasRef} id="bgCanvas" className="absolute inset-0 w-full h-full" />;
}
