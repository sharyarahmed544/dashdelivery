'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // 1. Auth & User Check
    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('user');

    if (!token && pathname !== '/admin/login') {
      router.push('/admin/login');
    } else if (userData) {
      setUser(JSON.parse(userData));
    }

    // 2. Cursor Restore
    document.body.style.cursor = 'default';
    return () => {
      if (!window.location.pathname.startsWith('/admin')) {
        document.body.style.cursor = 'none';
      }
    };
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
    <div className="admin-layout" style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'var(--bg)',
      color: 'var(--text)',
      position: 'relative',
      zIndex: 1000
    }}>
      {/* Sidebar */}
      <aside style={{
        width: '260px',
        flexShrink: 0,
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        padding: '32px 24px',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh'
      }}>
        <div className="logo" style={{
          fontSize: '22px',
          fontFamily: 'var(--font-bebas)',
          letterSpacing: '2px',
          fontWeight: '900',
          color: '#ff4500',
          marginBottom: '40px'
        }}>
          DASH <span style={{ color: 'var(--text)' }}>ADMIN</span>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
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
                textDecoration: 'none',
                color: pathname === item.path ? 'white' : 'var(--text2)',
                background: pathname === item.path ? '#ff4500' : 'transparent',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
            >
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
          {user && (
            <div style={{ marginBottom: '16px', padding: '0 8px' }}>
              <div style={{ fontSize: '14px', fontWeight: '700' }}>{user.name}</div>
              <div style={{ fontSize: '11px', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '1px' }}>{user.role}</div>
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
              padding: '12px',
              background: 'rgba(255, 69, 0, 0.08)',
              color: '#ff4500',
              border: 'none',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{
        flex: 1,
        padding: '48px',
        background: 'var(--bg2)',
        minHeight: '100vh',
        position: 'relative'
      }}>
        {children}
      </main>
    </div>
  );
}
