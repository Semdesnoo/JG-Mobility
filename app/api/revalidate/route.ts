import { NextRequest } from "next/server";
import { revalidateTag } from "next/cache";

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");

  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // expire:0 = directe invalidatie (webhook-patroon). De admin roept dit aan ná het opslaan,
  // zodat een nieuwe/gewijzigde auto meteen op de site staat i.p.v. pas na de 300s-cache.
  revalidateTag("autos", { expire: 0 });
  return Response.json({ revalidated: true });
}
