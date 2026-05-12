# 03 — Plan dopisania pozostałych ekranów user flow (Fala 4)

> **Source of truth po ludzku:** [plan.md](plan.md) — kroki 15-21.

**Kolejność wykonania w Fali 4 (post v2):**
1. **S.1** — wyciągnięcie wspólnego stylu do `ds.html` (krok 15)
2. **Listing** (L.1 → L.2 → L.3) — **pierwszy, bo to brama do PDP** (krok 16)
3. **Homepage** (H.1 → H.2 → H.3) — krok 17
4. **Checkout** (C.1 → C.2) — krok 18
5. **Payment** (P.1 → P.2) — krok 19
6. **Thank you** (T.1 → T.2) — krok 20
7. **Cross-screen audit** (X.1) — krok 21

Kolejność uwzględnia priorytet (listing > homepage > reszta) z zapasem na koniec tokenów / czasu.

---


**Wejście:** wave-1+2+3-ready PDP (`Hotel Aurora Balaton.html`) z design system, tokens i komponentami reużywalnymi.
**Output:** 5 nowych plików HTML (lub 1 multi-page) w `prototype/`:
- `01-homepage.html`
- `02-listing-balaton.html`
- `03-checkout.html`
- `04-payment.html`
- `05-thankyou.html`

**Strategia:** Każdy ekran to **osobny artifact** w Claude Design, ale **wszystkie używają wspólnego `ds.html`** (head ze stokenami + komponentami). To imituje produkcyjną komponentową architekturę i pozwala A/B testować pojedyncze ekrany.

**Zasada nadrzędna:** **NIE kopiuj-pleeć tokens między plikami**. Wyciągnij raz `prototype/ds.html` (head + `<style id="ds-tokens">` + `<script id="ds-components">` z BrandBar/Footer/Photo/Stepper/Switch/Seg/Tag/Modal/Icons), i w każdym ekranie `<!-- include ds.html -->` przez prosty includer (Claude Design pomoże).

---

## 0. Setup — wspólny ds.html

### Prompt S.1 — wydziel design system do osobnego pliku

```
GOAL: Wydziel `<style id="ds-tokens">` + komponenty reużywalne (BrandBar, SearchBar, Footer, Photo, Stepper, Switch, Seg, Tag, Icons, fmt) do osobnego pliku prototype/ds.html. Pozostałe ekrany będą go importować przez fetch + inject (proste includowanie po stronie klienta).

CONTEXT:
- `Hotel Aurora Balaton.html` po Wave 3
- Komponenty istnieją w window. global

CHANGES:
1. Utwórz nowy plik `prototype/ds.html` z:
   - <style id="ds-tokens"> (cała :root)
   - <style id="ds-base"> (resety html/body/button/a)
   - <style id="ds-components"> (BrandBar/SearchBar/Footer/Stepper/Switch/Seg/Tag CSS)
   - <script id="ds-fmt-icons"> (fmt, icons SVGs jako window.I)
   - <script id="ds-components-react"> (BrandBar, SearchBar, Breadcrumbs, Footer, Photo, Stepper, Switch, Seg, Tag jako window.* — React via Babel)
2. W `Hotel Aurora Balaton.html` zastąp te bloki linią:
   ```html
   <script>fetch('ds.html').then(r=>r.text()).then(t=>document.head.insertAdjacentHTML('beforeend', t));</script>
   ```
   I zachowaj tylko PDP-specific style i komponenty.
3. Dodaj `prototype/index.html` jako dashboard z linkami do wszystkich 6 ekranów (PDP + 5 nowych).

ACCEPTANCE:
- ds.html zawiera 100% reużywalnego CSS i komponentów.
- PDP się renderuje po wczytaniu ds.html.
- prototype/index.html linkuje do wszystkich 6 ekranów.
```

> **Uwaga**: jeśli prezes nie chce dotykać działającego PDP, alternatywa to **kopiowanie tokens przez snippet do każdego pliku** — wolniej w utrzymaniu, ale bezpieczniejsze. Polecam ds.html dla porządku.

---

## 1. HOMEPAGE — `01-homepage.html`

### Co ma być na fold-zero (zgodnie z live + benchmarks)

- Brand-bar (z ds.html).
- **Hero z dużym tłem zdjęciowym** (sezonowe — np. Horvátország tengerparti), gradient overlay.
- Headline: `Találd meg álmaid szállását!` + sub: `Fedezd fel Magyarország mesés tájait!`
- **Tabs hero**: `Szállások | Programkereső` (live ma 2 tryby; my dodajemy 3-ci `Csomagok` — szansa na up-sell).
- **Search bar 4-polowy** (destination · dates · guests · CTA `Keresés`) — `position: relative; bottom: -32px` żeby wszedł półcal na fold-following content.
- **Trust line**: `Fizess online akár SZÉP-kártyával is | 3 158 600+ valódi vendégvélemény | Ingyenes lemondás a legtöbb hotelnél`

