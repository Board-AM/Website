'use strict';
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'index.html');
let src = fs.readFileSync(FILE, 'utf8').replace(/\r\n/g, '\n');

// 1. Inject the new CSS rules
const CSS_ANCHOR = `    /*   TEAM   */`;
const NEW_CSS = `    /*   TEAM   */
    .card-initials-bg {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-family: 'Cormorant Garamond', serif;
      font-style: italic; 
      font-size: clamp(110px, 16vw, 160px); 
      font-weight: 300;
      color: rgba(201,168,76,0.08); 
      z-index: 0;
      pointer-events: none;
      user-select: none;
    }
    .card-logo-overlay {
      position: relative;
      z-index: 1;
      height: 55px;
      width: auto;
      opacity: 0.9;
    }`;

if (!src.includes('.card-initials-bg')) {
  src = src.replace(CSS_ANCHOR, NEW_CSS);
  console.log('SUCCESS: Injected watermark and logo CSS.');
}

// 2. Map the team IDs to their initials
const team = [
  { id: 't1', init: 'JB' },
  { id: 't2', init: 'FD' },
  { id: 't3', init: 'RvL' },
  { id: 't4', init: 'LB' }
];

// 3. Regex replace the hefty SVGs with the clean DOM structure
team.forEach(member => {
  const regex = new RegExp(`(<div class="(?:team-leader|team-card)" id="${member.id}">\\s*<div class="card-visual">)[\\s\\S]*?<\\/svg>(\\s*<\\/div>)`);
  src = src.replace(regex, `$1\n        <div class="card-initials-bg">${member.init}</div>\n        <img src="./static/BoardAM_Icon.svg" class="card-logo-overlay" alt="BoardAM Logo">$2`);
});

// Write changes
fs.writeFileSync(FILE, src, 'utf8');
console.log('SUCCESS: DOM cleaned. Team logos and watermarks applied. Lines:', src.split('\n').length);