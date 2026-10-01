import { NextRequest, NextResponse, after } from "next/server";
import { Resend } from "resend";
import sql from "@/lib/db";
import { stuurBevestigingsmail, veilig } from "@/lib/bevestigingsmail";

// Hier stond een helper die public/mail-header.png als data-URL in de mail-HTML bakte.
// Niemand gebruikte hem — onze mails hebben een kop van platte tekst op navy, juist omdat
// Gmail en Outlook afbeeldingen standaard blokkeren en je dan een kapot kadertje ziet
// boven de belangrijkste mail die we versturen. Zie lib/bevestigingsmail.ts.

/**
 * Een aanvraag waarbij de bezoeker zijn eigen auto beschrijft — in twee smaken.
 *
 * • "inruil"  — vanaf de pagina van een auto uit het aanbod; dan hoort er een auto bij
 *   waar de bezoeker op reageert.
 * • "taxatie" — vanaf Inkoop & Taxatie; dan is er alleen zijn eigen auto, en mag hij
 *   erbij zetten wat hij ervoor hoopt te krijgen.
 *
 * De verwerking is verder identiek, dus die staat hier één keer. De routes eromheen
 * (app/api/inruil en app/api/taxatie) zijn niet meer dan een doorgeefluik.
 *
 * WAT ER MET ZO'N AANVRAAG GEBEURT
 * 1. Er gaat een mail naar info@jgmobility.nl met alle gegevens.
 * 2. De aanvraag komt in de tabel `leads` te staan, en dus in het Aanvragen-overzicht van
 *    het dashboard. Die tabel heeft er de velden al voor: `kenteken` voor de auto van de
 *    klant, `auto_id`/`auto_naam` voor de auto waar hij op reageert, en `inruil` voor wat
 *    hij inruilt.
 * 3. De foto's gaan in een tweede mail als bijlage.
 *
 * WAAROM DE KLANT NIET OP DE MAIL WACHT
 * Eerst stond de mail vooraan en wachtte de bezoeker op twee volledige Resend-rondjes,
 * inclusief het uploaden van zijn foto's als bijlage. Dat zijn seconden waarin hij naar
 * "Versturen…" zit te kijken en zich afvraagt of hij nog een keer moet drukken.
 *
 * Nu is de volgorde omgedraaid. Het wegschrijven in `leads` is het snelste dat we hebben
 * (één rondje naar de database) én meteen het duurzaamste: staat de aanvraag daar, dan
 * staat hij in het Aanvragen-overzicht en is hij niet meer kwijt te raken. Zodra dat is
 * gelukt krijgt de klant zijn bevestiging, en gaan de mails er met `after()` achteraan —
 * na het antwoord, maar wel meteen. Voor Jimi verandert er dus niets aan de snelheid; de
 * aanvraag staat zelfs eerder in zijn dashboard dan voorheen.
 *
 * Lukt het wegschrijven niet, dan valt hij terug op de oude weg: dan gaat de mail alsnog
 * vóór het antwoord de deur uit en bepaalt die of de klant "gelukt" te zien krijgt. Zo
 * blijft er altijd één weg over waarlangs de aanvraag echt aankomt.
 */

const TO_EMAIL = "info@jgmobility.nl";
const MAX_FOTOS = 4;
const MAX_BIJLAGEN_BYTES = 3.5 * 1024 * 1024;

/** Tekst uit een formulier: altijd string, altijd getrimd, altijd begrensd. */
function tekst(fd: FormData, veld: string, maxLengte = 500): string {
  const waarde = fd.get(veld);
  return typeof waarde === "string" ? waarde.trim().slice(0, maxLengte) : "";
}

// `veilig()` — de HTML-ontsnapping voor ingevoerde tekst — staat sinds de
// ontvangstbevestiging in lib/bevestigingsmail.ts, want die mail heeft hem net zo hard
// nodig en dit bestand importeert dat bestand toch al.

const rij = (label: string, waarde: string) =>
  waarde
    ? `<tr><td style="padding:6px 0;font-size:13px;color:#666;width:150px">${label}:</td><td style="padding:6px 0;font-size:13px;color:#001337;font-weight:bold">${veilig(waarde)}</td></tr>`
    : "";

