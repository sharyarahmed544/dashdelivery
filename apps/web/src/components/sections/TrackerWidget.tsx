'use client';

import { useState } from 'react';

export function TrackerWidget() {
  const [btnText, setBtnText] = useState('Track →');
  const [btnOpacity, setBtnOpacity] = useState(1);

  const handleTrack = () => {
    setBtnText('Searching...');
    setBtnOpacity(0.65);
    setTimeout(() => {
      setBtnText('Track →');
      setBtnOpacity(1);
    }, 1500);
  };

  return (
    <section className="tracker-sec sec-alt">
      <div className="tracker-wrap">
        <div>
          <div className="sec-eye">Real-Time Tracking</div>
          <h2 className="sec-h reveal">
            KNOW WHERE YOUR<br />PARCEL IS <em>RIGHT NOW</em>
          </h2>
          <p className="sec-sub reveal">
            No vague "on the way" messages. Live GPS every 90 seconds, proactive SMS alerts, and a shareable tracking page for your recipients.
          </p>
          <div className="feat-list reveal">
            <div className="feat-item">
              <div className="feat-ico">📍</div>
              <div>
                <div className="feat-title">GPS Updates Every 90 Seconds</div>
                <div className="feat-desc">See your driver move on the map in near real-time — always know exactly where your parcel is.</div>
              </div>
            </div>
            <div className="feat-item">
              <div className="feat-ico">📱</div>
              <div>
                <div className="feat-title">SMS & Email Alerts</div>
                <div className="feat-desc">Automatic notifications at every stage — pickup, hub arrival, out for delivery, and delivered.</div>
              </div>
            </div>
            <div className="feat-item">
              <div className="feat-ico">🔗</div>
              <div>
                <div className="feat-title">Shareable Tracking Page</div>
                <div className="feat-desc">Send recipients a live branded link so they know exactly when to expect their delivery.</div>
              </div>
            </div>
            <div className="feat-item">
              <div className="feat-ico">📷</div>
              <div>
                <div className="feat-title">Photo Proof of Delivery</div>
                <div className="feat-desc">Digital signature, delivery photo, and GPS-stamped confirmation sent instantly to sender and recipient.</div>
              </div>
            </div>
          </div>
        </div>
        <div className="reveal reveal-delay-1">
          <div className="tracker-box">
            <div className="tracker-box-head">
              <div className="tracker-box-title">Track Your Parcel</div>
              <div className="tracker-box-sub">Enter tracking ID or scan QR code</div>
            </div>
            <div className="t-input-row">
              <div className="t-input-wrap">
                <input className="t-inp" placeholder="e.g. DD-2024-887741" type="text" />
                <button 
                  className="t-btn" 
                  onClick={handleTrack}
                  style={{ opacity: btnOpacity }}
                >
                  {btnText}
                </button>
              </div>
            </div>
            <div className="eta-wrap">
              <div className="eta-top">
                <span className="eta-label">Journey Progress</span>
                <span className="eta-pct">68% Complete</span>
              </div>
              <div className="eta-bar">
                <div className="eta-fill"></div>
              </div>
            </div>
            <div className="timeline">
              <div className="tl-item tl-done">
                <div className="tl-line-col"><div className="tl-ico">✅</div><div className="tl-vline"></div></div>
                <div className="tl-content"><div className="tl-title">Collected from Sender</div><div className="tl-detail">Manchester Depot, Unit 4</div><div className="tl-time">Today, 07:32</div></div>
              </div>
              <div className="tl-item tl-done">
                <div className="tl-line-col"><div className="tl-ico">✅</div><div className="tl-vline"></div></div>
                <div className="tl-content"><div className="tl-title">Arrived at Sorting Hub</div><div className="tl-detail">Birmingham National Hub</div><div className="tl-time">Today, 09:15</div></div>
              </div>
              <div className="tl-item tl-done">
                <div className="tl-line-col"><div className="tl-ico">✅</div><div className="tl-vline"></div></div>
                <div className="tl-content"><div className="tl-title">Customs Cleared</div><div className="tl-detail">Electronic clearance — no delays</div><div className="tl-time">Today, 10:48</div></div>
              </div>
              <div className="tl-item tl-active">
                <div className="tl-line-col"><div className="tl-ico">🚚</div><div className="tl-vline"></div></div>
                <div className="tl-content"><div className="tl-title">Out for Delivery — Driver: James T.</div><div className="tl-detail">2.4km away · Van: EK23 DDF</div><div className="tl-time">ETA: 14:30 — 2 stops ahead</div></div>
              </div>
              <div className="tl-item tl-pending">
                <div className="tl-line-col"><div className="tl-ico">📦</div></div>
                <div className="tl-content"><div className="tl-title">Delivered & Signed For</div><div className="tl-detail">Awaiting delivery</div><div className="tl-time">Expected 14:30</div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
