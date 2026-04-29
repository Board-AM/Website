'use strict';
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'index.html');
let src = fs.readFileSync(FILE, 'utf8').replace(/\r\n/g, '\n');

function replace(label, oldStr, newStr) {
  if (!src.includes(oldStr)) { console.error('✗ Anchor not found: ' + label); process.exit(1); }
  src = src.replace(oldStr, newStr);
  console.log('✓ ' + label);
}

// ─── 1. Copywriting — HTML labels ─────────────────────────────────────────────
replace('step-name initial',
  '<div class="step-name" id="stepName">Executive Data</div>',
  '<div class="step-name" id="stepName">Company Filings</div>'
);

replace('step-desc initial',
  '<div class="step-desc" id="stepDesc">DEF 14A proxy statements reveal the people, incentives, ownership and governance structures behind the enterprise</div>',
  '<div class="step-desc" id="stepDesc">Sourcing raw data from SEC filings, earnings calls &amp; proxy statements</div>'
);

replace('stage-0 title',
  '<div class="stage-title">Executive<br>Data</div>',
  '<div class="stage-title">Company<br>Filings</div>'
);

replace('stage-1 title',
  '<div class="stage-title">AI<br>Model</div>',
  '<div class="stage-title">Proprietary<br>Model</div>'
);

replace('stage-2 title',
  '<div class="stage-title">Management<br>Scorecards</div>',
  '<div class="stage-title">Scorecards</div>'
);

// ─── 2. Disclaimer ────────────────────────────────────────────────────────────
replace('disclaimer',
  '<div class="disclaimer">For illustration purposes only. Not real investment advice.</div>',
  '<div class="disclaimer">For illustration purposes only. Back test and not real life return.</div>'
);

// ─── 3. Add controls HTML before scroll-hint ──────────────────────────────────
replace('controls HTML insert',
  '      <div class="process-scroll-hint">↓ Scroll to advance through the process</div>',
  `      <div class="controls">
        <button class="btn" onclick="prevStep()">← Prev</button>
        <button class="btn active-btn" id="autoBtn" onclick="toggleAuto()">⏸ Auto</button>
        <button class="btn" onclick="nextStep()">Next →</button>
      </div>
      <div class="process-scroll-hint">↓ Scroll to advance through the process</div>`
);

// ─── 4. Add .btn / .controls CSS (before the process mobile responsive block) ─
replace('btn CSS insert',
  '    /* ── HERO NEURAL-NET CANVAS ── */',
  `    /* ── PROCESS CONTROLS ── */
    .controls {
      display: flex;
      justify-content: center;
      gap: 10px;
      margin-bottom: 10px;
    }
    .btn {
      font-family: 'DM Mono', monospace;
      font-size: 9px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--blue3);
      border: 1px solid var(--border2);
      background: none;
      padding: 6px 14px;
      border-radius: 4px;
      cursor: pointer;
      transition: color 0.2s, border-color 0.2s, background 0.2s;
    }
    .btn:hover, .btn.active-btn {
      color: var(--blue);
      border-color: var(--blue2);
      background: rgba(122,168,208,0.06);
    }

    /* ── HERO NEURAL-NET CANVAS ── */`
);

// ─── 5. JS steps array ────────────────────────────────────────────────────────
replace('JS steps array',
  `const steps = [
  { name: 'Executive Data',         desc: 'DEF 14A proxy statements reveal the people, incentives, ownership and governance structures behind the enterprise' },
  { name: 'Proprietary AI Model',   desc: 'A systematic model extracts leadership signals from structured and semi-structured disclosure' },
  { name: 'Management Scorecards',  desc: 'Qualitative evidence is compressed into quantitative leadership scores built for cross-company comparison' },
  { name: 'Portfolio Construction', desc: 'Capital tilted toward companies where management quality is expected to compound over multi-year horizons' }
];`,
  `const steps = [
  { name: 'Company Filings',        desc: 'Sourcing raw data from SEC filings, earnings calls & proxy statements' },
  { name: 'Proprietary Model',      desc: 'AI scoring engine processes leadership data through a multi-factor risk framework' },
  { name: 'Scorecards',             desc: 'Each CEO ranked on Experience, Track Record, Shareholding & BAM Rating' },
  { name: 'Portfolio Construction', desc: 'Top 20% of management teams selected; diversification parameters applied' }
];`
);

// ─── 6. Add autoPlay/timer vars after current ─────────────────────────────────
replace('autoPlay vars',
  'let current = 0;\n\nfunction goTo(n) {',
  `let current = 0;
let autoPlay = true;
let timer = null;

function goTo(n) {`
);

// ─── 7. Patch goTo() to reset timer on each advance ──────────────────────────
replace('goTo timer hook',
  '  if (current === 2) animateScorecard();\n  if (current === 3) animatePie();\n}',
  `  if (current === 2) animateScorecard();
  if (current === 3) animatePie();
  if (autoPlay) resetTimer();
}`
);

// ─── 8. Add nextStep / prevStep / resetTimer / toggleAuto after goTo block ────
replace('carousel functions insert',
  '\nfunction animateScorecard() {',
  `
function nextStep() { goTo((current + 1) % 4); }
function prevStep() { goTo((current + 3) % 4); }

function resetTimer() {
  clearInterval(timer);
  timer = setInterval(nextStep, 3200);
}

function toggleAuto() {
  autoPlay = !autoPlay;
  const btn = document.getElementById('autoBtn');
  if (autoPlay) {
    btn.textContent = '⏸ Auto';
    btn.classList.add('active-btn');
    resetTimer();
  } else {
    btn.textContent = '▶ Auto';
    btn.classList.remove('active-btn');
    clearInterval(timer);
  }
}

function animateScorecard() {`
);

// ─── 9. Start auto-carousel when process section enters viewport ──────────────
// The scroll listener already calls goTo() which calls resetTimer(); auto starts
// on the first scroll-driven goTo. Also start it on page load after a short delay.
replace('init autoplay on load',
  '/* Init */\ngoTo(0);',
  `/* Init */
goTo(0);
setTimeout(() => { if (autoPlay) resetTimer(); }, 1200);`
);

// ─── Write ────────────────────────────────────────────────────────────────────
fs.writeFileSync(FILE, src, 'utf8');
console.log('✓ Written. Lines:', src.split('\n').length);
