import { unstable_cache } from "next/cache";
import sql from "./db";
import type { Auto } from "./autos";

// Raw DB helpers — not cached, used only inside cached wrappers or write paths
async function _getAutos(): Promise<Auto[]> {
  const rows = await sql`SELECT data FROM autos ORDER BY id DESC`;
  return rows.map((r) => r.data as Auto);
}

async function _getAutoBySlug(slug: string): Promise<Auto | undefined> {
  const rows = await sql`SELECT data FROM autos WHERE slug = ${slug}`;
  if (rows[0]) return rows[0].data as Auto;
  const rows2 = await sql`SELECT data FROM autos WHERE data->>'slug' = ${slug}`;
  return rows2[0]?.data as Auto | undefined;
}

async function _getAutoById(id: number): Promise<Auto | undefined> {
  const rows = await sql`SELECT data FROM autos WHERE id = ${id}`;
  return rows[0]?.data as Auto | undefined;
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

// Write helpers — bypass cache (dashboard only)
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
