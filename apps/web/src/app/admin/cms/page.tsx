'use client';

import useSWR, { mutate } from 'swr';
import { fetcher, api } from '@/lib/api';
import { useState } from 'react';

export default function CMSPage() {
  const { data: blocks, error, isLoading } = useSWR('/admin/content', fetcher);
  const [editingBlock, setEditingBlock] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put(`/admin/content/${editingBlock.id}`, editingBlock);
      if (data.success) {
        mutate('/admin/content');
        setEditingBlock(null);
      }
    } catch (err) {
      alert('Failed to update content');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <div>Loading CMS...</div>;

  return (
    <div className="cms-view">
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800' }}>Content CMS</h1>
        <p style={{ opacity: 0.6, fontSize: '13px' }}>Modify website text and call-to-action buttons</p>
      </header>

      <div style={{ display: 'grid', gap: '16px' }}>
        {blocks?.map((block: any) => (
          <div key={block.id} style={{ 
            background: 'var(--bg)', 
            padding: '20px', 
            borderRadius: '12px', 
            border: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontWeight: '700', fontSize: '14px', marginBottom: '4px' }}>{block.key}</div>
              <div style={{ fontSize: '12px', opacity: 0.5 }}>{block.title || 'No Title'} | {block.body?.substring(0, 50)}...</div>
            </div>
            <button 
              onClick={() => setEditingBlock(block)}
              style={{ 
                padding: '8px 16px', 
                fontSize: '12px', 
                fontWeight: '700', 
                background: '#ff4500', 
                color: 'white', 
                border: 'none', 
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Edit Section
            </button>
          </div>
        ))}
      </div>

      {editingBlock && (
        <div style={{ 
          position: 'fixed', 
          top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.8)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{ 
            background: 'var(--bg)', 
            width: '100%', 
            maxWidth: '600px', 
            padding: '32px', 
            borderRadius: '16px',
            border: '1px solid var(--border)'
          }}>
            <h2 style={{ marginBottom: '24px' }}>Edit: {editingBlock.key}</h2>
            <form onSubmit={handleUpdate}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '8px' }}>Title</label>
                <input 
                  type="text" 
                  style={{ width: '100%', padding: '12px', background: 'var(--bg-alt)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }}
                  value={editingBlock.title || ''}
                  onChange={(e) => setEditingBlock({...editingBlock, title: e.target.value})}
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '8px' }}>Body Content</label>
                <textarea 
                  rows={4}
                  style={{ width: '100%', padding: '12px', background: 'var(--bg-alt)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }}
                  value={editingBlock.body || ''}
                  onChange={(e) => setEditingBlock({...editingBlock, body: e.target.value})}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                <button 
                  type="button"
                  onClick={() => setEditingBlock(null)}
                  style={{ flex: 1, padding: '12px', background: 'var(--bg-alt)', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  style={{ flex: 2, padding: '12px', background: '#ff4500', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
