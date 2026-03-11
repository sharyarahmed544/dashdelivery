"use client";

import useSWR from 'swr';
import { fetcher } from '@/lib/api';
import { FileText, Mail, Map, ArrowRight, User, MoreVertical, Search, Filter } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function AdminQuotes() {
  const { data: quotesRes, error, isLoading } = useSWR('/admin/quotes', fetcher);
  const quotes = quotesRes?.data || [];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bebas tracking-widest text-[var(--admin-text)]">Inquiry Pipeline</h1>
          <p className="text-[var(--admin-text-dim)] text-sm font-medium mt-1">Reviewing custom freight requests and strategic pricing enquries</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-[var(--admin-border)] px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#F8FAFC] transition-all">
            <Search size={14} />
            Search Inquiries
          </button>
          <button className="flex items-center gap-2 bg-white border border-[var(--admin-border)] px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#F8FAFC] transition-all">
            <Filter size={14} />
            Filter Status
          </button>
        </div>
      </div>

      {/* Inbox Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="admin-glass-card p-6 bg-white flex items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[var(--admin-accent)] flex items-center justify-center border border-orange-100">
            <FileText size={24} />
          </div>
          <div>
            <div className="text-[10px] font-black text-[var(--admin-text-dim)] uppercase tracking-widest">Active Requests</div>
            <div className="text-2xl font-bebas tracking-wider text-[var(--admin-text)]">{quotes.length} Pending</div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="admin-glass-card overflow-hidden bg-white border border-black/[0.03]">
        {isLoading ? (
          <div className="p-20 text-center flex flex-col items-center gap-4 animate-pulse">
            <div className="w-10 h-10 rounded-full border-2 border-t-[var(--admin-accent)] border-[var(--admin-border)] animate-spin" />
            <div className="text-[10px] font-black text-[var(--admin-text-dim)] uppercase tracking-widest">Accessing pipeline...</div>
          </div>
        ) : quotes.length === 0 ? (
          <div className="p-20 text-center space-y-4 opacity-40">
            <FileText size={48} className="mx-auto text-[var(--admin-text-dim)]" />
            <div className="text-xs font-black uppercase tracking-widest">Pipeline is currently empty</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[var(--admin-border)] text-[var(--admin-text-dim)] text-[10px] uppercase tracking-[2px] font-black">
                  <th className="py-5 px-8">Potential Client</th>
                  <th className="py-5 px-8">Freight Logic</th>
                  <th className="py-5 px-8 text-center">Status node</th>
                  <th className="py-5 px-8 text-right">Utility</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--admin-border)]">
                {quotes.map((quote: any) => (
                  <tr key={quote.id} className="hover:bg-[#F8FAFC] transition-all group">
                    <td className="py-6 px-8">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#F1F5F9] flex items-center justify-center text-[var(--admin-text-dim)] group-hover:bg-[#FFF5F2] group-hover:text-[var(--admin-accent)] transition-all">
                          <User size={18} />
                        </div>
                        <div>
                          <div className="text-sm font-black text-[var(--admin-text)]">{quote.email || quote.customer_name}</div>
                          <div className="flex items-center gap-2 text-[10px] text-[var(--admin-text-dim)] font-black uppercase mt-0.5">
                            <Mail size={10} />
                            Communication Node Active
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-8">
                      <div className="flex items-center gap-3 text-[11px] font-bold text-[var(--admin-text)]">
                        <span className="bg-[#F8FAFC] border border-[var(--admin-border)] px-2 py-1 rounded-lg uppercase tracking-tight">{quote.pickup_country}</span>
                        <ArrowRight size={14} className="text-[var(--admin-accent)]" />
                        <span className="bg-[#F8FAFC] border border-[var(--admin-border)] px-2 py-1 rounded-lg uppercase tracking-tight">{quote.delivery_country}</span>
                        <span className="text-[var(--admin-text-dim)] text-[10px] font-black ml-2 uppercase opacity-60">/ {quote.service_type || 'Standard'}</span>
                      </div>
                    </td>
                    <td className="py-6 px-8 text-center">
                      <span className={cn(
                        "text-[9px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest border",
                        quote.status === 'PENDING'
                          ? "bg-orange-50 border-orange-100 text-orange-600"
                          : "bg-green-50 border-green-100 text-green-600"
                      )}>
                        {quote.status}
                      </span>
                    </td>
                    <td className="py-6 px-8 text-right">
                      <button className="text-[10px] font-black uppercase tracking-widest text-[var(--admin-accent)] hover:underline flex items-center gap-2 ml-auto">
                        Execute Review
                        <ArrowRight size={14} />
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