### Co poniżej fold

- **Kategoria carousel** „Inspirálódj…" — 8 tile'i z gradient overlay.
- **Top ajánlatok** — 3 kolumny hotel cards (ze zdjęciem, score badge 9.x w zielonym kółku, nazwa, cena `XX XXX Ft /fő/éj`, `Tartalmazza az adókat és díjakat`).
- **Promo banner**: aktualna kampania (np. Horvát kedvezmény).
- **VIP banner** — `Lépj be, és foglalj olcsóbban — 10–20% kedvezmény tagoknak` + CTA `Belépek`.
- **„Tippek a következő felejthetetlen utazásodhoz"** — 4 dynamic tile'y (Családi wellness, Balatoni, Tengerparti, Akciós belföldi).
- **Kiemelt ajánlataink** — 6 hotel cards z heart-save.
- **Footer (z ds.html)** + affiliate disclosure.

### Prompt H.1 — Hero + search bar

```
GOAL: Zbuduj plik prototype/01-homepage.html jako kopię ds.html structure + nową sekcję hero z search bar i tabs. Stylem ma odpowiadać live szallas.hu (zobacz pliki uploads/pasted-1778274287173-0.png purple-bg search albo wersja red — używamy red zgodnie z brand).

CONTEXT:
- prototype/ds.html (po S.1)
- Live homepage: hero z dużym tłem chorwackiego wybrzeża, tabs Szállások|Programkereső, search 4-polowy, trust line
- Brand red #E30613, CTA red (możemy testować orange jako AB)

CHANGES:
1. <body> struktura:
   - <BrandBar/> (z ds.html)
   - <section className="hp-hero"> z:
     - <div className="hp-hero-bg"> z radial gradient + scenic placeholder image (Photo seed="hero-coast")
     - <div className="hp-hero-content"> 
       - <div className="hp-tabs"> z 3 tabs: Szállások (active), Programkereső, Csomagok — chip-style z ikonami
       - <h1 className="hp-headline">Találd meg álmaid szállását!</h1>
       - <p className="hp-sub">Fedezd fel Magyarország mesés tájait!</p>
       - <SearchBar/> — z 4 polami: destination (input z placeholder „pl. Siófok"), dates (Érkezés – Távozás), guests (1 szoba, 2 felnőtt, 0 gyermek, dropdown popper), CTA „Keresés" (czerwony, 14px font, lg button)
       - <div className="hp-trust-line"> z 3 ikonkami ✓ + tekst (Fizess online SZÉP-kártyával | 3 158 600+ vendégvélemény | Ingyenes lemondás legtöbb hotelnél)
2. CSS:
   - .hp-hero { position: relative; height: 540px; }
   - .hp-hero-bg { position: absolute; inset: 0; }
   - .hp-hero-bg::after { content:""; position:absolute; inset:0; background: linear-gradient(180deg, rgba(0,0,0,.4) 0%, rgba(0,0,0,.2) 100%); }
   - .hp-hero-content { position: relative; z-index:1; max-width:1200px; margin:0 auto; padding:80px 24px 32px; color:#fff; }
   - .hp-tabs { display:flex; gap:8px; margin-bottom:16px; }
   - .hp-tab { padding:8px 16px; border-radius:999px; background:rgba(255,255,255,0.14); color:#fff; border:1px solid rgba(255,255,255,0.3); }
   - .hp-tab.active { background:#fff; color: var(--ink-900); }
   - .hp-headline { font-size:48px; font-weight:900; letter-spacing:-0.02em; }
   - .hp-trust-line { margin-top:16px; display:flex; gap:24px; flex-wrap:wrap; font-size:14px; color:rgba(255,255,255,.95); }
3. Search bar (już w ds.html jako <SearchBar>):
   - Jeśli ds.html ma tylko inline wersję jak na PDP, zrób NOWY komponent <HeroSearchBar/> z większymi polami (min-height 56px) i CTA „Keresés" jako duży przycisk.

ACCEPTANCE:
- Otwarcie 01-homepage.html w Chrome 1440×900: hero pokazuje czarno-przezroczysty gradient nad zdjęciem, headline biały, 3 tabs, search bar nad gradient bottom edge, trust line poniżej.
- Mobile 375: hero zmniejsza height do 320px, tabs i headline tightly packed.
- Klik w którąś z tab podświetla ją (state local).
```

### Prompt H.2 — Sekcje below fold (categories, top ajánlatok, VIP, kiemelt)

