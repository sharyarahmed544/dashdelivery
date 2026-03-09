"use client";

import { useEffect } from "react";
import Hero from "@/components/sections/Hero";
import Marquee from "@/components/ui/Marquee";
import Footer from "@/components/ui/Footer";
import { ServicesBento } from "@/components/sections/ServicesBento";
import { TrackerWidget } from "@/components/sections/TrackerWidget";
import { Coverage } from "@/components/sections/Coverage";
import { PriceCalculator } from "@/components/sections/PriceCalculator";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Testimonials } from "@/components/sections/Testimonials";
import { AppPromo } from "@/components/sections/AppPromo";
import { CtaBanner } from "@/components/sections/CtaBanner";

export default function Home() {
  useEffect(() => {
    // Scroll Reveal 
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));

    // Magnetic Glow on Bento Cards
    const bcards = document.querySelectorAll(".bcard");
    const onMouseMove = function (this: HTMLElement, e: MouseEvent) {
      const r = this.getBoundingClientRect();
      this.style.setProperty("--mx", ((e.clientX - r.left) / r.width) * 100 + "%");
      this.style.setProperty("--my", ((e.clientY - r.top) / r.height) * 100 + "%");
    };
    bcards.forEach((c) => {
      c.addEventListener("mousemove", onMouseMove as EventListener);
    });

    return () => {
      obs.disconnect();
      bcards.forEach((c) => {
        c.removeEventListener("mousemove", onMouseMove as EventListener);
      });
    };
  }, []);

  return (
    <main>
      <Hero />
      <Marquee />
      <ServicesBento />
      <TrackerWidget />
      <Coverage />
      <PriceCalculator />
      <HowItWorks />
      <Testimonials />
      <AppPromo />
      <CtaBanner />
      <Footer />
    </main>
  );
}
