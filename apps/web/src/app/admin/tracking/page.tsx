"use client";

import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { fetcher, api } from '@/lib/api';
import {
    Search,
    MapPin,
    Package,
    History,
    PlusCircle,
    TrendingUp,
    AlertCircle,
    Clock,
    ChevronRight,
    Filter
} from 'lucide-react';
import TrackingTimeline from '@/components/admin/TrackingTimeline';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function AdminTrackingPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBooking, setSelectedBooking] = useState<any>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [formData, setFormData] = useState({
        status: 'IN_TRANSIT',
        location: '',
        description: ''
    });

    const { data: bookingsRes, isLoading } = useSWR('/admin/bookings', fetcher);
    const bookings = bookingsRes?.data || [];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const found = bookings.find((b: any) =>
            b.tracking_number?.toLowerCase() === searchQuery.toLowerCase() ||
            b.id === searchQuery
        );
        setSelectedBooking(found || null);
    };

    const handleUpdateStatus = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedBooking) return;

        setIsUpdating(true);
        try {
            const { data } = await api.put(`/admin/bookings/${selectedBooking.id}/status`, formData);
            if (data.success) {
                // Refresh bookings
                const refresh = await mutate('/admin/bookings');
                // Find the updated booking in the refreshed data
                const updated = refresh.data.find((b: any) => b.id === selectedBooking.id);
                setSelectedBooking(updated);
                setFormData({ status: 'IN_TRANSIT', location: '', description: '' });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-20 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bebas tracking-widest text-[var(--admin-text)]">Logistics Registry</h1>
                    <p className="text-[var(--admin-text-dim)] text-sm font-medium mt-1">Universal shipment tracking and status broadcasting authority</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 bg-white border border-[var(--admin-border)] px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#F8FAFC] transition-all">
                        <Filter size={14} />
                        Global Filter
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left Column: Search & Quick Selection */}
                <div className="space-y-6">
                    <div className="admin-glass-card p-8 bg-white">
                        <h3 className="text-[10px] font-black uppercase tracking-[2px] mb-5 flex items-center gap-2 text-[var(--admin-text-dim)]">
                            <Search size={14} className="text-[var(--admin-accent)]" />
                            Identify Consignment
                        </h3>
                        <form onSubmit={handleSearch} className="relative">
                            <input
                                type="text"
                                placeholder="ID or Tracking Number"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-[#F8FAFC] border border-[var(--admin-border)] py-4 px-5 rounded-2xl text-sm font-bold outline-none focus:border-[var(--admin-accent)] focus:bg-white transition-all shadow-inner"
                            />
                            <button type="submit" className="absolute right-3 top-2 p-2 bg-[var(--admin-accent-gradient)] rounded-xl text-white shadow-lg shadow-orange-500/30">
                                <Search size={18} />
                            </button>
                        </form>
                    </div>

                    <div className="admin-glass-card overflow-hidden bg-white">
                        <div className="p-5 border-b border-[var(--admin-border)] bg-[#F8FAFC]/50 flex justify-between items-center">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-[var(--admin-text-dim)]">Recent Activity</h3>
                            <span className="text-[9px] font-black text-[var(--admin-accent)] bg-[#FFF5F2] px-2 py-0.5 rounded-full border border-orange-500/10">LATEST 10</span>
                        </div>
                        <div className="divide-y divide-[var(--admin-border)] max-h-[500px] overflow-y-auto admin-scrollbar">
                            {isLoading ? (
                                <div className="p-12 text-center text-[10px] font-black uppercase tracking-widest opacity-20">Accessing archives...</div>
                            ) : bookings.slice(0, 10).map((b: any) => (
                                <button
                                    key={b.id}
                                    onClick={() => setSelectedBooking(b)}
                                    className={cn(
                                        "w-full p-5 text-left hover:bg-[#F8FAFC] transition-all flex items-center justify-between group border-l-4 border-transparent",
                                        selectedBooking?.id === b.id && "bg-[#F8FAFC] border-l-[var(--admin-accent)]"
                                    )}
                                >
                                    <div className="space-y-1">
                                        <div className="text-sm font-bebas tracking-widest text-[var(--admin-text)]">{b.tracking_number}</div>
                                        <div className="text-[10px] font-bold text-[var(--admin-text-dim)] uppercase tracking-tight">{b.customer_name}</div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={cn(
                                            "text-[8px] font-black px-2.5 py-1 rounded-full border tracking-tighter uppercase",
                                            b.status === 'DELIVERED' ? "border-green-200 bg-green-50 text-green-600" : "border-orange-200 bg-[#FFF5F2] text-[var(--admin-accent)]"
                                        )}>
                                            {b.status}
                                        </span>
                                        <ChevronRight size={14} className="text-[#CBD5E1] group-hover:text-[var(--admin-accent)] transition-all" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Middle/Right Column: Detail & Update */}
                <div className="lg:col-span-2 space-y-6">
                    {!selectedBooking ? (
                        <div className="admin-glass-card p-24 flex flex-col items-center justify-center text-center space-y-6 bg-white border-dashed border-2">
                            <div className="p-6 rounded-3xl bg-[#F8FAFC] text-[#94A3B8] border border-black/[0.03]">
                                <Package size={56} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bebas tracking-widest text-[var(--admin-text)]">Awaiting Consignment Target</h3>
                                <p className="text-xs font-medium text-[var(--admin-text-dim)] max-w-xs mx-auto mt-2 leading-relaxed uppercase tracking-wider">
                                    Select a live stream record or scan a tracking ID to initialize the management interface.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-fade-in bg-white p-2 rounded-3xl">
                            {/* Shipment Info Card */}
                            <div className="admin-glass-card p-10 flex flex-col md:flex-row justify-between gap-8 border-l-8 border-[var(--admin-accent)] bg-white">
                                <div className="space-y-5">
                                    <div>
                                        <span className="text-[10px] font-black uppercase tracking-[4px] text-[var(--admin-accent)]">Live Consignment node</span>
                                        <h2 className="text-5xl font-bebas tracking-[3px] text-[var(--admin-text)] mt-2 leading-none">{selectedBooking.tracking_number}</h2>
                                    </div>
                                    <div className="flex flex-wrap gap-10 pt-2">
                                        <div className="space-y-1">
                                            <div className="text-[10px] uppercase tracking-[2px] font-black text-[var(--admin-text-dim)]">Contract Holder</div>
                                            <div className="text-[15px] font-black text-[var(--admin-text)]">{selectedBooking.customer_name}</div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-[10px] uppercase tracking-[2px] font-black text-[var(--admin-text-dim)]">Service Protocol</div>
                                            <div className="text-[15px] font-black text-[var(--admin-text)]">{selectedBooking.service_type || 'Priority Express'}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end justify-between py-1">
                                    <div className="px-6 py-2 bg-[var(--admin-accent-gradient)] rounded-2xl text-xs font-black uppercase tracking-widest text-white shadow-2xl shadow-orange-500/40">
                                        {selectedBooking.status}
                                    </div>
                                    <div className="text-[10px] font-black text-[var(--admin-text-dim)] border border-[#E2E8F0] px-3 py-1.5 rounded-xl flex items-center gap-2 bg-[#F8FAFC] uppercase tracking-wider">
                                        <Clock size={12} className="text-[var(--admin-accent)]" />
                                        Sync: {new Date(selectedBooking.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 items-start p-2">
                                {/* Timeline */}
                                <div className="space-y-8">
                                    <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[3px] text-[var(--admin-text)] mb-6 ml-2">
                                        <History size={16} className="text-[var(--admin-accent)]" />
                                        Archive Stream
                                    </div>
                                    <TrackingTimeline events={selectedBooking.tracking_events || []} />
                                </div>

                                {/* Update Panel */}
                                <div className="space-y-8">
                                    <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[3px] text-[var(--admin-text)] mb-6">
                                        <PlusCircle size={16} className="text-[var(--admin-accent)]" />
                                        Logic Broadcast
                                    </div>
                                    <form onSubmit={handleUpdateStatus} className="admin-glass-card p-10 space-y-8 bg-white border border-black/[0.03]">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[3px] text-[var(--admin-text-dim)]">Operational Status</label>
                                            <select
                                                value={formData.status}
                                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                                className="w-full bg-[#F8FAFC] border border-[var(--admin-border)] p-4 rounded-2xl text-sm font-bold outline-none focus:border-[var(--admin-accent)] focus:bg-white appearance-none cursor-pointer shadow-sm transition-all"
                                            >
                                                <option value="BOOKED">Entry Recieved</option>
                                                <option value="PICKED_UP">Asset Acquired</option>
                                                <option value="IN_TRANSIT">Node Transit</option>
                                                <option value="AT_FACILITY">Hub Sorting</option>
                                                <option value="OUT_FOR_DELIVERY">Final Mile Path</option>
                                                <option value="DELIVERED">Asset Handover - Success</option>
                                                <option value="DELAYED">Temporal Disruption</option>
                                            </select>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[3px] text-[var(--admin-text-dim)]">Geo-Location Node</label>
                                            <div className="relative">
                                                <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--admin-accent)]" />
                                                <input
                                                    type="text"
                                                    placeholder="Distribution Center / Hub Location"
                                                    value={formData.location}
                                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                    className="w-full bg-[#F8FAFC] border border-[var(--admin-border)] py-4 pl-12 pr-5 rounded-2xl text-sm font-bold outline-none focus:border-[var(--admin-accent)] focus:bg-white transition-all shadow-sm"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[3px] text-[var(--admin-text-dim)]">Broadcast Remarks</label>
                                            <textarea
                                                rows={4}
                                                placeholder="Log detailed operational notes for this event..."
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                className="w-full bg-[#F8FAFC] border border-[var(--admin-border)] p-5 rounded-2xl text-sm font-medium outline-none focus:border-[var(--admin-accent)] focus:bg-white transition-all resize-none shadow-sm leading-relaxed"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isUpdating}
                                            className="w-full bg-[var(--admin-accent-gradient)] text-white py-5 rounded-3xl font-black text-xs uppercase tracking-[4px] shadow-2xl shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                                        >
                                            {isUpdating ? 'Transmitting Data...' : 'Broadcast status change'}
                                        </button>
                                    </form>

                                    {/* Warning Box */}
                                    <div className="p-6 bg-orange-50 border border-orange-200 rounded-3xl flex gap-4">
                                        <AlertCircle size={24} className="text-orange-600 shrink-0 mt-0.5" />
                                        <p className="text-[11px] font-medium text-orange-900 leading-normal uppercase tracking-wider">
                                            Transmitting this status change will update global customer dashboards and initialize automated notification sequences.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
