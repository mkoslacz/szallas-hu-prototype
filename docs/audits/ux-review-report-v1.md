# UX Review — v1

## Audit Metadata
- **Date:** 2026-05-13 12:57:20
- **Branch:** main
- **Commit:** c15e8bce573e24e46670de5bf1d41bc37139c0bb — chore: session wrap-up [session-wrap-up]
- **Reviewer:** Claude (ux-review skill)
- **Application URL:** http://127.0.0.1:9123/prototype2.0/screens/
- **Viewports tested:** desktop (~1280x800), mobile (375px constrained via `html[data-view="mobile"]`)
- **Note:** mobile preview constrains layout to 375px via overlay but window stays full-width — `@media (max-width:…)` rules don't fire; mobile rules use `html[data-view="mobile"]` selector.

## Summary

Prototyp jest w bardzo dobrym stanie wizualnym po ostatnich zmianach w tej sesji: jeden „świecący" CTA pomarańczowy, neutralna ciemna szarość dla aktywnych tabów/segmentów, ocena zgrupowana z nazwą i gwiazdkami, listing odchudzony z CTA na karcie, carousel zdjęć w kafle + na mobile PDP. Hierarchia wizualna i konsystencja paletowa są mocne, ale **skala typografii na mobile jest systemowo za mała** (większość tekstów 9.5–11.5px, poniżej WCAG/AA komfortu czytania 14px) i **tap-targety na mobile** (serce 28×28, mobile-filter 27.5px wys., chipy 26px wys.) są poniżej 44×44 minimum. Drugorzędne uchybienia: orange disclosure buttons na checkout konkurują z głównym CTA; karty hotelu to klikalne `<div>` zamiast semantycznego elementu; brak widocznych focus-rings na większości kontrolek. Rekomendacja: zaadresować mobile-scale + a11y w jednej, średniej rundzie polish.

## Screens Reviewed

| # | Screen | URL / Route | States captured | Viewports |
|---|--------|-------------|-----------------|-----------|
| 1 | Homepage | `/01-homepage.html` | default | desktop, mobile |
| 2 | Listing — Balaton | `/02-listing-balaton.html` | default, carousel-after-swipe | desktop, mobile |
| 3 | PDP — Hotel Aurora Balaton | `/Hotel Aurora Balaton - standalone.html` | default, mobile-hero swipe | desktop, mobile |
| 4 | Checkout | `/03-checkout.html` | step 2 active | desktop, mobile |
| 5 | Payment | `/04-payment.html` | step 4 active, Bankkártya selected | desktop, mobile |
| 6 | Thank you | `/05-thankyou.html` | success | desktop, mobile |

## Findings (sorted by severity)

