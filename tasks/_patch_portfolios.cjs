'use strict';
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'index.html');
let src = fs.readFileSync(FILE, 'utf8').replace(/\r\n/g, '\n');

// ─── 1. CSS ───────────────────────────────────────────────────────────────────
const CSS = `
    /* ── PORTFOLIOS ── */
    .portfolio-header { margin-bottom: 2rem; }

    .portfolio-heading {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(1.9rem, 4vw, 3rem);
      font-weight: 300;
      color: var(--bright);
      line-height: 1.15;
      margin-bottom: 0.9rem;
    }

    .portfolio-intro {
      max-width: 680px;
      color: var(--text);
      line-height: 1.8;
      font-weight: 300;
      font-size: 0.95rem;
    }

    .portfolio-tabs {
      display: flex;
      gap: 0.5rem;
      margin: 2rem 0 1.5rem;
      flex-wrap: wrap;
    }

    .portfolio-tab {
      font-family: 'DM Mono', monospace;
      font-size: 0.68rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      background: var(--card);
      border: 1px solid var(--border);
      color: var(--dim);
      padding: 0.6rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      transition: color 0.15s, border-color 0.15s, background 0.15s;
    }

    .portfolio-tab:hover { color: var(--blue); border-color: var(--blue3); }

    .portfolio-tab.active {
      color: var(--blue);
      border-color: var(--blue2);
      background: #131f32;
    }

    .portfolio-summary {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .portfolio-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 9px;
      padding: 1.1rem 1.2rem;
    }

    .portfolio-card-label {
      font-family: 'DM Mono', monospace;
      font-size: 0.6rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--dim);
      margin-bottom: 0.45rem;
    }

    .portfolio-card-value {
      font-family: 'DM Mono', monospace;
      font-size: 1.35rem;
      color: var(--bright);
      font-weight: 500;
      letter-spacing: -0.02em;
    }

    .portfolio-card-sub {
      font-size: 0.72rem;
      color: var(--text);
      margin-top: 0.2rem;
    }

    .portfolio-card-value.gold { color: var(--gold); }

    .portfolio-layout {
      display: grid;
      grid-template-columns: 1fr 200px;
      gap: 1.5rem;
      align-items: start;
    }

    .portfolio-table-wrap {
      overflow-x: auto;
      border: 1px solid var(--border);
      border-radius: 9px;
      background: var(--card);
    }

    .portfolio-table {
      width: 100%;
      border-collapse: collapse;
      min-width: 520px;
    }

    .portfolio-table th,
    .portfolio-table td {
      padding: 0.78rem 1rem;
      border-bottom: 1px solid var(--border);
      text-align: left;
    }

    .portfolio-table tr:last-child td { border-bottom: none; }

    .portfolio-table th {
      font-family: 'DM Mono', monospace;
      font-size: 0.6rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--blue3);
      background: rgba(10,18,32,0.55);
    }

    .portfolio-table td { font-size: 0.83rem; color: var(--text); }

    .portfolio-table td.pt-company { color: var(--bright); font-weight: 500; }
    .portfolio-table td.pt-ticker {
      font-family: 'DM Mono', monospace;
      font-size: 0.75rem;
      color: var(--blue);
      letter-spacing: 0.04em;
    }
    .portfolio-table td.pt-weight {
      font-family: 'DM Mono', monospace;
      font-size: 0.78rem;
      color: var(--bright);
    }
    .portfolio-table td.pt-score {
      font-family: 'DM Mono', monospace;
      font-size: 0.78rem;
      color: var(--gold);
      font-weight: 500;
    }

    .portfolio-alloc-panel {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 9px;
      padding: 1rem 1.1rem;
    }

    .portfolio-alloc-title {
      font-family: 'DM Mono', monospace;
      font-size: 0.6rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--blue3);
      margin-bottom: 0.8rem;
    }

    .alloc-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.36rem 0;
      border-bottom: 1px solid rgba(15,30,48,0.7);
    }

    .alloc-row:last-child { border-bottom: none; }

    .alloc-name {
      font-size: 0.7rem;
      color: var(--text);
      flex: 1;
      min-width: 0;
    }

    .alloc-bar-wrap {
      width: 60px;
      height: 3px;
      background: var(--border);
      border-radius: 2px;
      flex-shrink: 0;
      overflow: hidden;
    }

    .alloc-bar {
      height: 100%;
      background: var(--blue2);
      border-radius: 2px;
    }

    .alloc-pct {
      font-family: 'DM Mono', monospace;
      font-size: 0.65rem;
      color: var(--dim);
      width: 28px;
      text-align: right;
      flex-shrink: 0;
    }

    .portfolio-disclaimer {
      margin-top: 1.5rem;
      font-size: 0.7rem;
      color: var(--dim);
      line-height: 1.7;
      border-top: 1px solid var(--border);
      padding-top: 1rem;
    }

    @media (max-width: 900px) {
      .portfolio-summary { grid-template-columns: repeat(2, 1fr); }
      .portfolio-layout { grid-template-columns: 1fr; }
    }

    @media (max-width: 600px) {
      .portfolio-summary { grid-template-columns: repeat(2, 1fr); gap: 0.6rem; }
      .portfolio-card { padding: 0.85rem 0.9rem; }
      .portfolio-card-value { font-size: 1.05rem; }
      .portfolio-tabs { gap: 0.35rem; }
      .portfolio-tab { font-size: 0.62rem; padding: 0.55rem 0.8rem; }
    }
`;