export type AanvraagSoort = "inruil" | "taxatie";

const LABELS: Record<
  AanvraagSoort,
  { onderwerp: string; mailkop: string; klantTitel: string; klantOnderwerp: string; klantSlot: string }
> = {
  inruil: {
    onderwerp: "Inruilaanvraag via de website",
    mailkop: "Nieuwe inruilaanvraag",
    klantTitel: "Inruilaanvraag ontvangen",
    klantOnderwerp: "We hebben je inruilaanvraag ontvangen",
    klantSlot:
      "Jimi bekijkt je auto en neemt contact op met een indicatie van de inruilwaarde. Dat bedrag gaat van de prijs van het voertuig af.",
  },
  taxatie: {
    onderwerp: "Taxatieaanvraag via de website",
    mailkop: "Nieuwe taxatieaanvraag",
    klantTitel: "Taxatieaanvraag ontvangen",
    klantOnderwerp: "We hebben je taxatieaanvraag ontvangen",
    klantSlot:
      "Jimi bekijkt je auto en komt bij je terug met een bod. Gratis en vrijblijvend — je beslist zelf of je het aanneemt.",
  },
};

export async function verwerkAutoAanvraag(req: NextRequest, soort: AanvraagSoort) {
  const labels = LABELS[soort];
  const resend = new Resend((process.env.RESEND_API_KEY ?? "").trim());

  let fd: FormData;
  try {
    fd = await req.formData();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Het formulier was te groot om te versturen. Probeer het met minder of kleinere foto's." },
      { status: 413 }
    );
  }

  // Verborgen veld dat een mens nooit invult. Zit er iets in, dan was het een bot; we
  // doen alsof alles goed ging zodat hij niet gaat zitten proberen.
  if (tekst(fd, "website")) return NextResponse.json({ ok: true });

  const naam = tekst(fd, "naam", 120);
  const email = tekst(fd, "email", 160);
  const telefoon = tekst(fd, "telefoon", 40);
  const kenteken = tekst(fd, "kenteken", 12).toUpperCase().replace(/[^A-Z0-9-]/g, "");
  const km = tekst(fd, "km", 12).replace(/\D/g, "");
  const bijzonderheden = tekst(fd, "bijzonderheden", 2000);
  const mijnAuto = tekst(fd, "mijnAuto", 160); // wat de RDW-opzoeking opleverde
  const autoNaam = tekst(fd, "autoNaam", 160);
  const autoIdRuw = tekst(fd, "autoId", 12);
  const autoId = /^\d+$/.test(autoIdRuw) ? Number(autoIdRuw) : null;
  const autoUrl = tekst(fd, "autoUrl", 300);
  const gewenstePrijs = tekst(fd, "gewenstePrijs", 12).replace(/\D/g, "");

  if (!naam || !email || !kenteken) {
    return NextResponse.json(
      { ok: false, error: "Vul in elk geval je naam, e-mailadres en kenteken in." },
      { status: 400 }
    );
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "Dat e-mailadres lijkt niet te kloppen." }, { status: 400 });
  }

  const fotos = (fd.getAll("fotos") as File[])
    .filter((f) => f && typeof f === "object" && f.size > 0 && f.type.startsWith("image/"))
    .slice(0, MAX_FOTOS);

  // Dezelfde aanvraag nog een keer? Dan doen we alsof het gelukt is en versturen we niets.
  // Let op het filter op `onderwerp`: beide formulieren vragen naar het kenteken van de
  // eigen auto van de bezoeker, dus zonder dat zou iemand die eerst een taxatie aanvraagt
  // en daarna dezelfde auto wil inruilen zijn tweede aanvraag stil zien verdwijnen.
  // Dat vangt het dubbelklikken van een ongeduldige klant af én het simpelste misbruik:
  // een script dat hetzelfde formulier in een lus afvuurt vult zo geen mailbox meer.
  // Een echte snelheidsbegrenzer per IP hoort in de Vercel Firewall thuis, niet hier.
  try {
    const recent = await sql`
      SELECT 1 FROM leads
      WHERE email = ${email} AND kenteken = ${kenteken}
        AND onderwerp = ${labels.onderwerp}
        AND aangemaakt > NOW() - INTERVAL '15 minutes'
      LIMIT 1
    `;
    if (recent.length > 0) return NextResponse.json({ ok: true });
  } catch {
    // Ligt de database eruit, dan is dat geen reden om de aanvraag tegen te houden.
  }

  const kmTekst = km ? `${parseInt(km, 10).toLocaleString("nl-NL")} km` : "";
  // Met duizendtallen, zoals het dashboard bedragen ook noteert ("17.500").
  const prijsTekst = gewenstePrijs ? parseInt(gewenstePrijs, 10).toLocaleString("nl-NL") : "";

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e2e8f0;">
      <div style="background:#001337;padding:24px;text-align:center">
        <h1 style="color:#ffffff;font-family:Georgia,serif;margin:0">JG Mobility</h1>
        <p style="color:rgba(255,255,255,0.6);font-size:12px;margin:8px 0 0">${labels.mailkop}</p>
      </div>
      <div style="padding:32px;background:#f8f8f8">
        <h2 style="color:#001337;font-family:Georgia,serif;font-size:18px;margin:0 0 16px">Auto van de klant</h2>
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
          ${rij("Kenteken", kenteken)}
          ${rij("Voertuig", mijnAuto)}
          ${rij("Kilometerstand", kmTekst)}
          ${rij("Gewenste prijs", prijsTekst ? `€ ${prijsTekst}` : "")}
          ${rij("Foto's", fotos.length ? `${fotos.length} meegestuurd (aparte mail)` : "geen")}
        </table>
        ${
          bijzonderheden
            ? `<div style="padding:16px;background:white;border-left:3px solid #001337;margin-bottom:24px"><p style="font-size:12px;color:#666;margin:0 0 6px">Bijzonderheden</p><p style="font-size:13px;color:#001337;margin:0;white-space:pre-wrap">${veilig(bijzonderheden)}</p></div>`
            : ""
        }
        ${
          autoNaam
            ? `<h2 style="color:#001337;font-family:Georgia,serif;font-size:18px;margin:0 0 16px">Interesse in</h2>
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
          ${rij("Voertuig", autoNaam)}
          ${autoUrl ? `<tr><td style="padding:6px 0;font-size:13px;color:#666;width:150px">Pagina:</td><td style="padding:6px 0;font-size:13px"><a href="${veilig(autoUrl)}">${veilig(autoUrl)}</a></td></tr>` : ""}
        </table>`
            : ""
        }
        <h2 style="color:#001337;font-family:Georgia,serif;font-size:18px;margin:0 0 16px">Contactgegevens</h2>
        <table style="width:100%;border-collapse:collapse">
          ${rij("Naam", naam)}
          <tr><td style="padding:6px 0;font-size:13px;color:#666;width:150px">E-mail:</td><td style="padding:6px 0;font-size:13px;color:#001337"><a href="mailto:${veilig(email)}">${veilig(email)}</a></td></tr>
          ${rij("Telefoon", telefoon)}
        </table>
      </div>
    </div>
  `;

  // ── De bijlagen alvast klaarmaken ──────────────────────────────────────────────
  // Dit gebeurt bewust vóór het antwoord: de foto's zitten na formData() in het geheugen
  // van dit verzoek, en dat wil je niet meer aanraken als het verzoek al is afgerond.
  // Het omzetten kost milliseconden; het versturen is het trage deel en dat gaat erna.
  const bijlagen: { filename: string; content: string }[] = [];
  let totaalBytes = 0;
  for (const [i, foto] of fotos.entries()) {
    if (totaalBytes + foto.size > MAX_BIJLAGEN_BYTES) break;
    totaalBytes += foto.size;
    try {
      const buf = await foto.arrayBuffer();
      const ext = (foto.name.split(".").pop() || "jpg").toLowerCase().slice(0, 5);
      bijlagen.push({ filename: `${kenteken}-${i + 1}.${ext}`, content: Buffer.from(buf).toString("base64") });
    } catch (e) {
      console.error("Foto kon niet gelezen worden:", e);
    }
  }

  /** De mail met de gegevens. Geeft terug of het lukte. */
  const stuurHoofdmail = async () => {
    const { error } = await resend.emails.send({
      from: "JG Mobility Website <noreply@jgmobility.nl>",
      to: TO_EMAIL,
      replyTo: email,
      subject: `${labels.mailkop}: ${kenteken}${mijnAuto ? ` (${mijnAuto})` : ""}${autoNaam ? ` — interesse in ${autoNaam}` : ""}`,
      html,
    });
    if (error) console.error(`Resend fout (${soort}):`, error);
    return !error;
  };

  /**
   * De ontvangstbevestiging voor de klant. Eén gedeelde helper voor alle formulieren op
   * deze site, zie lib/bevestigingsmail.ts — die slikt zijn eigen fouten in, dus dit kan
   * de aanvraag nooit laten mislukken.
   */
  const stuurKlantbevestiging = async () => {
    await stuurBevestigingsmail({
      naar: email,
      titel: labels.klantTitel,
      onderwerp: labels.klantOnderwerp,
      regels: [
        { label: "Kenteken", waarde: kenteken },
        { label: "Voertuig", waarde: mijnAuto },
        { label: "Kilometerstand", waarde: kmTekst },
        { label: "Gewenste prijs", waarde: prijsTekst ? `€ ${prijsTekst}` : "" },
        { label: "Bijzonderheden", waarde: bijzonderheden },
        { label: "Interesse in", waarde: autoNaam },
        { label: "Foto's", waarde: bijlagen.length ? `${bijlagen.length} meegestuurd` : "" },
        { label: "Telefoon", waarde: telefoon },
      ],
      slot: labels.klantSlot,
    });
  };

  /** De foto's, in een tweede mail. Zo komt de hoofdmail altijd aan, ook als dit misgaat. */
  const stuurFotomail = async () => {
    if (bijlagen.length === 0) return;
    try {
      await resend.emails.send({
        from: "JG Mobility Website <noreply@jgmobility.nl>",
        to: TO_EMAIL,
        replyTo: email,
        subject: `Foto's bij ${soort}aanvraag ${kenteken} (${naam})`,
        html: `<p style="font-family:Arial;font-size:13px;color:#001337">Foto's van de auto van ${veilig(naam)} — kenteken ${veilig(kenteken)}.</p>`,
        attachments: bijlagen,
      });
    } catch (e) {
      console.error(`Fotomail bij ${soort}aanvraag mislukt:`, e);
    }
  };

  // ── Vastleggen: het snelste én het duurzaamste ─────────────────────────────────
  const notitie = [
    kmTekst && `Kilometerstand: ${kmTekst}`,
    bijlagen.length ? `${bijlagen.length} foto's per mail` : "geen foto's",
  ]
    .filter(Boolean)
    .join(" · ");

  let opgeslagen = false;
  try {
    const id = `aan_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    await sql`
      INSERT INTO leads (
        id, naam, telefoon, email, bron, interesse, notitie, status,
        onderwerp, kenteken, auto_id, auto_naam, inruil, bericht, bod
      ) VALUES (
        ${id}, ${naam}, ${telefoon}, ${email}, 'website', ${autoNaam}, ${notitie}, 'nieuw',
        ${labels.onderwerp}, ${kenteken}, ${autoId}, ${autoNaam},
        ${[mijnAuto, kmTekst].filter(Boolean).join(" · ")}, ${bijzonderheden}, ${prijsTekst}
      )
    `;
    opgeslagen = true;
  } catch (e) {
    console.error(`Aanvraag (${soort}) niet opgeslagen in leads:`, e);
  }

  // Staat de aanvraag in het dashboard, dan is hij binnen. De klant hoeft niet te wachten
  // tot de mails de deur uit zijn; die gaan er direct na het antwoord achteraan.
  if (opgeslagen) {
    after(async () => {
      await stuurHoofdmail();
      await stuurFotomail();
      await stuurKlantbevestiging();
    });
    return NextResponse.json({ ok: true });
  }

  // Database onbereikbaar: dan is de mail de enige weg, en wachten we er wél op.
  const gelukt = await stuurHoofdmail();
  if (!gelukt) {
    return NextResponse.json(
      { ok: false, error: "Het versturen lukte niet. Probeer het nog eens, of app ons even." },
      { status: 500 }
    );
  }
  after(async () => {
    await stuurFotomail();
    await stuurKlantbevestiging();
  });
  return NextResponse.json({ ok: true });
}
