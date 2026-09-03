import type { Auto } from "./autos";
import { bodytypeLabel } from "./voertuig";

/**
 * Welke auto's zet je onder een auto neer?
 *
 * WAAROM DIT GEEN "ZELFDE MERK"-REGEL IS
 * Dat is de eerste ingeving, maar de voorraad geeft er geen ruimte voor. Van de zeventien
 * auto's staan er zeven te koop, en de helft van de merken komt precies één keer voor:
 * één Mini, één Dodge, één Renault, één Mercedes. Een harde merkregel levert daar dus
 * meestal een lege rij op — en een leeg blok onder een auto is erger dan geen blok.
 *
 * Daarom telt de prijs het zwaarst. Wie naar een auto van vierduizend kijkt, is met een
 * auto van vijftigduizend niet geholpen, ongeacht het merk. Zelfde merk, zelfde
 * carrosserie en zelfde brandstof zijn bonussen die de volgorde bijsturen zonder ooit
 * alles weg te filteren. Zo blijft er altijd íets staan, en staat het bovenaan wat er
 * het dichtst bij zit.
 */

/** Hoe zwaar een overeenkomst meetelt. Hoger = trekt harder naar boven. */
const BONUS_MERK = 0.35;
const BONUS_CARROSSERIE = 0.25;
const BONUS_BRANDSTOF = 0.1;

/** "Bmw" en "BMW" staan allebei in de voorraad — vergelijken zonder daarover te struikelen. */
const gelijk = (a: string | undefined, b: string | undefined) =>
  !!a && !!b && a.trim().toLowerCase() === b.trim().toLowerCase();

/**
 * Hoe ver twee prijzen uit elkaar liggen, als verhouding. Een verschil van duizend euro
 * weegt bij een auto van drieduizend zwaarder dan bij een van vijftigduizend, en zo hoort
 * het ook: het gaat om wat de koper kan besteden, niet om het absolute bedrag.
 */
function prijsAfstand(prijs: number, tenOpzichteVan: number): number {
  if (!tenOpzichteVan || tenOpzichteVan <= 0) return 0;
  return Math.abs(prijs - tenOpzichteVan) / tenOpzichteVan;
}

function score(kandidaat: Auto, huidige: Auto): number {
  let s = prijsAfstand(kandidaat.prijs, huidige.prijs);
  if (gelijk(kandidaat.merk, huidige.merk)) s -= BONUS_MERK;
  // Op het lábel vergelijken, niet op de ruwe waarde. Een bestelbus staat in de database
  // als "Gesloten opbouw", "Open laadvloer" of "Bestelauto" terwijl de bezoeker overal
  // één woord ziet: Bedrijfswagen. Op de ruwe waarde zouden twee bussen die er identiek
  // uitzien niet als dezelfde klasse tellen.
  if (gelijk(bodytypeLabel(kandidaat), bodytypeLabel(huidige))) s -= BONUS_CARROSSERIE;
  if (gelijk(kandidaat.brandstof, huidige.brandstof)) s -= BONUS_BRANDSTOF;
  return s;
}

/**
 * De auto's die onder `huidige` getoond worden, van meest naar minst verwant.
 *
 * Alleen auto's die te koop staan. Een rij met verkochte auto's aanvullen leek eerst
 * netjes — nooit een half blok — maar het levert doodlopende wegen op precies waar je
 * iemand wilt laten doorkijken. Liever twee kaarten dan drie waarvan er één weg is.
 *
 * Verborgen auto's zitten hier sowieso niet bij: die worden al bij het uitlezen uit de
 * database geweerd (zie lib/autos-db.ts).
 */
export function gerelateerdeAutos(huidige: Auto, alle: Auto[], aantal = 3): Auto[] {
  return alle
    .filter((a) => a.id !== huidige.id && !a.verkocht)
    .sort((a, b) => score(a, huidige) - score(b, huidige))
    .slice(0, aantal);
}
