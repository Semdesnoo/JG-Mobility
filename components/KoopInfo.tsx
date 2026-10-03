import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * "Goed om te weten" — de uitleg onder het aanbod op /bedrijfswagens en /personenautos.
 *
 * WAAROM ONDER DE AUTO'S EN NIET ERBOVEN
 * Wie op "Bedrijfswagens" klikt wil bussen zien. Vier uitlegkaarten tussen de kop en het
 * aanbod duwden de auto's onder de vouw. De korte versie (alleen de titels) staat nu als
 * vinkjes in de hero; de uitleg zelf staat hier, voor wie na het bekijken nog vragen heeft.
 * Bewust zonder kaders: het is achtergrondinformatie, geen tweede hoofdactie.
 */
export default function KoopInfo({
  punten,
  links,
}: {
  punten: { icon: React.ReactNode; titel: string; tekst: string }[];
  links: { label: string; href: string }[];
}) {
  return (
    <section className="py-14 md:py-16 px-6" style={{ backgroundColor: "#ffffff" }}>
      <div className="max-w-7xl mx-auto">
        <p className="text-xs tracking-widest uppercase mb-8" style={{ color: "rgba(0,19,55,0.45)", fontFamily: "var(--font-inter)" }}>
          Goed om te weten
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8">
          {punten.map((p) => (
            <div key={p.titel} className="pt-5" style={{ borderTop: "2px solid #001337" }}>
              <div className="flex items-center gap-2.5 mb-2" style={{ color: "#001337" }}>
                {p.icon}
                <h2 className="font-bold text-sm" style={{ fontFamily: "var(--font-playfair)" }}>
                  {p.titel}
                </h2>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(0,19,55,0.55)", fontFamily: "var(--font-inter)" }}>
                {p.tekst}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="group inline-flex items-center gap-2 text-xs tracking-widest uppercase font-semibold hover:opacity-70 transition-opacity"
              style={{ color: "#001337", fontFamily: "var(--font-inter)" }}
            >
              {l.label}
              <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
