'use strict';
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'index.html');
let src = fs.readFileSync(FILE, 'utf8').replace(/\r\n/g, '\n');

// ─── 1. Replace inline constellation SVG with <img> pointing to real logo ─────
const SVG_OLD = `    <svg class="hero-logo" viewBox="0 0 340 88" xmlns="http://www.w3.org/2000/svg">
      <circle cx="52" cy="44" r="5.5" fill="#7aa8d0"/>
      <circle cx="52" cy="22" r="3.5" fill="#7aa8d0" opacity="0.8"/>
      <circle cx="52" cy="66" r="3.5" fill="#7aa8d0" opacity="0.8"/>
      <circle cx="30" cy="32" r="3.5" fill="#7aa8d0" opacity="0.8"/>
      <circle cx="30" cy="56" r="3.5" fill="#7aa8d0" opacity="0.8"/>
      <circle cx="74" cy="32" r="3"   fill="#7aa8d0" opacity="0.7"/>
      <circle cx="74" cy="56" r="3"   fill="#7aa8d0" opacity="0.7"/>
      <circle cx="16" cy="44" r="2.5" fill="#7aa8d0" opacity="0.6"/>
      <circle cx="52" cy="10" r="2.5" fill="#7aa8d0" opacity="0.5"/>
      <line x1="52" y1="44" x2="52"   y2="25.5" stroke="#7aa8d0" stroke-width="1.2" opacity="0.5"/>
      <line x1="52" y1="44" x2="52"   y2="62.5" stroke="#7aa8d0" stroke-width="1.2" opacity="0.5"/>
      <line x1="52" y1="44" x2="33.5" y2="33"   stroke="#7aa8d0" stroke-width="1.2" opacity="0.5"/>
      <line x1="52" y1="44" x2="33.5" y2="55"   stroke="#7aa8d0" stroke-width="1.2" opacity="0.5"/>
      <line x1="52" y1="44" x2="71"   y2="33"   stroke="#7aa8d0" stroke-width="1.2" opacity="0.5"/>
      <line x1="52" y1="44" x2="71"   y2="55"   stroke="#7aa8d0" stroke-width="1.2" opacity="0.5"/>
      <line x1="30" y1="32" x2="16"   y2="44"   stroke="#7aa8d0" stroke-width="1"   opacity="0.35"/>
      <line x1="30" y1="56" x2="16"   y2="44"   stroke="#7aa8d0" stroke-width="1"   opacity="0.35"/>
      <line x1="52" y1="22" x2="52"   y2="12.5" stroke="#7aa8d0" stroke-width="1"   opacity="0.35"/>
      <text x="88" y="54" font-family="'DM Sans',sans-serif" font-size="36" font-weight="300" letter-spacing="-0.5" fill="#c8dff0">Board</text>
      <text x="215" y="54" font-family="'DM Sans',sans-serif" font-size="36" font-weight="300" letter-spacing="-0.5" fill="#4a7a9a">AM</text>
    </svg>`;
const SVG_NEW = `    <img src="static/BoardAM_Logo.svg" class="hero-logo" alt="BoardAM">`;

if (!src.includes(SVG_OLD)) { console.error('✗ Inline SVG anchor not found'); process.exit(1); }
src = src.replace(SVG_OLD, SVG_NEW);
console.log('✓ Inline SVG replaced with <img>');

// ─── 2. Update .hero-logo CSS: wider + invert filter for dark bg ───────────────
const LOGO_CSS_OLD = '    .hero-logo { width: clamp(130px, 16vw, 165px); height: auto; opacity: 0.9; }';
const LOGO_CSS_NEW = '    .hero-logo { width: clamp(200px, 28vw, 300px); height: auto; filter: brightness(0) invert(1); opacity: 0.82; }';

if (!src.includes(LOGO_CSS_OLD)) { console.error('✗ .hero-logo CSS anchor not found'); process.exit(1); }
src = src.replace(LOGO_CSS_OLD, LOGO_CSS_NEW);
console.log('✓ .hero-logo CSS updated');

// ─── 3. Update mobile .hero-logo override to match new width ──────────────────
const MOB_OLD = '      .hero-logo { width: clamp(110px, 30vw, 145px); }';
const MOB_NEW = '      .hero-logo { width: clamp(160px, 55vw, 220px); }';

if (!src.includes(MOB_OLD)) { console.error('✗ Mobile .hero-logo CSS anchor not found'); process.exit(1); }
src = src.replace(MOB_OLD, MOB_NEW);
console.log('✓ Mobile .hero-logo CSS updated');

// ─── Write ─────────────────────────────────────────────────────────────────────
fs.writeFileSync(FILE, src, 'utf8');
console.log('✓ Written. Lines:', src.split('\n').length);
