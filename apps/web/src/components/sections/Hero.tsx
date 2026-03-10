"use client";

import ParticleCanvas from "@/components/ui/ParticleCanvas";
import LiveMapPanel from "@/components/ui/LiveMapPanel";

export default function Hero() {
  return (
    <section className="hero">
      <ParticleCanvas />
      <div className="hero-inner">
        <div>
          <div className="hero-eyebrow">
            <div className="eyebrow-line"></div>
            <span className="eyebrow-text">UK & Europe's Fastest Courier — Est. 2015</span>
          </div>
          <h1 className="hero-h1">
            <span className="w1">SPEED</span>
            <span className="w2">DELIVERED.</span>
            <span className="w3">EVERYWHERE.</span>
          </h1>
          <p className="hero-body">
            From London to Lisbon, Edinburgh to Athens — Dash moves your parcels faster, smarter and safer. Real-time tracking, same-day options, zero excuses.
          </p>
          <div className="hero-btns">
            <button 
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-fire"
            >
              <span>📦 Book a Delivery</span>
            </button>
            <button 
              onClick={() => document.getElementById('track')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-border"
            >
              ↗ Track Your Parcel
            </button>
            <button 
              onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-border"
            >
              🏢 Services
            </button>
          </div>
          <div className="hero-stats-row">
            <div className="hstat"><div className="hstat-n">4.2M+</div><div className="hstat-l">Parcels Delivered</div></div>
            <div className="hstat"><div className="hstat-n">28</div><div className="hstat-l">Countries</div></div>
            <div className="hstat"><div className="hstat-n">99.4%</div><div className="hstat-l">On-Time Rate</div></div>
            <div className="hstat"><div className="hstat-n">12K+</div><div className="hstat-l">Businesses</div></div>
          </div>
        </div>
        <LiveMapPanel />
      </div>
    </section>
  );
}
