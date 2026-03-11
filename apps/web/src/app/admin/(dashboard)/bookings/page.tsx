"use client";

import useSWR, { mutate } from 'swr';
import { fetcher, api } from '@/lib/api';
import { useState } from 'react';
import { Package, MoreHorizontal, ArrowRight, Calendar, Filter, Download } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function AdminBookings() {
  const { data: bookingsRes, error, isLoading } = useSWR('/admin/bookings', fetcher);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const bookings = bookingsRes?.data || [];

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const { data } = await api.put(`/admin/bookings/${id}/status`, {
        status: newStatus,
        location: 'HQ Command Center',
        description: `Status broadcast: Manual transition to ${newStatus.replace(/_/g, ' ')}`
      });
      if (data.success) {
        mutate('/admin/bookings');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bebas tracking-widest text-[var(--admin-text)]">Consignment Ledger</h1>
          <p className="text-[var(--admin-text-dim)] text-sm font-medium mt-1">Full-spectrum management of all active transport nodes</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-[var(--admin-border)] px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#F8FAFC] transition-all">
            <Download size={14} />
            Export Data
          </button>
          <button className="flex items-center gap-2 bg-white border border-[var(--admin-border)] px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#F8FAFC] transition-all">
            <Filter size={14} />
            Advanced Filter
          </button>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="admin-glass-card p-6 bg-white flex items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <Package size={24} />
          </div>
          <div>
            <div className="text-[10px] font-black text-[var(--admin-text-dim)] uppercase tracking-widest">Total Active</div>
            <div className="text-2xl font-bebas tracking-wider text-[var(--admin-text)]">{bookings.length} Nodes</div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="admin-glass-card overflow-hidden bg-white border border-black/[0.03]">
        {isLoading ? (
          <div className="p-20 text-center flex flex-col items-center gap-4 animate-pulse">
            <div className="w-10 h-10 rounded-full border-2 border-t-[var(--admin-accent)] border-[var(--admin-border)] animate-spin" />
            <div className="text-[10px] font-black text-[var(--admin-text-dim)] uppercase tracking-widest">Accessing ledger...</div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-20 text-center space-y-4 opacity-40">
            <Package size={48} className="mx-auto text-[var(--admin-text-dim)]" />
            <div className="text-xs font-black uppercase tracking-widest">No active consignments found</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[var(--admin-border)] text-[var(--admin-text-dim)] text-[10px] uppercase tracking-[2px] font-black">
                  <th className="py-5 px-8">Consignment Node</th>
                  <th className="py-5 px-8">Routing Protocol</th>
                  <th className="py-5 px-8 text-center">Protocol</th>
                  <th className="py-5 px-8">Broadcast Status</th>
                  <th className="py-5 px-8 text-right">Utility</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--admin-border)]">
                {bookings.map((b: any) => (
                  <tr key={b.id} className="hover:bg-[#F8FAFC] transition-all group">
                    <td className="py-6 px-8">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-white border border-[var(--admin-border)] text-[var(--admin-accent)] group-hover:bg-[#FFF5F2] transition-colors">
                          <Package size={18} />
                        </div>
                        <div>
                          <div className="font-bebas text-lg tracking-widest text-[var(--admin-text)]">{b.tracking_number}</div>
                          <div className="flex items-center gap-2 text-[10px] text-[var(--admin-text-dim)] font-black uppercase mt-0.5">
                            <Calendar size={10} />
                            {new Date(b.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-8">
                      <div className="flex items-center gap-3 text-[11px] font-bold text-[var(--admin-text)] max-w-[280px]">
                        <span className="truncate">{b.pickup_address}</span>
                        <ArrowRight size={14} className="text-[var(--admin-accent)] shrink-0" />
                        <span className="truncate">{b.delivery_address}</span>
                      </div>
                    </td>
                    <td className="py-6 px-8 text-center">
                      <span className="text-[9px] bg-white border border-[var(--admin-border)] px-3 py-1.5 rounded-xl uppercase font-black text-[var(--admin-text-dim)] tracking-widest group-hover:border-[var(--admin-accent)]/20 transition-all">
                        {b.service_type || 'EXPRESS'}
                      </span>
                    </td>
                    <td className="py-6 px-8">
                      <select
                        className="bg-white border border-[var(--admin-border)] rounded-xl px-4 py-2.5 text-[11px] font-black text-[var(--admin-text)] outline-none focus:border-[var(--admin-accent)] focus:ring-2 focus:ring-orange-500/10 cursor-pointer transition-all appearance-none uppercase tracking-wider"
                        value={b.status}
                        disabled={updatingId === b.id}
                        onChange={(e) => handleStatusUpdate(b.id, e.target.value)}
                      >
                        {['BOOKED', 'PICKED_UP', 'IN_TRANSIT', 'AT_FACILITY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'DELAYED', 'CANCELLED'].map(s => (
                          <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-6 px-8 text-right">
                      <button className="p-2.5 rounded-xl border border-[var(--admin-border)] text-[var(--admin-text-dim)] hover:text-[var(--admin-text)] hover:bg-white hover:border-[var(--admin-accent)] transition-all shadow-sm">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
