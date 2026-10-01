/**
 * Losse controle van lib/voertuig.ts.
 *
 * Er zit geen testframework in dit project en daar is ook geen reden voor, maar de regels
 * in voertuig.ts hangen aan de klok en aan vrije tekst uit het dashboard — precies het
 * soort regel dat je met de hand niet nakijkt. Dit bestand is daarom met de hand te
 * draaien:
 *
 *   npx tsx lib/voertuig.check.ts
 *
 * Klopt er iets niet, dan stopt het hier met een melding die vertelt wát er niet klopte.
 * Het bestand wordt nergens geïmporteerd, dus het komt niet in de site terecht.
 */

import assert from "node:assert/strict";
import { bodytypeLabel, isBedrijfswagen, isMargeAuto, isNieuwBinnen } from "./voertuig";

/** Een ISO-datum van `n` dagen terug. Een negatief getal geeft een datum in de toekomst. */
const dagenTerug = (n: number) => new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString();

// ── isNieuwBinnen ──
assert.equal(isNieuwBinnen({ toegevoegd_op: dagenTerug(0) }), true, "vandaag toegevoegd is nieuw binnen");
assert.equal(isNieuwBinnen({ toegevoegd_op: dagenTerug(13) }), true, "dertien dagen valt nog binnen de termijn");
assert.equal(isNieuwBinnen({ toegevoegd_op: dagenTerug(15) }), false, "na veertien dagen vervalt het label");
assert.equal(
  isNieuwBinnen({ toegevoegd_op: dagenTerug(1), verkocht: true }),
  false,
  "een verkochte auto is nooit nieuw binnen"
);
assert.equal(isNieuwBinnen({}), false, "zonder datum geen label");
assert.equal(isNieuwBinnen({ toegevoegd_op: "" }), false, "lege datum geen label");
assert.equal(isNieuwBinnen({ toegevoegd_op: "binnenkort" }), false, "onleesbare datum geen label");
assert.equal(isNieuwBinnen({ toegevoegd_op: dagenTerug(-2) }), false, "datum in de toekomst geen label");

// ── isMargeAuto ──
assert.equal(isMargeAuto({ btw: "Marge" }), true, "Marge met hoofdletter");
assert.equal(isMargeAuto({ btw: "marge voertuig" }), true, "marge als deel van een zin");
assert.equal(isMargeAuto({ btw: "BTW" }), false, "een btw-auto is geen marge-auto");
assert.equal(isMargeAuto({ btw: "Inclusief BTW (21%)" }), false, "btw-tekst blijft btw");
assert.equal(isMargeAuto({}), false, "niets ingevuld levert geen marge op");

// ── isBedrijfswagen / bodytypeLabel ──
// Beide schrijfwijzen komen in de voorraad voor: het nieuwe "Bestelauto" uit het
// dashboard en de oude RDW-inrichting "Gesloten opbouw".
assert.equal(isBedrijfswagen({ bodytype: "Bestelauto" }), true, "Bestelauto is een bedrijfswagen");
assert.equal(isBedrijfswagen({ bodytype: "GESLOTEN OPBOUW" }), true, "RDW-inrichting telt ook mee");
assert.equal(isBedrijfswagen({ bodytype: "SUV" }), false, "een SUV is een personenauto");
assert.equal(bodytypeLabel({ bodytype: "Open laadvloer" }), "Bedrijfswagen", "bus krijgt altijd één woord");
assert.equal(bodytypeLabel({ bodytype: "Hatchback" }), "Hatchback", "personenauto houdt zijn carrosserie");
assert.equal(bodytypeLabel({}), "", "niets ingevuld levert een leeg label op");

console.log("lib/voertuig.ts — alle controles geslaagd.");
