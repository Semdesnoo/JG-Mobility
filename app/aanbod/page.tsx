import { Suspense } from "react";
import AanbodClient from "./AanbodClient";
import { getAutos } from "@/lib/autos-db";

export const revalidate = 300; // Hervalideer elke 5 minuten

export const metadata = {
  title: "Occasions & bedrijfswagens Barendrecht",
  description:
    "Bekijk het actuele aanbod van JG Mobility in Barendrecht: bedrijfswagens en geselecteerde occasions. Marge- en BTW-voertuigen, financial lease mogelijk en inruil welkom.",
  keywords: [
    "occasions Barendrecht",
    "bedrijfswagens Barendrecht",
    "bestelbus kopen Barendrecht",
    "occasions Rotterdam",
    "JG Mobility",
  ],
  alternates: {
    canonical: "https://www.jgmobility.nl/aanbod",
  },
  openGraph: {
    title: "Occasions & bedrijfswagens Barendrecht | JG Mobility",
    description:
      "Bedrijfswagens en geselecteerde occasions bij JG Mobility in Barendrecht. Marge- en BTW-voertuigen, financial lease mogelijk.",
    url: "https://www.jgmobility.nl/aanbod",
  },
};

export default async function AanbodPage() {
  const autos = await getAutos();
  return (
    <Suspense>
      <AanbodClient autos={autos} />
    </Suspense>
  );
}
