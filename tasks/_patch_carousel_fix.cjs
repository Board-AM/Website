'use strict';
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'index.html');
let src = fs.readFileSync(FILE, 'utf8').replace(/\r\n/g, '\n');

// ─── 1. Remove scroll-driven stage activation block ───────────────────────────
const SCROLL_OLD = `\n/* Scroll-driven stage activation */
const processSection = document.getElementById('process');
let lastStage = -1;

function onScroll() {
  const top    = processSection.getBoundingClientRect().top;
  const sectH  = processSection.offsetHeight;
  const vh     = window.innerHeight;
  const scrolled = -top;
  const range    = sectH - vh;
  if (range <= 0) return;
  const progress = Math.min(1, Math.max(0, scrolled / range));
  const stage = Math.min(3, Math.floor(progress * 4));
  if (stage !== lastStage) {
    lastStage = stage;
    goTo(stage);
  }
}

window.addEventListener('scroll', onScroll, { passive: true });`;
const SCROLL_NEW = '';

if (!src.includes(SCROLL_OLD)) { console.error('✗ Scroll-driver block not found'); process.exit(1); }
src = src.replace(SCROLL_OLD, SCROLL_NEW);
console.log('✓ Scroll-driven stage activation removed');

// ─── 2. Fix #process height (500vh → auto) ────────────────────────────────────
const PROC_CSS_OLD = '    #process { height: 500vh; position: relative; }';
const PROC_CSS_NEW = '    #process { position: relative; }';

if (!src.includes(PROC_CSS_OLD)) { console.error('✗ #process CSS not found'); process.exit(1); }
src = src.replace(PROC_CSS_OLD, PROC_CSS_NEW);
console.log('✓ #process height fixed');

// ─── 3. Fix .process-sticky (remove sticky/100vh behaviour) ──────────────────
const STICKY_OLD = `    .process-sticky {
      position: sticky;
      top: 0;
      height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      padding: 0 20px;
    }`;
const STICKY_NEW = `    .process-sticky {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
    }`;

if (!src.includes(STICKY_OLD)) { console.error('✗ .process-sticky CSS not found'); process.exit(1); }
src = src.replace(STICKY_OLD, STICKY_NEW);
console.log('✓ .process-sticky de-stickied');

// ─── Write ─────────────────────────────────────────────────────────────────────
fs.writeFileSync(FILE, src, 'utf8');
console.log('✓ Written. Lines:', src.split('\n').length);
