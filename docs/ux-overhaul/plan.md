# Plan UX overhaul Szallas.hu — po ludzku

> **To jest source of truth dla biznesu.** Pliki `02-prototype-update-plan.md` i `03-remaining-flow-plan.md` zawierają techniczne szczegóły (prompty dla Claude'a), ten dokument zawiera plain-language opis 21 kroków w aktualnej kolejności wykonania.

---

## Co w ogóle robimy

Mamy prototyp **strony hotelu** (PDP — Hotel Aurora Balaton). Chcemy go ulepszyć, a potem dorobić jeszcze **5 stron** żeby user mógł przejść całą drogę zakupu:

```
strona główna → lista hoteli → strona hotelu (PDP) → koszyk → płatność → potwierdzenie
```

Robimy to w **4 falach**:
1. **Fala 1** — wizualne poprawki na stronie hotelu (kroki 1-4)
2. **Fala 2** — dopieszczenie + parytet mobile (kroki 5-11)
3. **Fala 3** — strukturalne, mapa na finisha (kroki 12-14)
4. **Fala 4** — dorabianie 5 pozostałych ekranów (kroki 15-21)

---

## FALA 1 — Strona hotelu, wizualne zmiany

### 1. Ocena obok nazwy hotelu ✅ ZROBIONE
**Co:** zielone kółko z liczbą (9.1) + „Kiváló · 1247 opinii" obok nazwy hotelu na samej górze strony.
**Po co:** prezes sam zaznaczył kółkiem pustkę w tym miejscu; ocena była schowana.

### 2. Prawa kolumna z ceną — naprawa layoutu + IFA + „90 dni" tylko bez dat
**Co (3 poprawki):**
- **Układ 2-kolumnowy** sekcji „Mikor fizetek?" — label po lewej, kwota po prawej (jak na live szallas.hu). Dziś jest wszystko jedno pod drugim i się rozjeżdża.
- **„Najlepsza cena z najbliższych 90 dni"** pokazuje się TYLKO gdy user jeszcze nie wybrał dat. Po wybraniu dat znika i jest realna cena na te daty.
- **„Bezpłatne anulowanie do…"** — dynamicznie z wariantu pokoju, nie hardkodowane „ápr. 16-ig" (dziś jest hardcode niezależnie od wariantu).

**Po co:** szallas.hu live to wszystko ma, prototyp nie. IFA jako osobna pozycja = mniej zaskoczenia w hotelu. Dynamiczna polityka anulowania = uczciwie.

### 3. Filtry recenzji i galerii — jeden zestaw 7 chipów + ikony typu podróży
**Co:** Nad listą opinii **i** nad galerią zdjęć ten sam zestaw chipów filtrujących:

**Rodzina · Służbowo · Wyżywienie · Pokoje · Lokalizacja · Udogodnienia · Czystość**

Klikasz „Wyżywienie" w opiniach → tylko opinie o jedzeniu. To samo w galerii → tylko zdjęcia jedzenia.

Plus każda opinia dostaje **ikonę typu podróży** (rodzina / para / służbowa / sama) zamiast szarych inicjałów.

**Po co:** Booking podobne ma, działa. User szuka „jakie jest tu śniadanie" → filtruje → znajduje. Ikony typu podróży to konwencja live szallas.hu (lepsza informacja niż „EK", „BT").

### 4. Warianty cenowe pokoju — chip wyżywienia (2 kolory) + edge-case wielu wariantów
**Co:**
- Każdy wariant cenowy dostaje **chip wyżywienia z ikoną**:
  - 🍳 śniadanie / 🍽️ półpensja / 🥂 all inclusive → **zielony chip** (wszystkie 3 ten sam zielony)
  - 🛏️ tylko nocleg → **szary chip**
- 2 kolory tła (zielony = masz wyżywienie, szary = nie masz), 4 różne ikony (uściśla jakie wyżywienie).
- Dodaję mock-pokój z **5 wariantami**. Gdy wariantów >3: pokazują się 3, gradient zanikający, przycisk „+N kolejnych wariantów" → klik rozwija resztę.

**Po co:** Wyżywienie to często najważniejsza decyzja przy wyborze wariantu pokoju. Dziś jest pokazane nudną szarą kolumną tekstową — gubi się. 2 kolory zamiast 4 → spójne z konwencją live szallas.hu, mniej wizualnego szumu.

---

## FALA 2 — Dopieszczenie + parytet mobile

### 5. Scroll-driven cała strona + sticky pasek dolny z ceną (DESKTOP + MOBILE)
**To jest kluczowa zmiana modelu nawigacji**, dotyczy obu wersji.

**Co:**
- **Mobile traci zakładki** (Info/Pokoje/Opinie/Usługi/Mapa) — staje się jednym ciągłym przewijaniem jak desktop. Górny pasek zakładek zostaje, ale teraz jest „lepki" (sticky) i podświetla się w której sekcji jesteś (scroll-spy).
- **Desktop + mobile dostają sticky dolny pasek z ceną** (zawsze widoczny przy scrollu), z 3 stanami:
  - **Bez dat / bez pokoju:** „Od XX XXX Ft / noc (najtańsza z 90 dni)" + przycisk **„Wybierz datę"**
  - **Z datami / bez pokoju:** „Od XX XXX Ft (na te daty)" + przycisk **„Wybierz pokój"**
  - **Z wybranym pokojem:** „Razem XX XXX Ft" + przycisk **„Rezerwuję"**
- Pasek chowa się przy scrollu w dół, wraca przy scrollu w górę (jak Booking app).
- Naprawia przy okazji niedziałający dziś przycisk „Rezerwuję" na mobile.

**Po co:** Scroll-driven UX = standard 2024+ na mobile. Tabbing był antywzorcem (user musiał klikać żeby zobaczyć każdą sekcję). Sticky pasek dolny z 3 stanami = zawsze widoczna podpowiedź „co robić dalej" niezależnie od tego gdzie jesteś na stronie.

### 6. Wyświetlanie ceny — 3 tryby (przełącznik w Tweaks)
**Co:** Cena może być wyświetlana na 3 sposoby:
- **Total za pobyt** (domyślnie) — np. „38 600 Ft za 2 noce, 2 osoby"
- **Za noc** — np. „19 300 Ft / noc"
- **Za osobę za noc** — np. „9 650 Ft / osoba / noc"

**Po co:** szallas.hu live miksuje konwencje (na liście „/fő/éj", na PDP total). Daje 3 tryby do A/B przed decyzją domyślnej.

### 7. Prawa kolumna na dole — „Najlepsze tego obiektu" + zwija się gdy sidebar pełny
**Co:** Pod prawą kolumną z ceną pojawia się mini-kafelek **„Najlepsze tego obiektu"** z 4 najważniejszymi cechami wyciągniętymi z danych:
- np. **⭐ Wysoka ocena 9.1 — Kiváló**
- **🍳 Doskonałe śniadanie (9.3)**
- **🏖️ 120 m od plaży**
- **↩️ Bezpłatne anulowanie do 16 kwietnia**

Skład 4 punktów jest **dynamiczny per obiekt**:
- Wysoka ocena całościowa (jeśli ≥ 9.0)
- Najwyżej oceniana cecha z 6 wymiarów (czystość/personel/komfort/ar-érték/lokalizacja/wellness — bierze top dimension)
- Najmocniejszy fakt USP (plaża / wellness / SZÉP-kártya / pet-friendly / family)
- Polityka anulowania jeśli korzystna

Plus drugi mini-kafelek: **„Potrzebujesz pomocy?"** z telefonem, godzinami, linkiem do czatu.

**Zwijanie:** Gdy sidebar pre-selection jest pełny (włączone VIP-banner + urgency + social-proof), te bonus-kafelki chowają się, żeby nie zalewać prawej kolumny.

**Po co:** Ty zauważyłeś że nawet z włączonymi tweakami prawa strona jest dziurawa. Plus daje user-owi „dlaczego ten hotel" w czytelnej formie, niezależnej dla każdego obiektu (beach hotel pokaże co innego niż city hotel).

### 8. Pozycja oceny przy nazwie — A/B 3 warianty
**Co:** Przełącznik w Tweaks między 3 pozycjami oceny:
- **A: Inline obok nazwy hotelu** (current po kroku 1)
- **B: Na zdjęciu hero** — w stylu Booking, ocena pływa nad fotem
- **C: Na górze prawej kolumny z ceną** — najbliżej przycisku rezerwacji

**Po co:** Ty zapytałeś czy obecne miejsce jest optymalne. Odpowiedź: nie wiem, testuj empirycznie. 3 warianty pozwalają porównać.

### 9. Mobile — zielone kółko oceny + Quick-Extract (te same 4 cechy co krok 7)
**Co na widoku mobilnym (375px):**
- Chip oceny na samej górze zmienia kolor z bladoszarego na **zielone kółko pełnej szerokości** (jak desktop), bez pustki po prawej.
- **Pod nim 4 najważniejsze fakty obiektu w siatce 2×2** — **TE SAME 4 punkty co w kroku 7** (jeden mechanizm „najlepsze tego obiektu", używany w 2 miejscach). Każdy klikalny → przewija do sekcji.
- Opis hotelu ląduje pod nimi, skrócony do 2-3 zdań, z linkiem „czytaj więcej" → modal.

**Po co:** Ty zauważyłeś że nikt nie czyta opisu na mobile. 4 najlepsze cechy widoczne od razu. Wspólny mechanizm z desktop right-rail (1 funkcja generująca top-4, używana w 2 miejscach) = spójność i wartość per obiekt.

### 10. Mobile — pełnoekranowy widok opinii z filtrami
**Co:** Sekcja opinii na mobile pokazuje pełną listę z **tymi samymi 7 chipami filtrującymi co krok 3** (rodzina/służbowo/wyżywienie/pokoje/lokalizacja/udogodnienia/czystość), sortowaniem (najnowsze / najwyższa ocena), „Pokaż kolejnych 20".

**Po co:** Dziś mobile pokazuje tylko 2 opinie i nie ma filtrowania. Parytet z desktop.

### 11. Mobile — warianty pokojów w dolnym slajd-panelu
**Co:** Każdy pokój pokazuje **2 warianty** z chipami wyżywienia (z kroku 4). Jeśli wariantów więcej → przycisk **„+N kolejnych wariantów"** otwiera **panel wyjeżdżający od dołu** z pełną listą + sticky przyciskiem rezerwacji na samym dole panelu.

**Po co:** Dziś mobile pokazuje TYLKO jeden wariant. Bottom-sheet zamiast rozwijania inline = nie psuje scroll pozostałych pokojów.

---

## FALA 3 — Strukturalne, mapa na końcu

### 12. Stany skrajne — przełączniki w Tweaks
**Co:** Dodaję do panelu Tweaks zestaw przełączników z różnymi scenariuszami:
- **Bez dat / z datami** (jak wygląda strona przed i po wpisaniu terminu)
- **Wyprzedane** (komunikat „wybierz inne daty" zamiast cen + wyszarzone pokoje)
- **Część wariantów niedostępna** (jeden wariant cenowy wyszarzony)
- **Brak opinii** (nowy hotel — friendly komunikat zamiast pustej sekcji)
- **Brak zdjęć w kategorii** (placeholder w galerii)

**Po co:** W produkcji każdy stan się zdarza. Bez tego prototyp nie pokazuje pełnego obrazu możliwych scenariuszy.

### 13. Tokens + szkielety ładowania
**Co:**
- Wspólne style (kolory/fonty/zaokrąglenia) wyciągnięte do osobnego pliku — żeby kolejne 5 stron z nich korzystało (potrzebne pod Falę 4).
- Migoczące szare prostokąty pokazywane gdy obrazy się ładują (Booking-style).

**Po co:** Bez tokens jako osobnego pliku, pozostałe ekrany trzeba by stylować od zera — robota wielokrotna. Szkielety = user nie patrzy na puste białe pole.

### 14. Mapa — działający interaktywny prototyp jak nocowanie.pl ⭐ FINISHER FALI 3
**Co:** Sekcja „Lokalizacja" zamiast SVG-rysunku dostaje **realną interaktywną mapę** w stylu nocowanie.pl:
- Markery POI z różnymi ikonami per kategoria (atrakcje / restauracje / transport)
- Hover na atrakcji w liście obok mapy → mapa zooma + podświetla marker
- Klik markera → popup z nazwą i odległością
- Klastrowanie przy oddaleniu (jak Booking)

**Po co:** Mapa to ważny element decyzji „czy ten hotel jest blisko czego mi zależy". Fake-rysunek = zero wartości. Robimy ją na końcu Fali 2, gdy strona jest już dojrzała wizualnie i mobile-ready.

---

## FALA 4 — Pozostałe 5 ekranów *(listing pierwszy)*

> Kolejność celowo z zapasem na koniec tokenów / czasu — listing najważniejszy bo to brama do PDP, najmniej wartość → cross-screen audit.

### 15. Wyciągnięcie wspólnego stylu (ds.html)
**Co:** Style z dopieszczonej strony hotelu wyciąga się do osobnego pliku, który każdy z 5 kolejnych ekranów importuje na starcie.
**Po co:** Spójność wizualna 5 ekranów. Bez tego każdy ekran wyglądałby z innego serwisu.

### 16. **Listing hoteli** (np. Balaton) — robimy pierwszy
**Co:**
- **3 kolumny:** lewa filtry / środek lista / prawa **interaktywna mapa split-view** (z kroku 14)
- Mapa pokazuje markery z ceną. Hover na karcie hotelu → mapa przybliża + podświetla marker. Klik markera → popup z mini-kartą hotelu.
- Filtry bogate: wellness, śniadanie, SZÉP-kártya, gwiazdki, odległość od plaży, ocena 9.0+
- **Disclosure prowizji** „Prowizja od hoteli wpływa na kolejność wyświetlania" — **tylko tutaj** (zgodnie z EU DSA, nie na PDP)
- Przewaga nad live: szallas.hu **nie ma mapy inline** na listingu, tylko link „térkép nézet". My mamy split-view jak Booking/Agoda.

**Po co:** Listing to brama do PDP — bez dobrego listingu user nie trafi na PDP w ogóle. Priorytet #1 w Fali 4.

### 17. Strona główna
**Co:**
- Hero ze zdjęciem sezonowym + wyszukiwarka (gdzie / kiedy / ile osób / SZUKAJ)
- Karuzela kategorii (Wellness, Balaton, Chorwacja, Romantyczne…)
- Top oferty 3-kolumnowy grid 6 hoteli
- Baner VIP (10-20%), baner mobile discount (10% taniej na mobilu)
- 4 kafelki inspiracji
- 6 wyróżnionych hoteli z heart-save
- **Naprawa antywzorca live:** typeahead z thumbnailami destynacji w wyszukiwarce (live dziś wysyła użytkownika do disambig „Balaton region / Balaton miasto?" — wycinamy ten krok)

### 18. Koszyk (dane gościa)
**Co:**
- **Stepper 4-etapowy:** ✅ Wybór noclegu · Twoje dane · Podsumowanie · Płatność
- Formularz: imię/nazwisko/email/telefon (z dropdown krajów)/adres
- **Pole na kupon PRZED rezerwacją** — naprawa antywzorca live (tam kupon dopiero PO foglalás)
- Walidacja inline (czerwony znak pod polem gdy źle)
- Sticky podsumowanie po prawej: zdjęcie hotelu, daty, gości, pokój, podział „płacisz online" / „płacisz w hotelu (IFA)"
- Checkboxy: newsletter (opt-in nie pre-checked), regulamin, RODO

### 19. Płatność
**Co:**
- 4 metody: **Karta / SZÉP-kártya / Apple-Google Pay / Przelew bankowy**
- Karta: pola Stripe-style (numer, MM/YY, CVC, nazwisko)
- SZÉP-kártya: wybór wystawcy (OTP / MKB / K&H)
- Symulacja 3D Secure (czarny ekran z fake OTP)
- Stan błędu „karta odrzucona"

### 20. Thank you (Sikeres foglalás)
**Co:**
- **Wielki zielony checkmark** + „Köszönjük! A foglalásod sikeres."
- Numer rezerwacji do skopiowania (np. SZALLAS-2026-A4F7K2)
- Podsumowanie rezerwacji
- Przyciski: **Dodaj do kalendarza** (Google / Apple / Outlook), **SMS przypomnienie** 1 dzień przed
- Cross-sell: „4 programy w okolicy Siófoku" (link do Programkereső)
- Teaser VIP: „Załóż konto, dostań −5% na następną"

### 21. Spójność między ekranami
**Co:** Audit 12 zrzutów (6 ekranów × desktop+mobile). Lista 10 rozjazdów (CTA color różny, font-weight inny, spacing rozjechany itp.). Mini-fixy w odpowiednich projektach.

---

## Podsumowanie

- **21 kroków** w 4 falach
- **Wspólny mechanizm „Najlepsze tego obiektu":** krok 7 (desktop right-rail) i krok 9 (mobile quick-extract) używają tego samego źródła danych
- **Czas:** Fala 1 ~3h, Fala 2 ~5h, Fala 3 ~4h, Fala 4 ~10-13h → razem **~22-25h pracy claude.ai/design**

**Wykonujemy w claude.ai/design** — patrz [00-kickstart.md](00-kickstart.md) jak uruchomić.
