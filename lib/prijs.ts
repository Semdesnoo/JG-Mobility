import type { Auto } from "./autos";

/**
 * Prijzen met en zonder btw.
 *
 * WAAROM
 * `auto.prijs` is overal in het systeem het bedrag **inclusief btw** — de factuur rekent
 * terug met /1,21, de leasecalculator krijgt het zo aangeleverd, de marge in de
 * calculator ook. Dat blijft zo. Bedrijfswagens worden alleen anders gepresenteerd:
 * daar noem je de prijs zonder btw, want de koper trekt die af.
 *
 * Daarom bepaalt `prijsExclBtw` alleen wat er op het scherm staat, niet wat er in de
 * database staat. Eén canoniek bedrag, één plek waar het omgerekend wordt.
 */

export const BTW_TARIEF = 0.21;

/** Van inclusief naar exclusief. Hele euro's — de site toont geen centen. */
export const zonderBtw = (inclusief: number) => Math.round(inclusief / (1 + BTW_TARIEF));

/** Van exclusief naar inclusief. Hele euro's. */
export const metBtw = (exclusief: number) => Math.round(exclusief * (1 + BTW_TARIEF));

const euro = (n: number) => `\u20ac${n.toLocaleString("nl-NL")}`;

export type PrijsWeergave = {
  /** Het getal dat groot op de pagina staat. */
  bedrag: number;
  /** Datzelfde bedrag als "\u20ac 12.500". */
  tekst: string;
  /** "excl. btw" of "" \u2014 hoort direct achter het bedrag. */
  achtervoegsel: string;
  /** Bij een bedrijfswagen: "\u20ac 15.125 incl. btw". Anders leeg. */
  tegenhanger: string;
};

/**
 * Wat er voor deze auto op de site hoort te staan. Gebruik dit overal waar een prijs
 * getoond wordt, zodat een bestelbus nergens per ongeluk als consumentenprijs langskomt.
 */
export function prijsWeergave(auto: Pick<Auto, "prijs" | "prijsExclBtw">): PrijsWeergave {
  if (!auto.prijsExclBtw) {
    return { bedrag: auto.prijs, tekst: euro(auto.prijs), achtervoegsel: "", tegenhanger: "" };
  }
  const excl = zonderBtw(auto.prijs);
  return {
    bedrag: excl,
    tekst: euro(excl),
    achtervoegsel: "excl. btw",
    tegenhanger: `${euro(auto.prijs)} incl. btw`,
  };
}
