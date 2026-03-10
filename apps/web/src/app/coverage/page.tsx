'use client';

import useSWR from 'swr';
import { fetcher } from '@/lib/api';

export default function CoveragePage() {
  const { data: depots } = useSWR('/depots', fetcher);

  return (
    <div className="pt-32 pb-20">
      <section className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <h1 className="text-6xl font-black mb-8 uppercase leading-none">Global Network,<br /><span className="text-[#ff4500]">Local Speed</span></h1>
            <p className="text-2xl opacity-60 mb-12">
              With over 250 strategic hubs across the UK and Europe, Dash ensures your parcel is never more than 90 minutes away from its next milestone.
            </p>
            
            <div className="grid grid-cols-2 gap-10">
              <div className="p-8 bg-[var(--bg-alt)] rounded-3xl border border-[var(--border)]">
                <div className="text-4xl font-black text-[#ff4500] mb-2">28</div>
                <div className="text-sm opacity-50 uppercase font-bold text-[10px]">Countries Covered</div>
              </div>
              <div className="p-8 bg-[var(--bg-alt)] rounded-3xl border border-[var(--border)]">
                <div className="text-4xl font-black text-[#ff4500] mb-2">1,500+</div>
                <div className="text-sm opacity-50 uppercase font-bold text-[10px]">Local Agents</div>
              </div>
            </div>
          </div>

          <div className="aspect-[4/3] bg-[var(--bg-alt)] rounded-[40px] border border-[var(--border)] relative overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 opacity-10 grayscale invert pointer-events-none">
               {/* Map Background Placeholder */}
               <div style={{ fontSize: '15rem', display: 'flex', alignItems: 'center', justifyItems: 'center', height: '100%', width: '100%', justifyContent: 'center' }}>🗺️</div>
            </div>
            <div className="relative z-10 p-10 bg-[var(--bg)] rounded-3xl border border-[var(--border)] shadow-2xl max-w-sm">
              <h4 className="font-bold text-xl mb-4">Active Hubs</h4>
              <div className="space-y-4 max-h-60 overflow-y-auto pr-4 scrollbar-thin">
                {depots?.map((d: any) => (
                  <div key={d.id} className="flex justify-between items-center text-sm">
                    <span className="font-bold">{d.name}</span>
                    <span className="opacity-50">{d.location_type}</span>
                  </div>
                ))}
                {(!depots || depots.length === 0) && (
                  <div className="text-sm opacity-40 italic">Syncing live depot data...</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
