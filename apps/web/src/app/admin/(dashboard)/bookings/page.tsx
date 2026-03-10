"use client";

import { useEffect, useState } from "react";
import { getAdminBookings, Booking } from "@/app/actions/admin";

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const data = await getAdminBookings();
      setBookings(data);
      setLoading(false);
    }
    fetch();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl font-bold font-['Syne']">Manage Bookings</h1>
      <p className="text-gray-400">View and manage all active and past shipments.</p>
      
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No bookings found yet.</div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 text-sm uppercase tracking-wider">
                <th className="py-4 px-6 font-medium">Tracking ID</th>
                <th className="py-4 px-6 font-medium">Client</th>
                <th className="py-4 px-6 font-medium">Route</th>
                <th className="py-4 px-6 font-medium">Status</th>
                <th className="py-4 px-6 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 px-6 font-mono text-[var(--og)]">{booking.id}</td>
                  <td className="py-4 px-6 font-medium">{booking.clientName}</td>
                  <td className="py-4 px-6 text-gray-300">{booking.route}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                      booking.status === 'Delivered' ? 'bg-green-500/10 text-green-500' :
                      booking.status === 'In Transit' ? 'bg-yellow-500/10 text-yellow-500' :
                      'bg-blue-500/10 text-blue-500'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right font-bold text-white">£{booking.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
