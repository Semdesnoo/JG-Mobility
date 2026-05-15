import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAutos, getAutoBySlug, getAutoById } from "@/lib/autos-db";
import AutoDetailClient from "./AutoDetailClient";

const siteUrl = "https://www.jgmobility.nl";

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

  const title = `${auto.merk} ${auto.model} — €${auto.prijs.toLocaleString("nl-NL")}`;
  const description = `Bekijk deze ${auto.merk} ${auto.model} uit ${auto.bouwjaar} met ${auto.km.toLocaleString("nl-NL")} km bij JG Mobility in Barendrecht. Prijs: €${auto.prijs.toLocaleString("nl-NL")}. ${auto.transmissie} | ${auto.brandstof}${auto.apk && auto.apk !== "Onbekend" ? ` | APK ${auto.apk}` : ""}.`;
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
        ? [{ url: `${siteUrl}${auto.fotos[0]}`, alt: `${auto.merk} ${auto.model}` }]
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

  const carSchema = {
    "@context": "https://schema.org",
    "@type": "Car",
    name: `${auto.merk} ${auto.model}`,
    description: auto.omschrijving,
    brand: { "@type": "Brand", name: auto.merk },
    model: auto.model,
    vehicleModelDate: String(auto.bouwjaar),
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
      price: auto.prijs,
      priceCurrency: "EUR",
      availability: auto.verkocht
        ? "https://schema.org/SoldOut"
        : "https://schema.org/InStock",
      seller: {
        "@type": "AutoDealer",
        name: "JG Mobility",
        url: siteUrl,
      },
      url: `${siteUrl}/aanbod/${auto.slug || auto.id}`,
    },
    image: auto.fotos?.map((f) => `${siteUrl}${f}`) ?? [],
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
      />
    </>
  );
}
