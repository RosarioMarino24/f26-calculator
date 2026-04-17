# Design-Konzepte für F26 EnergyControl Kalkulator

## Konzept 1: "Energetic Minimalism" – Moderne Effizienz
**Design-Bewegung:** Contemporary Minimalism mit Tech-Accent
**Wahrscheinlichkeit:** 0.08

### Kernprinzipien
Das Design folgt dem Prinzip der **reduzierten Komplexität**: Jedes Element hat einen klaren Zweck. Der Fokus liegt auf der Eingabe und dem unmittelbaren visuellen Feedback der Einsparnis. Die Ästhetik ist clean, luftig und technisch—ohne Ablenkung, aber nicht kalt.

Die Hierarchie wird durch **Größe und Farbe** statt durch Schatten oder Texturen aufgebaut. Der Kalkulator selbst wird als zentrales, schwebendes Element inszeniert, umgeben von viel Whitespace.

### Farbphilosophie
Die Palette kombiniert **Dunkelblau** (Vertrauen, Technologie) mit **Elektro-Grün** (Energie, Einsparung) und **Neutralweiß** (Klarheit). Das Grün wird nur für Ergebnisse und positive Zahlen verwendet—es ist das psychologische Signal für "Gewinn". Der Hintergrund ist reines Weiß mit subtilen Grautönen für Struktur.

### Layout-Paradigma
**Vertikale Zentrierung mit asymmetrischen Akzenten:** Der Kalkulator sitzt zentriert im oberen Drittel. Unter der Eingabe und dem Ergebnis folgen drei horizontale Informationskarten (Einsparung, Amortisation, Zertifikate), die in einem leicht versetzten Raster angeordnet sind. Dies bricht die Monotonie auf, ohne chaotisch zu wirken.

### Signature Elements
1. **Animated Savings Counter:** Die Ersparnis wird als Live-Counter dargestellt, der von 0€ hochzählt, wenn der Kunde seine Stromrechnung eingibt. Dies erzeugt emotionale Engagement.
2. **Grüner Akzent-Balken:** Ein dünner, grüner Balken unter dem Kalkulator zeigt visuell die "Einsparungsintensität" (je höher die Stromrechnung, desto länger der Balken).
3. **Vertrauens-Badges:** Kleine Icons für Zertifikate (IEC, VDE, Made in Germany) in der Fußzeile—minimalistisch, aber präsent.

### Interaktions-Philosophie
Jede Eingabe triggert sofortige visuelle Rückmeldung. Der Counter animiert, die grüne Linie wächst, die Ergebniskarte leuchtet auf. Es gibt keine Verzögerung—der Kunde sieht sein Potenzial in Echtzeit. Hover-Effekte sind subtil (leichte Farbveränderung, keine Skalierung).

### Animation
- **Input-Fokus:** Subtile Farbveränderung des Input-Feldes (Blau → Dunkelblau)
- **Counter-Animation:** Easing-Funktion (ease-out) für den Zähler, schnell bei Eingabe, verlangsamt sich am Ende
- **Card-Entrance:** Karten fahren von unten ein (0.3s Verzögerung pro Karte)
- **Hover-Effekte:** Minimale Opacity-Änderung (95% → 100%), kein Scale

### Typographie
**Display-Font:** "Poppins" Bold (700) für Überschriften und große Zahlen—modern, technisch, energisch.
**Body-Font:** "Inter" Regular (400) für Beschreibungen und kleinere Texte—lesbar, neutral, professionell.
**Größen-Hierarchie:** Ersparnis-Zahl 3.5rem, Überschriften 1.5rem, Body 0.95rem.

---

## Konzept 2: "Trust & Growth" – Klassisch-Vertrauensvoll
**Design-Bewegung:** Corporate Modernism mit psychologischen Triggers
**Wahrscheinlichkeit:** 0.07

### Kernprinzipien
Dieses Design prioritärt **Vertrauen und Klarheit** über Modernität. Es nutzt bewährte B2B-Muster, aber mit stärkerer emotionaler Komponente. Die Ästhetik ist professionell, aber nicht steril—es gibt Wärme durch subtile Gradienten und Mikro-Interaktionen.

Die Philosophie: Der Kunde soll sich sicher fühlen, dass dies ein etabliertes, seriöses Angebot ist, nicht ein Startup-Experiment.

### Farbphilosophie
**Primär:** Dunkelblau (RGB 25, 45, 85)—das ist die Farbe von Banken und etablierten Energieunternehmen. **Sekundär:** Warmes Grün (RGB 76, 175, 80)—nicht neonig, sondern beruhigend und wachstumsorientiert. **Tertiär:** Helles Grau (RGB 245, 245, 245) für Hintergründe. Der Fokus liegt auf **Vertrauensfarben**, nicht auf Aufregung.

### Layout-Paradigma
**Hero-Section mit Testimonial-Flow:** Oben ein großer Hero mit Headline "Ihre Stromkosten senken—ab Tag 1." Darunter der Kalkulator in einer weißen Karte mit sanftem Schatten. Unter dem Ergebnis folgt ein Testimonial-Carousel mit echten Kundenbeispielen (400 kVA Trafo, etc.).

### Signature Elements
1. **Vertrauens-Siegel:** Große Icons für Zertifikate (IEC, VDE, Made in Germany) direkt neben dem Ergebnis.
2. **Vorher/Nachher-Visualisierung:** Ein Split-Screen zeigt die Stromrechnung "Ohne F26" vs. "Mit F26" in Echtzeit.
3. **Garantie-Banner:** Ein goldenes Banner mit "5 Jahre Vollgarantie" unter dem Kalkulator.

