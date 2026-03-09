'use client';

export function Coverage() {
  return (
    <section style={{ background: 'var(--bg)', borderTop: '1px solid var(--border)' }}>
      <div className="coverage-inner">
        <div className="reveal">
          <div className="sec-eye">Coverage</div>
          <h2 className="sec-h">ACROSS<br /><em>ALL OF EUROPE</em></h2>
          <p className="sec-sub">From the Scottish Highlands to the tip of Sicily — our network reaches where others don't dare.</p>
          <div className="cov-stats">
            <div className="cov-stat">
              <div className="cov-stat-n">28</div>
              <div className="cov-stat-l">Countries</div>
            </div>
            <div className="cov-stat">
              <div className="cov-stat-n">340+</div>
              <div className="cov-stat-l">Depot Locations</div>
            </div>
            <div className="cov-stat">
              <div className="cov-stat-n">2,800+</div>
              <div className="cov-stat-l">Delivery Drivers</div>
            </div>
            <div className="cov-stat">
              <div className="cov-stat-n">96%</div>
              <div className="cov-stat-l">UK Postcodes</div>
            </div>
          </div>
        </div>
        <div className="eu-map-wrap reveal reveal-delay-1">
          <svg width="100%" height="320" viewBox="0 0 480 320" xmlns="http://www.w3.org/2000/svg">
            <path d="M95,45 Q100,35 110,40 Q120,30 125,40 Q130,50 120,60 Q115,70 105,65 Q95,60 95,45Z"/>
            <path d="M90,68 Q95,62 102,68 Q108,80 100,88 Q92,92 88,82 Q84,72 90,68Z"/>
            <path d="M100,100 Q115,92 135,95 Q150,98 155,115 Q158,130 145,138 Q130,145 115,135 Q100,125 100,110Z"/>
            <path d="M85,145 Q105,140 130,145 Q148,148 150,165 Q152,182 135,188 Q112,192 95,180 Q78,168 78,155Z"/>
            <path d="M160,85 Q175,78 190,82 Q205,86 207,100 Q208,115 195,120 Q180,125 168,115 Q155,105 160,85Z"/>
            <path d="M140,78 Q150,72 158,78 Q163,85 155,92 Q146,96 138,88 Q132,82 140,78Z"/>
            <path d="M210,78 Q228,72 245,78 Q258,84 258,98 Q258,112 242,116 Q226,120 212,110 Q200,100 210,78Z"/>
            <path d="M162,135 Q175,128 185,135 Q195,145 192,162 Q188,178 178,188 Q168,196 162,182 Q158,168 158,150Z"/>
            <path d="M160,20 Q175,10 190,15 Q200,22 195,38 Q188,48 175,45 Q162,40 160,28Z"/>
            <path d="M195,12 Q210,5 220,12 Q228,20 222,34 Q215,44 205,38 Q196,32 195,20Z"/>
            <line x1="0" y1="100" x2="480" y2="100" stroke="rgba(255,107,0,0.05)" strokeWidth="1"/>
            <line x1="0" y1="160" x2="480" y2="160" stroke="rgba(255,107,0,0.05)" strokeWidth="1"/>
            <line x1="100" y1="0" x2="100" y2="320" stroke="rgba(255,107,0,0.05)" strokeWidth="1"/>
            <line x1="200" y1="0" x2="200" y2="320" stroke="rgba(255,107,0,0.05)" strokeWidth="1"/>
            <line x1="300" y1="0" x2="300" y2="320" stroke="rgba(255,107,0,0.05)" strokeWidth="1"/>
          </svg>
          <div className="eu-pin" style={{ left: '22%', top: '52%' }}>
            <div className="eu-pin-dot hub"></div>
            <div className="eu-pin-label">London</div>
          </div>
          <div className="eu-pin" style={{ left: '30%', top: '68%' }}>
            <div className="eu-pin-dot"></div>
            <div className="eu-pin-label">Paris</div>
          </div>
          <div className="eu-pin" style={{ left: '33%', top: '44%' }}>
            <div className="eu-pin-dot"></div>
            <div className="eu-pin-label">Amsterdam</div>
          </div>
          <div className="eu-pin" style={{ left: '48%', top: '40%' }}>
            <div className="eu-pin-dot hub"></div>
            <div className="eu-pin-label">Berlin</div>
          </div>
          <div className="eu-pin" style={{ left: '21%', top: '80%' }}>
            <div className="eu-pin-dot"></div>
            <div className="eu-pin-label">Madrid</div>
          </div>
          <div className="eu-pin" style={{ left: '43%', top: '76%' }}>
            <div className="eu-pin-dot"></div>
            <div className="eu-pin-label">Rome</div>
          </div>
          <div className="eu-pin" style={{ left: '58%', top: '36%' }}>
            <div className="eu-pin-dot hub"></div>
            <div className="eu-pin-label">Warsaw</div>
          </div>
        </div>
      </div>
    </section>
  );
}
