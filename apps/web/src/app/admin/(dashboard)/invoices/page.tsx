"use client";

import useSWR from 'swr';
import { fetcher } from '@/lib/api';
import {
    Receipt,
    Download,
    Search,
    Filter,
    MoreHorizontal,
    CheckCircle2,
    Clock,
    FileText,
    CreditCard,
    ArrowUpRight
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function AdminInvoices() {
    const { data: invoicesRes, isLoading } = useSWR('/admin/invoices', fetcher);
    const invoices = invoicesRes?.data || [];

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bebas tracking-widest text-[var(--admin-text)]">Financial Ledger</h1>
                    <p className="text-[var(--admin-text-dim)] text-sm font-medium mt-1">Generate, manage and verify secure cryptographic invoices</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 bg-white border border-[var(--admin-border)] px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#F8FAFC] transition-all">
                        <Download size={14} />
                        Bulk Export
                    </button>
                </div>
            </div>

            {/* Invoice Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="admin-glass-card p-6 bg-white flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center border border-green-100">
                        <CreditCard size={24} />
                    </div>
                    <div>
                        <div className="text-[10px] font-black text-[var(--admin-text-dim)] uppercase tracking-widest">Revenue (MTD)</div>
                        <div className="text-2xl font-bebas tracking-wider text-[var(--admin-text)]">£12,340.00</div>
                    </div>
                </div>
                <div className="admin-glass-card p-6 bg-white flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[var(--admin-accent)] flex items-center justify-center border border-orange-100">
                        <Clock size={24} />
                    </div>
                    <div>
                        <div className="text-[10px] font-black text-[var(--admin-text-dim)] uppercase tracking-widest">Pending Payment</div>
                        <div className="text-2xl font-bebas tracking-wider text-[var(--admin-text)]">08 Documents</div>
                    </div>
                </div>
                <div className="admin-glass-card p-6 bg-white flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                        <FileText size={24} />
                    </div>
                    <div>
                        <div className="text-[10px] font-black text-[var(--admin-text-dim)] uppercase tracking-widest">Generated Today</div>
                        <div className="text-2xl font-bebas tracking-wider text-[var(--admin-text)]">14 Node Docs</div>
                    </div>
                </div>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--admin-text-dim)]" size={18} />
                    <input
                        type="text"
                        placeholder="Search by Invoice #, Customer ID or Tracking #"
                        className="w-full bg-white border border-[var(--admin-border)] py-4 pl-12 pr-5 rounded-2xl text-sm font-bold outline-none focus:border-[var(--admin-accent)] transition-all shadow-sm"
                    />
                </div>
                <button className="flex items-center gap-2 bg-white border border-[var(--admin-border)] px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-[var(--admin-accent)] transition-all shadow-sm">
                    <Filter size={16} />
                    Filter Registry
                </button>
            </div>

            {/* Table Section */}
            <div className="admin-glass-card overflow-hidden bg-white border border-black/[0.03]">
                {isLoading ? (
                    <div className="p-20 text-center flex flex-col items-center gap-4 animate-pulse">
                        <div className="w-10 h-10 rounded-full border-2 border-t-[var(--admin-accent)] border-[var(--admin-border)] animate-spin" />
                        <div className="text-[10px] font-black text-[var(--admin-text-dim)] uppercase tracking-widest">Accessing financial nodes...</div>
                    </div>
                ) : invoices.length === 0 ? (
                    <div className="p-24 text-center space-y-4 opacity-40">
                        <Receipt size={56} className="mx-auto text-[var(--admin-text-dim)]" />
                        <div className="text-xs font-black uppercase tracking-widest">Financial registry is currently empty</div>
                        <p className="text-[10px] font-medium max-w-xs mx-auto text-[var(--admin-text-dim)]">Invoices are automatically generated upon successful consignment node verification.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-[#F8FAFC] border-b border-[var(--admin-border)] text-[var(--admin-text-dim)] text-[10px] uppercase tracking-[2px] font-black">
                                    <th className="py-5 px-8">Invoice Node</th>
                                    <th className="py-5 px-8">Entity Details</th>
                                    <th className="py-5 px-8">Financial Value</th>
                                    <th className="py-5 px-8 text-center">Status Trace</th>
                                    <th className="py-5 px-8 text-right">Utility</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--admin-border)]">
                                {invoices.map((inv: any) => (
                                    <tr key={inv.id} className="hover:bg-[#F8FAFC] transition-all group">
                                        <td className="py-6 px-8">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 rounded-xl bg-white border border-[var(--admin-border)] text-[var(--admin-accent)] group-hover:bg-[#FFF5F2] transition-colors">
                                                    <Receipt size={18} />
                                                </div>
                                                <div>
                                                    <div className="font-bebas text-lg tracking-widest text-[var(--admin-text)]">#{inv.invoice_number || inv.id.slice(0, 8).toUpperCase()}</div>
                                                    <div className="text-[10px] text-[var(--admin-text-dim)] font-black uppercase mt-0.5">
                                                        DOC_ID: {inv.id.slice(-6)}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-6 px-8">
                                            <div className="space-y-1">
                                                <div className="text-[11px] font-black text-[var(--admin-text)] uppercase">{inv.customer_name || 'Anonymous Entity'}</div>
                                                <div className="text-[9px] font-bold text-[var(--admin-text-dim)] tracking-widest uppercase">{inv.customer_email}</div>
                                            </div>
                                        </td>
                                        <td className="py-6 px-8">
                                            <div className="space-y-1">
                                                <div className="text-[13px] font-black text-[var(--admin-text)] group-hover:text-[var(--admin-accent)] transition-colors">£{inv.total_amount?.toLocaleString() || '0.00'}</div>
                                                <div className="text-[9px] font-bold text-[var(--admin-text-dim)] uppercase tracking-wide">Incl. {inv.vat_amount > 0 ? 'VAT' : 'Excl. VAT'}</div>
                                            </div>
                                        </td>
                                        <td className="py-6 px-8 text-center">
                                            <span className={cn(
                                                "text-[9px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest border inline-flex items-center gap-2",
                                                inv.status === 'PAID'
                                                    ? "bg-green-50 border-green-100 text-green-600"
                                                    : "bg-orange-50 border-orange-100 text-orange-600"
                                            )}>
                                                {inv.status === 'PAID' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                                                {inv.status || 'PENDING'}
                                            </span>
                                        </td>
                                        <td className="py-6 px-8 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button className="p-2.5 rounded-xl border border-[var(--admin-border)] text-[var(--admin-text-dim)] hover:text-[var(--admin-accent)] hover:bg-white hover:border-[var(--admin-accent)] transition-all shadow-sm">
                                                    <Download size={18} />
                                                </button>
                                                <button className="p-2.5 rounded-xl border border-[var(--admin-border)] text-[var(--admin-text-dim)] hover:text-[var(--admin-text)] hover:bg-white transition-all shadow-sm">
                                                    <MoreHorizontal size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Verification Notice */}
            <div className="p-6 bg-slate-900 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-slate-200">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-2xl text-[var(--admin-accent)]">
                        <CheckCircle2 size={24} />
                    </div>
                    <div>
                        <h4 className="text-white text-sm font-bebas tracking-widest">Cryptographic Document Verification</h4>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest leading-relaxed">All generated PDF nodes contain MD5 checksums and verifiable QR authorization.</p>
                    </div>
                </div>
                <button className="bg-white text-slate-900 px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[3px] flex items-center gap-2 group hover:gap-3 transition-all shrink-0">
                    Open Auth Registry
                    <ArrowUpRight size={14} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
                </button>
            </div>
        </div>
    );
}
