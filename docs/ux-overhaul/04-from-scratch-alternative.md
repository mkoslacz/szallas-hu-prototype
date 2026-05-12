# 04 — From-scratch alternatywa: ocena zasadności i (opcjonalnie) plan

## TL;DR — Czy warto?

**NIE w bieżącym trybie. TAK w jednym z 2 scenariuszy:**

> **Nota wstępna:** wcześniejsza wersja tego dokumentu zawierała 3-ci scenariusz „rebrand do purple" oparty na screenshocie `pasted-1778170916102-0.png`. To było moje misread — te obrazki to **historyczne inputy mood-board** które prezes konsumował generując prototyp, NIE strategiczne opcje produktowe. Scenariusz „rebrand" usunięty.

1. **STRATEGICZNY pivot do mobile-first PWA**: jeśli biznes decyduje, że Szallas.hu walczy o mobile users (live ma `Szálláshelyek minimum 10%-kal olcsóbban mobilon` jako banner — to JEST wskazówka strategii), wtedy desktop-first prototyp prezesa jest fundamentem na niewłaściwym założeniu. **Wtedy from-scratch jako mobile-first design system.**

2. **Score < 3.5 po Wave 1+2**: jeśli po ~10h pracy iteracyjnej (Wave 1+2 z Deliverable 2) średnia ocena prototypu nadal jest poniżej 3.5/5 mierzona heurystyczną matrycą (Deliverable 1 §1), to znaczy że problemy są **strukturalne, nie kosmetyczne**, i każda kolejna iteracja będzie się odbijać od istniejących wyborów. **Wtedy reset.**

Aktualna ocena prototypu po krótkim review: **2.9/5**, ale **75% problemów to P0–P1 fixable iteracyjnie** (whitespace, fake map, IFA, schema.org, a11y, edge states). Realna dynamika: 2.9 → 4.0 po Wave 1+2. **Iteracja jest tańsza i daje wyższy expected outcome niż reset.**

---

## 1. Analiza decyzyjna: iteracja vs reset

| Wymiar | Iteracja (Deliverable 2+3) | From-scratch |
|---|---|---|
| **Czas do wstępnego MVP** | 22–31h (Wave 1–3 + flow) | 60–90h |
| **Risk delivery** | Niski — bazujemy na działającym | Wysoki — wszystko nowe |
| **Wykorzystanie pracy prezesa** | Pełne (jest co-author) | Częściowe (tokeny, idea) |
| **Polityka organizacyjna** | Sprzymierzona | Może urazić (jego praca odrzucona) |
| **Możliwy outcome quality** | 4.0/5 (limity oryginału) | 4.5/5 (wolność architektury) |
| **Koszt poprawek post-launch** | Niski (znana baza) | Średni (nowy kod = nowe bugi) |
| **Możliwość A/B testów wczesne** | Wysoka (Tweaks panel istnieje) | Niska (trzeba zbudować) |
| **Spójność z live szallas.hu** | Wymusza disconnect (różny brand kolor CTA itd.) | Wolność do rebrand'u |
| **SEO continuity** | Łatwiejsza (PDP wzór już ma struktury) | Wymaga osobnej pracy |

**Werdykt:** w trybie default — **iteracja**. Z opcją reset gdy spełniony jeden z 3 warunków z TL;DR.

---

## 2. Ryzyko polityczne — perspektywa prezes-jako-co-author

To pomijalna, ale realna oś. Prezes zainwestował czas w prototyp. Wzory psychologiczne:
- **Iteracja** = uznajemy jego pracę, dodajemy do niej, jest collaborator. Decyzje per wymiar mogą być pełne dyskusji ale nie konfrontują „jego designu".
- **From-scratch** = sygnał „to było złe". Musisz tłumaczyć dlaczego, broniąc się dowodami z heurystyk i benchmarków. **Zrób to TYLKO jeśli masz mandat (sprzed wszystko zostało omówione, prezes zgodził się że pełen reset jest na stole)**.

Strategia mediacyjna gdy potrzebny pivot:
- **„Wave 0" zero-knowledge audit**: zaprezentuj Deliverable 1 (review prototypu). Zapytaj prezesa o reakcję na 20 wymiarów oceny. Zgódź się na priorytety. Jeśli prezes sam dostrzega że P0 nie jest realnie iterowalny w jego prototypie → zaproponuje reset, masz mandat.
- **Hybrid**: iteruj PDP (waves 1–3), z paralelnym from-scratch na 1 ekranie (np. listing) jako proof-of-concept. Porównaj outcome. Decyzja na bazie wyniku, nie zdania.

---

## 3. Plan from-scratch (gdy uruchomiony)

Cel: jeden produkt, wszystkie 6 ekranów (homepage, listing, PDP, checkout, payment, TY), spójny system designu, mobile-first, gotowy do A/B i dalszej iteracji.

### 3.1 Fundamenty (Phase 0, ~8h)

**Krok 0.1 — research & competitive synthesis**

