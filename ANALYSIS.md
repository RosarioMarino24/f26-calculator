# F26 EnergyControl - Kalkulator Analyse

## Dokument 1: F26 Präsentation (PDF)

### Kernbotschaft
- **Headline:** "Ihr Strom. Ihre Kosten. Ihre Wahl."
- **Kernvorteil:** Blindleistungskompensation mit 0€ Anfangsinvestition
- **Typische Einsparung:** 30-40% Reduktion der Energiekosten
- **Amortisation:** Tag 1 (Einsparung sofort ab Inbetriebnahme)

### Technische Grundlagen
- **Leistungsfaktor-Verbesserung:** cos ϕ 0,86 → 0,97
- **Typisches Einsparpotenzial:** 15-30% durch Blindleistungskompensation
- **Zielgruppe:** Unternehmen mit:
  - Monatliche Stromrechnung > 2.500€
  - Motoren, Pumpen, Verdichter im Dauerbetrieb
  - Keine oder veraltete Blindstromkompensation
  - Netzanbieter mit VDE-AR-N 4110 oder cos ϕ Anforderungen

### Praxisbeispiel (400 kVA Trafo)
- **Energiekosten-Einsparung:** -38%
- **cos ϕ Verbesserung:** 0,86 → 0,97
- **Netto-Ertrag:** +490€/Monat
- **Amortisation:** 8 Monate
- **Monatliche Kostenersparnis:** Grafik zeigt Vergleich Vorher/Nachher über 12 Monate

### Leistungsumfang
- **Netzanalyse:** 7 Tage kostenlos (IEC 61000-4-30 Klasse A)
- **Auslegung:** Individuelle Dimensionierung auf echten Messdaten
- **Fertigung:** 4-6 Wochen Lieferzeit (zertifizierter Qualitätspartner)
- **Installation:** Inklusive durch zertifizierte Elektrofachkräfte
- **Garantie:** 5 Jahre Vollgarantie + 2 Jahre Checkup
- **Fernüberwachung:** 24/7 Monitoring, Anlagen- & Elektronikversicherung

### Zertifizierungen & Normen
- IEC 61000-4-30 Klasse A
- EN 50160
- VDE-AR-N 4110
- CE-konform, Made in Germany

## Dokument 2: Nutzungsvertrag (DOCX)

### Geschäftsmodell
- **Investition:** 0€ für den Kunden
- **Vertragslaufzeit:** 8 Jahre ab Inbetriebnahme
- **Kündigung:** Keine ordentliche Kündigung während Laufzeit
- **Wirtschaftlicher Vorteil:** Ausschließlich die Blindleistungskompensation (Kostenersparnis)

### Vertragsparteien
- **Standortgeber:** Der Kunde (Betreiber der Anlage)
- **Aufsteller:** FitForFuture Energy (Eigentümer & Betreiber der Anlage)

### Wichtige Klauseln
- **Eigentum:** Anlage bleibt Eigentum des Aufstellers
- **CO₂-Zertifikate:** Alle CO₂-Zertifikate gehören dem Aufsteller
- **Kosten:** Aufsteller trägt alle Kosten (Planung, Errichtung, Betrieb, Wartung)
- **Haftung:** Aufsteller haftet für Schäden durch die Anlage
- **Versicherung:** Aufsteller trägt Haftpflicht- und Sachversicherung
- **Rückbau:** Nach 8 Jahren wird die Anlage rückgebaut

---

## Kalkulationslogik für den Rechner

### Eingabeparameter
1. **Monatliche Stromrechnung (€)** - Haupteingabe des Kunden
2. **Aktueller Leistungsfaktor (cos ϕ)** - Optional, Standard: 0,86
3. **Branche/Anlagentyp** - Optional, für Genauigkeit

### Berechnungsschritte

#### Schritt 1: Stromverbrauch aus Rechnung ableiten
```
Monatliche Stromkosten (€) ÷ Durchschnittlicher Strompreis (€/kWh)
= Monatlicher Stromverbrauch (kWh)
```
- Standardannahme: 0,25€/kWh (kann angepasst werden)

#### Schritt 2: Blindleistungskosten berechnen
```
Blindleistungskosten = Monatliche Stromrechnung × Blindleistungsanteil
```
- Typischer Blindleistungsanteil: 22% der Stromrechnung
- Basierend auf: cos ϕ 0,86 = 22% Blindarbeit, 62% Wirkarbeit, 16% Verluste

#### Schritt 3: Einsparung durch F26 berechnen
```
Einsparung (%) = (cos ϕ alt - cos ϕ neu) × Reduktionsfaktor
```
- Mit F26: cos ϕ verbessert sich von 0,86 auf 0,97
- Typische Einsparung: 15-30% der Blindleistungskosten
- Konservative Annahme: 20% der Stromrechnung

#### Schritt 4: Monatliche Ersparnis
```
Monatliche Ersparnis (€) = Monatliche Stromrechnung × 0,20
```

#### Schritt 5: Jährliche Ersparnis & Amortisation
```
Jährliche Ersparnis (€) = Monatliche Ersparnis × 12
Amortisationsdauer = 0 Monate (0€ Investition)
```

---

## Verkaufspsychologische Elemente

### Trigger-Punkte
1. **Sofortige Visualisierung:** Kunde sieht sofort seine Ersparnis
2. **Konkrete Zahlen:** "490€/Monat" statt "30% Einsparung"
3. **Null-Investition:** "0€ Anfangsinvestition" ist der stärkste Verkaufsargument
4. **Vertrauenssignale:** Zertifizierungen, Garantie, Made in Germany
5. **Dringlichkeit:** "Tag 1" - Einsparung beginnt sofort
6. **Soziale Bewährung:** Praxisbeispiele mit echten Zahlen

### Design-Psychologie
- **Grün für Einsparung:** Psychologische Assoziation mit Gewinn
- **Große, fette Zahlen:** Macht Einsparungen emotional greifbar
- **Vorher/Nachher-Vergleich:** Visueller Beweis des Wertes
- **Fortschrittsbalken:** Zeigt "Weg zur Amortisation" (0 Monate)
- **Call-to-Action:** "Kostenlose Netzanalyse anfordern"

---

## Zielgruppe & Qualifizierung

### Ideale Kunden
- Monatliche Stromrechnung > 2.500€
- Produzierende Unternehmen
- Handwerksbetriebe mit Motorenlast
- Lagerhäuser, Kühlhäuser
- Rechenzentren

### Disqualifizierer
- Stromrechnung < 500€/Monat
- Reine Büronutzung ohne Motorenlast
- Bereits moderne Blindleistungskompensation vorhanden
