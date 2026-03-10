'use client';

import useSWR from 'swr';
import { fetcher } from '@/lib/api';

export default function EmailTemplatesPage() {
  const { data: templates } = useSWR('/admin/content/email-templates', fetcher); // Placeholder endpoint

  return (
    <div className="email-templates-view">
      <header className="mb-10">
        <h1 className="text-3xl font-black mb-2">Email Templates</h1>
        <p className="opacity-50 text-sm">Manage automated customer notifications and marketing triggers</p>
      </header>

      <div className="grid gap-6">
        {[
          { name: 'Booking Confirmation', trigger: 'ON_BOOKING_CREATED', status: 'Active' },
          { name: 'In-Transit Update', trigger: 'ON_STATUS_CHANGE', status: 'Active' },
          { name: 'Quote Estimated', trigger: 'ON_QUOTE_PRICE_SET', status: 'Active' },
          { name: 'Dispatch Alert', trigger: 'ON_OUT_FOR_DELIVERY', status: 'Active' },
          { name: 'Delivered Proof', trigger: 'ON_DELIVERED', status: 'Active' },
          { name: 'Payment Reminder', trigger: 'ON_INVOICE_DUE', status: 'Draft' },
        ].map((t, i) => (
          <div key={i} className="bg-[var(--bg)] p-6 rounded-2xl border border-[var(--border)] flex justify-between items-center group hover:border-[#ff4500] transition-colors">
            <div>
              <div className="font-bold text-lg">{t.name}</div>
              <div className="text-[10px] font-bold opacity-40 uppercase tracking-widest mt-1">Trigger: {t.trigger}</div>
            </div>
            <div className="flex gap-4 items-center">
              <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${t.status === 'Active' ? 'bg-[#2ecc7115] text-[#2ecc71]' : 'bg-[var(--bg-alt)] opacity-50'}`}>
                {t.status}
              </span>
              <button className="px-4 py-2 bg-[var(--bg-alt)] rounded-lg text-xs font-bold hover:bg-[#ff4500] hover:text-white transition-all">
                Edit HTML →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
