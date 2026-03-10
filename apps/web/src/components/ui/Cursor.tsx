"use client";

import { useEffect, useState, useRef } from "react";

export default function Cursor() {
  const innerRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const [isPointer, setIsPointer] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Use refs for positions to avoid re-renders on every pixel moved
  const requestRef = useRef<number | undefined>(undefined);
  const mousePos = useRef({ x: -100, y: -100 });
  const lagPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    setMounted(true);
    
    let isFirstMove = true;

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      if (isFirstMove) {
        lagPos.current.x = e.clientX;
        lagPos.current.y = e.clientY;
        isFirstMove = false;
      }

      // Update inner dot immediately via DOM for zero lag
      if (innerRef.current) {
        innerRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
        innerRef.current.style.opacity = "1";
      }

      // Check for pointer elements
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

    // Physics loop for lagging outer ring
    const loop = () => {
      const dx = mousePos.current.x - lagPos.current.x;
      const dy = mousePos.current.y - lagPos.current.y;
      
      lagPos.current.x += dx * 0.15;
      lagPos.current.y += dy * 0.15;

      if (outerRef.current) {
        outerRef.current.style.transform = `translate3d(${lagPos.current.x}px, ${lagPos.current.y}px, 0) translate(-50%, -50%)`;
        outerRef.current.style.opacity = "1";
      }

      requestRef.current = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMouseMove);
    requestRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  if (!mounted) return null;

  return (
    <>
      <div
        ref={innerRef}
        id="cur"
        style={{
          width: isPointer ? "12px" : "8px",
          height: isPointer ? "12px" : "8px",
          transition: "width 0.3s, height 0.3s",
          opacity: 0, // Shown on first move
          zIndex: 2147483647,
          backgroundColor: "#FF6B00", // Fallback to brand orange
          boxShadow: "0 0 10px rgba(255,107,0,0.5)"
        }}
        className="fixed top-0 left-0 pointer-events-none rounded-full"
      />
      <div
        ref={outerRef}
        id="cur2"
        style={{
          width: isPointer ? "48px" : "34px",
          height: isPointer ? "48px" : "34px",
          borderColor: isPointer ? "rgba(255,107,0,0.8)" : "rgba(255,107,0,0.45)",
          borderWidth: "1.5px",
          borderStyle: "solid",
          transition: "width 0.3s, height 0.3s, border-color 0.3s",
          opacity: 0, // Shown on first move
          zIndex: 2147483646,
          backdropFilter: "blur(1px)"
        }}
        className="fixed top-0 left-0 pointer-events-none rounded-full"
      />
    </>
  );
}