### Interaktions-Philosophie
Der Fokus liegt auf **Sicherheit und Vorhersehbarkeit**. Jede Aktion hat eine klare, erwartbare Reaktion. Es gibt Tooltips für technische Begriffe (cos ϕ, Blindleistung). Der Kunde wird "an die Hand genommen".

### Animation
- **Sanfte Übergänge:** Alle Animationen nutzen ease-in-out, 0.4s Dauer
- **Vorher/Nachher-Wechsel:** Subtiler Fade-Transition zwischen den beiden Zuständen
- **Zahlenwechsel:** Smooth-Transition mit Rotation-Effekt (kleine Drehung beim Wechsel)
- **Hover-Effekte:** Leichte Erhöhung des Schattens, keine Farbveränderung

### Typographie
**Display-Font:** "Playfair Display" Bold für Überschriften—elegant, klassisch, vertrauenswürdig.
**Body-Font:** "Lato" Regular für Body-Text—warm, lesbar, nicht zu modern.
**Größen-Hierarchie:** Ersparnis-Zahl 4rem, Überschriften 1.75rem, Body 1rem.

---

## Konzept 3: "Impact Velocity" – Aggressiv-Überzeugend
**Design-Bewegung:** Aggressive Modernism mit Conversion-Fokus
**Wahrscheinlichkeit:** 0.09

### Kernprinzipien
Dieses Design ist **konversionsoptimiert** und nutzt aggressive Verkaufspsychologie. Die Ästhetik ist dynamisch, energisch und visuell dominant. Jedes Element ist auf die Aktion ausgerichtet: Eingabe → Ergebnis → Call-to-Action.

Es gibt keine Ablenkung, aber auch keine Subtilität. Die Botschaft ist klar und laut: "Du sparst Geld. Jetzt. Sofort."

### Farbphilosophie
**Primär:** Elektro-Orange (RGB 255, 140, 0)—Aufmerksamkeit, Energie, Dringlichkeit. **Sekundär:** Dunkelgrau (RGB 30, 30, 30)—Kontrast und Ernsthaftigkeit. **Akzent:** Leuchtendes Grün (RGB 50, 205, 50)—Einsparung, Gewinn, Erfolg. Der Hintergrund ist dunkelgrau oder schwarz, um die Farben zum Leuchten zu bringen.

### Layout-Paradigma
**Full-Screen Impact:** Der Kalkulator nimmt 80% des Viewports ein. Oben eine große, fette Headline in Orange: "Ihre Ersparnis: [LIVE-ZAHL]". Der Input ist groß und prominent. Das Ergebnis ist in einer großen, grünen Box mit großem Text. Unter dem Ergebnis folgt ein großer, oranger Button: "Kostenlose Netzanalyse anfordern".

### Signature Elements
1. **Live-Savings-Ticker:** Die Ersparnis wird in Echtzeit angezeigt und aktualisiert sich bei jeder Eingabe. Die Zahl ist riesig und in Grün.
2. **Dringlichkeits-Indicator:** Ein kleiner Text unter dem Ergebnis: "Ihre Einsparung beginnt ab Tag 1."
3. **Countdown-Elemente:** Kleine Animationen, die zeigen, wie schnell die Amortisation erfolgt (z.B. "Amortisiert in 0 Monaten").

### Interaktions-Philosophie
Alles ist **sofort und dramatisch**. Jede Eingabe triggert eine sichtbare Reaktion. Es gibt Micro-Interactions wie Pulse-Effekte, Shake-Animationen bei großen Einsparungen, und Confetti-Effekte bei der Eingabe besonders hoher Stromrechnungen.

### Animation
- **Pulse-Effekt:** Die grüne Ergebnis-Box pulsiert sanft (Opacity 1 → 0.8 → 1)
- **Shake-Animation:** Bei Eingabe großer Zahlen (>5000€) schüttelt sich die Box leicht
- **Counter-Animation:** Schneller, energischer Zähler mit Easing-Funktion (ease-out-elastic)
- **Confetti:** Bei besonders hohen Einsparungen (>1000€/Monat) fallen Konfetti-Partikel
- **Hover-Effekte:** Skalierung (1 → 1.05), Farbveränderung, Schatten-Erhöhung

### Typographie
**Display-Font:** "Bebas Neue" für Überschriften—bold, energisch, aggressive Präsenz.
**Body-Font:** "Roboto" Regular für Body-Text—modern, lesbar, technisch.
**Größen-Hierarchie:** Ersparnis-Zahl 5rem, Überschriften 2rem, Body 1rem.

---

## Gewähltes Design: "Energetic Minimalism"

Ich habe mich für **Konzept 1: "Energetic Minimalism"** entschieden. Dieses Design bietet die beste Balance zwischen **Verkaufspsychologie und Benutzerfreundlichkeit**:

- **Sofortige Klarheit:** Der Kunde sieht sofort, was er eingeben muss und was er spart—keine Ablenkung.
- **Emotionale Bindung:** Der animierte Counter erzeugt ein Gefühl von "Ich sehe mein Geld wachsen".
- **Vertrauenssignale:** Die Zertifikate und Badges sind präsent, aber nicht aufdringlich.
- **Technische Glaubwürdigkeit:** Das Design wirkt modern und kompetent, nicht "billig" oder "zu verkäuferisch".
- **Mobile-Freundlichkeit:** Das vertikale Layout funktioniert perfekt auf Smartphones.

Die Farbwahl (Dunkelblau + Elektro-Grün) ist psychologisch optimal für B2B-Verkauf: Blau schafft Vertrauen, Grün signalisiert Einsparung. Der Whitespace reduziert kognitive Belastung, sodass der Kunde sich auf die Entscheidung konzentriert.
