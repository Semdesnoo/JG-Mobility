import type { Metadata } from "next";

// Titel en omschrijving volgen de pagina: daar staat nu "Gratis inruilvoorstel" en niet
// meer "Inkoop & Taxatie". De inkoop- en taxatie-zoektermen blijven er wel in staan —
// daarop wordt gezocht, en het is nog steeds dezelfde dienst op dezelfde URL.
export const metadata: Metadata = {
  title: "Gratis inruilvoorstel — auto inruilen of verkopen",
  description:
    "Wat is je auto waard? Vul je kenteken in en ontvang binnen 24 uur een gratis inruilvoorstel van JG Mobility in Barendrecht. Inruilen tegen een voertuig uit ons aanbod of direct verkopen — altijd vrijblijvend.",
  keywords: [
    "auto inruilen Barendrecht",
    "inruilvoorstel auto",
    "gratis inruilvoorstel",
    "auto inkoop Barendrecht",
    "auto inkoop Rotterdam",
    "auto inkoop Ridderkerk",
    "auto inkoop Dordrecht",
    "auto taxatie Barendrecht",
    "auto taxatie Rotterdam",
    "auto verkopen Rotterdam",
    "auto verkopen Zuid-Holland",
    "gratis autotaxatie",
  ],
  alternates: { canonical: "https://www.jgmobility.nl/diensten/inkoop-taxatie" },
  openGraph: {
    title: "Gratis inruilvoorstel | JG Mobility",
    description:
      "Vul je kenteken in en ontvang binnen 24 uur een gratis inruilvoorstel. Inruilen of direct verkopen, altijd vrijblijvend. JG Mobility, Barendrecht.",
    url: "https://www.jgmobility.nl/diensten/inkoop-taxatie",
  },
};

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.jgmobility.nl" },
    { "@type": "ListItem", position: 2, name: "Diensten", item: "https://www.jgmobility.nl/diensten" },
    { "@type": "ListItem", position: 3, name: "Gratis inruilvoorstel", item: "https://www.jgmobility.nl/diensten/inkoop-taxatie" },
  ],
};

const service = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Gratis inruilvoorstel — auto inruilen, inkoop & taxatie",
  description:
    "Gratis en eerlijke taxatie van uw auto, gevolgd door een inruilvoorstel of directe inkoop tegen de beste marktprijs. Geen gedoe, snel geregeld.",
  provider: { "@type": "AutoDealer", name: "JG Mobility", url: "https://www.jgmobility.nl" },
  areaServed: ["Barendrecht", "Rotterdam", "Ridderkerk", "Dordrecht", "Hendrik-Ido-Ambacht", "Spijkenisse", "Capelle aan den IJssel", "Zwijndrecht", "Zuid-Holland"],
  serviceType: "Auto Inkoop en Taxatie",
};

export default function InkoopTaxatieLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }} />
      {children}
    </>
  );
}
