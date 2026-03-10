'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

export default function QuotePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    service_type: 'STANDARD',
    total_weight: 1,
    items_description: '',
    pickup_address: '',
    delivery_address: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/quotes', formData);
      if (data.success) {
        setSubmitted(true);
      }
    } catch (err) {
      alert('Failed to submit quote request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="pt-40 pb-20 text-center container mx-auto px-6">
        <div className="text-6xl mb-8">✅</div>
        <h1 className="text-5xl font-black mb-6 uppercase">Request Received!</h1>
        <p className="text-xl opacity-60 max-w-xl mx-auto mb-10">
          Our logistics team is currently calculating your custom estimate. You will receive a response at <strong>{formData.email}</strong> within 60 minutes.
        </p>
        <button onClick={() => setSubmitted(false)} className="btn-fire">Submit Another Request</button>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20">
      <section className="container mx-auto px-6 max-w-3xl">
        <h1 className="text-5xl font-black mb-6 text-center uppercase">Custom Quote</h1>
        <p className="text-xl opacity-60 text-center mb-16">
          Shipping large quantities or specialized cargo? Get a custom B2B estimate in under an hour.
        </p>

        <form onSubmit={handleSubmit} className="bg-[var(--bg-alt)] p-10 rounded-3xl border border-[var(--border)] shadow-2xl">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-bold mb-2 opacity-60 uppercase">Full Name</label>
              <input required type="text" className="w-full bg-[var(--bg)] border border-[var(--border)] p-4 rounded-xl text-white focus:border-[#ff4500] outline-none" 
                value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 opacity-60 uppercase">Work Email</label>
              <input required type="email" className="w-full bg-[var(--bg)] border border-[var(--border)] p-4 rounded-xl text-white focus:border-[#ff4500] outline-none"
                value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
             <div>
              <label className="block text-sm font-bold mb-2 opacity-60 uppercase">Company Name</label>
              <input type="text" className="w-full bg-[var(--bg)] border border-[var(--border)] p-4 rounded-xl text-white focus:border-[#ff4500] outline-none"
                value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 opacity-60 uppercase">Service Type</label>
              <select className="w-full bg-[var(--bg)] border border-[var(--border)] p-4 rounded-xl text-white focus:border-[#ff4500] outline-none appearance-none"
                value={formData.service_type} onChange={(e) => setFormData({...formData, service_type: e.target.value})}>
                <option value="STANDARD">Standard Bulk</option>
                <option value="EXPRESS">Global Express</option>
                <option value="FREIGHT">Sea/Air Freight</option>
              </select>
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-bold mb-2 opacity-60 uppercase">Items Description</label>
            <textarea rows={4} className="w-full bg-[var(--bg)] border border-[var(--border)] p-4 rounded-xl text-white focus:border-[#ff4500] outline-none"
              placeholder="E.g. 50 Cartons of electronics, 2 Pallets of textiles..."
              value={formData.items_description} onChange={(e) => setFormData({...formData, items_description: e.target.value})} />
          </div>

          <button type="submit" disabled={loading} className="w-full py-5 text-xl font-black bg-[#ff4500] text-white rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50">
            {loading ? 'GETTING ESTIMATE...' : 'REQUEST INSTANT QUOTE →'}
          </button>
        </form>
      </section>
    </div>
  );
}
