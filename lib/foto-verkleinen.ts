/**
 * Foto's verkleinen in de browser, vóór het versturen.
 *
 * WAAROM DIT MOET
 * Een foto van een telefoon is al snel 4 MB. Een serverloze functie op Vercel neemt een
 * verzoek van hooguit 4,5 MB aan, dus twee foto's rechtstreeks doorsturen en de aanvraag
 * ketst af — bij de klant, met een foutmelding die hij niet kan oplossen. Verkleinen tot
 * 1600 pixels maakt er een paar honderd kilobyte van, en voor het beoordelen van een
 * inruilauto is dat ruim voldoende.
 *
 * Lukt het verkleinen niet (een vreemd formaat, een browser zonder canvas), dan gaat het
 * origineel mee. Liever een grote foto dan geen foto.
 */

const MAX_ZIJDE = 1600;
const KWALITEIT = 0.82;

export async function verkleinFoto(bestand: File): Promise<File> {
  if (!bestand.type.startsWith("image/")) return bestand;

  try {
    const bitmap = await createImageBitmap(bestand);
    const schaal = Math.min(1, MAX_ZIJDE / Math.max(bitmap.width, bitmap.height));

    // Al klein genoeg? Dan niets doen — opnieuw comprimeren maakt hem alleen lelijker.
    if (schaal === 1 && bestand.size < 900_000) {
      bitmap.close();
      return bestand;
    }

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * schaal);
    canvas.height = Math.round(bitmap.height * schaal);
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close();
      return bestand;
    }
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((klaar) =>
      canvas.toBlob(klaar, "image/jpeg", KWALITEIT)
    );
    if (!blob || blob.size >= bestand.size) return bestand;

    const naam = bestand.name.replace(/\.[^.]+$/, "") + ".jpg";
    return new File([blob], naam, { type: "image/jpeg" });
  } catch {
    return bestand;
  }
}
