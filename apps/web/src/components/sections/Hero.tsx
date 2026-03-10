"use client";

import ParticleCanvas from "@/components/ui/ParticleCanvas";
import LiveMapPanel from "@/components/ui/LiveMapPanel";
import useSWR from 'swr';
import { fetcher } from '@/lib/api';

export default function Hero() {
  const { data: content } = useSWR('/content', fetcher);
  const { data: stats } = useSWR('/stats', fetcher);

  const heroTitle = content?.['hero-title']?.title || 'SPEED DELIVERED. EVERYWHERE.';
  const heroSub = content?.['hero-sub']?.body || 'From London to Lisbon, Edinburgh to Athens — Dash moves your parcels faster, smarter and safer.';

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
            {heroTitle.split(' ').map((word: string, i: number) => (
              <span key={i} className={`w${(i % 3) + 1}`}>{word} </span>
            ))}
          </h1>
          <p className="hero-body">
            {heroSub}
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
          </div>
          <div className="hero-stats-row">
            <div className="hstat"><div className="hstat-n">{(stats?.parcels_delivered / 1000000).toFixed(1)}M+</div><div className="hstat-l">Parcels Delivered</div></div>
            <div className="hstat"><div className="hstat-n">{stats?.countries_covered || 28}</div><div className="hstat-l">Countries</div></div>
            <div className="hstat"><div className="hstat-n">{stats?.on_time_rate || 99.4}%</div><div className="hstat-l">On-Time Rate</div></div>
            <div className="hstat"><div className="hstat-n">{(stats?.businesses / 1000).toFixed(0)}K+</div><div className="hstat-l">Businesses</div></div>
          </div>
        </div>
        <LiveMapPanel />
      </div>
    </section>
  );
}
