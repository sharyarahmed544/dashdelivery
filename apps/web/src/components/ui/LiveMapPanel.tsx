"use client";

import { useEffect, useState } from "react";

export default function LiveMapPanel() {
  const [liveCount, setLiveCount] = useState(847);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount((prev) => prev + Math.floor(Math.random() * 3));
    }, 4200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hero-right reveal opacity-0 animate-[fadeIn_1.2s_.6s_forwards]">
      <div className="map-panel bg-[var(--surface)] border border-[var(--border)] rounded-[18px] overflow-hidden shadow-[var(--shadow-lg)]">
        <div className="map-panel-header flex items-center justify-between px-5 py-[14px] border-b border-[var(--border)] bg-[var(--surface2)]">
          <span className="map-panel-title font-[family-name:var(--font-syne)] text-[11px] font-bold tracking-[2px] uppercase text-[var(--text3)]">Live Delivery Network</span>
          <div className="live-badge flex items-center gap-[6px] font-[family-name:var(--font-syne)] text-[10px] font-bold tracking-[0.5px] text-[#22c55e]">
            <span className="live-dot w-[6px] h-[6px] rounded-full bg-[#22c55e] shadow-[0_0_7px_#22c55e] animate-[blink_1.5s_infinite]"></span>
            <span>{liveCount.toLocaleString()}</span> active
          </div>
        </div>
        
        <div className="map-area relative h-[210px] bg-[var(--bg2)] overflow-hidden">
          <svg className="route-svg absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 520 210">
            <line className="route-line stroke-[rgba(255,107,0,0.18)] stroke-[1px] fill-none [stroke-dasharray:4_4]" x1="115" y1="63" x2="157" y2="93"/>
            <line className="route-line stroke-[rgba(255,107,0,0.18)] stroke-[1px] fill-none [stroke-dasharray:4_4]" x1="157" y1="93" x2="172" y2="52"/>
            <line className="route-line stroke-[rgba(255,107,0,0.18)] stroke-[1px] fill-none [stroke-dasharray:4_4]" x1="157" y1="93" x2="250" y2="59"/>
            <line className="route-line stroke-[rgba(255,107,0,0.18)] stroke-[1px] fill-none [stroke-dasharray:4_4]" x1="250" y1="59" x2="312" y2="52"/>
            <line className="route-line stroke-[rgba(255,107,0,0.18)] stroke-[1px] fill-none [stroke-dasharray:4_4]" x1="115" y1="63" x2="114" y2="126"/>
            <line className="route-line stroke-[rgba(255,107,0,0.18)] stroke-[1px] fill-none [stroke-dasharray:4_4]" x1="250" y1="59" x2="260" y2="118"/>
            <path className="route-line-active stroke-[rgba(255,107,0,0.5)] stroke-[1.5px] fill-none [stroke-dasharray:1000] [stroke-dashoffset:1000] animate-[drawLine_2.5s_ease_forwards_.8s]" d="M115,63 Q136,78 157,93 Q200,77 250,59"/>
          </svg>
          
          <div className="map-dot absolute" style={{ left: "22%", top: "30%" }}>
            <div className="map-dot-inner hub w-[13px] h-[13px] rounded-full bg-[var(--o1)] border-2 border-white animate-[mapPulse_2.5s_infinite]"></div>
            <div className="map-dot-label absolute bottom-[14px] left-1/2 -translate-x-1/2 font-[family-name:var(--font-syne)] text-[8px] font-bold tracking-[0.5px] text-[var(--text3)] whitespace-nowrap">London</div>
          </div>
          <div className="map-dot absolute" style={{ left: "30%", top: "44%" }}>
            <div className="map-dot-inner w-[9px] h-[9px] rounded-full bg-[var(--o2)] animate-[mapPulse_2.5s_infinite]"></div>
            <div className="map-dot-label absolute bottom-[14px] left-1/2 -translate-x-1/2 font-[family-name:var(--font-syne)] text-[8px] font-bold tracking-[0.5px] text-[var(--text3)] whitespace-nowrap">Paris</div>
          </div>
          <div className="map-dot absolute" style={{ left: "33%", top: "25%" }}>
            <div className="map-dot-inner w-[9px] h-[9px] rounded-full bg-[var(--o2)] animate-[mapPulse_2.5s_infinite]"></div>
            <div className="map-dot-label absolute bottom-[14px] left-1/2 -translate-x-1/2 font-[family-name:var(--font-syne)] text-[8px] font-bold tracking-[0.5px] text-[var(--text3)] whitespace-nowrap">Amsterdam</div>
          </div>
          <div className="map-dot absolute" style={{ left: "48%", top: "25%" }}>
            <div className="map-dot-inner w-[9px] h-[9px] rounded-full bg-[var(--o2)] animate-[mapPulse_2.5s_infinite]"></div>
            <div className="map-dot-label absolute bottom-[14px] left-1/2 -translate-x-1/2 font-[family-name:var(--font-syne)] text-[8px] font-bold tracking-[0.5px] text-[var(--text3)] whitespace-nowrap">Berlin</div>
          </div>
          <div className="map-dot absolute" style={{ left: "22%", top: "60%" }}>
            <div className="map-dot-inner w-[9px] h-[9px] rounded-full bg-[var(--o2)] animate-[mapPulse_2.5s_infinite]"></div>
            <div className="map-dot-label absolute bottom-[14px] left-1/2 -translate-x-1/2 font-[family-name:var(--font-syne)] text-[8px] font-bold tracking-[0.5px] text-[var(--text3)] whitespace-nowrap">Madrid</div>
          </div>
          <div className="map-dot absolute" style={{ left: "50%", top: "56%" }}>
            <div className="map-dot-inner w-[9px] h-[9px] rounded-full bg-[var(--o2)] animate-[mapPulse_2.5s_infinite]"></div>
            <div className="map-dot-label absolute bottom-[14px] left-1/2 -translate-x-1/2 font-[family-name:var(--font-syne)] text-[8px] font-bold tracking-[0.5px] text-[var(--text3)] whitespace-nowrap">Rome</div>
          </div>
          <div className="map-dot absolute" style={{ left: "60%", top: "22%" }}>
            <div className="map-dot-inner hub w-[13px] h-[13px] rounded-full bg-[var(--o1)] border-2 border-white animate-[mapPulse_2.5s_infinite]"></div>
            <div className="map-dot-label absolute bottom-[14px] left-1/2 -translate-x-1/2 font-[family-name:var(--font-syne)] text-[8px] font-bold tracking-[0.5px] text-[var(--text3)] whitespace-nowrap">Warsaw</div>
          </div>
        </div>
        
        <div className="delivery-cards-row grid grid-cols-2 gap-[1px] bg-[var(--border)]">
          {[
            { id: "DD-88742", status: "In Transit", statusClass: "bg-[rgba(255,140,0,0.12)] text-[var(--o3)]", route: "London → Berlin", eta: "ETA: Today, 16:30", progress: "68%" },
            { id: "DD-88743", status: "Delivered ✓", statusClass: "bg-[rgba(34,197,94,0.12)] text-[#16a34a] dark:text-[#22c55e]", route: "Paris → Amsterdam", eta: "Delivered 09:47", progress: "100%" },
            { id: "DD-88750", status: "Pickup", statusClass: "bg-[rgba(59,130,246,0.1)] text-[#3b82f6]", route: "Manchester → Dublin", eta: "Pickup: 14:00", progress: "15%" },
            { id: "DD-88751", status: "In Transit", statusClass: "bg-[rgba(255,140,0,0.12)] text-[var(--o3)]", route: "Madrid → Rome", eta: "ETA: Tomorrow 11:00", progress: "40%" },
          ].map((card, i) => (
            <div key={i} className="del-card bg-[var(--surface)] p-3.5 px-4 transition-colors duration-300 hover:bg-[var(--og-soft)] cursor-none">
              <div className="del-card-top flex items-center justify-between mb-1.5">
                <span className="del-card-id font-[family-name:var(--font-syne)] text-[9px] font-bold tracking-[1px] text-[var(--o3)]">{card.id}</span>
                <span className={`del-card-status text-[8px] font-bold tracking-[0.5px] uppercase px-[7px] py-[2px] rounded-full ${card.statusClass}`}>{card.status}</span>
              </div>
              <div className="del-card-route text-[12px] font-medium text-[var(--text)] mb-0.5">{card.route}</div>
              <div className="del-card-eta text-[10px] text-[var(--text4)]">{card.eta}</div>
              <div className="del-progress h-[2px] bg-[var(--bg3)] rounded-[1px] mt-2 overflow-hidden">
                <div className="del-progress-bar h-full bg-[var(--og2)] rounded-[1px] transition-all duration-[1.2s] ease-in-out" style={{ width: card.progress }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
