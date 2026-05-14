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
    tweaks-overlay.js               # Vanilla-JS injector — adds Tweaks FAB + Mobile/Desktop toggle to every secondary screen
    01-homepage.html                # Homepage with hero + typeahead + categories + offers
    02-listing-balaton.html         # Balaton listing: filters / list / Leaflet map (split or fullscreen)
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
| `prototype2.0/screens/02-listing-balaton.html` | Largest secondary screen (~800 lines). 8 mock hotels, Leaflet inline + 3-column fullscreen map (`FullscreenMap` component, `.filters-map-btn` opener). |
| `prototype2.0/screens/tweaks-overlay.js` | Shared overlay loaded by all 5 secondary screens via `<script src>`. Injects Tweaks FAB + 17-toggle panel + Desktop/Mobile toggle. Vanilla DOM, no React. Toggle = `localStorage` write + `location.reload()`. |
| `docs/ux-overhaul/plan.md` | Plain-Polish business plan: 21 steps in 4 waves, status of each. |
| `.claude/launch.json` | Local Python static server config (port 9123). |

## Architecture

Each `.html` file is **self-contained for content**: tokens inline as CSS custom properties, components inline as JSX inside `<script type="text/babel">`. There is no shared JS bundle for content/structure — copy-paste is the reuse mechanism (intentional, see "Things That Look Wrong But Aren't"). The one exception is the dev-overlay (`tweaks-overlay.js`), which secondary screens load via a tag — content stays inline, overlay is shared.

**Cross-screen state** is exchanged via `localStorage['szallas_tweaks']`. Writers: PDP's TweaksPanel (React) + the shared `tweaks-overlay.js` on secondary screens. All consumers read at module top:
```js
const tw = (()=>{ try{ return JSON.parse(localStorage.getItem('szallas_tweaks'))||{}; }catch(e){ return {}; } })();
```
Keys: `priceMode` (`total` / `nightly` / `per-person`), `loggedIn` (VIP discount), `showUrgency`, `showVipTeaser`, `showPriceAnchor`, `scoreBadgePos` (PDP only), `bookingBarStyle`, edge states (`forceSoldOut`, `forceNoReviews`, `forceNoPhotosCat`, `forceFewRates`, `forceLoading`), `viewMode` (`desktop`/`mobile`). Toggles in the overlay don't try to re-render — they `location.reload()` so module-top reads pick up the new state.

**Mobile responsive strategy (two paths, one CSS):** `tweaks-overlay.js` sets `html[data-view="mobile"]` in TWO cases:
1. Dev toggle (`tweaks.viewMode === 'mobile'`) — also sets `html[data-preview="phone"]` to enable the 375px-frame phone-preview chrome.
2. Actual narrow viewport (`window.matchMedia('(max-width:768px)').matches`) — `data-view="mobile"` only, no preview attr.

The 375px `body > *` constraint is gated on `html[data-preview="phone"]` so real phones fill the viewport. All `html[data-view="mobile"] {...}` content rules fire in BOTH cases. The overlay listens to mq.change so resize updates the attribute live. PDP standalone mirrors this: a `useEffect` in App watches `(max-width:768px)` and falls back to `<MobileView/>` even without the dev toggle, plus a `@media (max-width:768px)` block on `.mobile-frame` drops the 375px width + gray surround so MobileView fills the phone screen.

Every screen ships its own dedicated mobile layout via `html[data-view="mobile"] {...}` rules at the bottom of its `<style>` block: compact brandbar (icons only), vertical search forms, single-column cards, full-width CTAs. The overlay handles shared chrome (brandbar shrink, footer 2-col, indicator hide); each screen handles its own content reflow.

**claude.ai/design handshake (PDP only):** the standalone PDP posts `__edit_mode_set_keys` and `__edit_mode_available` to `window.parent`. Do not break these — they let the Tweaks panel sync back to claude.ai/design when the artifact is opened there.

**PDP mobile sync:** PDP's `App` reads `localStorage['szallas_tweaks']` at init (not just `window.__TWEAKS__`), so toggling Mobile on a secondary screen + clicking a hotel renders the PDP's `<MobileView/>`. The `.mobile-frame` CSS was stripped of device chrome (no notch, no 12px black border, no fake status bar) — `body:has(.mobile-frame){background:#F5F6F8}` matches secondary screens' surround.