```
GOAL: Skondensuj wszystko co wiemy z prototypu prezesa, live szallas.hu, benchmarków (Booking/Agoda/Trip/Expedia/nocowanie.pl). Zwróć: jeden dokument 5-stronicowy „North Star" z:
- 5 core principles (np. „Trust before nudge", „Price clarity above all", „Mobile-first reads desktop", „Reuse, don't reinvent", „Real data backs every claim")
- 3 user persona (Family-wellness, Couple-romantic, Business-quickstay) z primary needs
- 10 acceptance criteria (np. „Cena z IFA i breakdownem widoczna zanim user wybierze pokój", „Lista hoteli ma inline mapę z hover-cards", „Checkout coupon pre-booking")
- Anti-patterns to avoid (lista 10, w tym: fake urgency, hidden fees, dark patterns)

CONTEXT: docs/ux-overhaul/01-prototype-review.md + screenshoty live + uploads/
```

**Krok 0.2 — design tokens v2 (red brand, decyzja CTA color)**

```
GOAL: Zbuduj tokens.css z czerwonym brand-kolorem (#E30613, jak obecny szallas.hu). Decyzja do podjęcia z prezesem: CTA color = czerwony (jak prototyp) czy pomarańczowy (jak live szallas.hu, np. #E85A00). Zbuduj 2 warianty (`--theme: 'red-cta'` vs `--theme: 'orange-cta'`) gotowe do A/B.

DELIVERY:
- tokens.css z dwoma data-theme variants
- :root[data-theme="red-cta"] { --c-brand: #E30613; --c-cta: var(--c-brand); --c-trust: #1F7F3E; ... }
- :root[data-theme="orange-cta"] { --c-brand: #E30613; --c-cta: #E85A00; --c-trust: #1F7F3E; ... }
- --c-warn-low (delicate orange dla -9% badge)
- --c-info (niebieski dla linków hotel-name)
- Skala spacing (4/8/12/16/24/32/48/64)
- Skala typografii (12/13/14/16/18/22/28/34/48)
- Z-index scale (z-base 0, z-sticky 50, z-modal 90, z-toast 100)
```

**Krok 0.3 — component library MVP (10 komponentów)**

```
GOAL: Zbuduj prototype-fresh/components.html z 10 podstawowymi komponentami React+CSS:
1. <Button variant="primary|secondary|ghost" size="sm|md|lg">
2. <Input type="text|email|tel|number" label="" error="" success="">
3. <Select options={[]} label="" />
4. <Checkbox label="" required>
5. <RadioGroup options={[]}>
6. <Modal title="" onClose>
7. <Tag color="green|red|amber|blue|purple">
8. <Card variant="hotel|room|review|category">
9. <Stepper currentStep={n} steps={[]}>
10. <Pagination total={n} page={n}>
```

### 3.2 Ekrany (Phase 1, ~50h)

```
6 ekranów × ~8h każdy. Sekwencja:
1. Homepage (8h) — bo to entry point i testuje search-bar component
2. PDP (10h) — najbogatszy, zawiera większość ficzerów do reużycia
3. Listing (10h) — wymaga mapy split-view (Leaflet), filtrów, infinite scroll
4. Checkout (8h) — 1 strona z 2-col layoutem + form validation
5. Payment (6h) — 4 metody + 3D Secure mock
6. Thank you (4h) — confirmation hero + cross-sell
7. Cross-screen audit + harmonizacja (4h)
```

### 3.3 Validation (Phase 2, ~10h)

- Heuristic eval per ekran (Deliverable 1 matryca 20 wymiarów × 6 ekranów = 120 ocen)
- 5 unmoderated user tests (UsabilityHub / Maze) — task: znajdź pokój, dodaj do koszyka, zamów, zapłać
- A11y audit (Lighthouse + axe-core)
- Performance audit (Lighthouse) — LCP < 2.5s, CLS < 0.1
- Comparative test: prototype-fresh vs prototype-iterated z Deliverable 2+3 — 5 użytkowników wybiera „która wersja jest lepsza" na 5 kategoriach

### 3.4 Iteracja na bazie validacji (Phase 3, ~12h)

Top 10 findings → 10 fix promptów. Po fix re-test (Phase 2 sub-set).

**Total from-scratch: ~80h** vs ~30h iteracji.

---

## 4. From-scratch — pakiet promptów rdzenia

Jeśli decyzja jest na reset, oto pakiet entry promptów. Każdy do osobnej iteracji w Claude Design.

### Prompt FS.0 — design tokens v2

```
GOAL: Zbuduj prototype-fresh/tokens.css z 2 wariantami CTA-color (red brand-as-CTA, orange separated-CTA). Tokens kompletne, semantyczne, gotowe na produkcję.

DELIVERY:
- Plik prototype-fresh/tokens.css
- :root[data-theme="red-cta"]    { --c-brand: #E30613; --c-cta: var(--c-brand); --c-trust: #1F7F3E; ... }
- :root[data-theme="orange-cta"] { --c-brand: #E30613; --c-cta: #E85A00;        --c-trust: #1F7F3E; ... }
- Skala spacing, typografii, radii, shadows, z-index, transitions

CONTEXT: czerwony brand obecny szallas.hu (logo + header). Live używa pomarańczowy primary CTA (Kiválasztom/Lefoglalom/Foglalás elküldése) — separując brand-red od action-orange. Prototyp prezesa używa czerwony jako CTA. Decyzja wymaga A/B lub designerskiego rozstrzygnięcia.
```

