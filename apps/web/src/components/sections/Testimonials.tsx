'use client';

import useSWR from 'swr';
import { fetcher } from '@/lib/api';

interface Testimonial {
  id: string;
  author_name: string;
  author_role: string;
  company: string;
  avatar_initials: string;
  quote: string;
  rating: number;
}

export function Testimonials() {
  const { data: testimonials, error } = useSWR('/testimonials', fetcher);

  return (
    <section id="about" className="sec sec-alt">
      <div className="sec-eye">Customer Stories</div>
      <h2 className="sec-h reveal">12,000+ BUSINESSES<br /><em>CAN'T BE WRONG</em></h2>
      <div className="testi-grid">
        {testimonials?.map((t: Testimonial, index: number) => (
          <div key={t.id} className={`tcard reveal ${index > 0 ? `reveal-delay-${index}` : ''}`}>
            <div className="tcard-stars">
              {[...Array(t.rating)].map((_, i) => <span key={i}>★</span>)}
            </div>
            <p className="tcard-quote">{t.quote}</p>
            <div className="tcard-author">
              <div className="tcard-av">{t.avatar_initials || t.author_name.substring(0, 2).toUpperCase()}</div>
              <div>
                <div className="tcard-name">{t.author_name}</div>
                <div className="tcard-role">{t.author_role}</div>
                <div className="tcard-company">{t.company}</div>
              </div>
            </div>
          </div>
        ))}
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
