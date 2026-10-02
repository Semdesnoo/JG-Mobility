import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Banknote, Package, Receipt, Repeat, Truck } from "lucide-react";
import AanbodClient from "@/app/aanbod/AanbodClient";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { getAutos } from "@/lib/autos-db";
import { isBedrijfswagen } from "@/lib/voertuig";

const siteUrl = "https://www.jgmobility.nl";

export const revalidate = 300; // Hervalideer elke 5 minuten

export const metadata: Metadata = {
  title: "Personenauto's & occasions Barendrecht",
  description:
    "Geselecteerde occasions bij JG Mobility in Barendrecht. Bij elk voertuig staat of het een marge- of BTW-auto is, financial lease is mogelijk en uw huidige auto mag worden ingeruild.",
  keywords: [
    "occasions Barendrecht",
    "personenauto kopen Barendrecht",
    "tweedehands auto Barendrecht",
    "occasions Rotterdam",
    "occasion met inruil Zuid-Holland",
    "JG Mobility",
  ],
  alternates: { canonical: `${siteUrl}/personenautos` },
  openGraph: {
    title: "Personenauto's & occasions Barendrecht | JG Mobility",
    description:
      "Geselecteerde occasions bij JG Mobility in Barendrecht. Marge- en BTW-auto's, financial lease mogelijk, inruil welkom.",
    url: `${siteUrl}/personenautos`,
    type: "website",
  },
};

/**
 * Hetzelfde idee als op /bedrijfswagens, maar met de vragen die een particuliere koper
 * stelt. Geen cijfers over aantallen of doorlooptijden: wat hier staat is te controleren
 * op de pagina van het voertuig zelf.
 */
const usps = [
  {
    icon: <Receipt size={18} />,
    titel: "Marge of BTW, altijd vermeld",
    tekst:
      "Op elke kaart staat welke van de twee het is. Bij een marge-auto komt er voor u als particulier geen btw meer bij.",
  },
  {
    icon: <Banknote size={18} />,
    titel: "Financial lease mogelijk",
    tekst:
      "Bij de meeste auto's in ons aanbod kan het. Wij vragen het voor u aan via onze financieringspartners.",
  },
  {
    icon: <Repeat size={18} />,
    titel: "Inruil welkom",
    tekst:
      "Uw huidige auto mag mee. Wij taxeren hem gratis en vrijblijvend en rekenen het verschil met u af.",
  },
  {
    icon: <Package size={18} />,
    titel: "Rijklaar afgeleverd",
    tekst:
      "Met onze afleverpakketten gaat de auto gekeurd en verzorgd de deur uit. U kiest zelf hoe compleet.",
  },
];

export default async function PersonenautosPage() {
  const autos = await getAutos();
  // Alleen de personenauto's die te koop staan — een ItemList met verkochte auto's stuurt
  // Google naar pagina's waar niets meer te halen valt.
  const beschikbaar = autos.filter((a) => !isBedrijfswagen(a) && !a.verkocht);

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${siteUrl}/personenautos#aanbod`,
    name: "Occasions bij JG Mobility",
    numberOfItems: beschikbaar.length,
    itemListElement: beschikbaar.map((auto, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${auto.merk} ${auto.model}`,
      url: `${siteUrl}/aanbod/${auto.slug || auto.id}`,
    })),
  };

  return (
    <>
      {beschikbaar.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
        />
      )}

      {/*
        Dezelfde opbouw als /bedrijfswagens: het aanbod is de pagina, de categorie staat
        vast en het uspblok gaat als `children` mee zodat het direct onder de hero staat.
      */}
      <AanbodClient
        autos={autos}
        vasteSoort="personen"
        titel="Personenauto's kopen in Barendrecht"
        intro="Geselecteerde occasions, eerlijk beschreven en met een duidelijke prijs. Financial lease is mogelijk, uw huidige auto mag worden ingeruild en wij leveren rijklaar af. U vindt ons in Barendrecht, op tien minuten van Rotterdam."
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
                Uw auto laten taxeren
                <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/diensten/afleverpakketten"
                className="group inline-flex items-center gap-2 text-xs tracking-widest uppercase font-semibold hover:opacity-70 transition-opacity"
                style={{ color: "#001337", fontFamily: "var(--font-inter)" }}
              >
                Onze afleverpakketten
                <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>
      </AanbodClient>

      {/* Doorverwijzing naar de andere helft van de voorraad. Wie hier op een bestelbus
          stuit zoekt iets anders dan deze pagina laat zien, en dan hoort de weg daarheen
          open te staan in plaats van dat hij terug moet naar het hoofdmenu. */}
      <section className="py-16 px-6" style={{ backgroundColor: "#f5f5f5" }}>
        <div className="max-w-4xl mx-auto">
          <AnimateOnScroll>
            <div className="p-6 md:p-8" style={{ backgroundColor: "#ffffff", border: "1px solid rgba(0,19,55,0.08)" }}>
              <div className="flex items-start gap-4">
                <span
                  className="w-11 h-11 flex-shrink-0 flex items-center justify-center"
                  style={{ backgroundColor: "#001337", color: "#ffffff" }}
                >
                  <Truck size={18} />
                </span>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold mb-3" style={{ fontFamily: "var(--font-playfair)", color: "#001337" }}>
                    Zoekt u een bedrijfswagen?
                  </h2>
                  <p className="text-sm leading-relaxed mb-5" style={{ color: "rgba(0,19,55,0.6)", fontFamily: "var(--font-inter)" }}>
                    Bestelbussen staan bij ons op een eigen pagina, met prijzen exclusief btw en per
                    model uitleg over lengtes, dakhoogtes en waar u bij een gebruikt exemplaar op let.
                  </p>
                  <Link
                    href="/bedrijfswagens"
                    className="group inline-flex items-center gap-2 text-xs tracking-widest uppercase font-semibold hover:opacity-70 transition-opacity"
                    style={{ color: "#001337", fontFamily: "var(--font-inter)" }}
                  >
                    Naar de bedrijfswagens
                    <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* CTA — WhatsApp, want wie iets specifieks zoekt heeft dat in één bericht uitgelegd. */}
      <section className="py-20 px-6 text-center" style={{ backgroundColor: "#001337" }}>
        <AnimateOnScroll>
          <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "#ffffff", fontFamily: "var(--font-inter)" }}>
            Niet gevonden wat u zoekt?
          </p>
          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
            Wij zoeken mee
          </h2>
          <p className="text-sm mb-8 max-w-md mx-auto leading-relaxed" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-inter)" }}>
            Vertel ons welk merk, model en budget u in gedachten heeft. Wij kijken actief mee in ons
            netwerk en laten het weten zodra er iets langskomt dat past.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`https://wa.me/31621331374?text=${encodeURIComponent(
                "Hallo, ik ben op zoek naar een auto. Dit heb ik in gedachten: "
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
              +31 6 21331374
            </a>
          </div>
        </AnimateOnScroll>
      </section>
    </>
  );
}
