'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';
import './admin.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // 1. Auth Check
    const token = localStorage.getItem('accessToken');
    if (!token && pathname !== '/admin/login') {
      router.push('/admin/login');
    }

    // 2. Clear custom cursor classes and set standard cursor
    document.body.classList.remove('custom-cursor-enabled');
    document.body.style.cursor = 'default';

    return () => {
      // Restore cursor only if leaving admin
      if (!window.location.pathname.startsWith('/admin')) {
        document.body.style.cursor = 'none';
      }
    };
  }, [pathname, router]);

  if (!mounted) return <div className="min-h-screen bg-[#F8FAFC]" />;
  if (pathname === '/admin/login') return <>{children}</>;

  return (
    <div id="admin-root" className="flex min-h-screen bg-[var(--admin-bg)] text-[var(--admin-text)] overflow-hidden">
      {/* SCOPED CSS RESET - Force-field against global styles with Premium Light Theme support */}
      <style dangerouslySetInnerHTML={{
        __html: `
        #admin-root, #admin-root * {
          box-sizing: border-box;
          cursor: default !important;
        }
        #admin-root a, #admin-root button, #admin-root [role="button"] {
          cursor: pointer !important;
        }
        /* Disable aggressive global nav/aside/main styles */
        #admin-root nav, #admin-root aside, #admin-root main, #admin-root header {
          position: static;
          float: none;
          width: auto;
          height: auto;
          margin: 0;
          padding: 0;
          background: transparent;
          border: none;
          box-shadow: none;
          transform: none !important;
          animation: none !important;
          backdrop-filter: none;
        }
        /* Input & Form refinements for Light Mode */
        #admin-root input, #admin-root select, #admin-root textarea {
          background-color: #FFFFFF;
          color: #1E293B;
          border: 1px solid rgba(0,0,0,0.1);
        }
        #admin-root input:focus, #admin-root select:focus, #admin-root textarea:focus {
          border-color: #FF4500 !important;
          outline: none;
        }
        /* Re-enable flex for root */
        #admin-root { display: flex !important; }
      ` }} />

      <AdminSidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <AdminHeader />

        <main id="admin-main-content" className="flex-1 overflow-y-auto p-8 admin-scrollbar bg-[var(--admin-bg)]">
          <div className="max-w-[1600px] mx-auto animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
