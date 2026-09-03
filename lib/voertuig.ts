/**
 * Personenauto of bedrijfswagen?
 *
 * WAAROM DIT EEN LIJSTJE IS EN GEEN VELD
 * De RDW levert geen nette carrosserienaam voor bedrijfswagens maar de *inrichting*:
 * "Gesloten opbouw", "Open laadvloer", "Bakwagen". Die termen zijn zo op de site
 * beland — vandaar de badge "GESLOTEN OPBOUW" op een bestelbus. Nieuwe auto's krijgen
 * in het dashboard netjes "Bestelauto" mee, maar wat er al staat houdt zijn oude waarde
 * tot iemand die auto opnieuw opslaat. Daarom herkent dit allebei.
 */

const BEDRIJFSWAGEN_TYPES = [
  "bestelauto",
  "bestelwagen",
  "bedrijfswagen",
  "bedrijfsauto",
  "gesloten opbouw",
  "open laadvloer",
  "open laadbak",
  "bakwagen",
  "chassis cabine",
  "kipper",
  "koelwagen",
];

/** Kleinletters en zonder accenten, zodat schrijfwijzen elkaar niet ontlopen. */
const normaliseer = (s: string) =>
  s.trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export function isBedrijfswagen(auto: { bodytype?: string }): boolean {
  return BEDRIJFSWAGEN_TYPES.includes(normaliseer(auto.bodytype ?? ""));
}

/**
 * Wat er op het label hoort te staan. Bij een bedrijfswagen altijd dat ene woord — dan
 * staat er hetzelfde op de badge als in het filter, en leest niemand meer RDW-jargon.
 */
export function bodytypeLabel(auto: { bodytype?: string }): string {
  return isBedrijfswagen(auto) ? "Bedrijfswagen" : auto.bodytype ?? "";
}