const CSS_ANCHOR = '\n  </style>\n</head>';
const CSS_REPLACE = CSS + '\n  </style>\n</head>';
if (!src.includes(CSS_ANCHOR)) { console.error('CSS anchor not found'); process.exit(1); }
src = src.replace(CSS_ANCHOR, CSS_REPLACE);
console.log('✓ CSS injected');

// ─── 2. Nav desktop ───────────────────────────────────────────────────────────
const NAV_D_OLD = '    <li><a href="#contact">Contact</a></li>\n  </ul>';
const NAV_D_NEW = '    <li><a href="#portfolios">Portfolios</a></li>\n    <li><a href="#contact">Contact</a></li>\n  </ul>';
if (!src.includes(NAV_D_OLD)) { console.error('Desktop nav anchor not found'); process.exit(1); }
src = src.replace(NAV_D_OLD, NAV_D_NEW);
console.log('✓ Desktop nav updated');

// ─── 3. Nav mobile ────────────────────────────────────────────────────────────
const NAV_M_OLD = '  <a href="#contact" onclick="closeMobileNav()">Contact</a>\n</div>';
const NAV_M_NEW = '  <a href="#portfolios" onclick="closeMobileNav()">Portfolios</a>\n  <a href="#contact" onclick="closeMobileNav()">Contact</a>\n</div>';
if (!src.includes(NAV_M_OLD)) { console.error('Mobile nav anchor not found'); process.exit(1); }
src = src.replace(NAV_M_OLD, NAV_M_NEW);
console.log('✓ Mobile nav updated');

// ─── 4. Portfolio HTML section ────────────────────────────────────────────────
const SECTION_HTML = `
<div class="section-rule"></div>

<!-- PORTFOLIOS -->
<section id="portfolios" class="section-wrap">
  <div class="section-container" style="max-width:1200px">
    <div class="section-eyebrow">Portfolios</div>
    <div class="portfolio-header">
      <h2 class="portfolio-heading">Leadership-weighted views.</h2>
      <p class="portfolio-intro">Portfolio compositions scored on management quality, strategic clarity, and capital discipline — applied across the Magnificent Seven and S&amp;P 500 universe.</p>
    </div>

    <div class="portfolio-tabs" role="tablist" aria-label="Portfolio views">
      <button class="portfolio-tab active" type="button" data-ptab="mag7" aria-selected="true">Mag7</button>
      <button class="portfolio-tab" type="button" data-ptab="sp500" aria-selected="false">S&amp;P 500</button>
    </div>

    <div class="portfolio-summary" id="portfolioSummary"></div>

    <div class="portfolio-layout">
      <div class="portfolio-table-wrap">
        <table class="portfolio-table" aria-label="Portfolio holdings">
          <thead>
            <tr>
              <th>Company</th>
              <th>Ticker</th>
              <th>CEO</th>
              <th>Sector</th>
              <th>Weight</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody id="portfolioRows"></tbody>
        </table>
      </div>

      <div class="portfolio-alloc-panel">
        <div class="portfolio-alloc-title">Sector Allocation</div>
        <div id="portfolioAlloc"></div>
      </div>
    </div>

    <p class="portfolio-disclaimer">For illustration purposes only. Not investment advice. Holdings and weights reflect approximate market-cap composition and are subject to change. BAM scores represent internal management quality assessments.</p>
  </div>
</section>
`;

