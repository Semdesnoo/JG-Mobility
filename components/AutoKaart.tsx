import Link from "next/link";
import AutoFoto from "@/components/AutoFoto";
import type { Auto } from "@/lib/autos";
import { prijsWeergave } from "@/lib/prijs";
import { bodytypeLabel } from "@/lib/voertuig";

/**
 * De autokaart, zoals hij op de homepage staat.
 *
 * WAAROM DIT EEN EIGEN COMPONENT IS
 * Deze kaart stond al twee keer bijna woordelijk in de site: in het aanbodoverzicht en op
 * de homepage. Het blok "Vergelijkbare voertuigen" onder aan een autopagina zou de derde
 * kopie zijn geworden — en dan loopt over een half jaar de een uit de pas met de ander
 * zodra er iets aan de prijsweergave of de verkocht-band verandert.
 *
 * Dit is de plek waar die kaart voortaan woont. De homepage en het aanbodoverzicht kunnen
 * er in een aparte stap naartoe verhuizen; tot die tijd is dit de canonieke versie.
 *
 * De foto staat altijd op `lui` en nooit op `priority`: deze kaart staat altijd ónder iets
 * belangrijkers — de galerijfoto van de auto, of de hero van de homepage — en mag daar
 * nooit mee vechten om bandbreedte.
 */
export default function AutoKaart({
  auto,
  sizes = "(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 400px",
}: {
  auto: Auto;
  /** Alleen meegeven als de kaart in een raster met andere kolombreedtes staat. */
  sizes?: string;
}) {
  const prijs = prijsWeergave(auto);

  return (
    <Link
      href={`/aanbod/${auto.slug || auto.id}`}
      className="group block rounded-none overflow-hidden hover:shadow-2xl transition-all duration-500"
      style={{ backgroundColor: "#ffffff" }}
      aria-label={`${auto.merk} ${auto.model}, ${prijs.tekst}${prijs.achtervoegsel ? ` ${prijs.achtervoegsel}` : ""}`}
    >
      {/* Foto. AutoFoto vangt een ontbrekende of onbereikbare foto zelf af met hetzelfde
          marineblauwe vlak met merkletters — vandaar geen eigen terugval hier. */}
      <div className="relative h-56 overflow-hidden" style={{ backgroundColor: "#001337" }}>
        <AutoFoto
          src={auto.fotos?.[0]}
          alt={`${auto.merk} ${auto.model}`}
          merk={auto.merk}
          sizes={sizes}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          tekstGrootte={110}
          lui
        />
        <div className="absolute top-4 left-4">
          <span
            className="text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-none"
            style={{ backgroundColor: "#ffffff", color: "#001337", fontFamily: "var(--font-inter)", fontWeight: 600 }}
          >
            {bodytypeLabel(auto)}
          </span>
        </div>
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: "radial-gradient(ellipse at center, rgba(255,255,255,0.08) 0%, transparent 70%)" }}
        />
        {auto.verkocht && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute flex items-center justify-center"
              style={{ width: "160%", top: "28%", left: "-30%", transform: "rotate(-35deg)", backgroundColor: "#001337", padding: "10px 0", boxShadow: "0 4px 24px rgba(0,0,0,0.5)" }}
            >
              <span className="text-white tracking-widest uppercase" style={{ fontFamily: "var(--font-playfair)", fontSize: "22px", fontWeight: 700, letterSpacing: "0.15em" }}>
                Verkocht
              </span>
            </div>
          </div>
        )}
        {auto.gereserveerd && !auto.verkocht && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute flex items-center justify-center"
              style={{ width: "160%", top: "28%", left: "-30%", transform: "rotate(-35deg)", backgroundColor: "#b45309", padding: "10px 0", boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}
            >
              <span className="text-white tracking-widest uppercase" style={{ fontFamily: "var(--font-playfair)", fontSize: "22px", fontWeight: 700, letterSpacing: "0.15em" }}>
                Gereserveerd
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-3 gap-3">
          <div className="min-w-0">
            <p className="text-[10px] tracking-widest uppercase mb-1" style={{ color: "rgba(0,19,55,0.45)", fontFamily: "var(--font-inter)" }}>
              {auto.merk}
            </p>
            <h3 className="text-lg font-bold" style={{ fontFamily: "var(--font-playfair)", color: "#001337" }}>
              {auto.model}
            </h3>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: "#001337" }}>
              {prijs.tekst}
            </p>
            {prijs.achtervoegsel && (
              <p className="text-[10px] font-semibold" style={{ fontFamily: "var(--font-inter)", color: "rgba(0,19,55,0.5)" }}>
                {prijs.achtervoegsel}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 my-4">
          {[
            { label: "Jaar", value: auto.bouwjaar },
            { label: "KM", value: `${(auto.km / 1000).toFixed(0)}k` },
            { label: "Pk", value: auto.vermogen.replace(" pk", "") },
          ].map((spec) => (
            <div key={spec.label} className="text-center py-2 rounded-none" style={{ backgroundColor: "#f5f5f5" }}>
              <div className="text-xs text-gray-400" style={{ fontFamily: "var(--font-inter)" }}>{spec.label}</div>
              <div className="text-sm font-bold mt-0.5" style={{ color: "#001337", fontFamily: "var(--font-inter)" }}>{spec.value}</div>
            </div>
          ))}
        </div>

        <div
          className="block w-full text-center py-3 rounded-none text-sm font-semibold tracking-wide transition-all group-hover:shadow-lg"
          style={{ backgroundColor: "#001337", color: "#ffffff", fontFamily: "var(--font-inter)" }}
        >
          Bekijk dit voertuig
        </div>
      </div>
    </Link>
  );
}
