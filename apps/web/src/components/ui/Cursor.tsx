"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

export default function Cursor() {
  const pathname = usePathname();
  const innerRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const [isPointer, setIsPointer] = useState(false);
  const [mounted, setMounted] = useState(false);

  const requestRef = useRef<number | undefined>(undefined);
  const mousePos = useRef({ x: -100, y: -100 });
  const lagPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const isAdmin = pathname?.startsWith('/admin');

    if (isAdmin) {
      document.body.classList.remove('custom-cursor-enabled');
      return;
    }

    setMounted(true);
    document.body.classList.add('custom-cursor-enabled');

    let isFirstMove = true;

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      if (isFirstMove) {
        lagPos.current.x = e.clientX;
        lagPos.current.y = e.clientY;
        isFirstMove = false;
      }

      if (innerRef.current) {
        innerRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
        innerRef.current.style.opacity = "1";
      }

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
      document.body.classList.remove('custom-cursor-enabled');
    };
  }, [pathname]);

  if (!mounted || pathname?.startsWith('/admin')) return null;

  return (
    <>
      <div
        ref={innerRef}
        id="cur"
        style={{
          width: isPointer ? "12px" : "8px",
          height: isPointer ? "12px" : "8px",
          transition: "width 0.3s, height 0.3s",
          opacity: 0,
          zIndex: 2147483647,
          backgroundColor: "#FF6B00",
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
          opacity: 0,
          zIndex: 2147483646,
          backdropFilter: "blur(1px)"
        }}
        className="fixed top-0 left-0 pointer-events-none rounded-full"
      />
    </>
  );
}
