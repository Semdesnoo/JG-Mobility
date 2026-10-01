import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Banknote, BadgeCheck, Receipt, Repeat, Truck, Zap } from "lucide-react";
import AanbodClient from "@/app/aanbod/AanbodClient";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { getAutos } from "@/lib/autos-db";
import { isBedrijfswagen } from "@/lib/voertuig";
import { bedrijfswagenmodellen } from "./modellen";

const siteUrl = "https://www.jgmobility.nl";

export const revalidate = 300; // Hervalideer elke 5 minuten

export const metadata: Metadata = {
  title: "Bedrijfswagens kopen in Barendrecht",
  description:
    "Bedrijfswagens en bestelbussen kopen bij JG Mobility in Barendrecht. Prijzen exclusief btw, BTW- en marge-voertuigen, financial lease mogelijk en inruil welkom. Op tien minuten van Rotterdam.",
  keywords: [
    "bedrijfswagen kopen Barendrecht",
    "bedrijfswagens Rotterdam",
    "bestelbus kopen Barendrecht",
    "bestelauto occasion Zuid-Holland",
    "bedrijfswagen financial lease",
    "JG Mobility",
  ],
  alternates: { canonical: `${siteUrl}/bedrijfswagens` },
  openGraph: {
    title: "Bedrijfswagens kopen in Barendrecht | JG Mobility",
    description:
      "Bestelbussen en bedrijfswagens bij JG Mobility in Barendrecht. Prijzen exclusief btw, financial lease mogelijk, inruil welkom.",
    url: `${siteUrl}/bedrijfswagens`,
    type: "website",
  },
};

/**
 * Waar een zakelijke koper als eerste naar kijkt.
 *
 * Alle vier staan ook ergens anders op de site, maar niet bij elkaar en niet op het
 * moment dat iemand naar een bus staat te kijken. Er staat geen leasebedrag en geen
 * voorraadbelofte bij: een maandlast hangt af van looptijd en aanbetaling, en wat er te
 * koop staat wisselt per dag.
 */
const usps = [
  {
    icon: <Receipt size={18} />,
    titel: "Prijzen exclusief btw",
    tekst:
      "Bij een bedrijfswagen hoort een prijs zonder btw. Staat er “excl. btw” bij het bedrag, dan is dat wat u rekent — het bedrag inclusief btw vindt u op de pagina van het voertuig.",
  },
  {
    icon: <BadgeCheck size={18} />,
    titel: "BTW- en marge-voertuigen",
    tekst:
      "Op elke kaart staat of het een BTW-auto of een marge-auto is. Zo weet u voordat u belt of u de btw kunt terugvragen.",
  },
  {
    icon: <Banknote size={18} />,
    titel: "Financial lease mogelijk",
    tekst:
      "Bij de meeste bedrijfswagens in ons aanbod is financial lease mogelijk. Wij vragen het voor u aan via onze financieringspartners.",
  },
  {
    icon: <Repeat size={18} />,
    titel: "Inruil welkom",
    tekst:
      "Uw huidige bus of auto inruilen? Wij taxeren hem gratis en vrijblijvend en rekenen het verschil met u af.",
  },
];

