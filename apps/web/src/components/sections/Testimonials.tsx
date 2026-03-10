'use client';

export function Testimonials() {
  return (
    <section id="about" className="sec sec-alt">
      <div className="sec-eye">Customer Stories</div>
      <h2 className="sec-h reveal">12,000+ BUSINESSES<br /><em>CAN'T BE WRONG</em></h2>
      <div className="testi-grid">
        <div className="tcard reveal">
          <div className="tcard-stars"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>
          <p className="tcard-quote">Switched 8 months ago — deliveries that took 3 days now arrive next day. Our return rate dropped 22% purely because of delivery quality.</p>
          <div className="tcard-author">
            <div className="tcard-av">SJ</div>
            <div>
              <div className="tcard-name">Sarah Johnson</div>
              <div className="tcard-role">Operations Director</div>
              <div className="tcard-company">Bloom & Co. London</div>
            </div>
          </div>
        </div>
        <div className="tcard reveal reveal-delay-1">
          <div className="tcard-stars"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>
          <p className="tcard-quote">The API integration took our dev 90 minutes. Now 100% of our fulfilment is automated — labels, tracking, notifications. Dash is the backbone of our logistics stack.</p>
          <div className="tcard-author">
            <div className="tcard-av">MT</div>
            <div>
              <div className="tcard-name">Marcus Taylor</div>
              <div className="tcard-role">CTO</div>
              <div className="tcard-company">TradeFlow UK</div>
            </div>
          </div>
        </div>
        <div className="tcard reveal reveal-delay-2">
          <div className="tcard-stars"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>
          <p className="tcard-quote">We ship luxury goods across Europe. Temperature control, insurance, white-glove handling — Dash does it all. Our clients are consistently impressed.</p>
          <div className="tcard-author">
            <div className="tcard-av">AL</div>
            <div>
              <div className="tcard-name">Amara Lewis</div>
              <div className="tcard-role">Founder</div>
              <div className="tcard-company">Luxe Box London</div>
            </div>
          </div>
        </div>
      </div>
      <div className="logos-row">
        <div className="logo-item">SHOPIFY</div>
        <div className="logo-item">WOOCOMMERCE</div>
        <div className="logo-item">AMAZON</div>
        <div className="logo-item">MAGENTO</div>
        <div className="logo-item">BIGCOMMERCE</div>
        <div className="logo-item">EBAY</div>
      </div>
    </section>
  );
}
