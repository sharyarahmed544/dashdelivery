"use client";

import { CheckCircle2, Clock, MapPin, Package, Truck, Home } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface TrackingEvent {
    id: string;
    status: string;
    location: string;
    description: string;
    occurred_at: string;
}

const statusIcons: Record<string, any> = {
    'BOOKED': Package,
    'PICKED_UP': Truck,
    'IN_TRANSIT': Truck,
    'OUT_FOR_DELIVERY': Truck,
    'DELIVERED': Home,
    'DEFAULT': Clock
};

export default function TrackingTimeline({ events }: { events: TrackingEvent[] }) {
    if (!events || events.length === 0) {
        return (
            <div className="py-12 text-center text-[var(--admin-text-dim)] admin-glass-card bg-white border-dashed">
                Zero activity logs detected for this consignment node.
            </div>
        );
    }

    return (
        <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-[2px] before:bg-[#E2E8F0]">
            {events.map((event, index) => {
                const Icon = statusIcons[event.status] || statusIcons.DEFAULT;
                const isLatest = index === 0;

                return (
                    <div key={event.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                        {/* Dot */}
                        <div className={cn(
                            "flex items-center justify-center w-10 h-10 rounded-xl border-2 bg-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-all",
                            isLatest
                                ? "text-[var(--admin-accent)] border-[var(--admin-accent)] shadow-[0_0_20px_rgba(255,69,0,0.15)] scale-110"
                                : "text-[var(--admin-text-dim)] border-[#E2E8F0] shadow-sm"
                        )}>
                            <Icon size={18} />
                        </div>

                        {/* Content */}
                        <div className={cn(
                            "w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl admin-glass-card bg-white transition-all hover:border-[var(--admin-accent)]/30",
                            isLatest && "border-[var(--admin-accent)]/20 shadow-lg shadow-orange-500/5"
                        )}>
                            <div className="flex items-center justify-between gap-3 mb-2">
                                <div className="font-bebas text-xl tracking-widest text-[var(--admin-text)]">
                                    {event.status.replace(/_/g, ' ')}
                                </div>
                                <time className="font-black text-[10px] text-[var(--admin-accent)] tracking-widest uppercase bg-[#FFF5F2] px-2 py-1 rounded-full">
                                    {new Date(event.occurred_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                </time>
                            </div>
                            <p className="text-[13px] text-[var(--admin-text-dim)] font-medium leading-relaxed mb-4">
                                {event.description}
                            </p>
                            <div className="flex items-center gap-2 text-[9px] font-black text-[var(--admin-text-dim)] uppercase tracking-[2px] bg-[#F8FAFC] w-fit px-3 py-1.5 rounded-xl border border-black/[0.03]">
                                <MapPin size={12} className="text-[var(--admin-accent)]" />
                                {event.location}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
