import Vue from "vue";

const TECK2NAME_MAP: Map<string, string> = new Map([
  ["8181C78203FF", "Hersteller-Identifikation"],
  ["8181C78205FF", "öffentlicher Schlüssel"],
  ["810000090B00", "Sekundenindex"], //  second index from meter
  ["0100000009FF", "Geräteeinzelidentifikation"],
  ["0100000000FF", "Identifikationsnummer 1.0 ServerId -> Seriennummer"],
  ["0000600100FF", "Identifikationsnummer 2.1 Seriennummer"],
  ["0000601000FF", "Geraetename"],
  ["0000616100FF", "Fehlerregister"],
  ["0100010800FF", "Zaehlerstand Totalregister"],
  ["0100010801FF", "Zaehlerstand Tarif 1"],
  ["0100010802FF", "Zaehlerstand Tarif 2"],
  ["0100100700FF", "aktuelle Wirkleistung"],
  ["0100011100FF", "letzter signierter Total-Zaehlerstand"],
  ["0100240700FF", "Wirkleistung L1"],
  ["0100380700FF", "Wirkleistung L2"],
  ["01004C0700FF", "Wirkleistung L3"],
  ["010060320002", "Aktuelle Chiptemperatur"],
  ["010060320003", "Minimale Chiptemperatur"],
  ["010060320004", "Maximale Chiptemperatur"],
  ["010060320005", "Gemittelte Chiptemperatur"],
  ["010060320303", "Spannungsminimum"],
  ["010060320304", "Spannungsmaximum"],
  ["01001F0700FF", "Strom L1"],
  ["0100200700FF", "Spannung L1"],
  ["0100020800FF", "negative Wirkenergie"],
  ["0100020801FF", "negative Wirkenergie - Tarif 1"],
  ["0100020802FF", "negative Wirkenergie - Tarif 2"],
  ["0100330700FF", "Strom L2"],
  ["0100340700FF", "Spannung L2"],
  ["0100470700FF", "Strom L3"],
  ["0100480700FF", "Spannung L3"],
  ["010000090B00", "Zeitstempel (UTC)"],
  ["0700030000FF", "Verbrauch in m³ (nicht korrigiert)"]
]);

export function formatRegisterName(register: string, withName = false): string {
  const name = register.toUpperCase();
  const mappedName = TECK2NAME_MAP.get(name);
  if (mappedName) {
    return withName ? `${name} - ${mappedName}` : mappedName;
  }
  return name;
}

Vue.filter("toRegisterName", formatRegisterName);
