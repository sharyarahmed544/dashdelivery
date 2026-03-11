'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // 1. Auth Check
    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('user');

    if (!token && pathname !== '/admin/login') {
      router.push('/admin/login');
    } else if (userData) {
      setUser(JSON.parse(userData));
    }

    // 2. Force Standard Cursor
    document.body.style.cursor = 'default';
    document.body.classList.remove('custom-cursor-enabled');

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
    <div id="admin-root" style={{
      display: 'flex !important',
      flexDirection: 'row !important',
      minHeight: '100vh',
      background: 'var(--bg)',
      color: 'var(--text)',
      position: 'relative',
      zIndex: 99999,
      cursor: 'default !important'
    } as any}>
      {/* FORCE FIELD STYLE BLOCK */}
      <style dangerouslySetInnerHTML={{
        __html: `
        #admin-root, #admin-root * {
          cursor: default !important;
          box-sizing: border-box;
        }
        #admin-root a, #admin-root button {
          cursor: pointer !important;
        }
        #admin-root nav, #admin-root aside, #admin-root main, #admin-root header {
          position: static !important;
          float: none !important;
          display: block !important;
          width: auto;
          height: auto;
          margin: 0;
          padding: 0;
          background: transparent;
          border: none;
          box-shadow: none;
          transform: none !important;
          animation: none !important;
        }
        /* Scoped reset for the sidebar specifically */
        #admin-sidebar-container {
          all: unset !important;
          display: flex !important;
          flex-direction: column !important;
          width: 260px !important;
          min-width: 260px !important;
          max-width: 260px !important;
          height: 100vh !important;
          background: var(--surface) !important;
          border-right: 1px solid var(--border) !important;
          padding: 32px 24px !important;
          position: sticky !important;
          top: 0 !important;
          flex-shrink: 0 !important;
          z-index: 100000 !important;
        }
        #admin-nav-list {
          display: flex !important;
          flex-direction: column !important;
          gap: 6px !important;
          margin-top: 40px !important;
          flex: 1 !important;
        }
        #admin-main-content {
          flex: 1 !important;
          padding: 48px !important;
          background: var(--bg2) !important;
          min-height: 100vh !important;
          position: relative !important;
          display: block !important;
          overflow-y: auto !important;
        }
      ` }} />

      {/* Sidebar - Using div for absolute isolation */}
      <div id="admin-sidebar-container">
        <div id="admin-logo" style={{
          fontSize: '22px',
          fontFamily: 'var(--font-bebas)',
          letterSpacing: '2px',
          fontWeight: '900',
          color: '#ff4500',
          marginBottom: '0'
        }}>
          DASH <span style={{ color: 'var(--text)' }}>ADMIN</span>
        </div>

        <div id="admin-nav-list">
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
                transition: 'all 0.2s',
                pointerEvents: 'auto'
              }}
            >
              <span style={{ fontSize: '18px', display: 'inline-block' }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>

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
      </div>

      {/* Main Content */}
      <div id="admin-main-content">
        {children}
      </div>
    </div>
  );
}
