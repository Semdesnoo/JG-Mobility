import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { put } from "@vercel/blob";
import sql from "@/lib/db";

const TO_EMAIL = "info@jgmobility.nl";

/**
 * Het JG Mobility logo als data-URL, klaar om in mail-HTML te bakken.
 * Server-side lezen we het PNG-bestand en stoppen het als base64 in de HTML
 * zodat Gmail/Outlook de image niet als externe blokkeren.
 */
let _logoCache: string | null = null;
function logoDataUrl(): string {
  if (_logoCache) return _logoCache;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require("fs") as typeof import("fs");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const path = require("path") as typeof import("path");
    const p = path.join(process.cwd(), "public", "JG Mobility Transparant.png");
    const buf = fs.readFileSync(p);
    _logoCache = `data:image/png;base64,${buf.toString("base64")}`;
    return _logoCache;
  } catch {
    return "";
  }
}

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  // .trim() verwijdert onzichtbare tekens (zoals een BOM, U+FEFF) die per ongeluk
  // mee gekopieerd kunnen zijn bij het plakken van de key in Vercel — anders crasht
  // Resend op het opbouwen van de Authorization-header.
  const resend = new Resend((process.env.RESEND_API_KEY ?? "").trim());
  const contentType = req.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const body = await req.json();

    // Afspraakformulier
    if (body.type === "appointment") {
      const { email, telefoon, datum, tijd } = body;
      const { error: afspraakError } = await resend.emails.send({
        from: "JG Mobility Website <noreply@jgmobility.nl>",
        to: TO_EMAIL,
        replyTo: email,
        subject: `Nieuwe afspraak: ${datum} om ${tijd}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #001337; padding: 24px; text-align: center;">
              ${(() => {
                const src = logoDataUrl();
                return src
                  ? `<img src="${src}" alt="JG Mobility" width="100" style="display:block;margin:0 auto 12px;width:100px;max-width:100px;height:auto;border:0" />`
                  : "";
              })()}
              <h1 style="color: #ffffff; font-family: Georgia, serif; margin: 0;">JG Mobility</h1>
              <p style="color: rgba(255,255,255,0.6); font-size: 12px; margin: 8px 0 0;">Nieuwe afspraakverzoek</p>
            </div>
            <div style="padding: 32px; background: #f8f8f8;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; font-size: 13px; color: #666; width: 120px;">Datum:</td><td style="padding: 8px 0; font-size: 13px; color: #001337; font-weight: bold;">${datum}</td></tr>
                <tr><td style="padding: 8px 0; font-size: 13px; color: #666;">Tijd:</td><td style="padding: 8px 0; font-size: 13px; color: #001337; font-weight: bold;">${tijd}</td></tr>
                <tr><td style="padding: 8px 0; font-size: 13px; color: #666;">E-mail:</td><td style="padding: 8px 0; font-size: 13px; color: #001337;"><a href="mailto:${email}">${email}</a></td></tr>
                ${telefoon ? `<tr><td style="padding: 8px 0; font-size: 13px; color: #666;">Telefoon:</td><td style="padding: 8px 0; font-size: 13px; color: #001337;">${telefoon}</td></tr>` : ""}
              </table>
            </div>
          </div>
        `,
      });
      if (afspraakError) {
        console.error("Resend fout (afspraak):", afspraakError);
        return NextResponse.json({ ok: false, error: afspraakError.message }, { status: 500 });
      }
      return NextResponse.json({ ok: true });
    }

    // Contactformulier
    const { naam, email, telefoon, bericht } = body;

    const { error: contactError } = await resend.emails.send({
      from: "JG Mobility Website <noreply@jgmobility.nl>",
      to: TO_EMAIL,
      replyTo: email,
      subject: `Nieuw contactbericht van ${naam}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #001337; padding: 24px; text-align: center;">
            ${(() => {
              const src = logoDataUrl();
              return src
                ? `<img src="${src}" alt="JG Mobility" width="100" style="display:block;margin:0 auto 12px;width:100px;max-width:100px;height:auto;border:0" />`
                : "";
            })()}
            <h1 style="color: #ffffff; font-family: Georgia, serif; margin: 0;">JG Mobility</h1>
            <p style="color: rgba(255,255,255,0.6); font-size: 12px; margin: 8px 0 0;">Nieuw contactbericht</p>
          </div>
          <div style="padding: 32px; background: #f8f8f8;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; font-size: 13px; color: #666; width: 120px;">Naam:</td><td style="padding: 8px 0; font-size: 13px; color: #001337; font-weight: bold;">${naam}</td></tr>
              <tr><td style="padding: 8px 0; font-size: 13px; color: #666;">E-mail:</td><td style="padding: 8px 0; font-size: 13px; color: #001337;"><a href="mailto:${email}">${email}</a></td></tr>
              ${telefoon ? `<tr><td style="padding: 8px 0; font-size: 13px; color: #666;">Telefoon:</td><td style="padding: 8px 0; font-size: 13px; color: #001337;">${telefoon}</td></tr>` : ""}
            </table>
            <div style="margin-top: 24px; padding: 16px; background: white; border-left: 3px solid #ffffff; border-radius: 0;">
              <p style="font-size: 13px; color: #001337; margin: 0; white-space: pre-wrap;">${bericht}</p>
            </div>
          </div>
        </div>
      `,
    });

    if (contactError) {
      console.error("Resend fout (contact):", contactError);
      return NextResponse.json({ ok: false, error: contactError.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  }

  // Consignatieformulier (multipart/form-data)
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Formulier te groot (foto's verkleinen)" }, { status: 413 });
  }

  const naam = formData.get("naam") as string;
  const email = formData.get("email") as string;
  const telefoon = formData.get("telefoon") as string;
  const merk = formData.get("merk") as string;
  const model = formData.get("model") as string;
  const bouwjaar = formData.get("bouwjaar") as string;
  const km = formData.get("km") as string;
  const vraagprijs = formData.get("vraagprijs") as string;
  const opmerking = formData.get("opmerking") as string;
  const fotos = (formData.getAll("fotos") as File[]).filter(f => f.size > 0);

  const fotoNamen = fotos.filter(f => f.size > 0).map(f => `• ${f.name} (${(f.size / 1024).toFixed(0)} KB)`).join("<br/>");

  const mailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #001337; padding: 24px; text-align: center;">
        ${(() => {
          const src = logoDataUrl();
          return src
            ? `<img src="${src}" alt="JG Mobility" width="100" style="display:block;margin:0 auto 12px;width:100px;max-width:100px;height:auto;border:0" />`
            : "";
        })()}
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
        ${opmerking ? `<div style="padding: 16px; background: white; border-left: 3px solid #001337; border-radius: 0; margin-bottom: 16px;"><p style="font-size: 13px; color: #001337; margin: 0; white-space: pre-wrap;">${opmerking}</p></div>` : ""}
        ${fotoNamen ? `<div style="padding: 16px; background: white; border-radius: 0;"><p style="font-size: 12px; color: #666; margin: 0 0 6px;">Bijgevoegde foto's:</p><p style="font-size: 12px; color: #001337; margin: 0;">${fotoNamen}</p></div>` : ""}
      </div>
    </div>
  `;

  // Stap 1: stuur altijd de hoofdmail (zonder foto's) — gegarandeerde levering
  const result = await resend.emails.send({
    from: "JG Mobility Website <noreply@jgmobility.nl>",
    to: TO_EMAIL,
    replyTo: email,
    subject: `Nieuwe consignatie-aanvraag: ${merk} ${model} (${bouwjaar})`,
    html: mailHtml,
  });
  if (result.error) {
    console.error("Resend fout:", result.error);
    return NextResponse.json({ ok: false, error: result.error.message }, { status: 500 });
  }

  // Consignatie-aanvraag: sleutels voor blob-pad en database-rij.
  const now = new Date();
  const id = `cos_${Date.now()}`;
  const datum = now.toLocaleDateString("nl-NL");
  const tijd = now.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" });

  // Foto's naar Vercel Blob uploaden zodat ze in het dashboard te bekijken zijn.
  // Zonder token (bijv. lokaal) of bij een fout valt dit netjes weg: de aanvraag en de
  // mail met bijlagen gaan sowieso door. De publieke blob-URL's zijn dezelfde opslag die
  // het admin-dashboard al gebruikt voor de voorraadfoto's.
  const fotoUrls: string[] = [];
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    for (const foto of fotos) {
      if (fotoUrls.length >= 10) break;
      try {
        const veilig = (foto.name || "foto").replace(/[^a-zA-Z0-9._-]/g, "_");
        const blob = await put(`consignatie/${id}/${veilig}`, foto, {
          access: "public",
          addRandomSuffix: true,
        });
        fotoUrls.push(blob.url);
      } catch {
        // upload van deze foto mislukt — sla over, de rest gaat door
      }
    }
  }

  // Sla op in database
  try {
    await sql`ALTER TABLE cosignaties ADD COLUMN IF NOT EXISTS fotos JSONB DEFAULT '[]'`.catch(() => null);
    await sql`
      INSERT INTO cosignaties (id, datum, tijd, naam, email, telefoon, merk, model, bouwjaar, km, vraagprijs, opmerking, aantal_fotos, fotos)
      VALUES (${id}, ${datum}, ${tijd}, ${naam ?? ""}, ${email ?? ""}, ${telefoon ?? ""}, ${merk ?? ""}, ${model ?? ""}, ${bouwjaar ?? ""}, ${km ?? ""}, ${vraagprijs ?? ""}, ${opmerking ?? ""}, ${fotos.length}, ${JSON.stringify(fotoUrls)}::jsonb)
    `;
  } catch {
    // DB opslaan mislukt → mail is al verstuurd, geen blocker
  }

  // Stap 2: probeer foto's als bijlage in aparte mail — fout hier stopt de bevestiging niet
  const geldigeFotos = fotos.filter(f => f.size > 0);
  if (geldigeFotos.length > 0) {
    try {
      const bijlagen: { filename: string; content: string }[] = [];
      let totaal = 0;
      for (const foto of geldigeFotos) {
        if (totaal + foto.size > 3.5 * 1024 * 1024) break;
        totaal += foto.size;
        const buf = await foto.arrayBuffer();
        bijlagen.push({ filename: foto.name, content: Buffer.from(buf).toString("base64") });
      }
      if (bijlagen.length > 0) {
        await resend.emails.send({
          from: "JG Mobility Website <noreply@jgmobility.nl>",
          to: TO_EMAIL,
          replyTo: email,
          subject: `Foto's bij consignatie: ${merk} ${model} (${naam})`,
          html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
            <div style="background:#001337;padding:20px;text-align:center">
              ${(() => {
                const src = logoDataUrl();
                return src
                  ? `<img src="${src}" alt="JG Mobility" width="90" style="display:block;margin:0 auto 10px;width:90px;max-width:90px;height:auto;border:0" />`
                  : "";
              })()}
              <div style="color:rgba(255,255,255,0.6);font-size:11px;letter-spacing:1.5px;text-transform:uppercase">Foto's bij consignatie</div>
            </div>
            <div style="padding:24px;background:#f8f8f8">
              <p style="font-family:Arial;font-size:13px;color:#001337;margin:0;">Zie bijlagen voor de foto's van de ${merk} ${model} van ${naam}.</p>
            </div>
          </div>`,
          attachments: bijlagen.map(b => ({ filename: b.filename, content: b.content })),
        });
      }
    } catch {
      // foto-mail mislukt → hoofdmail is al verstuurd, geen probleem
    }
  }

  return NextResponse.json({ ok: true });
}
