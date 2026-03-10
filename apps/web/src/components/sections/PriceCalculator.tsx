'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export function PriceCalculator() {
  const [fromCountry, setFromCountry] = useState('United Kingdom');
  const [toCountry, setToCountry] = useState('Germany');
  const [weight, setWeight] = useState(2);
  const [svcType, setSvcType] = useState('STANDARD');
  const [pricing, setPricing] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await api.post('/calculate-price', {
          from_country: fromCountry,
          to_country: toCountry,
          service_type: svcType,
          weight
        });
        if (data.success) {
          setPricing(data.data);
        }
      } catch (err) {
        console.error('Calc failed');
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [fromCountry, toCountry, weight, svcType]);
  
  const formatGBP = (val: number) => `£${val.toFixed(2)}`;
  const totalStr = (pricing?.total || 0).toFixed(2).split('.');

  return (
    <section id="pricing" className="sec sec-alt">
      <div className="sec-eye">Instant Pricing</div>
      <h2 className="sec-h reveal">
        GET YOUR PRICE<br /><em>IN SECONDS</em>
      </h2>
      <p className="sec-sub reveal">
        No hidden fees. No surprises. Transparent pricing calculated instantly.
      </p>
      <div className="calc-wrap">
        <div className="calc-box reveal">
          <div className="calc-row">
            <label className="calc-label">From</label>
            <select 
              className="calc-select" 
              value={fromCountry}
              onChange={(e) => setFromCountry(e.target.value)}
            >
              <option>United Kingdom</option>
              <option>France</option>
              <option>Germany</option>
              <option>Spain</option>
              <option>Italy</option>
              <option>Netherlands</option>
              <option>Poland</option>
            </select>
          </div>
          <div className="calc-row">
            <label className="calc-label">To</label>
            <select 
              className="calc-select" 
              value={toCountry}
              onChange={(e) => setToCountry(e.target.value)}
            >
              <option>Germany</option>
              <option>United Kingdom</option>
              <option>France</option>
              <option>Spain</option>
              <option>Italy</option>
              <option>Netherlands</option>
              <option>Poland</option>
            </select>
          </div>
          <div className="calc-row">
            <label className="calc-label">Service Type</label>
            <select 
              className="calc-select" 
              value={svcType}
              onChange={(e) => setSvcType(e.target.value)}
            >
              <option value="STANDARD">Standard (3–5 days)</option>
              <option value="EXPRESS">Express (1–2 days)</option>
              <option value="SAME_DAY">Same-Day</option>
            </select>
          </div>
          <div className="calc-row">
            <label className="calc-label">Weight: <span>{weight}</span> kg</label>
            <input 
              className="weight-slider" 
              type="range" 
              min="0.5" 
              max="30" 
              step="0.5" 
              value={weight} 
              onChange={(e) => setWeight(parseFloat(e.target.value))} 
            />
            <div className="weight-val">{weight} kg</div>
          </div>
        </div>
        
        <div className={`calc-result reveal reveal-delay-1 ${loading ? 'opacity-50' : ''}`}>
          <div>
            <div className="calc-result-label">Estimated Total (inc. VAT)</div>
            <div className="calc-price">
              £{totalStr[0]}<span style={{ fontSize: '.45em' }}>.{totalStr[1]}</span>
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,.6)', marginTop: '4px', fontStyle: 'italic' }}>
              No hidden fees · Insurance included
            </div>
            {pricing && (
              <div className="calc-breakdown">
                <div className="cb-row"><span className="cb-key">Base rate</span><span className="cb-val">{formatGBP(pricing.base_price)}</span></div>
                <div className="cb-row"><span className="cb-key">Weight surcharge</span><span className="cb-val">{formatGBP(pricing.weight_charge)}</span></div>
                <div className="cb-row"><span className="cb-key">Fuel levy</span><span className="cb-val">{formatGBP(pricing.fuel_surcharge)}</span></div>
                <div className="cb-row"><span className="cb-key">Insurance</span><span className="cb-val">Included ✓</span></div>
                <div className="cb-row"><span className="cb-key">Live Tracking</span><span className="cb-val">Included ✓</span></div>
              </div>
            )}
          </div>
          <button className="calc-cta">Book This Delivery →</button>
        </div>
      </div>
    </section>
  );
}
