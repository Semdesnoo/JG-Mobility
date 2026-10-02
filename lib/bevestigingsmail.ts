import { Resend } from "resend";

/**
 * De ontvangstbevestiging die elk formulier op deze site naar de klant stuurt.
 *
 * WAAROM DIT BESTAAT
 * Alle formulieren mailden alleen naar info@jgmobility.nl. De klant zag een groen vinkje
 * op het scherm en daarna niets meer: geen mail, geen spoor in zijn eigen postvak, geen
 * idee of het echt was aangekomen. Wie twijfelt stuurt het nog een keer, of — vaker — hij
 * kijkt verder bij een ander. Een korte bevestiging haalt die twijfel weg en geeft hem
 * tegelijk ons nummer, zodat hij ons kan bereiken zonder de site terug te hoeven zoeken.
 *
 * ÉÉN HELPER, VIJF FORMULIEREN
 * Contact, afspraak, consignatie, inruil/taxatie en financial lease sturen allemaal
 * hetzelfde soort mail: dezelfde kop, dezelfde belofte, dezelfde contactgegevens, alleen
 * een ander lijstje met wat de klant heeft ingevuld. Dat lijstje is het enige dat de
 * aanroeper hoeft aan te leveren.
 *
 * TWEE REGELS DIE NIET MOGEN VERSCHUIVEN
 * • Deze mail mag een aanvraag nooit laten mislukken. Alles hieronder zit in een try/catch
 *   en geeft niets terug: de aanvraag van de klant is binnen, en of de bevestiging aankomt
 *   is daar niet van afhankelijk. Aanroepen gebeurt bij voorkeur in `after()`, zodat de
 *   klant er ook niet op wacht.
 * • Geen afbeeldingen. De kop is platte tekst op navy. Een logo als bijlage of externe
 *   URL wordt door Gmail en Outlook standaard geblokkeerd; dan staat er een kapot kadertje
 *   boven de belangrijkste mail die wij versturen.
 */

/** Hetzelfde afzenderadres als de meldingen naar info@ — één geverifieerd domein bij Resend. */
const VAN = "JG Mobility Website <noreply@jgmobility.nl>";

const TELEFOON = "+31621331374";
const TELEFOON_WEERGAVE = "+31 6 21331374";
const WHATSAPP = "https://wa.me/31621331374";
const EMAIL = "info@jgmobility.nl";

/**
 * Voorkomt dat ingevoerde tekst als HTML in de mail terechtkomt.
 *
 * Staat hier omdat elke mail op deze site hem nodig heeft en dit het bestand is dat ze
 * allemaal al importeren — zie lib/auto-aanvraag.ts en app/api/contact/route.ts.
 */
export function veilig(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Globaal e-mailcontrole — hetzelfde patroon als de formulierroutes gebruiken. */
const lijktOpEmail = (e: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e);

export type Bevestiging = {
  /** E-mailadres van de klant. Leeg of onzinnig? Dan versturen we niets. */
  naar: string;
  /** Het kopje onder "JG Mobility", bijv. "Contactaanvraag". */
  titel: string;
  /** De onderwerpregel van de mail. */
  onderwerp: string;
  /** Eerste alinea. Standaard de belofte van 24 uur. */
  intro?: string;
  /** Wat de klant heeft ingestuurd. Regels zonder waarde vallen weg. */
  regels: { label: string; waarde: string }[];
  /** Optionele slotalinea, bijv. wat er hierna gebeurt. */
  slot?: string;
};

const STANDAARD_INTRO = "Bedankt voor je aanvraag — we nemen binnen 24 uur contact op.";

const regelHtml = (label: string, waarde: string) =>
  waarde
    ? `<tr><td style="padding:7px 12px 7px 0;font-size:13px;color:#666666;vertical-align:top;width:160px">${veilig(label)}</td>` +
      `<td style="padding:7px 0;font-size:13px;color:#001337;font-weight:bold;white-space:pre-wrap">${veilig(waarde)}</td></tr>`
    : "";

/**
 * Verstuurt de bevestiging. Geeft niets terug en gooit niets: een mislukte bevestiging is
 * een regel in het log, geen probleem voor de klant.
 */
export async function stuurBevestigingsmail(bevestiging: Bevestiging): Promise<void> {
  const { naar, titel, onderwerp, intro, regels, slot } = bevestiging;
  const adres = naar.trim();
  if (!adres || !lijktOpEmail(adres)) return;

  const rijen = regels.map((r) => regelHtml(r.label, r.waarde)).join("");

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e2e8f0;border-radius:0">
      <div style="background:#001337;padding:24px 30px;text-align:center"><h1 style="color:#ffffff;font-family:Georgia,serif;margin:0;font-size:24px;font-weight:bold;letter-spacing:.04em">JG Mobility</h1><p style="color:rgba(255,255,255,0.6);font-size:11px;letter-spacing:1.5px;text-transform:uppercase;margin:8px 0 0">${veilig(titel)}</p></div>
      <div style="padding:30px;background:#f8f8f8;border-radius:0">
        <p style="font-size:14px;color:#001337;line-height:1.7;margin:0 0 24px">${veilig(intro ?? STANDAARD_INTRO)}</p>
        ${
          rijen
            ? `<p style="font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#666666;margin:0 0 8px">Wat je hebt doorgegeven</p>
        <table style="width:100%;border-collapse:collapse;background:#ffffff;border:1px solid #e2e8f0;border-radius:0;padding:4px">
          ${rijen}
        </table>`
            : ""
        }
        ${
          slot
            ? `<p style="font-size:13px;color:#001337;line-height:1.7;margin:24px 0 0">${veilig(slot)}</p>`
            : ""
        }
        <div style="margin-top:24px;padding:18px;background:#ffffff;border-left:3px solid #001337;border-radius:0">
          <p style="font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#666666;margin:0 0 10px">Liever direct contact?</p>
          <p style="font-size:13px;color:#001337;line-height:1.9;margin:0">
            Bellen: <a href="tel:${TELEFOON}" style="color:#001337;font-weight:bold">${TELEFOON_WEERGAVE}</a><br />
            WhatsApp: <a href="${WHATSAPP}" style="color:#001337;font-weight:bold">${TELEFOON_WEERGAVE}</a><br />
            E-mail: <a href="mailto:${EMAIL}" style="color:#001337;font-weight:bold">${EMAIL}</a>
          </p>
        </div>
      </div>
      <div style="padding:18px 30px;background:#001337;border-radius:0">
        <p style="font-size:11px;color:rgba(255,255,255,0.5);line-height:1.7;margin:0">
          JG Mobility — Bedrijfswagens &amp; Geselecteerde Occasions<br />
          Arnhemseweg 10a, 2994 LA Barendrecht
        </p>
      </div>
    </div>
  `;

  try {
    // .trim() op de key: onzichtbare tekens (zoals een BOM) uit het plakken in Vercel
    // laten Resend anders struikelen op de Authorization-header. Zelfde reden als in
    // de routes die de melding naar info@ versturen.
    const resend = new Resend((process.env.RESEND_API_KEY ?? "").trim());
    const { error } = await resend.emails.send({
      from: VAN,
      to: adres,
      replyTo: EMAIL,
      subject: onderwerp,
      html,
    });
    if (error) console.error("Bevestigingsmail naar klant mislukt:", error);
  } catch (e) {
    console.error("Bevestigingsmail naar klant mislukt:", e);
  }
}
