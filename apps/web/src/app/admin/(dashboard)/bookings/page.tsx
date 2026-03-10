"use client";

import useSWR, { mutate } from 'swr';
import { fetcher, api } from '@/lib/api';
import { useState } from 'react';

export default function AdminBookings() {
  const { data: bookings, error, isLoading } = useSWR('/admin/bookings', fetcher);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const { data } = await api.put(`/admin/bookings/${id}/status`, {
        status: newStatus,
        location: 'Admin Panel',
        description: `Status manually updated to ${newStatus}`
      });
      if (data.success) {
        mutate('/admin/bookings');
      }
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl font-bold font-['Syne']">Manage Bookings</h1>
      <p className="text-gray-400">View and manage all active and past shipments.</p>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-gray-500 animate-pulse">Loading bookings...</div>
        ) : !bookings || bookings.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No bookings found in the system.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 text-xs uppercase tracking-wider font-bold">
                  <th className="py-4 px-6">Tracking #</th>
                  <th className="py-4 px-6">Route</th>
                  <th className="py-4 px-6 text-center">Service</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {bookings.map((b: any) => (
                  <tr key={b.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-[var(--og)]">{b.tracking_number}</div>
                      <div className="text-[10px] text-gray-500">{new Date(b.created_at).toLocaleDateString()}</div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-300">
                      <div>{b.pickup_address}</div>
                      <div className="text-gray-500 mt-1">→ {b.delivery_address}</div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="text-[10px] bg-white/5 px-2 py-1 rounded-full uppercase font-bold text-gray-400 border border-white/5">{b.service_type}</span>
                    </td>
                    <td className="py-4 px-6">
                      <select
                        className="bg-[#111] border border-white/10 rounded-lg px-3 py-1.5 text-xs font-semibold text-white outline-none focus:border-[var(--og)]"
                        value={b.status}
                        disabled={updatingId === b.id}
                        onChange={(e) => handleStatusUpdate(b.id, e.target.value)}
                      >
                        {['BOOKED', 'COLLECTED', 'IN_SORTING_HUB', 'CUSTOMS_CLEARED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'FAILED', 'CANCELLED'].map(s => (
                          <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button className="text-xs font-bold hover:text-[var(--og)] transition-colors border border-white/10 rounded-lg px-4 py-1.5">Details</button>
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
