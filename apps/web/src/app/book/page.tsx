'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    pickup_address: '',
    delivery_address: '',
    weight: 1,
    service_type: 'STANDARD',
    sender_name: '',
    sender_email: '',
    recipient_name: '',
    recipient_phone: '',
    items_description: ''
  });

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/bookings', formData);
      if (data.success) {
        setOrderId(data.data.tracking_number);
        setStep(4); // Success step
      }
    } catch (err) {
      alert('Booking failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 4) {
    return (
      <div className="pt-40 text-center container mx-auto">
        <div className="text-7xl mb-8">📦</div>
        <h1 className="text-5xl font-black mb-4 uppercase">BOOKING SUCCESSFUL!</h1>
        <p className="text-xl opacity-60 mb-10">Your tracking number is: <strong className="text-[#ff4500] font-black">{orderId}</strong></p>
        <div className="flex justify-center gap-4">
          <button onClick={() => window.location.href='/track'} className="btn-fire">Track Now →</button>
          <button onClick={() => window.location.href='/'} className="btn-border">Return Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20">
      <div className="container mx-auto max-w-4xl px-6">
        {/* Progress Bar */}
        <div className="flex gap-4 mb-20">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex-1 h-3 rounded-full relative bg-[var(--bg-alt)] overflow-hidden">
               <div className="absolute top-0 left-0 h-full bg-[#ff4500] transition-all duration-500" 
                 style={{ width: step >= s ? '100%' : '0%' }}
               />
            </div>
          ))}
        </div>

        <div className="bg-[var(--bg-alt)] p-12 rounded-3xl border border-[var(--border)] shadow-2xl">
          {step === 1 && (
            <div className="reveal visible">
              <h2 className="text-3xl font-black mb-8 uppercase">Step 1: Route & Weight</h2>
              <div className="grid gap-6 mb-10">
                <div>
                  <label className="block text-sm font-bold mb-2 opacity-50">Pickup Postcode / City</label>
                  <input className="w-full p-4 bg-[var(--bg)] border border-[var(--border)] rounded-xl outline-none focus:border-[#ff4500]" 
                    value={formData.pickup_address} onChange={e => setFormData({...formData, pickup_address: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 opacity-50">Delivery Postcode / City</label>
                  <input className="w-full p-4 bg-[var(--bg)] border border-[var(--border)] rounded-xl outline-none focus:border-[#ff4500]" 
                    value={formData.delivery_address} onChange={e => setFormData({...formData, delivery_address: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 opacity-50">Weight (KG): {formData.weight}</label>
                  <input type="range" min="0.5" max="30" step="0.5" className="w-full"
                    value={formData.weight} onChange={e => setFormData({...formData, weight: parseFloat(e.target.value)})} />
                </div>
              </div>
              <button onClick={handleNext} className="w-full py-5 bg-[#ff4500] text-white font-black rounded-2xl text-xl">Continue →</button>
            </div>
          )}

          {step === 2 && (
            <div className="reveal visible">
              <h2 className="text-3xl font-black mb-8 uppercase">Step 2: Choose Service</h2>
              <div className="grid gap-4 mb-10">
                {['STANDARD', 'EXPRESS', 'SAME_DAY'].map(type => (
                  <div key={type} 
                    onClick={() => setFormData({...formData, service_type: type})}
                    className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${formData.service_type === type ? 'border-[#ff4500] bg-[#ff450005]' : 'border-[var(--border)]'}`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xl">{type.replace('_', ' ')}</span>
                      <span className="text-[#ff4500] font-black">£{(15 + (formData.weight * 2)).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-4">
                <button onClick={handleBack} className="flex-1 py-5 border border-[var(--border)] font-bold rounded-2xl">Back</button>
                <button onClick={handleNext} className="flex-2 py-5 bg-[#ff4500] text-white font-black rounded-2xl text-xl">Confirm Service →</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="reveal visible">
              <h2 className="text-3xl font-black mb-8 uppercase">Step 3: Contact Details</h2>
              <div className="grid md:grid-cols-2 gap-6 mb-10">
                <input placeholder="Sender Name" className="p-4 bg-[var(--bg)] border border-[var(--border)] rounded-xl outline-none"
                  value={formData.sender_name} onChange={e => setFormData({...formData, sender_name: e.target.value})} />
                <input placeholder="Sender Email" className="p-4 bg-[var(--bg)] border border-[var(--border)] rounded-xl outline-none"
                  value={formData.sender_email} onChange={e => setFormData({...formData, sender_email: e.target.value})} />
                <input placeholder="Recipient Name" className="p-4 bg-[var(--bg)] border border-[var(--border)] rounded-xl outline-none"
                  value={formData.recipient_name} onChange={e => setFormData({...formData, recipient_name: e.target.value})} />
                <input placeholder="Recipient Phone" className="p-4 bg-[var(--bg)] border border-[var(--border)] rounded-xl outline-none"
                  value={formData.recipient_phone} onChange={e => setFormData({...formData, recipient_phone: e.target.value})} />
              </div>
              <div className="flex gap-4">
                <button onClick={handleBack} className="flex-1 py-5 border border-[var(--border)] font-bold rounded-2xl">Back</button>
                <button onClick={handleSubmit} disabled={loading} className="flex-2 py-5 bg-[#ff4500] text-white font-black rounded-2xl text-xl">
                  {loading ? 'PROCESSING...' : 'COMPLETE BOOKING →'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
