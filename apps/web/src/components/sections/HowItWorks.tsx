'use client';

export function HowItWorks() {
  return (
    <section className="sec" style={{ background: 'var(--bg)' }}>
      <div className="sec-eye">How It Works</div>
      <h2 className="sec-h reveal">FROM BOOKING<br />TO <em>DOORSTEP</em></h2>
      <div className="how-steps">
        <div className="how-step reveal">
          <div className="how-step-num">01</div>
          <span className="how-step-icon">📋</span>
          <div className="how-step-title">Book Online or via API</div>
          <p className="how-step-desc">Create a shipment in 60 seconds on our website, app or via REST API. Auto-fill addresses from your saved book.</p>
        </div>
        <div className="how-step reveal reveal-delay-1">
          <div className="how-step-num">02</div>
          <span className="how-step-icon">🏷️</span>
          <div className="how-step-title">Print or Get QR Label</div>
          <p className="how-step-desc">Print a smart label, use our paperless QR code, or have our driver arrive with the label — your choice.</p>
        </div>
        <div className="how-step reveal reveal-delay-2">
          <div className="how-step-num">03</div>
          <span className="how-step-icon">🚚</span>
          <div className="how-step-title">We Collect & Move</div>
          <p className="how-step-desc">Our driver collects on time. Your parcel moves through our optimised hub network — faster than any other UK courier.</p>
        </div>
        <div className="how-step reveal reveal-delay-3">
          <div className="how-step-num">04</div>
          <span className="how-step-icon">✅</span>
          <div className="how-step-title">Delivered & Confirmed</div>
          <p className="how-step-desc">Photo proof, digital signature, GPS confirmation — sent instantly to sender and recipient.</p>
        </div>
      </div>
    </section>
  );
}
