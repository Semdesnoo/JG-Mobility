import { neon } from "@neondatabase/serverless";

// Lazy database-client. De Neon client wordt pas aangemaakt bij het eerste
// SQL-statement, zodat `next build` op Vercel niet faalt als DATABASE_URL niet
// in de build-omgeving staat (Vercel injecteert env vars pas bij runtime).
//
// Tijdens de build probeert Next.js ook statische routes als /sitemap.xml te
// collecten. Als de import-keten van zo'n route via deze module loopt, werd de
// `neon()`-call eerder direct op module-load gedaan en crashte de build met
// "No database connection string was provided".
type Neon = ReturnType<typeof neon>;
let _sql: Neon | null = null;
function sql(): Neon {
  if (_sql) return _sql;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is niet gezet. Voeg de Neon connection string toe aan " +
        "Vercel → Project → Settings → Environment Variables."
    );
  }
  _sql = neon(url);
  return _sql;
}

/**
 * Tagged-template handler die naar de lazy Neon client doorgeeft. Neon is zelf
 * een tagged-template-functie. We exposen dezelfde generieke signature zodat
 * aanroepen zoals `const autos = await sql<{data: Auto}>\`SELECT data FROM autos\``
 * getypeerd blijven zoals de Neon client zelf zou doen.
 *
 * De cast naar `any` aan de grens is nodig omdat `Object.assign` met tagged-
 * templates moeite heeft met TS-strict. Runtime-gedrag blijft 100% identiek.
 */
interface SqlTag {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  <T extends Record<string, any> = Record<string, any>>(
    strings: TemplateStringsArray,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...values: any[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<T[]>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transaction<T>(fn: (tx: any) => Promise<T>): Promise<T>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const taggedFn = ((strings: TemplateStringsArray, ...values: unknown[]) => {
  const client = sql() as unknown as <T extends Record<string, unknown>>(
    s: TemplateStringsArray,
    ...v: unknown[]
  ) => Promise<T[]>;
  return client(strings, ...values);
}) as unknown as <T extends Record<string, unknown>>(
  s: TemplateStringsArray,
  ...v: unknown[]
) => Promise<T[]>;

const handler = Object.assign(taggedFn, {
  transaction<T>(fn: (tx: unknown) => Promise<T>): Promise<T> {
    const client = sql() as unknown as { transaction: <U>(f: (tx: unknown) => Promise<U>) => Promise<U> };
    return client.transaction(fn);
  },
}) as unknown as SqlTag;

export default handler;

export async function initDB() {
  // Gebruikt de lazy Neon client direct. Door de cast naar `any` aan de grens
  // accepteert TS de tagged-template-syntax zonder gedoe met Object.assign.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client = sql() as any;
  await client`
    CREATE TABLE IF NOT EXISTS autos (
      id INTEGER PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      data JSONB NOT NULL
    )
  `;
  await client`
    CREATE TABLE IF NOT EXISTS bellog (
      id TEXT PRIMARY KEY,
      datum TEXT NOT NULL,
      tijd TEXT NOT NULL,
      nummer TEXT DEFAULT '',
      naam TEXT DEFAULT '',
      notitie TEXT DEFAULT '',
      terugbellen BOOLEAN DEFAULT false,
      afgehandeld BOOLEAN DEFAULT false
    )
  `;
  await client`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `;
  await client`
    CREATE TABLE IF NOT EXISTS facturen (
      id TEXT PRIMARY KEY,
      factuur_nr TEXT NOT NULL,
      datum TEXT NOT NULL,
      vervaldatum TEXT DEFAULT '',
      klant_naam TEXT DEFAULT '',
      klant_adres TEXT DEFAULT '',
      klant_postcode TEXT DEFAULT '',
      klant_stad TEXT DEFAULT '',
      klant_email TEXT DEFAULT '',
      klant_telefoon TEXT DEFAULT '',
      auto_merk TEXT DEFAULT '',
      auto_model TEXT DEFAULT '',
      auto_bouwjaar TEXT DEFAULT '',
      auto_kenteken TEXT DEFAULT '',
      auto_km TEXT DEFAULT '',
      auto_kleur TEXT DEFAULT '',
      auto_vin TEXT DEFAULT '',
      verkoopprijs INTEGER DEFAULT 0,
      btw_type TEXT DEFAULT 'marge',
      betaalwijze TEXT DEFAULT 'bank',
      notitie TEXT DEFAULT '',
      status TEXT DEFAULT 'concept',
      regels TEXT DEFAULT '[]'
    )
  `;
  await client`ALTER TABLE facturen ADD COLUMN IF NOT EXISTS regels TEXT DEFAULT '[]'`.catch(() => null);
  await client`
    CREATE TABLE IF NOT EXISTS cosignaties (
      id TEXT PRIMARY KEY,
      datum TEXT NOT NULL,
      tijd TEXT NOT NULL,
      naam TEXT DEFAULT '',
      email TEXT DEFAULT '',
      telefoon TEXT DEFAULT '',
      merk TEXT DEFAULT '',
      model TEXT DEFAULT '',
      bouwjaar TEXT DEFAULT '',
      km TEXT DEFAULT '',
      vraagprijs TEXT DEFAULT '',
      opmerking TEXT DEFAULT '',
      aantal_fotos INTEGER DEFAULT 0,
      status TEXT DEFAULT 'nieuw',
      notitie TEXT DEFAULT ''
    )
  `;
}
