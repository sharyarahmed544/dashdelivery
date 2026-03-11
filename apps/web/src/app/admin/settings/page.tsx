"use client";

import {
    Settings,
    Shield,
    Database,
    Globe,
    Bell,
    Lock,
    User,
    CheckCircle2,
    AlertTriangle
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function AdminSettings() {
    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-bebas tracking-widest text-[var(--admin-text)]">System Control</h1>
                <p className="text-[var(--admin-text-dim)] text-sm font-medium mt-1">Global administrative parameters and environmental stability</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Navigation Categories */}
                <div className="space-y-4">
                    {[
                        { label: 'General Protocol', icon: Globe, active: true },
                        { label: 'Security & Auth', icon: Shield },
                        { label: 'Data Infrastructure', icon: Database },
                        { label: 'Notification Logic', icon: Bell },
                        { label: 'Account Profile', icon: User },
                    ].map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={idx}
                                className={cn(
                                    "w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-wider transition-all border",
                                    item.active
                                        ? "bg-white border-[var(--admin-accent)] shadow-lg shadow-orange-500/10 text-[var(--admin-text)]"
                                        : "bg-transparent border-transparent text-[var(--admin-text-dim)] hover:bg-white hover:border-[var(--admin-border)]"
                                )}
                            >
                                <Icon size={18} className={item.active ? "text-[var(--admin-accent)]" : ""} />
                                {item.label}
                            </button>
                        );
                    })}
                </div>

                {/* Right: Settings Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="admin-glass-card p-10 bg-white">
                        <h2 className="text-2xl font-bebas tracking-widest mb-8 flex items-center gap-2">
                            <Globe size={24} className="text-[var(--admin-accent)]" />
                            General Protocol Configuration
                        </h2>

                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[3px] text-[var(--admin-text-dim)]">Regional Locale</label>
                                    <select className="w-full bg-[#F8FAFC] border border-[var(--admin-border)] p-4 rounded-xl text-sm font-bold outline-none focus:border-[var(--admin-accent)] transition-all">
                                        <option>United Kingdom (GMT)</option>
                                        <option>United Arab Emirates (GST)</option>
                                        <option>European Union (CET)</option>
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[3px] text-[var(--admin-text-dim)]">Currency Node</label>
                                    <select className="w-full bg-[#F8FAFC] border border-[var(--admin-border)] p-4 rounded-xl text-sm font-bold outline-none focus:border-[var(--admin-accent)] transition-all">
                                        <option>GBP (£)</option>
                                        <option>AED (د.إ)</option>
                                        <option>EUR (€)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[3px] text-[var(--admin-text-dim)]">System Maintenance Mode</label>
                                <div className="flex items-center gap-4 p-5 bg-[#F8FAFC] rounded-2xl border border-[var(--admin-border)]">
                                    <div className="w-14 h-7 bg-gray-200 rounded-full relative p-1 cursor-pointer">
                                        <div className="w-5 h-5 bg-white rounded-full shadow-sm" />
                                    </div>
                                    <div className="text-[11px] font-bold text-[var(--admin-text-dim)] uppercase tracking-wide">
                                        Disable public booking nodes for maintenance
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-[#F1F5F9] flex justify-end">
                                <button className="bg-[var(--admin-accent-gradient)] text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[3px] shadow-xl shadow-orange-500/30 hover:scale-[1.02] transition-all">
                                    Commit Logic Changes
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="admin-glass-card p-8 bg-blue-50 border-blue-100 flex items-start gap-5">
                        <div className="p-3 bg-white rounded-2xl border border-blue-100 text-blue-600">
                            <Database size={24} />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-blue-900 uppercase tracking-widest mb-1">Infrastructure Status</h3>
                            <p className="text-[11px] text-blue-700/70 font-medium leading-relaxed uppercase tracking-wide">
                                Cloud Firestore and Storage nodes are currently operational with 99.9% availability. Latency: 42ms.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
