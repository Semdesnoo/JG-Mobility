import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAutos, getAutoBySlug, getAutoById } from "@/lib/autos-db";
import { prijsWeergave } from "@/lib/prijs";
import AutoDetailClient from "./AutoDetailClient";

const siteUrl = "https://www.jgmobility.nl";

// Foto's zijn óf relatieve /public-paden (oudere auto's) óf absolute Blob-URL's (nieuwe auto's).
// Voor OG-image en JSON-LD moeten het altijd absolute URL's zijn — relatieve paden krijgen de
// site-URL ervoor, absolute (http...) blijven ongewijzigd.
const fotoUrl = (f: string) => (f.startsWith("http") ? f : `${siteUrl}${f}`);

export const revalidate = 300; // Hervalideer elke 5 minuten

export async function generateStaticParams() {
  const autos = await getAutos();
  return autos
    .filter((a) => a.slug)
    .map((a) => ({ id: a.slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await props.params;
  const numId = parseInt(id, 10);
  const [bySlug, byId] = await Promise.all([
    getAutoBySlug(id),
    !isNaN(numId) ? getAutoById(numId) : Promise.resolve(undefined),
  ]);
  const auto = bySlug ?? byId;
  if (!auto) return { title: "Voertuig niet gevonden" };

  // Hetzelfde bedrag als op de pagina zelf — bij een bedrijfswagen dus zonder btw,
  // met het achtervoegsel erbij zodat een zoekresultaat niet te goedkoop oogt.
  const prijs = prijsWeergave(auto);
  const prijsTekst = `${prijs.tekst}${prijs.achtervoegsel ? ` ${prijs.achtervoegsel}` : ""}`;
  const title = `${auto.merk} ${auto.model} — ${prijsTekst}`;
  const description = `Bekijk deze ${auto.merk} ${auto.model} uit ${auto.bouwjaar} met ${auto.km.toLocaleString("nl-NL")} km bij JG Mobility in Barendrecht. Prijs: ${prijsTekst}. ${auto.transmissie} | ${auto.brandstof}${auto.apk && auto.apk !== "Onbekend" ? ` | APK ${auto.apk}` : ""}.`;
  const url = `${siteUrl}/aanbod/${auto.slug || auto.id}`;

  return {
    title,
    description,
    keywords: [
      `${auto.merk} ${auto.model} kopen`,
      `${auto.merk} ${auto.model} occasion`,
      `${auto.merk} ${auto.model} Barendrecht`,
      `${auto.merk} ${auto.model} Rotterdam`,
      `${auto.merk} occasion Barendrecht`,
      "occasions Barendrecht",
      "JG Mobility",
    ],
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | JG Mobility`,
      description,
      url,
      type: "website",
      images: auto.fotos?.[0]
        ? [{ url: fotoUrl(auto.fotos[0]), alt: `${auto.merk} ${auto.model}` }]
        : undefined,
    },
  };
}

export default async function AutoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Fetch auto + full list in parallel (both are cached after first hit)
  const numId = parseInt(id, 10);
  const [autoBySlug, autoById, autos] = await Promise.all([
    getAutoBySlug(id),
    !isNaN(numId) ? getAutoById(numId) : Promise.resolve(undefined),
    getAutos(),
  ]);

  const auto = autoBySlug ?? autoById;
  if (!auto) notFound();

  const idx = autos.findIndex((a) => a.slug === id || String(a.id) === id);
  const vorigeAuto = autos[idx + 1];
  const volgendeAuto = autos[idx - 1];

  const autoUrl = `${siteUrl}/aanbod/${auto.slug || auto.id}`;
  const getoondeP = prijsWeergave(auto);
  const carSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Car",
        "@id": `${autoUrl}#vehicle`,
        name: `${auto.merk} ${auto.model}`,
        description: auto.omschrijving,
        brand: { "@type": "Brand", name: auto.merk },
        model: auto.model,
        vehicleModelDate: String(auto.bouwjaar),
        itemCondition: "https://schema.org/UsedCondition",
        mileageFromOdometer: {
          "@type": "QuantitativeValue",
          value: auto.km,
          unitCode: "KMT",
        },
        fuelType: auto.brandstof,
        vehicleTransmission: auto.transmissie,
        color: auto.kleurExterieur || auto.kleur,
        offers: {
          "@type": "Offer",
          // Google wil het bedrag zien dat ook op de pagina staat. Bij een bedrijfswagen
          // is dat het bedrag zonder btw — vandaar de priceSpecification eronder, die
          // erbij vertelt of de btw er al in zit.
          price: getoondeP.bedrag,
          priceCurrency: "EUR",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: getoondeP.bedrag,
            priceCurrency: "EUR",
            valueAddedTaxIncluded: !auto.prijsExclBtw,
          },
          availability: auto.verkocht
            ? "https://schema.org/SoldOut"
            : "https://schema.org/InStock",
          seller: { "@id": `${siteUrl}/#organization` },
          url: autoUrl,
        },
        image: auto.fotos?.map(fotoUrl) ?? [],
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${autoUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "Aanbod", item: `${siteUrl}/aanbod` },
          { "@type": "ListItem", position: 3, name: `${auto.merk} ${auto.model}`, item: autoUrl },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(carSchema) }}
      />
      <AutoDetailClient
        auto={auto}
        vorigeAuto={vorigeAuto}
        volgendeAuto={volgendeAuto}
        autoUrl={autoUrl}
      />
    </>
  );
}
