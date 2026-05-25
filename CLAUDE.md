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
**Last updated:** 2026-05-25

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
| W1 | reviewshield-google-reviews | Schedule | Fetches Google + Yelp reviews via SerpAPI + Yelp Fusion API → saves to Firestore → auto-triggers W1-B |
| W1-B | RS - Claude API Response Generator | Schedule + Execute Workflow Trigger | Gets reviews without aiResponse → Claude Haiku → saves aiResponse |
| W2 | ReviewShield - Onboarding Email | POST `/onboarding` | Saves settings after onboarding |
| W3 | reviewshield-ls-webhook | Lemon Squeezy → POST | Updates plan in Firestore on payment |
| W4 | Email alerts | Triggered by W1 (If node) | Sends email for negative reviews |
| W5 | ReviewShield - Regenerar IA | POST `/regenerate` | On-demand regen for single review (Starter+) |

**W1 structure:** Schedule → Get Users → Code JS (filter valid) → [parallel] Check Yelp Enabled → Yelp Search → HTTP Yelp Reviews → Code Normalize Yelp → Merge Reviews ← Code JS1 (Google) ← HTTP Request (google_maps_reviews) ← SerpApi Google map → Upsert → Get doc → If → Email. After Upsert: Aggregate → Execute Sub-workflow (W1-B)

**W1-B trigger:** Has both Schedule Trigger AND "When Executed by Another Workflow" trigger connected to Get many documents

**W5 payload:** `{ reviewId, reviewText, userId, businessName }`  
**W5 Firestore update:** `reviews/{reviewId}.aiResponse`  
**Env var:** `VITE_N8N_REGENERATE_URL` (set in Vercel)

**Yelp API:** Yelp Fusion API key stored in HTTP Request headers. Free tier: 500 calls/day, max 3 reviews/business. Limited coverage in Latin America — works well for USA/Europe businesses.

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
- [x] Yelp Fusion API integrated in W1 — parallel branch with platform check, normalize, merge
- [x] SVG brand icons in ReviewCard — Google (multicolor), Yelp (red burst), Facebook (blue f), TripAdvisor (owl eyes)
- [x] W1 → W1-B auto-trigger — Aggregate + Execute Sub-workflow after Upsert so AI responses generate automatically
- [x] White Label tested with Agency plan — confirmed working in header + Settings
- [x] Product Hunt listing — scheduled to launch Mon May 26 2026 at 12:01am PT

---

## Pending Backlog ⏳

| Priority | Feature | Notes |
|----------|---------|-------|
| 1 | **Capterra listing** | Siguiente listing después de Product Hunt |
| 2 | **Trustpilot API** | Ya está en platforms{} en Firestore. Agregar en W1 como rama paralela igual que Yelp |
| 3 | **CSP header + gateguard hook** | Bloqueado temp (framer-motion conflicto). Re-habilitar en vercel.json |
| 4 | **TripAdvisor API** | Diferido — API de pago. Retomar cuando haya revenue |
| 5 | **G2 listing** | Después de Capterra |

---

## Key Files Modified in Recent Sessions

- `Dashboard.jsx` — handleRegenerate (W5), exportPDF (jsPDF), White Label state + header + PDF title
- `ReviewCard.jsx` — SVG brand icons (GoogleIcon, YelpIcon, FacebookIcon, TripAdvisorIcon) replacing letter badges
- `Settings.jsx` — White Label section (Agency only), handleWhiteLabel, form.whiteLabel
- `i18n/index.js` — exportPdf, regenerate, whiteLabel keys (EN + ES)

---

## Tomorrow: Start Here

1. Read `src/.graphify/GRAPH_REPORT.md` for code structure
2. Check `git log --oneline -5` to confirm last commit
3. Last commit: `5a61a13 feat: replace platform letter badges with real SVG brand icons`
4. **Product Hunt lanzó hoy Mon May 26** — revisar votos y responder comentarios
5. Resume from **Backlog Priority 1**: Capterra listing
6. Luego: Trustpilot API en W1 (misma estructura que Yelp — rama paralela + normalize + merge)
7. Luego: CSP header en vercel.json
