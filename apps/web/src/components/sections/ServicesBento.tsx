'use client';

export function ServicesBento() {
  return (
    <section className="sec">
      <div className="sec-eye">Our Services</div>
      <h2 className="sec-h reveal">
        THE COMPLETE<br />DELIVERY <em>ECOSYSTEM</em>
      </h2>
      <p className="sec-sub reveal">
        Every solution your business needs — from urgent same-day parcels to complex cross-border freight.
      </p>
      <div className="bento">
        <div className="bcard bc-feat bc1 reveal">
          <span className="bcard-num">01</span>
          <span className="bcard-icon">⚡</span>
          <div className="bcard-title">Same-Day Express</div>
          <p className="bcard-desc">
            Order before 10am, delivered before 6pm. Our premium city-to-city express network covers all major UK cities with a 100% on-time guarantee — or your money back.
          </p>
          <span className="bcard-pill"><span className="dot"></span> From £8.99</span>
        </div>
        <div className="bcard bc2 reveal reveal-delay-1">
          <span className="bcard-num">02</span>
          <span className="bcard-icon">🌍</span>
          <div className="bcard-title">European Express</div>
          <p className="bcard-desc">
            Door-to-door across 28 EU countries. Full customs clearance, real-time tracking, and signature confirmation included as standard.
          </p>
          <span className="bcard-pill"><span className="dot"></span> 2–3 Business Days</span>
        </div>
        <div className="bcard bc3 bc-price reveal reveal-delay-2">
          <div className="price-from">Starting From</div>
          <div className="price-big">£4<span style={{ fontSize: '.55em' }}>.49</span></div>
          <p className="bcard-desc">Standard next-day delivery anywhere in the UK</p>
        </div>
        <div className="bcard bc4 reveal">
          <span className="bcard-num">03</span>
          <span className="bcard-icon">🧊</span>
          <div className="bcard-title">Cold Chain</div>
          <p className="bcard-desc">
            Temperature-controlled delivery for pharma, food & biologics. 2°C–8°C maintained door to door.
          </p>
          <span className="bcard-pill"><span className="dot"></span> Specialist Service</span>
        </div>
        <div className="bcard bc5 reveal reveal-delay-1">
          <span className="bcard-num">04</span>
          <span className="bcard-icon">🏢</span>
          <div className="bcard-title">Business Accounts & API</div>
          <p className="bcard-desc">
            Dedicated account manager, volume pricing, RESTful API, webhook events, and monthly invoicing. Plug Dash into your e-commerce platform in under 2 hours — Shopify, WooCommerce, Magento and more.
          </p>
          <span className="bcard-pill"><span className="dot"></span> Enterprise Ready</span>
        </div>
        <div className="bcard bc6 reveal reveal-delay-2">
          <span className="bcard-num">05</span>
          <span className="bcard-icon">↩️</span>
          <div className="bcard-title">Returns Management</div>
          <p className="bcard-desc">
            Automated returns portal, prepaid labels, QR drop-off at 3,000+ points, and full reverse logistics for e-commerce brands.
          </p>
          <span className="bcard-pill"><span className="dot"></span> Self-Serve Portal</span>
        </div>
        <div className="bcard bc-big reveal">
          <span className="bcard-num">06</span>
          <span className="bcard-icon">📦</span>
          <div className="bcard-title">Pallet & Freight Solutions</div>
          <p className="bcard-desc">
            From single pallets to full truck loads — B2B freight across UK and Europe with tail-lift delivery, timed windows, and full cargo insurance up to £100,000 as standard.
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '16px' }}>
            <span className="bcard-pill"><span className="dot"></span> Up to 24,000kg</span>
            <span className="bcard-pill"><span className="dot"></span> Tail-lift Available</span>
            <span className="bcard-pill"><span className="dot"></span> Timed Delivery</span>
          </div>
        </div>
        <div className="bcard bc-sm reveal reveal-delay-1" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <span className="bcard-icon">🛡️</span>
            <div className="bcard-title">Fully Insured</div>
            <p className="bcard-desc">
              Every parcel covered up to £2,500 as standard. Enhanced cover up to £50K available on request.
            </p>
          </div>
          <span className="bcard-pill" style={{ width: 'fit-content' }}><span className="dot"></span> All Parcels</span>
        </div>
      </div>
    </section>
  );
}
