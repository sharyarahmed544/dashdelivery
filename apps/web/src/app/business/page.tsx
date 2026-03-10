'use client';

export default function BusinessPage() {
  const features = [
    { title: 'API Integration', desc: 'Powerful REST APIs for automatic shipping labels and tracking.', icon: '⚙️' },
    { title: 'Bulk Discounts', desc: 'Tiered pricing for high-volume retailers and manufacturers.', icon: '📉' },
    { title: 'Priority Support', desc: 'Dedicated account manager and 24/7 technical assistance.', icon: '📞' },
    { title: 'Global Freight', desc: 'Sea, air, and road freight for large-scale international trade.', icon: '🚢' },
    { title: 'White Label', desc: 'Branded tracking pages and customer notifications.', icon: '🏷️' },
    { title: 'Insurance', desc: 'Comprehensive coverage up to £10,000 per shipment.', icon: '🛡️' },
  ];

  return (
    <div className="pt-32 pb-20">
      <section className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h1 className="text-6xl font-black mb-6 uppercase">Enterprise Solutions</h1>
          <p className="text-xl opacity-60 max-w-3xl mx-auto">
            Scale your logistics with the European network's most advanced B2B platform. From automation to global freight, we move your business forward.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
          {features.map((f, i) => (
            <div key={i} className="p-10 rounded-3xl bg-[var(--bg-alt)] border border-[var(--border)] hover:border-[#ff4500] transition-all">
              <div className="text-4xl mb-6">{f.icon}</div>
              <h3 className="text-2xl font-bold mb-4">{f.title}</h3>
              <p className="opacity-60 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-[#ff4500] p-16 rounded-[40px] text-white flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 text-white opacity-10 text-[20rem] font-black select-none pointer-events-none translate-x-1/4 translate-y-1/4">DASH</div>
          <div className="relative z-10">
            <h2 className="text-5xl font-black mb-4 uppercase">Custom Pricing?</h2>
            <p className="text-xl opacity-80 max-w-xl">Our specialists are ready to build a custom logistics package for your specific industry needs.</p>
          </div>
          <button 
            onClick={() => window.location.href='/quote'}
            className="relative z-10 px-12 py-6 bg-white text-[#ff4500] text-2xl font-black rounded-2xl hover:scale-105 transition-transform"
          >
            REQUEST B2B QUOTE →
          </button>
        </div>
      </section>
    </div>
  );
}
