import type { Metadata } from "next";
import ReviewsSection from "@/components/ReviewsSection";
import { GOOGLE_SCORE, GOOGLE_AANTAL, GOOGLE_REVIEWS_URL } from "@/lib/reviews";

export const metadata: Metadata = {
  title: "Reviews",
  description:
    "Wat klanten over JG Mobility in Barendrecht zeggen. Alle Google-reviews over onze bedrijfswagens, occasions, inruil en persoonlijke service op één pagina.",
  alternates: { canonical: "https://www.jgmobility.nl/reviews" },
  openGraph: {
    title: "Reviews | JG Mobility Barendrecht",
    description:
      "De Google-reviews van JG Mobility in Barendrecht — over bedrijfswagens, occasions, inruil en service.",
    url: "https://www.jgmobility.nl/reviews",
  },
};

export default function ReviewsPage() {
  return (
    <>
      {/* Hero */}
      <div className="relative pt-28 md:pt-52 pb-16 px-6 overflow-hidden" style={{ backgroundColor: "#001337" }}>
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 50% 80% at 20% 50%, rgba(255,255,255,0.06) 0%, transparent 70%)" }} />
        <div className="relative max-w-7xl mx-auto">
          <p className="text-xs tracking-widest uppercase mb-3" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-inter)" }}>
            Wat klanten zeggen
          </p>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white" style={{ fontFamily: "var(--font-playfair)" }}>
            Reviews
          </h1>
          {/* Score en aantal komen uit lib/reviews.ts, zodat hier nooit een ander
              getal staat dan op de homepage of in de JSON-LD. */}
          <p className="mt-5 text-sm max-w-xl leading-relaxed" style={{ color: "rgba(255,255,255,0.55)", fontFamily: "var(--font-inter)" }}>
            JG Mobility staat op Google op een {GOOGLE_SCORE.toFixed(1).replace(".", ",")} uit{" "}
            {GOOGLE_AANTAL} beoordelingen. Hieronder staan ze alle drie — ongefilterd.
          </p>
        </div>
      </div>

      <ReviewsSection />

      {/* Zelf een review achterlaten */}
      <section className="py-20 px-6 text-center" style={{ backgroundColor: "#ffffff" }}>
        <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "var(--font-playfair)", color: "#001337" }}>
          Auto bij ons gekocht?
        </h2>
        <p className="text-sm mb-8 max-w-sm mx-auto leading-relaxed" style={{ color: "rgba(0,19,55,0.5)", fontFamily: "var(--font-inter)" }}>
          Een review helpt de volgende koper om een keuze te maken — en ons om te weten wat
          beter kan.
        </p>
        <a
          href={GOOGLE_REVIEWS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 text-sm font-semibold transition-all hover:opacity-90"
          style={{ backgroundColor: "#001337", color: "#ffffff", fontFamily: "var(--font-inter)" }}
        >
          Schrijf een review op Google
        </a>
      </section>
    </>
  );
}