```
GOAL: Dodaj poniżej hero 5 sekcji w kolejności:
1. „Inspirálódj a következő utazásodhoz!" — 8-tile horizontal scrollable carousel
2. „Top ajánlatok" — 6 hotel cards w grid 3×2 (na desktop)
3. Sezonowy promo banner (np. Horvátország kedvezmény)
4. VIP banner („Lépj be, és foglalj olcsóbban!")
5. „Tippek a következő felejthetetlen utazásodhoz" — 4 mosaic tile'y (1 big + 3 small)
6. „Kiemelt ajánlataink" — 6 hotel cards z heart-save

Footer z ds.html.

CONTEXT:
- ds.html ma <HotelCard/> komponent. Jeśli nie ma — wytrać go z RoomCard logiki i dodaj do ds.
- Live: top ajánlatok ma cena „24 673 Ft /fő/éj", listing ma „2 fő, 1 éj"

CHANGES:
1. Carousel kategorii:
   - 8 obiektów: Pünkösdi hosszú hétvége, A Balaton legjobb ajánlatai, Wellness és spa, Horvátország legjobb ajánlatai, Szállások félpanzióval, TOP úti célok, Romantikus kastélyszállók, Faházak
   - Każdy tile: 200×280 image + gradient overlay + tytuł biały bold
   - Lewa/prawa strzałka chevron
2. Top ajánlatok grid:
   - <HotelCard/> reuse: image + score-circle (9.3 zielony), name (h3), price big orange (24 673 Ft) + suffix „/fő/éj", taglines
3. Promo banner — full-width image z zoom-overlay text + CTA „Irány a szállásokhoz »"
4. VIP banner — peach-gradient bg, big „VIP" word in orange, copy „Lépj be, és foglalj olcsóbban!" + sub „Akár 10-20% kedvezmény csak VIP tagoknak", CTA „Belépek"
5. „Tippek…" mosaic — pinterest-like layout:
   - Lewa: Családi wellness pihenés (300×500)
   - Środek lewa: Irány a Balcsi (200×200), poniżej Tengerparti nyaralás (200×200)
   - Środek prawa: Akciós belföldi pihenés (220×420)
   - Prawa wide: Mobilon olcsóbban (300×420) z CTA Megnézem
6. Kiemelt ajánlataink: 6 HotelCard z heart-save w lewym górnym rogu

ACCEPTANCE:
- Wszystkie sekcje renderują się.
- Carousel chevron działa (scroll behavior).
- HotelCard wygląda identycznie jak na liście — to test reużywalności.
- Heart-save toggluje stan (local).
```

### Prompt H.3 — Autocomplete typeahead (fix antywzorca /balaton disambig)

```
GOAL: Live ma antywzorzec: wpisanie „balaton" w search bar prowadzi do disambig (Balaton régió vs Balaton település). Naprawiamy: typeahead z thumbnail destination, kliknięcie = bezpośredni listing.

CONTEXT:
- HeroSearchBar w 01-homepage.html
- Lista destynacji statyczna (placeholder data)

CHANGES:
1. Dane: window.DESTINATIONS = [
   { type: 'region', name: 'Balaton', count: 5167, slug: 'balaton-3', img: '...' },
   { type: 'city', name: 'Budapest', count: 4231, slug: 'budapest', img: '...' },
   { type: 'city', name: 'Siófok', count: 817, slug: 'siofok', img: '...' },
   { type: 'city', name: 'Hévíz', count: 278, slug: 'heviz', img: '...' },
   { type: 'region', name: 'Mátra', count: 320, slug: 'matra', img: '...' },
   ...10 więcej
   ]
2. W HeroSearchBar destination input:
   - onChange filtruje DESTINATIONS przez substring (case-insensitive, HU-aware).
   - Renderuj dropdown z max 6 wynikami, każdy ma:
     - mini thumbnail 40×40 (Photo seed)
     - nazwa bold (z highlightem matchowanego fragment)
     - typ („régió" / „város" / „település")
     - count szallás w pareniach
   - Kliknięcie tile = navigate to `/${slug}` (placeholder href).
3. Empty state: gdy 0 wyników, pokaż „Nincs találat — próbálj a régió nevére"

ACCEPTANCE:
- Wpisanie „bal" pokazuje Balaton region, Balatonfüred, Balatonlelle (z 3 thumbnails).
- Kliknięcie tile linkuje do /<slug>.
- Brak antywzorca disambig.
```

---

## 2. LISTING — `02-listing-balaton.html`

### Layout (split-view list+map)

