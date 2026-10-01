/**
 * De Google-reviews van JG Mobility.
 *
 * WAAROM DIT HIER STAAT EN NIET IN DE HOMEPAGE
 * Deze lijst stond in `app/HomeClient.tsx`, naast de opmaak die hem toonde. Zodra de
 * reviews ook op `/reviews` en in de JSON-LD van `app/layout.tsx` moesten verschijnen,
 * zouden er drie kopieën van dezelfde drie citaten ontstaan — en loopt de ene uit de
 * pas met de andere zodra er een review bij komt. Vandaar één bron.
 *
 * Letterlijk overgenomen van de bron zoals die live op Google staat: naam,
 * initiaal-kleur (afgeleid van het Google-avatar), citaat en tijdsaanduiding. Score en
 * aantal komen uit dezelfde bron.
 *
 * AUTOMATISCH KOPPELEN — WAT DAARVOOR NODIG IS
 * Er is bewust geen live sync. Wie dat wil, heeft twee dingen nodig:
 *   1. een Google Places API-key (Google Cloud → Places API → "API key"), en
 *   2. de place ID van JG Mobility (https://developers.google.com/maps/documentation/places/web-service/place-id).
 * Daarmee haalt `GET https://places.googleapis.com/v1/places/{PLACE_ID}?fields=rating,userRatingCount,reviews`
 * de score, het aantal en maximaal vijf reviews op. De plek om dat in te pluggen is
 * een server-functie náást dit bestand (bijv. `lib/reviews-google.ts`) die dezelfde
 * `Review`-vorm teruggeeft, met `revalidate` van een paar uur en deze lijst als
 * terugval wanneer de API faalt of de key ontbreekt. Zolang dat er niet is, is deze
 * lijst de waarheid: bijwerken zodra er een review bij komt — inclusief
 * `GOOGLE_SCORE` en `GOOGLE_AANTAL`.
 */

export type Review = {
  naam: string;
  initialen: string;
  /** Achtergrond van de vierkante avatar — de kleur die Google zelf aan die naam geeft. */
  kleur: string;
  sterren: number;
  /** De volledige review. */
  tekst: string;
  /** Ingekorte versie voor de kaarten, zodat drie kaarten even hoog blijven. */
  kort: string;
  datum: string;
};

export const reviews: Review[] = [
  {
    naam: "Nigel No Name",
    initialen: "NN",
    kleur: "#7a5a3a",
    sterren: 5,
    tekst: "Super vriendelijk geholpen met het kopen van mijn Opel Rocks e. Netjes ook een nieuw slot ingezet en naar afspraak voor de deur geleverd. Ik raad dit bedrijf met een jonge ondernemer zeer aan",
    kort: "Super vriendelijk geholpen met het kopen van mijn Opel Rocks e. Netjes ook een nieuw slot ingezet en naar afspraak voor de deur geleverd.",
    datum: "een dag geleden",
  },
  {
    naam: "Sem de Snoo",
    initialen: "SS",
    kleur: "#3a4a6a",
    sterren: 5,
    tekst: "Zeer tevreden over JG Mobility. Vriendelijk, eerlijk en een goede service. Aanrader!",
    kort: "Zeer tevreden over JG Mobility. Vriendelijk, eerlijk en een goede service. Aanrader!",
    datum: "2 weken geleden",
  },
  {
    naam: "Yoshua Sietaram",
    initialen: "YS",
    kleur: "#5a6a4a",
    sterren: 5,
    tekst: "Hier mijn eerste auto gekocht, heel fijn en netjes geholpen. Geduldig tot ik de juiste keuze had gemaakt en mij daarbij begeleid. Top ervaring gehad!",
    kort: "Hier mijn eerste auto gekocht, heel fijn en netjes geholpen. Geduldig tot ik de juiste keuze had gemaakt.",
    datum: "3 maanden geleden",
  },
];

/** Google-rating zoals die live op Google staat: 5,0 uit 3 reviews. */
export const GOOGLE_SCORE = 5.0;
export const GOOGLE_AANTAL = 3;

/**
 * Het reviewspaneel van JG Mobility op Google. Hier staan alle reviews én zit de knop
 * om zelf een review achter te laten — vandaar dat zowel "bekijk" als "schrijf" hier
 * naartoe linken.
 */
export const GOOGLE_REVIEWS_URL =
  "https://www.google.com/search?sca_esv=fc3e704c0648f1af&sxsrf=APpeQnvT4wftVBPFnIgKlTFJRBFlcAHM_A:1790087026549&q=JG+Mobility&si=APenkKm7iecQ4G6P-TsbSMFKIQtv3EFIqRAFw-i8uEbk55Z-_wVkVRa7EJ5RsmEOQhTELqEUC8F7xrRateTEaWbxW7H8xiS5LcN0vsToHupqd_2gpJOS3VQ%3D&uds=AJ5uw18gNhEE-1kkRZFnq5lN2SLiCdnMb8HKbhWbBjr2rOcUX9OjqdQ4Dn-ruWyEeR-k5TBa1QrEbZj_IJPW9oliBfFr_175pY16R-aVUmhL-mZvJ7olC9o&sa=X&ved=2ahUwiek9bqsYKXAxVh-QIHHfEVGrIQ3PALegQINRAF";
