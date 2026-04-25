import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader, ArrowRight, CheckCircle2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface CalculatorFlowProps {
  checklisteAntworten: string[];
  berechnetesEinsparungspotenzial: number;
  onBack: () => void;
  onNext: () => void;
}

export function CalculatorFlow({
  checklisteAntworten,
  berechnetesEinsparungspotenzial,
  onBack,
  onNext,
}: CalculatorFlowProps) {
  const [inputMode, setInputMode] = useState<"schnell" | "genau">("schnell");
  const [stromrechnung, setStromrechnung] = useState<number>(3000);
  const [stromverbrauchKwh, setStromverbrauchKwh] = useState<number>(12000);
  const [strompreis, setStrompreis] = useState<number>(0.25);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [personalizedDescription, setPersonalizedDescription] = useState("");

  // Berechnungen
  const berechnetStromrechnung = inputMode === "schnell" ? stromrechnung : stromverbrauchKwh * strompreis;
  const monatlicheErsparnis = Math.round(berechnetStromrechnung * (berechnetesEinsparungspotenzial / 100));
  const jaehrlicheErsparnis = monatlicheErsparnis * 12;

  // Personalisierte Beschreibung generieren
  const generatePersonalizedDescription = () => {
    const hasPumpen = checklisteAntworten.includes("pumpen");
    const hasMotoren = checklisteAntworten.includes("motoren");
    const hasTransformatoren = checklisteAntworten.includes("transformatoren");
    const hasPV = checklisteAntworten.includes("pv");
    const has24h = checklisteAntworten.includes("24h");
    const hasDruckluft = checklisteAntworten.includes("druckluft");
    const hasKuehl = checklisteAntworten.includes("kuehl");

    let description = "Ihr Vorteil ist besonders hoch, weil ";
    const reasons: string[] = [];

    if (hasPumpen) {
      reasons.push("Sie Pumpen & Kompressoren verwenden, die große Blindleistung erzeugen");
    }
    if (hasMotoren) {
      reasons.push("Ihre Elektromotoren kontinuierlich Blindarbeit verursachen");
    }
    if (hasTransformatoren) {
      reasons.push("Transformatoren in Ihrer Anlage zusätzliche Verluste erzeugen");
    }
    if (hasPV) {
      reasons.push("Ihre PV-Anlage mit F26 optimal harmonisiert wird");
    }
    if (has24h) {
      reasons.push("Ihre Anlage 24/7 läuft und die Einsparungen sich täglich multiplizieren");
    }
    if (hasDruckluft) {
      reasons.push("Druckluftanlagen extrem ineffizient sind und F26 diese optimiert");
    }
    if (hasKuehl) {
      reasons.push("Kühlsysteme ständig Blindleistung benötigen");
    }

    if (reasons.length > 0) {
      description += reasons.join(" und ") + ".";
    } else {
      description += "F26 Ihre Stromqualität optimiert.";
    }

    description += ` Mit ${berechnetesEinsparungspotenzial}% Einsparung sparen Sie monatlich echtes Geld.`;

    return description;
  };

  // Berechnung starten
  const handleCalculate = async () => {
    setIsCalculating(true);
    
    // Simuliere Berechnung (2-3 Sekunden)
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    setPersonalizedDescription(generatePersonalizedDescription());
    setIsCalculating(false);
    setShowResults(true);
  };

  // Daten für Charts
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const seasonalFactor = 0.85 + (i % 3) * 0.05;
    const baseWithout = berechnetStromrechnung * seasonalFactor;
    return {
      month: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"][i],
      ohne: Math.round(baseWithout),
      mit: Math.round(baseWithout * (1 - berechnetesEinsparungspotenzial / 100)),
    };
  });

  const savingsData = [
    { name: "Blindarbeit-Wegfall", value: Math.round(berechnetesEinsparungspotenzial * 0.5), fill: "#10B981" },
    { name: "Leitungsverluste", value: Math.round(berechnetesEinsparungspotenzial * 0.3), fill: "#34D399" },
    { name: "Reaktive Leistung", value: Math.round(berechnetesEinsparungspotenzial * 0.2), fill: "#6EE7B7" },
  ];

  return (
    <div className="space-y-8">
      {/* PHASE 1: EINGABE-FENSTER */}
      {!showResults && !isCalculating && (
        <>
          {/* Stromkosten-Eingabe */}
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

          {/* Checklisten-Zusammenfassung */}
          <Card className="p-8 border-2 border-green-200 bg-green-50">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Ihre Auswahl</h3>
            <div className="flex flex-wrap gap-3">
              {checklisteAntworten.map(item => {
                const labels: Record<string, string> = {
                  motoren: "Elektromotoren",
                  pumpen: "Pumpen & Kompressoren",
                  transformatoren: "Transformatoren",
                  druckluft: "Druckluftanlagen",
                  kuehl: "Kühlsysteme",
                  pv: "PV-Anlage vorhanden",
                  "24h": "24/7 Betrieb",
                };
                return (
                  <div key={item} className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    ✓ {labels[item] || item}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Berechnen Button */}
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={handleCalculate}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg rounded-lg shadow-lg"
            >
              Berechnen <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              onClick={onBack}
              variant="outline"
              className="px-8 py-6 text-lg rounded-lg"
            >
              Zurück
            </Button>
          </div>
        </>
      )}

      {/* PHASE 2: LOADING-ANIMATION */}
      {isCalculating && (
        <Card className="p-12 text-center bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
          <div className="flex justify-center mb-6">
            <Loader className="w-16 h-16 text-green-600 animate-spin" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">Berechne deine Einsparungen...</h3>
          <p className="text-slate-600">Analysiere dein Profil und berechne dein Sparpotenzial basierend auf deinen Angaben.</p>
          <div className="mt-8 space-y-2">
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-600 rounded-full animate-pulse" style={{width: "75%"}}></div>
            </div>
            <p className="text-xs text-slate-600">Bitte warten...</p>
          </div>
        </Card>
      )}

      {/* PHASE 3: ERGEBNISSE + PERSONALISIERTE BESCHREIBUNG */}
      {showResults && (
        <>
          {/* Personalisierte Beschreibung */}
          <Card className="p-8 border-2 border-green-300 bg-green-50">
            <div className="flex gap-4">
              <CheckCircle2 className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Ihre Einsparung</h3>
                <p className="text-slate-700 leading-relaxed">{personalizedDescription}</p>
              </div>
            </div>
          </Card>

          {/* Ergebnisse */}
          <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-8">
            <div className="grid grid-cols-3 gap-8 text-center">
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

          {/* Navigation */}
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={() => setShowResults(false)}
              variant="outline"
              className="px-8 py-3"
            >
              ← Zurück zur Eingabe
            </Button>
            <Button 
              onClick={onNext}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
            >
              Weiter → Kontaktdaten
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
