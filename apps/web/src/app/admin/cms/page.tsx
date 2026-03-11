'use client';

import useSWR, { mutate } from 'swr';
import { fetcher, api } from '@/lib/api';
import { useState } from 'react';
import {
  FileText,
  Settings,
  Layout,
  Plus,
  Search,
  Edit3,
  Trash2,
  ExternalLink,
  Save,
  X
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function CMSPage() {
  const { data: blocksRes, isLoading: blocksLoading } = useSWR('/admin/content', fetcher);
  const { data: settingsRes, isLoading: settingsLoading } = useSWR('/admin/settings', fetcher);

  const [activeTab, setActiveTab] = useState<'blocks' | 'settings' | 'pages'>('blocks');
  const [editingBlock, setEditingBlock] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const blocks = blocksRes?.data || [];
  const settings = settingsRes?.data || [];

  const handleUpdateBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put(`/admin/content/${editingBlock.id}`, editingBlock);
      if (data.success) {
        mutate('/admin/content');
        setIsModalOpen(false);
        setEditingBlock(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSetting = async (key: string, value: any) => {
    setLoading(true);
    try {
      await api.put(`/admin/settings/${key}`, { value });
      mutate('/admin/settings');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bebas tracking-widest text-[var(--admin-text)]">Content Architecture</h1>
          <p className="text-[var(--admin-text-dim)] text-sm font-medium mt-1">Manage core website modules and global system states</p>
        </div>
        <button className="flex items-center gap-2 bg-[var(--admin-accent-gradient)] text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
          <Plus size={16} />
          Create Module
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1.5 bg-[#F1F5F9] border border-[var(--admin-border)] rounded-2xl w-fit">
        {[
          { id: 'blocks', label: 'Content Blocks', icon: Layout },
          { id: 'settings', label: 'Site Settings', icon: Settings },
          { id: 'pages', label: 'Page Registry', icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all",
                activeTab === tab.id
                  ? "bg-white text-[var(--admin-text)] shadow-sm border border-black/5"
                  : "text-[var(--admin-text-dim)] hover:text-[var(--admin-text)]"
              )}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="grid gap-6">
        {activeTab === 'blocks' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
            {blocksLoading ? (
              <div className="col-span-full py-20 text-center text-[var(--admin-text-dim)] font-black uppercase tracking-[3px] opacity-40">Synchronizing modules...</div>
            ) : blocks.map((block: any) => (
              <div key={block.id} className="admin-glass-card p-8 flex flex-col gap-5 group bg-white">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-[3px] font-black text-[var(--admin-accent)]">{block.id}</span>
                    <h3 className="text-xl font-bebas tracking-widest text-[var(--admin-text)]">{block.title || 'Untitled Module'}</h3>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setEditingBlock(block); setIsModalOpen(true); }}
                      className="p-2.5 rounded-xl bg-[#F8FAFC] text-[var(--admin-text-dim)] hover:text-[var(--admin-accent)] hover:border-[var(--admin-accent)] transition-all border border-transparent"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button className="p-2.5 rounded-xl bg-[#F8FAFC] text-[var(--admin-text-dim)] hover:text-red-500 hover:border-red-500/20 transition-all border border-transparent">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-[var(--admin-text-dim)] font-medium leading-relaxed italic opacity-80">
                  "{block.body || 'Module has no descriptive content'}"
                </p>
                <div className="flex items-center justify-between mt-auto pt-5 border-t border-[var(--admin-border)]">
                  <div className="flex gap-2">
                    {block.cta_text && (
                      <span className="text-[9px] font-black uppercase tracking-widest bg-[#FFF5F2] text-[var(--admin-accent)] px-3 py-1 rounded-full border border-[var(--admin-accent)]/10">
                        Action: {block.cta_text}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-[var(--admin-text-dim)] uppercase tracking-widest">STATUS</span>
                    <span className={cn(
                      "w-3 h-3 rounded-full",
                      block.is_active ? "bg-green-500 shadow-[0_0_10px_#22c55e60]" : "bg-red-500"
                    )} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="admin-glass-card overflow-hidden animate-fade-in bg-white">
            <div className="p-6 border-b border-[var(--admin-border)] bg-[#F8FAFC]/50">
              <h3 className="text-lg font-bebas tracking-widest flex items-center gap-2">
                <Settings size={20} className="text-[var(--admin-accent)]" />
                Global Manifest Configuration
              </h3>
            </div>
            <div className="divide-y divide-[var(--admin-border)]">
              {settingsLoading ? (
                <div className="p-10 text-center font-black uppercase tracking-widest opacity-30">Accessing system manifest...</div>
              ) : settings.map((item: any) => (
                <div key={item.id} className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-[#F8FAFC] transition-all">
                  <div className="space-y-1">
                    <div className="text-xs font-black text-[var(--admin-text)] uppercase tracking-[2px]">{item.id.replace(/_/g, ' ')}</div>
                    <div className="text-[11px] font-medium text-[var(--admin-text-dim)]">{item.description || 'Core system parameter used for global processing'}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <input
                      type="text"
                      defaultValue={item.value}
                      className="bg-white border border-[var(--admin-border)] px-5 py-3 rounded-2xl text-sm font-bold text-[var(--admin-text)] focus:border-[var(--admin-accent)] outline-none min-w-[350px] shadow-sm transition-all"
                      onBlur={(e) => handleUpdateSetting(item.id, e.target.value)}
                    />
                    <button className="p-3 rounded-xl bg-white text-[var(--admin-text-dim)] hover:text-[var(--admin-text)] border border-[var(--admin-border)] shadow-sm transition-all"><Save size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isModalOpen && editingBlock && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-[#0F172A]/40 backdrop-blur-md animate-fade-in">
          <div className="admin-glass-card w-full max-w-2xl overflow-hidden shadow-2xl bg-white border-none">
            <div className="p-8 border-b border-[#F1F5F9] flex items-center justify-between bg-white">
              <div className="space-y-1">
                <h2 className="text-2xl font-bebas tracking-[2px] text-[var(--admin-text)]">Edit Manifest Logic</h2>
                <p className="text-[10px] font-black text-[var(--admin-text-dim)] uppercase tracking-widest">Section: {editingBlock.id}</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-[var(--admin-text-dim)] hover:text-[var(--admin-text)] hover:bg-[#F1F5F9] transition-all"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleUpdateBlock} className="p-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[2px] text-[var(--admin-text-dim)] block">Section Anchor</label>
                  <input type="text" disabled value={editingBlock.id} className="w-full bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-2xl font-bold text-xs opacity-60 cursor-not-allowed" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[2px] text-[var(--admin-text-dim)] block">Display Title</label>
                  <input
                    type="text"
                    value={editingBlock.title || ''}
                    onChange={(e) => setEditingBlock({ ...editingBlock, title: e.target.value })}
                    className="w-full bg-white border border-[#E2E8F0] p-4 rounded-2xl font-bold text-sm focus:border-[var(--admin-accent)] outline-none shadow-sm transition-all"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[2px] text-[var(--admin-text-dim)] block">Content Logic (Markdown)</label>
                <textarea
                  rows={5}
                  value={editingBlock.body || ''}
                  onChange={(e) => setEditingBlock({ ...editingBlock, body: e.target.value })}
                  className="w-full bg-white border border-[#E2E8F0] p-4 rounded-2xl font-medium text-sm focus:border-[var(--admin-accent)] outline-none resize-none shadow-sm transition-all leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[2px] text-[var(--admin-text-dim)] block">Trigger Action Label</label>
                  <input
                    type="text"
                    value={editingBlock.cta_text || ''}
                    onChange={(e) => setEditingBlock({ ...editingBlock, cta_text: e.target.value })}
                    className="w-full bg-white border border-[#E2E8F0] p-4 rounded-2xl font-bold text-sm focus:border-[var(--admin-accent)] outline-none shadow-sm transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[2px] text-[var(--admin-text-dim)] block">Action Endpoint URL</label>
                  <input
                    type="text"
                    value={editingBlock.cta_url || ''}
                    onChange={(e) => setEditingBlock({ ...editingBlock, cta_url: e.target.value })}
                    className="w-full bg-white border border-[#E2E8F0] p-4 rounded-2xl font-bold text-sm focus:border-[var(--admin-accent)] outline-none shadow-sm transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-8 border-t border-[#F1F5F9] mt-8">
                <div className="flex items-center gap-4 group cursor-pointer" onClick={() => setEditingBlock({ ...editingBlock, is_active: !editingBlock.is_active })}>
                  <div className={cn(
                    "w-14 h-7 rounded-full p-1 transition-all duration-300",
                    editingBlock.is_active ? "bg-green-500 shadow-[0_0_15px_#22c55e60]" : "bg-gray-300"
                  )}>
                    <div className={cn("w-5 h-5 bg-white rounded-full transition-transform duration-300 shadow-sm", editingBlock.is_active ? "translate-x-7" : "translate-x-0")} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[2px]">Deployment Status</span>
                </div>
                <div className="flex gap-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-4 font-black text-[10px] uppercase tracking-widest text-[var(--admin-text-dim)] hover:text-[var(--admin-text)] transition-colors">Discard</button>
                  <button type="submit" disabled={loading} className="px-12 py-4 bg-[var(--admin-accent-gradient)] text-white rounded-2xl font-black text-[10px] uppercase tracking-[3px] shadow-xl shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all">
                    {loading ? 'Processing...' : 'Broadcast Logic'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
