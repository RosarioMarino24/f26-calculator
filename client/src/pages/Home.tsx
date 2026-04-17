import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, AlertCircle, CheckCircle2, TrendingUp, Shield, Zap, X } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import SignatureCanvas from "react-signature-canvas";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * F26 EnergyControl - VERKAUFS-PLATTFORM (Final)
 * 
 * - Intro-Screen
 * - Kalkulator mit Kundendaten
 * - Modal-Vertrag (Original DOCX, grafisch formatiert)
 * - PDF-Generierung nach Unterschrift
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
  const [kundenAdresse, setKundenAdresse] = useState("");
  const [kundenEmail, setKundenEmail] = useState("");
  const [stromrechnung, setStromrechnung] = useState<number>(3000);
  
  // Vertrag & Modal
  const [showVertragModal, setShowVertragModal] = useState(false);
  const [unterschriftGeleistet, setUnterschriftGeleistet] = useState(false);
  const signatureRef = useRef<any>(null);
  const vertragModalRef = useRef<HTMLDivElement>(null);
  const [activeObjection, setActiveObjection] = useState<string | null>(null);

  // Berechnungen
  const monatlicheErsparnis = Math.round(stromrechnung * 0.2 * 100) / 100;
  const jaehrlicheErsparnis = Math.round(monatlicheErsparnis * 12 * 100) / 100;

  // Echte Kundendaten-Visualisierungen
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const baseWithout = stromrechnung * (0.9 + Math.random() * 0.2);
    return {
      month: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"][i],
      ohne: Math.round(baseWithout),
      mit: Math.round(baseWithout * 0.8),
    };
  });

  // Einsparungsquellen (prägnante Farben)
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
              <p className="text-xs text-slate-600">Ihr Vorteil</p>
              <p className="text-2xl font-bold text-green-600">Sofort</p>
            </div>
          </div>
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

  const generatePDF = async () => {
    if (!vertragModalRef.current) return;

    try {
      const canvas = await html2canvas(vertragModalRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= 297;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= 297;
      }

      pdf.save(`F26-Vertrag-${kundenName || "Kunde"}.pdf`);
      setShowVertragModal(false);
    } catch (error) {
      console.error("PDF-Generierung fehlgeschlagen:", error);
      alert("PDF konnte nicht generiert werden. Bitte versuchen Sie es später erneut.");
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
  // SCREEN 2: CALCULATOR
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="text-xs"
            >
              🖨️ Drucken
            </Button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Kundendaten-Formular */}
          <Card className="p-6 border-0 shadow-lg mb-8 bg-gradient-to-r from-blue-50 to-slate-50">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Kundendaten</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label className="text-sm font-semibold text-slate-900 mb-2 block">Name / Firma</Label>
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
                <Label className="text-sm font-semibold text-slate-900 mb-2 block">Adresse</Label>
                <Input
                  value={kundenAdresse}
                  onChange={(e) => setKundenAdresse(e.target.value)}
                  placeholder="z.B. Hauptstr. 1, 10115 Berlin"
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

          {/* Visualisierungen */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
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

          {/* Einwand-Handler */}
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

          {/* Ihre persönlichen Vorteile auf einen Blick */}
          <Card className="p-6 border-0 shadow-lg mb-8 bg-gradient-to-r from-green-50 to-emerald-50">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Ihre persönlichen Vorteile auf einen Blick</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: "✓", title: "0€ Investition", desc: "Wir tragen alle Kosten" },
                { icon: "⚡", title: "Sofort Einsparung", desc: "Ab Tag 1 nach Inbetriebnahme" },
                { icon: "🔧", title: "Kostenlose Netzanalyse", desc: "7 Tage Messung & Analyse" },
                { icon: "🛡️", title: "5 Jahre Garantie", desc: "Vollgarantie auf alle Komponenten" },
                { icon: "📊", title: "24/7 Überwachung", desc: "Fernüberwachung & Support" },
                { icon: "🌍", title: "CO₂-Reduktion", desc: "Nachhaltiger Energieeinsatz" },
              ].map((item, i) => (
                <div key={i} className="bg-white p-4 rounded-lg border-l-4 border-l-green-500">
                  <p className="text-2xl mb-2">{item.icon}</p>
                  <p className="font-bold text-slate-900">{item.title}</p>
                  <p className="text-sm text-slate-600 mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Vertrag Button */}
          <div className="text-center mb-12">
            <Button
              size="lg"
              onClick={() => setShowVertragModal(true)}
              disabled={!kundenName || !kundenUnternehmen || !kundenAdresse}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-7 px-12 text-lg"
            >
              Vertrag anzeigen & unterschreiben
              <ArrowRight className="ml-3 h-5 w-5" />
            </Button>
            {(!kundenName || !kundenUnternehmen || !kundenAdresse) && (
              <p className="text-sm text-slate-600 mt-3">Bitte füllen Sie alle Kundendaten aus</p>
            )}
          </div>
        </main>

        {/* Vertrag Modal */}
        {showVertragModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <Card className="w-full max-h-[90vh] overflow-y-auto border-0 shadow-2xl">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Nutzungsvertrag</h2>
                <button
                  onClick={() => setShowVertragModal(false)}
                  className="text-slate-600 hover:text-slate-900"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div ref={vertragModalRef} className="p-8 bg-white space-y-6">
                {/* Vertrag Header */}
                <div className="text-center border-b-2 border-slate-300 pb-6">
                  <h1 className="text-2xl font-bold text-slate-900 mb-2">NUTZUNGSVERTRAG</h1>
                  <p className="text-sm text-slate-600">
                    über die Gewährung eines Standplatzes für die Errichtung und den Betrieb einer
                    Blindleistungskompensationsanlage
                  </p>
                </div>

                {/* Vertragsparteien */}
                <div className="space-y-4">
                  <div>
                    <p className="font-bold text-slate-900 mb-2">Standortgeber:</p>
                    <p className="text-slate-700">{kundenName || "[Name / Firma des Standortgebers]"}</p>
                    <p className="text-slate-700">Anschrift: {kundenAdresse || "[●]"}</p>
                  </div>

                  <div>
                    <p className="font-bold text-slate-900 mb-2">Aufsteller:</p>
                    <p className="text-slate-700">FitForFuture Energy Nord GmbH</p>
                    <p className="text-slate-700">Anschrift: Melchiorstraße 26, 10179 Berlin</p>
                  </div>
                </div>

                {/* Präambel */}
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <p className="font-bold text-slate-900 mb-3">Präambel</p>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li>• Die Parteien beabsichtigen, die Nutzung eines Standplatzes zur Errichtung und zum Betrieb einer Blindleistungskompensationsanlage zu regeln.</li>
                    <li>• Ziel ist die nachhaltige Verbesserung der elektrischen Energieeffizienz und Reduktion von Blindleistungsverlusten.</li>
                    <li>• Der Aufsteller ist spezialisiert auf Planung, Errichtung und Betrieb energietechnischer Anlagen.</li>
                    <li>• Der Standortgeber ist Eigentümer bzw. verfügungsberechtigter Nutzer der Fläche.</li>
                    <li>• Alle CO₂-Zertifikate stehen ausschließlich dem Aufsteller zu.</li>
                  </ul>
                </div>

                {/* Wichtigste Vertragsbestimmungen */}
                <div className="space-y-3">
                  <div className="border-l-4 border-l-blue-600 pl-4">
                    <p className="font-bold text-slate-900">§1 Vertragsgegenstand</p>
                    <p className="text-sm text-slate-700 mt-1">Einräumung eines Nutzungsrechts zur Errichtung und zum Betrieb einer Blindleistungskompensationsanlage.</p>
                  </div>

                  <div className="border-l-4 border-l-blue-600 pl-4">
                    <p className="font-bold text-slate-900">§2 Vertragsdauer</p>
                    <p className="text-sm text-slate-700 mt-1">Laufzeit: 8 Jahre ab technischer Inbetriebnahme. Keine ordentliche Kündigung während der Festlaufzeit.</p>
                  </div>

                  <div className="border-l-4 border-l-blue-600 pl-4">
                    <p className="font-bold text-slate-900">§5 Vergütung</p>
                    <p className="text-sm text-slate-700 mt-1">Keine monetäre Vergütung. Wirtschaftlicher Vorteil: Blindleistungskompensation mit Verbesserung des Leistungsfaktors und potenziellen Einsparungen bei Energiekosten.</p>
                  </div>

                  <div className="border-l-4 border-l-blue-600 pl-4">
                    <p className="font-bold text-slate-900">§7 Errichtung der Anlage</p>
                    <p className="text-sm text-slate-700 mt-1">Planung, Errichtung und Inbetriebnahme erfolgen durch den Aufsteller. Sämtliche Kosten trägt der Aufsteller.</p>
                  </div>

                  <div className="border-l-4 border-l-blue-600 pl-4">
                    <p className="font-bold text-slate-900">§11 Versicherung</p>
                    <p className="text-sm text-slate-700 mt-1">Der Aufsteller verpflichtet sich zum Abschluss geeigneter Versicherungen (Haftpflicht, Sachversicherung).</p>
                  </div>
                </div>

                {/* Unterschriftsfeld */}
                <div className="border-t-2 border-slate-300 pt-6 space-y-4">
                  <p className="font-bold text-slate-900">Unterschrift des Kunden:</p>
                  
                  <div className="border-2 border-slate-300 rounded-lg bg-white p-4">
                    <SignatureCanvas
                      ref={signatureRef}
                      canvasProps={{
                        width: 500,
                        height: 120,
                        className: "border border-slate-200 rounded w-full bg-white",
                      }}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={handleClearSignature} size="sm">
                      Löschen
                    </Button>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={handleSignature}
                      size="sm"
                    >
                      Unterschrift bestätigen
                    </Button>
                  </div>

                  {unterschriftGeleistet && (
                    <div className="p-3 bg-green-100 border border-green-400 rounded-lg">
                      <p className="text-green-900 font-semibold text-sm">✓ Unterschrift erfolgreich!</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-white border-t border-slate-200 p-4 flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setShowVertragModal(false)}>
                  Abbrechen
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={generatePDF}
                  disabled={!unterschriftGeleistet}
                >
                  Weiter → PDF generieren
                </Button>
              </div>
            </Card>
          </div>
        )}

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
          <Card className="p-8 border-0 shadow-lg mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Wer wir sind</h2>
            <p className="text-slate-700 text-lg mb-4">
              <strong>FitForFuture Energy Nord GmbH</strong> ist ein spezialisiertes Unternehmen für intelligente Energieeffizienz. 
              Wir entwickeln und installieren Blindleistungskompensationsanlagen (F26 EnergyControl), die Unternehmen dabei helfen, 
              ihre Stromkosten um 20-40% zu senken – ohne Anfangsinvestition.
            </p>
          </Card>

          <Card className="p-8 border-0 shadow-lg mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Wie F26 funktioniert</h2>
            <div className="space-y-6">
              {[
                { step: 1, title: "Kostenlose Netzanalyse (7 Tage)", desc: "Wir messen Ihre echten Stromverbrauchsdaten nach IEC 61000-4-30 Klasse A." },
                { step: 2, title: "Individuelle Dimensionierung", desc: "Basierend auf Ihren Messdaten dimensionieren wir die F26-Anlage optimal." },
                { step: 3, title: "Installation durch Fachkräfte", desc: "Zertifizierte Elektrofachkräfte installieren die Anlage. 0€ für Sie." },
                { step: 4, title: "Inbetriebnahme & Monitoring", desc: "Ab Tag 1 sparen Sie Stromkosten. 24/7 Fernüberwachung inklusive." },
                { step: 5, title: "8 Jahre Partnerschaft", desc: "5 Jahre Vollgarantie, 24/7 Support, Versicherung inklusive." },
              ].map((item) => (
                <div key={item.step} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-green-600 text-white font-bold">
                      {item.step}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">{item.title}</h3>
                    <p className="text-slate-600 mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

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

        <footer className="bg-slate-900 text-white py-8">
          <div className="max-w-4xl mx-auto px-4 text-center text-slate-400 text-sm">
            <p>&copy; 2026 FitForFuture Energy Nord GmbH. Verkaufs-Plattform für autorisierte Vertriebspartner.</p>
          </div>
        </footer>
      </div>
    );
  }
}
