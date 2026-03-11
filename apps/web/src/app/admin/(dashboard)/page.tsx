"use client";

import useSWR from 'swr';
import { fetcher } from '@/lib/api';

export default function AdminDashboard() {
  const { data, error, isLoading } = useSWR('/admin/dashboard', fetcher);

  if (isLoading) return <div className="p-12 text-center text-gray-500 animate-pulse">Loading analytics...</div>;
  if (error) return <div className="p-12 text-center text-red-400">Failed to load dashboard data.</div>;

  const stats = data?.stats || {
    today_bookings: 0,
    monthly_revenue: 0,
    pending_quotes: 0,
    new_contacts: 0
  };

  const statusBreakdown = data?.status_breakdown || [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-['Syne']">Overview</h1>
          <p className="text-gray-400 mt-1">Welcome back, Admin. Here's what's happening today.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-2xl shadow-sm">
          <div className="text-[var(--text3)] text-sm font-medium mb-2 uppercase tracking-wider">Today's Bookings</div>
          <div className="text-4xl font-bold text-[var(--text)]">{stats.today_bookings}</div>
        </div>
        <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-2xl shadow-sm">
          <div className="text-[var(--text3)] text-sm font-medium mb-2 uppercase tracking-wider">Revenue Monthly</div>
          <div className="text-4xl font-bold text-[var(--text)]">£{stats.monthly_revenue.toLocaleString()}</div>
        </div>
        <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-2xl shadow-sm">
          <div className="text-[var(--text3)] text-sm font-medium mb-2 uppercase tracking-wider">Pending Quotes</div>
          <div className="text-4xl font-bold text-[var(--text)]">{stats.pending_quotes}</div>
        </div>
        <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-2xl shadow-sm">
          <div className="text-[var(--text3)] text-sm font-medium mb-2 uppercase tracking-wider">New Enquiries</div>
          <div className="text-4xl font-bold text-[var(--text)]">{stats.new_contacts || 0}</div>
        </div>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] p-8 rounded-2xl shadow-sm">
        <h2 className="text-xl font-bold mb-6">Status Breakdown</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statusBreakdown.map((item: any, idx: number) => (
            <div key={idx} className="bg-[var(--bg2)] p-4 rounded-xl border border-[var(--border)] flex justify-between items-center transition-all hover:border-[var(--o2)]">
              <span className="text-sm font-medium text-[var(--text3)] uppercase tracking-tight">{item.status.replace(/_/g, ' ')}</span>
              <span className="text-xl font-bold text-[var(--o1)]">{item._count.id}</span>
            </div>
          ))}
          {statusBreakdown.length === 0 && (
            <div className="col-span-full py-8 text-center text-[var(--text4)] italic">No active parcel data.</div>
          )}
        </div>
      </div>
    </div>
  );
}
