## graphify

This project has a graphify knowledge graph at src/.graphify/.

Rules:
- Before answering architecture or codebase questions, read src/.graphify/GRAPH_REPORT.md for god nodes and community structure
- If .graphify/wiki/index.md exists, navigate it instead of reading raw files
- If .graphify/graph.json is missing but graphify-out/graph.json exists, run `graphify migrate-state --dry-run` first; if tracked legacy artifacts are reported, ask before using the recommended `git mv -f graphify-out .graphify` and commit message
- If .graphify/needs_update exists or .graphify/branch.json has stale=true, warn before relying on semantic results and run /graphify . --update when appropriate
- Before deep graph traversal, prefer `graphify summary --graph .graphify/graph.json` for compact first-hop orientation
- For review impact on changed files, use `graphify review-delta --graph .graphify/graph.json` instead of generic traversal
- After modifying code files in this session, run `npx graphify hook-rebuild` to keep the graph current
- ⚠️ NOTE: root-level `.graphify/` is polluted by dist/ build files — always use `src/.graphify/` for source graph

---

## Project: ReviewShield Dashboard

**Stack:** React + Vite + Tailwind + Firebase Auth + Firestore + N8N + Claude Haiku + Lemon Squeezy + Vercel  
**Repo:** https://github.com/Developer-Juan25/reviewshield-dashboard  
**Production:** https://reviewshield.vykmorix.com  
**Last updated:** 2026-05-20

---

## Architecture Overview

```
src/
  components/
    App.jsx            — Router: Login → Onboarding → Dashboard
    Login.jsx          — Email/password + Google OAuth
    Onboarding.jsx     — 4-step setup (welcome, business, platforms, done)
    Dashboard.jsx      — Main view: reviews, filters, PDF export, header branding
    ReviewCard.jsx     — Per-review card: stars, AI response, regenerate, copy, editable textarea
    Settings.jsx       — Business info, platforms, plan upgrade, White Label (Agency)
    StatsBar.jsx       — Total/negative/avgRating stat cards
    ReviewChart.jsx    — Animated donut chart (8-week breakdown)
  firebase.js          — Firebase init (Auth + Firestore)
  i18n/index.js        — EN + ES translations (all keys)
```

**Firestore schema:**
- `settings/{uid}` — businessName, alertEmail, businessCity, businessAddress, plan, trialEndsAt, platforms{}, whiteLabel{brandName, logoEmoji}
- `reviews/{reviewId}` — userId, authorName, reviewText, rating, isNegative, platform, aiResponse, timestamp, businessName, alertEmail, emailSent

**Plan gating:**
- `PAID_PLANS = ["trial", "starter", "pro", "agency"]`
- Free → no PDF export, no regenerate button
- Starter+ → PDF export, regenerate IA (max 3x per review)
- Agency → White Label branding (brandName + logoEmoji in header + PDF)

---

## N8N Workflows

| ID | Name | Trigger | Purpose |
|----|------|---------|---------|
| W1 | Batch IA Responses | Schedule (every X hrs) | Fetches all reviews → Claude → saves aiResponse |
| W2 | Onboarding webhook | POST `/onboarding` | Saves settings after onboarding |
| W3 | Checkout webhook | Lemon Squeezy → POST | Updates plan in Firestore on payment |
| W4 | Email alerts | Triggered by W1 | Sends email for negative reviews |
| W5 | Regenerar IA | POST `/regenerate` | On-demand regen for single review (Starter+) |

**W5 payload:** `{ reviewId, reviewText, userId, businessName }`  
**W5 Firestore update:** `reviews/{reviewId}.aiResponse`  
**Env var:** `VITE_N8N_REGENERATE_URL` (set in Vercel)

---

## Features Completed ✅

- [x] Firebase Auth (email + Google)
- [x] Onboarding flow (4 steps)
- [x] Real-time reviews via Firestore onSnapshot
- [x] Negative review detection + red accent UI
- [x] Stats bar (total, negative, avg rating)
- [x] Animated donut chart (8-week)
- [x] Filter: All / Negative / Positive
- [x] AI response display per review
- [x] Editable AI response textarea (copy edited version)
- [x] Regenerate IA button (max 3x, Starter+) — calls W5 webhook
- [x] Export PDF (jsPDF, Starter+) — includes all reviews + AI responses
- [x] EN/ES language switcher
- [x] 14-day free trial banner
- [x] Lemon Squeezy checkout (Starter $49 / Pro $99 / Agency $199)
- [x] White Label branding (Agency) — custom brandName + logoEmoji in header + PDF
- [x] OG image 1200×630 + noindex on /success

---

## Pending Backlog ⏳

| Priority | Feature | Notes |
|----------|---------|-------|
| 1 | **Yelp + TripAdvisor API** | Añadir en W1 como fuentes adicionales |
| 2 | **G2 / Capterra / Product Hunt** | Listings de producto para SEO/distribución |
| 3 | **CSP header + gateguard hook** | Bloqueado temp (framer-motion conflicto). Re-habilitar en vercel.json |

---

## Key Files Modified in Recent Sessions

- `Dashboard.jsx` — handleRegenerate (W5), exportPDF (jsPDF), White Label state + header + PDF title
- `ReviewCard.jsx` — editable textarea, regenerate button (3x cap), isRegenerating state
- `Settings.jsx` — White Label section (Agency only), handleWhiteLabel, form.whiteLabel
- `i18n/index.js` — exportPdf, regenerate, whiteLabel keys (EN + ES)
- `.env.example` — VITE_N8N_REGENERATE_URL added

---

## Tomorrow: Start Here

1. Read `src/.graphify/GRAPH_REPORT.md` for code structure
2. Check `git log --oneline -5` to confirm last commit
3. Last commit: `19117e5 feat: White Label branding for Agency plan`
4. Resume from **Backlog Priority 1**: Yelp + TripAdvisor API in W1
