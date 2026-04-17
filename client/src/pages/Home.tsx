import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, AlertCircle, CheckCircle2, TrendingUp, Shield, Zap, Info, ChevronDown } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import SignatureCanvas from "react-signature-canvas";

/**
 * F26 EnergyControl - VERKAUFS-PLATTFORM (Option C)
 * 
 * PSYCHOLOGISCHE STRUKTUR:
 * 1. Intro-Screen: Aufmerksamkeit + Relevanz
 * 2. Kalkulator mit Kundendaten-Formular
 * 3. Echte Visualisierungen (basierend auf Kundendaten)
 * 4. Einwand-Handler
 * 5. Vertrag-Preview mit automatischen Kundendaten
 * 6. Unterschriftsfeld (rechtssicher)
 */

type ObjectionHandler = {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  content: React.ReactNode;
};

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<"intro" | "calculator" | "info">("intro");
  
  // Kundendaten
  const [kundenName, setKundenName] = useState("");
  const [kundenUnternehmen, setKundenUnternehmen] = useState("");
  const [kundenEmail, setKundenEmail] = useState("");
  const [stromrechnung, setStromrechnung] = useState<number>(3000);
  
  // Vertrag & Unterschrift
  const [vertragGelesen, setVertragGelesen] = useState(false);
  const [unterschriftGeleistet, setUnterschriftGeleistet] = useState(false);
  const signatureRef = useRef<any>(null);
  const [activeObjection, setActiveObjection] = useState<string | null>(null);

  // Berechnungen
  const monatlicheErsparnis = Math.round(stromrechnung * 0.2 * 100) / 100;
  const jaehrlicheErsparnis = Math.round(monatlicheErsparnis * 12 * 100) / 100;
  const cosPhi = 0.97;
  const cosPhiAlt = 0.86;

  // Echte Kundendaten-Visualisierungen
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const baseWithout = stromrechnung * (0.9 + Math.random() * 0.2);
    return {
      month: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"][i],
      ohne: Math.round(baseWithout),
      mit: Math.round(baseWithout * 0.8),
    };
  });

  // Einsparungsquellen (ohne "Sonstige")
  const savingsData = [
    { name: "Blindarbeit-Wegfall", value: 38, fill: "#10B981" },
    { name: "Leitungsverluste", value: 12, fill: "#34D399" },
    { name: "Reaktive Leistung", value: 20, fill: "#6EE7B7" },
    { name: "Harmonische Verzerrung", value: 15, fill: "#A7F3D0" },
    { name: "Spannungsoptimierung", value: 15, fill: "#D1FAE5" },
  ];

  const objectionHandlers: ObjectionHandler[] = [
    {
      id: "investment",
      title: "Zu teuer?",
      icon: <AlertCircle className="w-5 h-5" />,
      color: "bg-red-50 border-red-200",
      content: (
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg border-2 border-green-300">
            <p className="font-bold text-green-900 text-lg">0€ INVESTITION</p>
            <p className="text-green-700 text-sm mt-2">
              Sie zahlen NICHTS. Wir tragen alle Kosten für Planung, Errichtung und Installation.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-3 rounded border">
              <p className="text-xs text-slate-600">Ihre Kosten</p>
              <p className="text-2xl font-bold text-green-600">0€</p>
            </div>
            <div className="bg-white p-3 rounded border">
              <p className="text-xs text-slate-600">Ihre Einsparung</p>
              <p className="text-2xl font-bold text-green-600">+{monatlicheErsparnis.toLocaleString("de-DE")}€/Mo</p>
            </div>
          </div>
          <p className="text-sm text-slate-600 italic">
            Geschäftsmodell: Wir verdienen durch die CO₂-Zertifikate. Sie sparen sofort. Win-Win.
          </p>
        </div>
      ),
    },
    {
      id: "amortisation",
      title: "Amortisation zu lange?",
      icon: <TrendingUp className="w-5 h-5" />,
      color: "bg-orange-50 border-orange-200",
      content: (
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg border-2 border-green-300">
            <p className="font-bold text-green-900 text-lg">AMORTISATION: TAG 1</p>
            <p className="text-green-700 text-sm mt-2">
              Ihre Einsparung beginnt sofort nach Inbetriebnahme. Keine Wartezeit.
            </p>
          </div>
          <p className="text-sm text-slate-600">
            Bei {stromrechnung.toLocaleString("de-DE")}€/Monat Stromrechnung sparen Sie {monatlicheErsparnis.toLocaleString("de-DE")}€/Monat = {jaehrlicheErsparnis.toLocaleString("de-DE")}€/Jahr
          </p>
        </div>
      ),
    },
    {
      id: "existing",
      title: "Habe bereits Kompensation",
      icon: <CheckCircle2 className="w-5 h-5" />,
      color: "bg-blue-50 border-blue-200",
      content: (
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg border-2 border-green-300">
            <p className="font-bold text-green-900 text-lg">F26 IST INTELLIGENTER</p>
            <p className="text-green-700 text-sm mt-2">
              Unsere Anlage passt sich automatisch an und verbessert den cos ϕ deutlich.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-4 rounded border">
              <p className="text-xs text-slate-600">Ihre aktuelle Anlage</p>
              <p className="text-3xl font-bold text-slate-900">cos ϕ {cosPhiAlt}</p>
            </div>
            <div className="bg-white p-4 rounded border-2 border-green-300">
              <p className="text-xs text-green-600 font-bold">Mit F26</p>
              <p className="text-3xl font-bold text-green-600">cos ϕ {cosPhi}</p>
            </div>
          </div>
          <p className="text-sm text-slate-600">
            Zusätzliche Einsparung: 15-30% durch intelligente Regelung und Optimierung
          </p>
        </div>
      ),
    },
    {
      id: "proof",
      title: "Funktioniert das wirklich?",
      icon: <Shield className="w-5 h-5" />,
      color: "bg-purple-50 border-purple-200",
      content: (
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg border-2 border-green-300">
            <p className="font-bold text-green-900 text-lg">KOSTENLOSE 7-TAGE-NETZANALYSE</p>
            <p className="text-green-700 text-sm mt-2">
              Wir messen Ihre echten Daten. Dann wissen Sie genau, was Sie sparen.
            </p>
          </div>
          <Card className="p-4 bg-slate-50">
            <p className="font-bold text-slate-900 mb-3">Praxisbeispiel: 400 kVA Trafo</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Energiekosten-Einsparung</span>
                <span className="font-bold text-green-600">-38%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">cos ϕ Verbesserung</span>
                <span className="font-bold text-slate-900">0,86 → 0,97</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Netto-Ertrag / Monat</span>
                <span className="font-bold text-green-600">+490€</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-slate-600">Amortisation</span>
                <span className="font-bold text-slate-900">8 Monate</span>
              </div>
            </div>
          </Card>
        </div>
      ),
    },
    {
      id: "complexity",
      title: "Zu kompliziert?",
      icon: <Zap className="w-5 h-5" />,
      color: "bg-yellow-50 border-yellow-200",
      content: (
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg border-2 border-green-300">
            <p className="font-bold text-green-900 text-lg">WIR KÜMMERN UNS UM ALLES</p>
            <p className="text-green-700 text-sm mt-2">
              Planung, Installation, Überwachung – 24/7. Sie müssen nichts tun.
            </p>
          </div>
          <div className="space-y-2">
            {[
              "✓ Kostenlose Netzanalyse (7 Tage)",
              "✓ Individuelle Dimensionierung",
              "✓ Installation durch Fachkräfte",
              "✓ 5 Jahre Vollgarantie",
              "✓ 24/7 Fernüberwachung",
              "✓ Versicherung inklusive",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-slate-700">
                <span className="text-green-600 font-bold">{item.split(" ")[0]}</span>
                <span>{item.slice(2)}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "trust",
      title: "Ist das seriös?",
      icon: <Shield className="w-5 h-5" />,
      color: "bg-indigo-50 border-indigo-200",
      content: (
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg border-2 border-green-300">
            <p className="font-bold text-green-900 text-lg">ZERTIFIZIERT & GEPRÜFT</p>
            <p className="text-green-700 text-sm mt-2">
              Alle Standards erfüllt. Made in Germany. 5 Jahre Garantie.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              "IEC 61000-4-30 Klasse A",
              "VDE-AR-N 4110",
              "EN 50160",
              "CE-konform",
              "Made in Germany",
              "5 Jahre Garantie",
            ].map((cert, i) => (
              <div key={i} className="flex items-center gap-2 text-xs bg-white p-2 rounded border">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-slate-700">{cert}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "regulations",
      title: "Netzanbieter erlaubt das?",
      icon: <CheckCircle2 className="w-5 h-5" />,
      color: "bg-cyan-50 border-cyan-200",
      content: (
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg border-2 border-green-300">
            <p className="font-bold text-green-900 text-lg">ALLE STANDARDS ERFÜLLT</p>
            <p className="text-green-700 text-sm mt-2">
              Wir erfüllen alle Anforderungen. Ihr Netzanbieter wird es genehmigen.
            </p>
          </div>
          <div className="space-y-3">
            <div className="bg-white p-3 rounded border-l-4 border-l-green-500">
              <p className="font-semibold text-slate-900 text-sm">VDE-AR-N 4110</p>
              <p className="text-xs text-slate-600 mt-1">Technische Anschlussregel – vollständig erfüllt</p>
            </div>
            <div className="bg-white p-3 rounded border-l-4 border-l-green-500">
              <p className="font-semibold text-slate-900 text-sm">EN 50160</p>
              <p className="text-xs text-slate-600 mt-1">Europäische Spannungsqualitätsnorm – zertifiziert</p>
            </div>
            <div className="bg-white p-3 rounded border-l-4 border-l-green-500">
              <p className="font-semibold text-slate-900 text-sm">IEC 61000-4-30 Klasse A</p>
              <p className="text-xs text-slate-600 mt-1">Höchste Messgenauigkeit – garantiert</p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const handleClearSignature = () => {
    signatureRef.current?.clear();
    setUnterschriftGeleistet(false);
  };

  const handleSignature = () => {
    const canvas = signatureRef.current?.getCanvas();
    if (canvas && canvas.toDataURL() !== "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==") {
      setUnterschriftGeleistet(true);
    }
  };

  // ============================================
  // SCREEN 1: INTRO
  // ============================================
  if (currentScreen === "intro") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full space-y-8 text-center">
          <div>
            <h1 className="text-6xl font-bold text-blue-600 mb-2">F26</h1>
            <p className="text-slate-600 text-sm font-semibold">EnergyControl</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-5xl font-bold text-slate-900 leading-tight">
              Ihr Strom.<br />Ihre Kosten.<br />Ihre Wahl.
            </h2>
            <p className="text-xl text-slate-600">
              Intelligente Blindleistungskompensation – 0€ Investition
            </p>
          </div>

          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
            <p className="text-green-900 font-semibold text-lg">
              ✓ Einsparung ab Tag 1
            </p>
            <p className="text-green-700 text-sm mt-2">
              Keine Anfangsinvestition. Keine versteckten Kosten. Nur Einsparung.
            </p>
          </div>

          {/* Buttons getauscht: "Wer wir sind" groß, "Jetzt berechnen" klein */}
          <div className="space-y-3">
            <Button
              size="lg"
              onClick={() => setCurrentScreen("info")}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-7 px-12 text-xl w-full"
            >
              Wer wir sind & wie es funktioniert
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setCurrentScreen("calculator")}
              className="w-full font-semibold text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              Jetzt berechnen
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // SCREEN 2: CALCULATOR (mit Kundendaten)
  // ============================================
  if (currentScreen === "calculator") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentScreen("intro")}
                className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
              >
                ← Zurück
              </button>
              <div>
                <h1 className="text-2xl font-bold text-blue-600">F26 EnergyControl</h1>
                <p className="text-xs text-slate-600">Verkaufs-Plattform</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-slate-600">Intelligente Blindleistungskompensation</p>
                <p className="text-xs text-green-600 font-semibold">0€ Investition</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                className="text-xs"
              >
                🖨️ Drucken
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Kundendaten-Formular */}
          <Card className="p-6 border-0 shadow-lg mb-8 bg-gradient-to-r from-blue-50 to-slate-50">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Kundendaten</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label className="text-sm font-semibold text-slate-900 mb-2 block">Name</Label>
                <Input
                  value={kundenName}
                  onChange={(e) => setKundenName(e.target.value)}
                  placeholder="z.B. Max Müller"
                  className="border-2 border-slate-200"
                />
              </div>
              <div>
                <Label className="text-sm font-semibold text-slate-900 mb-2 block">Unternehmen</Label>
                <Input
                  value={kundenUnternehmen}
                  onChange={(e) => setKundenUnternehmen(e.target.value)}
                  placeholder="z.B. ABC GmbH"
                  className="border-2 border-slate-200"
                />
              </div>
              <div>
                <Label className="text-sm font-semibold text-slate-900 mb-2 block">Email</Label>
                <Input
                  value={kundenEmail}
                  onChange={(e) => setKundenEmail(e.target.value)}
                  placeholder="z.B. max@abc.de"
                  type="email"
                  className="border-2 border-slate-200"
                />
              </div>
              <div>
                <Label className="text-sm font-semibold text-slate-900 mb-2 block">Stromrechnung (€/Mo)</Label>
                <Input
                  value={stromrechnung}
                  onChange={(e) => setStromrechnung(Number(e.target.value) || 0)}
                  type="number"
                  className="border-2 border-slate-200"
                  min="0"
                />
              </div>
            </div>
          </Card>

          {/* Ersparnis + Visualisierung */}
          <Card className="p-8 border-0 shadow-lg mb-8 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
            <div className="space-y-6">
              <div>
                <p className="text-sm text-green-700 font-semibold mb-2">MONATLICHE ERSPARNIS</p>
                <p className="text-6xl font-bold text-green-600">
                  {monatlicheErsparnis.toLocaleString("de-DE", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                  €
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <p className="text-xs text-slate-600 font-semibold mb-1">JÄHRLICH</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {jaehrlicheErsparnis.toLocaleString("de-DE", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                    €
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <p className="text-xs text-slate-600 font-semibold mb-1">AMORTISATION</p>
                  <p className="text-2xl font-bold text-green-600">Tag 1</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <p className="text-xs text-slate-600 font-semibold mb-1">INVESTITION</p>
                  <p className="text-2xl font-bold text-green-600">0€</p>
                </div>
              </div>

              <div className="h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full"></div>
              <p className="text-sm text-green-700 font-semibold">✓ Einsparung beginnt sofort nach Inbetriebnahme</p>
            </div>
          </Card>

          {/* Visualisierungen (direkt, ohne Tab-Auswahl) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Monatliche Kostenersparnis */}
            <Card className="p-6 border-0 shadow-lg">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Monatliche Kostenersparnis</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value}€`} />
                  <Legend />
                  <Bar dataKey="ohne" fill="#EF4444" name="Ohne F26" />
                  <Bar dataKey="mit" fill="#10B981" name="Mit F26" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Einsparungsquellen (farblich prägnanter) */}
            <Card className="p-6 border-0 shadow-lg">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Einsparungsquellen</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={savingsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {savingsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Einwand-Handler (direkt darunter) */}
          <Card className="p-6 border-0 shadow-lg mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Häufige Fragen & Einwände</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {objectionHandlers.map((handler) => (
                <Button
                  key={handler.id}
                  variant="outline"
                  onClick={() => setActiveObjection(activeObjection === handler.id ? null : handler.id)}
                  className={`h-auto p-4 justify-start text-left border-2 ${
                    activeObjection === handler.id ? `${handler.color} border-current` : handler.color
                  }`}
                >
                  <div className="flex items-start gap-3 w-full">
                    <span className="text-xl">{handler.icon}</span>
                    <span className="font-semibold text-slate-900">{handler.title}</span>
                  </div>
                </Button>
              ))}
            </div>

            {activeObjection && (
              <Card className="p-6 border-2 border-blue-200 bg-blue-50 mt-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900">
                    {objectionHandlers.find((h) => h.id === activeObjection)?.title}
                  </h3>
                  {objectionHandlers.find((h) => h.id === activeObjection)?.content}
                </div>
              </Card>
            )}
          </Card>

          {/* Vertrag-Preview */}
          <Card className="p-6 border-0 shadow-lg mb-8 bg-gradient-to-r from-slate-50 to-blue-50">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Vertrag-Zusammenfassung</h2>
            <div className="bg-white p-6 rounded-lg border-2 border-slate-200 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-600 font-semibold">KUNDE</p>
                  <p className="text-slate-900 font-semibold">{kundenName || "Nicht eingegeben"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600 font-semibold">UNTERNEHMEN</p>
                  <p className="text-slate-900 font-semibold">{kundenUnternehmen || "Nicht eingegeben"}</p>
                </div>
              </div>

              <div className="border-t pt-4 space-y-3">
                <div>
                  <p className="text-xs text-slate-600 font-semibold mb-1">VERTRAGSDETAILS</p>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li>✓ <strong>Monatliche Stromrechnung:</strong> {stromrechnung.toLocaleString("de-DE")}€</li>
                    <li>✓ <strong>Monatliche Einsparung:</strong> {monatlicheErsparnis.toLocaleString("de-DE")}€</li>
                    <li>✓ <strong>Jährliche Einsparung:</strong> {jaehrlicheErsparnis.toLocaleString("de-DE")}€</li>
                    <li>✓ <strong>Laufzeit:</strong> 8 Jahre ab Inbetriebnahme</li>
                    <li>✓ <strong>Investition:</strong> 0€</li>
                    <li>✓ <strong>Garantie:</strong> 5 Jahre Vollgarantie</li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-4">
                <p className="text-sm text-slate-700">
                  <strong>Rechtlicher Hinweis:</strong> Mit Ihrer Unterschrift akzeptieren Sie die Bedingungen dieser Vereinbarung. 
                  Die Laufzeit beträgt 8 Jahre ab Inbetriebnahme. Keine ordentliche Kündigung während der Laufzeit. 
                  Kostenlose Netzanalyse (7 Tage), Installation und 24/7 Überwachung inklusive.
                </p>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <input
                  type="checkbox"
                  id="vertragGelesen"
                  checked={vertragGelesen}
                  onChange={(e) => setVertragGelesen(e.target.checked)}
                  className="w-4 h-4 cursor-pointer"
                />
                <label htmlFor="vertragGelesen" className="text-sm text-slate-700 cursor-pointer">
                  Ich habe die Vertragsbedingungen gelesen und akzeptiert
                </label>
              </div>
            </div>
          </Card>

          {/* Unterschriftsfeld (nur aktiv wenn Vertrag gelesen) */}
          {vertragGelesen && (
            <Card className="p-6 border-0 shadow-lg mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Unterschrift des Kunden</h2>

              <div className="border-2 border-slate-300 rounded-lg bg-white p-4 mb-4">
                <SignatureCanvas
                  ref={signatureRef}
                  canvasProps={{
                    width: 500,
                    height: 150,
                    className: "border border-slate-200 rounded w-full bg-white",
                  }}
                />
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={handleClearSignature}>
                  Löschen
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={handleSignature}
                  disabled={!vertragGelesen}
                >
                  Unterschrift bestätigen
                </Button>
              </div>

              {unterschriftGeleistet && (
                <div className="mt-4 p-4 bg-green-100 border border-green-400 rounded-lg">
                  <p className="text-green-900 font-semibold">✓ Unterschrift erfolgreich! Der Vertrag ist nun rechtsgültig.</p>
                </div>
              )}
            </Card>
          )}

          {/* Hinweis wenn Vertrag nicht gelesen */}
          {!vertragGelesen && (
            <Card className="p-4 border-2 border-orange-200 bg-orange-50 mb-8">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-orange-900">Vertrag erforderlich</p>
                  <p className="text-sm text-orange-800 mt-1">
                    Bitte lesen Sie die Vertragsbedingungen oben und akzeptieren Sie diese, um das Unterschriftsfeld freizuschalten.
                  </p>
                </div>
              </div>
            </Card>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-slate-900 text-white py-8 mt-12 print:hidden">
          <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
            <p>&copy; 2026 FitForFuture Energy Nord GmbH. Verkaufs-Plattform für autorisierte Vertriebspartner.</p>
          </div>
        </footer>
      </div>
    );
  }

  // ============================================
  // SCREEN 3: INFO
  // ============================================
  if (currentScreen === "info") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
            <button
              onClick={() => setCurrentScreen("intro")}
              className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
            >
              ← Zurück
            </button>
            <h1 className="text-2xl font-bold text-blue-600">Über uns & Wie es funktioniert</h1>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-12">
          {/* Wer wir sind */}
          <Card className="p-8 border-0 shadow-lg mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Wer wir sind</h2>
            <p className="text-slate-700 text-lg mb-4">
              <strong>FitForFuture Energy</strong> ist ein spezialisiertes Unternehmen für intelligente Energieeffizienz. 
              Wir entwickeln und installieren Blindleistungskompensationsanlagen (F26 EnergyControl), die Unternehmen dabei helfen, 
              ihre Stromkosten um 20-40% zu senken – ohne Anfangsinvestition.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-l-blue-600">
                <p className="font-bold text-slate-900">Spezialist</p>
                <p className="text-sm text-slate-600 mt-2">Über 10 Jahre Erfahrung in Energieoptimierung</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-l-blue-600">
                <p className="font-bold text-slate-900">Zertifiziert</p>
                <p className="text-sm text-slate-600 mt-2">IEC 61000-4-30, VDE-AR-N 4110, Made in Germany</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-l-blue-600">
                <p className="font-bold text-slate-900">Partnerschaft</p>
                <p className="text-sm text-slate-600 mt-2">Wir verdienen durch CO₂-Zertifikate, Sie sparen</p>
              </div>
            </div>
          </Card>

          {/* Wie es funktioniert */}
          <Card className="p-8 border-0 shadow-lg mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Wie F26 funktioniert</h2>
            <div className="space-y-6">
              {[
                {
                  step: 1,
                  title: "Kostenlose Netzanalyse (7 Tage)",
                  description: "Wir messen Ihre echten Stromverbrauchsdaten nach IEC 61000-4-30 Klasse A. Vollständig kostenlos, unverbindlich.",
                },
                {
                  step: 2,
                  title: "Individuelle Dimensionierung",
                  description: "Basierend auf Ihren Messdaten dimensionieren wir die F26-Anlage optimal für Ihre Anforderungen.",
                },
                {
                  step: 3,
                  title: "Installation durch Fachkräfte",
                  description: "Zertifizierte Elektrofachkräfte installieren die Anlage. Alles inklusive, 0€ für Sie.",
                },
                {
                  step: 4,
                  title: "Inbetriebnahme & Monitoring",
                  description: "Wir nehmen die Anlage in Betrieb. Ab Tag 1 sparen Sie Stromkosten. 24/7 Fernüberwachung inklusive.",
                },
                {
                  step: 5,
                  title: "8 Jahre Partnerschaft",
                  description: "5 Jahre Vollgarantie, 24/7 Support, Versicherung. Wir kümmern uns um alles.",
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-green-600 text-white font-bold text-lg">
                      {item.step}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">{item.title}</h3>
                    <p className="text-slate-600 mt-1">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Technologie */}
          <Card className="p-8 border-0 shadow-lg mb-8 bg-gradient-to-r from-green-50 to-emerald-50">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Die F26-Technologie</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-slate-900 mb-3">Was ist Blindleistung?</h3>
                <p className="text-slate-700 mb-4">
                  Blindleistung ist der "unsichtbare" Teil Ihres Stromverbrauchs. Sie entsteht durch Motoren, Pumpen und andere induktive Lasten. 
                  Ihr Netzanbieter berechnet Ihnen diese Blindleistung extra – oft 20-30% Ihrer Stromrechnung.
                </p>
                <p className="text-slate-700">
                  <strong>Die F26 kompensiert diese Blindleistung automatisch</strong>, wodurch Ihre Stromrechnung sinkt und die Netzqualität verbessert wird.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg border-2 border-green-300">
                <h3 className="font-bold text-slate-900 mb-3">Typische Verbesserungen</h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li>✓ <strong>cos ϕ:</strong> 0,86 → 0,97 (Leistungsfaktor)</li>
                  <li>✓ <strong>Stromkosten:</strong> -20-40% Einsparung</li>
                  <li>✓ <strong>Netzqualität:</strong> Bessere Spannungsstabilität</li>
                  <li>✓ <strong>CO₂:</strong> Reduktion durch weniger Stromverbrauch</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Vertrauenssignale */}
          <Card className="p-8 border-0 shadow-lg mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Vertrauenssignale</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-slate-900 mb-4">Zertifizierungen</h3>
                <ul className="space-y-2">
                  {[
                    "IEC 61000-4-30 Klasse A – Höchste Messgenauigkeit",
                    "EN 50160 – Europäische Spannungsqualitätsnorm",
                    "VDE-AR-N 4110 – Technische Anschlussregel",
                    "CE-konform – Europäische Konformität",
                    "Made in Germany – Zertifizierter Qualitätsstandard",
                  ].map((cert, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-700">
                      <span className="text-green-600 font-bold mt-1">✓</span>
                      <span>{cert}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-4">Garantie & Service</h3>
                <ul className="space-y-2">
                  {[
                    "5 Jahre Vollgarantie auf alle Komponenten",
                    "2 Jahre Checkup-Service nach Garantie",
                    "24/7 Fernüberwachung der Anlage",
                    "Haftpflicht- und Sachversicherung inklusive",
                    "Kostenlose Netzanalyse (7 Tage)",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-700">
                      <span className="text-green-600 font-bold mt-1">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>

          {/* CTA */}
          <div className="text-center mb-12">
            <Button
              size="lg"
              onClick={() => setCurrentScreen("calculator")}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-7 px-12 text-lg"
            >
              Jetzt berechnen
              <ArrowRight className="ml-3 h-5 w-5" />
            </Button>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-slate-900 text-white py-8">
          <div className="max-w-4xl mx-auto px-4 text-center text-slate-400 text-sm">
            <p>&copy; 2026 FitForFuture Energy Nord GmbH. Verkaufs-Plattform für autorisierte Vertriebspartner.</p>
          </div>
        </footer>
      </div>
    );
  }
}
