import { ReactNode } from "react";
import AuthGuard, { signOut } from "@/components/admin/AuthGuard";

export const metadata = {
  title: "Admin Portal | Dash Delivery",
  description: "Manage bookings, quotes, and platform content.",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 p-6 flex flex-col space-y-6">
        <div className="font-['Syne'] font-extrabold text-2xl tracking-tight uppercase">
          Dash <em className="text-[var(--og)] not-italic">Admin</em>
        </div>

        <nav className="flex-1 space-y-2 mt-8">
          <a href="/admin" className="block px-4 py-2 rounded-lg bg-white/10 text-white font-medium">Dashboard</a>
          <a href="/admin/bookings" className="block px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">Bookings</a>
          <a href="/admin/quotes" className="block px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">Quotes</a>
          <a href="/admin/pricing" className="block px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">Pricing Rules</a>
        </nav>

        <div className="pt-6 border-t border-white/10">
          <button onClick={signOut} className="w-full text-left px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">Sign Out</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[#050505]">
        <div className="p-8 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
    </AuthGuard>
  );
}
