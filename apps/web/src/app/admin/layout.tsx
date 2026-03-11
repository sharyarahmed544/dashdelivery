'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('user');

    if (!token && pathname !== '/admin/login') {
      router.push('/admin/login');
    } else if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [pathname, router]);

  if (pathname === '/admin/login') return <>{children}</>;

  const menuItems = [
    { label: 'Dashboard', icon: '📊', path: '/admin' },
    { label: 'Bookings', icon: '📦', path: '/admin/bookings' },
    { label: 'Quotes', icon: '📄', path: '/admin/quotes' },
    { label: 'Invoices', icon: '💰', path: '/admin/invoices' },
    { label: 'Content CMS', icon: '📝', path: '/admin/cms' },
    { label: 'Users & Roles', icon: '👥', path: '/admin/users' },
    { label: 'Pricing Rules', icon: '🏷️', path: '/admin/settings' },
    { label: 'Analytics', icon: '📈', path: '/admin/analytics' },
  ];

  return (
    <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-alt)' }}>
      {/* Sidebar */}
      <aside style={{
        width: '260px',
        background: 'var(--bg)',
        borderRight: '1px solid var(--border)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div className="logo" style={{ fontSize: '20px', fontWeight: '900', color: '#ff4500', marginBottom: '40px' }}>
          DASH <span style={{ color: 'var(--text)' }}>ADMIN</span>
        </div>

        <nav style={{ flex: 1 }}>
          {menuItems.map(item => (
            <Link
              key={item.path}
              href={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '12px',
                marginBottom: '4px',
                textDecoration: 'none',
                color: pathname === item.path ? 'white' : 'var(--text)',
                background: pathname === item.path ? '#ff4500' : 'transparent',
                fontSize: '14px',
                fontWeight: '600',
                opacity: pathname === item.path ? 1 : 0.7,
                transition: 'all 0.2s'
              }}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
          {user && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '13px', fontWeight: '700' }}>{user.name}</div>
              <div style={{ fontSize: '11px', opacity: 0.6 }}>{user.role}</div>
            </div>
          )}
          <button
            onClick={() => {
              localStorage.removeItem('accessToken');
              localStorage.removeItem('user');
              router.push('/admin/login');
            }}
            style={{
              width: '100%',
              padding: '10px',
              background: 'rgba(255, 69, 0, 0.1)',
              color: '#ff4500',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
