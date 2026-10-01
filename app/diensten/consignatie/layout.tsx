import type { Metadata } from "next";

/**
 * Eigen metadata voor deze dienstpagina.
 *
 * WAAROM DIT BESTAND ER IS
 * `app/diensten/consignatie/page.tsx` is een client-component en kan dus zelf geen
 * `metadata` exporteren. Zonder deze layout erfde de pagina de titel van /diensten —
 * dan staan er twee pagina's met dezelfde titel in de zoekresultaten.
 */
export const metadata: Metadata = {
  title: "Consignatie | JG Mobility Barendrecht",
  description:
    "Zo werkt consignatie bij JG Mobility in Barendrecht: in vier stappen van aanmelden tot uitbetaling. Geen kosten vooraf, vergoeding alleen bij een succesvolle verkoop.",
  alternates: { canonical: "https://www.jgmobility.nl/diensten/consignatie" },
  openGraph: {
    title: "Consignatie | JG Mobility Barendrecht",
    description:
      "Uw auto laten verkopen via consignatie: wij verzorgen presentatie, bezichtigingen, onderhandeling en overdracht.",
    url: "https://www.jgmobility.nl/diensten/consignatie",
  },
};

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.jgmobility.nl" },
    { "@type": "ListItem", position: 2, name: "Diensten", item: "https://www.jgmobility.nl/diensten" },
    { "@type": "ListItem", position: 3, name: "Consignatie", item: "https://www.jgmobility.nl/diensten/consignatie" },
  ],
};

export default function ConsignatieDienstLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      {children}
    </>
  );
}
