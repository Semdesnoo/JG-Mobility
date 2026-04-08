import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const TO_EMAIL = "info@jgmobility.nl";

export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    // Contactformulier
    const body = await req.json();
    const { naam, email, telefoon, bericht } = body;

    await resend.emails.send({
      from: "JG Mobility Website <noreply@jgmobility.nl>",
      to: TO_EMAIL,
      replyTo: email,
      subject: `Nieuw contactbericht van ${naam}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #001337; padding: 24px; text-align: center;">
            <h1 style="color: #ffffff; font-family: Georgia, serif; margin: 0;">JG Mobility</h1>
            <p style="color: rgba(255,255,255,0.6); font-size: 12px; margin: 8px 0 0;">Nieuw contactbericht</p>
          </div>
          <div style="padding: 32px; background: #f8f8f8;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; font-size: 13px; color: #666; width: 120px;">Naam:</td><td style="padding: 8px 0; font-size: 13px; color: #001337; font-weight: bold;">${naam}</td></tr>
              <tr><td style="padding: 8px 0; font-size: 13px; color: #666;">E-mail:</td><td style="padding: 8px 0; font-size: 13px; color: #001337;"><a href="mailto:${email}">${email}</a></td></tr>
              ${telefoon ? `<tr><td style="padding: 8px 0; font-size: 13px; color: #666;">Telefoon:</td><td style="padding: 8px 0; font-size: 13px; color: #001337;">${telefoon}</td></tr>` : ""}
            </table>
            <div style="margin-top: 24px; padding: 16px; background: white; border-left: 3px solid #ffffff; border-radius: 4px;">
              <p style="font-size: 13px; color: #001337; margin: 0; white-space: pre-wrap;">${bericht}</p>
            </div>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  }

  // Consignatieformulier (multipart/form-data)
  const formData = await req.formData();
  const naam = formData.get("naam") as string;
  const email = formData.get("email") as string;
  const telefoon = formData.get("telefoon") as string;
  const merk = formData.get("merk") as string;
  const model = formData.get("model") as string;
  const bouwjaar = formData.get("bouwjaar") as string;
  const km = formData.get("km") as string;
  const vraagprijs = formData.get("vraagprijs") as string;
  const opmerking = formData.get("opmerking") as string;
  const fotos = formData.getAll("fotos") as File[];

  const fotoLijst = fotos.length > 0
    ? fotos.map((f) => `• ${f.name} (${(f.size / 1024).toFixed(0)} KB)`).join("\n")
    : "Geen foto's bijgevoegd";

  await resend.emails.send({
    from: "JG Mobility Website <noreply@jgmobility.nl>",
    to: TO_EMAIL,
    replyTo: email,
    subject: `Nieuwe consignatie-aanvraag: ${merk} ${model} (${bouwjaar})`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #001337; padding: 24px; text-align: center;">
          <h1 style="color: #ffffff; font-family: Georgia, serif; margin: 0;">JG Mobility</h1>
          <p style="color: rgba(255,255,255,0.6); font-size: 12px; margin: 8px 0 0;">Nieuwe consignatie-aanvraag</p>
        </div>
        <div style="padding: 32px; background: #f8f8f8;">
          <h2 style="color: #001337; font-family: Georgia, serif; font-size: 18px; margin: 0 0 16px;">Aanbieder</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr><td style="padding: 6px 0; font-size: 13px; color: #666; width: 120px;">Naam:</td><td style="padding: 6px 0; font-size: 13px; color: #001337; font-weight: bold;">${naam}</td></tr>
            <tr><td style="padding: 6px 0; font-size: 13px; color: #666;">E-mail:</td><td style="padding: 6px 0; font-size: 13px; color: #001337;"><a href="mailto:${email}">${email}</a></td></tr>
            ${telefoon ? `<tr><td style="padding: 6px 0; font-size: 13px; color: #666;">Telefoon:</td><td style="padding: 6px 0; font-size: 13px; color: #001337;">${telefoon}</td></tr>` : ""}
          </table>
          <h2 style="color: #001337; font-family: Georgia, serif; font-size: 18px; margin: 0 0 16px;">Auto</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr><td style="padding: 6px 0; font-size: 13px; color: #666; width: 120px;">Merk & Model:</td><td style="padding: 6px 0; font-size: 13px; color: #001337; font-weight: bold;">${merk} ${model}</td></tr>
            <tr><td style="padding: 6px 0; font-size: 13px; color: #666;">Bouwjaar:</td><td style="padding: 6px 0; font-size: 13px; color: #001337;">${bouwjaar}</td></tr>
            <tr><td style="padding: 6px 0; font-size: 13px; color: #666;">Kilometerstand:</td><td style="padding: 6px 0; font-size: 13px; color: #001337;">${parseInt(km).toLocaleString("nl-NL")} km</td></tr>
            ${vraagprijs ? `<tr><td style="padding: 6px 0; font-size: 13px; color: #666;">Vraagprijs:</td><td style="padding: 6px 0; font-size: 13px; color: #001337;">€${parseInt(vraagprijs).toLocaleString("nl-NL")}</td></tr>` : ""}
          </table>
          ${opmerking ? `<div style="padding: 16px; background: white; border-left: 3px solid #ffffff; border-radius: 4px; margin-bottom: 16px;"><p style="font-size: 13px; color: #001337; margin: 0; white-space: pre-wrap;">${opmerking}</p></div>` : ""}
          <div style="padding: 16px; background: white; border-radius: 4px;">
            <p style="font-size: 12px; color: #666; margin: 0 0 8px;">Bijgevoegde foto's (${fotos.length}):</p>
            <pre style="font-size: 12px; color: #001337; margin: 0;">${fotoLijst}</pre>
            <p style="font-size: 11px; color: #999; margin: 8px 0 0;">Foto's worden niet als bijlage verstuurd — reply op dit bericht om ze op te vragen.</p>
          </div>
        </div>
      </div>
    `,
  });

  return NextResponse.json({ ok: true });
}
