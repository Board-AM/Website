# BAM Website — Neural Network Visual Redesign (v3)

## Problem with v2
- Proximity-based graph still feels algorithmic, not composed
- Opacity values too low — network is barely visible
- No zone structure — nodes scatter uniformly, canopy has no density advantage
- DFS pulse path zigzags, doesn't feel like a directional signal
- Pulse head (2.6px, 0.78 alpha) is too small to read as a travelling light
- Result: looks like empty dark grid with faint dots

## New strategy: art-directed zones + visual spine

### Node generation — 4 explicit zones
- Zone 0 (canopy): 62% of nodes in y 2–36%, full width — primary visible band
- Zone 1 (left tendril): 13% in x 1–22%, y 22–86% — frames left side
- Zone 2 (right tendril): 13% in x 78–99%, y 22–86% — frames right side
- Zone 3 (lower hints): 12% in y 78–97% — faint base anchors
- Logo exclusion: desktop x 26–74%, y 29–68%; mobile x 20–80%, y 34–70%

### Adjacency graph
- Same nearest-neighbor approach but zone-aware degree limits
- Canopy: max degree 3 (30% chance), else 2
- Other zones: max degree 2
- Store edge distance on edge tuple for proximity-opacity in frame
- Max connection distance: 205px desktop / 145px mobile

### Pulse path
- BFS from leftmost to rightmost canopy node (parent-tracking BFS, O(n))
- Gives shortest left→right path through the network = horizontal sweep
- DFS fallback if graph disconnected
- 15 000 ms full traversal

### Visibility boost
- Canopy edges: rgba(112,138,168, 0.12–0.18) with proximity boost
- Tendril edges: rgba(112,138,168, 0.07–0.10)
- Canopy nodes: rgba(135,162,195, 0.36)
- Tendril/lower nodes: rgba(135,162,195, 0.22)
- Pulse trail: 4 steps — 0.09 / 0.20 / 0.36 / 0.54
- Pulse head: 3.2px core (0.84 alpha) + 5.5px halo (0.13 alpha)
- Arrival node: outer halo 6px (0.05→0.14) + core (+1.2px, 0.26→0.76)

### Draw order (correct layering)
1. Base edges (steel-blue)
2. Pulse trail edges (gold) — between edges and nodes
3. Base nodes — sit above all edges
4. Pulse node highlights + head dot — above base nodes
5. Vignette

### Reduced motion
- Draw static network once (edges + nodes + vignette)
- Listen for resize to redraw
- No animation

### What does NOT change
- Page structure, about section, team, process copy

## Checklist
- [x] Zone-based node generation implemented
- [x] drawEdges / drawNodes helpers split from frame loop
- [x] BFS pulse path from leftmost→rightmost canopy
- [x] DFS fallback for disconnected graph
- [x] Increased visibility values
- [x] 4-step trail + halo head
- [x] Correct draw order (edges → trail → nodes → highlights → vignette)
- [x] Reduced motion: static + resize
- [ ] No console errors verified (open browser to confirm)

---

## Review
Applied 2026-04-25. v3 IIFE replaces v2 in index.html at char offset 82549.
Node layout: 55 desktop / 30 mobile nodes across 4 art-directed zones.
BFS pulse from leftmost→rightmost canopy node, 15s traversal, gold head 3.2px at 0.84α.
Open index.html in browser and scroll hero to verify visual and check DevTools console.
