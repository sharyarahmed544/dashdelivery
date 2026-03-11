"use client";

import { usePathname } from 'next/navigation';
import { Search, Bell, User } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AdminHeader() {
    const pathname = usePathname();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) setUser(JSON.parse(userData));
    }, []);

    const getBreadcrumbs = () => {
        const parts = pathname.split('/').filter(Boolean);
        return parts.map((part, i) => {
            const path = '/' + parts.slice(0, i + 1).join('/');
            const label = part.charAt(0).toUpperCase() + part.slice(1);
            return { label, path };
        });
    };

    const breadcrumbs = getBreadcrumbs();

    return (
        <header className="flex items-center justify-between px-8 py-4 bg-white/80 border-b border-[var(--admin-border)] sticky top-0 z-[900] backdrop-blur-md">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                    {breadcrumbs.map((crumb, i) => (
                        <div key={crumb.path} className="flex items-center gap-2">
                            {i > 0 && <span className="text-[#94A3B8]">/</span>}
                            <span className={i === breadcrumbs.length - 1 ? "text-[var(--admin-text)]" : "text-[var(--admin-text-dim)]"}>
                                {crumb.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="relative group hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-text-dim)]" size={16} />
                    <input
                        type="text"
                        placeholder="Search dashboard..."
                        className="bg-[#F1F5F9] border border-transparent rounded-xl py-2 pl-10 pr-4 text-sm w-64 focus:bg-white focus:border-[var(--admin-accent)] transition-all outline-none"
                    />
                </div>

                <button className="relative p-2 text-[var(--admin-text-dim)] hover:text-[var(--admin-text)] transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--admin-accent)] rounded-full border-2 border-white"></span>
                </button>

                <div className="flex items-center gap-3 pl-6 border-l border-[var(--admin-border)]">
                    <div className="text-right hidden sm:block">
                        <div className="text-sm font-bold text-[var(--admin-text)] leading-tight">{user?.name || 'Admin User'}</div>
                        <div className="text-[10px] text-[var(--admin-text-dim)] uppercase tracking-widest font-black">{user?.role || 'Super Admin'}</div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-[var(--admin-accent-gradient)] flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
                        <User size={20} />
                    </div>
                </div>
            </div>
        </header>
    );
}