**PDP MobileView structure & scroll-spy:** the mobile PDP renders inside `.m-scroll` (height:780 in dev preview, 100vh on real mobile). DOM order: `m-header` (sticky neutral white) → optional `m-app-banner` / `m-searchbar-compact` → `m-hero` (with swipeable photo gallery) → `m-pad` (h1 + meta + nearby + score chip) → `m-tabs` (out-of-flow, sticky:top:0 only when active) → `m-overview` (Szolgáltatások extract) → `m-rooms` → `m-reviews` → `m-location` (map) → `m-description` (Leírás clamp+expand) → SEO breadcrumbs at the bottom → sticky bottom bar (`m-stickyinfo` guests/dates strip + `m-sticky` price+CTA). Scroll-spy listener in `MobileView` updates: `tab` (active section by id), `headerHidden` (hide once scrollTop > 80), `tabsSticky` (show once scrollTop > rooms section bottom). Headers + tabs never overlap — past rooms = tabs only, above rooms = header only at very top.

**Section scroll inside `.m-scroll`:** `el.scrollIntoView({behavior:'smooth'})` does not work reliably for nested scroll containers in the preview env (and behavior:'smooth' is occasionally polyfill-flaky elsewhere). Use direct `sc.scrollTop = el.offsetTop - 60` for tab clicks, score-chip jump, address map link, etc.

**Listing React state (in `Page` component):**
- `scrolled` — boolean, set by `window.scroll` listener (threshold 80px). Drives `.scrolled` class on both `.search-pad` (desktop slide-in lm-toggle+sort) and `.results-bar` (mobile collapses summary-left).
- `mobileFilters` — boolean, controls a 375px filter drawer (`.mobile-filters-drawer`). Rendered when true, contains 6 FilterGroups + Visszaállítás/Megtekintem actions. Trigger: `.mobile-filter-btn` (visible only in mobile via CSS).
- `view: 'list' | 'split'` — desktop list/map toggle. On mobile, "Lista + térkép" opens fullscreen map instead of splitting (`isMobilePreview` check).
- `FullscreenMap` has internal `listCollapsed` state — collapse button in `.map-fs-list-header` shrinks list to 44px strip so map fills viewport.

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
- **Listing hotel info shown TWICE in different forms.** Promo info (Top választás / VIP klub / Last minute / Wellness) lives as colored `.promo-badges` row in the info column on desktop, and as image overlays (`.discount`, `.vip-eligible`, `.hotel-img-label`) on mobile. Both are intentional — they're CSS-toggled (`display:none/block`) based on `html[data-view]` so each viewport shows the info in the right form factor.
- **Listing has a `data-view`-conditional split-view variant.** `.layout.with-map .hotel-card` overrides image/price column widths + hides `.facts` and `.quote` to fit the narrower list column when map is shown. Looks like duplicate CSS but is the only way to make the card fit without overflow.
- **`HotelCard` JSX + helpers (`PHOTO_COUNT`, `hotelPhotos`, `BoardChip`) are copy-pasted between `02-listing-balaton.html` and `01-homepage.html`.** Same component, two homes — comment marks the relationship. When you change visual on one, port to the other. Homepage data (`TOP_OFFERS`, `FEATURED`) was enriched to match the listing's HOTELS shape (id, stars, scoreLbl, reviews, board/boardKind, distance, vipEligible, refundable, cancelUntil, topQuote, wellness) so the same component renders both. Same applies to the carousel + score-inline + badge-palette CSS rules in homepage's `<style>`.
- **Brandbar is white + red logo, NOT solid red bg.** Cross-screen change. `.brandbar{background:#fff;border-bottom:1px solid var(--line)}` with neutral icons; only `.logo-word` + `.logo-tag` keep brand red. Don't revert to the old red bg "for visibility" — the design rule is "only CTA shines red".
- **Active tab/segment states use `var(--ink-900)` not `var(--c-primary)`.** `.lm-toggle button.on`, `.quick-chips button.active`, `.step.active .step-num`, `.method.active`, PDP `.subnav a.active` / `.ham-chip.active` / `.filter-chip.active` / `.poi-tab.active` / `.rgm-rail-thumb.active` / `.m-tabs button.active` — all dark ink. Brand red is reserved for CTAs (`.btn-search`, `.btn-cta`, `.hotel-cta`, `.csc-btn`, sticky booking bar) + the brand logo. The PDP mobile tabs use a 2px ink-900 underline on active instead of a fill.

