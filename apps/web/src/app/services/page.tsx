'use client';

import useSWR from 'swr';
import { fetcher } from '@/lib/api';

export default function ServicesPage() {
  const { data: services, isLoading } = useSWR('/services', fetcher);

  return (
    <div className="pt-32 pb-20">
      <section className="container mx-auto px-6">
        <div className="mb-16 text-center">
          <h1 className="text-5xl font-black mb-6">OUR SERVICES</h1>
          <p className="text-xl opacity-60 max-w-2xl mx-auto">
            From local same-day deliveries to complex global freight solutions, Dash provides the speed and reliability your business demands.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services?.map((s: any) => (
            <div key={s.id} className="p-10 rounded-3xl bg-[var(--bg-alt)] border border-[var(--border)] hover:border-[#ff4500] transition-all group">
              <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">{s.icon}</div>
              <h3 className="text-2xl font-bold mb-4">{s.name}</h3>
              <p className="opacity-60 mb-8 leading-relaxed">{s.description}</p>
              <div className="flex justify-between items-center pt-6 border-t border-[var(--border)]">
                <div>
                  <div className="text-sm opacity-50 uppercase font-bold">Starting from</div>
                  <div className="text-xl font-black text-[#ff4500]">£{s.price_from}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm opacity-50 uppercase font-bold">Delivery</div>
                  <div className="text-md font-bold">{s.duration}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
