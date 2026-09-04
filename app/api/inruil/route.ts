import { NextRequest } from "next/server";
import { verwerkAutoAanvraag } from "@/lib/auto-aanvraag";

// Inruilaanvraag vanaf de pagina van een auto uit het aanbod. De verwerking is gedeeld
// met /api/taxatie; zie lib/auto-aanvraag.ts.
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  return verwerkAutoAanvraag(req, "inruil");
}
