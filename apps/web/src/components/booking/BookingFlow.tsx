'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string || 'pk_test_placeholder');

function CheckoutForm({ amount }: { amount: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/booking-success`,
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message || "An unexpected error occurred.");
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement id="payment-element" />
      <button 
        disabled={isLoading || !stripe || !elements} 
        id="submit"
        className="w-full bg-[var(--og)] text-white font-bold py-4 rounded-lg uppercase tracking-wider hover:bg-[#e66000] transition-colors disabled:opacity-50"
      >
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : `Pay £${amount.toFixed(2)}`}
        </span>
      </button>
      {message && <div id="payment-message" className="text-red-500 font-medium">{message}</div>}
    </form>
  );
}

export function BookingFlow() {
  const [step, setStep] = useState(1);
  const [clientSecret, setClientSecret] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    senderName: '',
    senderAddress: '',
    recipientName: '',
    recipientAddress: '',
    weight: 2,
    serviceType: 2.2,
  });

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const amount = (12 * formData.serviceType) + (formData.weight * 1.6 * formData.serviceType) * 1.035;

  const initPayment = async () => {
    setStep(4);
    // Fetch PaymentIntent from API
    try {
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });
      const data = await res.json();
      setClientSecret(data.clientSecret);
    } catch (err) {
      console.error("Failed to initialize payment", err);
    }
  };

  return (
    <div className="bg-[rgba(255,255,255,0.03)] border border-[var(--border)] rounded-2xl p-8 backdrop-blur-md">
      {/* Stepper */}
      <div className="flex items-center justify-between mb-8 pb-8 border-b border-[var(--border)]">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`flex flex-col flex-1 items-center ${step === i ? 'text-[var(--og)]' : 'text-gray-500'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-2 ${step === i ? 'bg-[var(--og)] text-white' : step > i ? 'bg-[var(--og2)] text-white' : 'bg-gray-800'}`}>
              {step > i ? '✓' : i}
            </div>
            <span className="text-xs font-bold uppercase tracking-wider hidden md:block">
              {i === 1 ? 'Sender' : i === 2 ? 'Recipient' : i === 3 ? 'Parcel' : 'Payment'}
            </span>
          </div>
        ))}
      </div>

      <div className="min-h-[300px]">
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <h2 className="text-2xl font-bold mb-6">Sender Details</h2>
            <input 
              className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--og)] transition-colors"
              placeholder="Full Name"
              value={formData.senderName} 
              onChange={e => setFormData({...formData, senderName: e.target.value})} 
            />
            <textarea 
              className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--og)] transition-colors"
              placeholder="Full Address including Postcode"
              rows={3}
              value={formData.senderAddress} 
              onChange={e => setFormData({...formData, senderAddress: e.target.value})} 
            />
            <button 
              onClick={nextStep}
              className="mt-6 bg-white text-black font-bold py-3 px-8 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Next Step
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <h2 className="text-2xl font-bold mb-6">Recipient Details</h2>
            <input 
              className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--og)] transition-colors"
              placeholder="Full Name"
              value={formData.recipientName} 
              onChange={e => setFormData({...formData, recipientName: e.target.value})} 
            />
            <textarea 
              className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--og)] transition-colors"
              placeholder="Full Address including Postcode"
              rows={3}
              value={formData.recipientAddress} 
              onChange={e => setFormData({...formData, recipientAddress: e.target.value})} 
            />
            <div className="flex gap-4 mt-6">
              <button onClick={prevStep} className="bg-transparent border border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-[rgba(255,255,255,0.1)] transition-colors">Back</button>
              <button onClick={nextStep} className="bg-white text-black font-bold py-3 px-8 rounded-lg hover:bg-gray-200 transition-colors">Next Step</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-in fade-in">
            <h2 className="text-2xl font-bold mb-6">Parcel Details</h2>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Weight: {formData.weight} kg</label>
              <input type="range" min="0.5" max="30" step="0.5" value={formData.weight} onChange={e => setFormData({...formData, weight: parseFloat(e.target.value)})} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[var(--og)]" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2 mt-4">Service Type</label>
              <select 
                value={formData.serviceType} 
                onChange={e => setFormData({...formData, serviceType: parseFloat(e.target.value)})}
                className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--og)] transition-colors appearance-none"
              >
                <option value="2.2" className="bg-[#111]">Standard (3–5 days)</option>
                <option value="1.6" className="bg-[#111]">Express (1–2 days)</option>
                <option value="1.0" className="bg-[#111]">Same-Day</option>
              </select>
            </div>

            <div className="mt-8 p-6 bg-[rgba(255,107,0,0.1)] rounded-xl border border-[rgba(255,107,0,0.2)]">
              <div className="flex justify-between items-center">
                <span className="font-bold">Estimated Total</span>
                <span className="text-3xl font-extrabold text-[var(--og)]">£{amount.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button onClick={prevStep} className="bg-transparent border border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-[rgba(255,255,255,0.1)] transition-colors">Back</button>
              <button onClick={initPayment} className="bg-[var(--og)] text-white font-bold py-3 px-8 rounded-lg hover:bg-[#e66000] transition-colors">Proceed to Payment →</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="animate-in fade-in">
            <h2 className="text-2xl font-bold mb-6">Complete Payment</h2>
            {clientSecret ? (
              <Elements options={{ clientSecret, appearance: { theme: 'night', variables: { colorPrimary: '#ff6b00' } } }} stripe={stripePromise}>
                <CheckoutForm amount={amount} />
              </Elements>
            ) : (
              <div className="py-12 flex justify-center text-gray-400">Loading payment gateway...</div>
            )}
            <div className="mt-6">
              <button onClick={prevStep} disabled={!!clientSecret} className="text-gray-400 font-bold hover:text-white transition-colors">← Back to Details</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
