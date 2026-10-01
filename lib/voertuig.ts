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

/**
 * Hoe lang een auto "nieuw binnen" is.
 *
 * WAAROM VEERTIEN DAGEN
 * Een label dat er altijd staat zegt niets meer. Twee weken is lang genoeg dat een vaste
 * bezoeker tussen twee bezoeken ziet dat er iets bij is gekomen, en kort genoeg dat
 * "nieuw binnen" ook echt waar is. Het getal staat hier één keer, zodat de kaart en een
 * eventueel filter er nooit verschillend over kunnen denken.
 */
const NIEUW_BINNEN_DAGEN = 14;

/**
 * Staat deze auto nog maar net in de voorraad?
 *
 * Alles waar twijfel over bestaat valt af: geen datum, een datum die geen datum is, of
 * een datum die nog moet komen (een typefout in het dashboard, of een klok die vooruit
 * loopt). Dan staat er liever géén label dan een label dat niet klopt.
 *
 * Een verkochte auto is nooit nieuw binnen, hoe kort hij er ook gestaan heeft — "nieuw
 * binnen" is een uitnodiging om te komen kijken, en dat valt bij een verkochte auto
 * verkeerd.
 */
export function isNieuwBinnen(auto: { toegevoegd_op?: string; verkocht?: boolean }): boolean {
  if (auto.verkocht) return false;
  if (!auto.toegevoegd_op) return false;
  const toegevoegd = new Date(auto.toegevoegd_op).getTime();
  if (Number.isNaN(toegevoegd)) return false;
  const verstreken = Date.now() - toegevoegd;
  if (verstreken < 0) return false;
  return verstreken <= NIEUW_BINNEN_DAGEN * 24 * 60 * 60 * 1000;
}

/**
 * Marge-auto of btw-auto?
 *
 * Het veld `btw` is vrije tekst uit het dashboard: "Marge", "marge voertuig" en
 * "Inclusief BTW" komen er allemaal in voor. Daarom wordt er op het woord gezocht en niet
 * op een exacte waarde vergeleken. Staat er geen "marge" in, dan is het een btw-auto —
 * een derde mogelijkheid is er niet.
 */
export function isMargeAuto(auto: { btw?: string }): boolean {
  return /marge/i.test(auto.btw ?? "");
}
