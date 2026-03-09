"use client";

export default function AdminDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-['Syne']">Overview</h1>
          <p className="text-gray-400 mt-1">Welcome back, Admin. Here's what's happening today.</p>
        </div>
        <button className="bg-[var(--og)] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#e66000] shadow-[0_4px_14px_0_rgba(255,107,0,0.39)] transition-all">
          New Booking
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
          <div className="text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">Active Deliveries</div>
          <div className="text-4xl font-bold text-white">124</div>
          <div className="text-green-500 text-sm mt-2 font-medium">↑ 12% vs last week</div>
        </div>
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
          <div className="text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">Revenue Today</div>
          <div className="text-4xl font-bold text-white">£4,289<span className="text-lg text-gray-500">.50</span></div>
          <div className="text-green-500 text-sm mt-2 font-medium">↑ 5.4% vs yesterday</div>
        </div>
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
          <div className="text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">Pending Quotes</div>
          <div className="text-4xl font-bold text-white">12</div>
          <div className="text-red-400 text-sm mt-2 font-medium">Requires action</div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
        <h2 className="text-xl font-bold mb-6">Recent Bookings</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 text-gray-400">
                <th className="pb-3 font-medium px-4">Tracking ID</th>
                <th className="pb-3 font-medium px-4">Client</th>
                <th className="pb-3 font-medium px-4">Route</th>
                <th className="pb-3 font-medium px-4">Status</th>
                <th className="pb-3 font-medium px-4">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr className="hover:bg-white/5 transition-colors">
                <td className="py-4 px-4 font-mono text-[var(--og)]">DD-887741</td>
                <td className="py-4 px-4">TradeFlow UK</td>
                <td className="py-4 px-4 text-gray-300">Manchester → Berlin</td>
                <td className="py-4 px-4"><span className="px-2 py-1 bg-yellow-500/10 text-yellow-500 rounded text-xs font-bold uppercase tracking-wider">In Transit</span></td>
                <td className="py-4 px-4">£142.50</td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="py-4 px-4 font-mono text-[var(--og)]">DD-887742</td>
                <td className="py-4 px-4">Sarah Johnson</td>
                <td className="py-4 px-4 text-gray-300">London → Paris</td>
                <td className="py-4 px-4"><span className="px-2 py-1 bg-green-500/10 text-green-500 rounded text-xs font-bold uppercase tracking-wider">Delivered</span></td>
                <td className="py-4 px-4">£89.00</td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="py-4 px-4 font-mono text-[var(--og)]">DD-887743</td>
                <td className="py-4 px-4">Luxe Box London</td>
                <td className="py-4 px-4 text-gray-300">Birmingham → Rome</td>
                <td className="py-4 px-4"><span className="px-2 py-1 bg-blue-500/10 text-blue-500 rounded text-xs font-bold uppercase tracking-wider">Processing</span></td>
                <td className="py-4 px-4">£210.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
