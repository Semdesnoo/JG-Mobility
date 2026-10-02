"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, X } from "lucide-react";
import { type Auto } from "@/lib/autos";
import { prijsWeergave } from "@/lib/prijs";
import { isBedrijfswagen, isMargeAuto } from "@/lib/voertuig";
import AutoKaart from "@/components/AutoKaart";

const prijsOpties = [
  { label: "Aanschafprijs", value: "" },
  { label: "Tot €10.000", value: "10000" },
  { label: "Tot €20.000", value: "20000" },
  { label: "Tot €30.000", value: "30000" },
  { label: "Tot €50.000", value: "50000" },
  { label: "Tot €75.000", value: "75000" },
  { label: "Tot €100.000", value: "100000" },
];

// Vaste reeks en niet uit de data: wie een maximum kiest denkt in ronde getallen, niet in
// de kilometerstanden die er toevallig in de voorraad staan.
const kmOpties = [
  { label: "Kilometerstand", value: "" },
  { label: "Tot 50.000 km", value: "50000" },
  { label: "Tot 100.000 km", value: "100000" },
  { label: "Tot 150.000 km", value: "150000" },
  { label: "Tot 200.000 km", value: "200000" },
];

const btwOpties = [
  { label: "BTW of marge", value: "" },
  { label: "Marge (geen btw)", value: "marge" },
  { label: "BTW-auto", value: "btw" },
];

const sorteerOpties = [
  { label: "Sorteren op", value: "" },
  { label: "Prijs: laag → hoog", value: "prijs-asc" },
  { label: "Prijs: hoog → laag", value: "prijs-desc" },
  { label: "Nieuwste eerst", value: "jaar-desc" },
  { label: "Oudste eerst", value: "jaar-asc" },
  { label: "Minste KM", value: "km-asc" },
];

/** De drie tabs boven de filterbalk. `alle` staat ook op /aanbod altijd vooraan. */
type Categorie = "alle" | "personen" | "bedrijf";

/** Hoort deze auto in de gekozen tab? */
function inTab(auto: Auto, tab: Categorie): boolean {
  if (tab === "bedrijf") return isBedrijfswagen(auto);
  if (tab === "personen") return !isBedrijfswagen(auto);
  return true;
}

function FilterSelect({ value, onChange, label, children }: { value: string; onChange: (v: string) => void; label: string; children: React.ReactNode }) {
  const active = value !== "" && !["Alle merken", "Alle modellen", "Alle transmissies", "Alle brandstof"].includes(value);
  return (
    // Elke keuzelijst vult zijn eigen cel in het raster: allemaal even breed en even
    // hoog, zodat de balk één strak blok is in plaats van een rij losse knoppen.
    <div className="relative w-full">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className="appearance-none w-full h-11 pr-9 pl-3.5 rounded-none text-[13px] font-medium cursor-pointer transition-colors truncate"
        style={{
          backgroundColor: active ? "#ffffff" : "rgba(255,255,255,0.05)",
          border: active ? "1px solid #ffffff" : "1px solid rgba(255,255,255,0.14)",
          color: active ? "#001337" : "rgba(255,255,255,0.8)",
          fontFamily: "var(--font-inter)",
          outline: "none",
        }}
      >
        {children}
      </select>
      <ChevronDown
        size={13}
        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ color: active ? "#001337" : "rgba(255,255,255,0.5)" }}
      />
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