### Gotchas
- **Big PDP file:** opening `prototype2.0/Hotel Aurora Balaton - standalone.html` in any tool will be slow. Prefer `grep`/`sed -n` over loading it whole.
- **Tweaks panel coupling:** the PDP's Tweaks panel both writes localStorage AND posts to `window.parent`. When iterating on the PDP outside claude.ai/design (e.g., in this repo), the postMessage simply no-ops — that's fine.
- **Picsum image cycling:** different seed prefixes per screen are deliberate, so the same hotel doesn't show the same Picsum photo on homepage and listing — keeps the prototype "feeling fresh." Don't unify the prefix.
- **Listing map disappears below 1100 px width** (CSS media query). That's the documented behavior — not a layout bug to fix.
- **CSS class clash with overlay:** listing's "List / List+map" segmented toggle uses class **`.lm-toggle`** (NOT `.view-toggle`). The overlay's bottom-left Desktop/Mobile toggle owns `.view-toggle`. If you reintroduce a same-named class anywhere in a secondary screen, position-fixed overlay rules will override and break the inline element.
- **3-above-fold listing target:** tuned so 3 hotel cards fit in ~900px viewport (card 3 bottom ≈ y=854, card height ≈ 199px including facts row + promo-badges + status badges). Adding padding to `.search-pad`, `.quick-chips`, `.results-bar`, or `.disclosure` will break that. Measure with `getBoundingClientRect()` via preview_eval before adding vertical space above `.list-col`.
- **Tweaks toggle = reload:** `tweaks-overlay.js` does `location.reload()` on every toggle change so module-top reads pick up new state. Don't try to refactor to React state — the secondary pages each have their own React root, and re-rendering them from the overlay would need event plumbing not worth the complexity.
- **CSS specificity trap with `html[data-view="mobile"]`:** `.search-pad.scrolled .search-pad-actions` has specificity (0,3,0); `html[data-view="mobile"] .search-pad-actions` has (0,2,1). When BOTH match (mobile + scrolled), the scrolled rule wins. To force-hide a feature on mobile in the scrolled state, you need to extend the selector: `html[data-view="mobile"] .search-pad.scrolled .search-pad-actions{display:none}`.
- **`window.scrollTo()` in `preview_eval` does NOT fire scroll events on React listeners** — set the scroll position, then call `window.dispatchEvent(new Event('scroll'))` to trigger state updates. Without that, sticky-scroll behavior tests will show stale state. For nested scrollers (`.m-scroll`), `sc.dispatchEvent(new Event('scroll'))` after setting `sc.scrollTop`.
- **React Rules of Hooks — modals must `return null` AFTER all hooks.** The standalone PDP's `GalleryModal` had `if (!open) return null` BEFORE the hook calls — caused React's "Expected static flag was missing" warning that propagated to break unrelated state updates (e.g. an Amenities modal in MobileView wouldn't open even though its `setOpen(true)` was wired correctly). Fix: hoist the early return to AFTER every `useState`/`useEffect`/`useMemo`/`useCallback` call. Always check this when modals fail silently.
- **Modal state — prefer local over hoisted when possible.** Page-level state for AmenitiesModal/ReviewsModal got blocked by the GalleryModal hook bug above. MobileView now also keeps its OWN modal state + renders its OWN AmenitiesModal/ReviewsModal instances, so a sibling component breaking React reconciliation can't take it down. Tradeoff: two render copies (only one open at a time), but resilient.
- **`scrollIntoView({behavior:'smooth'})` doesn't reliably scroll a nested `.m-scroll` container in the preview env.** Use `sc.scrollTop = el.offsetTop - 60` directly — instant, works everywhere. Applied to PDP mobile tab clicks, score-chip jump-to-reviews, address "Térképen" map link.
- **Search bar unification across screens:** homepage `.hero-search`, listing `.search-bar`, PDP `.searchbar-inner` all use the same visual pattern — `border-radius:var(--radius-lg)` (14px) outer frame + `1px solid var(--line-strong)` border + internal `border-right` dividers between cells + embedded right-side CTA with `overflow:hidden` on parent for radius clipping. If you change one, change all three or you'll re-introduce the inconsistency.
- **Score badge style is square (`border-radius:8px`) everywhere** — PDP `.m-score-num` / `.hero-score-num` / `.sidebar-score-num` / `.hotel-score-inline-num`, listing `.hotel-score .num`, homepage `.offer-score`, and `ds.html .score-circle` (name kept for legacy). Do not revert any to `50%` for "circle look."

### Tool & Workflow Notes
- **Run the prototype locally:** `python3 -m http.server 9123 --bind 127.0.0.1` from project root, then `http://127.0.0.1:9123/prototype2.0/screens/index.html`. Configured via `.claude/launch.json`, so `mcp__Claude_Preview__preview_start` with name `static` will reuse it.
- **In Claude Code, prefer Claude Preview MCP over Chrome MCP.** Chrome MCP blocks `file://`, `localhost:*`, and `claude.ai/*` for security. Preview MCP can hit `localhost:9123` and supports `preview_eval`, `preview_screenshot`, `preview_resize`. Note: `preview_screenshot` returns a full-page JPEG (long pages get visually compressed) — for above-fold verification, query `getBoundingClientRect()` via `preview_eval` instead.
- **Iterating the PDP:** the canonical path is claude.ai/design (see [docs/ux-overhaul/00-kickstart.md](docs/ux-overhaul/00-kickstart.md)). Use Claude Code only for the 5 secondary screens, the dashboard, the docs, and tooling.
- **Wave 4 (5 secondary screens) is what Claude Code typically touches.** All 21 plan steps complete; ongoing work is polish + cross-screen consistency fixes. Recent rounds delivered: real-mobile responsive (matchMedia + `data-preview="phone"`), neutralized brandbar across all 6 screens (white + red logo only), HotelCard reuse on homepage (TOP_OFFERS + FEATURED), PDP desktop kalejdoskop gallery (1 big + 2x2 right + bottom row of 4), NeighborsMapModal (address click + Location button), fullscreen AmenitiesModal + ReviewsModal with search filters, listing photo carousel (desktop arrows + mobile swipe), a11y pass (focus-visible cross-screen, semantic hotel-card with role+keyboard, heart aria-labels), mobile typography bumps. Mobile PDP fully restructured: white sticky m-header (auto-hide on scroll past hero, no auto-reveal on scroll-up), iOS-style app banner edge-case tweak, compact + full search-bar style tweaks, hero with swipeable 5-photo gallery + dots, inline stars in H1 with long-title clamp+expand, compact score chip (label · count one line), Szolgáltatások extract (light text+icons from AMEN_TOP, no boxes), 1-line nearby highlights, address with "Térképen" map link, sticky info bar (guests + dates) above bookbar, sections re-ordered as Szolgáltatások → Szobák → Vélemények → Térkép → Leírás (Leírás moved to end), out-of-flow tabs that slide in only past rooms (text-only with ink-900 underline-active), SEO breadcrumbs at the bottom of the scroll. UX audit report at [docs/audits/ux-review-report-v1.md](docs/audits/ux-review-report-v1.md).
- **Bulk-edit secondary screens:** the brandbar port and overlay injection were done with one-shot Python scripts iterating over `01-…html` through `05-…html`. When you need a shared change across the 5 screens, prefer that pattern over 5 sequential Edits.
- **Live deploy: GitHub Pages from `main` branch root.** Custom domain [mateuszkoslacz.com/szallas-hu-prototype/](http://mateuszkoslacz.com/szallas-hu-prototype/prototype2.0/screens/index.html), HTTPS via GitHub-managed cert. After `git push`, pages may be cached — trigger a fresh build with `gh api -X POST repos/mkoslacz/szallas-hu-prototype/pages/builds`, then poll `gh api repos/mkoslacz/szallas-hu-prototype/pages/builds/latest --jq .status` until `built`. The prototype is publicly accessible — when iterating, share the deployed URL with stakeholders, not local previews.
- **Cache-bust during preview iteration:** when an HTML/JS edit isn't reflected even after `window.location.reload()`, append `?bust=<timestamp>` to the URL. The dev server serves fresh bytes but the in-browser cache may pin an old version of `tweaks-overlay.js` etc.

## Environment & Setup
- macOS, zsh, Python 3 available (used as the dev server).
- No `npm install`, no virtualenv. Just clone and serve.
- For browser preview during Claude Code work, use the `preview_*` MCP tools or `open` the file directly.
