"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Phone } from "lucide-react";

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname?.startsWith('/admin')) return null;

  return (
    <nav
      className={`main-nav ${scrolled ? 'scrolled' : ''}`}
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
          { name: "Pricing", id: "pricing" },
          { name: "Business", id: "business" },
          { name: "About", id: "about" }
        ].map((item) => (
          <Link
            key={item.name}
            href={`/${item.id}`}
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
        <Link
          href="/quote"
          className="font-[family-name:var(--font-syne)] text-[11px] font-bold tracking-[2px] uppercase text-white bg-[var(--og)] outline-none border-none py-[11px] px-6 rounded hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(255,69,0,0.35)] transition-all duration-200"
        >
          Get a Quote
        </Link>
      </div>
    </nav>
  );
}
