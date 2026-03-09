import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <div className="footer-top">
        <div>
          <span className="f-logo">DASH DELIVERY</span>
          <p className="f-desc">UK & Europe's fastest growing courier. Built for businesses that demand speed, reliability, and full transparency on every shipment.</p>
          <div className="f-contact">
            <div className="f-contact-item"><span>📞</span> 0800 DASH 247</div>
            <div className="f-contact-item"><span>✉️</span> hello@dashdelivery.co.uk</div>
            <div className="f-contact-item"><span>📍</span> 12 Courier Lane, London EC1A 1BB</div>
            <div className="f-contact-item">
              <span style={{ color: "#22c55e" }}>●</span>&nbsp;
              <span className="font-[family-name:var(--font-syne)] text-[11px] font-bold text-[#22c55e]">All systems operational</span>
            </div>
          </div>
        </div>
        <div>
          <div className="f-col-head">Services</div>
          <div className="f-links">
            <Link href="#">Same-Day Express</Link>
            <Link href="#">Next-Day UK</Link>
            <Link href="#">European Delivery</Link>
            <Link href="#">Freight & Pallets</Link>
            <Link href="#">Cold Chain</Link>
            <Link href="#">Returns Portal</Link>
          </div>
        </div>
        <div>
          <div className="f-col-head">Business</div>
          <div className="f-links">
            <Link href="#">Business Accounts</Link>
            <Link href="#">API Integration</Link>
            <Link href="#">Shopify Plugin</Link>
            <Link href="#">WooCommerce</Link>
            <Link href="#">Volume Pricing</Link>
            <Link href="#">White Label</Link>
          </div>
        </div>
        <div>
          <div className="f-col-head">Company</div>
          <div className="f-links">
            <Link href="#">About Us</Link>
            <Link href="#">Coverage Map</Link>
            <Link href="#">Sustainability</Link>
            <Link href="#">Careers</Link>
            <Link href="#">Press</Link>
            <Link href="#">Investors</Link>
          </div>
        </div>
        <div>
          <div className="f-col-head">Support</div>
          <div className="f-links">
            <Link href="#">Track a Parcel</Link>
            <Link href="#">Help Centre</Link>
            <Link href="#">Claims</Link>
            <Link href="#">Report an Issue</Link>
            <Link href="#">Terms of Service</Link>
            <Link href="#">Privacy Policy</Link>
          </div>
        </div>
      </div>
      <div className="footer-mid">
        <div className="ftrust">🔒 SSL Secured</div>
        <div className="ftrust">🛡️ ICO Registered</div>
        <div className="ftrust">🏆 Which? Trusted Trader 2024</div>
        <div className="ftrust">♻️ Carbon Neutral Certified</div>
        <div className="ftrust">💳 PCI DSS Compliant</div>
        <div className="ftrust">🇬🇧 UK Registered Company</div>
      </div>
      <div className="footer-bot">
        <div className="f-copy">© 2024 Dash Delivery Ltd · Registered in England & Wales No. 09847261 · All rights reserved</div>
        <div className="f-social">
          <Link className="f-soc-btn" href="#">𝕏</Link>
          <Link className="f-soc-btn" href="#">in</Link>
          <Link className="f-soc-btn" href="#">f</Link>
          <Link className="f-soc-btn" href="#">▶</Link>
          <Link className="f-soc-btn" href="#">📸</Link>
        </div>
      </div>
    </footer>
  );
}