- BrandBar + persistent SearchBar (z wartościami `Balaton · jún. 11 – 13 · 2 felnőtt`).
- **Filter quick-chip bar** (carousel z homepage zaszyty): Pünkösdi, Balaton legjobb, Wellness, Félpanzió…
- **Tytuł** „Balaton szálláshelyek" + counter „5167 találat" + toggle `🗺️ Térkép nézet` (zmienia layout).
- **Lewa kolumna (~280px)**: filtry (Kedvezmények, Legnépszerűbb szűrők, SZÉP kártyás fizetés, Ellátás, Szállástípus, Szobafelszereltség, Ágykiosztás, Környék, Legyen a közelben). **Collapse-by-section** ze stanem.
- **Środkowa kolumna (~lista)**: HotelCard rows (image · info · score+price+CTA).
- **Prawa kolumna (mapa)**: Leaflet split-view (sticky), markery z ceną „86 642 Ft" w pinach, hover-card z mini-listing-cardem.

### Prompt L.1 — Bazowy layout 3-kolumnowy z filtrami

```
GOAL: prototype/02-listing-balaton.html z 3-kolumnowym layoutem. Lewa filtry (~280px), środkowa lista (~600px), prawa mapa (~480px). Persistent SearchBar na górze. Toggle „Mapa | Lista".

CONTEXT:
- ds.html (BrandBar, SearchBar, Footer, HotelCard, Photo)
- Live ma tylko lista + side-filters, BEZ mapy inline — to nasza PRZEWAGA konkurencyjna nad live (Booking-style)

CHANGES:
1. <body> struktura:
   - <BrandBar/>
   - <SearchBar/> (z prefilled Balaton + dates + guests)
   - <QuickFilterBar/> — tabs Pünkösdi, Balaton legjobb, Wellness és spa, Horvátország, Félpanzió, TOP úti célok…
   - <Breadcrumbs/> Főoldal > Magyarország > Balaton
   - <h1>Balaton szálláshelyek</h1> + counter „5167 találat" + toggle „🗺️ Térkép nézet" + sort dropdown „Ajánlásunk szerint"
   - <div className="listing-grid"> z 3 kolumnami:
     - aside.filters (left)
     - main.list-col (center)
     - aside.map-col (right, sticky)
2. Filtry grupy (każda jako collapsible <FilterGroup title="Kedvezmények">):
   - Kedvezmények (chip „Kedvezmények VIP tagoknak (879)")
   - Legnépszerűbb szűrők — 2×2 grid of icon-tile filters (Wellness, Reggeli, Nagyon jó 9.0+, Medence) — each chip with label + count
   - SZÉP kártyás fizetés (checkboxes OTP, MKB, K&H)
   - Ellátás (radios: Nincs, Reggeli, Félpanzió, Teljes, Soft AI, AI)
   - Szállástípus (checkboxes Hotel z 2-5★ nested, Apartman, Vendégház, Panzió, Faház…)
   - Szobafelszereltség (Privát fürdőszoba, Légkondi, Konyha, Pezsgőfürdő, Zuhanyzó, Fürdőkád, Erkély…)
   - Ágykiosztás (Egy kétszemélyes ágy, Két egyszemélyes ágy)
   - Környék — slider „Távolság a városközpontól: 1km | 3km | 5km" + osobny „Távolság a parttól: Part 1 km-en belül"
   - Legyen a közelben (Balatoni strand, Wellness szolgáltatások)
3. Filtry state: useState `filters: {…}` — każdy change wpływa na listę (no-op placeholder, w prod backend).
4. Sticky filters: <aside.filters className="sticky"> top: 84px, overflow-y: auto, max-height: calc(100vh - 100px).
5. <main.list-col>: lista 8 mock-hoteli (z różnych Balaton miast: Siófok, Balatonfüred, Hévíz, Keszthely, Balatonlelle, Balatonboglár).
6. <aside.map-col>: <Map/> (Leaflet z W2.1 setup), markery z ceną w pinach, sticky top: 84px.

ACCEPTANCE:
- Layout 3-kolumnowy działa na 1440px.
- Filtry collapsible działają (state).
- Map renderuje się po prawej stronie i scrolluje wraz z listą.
- 1024px: prawa mapa znika, użytkownik widzi tylko listę + toggle „🗺️ Térkép nézet" pokazuje full-width map z list jako bottom sheet.
- 375px: filtry chowają się za butonem „Szűrők (12)" w sticky filter-bar nad listą.
```

### Prompt L.2 — HotelCard reuse + price-marker map

