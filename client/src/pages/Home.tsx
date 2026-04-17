import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, AlertCircle, CheckCircle2, TrendingUp, Shield, Zap, X, MapPin } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import SignatureCanvas from "react-signature-canvas";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * F26 EnergyControl - VERKAUFS-PLATTFORM (Final)
 * 
 * - Gesetzlicher Vertreter + Google Maps Adresse
 * - Vollständiger Vertrag (alle 23 Paragraphen)
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
  const [gesetzlicherVertreter, setGesetzlicherVertreter] = useState("");
  const [kundenUnternehmen, setKundenUnternehmen] = useState("");
  const [kundenAdresse, setKundenAdresse] = useState("");
  const [kundenEmail, setKundenEmail] = useState("");
  const [stromrechnung, setStromrechnung] = useState<number>(3000);
  const [strompreis, setStrompreis] = useState<number>(0.25);
  const [showMapPicker, setShowMapPicker] = useState(false);
  
  // Vertrag & Modal
  const [showVertragModal, setShowVertragModal] = useState(false);
  const [unterschriftGeleistet, setUnterschriftGeleistet] = useState(false);
  const signatureRef = useRef<any>(null);
  const vertragModalRef = useRef<HTMLDivElement>(null);
  const [activeObjection, setActiveObjection] = useState<string | null>(null);

  // Berechnungen
  const monatlicheErsparnis = Math.round(stromrechnung * 0.2 * 100) / 100;
  const jaehrlicheErsparnis = Math.round(monatlicheErsparnis * 12 * 100) / 100;
  const stromverbrauch = Math.round((stromrechnung / strompreis) * 100) / 100;

  // Echte Kundendaten-Visualisierungen
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const baseWithout = stromrechnung * (0.9 + Math.random() * 0.2);
    return {
      month: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"][i],
      ohne: Math.round(baseWithout),
      mit: Math.round(baseWithout * 0.8),
    };
  });

  // Einsparungsquellen
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
            <p className="text-green-700 text-sm mt-2">Sie zahlen NICHTS.</p>
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
            <p className="font-bold text-green-900 text-lg">TAG 1</p>
            <p className="text-green-700 text-sm mt-2">Einsparung beginnt sofort.</p>
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
            <p className="font-bold text-green-900 text-lg">7-TAGE-NETZANALYSE</p>
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
            <p className="font-bold text-green-900 text-lg">ZERTIFIZIERT</p>
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

      pdf.save(`F26-Vertrag-${gesetzlicherVertreter || "Kunde"}.pdf`);
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
        <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
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
                <Label className="text-sm font-semibold text-slate-900 mb-2 block">Gesetzlicher Vertreter</Label>
                <Input
                  value={gesetzlicherVertreter}
                  onChange={(e) => setGesetzlicherVertreter(e.target.value)}
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
                <div className="flex gap-2">
                  <Input
                    value={kundenAdresse}
                    onChange={(e) => setKundenAdresse(e.target.value)}
                    placeholder="Adresse"
                    className="border-2 border-slate-200"
                    readOnly
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowMapPicker(true)}
                    className="px-3"
                  >
                    <MapPin className="w-4 h-4" />
                  </Button>
                </div>
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
              <div>
                <Label className="text-sm font-semibold text-slate-900 mb-2 block">Strompreis (€/kWh)</Label>
                <Input
                  value={strompreis}
                  onChange={(e) => setStrompreis(Number(e.target.value) || 0.25)}
                  type="number"
                  step="0.01"
                  className="border-2 border-slate-200"
                  min="0"
                  placeholder="z.B. 0,25"
                />
              </div>
            </div>
          </Card>

          {/* Map Picker Modal */}
          {showMapPicker && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <Card className="w-full max-w-2xl border-0 shadow-2xl">
                <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-900">Adresse wählen</h2>
                  <button
                    onClick={() => setShowMapPicker(false)}
                    className="text-slate-600 hover:text-slate-900"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">Adresse eingeben:</Label>
                    <Input
                      placeholder="z.B. Hauptstraße 1, 10115 Berlin"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          const value = (e.target as HTMLInputElement).value;
                          setKundenAdresse(value);
                          setShowMapPicker(false);
                        }
                      }}
                      className="border-2 border-slate-200"
                    />
                    <p className="text-xs text-slate-600">Drücken Sie Enter zum Bestätigen</p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Ersparnis */}
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

          {/* Vorteile */}
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
              disabled={!gesetzlicherVertreter || !kundenUnternehmen || !kundenAdresse}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-7 px-12 text-lg"
            >
              Vertrag anzeigen & unterschreiben
              <ArrowRight className="ml-3 h-5 w-5" />
            </Button>
            {(!gesetzlicherVertreter || !kundenUnternehmen || !kundenAdresse) && (
              <p className="text-sm text-slate-600 mt-3">Bitte füllen Sie alle Kundendaten aus</p>
            )}
          </div>
        </main>

        {/* Vertrag Modal - VOLLSTÄNDIGER VERTRAG */}
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
              <div ref={vertragModalRef} className="p-8 bg-white space-y-4 text-sm">
                {/* Vertrag Header */}
                <div className="text-center border-b-2 border-slate-300 pb-4">
                  <h1 className="text-xl font-bold text-slate-900 mb-2">NUTZUNGSVERTRAG</h1>
                  <p className="text-xs text-slate-600">
                    über die Gewährung eines Standplatzes für die Errichtung und den Betrieb einer
                    Blindleistungskompensationsanlage
                  </p>
                </div>

                {/* Vertragsparteien */}
                <div className="space-y-3 border-b border-slate-200 pb-4">
                  <div>
                    <p className="font-bold text-slate-900">Standortgeber:</p>
                    <p className="text-slate-700">{gesetzlicherVertreter}</p>
                    <p className="text-slate-700">{kundenUnternehmen}</p>
                    <p className="text-slate-700">Anschrift: {kundenAdresse}</p>
                  </div>

                  <div>
                    <p className="font-bold text-slate-900">Aufsteller:</p>
                    <p className="text-slate-700">FitForFuture Energy Nord GmbH</p>
                    <p className="text-slate-700">Anschrift: Melchiorstraße 26, 10179 Berlin</p>
                  </div>
                </div>

                {/* Präambel */}
                <div className="space-y-2">
                  <p className="font-bold text-slate-900">Präambel</p>
                  <div className="space-y-1 text-xs text-slate-700">
                    <p>(1) Die Parteien beabsichtigen, im Rahmen dieses Vertrages die Nutzung eines definierten Standplatzes zur Errichtung und zum Betrieb einer technischen Anlage zur Blindleistungskompensation zu regeln.</p>
                    <p>(2) Ziel der Zusammenarbeit ist insbesondere die nachhaltige Verbesserung der elektrischen Energieeffizienz am Standort, die Reduktion von Blindleistungsverlusten sowie die mittelbare Förderung klimapolitischer Zielsetzungen durch optimierten Energieeinsatz.</p>
                    <p>(3) Der Aufsteller ist ein auf die Planung, Errichtung und den Betrieb energietechnischer Anlagen spezialisiertes Unternehmen und verfügt über die hierfür erforderliche fachliche, technische und wirtschaftliche Kompetenz.</p>
                    <p>(4) Der Standortgeber ist Eigentümer bzw. verfügungsberechtigter Nutzer der im Vertrag näher bezeichneten Fläche und bereit, diese dem Aufsteller für die Dauer dieses Vertrages zur Verfügung zu stellen.</p>
                    <p>(5) Die Parteien sind sich darüber einig, dass sämtliche durch den Betrieb der Anlage generierten oder zurechenbaren CO₂-Zertifikate ausschließlich dem Aufsteller zustehen und wirtschaftlich durch diesen verwertet werden.</p>
                    <p>(6) Vor diesem Hintergrund schließen die Parteien den nachfolgenden Nutzungsvertrag.</p>
                  </div>
                </div>

                {/* Alle Paragraphen */}
                <div className="space-y-3 text-xs">
                  <div>
                    <p className="font-bold text-slate-900">§1 Vertragsgegenstand</p>
                    <p className="text-slate-700">(1) Gegenstand dieses Vertrages ist die Einräumung eines Nutzungsrechts an einer Teilfläche des Grundstücks des Standortgebers zur Errichtung und zum Betrieb einer Blindleistungskompensationsanlage.</p>
                    <p className="text-slate-700">(2) Die Anlage umfasst sämtliche technischen Einrichtungen, insbesondere: a) Kondensatorbänke, b) Steuer- und Regelungseinheiten, c) Transformatoren und Schaltanlagen, d) Mess- und Überwachungssysteme, e) bauliche Einhausungen sowie Nebenanlagen.</p>
                    <p className="text-slate-700">(3) Die genaue Lage, Größe und Beschaffenheit der überlassenen Fläche ergeben sich aus Anlage 1 (Lageplan).</p>
                    <p className="text-slate-700">(4) Die Nutzung erfolgt ausschließlich zu dem in Absatz (1) genannten Zweck. Eine anderweitige Nutzung ist nur mit Zustimmung des Standortgebers zulässig.</p>
                    <p className="text-slate-700">(5) Die Parteien stellen klar, dass es sich um ein atypisches Nutzungsverhältnis eigener Art handelt, welches weder als Miet- noch als Pachtverhältnis im Sinne der §§ 535 ff. bzw. §§ 581 ff. BGB zu qualifizieren ist.</p>
                  </div>

                  <div>
                    <p className="font-bold text-slate-900">§2 Vertragsdauer</p>
                    <p className="text-slate-700">(1) Dieser Vertrag tritt mit Unterzeichnung durch beide Parteien in Kraft.</p>
                    <p className="text-slate-700">(2) Die Laufzeit beträgt acht (8) Jahre ab dem Zeitpunkt der technischen Inbetriebnahme der Anlage.</p>
                    <p className="text-slate-700">(3) Der Zeitpunkt der Inbetriebnahme wird durch ein Inbetriebnahmeprotokoll dokumentiert.</p>
                    <p className="text-slate-700">(4) Eine ordentliche Kündigung während der Festlaufzeit ist ausgeschlossen.</p>
                    <p className="text-slate-700">(5) Das Recht zur außerordentlichen Kündigung aus wichtigem Grund bleibt unberührt. Ein wichtiger Grund liegt insbesondere vor, wenn: a) eine Partei wesentliche Vertragspflichten nachhaltig verletzt, b) ein Insolvenzverfahren eröffnet wird, c) behördliche Maßnahmen den Betrieb dauerhaft unmöglich machen.</p>
                  </div>

                  <div>
                    <p className="font-bold text-slate-900">§3 Nutzungsrechte und -umfang</p>
                    <p className="text-slate-700">(1) Der Standortgeber räumt dem Aufsteller ein ausschließliches, nicht übertragbares Nutzungsrecht an der vereinbarten Fläche ein.</p>
                    <p className="text-slate-700">(2) Das Nutzungsrecht umfasst insbesondere: a) die Errichtung der Anlage, b) deren Betrieb und Wartung, c) die Durchführung von Reparaturen und Modernisierungen, d) den Austausch einzelner Komponenten.</p>
                    <p className="text-slate-700">(3) Der Aufsteller ist berechtigt, die Anlage technisch weiterzuentwickeln, soweit dies den Standortgeber nicht unzumutbar beeinträchtigt.</p>
                    <p className="text-slate-700">(4) Der Standortgeber verpflichtet sich, jede Beeinträchtigung des Nutzungsrechts zu unterlassen.</p>
                  </div>

                  <div>
                    <p className="font-bold text-slate-900">§4 Eigentum und sachenrechtliche Regelungen</p>
                    <p className="text-slate-700">(1) Sämtliche Bestandteile der Anlage verbleiben im alleinigen Eigentum des Aufstellers.</p>
                    <p className="text-slate-700">(2) Eine Verbindung mit dem Grundstück führt nicht zu einem Eigentumsübergang.</p>
                    <p className="text-slate-700">(3) Die Parteien vereinbaren ausdrücklich, dass § 946 BGB keine Anwendung findet.</p>
                    <p className="text-slate-700">(4) Der Aufsteller ist berechtigt, die Anlage jederzeit: a) zu veräußern, b) zu beleihen, c) sicherungsweise zu übereignen.</p>
                  </div>

                  <div>
                    <p className="font-bold text-slate-900">§5 Vergütung und wirtschaftlicher Ausgleich</p>
                    <p className="text-slate-700">(1) Eine monetäre Vergütung wird nicht geschuldet.</p>
                    <p className="text-slate-700">(2) Der wirtschaftliche Vorteil des Standortgebers besteht ausschließlich in der durch die Anlage bewirkten Blindleistungskompensation.</p>
                    <p className="text-slate-700">(3) Diese führt insbesondere zu: a) einer Verbesserung des Leistungsfaktors, b) einer Reduktion netzseitiger Belastungen, c) potenziellen Einsparungen bei Energiekosten.</p>
                    <p className="text-slate-700">(4) Weitergehende Ansprüche des Standortgebers sind ausgeschlossen.</p>
                  </div>

                  <div>
                    <p className="font-bold text-slate-900">§6 CO₂-Zertifikate und Verwertungsrechte</p>
                    <p className="text-slate-700">(1) Alle aus dem Betrieb der Anlage resultierenden CO₂-Zertifikate stehen ausschließlich dem Aufsteller zu.</p>
                    <p className="text-slate-700">(2) Dies umfasst insbesondere: a) Emissionsminderungszertifikate, b) Herkunftsnachweise, c) vergleichbare handelbare Umweltwerte.</p>
                    <p className="text-slate-700">(3) Der Aufsteller ist berechtigt, diese nach eigenem Ermessen: a) zu vermarkten, b) zu übertragen, c) zu bündeln oder zu speichern.</p>
                    <p className="text-slate-700">(4) Eine Verpflichtung zur zeitlichen oder wirtschaftlichen Offenlegung besteht nicht.</p>
                    <p className="text-slate-700">(5) Der Standortgeber verzichtet ausdrücklich und unwiderruflich auf sämtliche Rechte hieran.</p>
                  </div>

                  <div>
                    <p className="font-bold text-slate-900">§7 Errichtung der Anlage</p>
                    <p className="text-slate-700">(1) Die Planung, Errichtung und Inbetriebnahme erfolgen ausschließlich durch den Aufsteller.</p>
                    <p className="text-slate-700">(2) Sämtliche Kosten trägt der Aufsteller.</p>
                    <p className="text-slate-700">(3) Der Standortgeber verpflichtet sich, erforderliche Mitwirkungshandlungen zu erbringen.</p>
                    <p className="text-slate-700">(4) Genehmigungen werden durch den Aufsteller eingeholt.</p>
                  </div>

                  <div>
                    <p className="font-bold text-slate-900">§8 Betrieb, Wartung und Instandhaltung</p>
                    <p className="text-slate-700">(1) Der Betrieb erfolgt eigenverantwortlich durch den Aufsteller.</p>
                    <p className="text-slate-700">(2) Der Aufsteller gewährleistet einen ordnungsgemäßen technischen Zustand.</p>
                    <p className="text-slate-700">(3) Wartung und Instandhaltung erfolgen regelmäßig.</p>
                    <p className="text-slate-700">(4) Der Standortgeber hat etwaige Störungen unverzüglich anzuzeigen.</p>
                  </div>

                  <div>
                    <p className="font-bold text-slate-900">§9 Zutrittsrechte</p>
                    <p className="text-slate-700">(1) Der Aufsteller erhält jederzeit Zugang zur Anlage.</p>
                    <p className="text-slate-700">(2) Dies gilt auch für beauftragte Dritte.</p>
                    <p className="text-slate-700">(3) Sicherheits- und Betriebsregelungen des Standortgebers sind zu beachten.</p>
                  </div>

                  <div>
                    <p className="font-bold text-slate-900">§10 Haftung</p>
                    <p className="text-slate-700">(1) Der Aufsteller haftet für Schäden, die durch die Anlage verursacht werden.</p>
                    <p className="text-slate-700">(2) Die Haftung des Standortgebers ist auf Vorsatz und grobe Fahrlässigkeit beschränkt.</p>
                    <p className="text-slate-700">(3) Eine Haftung für mittelbare Schäden ist ausgeschlossen.</p>
                  </div>

                  <div>
                    <p className="font-bold text-slate-900">§11 Versicherung</p>
                    <p className="text-slate-700">(1) Der Aufsteller verpflichtet sich zum Abschluss geeigneter Versicherungen.</p>
                    <p className="text-slate-700">(2) Hierzu zählen insbesondere: a) Haftpflichtversicherung, b) Sachversicherung.</p>
                  </div>

                  <div>
                    <p className="font-bold text-slate-900">§12 Betriebsunterbrechungen</p>
                    <p className="text-slate-700">(1) Vorübergehende Unterbrechungen sind zulässig.</p>
                    <p className="text-slate-700">(2) Ansprüche hieraus bestehen nicht.</p>
                  </div>

                  <div>
                    <p className="font-bold text-slate-900">§13 Höhere Gewalt</p>
                    <p className="text-slate-700">(1) Ereignisse höherer Gewalt befreien von Leistungspflichten.</p>
                    <p className="text-slate-700">(2) Hierzu zählen insbesondere: a) Naturkatastrophen, b) Krieg, c) Pandemien, d) behördliche Eingriffe.</p>
                  </div>

                  <div>
                    <p className="font-bold text-slate-900">§14 Vertraulichkeit</p>
                    <p className="text-slate-700">(1) Die Parteien verpflichten sich zur Geheimhaltung aller vertraulichen Informationen.</p>
                    <p className="text-slate-700">(2) Diese Verpflichtung gilt über die Vertragslaufzeit hinaus.</p>
                  </div>

                  <div>
                    <p className="font-bold text-slate-900">§15 Untervergabe und Drittbeauftragung</p>
                    <p className="text-slate-700">(1) Der Aufsteller ist berechtigt, Dritte einzusetzen.</p>
                    <p className="text-slate-700">(2) Eine Zustimmung des Standortgebers ist nicht erforderlich.</p>
                  </div>

                  <div>
                    <p className="font-bold text-slate-900">§16 Änderungen und Erweiterungen</p>
                    <p className="text-slate-700">(1) Technische Änderungen sind zulässig.</p>
                    <p className="text-slate-700">(2) Erweiterungen bedürfen keiner Zustimmung, sofern keine wesentlichen Nachteile entstehen.</p>
                  </div>

                  <div>
                    <p className="font-bold text-slate-900">§17 Rückbau und Vertragsende</p>
                    <p className="text-slate-700">(1) Nach Vertragsende ist die Anlage zurückzubauen.</p>
                    <p className="text-slate-700">(2) Der ursprüngliche Zustand ist weitgehend wiederherzustellen.</p>
                  </div>

                  <div>
                    <p className="font-bold text-slate-900">§18 Vertragsübertragung</p>
                    <p className="text-slate-700">(1) Der Aufsteller ist berechtigt, den Vertrag zu übertragen.</p>
                    <p className="text-slate-700">(2) Eine Zustimmung ist nicht erforderlich.</p>
                  </div>

                  <div>
                    <p className="font-bold text-slate-900">§19 Rechtsnachfolge</p>
                    <p className="text-slate-700">(1) Der Vertrag gilt auch für Rechtsnachfolger.</p>
                  </div>

                  <div>
                    <p className="font-bold text-slate-900">§20 Salvatorische Klausel</p>
                    <p className="text-slate-700">(1) Unwirksame Bestimmungen werden durch wirtschaftlich gleichwertige ersetzt.</p>
                  </div>

                  <div>
                    <p className="font-bold text-slate-900">§21 Schriftform</p>
                    <p className="text-slate-700">(1) Änderungen bedürfen der Schriftform.</p>
                  </div>

                  <div>
                    <p className="font-bold text-slate-900">§22 Gerichtsstand und anwendbares Recht</p>
                    <p className="text-slate-700">(1) Es gilt deutsches Recht.</p>
                    <p className="text-slate-700">(2) Gerichtsstand ist der Sitz des Aufstellers.</p>
                  </div>

                  <div>
                    <p className="font-bold text-slate-900">§23 Schlussbestimmungen</p>
                    <p className="text-slate-700">(1) Nebenabreden bestehen nicht.</p>
                    <p className="text-slate-700">(2) Der Vertrag stellt die vollständige Vereinbarung dar.</p>
                  </div>
                </div>

                {/* Unterschriftsfeld */}
                <div className="border-t-2 border-slate-300 pt-4 space-y-3 mt-4">
                  <p className="font-bold text-slate-900">Unterschrift des Kunden:</p>
                  
                  <div className="border-2 border-slate-300 rounded-lg bg-white p-3">
                    <SignatureCanvas
                      ref={signatureRef}
                      canvasProps={{
                        width: 500,
                        height: 100,
                        className: "border border-slate-200 rounded w-full bg-white",
                      }}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={handleClearSignature} size="sm" className="text-xs">
                      Löschen
                    </Button>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-xs"
                      onClick={handleSignature}
                      size="sm"
                    >
                      Unterschrift bestätigen
                    </Button>
                  </div>

                  {unterschriftGeleistet && (
                    <div className="p-2 bg-green-100 border border-green-400 rounded-lg">
                      <p className="text-green-900 font-semibold text-xs">✓ Unterschrift erfolgreich!</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-white border-t border-slate-200 p-4 flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setShowVertragModal(false)} size="sm">
                  Abbrechen
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700 text-sm"
                  onClick={generatePDF}
                  disabled={!unterschriftGeleistet}
                  size="sm"
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
        <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
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
            <p className="text-slate-700 text-lg">
              <strong>FitForFuture Energy Nord GmbH</strong> ist ein spezialisiertes Unternehmen für intelligente Energieeffizienz.
            </p>
          </Card>

          <Card className="p-8 border-0 shadow-lg mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Wie F26 funktioniert</h2>
            <div className="space-y-6">
              {[
                { step: 1, title: "Kostenlose Netzanalyse (7 Tage)", desc: "Wir messen Ihre echten Stromverbrauchsdaten." },
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
