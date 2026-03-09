"use client";

import { useEffect, useState } from "react";

export default function Cursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [lagPos, setLagPos] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Check if touch device
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsTouch(true);
      return;
    }

    let requestRef: number;

    const onMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });

      // Check if hovering over a clickable element
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === "a" ||
        target.tagName.toLowerCase() === "button" ||
        target.closest("a") ||
        target.closest("button")
      ) {
        setIsPointer(true);
      } else {
        setIsPointer(false);
      }
    };

    window.addEventListener("mousemove", onMouseMove);

    // Physics loop for lagging cursor
    const loop = () => {
      setLagPos((prev) => {
        const dx = pos.x - prev.x;
        const dy = pos.y - prev.y;
        return {
          x: prev.x + dx * 0.15,
          y: prev.y + dy * 0.15,
        };
      });
      requestRef = requestAnimationFrame(loop);
    };
    
    requestRef = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(requestRef);
    };
  }, [pos.x, pos.y]);

  if (isTouch) return null;

  return (
    <>
      <div
        id="cur"
        style={{
          left: pos.x,
          top: pos.y,
          width: isPointer ? "12px" : "8px",
          height: isPointer ? "12px" : "8px",
        }}
        className="fixed pointer-events-none rounded-full bg-[var(--o2)] z-[9999] -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
      />
      <div
        id="cur2"
        style={{
          left: lagPos.x,
          top: lagPos.y,
          width: isPointer ? "48px" : "34px",
          height: isPointer ? "48px" : "34px",
          borderColor: isPointer ? "rgba(255,107,0,0.8)" : "rgba(255,107,0,0.45)",
          borderWidth: "1.5px",
          borderStyle: "solid",
        }}
        className="fixed pointer-events-none rounded-full z-[9998] -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
      />
    </>
  );
}
