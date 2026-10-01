import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Bedrijfswagens, occasions & financial lease",
  description:
    "Artikelen over een bedrijfswagen kopen, occasions, inruil, financial lease, taxatie en consignatie. Geschreven door JG Mobility in Barendrecht.",
  alternates: {
    canonical: "https://www.jgmobility.nl/blog",
  },
  openGraph: {
    title: "Blog | JG Mobility Barendrecht",
    description:
      "Praktische artikelen over bedrijfswagens kopen, occasions, inruil, financial lease en consignatie — van JG Mobility in Barendrecht.",
    url: "https://www.jgmobility.nl/blog",
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
