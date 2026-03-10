'use client';

import useSWR from 'swr';
import { fetcher } from '@/lib/api';

interface Service {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  price_from: number;
  duration: string;
  sort_order: number;
}

export function ServicesBento() {
  const { data: services, error, isLoading } = useSWR('/services', fetcher);

  if (isLoading) return <div className="sec-sub">Loading services...</div>;
  if (error) return <div className="sec-sub">Failed to load services.</div>;

  return (
    <section id="services" className="sec">
      <div className="sec-eye">Our Services</div>
      <h2 className="sec-h reveal">
        THE COMPLETE<br />DELIVERY <em>ECOSYSTEM</em>
      </h2>
      <p className="sec-sub reveal">
        Every solution your business needs — from urgent same-day parcels to complex cross-border freight.
      </p>
      <div className="bento">
        {services?.map((service: Service, index: number) => {
          // Logic for grid layout classes based on index or slug
          let cardClass = "bcard reveal";
          if (index === 0) cardClass += " bc-feat bc1";
          else if (index === 1) cardClass += " bc2 reveal-delay-1";
          else if (index === 2) cardClass += " bc4"; // Skipping 3 for the price card placeholder or specific logic
          else if (index === 3) cardClass += " bc5 reveal-delay-1";
          else if (index === 4) cardClass += " bc6 reveal-delay-2";
          else if (index === 5) cardClass += " bc-big";

          return (
            <div key={service.id} className={cardClass}>
              <span className="bcard-num">0{index + 1}</span>
              <span className="bcard-icon">{service.icon}</span>
              <div className="bcard-title">{service.name}</div>
              <p className="bcard-desc">{service.description}</p>
              <span className="bcard-pill">
                <span className="dot"></span> From £{service.price_from} | {service.duration}
              </span>
            </div>
          );
        })}
        
        {/* Special static-ish cards if needed, but per brief everything should be dynamic */}
        <div className="bcard bc3 bc-price reveal reveal-delay-2">
          <div className="price-from">Starting From</div>
          <div className="price-big">£4<span style={{ fontSize: '.55em' }}>.49</span></div>
          <p className="bcard-desc">Standard next-day delivery anywhere in the UK</p>
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
