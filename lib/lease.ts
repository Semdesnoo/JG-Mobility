import type { Auto } from "./autos";

/**
 * Maandbedrag financial lease — dezelfde som als de calculator van In Lease Auto's.
 *
 * WAAROM HIER EEN EIGEN BEREKENING STAAT
 * De calculator van onze leasepartner zit op de autopagina in een iframe; die kunnen we
 * niet uitlezen om op een autokaart te zetten. Daarom rekenen we hier exact na wat hij
 * doet met zijn standaardinstellingen (zakelijk, 72 maanden, geen aanbetaling, maximale
 * slottermijn). Het bedrag op de kaart is dan precies wat de klant ziet zodra hij de
 * calculator opent — geen tweede, net-iets-ander getal.
 *
 * Bron: calculator.inleaseautos.nl, dealer 13504 — data-attributen op `.lease-calc` en
 * assets/js/calculator.js. Nagerekend op € 20.000 marge (374), € 36.300 btw (509),
 * € 8.000 marge (149) en € 45.000 marge (777): alle vier gelijk.
 *
 * ponytail: rentes en slottermijn-factor zijn overgenomen, niet live opgehaald. Past In
 * Lease zijn tarieven aan, dan lopen kaart en calculator uit de pas — bijwerken hier.
 */

const LOOPTIJD = 72; // maanden — standaard van de calculator
const SLOTTERMIJN_FACTOR = 0.15; // bij 72 maanden: max. 15% van de prijs als slottermijn
const RENTE_HOOG = 12.99; // % per jaar, leasebedrag t/m de drempel
const RENTE_LAAG = 10.49; // % per jaar, leasebedrag boven de drempel
const RENTE_DREMPEL = 25000;
const BTW = 0.21;

/** Onder dit bedrag zet geen maatschappij er een contract op. */
export const LEASE_DREMPEL = 5000;

export const LEASE_VOORWAARDEN = `${LOOPTIJD} mnd · geen aanbetaling · slottermijn ${Math.round(
  SLOTTERMIJN_FACTOR * 100
)}%`;

/**
 * Kan deze auto op financial lease? Niets ingevuld in het dashboard betekent "ja"; alleen
 * een auto die expliciet op `false` staat, een verkochte auto of een te goedkope auto niet.
 */
export function leaseMogelijk(auto: Pick<Auto, "prijs" | "leaseMogelijk" | "verkocht">): boolean {
  return auto.leaseMogelijk !== false && auto.prijs >= LEASE_DREMPEL && !auto.verkocht;
}

/**
 * Maandbedrag in hele euro's, of null als lease niet kan.
 * `auto.prijs` is altijd inclusief btw (zie lib/prijs.ts). Bij een btw-auto betaalt de
 * ondernemer de btw vooraf; die gaat dus van het leasebedrag af.
 */
export function leaseMaandbedrag(
  auto: Pick<Auto, "prijs" | "btw" | "leaseMogelijk" | "verkocht">
): number | null {
  if (!leaseMogelijk(auto)) return null;
  const prijs = auto.prijs;
  const btwVooraf = /marge/i.test(auto.btw ?? "") ? 0 : Math.round((prijs * BTW) / (1 + BTW));
  const leasebedrag = prijs - btwVooraf;
  const slottermijn = Math.min(Math.round(prijs * SLOTTERMIJN_FACTOR), leasebedrag);
  const rente = leasebedrag > RENTE_DREMPEL ? RENTE_LAAG : RENTE_HOOG;
  const i = rente / 1200;
  const r = Math.pow(1 + i, LOOPTIJD);
  return Math.round((leasebedrag * i * r - slottermijn * i) / (r - 1));
}

/** "€ 374" */
export const leaseTekst = (bedrag: number) => `\u20ac${bedrag.toLocaleString("nl-NL")}`;
