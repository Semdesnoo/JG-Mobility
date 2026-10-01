import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Over JG Mobility | Autobedrijf in Barendrecht",
  description:
    "JG Mobility is het autobedrijf van Jimi Gaillard in Barendrecht: bedrijfswagens en geselecteerde occasions, met inruil, financial lease en consignatie.",
  alternates: {
    canonical: "https://www.jgmobility.nl/over-ons",
  },
  openGraph: {
    title: "Over JG Mobility | Autobedrijf Barendrecht",
    description:
      "Bedrijfswagens en geselecteerde occasions uit Barendrecht. Maak kennis met Jimi Gaillard en lees waarvoor je bij JG Mobility terechtkomt.",
    url: "https://www.jgmobility.nl/over-ons",
  },
};

export default function OverOnsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