```
GOAL: Reuse HotelCard z homepage. Map markery to PRICE-PINS (czerwone z ceną „86 642 Ft" w środku). Hover na marker = highlight w liście + scroll-into-view; klik na pin = expand mini-card; klik na list = mapa flyTo + pin animacja.

CONTEXT:
- ds.html ma <HotelCard/>.
- Leaflet z W2.1 setup.

CHANGES:
1. HotelCard na liście:
   - Layout horizontal: image (320×220) | info (flex 1) | score+price+CTA (200px)
   - Image: lewa, ze save-heart w lewym górnym rogu + ewentualnie `-9%` orange badge w prawym górnym rogu
   - Info: hotel name (link niebieski), gwiazdki + `+superior`, **rząd 7 amenity icons z zielonym FREE badge** (śniadanie, woda, AC, Wi-Fi, parking, recepcja, wellness), zielony chip „Félpanzió az árban", zielony text „SZÉP kártyával is fizethetsz"
   - Score+price kolumna: score słowne („Kiváló") + duże zielone kółko 9.5 + count („1677 értékelés"), strikethrough 96 085, big orange „86 642 Ft", small „2 fő, 1 éj all inclusive", „Tartalmazza az adókat és díjakat", CTA „Megnézem" (białe button z czerwoną krawędzią, hover = pomarańczowe fill).
2. Map markery:
   - L.divIcon z HTML `<div class="price-pin"><strong>${price}</strong></div>`.
   - .price-pin { background: var(--c-primary); color:#fff; padding:6px 10px; border-radius:14px; font-weight:800; font-size:13px; border: 2px solid #fff; box-shadow: var(--shadow-cta); }
   - Marker pinned-hover: zwiększa scale 1.1, lights up.
3. Sync map ↔ list:
   - W list.HotelCard `onMouseEnter` ustaw `highlightId`, mapa `flyTo` marker, marker zmienia bg na var(--c-success).
   - W marker `onClick`, otwórz L.popup z mini-HotelCard (image, name, price, CTA Megnézem).
   - W list.HotelCard `onClick` (nie CTA, tylko card body): tak samo flyTo + popup.
4. Disclosure pasek: nad listą `A szálláshelyek által fizetett jutalék befolyásolhatja a megjelenés sorrendjét. <a>Bővebben</a>` — affiliate disclosure live.

ACCEPTANCE:
- Markery na mapie pokazują cenę.
- Hover na karcie wywołuje flyTo + zmianę koloru markera.
- Klik na marker pokazuje popup mini-card.
- Affiliate disclosure widoczny nad listą.
```

### Prompt L.3 — Sticky filter-bar mobile + map full-screen toggle

```
GOAL: Mobile (375px) musi mieć: bottom sheet filtrów (sticky bar z buttonem „Szűrők (N)"), toggle „Lista | Térkép" jako full-screen mode dla map.

CONTEXT:
- 02-listing-balaton.html responsive

CHANGES:
1. CSS @media (max-width: 768px):
   - .listing-grid → 1 kolumna
   - .filters.sticky → display none (chowamy)
   - .map-col → display none (chowamy)
   - Pokazujemy nowy <FilterBarSticky/> dolny: full-width bar z buttonem „🎚️ Szűrők (12)" lewy, „📍 Térkép" prawy (toggle do full-screen mapy).
2. Full-screen map mode: setState `mapMode: 'split' | 'full'`. W trybie full, lista chowa się, map zajmuje 100vh, lista jako bottom-sheet z dragger (top 20% widocznych, swipe up = expand).
3. Filter modal: po kliknięciu „Szűrók (12)", otwórz full-screen modal z wszystkimi filtrami i CTA „Találatok mutatása (5167)".

ACCEPTANCE:
- Mobile 375: filtry chowają się, dolny sticky bar widoczny.
- Klik „Térkép" → full-screen map z bottom-sheet lista.
- Klik „Szűrók" → full-screen filter modal.
```

---

## 3. CHECKOUT — `03-checkout.html`

### Co naprawiamy vs live

