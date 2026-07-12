/** ICC-style short codes for player pool nations. */
const COUNTRY_CODES: Record<string, string> = {
  Australia: "AUS",
  Bangladesh: "BAN",
  England: "ENG",
  India: "IND",
  "New Zealand": "NZ",
  Pakistan: "PAK",
  "South Africa": "SA",
  "Sri Lanka": "SL",
  "West Indies": "WI",
  Zimbabwe: "ZIM",
  Afghanistan: "AFG",
  Ireland: "IRE",
};

export function countryCode(country: string): string {
  return COUNTRY_CODES[country] ?? country.slice(0, 3).toUpperCase();
}
