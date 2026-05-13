# Szallas.hu UX Prototype

## Overview
Visual UX prototype for a Hungarian OTA (Szallas.hu) — a 6-screen click-through covering the full booking funnel (homepage → listing → PDP → checkout → payment → thank-you). Built for stakeholder review, not production. All hotels, prices, dates, and reviews are mock data; not connected to any real backend.

The PDP (Hotel Aurora Balaton) was originally authored in [claude.ai/design](https://claude.ai/design) and lives as a single ~36k-line standalone HTML artifact. The 5 secondary screens are smaller, hand-authored HTML files that re-use the same design tokens.

## Tech Stack
- **No build system.** Every screen is a single self-contained `.html` file.
- React 18 via UMD CDN (`unpkg.com/react@18`, `react-dom@18`).
- Babel Standalone CDN (`@babel/standalone`) — JSX transpiles in the browser via `<script type="text/babel">`.
- Leaflet 1.9.4 (CDN) for the listing-page map and PDP location section.
- Inter font (Google Fonts).
- Picsum (`picsum.photos`) for placeholder photos, seeded deterministically per hotel/image-slot.
- Dev server: `python3 -m http.server 9123 --bind 127.0.0.1` (configured in `.claude/launch.json`).

## Project Structure
```
prototype/                          # Original PDP artifact from claude.ai/design (baseline + snapshots)
  Hotel Aurora Balaton.html         # baseline
  Hotel Aurora Balaton.original.html
  Hotel Aurora Balaton.current.html # latest snapshot
  uploads/                          # screenshots / pasted reference images from claude.ai/design

prototype2.0/                       # The active prototype the team works in
  Hotel Aurora Balaton - standalone.html   # PDP, 36k+ lines, source of truth for tokens & shared components
  screens/
    index.html                      # Dashboard linking all 6 screens (plain HTML, no React)
    ds.html                         # Design-system bootstrap: tokens + shared React components reference
    01-homepage.html                # Homepage with hero + typeahead + categories + offers
    02-listing-balaton.html         # Balaton listing: filters / list / Leaflet split-view map
    03-checkout.html                # Guest data form, 4-step stepper
    04-payment.html                 # Card / SZÉP / wallet / transfer, 3D Secure sim
    05-thankyou.html                # Confirmation, add-to-calendar, cross-sell, VIP teaser

docs/ux-overhaul/                   # Business + technical plans (Polish)
  plan.md                           # Source of truth — 21 steps in 4 waves, plain language
  00-kickstart.md                   # How to drive claude.ai/design through the plan
  01-prototype-review.md            # Diagnosis of the original prototype
  02-prototype-update-plan.md       # PDP atomic prompts (W1.* / W2.* / W3.*)
  03-remaining-flow-plan.md         # Wave 4 prompts (H.*, L.*, C.*, P.*, T.*, X.*)
  04-from-scratch-alternative.md    # Backup plan if Wave 2 gate fails

docs/audits/                        # Code-review + product-review reports (created on demand)
docs/impl-guides/                   # Implementation guides generated from reviews
```

### Key Files
| File | Purpose |
|------|---------|
| `prototype2.0/Hotel Aurora Balaton - standalone.html` | PDP — source of truth for design tokens, shared component HTML, brandbar markup. Iterated via claude.ai/design. |
| `prototype2.0/screens/ds.html` | Design-system reference. Tokens (`--c-primary`, `--ink-900`, radii, shadows) + shared React components (BrandBar, Footer, Tag, Switch, Icons `I`). Copy `<head>` + components into each new screen. |
| `prototype2.0/screens/index.html` | Dashboard / table of contents — plain HTML, links to all 6 screens. |
| `prototype2.0/screens/02-listing-balaton.html` | Largest secondary screen (~650 lines, 8 hooks). Drives the Leaflet split-view + 8 mock hotels. |
| `docs/ux-overhaul/plan.md` | Plain-Polish business plan: 21 steps in 4 waves, status of each. |
| `.claude/launch.json` | Local Python static server config (port 9123). |

## Architecture

Each `.html` file is **self-contained**: tokens inline as CSS custom properties, components inline as JSX inside `<script type="text/babel">`. There is no shared JS bundle — copy-paste is the reuse mechanism (intentional, see "Things That Look Wrong But Aren't").

**Cross-screen state** is exchanged via `localStorage['szallas_tweaks']`. The PDP's Tweaks panel (bottom-right on the PDP) writes a JSON blob; all 5 secondary screens read it at module top:
```js
const tw = (()=>{ try{ return JSON.parse(localStorage.getItem('szallas_tweaks'))||{}; }catch(e){ return {}; } })();
```
Keys observed in use: `priceMode` (`total` / `nightly` / `per-person`), `loggedIn` (VIP discount), `urgency`, `showVipTeaser`, `showPriceAnchor`, edge-state toggles (`soldOut`, `noReviews`, `noPhotos`, `fewRates`), `loading`. Each screen also renders a "PDP tweaks aktív" pill bottom-left when any tweak is non-default.

**claude.ai/design handshake (PDP only):** the standalone PDP posts `__edit_mode_set_keys` and `__edit_mode_available` to `window.parent`. Do not break these — they let the Tweaks panel sync back to claude.ai/design when the artifact is opened there.

## Key Conventions

### Naming
- Files: `NN-name.html` for screens (`01-homepage.html`, `02-listing-balaton.html`). `ds.html` and `index.html` are special.
- React components: `PascalCase` inline in each `<script type="text/babel">` block (e.g., `Hero`, `TopOffers`, `BrandBar`, `Footer`).
- Mock-data constants: `SCREAMING_SNAKE_CASE` at top of script (`CATEGORIES`, `TOP_OFFERS`, `FEATURED`, `HOTEL`).
- CSS classes: `kebab-case` (`hero-search`, `tweaks-indicator`, `score-circle`). BEM-ish for variants (`btn`, `btn-primary`, `btn-cta`, `btn-secondary`).

### Design Tokens
Defined as CSS custom properties in `:root`. Authoritative copy lives in `ds.html`. Each screen duplicates the subset it needs.
- Brand: `--c-primary:#E30613` (red), `--c-primary-hover:#b40510`, `--c-cta:#E85A00` (orange for action CTAs)
- Status: `--c-success:#1F7F3E`, `--c-success-bg:#E8F5EC`
- Ink scale: `--ink-900`/`-700`/`-500`/`-400`/`-300`
- Surfaces: `--surface`, `--surface-2`, `--surface-3`, `--line`, `--line-strong`
- Radii: `--radius-sm:6px`, `--radius:10px`, `--radius-lg:14px`, `--radius-xl:20px`
- Shadows: `--shadow-sm`, `--shadow`, `--shadow-lg`, `--shadow-cta`
- Font: Inter, weights 400–900

### React / JSX
- React 18 with `ReactDOM.createRoot(document.getElementById('root')).render(<Page/>)` at the bottom of the script block.
- Hooks via `React.useState` / `React.useEffect` (UMD build — no named imports).
- Helpers like `fmt = (n) => new Intl.NumberFormat('hu-HU').format(...)` and `photo = (seed, w, h) => ...` are duplicated per screen.
- Icons: inline SVGs in an `I = { Search, Pin, Cal, ... }` object (see `ds.html` lines 171–191).

### Copy / i18n
- All UI strings are in **Hungarian** (`<html lang="hu">`, prices `Ft`, "Foglalás", "Köszönjük", etc.).
- Internal docs and code comments are in **Polish** (`docs/ux-overhaul/*.md`, plan steps).

### Mock Data
- All hotels, prices, reviews are inline constants. No backend, no fetch calls.
- Photos: `https://picsum.photos/seed/<scope>-<id>/<w>/<h>` — the seed prefix differs per screen (`szhomepage-`, `szhotel-`, ...) to keep deterministic but distinct visuals.
- Hungarian conventions: dates as `jún. 11–13`, prices as `38 600 Ft` (space thousands separator).

### Error Handling
Mostly absent — it's a static prototype. Only the `localStorage` read is wrapped in `try/catch` (returns `{}` on parse failure). Treat this as intentional: don't add boundary handling unless a real failure mode appears.

### Testing
**No tests, no test runner, no linter, no formatter, no type-checker.** This is a visual prototype validated by eyeballing the preview. Don't propose adding Jest/Vitest/ESLint without explicit ask.

### Code Style
- 2-space indent.
- CSS rules often packed one-per-line for the dense token blocks (look at `01-homepage.html` lines 12–32 — that's intentional). Hand-written, not formatted.
- No semicolons enforced; mostly used.

### Versioning
No version field, no CHANGELOG, no git tags. Status of the 21-step plan lives in `docs/ux-overhaul/plan.md` and `prototype2.0/screens/index.html` (the dashboard's "zrealizowane: 21/21" badge).

## When Writing New Code

### Before implementing
- [ ] If touching the PDP: read the [docs/ux-overhaul/00-kickstart.md](docs/ux-overhaul/00-kickstart.md) workflow — most PDP changes are meant to flow through claude.ai/design, not Claude Code.
- [ ] If touching one of the 5 secondary screens: read [docs/ux-overhaul/plan.md](docs/ux-overhaul/plan.md) for the step it belongs to.
- [ ] Open the screen in a browser via `python3 -m http.server 9123` first — see what's there.
- [ ] Mimic the existing pattern in that screen. Don't introduce a build step or new dependencies.

### During implementation
- [ ] Keep CSS custom-property names aligned with `ds.html` — don't invent new token names.
- [ ] Mock data stays inline in the same file. No JSON files, no fetches.
- [ ] If the change should be visible on other screens too (e.g., a new tweak), wire it through `localStorage['szallas_tweaks']` — don't invent a second sync channel.
- [ ] Preserve the `__edit_mode_set_keys` / `__edit_mode_available` postMessage handshakes on the PDP.

### After implementing
- [ ] Open the affected screen(s) in a browser and click through the relevant flow.
- [ ] If the change affects tweak-driven behavior, toggle the relevant tweak on the PDP and verify the indicator pill appears on other screens.
- [ ] No console errors in DevTools.

## Project Intelligence

### Things That Look Wrong But Aren't
- **No build, no bundler, no npm.** Babel-in-browser is deliberately slow at load — the team optimizes for "open it and see it," not perf. Don't migrate to Vite "to clean it up."
- **Every screen redefines `fmt`, `photo`, tokens, icons.** Each `.html` is meant to be openable in isolation and droppable into a fresh claude.ai/design project. Sharing through ES modules would break that.
- **PDP is 36k lines in one file.** That's by design — claude.ai/design works on a single artifact. Don't split.
- **Tokens duplicated across screens.** `ds.html` is the master copy, but each screen carries its own subset inlined so the screen renders without `ds.html`. If you change a token, propagate it manually (and only on screens that use it).
- **Internal docs are Polish, UI is Hungarian.** Not a bug — the user works in Polish; the product targets Hungary.
- **localStorage reads happen at module top, outside any component.** This is intentional (one read per page load); avoid "fixing" it to a hook.

### Gotchas
- **Big PDP file:** opening `prototype2.0/Hotel Aurora Balaton - standalone.html` in any tool will be slow. Prefer `grep`/`sed -n` over loading it whole.
- **Tweaks panel coupling:** the PDP's Tweaks panel both writes localStorage AND posts to `window.parent`. When iterating on the PDP outside claude.ai/design (e.g., in this repo), the postMessage simply no-ops — that's fine.
- **Picsum image cycling:** different seed prefixes per screen are deliberate, so the same hotel doesn't show the same Picsum photo on homepage and listing — keeps the prototype "feeling fresh." Don't unify the prefix.
- **Listing map disappears below 1100 px width** (CSS media query at line 69). That's the documented behavior — it's not a layout bug to fix.

### Tool & Workflow Notes
- **Run the prototype locally:** `python3 -m http.server 9123 --bind 127.0.0.1` from project root, then `http://127.0.0.1:9123/prototype2.0/screens/index.html`.
- **Iterating the PDP:** the canonical path is claude.ai/design (see [docs/ux-overhaul/00-kickstart.md](docs/ux-overhaul/00-kickstart.md)). Use Claude Code only for the 5 secondary screens, the dashboard, the docs, and tooling.
- **Wave 4 (the 5 secondary screens) is what Claude Code typically touches.** Status: all 21 steps marked complete per the dashboard; ongoing work is polish + cross-screen consistency fixes (the most recent commits — `fb4fbe2`, `c8d199d`, `fa0f3b9` — are all polish on the listing/brandbar).

## Environment & Setup
- macOS, zsh, Python 3 available (used as the dev server).
- No `npm install`, no virtualenv. Just clone and serve.
- For browser preview during Claude Code work, use the `preview_*` MCP tools or `open` the file directly.
