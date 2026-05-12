# 02 — Plan iteracyjnego update'u prototypu prezesa (techniczne prompty)

> **Source of truth po ludzku:** [plan.md](plan.md) — 21 kroków w aktualnej kolejności.
> Ten dokument zawiera **techniczne szczegóły promptów** dla claude.ai/design. Niektóre z oryginalnych 21 promptów Wave 1-3 zostały **wyrzucone z planu wizualnego** (W1.3 schema-tweaks, W1.4 unifikacja `HOTEL.facts`, W1.6 SEO/a11y, W3.3 affiliate na PDP, W3.4 mobile a11y). Zostają w pliku jako reference techniczny, ale **w realnym wykonaniu** uruchamiamy tylko prompty wymienione w plan.md.

**Kolejność wykonania (4 fale, 21 kroków):**
- **Fala 1 (PDP wizualne):** W1.1 → W1.2 → W1.5 → W1.7 → W1.8 (kroki 1-4 z plan.md; W1.3/W1.4/W1.6 wyrzucone)
- **Fala 2 (dopieszczenie):** W3.1 → W3.2 → W3.5 → W3.6 → W3.7 → W3.8 → W3.9 → W3.10 (kroki 5-11; W3.3/W3.4 wyrzucone)
- **Fala 3 (strukturalne, mapa na końcu):** W2.2 → W2.3 → W2.1 (kroki 12-14; mapa W2.1 na finisha)

> **Uwaga o numeracji:** w starszej wersji plan miał inną kolejność wykonania. Aktualnie numeracja faz w `plan.md` (Fala 1/2/3/4) odzwierciedla faktyczną kolejność. Stare oznaczenia W1.*/W2.*/W3.* w tym pliku to identyfikatory promptów (NIE numery faz) — zachowane dla referencji historycznej.

---


**Wejście:** `prototype/Hotel Aurora Balaton.html` (single-file React+Babel, ~36k linii) — ten plik wrzucamy do Claude Design (Claude.ai → Artifacts albo Claude Code w trybie iframe-preview).
**Output:** ten sam plik, ewolucyjnie zaktualizowany w **3 fal**, podzielonych na 14 promptów. Każdy prompt jest **samodzielny**, kopiuj-wklej do Claude Design.
**Konwencja:** każdy prompt zawiera 3 bloki — **GOAL** (po co), **CONTEXT** (skąd biorę dane), **ACCEPTANCE** (kiedy uznaję za zrobione). Prompt jest zorientowany na konkretne zmiany, nie na „popraw UX ogólnie" — bo „popraw UX" daje śmieci.

---

## 0. Setup — jak pracować z plikiem w Claude Design