export default function AanbodClient({
  autos,
  vasteSoort,
  titel,
  intro,
  children,
}: {
  autos: Auto[];
  /**
   * Zet de categorie vast en haalt de tabs weg. Zo kunnen /bedrijfswagens en
   * /personenautos deze lijst hergebruiken zonder dat een bezoeker daar met één klik in
   * een aanbod belandt waar die pagina niet over gaat.
   */
  vasteSoort?: "personen" | "bedrijf";
  /** De H1 in de hero. Leeg = "Onze collectie". */
  titel?: string;
  /** Eén alinea onder de H1 — de inleiding van de pagina die deze lijst hergebruikt. */
  intro?: string;
  /**
   * Komt direct ónder de hero en boven de filterbalk. De hero van deze lijst ís de hero
   * van /bedrijfswagens en /personenautos, dus hoort hun eigen uitleg (het uspblok) daar
   * tegenaan te staan en niet pas achter het hele aanbod.
   */
  children?: React.ReactNode;
}) {

  /**
   * Het raster gaat alleen over auto's die nog te koop zijn.
   *
   * WAAROM VERKOCHTE AUTO'S HIER NIET MEER TUSSEN STAAN
   * Ze stonden er eerst wel, onderaan, met een verkocht-band erover — dat een auto weg is
   * zegt iets goeds over de zaak. Maar het is ook de helft van wat je ziet als je filtert,
   * en elke klik erop loopt dood. Die auto's hebben nu hun eigen plek: /recent-verkocht,
   * met onderaan dit raster een link ernaartoe. Hier staat wat je vandaag kunt kopen.
   *
   * Dat de filters alleen over deze auto's gaan blijft daarmee ook kloppen: een merk
   * aanbieden waar niets van te koop is, is een lege belofte.
   */
  const beschikbaar = useMemo(() => autos.filter((a) => !a.verkocht), [autos]);

  const [categorie, setCategorie] = useState<Categorie>(vasteSoort ?? "alle");
  const [filterMerk, setFilterMerk] = useState("Alle merken");
  const [filterModel, setFilterModel] = useState("Alle modellen");
  const [filterTransmissie, setFilterTransmissie] = useState("Alle transmissies");
  const [filterBrandstof, setFilterBrandstof] = useState("Alle brandstof");
  const [filterPrijs, setFilterPrijs] = useState("");
  const [filterKm, setFilterKm] = useState("");
  const [filterBouwjaar, setFilterBouwjaar] = useState("");
  const [filterBtw, setFilterBtw] = useState("");
  const [sorteer, setSorteer] = useState("");

  // De voorraad binnen de gekozen tab. Alle keuzelijsten eronder komen hieruit, zodat op
  // /bedrijfswagens geen merken in de lijst staan waarvan er alleen personenauto's zijn.
  const inCategorie = useMemo(() => beschikbaar.filter((a) => inTab(a, categorie)), [beschikbaar, categorie]);

  const merken = useMemo(
    () => ["Alle merken", ...keuzelijst(inCategorie.map((a) => a.merk))],
    [inCategorie]
  );

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

  const modellen = useMemo(() => {
    const basis = inCategorie.filter((a) => filterMerk === "Alle merken" || gelijk(a.merk, filterMerk));
    return ["Alle modellen", ...keuzelijst(basis.map((a) => a.model))];
  }, [filterMerk, inCategorie]);

  const transmissies = useMemo(
    () => ["Alle transmissies", ...keuzelijst(inCategorie.map((a) => a.transmissie))],
    [inCategorie]
  );
  const brandstofTypes = useMemo(
    () => ["Alle brandstof", ...keuzelijst(inCategorie.map((a) => a.brandstof))],
    [inCategorie]
  );
  // Uit de data en niet uit een vaste reeks: staat de oudste auto op 2013, dan hoort 2008
  // niet in de lijst. Nieuwste bouwjaar bovenaan — daar kijkt men het eerst.
  const bouwjaren = useMemo(
    () => [...new Set(inCategorie.map((a) => a.bouwjaar))].sort((a, b) => b - a),
    [inCategorie]
  );

  const tabs = useMemo(() => {
    const bedrijf = beschikbaar.filter(isBedrijfswagen).length;
    return [
      { key: "alle" as const, label: "Alle", kort: "Alle", aantal: beschikbaar.length },
      { key: "personen" as const, label: "Personenauto's", kort: "Auto's", aantal: beschikbaar.length - bedrijf },
      { key: "bedrijf" as const, label: "Bedrijfswagens", kort: "Bedrijf", aantal: bedrijf },
    ];
  }, [beschikbaar]);

  // De tabs verschijnen alleen als er écht iets te kiezen valt. Staat de voorraad vol
  // personenauto's, dan is een tab "Bedrijfswagens 0" een lege belofte — dan hoort hij er
  // niet. En op /bedrijfswagens en /personenautos staat de categorie al vast.
  const toonTabs = !vasteSoort && tabs.every((t) => t.aantal > 0);

  const gefilterd = useMemo(() => {
    let lijst = beschikbaar.filter((a) => {
      if (!inTab(a, categorie)) return false;
      // Hoofdletter-ongevoelig: de keuzelijst toont één schrijfwijze, de auto's in de
      // database hebben er soms twee. Zonder dit filtert "BMW" de Bmw 330E weg.
      if (filterMerk !== "Alle merken" && !gelijk(a.merk, filterMerk)) return false;
      if (filterModel !== "Alle modellen" && !gelijk(a.model, filterModel)) return false;
      if (filterTransmissie !== "Alle transmissies" && !gelijk(a.transmissie, filterTransmissie)) return false;
      if (filterBrandstof !== "Alle brandstof" && !gelijk(a.brandstof, filterBrandstof)) return false;
      if (filterKm && a.km > parseInt(filterKm)) return false;
      if (filterBouwjaar && a.bouwjaar < parseInt(filterBouwjaar)) return false;
      if (filterBtw === "marge" && !isMargeAuto(a)) return false;
      if (filterBtw === "btw" && isMargeAuto(a)) return false;
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
    return lijst;
  }, [beschikbaar, categorie, filterMerk, filterModel, filterTransmissie, filterBrandstof, filterKm, filterBouwjaar, filterBtw, filterPrijs, sorteer]);

  const hasFilters =
    categorie !== (vasteSoort ?? "alle") ||
    filterMerk !== "Alle merken" ||
    filterModel !== "Alle modellen" ||
    filterTransmissie !== "Alle transmissies" ||
    filterBrandstof !== "Alle brandstof" ||
    filterPrijs !== "" ||
    filterKm !== "" ||
    filterBouwjaar !== "" ||
    filterBtw !== "" ||
    sorteer !== "";

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
  }, [categorie, filterMerk, filterModel, filterTransmissie, filterBrandstof, filterPrijs, filterKm, filterBouwjaar, filterBtw, sorteer]);

  const resetFilters = () => {
    setCategorie(vasteSoort ?? "alle");
    setFilterMerk("Alle merken");
    setFilterModel("Alle modellen");
    setFilterTransmissie("Alle transmissies");
    setFilterBrandstof("Alle brandstof");
    setFilterPrijs("");
    setFilterKm("");
    setFilterBouwjaar("");
    setFilterBtw("");
    setSorteer("");
  };

  /**
   * Van tab wisselen betekent een ander deel van de voorraad.
   *
   * De keuzelijsten eronder komen uit de auto's die in de tab staan: andere merken,
   * andere brandstoffen, andere bouwjaren. Een gekozen waarde die in de nieuwe tab niet
   * bestaat zou in de balk blijven staan terwijl er niets meer aan voldoet — je klikt op
   * Bedrijfswagens en krijgt nul resultaten omdat er nog "Fiat" stond. Daarom gaan de
   * filters die uit de data komen mee op nul. Prijs, kilometerstand, btw en de sortering
   * zijn vaste reeksen en blijven staan.
   */
  const kiesCategorie = (nieuw: Categorie) => {
    setCategorie(nieuw);
    setFilterMerk("Alle merken");
    setFilterModel("Alle modellen");
    setFilterTransmissie("Alle transmissies");
    setFilterBrandstof("Alle brandstof");
    setFilterBouwjaar("");
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
            Bedrijfswagens &amp; Geselecteerde Occasions
          </motion.p>
          {/* Op de telefoon kleiner dan voorheen: "Bedrijfswagens kopen in Barendrecht"
              past op 375 pixels niet op één regel in de oude maat en liep over de rand. */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {titel ?? "Onze collectie"}
          </motion.h1>
          {intro && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-sm md:text-base max-w-xl mb-4"
              style={{ color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-inter)", lineHeight: 1.8 }}
            >
              {intro}
            </motion.p>
          )}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/40 text-sm"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            {inCategorie.length} {inCategorie.length === 1 ? "voertuig" : "voertuigen"} beschikbaar
          </motion.p>
        </div>
      </div>

      {children}

      {/* Filter balk — sticky alleen desktop */}
      <div
        ref={filterRef}
        className="md:sticky top-[80px] z-40 px-4 md:px-6 py-4"
        style={{
          // Was rgba(...,0.97) mét een blur eronder. Bij 97% dekking zie je van die blur
          // niets, terwijl de browser hem bij elk beeldje opnieuw moet uitrekenen — juist
          // tijdens het scrollen, precies wanneer je de soepelheid nodig hebt.
          backgroundColor: "#02163a",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Bovenste regel: categorie links, aantal + sorteren rechts.
              Personenauto of bedrijfswagen is de eerste vraag en een heel ander aanbod;
              dat hoort niet weggestopt in een keuzelijst. De drie knoppen zitten als één
              blok aan elkaar, met het aantal erachter, zodat je vóór het klikken ziet wat
              je te wachten staat. */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
            {toonTabs ? (
              <div className="grid grid-cols-3 md:inline-flex" style={{ border: "1px solid rgba(255,255,255,0.14)" }}>
                {tabs.map((tab, i) => {
                  const actief = categorie === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => kiesCategorie(tab.key)}
                      aria-pressed={actief}
                      className="flex items-center justify-center gap-1.5 md:gap-2 h-11 px-2 md:px-5 rounded-none text-[11px] md:text-xs tracking-widest uppercase font-semibold whitespace-nowrap transition-colors"
                      style={{
                        backgroundColor: actief ? "#ffffff" : "transparent",
                        color: actief ? "#001337" : "rgba(255,255,255,0.75)",
                        borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.14)" : "none",
                        fontFamily: "var(--font-inter)",
                      }}
                    >
                      {/* Op een smalle telefoon past "Bedrijfswagens 1" niet in een derde van
                          het scherm; daar staat de korte naam. */}
                      <span className="sm:hidden">{tab.kort}</span>
                      <span className="hidden sm:inline">{tab.label}</span>
                      <span className="text-[10px] font-medium tracking-normal" style={{ opacity: 0.55 }}>{tab.aantal}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <span />
            )}

            <div className="flex items-center gap-3">
              <span className="hidden md:inline text-xs whitespace-nowrap" style={{ color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-inter)" }}>
                {gefilterd.length} van {inCategorie.length} voertuigen
              </span>
              <div className="w-full md:w-48">
                <FilterSelect value={sorteer} onChange={setSorteer} label="Sorteren">
                  {sorteerOpties.map((o) => <option key={o.value} value={o.value} style={{ backgroundColor: "#001337", color: "#ffffff" }}>{o.label}</option>)}
                </FilterSelect>
              </div>
            </div>
          </div>

          {/* De filters: één raster, overal even breed. Op de telefoon twee naast elkaar,
              op een laptop vier, op een breed scherm alle acht op één regel. */}
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-2">
            <FilterSelect value={filterPrijs} onChange={setFilterPrijs} label="Prijs">
              {prijsOpties.map((o) => <option key={o.value} value={o.value} style={{ backgroundColor: "#001337", color: "#ffffff" }}>{o.label}</option>)}
            </FilterSelect>
            <FilterSelect value={filterMerk} onChange={(v) => { setFilterMerk(v); setFilterModel("Alle modellen"); }} label="Merk">
              {merken.map((m) => <option key={m} value={m} style={{ backgroundColor: "#001337", color: "#ffffff" }}>{m}</option>)}
            </FilterSelect>
            <FilterSelect value={filterModel} onChange={setFilterModel} label="Model">
              {modellen.map((m) => <option key={m} value={m} style={{ backgroundColor: "#001337", color: "#ffffff" }}>{m}</option>)}
            </FilterSelect>
            <FilterSelect value={filterKm} onChange={setFilterKm} label="Kilometerstand">
              {kmOpties.map((o) => <option key={o.value} value={o.value} style={{ backgroundColor: "#001337", color: "#ffffff" }}>{o.label}</option>)}
            </FilterSelect>
            <FilterSelect value={filterBrandstof} onChange={setFilterBrandstof} label="Brandstof">
              {brandstofTypes.map((b) => <option key={b} value={b} style={{ backgroundColor: "#001337", color: "#ffffff" }}>{b}</option>)}
            </FilterSelect>
            <FilterSelect value={filterTransmissie} onChange={setFilterTransmissie} label="Transmissie">
              {transmissies.map((t) => <option key={t} value={t} style={{ backgroundColor: "#001337", color: "#ffffff" }}>{t}</option>)}
            </FilterSelect>
            <FilterSelect value={filterBouwjaar} onChange={setFilterBouwjaar} label="Bouwjaar">
              <option value="" style={{ backgroundColor: "#001337", color: "#ffffff" }}>Bouwjaar vanaf</option>
              {bouwjaren.map((j) => <option key={j} value={String(j)} style={{ backgroundColor: "#001337", color: "#ffffff" }}>Vanaf {j}</option>)}
            </FilterSelect>
            <FilterSelect value={filterBtw} onChange={setFilterBtw} label="BTW of marge">
              {btwOpties.map((o) => <option key={o.value} value={o.value} style={{ backgroundColor: "#001337", color: "#ffffff" }}>{o.label}</option>)}
            </FilterSelect>
          </div>

          {/* Onderregel: aantal (op de telefoon, waar het bovenaan geen plek heeft) en
              wissen. Wissen staat er alleen als er iets te wissen is. */}
          <div className="flex items-center justify-between gap-3 mt-3 min-h-[20px]">
            <span className="md:hidden text-xs" style={{ color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-inter)" }}>
              {gefilterd.length} van {inCategorie.length} voertuigen
            </span>
            {hasFilters && (
              <button
                onClick={resetFilters}
                className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold underline underline-offset-4 transition-opacity hover:opacity-70"
                style={{ color: "rgba(255,255,255,0.75)", fontFamily: "var(--font-inter)" }}
              >
                <X size={12} /> Filters wissen
              </button>
            )}
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
                  {/* Dezelfde kaart als op de homepage, onder een autopagina en op
                      /recent-verkocht. Hier stond lang een eigen kopie met zijn eigen
                      verkocht-band en zijn eigen prijsweergave; die liep gegarandeerd uit
                      de pas met de rest. Zie components/AutoKaart.tsx. */}
                  <AutoKaart auto={auto} sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw" />
                </motion.div>
              ))}
            </div>
          )}

          {/* De verkochte auto's die hier eerst onderaan het raster stonden. Dat een auto
              weg is zegt iets goeds over de zaak, dus het hoort ergens te staan — maar
              niet tussen de auto's die je kunt kopen. */}
          <div className="mt-12 pt-8 text-center" style={{ borderTop: "1px solid rgba(0,19,55,0.08)" }}>
            <Link
              href="/recent-verkocht"
              className="group inline-flex items-center gap-2 text-xs tracking-widest uppercase font-semibold hover:opacity-70 transition-opacity"
              style={{ color: "#001337", fontFamily: "var(--font-inter)" }}
            >
              Bekijk recent verkochte voertuigen
              <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA onderaan — alleen op /aanbod.
          De pagina's die deze lijst hergebruiken sluiten zelf af met een CTA die bij hun
          onderwerp past; twee bijna gelijke oproepen onder elkaar leest als een vergissing. */}
      {!vasteSoort && (
        <section className="py-20 px-6 text-center" style={{ backgroundColor: "#001337" }}>
          <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "#ffffff", fontFamily: "var(--font-inter)" }}>
            Niet gevonden wat je zoekt?
          </p>
          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
            Wij zoeken mee
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
      )}
    </>
  );
}