| # | Area | Severity | Screen | Problem | Recommendation |
|---|------|----------|--------|---------|----------------|
| 1 | Mobile typography | critical | Listing — mobile | Wielkość czcionek ciała: lokalizacja 11.5px, fakty 11.5px, badge 9.5px, priceunit 10.5px, gwiazdki 11px. Wszystko < 14px, prawie nieczytelne na ~5″. | Podnieść skalę: lokalizacja 12.5→13px, badge 9.5→11px, priceunit 10.5→11.5px, gwiazdki 11→12px, nazwa h3 14.5→15.5px. |
| 2 | Touch targets | critical | Listing / PDP — mobile | Serce 28×28 (na fotce), mobile-filter-btn 27.5px wys., quick-chips 26px wys., card-dot 6×6. WCAG ≥ 44×44, dla pasywnych ≥ 24×24. | Serce 28→36 (akceptowalne min na zdjęciu) lub 44 jeśli nie obciąża zdjęcia; chipsy/filtr btn padding pionowy 5→8px; dot indicator zostaje 6×6 (pasywny). |
| 3 | A11y — semantyka | critical | Listing — wszystkie viewporty | `.hotel-card` to klikalny `<div>` z `onClick` — niedostępne klawiaturą, niewykrywalne przez screen reader jako link. | Owijać w `<a>` z `role="article"` na wewnętrznym kontenerze, lub używać semantycznego `<a href="#pdp">` z `display:grid` dla layoutu. |
| 4 | A11y — focus visibility | critical | Cross-screen | Większość kontrolek (button, a, input) nie ma jawnego stylu `:focus-visible`. Klawiaturowi użytkownicy są ślepi. | Dodać global `*:focus-visible{outline:2px solid var(--ink-900);outline-offset:2px}` + override dla CTA `outline-color:#fff`. |
| 5 | Visual hierarchy | medium | Checkout — desktop + mobile | Trzy disclosure buttony („+ Számlázási cím", „+ Speciális kérés hozzáadása", „+ Akciós kód") są pomarańczowe — kolidują z głównym CTA „Foglalás elküldése →". Łamią zasadę „jeden świecący element". | Zmienić na neutralne (białe tło, 1px line, `--ink-700` text) z dyskretnym „+" prefix. CTA pomarańczowy zostaje jedyną „latarnią". |
| 6 | Mobile typography | medium | PDP — mobile | Indicator „X / 68" 12px, .m-meta 12px, .m-rate-title 13px — to są okej-borderline, ale długi opis (Leírás) i tekst w sekcjach przegapił bumping. | Bumpować rozmiary sekcji body na mobile o 1px. Zmierzony niedobór mniejszy niż na listingu. |
| 7 | A11y — keyboard nav | medium | Listing — carousel | Strzałki carouselu są `<button>` ✓, ale gdy nie ma hovera (np. focus przez tab), są niewidoczne (`opacity:0`). Klawiaturowy użytkownik nie widzi że są. | `.hotel-card:focus-within .card-arrow{opacity:1}` żeby przy fokusie na karcie strzałki też się pokazywały. |
| 8 | Consistency | medium | Listing vs Homepage | Card scores: listing pokazuje pełen blok (badge + label + count) obok nazwy, homepage pokazuje tylko numer w prawym górnym rogu zdjęcia. Niespójna prezentacja oceny. | Ujednolicić: albo wszędzie inline (preferowane po zmianie listingu), albo akceptować różnicę gdy homepage carduszek jest karuzela. |
| 9 | Affordance | medium | Listing — desktop | Karta hotelu jest klikalna, ale brak żadnego signal — bez hover-state zachowania (oprócz shadow + border darken). Użytkownik może nie wiedzieć, że cała karta klika. | Dodać cursor:pointer (jest), + przy hoverze drobny scale lub strzałkę „→" w prawym dolnym rogu price-col jako wizualne potwierdzenie klikalności. |
| 10 | Contrast | low | Listing — desktop | Cytat („quote") jest 11.5px italic, kolor `--ink-700` na `--surface-2` — kontrast ~7:1 OK, ale rozmiar trochę za mały. | Bumpować 11.5→12.5px LUB dropować quote z karty (po decluttering rationale można uznać za zbędne). |
| 11 | Content | low | Thankyou — mobile | Hero image w sekcji „A foglalásod részletei" nie ładuje się (placeholder gray/blue) — picsum offline / cache miss. | Zmienić seed na jeden z `_OFFLINE_IMAGES` (np. `aurora-pool` czy podobny mapped) lub dodać fallback wizualny. |
| 12 | Affordance | low | Listing — desktop card | Po usunięciu CTA „Foglalás" karta nie ma jasnego „call to action" — cena jest mocna, ale nie wygląda jak link. | Zostawić jak jest (cena → CTA semantycznie), ale dodać drobny chevron `→` przy cenie na hoverze karty. |
| 13 | Microcopy | low | PDP — mobile | Indicator „X / 68" — total „68" jest hard-coded a swipe sekwencja ma tylko 5 zdjęć. Mylące. | Albo zmienić na „X / 5" (zgodne z sekwencją swipe), albo zostawić 68 ale opatrzyć tooltipem „dotknij aby zobaczyć wszystkie". |

## Details per Area

### 1. Visual Hierarchy & Layout — OK
- CTA dominuje na każdym kroku flow ✓ (pomarańcz `--c-cta`).
- Cards są dobrze pogrupowane, breadcrumbs są ledwie widoczne (mała czcionka), 3-above-fold target na listingu trzymany (zmierzone 888/900px).
- Wstawiony score-block obok nazwy hotelu poprawia grupowanie identity (decyzja H2: zgrupować score + nazwa + gwiazdki).

### 2. Typography & Readability — needs improvement
**Pomiary z listing mobile (`html[data-view="mobile"]`):**

| Element | font-size | Status |
|---|---|---|
| Hotel name (h3) | 14.5px | borderline |
| Location | 11.5px | **za mało** |
| Stars row | 11px | dekoracyjne OK |
| Facts row | 11.5px | **za mało** |
| Badge | 9.5px | **bardzo za mało** |
| Score-num | 12.5px | borderline |
| Price-unit | 10.5px | **za mało** |
| Quick chip | 11.5px | **za mało** |
| Mobile-filter-btn | 11.5px | **za mało** |
| Big-price | 18px | OK ✓ |

Linia tekstu (line-length) — OK na desktop (~70 ch), trochę za szeroka na PDP body na desktop bez paddingu.

### 3. Color & Contrast — OK
- Hotel name color `rgb(31,111,224)` (`--info`) na `#fff` → ~5.5:1 → AA pass.
- Body text `--ink-700` (#394654) na `#fff` → ~9:1 → AAA pass.
- Score num white na `--c-success` (#1F7F3E) → ~5.6:1 → AA pass.
- CTA white na `--c-cta` (#E85A00) → ~3.6:1 → AA pass dla 18px+, fail dla normal text — ale CTA jest dużym przyciskiem, OK.
- Po zmianach w sesji palette jest restrained: tylko CTA pomarańcz, score zielony, VIP pinkowo-czerwony, wyżywienie 3 wariant. Reszta neutralna szarość.

### 4. Spacing & Alignment — OK
- Spacing scale spójny (4/6/8/10/14/24px).
- Card grid uniform: 240–280px img + 1fr info + 190–220px price.
- Alignment OK. Drobne: mobile checkout footer „38 600 Ft" tekst clipping na dole (przykryty toolbar?).

### 5. Navigation & IA — OK
- Breadcrumbs widoczne na listingu i PDP.
- Sticky search-pad na listingu z slide-in lm-toggle+sort.
- Subnav PDP (Áttekintés / Szobák / itd.) sticky.
- 6-screen flow jednorodny, każdy ekran linkuje wstecz do dashboardu jeśli potrzeba (przez brandbar logo).

### 6. Forms & Input — needs improvement
- Inputy mają widoczne label powyżej ✓.
- Required marker (*) widoczny ✓.
- Pre-filled email "te@example.com" — placeholder OK.
- **Brak inline validation** — pola walidowane są dopiero po submit (typowe dla prototypu, OK ale do notowania).
- **Phone field `HU +3…` ucinka się** na mobile (textfield za wąski).

### 7. Feedback & Status Communication — OK
- Stepper checkout/payment komunikuje progres jasno (zielone done, dark active, light inactive).
- Tweaks indicator pokazuje aktywne ustawienia dev-tools.
- Carousel ma dot indicator + arrow visibility na hover (need: też focus).

### 8. Error States & Recovery — not tested
Prototyp ma `forceNoReviews`, `forceNoPhotosCat`, `forceSoldOut`, `forceLoading` tweaks — istnieją edge states, ale nie były sprawdzane w tej rundzie review.

### 9. Loading & Performance — OK
- Babel-in-browser jest celowe, akceptowalne.
- Brak skeleton screens (małe znaczenie dla prototypu).
- Pierwsze ładowanie ~1–2s.

### 10. Responsive Design — needs improvement
Mobile preview konstrukcja: 375px constrainted column. Każdy ekran ma `html[data-view="mobile"]` overrides. Działa, ale typografia (Area 2) ucierpiała na rzecz mieszczenia treści.

### 11. Interactive Elements & Affordances — needs improvement
- Buttony mają jasną hierarchię.
- Hover-states: card box-shadow + border darken, OK.
- **Focus-visible nie jest jawnie zdefiniowany** — domyślny browser ring na większości elementów (czasem niewidoczny przez CSS reset).
- Carousel arrows ukryte do hovera — niedostępne przy nav klawiatury.

### 12. Consistency & Design System — OK
- Search bar pattern unifikowany cross-screen (radius-lg, line-strong border, embedded CTA).
- Score badge wszędzie square 8px radius.
- Score regrouping zrealizowane na listingu — TODO sprawdzić czy homepage używa tej samej formy (różnica notowana w finding #8).

### 13. Accessibility — needs improvement
- Wszystkie 8 hotel images ma `alt` ✓.
- Carousel arrows/dots mają `aria-label` (po dzisiejszych zmianach) ✓.
- Heart button ma tekstowy znak (♡/❤) ale brak aria-label „Mentés".
- `.hotel-card` klikalny `<div>` — finding #3.
- Brak skip-to-content link.
- Brak strukturalnego heading flow (na listingu jest h1, h3 dla hoteli — brak h2 dla sekcji).

### 14. Content Quality & Microcopy — OK
- Strings spójne, Hungarian.
- Empty state nie zaobserwowany w trakcie review.

### 15. User Flow & Task Completion — OK
- 6-step flow z jasnym progress na checkout/payment.
- Stepper pokazuje gdzie jest user.

### 16. Empty States & Edge Cases — not tested
(viz Area 8)

### 17. Mobile & Touch — needs improvement
- Wszystko widoczne w portrait 375px.
- Sticky toolbary na listing + checkout/payment działają.
- **Tap targets za małe** (finding #2).
- Swipe wprowadzone w tej sesji ✓.

## UX Quick Wins
1. **Mobile typography scale-up** — globalna podbitka czcionek ciała na mobile: body 11.5→13px, badge 9.5→11px, priceunit 10.5→11.5px. ~30 min.
2. **Tap targets** — heart 28→36px, chip padding 5→8px wertykalnie, mobile-filter-btn padding wzwyż. ~20 min.
3. **Focus-visible global ring** — `*:focus-visible{outline:2px solid var(--ink-900);outline-offset:2px}` z override dla CTA. ~10 min.
4. **Checkout disclosure buttons w szarość** — neutralizacja pomarańczu `+ Számlázási cím`/`+ Speciális kérés`/`+ Akciós kód`. ~10 min.
5. **Carousel arrows visible on focus-within** — `.hotel-card:focus-within .card-arrow{opacity:1}`. ~5 min.

## Strategic UX Recommendations
- **Semantic clickable cards** — `.hotel-card` powinno być `<a>` lub mieć `role="button"` + tabindex + Enter/Space handlery. Większa zmiana, wymaga przemyślenia hover/focus.
- **Inline form validation** — checkout/payment dodać onBlur validate z helper text. Wykracza poza prototyp, ale wskazane jeśli wchodzi w testy z usability.
- **Heading hierarchy audit** — sekcje listingu/PDP dodać h2 na grupy ("Találatok", "Szűrők") dla screen readerów.

## Flow Analysis

### Flow: Booking funnel (Homepage → Listing → PDP → Checkout → Payment → Thankyou)
- **Steps:** 6 ekranów
- **Friction points:** mobile font sizes (Area 2) — user musi zoomować aby przeczytać szczegóły hotelu w karcie.
- **Drop-off risk:** checkout step 2 — orange disclosure buttons mogą rozpraszać od głównego CTA „Foglalás elküldése →"; user może klikać w nie przez pomyłkę.
- **Recommendation:** zaadresować Quick Wins 1, 2, 4 i ponownie zmierzyć całkowity flow.

## Accessibility Summary
- WCAG AA compliance: **partial** (kontrasty OK, ale tap-targety i focus-visibility nie)
- Keyboard navigability: **partial** (nie wszystkie kontrolki dostępne klawiaturą — klikalny div hotel-card)
- Screen reader compatibility: **not tested** (zalecane: ręczny test z VoiceOver/NVDA na listingu i PDP)
- Contrast issues: **0** (wszystkie zmierzone teksty pass AA)
- Missing alt text: **0** ✓

## Responsive Summary

| Viewport | Status | Key Issues |
|----------|--------|------------|
| Desktop (~1280x800) | OK | Drobne: quote text 11.5px za mały (low) |
| Mobile (375px) | needs improvement | Typografia (Area 2), tap targets (Area 17) |

## Audit Statistics
- Screens reviewed: 6
- States captured: 12 (6 screens × 2 viewports + 2 interaction states)
- Findings: 4 critical, 5 medium, 4 low
- Areas OK: Visual Hierarchy, Color & Contrast, Spacing & Alignment, Navigation & IA, Feedback, Loading, Consistency, Content, User Flow
- Areas needs improvement: Typography, Forms & Input, Responsive Design, Interactive Affordances, Accessibility, Mobile & Touch
- Areas problem: (none — typography & a11y zaklasyfikowane jako needs improvement z krytycznymi findingami)
- Areas not tested: Error States, Empty States

## Next Step

Sugerowane: `/impl-guide docs/audits/ux-review-report-v1.md critical` w nowej sesji żeby przekonwertować critical findings na karty implementacji. Lub bezpośrednia szybka iteracja Quick Wins 1-5 (estymata: ~75 min łącznie).
