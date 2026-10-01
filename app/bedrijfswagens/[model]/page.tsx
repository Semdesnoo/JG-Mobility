import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import AutoKaart from "@/components/AutoKaart";
import { getAutos } from "@/lib/autos-db";
import type { Auto } from "@/lib/autos";
import { bedrijfswagenmodellen, getBedrijfswagenmodel } from "../modellen";

const siteUrl = "https://www.jgmobility.nl";

export const revalidate = 300; // Hervalideer elke 5 minuten

/**
 * Alleen de vijf modellen uit modellen.ts bestaan.
 *
 * `dynamicParams = false` zorgt ervoor dat /bedrijfswagens/ietsanders een 404 geeft in
 * plaats van een pagina die op het moment van opvragen wordt gebouwd. Zonder dat zou elk
 * verzonnen woord achter /bedrijfswagens/ een eigen URL opleveren die Google kan vinden —
 * en dat is precies het soort lege pagina dat je niet wilt hebben.
 */
export const dynamicParams = false;

export async function generateStaticParams() {
  return bedrijfswagenmodellen.map((m) => ({ model: m.slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ model: string }>;
}): Promise<Metadata> {
  const { model: slug } = await props.params;
  const model = getBedrijfswagenmodel(slug);
  if (!model) return { title: "Niet gevonden" };

  const url = `${siteUrl}/bedrijfswagens/${model.slug}`;
  const titel = `${model.naam} kopen in Barendrecht`;

  return {
    title: titel,
    description: model.metaBeschrijving,
    keywords: [
      `${model.naam} kopen`,
      `${model.kort} kopen Barendrecht`,
      `${model.naam} occasion`,
      `${model.kort} Rotterdam`,
      "bedrijfswagen kopen Barendrecht",
      "JG Mobility",
    ],
    alternates: { canonical: url },
    openGraph: {
      title: `${titel} | JG Mobility`,
      description: model.metaBeschrijving,
      url,
      type: "website",
    },
  };
}

/**
 * De voorraad die bij dit model hoort.
 *
 * Er wordt op de modelnaam gezocht en niet op het merk erbij: in de database staat
 * "Sprinter 316 CDI L2H2" of "Transit Custom 300", met het merk in een eigen veld dat de
 * ene keer "Mercedes-Benz" en de andere keer "Mercedes" is. De modelnaam is daarmee de
 * betrouwbaarste ingang. Verkochte bussen blijven weg: dit is een pagina om iets te
 * kopen, en /recent-verkocht is de plek voor wat weg is.
 */
function voorraadVoorModel(autos: Auto[], sleutel: string): Auto[] {
  const zoek = sleutel.toLowerCase();
  return autos.filter((a) => !a.verkocht && a.model.toLowerCase().includes(zoek));
}

export default async function BedrijfswagenModelPage(props: {
  params: Promise<{ model: string }>;
}) {
  const { model: slug } = await props.params;
  const model = getBedrijfswagenmodel(slug);
  if (!model) notFound();

  const autos = await getAutos();
  const voorraad = voorraadVoorModel(autos, model.sleutel);
  const anderen = bedrijfswagenmodellen.filter((m) => m.slug !== model.slug);
  const url = `${siteUrl}/bedrijfswagens/${model.slug}`;

  // Een bericht dat al half is ingevuld: de ondernemer hoeft alleen nog te zeggen welke
  // uitvoering hij zoekt, en wij weten meteen waar het over gaat.
  const whatsappLink = `https://wa.me/31621331374?text=${encodeURIComponent(
    `Hallo, ik zoek een ${model.naam}. Dit is wat ik nodig heb: `
  )}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Bedrijfswagens", item: `${siteUrl}/bedrijfswagens` },
      { "@type": "ListItem", position: 3, name: model.naam, item: url },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <div className="relative pt-28 md:pt-52 pb-20 px-6 overflow-hidden" style={{ backgroundColor: "#001337" }}>
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 50% 80% at 20% 60%, rgba(255,255,255,0.04) 0%, transparent 70%)" }}
        />
        <div className="relative max-w-7xl mx-auto">
          <Link
            href="/bedrijfswagens"
            className="inline-flex items-center gap-2 text-xs tracking-widest uppercase mb-6 hover:opacity-70 transition-opacity"
            style={{ color: "#ffffff", fontFamily: "var(--font-inter)" }}
          >
            &larr; Bedrijfswagens
          </Link>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-5" style={{ fontFamily: "var(--font-playfair)" }}>
            {model.naam} kopen in Barendrecht
          </h1>
          <p className="text-sm md:text-base max-w-2xl" style={{ color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-inter)", lineHeight: 1.8 }}>
            {model.samenvatting}
          </p>
        </div>
      </div>

      {/* Voorraad. Bovenaan en niet onderaan: wie hier komt wil eerst weten of u er één
          heeft staan. Staat er niets, dan staat dat er net zo duidelijk — met de vraag om
          het te laten weten, want wij zoeken wel mee. */}
      <section className="py-16 px-6" style={{ backgroundColor: "#f5f5f5" }}>
        <div className="max-w-7xl mx-auto">
          <AnimateOnScroll>
            <div className="mb-10">
              <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "rgba(0,19,55,0.45)", fontFamily: "var(--font-inter)" }}>
                Op voorraad
              </p>
              <h2 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: "#001337" }}>
                {voorraad.length === 0 && `Geen ${model.kort} op voorraad`}
                {voorraad.length === 1 && `Eén ${model.kort} in ons aanbod`}
                {voorraad.length > 1 && `${model.meervoud} in ons aanbod`}
              </h2>
            </div>
          </AnimateOnScroll>

          {voorraad.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {voorraad.map((auto, i) => (
                <AnimateOnScroll key={auto.id} delay={i * 0.1} direction="up">
                  <AutoKaart auto={auto} sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw" />
                </AnimateOnScroll>
              ))}
            </div>
          ) : (
            <AnimateOnScroll>
              <div className="p-6 md:p-10 text-center" style={{ backgroundColor: "#ffffff", border: "1px solid rgba(0,19,55,0.08)" }}>
                <p className="text-sm md:text-base mb-6 max-w-xl mx-auto leading-relaxed" style={{ color: "rgba(0,19,55,0.6)", fontFamily: "var(--font-inter)" }}>
                  Momenteel geen {model.naam} op voorraad — laat het ons weten, wij zoeken mee.
                  Vertel ons welke lengte, hoogte en uitvoering u nodig heeft; wij kijken in ons
                  netwerk en laten van ons horen zodra er iets passends langskomt.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-semibold transition-all hover:scale-105"
                    style={{ backgroundColor: "#001337", color: "#ffffff", fontFamily: "var(--font-inter)" }}
                  >
                    Stuur een WhatsApp <ArrowRight size={14} />
                  </a>
                  <Link
                    href="/bedrijfswagens"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-semibold transition-all hover:opacity-80"
                    style={{ border: "1px solid rgba(0,19,55,0.15)", color: "#001337", fontFamily: "var(--font-inter)" }}
                  >
                    Alle bedrijfswagens
                  </Link>
                </div>
              </div>
            </AnimateOnScroll>
          )}
        </div>
      </section>

      {/* Over het model zelf. Geen verkooppraat: waar hij voor gebruikt wordt, in welke
          uitvoeringen hij bestaat en waar u bij een gebruikt exemplaar op let. */}
      <section className="py-20 px-6" style={{ backgroundColor: "#ffffff" }}>
        <div className="max-w-3xl mx-auto">
          <AnimateOnScroll>
            <p className="text-xs tracking-widest uppercase mb-3" style={{ color: "rgba(0,19,55,0.45)", fontFamily: "var(--font-inter)" }}>
              Over de {model.kort}
            </p>
            <h2 className="text-2xl md:text-3xl font-bold mb-8" style={{ fontFamily: "var(--font-playfair)", color: "#001337" }}>
              Waar u op let bij een gebruikte {model.kort}
            </h2>
          </AnimateOnScroll>
          <div className="flex flex-col gap-6">
            {model.paragrafen.map((alinea, i) => (
              <AnimateOnScroll key={i} delay={i * 0.06}>
                <p className="text-sm md:text-base leading-relaxed" style={{ color: "rgba(0,19,55,0.65)", fontFamily: "var(--font-inter)", lineHeight: 1.9 }}>
                  {alinea}
                </p>
              </AnimateOnScroll>
            ))}
          </div>

          {/* De emissieklasse komt in elke alinea hierboven terug als aandachtspunt; hier
              staat waar het antwoord op die vraag te vinden is. */}
          <AnimateOnScroll delay={0.1}>
            <div className="mt-10 p-5 flex items-start gap-4" style={{ backgroundColor: "#fafafa", border: "1px solid rgba(0,19,55,0.08)" }}>
              <span
                className="w-11 h-11 flex-shrink-0 flex items-center justify-center"
                style={{ backgroundColor: "#001337", color: "#ffffff" }}
              >
                <Zap size={18} />
              </span>
              <div>
                <p className="text-sm font-semibold mb-2" style={{ color: "#001337", fontFamily: "var(--font-inter)" }}>
                  Moet deze bus een zero-emissiezone in?
                </p>
                <p className="text-xs leading-relaxed mb-3" style={{ color: "rgba(0,19,55,0.55)", fontFamily: "var(--font-inter)" }}>
                  Sinds 1 januari 2025 hebben verschillende gemeenten een zero-emissiezone voor
                  bestelauto&apos;s. Of een gebruikte diesel er nog in mag, hangt af van de
                  emissieklasse en de datum eerste toelating.
                </p>
                <Link
                  href="/bedrijfswagens/zero-emissiezones"
                  className="group inline-flex items-center gap-2 text-xs tracking-widest uppercase font-semibold hover:opacity-70 transition-opacity"
                  style={{ color: "#001337", fontFamily: "var(--font-inter)" }}
                >
                  Zero-emissiezones uitgelegd
                  <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* De andere modellen */}
      <section className="py-16 px-6" style={{ backgroundColor: "#f5f5f5" }}>
        <div className="max-w-6xl mx-auto">
          <AnimateOnScroll>
            <p className="text-xs tracking-widest uppercase mb-6 text-center" style={{ color: "rgba(0,19,55,0.45)", fontFamily: "var(--font-inter)" }}>
              Andere bestelbussen
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {anderen.map((m) => (
                <Link
                  key={m.slug}
                  href={`/bedrijfswagens/${m.slug}`}
                  className="text-xs px-3 py-2 transition-all hover:opacity-70"
                  style={{ border: "1px solid rgba(0,19,55,0.12)", color: "rgba(0,19,55,0.6)", fontFamily: "var(--font-inter)" }}
                >
                  {m.naam}
                </Link>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Slot-CTA alleen als er voorraad is: staat er niets, dan is dezelfde vraag hierboven
          al gesteld en zou dit de tweede keer zijn. */}
      {voorraad.length > 0 && (
        <section className="py-20 px-6 text-center" style={{ backgroundColor: "#001337" }}>
          <AnimateOnScroll>
            <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "#ffffff", fontFamily: "var(--font-inter)" }}>
              Zoekt u een specifieke uitvoering?
            </p>
            <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
              Wij zoeken mee
            </h2>
            <p className="text-sm mb-8 max-w-md mx-auto leading-relaxed" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-inter)" }}>
              Staat de {model.kort} die u zoekt er niet bij? Vertel ons welke lengte, hoogte en
              uitvoering u nodig heeft — wij kijken actief mee in ons netwerk.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-semibold transition-all hover:scale-105"
                style={{ backgroundColor: "#ffffff", color: "#001337", fontFamily: "var(--font-inter)" }}
              >
                Stuur een WhatsApp <ArrowRight size={14} />
              </a>
              <a
                href="tel:+31621331374"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-semibold transition-all hover:opacity-80"
                style={{ border: "1px solid rgba(255,255,255,0.2)", color: "#ffffff", fontFamily: "var(--font-inter)" }}
              >
                06-21331374
              </a>
            </div>
          </AnimateOnScroll>
        </section>
      )}
    </>
  );
}
