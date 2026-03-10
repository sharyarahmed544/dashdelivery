'use client';

import { PriceCalculator } from '@/components/sections/PriceCalculator';
import useSWR from 'swr';
import { fetcher } from '@/lib/api';

export default function PricingPage() {
  const { data: services } = useSWR('/services', fetcher);

  return (
    <div className="pt-32 pb-20">
      <section className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black mb-6 uppercase">Simple, Transparent Pricing</h1>
          <p className="text-xl opacity-60 max-w-2xl mx-auto">
            No monthly fees. No hidden surcharges. Use our instant calculator or view our standard rate tables below.
          </p>
        </div>

        <div className="mb-20">
           <PriceCalculator />
        </div>

        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black mb-10 text-center uppercase">Standard Rate Table</h2>
          <div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--bg-alt)]">
            <table className="w-full text-left">
              <thead className="bg-[#ff450010] border-b border-[var(--border)]">
                <tr>
                  <th className="p-6 font-bold">Service</th>
                  <th className="p-6 font-bold">Delivery Time</th>
                  <th className="p-6 font-bold">Base Price</th>
                </tr>
              </thead>
              <tbody>
                {services?.map((s: any) => (
                  <tr key={s.id} className="border-b border-[var(--border)] last:border-0">
                    <td className="p-6 font-bold text-lg">{s.name}</td>
                    <td className="p-6 opacity-60">{s.duration}</td>
                    <td className="p-6 font-black text-[#ff4500]">£{s.price_from}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-8 p-6 bg-[var(--bg-alt)] rounded-2xl text-sm opacity-60 text-center italic">
            * Prices are subject to fuel levy and VAT where applicable. Large items may require a custom quote.
          </div>
        </div>
      </section>
    </div>
  );
}
