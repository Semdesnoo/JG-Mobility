import { NextRequest, NextResponse, after } from "next/server";
import { Resend } from "resend";
import sql from "@/lib/db";
import { stuurBevestigingsmail, veilig } from "@/lib/bevestigingsmail";

/**
 * De aanvraag onderaan /financial-lease.
 *
 * Het formulier is kort met opzet: naam, bedrijfsnaam, telefoon, e-mail, eventueel het
 * voertuig waar het om gaat en een bericht. De rest van het gesprek gaat per telefoon,
 * want wat een ondernemer kan leasen hangt af van zijn cijfers en niet van een webformulier.
 *
 * WAT ER MET ZO'N AANVRAAG GEBEURT
 * 1. Er gaat een mail naar info@jgmobility.nl — dezelfde opmaak als de contactmail.
 * 2. De aanvraag komt in de tabel `leads`, en dus in het Aanvragen-overzicht van het
 *    dashboard. Mislukt dat, dan is de mail nog steeds onderweg; het mag de aanvraag
 *    nooit tegenhouden.
 * 3. De klant krijgt zijn ontvangstbevestiging, met `after()` ná het antwoord zodat hij
 *    er niet op wacht. Zie lib/bevestigingsmail.ts.
 *
 * Controleren gebeurt hier en niet alleen in de browser: het formulier is maar de voorkant,
 * deze route is de deur.
 */

const TO_EMAIL = "info@jgmobility.nl";

export const maxDuration = 60;

/** Tekst uit de aanvraag: altijd string, altijd getrimd, altijd begrensd. */
function tekst(waarde: unknown, maxLengte: number): string {
  return typeof waarde === "string" ? waarde.trim().slice(0, maxLengte) : "";
}

const rij = (label: string, waarde: string) =>
  waarde
    ? `<tr><td style="padding:6px 0;font-size:13px;color:#666;width:150px">${label}:</td><td style="padding:6px 0;font-size:13px;color:#001337;font-weight:bold;white-space:pre-wrap">${veilig(waarde)}</td></tr>`
    : "";

export async function POST(req: NextRequest) {
  // .trim() op de key: onzichtbare tekens uit het plakken in Vercel laten Resend anders
  // struikelen op de Authorization-header. Zelfde reden als in /api/contact.
  const resend = new Resend((process.env.RESEND_API_KEY ?? "").trim());

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "We konden je aanvraag niet lezen." }, { status: 400 });
  }

  // Verborgen veld dat een mens nooit invult. Zit er iets in, dan was het een bot; we
  // doen alsof alles goed ging zodat hij niet gaat zitten proberen.
  if (tekst(body.website, 100)) return NextResponse.json({ ok: true });

  const naam = tekst(body.naam, 120);
  const bedrijfsnaam = tekst(body.bedrijfsnaam, 160);
  const telefoon = tekst(body.telefoon, 40);
  const email = tekst(body.email, 160);
  const voertuig = tekst(body.voertuig, 200);
  const bericht = tekst(body.bericht, 2000);

  if (!naam || !bedrijfsnaam || !telefoon || !email) {
    return NextResponse.json(
      { ok: false, error: "Vul je naam, bedrijfsnaam, telefoonnummer en e-mailadres in." },
      { status: 400 }
    );
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "Dat e-mailadres lijkt niet te kloppen." }, { status: 400 });
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0;">
      <div style="background: #001337; padding: 24px; text-align: center;">
        <h1 style="color: #ffffff; font-family: Georgia, serif; margin: 0;">JG Mobility</h1>
        <p style="color: rgba(255,255,255,0.6); font-size: 12px; margin: 8px 0 0;">Nieuwe financial lease-aanvraag</p>
      </div>
      <div style="padding: 32px; background: #f8f8f8;">
        <table style="width: 100%; border-collapse: collapse;">
          ${rij("Naam", naam)}
          ${rij("Bedrijfsnaam", bedrijfsnaam)}
          <tr><td style="padding:6px 0;font-size:13px;color:#666;width:150px">E-mail:</td><td style="padding:6px 0;font-size:13px;color:#001337"><a href="mailto:${veilig(email)}">${veilig(email)}</a></td></tr>
          ${rij("Telefoon", telefoon)}
          ${rij("Gewenst voertuig", voertuig)}
        </table>
        ${
          bericht
            ? `<div style="margin-top:24px;padding:16px;background:white;border-left:3px solid #001337;border-radius:0"><p style="font-size:12px;color:#666;margin:0 0 6px">Bericht</p><p style="font-size:13px;color:#001337;margin:0;white-space:pre-wrap">${veilig(bericht)}</p></div>`
            : ""
        }
      </div>
    </div>
  `;

  const { error } = await resend.emails.send({
    from: "JG Mobility Website <noreply@jgmobility.nl>",
    to: TO_EMAIL,
    replyTo: email,
    subject: `Financial lease-aanvraag: ${bedrijfsnaam}${voertuig ? ` — ${voertuig}` : ""}`,
    html,
  });
  if (error) {
    console.error("Resend fout (financial lease):", error);
    return NextResponse.json(
      { ok: false, error: "Het versturen lukte niet. Probeer het nog eens, of bel ons even." },
      { status: 500 }
    );
  }

  // In het dashboard erbij, zodat een leaseaanvraag niet alleen in een mailbox leeft.
  // Mislukt dit, dan is de mail al weg en heeft de klant er niets aan om dat te weten.
  try {
    const id = `fl_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    await sql`
      INSERT INTO leads (id, naam, telefoon, email, bron, interesse, notitie, status, onderwerp, bericht)
      VALUES (
        ${id}, ${naam}, ${telefoon}, ${email}, 'website', ${voertuig}, ${bedrijfsnaam}, 'nieuw',
        'Financial lease-aanvraag via de website', ${bericht}
      )
    `;
  } catch (e) {
    console.error("Financial lease-aanvraag niet opgeslagen in leads:", e);
  }

  after(() =>
    stuurBevestigingsmail({
      naar: email,
      titel: "Financial lease-aanvraag ontvangen",
      onderwerp: "We hebben je financial lease-aanvraag ontvangen",
      regels: [
        { label: "Naam", waarde: naam },
        { label: "Bedrijfsnaam", waarde: bedrijfsnaam },
        { label: "Telefoon", waarde: telefoon },
        { label: "Gewenst voertuig", waarde: voertuig },
        { label: "Je bericht", waarde: bericht },
      ],
      slot: "We bellen je om door te nemen wat er mogelijk is. Houd je KvK-nummer bij de hand — daarmee kan de aanvraag bij In Lease Auto's meteen de deur uit.",
    })
  );

  return NextResponse.json({ ok: true });
}
