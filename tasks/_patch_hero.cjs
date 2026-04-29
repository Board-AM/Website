'use strict';
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'index.html');
let src = fs.readFileSync(FILE, 'utf8').replace(/\r\n/g, '\n');

// ─── 1. Nav link colour: dim → text (slightly more visible) ──────────────────
const NAV_OLD = '    .nav-links a {\n      font-family: \'DM Mono\', monospace;\n      font-size: 0.68rem;\n      letter-spacing: 0.15em;\n      text-transform: uppercase;\n      color: var(--dim);\n      text-decoration: none;\n      transition: color 0.3s;\n    }';
const NAV_NEW = '    .nav-links a {\n      font-family: \'DM Mono\', monospace;\n      font-size: 0.68rem;\n      letter-spacing: 0.15em;\n      text-transform: uppercase;\n      color: var(--text);\n      text-decoration: none;\n      transition: color 0.3s;\n    }';
if (!src.includes(NAV_OLD)) { console.error('NAV anchor not found'); process.exit(1); }
src = src.replace(NAV_OLD, NAV_NEW);
console.log('✓ Nav link colour updated');

// ─── 2. Mobile nav link colour too ──────────────────────────────────────────
const MNAV_OLD = '    .nav-mobile a {\n      font-family: \'DM Mono\', monospace;\n      font-size: 0.75rem;\n      letter-spacing: 0.15em;\n      text-transform: uppercase;\n      color: var(--dim);\n      text-decoration: none;\n      transition: color 0.3s;\n    }';
const MNAV_NEW = '    .nav-mobile a {\n      font-family: \'DM Mono\', monospace;\n      font-size: 0.75rem;\n      letter-spacing: 0.15em;\n      text-transform: uppercase;\n      color: var(--text);\n      text-decoration: none;\n      transition: color 0.3s;\n    }';
if (!src.includes(MNAV_OLD)) { console.error('Mobile NAV anchor not found'); process.exit(1); }
src = src.replace(MNAV_OLD, MNAV_NEW);
console.log('✓ Mobile nav link colour updated');

// ─── 3. Tighten hero-logo-wrap gap ───────────────────────────────────────────
const WRAP_OLD = '    .hero-logo-wrap {\n      position: relative;\n      z-index: 1;\n      display: flex;\n      flex-direction: column;\n      align-items: center;\n      gap: 1.5rem;\n      animation: heroFadeUp 1s ease both;\n    }';
const WRAP_NEW = '    .hero-logo-wrap {\n      position: relative;\n      z-index: 1;\n      display: flex;\n      flex-direction: column;\n      align-items: center;\n      gap: 1.1rem;\n      animation: heroFadeUp 1s ease both;\n      max-width: 640px;\n      padding: 0 1.5rem;\n    }';
if (!src.includes(WRAP_OLD)) { console.error('hero-logo-wrap anchor not found'); process.exit(1); }
src = src.replace(WRAP_OLD, WRAP_NEW);
console.log('✓ hero-logo-wrap updated');

// ─── 4. Hero-cta style → remove old plain-text CTA style ────────────────────
const CTA_CSS_OLD = '    .hero-cta {\n      font-family: \'DM Mono\', monospace;\n      font-size: 0.62rem;\n      letter-spacing: 0.4em;\n      text-transform: uppercase;\n      color: var(--dim);\n      animation: heroFadeUp 1s 0.3s ease both;\n    }';
const CTA_CSS_NEW = `    /* ── Hero statement ── */
    .hero-tag {
      font-family: 'DM Mono', monospace;
      font-size: 0.58rem;
      letter-spacing: 0.38em;
      text-transform: uppercase;
      color: var(--blue3);
      animation: heroFadeUp 1s 0.15s ease both;
    }

    .hero-statement {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(1.8rem, 4.2vw, 3.2rem);
      font-weight: 300;
      line-height: 1.18;
      color: var(--bright);
      text-align: center;
      letter-spacing: -0.01em;
      animation: heroFadeUp 1s 0.25s ease both;
    }

    .hero-statement em {
      font-style: italic;
      color: #a8c8e8;
    }

    .hero-body {
      font-size: 0.94rem;
      line-height: 1.82;
      color: var(--text);
      font-weight: 300;
      text-align: center;
      animation: heroFadeUp 1s 0.4s ease both;
    }`;
if (!src.includes(CTA_CSS_OLD)) { console.error('hero-cta CSS anchor not found'); process.exit(1); }
src = src.replace(CTA_CSS_OLD, CTA_CSS_NEW);
console.log('✓ Hero statement CSS added');

// ─── 5. Hero HTML: replace <div class="hero-cta"> with text block ────────────
const HERO_HTML_OLD = '    <div class="hero-divider"></div>\n    <div class="hero-cta">Scroll to explore</div>';
const HERO_HTML_NEW = `    <div class="hero-divider"></div>
    <div class="hero-tag">Board Assessment Management</div>
    <h1 class="hero-statement">We measure the people<br>behind <em>performance.</em></h1>
    <p class="hero-body">Every great company is a reflection of its leadership. We built a system to prove it — and to invest accordingly.</p>`;
if (!src.includes(HERO_HTML_OLD)) { console.error('Hero HTML anchor not found'); process.exit(1); }
src = src.replace(HERO_HTML_OLD, HERO_HTML_NEW);
console.log('✓ Hero HTML updated');

// ─── 6. Mobile: hero statement responsive ─────────────────────────────────────
// Insert after the existing mobile hero-logo rule
const MOB_OLD = '      .hero-logo { width: clamp(170px, 50vw, 230px); }';
const MOB_NEW = `      .hero-logo { width: clamp(170px, 50vw, 230px); }
      .hero-statement { font-size: clamp(1.65rem, 7.5vw, 2.4rem); }
      .hero-body { font-size: 0.88rem; line-height: 1.75; }
      .hero-logo-wrap { gap: 0.9rem; padding: 0 1rem; }`;
if (!src.includes(MOB_OLD)) { console.error('Mobile hero-logo anchor not found'); process.exit(1); }
src = src.replace(MOB_OLD, MOB_NEW);
console.log('✓ Mobile responsive hero updated');

// ─── Write ────────────────────────────────────────────────────────────────────
fs.writeFileSync(FILE, src, 'utf8');
console.log('✓ Written. Lines:', src.split('\n').length);
