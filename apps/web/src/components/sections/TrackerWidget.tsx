'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

export function TrackerWidget() {
  const [trackingId, setTrackingId] = useState('');
  const [trackingData, setTrackingData] = useState<any | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTrack = async () => {
    if (!trackingId) return;
    setLoading(true);
    setError('');

    try {
      const { data } = await api.get(`/track/${trackingId}`);
      if (data.success) {
        setTrackingData(data.data);
      } else {
        setError('Tracking ID not found. Please check and try again.');
        setTrackingData(null);
      }
    } catch (err) {
      setError('Tracking ID not found. Please check and try again.');
      setTrackingData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="track" className="tracker-sec sec-alt">
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
                <input
                  className="t-inp"
                  placeholder="e.g. DD-2024-887741"
                  type="text"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                />
                <button
                  className="t-btn"
                  onClick={handleTrack}
                  disabled={loading}
                  style={{ opacity: loading ? 0.6 : 1 }}
                >
                  {loading ? 'Searching...' : 'Track →'}
                </button>
              </div>
              {error && <p className="text-red-500 text-xs mt-2 ml-4">{error}</p>}
            </div>

            {trackingData && (
              <>
                <div className="eta-wrap">
                  <div className="eta-top">
                    <span className="eta-label">Journey Progress</span>
                    <span className="eta-pct">{trackingData.progress}% Complete</span>
                  </div>
                  <div className="eta-bar">
                    <div className="eta-fill" style={{ width: `${trackingData.progress}%` }}></div>
                  </div>
                </div>

                <div className="timeline">
                  {trackingData.events.map((event: any, idx: number) => (
                    <div key={idx} className={`tl-item tl-${event.type}`}>
                      <div className="tl-line-col">
                        <div className="tl-ico">{event.icon}</div>
                        {idx !== trackingData.events.length - 1 && <div className="tl-vline"></div>}
                      </div>
                      <div className="tl-content">
                        <div className="tl-title">{event.status}</div>
                        <div className="tl-detail">{event.location}</div>
                        <div className="tl-time">{event.timestamp}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {!trackingData && !loading && !error && (
              <div className="text-center py-12 opacity-30">
                <p className="text-sm italic">Enter your tracking number to see live updates</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