- **Coupon code pre-booking** (live: kupon DOPIERO PO foglalás — antywzorzec naprawiamy)
- **Postal code → city autofill** (live nie ma)
- **Inline form validation** z błędami pod polem (live: walidacja prawdopodobnie po submit)
- **Save guest details for next time** (gdy zalogowany)
- **Trust-strip nad CTA** (badge'y płatności, polityka cancel z linkiem)
- **Mobile-first** layout (form jednokolumnowo, summary chowa się do top accordionem)

### Prompt C.1 — Stepper + 2-col layout + form

```
GOAL: prototype/03-checkout.html z poziomym stepperem (4 etapy zgodnie z live: Szállás kiválasztása ✓, Személyes adatok (active), Foglalás összegzése, Fizetés) + 2-col layout (form left, sticky summary right).

CONTEXT:
- ds.html
- Live: step=personal-information z polami Vezetéknév, Keresztnév, E-mail, Telefonszám (+36 country picker), Cím (Ország, Irányítószám, Település, Utca házszám), Megjegyzés, checkboxes (newsletter opt-in, T&C, GDPR)

CHANGES:
1. <body>:
   - <BrandBar/> minimal (bez sub-nav)
   - <CheckoutStepper currentStep={2}/> z 4 krokami (Szállás kiválasztása ✓, Személyes adatok, Foglalás összegzése, Fizetés)
   - <div className="checkout-grid"> 2-kolumnowy 1fr 380px:
     - <main.form-col>:
       - <h1>Adatok megadása</h1>
       - <FieldGroup title="Személyes adatok"> Vezetéknév | Keresztnév | E-mail | Telefonszám (+36 country picker)
       - <FieldGroup title="Cím"> Ország (dropdown HU) | Irányítószám (4-digit input z autofocus na blur → fetch Település) | Település (readonly post-autofill) | Utca, házszám
       - <FieldGroup title="Speciális kérések"> Megjegyzés textarea + warning info „Ez a szálláshely nincs felkészülve kisállatok fogadására."
       - <FieldGroup title="Akciós kód"> [Új względem live] Pole „Promóciós kód" + button „Beváltás" — naprawiamy antywzorzec.
       - <CheckboxGroup>: newsletter opt-in (nie pre-checked), T&C required, GDPR required
       - <TrustStrip/> przed CTA: 🔒 SSL secure | 💳 Visa/MC/SZÉP | ↩️ Ingyenes lemondás eddig: <date>
       - <button className="btn-primary lg">Foglalás elküldése</button>
     - <aside.summary-col sticky>:
       - <img hero photo>
       - <SummaryCard/> z: hotel name + gwiazdki, daty z hourami check-in/-out, guests, ellátás, lista pokoi, lemondás policy, Mikor fizetek (Előrefizetendő + IFA helyszínen), accordion „Mit tartalmaz az ár?", Teljes ár
2. Form validation:
   - Każde pole `onBlur` waliduje (required, email regex, phone regex HU +36).
   - Pod polem renderuj `<span className="field-error">…</span>` jeśli error.
   - Submit-disabled gdy errors > 0 lub required checkboxes nie zaznaczone.

ACCEPTANCE:
- Form pokazuje wszystkie pola jak live, ale ZAWIERA kupon pre-booking.
- Walidacja inline działa.
- Postal code → city: na blur na irányítószám pole, ustaw település do placeholder „Siófok" (mock).
- Trust strip widoczny nad CTA.
- Sticky summary po prawej.
```

### Prompt C.2 — Edge cases (gość, niezalogowany, błąd płatności prev step)

```
GOAL: 3 edge states w checkoutie.

CHANGES:
1. Toggle „Foglalás vendégként" vs „Belépés a foglaláshoz": gdy zalogowany, pola są pre-filled i jest hint „Korábbi foglalásod adataival".
2. Stan błędu z poprzedniego stepu: jeśli URL ma `?error=rooms-changed`, banner na górze „A választott szobák már nem elérhetők — frissítsd a foglalást".
3. Mobile (375): summary chowa się jako collapsible accordion `Foglalás részletei (Teljes ár: 133 217 Ft) ▾` na samej górze. Po rozwinięciu = full summary card.

ACCEPTANCE:
- Toggle guest/login działa.
- Error banner widoczny przy ?error=rooms-changed.
- Mobile summary jest collapsible accordionem.
```

---

## 4. PAYMENT — `04-payment.html`

### Konwencje vs live

Live ma sekcję `Fizetés` jako krok 4 po `Sikeres foglalás` (krok 3). To znaczy że:
- Krok 3 = potwierdzenie rezerwacji bez płatności (rezerwacja jest zachowana, user dostaje email)
- Krok 4 = wybór metody płatności + faktyczna płatność

**Decyzja design**: dla prototypu zachowujemy ten flow. Krok 3 to **Foglalás összegzése + opcjonalny pay-at-hotel**, krok 4 to **Fizetés online**. Ale dla user'a piszącego prepay rate, krok 3 i 4 łączymy w „Foglalás és fizetés" — żeby zmniejszyć abandonment.

### Prompt P.1 — Payment method selector + Stripe-style card form

```
GOAL: prototype/04-payment.html. Step=Fizetés (4 z 4 w stepperze). User wybiera metodę płatności i wpisuje dane.

CONTEXT:
- HU rynek: 4 metody płatności: Bankkártya (Visa/MC), SZÉP-kártya (OTP/MKB/K&H), Apple Pay / Google Pay, Banki átutalás (pre-paid)
- Live ma cancellation policy „A lemondási díj 130 217 Ft" wcześniej — w payment musimy to powtórzyć

CHANGES:
1. <body>:
   - <BrandBar/>
   - <CheckoutStepper currentStep={4}/>
   - 2-col layout (form left, summary right):
     - <main.payment-col>:
       - <h1>Fizetés</h1>
       - <PaymentMethodSelector/>: 4 tabs (Bankkártya, SZÉP-kártya, Apple Pay / Google Pay, Banki átutalás) — segmented control z ikoną i nazwą.
       - <PaymentForm method={selectedMethod}/>:
         - **Bankkártya**: Stripe Elements-style fields — Card number, MM/YY, CVC, Cardholder name. Save card checkbox (opt-in).
         - **SZÉP-kártya**: dropdown wystawcy (OTP/MKB/K&H), kartanummer, EAN, jelszó/PIN. Info-box: „SZÉP-kártya kifizetést az adott wallet támogatja."
         - **Apple/Google Pay**: native button (placeholder).
         - **Banki átutalás**: pokaż dane przelewu, deadline „Eddig fizetendő: máj. 12. 23:59". Info: „A foglalásod 24 órán belül megerősítjük, ha az átutalás megérkezett."
       - <CancellationReminder/>: copy „Foglalásod a Lemondási feltételek alapján kezelhetjük. <a>Részletek</a>"
       - <TrustStrip/>: 🔒 PCI DSS Level 1 | 256-bit SSL | 3D Secure
       - <button className="btn-primary lg">Fizetés <amount> Ft</button>
     - <aside.summary-col sticky>: jak w checkout (C.1), ale z highlighted „TERAZ FIZETSZ: <prepay>", „PÓŹNIEJ W HOTELU: <ifa>".
2. **3D Secure flow** mock: po klik CTA, pokaż modal `3D Secure verification` z czarnym backdrop, placeholder bank-logo, fake OTP input. Po 3s przejście do `?success`.
3. **Error state**: jeśli URL `?error=card-declined`, banner „A kártyádat elutasították — próbálj másik kártyával" + log dlaczego (CVC, expiry, funds).

ACCEPTANCE:
- 4 tabs payment methods.
- Bankkártya form ma 4 pola.
- 3D Secure modal pokazuje się po klik CTA.
- Error state ?error=card-declined pokazuje banner.
- Summary highlightuje split „Teraz" vs „W hotelu".
```

### Prompt P.2 — Trust & security signals

```
GOAL: Sekcja trust-signals nad i pod form, krótkie pewne komunikaty.

CHANGES:
1. Nad form, mały badge-row: „🔒 100% biztonságos fizetés", „💳 Visa, Mastercard, SZÉP elfogadott", „↩️ Ingyenes lemondás <date>-ig (rate-dependent)"
2. Pod form, micro-copy: „Nem terhelünk semmilyen rejtett díjat. Az árban szerepel az ÁFA (27%), az IFA pedig külön a helyszínen fizetendő (3 000 Ft)."
3. Footer simplified — tylko: Adatvédelem | Felhasználási Feltételek | Ügyfélszolgálat (CC numer).

ACCEPTANCE:
- Trust-strip nad form + micro-copy pod = oba widoczne.
- Footer ma 3 linki + CC.
```

---

## 5. THANK YOU / SIKERES FOGLALÁS — `05-thankyou.html`

### Co tu musi być

- **Confirmation hero**: ✅ duża zielona checkmark + headline „Köszönjük! A foglalásod sikeres" + sub „Visszaigazoló e-mailt küldtünk a következő címre: user@example.com".
- **Booking reference number** z copy-button (np. SZALLAS-2026-A4F7K2).
- **Summary card** (jak w checkout).
- **What next** strip: 1) Email confirmation, 2) Check-in instructions, 3) Cancel/modify link.
- **Cross-sell**: „Programok a közelben — fedezd fel Siófokot" — 4 thumbnails z eventami/atrakcjami (link do Programkereső).
- **Add to calendar**: Google / Apple / Outlook buttons.
- **Receive SMS reminder** opt-in.
- **Refer-a-friend / loyalty**: Zarejestruj się i kapj 5% kedvezményt a következő foglalásodra.
- **Footer**.

