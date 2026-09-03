import { unstable_cache } from "next/cache";
import sql from "./db";
import type { Auto } from "./autos";

// Interne velden — wel in de gedeelde database (het dashboard werkt ermee), niet op
// deze site. Een pagina geeft het hele auto-object door aan een client-component, dus
// alles wat hier blijft staan komt letterlijk in de paginabron terecht, ook als het
// nergens op het scherm wordt getoond. Daarom strippen we het op één plek: bij het
// uitlezen. Dan kan geen enkele pagina het per ongeluk alsnog meesturen.
const INTERNE_VELDEN = ["vin"] as const;

function zonderInterneVelden(auto: Auto): Auto {
  const schoon = { ...auto };
  for (const veld of INTERNE_VELDEN) delete schoon[veld];
  return schoon;
}

// Verborgen auto's bestaan wel — het dashboard werkt er gewoon mee — maar ze horen deze
// site nergens in. Dat wordt hier afgehandeld en nergens anders: haal je ze bij het
// uitlezen weg, dan verdwijnen ze in één klap uit het aanbod, van de homepage, uit de
// sitemap én uit de vorige/volgende-navigatie, en geeft hun eigen pagina een 404. Een
// filter per pagina zou je er vroeg of laat één vergeten.
const zichtbaar = (a: Auto) => !a.verborgen;

/** Klaarmaken voor de site: verborgen auto's bestaan niet, interne velden gaan eraf. */
function voorDeSite(auto: Auto | undefined): Auto | undefined {
  if (!auto || !zichtbaar(auto)) return undefined;
  return zonderInterneVelden(auto);
}

// Raw DB helpers — not cached, used only inside cached wrappers or write paths
async function _getAutos(): Promise<Auto[]> {
  const rows = await sql`SELECT data FROM autos ORDER BY id DESC`;
  return rows
    .map((r) => r.data as Auto)
    .filter(zichtbaar)
    .map(zonderInterneVelden);
}

async function _getAutoBySlug(slug: string): Promise<Auto | undefined> {
  const rows = await sql`SELECT data FROM autos WHERE slug = ${slug}`;
  if (rows[0]) return voorDeSite(rows[0].data as Auto);
  const rows2 = await sql`SELECT data FROM autos WHERE data->>'slug' = ${slug}`;
  return voorDeSite(rows2[0]?.data as Auto | undefined);
}

async function _getAutoById(id: number): Promise<Auto | undefined> {
  const rows = await sql`SELECT data FROM autos WHERE id = ${id}`;
  return voorDeSite(rows[0]?.data as Auto | undefined);
}

// Cached exports — Next.js Data Cache, survives between requests on the same instance
export const getAutos = unstable_cache(_getAutos, ["autos-list"], {
  revalidate: 300,
  tags: ["autos"],
});

export const getAutoBySlug = unstable_cache(
  _getAutoBySlug,
  ["auto-by-slug"],
  { revalidate: 300, tags: ["autos"] }
);

export const getAutoById = unstable_cache(
  _getAutoById,
  ["auto-by-id"],
  { revalidate: 300, tags: ["autos"] }
);

// Write helpers — bypass cache (dashboard only).
// Let op: wat je hier terugschrijft is uitgelezen data, en die is gestript. Opslaan van
// een auto hoort in het dashboard thuis; doe je het hier, dan wis je zijn VIN.
export async function saveAuto(auto: Auto): Promise<void> {
  await sql`
    INSERT INTO autos (id, slug, data)
    VALUES (${auto.id}, ${auto.slug}, ${JSON.stringify(auto)})
    ON CONFLICT (id) DO UPDATE SET slug = ${auto.slug}, data = ${JSON.stringify(auto)}
  `;
}

export async function deleteAuto(id: number): Promise<boolean> {
  const result = await sql`DELETE FROM autos WHERE id = ${id} RETURNING id`;
  return result.length > 0;
}

export async function getNextId(): Promise<number> {
  const rows = await sql`SELECT COALESCE(MAX(id), 0) AS max_id FROM autos`;
  return Number(rows[0].max_id) + 1;
}

export function generateSlug(merk: string, model: string): string {
  return `${merk}-${model}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
