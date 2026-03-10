"use client";

import useSWR from 'swr';
import { fetcher } from '@/lib/api';

export default function AdminQuotes() {
  const { data: quotes, error, isLoading } = useSWR('/admin/quotes', fetcher);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl font-bold font-['Syne']">Manage Quotes</h1>
      <p className="text-gray-400">Review pending quotes for custom freight requests.</p>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden min-h-[300px] flex items-center justify-center">
        {isLoading ? (
          <div className="text-gray-500 animate-pulse">Loading quotes...</div>
        ) : !quotes || quotes.length === 0 ? (
          <div className="text-center">
            <div className="text-4xl mb-4">📄</div>
            <p className="text-gray-500">No custom quotes requested yet.</p>
          </div>
        ) : (
          <table className="w-full text-left self-start">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 text-xs tracking-wider uppercase font-bold">
                <th className="py-4 px-6">Requester</th>
                <th className="py-4 px-6">Details</th>
                <th className="py-4 px-6 text-center">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {quotes.map((quote: any) => (
                <tr key={quote.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 px-6 font-bold text-white">{quote.email || quote.customer_name}</td>
                  <td className="py-4 px-6 text-gray-400 text-sm max-w-xs truncate">
                    {quote.pickup_country} → {quote.delivery_country} | {quote.service_type}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${quote.status === 'PENDING' ? 'bg-orange-500/10 text-orange-500' : 'bg-green-500/10 text-green-500'}`}>
                      {quote.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="text-[var(--og)] text-xs font-bold hover:underline">Review →</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
