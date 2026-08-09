/**
 * Delivery configuration for J&K operations.
 *
 * Business rules:
 *  - Orders >= 1,000 -> FREE delivery (all serviceable pincodes)
 *  - Orders <  1,000 -> distance-based delivery charges:
 *      <= 10 km  : 0
 *      10-25 km : 150
 *      > 25 km  : 200
 *
 * Serviceable area: Kashmir Division districts only.
 */

// Approximate distance (km) from the warehouse (Srinagar) to major pincodes.
export const PINCODE_DISTANCES = {
  "190001": 0, "190002": 1, "190003": 2, "190004": 3, "190005": 4,
  "190006": 5, "190007": 6, "190008": 7, "190009": 8, "190010": 9,
  "190011": 10, "190012": 11, "190013": 12, "190014": 13, "190015": 14,
  "190016": 15, "190017": 12, "190018": 10, "190019": 8, "190020": 14,
  "190021": 16, "190022": 18, "190023": 20, "190024": 22, "190025": 25,

  "191201": 18, "191202": 20, "191203": 22, "191204": 24, "191205": 26,
  "191206": 28, "191207": 30,

  "191111": 16, "191112": 18, "191113": 20, "191114": 22, "191115": 25,
  "191116": 28, "191117": 30, "191118": 32, "191119": 35,

  "193101": 42, "193102": 45, "193103": 48, "193104": 50, "193105": 52,
  "193106": 55, "193107": 58, "193108": 60, "193109": 62, "193110": 65,
  "193111": 68, "193112": 70, "193113": 72, "193114": 75, "193115": 78,
  "193116": 80, "193121": 44, "193122": 47, "193123": 50, "193124": 53,
  "193125": 56, "193126": 59, "193127": 62, "193128": 65, "193129": 68,
  "193130": 71, "193131": 74, "193132": 77, "193133": 80,

  "193201": 52, "193202": 55, "193203": 58, "193204": 60, "193205": 63,
  "193206": 66, "193207": 68, "193208": 70, "193209": 73, "193210": 75,
  "193211": 78, "193212": 80, "193221": 54, "193222": 57, "193223": 60,
  "193224": 63, "193225": 66, "193226": 69, "193227": 72, "193228": 75,
  "193229": 78, "193230": 81, "193231": 84, "193232": 87, "193233": 90,

  "192301": 22, "192302": 24, "192303": 26, "192304": 28, "192305": 30,
  "192306": 32, "192307": 34, "192308": 36, "192309": 38, "192310": 40,
  "192311": 42, "192312": 44, "192313": 46, "192314": 48, "192315": 50,

  "192101": 42, "192102": 44, "192103": 46, "192104": 48, "192105": 50,
  "192106": 52, "192107": 54, "192108": 56, "192109": 58, "192110": 60,
  "192111": 62, "192112": 64, "192113": 66, "192114": 68, "192115": 70,
  "192116": 72, "192117": 74, "192118": 76, "192119": 78, "192120": 80,
  "192121": 45, "192122": 48, "192123": 51, "192124": 54, "192125": 57,
  "192126": 60, "192127": 63, "192128": 66, "192129": 69, "192130": 72,
  "192131": 75, "192132": 78, "192133": 81,

  "192231": 48, "192232": 50, "192233": 52, "192234": 55, "192235": 58,
  "192236": 60, "192237": 62, "192238": 65, "192239": 68, "192240": 70,
  "192241": 72, "192242": 74, "192243": 76, "192244": 78,

  "192231": 36, "192232": 38, "192233": 40, "192234": 42, "192235": 44,
  "192236": 46, "192237": 48, "192238": 50, "192239": 52, "192240": 54,
  "192241": 56, "192242": 58, "192243": 60, "192244": 62, "192245": 64,

  "193502": 52, "193503": 55, "193504": 58, "193505": 60, "193506": 63,
  "193507": 66, "193508": 68, "193509": 70, "193510": 72, "193511": 75,
  "193512": 78,
};

// Prefix-based fallback distances (first 3 digits of pincode)
export const PINCODE_PREFIX_DISTANCES = {
  "190": 10, // Srinagar / central Kashmir
  "191": 18, // Ganderbal / Budgam
  "192": 35, // South Kashmir (Anantnag, Pulwama, Shopian, Kulgam)
  "193": 55, // North Kashmir (Baramulla, Kupwara, Bandipora)
};

export const FREE_DELIVERY_THRESHOLD = 1000;

export const DELIVERY_CHARGES = [
  { maxKm: 10, charge: 0 },
  { maxKm: 25, charge: 150 },
  { maxKm: Infinity, charge: 200 },
];

export function getDistanceForPincode(pincode) {
  if (!pincode) return null;

  const clean = String(pincode).trim();
  if (PINCODE_DISTANCES[clean]) {
    return PINCODE_DISTANCES[clean];
  }

  const prefix = clean.slice(0, 3);
  if (PINCODE_PREFIX_DISTANCES[prefix]) {
    return PINCODE_PREFIX_DISTANCES[prefix];
  }

  return null;
}

export function isServiceablePincode(pincode) {
  if (!pincode) return false;

  const clean = String(pincode).trim();

  if (PINCODE_DISTANCES[clean]) {
    return true;
  }

  const prefix = clean.slice(0, 3);
  if (PINCODE_PREFIX_DISTANCES[prefix]) {
    return true;
  }

  return false;
}

export function calculateDeliveryCharge(distanceKm, orderTotal) {
  if (distanceKm === null || distanceKm === undefined) {
    return null;
  }

  if (orderTotal >= FREE_DELIVERY_THRESHOLD) {
    return 0;
  }

  const tier = DELIVERY_CHARGES.find((t) => distanceKm <= t.maxKm);
  return tier ? tier.charge : DELIVERY_CHARGES[DELIVERY_CHARGES.length - 1].charge;
}
