'use client';

import useSWR from 'swr';
import { fetcher } from '@/lib/api';

export default function AnalyticsPage() {
  const { data: analytics, isLoading } = useSWR('/admin/dashboard', fetcher);

  // Mocking more complex data for charts
  const monthlyData = [
    { label: 'Jan', val: 40 }, { label: 'Feb', val: 55 }, { label: 'Mar', val: 75 },
    { label: 'Apr', val: 60 }, { label: 'May', val: 90 }, { label: 'Jun', val: 110 }
  ];

  return (
    <div className="analytics-view">
      <header className="mb-10">
        <h1 className="text-3xl font-black mb-2">Network Analytics</h1>
        <p className="opacity-50 text-sm">Long-term performance trends and volume analysis</p>
      </header>

      <div className="grid lg:grid-cols-2 gap-8 mb-10">
        {/* Sales Chart */}
        <div className="bg-[var(--bg)] p-8 rounded-3xl border border-[var(--border)]">
          <h3 className="text-xl font-bold mb-8">Monthly Revenue Trend</h3>
          <div className="h-64 flex items-end justify-between gap-4">
            {monthlyData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-[#ff4500] rounded-t-lg transition-all duration-1000" 
                  style={{ height: `${d.val}%`, opacity: 0.3 + (i * 0.1) }}
                />
                <div className="mt-4 text-[10px] font-bold opacity-40">{d.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Parcel Volume */}
        <div className="bg-[var(--bg)] p-8 rounded-3xl border border-[var(--border)]">
          <h3 className="text-xl font-bold mb-8">Parcel Volume by Region</h3>
          <div className="space-y-6">
            {[
              { region: 'United Kingdom', count: 8500, pct: 45 },
              { region: 'France', count: 4200, pct: 25 },
              { region: 'Germany', count: 3100, pct: 20 },
              { region: 'Others', count: 1200, pct: 10 },
            ].map((r, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-bold">{r.region}</span>
                  <span className="opacity-50">{r.count} pcls</span>
                </div>
                <div className="h-2 bg-[var(--bg-alt)] rounded-full overflow-hidden">
                   <div className="h-full bg-[#ff4500]" style={{ width: `${r.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[var(--bg)] p-8 rounded-3xl border border-[var(--border)]">
        <h3 className="text-xl font-bold mb-6 text-center">System Health & Delivery Performance</h3>
        <div className="grid md:grid-cols-4 gap-8">
           <div className="text-center">
             <div className="text-3xl font-black text-[#2ecc71]">99.8%</div>
             <div className="text-[10px] uppercase font-bold opacity-40">System Uptime</div>
           </div>
           <div className="text-center">
             <div className="text-3xl font-black text-[#ff4500]">1.4s</div>
             <div className="text-[10px] uppercase font-bold opacity-40">Avg API Latency</div>
           </div>
           <div className="text-center">
             <div className="text-3xl font-black text-[#f1c40f]">94.2%</div>
             <div className="text-[10px] uppercase font-bold opacity-40">On-Time Accuracy</div>
           </div>
           <div className="text-center">
             <div className="text-3xl font-black text-[#3498db]">12ms</div>
             <div className="text-[10px] uppercase font-bold opacity-40">Web Core Vitals</div>
           </div>
        </div>
      </div>
    </div>
  );
}