const HTML_OLD = '</section>\n\n<div class="section-rule"></div>\n\n<!-- CONTACT -->';
const HTML_NEW = '</section>\n' + SECTION_HTML + '\n<div class="section-rule"></div>\n\n<!-- CONTACT -->';
if (!src.includes(HTML_OLD)) { console.error('HTML anchor not found'); process.exit(1); }
src = src.replace(HTML_OLD, HTML_NEW);
console.log('✓ Portfolio HTML section inserted');

// ─── 5. Portfolio JS ──────────────────────────────────────────────────────────
const PORTFOLIO_JS = `
/* ── Portfolio section ── */
(function () {
  var portfolios = {
    mag7: {
      summary: { holdings: 7, avgScore: '8.4', topSector: 'Technology', topHolding: 'NVDA' },
      sectors: [
        { name: 'Technology', pct: 64 },
        { name: 'Consumer Disc.', pct: 22 },
        { name: 'Communication', pct: 14 }
      ],
      holdings: [
        { company: 'NVIDIA Corp.',     ticker: 'NVDA',  ceo: 'Jensen Huang',      sector: 'Technology',    weight: '20.6%', score: '9.4' },
        { company: 'Microsoft Corp.',  ticker: 'MSFT',  ceo: 'Satya Nadella',     sector: 'Technology',    weight: '22.4%', score: '9.1' },
        { company: 'Apple Inc.',       ticker: 'AAPL',  ceo: 'Tim Cook',          sector: 'Technology',    weight: '21.8%', score: '8.7' },
        { company: 'Amazon.com Inc.',  ticker: 'AMZN',  ceo: 'Andy Jassy',        sector: 'Consumer Disc.',weight: '11.9%', score: '8.5' },
        { company: 'Alphabet Inc.',    ticker: 'GOOGL', ceo: 'Sundar Pichai',     sector: 'Communication', weight: '12.3%', score: '8.2' },
        { company: 'Meta Platforms',   ticker: 'META',  ceo: 'Mark Zuckerberg',   sector: 'Communication', weight: '8.1%',  score: '7.8' },
        { company: 'Tesla Inc.',       ticker: 'TSLA',  ceo: 'Elon Musk',         sector: 'Consumer Disc.',weight: '3.9%',  score: '6.3' }
      ]
    },
    sp500: {
      summary: { holdings: 503, avgScore: '7.2', topSector: 'Info Tech', topHolding: 'MSFT' },
      sectors: [
        { name: 'Info Technology', pct: 32 },
        { name: 'Financials',      pct: 13 },
        { name: 'Health Care',     pct: 12 },
        { name: 'Consumer Disc.',  pct: 11 },
        { name: 'Industrials',     pct: 9  },
        { name: 'Communication',   pct: 9  },
        { name: 'Consumer Staples',pct: 6  },
        { name: 'Energy',          pct: 4  },
        { name: 'Other',           pct: 4  }
      ],
      holdings: [
        { company: 'Microsoft Corp.',      ticker: 'MSFT',  ceo: 'Satya Nadella',   sector: 'Technology',    weight: '7.1%', score: '9.1' },
        { company: 'Apple Inc.',           ticker: 'AAPL',  ceo: 'Tim Cook',        sector: 'Technology',    weight: '6.8%', score: '8.7' },
        { company: 'NVIDIA Corp.',         ticker: 'NVDA',  ceo: 'Jensen Huang',    sector: 'Technology',    weight: '6.5%', score: '9.4' },
        { company: 'Amazon.com Inc.',      ticker: 'AMZN',  ceo: 'Andy Jassy',      sector: 'Consumer Disc.',weight: '3.8%', score: '8.5' },
        { company: 'Meta Platforms',       ticker: 'META',  ceo: 'Mark Zuckerberg', sector: 'Communication', weight: '2.8%', score: '7.8' },
        { company: 'Alphabet Inc.',        ticker: 'GOOGL', ceo: 'Sundar Pichai',   sector: 'Communication', weight: '2.6%', score: '8.2' },
        { company: 'Berkshire Hathaway',   ticker: 'BRK.B', ceo: 'Greg Abel',       sector: 'Financials',    weight: '1.7%', score: '7.5' },
        { company: 'Tesla Inc.',           ticker: 'TSLA',  ceo: 'Elon Musk',       sector: 'Consumer Disc.',weight: '1.6%', score: '6.3' },
        { company: 'Eli Lilly & Co.',      ticker: 'LLY',   ceo: 'David Ricks',     sector: 'Health Care',   weight: '1.4%', score: '7.9' },
        { company: 'JPMorgan Chase',       ticker: 'JPM',   ceo: 'Jamie Dimon',     sector: 'Financials',    weight: '1.3%', score: '8.6' }
      ]
    }
  };

  function card(label, value, sub, cls) {
    return '<div class="portfolio-card">' +
      '<div class="portfolio-card-label">' + label + '</div>' +
      '<div class="portfolio-card-value' + (cls ? ' ' + cls : '') + '">' + value + '</div>' +
      (sub ? '<div class="portfolio-card-sub">' + sub + '</div>' : '') +
      '</div>';
  }

  function render(key) {
    var d = portfolios[key];
    var s = d.summary;

    var sumEl = document.getElementById('portfolioSummary');
    if (sumEl) sumEl.innerHTML =
      card('Holdings', s.holdings, '') +
      card('Avg Score', s.avgScore, '/10', 'gold') +
      card('Top Sector', s.topSector, '') +
      card('Top Holding', s.topHolding, '');

    var rowEl = document.getElementById('portfolioRows');
    if (rowEl) rowEl.innerHTML = d.holdings.map(function (h) {
      return '<tr>' +
        '<td class="pt-company">' + h.company + '</td>' +
        '<td class="pt-ticker">' + h.ticker + '</td>' +
        '<td>' + h.ceo + '</td>' +
        '<td>' + h.sector + '</td>' +
        '<td class="pt-weight">' + h.weight + '</td>' +
        '<td class="pt-score">' + h.score + '</td>' +
        '</tr>';
    }).join('');

    var allocEl = document.getElementById('portfolioAlloc');
    if (allocEl) allocEl.innerHTML = d.sectors.map(function (sec) {
      return '<div class="alloc-row">' +
        '<div class="alloc-name">' + sec.name + '</div>' +
        '<div class="alloc-bar-wrap"><div class="alloc-bar" style="width:' + sec.pct + '%"></div></div>' +
        '<div class="alloc-pct">' + sec.pct + '%</div>' +
        '</div>';
    }).join('');
  }

  function initPortfolio() {
    var active = 'mag7';
    var tabs = document.querySelectorAll('.portfolio-tab');
    tabs.forEach(function (btn) {
      btn.addEventListener('click', function () {
        active = btn.getAttribute('data-ptab');
        tabs.forEach(function (b) { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        render(active);
      });
    });
    render(active);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortfolio);
  } else {
    initPortfolio();
  }
}());

`;

const JS_OLD = '\n/* Init */\ngoTo(0);';
const JS_NEW = '\n' + PORTFOLIO_JS + '/* Init */\ngoTo(0);';
if (!src.includes(JS_OLD)) { console.error('JS anchor not found'); process.exit(1); }
src = src.replace(JS_OLD, JS_NEW);
console.log('✓ Portfolio JS injected');

// ─── Write ────────────────────────────────────────────────────────────────────
fs.writeFileSync(FILE, src, 'utf8');
console.log('✓ Written. Lines:', src.split('\n').length);
