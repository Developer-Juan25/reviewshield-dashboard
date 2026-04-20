# Graph Report - src/  (2026-04-20)

## Corpus Check
- 10 files · ~0 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 18 nodes · 19 edges · 5 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## God Nodes (most connected - your core abstractions)
1. `App.jsx` - 6 edges
2. `Dashboard.jsx` - 6 edges
3. `firebase.js` - 5 edges
4. `Login.jsx` - 3 edges
5. `Onboarding.jsx` - 3 edges
6. `Settings.jsx` - 3 edges
7. `ReviewCard.jsx` - 2 edges
8. `StatsBar.jsx` - 2 edges
9. `index.js` - 0 edges
10. `main.jsx` - 0 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Communities

### Community 0 - "Community 0"
Cohesion: 0.33
Nodes (3): Dashboard.jsx, ReviewCard.jsx, StatsBar.jsx

### Community 1 - "Community 1"
Cohesion: 0.4
Nodes (2): App.jsx, Onboarding.jsx

### Community 2 - "Community 2"
Cohesion: 0.4
Nodes (3): firebase.js, Login.jsx, Settings.jsx

### Community 3 - "Community 3"
Cohesion: 1
Nodes (1): index.js

### Community 4 - "Community 4"
Cohesion: 1
Nodes (1): main.jsx

## Knowledge Gaps
- **2 isolated node(s):** `index.js`, `main.jsx`
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 3`** (1 nodes): `index.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 4`** (1 nodes): `main.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Dashboard.jsx` connect `Community 0` to `Community 1`, `Community 2`?**
  _High betweenness centrality (0.449) - this node is a cross-community bridge._
- **Why does `App.jsx` connect `Community 1` to `Community 2`, `Community 0`?**
  _High betweenness centrality (0.301) - this node is a cross-community bridge._
- **Why does `firebase.js` connect `Community 2` to `Community 1`, `Community 0`?**
  _High betweenness centrality (0.184) - this node is a cross-community bridge._
- **What connects `index.js`, `main.jsx` to the rest of the system?**
  _2 weakly-connected nodes found - possible documentation gaps or missing edges._