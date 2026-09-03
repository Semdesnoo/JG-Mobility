"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Gauge, Calendar, Fuel, Zap, ArrowRight, ChevronDown, X } from "lucide-react";
import { type Auto } from "@/lib/autos";
import { prijsWeergave } from "@/lib/prijs";
import { isBedrijfswagen, bodytypeLabel } from "@/lib/voertuig";
import AutoFoto from "@/components/AutoFoto";

const prijsOpties = [
  { label: "Aanschafprijs", value: "" },
  { label: "Tot €10.000", value: "10000" },
  { label: "Tot €20.000", value: "20000" },
  { label: "Tot €30.000", value: "30000" },
  { label: "Tot €50.000", value: "50000" },
  { label: "Tot €75.000", value: "75000" },
  { label: "Tot €100.000", value: "100000" },
];

const sorteerOpties = [
  { label: "Sorteren op", value: "" },
  { label: "Prijs: laag → hoog", value: "prijs-asc" },
  { label: "Prijs: hoog → laag", value: "prijs-desc" },
  { label: "Nieuwste eerst", value: "jaar-desc" },
  { label: "Oudste eerst", value: "jaar-asc" },
  { label: "Minste KM", value: "km-asc" },
];

function FilterSelect({ value, onChange, children }: { value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  const active = value !== "" && !["Alle merken", "Alle modellen", "Alle transmissies", "Alle brandstof", "Alle voertuigen"].includes(value);
  return (
    <div className="relative w-full md:w-auto">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none w-full pr-8 pl-4 py-2.5 rounded-none text-sm font-medium cursor-pointer transition-all"
        style={{
          backgroundColor: active ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.06)",
          border: active ? "1px solid rgba(255,255,255,0.5)" : "1px solid rgba(255,255,255,0.12)",
          color: active ? "#ffffff" : "rgba(255,255,255,0.75)",
          fontFamily: "var(--font-inter)",
          outline: "none",
          minWidth: "130px",
        }}
      >
        {children}
      </select>
      <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "rgba(255,255,255,0.5)" }} />
    </div>
  );
}

/**
 * Twee dingen die op elkaar lijken maar dat niet zijn: "Bmw" en "BMW".
 *
 * Het RDW levert merknamen met alleen de eerste letter groot, en wie een auto met de hand
 * invoert typt vaak de merknaam zoals hij op de auto staat. Daardoor stonden dezelfde
 * merken twee keer in de keuzelijst, en filterde de ene helft de andere weg.
 */
const gelijk = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

/**
 * Bouwt een keuzelijst uit de waarden van de auto's die te koop staan.
 *
 * Hoofdletterverschillen worden samengevoegd; de schrijfwijze die het vaakst voorkomt
 * wint. Namen van drie letters of korter zijn afkortingen (BMW, VW, MG) en horen in
 * hoofdletters — "Bmw" leest als een typefout en niet als een merk.
 *
 * Er wordt niets verzonnen: alleen gekozen tussen schrijfwijzen die er al zijn.
 */
function keuzelijst(waarden: string[]): string[] {
  const perSleutel = new Map<string, Map<string, number>>();
  for (const ruw of waarden) {
    const waarde = (ruw ?? "").trim();
    if (!waarde) continue;
    const sleutel = waarde.toLowerCase();
    const tellingen = perSleutel.get(sleutel) ?? new Map<string, number>();
    tellingen.set(waarde, (tellingen.get(waarde) ?? 0) + 1);
    perSleutel.set(sleutel, tellingen);
  }
  return [...perSleutel.values()]
    .map((tellingen) => {
      const vaakst = [...tellingen.entries()].sort((a, b) => b[1] - a[1])[0][0];
      return vaakst.length <= 3 ? vaakst.toUpperCase() : vaakst;
    })
    .sort((a, b) => a.localeCompare(b, "nl"));
}

