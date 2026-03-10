"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Phone } from "lucide-react";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[500] flex items-center justify-between px-16 py-5 transition-all duration-400 ${
        scrolled
          ? "bg-[var(--nav-bg)] backdrop-blur-md border-b border-[var(--border)] !py-[13px] shadow-[var(--shadow)]"
          : ""
      }`}
    >
      <Link href="/" className="nav-logo">
        <span className="nd">DASH</span>
        <span className="ns">/</span>
        <span className="nd2">DELIVERY</span>
      </Link>
      
      <div className="flex gap-[30px]">
        {[
          { name: "Services", id: "services" },
          { name: "Track", id: "track" },
          { name: "Coverage", id: "coverage" },
          { name: "Pricing", id: "pricing" },
          { name: "About", id: "about" }
        ].map((item) => (
          <Link
            key={item.name}
            href={`/#${item.id}`}
            className="font-[family-name:var(--font-syne)] text-[11px] font-bold tracking-[2px] uppercase text-[var(--text3)] no-underline transition-colors duration-300 hover:text-[var(--o2)]"
          >
            {item.name}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-[18px]">
        <div className="font-[family-name:var(--font-syne)] flex items-center gap-[7px] text-[11px] font-semibold tracking-[0.5px] text-[var(--text3)]">
          <span className="h-[6px] w-[6px] rounded-full bg-[#22c55e] shadow-[0_0_7px_#22c55e] animate-[blink_2s_infinite]"></span>
          0800 DASH 247
        </div>
        <button 
          onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
          className="font-[family-name:var(--font-syne)] text-[11px] font-bold tracking-[2px] uppercase text-white bg-[var(--og)] outline-none border-none py-[11px] px-6 rounded hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(255,69,0,0.35)] transition-all duration-200"
        >
          Get a Quote
        </button>
      </div>
    </nav>
  );
}
