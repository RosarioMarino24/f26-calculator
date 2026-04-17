import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, AlertCircle, CheckCircle2, TrendingUp, Shield, Zap } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import SignatureCanvas from "react-signature-canvas";

/**
 * F26 EnergyControl - VERKAUFS-PLATTFORM
 * Design: Energetic Minimalism für Verkaufsgespräche
 * - Live-Kalkulator für Verkäufer
 * - Einwand-Handler mit Gegenargumenten
 * - Vergleichs-Visualisierungen
 * - Unterschrift-Pad für Abschluss
 */

type ObjectionHandler = {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  content: React.ReactNode;
};

export default function Home() {
  const [stromrechnung, setStromrechnung] = useState<number>(3000);
  const [activeObjection, setActiveObjection] = useState<string | null>(null);
  const [showSignature, setShowSignature] = useState(false);
  const signatureRef = useRef<any>(null);

  // Berechnungen
  const monatlicheErsparnis = Math.round(stromrechnung * 0.2 * 100) / 100;
  const jaehrlicheErsparnis = Math.round(monatlicheErsparnis * 12 * 100) / 100;
  const cosPhi = 0.97;
  const cosPhiAlt = 0.86;

  // Daten für Visualisierungen
  const monthlyData = [
    { month: "Jan", ohne: 5200, mit: 3120 },
    { month: "Feb", ohne: 5400, mit: 3240 },
    { month: "Mär", ohne: 4800, mit: 2880 },
    { month: "Apr", ohne: 4500, mit: 2700 },
    { month: "Mai", ohne: 6100, mit: 3660 },
    { month: "Jun", ohne: 6300, mit: 3780 },
    { month: "Jul", ohne: 6200, mit: 3720 },
    { month: "Aug", ohne: 5900, mit: 3540 },
    { month: "Sep", ohne: 5500, mit: 3300 },
    { month: "Okt", ohne: 5700, mit: 3420 },
    { month: "Nov", ohne: 6000, mit: 3600 },
    { month: "Dez", ohne: 6400, mit: 3840 },
  ];

  const savingsData = [
    { name: "Blindarbeit-Wegfall", value: 38, fill: "#4CAF50" },
    { name: "Leitungsverluste", value: 12, fill: "#66BB6A" },
    { name: "Sonstige", value: 50, fill: "#81C784" },
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
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `${value}€`} />
              <Legend />
              <Bar dataKey="ohne" fill="#EF4444" name="Ohne F26" />
              <Bar dataKey="mit" fill="#4CAF50" name="Mit F26" />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-sm text-slate-600">
            Beispiel: Bei 3.000€/Monat Stromrechnung sparen Sie 600€/Monat = 7.200€/Jahr
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
  };

  const handleDownloadSignature = () => {
    const canvas = signatureRef.current?.getCanvas();
    if (canvas) {
      const link = document.createElement("a");
      link.href = canvas.toDataURL();
      link.download = "f26-unterschrift.png";
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-blue-600">F26 EnergyControl</h1>
            <p className="text-xs text-slate-600">Verkaufs-Plattform</p>
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
        {/* Live Kalkulator */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 print:grid-cols-2">
          {/* Input Section */}
          <Card className="lg:col-span-1 p-6 shadow-lg border-0 print:shadow-none">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Live-Kalkulator</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="stromrechnung" className="text-sm font-semibold text-slate-900 mb-2 block">
                  Monatliche Stromrechnung (€)
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl font-bold text-slate-400">€</span>
                  <Input
                    id="stromrechnung"
                    type="number"
                    value={stromrechnung}
                    onChange={(e) => setStromrechnung(Number(e.target.value) || 0)}
                    className="pl-10 py-4 text-lg border-2 border-slate-200 focus:border-blue-600"
                    min="0"
                  />
                </div>
              </div>

              {/* Quick Select */}
              <div className="space-y-2">
                <p className="text-xs text-slate-600 font-semibold">SCHNELLAUSWAHL</p>
                <div className="grid grid-cols-3 gap-2">
                  {[1000, 3000, 5000].map((value) => (
                    <Button
                      key={value}
                      variant={stromrechnung === value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setStromrechnung(value)}
                      className="text-xs"
                    >
                      {value}€
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Ergebnis Section */}
          <Card className="lg:col-span-2 p-8 shadow-lg border-0 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 print:shadow-none">
            <div className="space-y-6">
              <div>
                <p className="text-sm text-green-700 font-semibold mb-2">MONATLICHE ERSPARNIS</p>
                <p className="text-6xl font-bold text-green-600 text-display">
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

              <p className="text-sm text-green-700 font-semibold">
                ✓ Einsparung beginnt sofort nach Inbetriebnahme
              </p>
            </div>
          </Card>
        </div>

        {/* Tabs für verschiedene Sichten */}
        <Tabs defaultValue="objections" className="mb-8 print:hidden">
          <TabsList className="grid w-full grid-cols-3 bg-white border border-slate-200">
            <TabsTrigger value="objections">Einwand-Handler</TabsTrigger>
            <TabsTrigger value="visualizations">Visualisierungen</TabsTrigger>
            <TabsTrigger value="signature">Unterschrift</TabsTrigger>
          </TabsList>

          {/* Einwand-Handler */}
          <TabsContent value="objections" className="space-y-4">
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

            {/* Objection Content */}
            {activeObjection && (
              <Card className="p-6 border-2 border-blue-200 bg-blue-50">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900">
                    {objectionHandlers.find((h) => h.id === activeObjection)?.title}
                  </h3>
                  {objectionHandlers.find((h) => h.id === activeObjection)?.content}
                </div>
              </Card>
            )}
          </TabsContent>

          {/* Visualisierungen */}
          <TabsContent value="visualizations" className="space-y-6">
            <Card className="p-6 border-0 shadow-lg">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Monatliche Kostenersparnis (Beispiel)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value}€`} />
                  <Legend />
                  <Bar dataKey="ohne" fill="#EF4444" name="Ohne F26" />
                  <Bar dataKey="mit" fill="#4CAF50" name="Mit F26" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

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
          </TabsContent>

          {/* Unterschrift */}
          <TabsContent value="signature" className="space-y-4">
            <Card className="p-6 border-0 shadow-lg">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Unterschrift des Kunden</h3>

              <div className="border-2 border-slate-300 rounded-lg bg-white p-4 mb-4">
                <SignatureCanvas
                  ref={signatureRef}
                  canvasProps={{
                    width: 500,
                    height: 200,
                    className: "border border-slate-200 rounded w-full bg-white",
                  }}
                />
              </div>

              <div className="flex gap-3 print:hidden">
                <Button variant="outline" onClick={handleClearSignature}>
                  Löschen
                </Button>
                <Button className="bg-green-600 hover:bg-green-700" onClick={handleDownloadSignature}>
                  Unterschrift speichern
                </Button>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-slate-700">
                  <strong>Vertrag:</strong> 8-jährige Laufzeit ab Inbetriebnahme. Keine ordentliche Kündigung während Laufzeit.
                  Kostenlose Netzanalyse (7 Tage), Installation und 24/7 Überwachung inklusive.
                </p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Praxisbeispiele */}
        <Card className="p-6 border-0 shadow-lg mb-8 bg-gradient-to-r from-blue-50 to-slate-50 print:shadow-none">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Praxisbeispiele</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg border-l-4 border-l-green-500">
              <p className="font-bold text-slate-900 mb-3">Produktionsbetrieb, 400 kVA</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Energiekosten-Einsparung</span>
                  <span className="font-bold text-green-600">-38%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">cos ϕ Verbesserung</span>
                  <span className="font-bold">0,86 → 0,97</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Netto-Ertrag / Monat</span>
                  <span className="font-bold text-green-600">+490€</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-slate-600">Amortisation</span>
                  <span className="font-bold">8 Monate</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border-l-4 border-l-green-500">
              <p className="font-bold text-slate-900 mb-3">Handwerksbetrieb, 100 kVA</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Energiekosten-Einsparung</span>
                  <span className="font-bold text-green-600">-25%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">cos ϕ Verbesserung</span>
                  <span className="font-bold">0,86 → 0,96</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Netto-Ertrag / Monat</span>
                  <span className="font-bold text-green-600">+120€</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-slate-600">Amortisation</span>
                  <span className="font-bold">6 Monate</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Qualifizierung */}
        <Card className="p-6 border-0 shadow-lg mb-8 bg-gradient-to-r from-green-50 to-emerald-50 print:shadow-none print:page-break-before">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Ist Ihr Kunde qualifiziert?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Monatliche Stromrechnung > 2.500€",
              "Motoren, Pumpen oder Verdichter im Dauerbetrieb",
              "Keine oder veraltete Blindstromkompensation",
              "Netzanbieter mit VDE-AR-N 4110 oder cos ϕ Anforderungen",
            ].map((criterion, i) => (
              <div key={i} className="flex items-start gap-3 bg-white p-4 rounded-lg border-l-4 border-l-green-500">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700">{criterion}</span>
              </div>
            ))}
          </div>
        </Card>
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
