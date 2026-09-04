import { NextRequest } from "next/server";
import { verwerkAutoAanvraag } from "@/lib/auto-aanvraag";

// Taxatieaanvraag vanaf Inkoop & Taxatie: de bezoeker wil weten wat zijn auto opbrengt,
// zonder dat er een auto uit ons aanbod bij hoort. Zie lib/auto-aanvraag.ts.
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  return verwerkAutoAanvraag(req, "taxatie");
}
