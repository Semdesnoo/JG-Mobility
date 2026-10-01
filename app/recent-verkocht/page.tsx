import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import AutoKaart from "@/components/AutoKaart";
import { getAutos } from "@/lib/autos-db";
import type { Auto } from "@/lib/autos";

const siteUrl = "https://www.jgmobility.nl";

export const revalidate = 300; // Hervalideer elke 5 minuten

/**
 * Hoeveel verkochte voertuigen er maximaal op staan.
 *
 * Deze pagina bestaat omdat verkochte auto's uit het aanbod zijn gehaald: tussen de
 * auto's die je kunt kopen leidde elke klik erop dood. Dat ze verkocht zijn zegt iets
 * goeds over de zaak, dus ze horen ergens te staan — maar niet onbeperkt. Vierentwintig
 * kaarten is twee tot acht rijen en daarmee een pagina die iemand nog afscrollt; alles
 * wat ouder is voegt niets meer toe.
 */
const MAX_VERKOCHT = 24;

/**
 * Wanneer deze auto verkocht is, als getal om op te sorteren.
 *
 * Een auto zonder (of met een onleesbare) verkoopdatum krijgt 0 en komt daarmee
 * onderaan: elke echte verkoopdatum ligt na 1970. Zo hoeft de sortering geen uitzondering
 * te maken en staat wat we niet weten niet bovenaan te pronken.
 */
function verkooptijd(auto: Auto): number {
  const tijd = auto.verkocht_op ? new Date(auto.verkocht_op).getTime() : 0;
  return Number.isNaN(tijd) ? 0 : tijd;
}

export const metadata: Metadata = {
  title: "Recent verkochte voertuigen",
  description:
    "Een overzicht van voertuigen die JG Mobility in Barendrecht recent verkocht heeft. Zoekt u iets vergelijkbaars? Wij kijken actief mee in ons netwerk.",
  keywords: [
    "verkochte occasions Barendrecht",
    "recent verkocht JG Mobility",
    "occasions Barendrecht",
    "bedrijfswagens Barendrecht",
    "JG Mobility",
  ],
  alternates: { canonical: `${siteUrl}/recent-verkocht` },
  openGraph: {
    title: "Recent verkochte voertuigen | JG Mobility",
    description:
      "Voertuigen die wij recent verkochten. Zoekt u iets vergelijkbaars? Laat het ons weten — wij zoeken mee.",
    url: `${siteUrl}/recent-verkocht`,
    type: "website",
  },
};

export default async function RecentVerkochtPage() {
  const autos = await getAutos();
  const verkocht = autos
    .filter((a) => a.verkocht)
    .sort((a, b) => verkooptijd(b) - verkooptijd(a))
    .slice(0, MAX_VERKOCHT);

  return (
    <>
      {/* Hero */}
      <div className="relative pt-28 md:pt-52 pb-16 px-6 overflow-hidden" style={{ backgroundColor: "#001337" }}>
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 50% 80% at 80% 50%, rgba(255,255,255,0.06) 0%, transparent 70%)" }}
        />
        <div className="relative max-w-7xl mx-auto">
          <p className="text-xs tracking-widest uppercase mb-3" style={{ color: "#ffffff", fontFamily: "var(--font-inter)" }}>
            Bedrijfswagens &amp; Geselecteerde Occasions
          </p>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-5" style={{ fontFamily: "var(--font-playfair)" }}>
            Recent verkocht
          </h1>
          <p className="text-sm md:text-base max-w-2xl" style={{ color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-inter)", lineHeight: 1.8 }}>
            Deze voertuigen hebben wij verkocht en staan er dus niet meer. We laten ze toch zien:
            het geeft een beeld van wat er bij ons langskomt en in welke prijsklasse. Staat er iets
            tussen dat u zoekt, laat het ons weten — vaak kunnen we iets vergelijkbaars vinden.
          </p>
        </div>
      </div>

      {/* Raster met verkochte voertuigen. Dezelfde kaart als in het aanbod, inclusief de
          verkocht-band over de foto — hier is die band geen waarschuwing maar de reden dat
          de kaart er staat. */}
      <section className="py-16 px-6" style={{ backgroundColor: "#f5f5f5" }}>
        <div className="max-w-7xl mx-auto">
          {verkocht.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-sm mb-6" style={{ color: "rgba(0,19,55,0.5)", fontFamily: "var(--font-inter)" }}>
                Er staan hier nog geen verkochte voertuigen. Bekijk ons actuele aanbod.
              </p>
              <Link
                href="/aanbod"
                className="inline-flex items-center gap-2 px-8 py-4 text-sm font-semibold transition-all hover:scale-105"
                style={{ backgroundColor: "#001337", color: "#ffffff", fontFamily: "var(--font-inter)" }}
              >
                Naar het aanbod <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {verkocht.map((auto, i) => (
                  <AnimateOnScroll key={auto.id} delay={(i % 3) * 0.1} direction="up">
                    <AutoKaart auto={auto} sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw" />
                  </AnimateOnScroll>
                ))}
              </div>
              <div className="mt-12 pt-8 text-center" style={{ borderTop: "1px solid rgba(0,19,55,0.08)" }}>
                <Link
                  href="/aanbod"
                  className="group inline-flex items-center gap-2 text-xs tracking-widest uppercase font-semibold hover:opacity-70 transition-opacity"
                  style={{ color: "#001337", fontFamily: "var(--font-inter)" }}
                >
                  Bekijk het actuele aanbod
                  <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center" style={{ backgroundColor: "#001337" }}>
        <AnimateOnScroll>
          <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "#ffffff", fontFamily: "var(--font-inter)" }}>
            Zoekt u iets vergelijkbaars?
          </p>
          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
            Wij zoeken mee
          </h2>
          <p className="text-sm mb-8 max-w-md mx-auto leading-relaxed" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-inter)" }}>
            Vertel ons welk voertuig u in gedachten heeft — merk, uitvoering en budget. Wij kijken
            actief mee in ons netwerk en laten van ons horen zodra er iets passends langskomt.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`https://wa.me/31621331374?text=${encodeURIComponent(
                "Hallo, ik zag een verkocht voertuig op jullie site. Ik ben op zoek naar iets vergelijkbaars: "
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
