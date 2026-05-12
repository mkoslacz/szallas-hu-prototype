# 01 — Review propozycji prezesa (object page · Hotel Aurora Balaton)

**Scope review:** `prototype/Hotel Aurora Balaton.html` (≈36k linii, single-file React via Babel, desktop + mobile, panel „Tweaks" do A/B).
**Cel biznesowy:** podnieść konwersję, UX i używalność OTA Szallas.hu — w domyśle co najmniej do poziomu siostry **nocowanie.pl** (ten sam backend, lepsza konwersja), z aspiracją do parytetu z **Booking/Agoda/Trip**.

---

## 0. Executive summary (TL;DR)

Prototyp prezesa to **bardzo dobry punkt startowy** na poziomie systemu designu (tokeny kolorów/typografii, radii, cienie, hierarchia czcionek). Ma kilka **konkretnych przewag** nad obecnym szallas.hu (mosaic hero, sticky sub-nav, sidebar z „what's included", stepper przy rate'ach, modal pokoju w stylu Accor), ale też **3 kategorie problemów**, które uniemożliwiają wdrożenie 1:1:

1. **Information architecture / hierarchia na fold-zero**: hero jest „dziurawy" (sam prezes to zaznaczył kółkiem na `draw-0e62f167`), score-pill wystaje znad galerii absolutnym pozycjonowaniem, sidebar konkuruje wizualnie z galerią.
2. **Mapa to fake SVG** — w briefie wprost wskazana jako klucz konwersji listing→PDP; do produkcji musi pójść realna mapa (Leaflet/MapLibre + POI clustering + filtry odległości).
3. **Dark-patterny w Tweaks** (urgency, social-proof viewers, „last 2 rooms") włączone domyślnie psują wiarygodność marki, której USP to **„100% igazolt vendég" trust** — to musi zostać per-feature regułą, nie domyślem.

Ocena ogólna: **utrzymujemy bazę, robimy iteracyjny update + dopisujemy resztę flow**. From-scratch nie jest uzasadnione (patrz Deliverable 4).

> **Uwaga metodologiczna o materiałach:** screenshoty w `prototype/uploads/` to **historyczne inputy** (mood-board, design references), które prezes konsumował generując prototyp — NIE są to konkurencyjne benchmarki ani strategiczne opcje produktowe. W tym dokumencie używam ich tylko do reverse-engineering intencji designerskiej (np. `draw-*` to anotacje prezesa nad prototypem, `pasted-1778473322182` to Accor-style room modal reference dla `RoomGalleryModal`). **Realne benchmarki** to live szallas.hu (Chrome MCP, §8) + (planowane) nocowanie.pl + Booking/Agoda.
>
> **Uwaga o Tweaks panelu:** Tweaks modelują **per-property config** („dla TEJ oferty, które dźwignie mają sens"), NIE globalny opt-in/opt-out etyczny. Hotel z realnymi 3 ostatnimi pokojami → urgency ON, hotel z 50 wolnymi → OFF; rate z realnym −15% promo → priceAnchor ON, bez → OFF. W prod każdy tweak powinien dostać **data-source spec** (z jakiego pola backendu się włącza). Panel Tweaks to demo-tool do A/B exploration podczas review — w prod nie jest user-facing, jest backend-driven.

---

## 1. Wymiary oceny — proponowana matryca

Brief prosił o jawne wskazanie wymiarów. Poniżej **20 wymiarów** podzielonych na 5 grup. Dla każdego: skala 0–5 (0 = brak/krytyczne, 5 = produkcyjny parytet z Booking).

### A. Fundamenty UX
1. **Information architecture** — kolejność sekcji, hierarchia, scroll-spy, deep-links
2. **Visual hierarchy & readability** — kontrast, typografia, długość linii, gęstość
3. **Scannability** — jak szybko user znajduje cenę, ocenę, pokój, mapę, anulację
4. **Cognitive load** — ile decyzji per fold, ile chipów/odznak, redundancja CTA

### B. Konwersja
5. **CTA strategy** — jeden primary, lokalizacja sticky, kontekstowy state (z wyborem / bez)
6. **Pricing transparency** — total vs nightly, ÁFA/IFA, dopłaty, dzieci, zwierzęta
7. **Urgency & social proof (etyczne)** — czy to fakty, czy fabryka
8. **Trust & credibility** — verified reviews, polityki, kontakt, gwarancje, payment badges
9. **Friction in room→checkout** — liczba kliknięć, kontekst niesiony do kolejnego ekranu

### C. Treść i dane
10. **Content density per fold** — proporcja treść/whitespace, vs Booking/Agoda
11. **Edge & empty states** — sold-out, brak recenzji, brak zdjęć, brak mapy POI
12. **Localization & HU market fit** — formaty cen, daty, SZÉP-kártya, ÁFA, IFA, BKK
13. **Honest UX / dark-pattern audit** — co jest „nudge", co jest manipulacją

### D. Technicz­ne / system designu
14. **Design tokens consistency** — kolory, radii, cienie, spacing-scale, typo-scale
15. **Componentability / reusability** — czy te same komponenty zadziałają na listing/checkout
16. **Performance perception** — LCP, image strategy, skeleton states, layout shift
17. **Accessibility (WCAG 2.2 AA)** — kontrast, focus, aria, keyboard, screen-reader
18. **SEO scaffolding** — semantic HTML, schema.org Hotel/LodgingBusiness/Review

### E. Konkurencja i ekosystem
19. **Comparative parity** — vs Booking, Agoda, Trip, Expedia, nocowanie.pl (sibling)
20. **Funnel readiness** — czy PDP czyściutko przekazuje stan do checkout/payment/TY

> **Sugestia metodologiczna:** ocenę 0–5 prowadzimy **per ekran × per wymiar** i agregujemy do dashboardu w Notion/Sheets. To pozwala później mierzyć delty po iteracjach. Każdy wymiar dostaje też 1–3 „acceptance criteria" jako testy DoD.

---

## 2. Ocena propozycji prezesa per wymiar (object page)

Skróty: ✅ mocna strona · ⚠️ do poprawy · ❌ blokujące dla produkcji.

### A. Fundamenty UX

| # | Wymiar | Ocena | Komentarz |
|---|---|---|---|
| 1 | Information architecture | **3/5** | Kolejność (Overview→Rooms→Reviews→Amenities→Location→FAQ) jest sensowna dla direct-booking OTA. Sub-nav sticky działa. ⚠️ `top-row` z galerią + sidebarem jest „odsadzony" od `hotel-header` (whitespace zaznaczony przez prezesa na draw-0e62f167). ⚠️ Score-pill jest `position: absolute; marginTop:-86px` nad galerię — kruche, łamie się przy szerokim hotelu. ✅ Deep-link `#rooms/#reviews/#location` działa, scroll-spy poprawny. |
| 2 | Visual hierarchy | **4/5** | Mocna typografia (Inter 900 na hotel-name, dobra skala 14→34px). ✅ Czerwony akcent ma jeden cel = CTA. ⚠️ Hierarchia na sidebar (eyebrow→price→total→urgency→social-proof→divider→CTA→key-features) jest **za długa** — user musi przebić się przez 7 warstw zanim dotrze do CTA. ⚠️ „Save badge -15% Tavaszi akció" konkuruje z ceną o wzrok. |
| 3 | Scannability | **3/5** | ✅ Highlights compact (8 chipów z ikoną i sub) — bardzo skanowalne. ✅ Rate-table 4-kolumnowa (opis · guests · board · price · stepper) — czytelna. ⚠️ Score 9.1 jest w 4 miejscach (sidebar, score-pill, hero overlay, mobile-hero) i każdy ma inny styl. ❌ Brak persistentnej informacji „od kiedy do kiedy", dopóki user nie scrolluje do sekcji Rooms (BookingModifier). |
| 4 | Cognitive load | **2/5** | ⚠️ Sidebar ma w trybie „pre-selection": eyebrow, save-badge, urgency, social-proof, key-features (5 emoji+pill), checkbox-y „free cancellation", „pay at hotel", „free Wi-Fi". To **9 elementów wizualnych** powyżej fold. ❌ Room-card ma 3 chipy (size/bed/guests), feature-pills (6× ✓), rate-tags (2–4 chipów per rate), urgency tag „Już tylko X pokoi", policy-line — to **15+ chipów per pokój**. Booking ma 3–4. |

### B. Konwersja

| # | Wymiar | Ocena | Komentarz |
|---|---|---|---|
| 5 | CTA strategy | **4/5** | ✅ Primary „Szobát választok" jest jednoznaczne (czerwone, jeden kolor w całej stronie, shadow-cta). ✅ Sticky booking-bar pojawia się dopiero po `selectionRooms>0` — to dobra dynamika (nie nachalna). ✅ Sub-nav ma kontekstowe CTA znikające na sekcji `rooms`. ⚠️ Mobile sticky CTA „Szobát választok" prowadzi do tabu rooms — ale na fold-zero (Information) mógłby od razu być widoczny CTA mini (jak Booking). |
| 6 | Pricing transparency | **2/5** | ⚠️ Total vs nightly jest tweakiem, ale w prod musimy zdecydować. ⚠️ „ÁFA-val" napisane przy /éj, ale **brak IFA (idegenforgalmi adó)** — w HU to lokalny podatek miejski 4–5% płatny w hotelu, *nie* w ÁFA. To pole minowe. ❌ Brak dopłat za dziecko, łóżeczko, zwierzę, parking, śniadanie (są w amenities, ale nie w breakdownie cen). ❌ Brak waluty drugiej (EUR) dla cross-border bookerów. ⚠️ Strike-through `original = price*1.18` jest **fabryczny** (zawsze +18%) — to dark pattern jeśli nie ma realnej promocji. |
| 7 | Urgency & social proof | **3/5** | Tweaks są **per-property config** (włączane gdy backend ma realne dane: `rate.realStockLeft<=3` dla urgency, `viewers24h>50` dla social-proof). Default state w kodzie to `{ priceMode: "total" }` — boolean tweaks są undefined (czyli OFF). Bug ekspozycji: w demo-screenshocie wyglądają na ON, bo prezes włączał je manualnie do prezentacji. ⚠️ Wymóg dla prod: każdy tweak musi mieć udokumentowany **data-source spec** (z jakiego pola backendu się aktywuje) i fallback gdy brak danych. EU DSA / CPC compliance OK dopóki dane są realne. |
| 8 | Trust & credibility | **4/5** | ✅ „100%-ban igazolt vendég" w review-summary — bardzo silne. ✅ Verified-badge per review. ✅ Score-pill linkuje do sekcji reviews. ✅ Call-center w brandbarze z godzinami — dobre dla HU users 50+. ⚠️ Brak: gwarancji „najlepsza cena" (Booking ma), badge'y płatności (Visa/MC/SZÉP), polityki zwrotów blisko CTA, kontaktu hotelu. ⚠️ Footer ma `nevogate` zamiast logo Szallas.hu — wygląda na artefakt z innego designu. |
| 9 | Friction room→checkout | **2/5** | ⚠️ Stepper jest świetny, ALE: **nie ma checkout'u**. Sticky booking-bar mówi „Tovább a foglaláshoz →" i to ślepy link. Cały flow checkout/payment/TY do dopisania (Deliverable 3). |

### C. Treść i dane

| # | Wymiar | Ocena | Komentarz |
|---|---|---|---|
| 10 | Content density | **3/5** | ⚠️ Highlights `compact` to 8 kafelków — to dużo. Booking ma 5–6. nocowanie.pl 4–5. Sugestia: 6 + „pokaż wszystkie". ⚠️ Description ma fade-teaser i „Tovább olvasom" — dobre, ale fade-mask na drugi akapit jest mało widoczny w jasnym motywie. |
| 11 | Edge & empty states | **1/5** | ❌ Brak: sold-out state na pokoju, brak rate'ów na daty, „brak recenzji" copy, „brak zdjęć kategorii", error mapy. To **musi** być w prototypie do A/B (różne hotele różnie się zachowują). |
| 12 | Localization & HU | **3/5** | ✅ Format ceny `Intl.NumberFormat('hu-HU')` poprawny, separator daty. ✅ Wzmianka o SZÉP-kártya (kluczowa dla HU). ⚠️ Brak IFA (patrz #6). ⚠️ Brak wzmianki o BKK/MÁV/Volánbusz przy POI — tylko ogólny „Buszpályaudvar". ⚠️ Daty wprost zakodowane („ápr. 19 – ápr. 21") — musi być z `Intl.DateTimeFormat`. |
| 13 | Honest UX audit | **3/5** | Tweaks per-property (#7) są etyczne, dopóki backend wystawia realne dane. VIP-locked teaser („Lépjen be a VIP ár megtekintéséhez") jest OK — VIP **istnieje produkcyjnie** (potwierdzone w live, §8.1), daje **10–20% nie 40%** jak w prototypie. P1: skoryguj multiplier z 0.6 na 0.85 i copy z „VIP −40%" na „VIP −10–20%". Strikethrough `original = price*1.18` fabrycznie — to JEST dark pattern, bo nie pochodzi z `rate.original`. P0: usunąć fabryczny multiplier, włączyć strike tylko gdy backend daje realny `originalPrice`. |

### D. Technicz­ne / system designu

| # | Wymiar | Ocena | Komentarz |
|---|---|---|---|
| 14 | Design tokens | **5/5** | ✅ Świetnie zdefiniowane: primary/hover/press, surface 1–3, ink 300–900, line/line-strong, success/warn/info, radii 6/10/14/20, shadows sm/md/lg/cta, focus-ring. To **trzeba ekstraktować do osobnego pliku `tokens.css`** i reużyć na listing/checkout. |
| 15 | Componentability | **3/5** | ⚠️ Wszystko jest w jednym pliku HTML. Komponenty React są zadeklarowane lokalnie. Migracja na listing/checkout wymaga rozbicia na: `BrandBar`, `SearchBar`, `Breadcrumbs`, `Footer`, `Photo`, `Stepper`, `Switch`, `Seg`, `Tag`, `Modal`, `RatingBar`, `Map`, `POI` jako reużywalne. |
| 16 | Performance perception | **2/5** | ❌ Babel-in-browser to **−50% LCP** vs prekompilacja. ❌ Brak skeleton states. ❌ Brak `loading="lazy"`/`decoding="async"` na zdjęciach (`<Photo>` to placeholder, ale w prod to lazyload + srcset). ⚠️ Single 36k-linii HTML to nie jest deployable. To prototyp — uświadomić, że produkcja idzie do Next.js/React app. |
| 17 | Accessibility | **2/5** | ❌ Modale (`GalleryModal`, `RoomGalleryModal`, `bm-pop`) **nie mają focus-trap** ani `aria-modal`. ❌ Click handlers na `<div>` (np. `<div className="gallery-hero" onClick={onOpen}>`) — musi być `<button>` lub `role="button" tabIndex={0}` + Enter/Space. ⚠️ Stepper nie ma `aria-live` ani `aria-label="N pokoi wybranych"`. ⚠️ Mapa SVG nie ma `<title>` ani `<desc>`. ⚠️ Kontrast `var(--ink-500)` na `var(--surface-2)` musi być sprawdzony WCAG (najpewniej fail AA dla 13px). |
| 18 | SEO scaffolding | **2/5** | ⚠️ `<h1>` poprawnie na nazwę hotelu. ⚠️ Sekcje mają `<section id="...">` — OK. ❌ Brak schema.org `Hotel`, `AggregateRating`, `Review`, `FAQPage`, `BreadcrumbList`. ❌ Brak `<meta name="description">` (jest title). ❌ Brak Open Graph / Twitter Card. |

### E. Konkurencja i ekosystem

| # | Wymiar | Ocena | Komentarz |
|---|---|---|---|
| 19 | Comparative parity | **3/5** | vs Booking: brak filtra recenzji (po typie podróży, języku, dacie), brak „price comparison" na rate'ach, brak „compare 2 hotels". vs Agoda: brak loyalty points wizualizacji na CTA, brak „secret deals". vs Trip: brak hover-cards na POI map. vs nocowanie.pl: nocowanie ma bardziej dosłowny breakdown ceny per noc per pokój (warto skonfrontować). |
| 20 | Funnel readiness | **1/5** | ❌ Checkout/payment/TY nie istnieją. PDP jest „island". Sticky booking-bar prowadzi w pustkę. To Deliverable 3. |

### Średnia ocena: **2.8 / 5** — solidny szkielet, brakuje pełnego flow, mapy, edge cases, a11y i compliance.

---

## 3. Wybór anotacji prezesa (z `draw-*.png`)

Na screenshotach `draw-0e62f167`, `draw-3f42daa2`, `draw-61c58dd0` prezes:
- **Zakreślił dużym kółkiem prawą część hero** powyżej galerii — pustkę między `hotel-header` a galerią/sidebar.
- **Zakreślił sidebar card** — sugeruje że jest „bohaterem", co potwierdza intencję, by sidebar był first-class citizen.
- **Zakreślił ratings 9.1 / „Kiváló"** — chce żeby score był wyraźniejszy / przeniesiony.

**Interpretacja:** zbyt duża pustka po prawej hero, zbyt mały albo źle umiejscowiony score, sidebar powinien być „pełniejszy" / mocniej zakotwiczony. To są realne problemy — adresujemy je w Deliverable 2.

---

## 4. Priorytetyzacja findings (P0–P3)

### P0 — blokujące dla produkcji
- **P0.1** Mapa: zamienić fake SVG na realną (Leaflet/MapLibre + POI markers + filtry odległości + heatmapa atrakcji).
- **P0.2** Tweak data-source schema: każdy tweak (`showUrgency`, `showSocialProof`, `showPriceAnchor`, `showVipTeaser`) dostaje udokumentowany backend-source (np. `urgency = rate.realStockLeft <= 3 && bookingVelocity > X`), fallback do OFF gdy brak danych. Komentarz w kodzie + JSDoc.
- **P0.3** Fabryczny strike `original = price*1.18` — usunąć, włączać tylko gdy backend daje `rate.originalPrice`.
- **P0.4** Funnel: dopisać checkout/payment/TY (Deliverable 3).
- **P0.5** A11y: focus-trap w modalach, role/tabIndex na klikalne divy, aria-label na stepper, alt na <Photo>.
- **P0.6** IFA / pełen breakdown ceny — z dopłatami za dziecko/zwierzę/parking.

### P1 — pre-launch
- **P1.1** Fix hero layout (whitespace, score-pill, sidebar alignment) — patrz Deliverable 2 Wave 1.
- **P1.2** Edge & empty states na każdym module.
- **P1.3** Schema.org + OG/Twitter + meta description.
- **P1.4** Ekstrakcja design tokens do `tokens.css`, komponenty do `components/`.
- **P1.5** Decyzja Total vs Nightly (nie tweak — wybór per market, default = total dla HU bo dominuje na nocowanie.pl).
- **P1.6** Zmniejszenie liczby chipów per pokój z 15+ do 5–6.

### P2 — post-launch optymalizacje
- **P2.1** Filter recenzji (typ podróży, język, data, sentyment).
- **P2.2** Compare rooms (max 3).
- **P2.3** Loyalty wizualizacja na CTA (jeśli VIP jest realny).
- **P2.4** Map POI hover-cards i clustering.
- **P2.5** Skeleton states + image srcset.

### P3 — eksperymenty
- **P3.1** „Secret deal" tag dla mobile-only.
- **P3.2** Personalizacja highlights (rodzina, para, biznes).
- **P3.3** „AI suggested room" na bazie filtrów z listing.
- **P3.4** Save → wishlist z notyfikacjami przy spadku ceny.

---

## 5. Co prezes zrobił świetnie (do utrzymania)

1. **Design tokens** (#14) — komplet, semantyczny, z fallback aliasami.
2. **Tweaks panel** — to jest **gold dust dla A/B**. Każdy lever powinien dostać feature-flag w GrowthBook/Optimizely w prod.
3. **Mosaic hero + lightbox z kategoriami + wstawkami CTA co 6 zdjęć** — to wzorzec.
4. **Room modal w stylu Accor** (z listą „co jest / czego nie ma") — to przewaga nad Booking.
5. **Sub-nav sticky z kontekstowym CTA** — czysty pattern.
6. **VIP loyalty teaser w stanie locked** — etyczne nudge do logowania (pod warunkiem że VIP daje realny discount).
7. **Format ceny HU + SZÉP-kártya wzmianka** — pokazuje znajomość rynku.
8. **Mobile bottom-tabs + bottom sticky CTA + osobny mobile component** — separation of concerns jak Booking.

---

## 6. Co należy bezwzględnie wyciąć / zmienić (do Deliverable 2)

1. **`marginTop:-86px` na ReviewBadge** — przenieść badge do `hotel-header` flexbox row (right side), nie absolutnie.
2. **`top-row` z galerią + sidebar w flex row** — całość ułożyć w grid `1fr 360px` z `gap: 24px`, sidebar `position: sticky; top: 84px`.
3. **`original = price*1.18` fabrycznie** — usunąć, strike-through tylko gdy backend zwraca realny `originalPrice`.
4. **Brak `tweakSchema`** — dodać obiekt `TWEAK_SCHEMA = { showUrgency: { source: 'rate.realStockLeft', activeWhen: '<=3', copy: '...' }, ... }` jako kontrakt z backendem.
5. **Highlights `compact` 8 kafelków** — zredukować do 6, ostatni „+2 więcej" linkiem do amenities.
6. **Sidebar 9 elementów** — kompres do: eyebrow → cena → urgency (opt) → CTA → 3 trust-pills → „Co zawiera cena" link.
7. **Mosaic hero `+ 64 fotó` overlay** — zwiększyć touch-area, dodać licznik kategorii (Booking: „1 / 68 · Szoba (12)").
8. **Footer `nevogate` logo** — wymienić na realne Szallas.hu trust badges (Visa/MC/SZÉP/PayPal/SSL).
9. **Stepper na rate'ach** — dodać `aria-live="polite"` + tooltip „Maks. 4 pokoje tego typu".
10. **Click handlers na `<div>`** — wszystkie zamienić na `<button>` lub semantyczny element.

---

## 7. Otwarte pytania do biznesu

1. **Tweak data sources** — które tweaki mają realne źródła backendowe? `rate.realStockLeft` istnieje? `viewers24h` istnieje? `rate.originalPrice` jest wystawiane? Bez schematu nie można zwalidować P0.2/P0.3.
2. **VIP discount %%** — live banner mówi „Akár 10–20% kedvezmény". Prototyp ma multiplier 0.6 (40% off). Co jest realne, czy to różne segmenty (VIP1 = 10%, VIP2 = 15%, VIP3 = 20%)?
3. **CTA color decyzja** — live używa pomarańczowy CTA (Kiválasztom/Lefoglalom), prototyp czerwony. Czy jest świadoma decyzja designerska o separacji czerwony-brand vs pomarańczowy-akcja, czy to artefakt?
4. **Cel konwersji** — chcemy parytetu z nocowanie.pl czy z Booking? Różny target = różny zakres pracy.
5. **Single-language czy multi?** Footer pokazuje CZ/RO/PL — czy w pierwszej iteracji robimy tylko HU, czy od razu i18n?
6. **Daty produkcji** — kiedy MVP? Bo to determinuje czy idziemy iteracyjnie (Deliverable 2+3) czy from-scratch (Deliverable 4).

---

## 8. Live audit szallas.hu (Chrome MCP, 1440×900, 2026-05-12)

Po podpięciu Chrome wykonałem walk-through pełnego flow: **homepage → /balaton (disambig) → /balaton-3 (listing) → /residence-hotel-balaton-siofok (PDP) → /szobafoglalas/.../?step=personal-information (checkout step 2)**. Kluczowe obserwacje, które zmieniają niektóre wcześniejsze założenia:

### 8.1 Homepage (`https://szallas.hu/`)
- **Brand red potwierdzony** (`#E30613`-ish), logo z tagline „Úgy is lett!" w czerwonym tooltipie.
- Hero ze zdjęciem chorwackiego wybrzeża + zakładki **Szállások | Programkereső** (2 typy oferty: noclegi vs eventy/programy).
- **Search bar 4-polowy** (destination · Érkezés-Távozás · 1 szoba 2 felnőtt 0 gyermek · czerwone CTA „Keresés"). Pola na BIAŁYM tle nałożonym na hero.
- Trust line pod search: „Fizess online, akár SZÉP-kártyával is" · „Indulj el új élmények felé" · **„3 158 300+ vendégértékelés"** (sygnał skali).
- Kategoria carousel „Inspirálódj…" (Pünkösdi hosszú hétvége, Balaton legjobb, Wellness és spa, Horvátország, Félpanzió, TOP úti célok, Romantikus kastélyszállók, Faházak) — 8 tile'i, gradient na obrazku.
- **Top ajánlatok**: 3-kolumnowy grid hotelu z **DUŻYM ZIELONYM KÓŁKIEM SCORE** (np. 9.3) w prawym górnym rogu zdjęcia, cena `24 673 Ft /fő/éj` (per osoba per noc), „Tartalmazza az adókat és díjakat".
- **VIP block mid-page**: `Akár 10-20% kedvezmény csak VIP tagoknak` (NIE −40% jak w prototypie prezesa — to skala 10–20%).
- **Mobile discount banner**: „Szálláshelyek minimum 10%-kal olcsóbban mobilon" — jasne PWA/app incentive.
- Sekcja „Kiemelt ajánlataink" z heart-save na każdej karcie.

### 8.2 Listing — `/balaton` to disambiguation
- `https://szallas.hu/balaton` → ekran **disambig** z 2 grupami: „Balaton régió (5167 szálláshely)" i „Balaton település (1 szálláshely, 1276 a környéken)". To jest **antywzorzec** — user oczekuje listy hoteli, dostaje listę destynacji do wyboru.
- Mapa Google Maps w prawej kolumnie (poprawna, real Google), ale **na PDP-listingu jest BRAK mapy inline** — tylko link „térkép nézet" obok counter'a wyników (`5167 talált · térkép nézet`).

### 8.3 Listing właściwy `/balaton-3`
- **Lewa kolumna filtrów (~280px)** z bardzo bogatym filter set:
  - **Kedvezmények** (VIP), **Legnépszerűbb szűrők** (Wellness 1058, Reggeli 388, Nagyon jó 9.0+ 4151, Medence 783),
  - **SZÉP kártyás fizetés** (OTP Széchenyi Pihenőkártya 2341, MKB, K&H — kluczowy filtr HU),
  - **Ellátás** (Nincs ellátás 4910, Reggeli, Félpanzió, Teljes ellátás, Soft AI, AI),
  - **Szállástípus** (Hotel z 2–5★ podziałem, Apartman 3070, Vendégház 1312, Panzió, Faház, Hostel, Falusi turizmus, Diákszálló, Üdülőközpont…),
  - **Szobafelszereltség** (Privát fürdőszoba, Légkondi, Konyha, Pezsgőfürdő, Zuhanyzó, Fürdőkád, Erkély, Kandalló, Hajszárító, Mosógép, „Külön munkaterület laptophoz" 138 — bardzo specyficzny filtr),
  - **Ágykiosztás** (Egy kétszemélyes ágy 4643 vs Két egyszemélyes ágy 2595),
  - **Környék** (Távolság a városközpontól 1km/3km/5km · Távolság a parttól: Part 1 km-en belül 2056),
  - **Legyen a közelben** (Balatoni strand 2397, Wellness szolgáltatások).
- **Kafelek hotelu na liście** (3 kolumny: foto · info · cena):
  - Heart-save w lewym górnym rogu zdjęcia.
  - Nazwa hotelu (niebieski link, NIE czerwony!), gwiazdki + `+superior`, **rząd 7–8 amenities-piktogramów z zielonym znaczkiem `FREE`** (śniadanie/woda/AC/Wi-Fi/parking/recepcja/wellness).
  - Zielony tag z ellátással (np. „All inclusive ellátással", „Félpanzió az árban", „Reggeli az árban").
  - Zielony tekst „SZÉP kártyával is fizethetsz".
  - Po prawej: ocena słowna (Kiváló/Nagyon jó/Jó) + **liczbowy 9.5 w zielonym kółku**, count értékelés, ewentualnie **pomarańczowy badge `-9%`**, strikethrough oryginalna cena, **POMARAŃCZOWA cena bigger** (`86 642 Ft`), opis składu „2 fő, 1 éj all inclusive · Tartalmazza az adókat és díjakat", **CTA `Megnézem` (biały button)**, który po hover zmienia się w **pomarańczowy fill**.
- **Quick-filter pasek pod search bar**: tabs (Pünkösdi hétvége, Balaton legjobb, Wellness és spa, Horvátország…) — to ten sam carousel z homepage zaszyty jako filtr na top.
- **Disclosure compliance (CRITICAL)**: `A szálláshelyek által fizetett jutalék befolyásolhatja a lista sorrendjét! Bővebben` — affiliate ranking disclosure. **Prototyp prezesa nie ma żadnego odpowiednika** — to wymóg po Digital Services Act / EU DSA enforcement.
- **VIP banner mid-list**: powtórzony co kilka pozycji (Lépj be, és foglalj olcsóbban!).
- **Currency switcher HUF (Ft) dropdown** w stopce listingu.
- **Mapa**: NIE inline. Listing nie ma split view list+map jak Booking/Agoda. To **istotny gap** vs benchmark.

### 8.4 PDP — `/residence-hotel-balaton-siofok`
- **Header** (brand bar) bardziej smukły niż w prototypie prezesa — tylko hamburger + logo + currency + Ügyfélszolgálat + BELÉPEK. **Brak CC trigger w headerze** (pojawia się dopiero w sub-nav po scrollu jako `+36 30 344 2000 | szallas@szallas.hu`).
- **Persistent search bar** pod brand-barem (NIE Tweaks-opcjonalna jak w prototypie) — w prototypie prezesa to `tweaks.showSearchBar` opcjonalny, na live zawsze widoczny.
- **Breadcrumbs ULTRA-GŁĘBOKIE**: `Főoldal > Magyarország > Somogy megye > Balaton > Dél-Balaton > Siófok > Hotel Siófok > Residence Hotel Balaton Siófok` — **8 poziomów**, prototyp ma tylko 4. Można argumentować że za dużo, ale to wzmacnia SEO.
- **Hotel header**: nazwa hotelu (h1) + gwiazdki ★★★★ `+superior` *inline* z nazwą. Po prawej **DUŻE zielone kółko `9.6`** + „Kiváló 1677 értékelés" — score-pill znacznie bardziej widoczny niż w prototypie.
- **Adres jako klikalny link** z map-pin: `8600 Siófok, Erkel Ferenc utca 49., Magyarország`. Brak „120 m a Balaton-parttól" — czyli **distanceNote z prototypu jest dodatkiem prezesa, NIE ma go na live**.
- **Gallery layout: 1 BIG hero (~830×580) + 3 thumbnails pod nim** (nie mosaic z 5 zdjęć jak w prototypie). Heart-save top-left, `49 Kép` bottom-right.
- **Sidebar sticky (~370px) na prawej, 3-tab head**: `DÁTUM | UTAZÓK | ELLÁTÁS` — bardzo compact, każdy tab z mini-iconą. Defaultowo `Dátum kiválasztása · 2 fő · félpanzió`.
- **Bez wybranej daty**: info box „Pontos árakhoz adj meg dátumot!" + lista preview „1 x Standard kétágyas szoba 58 400 Ft" + sekcja **„A következő 90 nap legkedvezőbb irányára: 58 400 Ft" (FORECAST!)** + „2 fő, félpanzióval, Tartalmazza az adókat és díjakat" + CTA `Kiválasztom` (pomarańczowy).
- **Po wybraniu daty** sidebar zmienia się w:
  - Lista pokoi z trash-icon `1 x Standard kétágyas szoba (pó…) 133 217 Ft`
  - `Lemondási díj: a szállásdíj 100%-a` (strict cancel for prepaid)
  - `Előrefizetendő eddig: máj. 12. 23:59` (prepay deadline)
  - link `Fizetési feltételek`
  - `Teljes ár 133 217 Ft · 2 fő, 2 éj, félpanzióval · Tartalmazza az adókat és díjakat`
  - **POMARAŃCZOWY** CTA `Lefoglalom`
  - hint „Következő: Adatok megadása" (next-step preview)
  - link „További szobák megtekintése"
- **Sub-nav sticky po scrollu**: `Árak · Értékelés · Szolgáltatások · Térkép · ❤️` po lewej + `+36 30 344 2000 | szallas@szallas.hu` po prawej. **Tylko 4 sekcje + save** (prototyp prezesa ma 6).
- **Trust-features pas** poniżej hero (między galerią a opisem): **7 kafli z kolorowymi piktogramami** — SZÉP kártya elfogadóhely · 1084 program a közelben · 101 ajándék programkupon · Bababarát · Wellness · Klímás szobák · Összes szolgáltatás. **To NIE są highlights typu „120 m a parttól" — to są realne facts (count of programs nearby, kuponów)**.
- **Description**: krótki tekst „Siófok a Balaton déli partjának pezsgő központja…" + sekcja „Elhelyezkedés" + link `Szállás leírást mutasd ▼` (rozwiń).
- **Vendégek értékelései**: duży `9.6 · Kiváló · 1677 értékelés alapján` + **carousel 3 review cards** z IKONĄ TYPU PODRÓŻY (`Család kisgyerekekkel` z ikoną rodziny, `Középkorú pár` z ikoną dwóch osób) **zamiast avatara z inicjałami** — **lepsza informacja typologiczna niż prototyp**. Data + nazwa pokoju w jakim mieszkali (transparentne). „Összes értékelés (1677)" link.
- **„Kiváló elhelyezkedés"**: prawdziwa Google Map embedded (NIE SVG-fake jak w prototypie).
- **Lista pokoi**: mini-foto z gallery icon (klikalne), powierzchnia z zielonym chipem `nagy` (oznaczenie wielkości), liczba sypialni, amenities (Légkondícionálás, WIFI, Síkképernyős TV, Erkély/terasz). **Bez wybranej daty: każdy pokój ma boks „Pontos árakhoz adj meg dátumot! · Válassz másik időpontot"** — czyli pokój jest „zablokowany" do czasu wprowadzenia dat. To **istotna różnica vs prototyp prezesa, który ma zawsze widoczne rate-table z cenami**.
- **FAQ NIE MA na live** — to ficzer prototypu, nie ma odpowiednika.

### 8.5 Checkout (`step=personal-information`)
- **Stepper poziomy z 4 etapami**: ✅ Szállás kiválasztása · (2) **Személyes adatok** · (3) Sikeres foglalás · (4) Fizetés.
- **UWAGA — dziwna kolejność**: „Sikeres foglalás" (sukces foglalania) **PRZED** „Fizetés" — to znaczy że sukces = rezerwacja zachowana, płatność dopiero potem. To **nietypowy pattern** vs Booking (płatność w checkout) — sugeruje że szallas obsługuje wiele typów (pay-at-hotel, prepay, SZÉP-kártya) i każdy idzie inną ścieżką po kroku 3.
- **Lewa kolumna (form)**: Adatok megadása
  - **Személyes adatok**: Vezetéknév | Keresztnév | E-mail | Telefonszám (z `HU +36` country picker)
  - **Cím**: Ország (dropdown HU) | Irányítószám (kod pocztowy) | Település | Utca, házszám
  - **Kérdés, kérés a szálláshelyhez**: Megjegyzés (textarea) + kontekstowy warning `Ez a szálláshely nincs felkészülve kisállatok fogadására.` (pet policy)
  - **3 checkboxy**: newsletter opt-in (nie pre-checked ✅ GDPR), `Elfogadom az előrefizetési és lemondási feltételeket, valamint Felhasználási feltételeket` (required), `Elfogadom az Adatkezelési tájékoztatót` (GDPR, required)
  - `Ha van kedvezménykuponod, azt a foglalás elküldése után tudod beváltani a felületünkön keresztül.` — **UX issue: kupon DOPIERO po foglalás** (nietypowo vs Booking).
  - **POMARAŃCZOWY** CTA `Foglalás elküldése`
  - `100% SSL security` badge
- **Prawa sticky sidebar (booking summary)**: foto hotelu + nazwa + gwiazdki + daty z hourami check-in/check-out (`jún. 11. cs 14:00 - 18:00 - jún. 13. szo 10:00 előtt (3 nap, 2 éjszaka)`) + `2 felnőtt` + `Félpanzió` + lista pokoi + **`Lemondás feltételei: A lemondási díj 130 217 Ft`** + **`Mikor és mennyit kell fizetnem?`** sekcja z dwoma liniami:
  - `Előrefizetendő eddig: máj. 12. 23:59 — 130 217 Ft` (tooltip)
  - `A szálláshelyen fizetendő — 3 000 Ft` (tooltip) ← **TO JEST IFA!**
  - `Mit tartalmaz az ár? ▼` accordion
  - `Teljes ár 133 217 Ft · Tartalmazza az adókat és díjakat`

### 8.6 Co to zmienia w Deliverable 1

| Wcześniejszy finding | Update po live |
|---|---|
| #6 IFA / pełen breakdown ceny | **Confirmed P0** — live pokazuje 3 000 Ft `A szálláshelyen fizetendő` jako osobną pozycję. Prototyp prezesa kompletnie to pomija. To musi wejść do sidebar PDP. |
| #6 Format ceny (total vs nightly) | Live ma **`/fő/éj`** na homepage „Top ajánlatok" i **TOTAL `2 fő, 1 éj`** na listingu i PDP. **Nie ma `nightly` per-room**, jest **`per-person/per-night` lub `total per stay`**. Prototyp używa per-night/total, co jest niezgodne z konwencją domeny. **P1: ujednolicić z live.** |
| #7 Urgency / social proof | Live nie ma „134 viewers" ani „last 2 rooms" — szallas.hu **świadomie nie używa tych nudge'ów** (czego nie wiedzieliśmy). To **wzmacnia** rekomendację `default: OFF` w prototypie. |
| VIP teaser | VIP **istnieje produkcyjnie** (banner mid-list, mid-PDP), ale daje **10–20%, NIE 40%**. Prototyp musi sprowadzić %% do realistycznej skali. |
| #8 Trust footer | Live ma w stopce realne trust badges: `100% SSL security`, `Technology Fast 50 2021 CE Winner Deloitte`, `Az Év Applikációja 2022 Minőségi díj`, oraz logo `nevogate` (technologia / parent company). Prototyp ma tylko `nevogate` co teraz tłumaczy się jako spuścizna. **P1: dopisać 100% SSL + 2 nagrody.** |
| #10 Highlights count | Live PDP ma **7 trust-feature tiles** (NIE 8 highlights z opisem). Prototyp ma 8 highlights z `t/s` (title/sub) — to NADAL przewaga prototypu, bo daje konkretną informację (np. „120 m a parttól · Saját strandszakasz" zamiast samej ikony „Wellness"). **Utrzymać.** |
| Cena promo on listing | Live używa pomarańczowy `-9%` badge na karcie i strikethrough oryginalnej ceny — **tylko jeśli realny rabat**. Prototyp ma `original = price*1.18` fabrycznie. **P0: usunąć fabryczne strike, podpiąć do realnego rabatu.** |
| Mapa na listingu | **Live NIE MA inline-map split view** na liście — tylko link „térkép nézet". Prototyp prezesa też nie planuje listingu, ale w Deliverable 3 wymagamy **split-view list+map jak Booking** jako konkurencyjna przewaga. |
| Disambig `/balaton` | Antywzorzec — wystarczy gdy user wpisze „balaton" w search by trafić w disambig. **P1 dla Deliverable 3 (Homepage/Listing): autocomplete typeahead z thumbnail destynacji + bezpośrednie przeniesienie na listing.** |
| Review cards | Live używa **ikon typu podróży** (`Család kisgyerekekkel`, `Középkorú pár`) zamiast avatara/inicjałów. **Lepsza informacja typologiczna.** Prototyp ma inicjały — **rekomendacja: zmienić na typ podróży + opcjonalnie nazwę imię.** |
| 90-day forecast | Live ma `A következő 90 nap legkedvezőbb irányára` w sidebar PDP przed wyborem daty — bardzo GOOD UX (anchor cena bez daty). **Prototyp tego NIE MA. P1: dodać.** |
| CTA color | Live używa **pomarańczowy primary CTA** (Kiválasztom/Lefoglalom/Foglalás elküldése), oddzielając od czerwonego brand color (logo). Prototyp używa czerwony jako CTA. **DECYZJA: utrzymać pomarańczowy CTA (odsep od czerwonego brand) ALBO świadomie odejść — wymaga design-decision z prezesem.** |
| Sub-nav | Live ma 4 sekcje (`Árak · Értékelés · Szolgáltatások · Térkép` + ❤️) + CC info po prawej. Prototyp ma 6 (Információ, Árak és foglalás, Vélemények, Szolgáltatások, Elhelyezkedés, Egyéb) — **redundancja**. **P2: skrócić do 4 + integracja CC po prawej.** |
| Cancellation | Live na PDP sidebar przed bookingiem pokazuje `Lemondási díj: a szállásdíj 100%-a` (strict prepaid), w checkout `A lemondási díj 130 217 Ft`. Prototyp prezesa w sidebar mówi „Ingyenes lemondás ápr. 16-ig" hardcoded. **P0: dynamicznie z rate'u, nie hardcode.** |
| Coupon | Live coupon **po** foglalás (UX issue). **Deliverable 3: w checkoutie pole „Kupon" pre-booking — fix tego antywzorca, bo to jest realna przewaga vs live.** |

### 8.7 Średnia ocena po live audit

Ocena prototypu prezesa **5/5 dla design tokens** się utrzymuje, ale w wymiarach `IA`, `pricing transparency`, `localization (IFA)`, `comparative parity` lekko spadła, bo live ma niektóre fiches lepiej (90-day forecast, IFA breakdown, review-cards z typem podróży). Prototyp pozostaje silniejszy w: highlights z sub-textem, mosaic gallery, Accor-style room modal, sticky booking-bar po wyborze, FAQ section, Tweaks panel.

**Średnia: 2.9 / 5** (przewaga utrzymana — prototyp jest dobry punkt startowy, ale wymaga harmonizacji z konwencjami live + dodania kilku ficzerów z live).

---

## 9. Rekomendacja końcowa

**Idziemy iteracyjnie:** akceptujemy bazę designu prezesa, robimy Wave 1 update (hero/sidebar/IA + IFA breakdown + 90-day forecast + ikony typu podróży w reviews), Wave 2 (mapa/edge cases/a11y/realny VIP %), Wave 3 (homepage/listing/checkout/payment/TY — gdzie checkout/coupon naprawiamy live'owe antywzorce).

Plan w Deliverable 2 i 3. Plan from-scratch (Deliverable 4) trzymamy jako *contingency plan* — uruchamiamy go tylko, jeśli po Wave 1+2 average score nadal < 3.5/5 lub jeśli biznes podejmie strategiczną decyzję wymagającą resetu (mobile-first PWA, zmiana platformy techno, itp.).
