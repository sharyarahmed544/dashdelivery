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
      <Link href="/" className="flex items-center gap-1 font-[family-name:var(--font-bebas)] text-[26px] tracking-[4px] no-underline">
        <span className="bg-[var(--og2)] bg-clip-text text-transparent">DASH</span>
        <span className="text-[rgba(255,107,0,0.3)] mx-[2px]">/</span>
        <span className="text-[var(--text)]">DELIVERY</span>
      </Link>
      
      <div className="flex gap-[30px]">
        {["Services", "Track", "Coverage", "Business", "Pricing", "About"].map((item) => (
          <Link
            key={item}
            href={`/${item.toLowerCase()}`}
            className="font-[family-name:var(--font-syne)] text-[11px] font-bold tracking-[2px] uppercase text-[var(--text3)] no-underline transition-colors duration-300 hover:text-[var(--o2)]"
          >
            {item}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-[18px]">
        <div className="font-[family-name:var(--font-syne)] flex items-center gap-[7px] text-[11px] font-semibold tracking-[0.5px] text-[var(--text3)]">
          <span className="h-[6px] w-[6px] rounded-full bg-[#22c55e] shadow-[0_0_7px_#22c55e] animate-[blink_2s_infinite]"></span>
          0800 DASH 247
        </div>
        <button className="font-[family-name:var(--font-syne)] text-[11px] font-bold tracking-[2px] uppercase text-white bg-[var(--og)] outline-none border-none py-[11px] px-6 rounded hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(255,69,0,0.35)] transition-all duration-200" style={{ cursor: "none" }}>
          Get a Quote
        </button>
      </div>
    </nav>
  );
}
