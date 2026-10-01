import { getAutos } from "@/lib/autos-db";
import { isBedrijfswagen } from "@/lib/voertuig";
import type { Auto } from "@/lib/autos";
import HomeClient from "./HomeClient";

export const revalidate = 300;

/**
 * Nieuwste eerst. `toegevoegd_op` is het veld waar het dashboard de datum in zet,
 * maar auto's van vóór dat veld hebben het niet — die vallen terug op hun id, en
 * dat loopt op in de volgorde waarin ze zijn ingevoerd.
 */
function nieuwsteEerst(a: Auto, b: Auto): number {
  if (a.toegevoegd_op && b.toegevoegd_op) {
    return b.toegevoegd_op.localeCompare(a.toegevoegd_op);
  }
  if (a.toegevoegd_op) return -1;
  if (b.toegevoegd_op) return 1;
  return b.id - a.id;
}

/** Hetzelfde idee, maar dan op verkoopdatum — voor het blok "Recent verkocht". */
function laatstVerkocht(a: Auto, b: Auto): number {
  if (a.verkocht_op && b.verkocht_op) {
    return b.verkocht_op.localeCompare(a.verkocht_op);
  }
  if (a.verkocht_op) return -1;
  if (b.verkocht_op) return 1;
  return b.id - a.id;
}

export default async function Page() {
  const all = await getAutos();

  // Beschikbaar = niet verkocht. Een gereserveerde auto blijft staan: die is nog niet
  // weg, en een lege homepage verkoopt niets.
  const beschikbaar = all.filter((a) => !a.verkocht).sort(nieuwsteEerst);

  const nieuwBinnen = beschikbaar.slice(0, 6);
  const bedrijfswagens = beschikbaar.filter(isBedrijfswagen).slice(0, 3);
  const recentVerkocht = all
    .filter((a) => a.verkocht)
    .sort(laatstVerkocht)
    .slice(0, 4);

  return (
    <HomeClient
      nieuwBinnen={nieuwBinnen}
      bedrijfswagens={bedrijfswagens}
      recentVerkocht={recentVerkocht}
    />
  );
}