export default async function BedrijfswagensPage() {
  const autos = await getAutos();
  // Voor de structured data: alleen de bedrijfswagens die te koop staan. Een ItemList met
  // auto's die weg zijn stuurt Google naar pagina's waar niets meer te halen valt.
  const beschikbareBussen = autos.filter((a) => isBedrijfswagen(a) && !a.verkocht);

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${siteUrl}/bedrijfswagens#aanbod`,
    name: "Bedrijfswagens bij JG Mobility",
    numberOfItems: beschikbareBussen.length,
    itemListElement: beschikbareBussen.map((auto, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${auto.merk} ${auto.model}`,
      url: `${siteUrl}/aanbod/${auto.slug || auto.id}`,
    })),
  };

  return (
    <>
      {beschikbareBussen.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
        />
      )}

      {/*
        Het aanbod ís deze pagina: de hero, de filterbalk en het raster komen uit
        AanbodClient, met de categorie vastgezet op bedrijfswagens zodat de tabs wegvallen.
        Het uspblok gaat als `children` mee en staat daardoor direct onder de hero, waar
        het hoort — en niet pas achter het hele aanbod. Alles wat daarna komt (de
        modelpagina's, de zero-emissiezones en de CTA) staat eronder.
      */}
      <AanbodClient
        autos={autos}
        vasteSoort="bedrijf"
        titel="Bedrijfswagens kopen in Barendrecht"
        intro="Bestelbussen en bedrijfswagens, zorgvuldig uitgezocht en eerlijk beschreven. Prijzen exclusief btw, financial lease mogelijk en uw huidige bus mag worden ingeruild. Wij zitten in Barendrecht, op tien minuten van Rotterdam."
      >
        <section className="py-12 md:py-16 px-6" style={{ backgroundColor: "#ffffff" }}>
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {usps.map((usp) => (
                <div
                  key={usp.titel}
                  className="p-5 h-full"
                  style={{ border: "1px solid rgba(0,19,55,0.08)", backgroundColor: "#fafafa" }}
                >
                  <div
                    className="w-11 h-11 flex items-center justify-center mb-4"
                    style={{ backgroundColor: "#001337", color: "#ffffff" }}
                  >
                    {usp.icon}
                  </div>
                  <h2 className="font-bold text-sm mb-2" style={{ color: "#001337", fontFamily: "var(--font-playfair)" }}>
                    {usp.titel}
                  </h2>
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(0,19,55,0.5)", fontFamily: "var(--font-inter)" }}>
                    {usp.tekst}
                  </p>
                </div>
              ))}
            </div>
            {/* Twee links en geen derde: dit zijn de vragen die een zakelijke koper stelt
                vóórdat hij over een specifieke bus begint. */}
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
              <Link
                href="/financial-lease"
                className="group inline-flex items-center gap-2 text-xs tracking-widest uppercase font-semibold hover:opacity-70 transition-opacity"
                style={{ color: "#001337", fontFamily: "var(--font-inter)" }}
              >
                Meer over financial lease
                <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/diensten/inkoop-taxatie"
                className="group inline-flex items-center gap-2 text-xs tracking-widest uppercase font-semibold hover:opacity-70 transition-opacity"
                style={{ color: "#001337", fontFamily: "var(--font-inter)" }}
              >
                Uw bus laten taxeren
                <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>
      </AanbodClient>

      {/* Modelpagina's. Wie op "Sprinter kopen" zoekt wil geen overzicht van alles — hij
          wil die bus. Deze vijf pagina's vertellen per model waar hij voor gebruikt wordt
          en waar u bij een gebruikte op let, met de voorraad die er op dat moment van is. */}
      <section className="py-20 px-6" style={{ backgroundColor: "#ffffff" }}>
        <div className="max-w-6xl mx-auto">
          <AnimateOnScroll>
            <div className="mb-10">
              <p className="text-xs tracking-widest uppercase mb-3" style={{ color: "rgba(0,19,55,0.45)", fontFamily: "var(--font-inter)" }}>
                Per model
              </p>
              <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ fontFamily: "var(--font-playfair)", color: "#001337" }}>
                De bestelbussen waar het meest naar gevraagd wordt
              </h2>
              <p className="text-sm max-w-2xl leading-relaxed" style={{ color: "rgba(0,19,55,0.55)", fontFamily: "var(--font-inter)" }}>
                Per model leest u in welke lengtes en dakhoogtes hij bestaat, waar hij voor gebruikt
                wordt en waar u bij een gebruikt exemplaar op let — plus wat er op dit moment van in
                onze voorraad staat.
              </p>
            </div>
          </AnimateOnScroll>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {bedrijfswagenmodellen.map((model, i) => (
              <AnimateOnScroll key={model.slug} delay={i * 0.06}>
                <Link
                  href={`/bedrijfswagens/${model.slug}`}
                  className="group flex items-start gap-4 p-5 h-full transition-all hover:shadow-lg"
                  style={{ border: "1px solid rgba(0,19,55,0.08)", backgroundColor: "#fafafa" }}
                >
                  <span
                    className="w-11 h-11 flex-shrink-0 flex items-center justify-center"
                    style={{ backgroundColor: "#001337", color: "#ffffff" }}
                  >
                    <Truck size={18} />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-bold text-sm mb-1" style={{ color: "#001337", fontFamily: "var(--font-playfair)" }}>
                      {model.naam}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs" style={{ color: "rgba(0,19,55,0.5)", fontFamily: "var(--font-inter)" }}>
                      {model.kort} kopen
                      <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </span>
                </Link>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Zero-emissiezones. Dit is sinds 2025 de eerste vraag bij een gebruikte diesel die
          de stad in moet, en het antwoord verschilt per gemeente en per emissieklasse —
          dus staat het op een eigen pagina en niet in twee regels hier. */}
      <section className="py-16 px-6" style={{ backgroundColor: "#f5f5f5" }}>
        <div className="max-w-4xl mx-auto">
          <AnimateOnScroll>
            <div className="p-6 md:p-8" style={{ backgroundColor: "#ffffff", border: "1px solid rgba(0,19,55,0.08)" }}>
              <div className="flex items-start gap-4">
                <span
                  className="w-11 h-11 flex-shrink-0 flex items-center justify-center"
                  style={{ backgroundColor: "#001337", color: "#ffffff" }}
                >
                  <Zap size={18} />
                </span>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold mb-3" style={{ fontFamily: "var(--font-playfair)", color: "#001337" }}>
                    Mag deze bus de stad nog in?
                  </h2>
                  <p className="text-sm leading-relaxed mb-5" style={{ color: "rgba(0,19,55,0.6)", fontFamily: "var(--font-inter)" }}>
                    Sinds 1 januari 2025 hebben verschillende gemeenten — waaronder Rotterdam — een
                    zero-emissiezone voor bestelauto&apos;s. Er geldt een overgangsregeling die afhangt
                    van de emissieklasse en de datum eerste toelating van het voertuig. Wat dat voor
                    uw situatie betekent, leest u op onze uitlegpagina.
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
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* CTA — WhatsApp en niet een formulier: een ondernemer die een specifiek type zoekt
          heeft dat in één bericht uitgelegd, en hoort dezelfde dag iets terug. */}
      <section className="py-20 px-6 text-center" style={{ backgroundColor: "#001337" }}>
        <AnimateOnScroll>
          <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "#ffffff", fontFamily: "var(--font-inter)" }}>
            Zoekt u een specifiek type?
          </p>
          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
            Wij zoeken mee
          </h2>
          <p className="text-sm mb-8 max-w-md mx-auto leading-relaxed" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-inter)" }}>
            Vertel ons welke lengte, hoogte en uitvoering u nodig heeft. Wij kijken actief mee in ons
            netwerk en laten het weten zodra er iets langskomt dat past.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`https://wa.me/31621331374?text=${encodeURIComponent(
                "Hallo, ik zoek een bedrijfswagen. Dit is wat ik nodig heb: "
              )}`}
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
    </>
  );
}
