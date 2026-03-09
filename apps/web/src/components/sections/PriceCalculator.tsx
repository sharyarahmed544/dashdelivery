'use client';

import { useState, useEffect } from 'react';
import { getPricingRules } from '@/app/actions/pricing';
import { calculatePrice } from '@/lib/pricing';

export function PriceCalculator() {
  const [weight, setWeight] = useState(2);
  const [svcType, setSvcType] = useState(2.2);
  const [rules, setRules] = useState({
    baseRate: 12,
    weightMultiplier: 1.6,
    fuelLevyPercentage: 0.035
  });

  useEffect(() => {
    async function fetchRules() {
      const liveRules = await getPricingRules();
      setRules(liveRules);
    }
    fetchRules();
  }, []);
  
  const pricing = calculatePrice(weight, svcType, rules);
  const total = pricing.total;
  
  const formatGBP = (val: number) => `£${val.toFixed(2)}`;
  
  const totalStr = total.toFixed(2).split('.');

  return (
    <section className="sec sec-alt">
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
            <select className="calc-select" defaultValue="United Kingdom">
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
            <select className="calc-select" defaultValue="Germany">
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
              onChange={(e) => setSvcType(parseFloat(e.target.value))}
            >
              <option value="2.2">Standard (3–5 days)</option>
              <option value="1.6">Express (1–2 days)</option>
              <option value="1.0">Same-Day</option>
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
        
        <div className="calc-result reveal reveal-delay-1">
          <div>
            <div className="calc-result-label">Estimated Total (inc. VAT)</div>
            <div className="calc-price">
              £{totalStr[0]}<span style={{ fontSize: '.45em' }}>.{totalStr[1]}</span>
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,.6)', marginTop: '4px', fontStyle: 'italic' }}>
              No hidden fees · Insurance included
            </div>
            <div className="calc-breakdown">
              <div className="cb-row"><span className="cb-key">Base rate</span><span className="cb-val">{formatGBP(pricing.base)}</span></div>
              <div className="cb-row"><span className="cb-key">Weight surcharge</span><span className="cb-val">{formatGBP(pricing.weightCharge)}</span></div>
              <div className="cb-row"><span className="cb-key">Fuel levy ({(rules.fuelLevyPercentage * 100).toFixed(1)}%)</span><span className="cb-val">{formatGBP(pricing.fuel)}</span></div>
              <div className="cb-row"><span className="cb-key">Insurance</span><span className="cb-val">Included ✓</span></div>
              <div className="cb-row"><span className="cb-key">Live Tracking</span><span className="cb-val">Included ✓</span></div>
            </div>
          </div>
          <button className="calc-cta">Book This Delivery →</button>
        </div>
      </div>
    </section>
  );
}
