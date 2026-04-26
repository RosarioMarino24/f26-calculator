/**
 * Einsparungsrechner für F26 EnergyControl
 * Basierend auf Blindleistungskompensation und Geräte-Auswahl
 * 
 * Technische Grundlage:
 * - cos φ (Leistungsfaktor) Optimierung
 * - Blindleistungsgebühren-Reduktion (10-40% der Stromrechnung)
 * - Leitungsverluste-Reduktion (2-5%)
 * - Gesamteinsparung: 15-40% (realistisch)
 */

export interface SavingsResult {
  percent: number;           // Einsparungsprozentsatz (z.B. 26)
  monthly: number;           // Monatliche Einsparung in Euro
  yearly: number;            // Jährliche Einsparung in Euro
  description: string;       // Personalisierte Beschreibung
}

/**
 * Berechnet die Einsparung basierend auf:
 * 1. Ausgewählten Geräte-Typen (Checklisten-Auswahl)
 * 2. Monatlicher Stromrechnung
 */
export function calculateSavings(
  selectedDevices: string[],
  monthlyBill: number
): SavingsResult {
  // Basis-Einsparung: 15%
  const baseSavings = 0.15;

  // Multiplikatoren pro Gerät-Typ
  // Basierend auf Blindleistungsanteil und Häufigkeit
  const multipliers: Record<string, number> = {
    pumpen: 1.3,           // Sehr hohe Blindleistung
    motoren: 1.2,          // Hohe Blindleistung
    transformatoren: 1.1,  // Mittelhohe Blindleistung
    druckluft: 1.2,        // Hohe Blindleistung, zyklisch
    kuehl: 1.15,           // Hohe Blindleistung, kontinuierlich
    pv: 1.15,              // Verbessert cos φ, reduziert Netzbelastung
    "24h": 1.1             // Kontinuierliche Einsparungen multiplizieren sich
  };

  // Berechne Gesamtmultiplikator
  let multiplier = 1;
  selectedDevices.forEach((device) => {
    const normalizedDevice = device.toLowerCase().replace(/\s+/g, "");
    if (multipliers[normalizedDevice]) {
      multiplier *= multipliers[normalizedDevice];
    }
  });

  // Berechne Einsparungsprozentsatz
  let savingsPercent = baseSavings * multiplier;

  // Obergrenze: 40% (realistisches Maximum)
  savingsPercent = Math.min(savingsPercent, 0.4);

  // Berechne Euro-Beträge
  const monthlySavings = Math.round(monthlyBill * savingsPercent);
  const yearlySavings = Math.round(monthlySavings * 12);

  // Generiere personalisierte Beschreibung
  const description = generateDescription(selectedDevices, Math.round(savingsPercent * 100));

  return {
    percent: Math.round(savingsPercent * 100),
    monthly: monthlySavings,
    yearly: yearlySavings,
    description: description
  };
}

/**
 * Generiert eine personalisierte Beschreibung basierend auf Geräte-Auswahl
 */
function generateDescription(selectedDevices: string[], percent: number): string {
  const devices = selectedDevices.map(d => d.toLowerCase().replace(/\s+/g, ""));
  let description = "";

  // Basis-Beschreibung basierend auf Geräte-Kombination
  if (devices.includes("pumpen") && devices.includes("motoren")) {
    description = "Ihr Vorteil ist SEHR hoch, weil Sie sowohl Pumpen als auch Elektromotoren verwenden. Diese Kombination erzeugt maximale Blindleistung, die F26 optimal kompensiert.";
  } else if (devices.includes("pumpen")) {
    description = "Ihr Vorteil ist besonders hoch, weil Sie Pumpen verwenden. Pumpen haben einen sehr hohen Blindleistungsanteil, den F26 effizient reduziert.";
  } else if (devices.includes("motoren")) {
    description = "Ihr Vorteil ist hoch, weil Elektromotoren einen hohen Blindleistungsanteil erzeugen. F26 optimiert Ihren Leistungsfaktor automatisch.";
  } else if (devices.includes("druckluft")) {
    description = "Ihr Vorteil ist hoch, weil Druckluftanlagen intensive Blindleistung erzeugen. F26 reduziert diese gezielt.";
  } else if (devices.includes("kuehl")) {
    description = "Ihr Vorteil ist hoch, weil Kühlsysteme kontinuierlich Blindleistung verursachen. F26 optimiert Ihren Betrieb rund um die Uhr.";
  } else {
    description = "Ihr Einsparungspotenzial ist signifikant. F26 optimiert Ihre Stromqualität und reduziert Blindleistungsgebühren.";
  }

  // Zusatz für PV-Anlage
  if (devices.includes("pv")) {
    description += " Zusätzlich verbessert Ihre PV-Anlage die Stromqualität erheblich und reduziert die Netzbelastung.";
  }

  // Zusatz für 24/7 Betrieb
  if (devices.includes("24h")) {
    description += " Da Sie 24/7 im Betrieb sind, multiplizieren sich die Einsparungen kontinuierlich über alle Schichten.";
  }

  // Zusatz für hohe Einsparungen
  if (percent >= 35) {
    description += " Mit " + percent + "% Einsparungspotenzial gehören Sie zu den Top-Kandidaten für F26.";
  } else if (percent >= 25) {
    description += " Mit " + percent + "% Einsparungspotenzial amortisiert sich F26 besonders schnell.";
  }

  return description;
}

/**
 * Validiert die Eingaben
 */
export function validateSavingsInput(monthlyBill: number, selectedDevices: string[]): string | null {
  if (monthlyBill <= 0) {
    return "Bitte geben Sie eine gültige Stromrechnung ein (> 0 €)";
  }
  if (monthlyBill > 1000000) {
    return "Die Stromrechnung scheint zu hoch zu sein. Bitte überprüfen Sie Ihre Eingabe.";
  }
  if (selectedDevices.length === 0) {
    return "Bitte wählen Sie mindestens ein Gerät aus.";
  }
  return null;
}
