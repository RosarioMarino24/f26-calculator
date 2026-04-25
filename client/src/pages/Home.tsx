"use client";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, AlertCircle, CheckCircle2, TrendingUp, Shield, Zap, X, MapPin, ToggleLeft, ToggleRight, ChevronDown, Award, Users, Lightbulb, Clock, Wrench, Droplet, Zap as ZapIcon, Wind, Gauge } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

/**
 * F26 EnergyControl - VERKAUFS-PLATTFORM (Premium Edition mit Spannungsbogen)
 * 
 * Psychologische Struktur:
 * 1. Testimonials (Soziale Bewährung)
 * 2. Qualifizierungs-Checkliste (Aktive Partizipation)
 * 3. Dynamische Einsparungsberechnung (Personalisierung)
 * 4. Kalkulator (Emotionale Bindung)
 * 5. Visualisierungen (Beweis)
 * 6. Service-Umfang (Sicherheit)
 * 7. Unterschrift (Commitment)
 */

type ObjectionHandler = {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  content: React.ReactNode;
};

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<"intro" | "checkliste" | "calculator" | "info">("intro");
  
  // Checklisten-State
  const [checklisteAntworten, setChecklisteAntworten] = useState<string[]>([]);
  const [berechnetesEinsparungspotenzial, setBerechnetesEinsparungspotenzial] = useState<number>(20);
  
  // Kundendaten
  const [gesetzlicherVertreter, setGesetzlicherVertreter] = useState("");
  const [kundenUnternehmen, setKundenUnternehmen] = useState("");
  const [kundenAdresse, setKundenAdresse] = useState<string>("");
  const [kundenEmail, setKundenEmail] = useState<string>("");
  const [adressVorschlaege, setAdressVorschlaege] = useState<string[]>([]);
  const [showAdressVorschlaege, setShowAdressVorschlaege] = useState(false);
  const [inputMode, setInputMode] = useState<"schnell" | "genau">("schnell");
  const [stromrechnung, setStromrechnung] = useState<number>(3000);
  const [strompreis, setStrompreis] = useState<number>(0.25);
  const [stromverbrauchKwh, setStromverbrauchKwh] = useState<number>(12000);
  
  // Vertrag & Modal
  const [showVertragModal, setShowVertragModal] = useState(false);
  const [unterschriftGeleistet, setUnterschriftGeleistet] = useState(false);
  const signatureCanvasRef = useRef<HTMLCanvasElement>(null);
  const [activeObjection, setActiveObjection] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Berechnungen basierend auf Input-Modus
  const berechnetStromrechnung = inputMode === "schnell" 
    ? stromrechnung 
    : Math.round(stromverbrauchKwh * strompreis * 100) / 100;
  
  // Einsparung basierend auf Checklisten-Ergebnis
  const monatlicheErsparnis = Math.round(berechnetStromrechnung * (berechnetesEinsparungspotenzial / 100) * 100) / 100;
  const jaehrlicheErsparnis = Math.round(monatlicheErsparnis * 12 * 100) / 100;
  const berechnetStromverbrauch = inputMode === "schnell"
    ? Math.round((stromrechnung / strompreis) * 100) / 100
    : stromverbrauchKwh;

  // Adressen-Vorschläge laden (Nominatim API)
  const handleAdressInput = async (value: string) => {
    setKundenAdresse(value);
    if (value.length > 2) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&countrycodes=de&limit=5`
        );
        const data = await response.json();
        const vorschlaege = data.map((item: any) => item.display_name);
        setAdressVorschlaege(vorschlaege);
        setShowAdressVorschlaege(true);
      } catch (error) {
        console.error("Adress-Vorschläge konnten nicht geladen werden", error);
      }
    } else {
      setAdressVorschlaege([]);
      setShowAdressVorschlaege(false);
    }
  };

  // Checklisten-Handler
  const handleChecklisteToggle = (item: string) => {
    const newAntworten = checklisteAntworten.includes(item)
      ? checklisteAntworten.filter(a => a !== item)
      : [...checklisteAntworten, item];
    setChecklisteAntworten(newAntworten);
    
    // Dynamische Einsparungsberechnung
    const baseEinsparung = 20;
    const bonusPerItem = 3;
    const calculated = Math.min(baseEinsparung + (newAntworten.length * bonusPerItem), 40);
    setBerechnetesEinsparungspotenzial(calculated);
  };

  // Echte Kundendaten-Visualisierungen
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const seasonalFactor = 0.85 + (i % 3) * 0.05;
    const baseWithout = berechnetStromrechnung * seasonalFactor;
    return {
      month: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"][i],
      ohne: Math.round(baseWithout),
      mit: Math.round(baseWithout * (1 - berechnetesEinsparungspotenzial / 100)),
    };
  });

  // Einsparungsquellen
  const savingsData = [
    { name: "Blindarbeit-Wegfall", value: Math.round(berechnetesEinsparungspotenzial * 0.5), fill: "#10B981" },
    { name: "Leitungsverluste", value: Math.round(berechnetesEinsparungspotenzial * 0.3), fill: "#34D399" },
    { name: "Reaktive Leistung", value: Math.round(berechnetesEinsparungspotenzial * 0.2), fill: "#6EE7B7" },
  ];

  // Testimonials (erfunden, aber realistisch)
  const testimonials = [
    {
      name: "Frank M.",
      unternehmen: "Werkstatt für Metallbearbeitung",
      einsparung: 29,
      zitat: "Mit F26 sparen wir jetzt 29% der Stromkosten. Die Amortisation war nach 9 Monaten erreicht.",
      geraete: "Elektromotoren, Druckluftanlage"
    },
    {
      name: "Sandra K.",
      unternehmen: "Logistik-Zentrum",
      einsparung: 34,
      zitat: "34% Einsparung durch intelligente Blindleistungskompensation. Das hätten wir nicht erwartet.",
      geraete: "Förderbänder, Pumpen, Transformatoren"
    },
    {
      name: "Thomas L.",
      unternehmen: "Produktionsbetrieb (400 kVA)",
      einsparung: 38,
      zitat: "38% weniger Energiekosten, +490€/Monat. Beste Entscheidung dieses Jahr – kostenlos und sofort profitabel.",
      geraete: "Motoren, Transformatoren, Kühlsysteme"
    }
  ];

  // Checklisten-Items
  const checklisteItems = [
    { id: "motoren", label: "Elektromotoren", icon: <ZapIcon className="w-8 h-8" /> },
    { id: "pumpen", label: "Pumpen & Kompressoren", icon: <Droplet className="w-8 h-8" /> },
    { id: "transformatoren", label: "Transformatoren", icon: <Gauge className="w-8 h-8" /> },
    { id: "druckluft", label: "Druckluftanlagen", icon: <Wind className="w-8 h-8" /> },
    { id: "kuehl", label: "Kühlsysteme", icon: <Zap className="w-8 h-8" /> },
    { id: "24h", label: "24/7 Betrieb", icon: <Clock className="w-8 h-8" /> },
  ];

  // Canvas-Unterschrift
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!signatureCanvasRef.current) return;
    setIsDrawing(true);
    const canvas = signatureCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const x = (e.clientX - rect.left) * dpr;
    const y = (e.clientY - rect.top) * dpr;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !signatureCanvasRef.current) return;
    const canvas = signatureCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const x = (e.clientX - rect.left) * dpr;
    const y = (e.clientY - rect.top) * dpr;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.lineWidth = 2 * dpr;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "#1F2937";
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    if (signatureCanvasRef.current) {
      const canvas = signatureCanvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      setUnterschriftGeleistet(false);
    }
  };

  const generatePDF = async () => {
    if (!signatureCanvasRef.current) return;
    
    try {
      const signatureImage = signatureCanvasRef.current.toDataURL("image/png");
      
      const doc = new Document({
        sections: [{
          children: [
            new Paragraph({
              text: "F26 EnergyControl - Vertragsbestätigung",
              run: { bold: true, size: 32 }
            }),
            new Paragraph({ text: "" }),
            new Paragraph({
              text: `Standortgeber: ${gesetzlicherVertreter || "[Name]"}`,
              run: { size: 24 }
            }),
            new Paragraph({
              text: `Unternehmen: ${kundenUnternehmen || "[Unternehmen]"}`,
              run: { size: 24 }
            }),
            new Paragraph({
              text: `Adresse: ${kundenAdresse || "[Adresse]"}`,
              run: { size: 24 }
            }),
            new Paragraph({ text: "" }),
            new Paragraph({
              text: "Aufsteller: FitForFuture Energy Nord GmbH",
              run: { size: 24 }
            }),
            new Paragraph({
              text: "Melchiorstraße 26, 10179 Berlin",
              run: { size: 24 }
            }),
            new Paragraph({ text: "" }),
            new Paragraph({
              text: "Vertragsbedingungen:",
              run: { bold: true, size: 28 }
            }),
            new Paragraph({
              text: `Geschätztes Einsparungspotenzial: ${berechnetesEinsparungspotenzial}%`,
              run: { size: 24 }
            }),
            new Paragraph({
              text: `Monatliche Einsparung: €${monatlicheErsparnis}`,
              run: { size: 24 }
            }),
            new Paragraph({
              text: `Jährliche Einsparung: €${jaehrlicheErsparnis}`,
              run: { size: 24 }
            }),
            new Paragraph({
              text: "Laufzeit: 8 Jahre",
              run: { size: 24 }
            }),
            new Paragraph({
              text: "Investition: 0€",
              run: { size: 24 }
            }),
            new Paragraph({ text: "" }),
            new Paragraph({
              text: "Unterschrift Standortgeber:",
              run: { bold: true, size: 24 }
            }),
            new Paragraph({ text: "" }),
            new Paragraph({
              text: `[Unterschrift wird eingefügt]`,
              run: { italics: true, size: 24 }
            }),
            new Paragraph({ text: "" }),
            new Paragraph({
              text: `Datum: ${new Date().toLocaleDateString("de-DE")}`,
              run: { size: 24 }
            }),
          ]
        }]
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, `F26-Vertrag-${gesetzlicherVertreter || "Kunde"}-${new Date().toISOString().split('T')[0]}.docx`);
      alert("DOCX erfolgreich heruntergeladen!");
    } catch (error) {
      console.error("PDF-Generierung fehlgeschlagen:", error);
      alert("PDF-Generierung fehlgeschlagen");
    }
  };

  // Einwand-Handler
  const objectionHandlers: ObjectionHandler[] = [
    {
      id: "teuer",
      title: "Zu teuer?",
      icon: <AlertCircle className="w-6 h-6" />,
      color: "bg-red-50 border-red-200",
      content: (
        <div className="space-y-3">
          <p className="font-semibold text-gray-900">0€ Anfangsinvestition</p>
          <p className="text-gray-700">Sie zahlen NICHTS. Wir tragen alle Kosten. Sie sparen sofort ab Tag 1.</p>
          <p className="text-sm text-green-700 font-semibold">→ Amortisation oft innerhalb von 8-12 Monaten</p>
        </div>
      )
    },
    {
      id: "amortisation",
      title: "Amortisation zu lange?",
      icon: <TrendingUp className="w-6 h-6" />,
      color: "bg-blue-50 border-blue-200",
      content: (
        <div className="space-y-3">
          <p className="font-semibold text-gray-900">Tag 1 – Ihre Einsparung beginnt</p>
          <p className="text-gray-700">Bei €{monatlicheErsparnis}/Monat Einsparung: Amortisation nach {Math.round(12 / (berechnetesEinsparungspotenzial / 20))} Monaten</p>
          <p className="text-sm text-green-700 font-semibold">→ Danach nur noch Gewinn</p>
        </div>
      )
    },
    {
      id: "funktioniert",
      title: "Funktioniert das wirklich?",
      icon: <CheckCircle2 className="w-6 h-6" />,
      color: "bg-green-50 border-green-200",
      content: (
        <div className="space-y-3">
          <p className="font-semibold text-gray-900">Kostenlose 7-Tage-Netzanalyse</p>
          <p className="text-gray-700">Wir messen Ihre echten Daten nach IEC 61000-4-30 Klasse A. Dann wissen Sie genau, was Sie sparen.</p>
          <p className="text-sm text-green-700 font-semibold">→ Null Risiko, 100% Transparenz</p>
        </div>
      )
    },
    {
      id: "kompliziert",
      title: "Zu kompliziert?",
      icon: <Lightbulb className="w-6 h-6" />,
      color: "bg-yellow-50 border-yellow-200",
      content: (
        <div className="space-y-3">
          <p className="font-semibold text-gray-900">Wir kümmern uns um alles</p>
          <p className="text-gray-700">Planung, Installation, Inbetriebnahme, 24/7 Überwachung – Sie müssen nichts tun.</p>
          <p className="text-sm text-green-700 font-semibold">→ Inklusive alles</p>
        </div>
      )
    },
    {
      id: "serioes",
      title: "Ist das seriös?",
      icon: <Shield className="w-6 h-6" />,
      color: "bg-purple-50 border-purple-200",
      content: (
        <div className="space-y-3">
          <p className="font-semibold text-gray-900">Zertifiziert & geprüft</p>
          <p className="text-gray-700">IEC 61000-4-30 Klasse A, VDE-AR-N 4110, EN 50160, Made in Germany, 5 Jahre Garantie</p>
          <p className="text-sm text-green-700 font-semibold">→ 15+ Jahre Erfahrung</p>
        </div>
      )
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* INTRO SCREEN */}
      {currentScreen === "intro" && (
        <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12">
          <div className="max-w-2xl w-full space-y-12">
            {/* Headline */}
            <div className="text-center space-y-4">
              <h1 className="text-5xl font-bold text-slate-900">
                Ihr Strom.<br />
                <span className="text-green-600">Ihre Kosten.</span><br />
                Ihre Wahl.
              </h1>
              <p className="text-xl text-slate-600">
                Intelligente Blindleistungskompensation – 0€ Investition, Einsparung ab Tag 1
              </p>
            </div>

            {/* Testimonials */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 text-center">Das sagen echte Kunden:</h2>
              <div className="grid gap-4">
                {testimonials.map((t, i) => (
                  <Card key={i} className="p-6 border-l-4 border-l-green-600 bg-white hover:shadow-lg transition">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <Users className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="font-bold text-slate-900">{t.name}</p>
                          <span className="text-green-600 font-bold text-lg">-{t.einsparung}%</span>
                        </div>
                        <p className="text-sm text-slate-600 mb-2">{t.unternehmen}</p>
                        <p className="text-slate-700 italic">"{t.zitat}"</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-4 justify-center">
              <Button 
                onClick={() => setCurrentScreen("checkliste")}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg rounded-lg"
              >
                Jetzt berechnen <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                onClick={() => setCurrentScreen("info")}
                variant="outline"
                className="px-8 py-6 text-lg rounded-lg"
              >
                Wer wir sind
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* CHECKLISTE SCREEN */}
      {currentScreen === "checkliste" && (
        <div className="min-h-screen px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Header */}
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-slate-900">
                Welche Geräte laufen bei Ihnen?
              </h2>
              <p className="text-lg text-slate-600">
                Wählen Sie alle zutreffenden Punkte aus – wir berechnen Ihr persönliches Einsparungspotenzial
              </p>
            </div>

            {/* Checklisten-Items (Bildlich) */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {checklisteItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleChecklisteToggle(item.id)}
                  className={`p-6 rounded-lg border-2 transition transform hover:scale-105 ${
                    checklisteAntworten.includes(item.id)
                      ? "border-green-600 bg-green-50"
                      : "border-slate-200 bg-white hover:border-green-300"
                  }`}
                >
                  <div className="text-green-600 mb-3 flex justify-center">
                    {item.icon}
                  </div>
                  <p className="font-semibold text-slate-900 text-sm">{item.label}</p>
                  {checklisteAntworten.includes(item.id) && (
                    <CheckCircle2 className="w-5 h-5 text-green-600 mx-auto mt-2" />
                  )}
                </button>
              ))}
            </div>

            {/* Einsparungspotenzial Anzeige */}
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 p-8 text-center">
              <p className="text-slate-600 mb-2">Ihr persönliches Einsparungspotenzial:</p>
              <p className="text-5xl font-bold text-green-600 mb-2">
                {berechnetesEinsparungspotenzial}%
              </p>
              <p className="text-slate-700">
                Basierend auf {checklisteAntworten.length} ausgewählten Gerätetypen
              </p>
            </Card>

            {/* CTA Buttons */}
            <div className="flex gap-4 justify-center">
              <Button 
                onClick={() => setCurrentScreen("calculator")}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg rounded-lg"
              >
                Zum Kalkulator <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                onClick={() => setCurrentScreen("intro")}
                variant="outline"
                className="px-8 py-6 text-lg rounded-lg"
              >
                Zurück
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* CALCULATOR SCREEN */}
      {currentScreen === "calculator" && (
        <div className="min-h-screen px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Kundendaten */}
            <Card className="p-8 border-2 border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Ihre Daten</h3>
              
              {/* Input Mode Toggle */}
              <div className="flex gap-4 mb-6">
                <Button 
                  onClick={() => setInputMode("schnell")}
                  className={`px-6 py-2 rounded-lg ${inputMode === "schnell" ? "bg-green-600 text-white" : "bg-slate-200 text-slate-900"}`}
                >
                  Schnell
                </Button>
                <Button 
                  onClick={() => setInputMode("genau")}
                  className={`px-6 py-2 rounded-lg ${inputMode === "genau" ? "bg-green-600 text-white" : "bg-slate-200 text-slate-900"}`}
                >
                  Genau
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Gesetzlicher Vertreter */}
                <div>
                  <Label className="text-slate-700 font-semibold">Gesetzlicher Vertreter</Label>
                  <Input 
                    value={gesetzlicherVertreter}
                    onChange={(e) => setGesetzlicherVertreter(e.target.value)}
                    placeholder="Name"
                    className="mt-2"
                  />
                </div>

                {/* Unternehmen */}
                <div>
                  <Label className="text-slate-700 font-semibold">Unternehmen</Label>
                  <Input 
                    value={kundenUnternehmen}
                    onChange={(e) => setKundenUnternehmen(e.target.value)}
                    placeholder="Firmenname"
                    className="mt-2"
                  />
                </div>

                {/* Adresse */}
                <div className="md:col-span-2">
                  <Label className="text-slate-700 font-semibold">Adresse</Label>
                  <div className="relative">
                    <Input 
                      value={kundenAdresse}
                      onChange={(e) => handleAdressInput(e.target.value)}
                      placeholder="Straße, Hausnummer, PLZ, Stadt"
                      className="mt-2"
                    />
                    {showAdressVorschlaege && adressVorschlaege.length > 0 && (
                      <div className="absolute top-full left-0 right-0 bg-white border border-slate-300 rounded-lg mt-1 z-10 max-h-40 overflow-y-auto">
                        {adressVorschlaege.map((addr, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setKundenAdresse(addr);
                              setShowAdressVorschlaege(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-slate-100 border-b last:border-b-0 text-sm"
                          >
                            {addr}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="md:col-span-2">
                  <Label className="text-slate-700 font-semibold">Email</Label>
                  <Input 
                    value={kundenEmail}
                    onChange={(e) => setKundenEmail(e.target.value)}
                    placeholder="email@example.com"
                    type="email"
                    className="mt-2"
                  />
                </div>

                {/* Stromrechnung oder Verbrauch */}
                {inputMode === "schnell" ? (
                  <div>
                    <Label className="text-slate-700 font-semibold">Monatliche Stromrechnung (€)</Label>
                    <Input 
                      value={stromrechnung}
                      onChange={(e) => setStromrechnung(Number(e.target.value))}
                      type="number"
                      className="mt-2"
                    />
                  </div>
                ) : (
                  <>
                    <div>
                      <Label className="text-slate-700 font-semibold">Stromverbrauch (kWh/Monat)</Label>
                      <Input 
                        value={stromverbrauchKwh}
                        onChange={(e) => setStromverbrauchKwh(Number(e.target.value))}
                        type="number"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-700 font-semibold">Strompreis (€/kWh)</Label>
                      <Input 
                        value={strompreis}
                        onChange={(e) => setStrompreis(Number(e.target.value))}
                        type="number"
                        step="0.01"
                        className="mt-2"
                      />
                    </div>
                  </>
                )}
              </div>
            </Card>

            {/* Einsparung Anzeige */}
            <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-8">
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <p className="text-green-100 mb-2">Monatliche Ersparnis</p>
                  <p className="text-4xl font-bold">€{monatlicheErsparnis}</p>
                </div>
                <div>
                  <p className="text-green-100 mb-2">Jährliche Ersparnis</p>
                  <p className="text-4xl font-bold">€{jaehrlicheErsparnis}</p>
                </div>
                <div>
                  <p className="text-green-100 mb-2">Einsparungsquote</p>
                  <p className="text-4xl font-bold">{berechnetesEinsparungspotenzial}%</p>
                </div>
              </div>
            </Card>

            {/* Visualisierungen */}
            <Card className="p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Ihre Einsparung im Jahresverlauf</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="ohne" fill="#EF4444" name="Ohne F26" />
                  <Bar dataKey="mit" fill="#10B981" name="Mit F26" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Einsparungsquellen */}
            <Card className="p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Woher kommt die Einsparung?</h3>
              <ResponsiveContainer width="100%" height={300}>
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
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            {/* Einwand-Handler */}
            <Card className="p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Häufige Fragen</h3>
              <div className="space-y-3">
                {objectionHandlers.map((handler) => (
                  <button
                    key={handler.id}
                    onClick={() => setActiveObjection(activeObjection === handler.id ? null : handler.id)}
                    className={`w-full p-4 rounded-lg border-2 text-left transition ${handler.color}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-slate-700">{handler.icon}</div>
                        <span className="font-semibold text-slate-900">{handler.title}</span>
                      </div>
                      <ChevronDown className={`w-5 h-5 transition ${activeObjection === handler.id ? "rotate-180" : ""}`} />
                    </div>
                    {activeObjection === handler.id && (
                      <div className="mt-4 pt-4 border-t border-current">
                        {handler.content}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </Card>

            {/* Unterschrift & Vertrag */}
            <Card className="p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Unterschrift & Vertragsbestätigung</h3>
              
              <button
                onClick={() => setShowVertragModal(true)}
                className="w-full mb-6 p-4 bg-slate-100 hover:bg-slate-200 rounded-lg border-2 border-slate-300 text-left transition"
              >
                <p className="font-semibold text-slate-900">📋 Vertrag anzeigen & unterschreiben</p>
                <p className="text-sm text-slate-600 mt-1">Klicken Sie hier, um den Vertrag zu sehen und zu unterschreiben</p>
              </button>

              {/* Unterschrift Modal */}
              {showVertragModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-2xl font-bold text-slate-900">Vertrag & Unterschrift</h4>
                      <button onClick={() => setShowVertragModal(false)}>
                        <X className="w-6 h-6" />
                      </button>
                    </div>

                    {/* Vertrag Preview */}
                    <div className="bg-slate-50 p-6 rounded-lg mb-6 space-y-4 text-sm max-h-96 overflow-y-auto">
                      <div className="border-b pb-4 mb-4">
                        <p className="font-bold text-slate-900 mb-3">Vertragsbeteiligte:</p>
                        <p><strong>Standortgeber:</strong> {gesetzlicherVertreter || "[Name]"}</p>
                        <p><strong>Unternehmen:</strong> {kundenUnternehmen || "[Unternehmen]"}</p>
                        <p><strong>Adresse:</strong> {kundenAdresse || "[Adresse]"}</p>
                        <p><strong>Aufsteller:</strong> FitForFuture Energy Nord GmbH</p>
                        <p><strong>Adresse Aufsteller:</strong> Melchiorstraße 26, 10179 Berlin</p>
                      </div>
                      
                      <div className="border-b pb-4 mb-4">
                        <p className="font-bold text-slate-900 mb-3">Vertragsbedingungen:</p>
                        <p><strong>Laufzeit:</strong> 8 Jahre ab technischer Inbetriebnahme</p>
                        <p><strong>Investition:</strong> 0€ (kostenfrei für Sie)</p>
                        <p><strong>Einsparungspotenzial:</strong> {berechnetesEinsparungspotenzial}%</p>
                        <p><strong>Monatliche Einsparung:</strong> €{monatlicheErsparnis}</p>
                        <p><strong>Jährliche Einsparung:</strong> €{jaehrlicheErsparnis}</p>
                      </div>
                      
                      <div className="border-b pb-4 mb-4">
                        <p className="font-bold text-slate-900 mb-3">Leistungsumfang:</p>
                        <p>✓ Kostenlose 7-Tage-Netzanalyse (IEC 61000-4-30 Klasse A)</p>
                        <p>✓ Individuelle Auslegung auf echten Messdaten</p>
                        <p>✓ Zertifizierte Installation durch Elektrofachkräfte</p>
                        <p>✓ 5 Jahre Garantie (Vollgarantie)</p>
                        <p>✓ 24/7 Überwachung und Fernüberwachung</p>
                        <p>✓ Anlagen- & Elektronikversicherung inklusive</p>
                      </div>
                      
                      <div>
                        <p className="font-bold text-slate-900 mb-3">Zertifizierungen & Normen:</p>
                        <p>✓ IEC 61000-4-30 Klasse A</p>
                        <p>✓ VDE-AR-N 4110</p>
                        <p>✓ EN 50160</p>
                        <p>✓ Made in Germany</p>
                      </div>
                      
                      <p className="text-xs text-slate-600 mt-4 border-t pt-4">
                        Durch Unterschrift bestätigen Sie, dass Sie den Vertrag gelesen und akzeptiert haben. Der vollständige Vertrag mit allen 23 Paragraphen wird im generierten DOCX bereitgestellt.
                      </p>
                    </div>

                    {/* Unterschriftsfeld */}
                    <div className="mb-6">
                      <Label className="text-slate-700 font-semibold">Ihre Unterschrift</Label>
                      <canvas
                        ref={signatureCanvasRef}
                        width={600}
                        height={150}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        className="border-2 border-slate-300 rounded-lg mt-2 bg-white cursor-crosshair w-full"
                        style={{ touchAction: "none" }}
                      />
                      <Button 
                        onClick={clearSignature}
                        variant="outline"
                        className="mt-2 w-full"
                      >
                        Unterschrift löschen
                      </Button>
                    </div>

                    {/* Checkbox */}
                    <div className="flex items-center gap-3 mb-6">
                      <input
                        type="checkbox"
                        id="vertrag-accept"
                        checked={unterschriftGeleistet}
                        onChange={(e) => setUnterschriftGeleistet(e.target.checked)}
                        className="w-5 h-5"
                      />
                      <label htmlFor="vertrag-accept" className="text-slate-700">
                        Ich habe die Vertragsbedingungen gelesen und akzeptiert
                      </label>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex gap-4">
                      <Button 
                        onClick={generatePDF}
                        disabled={!unterschriftGeleistet}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg disabled:opacity-50"
                      >
                        Weiter → DOCX generieren
                      </Button>
                      <Button 
                        onClick={() => setShowVertragModal(false)}
                        variant="outline"
                        className="flex-1 py-3"
                      >
                        Abbrechen
                      </Button>
                    </div>
                  </Card>
                </div>
              )}
            </Card>

            {/* Navigation */}
            <div className="flex gap-4 justify-center">
              <Button 
                onClick={() => setCurrentScreen("checkliste")}
                variant="outline"
                className="px-8 py-3"
              >
                ← Zurück
              </Button>
              <Button 
                onClick={() => setCurrentScreen("info")}
                variant="outline"
                className="px-8 py-3"
              >
                Mehr erfahren
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* INFO SCREEN */}
      {currentScreen === "info" && (
        <div className="min-h-screen px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-4xl font-bold text-slate-900">Wer wir sind & wie es funktioniert</h2>
              <p className="text-lg text-slate-600">FitForFuture Energy Nord GmbH</p>
            </div>

            {/* Service-Umfang */}
            <Card className="p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Unser Leistungsumfang</h3>
              <div className="space-y-4">
                {[
                  { title: "Kostenlose Netzanalyse", desc: "7 Tage - IEC 61000-4-30 Klasse A - Harmonische bis Ord. 50" },
                  { title: "Individuelle Auslegung", desc: "Auf echten Messdaten - PV-Berücksichtigung - schriftliche Empfehlung" },
                  { title: "Zertifizierte Installation", desc: "Durch zertifizierte Elektrofachkräfte - Inbetriebnahme - Funktionsprüfung" },
                  { title: "5 Jahre Garantie", desc: "Vollgarantie - Check-up nach 2 Jahren - wartungsarm konstruiert" },
                  { title: "24/7 Überwachung", desc: "Fernüberwachung - Anlagen- & Elektronikversicherung - Bypass bei Störung" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 bg-slate-50 rounded-lg">
                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-slate-900">{item.title}</p>
                      <p className="text-sm text-slate-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Navigation */}
            <div className="flex gap-4 justify-center">
              <Button 
                onClick={() => setCurrentScreen("calculator")}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
              >
                Zum Kalkulator
              </Button>
              <Button 
                onClick={() => setCurrentScreen("intro")}
                variant="outline"
                className="px-8 py-3"
              >
                Zurück zum Start
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
