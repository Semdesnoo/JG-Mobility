import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Diensten | Inruil, financial lease & consignatie Barendrecht",
  description:
    "De diensten van JG Mobility in Barendrecht: inruil & taxatie, financial lease voor ondernemers, consignatie en afleverpakketten. Ook in regio Rotterdam.",
  keywords: [
    "autobedrijf diensten Barendrecht",
    "financial lease bedrijfswagen",
    "auto inruilen Barendrecht",
    "auto taxatie Barendrecht",
    "auto consignatie Rotterdam",
    "bedrijfswagens Rotterdam",
  ],
  alternates: { canonical: "https://www.jgmobility.nl/diensten" },
  openGraph: {
    title: "Diensten | JG Mobility Barendrecht",
    description:
      "Inruil & taxatie, financial lease, consignatie en afleverpakketten bij JG Mobility. Actief in Barendrecht, Rotterdam en omgeving.",
    url: "https://www.jgmobility.nl/diensten",
  },
};

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.jgmobility.nl" },
    { "@type": "ListItem", position: 2, name: "Diensten", item: "https://www.jgmobility.nl/diensten" },
  ],
};

export default function DienstenLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      {children}
    </>
  );
}
