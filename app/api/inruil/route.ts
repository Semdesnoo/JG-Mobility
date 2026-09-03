import { NextRequest, NextResponse, after } from "next/server";
import { Resend } from "resend";
import sql from "@/lib/db";

/**
 * Inruilaanvraag vanaf een autopagina.
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

export const maxDuration = 60;

/** Tekst uit een formulier: altijd string, altijd getrimd, altijd begrensd. */
function tekst(fd: FormData, veld: string, maxLengte = 500): string {
  const waarde = fd.get(veld);
  return typeof waarde === "string" ? waarde.trim().slice(0, maxLengte) : "";
}

/** Voorkomt dat ingevoerde tekst als HTML in de mail terechtkomt. */
function veilig(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const rij = (label: string, waarde: string) =>
  waarde
    ? `<tr><td style="padding:6px 0;font-size:13px;color:#666;width:150px">${label}:</td><td style="padding:6px 0;font-size:13px;color:#001337;font-weight:bold">${veilig(waarde)}</td></tr>`
    : "";

export async function POST(req: NextRequest) {
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
  // Dat vangt het dubbelklikken van een ongeduldige klant af én het simpelste misbruik:
  // een script dat hetzelfde formulier in een lus afvuurt vult zo geen mailbox meer.
  // Een echte snelheidsbegrenzer per IP hoort in de Vercel Firewall thuis, niet hier.
  try {
    const recent = await sql`
      SELECT 1 FROM leads
      WHERE email = ${email} AND kenteken = ${kenteken}
        AND aangemaakt > NOW() - INTERVAL '15 minutes'
      LIMIT 1
    `;
    if (recent.length > 0) return NextResponse.json({ ok: true });
  } catch {
    // Ligt de database eruit, dan is dat geen reden om de aanvraag tegen te houden.
  }

  const kmTekst = km ? `${parseInt(km, 10).toLocaleString("nl-NL")} km` : "";

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:#001337;padding:24px;text-align:center">
        <h1 style="color:#ffffff;font-family:Georgia,serif;margin:0">JG Mobility</h1>
        <p style="color:rgba(255,255,255,0.6);font-size:12px;margin:8px 0 0">Nieuwe inruilaanvraag</p>
      </div>
      <div style="padding:32px;background:#f8f8f8">
        <h2 style="color:#001337;font-family:Georgia,serif;font-size:18px;margin:0 0 16px">Auto van de klant</h2>
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
          ${rij("Kenteken", kenteken)}
          ${rij("Voertuig", mijnAuto)}
          ${rij("Kilometerstand", kmTekst)}
          ${rij("Foto's", fotos.length ? `${fotos.length} meegestuurd (aparte mail)` : "geen")}
        </table>
        ${
          bijzonderheden
            ? `<div style="padding:16px;background:white;border-left:3px solid #001337;margin-bottom:24px"><p style="font-size:12px;color:#666;margin:0 0 6px">Bijzonderheden</p><p style="font-size:13px;color:#001337;margin:0;white-space:pre-wrap">${veilig(bijzonderheden)}</p></div>`
            : ""
        }
        <h2 style="color:#001337;font-family:Georgia,serif;font-size:18px;margin:0 0 16px">Interesse in</h2>
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
          ${rij("Voertuig", autoNaam)}
          ${autoUrl ? `<tr><td style="padding:6px 0;font-size:13px;color:#666;width:150px">Pagina:</td><td style="padding:6px 0;font-size:13px"><a href="${veilig(autoUrl)}">${veilig(autoUrl)}</a></td></tr>` : ""}
        </table>
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
      subject: `Inruilaanvraag: ${kenteken}${mijnAuto ? ` (${mijnAuto})` : ""} — interesse in ${autoNaam || "een voertuig"}`,
      html,
    });
    if (error) console.error("Resend fout (inruil):", error);
    return !error;
  };

  /** De foto's, in een tweede mail. Zo komt de hoofdmail altijd aan, ook als dit misgaat. */
  const stuurFotomail = async () => {
    if (bijlagen.length === 0) return;
    try {
      await resend.emails.send({
        from: "JG Mobility Website <noreply@jgmobility.nl>",
        to: TO_EMAIL,
        replyTo: email,
        subject: `Foto's bij inruilaanvraag ${kenteken} (${naam})`,
        html: `<p style="font-family:Arial;font-size:13px;color:#001337">Foto's van de inruilauto van ${veilig(naam)} — kenteken ${veilig(kenteken)}.</p>`,
        attachments: bijlagen,
      });
    } catch (e) {
      console.error("Fotomail bij inruilaanvraag mislukt:", e);
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
        onderwerp, kenteken, auto_id, auto_naam, inruil, bericht
      ) VALUES (
        ${id}, ${naam}, ${telefoon}, ${email}, 'website', ${autoNaam}, ${notitie}, 'nieuw',
        ${"Inruilaanvraag via de website"}, ${kenteken}, ${autoId}, ${autoNaam},
        ${[mijnAuto, kmTekst].filter(Boolean).join(" · ")}, ${bijzonderheden}
      )
    `;
    opgeslagen = true;
  } catch (e) {
    console.error("Inruilaanvraag niet opgeslagen in leads:", e);
  }

  // Staat de aanvraag in het dashboard, dan is hij binnen. De klant hoeft niet te wachten
  // tot de mails de deur uit zijn; die gaan er direct na het antwoord achteraan.
  if (opgeslagen) {
    after(async () => {
      await stuurHoofdmail();
      await stuurFotomail();
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
  after(stuurFotomail);
  return NextResponse.json({ ok: true });
}