### Prompt FS.1 — homepage from-scratch

```
GOAL: prototype-fresh/01-homepage.html, mobile-first (375 baseline, scale up do 1440).

PRINCIPLES:
- Trust before nudge (3 158 600+ vendégvélemény widoczne nad search bar, NIE social-proof viewers)
- Price clarity (CTA „Keresés", nie „Foglalj most")
- Real data backs every claim (każda liczba ma sourcable origin)

LAYOUT (mobile baseline):
- Hero 100vh-ish z hero-image gradient overlay
- Tabs Szállások | Programkereső | Csomagok (chip-style)
- Headline h1 + sub h2
- SearchBar w trybie stacked vertical (4 pola pod sobą, CTA full-width)
- Trust line poniżej

DESKTOP enhance:
- Hero 540px
- SearchBar horizontal
- Below-fold: kategoria carousel, top ajánlatok 3-col, promo banner, VIP banner, mosaic tips, kiemelt ajánlatok 6-card grid, footer

ACCEPTANCE:
- Mobile 375: hero full readable, search bar dostępny bez scrollu
- Desktop 1440: hero stylowy, search bar nadbiblioteka
- 3 trust signals widoczne above-fold mobile i desktop
- Lighthouse perf > 90, a11y > 95
```

### Prompty FS.2–FS.6 — pozostałe ekrany

Analogicznie do Deliverable 3 Wave 4 (homepage, listing, PDP, checkout, payment, TY) — ale z **mobile-first** baseline i pełną wolnością architektury (NIE bazując na prezesowym PDP).

---

## 5. Decyzja końcowa — flowchart

```
┌────────────────────────────────────────────────────┐
│ Q1: Mobile users to strategiczny priorytet?       │
└─────────┬────────────────────────────────┬─────────┘
          │ NIE                            │ TAK
          ▼                                ▼
┌─────────────────────┐         ┌──────────────────────┐
│ ITERACJA            │         │ Q2: Czy prezes ma    │
│ Wave 1–3            │         │ mandat na reset?     │
│ (Deliverable 2)     │         └───┬──────────────┬───┘
│ + flow              │             │ NIE          │ TAK
│ (Deliverable 3)     │             ▼              ▼
└─────────────────────┘   ┌──────────────────┐  ┌────────────────────┐
                          │ ITERACJA         │  │ FROM-SCRATCH       │
                          │ + paralel POC    │  │ mobile-first       │
                          │ listing from-    │  │ desktop-enhance    │
                          │ scratch          │  └────────────────────┘
                          └──────────────────┘
```

> **Konfiguracja per oferta jako blocker iteracji vs from-scratch:** ten temat (Tweaks = per-property config) jest **ortogonalny** do decyzji iteracja/reset. W obu scenariuszach trzeba zaprojektować `TWEAK_SCHEMA` jako kontrakt z backendem. To NIE jest powód do resetu — to praca, którą trzeba zrobić w każdym przypadku (patrz Prompt W1.3 w Deliverable 2 dla iteracji, lub odpowiednia sekcja w FS.0 dla reset).

---

## 6. Co decyzja oznacza w praktyce

### Jeśli ITERACJA
- Wszystko z Deliverable 2+3 (~30h).
- Budżet ryzyka: 50% buffer (~45h realnie).
- Możesz zacząć dziś. Pierwszy walidowalny progress po 4h (Wave 1.1 daje natychmiastową poprawę hero).

### Jeśli FROM-SCRATCH
- Wszystko z §3 powyżej (~80h).
- Budżet ryzyka: 50% buffer (~120h realnie).
- Wymaga **przed startem**: decyzja o themingu (red vs purple), decyzja o CTA color (red vs orange vs purple), decyzja o desktop-first vs mobile-first.

### Hybrid (rekomendowany jeśli niepewność)
- Iteruj PDP do Wave 1+2 (5–8h).
- W paraleli buduj prototype-fresh/02-listing-balaton.html from-scratch (10h).
- Porównaj wyniki za 1 tydzień.
- Decyduj o reszcie.

---

## 7. Trzy rzeczy do potwierdzenia z prezesem przed startem

1. **Decyzja o CTA color**: red brand to CTA też (jak prototyp), czy odsep (pomarańczowy CTA jak live)? To rozstrzygnięcie wpływa na każdy ekran.
2. **Priorytet platformy**: mobile-first czy desktop-first? Bo answer wpływa na pełną architekturę.
3. **Tweak data-source contract**: czy backend ma realne dane dla każdego tweaka (`rate.realStockLeft`, `hotel.viewers24h`, `rate.originalPrice`, `hotel.eligibleForVip`)? Jeśli niektórych nie ma — wycinamy tweak ze schema do czasu launchu źródła.

Bez tych odpowiedzi każdy plan będzie miał szum. Z nimi — sprawnie ruszamy.