### Prompt T.1 — Confirmation hero + summary + add to calendar

```
GOAL: prototype/05-thankyou.html. Po sukcesie płatności — komunikat sukcesu + summary + akcje.

CHANGES:
1. <body>:
   - <BrandBar/>
   - <ConfirmationHero/>:
     - duża zielona checkmark animowana (SVG draw-on)
     - <h1>Köszönjük! A foglalásod sikeres.</h1>
     - <p>Visszaigazoló e-mailt küldtünk a következő címre: <strong>{userEmail}</strong></p>
     - Referencja: BIG mono „SZALLAS-2026-A4F7K2" + copy-button
   - <BookingSummary/> (reuse z checkout C.1)
   - <NextStepsStrip/>: 3 kafelki:
     - 📧 E-mail visszaigazolás úton (with timestamp)
     - 🏨 Bejelentkezés <date> 14:00-tól
     - ✏️ Módosítás vagy lemondás <link>
   - <AddToCalendar/>: 3 buttons (Google, Apple, Outlook) z .ics gen
   - <SmsReminderOptIn/>: checkbox + phone input — opt-in for reminder 1 day before check-in
   - <CrossSell title="Programok a közelben — fedezd fel Siófokot"/>: 4 thumbnails z eventami
   - <LoyaltyTeaser/>: „Regisztrálj a Szallas.hu VIP programra és kapj 5% kedvezményt a következő foglalásodra" + CTA „Regisztrálok"
   - <Footer/>

ACCEPTANCE:
- Checkmark animated.
- Referencja jest copy-able (button na clipboard).
- Add to calendar generuje placeholder .ics.
- SMS reminder pokazuje pole telefon po opt-in.
- Cross-sell 4 programy.
```

