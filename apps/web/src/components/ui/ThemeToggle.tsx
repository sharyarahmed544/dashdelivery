"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") {
      setTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
      document.documentElement.setAttribute("data-theme", prefersDark ? "dark" : "light");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  if (pathname?.startsWith('/admin')) return null;
  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle hover:scale-108 fixed bottom-8 right-8 z-[600] flex h-[52px] w-[52px] items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[20px] shadow-[var(--shadow-lg)] transition-all duration-300 hover:border-[rgba(255,107,0,0.3)] hover:shadow-[0_16px_48px_rgba(255,107,0,0.2)]"
      title="Toggle dark mode"
      style={{ cursor: "none" }}
    >
      {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
}