export default function AanbodClient({ autos }: { autos: Auto[] }) {

  /**
   * De filters gaan alleen over auto's die nog te koop zijn.
   *
   * Verkochte auto's blijven wél op de pagina staan — dat een auto weg is zegt iets goeds
   * over de zaak. Maar een merk aanbieden waar niets van te koop is, is een lege belofte:
   * je klikt op Renault en krijgt alleen auto's die je niet meer kunt kopen.
   */
  const beschikbaar = useMemo(() => autos.filter((a) => !a.verkocht), [autos]);

  const merken = useMemo(
    () => ["Alle merken", ...keuzelijst(beschikbaar.map((a) => a.merk))],
    [beschikbaar]
  );

  const [filterMerk, setFilterMerk] = useState("Alle merken");
  const [filterModel, setFilterModel] = useState("Alle modellen");

  /**
   * Een merk uit de link (?merk=bmw) overnemen.
   *
   * WAAROM DIT NIET MEER MET useSearchParams GAAT
   * Die haak dwingt Next.js om deze hele lijst pas in de browser te tekenen. De server
   * stuurde daardoor een pagina met alleen een kop en een footer; de vijftien auto's
   * verschenen pas nadat het JavaScript geladen was. Twee gevolgen: de footer stond eerst
   * boven in beeld en klapte daarna omlaag — de grote sprong die je zag — en Google kreeg
   * een aanbodpagina zonder aanbod te zien.
   *
   * Nu staan de auto's gewoon in de HTML van de server en wordt de link ná het laden
   * gelezen. Niets binnen deze site linkt met ?merk=, dus in de praktijk gebeurt hier
   * meestal niets; komt iemand van buiten met zo'n link, dan schuift het filter alsnog
   * op zijn plek.
   */
  useEffect(() => {
    const lees = () => {
      const param = new URLSearchParams(window.location.search).get("merk");
      const gevonden = param ? merken.find((m) => gelijk(m, param)) ?? "Alle merken" : "Alle merken";
      setFilterMerk((huidig) => (huidig === gevonden ? huidig : gevonden));
      if (gevonden !== "Alle merken") setFilterModel("Alle modellen");
    };
    lees();
    window.addEventListener("popstate", lees);
    return () => window.removeEventListener("popstate", lees);
  }, [merken]);
  const [filterSoort, setFilterSoort] = useState("Alle voertuigen");
  const [filterTransmissie, setFilterTransmissie] = useState("Alle transmissies");
  const [filterBrandstof, setFilterBrandstof] = useState("Alle brandstof");
  const [filterPrijs, setFilterPrijs] = useState("");
  const [sorteer, setSorteer] = useState("");

  const modellen = useMemo(() => {
    const basis = beschikbaar.filter((a) => filterMerk === "Alle merken" || gelijk(a.merk, filterMerk));
    return ["Alle modellen", ...keuzelijst(basis.map((a) => a.model))];
  }, [filterMerk, beschikbaar]);
  // Het soort-filter verschijnt pas zodra er een bedrijfswagen in de voorraad staat.
  // Sta je vol personenauto's, dan valt er niets te kiezen en hoort het er niet.
  const toonSoortFilter = useMemo(() => beschikbaar.some(isBedrijfswagen), [beschikbaar]);

  const transmissies = useMemo(
    () => ["Alle transmissies", ...keuzelijst(beschikbaar.map((a) => a.transmissie))],
    [beschikbaar]
  );
  const brandstofTypes = useMemo(
    () => ["Alle brandstof", ...keuzelijst(beschikbaar.map((a) => a.brandstof))],
    [beschikbaar]
  );

  const gefilterd = useMemo(() => {
    let lijst = autos.filter((a) => {
      // Hoofdletter-ongevoelig: de keuzelijst toont één schrijfwijze, de auto's in de
      // database hebben er soms twee. Zonder dit filtert "BMW" de Bmw 330E weg.
      if (filterMerk !== "Alle merken" && !gelijk(a.merk, filterMerk)) return false;
      if (filterModel !== "Alle modellen" && !gelijk(a.model, filterModel)) return false;
      if (filterSoort === "Bedrijfswagens" && !isBedrijfswagen(a)) return false;
      if (filterSoort === "Personenauto's" && isBedrijfswagen(a)) return false;
      if (filterTransmissie !== "Alle transmissies" && !gelijk(a.transmissie, filterTransmissie)) return false;
      if (filterBrandstof !== "Alle brandstof" && !gelijk(a.brandstof, filterBrandstof)) return false;
      // Op het getoonde bedrag, niet op het bedrag in de database. Bij een bestelbus
      // staat de prijs zonder btw op de kaart; filtert hij dan op het btw-bedrag, dan
      // valt een bus van "€ 12.500" buiten "tot € 15.000" en snapt niemand waarom.
      if (filterPrijs && prijsWeergave(a).bedrag > parseInt(filterPrijs)) return false;
      return true;
    });
    if (sorteer === "prijs-asc") lijst = [...lijst].sort((a, b) => prijsWeergave(a).bedrag - prijsWeergave(b).bedrag);
    if (sorteer === "prijs-desc") lijst = [...lijst].sort((a, b) => prijsWeergave(b).bedrag - prijsWeergave(a).bedrag);
    if (sorteer === "jaar-desc") lijst = [...lijst].sort((a, b) => b.bouwjaar - a.bouwjaar);
    if (sorteer === "jaar-asc") lijst = [...lijst].sort((a, b) => a.bouwjaar - b.bouwjaar);
    if (sorteer === "km-asc") lijst = [...lijst].sort((a, b) => a.km - b.km);
    // Verkochte auto's altijd onderaan, beschikbare bovenaan (stabiele sort behoudt
    // de volgorde hierboven binnen elke groep)
    lijst = [...lijst].sort((a, b) => Number(a.verkocht ?? false) - Number(b.verkocht ?? false));
    return lijst;
  }, [filterMerk, filterModel, filterSoort, filterTransmissie, filterBrandstof, filterPrijs, sorteer, autos]);

  const hasFilters = filterMerk !== "Alle merken" || filterModel !== "Alle modellen" || filterSoort !== "Alle voertuigen" || filterTransmissie !== "Alle transmissies" || filterBrandstof !== "Alle brandstof" || filterPrijs || sorteer;

  const filterRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLElement>(null);
  const isFirstRender = useRef(true);

  /**
   * Na het wijzigen van een filter netjes naar de resultaten schuiven.
   *
   * WAT HIER EERDER MISGING
   * Er stond een zelfgebouwde scroll-animatie: een rekensom over 400 tot 900 ms die met
   * requestAnimationFrame het venster verzette. Drie dingen gingen daar mis.
   *
   * 1. Hij was niet te onderbreken. Wijzigde je een tweede filter terwijl de eerste nog
   *    liep, dan draaiden er twee animaties door elkaar die allebei het venster wilden
   *    verzetten. Dat is het schokkerige gevoel.
   * 2. De eindpositie werd één keer aan het begin uitgerekend en daarna niet meer
   *    bijgesteld. De bovenbalk van de site klapt tijdens het scrollen dicht (een animatie
   *    van een halve seconde), en de vaste 80 pixels waarmee gerekend werd klopten dus al
   *    niet meer voordat de scroll klaar was. Vandaar dat je soms te hoog of te laag
   *    uitkwam.
   * 3. Op de telefoon is de filterbalk niet plakkerig, maar zijn hoogte werd er wel
   *    afgetrokken — daar kwam je dus stelselmatig een balkhoogte te hoog uit.
   *
   * HOE HET NU WERKT
   * De browser doet het scrollen zelf. Dat is soepeler dan wij het met JavaScript kunnen
   * nadoen, het is te onderbreken zodra je zelf scrolt, en het houdt zich aan de
   * systeeminstelling voor wie bewegende beelden liever niet heeft.
   *
   * De hoogte wordt gemeten in plaats van aangenomen: hoeveel de bovenbalk werkelijk
   * inneemt en of de filterbalk op dít scherm plakt. En omdat die bovenbalk tijdens het
   * scrollen nog van hoogte verandert, wordt er ná afloop één keer nagemeten en zo nodig
   * bijgesteld. Eén correctie, en alleen als jij intussen niet zelf hebt gescrold — anders
   * zou het scherm tegen je in werken.
   */
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    const grid = gridRef.current;
    if (!grid) return;

    let gestopt = false;
    let gebruikerNamOver = false;
    const timers: number[] = [];
    const overnemen = () => { gebruikerNamOver = true; };
    window.addEventListener("wheel", overnemen, { passive: true });
    window.addEventListener("touchstart", overnemen, { passive: true });
    window.addEventListener("keydown", overnemen);

    /** Waar de resultaten beginnen, met alles eraf wat er vast overheen ligt. */
    const doelhoogte = () => {
      const kop = document.querySelector("header");
      const kopVast = kop && ["fixed", "sticky"].includes(getComputedStyle(kop).position);
      const kopHoogte = kopVast ? kop.getBoundingClientRect().height : 0;
      const balk = filterRef.current;
      const balkPlakt = balk ? getComputedStyle(balk).position === "sticky" : false;
      const balkHoogte = balkPlakt && balk ? balk.getBoundingClientRect().height : 0;
      const maximaal = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const rauw = grid.getBoundingClientRect().top + window.scrollY - kopHoogte - balkHoogte - 12;
      return Math.max(0, Math.min(maximaal, rauw));
    };

    const rustig =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const corrigeer = () => {
      if (gestopt || gebruikerNamOver) return;
      const opnieuw = doelhoogte();
      if (Math.abs(opnieuw - window.scrollY) > 4) window.scrollTo({ top: opnieuw, behavior: "auto" });
    };

    // Twee beeldjes wachten: pas dan staat de nieuwe lijst er en klopt de meting.
    const beeldje = requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        if (gestopt) return;
        const doel = doelhoogte();
        // Sta je er al, dan hoort er niets te gebeuren. Een sprongetje van vier pixels
        // voelt als een storing.
        if (Math.abs(doel - window.scrollY) < 8) return;
        window.scrollTo({ top: doel, behavior: rustig ? "auto" : "smooth" });
        window.addEventListener("scrollend", corrigeer, { once: true });
        // Vangnet voor browsers zonder scrollend, en voor het geval er niets te scrollen viel.
        timers.push(window.setTimeout(corrigeer, 900));
      })
    );

    return () => {
      gestopt = true;
      cancelAnimationFrame(beeldje);
      timers.forEach(clearTimeout);
      window.removeEventListener("scrollend", corrigeer);
      window.removeEventListener("wheel", overnemen);
      window.removeEventListener("touchstart", overnemen);
      window.removeEventListener("keydown", overnemen);
    };
  }, [filterMerk, filterModel, filterSoort, filterTransmissie, filterBrandstof, filterPrijs, sorteer]);

  const resetFilters = () => {
    setFilterMerk("Alle merken");
    setFilterModel("Alle modellen");
    setFilterSoort("Alle voertuigen");
    setFilterTransmissie("Alle transmissies");
    setFilterBrandstof("Alle brandstof");
    setFilterPrijs("");
    setSorteer("");
  };

  return (
    <>
      {/* Hero */}
      <div className="relative pt-28 md:pt-52 pb-16 px-6 overflow-hidden" style={{ backgroundColor: "#001337" }}>
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 50% 80% at 80% 50%, rgba(255,255,255,0.06) 0%, transparent 70%)" }}
        />
        <div className="relative max-w-7xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs tracking-widest uppercase mb-3"
            style={{ color: "#ffffff", fontFamily: "var(--font-inter)" }}
          >
            Geselecteerde voertuigen
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Onze collectie
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/40 text-sm"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            {beschikbaar.length} {beschikbaar.length === 1 ? "voertuig" : "voertuigen"} beschikbaar
          </motion.p>
        </div>
      </div>

      {/* Filter balk — sticky alleen desktop */}
      <div
        ref={filterRef}
        className="md:sticky top-[80px] z-40 px-4 md:px-6 py-5"
        style={{
          // Was rgba(...,0.97) mét een blur eronder. Bij 97% dekking zie je van die blur
          // niets, terwijl de browser hem bij elk beeldje opnieuw moet uitrekenen — juist
          // tijdens het scrollen, precies wanneer je de soepelheid nodig hebt.
          backgroundColor: "#02163a",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap md:items-center md:gap-3">
            {toonSoortFilter && (
              <FilterSelect value={filterSoort} onChange={setFilterSoort}>
                {["Alle voertuigen", "Personenauto's", "Bedrijfswagens"].map((s) => (
                  <option key={s} value={s} style={{ backgroundColor: "#001337" }}>{s}</option>
                ))}
              </FilterSelect>
            )}
            <FilterSelect value={filterMerk} onChange={(v) => { setFilterMerk(v); setFilterModel("Alle modellen"); }}>
              {merken.map((m) => <option key={m} value={m} style={{ backgroundColor: "#001337" }}>{m}</option>)}
            </FilterSelect>
            <FilterSelect value={filterModel} onChange={setFilterModel}>
              {modellen.map((m) => <option key={m} value={m} style={{ backgroundColor: "#001337" }}>{m}</option>)}
            </FilterSelect>
            <FilterSelect value={filterTransmissie} onChange={setFilterTransmissie}>
              {transmissies.map((t) => <option key={t} value={t} style={{ backgroundColor: "#001337" }}>{t}</option>)}
            </FilterSelect>
            <FilterSelect value={filterBrandstof} onChange={setFilterBrandstof}>
              {brandstofTypes.map((b) => <option key={b} value={b} style={{ backgroundColor: "#001337" }}>{b}</option>)}
            </FilterSelect>
            <FilterSelect value={filterPrijs} onChange={setFilterPrijs}>
              {prijsOpties.map((o) => <option key={o.value} value={o.value} style={{ backgroundColor: "#001337" }}>{o.label}</option>)}
            </FilterSelect>
            <FilterSelect value={sorteer} onChange={setSorteer}>
              {sorteerOpties.map((o) => <option key={o.value} value={o.value} style={{ backgroundColor: "#001337" }}>{o.label}</option>)}
            </FilterSelect>
            {hasFilters && (
              <button
                onClick={resetFilters}
                className="col-span-2 md:col-span-1 flex items-center justify-center gap-1 px-3 py-2.5 text-xs transition-all hover:bg-red-500/20 md:ml-1"
                style={{ color: "#ff8080", border: "1px solid rgba(255,128,128,0.25)", fontFamily: "var(--font-inter)" }}
              >
                <X size={12} /> Reset filters
              </button>
            )}
          </div>
          <div className="mt-2 text-xs text-center md:text-left" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-inter)" }}>
            {gefilterd.length} van {autos.length} voertuigen
          </div>
        </div>
      </div>

      {/* Grid */}
      <section ref={gridRef} className="py-16 px-6" style={{ backgroundColor: "#f5f5f5" }}>
        <div className="max-w-7xl mx-auto">
          {gefilterd.length === 0 ? (
            <div className="text-center py-32">
              <p className="text-gray-400 text-sm" style={{ fontFamily: "var(--font-inter)" }}>
                Geen voertuigen gevonden. Pas de filters aan.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {gefilterd.map((auto, i) => (
                <motion.div
                  key={auto.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={`/aanbod/${auto.slug || auto.id}`}
                    className="group block rounded-none overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer"
                    style={{ backgroundColor: "#ffffff" }}
                  >
                    {/* Foto */}
                    <div className="relative h-56 overflow-hidden" style={{ backgroundColor: "#001337" }}>
                      {auto.fotos && auto.fotos.length > 0 ? (
                        <AutoFoto
                          src={auto.fotos[0]}
                          alt={`${auto.merk} ${auto.model}`}
                          merk={auto.merk}
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          tekstGrootte={110}
                          lui
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span
                            className="text-7xl font-bold"
                            style={{ fontFamily: "var(--font-playfair)", color: "rgba(255,255,255,0.1)" }}
                          >
                            {auto.merk.slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{ background: "radial-gradient(ellipse at center, rgba(255,255,255,0.08), transparent 70%)" }}
                      />
                      {auto.verkocht && (
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                          <div
                            className="absolute flex items-center justify-center"
                            style={{
                              width: "160%",
                              top: "28%",
                              left: "-30%",
                              transform: "rotate(-35deg)",
                              backgroundColor: "#001337",
                              padding: "10px 0",
                              boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
                            }}
                          >
                            <span
                              className="text-white tracking-widest uppercase"
                              style={{ fontFamily: "var(--font-playfair)", fontSize: "22px", fontWeight: 700, letterSpacing: "0.15em" }}
                            >
                              Verkocht
                            </span>
                          </div>
                        </div>
                      )}
                      {auto.gereserveerd && !auto.verkocht && (
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                          <div
                            className="absolute flex items-center justify-center"
                            style={{
                              width: "160%",
                              top: "28%",
                              left: "-30%",
                              transform: "rotate(-35deg)",
                              backgroundColor: "#b45309",
                              padding: "10px 0",
                              boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
                            }}
                          >
                            <span
                              className="text-white tracking-widest uppercase"
                              style={{ fontFamily: "var(--font-playfair)", fontSize: "22px", fontWeight: 700, letterSpacing: "0.15em" }}
                            >
                              Gereserveerd
                            </span>
                          </div>
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <span
                          className="text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-none"
                          style={{ backgroundColor: "#ffffff", color: "#001337", fontFamily: "var(--font-inter)", fontWeight: 600 }}
                        >
                          {bodytypeLabel(auto)}
                        </span>
                      </div>
                      <div className="absolute top-4 right-4">
                        <span
                          className="text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-none"
                          style={{ backgroundColor: "rgba(0,0,0,0.4)", color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-inter)", backdropFilter: "blur(4px)" }}
                        >
                          {auto.kleur}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-[10px] tracking-widest uppercase font-semibold mb-1" style={{ color: "rgba(0,19,55,0.45)", fontFamily: "var(--font-inter)" }}>
                            {auto.merk}
                          </p>
                          <h3 className="text-xl font-bold leading-tight" style={{ fontFamily: "var(--font-playfair)", color: "#001337" }}>
                            {auto.model}
                          </h3>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: "#001337" }}>
                            {prijsWeergave(auto).tekst}
                          </p>
                          {prijsWeergave(auto).achtervoegsel && (
                            <p className="text-[11px] font-semibold" style={{ fontFamily: "var(--font-inter)", color: "rgba(0,19,55,0.5)" }}>
                              {prijsWeergave(auto).achtervoegsel}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Specs */}
                      <div className="grid grid-cols-2 gap-2 mb-5">
                        {[
                          { icon: <Calendar size={12} />, label: "Bouwjaar", value: auto.bouwjaar },
                          { icon: <Gauge size={12} />, label: "Kilometerstand", value: `${auto.km.toLocaleString("nl-NL")} km` },
                          { icon: <Fuel size={12} />, label: "Brandstof", value: auto.brandstof },
                          { icon: <Zap size={12} />, label: "Vermogen", value: auto.vermogen },
                        ].map((spec) => (
                          <div key={spec.label} className="flex items-center gap-2 py-2.5 px-3 rounded-none" style={{ backgroundColor: "#f5f5f5" }}>
                            <span style={{ color: "#001337" }}>{spec.icon}</span>
                            <div>
                              <div className="text-[9px] text-gray-400 uppercase tracking-wide" style={{ fontFamily: "var(--font-inter)" }}>{spec.label}</div>
                              <div className="text-xs font-semibold" style={{ color: "#001337", fontFamily: "var(--font-inter)" }}>{spec.value}</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="h-px mb-5" style={{ backgroundColor: "#f0f0f0" }} />

                      <div
                        className="flex items-center justify-between w-full py-3.5 px-5 rounded-none text-sm font-semibold tracking-wide transition-all group-hover:shadow-lg group-hover:scale-[1.01]"
                        style={{ backgroundColor: "#001337", color: "#ffffff", fontFamily: "var(--font-inter)" }}
                      >
                        Bekijk dit voertuig
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA onderaan */}
      <section className="py-20 px-6 text-center" style={{ backgroundColor: "#001337" }}>
        <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "#ffffff", fontFamily: "var(--font-inter)" }}>
          Niet gevonden wat je zoekt?
        </p>
        <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
          Wij zoeken jouw droomauto
        </h2>
        <p className="text-white/50 text-sm mb-8 max-w-md mx-auto" style={{ fontFamily: "var(--font-inter)" }}>
          Neem contact op en vertel ons wat je zoekt. We kijken actief mee in ons netwerk.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-none text-sm font-semibold transition-all hover:scale-105"
          style={{ backgroundColor: "#ffffff", color: "#001337", fontFamily: "var(--font-inter)" }}
        >
          Contact opnemen <ArrowRight size={14} />
        </Link>
      </section>
    </>
  );
}
