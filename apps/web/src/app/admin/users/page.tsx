'use client';

import useSWR from 'swr';
import { fetcher } from '@/lib/api';

export default function UsersPage() {
  const { data: users, error, isLoading } = useSWR('/admin/users', fetcher);

  if (isLoading) return <div>Loading users...</div>;

  return (
    <div className="users-view">
      <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '800' }}>Users & Permissions</h1>
          <p style={{ opacity: 0.6, fontSize: '13px' }}>Internal staff and administrative access control</p>
        </div>
        <button style={{ 
          padding: '10px 20px', 
          background: '#ff4500', 
          color: 'white', 
          border: 'none', 
          borderRadius: '8px',
          fontWeight: '700',
          cursor: 'pointer'
        }}>+ Add Staff Member</button>
      </header>

      <div style={{ 
        background: 'var(--bg)', 
        borderRadius: '16px', 
        border: '1px solid var(--border)',
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ background: 'var(--bg-alt)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '16px 20px', fontWeight: '700' }}>Name</th>
              <th style={{ padding: '16px 20px', fontWeight: '700' }}>Email</th>
              <th style={{ padding: '16px 20px', fontWeight: '700' }}>Role</th>
              <th style={{ padding: '16px 20px', fontWeight: '700' }}>Status</th>
              <th style={{ padding: '16px 20px', fontWeight: '700' }}>Last Login</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((u: any) => (
              <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '16px 20px', fontWeight: '600' }}>{u.name}</td>
                <td style={{ padding: '16px 20px' }}>{u.email}</td>
                <td style={{ padding: '16px 20px' }}>
                  <span style={{ 
                    fontSize: '11px', 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    background: u.role === 'ADMIN' ? '#ff450020' : '#eee',
                    color: u.role === 'ADMIN' ? '#ff4500' : '#333',
                    fontWeight: '700'
                  }}>{u.role}</span>
                </td>
                <td style={{ padding: '16px 20px' }}>
                   <span style={{ color: '#2ecc71', fontWeight: '700' }}>● Active</span>
                </td>
                <td style={{ padding: '16px 20px', opacity: 0.5 }}>
                  {u.last_login ? new Date(u.last_login).toLocaleString() : 'Never'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
