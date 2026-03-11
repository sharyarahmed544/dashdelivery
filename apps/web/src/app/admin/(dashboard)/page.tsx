"use client";

import useSWR from 'swr';
import { fetcher } from '@/lib/api';
import {
  TrendingUp,
  Package,
  DollarSign,
  FileText,
  Users,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { RevenueChart, BookingsChart } from '@/components/admin/DashboardCharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function KPICard({ title, value, icon: Icon, trend, trendValue }: any) {
  return (
    <div className="admin-glass-card p-6 space-y-4 bg-white hover:border-[var(--admin-accent)] transition-all">
      <div className="flex items-center justify-between">
        <div className="p-3 bg-[#FFF5F2] rounded-2xl text-[var(--admin-accent)] border border-[#FF450015]">
          <Icon size={20} />
        </div>
        <div className={cn(
          "flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full",
          trend === 'up' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        )}>
          {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {trendValue}
        </div>
      </div>
      <div>
        <div className="text-[var(--admin-text-dim)] text-[10px] font-black uppercase tracking-[2px] mb-1">{title}</div>
        <div className="text-3xl font-bebas tracking-widest text-[var(--admin-text)]">{value}</div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { data, error, isLoading } = useSWR('/admin/dashboard', fetcher);

  if (isLoading) return (
    <div className="p-12 text-center flex flex-col items-center gap-4 animate-pulse">
      <div className="w-12 h-12 rounded-full border-2 border-t-[var(--admin-accent)] border-[var(--admin-border)] animate-spin" />
      <div className="text-[var(--admin-text-dim)] font-medium">Synchronizing enterprise data...</div>
    </div>
  );

  const stats = data?.data?.stats || {
    today_bookings: 0,
    monthly_revenue: 0,
    pending_quotes: 0,
    new_contacts: 0
  };

  const statusBreakdown = data?.data?.status_breakdown || [];

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bebas tracking-widest text-[var(--admin-text)]">System Insight</h1>
          <p className="text-[var(--admin-text-dim)] text-sm font-medium mt-1">Real-time logistics performance and revenue metrics</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white border border-[var(--admin-border)] px-4 py-2 rounded-2xl text-[10px] font-black text-[var(--admin-text-dim)] flex items-center gap-2 shadow-sm uppercase tracking-widest">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Live Cloud Sync
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
        <KPICard
          title="Consignments Today"
          value={stats.today_bookings}
          icon={Package}
          trend="up"
          trendValue="+14.2%"
        />
        <KPICard
          title="Revenue (30d)"
          value={`£${stats.monthly_revenue.toLocaleString()}`}
          icon={DollarSign}
          trend="up"
          trendValue="+9.4%"
        />
        <KPICard
          title="Active Quotes"
          value={stats.pending_quotes}
          icon={FileText}
          trend="down"
          trendValue="-3.1%"
        />
        <KPICard
          title="Customer Nodes"
          value={stats.new_contacts || 124}
          icon={Users}
          trend="up"
          trendValue="+21.5%"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 animate-fade-in [animation-delay:0.15s]">
        <div className="admin-glass-card p-8 bg-white">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-1">
              <h3 className="font-bebas text-2xl tracking-wide">Revenue Trajectory</h3>
              <p className="text-[10px] text-[var(--admin-text-dim)] font-bold uppercase tracking-widest">Growth Analytics</p>
            </div>
            <span className="text-[10px] font-black text-[var(--admin-text-dim)] uppercase bg-[#F1F5F9] px-3 py-1 rounded-full border border-black/5 tracking-wider">L7 DAYS</span>
          </div>
          <RevenueChart />
        </div>
        <div className="admin-glass-card p-8 bg-white">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-1">
              <h3 className="font-bebas text-2xl tracking-wide">Shipment Volume</h3>
              <p className="text-[10px] text-[var(--admin-text-dim)] font-bold uppercase tracking-widest">Capacity Metrics</p>
            </div>
            <span className="text-[10px] font-black text-[var(--admin-text-dim)] uppercase bg-[#F1F5F9] px-3 py-1 rounded-full border border-black/5 tracking-wider">L7 DAYS</span>
          </div>
          <BookingsChart />
        </div>
      </div>

      {/* Status Breakdown Section */}
      <div className="admin-glass-card overflow-hidden animate-fade-in [animation-delay:0.3s] bg-white">
        <div className="p-6 border-b border-[var(--admin-border)] bg-[#F8FAFC]/50 flex items-center justify-between">
          <h3 className="font-bebas text-xl tracking-widest flex items-center gap-2">
            <TrendingUp size={20} className="text-[var(--admin-accent)]" />
            Consignment Lifecycle Breakdown
          </h3>
          <button className="text-[10px] font-black text-[var(--admin-accent)] uppercase tracking-widest hover:underline">Global Registry</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
          {statusBreakdown.map((item: any, idx: number) => (
            <div key={idx} className="bg-white border border-[var(--admin-border)] p-5 rounded-2xl flex items-center justify-between group hover:border-[var(--admin-accent)] hover:shadow-lg transition-all">
              <div className="space-y-1">
                <div className="text-[10px] font-black text-[var(--admin-text-dim)] uppercase tracking-[2px]">{item.status.replace(/_/g, ' ')}</div>
                <div className="text-2xl font-bebas tracking-wider text-[var(--admin-text)]">{item._count.id || 0}</div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#F8FAFC] flex items-center justify-center text-[var(--admin-text-dim)] group-hover:bg-[#FFF5F2] group-hover:text-[var(--admin-accent)] transition-colors border border-black/[0.03]">
                <Package size={22} />
              </div>
            </div>
          ))}
          {statusBreakdown.length === 0 && (
            <div className="col-span-full py-12 text-center text-[var(--admin-text-dim)] font-bold uppercase tracking-widest border-2 border-dashed border-[var(--admin-border)] rounded-2xl opacity-40">
              Zero Active Consignments
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
