'use strict';
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'index.html');
let src = fs.readFileSync(FILE, 'utf8').replace(/\r\n/g, '\n');

// ─── 1. Remove duplicate about-manifesto block ────────────────────────────────
const MANIF_OLD = `    <!-- Manifesto -->
    <div class="about-manifesto">
      <div class="about-manifesto-label">Board Assessment Management</div>
      <h2 class="about-manifesto-heading">We measure the people behind performance.</h2>
      <p class="about-manifesto-sub">Every great company is a reflection of its leadership. We built a system to prove it — and to invest accordingly.</p>
    </div>

    <!-- Pillars -->`;
const MANIF_NEW = `    <!-- Pillars -->`;
if (!src.includes(MANIF_OLD)) { console.error('Manifesto anchor not found'); process.exit(1); }
src = src.replace(MANIF_OLD, MANIF_NEW);
console.log('✓ Duplicate about-manifesto removed');

// ─── 2. CSS: shrink logo, boost statement, fix divider, gold em ──────────────

// hero-logo size
src = src.replace(
  '    .hero-logo { width: clamp(240px, 38vw, 420px); height: auto; }',
  '    .hero-logo { width: clamp(130px, 16vw, 165px); height: auto; opacity: 0.9; }'
);
console.log('✓ hero-logo shrunk');

// hero-logo-wrap: wider container
src = src.replace(
  '      max-width: 640px;\n      padding: 0 1.5rem;',
  '      max-width: 760px;\n      padding: 0 2rem;\n      gap: 1.4rem;'
);
console.log('✓ hero-logo-wrap updated');

// hero-divider: shorter, centred, no full-bleed
src = src.replace(
  '    .hero-divider {\n      width: 100%;\n      height: 1px;\n      background: linear-gradient(to right, transparent, var(--border2), transparent);\n    }',
  '    .hero-divider {\n      width: clamp(60px, 15%, 120px);\n      height: 1px;\n      background: linear-gradient(to right, transparent, var(--border2), transparent);\n      margin: 0.2rem auto;\n    }'
);
console.log('✓ hero-divider narrowed');

// hero-statement: much larger + faster fade
src = src.replace(
  '    .hero-statement {\n      font-family: \'Cormorant Garamond\', serif;\n      font-size: clamp(1.8rem, 4.2vw, 3.2rem);\n      font-weight: 300;\n      line-height: 1.18;\n      color: var(--bright);\n      text-align: center;\n      letter-spacing: -0.01em;\n      animation: heroFadeUp 1s 0.25s ease both;\n    }',
  '    .hero-statement {\n      font-family: \'Cormorant Garamond\', serif;\n      font-size: clamp(2.8rem, 6.5vw, 5rem);\n      font-weight: 300;\n      line-height: 1.12;\n      color: var(--bright);\n      text-align: center;\n      letter-spacing: -0.02em;\n      animation: heroFadeUp 1s 0s ease both;\n    }'
);
console.log('✓ hero-statement enlarged');

// hero-statement em: gold accent
src = src.replace(
  '    .hero-statement em {\n      font-style: italic;\n      color: #a8c8e8;\n    }',
  '    .hero-statement em {\n      font-style: italic;\n      color: var(--gold);\n    }'
);
console.log('✓ hero-statement em → gold');

// hero-body: slight delay bump
src = src.replace(
  '    .hero-body {\n      font-size: 0.94rem;\n      line-height: 1.82;\n      color: var(--text);\n      font-weight: 300;\n      text-align: center;\n      animation: heroFadeUp 1s 0.4s ease both;\n    }',
  '    .hero-body {\n      font-size: 0.94rem;\n      line-height: 1.82;\n      color: var(--text);\n      font-weight: 300;\n      text-align: center;\n      max-width: 560px;\n      animation: heroFadeUp 1s 0.2s ease both;\n    }'
);
console.log('✓ hero-body updated');

// hero-tag: slower fade (it comes last now)
src = src.replace(
  '    .hero-tag {\n      font-family: \'DM Mono\', monospace;\n      font-size: 0.58rem;\n      letter-spacing: 0.38em;\n      text-transform: uppercase;\n      color: var(--blue3);\n      animation: heroFadeUp 1s 0.15s ease both;\n    }',
  '    .hero-tag {\n      font-family: \'DM Mono\', monospace;\n      font-size: 0.58rem;\n      letter-spacing: 0.38em;\n      text-transform: uppercase;\n      color: var(--blue3);\n      animation: heroFadeUp 1s 0.45s ease both;\n    }'
);
console.log('✓ hero-tag animation delay updated');

// mobile: update statement size
src = src.replace(
  '      .hero-statement { font-size: clamp(1.65rem, 7.5vw, 2.4rem); }',
  '      .hero-statement { font-size: clamp(2rem, 8.5vw, 3rem); }'
);
console.log('✓ Mobile statement size updated');

// mobile hero-logo size
src = src.replace(
  '      .hero-logo { width: clamp(170px, 50vw, 230px); }',
  '      .hero-logo { width: clamp(110px, 30vw, 145px); }'
);
console.log('✓ Mobile hero-logo shrunk');

// ─── 3. Hero HTML: reorder and clean ─────────────────────────────────────────
// Find hero-logo-wrap block bounds
const wrapStart = src.indexOf('<div class="hero-logo-wrap">');
const scrollDiv = src.indexOf('  <div class="scroll-indicator">', wrapStart);
if (wrapStart === -1 || scrollDiv === -1) { console.error('Hero wrap bounds not found'); process.exit(1); }

const oldWrap = src.slice(wrapStart, scrollDiv);

// Extract SVG from old wrap
const svgTagStart = oldWrap.indexOf('<svg class="hero-logo"');
const svgTagEnd   = oldWrap.indexOf('</svg>') + 6;
let   svgBlock    = oldWrap.slice(svgTagStart, svgTagEnd);

// Strip "FIRST PRINCIPLES INVESTING" text element
svgBlock = svgBlock.replace(
  /\s*<text x="88" y="70"[^>]+>FIRST PRINCIPLES INVESTING<\/text>/,
  ''
);

// Build new wrap: statement → body → thin rule → small logo
const newWrap = `<div class="hero-logo-wrap">
    <h1 class="hero-statement">We measure the people<br>behind <em>performance.</em></h1>
    <p class="hero-body">Every great company is a reflection of its leadership. We built a system to prove it — and to invest accordingly.</p>
    <div class="hero-divider"></div>
    ${svgBlock}
  </div>
  `;

src = src.slice(0, wrapStart) + newWrap + src.slice(scrollDiv);
console.log('✓ Hero reordered: statement → body → rule → logo');

// ─── Write ────────────────────────────────────────────────────────────────────
fs.writeFileSync(FILE, src, 'utf8');
console.log('✓ Written. Lines:', src.split('\n').length);