1. **Otwórz Claude.ai → New Artifact** (lub w Claude Code: `claude` w folderze prototype, potem każ mu pracować na pliku `Hotel Aurora Balaton.html`).
2. **Każdy prompt wklejaj jako oddzielną iterację**. NIE łącz dwóch fal w jednym prompt'cie — model gubi kontekst po ~50k tokenów zmian.
3. **Po każdej iteracji**: zrób `git commit` (nawet jeśli to luźny prototyp — wartość rollback'u jest gigantyczna).
4. **Walidacja**: każdy prompt ma listę acceptance criteria → przeczytaj output i zaznacz, co się zgadza. Jeśli nie zgadza — daj follow-up: „Krok X nie zadziałał: <opis>. Popraw."
5. **Backup**: trzymaj kopię oryginału jako `Hotel Aurora Balaton.original.html` zanim ruszysz.

```bash
cd "prototype"
cp "Hotel Aurora Balaton.html" "Hotel Aurora Balaton.original.html"
git init && git add -A && git commit -m "baseline: CEO prototype as-is"
```

---

## Wave 1 — Hero / Sidebar / IA fixes (P0 blokujące + P1 widoczne)

Cel fali: dostarczyć **wizualnie znacznie lepszą wersję** PDP w 1 sesji pracy z Claude Design (≈90 min). Po fali screenshot powinien rozwiązywać 80% kółek prezesa z `draw-*.png`.

### Prompt W1.1 — Fix hero whitespace + score badge alignment

```
GOAL: Napraw pustkę w hero PDP zaznaczoną przez prezesa na uploads/draw-0e62f167-959b-4a2a-85d5-47aed557128d.png i draw-61c58dd0-6b86-4c2f-ab05-f8a944b621c9.png.
Obecnie `top-row` ma flex `gallery | sidebar`, a `ReviewBadge` jest absolutnie pozycjonowany (`marginTop:-86px`) nad galerię — to kruche. Hero header zostawia 400+ px pustki obok hotel-name, bo `hotel-title-row` jest flex `justify-content:space-between` ale po prawej nic nie ma.

CONTEXT:
- Plik: `Hotel Aurora Balaton.html`
- Sekcje do tknięcia: `<HotelHeader>` (linia ~34673), `<ReviewBadge>` (linia ~34691), `<App>` `.top-row` (linia ~36011), `.page` (CSS w `<style>`)
- Live szallas.hu PDP umieszcza score w `hotel-title-row` po prawej stronie, w jednej linii z nazwą i adresem (patrz Deliverable 1 §8.4)

CHANGES (dokładnie):
1. W `HotelHeader`: zmień `hotel-title-row` na CSS grid `1fr auto` z `align-items:flex-start`. Dodaj prop `score`, `scoreLabel`, `reviewCount` i wrenderuj `<ReviewBadge>` w drugiej kolumnie grid, BEZ absolutnego pozycjonowania.
2. Usuń z `<App>` `.top-row > div > div style={{display:"flex", justifyContent:"flex-end", marginTop:-86, ...}}` (cały wrapper z ReviewBadge).
3. W CSS:
   - `.hotel-header { padding-bottom: 16px; }`
   - `.score-pill { padding:10px 14px; min-width:200px; }` — większy badge jak na live (zielony fill).
   - `.review-badge-num { background: var(--c-success); color: #fff; font-size: 28px; padding: 8px 14px; border-radius: 12px; }` — zamień jasny pill na zielone kółko jak live (Deliverable 1 §8.4).
4. `.page` zmień z flexa na CSS grid `1fr 360px` `gap: 24px` `align-items:start`.
5. Sidebar `position: sticky; top: 84px;` zostawić.

ACCEPTANCE:
- Po hot-reload: na widoku 1440×900 nie ma pustki obok hotel-name; score-badge jest w jednej linii z H1.
- Score-num jest na zielonym kółku z białą cyfrą.
- Galeria + sidebar tworzą czysty 2-kolumnowy layout bez `marginTop:-86`.
- Resize do 1024 — sidebar wskakuje pod galerię (mediaquery, zostaw `@media (max-width: 1100px)` na grid `1fr` jak było).
```

### Prompt W1.2 — Sidebar slim-down + 90-day forecast + IFA

```
GOAL: Sidebar `SidebarCard` ma w stanie pre-selection 9 elementów wizualnych. Zredukuj do 6 i dodaj 2 fiche'a z live szallas.hu, których nie ma w prototypie: (a) `A következő 90 nap legkedvezőbb irányára` przed wyborem daty, (b) breakdown `Előrefizetendő` / `A szálláshelyen fizetendő (IFA)` po wybraniu pokoju.

CONTEXT:
- `SidebarCard` (linia ~34904)
- Deliverable 1 §8.4 (przed datą = forecast 90-day; po wyborze = IFA explicite)
- Live: `A szálláshelyen fizetendő 3 000 Ft` (IFA = idegenforgalmi adó, ~4% w HU, do uiszczenia w hotelu)

CHANGES:
1. Dodaj do `HOTEL.pricing` (data, linia ~34188) nowe pola:
   - `next90dMinPrice: 56400` (HUF total, 2 nights default)
   - `ifaRate: 0.04` (4% lokalny podatek miejski)
2. W `SidebarCard` pre-selection state (brak `hasSelection`) wymień zawartość:
   - Eyebrow `A KÖVETKEZŐ 90 NAP LEGKEDVEZŐBB IRÁNYÁRA` (mały caps)
   - Cena big (z formatera `fmt`)
   - Pod ceną: small text `2 fő, 2 éj · ÁFA-val · IFA 3% külön a helyszínen` (osobno, mniejszy szary)
   - Urgency tylko jeśli `tweaks.showUrgency && room.realStockLeft <= 3` (ograniczenie do realnych danych)
   - Primary CTA `Szobát választok`
   - Pod CTA 3 trust-pills horizontal (free cancellation tylko jeśli `room.refundable`, free Wi-Fi, free parking) — nie 5+, MAX 3
   - Link `Co zawiera cena ▾` (collapsible, na kliknięcie pokazuje breakdown)
3. W stanie post-selection (`hasSelection`):
   - Dodaj sekcję `Mikor fizetek?` z dwiema liniami: `Előrefizetendő: <prepayTotal> Ft (eddig <prepayDate>)` i `A szálláshelyen (IFA): <ifaTotal> Ft`
   - Cena `Teljes ár` jako suma obu
   - Cancellation policy DYNAMICZNIE z rate'u (`rate.cancellation`), NIE hardcoded „ápr. 16-ig"
4. Wytnij: `vip-pill-row` w pre-state, save-badge `−15%`, social-proof line — przenieś social-proof do tweaks-only (i tak ma być default OFF).

ACCEPTANCE:
- Sidebar pre-selection ma <= 6 elementów wizualnych (count: eyebrow, price, sub, CTA, 3 pills jako jeden komponent, link).
- Po wyborze pokoju widać: `Előrefizetendő` i `A szálláshelyen (IFA)` jako osobne linie.
- Strikethrough oryginalnej ceny pokazuje się TYLKO gdy `rate.original` istnieje i jest > `rate.price`.
- Hardcoded „ingyenes lemondás ápr. 16-ig" zamienione na `rate.cancellationCopy`.
```

### Prompt W1.3 — Per-property tweak schema + realistic VIP

```
GOAL: Tweaks panel modeluje **per-property config** („dla TEJ oferty, które dźwignie są ON"), NIE globalny opt-in/opt-out. W prod każdy tweak włącza się gdy backend ma realne dane dla danej oferty (np. urgency gdy rate.realStockLeft <= 3). Dodaj formalny `TWEAK_SCHEMA` jako kontrakt z backendem, dodaj per-tweak hint w UI, skoryguj VIP z −40% na 10–20% (live: max 20%).

CONTEXT:
- `TweaksPanel` (linia ~35793) — to demo-tool A/B do review prototypu, nie user-facing produkt
- `App` initial state `tweaks` (linia ~35894) — obecnie tylko `priceMode: "total"`, boolean tweaks są undefined (OFF)
- `SidebarCard` VIP teaser (linia ~34925) — multiplier 0.6 (40% off), trzeba 0.85 (15% off)
- Live: VIP banner mówi `Akár 10-20%`, panel sugeruje że są tier'y (VIP1=10%, VIP2=15%, VIP3=20%)

CHANGES:
1. Dodaj obok `HOTEL` (linia ~34188) nowy obiekt:
   ```js
   const TWEAK_SCHEMA = {
     showUrgency:     { source: 'rate.realStockLeft', activeWhen: '<= 3', copy: 'Utolsó {n} szoba ezen az áron', fallback: 'off' },
     showSocialProof: { source: 'hotel.viewers24h',   activeWhen: '>= 50', copy: '{n}-en nézték az elmúlt 24 órában', fallback: 'off' },
     showPriceAnchor: { source: 'rate.originalPrice', activeWhen: '> rate.price', copy: 'strikethrough', fallback: 'off' },
     showVipTeaser:   { source: 'hotel.eligibleForVip', activeWhen: '=== true', copy: 'VIP −{discountPct}%', fallback: 'off' },
     priceMode:       { source: 'market.config',      values: ['total','nightly','per-person'], default: 'total' },
     loggedIn:        { source: 'session.user',       activeWhen: '!= null', fallback: 'guest' },
     bookingBarStyle: { source: 'theme.config',       values: ['default','red'], default: 'default' },
   };
   window.TWEAK_SCHEMA = TWEAK_SCHEMA;
   ```
2. W komentarzu nad `TweaksPanel`:
   ```
   // Tweaks panel = demo-tool dla A/B exploration podczas review prototypu.
   // W prod NIE jest user-facing — config przychodzi z backendu per oferta (patrz TWEAK_SCHEMA).
   // Każdy tweak w prod aktywuje się TYLKO gdy backend wystawia realne dane (patrz `source` i `activeWhen`).
   ```
3. W `TweaksPanel` pod każdym switchem dodaj small-text monospace z `TWEAK_SCHEMA[key].source` — jako visual hint skąd dane.
4. `App` initial state zostaw `{ priceMode: "total" }` (jest OK — boolean tweaks są undefined = OFF). Ale dodaj wariant „demo mode": jeśli `window.__DEMO_FULL__ === true`, ustaw wszystkie tweaks na ON żeby pokazać max-stan dla review (na potrzeby zrzutu ekranu).
5. **VIP fix** (osobno od schema, bo to konkretna liczba):
   - W `SidebarCard` zmień multiplier z `0.6` na `0.85` (15% to środek skali 10–20%).
   - `vip-tag-inline` text z `VIP −40%` na `VIP −15%`.
   - W `VipTeaser locked` zmień copy z „VIP ár" na „VIP-ár · 10–20% kedvezmény tagoknak".
6. **Fabryczny strike fix** (krytyczne, P0):
   - W `SidebarCard` (linia ~34906) usuń `const original = Math.round(fromPrice * 1.18)`.
   - Strike-through renderuj TYLKO gdy `rate.original && rate.original > rate.price`. Bez fabrycznego multiplier'a.
   - To samo w `RoomCard` rate-row price-col.

ACCEPTANCE:
- `window.TWEAK_SCHEMA` jest zdefiniowane i ma 7 wpisów z `source`.
- W TweaksPanel pod każdym switchem widać szary monospace z nazwą field'u z backendu.
- VIP discount w sidebar pokazuje 15% (nie 40%); `vip-tag-inline` mówi `VIP −15%`.
- W kodzie znika linijka `Math.round(fromPrice * 1.18)`.
- Strike-through renderuje się tylko dla rate'ów z realnym `original`.
- Komentarz nad TweaksPanel jasno mówi że to demo-tool, nie produktowy lever.
```

### Prompt W1.4 — Highlights → ranked `HOTEL.facts` (jedno źródło dla desktop+mobile)

```
GOAL:
(a) 8 highlights to dużo na fold; redukcja do top 6 + button "+2 további".
(b) Highlights na desktop i Quick-Extract na mobile (W3.7) MUSZĄ być z jednego ranked-source — `HOTEL.facts` z `priority`. To pozwoli w prod backendowi serwować per-property najważniejsze fakty (beach hotel: dystans do morza wysoko; business hotel: Wi-Fi/centrum wysoko; wellness: spa wysoko).

CONTEXT:
- `<Overview>` (linia ~34877), obecne `HOTEL.highlights` (linia ~34201) — 8 hardkodowanych, BEZ priority
- `<MobileQuickExtract/>` (W3.7) używa 4 hardkodowanych
- Backend kontekst: per-property facts pochodzą z miksu (a) eksplicitnych USP hotelu, (b) realnej lokalizacji POI distance, (c) ammenities, (d) board, (e) keyword'ów top-N reviews

CHANGES:
1. Zamień `HOTEL.highlights` na **ranked `HOTEL.facts`** array, każdy obiekt:
   ```js
   {
     id: 'beach-distance',
     priority: 95,           // 0-100, backend-supplied
     icon: 'beach',           // klucz w highlightIcon mapie
     emoji: '🏖️',            // fallback dla mobile QuickExtract
     title: '120 m a parttól',
     sub: 'Saját strandszakasz',
     scrollTo: 'location',   // sekcja anchor dla mobile click
     source: 'poi.distance.beach',  // skąd backend wyciąga — udokumentowanie
     audience: 'family,couple,wellness'  // dla kogo trafny; backend może re-rankować per persona
   }
   ```
2. Mock-data dla Aurora Balaton: 10 facts z różnymi priority (95 beach-distance, 90 free-cancellation, 85 wellness, 80 breakfast-included, 78 free-parking, 75 wi-fi, 70 pet-friendly, 65 family-animation, 60 szep-card, 55 ac-rooms).
3. Helper `selectTopFacts(facts, n, audience?)` — sortuje po `priority` desc, opcjonalny re-rank dla audience (np. business → wybierz facts z `audience.includes('business')` na top, inne niżej).
4. `<Overview>` desktop: `selectTopFacts(HOTEL.facts, 6)` + 7-my kafelek button "+N további" (link do `#amenities`).
5. `<MobileQuickExtract/>` (W3.7): `selectTopFacts(HOTEL.facts, 4)` — automatycznie te same top-4 co kafle 1-4 na desktop, ale w 2×2 grid z emoji zamiast SVG-icon.
6. Komentarz w kodzie nad HOTEL.facts:
   ```
   // W prod: backend dostarcza HOTEL.facts już zrankowany dla danej oferty
   // i opcjonalnie persony użytkownika (z user-history lub query params).
   // Wartości priority 0-100, źródła w `source` field (auditowalne).
   ```
7. Description: usuń `.desc-fade-teaser` fade-mask; pierwszy paragraf zawsze, drugi `Tovább olvasom →` jak teraz.

ACCEPTANCE:
- `HOTEL.facts` ma >= 10 wpisów z `priority`, `source`, `audience`.
- Desktop `<Overview>` pokazuje top-6 + przycisk "+N további".
- Mobile QuickExtract (W3.7) pokazuje top-4 z TYCH SAMYCH `HOTEL.facts` (źródło unified).
- Zmiana `priority` w mock-data zmienia kolejność na obu (test: zmień beach-distance priority z 95 na 50 → spadnie z 1-szego na 5-ty).
- Description bez fade-out gradient.
```

### Prompt W1.5 — Reviews: ikony typu podróży zamiast inicjałów + filtry

```
GOAL: Live używa ikon typu podróży (Család kisgyerekekkel, Középkorú pár) zamiast avatarów z inicjałami — to bardziej informacyjne. Zmień prototyp.

CONTEXT:
- `<Reviews>` (linia ~35362), `HOTEL.reviews` (linia ~34280)
- Dane mają już `when: "2 hete · Család gyerekekkel · 3 éjszaka"` — parsuj typ z `when`

CHANGES:
1. W `HOTEL.reviews` rozszerz każdy review o pole `travelType: "family"|"couple"|"business"|"solo"` (na podstawie istniejącego `when`).
2. W `<Reviews>` `review-card`: zamiast `<div className="avatar">{rv.initials}</div>` użyj `<div className="rev-icon rev-icon-{travelType}">{icon}</div>`. Ikony:
   - family → Users z lucide-style
   - couple → Heart
   - business → Briefcase
   - solo → User
3. CSS `.rev-icon { width: 44px; height: 44px; border-radius: 12px; background: var(--surface-3); color: var(--ink-700); display: inline-flex; align-items: center; justify-content: center; }`. Per-type tinting opcjonalnie.
4. Dodaj nad `review-list` filter chips: `Mind | Család | Pár | Üzleti | Egyedül` (jako toggle, filtruje po `travelType`).
5. Dodaj counter „mutatok X / Y véleményt" pod chipami.

ACCEPTANCE:
- Reviews pokazują ikonę typu podróży zamiast inicjałów.
- Filtr chips są klikalne i filtrują live (state).
- Liczba „mutatok N / 1247" się aktualizuje przy filtrze.
```

### Prompt W1.6 — Schema.org + a11y modale + click handlers

```
GOAL: Dodaj minimalny komplet schema.org dla SEO + popraw a11y w modalach. To są P0 dla produkcji.

CONTEXT:
- Plik HTML — dodaj `<script type="application/ld+json">` w `<head>`.
- Modale: `<GalleryModal>`, `<RoomGalleryModal>`, `<BookingModifier>` popovers.
- Click handlers na `<div>` w `<Gallery>` i `<HotelHeader>`.

CHANGES:
1. W `<head>` dodaj 3 bloki JSON-LD:
   - `Hotel` (name, address, telephone, image, priceRange, starRating)
   - `AggregateRating` (ratingValue, reviewCount, bestRating, worstRating)
   - `FAQPage` (mainEntity[] z HOTEL.faq)
2. W `<meta name="description" content="..."/>` wstaw 150-znakowy opis hotelu.
3. W `<GalleryModal>` i `<RoomGalleryModal>`:
   - Top `<div className="lightbox" role="dialog" aria-modal="true" aria-labelledby="lb-title">`
   - `<button>` przyciski nawigacji już są — sprawdź czy mają `aria-label`.
   - Focus-trap: użyj prostej implementacji — po otwarciu modal, focus na pierwszym fokusowalnym; przy Tab i Shift+Tab cykl wewnątrz modal; Esc zamyka.
   - Po zamknięciu — return focus do triggera.
4. Zamień `<div className="gallery-hero" onClick={onOpen}>` na `<button className="gallery-hero" onClick={onOpen} aria-label="Otwórz galerię, 68 zdjęć">`. Reset CSS button.
5. Stepper w `rate-row` action: dodaj `aria-live="polite"` na div ze stepper, `aria-label={"Wybrano ${n} pokoi tego typu"}`.
6. `<FakeMap>`: dodaj `<title>` i `<desc>` w SVG, `role="img"`, `aria-labelledby`.

ACCEPTANCE:
- View-source: 3 bloki JSON-LD w head.
- Lighthouse accessibility ≥ 90 (raczej osiągniemy po tym).
- Esc w modalach zamyka; Tab nie ucieka poza modal.
```

### Prompt W1.7 — Rate-row enhanced meal visibility + edge-case wielu wariantów

```
GOAL:
(a) Wyżywienie (board/ellátás) w rate-row jest słabo widoczne — to mała kolumna tekstem, podczas gdy to KLUCZOWY differentiator między rate'ami. Wzmocnić wizualnie.
(b) Aktualne dane mają 2–3 rate'y per pokój. Dodaj mock-pokój z 5 rate'ami i UX wzorzec: pokazuj 3 + gradient-fade + chevron "+N további tarifa" → ekspansja.

CONTEXT:
- HOTEL.rooms (linia ~34217) — aktualnie r1 ma 3 rate, r2 ma 2, r3 ma 2
- RoomCard rate-table (linia ~35147)
- Live szallas.hu używa zielonych chipów dla wyżywienia ("Félpanzió az árban", "All inclusive ellátással", "Reggeli az árban") — bardzo czytelne

CHANGES:
1. Dodaj r4 do HOTEL.rooms z 5 rate'ami: "Reggelivel" / "Reggeli + üveg prosecco" / "Félpanzió" / "Félpanzió + wellness" / "Teljes ellátás (AI light)" — różne ceny, mix free-cancel/non-refundable.
2. W `rate-row` `r-opts` przed `r-tags` dodaj wzmocniony `<MealPill board={r.board}/>`:
   - **TYLKO 2 KOLORY TŁA** (zgodnie z konwencją live szallas.hu — "Reggeli az árban", "Félpanzió az árban", "All inclusive ellátással" wszystkie zielone):
     - **Zielony bg `#E8F5EC`** dla wszystkich opcji z wyżywieniem (ikona różna per typ):
       - "Reggelivel" / "Reggeli az árban"  → 🍳 + tekst
       - "Félpanzió" / "Reggeli + vacsora"  → 🍽️ + tekst
       - "Teljes ellátás" / "All inclusive" → 🥂 + tekst
     - **Szary bg `#ECEEF2`** dla "Csak szállás" → 🛏️ + tekst (muted color)
   - Pill: padding 6px 10px, border-radius 8px, font-weight 700, display inline-flex, gap 6px
   - Wyrzuć starą kolumnę `.board` (lub zostaw jako screen-reader-only)
3. W `RoomCard` gdy `room.rates.length > 3` (state per room w komponencie Rooms):
   - Renderuj 3 pierwsze rate'y normalnie
   - 3-ci rate ma `mask-image: linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.3) 100%)`
   - Pod listą button `<button className="rate-expand">+{rates.length-3} további tarifa <I.ChevD/></button>` z border var(--line), bg var(--surface-2)
   - Stan `expandedRooms` w `<Rooms>` jako `Set<roomId>`; klik toggluje
   - Po expand: mask znika, lista pełna, button text "Kevesebb tarifa" + ChevU
4. CSS .rate-expand: width 100%, padding 12px, font-weight 600, color var(--ink-700), hover bg var(--surface-3).

ACCEPTANCE:
- r4 ma 5 rate'ów; przed expand widoczne 3 z gradient fade na 3-cim.
- Klik chevron rozwija pozostałe 2; tekst i ikona button się zmieniają.
- Każdy rate ma kolorowy meal-pill (4 warianty kolorystyczne).
- Stara `.board` kolumna usunięta (lub sr-only) — nie ma duplicate.
```

### Prompt W1.8 — Filter chips na recenzjach i galerii (5 kategorii)

```
GOAL: Reviews i Gallery dostają wspólny filter-chip pattern z 5 kategoriami: Szoba / Étkezés / Objektum / Környék / Szolgáltatások. Pomaga userowi precyzyjnie wyszukać "pokój" lub "śniadanie".

CONTEXT:
- Reviews (linia ~35362) — obecnie tylko score+bars+lista (po W1.5 dochodzi filtr typu podróży)
- GalleryModal lb-cats (linia ~34816) — obecnie `GALLERY_CATS = ["Szoba","Wellness","Étterem","Strand","Kilátás","Közös terek"]`
- Spójność: 5 wspólnych kategorii w obu modułach

CHANGES:
1. Wprowadź:
   ```js
   window.CONTENT_CATEGORIES = [
     { id: 'room',       label: 'Szoba',           icon: 'Bed' },
     { id: 'food',       label: 'Étkezés',         icon: 'Utensils' },
     { id: 'property',   label: 'Objektum',        icon: 'Building' },
     { id: 'area',       label: 'Környék',         icon: 'Pin' },
     { id: 'amenities',  label: 'Szolgáltatások',  icon: 'Sparkle' }
   ];
   ```
   Stary `GALLERY_CATS` usuń.
2. W `HOTEL.reviews` dodaj `categories: ['room','food']` per review. Mock: heurystyka po treści (śniadanie/reggeli → food, szoba/pokój → room, strand/parking/környék → area, wellness/medence → amenities, hotel/személyzet → property).
3. W `<Reviews>` dodaj `<CategoryFilterChips/>` nad listą (między summary a review-list). Single-select, radio behavior, default "Mind". Counter per chip: `(N)`.
4. W `<GalleryModal>` `lb-cats`: zamień na CONTENT_CATEGORIES. Każdy chip z counter (np. "Szoba 24"). Mock-gen photos: dla seed'a `room-*` → category room; `food-*` / `restaurant-*` → food; `pool-*` / `wellness-*` → amenities; `view-*` / `balcony-*` → property; `beach-*` / `surroundings-*` → area.
5. Dla obu (Reviews i Gallery): jeśli filtr daje 0 wyników, pokaż `<EmptyState/>` z ikoną + tekst "Nincs eredmény ebben a kategóriában — válassz másikat" + button "Reset szűrő".
6. Filtr Reviews jest INDEPENDENT od filtra travel-type z W1.5 (oba można nakładać → AND).

ACCEPTANCE:
- W Reviews i Gallery widoczne TE SAME 5 chipów z ikonami.
- Counter per kategoria działa.
- Klik chipu filtruje live; klik aktywnego = reset do "Mind".
- Empty state z reset-button gdy 0 wyników.
- Filtr Reviews kompozytowy z travel-type (multi-filter AND).
```

---

## Wave 2 — Map / edge states / performance (P0+P1 strukturalne)

Cel fali: zamienić fake-map na real-map, dodać empty/sold-out states, ekstrakcja tokens, perf hints. ≈2 sesje pracy.

### Prompt W2.1 — Real map z Leaflet + POI overlay

```
GOAL: Wymień `<FakeMap>` na realną mapę używając Leaflet (open source, lekka, ~40kB). POI z `HOTEL.poi` jako markery z różnymi ikonami per kategoria. Hover na POI = highlight w liście POI obok.

CONTEXT:
- `<FakeMap>` (linia ~35421)
- `<Location>` (linia ~35476)
- `HOTEL.poi` (linia ~34308) — kategorie: Látnivalók, Étterem-kávé, Közlekedés

CHANGES:
1. Dodaj do `<head>`:
   ```html
   <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
   <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
   ```
2. Wymień `<FakeMap>` na `<RealMap>` komponent React, który:
   - W `useEffect` inicjalizuje `L.map(divRef, { center: [46.9034, 18.0561], zoom: 14, scrollWheelZoom: false })`.
   - Dodaje OSM tile-layer: `L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap', maxZoom: 19 })`.
   - Hotel-marker z custom DivIcon (czerwone kółko z białym H w środku, var(--c-primary)).
   - Iteruje `HOTEL.poi` → dla każdego POI marker DivIcon: kategoria `Látnivalók` = niebieski, `Étterem-kávé` = pomarańczowy, `Közlekedés` = szary. Tooltip z nazwą + odległością.
   - Cleanup: `map.remove()` w cleanup `useEffect`.
3. Dodaj props `highlightPoi` (string) — gdy ustawione, mapa centruje na tym POI z `flyTo` i otwiera popup.
4. W `<Location>` lista POI po prawej obok mapy: dodaj `onMouseEnter={()=>setHighlightPoi(name)}` na każdym `<li>`.
5. CSS `.map { height: 480px; border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-sm); }`.

ACCEPTANCE:
- Mapa się renderuje (real OSM tiles).
- Hover na POI w liście = popup na mapie pojawia się i mapa robi `flyTo`.
- Hotel-marker jest wyraźny (czerwony H).
- Nie ma już SVG-fake mapy.
```

### Prompt W2.2 — Edge states: sold-out, no rates, no reviews, no photos

```
GOAL: Dodaj 4 stany krawędziowe, które muszą działać w prod. Tweaks panel ma 4 nowe switche do testu.

CONTEXT:
- Wszystkie sekcje PDP.

CHANGES:
1. W `Tweaks` dodaj 4 toggle: `Hotel sold out for dates`, `No rates available`, `No reviews`, `No photos in category`.
2. Implementuj:
   - **Sold out**: gdy on, w sidebarze zamiast ceny pokaż `Sajnos a választott időszakra elfogytak a szobák.` + CTA `Más dátum választása` (opens BookingModifier). W liście pokoi każdy room-card ma overlay `Nincs elérhető szoba — Válassz másik dátumot`.
   - **No rates**: dla pojedynczego rate'u w `rate-table`, gdy `rate.unavailable === true`, wyłącz stepper i pokaż info `Foglalt erre az időszakra`.
   - **No reviews**: gdy `HOTEL.reviewCount === 0`, w `<Reviews>` pokaż empty-state z ikoną gwiazdki i tekstem `Új szálláshely — még nincs vendégvélemény. Legyél te az első!`. Sub-nav i sidebar score-badge ukryć.
   - **No photos**: w `<GalleryModal>` gdy kategoria ma 0 fotek, slide pokazuje placeholder + `Még nincs fotó ebben a kategóriában` + CTA przejście do Szoba kategorii.
3. Dla każdego edge-state dodaj inline-comment w kodzie z linkiem do prod-incydentu (placeholder dla teamu).

ACCEPTANCE:
- 4 tweaki sprawiają że PDP wygląda elegancko w empty-state.
- Żaden empty-state nie crashuje render'u.
- Sticky booking-bar w sold-out znika.
```

### Prompt W2.3 — Tokens extraction + skeleton states + image strategy

```
GOAL: Wydziel design tokens do osobnego pliku tokens.css (nawet jeśli wszystko jest w jednym HTML, oddziel w `<style id="tokens">`), dodaj skeleton states do galerii i listy pokoi, popraw image strategy.

CONTEXT:
- `:root { ... }` w `<style>` (linia ~16–72)
- `<Photo>` placeholder
- Gallery + RoomCard image rendering

CHANGES:
1. Wydziel w plik `tokens.css` — albo dodaj `<style id="ds-tokens">` z samymi `:root { --c-primary: #E30613; ... }`. Reszta `<style>` zostaje w `<style id="components">`. Tokens mają być pierwsze w head.
2. Dodaj `--cta` osobny token (na podstawie live: pomarańczowy `#E85A00`) — i drugi wariant `--cta-brand` (czerwony, jak teraz). DECYZJA-OWNER: który ma być default. Zostaw czerwony, ale dodaj komentarz `// AB-TEST: var(--cta) ALT pomarańczowy jak live szallas.hu`.
3. Skeleton states: dodaj klasę `.skeleton` z `background: linear-gradient(90deg, var(--surface-2) 25%, var(--surface-3) 50%, var(--surface-2) 75%); background-size: 200% 100%; animation: shimmer 1.4s linear infinite;` + keyframes.
4. W `<Photo>`: gdy prop `loading={true}` renderuj `<div className="skeleton" style={{width, height}}/>` zamiast obrazka.
5. W `<RoomImage>`: użyj `loading="lazy" decoding="async"` na `<img>`. Dodaj `<picture>` z srcset zarezerwowane (placeholder na backend).
6. Dodaj tweaks toggle `Loading state` który ustawia wszystkie `<Photo loading>` na true — do testowania UX skeleton.

ACCEPTANCE:
- Tokens są osobnym `<style id="ds-tokens">` na samym początku.
- `Loading state` tweak renderuje shimmer-skeleton na hero, thumb, room-card.
- `<RoomImage>` ma `loading="lazy"`.
```

---

## Wave 3 — Polishing (P1/P2 fine-tuning)

Cel fali: dopieścić to, co zostało po Wave 1+2. ≈1 sesja.

### Prompt W3.1 — Sub-nav alignment z live (4 sekcje + CC po prawej)

```
GOAL: Live ma 4 sekcje w sub-nav (`Árak · Értékelés · Szolgáltatások · Térkép` + ❤️) + CC info po prawej. Prototyp ma 6 i save+share+CTA. Skróć do 4 + integracja CC.

CONTEXT:
- `<SubNav>` (linia ~34703), `NAV_SECTIONS` (linia ~34338)

CHANGES:
1. `NAV_SECTIONS` skróć do: `Árak (rooms), Értékelés (reviews), Szolgáltatások (amenities), Térkép (location)`. Usuń overview (default) i faq (FAQ użytkownik znajdzie scrollując).
2. W `<SubNav>` po prawej zamiast `share+save+CTA` dodaj `<a className="subnav-cc" href="tel:+36303442000">+36 30 344 2000 | szallas@szallas.hu</a>` + ikona `❤️` save toggle (bez CTA `Szobát választok`).
3. CTA `Szobát választok` zostaje TYLKO w sticky booking-bar (gdy selection > 0) — w sub-nav jest redundant.

ACCEPTANCE:
- Sub-nav ma 4 linki + CC + heart.
- Brak duplikatu CTA.
- Telefon to klikalny `tel:` link.
```

### Prompt W3.2 — Pricing display alignment (per-person vs total + nightly)

```
GOAL: Live używa `Ft /fő/éj` na top ajánlatok homepage i `total per stay (2 fő, 1 éj)` na listingu/PDP. Prototyp ma per-night / total tweak. Wprowadź 3-tryb display z domyślnym TOTAL na PDP.

CONTEXT:
- `Tweaks` priceMode (linia ~35838)
- `SidebarCard`, `RoomCard`, mobile

CHANGES:
1. `priceMode` zostaje, ale dodaj trzecią opcję `per-person` (live „/fő/éj").
2. Default na PDP: `total` (zgodnie z live).
3. Wszystkie miejsca renderujące cenę: jeśli `total` → `fmt(price)` + suffix `· 2 fő, 2 éj`; jeśli `nightly` → `fmt(price/nights)` + suffix `/éj`; jeśli `per-person` → `fmt(price/nights/guests)` + suffix `/fő/éj`.
4. W sidebar zawsze, niezależnie od trybu, pokaż dodatkową linię `Teljes ár <total> Ft · ÁFA-val · IFA külön`.

ACCEPTANCE:
- 3 tryby działają na sidebar, room-card, sticky-bar, mobile.
- Default = total.
- Sidebar zawsze pokazuje total jako extra-line.
```

### Prompt W3.3 — Affiliate disclosure + footer trust badges

```
GOAL: Dodaj affiliate disclosure (po listingu na PDP też wartościowo) i wymień footer z `nevogate` na pełny trust-row (100% SSL + Deloitte Fast 50 + Az Év App).

CONTEXT:
- `<Footer>` (linia ~35519)
- Live ma trust badges między footer cols a copyright.

CHANGES:
1. W `<Footer>` przed `.footer-langs` dodaj `<div className="footer-trust-row">` z:
   - `100% SSL security` (kłódka ikona + tekst)
   - `Technology Fast 50 2021 CE Winner — Deloitte` (logo placeholder)
   - `Az Év Applikációja 2022 — Minőségi díj` (logo placeholder)
2. `nevogate` zostaw mały, jako „a Nevogate vállalat tagja" — to relacja parent-company, NIE prymarne logo.
3. Na PDP nad footer'em (lub w sub-section pod recenzjami) dodaj `<DiscloseStrip>` z tekstem `A szálláshelyek által fizetett jutalék befolyásolhatja a megjelenés sorrendjét. <a>Bővebben</a>` — to compliance po EU DSA.

ACCEPTANCE:
- Footer ma 3 trust-badges visible.
- DiscloseStrip widoczny nad footer'em.
- nevogate-logo nie dominuje.
```

### Prompt W3.4 — Mobile sticky CTA improvement + share/save accessibility

```
GOAL: Mobile bottom sticky CTA jest OK, ale share/save są w hero tylko jako `<div onClick>` — popraw.

CONTEXT:
- `<MobileView>` (linia ~35614)
- `<Gallery>` hero-actions

CHANGES:
1. `<Gallery>` hero-actions: zamień `<button className="hero-action-btn" onClick>` na `<button type="button" aria-label="Share" aria-pressed={saved}>`. Same dla save.
2. Mobile: jeśli `selectionRooms===0 && tab!=='rooms'`, sticky CTA pokazuje `ettől <fromPrice> Ft / éj` + `Szobát választok`. Po wejściu na tab=rooms znika (jest BookingModifier wbudowany).
3. Dodaj mobile-only sticky `📞 Hívd a recepciót` button w prawym dolnym rogu na sekcji Térkép — quick contact gesture.

ACCEPTANCE:
- Aria-label na share/save w hero.
- Mobile sticky behaviour działa jak opisano.
- Floating phone-call FAB widoczny tylko na Térkép tab w mobile view.
```

### Prompt W3.5 — Right rail bottom fill (trust + help cards)

```
GOAL: Po W1.2 sidebar jest slim (~480-520px). Na 1440×900 z viewportem ~800px useful (po headerze i sub-nav) zostaje 280-320px pustki pod sidebarem przy włączonych nawet kilku tweakach. Wypełnić sensowną treścią.

CONTEXT:
- SidebarCard sticky top: 84px
- `.page` grid `1fr 360px`
- W stanie pre-selection + bez wszystkich tweaków sidebar może mieć tylko ~360px

CHANGES:
1. Pod `<SidebarCard/>` w komponencie `.sidebar` (NIE main content) renderuj 2 bonus cards stacked:

   **<SidebarTrustCard/>** (zawsze widoczny):
   - Heading "Miért foglalj nálunk?" (15px bold)
   - Lista 4 punktów (12px, każdy ikon + text):
     - ↩️ Ingyenes lemondás (dynamicznie z `rate.cancellationCopy` jeśli pokój wybrany, inaczej "a legtöbb tarifánál")
     - 💳 Online fizetés (Visa, Mastercard, SZÉP-kártya)
     - 🛡️ 100%-ban igazolt vendégvélemények
     - 🇭🇺 Magyar nyelvű ügyfélszolgálat

   **<SidebarHelpCard/>** (zawsze widoczny):
   - Heading "Segítségre van szükséged?"
   - Big mono number: `+36 30 344 2000` (tel: link)
   - Małe: "Hétfő–Vasárnap 08:00–20:00"
   - Link "Élő chat" (placeholder)

2. Spacing: 12px gap między 3 cards. Wszystkie: `box-shadow: var(--shadow-sm); border-radius: var(--radius-lg); padding: 16px;`.
3. **Hide on selection**: gdy `selectionRooms > 0` i sticky booking-bar jest widoczny — `<SidebarHelpCard/>` chowa się (TrustCard zostaje, bo ma cancellation copy dla wybranego rate'u).
4. Mobile: bonus cards NIE są w sidebar (sidebar nie istnieje na mobile) — renderuj je jako oddzielne sekcje przed `<Footer/>` w `<MobileView/>`.

ACCEPTANCE:
- 1440×900, pre-selection: prawa szpalta jest WYPEŁNIONA — sidebar + trust + help bez pustki na dole.
- Po wyborze pokoju: help-card chowa się, sticky-bar pojawia się, trust-card zostaje.
- Mobile: oba cards są w content (nie sidebar).
- Telefon to klikalny tel: link.
```

### Prompt W3.6 — Score badge position A/B (3 warianty w Tweaks)

```
GOAL: Po W1.1 score badge jest inline z H1 w hotel-title-row (grid 1fr|auto). User wątpi czy to optymalne dla eye-scanning (tytuł → zdjęcia → prawy slupek — badge może ginąć). Zaproponuj 3 alternatywy jako toggle w Tweaks panel, żeby przetestować empirycznie.

CONTEXT:
- Po W1.1: `<HotelHeader>` ma badge w grid second col, inline z H1
- Live szallas.hu: badge inline z H1 (po prawej, duże zielone kółko + label pionowo)
- Hipotezy: każdy wariant ma trade-off

CHANGES:
1. W TweaksPanel dodaj nową sekcję "Layout" z `<Seg>`:
   ```jsx
   <Seg label="Score badge position" value={tweaks.scoreBadgePos || 'inline'}
        onChange={v => setTweaks({...tweaks, scoreBadgePos: v})}
        options={[
          { v: 'inline',   l: 'A: Inline z H1' },
          { v: 'overlay',  l: 'B: Hero overlay' },
          { v: 'sidebar',  l: 'C: Top of sidebar' }
        ]}/>
   ```
2. Implementacja per wariant:
   - **A (inline, current)**: pozostaje jak po W1.1 — grid 1fr|auto, badge w hotel-title-row
   - **B (hero overlay)**:
     - Badge `position: absolute; bottom: 20px; left: 20px;` na gallery-hero
     - Tło `rgba(0, 0, 0, 0.65); backdrop-filter: blur(8px);`
     - White text "Kiváló" + zielony score-num 9.6 w mniejszym kółku 40×40
     - W stanie A i C overlay ukryty; w B obecny
     - Hide button save/share z hero (bo wchodzi w konflikt) lub przenieś je do top-right
   - **C (top of sidebar)**:
     - Badge renderowany jako pierwszy element wewnątrz SidebarCard (przed eyebrow "A KÖVETKEZŐ 90 NAP…")
     - Full-width row: zielony square score (large) + label vertical
     - Klikalny → onNav('reviews')
     - W stanie A i B badge w sidebarze ukryty
3. Komentarze hipotez (w kodzie nad każdym wariantem):
   - A: "Standardowy, szybkie skanowanie z H1. Słabość: na szerokich layoutach ginie po prawej."
   - B: "Trust signal nad hero photo — silne pierwsze wrażenie. Słabość: ginie na białych/jasnych zdjęciach; konflikt z save/share."
   - C: "Najbliżej CTA — najmniejsza friction. Słabość: na mobile fold-zero ginie powyżej hero."
4. Dodaj sekcję komentarza w pliku z linkiem do trackingu A/B (placeholder):
   ```
   // A/B candidate: score badge position. Track CTR na "Szobát választok" per wariant.
   // GrowthBook key: pdp.scoreBadgePos = inline | overlay | sidebar
   ```

ACCEPTANCE:
- 3 warianty się przełączają w Tweaks bez glitchy layout (każdy stabilny).
- W każdym wariancie badge jest klikalny i prowadzi do reviews.
- Save/share na hero kompatybilne z wariantem B.
- Komentarze hipotez w kodzie obecne.
```

### Prompt W3.7 — Mobile score-chip restyle + Quick-Extract zamiast Description-first

```
GOAL:
(a) Mobile main view (Information tab) ma score-chip w stylu szarej karty z dużą cyfrą po lewej i tekstami w środku — wygląda blado vs zielony desktop. Zharmonizuj.
(b) Description jako pierwszy moduł — to "nikt nie czyta". Zamień na <MobileQuickExtract/> z 4 zsumowanymi piktogramami.

CONTEXT:
- `<MobileView/>` (linia ~35614)
- `m-pad` blok ze score-chip (linia ~35648) — używa `var(--surface-3)` bg, "marginLeft: auto" ChevR generuje pustkę po prawej
- "m-section" h3="Leírás" jako pierwszy moduł pod tabs

CHANGES:
1. Score-chip mobile restyle:
   - Zamień blok z `style={{display:"flex", gap:10, ...background:"var(--surface-3)", padding:"10px 12px", borderRadius:12}}` na:
     ```jsx
     <button className="m-score-chip" onClick={() => scrollToSection('reviews')}>
       <div className="m-score-circle">{HOTEL.score}</div>
       <div className="m-score-text">
         <div className="m-score-lbl">{HOTEL.scoreLabel}</div>
         <div className="m-score-cnt">{HOTEL.reviewCount} vélemény</div>
       </div>
       <I.ChevR size={16}/>
     </button>
     ```
   - CSS `.m-score-chip`: full-width button, biały bg, border 1px solid var(--line), padding 12px, border-radius 12px, display flex, gap 12px, align-items center.
   - `.m-score-circle`: 48×48, var(--c-success) bg, white text, font-weight 800, font-size 18px, border-radius 50%.
   - `.m-score-text`: flex 1 (eliminuje `marginLeft:auto` antywzorzec).
   - ChevR po prawej za textem, mniejszy.

2. Quick-Extract (NOWY moduł zamiast Description-first) — **data-driven z `HOTEL.facts`** (patrz W1.4):
   - Pod score-chip dodaj `<MobileQuickExtract/>`:
     ```jsx
     <div className="m-quick-extract">
       {selectTopFacts(HOTEL.facts, 4).map(f => (
         <a key={f.id} className="qe-tile" href={'#' + f.scrollTo}
            onClick={(e) => { e.preventDefault(); scrollToSection(f.scrollTo); }}>
           <span className="qe-emoji">{f.emoji}</span>
           <div className="qe-text">
             <b>{f.title}</b>
             <small>{f.sub}</small>
           </div>
         </a>
       ))}
     </div>
     ```
   - **NIE hardcoduj** kafli — czerp z `HOTEL.facts` żeby per-property pokazywać top-4 (beach hotel: dystans do morza; city hotel: dystans do centrum; wellness: spa included; family: kid amenities).
   - CSS .m-quick-extract: grid 2×2, gap 8px, margin 12px 0.
   - .qe-tile: card 1×1, padding 10px, biały bg, border 1px var(--line), border-radius 10px, display flex, gap 8px, align-items flex-start. Emoji 24px. b 13px bold, small 11px muted.
   - Każdy tile klikalny → scroll do `f.scrollTo` (z fact'a, nie hardkodowane).
   - Acceptance test: zmień w mocku `priority` jednego fact'a (np. beach z 95 na 30) → spadnie z 2×2 grid i wskoczy ten z 5-tym najwyższym priority. Mobile i desktop reagują identycznie.

3. Description w 'overview' tab:
   - Przesunąć POD Quick-Extract.
   - Skrócić do 2-3 zdań (slice description[0] do ~200 char).
   - Link "Tovább olvasom" — w mobile NIE rozwija inline, tylko otwiera modal/sheet z pełnym opisem.

ACCEPTANCE:
- m-score-chip jest zielony (kółko), pełna szerokość, bez pustej przestrzeni po prawej.
- Quick-Extract z 4 piktogramami WYŚWIETLA SIĘ PRZED Description.
- Każdy QE-tile klikalny, scrolluje do odpowiedniej sekcji.
- Description w 'overview' tab skrócony do ~200 char + "Tovább olvasom" (modal-sheet).
```

### Prompt W3.8 — Mobile scroll-driven sections + working CTA + sticky-tab spy

```
GOAL:
(a) Aktualny m-tabs to conditional render per tab (klik = renderowane jest tylko jedno). User chce SCROLL przez wszystkie sekcje + sticky-tabs z scroll-spy (jak SubNav desktop).
(b) Sticky-bar CTA "Foglalom" na mobile NIE MA onClick — naprawić.

CONTEXT:
- MobileView m-tabs (linia ~35658): `<button onClick={()=>setTab(id)}>` — tab-switch
- m-sticky bottom CTA (linia ~35770): button bez handler'a
- Po W3.7 mamy Quick-Extract; teraz strukturyzujemy całość pod scroll-driven flow

CHANGES:
1. Wymień conditional render `{tab==="overview" && ...}` na **wszystkie 5 sekcji w jednym scroll'u**:
   - `<section id="overview">` (h3 Leírás → ale POD Quick-Extract)
   - `<section id="rooms">` (lista pokoi, parytet z W3.10)
   - `<section id="reviews">` (parytet z W3.9)
   - `<section id="amenities">`
   - `<section id="location">` (mapa + POI)
2. m-tabs stickyfikuj na top podczas scroll:
   - CSS .m-tabs sticky top 0, z-index 30, bg #fff border-bottom var(--line)
   - Scrollable horizontal jeśli nie mieści (overflow-x: auto)
   - Klik chipu = `el.scrollIntoView({behavior:'smooth', block:'start'})`
3. Scroll-spy z IntersectionObserver:
   ```js
   useEffect(() => {
     const sections = ['overview','rooms','reviews','amenities','location'];
     const observer = new IntersectionObserver(entries => {
       entries.forEach(e => {
         if (e.isIntersecting && e.intersectionRatio > 0.4) setActiveSection(e.target.id);
       });
     }, { threshold: [0.4], rootMargin: '-80px 0px -50% 0px' });
     sections.forEach(id => {
       const el = document.getElementById(id);
       if (el) observer.observe(el);
     });
     return () => observer.disconnect();
   }, []);
   ```
4. m-sticky bottom CTA fix:
   - Bez selection: `onClick={() => document.getElementById('rooms').scrollIntoView({behavior:'smooth'})}`. Copy "Szobát választok".
   - Po wyborze daty ale przed selection: copy "Szobát választok", scroll do rooms.
   - Z selection: `onClick={() => onProceedToCheckout()}` placeholder console.log/alert. Copy "Foglalom (X szoba)".
   - Disabled state gdy brak dat: bg var(--surface-3), color var(--ink-400), copy "Válassz dátumot előbb".
5. Hide-on-scroll behavior (opcjonalne, ale lepsze UX):
   - Track scroll direction. Jeśli scrollDown > 50px → translateY(100%), 0.25s ease.
   - Jeśli scrollUp → translateY(0).
   - Reset gdy near top (scrollY < 200).

ACCEPTANCE:
- Wszystkie 5 sekcji w jednym pionowym scrollu (NIE conditional).
- m-tabs sticky top, scrollable horizontal, scroll-spy podświetla aktywną sekcję.
- Klik chipu = scroll do sekcji.
- CTA "Foglalom" działa: scroll-to-rooms (no selection) / placeholder checkout (with selection) / disabled (no dates).
- Hide-on-scroll-down działa (opcjonalne).
```

### Prompt W3.9 — Mobile Reviews full-screen widok z filtrami (parytet z desktop)

```
GOAL: Mobile w obecnej formie pokazuje TYLKO 2 reviews i nie ma filtrowania. Parytet z desktopem: full widok z filter chips (travel-type z W1.5 + content-category z W1.8) + sort + load-more.

CONTEXT:
- MobileView "reviews" tab (linia ~35719) — slice(0,2)
- Po W3.8 wszystkie sekcje scroll-driven; ten widok to jeden z modułów `<section id="reviews">`
- Po W1.5 i W1.8 desktop ma 2 filtry; mobile musi ten sam pattern

CHANGES:
1. W mobile `<section id="reviews">` renderuj `<MobileReviewsSection/>`:
   - Header row: `<MobileScoreBig/>` (54px score + label) + rating-bars (5 dimensions, kompaktowe — wysokość 8px, full-width)
   - **2 rows chip filtrów** scrollable horizontal:
     - Row 1: travel-type (Mind, Család, Pár, Üzleti, Egyedül) + counter
     - Row 2: content-category z W1.8 (Szoba, Étkezés, Objektum, Környék, Szolgáltatások) + counter
   - Sort `<Seg>`: Legrelevánsabb / Legújabb / Magasabb pontszám / Alacsonyabb pontszám
   - Lista review-card mobile-friendly:
     - travel-type icon (z W1.5) lewa
     - name + verified-icon + date prawa, score-num far right
     - Full text (z read-more dla >180 znaków)
   - Po pierwszych 5 review: button "További 20 megtekintése" — paginate +20 (lub infinite scroll z IntersectionObserver).

2. Stan filtra LOCAL do tej sekcji (NIE URL state na razie).

3. Empty state (z W1.8): gdy oba filtry dają 0 → ikona + text + button "Reset szűrők".

ACCEPTANCE:
- Mobile sekcja reviews ma 2 rzędy chipów, sort, load-more.
- Filtry kompozytowe (AND).
- Long text z read-more.
- Empty state z reset.
```

### Prompt W3.10 — Mobile Rooms full + warianty + bottom-sheet dla 4+ rate'ów

```
GOAL: Mobile "rooms" tab obecnie renderuje TYLKO firstRate per pokój. Parytet z desktop: pokazuj wszystkie warianty, meal-pill z W1.7, edge-case 5+ rate'ów z bottom-sheet rozwijającym pełną listę.

CONTEXT:
- MobileView "rooms" tab (linia ~35683)
- Po W1.7: desktop ma meal-pill + gradient+chevron expand
- Po W3.8: wszystkie sekcje scroll-driven, ta jest `<section id="rooms">`

CHANGES:
1. W mobile `<section id="rooms">` renderuj `<MobileRoomCard room/>` per pokój:
   - Hero foto pokoju 16:9 + photo-count chip + gallery-icon button top-right (otwiera RoomGalleryModal w mobile lightbox layout)
   - Header row: nazwa + chip room.tag (jeśli)
   - Feat-row: chipy `room.size`, `room.bed`, `max ${room.maxGuests} fő` — kompaktowe
   - **Rate-list**:
     - Renderuj 2 pierwsze rate'y z `<MealPill/>` (z W1.7), policy-line (cancel copy), price + stepper
     - Jeśli `room.rates.length > 2`: gradient-fade na 2-gim + button `<button className="m-rate-expand">+{rates.length-2} további tarifa <I.ChevR/></button>`
     - Klik = otwiera `<MobileRatesSheet room/>` (NIE inline expand, żeby nie psuć scroll innym pokojom)

2. `<MobileRatesSheet/>` (bottom-sheet modal):
   - Slide-up panel z dachu z grip-handle (mała szara prostokącia 36×4 u góry)
   - Header: nazwa pokoju + close X
   - Body: pełna lista rate'ów z meal-pill, policy, price, stepper
   - Footer sticky-bottom: total + CTA "Foglalom" (lub "Választott szobák: N · Tovább" jeśli stepper > 0)

3. Stepper na rate'cie w sheet aktualizuje `selections` w głównym App state (przekazane przez props/context).

4. Po zamknięciu sheet: room-card w głównym scrollu pokazuje JAKI rate został wybrany jako "Kiválasztva: ${rateName}" (zielony banner pod feat-row).

ACCEPTANCE:
- Każdy pokój w mobile pokazuje min. 2 rate'y z meal-pill.
- 3+ rate'ów → gradient + button "+N tarifa" → bottom-sheet z pełną listą.
- Stepper w sheet działa; selections persistent z App.
- Po wyborze rate'u, główny widok pokoju pokazuje "Kiválasztva: …" banner.
- CTA w sheet footer (z stickyfikacją bottom-sheet).
```

---

## Po Wave 1–3 — checklist gotowości do Wave 4 (homepage/listing/checkout)

**Desktop:**
- [ ] Hero z grid 1fr|360px, score-badge z W3.6 A/B (default A: inline)
- [ ] Sidebar 6 elementów pre / breakdown IFA post (W1.2)
- [ ] Right rail bottom wypełniony Trust + Help cards (W3.5)
- [ ] `TWEAK_SCHEMA` + per-property config (W1.3); VIP 10–20% nie 40%; fabryczny strike usunięty
- [ ] Schema.org Hotel/AggregateRating/FAQPage w head (W1.6)
- [ ] Modale focus-trap + aria-modal (W1.6)
- [ ] Real Leaflet map + POI clustering (W2.1)
- [ ] 4 edge states działają (W2.2)
- [ ] Tokens wydzielone do `<style id="ds-tokens">` (W2.3)
- [ ] Sub-nav 4 sekcje + CC (W3.1)
- [ ] 3-tryb pricing (W3.2)
- [ ] Affiliate disclosure + footer trust-row (W3.3)
- [ ] **Meal-pill kolorowy per rate** + **edge-case 5+ rate'ów** z gradient+chevron (W1.7)
- [ ] **Filter chips 5 kategorii** na Reviews i Gallery z empty state (W1.8)

**Mobile:**
- [ ] Sticky tabs scroll-spy + wszystkie sekcje w jednym scrollu (W3.8)
- [ ] Sticky-bar CTA "Foglalom" z working onClick + disabled gdy brak dat (W3.8)
- [ ] Score-chip zielony pełną szerokością bez pustki po prawej (W3.7)
- [ ] Quick-Extract zamiast Description-first (W3.7)
- [ ] Mobile Reviews full z filtrami + sort + load-more (W3.9)
- [ ] Mobile Rooms z bottom-sheet dla 4+ rate'ów (W3.10)

Po odptaszkowaniu — średnia ocena prototypu powinna wzrosnąć z 2.9/5 do ~4.2/5. Wtedy ruszamy z Deliverable 3 (pozostałe ekrany flow).

---

## Notatki techniczne

- **NIE łącz dwóch faz** w jednym prompt'cie — limit kontekstu Claude'a ~200k tokenów, ale na każdą iterację warto trzymać <30k zmiany.
- **Każdy prompt jest atomowy** — po każdym zrób diff `git diff HEAD` i odptaszkuj acceptance criteria.
- **Jeśli output zawiera trash** (np. usunął coś nieproszony, dodał wymyślone dane), użyj follow-up: `Skup się tylko na zmianach z mojego promptu. Cofnij <X>.`
- **Wersjonowanie**: commit per prompt → `git commit -m "W1.1: hero whitespace + score badge"`. Daje to perfect rollback.
- **Smoke test po każdej fali**: otwórz HTML w Chrome 1440×900 i 375×812 (mobile), kliknij każdy moduł.
