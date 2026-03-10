'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/contact', formData);
      if (data.success) setSubmitted(true);
    } catch (err) {
      alert('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="pt-40 text-center container mx-auto">
        <div className="text-6xl mb-8">✉️</div>
        <h1 className="text-5xl font-black mb-6 uppercase">Message Sent</h1>
        <p className="text-xl opacity-60 mb-10">We'll get back to you within 24 hours.</p>
        <button onClick={() => setSubmitted(false)} className="btn-fire">Send Another</button>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20">
      <section className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20">
          <div>
            <h1 className="text-6xl font-black mb-10 uppercase">Get in Touch</h1>
            <p className="text-xl opacity-60 mb-12">
              Have a question about a shipment or interested in a business partnership? Our team is here to help 24/7.
            </p>
            
            <div className="grid gap-8">
              <div className="flex gap-6 items-start">
                <div className="p-4 bg-[var(--bg-alt)] rounded-2xl text-2xl">📍</div>
                <div>
                  <h4 className="font-bold text-lg mb-1">London Headquarters</h4>
                  <p className="opacity-50 text-sm">124 City Road, London, EC1V 2NX</p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="p-4 bg-[var(--bg-alt)] rounded-2xl text-2xl">📞</div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Support Phone</h4>
                  <p className="opacity-50 text-sm">+44 (0) 20 7946 0000</p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="p-4 bg-[var(--bg-alt)] rounded-2xl text-2xl">✉️</div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Sales Email</h4>
                  <p className="opacity-50 text-sm">sales@dashdelivery.co.uk</p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-[var(--bg-alt)] p-10 rounded-3xl border border-[var(--border)] shadow-2xl">
            <div className="grid gap-6">
              <input required placeholder="Your Name" className="p-4 bg-[var(--bg)] border border-[var(--border)] rounded-xl outline-none focus:border-[#ff4500]"
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input required type="email" placeholder="Your Email" className="p-4 bg-[var(--bg)] border border-[var(--border)] rounded-xl outline-none focus:border-[#ff4500]"
                value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              <input required placeholder="Subject" className="p-4 bg-[var(--bg)] border border-[var(--border)] rounded-xl outline-none focus:border-[#ff4500]"
                value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} />
              <textarea required rows={5} placeholder="How can we help?" className="p-4 bg-[var(--bg)] border border-[var(--border)] rounded-xl outline-none focus:border-[#ff4500]"
                value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} />
              <button disabled={loading} className="py-5 bg-[#ff4500] text-3xl font-black text-white rounded-2xl hover:scale-105 transition-transform uppercase">
                {loading ? 'SENDING...' : 'SEND MESSAGE →'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
