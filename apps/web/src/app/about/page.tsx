'use client';

export default function AboutPage() {
  return (
    <div className="pt-32 pb-20">
      <section className="container mx-auto px-6">
        <div className="max-w-4xl">
          <h1 className="text-7xl font-black mb-10 uppercase leading-none">The Future of<br /><span className="text-[#ff4500]">Logistics</span></h1>
          <p className="text-2xl opacity-60 mb-20 leading-relaxed">
            Founded in 2015, Dash Delivery was born from a simple observation: the logistics industry was slow, opaque, and outdated. We set out to build the UK's first AI-driven, transparent parcel network.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-20 mb-32 items-center">
          <div className="aspect-square bg-gradient-to-br from-[#ff450010] to-transparent rounded-3xl border border-[var(--border)] relative overflow-hidden group">
             {/* Imagine an AI-generated image here of a high-tech delivery hub */}
             <div className="absolute inset-0 flex items-center justify-center text-8xl grayscale group-hover:grayscale-0 transition-all duration-700">🏢</div>
          </div>
          <div>
            <h2 className="text-4xl font-bold mb-8 uppercase">Our Mission</h2>
            <p className="opacity-60 text-lg mb-8">
              We aim to reduce delivery times by 40% and carbon emissions by 60% across the European parcel network within the next 5 years through intelligent routing and electric fleet expansion.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="text-4xl font-black text-[#ff4500] mb-2">12M+</div>
                <div className="text-sm opacity-50 uppercase font-bold">Parcels/Year</div>
              </div>
               <div>
                <div className="text-4xl font-black text-[#ff4500] mb-2">250+</div>
                <div className="text-sm opacity-50 uppercase font-bold">Depots</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[var(--bg-alt)] p-16 rounded-[40px] border border-[var(--border)] text-center">
          <h2 className="text-5xl font-black mb-6 uppercase">Ready to ship?</h2>
          <p className="text-xl opacity-60 mb-12 max-w-xl mx-auto">Join 12,000+ businesses who trust Dash for their logistics stack.</p>
          <div className="flex justify-center gap-6">
            <button onClick={() => window.location.href='/book'} className="btn-fire px-12">Open Personal Account</button>
            <button onClick={() => window.location.href='/business'} className="btn-border px-12">Business Solutions</button>
          </div>
        </div>
      </section>
    </div>
  );
}
