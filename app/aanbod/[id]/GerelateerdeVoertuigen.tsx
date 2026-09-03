import AnimateOnScroll from "@/components/AnimateOnScroll";
import AutoKaart from "@/components/AutoKaart";
import type { Auto } from "@/lib/autos";

/**
 * "Vergelijkbare voertuigen" onder aan een autopagina.
 *
 * Bewust dezelfde kaart als elders op de site en geen eigen weergave: dit is de derde
 * plek waar een auto in een rijtje staat, en drie eigen vormtalen lopen gegarandeerd uit
 * elkaar. Verandert de prijsweergave of de verkocht-band, dan loopt dit blok mee.
 *
 * Bij minder dan twee kandidaten blijft het blok weg. Eén eenzame kaart in een rij van
 * drie oogt als een fout, en de vorige/volgende-balk eronder doet dan het werk.
 */
export default function GerelateerdeVoertuigen({ autos }: { autos: Auto[] }) {
  if (autos.length < 2) return null;

  // Beide klassenamen voluit, anders ziet de Tailwind-scanner ze niet staan.
  const kolommen = autos.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3";

  return (
    <section aria-labelledby="gerelateerd-kop" className="py-16 px-6" style={{ backgroundColor: "#f5f5f5" }}>
      <div className="max-w-7xl mx-auto">
        <AnimateOnScroll>
          <div className="mb-10">
            <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "rgba(0,19,55,0.45)", fontFamily: "var(--font-inter)" }}>
              Verder kijken
            </p>
            <h2 id="gerelateerd-kop" className="text-2xl md:text-3xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: "#001337" }}>
              Vergelijkbare voertuigen
            </h2>
            <p className="text-sm mt-3 max-w-md" style={{ color: "rgba(0,19,55,0.45)", fontFamily: "var(--font-inter)" }}>
              Andere voertuigen uit ons aanbod in dezelfde prijsklasse.
            </p>
          </div>
        </AnimateOnScroll>

        <div className={`grid grid-cols-1 ${kolommen} gap-6`}>
          {autos.map((a, i) => (
            <AnimateOnScroll key={a.id} delay={i * 0.15} direction="up">
              <AutoKaart auto={a} />
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
