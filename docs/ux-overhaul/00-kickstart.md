# 00 — Kickstart dla claude.ai/design

> **Najpierw przeczytaj [plan.md](plan.md)** — to source of truth po ludzku z 21 krokami w aktualnej kolejności wykonania. Ten dokument (`00-kickstart.md`) zawiera techniczny workflow „jak ruszyć Claude.ai/design po ten plan".

**4 fale, 21 kroków:**
```
FALA 1 (kroki 1-4)   — wizualne na PDP
FALA 2 (kroki 5-11)  — dopieszczenie + parytet mobile
FALA 3 (kroki 12-14) — strukturalne, mapa na końcu
FALA 4 (kroki 15-21) — pozostałe 5 ekranów, listing pierwszy
```

**Pliki techniczne (prompty dla Claude'a):**
- [02-prototype-update-plan.md](02-prototype-update-plan.md) — prompty PDP (Fala 1, 3, 2)
- [03-remaining-flow-plan.md](03-remaining-flow-plan.md) — prompty pozostałych ekranów (Fala 4)

---

Ten dokument służy do **uruchomienia całej iteracji prototypu w claude.ai/design** — tym samym narzędziu, w którym prezes go zbudował (w kodzie prototypu są handshake'i `__edit_mode_set_keys` i `__edit_mode_available` z parent window — to claude.ai/design).

**Workflow w skrócie:** otwierasz istniejący prototyp w claude.ai/design → dodajesz do konwersacji 4 dokumenty `.md` jako attachments → wklejasz kickstart prompt → claude.ai/design iteruje artifact po każdym promptcie, widzisz live-preview w prawym panelu.

---

## Co dodać do projektu w claude.ai/design

1. **Otwórz istniejący prototyp** Hotel Aurora Balaton w claude.ai/design (powinien być w Twojej historii projektów — prezes go tam zbudował). NIE zaczynaj nowego, kontynuuj istniejący — wtedy preview pracuje na tym samym artifactcie.
2. **Drag-and-drop / attach** do pierwszej wiadomości w tym projekcie 4 pliki `.md`:
   - `docs/ux-overhaul/01-prototype-review.md` — kontekst i diagnoza
   - `docs/ux-overhaul/02-prototype-update-plan.md` — 21 promptów Wave 1–3 (PDP)
   - `docs/ux-overhaul/03-remaining-flow-plan.md` — 14 promptów Wave 4 (pozostałe ekrany)
   - `docs/ux-overhaul/04-from-scratch-alternative.md` — backup plan (uruchamiany tylko przy gate'cie)
3. Pierwsza wiadomość = **kickstart prompt** (poniżej).

> **Uwaga o Wave 4 (nowe ekrany):** claude.ai/design pracuje na jednym artifactcie naraz. PDP iterujemy w istniejącym projekcie (Wave 1–3). Dla 5 nowych ekranów (homepage / listing / checkout / payment / TY) tworzymy **5 nowych projektów claude.ai/design**, każdy z `ds.html` (po S.1) i odpowiednim promptem z Deliverable 3. Patrz sekcja „Co po Wave 1–3 (Faza 5+6)" na końcu tego pliku.

---

## Kickstart prompt (kopiuj-wklej jako pierwsza wiadomość w claude.ai/design)

```
Jesteś asystentem implementującym UX overhaul prototypu OTA Szallas.hu (PDP Hotel Aurora Balaton) w claude.ai/design.

KRYTYCZNE: ja (user) patrzę na PREVIEW po prawej, NIE czytam kodu. Każda Twoja odpowiedź ma być w języku WIZUALNYM ("po prawej stronie nazwy hotelu pojawiło się zielone kółko"), NIE technicznym ("HotelHeader grid 1fr|auto"). Zakazane słowa: grid, flex, position:absolute, marginTop, nazwy klas CSS, nazwy komponentów React, useState, props, nazwy pól JSON.

Artifact: jest już otwarty w tej konwersacji (Hotel Aurora Balaton — kontynuujesz, nie zaczynasz od zera).

Załączone dokumenty:
1. 01-prototype-review.md — kontekst i diagnoza (czytaj jeśli potrzebujesz głębszego kontekstu)
2. 02-prototype-update-plan.md — 21 atomicznych promptów Wave 1–3 do wykonania PO KOLEI
3. 03-remaining-flow-plan.md — 14 promptów Wave 4 (po Wave 1–3, w osobnych projektach)
4. 04-from-scratch-alternative.md — backup plan (uruchamiamy tylko jeśli gate decyduje)

## Tryb pracy

Pracujesz w trybie ITERACYJNYM:
- Wykonujesz JEDEN prompt na raz, w kolejności określonej poniżej
- Modyfikujesz artifact bezpośrednio (claude.ai/design re-renderuje preview po każdej zmianie)
- W odpowiedzi tekstowej zwracasz: (a) krótkie streszczenie zmian (1-3 zdania), (b) odptaszkowany checklist ACCEPTANCE z prompt'a, (c) krótką notę "co dalej"
- Czekasz na moje "next" zanim ruszysz kolejny prompt — CHYBA że jestem w trybie auto-pilot (patrz niżej)

## Tryb auto-pilot (opt-in)

Mogę powiedzieć "auto-pilot do końca Wave 1" (lub "do W1.6", "do gate", "do końca"). Wtedy:
- Wykonujesz promptów sekwencyjnie bez czekania na "next"
- Po każdym dalej zwracasz update + acceptance check
- ZATRZYMUJESZ SIĘ przy gate'ach (Gate 1 po Wave 1, Gate 2 po Wave 2, Gate 3 przed Wave 4) i pytasz o go/no-go
- ZATRZYMUJESZ SIĘ jeśli któraś ACCEPTANCE się nie spina — pytasz mnie czy zaakceptować z odchyleniem czy iterować

## Pre-flight: 3 decyzje, które muszę dostać od Ciebie zanim zaczniesz

Zanim wykonasz W1.1, zapytaj mnie o 3 decyzje (jeśli ich nie podałem w pierwszym message'u):

A. **CTA color**: red brand-as-CTA (jak prototyp) vs orange separated-CTA (jak live szallas.hu)?
   - Jeśli red: zostaw `--c-primary` jako CTA w tokens.
   - Jeśli orange: dodaj `--c-cta: #E85A00` i przepnij wszystkie buttony primary na to.

B. **Mobile-first priorytet?**
   - Jeśli TAK: w Wave 3 wykonaj W3.7–W3.10 (mobile) PRZED W3.1–W3.6 (desktop polishing).
   - Jeśli NIE: kolejność z Deliverable 2 (W3.1 → W3.10).

C. **Tweak data-source contract**:
   - Czy `rate.realStockLeft`, `hotel.viewers24h`, `rate.originalPrice`, `hotel.eligibleForVip` są w backendzie?
   - Te bez realnych źródeł → wytnij z `TWEAK_SCHEMA` w W1.3 (zostaw komentarz "// PARKING: aktywujemy gdy backend doda <field>").
   - Także: VIP discount %% — czy 10–20% jako 3 tier'y (VIP1=10, VIP2=15, VIP3=20), czy jeden flat? Default w W1.3: VIP1=10, VIP2=15, VIP3=20.

Jeśli odpowiedziałem na te 3 w pierwszym message'u — przejdź od razu do W1.1.

## Kolejność wykonania (kanoniczna)

### Faza 2: Wave 1 — PDP core fixes (8 promptów, ~6–8h)
Plik: 02-prototype-update-plan.md, sekcja "Wave 1 — Hero / Sidebar / IA fixes"
Kolejność: W1.1 → W1.2 → W1.3 → W1.4 → W1.5 → W1.6 → W1.7 → W1.8

**GATE 1**: po W1.8 przedstaw zwięzłe (pod 200 słów) podsumowanie: co zmieniło się wizualnie, jakie potencjalne regresje wykryłeś, czy któryś ACCEPTANCE nie spiął się w 100%. Pytasz: "Go na Wave 2?".

### Faza 3: Wave 2 — Map + edge + tokens (3 prompty, ~3–4h)
Plik: 02-prototype-update-plan.md, sekcja "Wave 2 — Map / edge states / performance"
Kolejność: W2.1 → W2.2 → W2.3

**GATE 2**: po W2.3, oszacuj średnią ocenę prototypu po 20 wymiarach z 01-prototype-review.md §1. Jeśli <3.5/5 — proponuj uruchomić 04-from-scratch-alternative.md. Jeśli ≥3.5/5 — pytasz "Go na Wave 3?".

### Faza 4: Wave 3 — Polishing desktop + mobile parity (10 promptów, ~6–8h)
Plik: 02-prototype-update-plan.md, sekcja "Wave 3 — Polishing"
Kolejność (default): W3.1 → W3.2 → W3.3 → W3.4 → W3.5 → W3.6 → W3.7 → W3.8 → W3.9 → W3.10
Kolejność (jeśli mobile-first z decyzji B): W3.4 → W3.7 → W3.8 → W3.9 → W3.10 → W3.1 → W3.2 → W3.3 → W3.5 → W3.6

**GATE 3**: po W3.10, daj mi snapshot — gotowy do Wave 4? Średnia ≥4.0/5?

### Faza 5: Setup ds.html (1 prompt, ~1h)
Plik: 03-remaining-flow-plan.md, sekcja "Setup"
Prompt: S.1

### Faza 6: Wave 4 — 5 nowych ekranów (13 promptów, ~10–13h)
Plik: 03-remaining-flow-plan.md
Kolejność: H.1 → H.2 → H.3 → L.1 → L.2 → L.3 → C.1 → C.2 → P.1 → P.2 → T.1 → T.2 → X.1

Po X.1: final report — co zostało zbudowane, lista 12 screenshotów (6 ekranów × 2 viewporty) jeśli możesz wygenerować, propozycje 5 dalszych iteracji.

## Reguły jakości

1. **Atomowość**: każdy prompt = jedna logiczna zmiana. Nie łącz dwóch promptów.
2. **Acceptance honesty**: jeśli kryterium A. nie spina się ale B. tak — powiedz wprost, nie udawaj że wszystko OK.
3. **Smoke test mental**: po każdym prompt'cie zastanów się, czy zmiana nie zepsuła czegoś co działało (np. mobile view po zmianie desktop layout).
4. **Komentarze w kodzie tylko gdzie ich prompt wymaga** — nie dodawaj „helpful" komentarzy poza zakresem.
5. **Bez wymyślania danych** — mock-data zostaje z `HOTEL` constant. Jeśli prompt każe rozszerzyć HOTEL — rozszerz minimalnie.
6. **No scope creep**: jeśli widzisz coś co warto poprawić ale nie jest w prompt'cie — zostaw `// TODO: <opis>` i powiedz mi w nocie "co dalej".

## Format każdej odpowiedzi (per prompt) — DLA UŻYTKOWNIKA, NIE DLA DEVA

**Zasada nadrzędna:** ja, czytający Twoją odpowiedź, NIE widzę kodu. Patrzę na preview po prawej stronie. Twój opis ma odnosić się do tego, co widzę wzrokiem, nie do kodu.

**Zakazane słowa w odpowiedzi:** `grid`, `flex`, `position:absolute`, `marginTop`, `<HotelHeader>`, `SidebarCard`, `rate-row`, `useState`, `props`, nazwy klas CSS, nazwy komponentów React, nazwy pól JSON. Jeśli musisz odnieść się do struktury — opisuj wizualnie ("górny pasek z nazwą hotelu", "prawa kolumna z ceną", "kafelek pokoju trzeci od góry").

```
## [W1.1] Hero — pusta przestrzeń + ocena obok nazwy hotelu

### Co się zmieniło (2-3 zdania, zwykły język)
Po prawej stronie nazwy hotelu (na samej górze strony) pojawiła się zielona okrągła
ocena "9.1" z napisem "Kiváló" obok. Wcześniej w tym miejscu była pustka — ocena była
schowana pod galerią. Galeria i prawa kolumna (z ceną) zaczynają się teraz od tej samej
wysokości — strona wygląda na lepiej zorganizowaną.

### Gdzie to zobaczyć w preview
Spójrz na samą górę strony, gdzie jest napisane "Hotel Aurora Balaton". Po prawej
stronie tej nazwy (w tej samej linii poziomej) powinno być zielone kółko z liczbą "9.1"
i obok napis "Kiváló · 1247 vélemény".

### Pytanie do Ciebie
Widzisz zielone kółko z oceną po prawej stronie nazwy "Hotel Aurora Balaton"? (tak/nie)
Jeśli nie — daj znać, zrobię screenshot z preview i zaznaczę gdzie ma być.

### Co dalej
Po Twoim "tak" / "OK widzę" → przechodzę do W1.2 (sidebar po prawej, dodanie info o 
najlepszej cenie z 90 dni i o lokalnym podatku IFA płatnym w hotelu).
```

> Preview w claude.ai/design re-renderuje się automatycznie po każdej zmianie artifactu — możesz przełączać Desktop/Mobile w toggle dolnym, otwierać Tweaks panel, klikać przez prototype na żywo. **Jeśli nie widzisz zmiany — daj znać, Claude zrobi screenshot z preview i zaznaczy gdzie patrzeć.**

## Reguły komunikacji (krytyczne)

1. **Każdy prompt = JEDNA zmiana = JEDNA odpowiedź = JEDNO pytanie "widzisz tak/nie"**. Czekasz na "tak" / "OK widzę" zanim ruszysz dalej. Auto-pilot zostaje TYLKO po explicitnym "auto-pilot ON".
2. **Jeśli zmiana jest w stanie warunkowym** (np. sidebar w stanie pre-selection vs post-selection po wyborze pokoju): explicit napisz jak zobaczyć każdy stan ("kliknij 'Szobát választok' w prawej kolumnie żeby zobaczyć stan po wyborze").
3. **Jeśli user mówi "nie widzę"** → zrób screenshot z preview, narysuj kółko/strzałkę gdzie ma patrzeć, dołącz do odpowiedzi. Nie tłumacz słowami drugi raz.
4. **Bez technicznych "what under the hood"** — opis ma być **wizualny**, nie strukturalny.

## Ostatnia uwaga

Jeśli któryś prompt z 02/03 pliku jest niejasny lub sprzeczny z innym — **zatrzymaj się i zapytaj**. Lepsze pytanie niż założenie.

Zaczynamy. Czekam albo na (a) 3 decyzje preflight + start, albo (b) "use defaults" → ruszasz z W1.1.
```

---

## Co Ty musisz zrobić w claude.ai/design (3 minuty)

1. **Wejdź na https://claude.ai/design** i otwórz istniejący projekt **„Hotel Aurora Balaton"** (lub jakkolwiek prezes go nazwał — z prawej strony powinieneś mieć listę swoich projektów). Jeśli prezes nie udostępnił Ci tego projektu — poproś go o **Share** lub o eksport HTML do nowego projektu (claude.ai/design ma „New project from file").

2. **W otwartym projekcie** przewiń konwersację na sam dół (claude.ai/design pamięta historię iteracji). W polu nowej wiadomości:
   - **Drag-and-drop** lub kliknij paperclip → załącz 4 pliki:
     - `01-prototype-review.md`
     - `02-prototype-update-plan.md`
     - `03-remaining-flow-plan.md`
     - `04-from-scratch-alternative.md`
   - **Wklej kickstart prompt** (cały blok ` ``` ` powyżej)
   - **Dopisz na końcu**:
     ```
     Decyzje preflight: CTA=<red lub orange>, mobile-first=<yes lub no>, tweaks=<defaults lub lista>.
     Tryb: auto-pilot do gate 1.
     ```
   - Send.

3. Claude.ai/design przeczyta wszystkie 4 dokumenty, zacznie od **W1.1**, zmodyfikuje artifact (zobaczysz live-preview po prawej), odptaszkuje acceptance, przejdzie do **W1.2**, i tak dalej aż do **W1.8** (koniec Wave 1) — wtedy zatrzyma się przy Gate 1 i zapyta o go/no-go na Wave 2.

---

## Co dostaniesz w odpowiedzi

Pierwsza odpowiedź Claude'a będzie albo:
- Pytanie o 3 decyzje preflight (jeśli ich nie podałeś)
- Albo start z W1.1 + zwrócony zaktualizowany kod + acceptance check

Po każdym prompt'cie masz wybór:
- `next` → kolejny prompt
- `auto-pilot do gate 1` → leci sam do końca Wave 1, zatrzymuje się na Gate 1
- `auto-pilot do końca` → leci aż do końca Wave 4, zatrzymuje się tylko na gate'ach lub gdy ACCEPTANCE nie spina się
- `<komentarz/poprawka>` → np. „W1.1 nie zmień skali ★, zostaw 14px" → poprawi i przejdzie dalej

---

## Co zrobić, jak coś idzie nie tak

- **Claude rozumie prompt inaczej**: powiedz w nowej wiadomości konkretnie co się rozjechało („W1.3 nie usunął fabrycznego strike, dalej widzę 19 300 Ft → 38 600 Ft w sidebarze. Popraw."). Claude.ai/design ma historię iteracji — możesz wrócić do wcześniejszej wersji przez **History** w UI projektu (zazwyczaj po lewej lub w menu artifactu).
- **Plik się rozjechał (36k linii to dużo nawet dla claude.ai/design)**: jeśli Claude zaczyna gubić spójność (np. duplikuje sekcje, traci styling), wymuś tryb diff przez follow-up: „Pracuj per-section: pokazuj mi tylko zmieniany blok kodu w odpowiedzi, ale artifact aktualizuj w całości." Albo zrób eksport HTML i otwórz lokalnie w Claude Code — większy kontrol.
- **Gate decyzja**: jeśli średnia <3.5 po Wave 2, NIE forsuj Wave 3 — przeczytaj `04-from-scratch-alternative.md` i decyduj zgodnie z flowchartem §5.
- **Tweaks panel postMessage**: prototyp komunikuje się z claude.ai/design parent window. Jeśli Claude przy edycji uszkodzi handshake (`__edit_mode_set_keys` / `__edit_mode_available`), Tweaks przestaną działać i nie zobaczysz A/B podglądów. W takim wypadku follow-up: „Przywróć handshake z parent window w app.jsx — wzorzec: window.parent.postMessage({type:'__edit_mode_set_keys', edits: t}, '*')". 

---

## Co po Wave 1–3 (Faza 5 + 6): dopisanie reszty flow

Po Gate 3 (sukces Wave 1–3 na PDP), masz 1 projekt claude.ai/design z dopieszczonym PDP. Teraz **6 nowych projektów** w claude.ai/design (po 1 dla każdego nowego ekranu + 1 dla ds.html):

### Krok 5a: Wyeksportuj design system (ds.html)

W aktualnym projekcie claude.ai/design (z dopieszczonym PDP) **dodaj nowe wiadomość**:
```
Wykonaj prompt S.1 z 03-remaining-flow-plan.md: wydziel design tokens + komponenty reużywalne (BrandBar, SearchBar, Footer, Photo, Stepper, Switch, Seg, Tag, Icons, fmt) do osobnego eksportu jako ds.html. Zwróć ds.html jako osobny code-block (mogę go skopiować do nowego projektu claude.ai/design).
```

Skopiuj zwrócony ds.html do clipboard / pliku lokalnego.

### Krok 5b: 5 nowych projektów claude.ai/design (homepage, listing, checkout, payment, TY)

Dla **każdego** z 5 ekranów (homepage / listing / checkout / payment / TY):

1. Wejdź na **claude.ai/design** → **New project** (zazwyczaj „+" lub „Create new").
2. W pierwszej wiadomości:
   - **Załącz** `ds.html` (z kroku 5a) jako attachment albo wklej w code-block z preambułą „This is the shared design system. Use it as base."
   - **Załącz** `03-remaining-flow-plan.md` jako attachment.
   - **Wklej** zwięzły kickstart per ekran:
     ```
     Zbuduj nowy artifact na bazie załączonego ds.html (tokens + komponenty wspólne).
     Wykonaj prompty <H.1, H.2, H.3 dla homepage / L.1, L.2, L.3 dla listing / C.1, C.2 dla checkout / P.1, P.2 dla payment / T.1, T.2 dla TY> z załączonego 03-remaining-flow-plan.md.
     Tryb auto-pilot — wykonaj wszystkie prompty tej sekcji sekwencyjnie, na końcu zwróć podsumowanie zmian + acceptance check per prompt.
     ```
3. Claude.ai/design zrobi cały ekran w jednej sesji.

> Możesz zlecić **wszystkie 5 ekranów równolegle** — odpal 5 sesji claude.ai/design w 5 zakładkach (homepage, listing, checkout, payment, TY) i każda jedzie niezależnie. Total wall-time: ~3h zamiast ~10h sekwencyjnie.

### Krok 6: Cross-screen harmonizacja (X.1)

W osobnej, **6-tej zakładce claude.ai/design**:
- Załącz screenshoty z 5 projektów (claude.ai/design ma „Export PNG" w każdym artifactcie — zrób Desktop + Mobile = 12 zrzutów).
- Wklej prompt:
  ```
  Te 12 zrzutów to 6 ekranów × 2 viewporty. Wskaż 10 inconsistencies (style, copy, CTA color, font-weight, spacing). Dla każdej zaproponuj fix-prompt do odpalenia w odpowiednim projekcie.
  ```
- Wykonaj sugerowane fix'y w odpowiednich projektach.

### Końcowy stan

- 6 projektów w claude.ai/design (1 PDP + 5 nowych ekranów + ds.html jako export)
- Każdy projekt ma swój share-link (URL z prawego górnego rogu w claude.ai/design)
- Prezentacja prezesowi = wysłanie 6 share-linków + screenshotów

Następna iteracja po review prezesa: kolejny pakiet promptów typu „W5.*" do odpalenia w istniejących projektach claude.ai/design (kontynuujesz, nie tworzysz nowych).
