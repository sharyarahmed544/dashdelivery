"use client";

import { useEffect, useState } from "react";
import { getAdminQuotes, Quote } from "@/app/actions/admin";

export default function AdminQuotes() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const data = await getAdminQuotes();
      setQuotes(data);
      setLoading(false);
    }
    fetch();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl font-bold font-['Syne']">Manage Quotes</h1>
      <p className="text-gray-400">Review pending quotes for custom freight requests.</p>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden text-center min-h-[300px] flex items-center justify-center">
        {loading ? (
          <div className="text-gray-500 animate-pulse">Loading quotes...</div>
        ) : quotes.length === 0 ? (
          <div className="text-gray-500">
            <div className="text-4xl mb-4">📄</div>
            <p>No custom quotes requested yet.</p>
          </div>
        ) : (
          <table className="w-full text-left self-start">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 text-sm tracking-wider uppercase">
                <th className="py-4 px-6 font-medium">Requester</th>
                <th className="py-4 px-6 font-medium">Details</th>
                <th className="py-4 px-6 font-medium">Status</th>
                <th className="py-4 px-6 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {quotes.map((quote) => (
                <tr key={quote.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 px-6 font-bold">{quote.clientEmail}</td>
                  <td className="py-4 px-6 text-gray-400 max-w-xs truncate">{quote.details}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${quote.status === 'Pending' ? 'bg-orange-500/10 text-orange-500' : 'bg-green-500/10 text-green-500'}`}>
                      {quote.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="text-[var(--og)] font-bold hover:underline">Review →</button>
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
