'use client';

import useSWR from 'swr';
import { fetcher } from '@/lib/api';
import { Users, UserPlus, Shield, MoreVertical, Mail, Calendar } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function UsersPage() {
  const { data: usersRes, error, isLoading } = useSWR('/admin/users', fetcher);
  const users = usersRes?.data || [];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bebas tracking-widest text-[var(--admin-text)]">Admin Authority</h1>
          <p className="text-[var(--admin-text-dim)] text-sm font-medium mt-1">Personnel registry and role-based access control management</p>
        </div>
        <button className="flex items-center gap-2 bg-[var(--admin-accent-gradient)] text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
          <UserPlus size={16} />
          Provision User
        </button>
      </div>

      {/* Users Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="admin-glass-card p-6 bg-white flex items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[var(--admin-accent)] flex items-center justify-center border border-orange-100">
            <Users size={24} />
          </div>
          <div>
            <div className="text-[10px] font-black text-[var(--admin-text-dim)] uppercase tracking-widest">Active Staff</div>
            <div className="text-2xl font-bebas tracking-wider text-[var(--admin-text)]">{users.length} Identities</div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="admin-glass-card overflow-hidden bg-white border border-black/[0.03]">
        {isLoading ? (
          <div className="p-20 text-center flex flex-col items-center gap-4 animate-pulse">
            <div className="w-10 h-10 rounded-full border-2 border-t-[var(--admin-accent)] border-[var(--admin-border)] animate-spin" />
            <div className="text-[10px] font-black text-[var(--admin-text-dim)] uppercase tracking-widest">Accessing registry...</div>
          </div>
        ) : users.length === 0 ? (
          <div className="p-20 text-center space-y-4 opacity-40">
            <Users size={48} className="mx-auto text-[var(--admin-text-dim)]" />
            <div className="text-xs font-black uppercase tracking-widest">No staff identities provisioned</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[var(--admin-border)] text-[var(--admin-text-dim)] text-[10px] uppercase tracking-[2px] font-black">
                  <th className="py-5 px-8">Staff Identity</th>
                  <th className="py-5 px-8">Audit Trail</th>
                  <th className="py-5 px-8 text-center">Auth Role</th>
                  <th className="py-5 px-8">Status</th>
                  <th className="py-5 px-8 text-right">Utility</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--admin-border)]">
                {users.map((u: any) => (
                  <tr key={u.id} className="hover:bg-[#F8FAFC] transition-all group">
                    <td className="py-6 px-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[var(--admin-bg-alt)] border border-[var(--admin-border)] flex items-center justify-center font-bebas text-lg text-[var(--admin-text-dim)] group-hover:border-[var(--admin-accent)] transition-all">
                          {u.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <div className="text-sm font-black text-[var(--admin-text)]">{u.name}</div>
                          <div className="flex items-center gap-2 text-[10px] text-[var(--admin-text-dim)] font-black uppercase mt-0.5">
                            <Mail size={10} />
                            {u.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-8">
                      <div className="flex items-center gap-2 text-[10px] text-[var(--admin-text-dim)] font-black uppercase tracking-widest">
                        <Calendar size={12} className="text-[var(--admin-accent)]" />
                        Last Sync: {u.last_login ? new Date(u.last_login).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'Pending'}
                      </div>
                    </td>
                    <td className="py-6 px-8 text-center">
                      <span className={cn(
                        "text-[9px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest border flex items-center gap-2 w-fit mx-auto",
                        u.role === 'ADMIN'
                          ? "bg-orange-50 border-orange-100 text-orange-600"
                          : "bg-blue-50 border-blue-100 text-blue-600"
                      )}>
                        <Shield size={10} />
                        {u.role}
                      </span>
                    </td>
                    <td className="py-6 px-8">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e40]" />
                        <span className="text-[10px] font-black text-[var(--admin-text-dim)] uppercase tracking-widest">Operational</span>
                      </div>
                    </td>
                    <td className="py-6 px-8 text-right">
                      <button className="p-2.5 rounded-xl border border-[var(--admin-border)] text-[var(--admin-text-dim)] hover:text-[var(--admin-text)] hover:bg-white hover:border-[var(--admin-accent)] transition-all transition-all shadow-sm">
                        <MoreVertical size={18} />
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
