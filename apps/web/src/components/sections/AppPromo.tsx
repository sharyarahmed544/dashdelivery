'use client';

export function AppPromo() {
  return (
    <section className="sec" style={{ background: 'var(--bg)' }}>
      <div className="app-inner">
        <div className="reveal">
          <div className="sec-eye">Dash App</div>
          <h2 className="sec-h">MANAGE EVERY<br />DELIVERY IN <em>YOUR POCKET</em></h2>
          <p className="sec-sub">Book, track, manage returns, and message your account manager — all from the Dash app. Rated 4.9★ on iOS & Android.</p>
          <div className="app-badges">
            <div className="app-badge">
              <span className="app-badge-icon">🍎</span>
              <div>
                <div className="app-badge-sub">Download on the</div>
                <div className="app-badge-main">App Store</div>
              </div>
            </div>
            <div className="app-badge">
              <span className="app-badge-icon">🤖</span>
              <div>
                <div className="app-badge-sub">Get it on</div>
                <div className="app-badge-main">Google Play</div>
              </div>
            </div>
          </div>
        </div>
        <div className="app-phones reveal reveal-delay-1">
          <div className="phone-card phone-card-1">
            <div className="phone-screen-top">
              <div className="phone-screen-dot psd-r"></div>
              <div className="phone-screen-dot psd-y"></div>
              <div className="phone-screen-dot psd-g"></div>
            </div>
            <div className="phone-route">📦 DD-887741</div>
            <div className="phone-city">Manchester → Berlin</div>
            <div className="phone-progress"><div className="phone-progress-fill" style={{ width: '68%' }}></div></div>
            <div className="phone-eta">ETA: Today 16:30</div>
          </div>
          <div className="phone-card phone-card-2">
            <div className="phone-screen-top">
              <div className="phone-screen-dot psd-r"></div>
              <div className="phone-screen-dot psd-y"></div>
              <div className="phone-screen-dot psd-g"></div>
            </div>
            <div className="phone-route">✅ DD-887700</div>
            <div className="phone-city">London → Paris</div>
            <div className="phone-progress"><div className="phone-progress-fill" style={{ width: '100%' }}></div></div>
            <div className="phone-eta" style={{ color: '#22c55e' }}>Delivered 09:47</div>
          </div>
          <div className="phone-card phone-card-3">
            <div className="phone-screen-top">
              <div className="phone-screen-dot psd-r"></div>
              <div className="phone-screen-dot psd-y"></div>
              <div className="phone-screen-dot psd-g"></div>
            </div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: 800, background: 'var(--og2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', margin: '6px 0 3px' }}>
              £4.49
            </div>
            <div className="phone-city">Next-day anywhere UK</div>
            <div style={{ marginTop: '10px', background: 'var(--og)', borderRadius: '6px', padding: '7px', textAlign: 'center', fontFamily: 'Syne, sans-serif', fontSize: '9px', fontWeight: 700, color: '#fff', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              BOOK NOW
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
