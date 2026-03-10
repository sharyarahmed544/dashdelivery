'use client';

import { TrackerWidget } from '@/components/sections/TrackerWidget';

export default function TrackPage() {
  return (
    <div className="pt-32 pb-20 min-h-screen">
      <section className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-5xl font-black mb-6 uppercase">Track Parcel</h1>
            <p className="text-xl opacity-60">
              Enter your 12-digit tracking number to see real-time GPS updates and estimated delivery time.
            </p>
          </div>
          
          <div className="bg-[var(--bg-alt)] p-8 rounded-3xl border border-[var(--border)]">
            <TrackerWidget />
          </div>

          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-[var(--bg)] border border-[var(--border)]">
              <div className="text-2xl mb-4">📍</div>
              <h4 className="font-bold mb-2">Live GPS</h4>
              <p className="text-sm opacity-50">See exactly where your driver is on the map.</p>
            </div>
            <div className="p-6 rounded-2xl bg-[var(--bg)] border border-[var(--border)]">
              <div className="text-2xl mb-4">🔔</div>
              <h4 className="font-bold mb-2">Instant Alerts</h4>
              <p className="text-sm opacity-50">Get SMS and email updates at every milestone.</p>
            </div>
            <div className="p-6 rounded-2xl bg-[var(--bg)] border border-[var(--border)]">
              <div className="text-2xl mb-4">📸</div>
              <h4 className="font-bold mb-2">Proof of Delivery</h4>
              <p className="text-sm opacity-50">View photos and signatures upon successful delivery.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
