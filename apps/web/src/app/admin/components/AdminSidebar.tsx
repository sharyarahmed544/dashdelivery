"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Package,
    FileText,
    Receipt,
    FileCode,
    Users,
    Settings,
    BarChart3,
    ChevronLeft,
    ChevronRight,
    LogOut,
    MapPin
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { label: 'Bookings', icon: Package, path: '/admin/bookings' },
    { label: 'Tracking', icon: MapPin, path: '/admin/tracking' },
    { label: 'Quotes', icon: FileText, path: '/admin/quotes' },
    { label: 'Invoices', icon: Receipt, path: '/admin/invoices' },
    { label: 'Content CMS', icon: FileCode, path: '/admin/cms' },
    { label: 'Users & Roles', icon: Users, path: '/admin/users' },
    { label: 'Settings', icon: Settings, path: '/admin/settings' },
    { label: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem('admin-sidebar-collapsed');
        if (saved) setIsCollapsed(saved === 'true');
    }, []);

    const toggleCollapse = () => {
        const next = !isCollapsed;
        setIsCollapsed(next);
        localStorage.setItem('admin-sidebar-collapsed', String(next));
    };

    if (!mounted) return null;

    return (
        <aside
            id="admin-sidebar-container"
            className={cn(
                "flex flex-col h-screen sticky top-0 transition-all duration-300 ease-in-out border-r border-[var(--admin-border)] bg-[var(--admin-bg-alt)] z-[1000]",
                isCollapsed ? "w-20" : "w-64"
            )}
            style={{ all: 'unset', display: 'flex', flexDirection: 'column' }}
        >
            <div className="p-6 flex items-center justify-between">
                {!isCollapsed && (
                    <div className="font-bebas text-2xl tracking-[4px] font-black text-[var(--admin-accent)]">
                        DASH <span className="text-[var(--admin-text)]">ADMIN</span>
                    </div>
                )}
                <button
                    onClick={toggleCollapse}
                    className="p-2 rounded-lg hover:bg-[#F1F5F9] text-[var(--admin-text-dim)] transition-colors"
                >
                    {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>

            <nav className="flex-1 px-4 space-y-1.5 mt-4 overflow-y-auto admin-scrollbar">
                {menuItems.map((item) => {
                    const isActive = pathname === item.path;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={cn(
                                "admin-nav-item flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 relative group",
                                isActive
                                    ? "bg-[var(--admin-accent-gradient)] text-white shadow-md shadow-orange-500/20"
                                    : "text-[var(--admin-text-dim)] hover:text-[var(--admin-text)] hover:bg-[#F8FAFC]"
                            )}
                        >
                            <Icon size={18} className={cn(isActive ? "text-white" : "text-[var(--admin-text-dim)]")} />
                            {!isCollapsed && <span>{item.label}</span>}
                            {isCollapsed && (
                                <div className="absolute left-full ml-4 px-3 py-2 bg-[#1E293B] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl">
                                    {item.label}
                                    <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-[#1E293B] rotate-45" />
                                </div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 mt-auto border-t border-[var(--admin-border)]">
                <button
                    onClick={() => {
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('user');
                        window.location.href = '/admin/login';
                    }}
                    className={cn(
                        "flex items-center gap-4 w-full px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all",
                        isCollapsed && "justify-center"
                    )}
                >
                    <LogOut size={18} />
                    {!isCollapsed && <span>Sign Out</span>}
                </button>
            </div>
        </aside>
    );
}
