import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, CheckCircle2, Zap } from "lucide-react";

/**
 * F26 EnergyControl - Spar-Kalkulator
 * Design: Energetic Minimalism
 * - Dunkelblau (Vertrauen, Technologie)
 * - Elektro-Grün (Einsparung, Gewinn)
 * - Viel Whitespace für Fokus
 * - Animierter Counter für emotionale Bindung
 */

export default function Home() {
  const [stromrechnung, setStromrechnung] = useState<number | string>("");
  const [ersparnis, setErsparnis] = useState<number>(0);
  const [displayErsparnis, setDisplayErsparnis] = useState<number>(0);

  // Kalkulationslogik
  const calculateSavings = (value: number) => {
    // Typische Einsparung: 20% der Stromrechnung durch Blindleistungskompensation
    const savings = value * 0.2;
    return Math.round(savings * 100) / 100;
  };

  // Handle Input Change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStromrechnung(value);

    if (value && !isNaN(Number(value))) {
      const numValue = Number(value);
      const calculated = calculateSavings(numValue);
      setErsparnis(calculated);
      setDisplayErsparnis(0); // Reset counter
    } else {
      setErsparnis(0);
      setDisplayErsparnis(0);
    }
  };

  // Animierter Counter
  useEffect(() => {
    if (ersparnis === 0) {
      setDisplayErsparnis(0);
      return;
    }

    let currentValue = 0;
    const increment = ersparnis / 30; // 30 Schritte für Animation
    const interval = setInterval(() => {
      currentValue += increment;
      if (currentValue >= ersparnis) {
        setDisplayErsparnis(ersparnis);
        clearInterval(interval);
      } else {
        setDisplayErsparnis(Math.round(currentValue * 100) / 100);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [ersparnis]);

  const monatlicheErsparnis = displayErsparnis;
  const jaehrlicheErsparnis = Math.round(monatlicheErsparnis * 12 * 100) / 100;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section mit Platzhalter */}
      <section className="relative w-full h-96 bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center overflow-hidden">
        {/* Platzhalter für Hero-Bild */}
        <div className="absolute inset-0 flex items-center justify-center bg-slate-200">
          <div className="text-center">
            <div className="text-6xl font-bold text-slate-400 mb-4">🖼️</div>
            <p className="text-slate-600 font-semibold">HERO-BILD PLATZHALTER</p>
            <p className="text-slate-500 text-sm mt-2 max-w-md">
              Hier sollte ein professionelles Bild der F26-Energieanlage eingesetzt werden.
              <br />
              Empfehlung: Foto aus der Original-PDF (Seite 1) - moderne Energieanlage mit
              Transformatoren und Windkraftanlagen im Hintergrund, großes Fenster mit Ausblick.
            </p>
          </div>
        </div>

        {/* Overlay für Lesbarkeit */}
        <div className="absolute inset-0 bg-black/30"></div>

        {/* Content über Bild */}
        <div className="relative z-10 text-center text-white max-w-2xl px-4">
          <h1 className="text-5xl font-bold mb-4 text-display">
            Ihr Strom.<br />Ihre Kosten.<br />Ihre Wahl.
          </h1>
          <p className="text-xl text-white/90">
            Intelligente Blindleistungskompensation mit 0€ Investition
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        {/* Kalkulator Card */}
        <Card className="p-8 shadow-lg border-0 mb-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Berechnen Sie Ihre Ersparnis
            </h2>
            <p className="text-slate-600">
              Geben Sie Ihre monatliche Stromrechnung ein und sehen Sie sofort, wie viel Sie sparen können.
            </p>
          </div>

          {/* Input Section */}
          <div className="mb-8">
            <Label htmlFor="stromrechnung" className="text-base font-semibold text-slate-900 mb-3 block">
              Monatliche Stromrechnung (€)
            </Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">€</span>
              <Input
                id="stromrechnung"
                type="number"
                placeholder="z.B. 3000"
                value={stromrechnung}
                onChange={handleInputChange}
                className="pl-12 py-6 text-lg border-2 border-slate-200 focus:border-blue-600 focus:ring-0"
                min="0"
              />
            </div>
          </div>

          {/* Ergebnis Section */}
          {stromrechnung && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-8 border-2 border-green-200">
              <p className="text-slate-600 text-sm font-semibold mb-2">IHRE MONATLICHE ERSPARNIS</p>
              <div className="text-5xl font-bold text-green-600 mb-6 text-display">
                {monatlicheErsparnis.toLocaleString("de-DE", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
                €
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded p-4 border border-slate-200">
                  <p className="text-xs text-slate-500 font-semibold mb-1">JÄHRLICHE ERSPARNIS</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {jaehrlicheErsparnis.toLocaleString("de-DE", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                    €
                  </p>
                </div>
                <div className="bg-white rounded p-4 border border-slate-200">
                  <p className="text-xs text-slate-500 font-semibold mb-1">AMORTISATION</p>
                  <p className="text-2xl font-bold text-slate-900">Tag 1</p>
                </div>
                <div className="bg-white rounded p-4 border border-slate-200">
                  <p className="text-xs text-slate-500 font-semibold mb-1">INVESTITION</p>
                  <p className="text-2xl font-bold text-green-600">0€</p>
                </div>
              </div>

              {/* Green Accent Bar */}
              <div className="mt-6 h-1 bg-green-500 rounded-full"></div>
            </div>
          )}

          {/* CTA Button */}
          {stromrechnung && (
            <Button
              size="lg"
              className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 text-lg"
            >
              Kostenlose Netzanalyse anfordern
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          )}
        </Card>

        {/* Benefits Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Warum die F26?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 border-l-4 border-l-green-500 bg-white">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">0€ Anfangsinvestition</h3>
                  <p className="text-slate-600 text-sm">
                    Keine Kosten für Planung, Errichtung oder Installation. Wir tragen alles.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-l-4 border-l-green-500 bg-white">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">Einsparung ab Tag 1</h3>
                  <p className="text-slate-600 text-sm">
                    Ihre Stromkosten sinken sofort nach der Inbetriebnahme der Anlage.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-l-4 border-l-green-500 bg-white">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">5 Jahre Garantie</h3>
                  <p className="text-slate-600 text-sm">
                    Vollgarantie auf alle Komponenten plus 2 Jahre Checkup-Service.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-l-4 border-l-green-500 bg-white">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">24/7 Überwachung</h3>
                  <p className="text-slate-600 text-sm">
                    Fernüberwachung und Elektronikversicherung für maximale Sicherheit.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Praxisbeispiel Section mit Platzhalter */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Praxisbeispiel</h2>
          <Card className="p-8 bg-gradient-to-r from-blue-50 to-slate-50 border-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Text Content */}
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Produktionsbetrieb, 400 kVA Trafo
                </h3>
                <p className="text-slate-600 mb-6">
                  Zeitraum: Januar–Dezember 2024 | PV-Anlage 84,75 kWp integriert | Netzanalyse nach IEC 61000-4-30 Klasse A
                </p>

                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                    <span className="text-slate-600 font-semibold">Energiekosten-Einsparung</span>
                    <span className="text-2xl font-bold text-green-600">-38%</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                    <span className="text-slate-600 font-semibold">cos ϕ Verbesserung</span>
                    <span className="text-2xl font-bold text-slate-900">0,86 → 0,97</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                    <span className="text-slate-600 font-semibold">Netto-Ertrag / Monat</span>
                    <span className="text-2xl font-bold text-green-600">+490€</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-semibold">Amortisation</span>
                    <span className="text-2xl font-bold text-slate-900">8 Monate</span>
                  </div>
                </div>
              </div>

              {/* Platzhalter für Grafik */}
              <div className="bg-white rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center min-h-80">
                <div className="text-center">
                  <div className="text-6xl mb-4">📊</div>
                  <p className="text-slate-600 font-semibold mb-2">GRAFIK PLATZHALTER</p>
                  <p className="text-slate-500 text-sm max-w-xs">
                    Hier sollte ein Balkendiagramm eingesetzt werden, das die monatlichen Energiekosten
                    "Ohne F26" (rot) vs. "Mit F26" (grün) über 12 Monate zeigt.
                    <br /><br />
                    Referenz: Seite 3 der Original-PDF
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Technische Details Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Technische Spezifikation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 bg-white border-0 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-4 text-blue-600">LEISTUNGSUMFANG</h4>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-3">
                  <span className="text-green-500 font-bold mt-1">✓</span>
                  <span><strong>Netzanalyse:</strong> 7 Tage kostenlos (IEC 61000-4-30 Klasse A)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 font-bold mt-1">✓</span>
                  <span><strong>Auslegung:</strong> Individuelle Dimensionierung auf echten Messdaten</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 font-bold mt-1">✓</span>
                  <span><strong>Installation:</strong> Durch zertifizierte Elektrofachkräfte</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 font-bold mt-1">✓</span>
                  <span><strong>Garantie:</strong> 5 Jahre Vollgarantie + 2 Jahre Checkup</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 font-bold mt-1">✓</span>
                  <span><strong>Überwachung:</strong> 24/7 Monitoring + Versicherung</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6 bg-white border-0 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-4 text-blue-600">ZERTIFIZIERUNGEN</h4>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-3">
                  <span className="text-green-500 font-bold mt-1">✓</span>
                  <span><strong>IEC 61000-4-30 Klasse A</strong> – Höchste Messgenauigkeit</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 font-bold mt-1">✓</span>
                  <span><strong>EN 50160</strong> – Europäische Spannungsqualitätsnorm</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 font-bold mt-1">✓</span>
                  <span><strong>VDE-AR-N 4110</strong> – Technische Anschlussregel</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 font-bold mt-1">✓</span>
                  <span><strong>CE-konform</strong> – Europäische Konformität</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 font-bold mt-1">✓</span>
                  <span><strong>Made in Germany</strong> – Zertifizierter Qualitätsstandard</span>
                </li>
              </ul>
            </Card>
          </div>
        </section>

        {/* Qualifizierung Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Lohnt sich die F26 für Ihr Unternehmen?</h2>
          <Card className="p-8 bg-gradient-to-br from-blue-50 to-slate-50 border-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0 font-bold">
                  ✓
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Monatliche Stromrechnung über 2.500€?</p>
                  <p className="text-sm text-slate-600 mt-1">Ideal für Ihre Situation</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0 font-bold">
                  ✓
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Motoren, Pumpen oder Verdichter im Dauerbetrieb?</p>
                  <p className="text-sm text-slate-600 mt-1">Perfekt für Ihre Anlage</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0 font-bold">
                  ✓
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Keine oder veraltete Blindstromkompensation?</p>
                  <p className="text-sm text-slate-600 mt-1">Großes Sparpotenzial</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0 font-bold">
                  ✓
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Netzanbieter mit VDE-AR-N 4110 oder cos ϕ Anforderungen?</p>
                  <p className="text-sm text-slate-600 mt-1">Erfüllen Sie die Anforderungen</p>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Footer CTA */}
        <section className="text-center py-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Kostenlose Netzanalyse in 7 Tagen
          </h2>
          <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
            Lassen Sie uns Ihren Stromverbrauch analysieren und berechnen Sie Ihr individuelles Sparpotenzial.
            Unverbindlich und kostenlos.
          </p>
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 px-8 text-lg"
          >
            Jetzt kostenlose Analyse anfordern
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </section>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 mt-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">FitForFuture Energy</h4>
              <p className="text-slate-400 text-sm">
                Intelligente Blindleistungskompensation für maximale Energieeffizienz.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Kontakt</h4>
              <p className="text-slate-400 text-sm">
                📧 info@fitforfuture-energy.de<br />
                🌐 www.fitforfuture-energy.de
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Zertifizierungen</h4>
              <p className="text-slate-400 text-sm">
                ✓ IEC 61000-4-30 Klasse A<br />
                ✓ Made in Germany<br />
                ✓ 5 Jahre Garantie
              </p>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8 text-center text-slate-400 text-sm">
            <p>&copy; 2026 FitForFuture Energy Nord GmbH. Alle Rechte vorbehalten.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