### Prompt T.2 — Email confirmation preview + GDPR transparency

```
GOAL: Pokaż preview emaila (jako modal lub poniżej hero) + informację GDPR jakie dane zapisaliśmy.

CHANGES:
1. <EmailPreview/> jako toggle „📧 Mutasd az e-mailt": modal z renderem confirmation email (z hotel hero, dane rezerwacji, polityka anulowania, kontakt CC).
2. <DataNote/>: micro-copy „Adataidat a foglalás teljesítéséhez használjuk fel. <a>Hogyan kezeljük az adataidat?</a>" — link do polityki prywatności.

ACCEPTANCE:
- Modal preview emaila pokazuje pełen confirmation.
- Link GDPR widoczny pod hero.
```

---

## 6. Cross-screen harmonizacja — po wszystkich ekranach

### Prompt X.1 — Spójność: testy wzajemne

```
GOAL: Po zbudowaniu wszystkich 5 ekranów (Wave 4 = homepage, listing, checkout, payment, TY) + PDP po Wave 3, wykonaj audit spójności:
- Kolor primary CTA identyczny (czerwony vs pomarańczowy — decyzja jedna dla całego flow)
- Brand-bar identyczny na każdym ekranie
- SearchBar zachowuje state między ekranami (URL params)
- Footer identyczny
- Stepper w checkout/payment/TY ten sam
- Empty/error states konsystentne (ten sam tone-of-voice)

CHANGES:
1. Zrób screenshot każdego ekranu na 1440×900 i 375×812.
2. Wgraj 12 screenshotów (6 ekranów × 2 viewporty) i poproś Claude: „Wskaż 10 inconsistencies — gdzie style się rozjeżdżają, gdzie copy nie pasuje, gdzie CTA inny."
3. Spisz inconsistencies do listy.
4. Wykonaj follow-up promptów per inconsistency, zorientowane na konkretny diff.

ACCEPTANCE:
- Lista 10 inconsistencies stworzona.
- Każda fixed w osobnym mini-prompt'cie.
- Final visual diff: wszystkie 6 ekranów wyglądają jak jeden produkt.
```

---

## Sumaryczna lista 35 promptów do wykonania

| Wave | Faza | Promptów | Czas (h) |
|---|---|---|---|
| Wave 1 | Hero/Sidebar/IA/meal/filters | 8 (W1.1–W1.8) | 6–8 |
| Wave 2 | Map/edge/perf | 3 (W2.1–W2.3) | 3–4 |
| Wave 3 | Polishing (desktop+mobile) | 10 (W3.1–W3.10) | 6–8 |
| Setup | ds.html extraction | 1 (S.1) | 1 |
| Homepage | flow ekran 1 | 3 (H.1–H.3) | 2–3 |
| Listing | flow ekran 2 | 3 (L.1–L.3) | 3–4 |
| Checkout | flow ekran 3 | 2 (C.1–C.2) | 2 |
| Payment | flow ekran 4 | 2 (P.1–P.2) | 2 |
| Thank you | flow ekran 5 | 2 (T.1–T.2) | 1–2 |
| Harmonizacja | cross-screen | 1 (X.1) | 2 |
| **TOTAL** | **wszystko** | **35** | **28–38 h** |

**Realny tygodniowy plan**: 2 osoby × 5 dni × 4h fokus = 40h. Spina się z buforem.

---

## Tips do pracy z Claude Design

1. **Nigdy nie wklejaj 2 promptów jednym message'em** — kontekst zjada.
2. **Każdy prompt zaczynaj od `GOAL:`** — to focus.
3. **Daj „ACCEPTANCE:` w prompt'cie** — to pomaga modelowi się sprawdzić zanim odda kod.
4. **Po każdej zmianie zrób smoke test** — otwórz HTML i sprawdź na 1440 i 375.
5. **Commit per prompt** — `git commit -m "<P-id>: <opis>"`. Daje rollback.
6. **Nie używaj „popraw UX"** — używaj `CHANGES: <punkty>`.
7. **Gdy model dodaje śmieci**: `Skup się tylko na zmianach z mojego promptu. Cofnij <X>. ACCEPTANCE bez zmian.`
8. **Tweaks panel zostaw na każdym ekranie** — to gold dust dla A/B planowania.
