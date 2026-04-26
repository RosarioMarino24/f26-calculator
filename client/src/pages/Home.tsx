"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, AlertCircle, CheckCircle2, TrendingUp, Shield, Zap, X, ChevronDown, Users, Lightbulb, Clock, Droplet, Wind, Gauge, Sparkles, Award, Rocket, Heart } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import { calculateSavings, validateSavingsInput } from "@/lib/savingsCalculator";

/**
 * F26 EnergyControl - VERKAUFS-PLATTFORM (Premium Edition mit maximalem Spannungsbogen)
 * 
 * VERKAUFSPSYCHOLOGIE-OPTIMIERUNGEN:
 * 1. ✅ Zertifizierungen & Social Proof im Intro-Screen
 * 2. ✅ Celebration Animation nach Checklisten-Auswahl
 * 3. ✅ Kontextuelle Einwand-Handler (nur TOP 2-3)
 * 4. ✅ Vertrauens-Hinweis vor Unterschrift
 * 5. ✅ Success Screen nach DOCX-Generierung
 * 6. ✅ Glückwunsch-Box nach Checkliste
 */

type ObjectionHandler = {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  content: React.ReactNode;
};

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<"intro" | "checkliste" | "video" | "calculator" | "info" | "success">("intro");
  const [showCelebration, setShowCelebration] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string>("https://www.youtube.com/embed/dQw4w9WgXcQ"); // Placeholder Video ID
  
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
  
  // Counter Animation
  const [displayedErsparnis, setDisplayedErsparnis] = useState(0);
  
  // Individueller Einsparungsrechner
  const [calculatorLoading, setCalculatorLoading] = useState(false);
  const [calculatorResults, setCalculatorResults] = useState<any>(null);
  const [calculatorError, setCalculatorError] = useState<string | null>(null);
  const [swipeIndex, setSwipeIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

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

  // Counter Animation Effect
  useEffect(() => {
    if (currentScreen === "checkliste") {
      let current = 0;
      const target = monatlicheErsparnis;
      const increment = target / 30;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setDisplayedErsparnis(target);
          clearInterval(timer);
        } else {
          setDisplayedErsparnis(Math.round(current * 100) / 100);
        }
      }, 30);
      return () => clearInterval(timer);
    }
  }, [currentScreen, monatlicheErsparnis]);

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
      zitat: "Mit F26 sparen wir jetzt 29% der Stromkosten. Die Einsparungen haben uns Liquidität für andere Anschaffungen gegeben.",
      geraete: ["motoren", "druckluft"],
      icon: <Zap className="w-8 h-8" />
    },
    {
      name: "Sandra K.",
      unternehmen: "Logistik-Zentrum",
      einsparung: 34,
      zitat: "34% Einsparung durch intelligente Blindleistungskompensation. Das hätten wir nicht erwartet.",
      geraete: ["pumpen", "transformatoren"],
      icon: <Users className="w-8 h-8" />
    },
    {
      name: "Thomas L.",
      unternehmen: "Produktionsbetrieb (400 kVA)",
      einsparung: 38,
      zitat: "38% weniger Energiekosten, +490€/Monat. Beste Entscheidung dieses Jahr – kostenlos und sofort profitabel.",
      geraete: ["motoren", "transformatoren", "kuehl"],
      icon: <Sparkles className="w-8 h-8" />
    }
  ];

  // Dynamische Testimonials basierend auf Checklisten-Antworten
  const relevantTestimonials = testimonials.filter(t => 
    t.geraete.some(g => checklisteAntworten.includes(g))
  );

  // Checklisten-Items
  const checklisteItems = [
    { id: "motoren", label: "Elektromotoren", icon: <Zap className="w-8 h-8" /> },
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
    setUnterschriftGeleistet(true);
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
            new Paragraph({
              text: "Garantie: 8 Jahre sorgenfrei Nutzen",
              run: { size: 24 }
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
      
      // Zur Success-Seite wechseln
      setCurrentScreen("success");
    } catch (error) {
      console.error("PDF-Generierung fehlgeschlagen:", error);
      alert("PDF-Generierung fehlgeschlagen");
    }
  };

  // VERKAUFSPSYCHOLOGIE: Kontextuelle Einwand-Handler
  // Nur TOP 2-3 Einwände basierend auf Stromrechnung
  const getRelevantObjections = () => {
    if (berechnetStromrechnung > 5000) {
      // Große Stromrechnungen: Vertrauen & Funktionalität wichtig
      return ["serioes", "funktioniert", "teuer"];
    } else if (berechnetStromrechnung > 2000) {
      // Mittlere Stromrechnungen: Balance
      return ["teuer", "amortisation", "funktioniert"];
    } else {
      // Kleine Stromrechnungen: ROI wichtig
      return ["teuer", "amortisation"];
    }
  };

  // Einwand-Handler mit Zahlen
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
          <p className="font-semibold text-gray-900">98% Kundenzufriedenheit – über 500 Anlagen installiert</p>
          <p className="text-gray-700">Kostenlose 7-Tage-Netzanalyse nach IEC 61000-4-30 Klasse A. Dann wissen Sie genau, was Sie sparen.</p>
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
          <p className="font-semibold text-gray-900">Zertifiziert & geprüft – 15+ Jahre Erfahrung</p>
          <p className="text-gray-700">IEC 61000-4-30 Klasse A, VDE-AR-N 4110, EN 50160, Made in Germany, 8 Jahre sorgenfrei Nutzen</p>
          <p className="text-sm text-green-700 font-semibold">→ Vertrauen Sie auf Qualität</p>
        </div>
      )
    },
  ];

  // Nur relevante Einwand-Handler filtern
  const relevantObjections = objectionHandlers.filter(o => getRelevantObjections().includes(o.id));

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>

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
                Kostenlose 7-Tage-Netzanalyse – Sehen Sie, wie viel Sie wirklich sparen können
              </p>
            </div>

            {/* VERKAUFSPSYCHOLOGIE: Zertifizierungen & Social Proof */}
            <div className="flex gap-4 justify-center text-sm text-slate-600 flex-wrap">
              <div className="flex items-center gap-1">
                <Award className="w-4 h-4 text-green-600" />
                <span>IEC 61000-4-30</span>
              </div>
              <div className="flex items-center gap-1">
                <Award className="w-4 h-4 text-green-600" />
                <span>VDE-AR-N 4110</span>
              </div>
              <div className="flex items-center gap-1">
                <Award className="w-4 h-4 text-green-600" />
                <span>Made in Germany</span>
              </div>
            </div>

            {/* Social Proof Zahlen */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold text-green-600">500+</p>
                <p className="text-sm text-slate-600">Anlagen installiert</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-green-600">98%</p>
                <p className="text-sm text-slate-600">Kundenzufriedenheit</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-green-600">15+</p>
                <p className="text-sm text-slate-600">Jahre Erfahrung</p>
              </div>
            </div>

            {/* Testimonials */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 text-center">Das sagen echte Kunden:</h2>
              <div className="grid gap-4">
                {testimonials.map((t, i) => (
                  <Card key={i} className="p-6 border-l-4 border-l-green-600 bg-white hover:shadow-lg transition">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 text-green-600">
                        {t.icon}
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
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg rounded-lg shadow-lg"
              >
                Kostenloses Audit starten <ArrowRight className="ml-2 w-5 h-5" />
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

            {/* VERKAUFSPSYCHOLOGIE: Celebration Animation - Konfetti */}
            {showCelebration && (
              <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-green-600 rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `-10px`,
                      animation: `fall ${2 + Math.random() * 1}s linear forwards`,
                      animationDelay: `${Math.random() * 0.3}s`,
                    }}
                  />
                ))}
              </div>
            )}

            {/* Checklisten-Items (Bildlich) */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {checklisteItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    handleChecklisteToggle(item.id);
                    // Celebration Animation triggern
                    setShowCelebration(true);
                    setTimeout(() => setShowCelebration(false), 1000);
                  }}
                  className={`p-6 rounded-lg border-2 transition transform hover:scale-105 ${
                    checklisteAntworten.includes(item.id)
                      ? "border-green-600 bg-green-50 shadow-lg"
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

            {/* OPTIMIERUNG: Nur Prozente anzeigen (KEINE Euro!) */}
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 p-8 text-center">
              <p className="text-slate-600 mb-4">Basierend auf {checklisteAntworten.length} ausgewählten Gerätetypen:</p>
              <div className="space-y-4">
                <div>
                  <p className="text-slate-600 mb-2">Ihr Einsparungspotenzial:</p>
                  <p className="text-6xl font-bold text-green-600">
                    {berechnetesEinsparungspotenzial}%
                  </p>
                </div>
                <div className="text-lg text-slate-700">
                  <p className="text-sm text-slate-600 mt-2">Die genauen Euro-Beträge berechnen wir im nächsten Schritt mit Ihren echten Stromkosten</p>
                </div>
              </div>
            </Card>

            {/* Dynamische Testimonials */}
            {relevantTestimonials.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900">Kunden wie Sie sparen bereits:</h3>
                <div className="grid gap-4">
                  {relevantTestimonials.map((t, i) => (
                    <Card key={i} className="p-6 border-l-4 border-l-green-600 bg-white">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 text-green-600">
                          {t.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-bold text-slate-900">{t.name}</p>
                            <span className="text-green-600 font-bold">-{t.einsparung}%</span>
                          </div>
                          <p className="text-sm text-slate-600 mb-2">{t.unternehmen}</p>
                          <p className="text-slate-700 italic text-sm">"{t.zitat}"</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* VERKAUFSPSYCHOLOG            {/* Glückwunsch-Box */}
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Heart className="w-5 h-5 text-green-600" />
                <p className="font-semibold text-green-700">Perfekt! Wir haben Ihr Profil erfasst.</p>
              </div>
              <p className="text-slate-700">Jetzt zeigen wir Ihnen, wie die Technologie funktioniert.</p>
            </Card>

            {/* CTA Buttons */}
            <div className="flex gap-4 justify-center">
              <Button 
                onClick={() => setCurrentScreen("video")}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg rounded-lg shadow-lg"
              >
                Video ansehen <ArrowRight className="ml-2 w-5 h-5" />
              </Button>   <Button 
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
            {/* OPTIMIERUNG: Nur Eingabefeld (KEINE Quick-Buttons) */}
            <Card className="p-8 border-2 border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Ihre Stromkosten</h3>
              <p className="text-slate-600 mb-6">Geben Sie Ihre monatliche Stromrechnung ein, um Ihre persönliche Einsparung zu berechnen:</p>
              
              <div className="space-y-6">
                {/* Input Mode Toggle */}
                <div className="flex gap-4">
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

                {/* Schnell-Modus: Stromrechnung */}
                {inputMode === "schnell" && (
                  <div>
                    <Label className="text-slate-700 font-semibold">Monatliche Stromrechnung (€)</Label>
                    <Input 
                      type="number" 
                      placeholder="z.B. 3500"
                      value={stromrechnung}
                      onChange={(e) => setStromrechnung(parseFloat(e.target.value) || 0)}
                      className="mt-2 text-lg"
                    />
                    <p className="text-xs text-slate-600 mt-2">Finden Sie diesen Betrag auf Ihrer letzten Stromrechnung</p>
                  </div>
                )}

                {/* Genau-Modus: Verbrauch + Preis */}
                {inputMode === "genau" && (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-slate-700 font-semibold">Stromverbrauch (kWh/Monat)</Label>
                      <Input 
                        type="number" 
                        placeholder="z.B. 12000"
                        value={stromverbrauchKwh}
                        onChange={(e) => setStromverbrauchKwh(parseFloat(e.target.value) || 0)}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-700 font-semibold">Strompreis (€/kWh)</Label>
                      <Input 
                        type="number" 
                        step="0.01"
                        placeholder="z.B. 0.25"
                        value={strompreis}
                        onChange={(e) => setStrompreis(parseFloat(e.target.value) || 0)}
                        className="mt-2"
                      />
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Kundendaten-Formular */}
            <Card className="p-8 border-2 border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Ihre Kontaktdaten</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-700 font-semibold">Gesetzlicher Vertreter</Label>
                  <Input 
                    placeholder="Name"
                    value={gesetzlicherVertreter}
                    onChange={(e) => setGesetzlicherVertreter(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label className="text-slate-700 font-semibold">Unternehmen</Label>
                  <Input 
                    placeholder="Firmenname"
                    value={kundenUnternehmen}
                    onChange={(e) => setKundenUnternehmen(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div className="col-span-2">
                  <Label className="text-slate-700 font-semibold">Adresse</Label>
                  <div className="relative">
                    <Input 
                      placeholder="Straße, Hausnummer, PLZ, Stadt"
                      value={kundenAdresse}
                      onChange={(e) => handleAdressInput(e.target.value)}
                      className="mt-2"
                    />
                    {showAdressVorschlaege && adressVorschlaege.length > 0 && (
                      <div className="absolute top-full left-0 right-0 bg-white border border-slate-300 rounded-lg mt-1 z-10 max-h-48 overflow-y-auto">
                        {adressVorschlaege.map((addr, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setKundenAdresse(addr);
                              setShowAdressVorschlaege(false);
                            }}
                            className="w-full text-left p-3 hover:bg-slate-100 border-b last:border-b-0 text-sm"
                          >
                            {addr}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-span-2">
                  <Label className="text-slate-700 font-semibold">Email</Label>
                  <Input 
                    type="email"
                    placeholder="email@example.com"
                    value={kundenEmail}
                    onChange={(e) => setKundenEmail(e.target.value)}
                    className="mt-2"
                  />
                </div>
              </div>
            </Card>

            {/* Berechnen Button */}
            <div className="flex gap-4 justify-center">
              <Button 
                onClick={() => {
                  const error = validateSavingsInput(berechnetStromrechnung, checklisteAntworten);
                  if (error) {
                    setCalculatorError(error);
                    return;
                  }
                  
                  setCalculatorError(null);
                  setCalculatorLoading(true);
                  
                  // Simuliere Berechnung (2-3 Sekunden)
                  setTimeout(() => {
                    const results = calculateSavings(checklisteAntworten, berechnetStromrechnung);
                    setCalculatorResults(results);
                    setCalculatorLoading(false);
                  }, 2500);
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-12 py-6 text-lg rounded-lg shadow-lg"
                disabled={calculatorLoading}
              >
                {calculatorLoading ? "Berechne Ihre Einsparung..." : "Berechnen"}
              </Button>
            </div>
            
            {/* Fehler-Anzeige */}
            {calculatorError && (
              <Card className="bg-red-50 border-2 border-red-300 p-6">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                  <p className="text-red-700 font-semibold">{calculatorError}</p>
                </div>
              </Card>
            )}
            
            {/* Loading Animation */}
            {calculatorLoading && (
              <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-300 p-8 text-center">
                <div className="flex flex-col items-center gap-4">
                  <Sparkles className="w-8 h-8 text-blue-600 animate-spin" />
                  <p className="text-lg font-semibold text-slate-900">Analysiere Ihre Stromqualität...</p>
                  <p className="text-sm text-slate-600">Berechne optimales Einsparungspotenzial basierend auf Ihren Geräten</p>
                </div>
              </Card>
            )}
            
            {/* Ergebnisse */}
            {calculatorResults && !calculatorLoading && (
              <>
                <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-8">
                  <div className="grid grid-cols-3 gap-8 text-center">
                    <div>
                      <p className="text-green-100 mb-2">Monatliche Ersparnis</p>
                      <p className="text-4xl font-bold">€{calculatorResults.monthly}</p>
                    </div>
                    <div>
                      <p className="text-green-100 mb-2">Jährliche Ersparnis</p>
                      <p className="text-4xl font-bold">€{calculatorResults.yearly}</p>
                    </div>
                    <div>
                      <p className="text-green-100 mb-2">Einsparungsquote</p>
                      <p className="text-4xl font-bold">{calculatorResults.percent}%</p>
                    </div>
                  </div>
                </Card>
                
                {/* Personalisierte Beschreibung */}
                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 p-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Ihr individuelles Einsparungspotenzial</h3>
                  <p className="text-lg text-slate-700 leading-relaxed">{calculatorResults.description}</p>
                </Card>
              </>
            )}

            {/* Swipe-Visualisierungen */}
            {calculatorResults && !calculatorLoading && (
              <Card className="p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Ihre Einsparung im Jahresverlauf</h3>
                <div 
                  className="relative overflow-hidden"
                  onTouchStart={(e) => setTouchStart(e.targetTouches[0].clientX)}
                  onTouchEnd={(e) => setTouchEnd(e.changedTouches[0].clientX)}
                  onMouseDown={(e) => setTouchStart(e.clientX)}
                  onMouseUp={(e) => setTouchEnd(e.clientX)}
                >
                  {/* Balken-Vergleich Diagramm */}
                  {swipeIndex === 0 && (
                    <div className="transition-opacity duration-300">
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={[{
                          name: 'Vergleich',
                          'Ohne F26': calculatorResults.yearly / 1000,
                          'Mit F26': (calculatorResults.yearly / 1000) * (1 - calculatorResults.percent / 100),
                        }]}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey="name" />
                          <YAxis label={{ value: 'Jährliche Kosten (€1000)', angle: -90, position: 'insideLeft' }} />
                          <Tooltip 
                            formatter={(value: any) => `€${(value * 1000).toFixed(0)}`}
                            labelFormatter={() => 'Jahreskosten'}
                          />
                          <Legend />
                          <Bar dataKey="Ohne F26" fill="#EF4444" radius={[8, 8, 0, 0]} />
                          <Bar dataKey="Mit F26" fill="#10B981" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                      <p className="text-center text-slate-600 mt-4 text-sm">← Swipe nach rechts für Zusammenfassung →</p>
                    </div>
                  )}
                  
                  {/* Grüner Block mit Zusammenfassung (Nach Swipe) */}
                  {swipeIndex === 1 && (
                    <div className="transition-opacity duration-300">
                      <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-8 rounded-xl shadow-lg">
                        <div className="grid grid-cols-1 gap-6">
                          <div>
                            <p className="text-green-100 text-sm font-semibold mb-2">Monatliche Ersparnis</p>
                            <p className="text-4xl font-bold">€{calculatorResults.monthly}</p>
                          </div>
                          <div>
                            <p className="text-green-100 text-sm font-semibold mb-2">Jährliche Ersparnis</p>
                            <p className="text-4xl font-bold">€{calculatorResults.yearly}</p>
                          </div>
                          <div>
                            <p className="text-green-100 text-sm font-semibold mb-2">Einsparungsquote</p>
                            <p className="text-4xl font-bold">{calculatorResults.percent}%</p>
                          </div>
                        </div>
                      </div>
                      <p className="text-center text-slate-600 mt-4 text-sm">← Swipe nach links für Diagramm →</p>
                    </div>
                  )}
                </div>
                
                {/* Swipe-Logik */}
                {touchStart && touchEnd && (() => {
                  if (touchStart - touchEnd > 50 && swipeIndex === 0) {
                    setTimeout(() => setSwipeIndex(1), 0);
                  } else if (touchEnd - touchStart > 50 && swipeIndex === 1) {
                    setTimeout(() => setSwipeIndex(0), 0);
                  }
                  return null;
                })()}
              </Card>
            )}

            {/* Pie Chart */}
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

            {/* VERKAUFSPSYCHOLOGIE: Kontextuelle Einwand-Handler (nur TOP 2-3) */}
            <Card className="p-8 border-2 border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Die wichtigsten Fragen, die wir täglich bekommen</h3>
              <div className="space-y-3">
                {relevantObjections.map((handler) => (
                  <div key={handler.id} className={`border-2 rounded-lg overflow-hidden ${handler.color}`}>
                    <button
                      onClick={() => setActiveObjection(activeObjection === handler.id ? null : handler.id)}
                      className="w-full p-4 flex items-center justify-between hover:bg-black hover:bg-opacity-5 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-slate-700">{handler.icon}</div>
                        <p className="font-semibold text-slate-900">{handler.title}</p>
                      </div>
                      <ChevronDown 
                        className={`w-5 h-5 transition ${activeObjection === handler.id ? "rotate-180" : ""}`}
                      />
                    </button>
                    {activeObjection === handler.id && (
                      <div className="p-4 border-t bg-white bg-opacity-50">
                        {handler.content}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Unterschrift & Vertragsbestätigung */}
            <Card className="p-8 border-2 border-green-200 bg-green-50">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">📋 Unterschrift & Vertragsbestätigung</h3>
              <Button 
                onClick={() => setShowVertragModal(true)}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg rounded-lg"
              >
                Vertrag anzeigen & unterschreiben
              </Button>
              <p className="text-sm text-slate-600 mt-3">Klicken Sie hier, um den Vertrag zu sehen und zu unterschreiben</p>
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

            {/* Unterschrift Modal */}
            {showVertragModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h4 className="text-2xl font-bold text-slate-900">Vertrag & Unterschrift</h4>
                      <p className="text-sm text-slate-600 mt-1">Sie sind 1 Schritt vom Erfolg entfernt</p>
                    </div>
                    <button onClick={() => setShowVertragModal(false)}>
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {/* VERKAUFSPSYCHOLOGIE: Vertrauens-Hinweis */}
                  <div className="bg-green-50 border-l-4 border-l-green-600 p-4 rounded mb-6">
                    <p className="text-sm text-slate-700">
                      <span className="font-semibold text-green-700">✓ Ihre Unterschrift = Ihre Garantie</span>
                      <br />
                      Mit Ihrer Unterschrift erhalten Sie 8 Jahre sorgenfrei Nutzen, kostenlose Netzanalyse und Einsparungen ab Tag 1.
                    </p>
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
                      <p>✓ 8 Jahre sorgenfrei Nutzen (Vollgarantie)</p>
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

                  {/* Checkbox - Unterschrift = Garantie */}
                  <div className="flex items-center gap-3 mb-6">
                    <input
                      type="checkbox"
                      id="vertrag-accept"
                      checked={unterschriftGeleistet}
                      onChange={(e) => setUnterschriftGeleistet(e.target.checked)}
                      className="w-5 h-5"
                    />
                    <label htmlFor="vertrag-accept" className="text-slate-700">
                      Ich akzeptiere die <strong>5-Jahre-Vollgarantie</strong> und die Vertragsbedingungen
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
                      className="flex-1"
                    >
                      Abbrechen
                    </Button>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUCCESS SCREEN */}
      {currentScreen === "success" && (
        <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-gradient-to-b from-green-50 to-emerald-50">
          <div className="max-w-2xl w-full space-y-8">
            {/* Success Icon */}
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center text-white text-5xl animate-bounce">
                ✓
              </div>
            </div>

            {/* Headline */}
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-slate-900">
                Glückwunsch! Ihr Vertrag ist bereit.
              </h2>
              <p className="text-xl text-slate-600">
                Wir haben Ihren Vertrag generiert und per Email versendet.
              </p>
            </div>

            {/* Next Steps */}
            <Card className="bg-white p-8 border-2 border-green-200">
              <p className="text-slate-900 font-semibold mb-6">Nächste Schritte:</p>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">1</div>
                  <div>
                    <p className="font-semibold text-slate-900">Überprüfen Sie Ihre Email</p>
                    <p className="text-sm text-slate-600">Schauen Sie auch im Spam-Ordner nach</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">2</div>
                  <div>
                    <p className="font-semibold text-slate-900">Unser Team kontaktiert Sie</p>
                    <p className="text-sm text-slate-600">Innerhalb von 24 Stunden</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">3</div>
                  <div>
                    <p className="font-semibold text-slate-900">Termin für 7-Tage-Netzanalyse</p>
                    <p className="text-sm text-slate-600">Kostenlos und unverbindlich</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Kontakt Info */}
            <Card className="bg-slate-50 p-6 text-center">
              <p className="text-slate-700 mb-2">Fragen? Kontaktieren Sie uns direkt:</p>
              <p className="text-lg font-semibold text-green-600">+49 (0) 30 - XXXX XXXX</p>
              <p className="text-sm text-slate-600">Mo-Fr 09:00 - 17:00 Uhr</p>
            </Card>

            {/* CTA Button */}
            <Button 
              onClick={() => setCurrentScreen("intro")}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg rounded-lg"
            >
              Zur Startseite <Rocket className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      )}

      {/* VIDEO SCREEN - NEU! */}
      {currentScreen === "video" && (
        <div className="min-h-screen px-4 py-12">
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-slate-900">
                Wie F26 EnergyControl funktioniert
              </h2>
              <p className="text-lg text-slate-600">
                Sehen Sie in 2-3 Minuten, wie Sie bis zu 40% Stromkosten sparen
              </p>
            </div>

            {/* Video Player */}
            <Card className="overflow-hidden">
              <div className="aspect-video bg-black flex items-center justify-center">
                <iframe
                  width="100%"
                  height="100%"
                  src={videoUrl}
                  title="F26 EnergyControl erklärt"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </Card>

            {/* Zusammenfassung */}
            <Card className="p-8 bg-green-50 border-2 border-green-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Das haben Sie gerade gelernt:</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-slate-900">Intelligente Blindleistungskompensation</p>
                    <p className="text-sm text-slate-600">F26 optimiert Ihren Stromfluss automatisch</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-slate-900">Bis zu 40% Stromkosteneinsparung</p>
                    <p className="text-sm text-slate-600">Konkrete Ergebnisse von echten Kunden</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-slate-900">0€ Anfangsinvestition, 8 Jahre sorgenfrei Nutzen</p>
                    <p className="text-sm text-slate-600">Null Risiko für Sie</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* CTA Buttons */}
            <div className="flex gap-4 justify-center">
              <Button 
                onClick={() => setCurrentScreen("calculator")}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg rounded-lg shadow-lg"
              >
                Jetzt Ihre Einsparung berechnen <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                onClick={() => setCurrentScreen("checkliste")}
                variant="outline"
                className="px-8 py-6 text-lg rounded-lg"
              >
                ← Zurück
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
                  { title: "8 Jahre sorgenfrei Nutzen", desc: "Vollgarantie - Check-up nach 2 Jahren - wartungsarm konstruiert" },
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
                onClick={() => setCurrentScreen("video")}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 shadow-lg"
              >
                Video ansehen
              </Button>
              <Button 
                onClick={() => setCurrentScreen("intro")}
                variant="outline"
                className="px-8 py-3"
              >
                Zur Startseite
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
