"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { preconnect } from "react-dom";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  X,
  CalendarDays,
  Calculator,
  Repeat,
  Play,
  Camera,
  Info,
} from "lucide-react";
import { type Auto } from "@/lib/autos";
import { prijsWeergave } from "@/lib/prijs";
import { bodytypeLabel, isBedrijfswagen } from "@/lib/voertuig";
import { leaseMaandbedrag, leaseTekst, LEASE_VOORWAARDEN } from "@/lib/lease";
import { motion, AnimatePresence } from "framer-motion";
import AutoFoto from "@/components/AutoFoto";
import ZoomFoto from "@/components/ZoomFoto";
import ContactBlok from "./ContactBlok";
import AutoAanvraagFormulier from "@/components/AutoAanvraagFormulier";

// "Contact" stond hier ook. Dat is nu een eigen sectie onder de auto (ContactBlok):
// de belangrijkste handeling van de pagina hoort niet achter een tabblad te zitten.
// Op die vrijgekomen plek staat nu Inruilen — voorlopig een korte uitleg met een
// contactknop; hier komt later de echte inruilfunctie.
const tabs = ["Kenmerken", "Opties", "Omschrijving", "Financieren", "Inruilen"];

/** De stappen zoals ze ook op /diensten/inkoop-taxatie staan — geen nieuwe beloftes. */
const INRUIL_STAPPEN = [
  { stap: "01", titel: "Gratis taxatie", tekst: "Wij bepalen de marktwaarde op basis van actuele data en de staat van je voertuig. Vrijblijvend." },
  { stap: "02", titel: "Bod binnen 24 uur", tekst: "Je hoort snel wat je auto waard is. Geen onderhandelingstactieken, geen verborgen kosten." },
  { stap: "03", titel: "Verrekend met deze auto", tekst: "Akkoord? Dan gaat dat bedrag van de prijs af en regelen wij de overdracht en het kenteken." },
];

// In Lease Auto's — dealer ID van JG Mobility (publiek, staat in de iframe-URL)
const INLEASE_DEALER_ID = "13504";
const INLEASE_ORIGIN = "https://calculator.inleaseautos.nl";

const WHATSAPP_NUMMER = "31621331374";

/** Wat er bij ontbrekende gegevens staat: liever dit dan een lege regel. */
const opAanvraag = (waarde?: string) => (waarde && waarde.trim()) || "Op aanvraag";

const BIJZONDERHEDEN_STANDAARD =
  "Vraag ons gerust naar de staat — we zijn transparant over gebruikssporen.";

/**
 * Het btw-verhaal in één regel onder de prijs.
 *
 * WAAROM DIT NIET GEWOON `auto.btw` IS
 * Daar staat "Marge" of "BTW-auto" — dealertaal. Een particulier weet niet dat "Marge"
 * betekent dat er niets meer bij komt, en een ondernemer wil weten of hij de btw kan
 * terugvragen. Allebei lezen ze het verkeerd als het er niet staat, en een verkeerd
 * gelezen prijs is een telefoontje waar niemand blij van wordt.
 *
 * Let op het derde geval: een BTW-auto waarvan we de prijs mét btw tonen. Daar mag niet
 * "prijs excl. btw" boven staan, want dat is dan simpelweg onwaar.
 */
function btwLabel(auto: Auto): string {
  if (/marge/i.test(auto.btw)) return "Margeauto — geen btw verrekenbaar";
  if (auto.prijsExclBtw) return "BTW-auto — prijs excl. btw";
  return "BTW-auto — prijs incl. btw, btw verrekenbaar";
}

export default function AutoDetailClient({
  auto,
  autoUrl,
  gerelateerd,
}: {
  auto: Auto;
  /** Op de server gerenderd blok "Vergelijkbare voertuigen". */
  gerelateerd?: React.ReactNode;
  autoUrl: string;
}) {
  const [activeTab, setActiveTab] = useState("Kenmerken");
  const [calcArmed, setCalcArmed] = useState(false);
  // Blijft true zodra het inruiltabblad één keer geopend is, zodat het formulier gemonteerd blijft.
  const [inruilGeopend, setInruilGeopend] = useState(false);
  const [calcLoaded, setCalcLoaded] = useState(false);
  const armCalculator = () => setCalcArmed(true);
  const tabSectionRef = useRef<HTMLElement>(null);

  // Mobiel: detecteer of de tab-balk nog naar rechts kan scrollen (hint tonen)
  const tabBarRef = useRef<HTMLDivElement>(null);
  const [tabsMeer, setTabsMeer] = useState(false);
  const updateTabsMeer = () => {
    const el = tabBarRef.current;
    if (el) setTabsMeer(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };
  useEffect(() => {
    updateTabsMeer();
    window.addEventListener("resize", updateTabsMeer);
    return () => window.removeEventListener("resize", updateTabsMeer);
  }, []);

  const switchTab = (tab: string) => {
    if (tab === "Financieren") setCalcArmed(true);
    if (tab === "Inruilen") setInruilGeopend(true);
    setActiveTab(tab);
    setTimeout(() => {
      if (tabSectionRef.current) {
        const y = tabSectionRef.current.getBoundingClientRect().top + window.scrollY - 120;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }, 0);
  };
  /**
   * De bezichtiging gebeurt met de afspraakplanner onderaan de pagina (ContactBlok).
   * Die staat daar dichtgeklapt; de knop hierboven zet hem open en scrollt erheen, zodat
   * "Plan een bezichtiging" niet naar een andere pagina stuurt waar je alles opnieuw moet
   * uitleggen. Open blijft open — ook als je daarna nog even een tabblad aanklikt.
   */
  const [bezichtiging, setBezichtiging] = useState(false);
  const naarBezichtiging = () => {
    setBezichtiging(true);
    // Eén tik later, zodat de planner er al staat voordat we ernaartoe scrollen.
    setTimeout(() => {
      const el = document.getElementById("bezichtiging");
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }, 0);
  };

  const [fotoIndex, setFotoIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  // Staat er een walkaround-video bij, dan kan die de hoofdfoto overnemen. Hij laadt pas
  // als je hem opent (preload="none"): een video is een paar megabyte en niemand die hem
  // niet aanklikt hoort daarvoor te betalen.
  const [videoAan, setVideoAan] = useState(false);

  const heeftFotos = auto.fotos && auto.fotos.length > 0;
  const aantalFotos = auto.fotos?.length ?? 0;

  // Wat er op het scherm hoort te staan. Bij een bedrijfswagen is dat het bedrag zonder
  // btw; `auto.prijs` blijft ook dan het bedrag inclusief btw.
  const prijs = prijsWeergave(auto);
  const leaseMaand = leaseMaandbedrag(auto);

  // In Lease Auto's calculator: marge=1 voor margevoertuigen, marge=0 voor BTW-voertuigen.
  // `price` blijft bewust het bedrag INCLUSIEF btw, ook bij een bedrijfswagen — dat is wat
  // de calculator hier altijd al kreeg, en de marge-vlag vertelt hem hoe hij ermee omgaat.
  const margeParam = /marge/i.test(auto.btw) ? 1 : 0;
  const calculatorSrc =
    `${INLEASE_ORIGIN}/?dealer_id=${INLEASE_DEALER_ID}` +
    `&price=${auto.prijs}&marge=${margeParam}&ref=${encodeURIComponent(autoUrl)}`;

  // Warm de verbinding met de calculator-server al bij het laden van de pagina,
  // zodat DNS/TLS niet op het kritieke pad zit wanneer de iframe laadt.
  preconnect(INLEASE_ORIGIN);

  // De eerste vraag komt bijna altijd per WhatsApp. Merk, model, kenteken en de link naar
  // deze pagina staan er al in: Jimi weet dan meteen om welk voertuig het gaat, en de
  // bezoeker hoeft niets op te zoeken of over te typen.
  const whatsappVraag = encodeURIComponent(
    `Hallo Jimi, ik heb een vraag over de ${auto.merk} ${auto.model}` +
      `${auto.kenteken ? ` (${auto.kenteken})` : ""} uit ${auto.bouwjaar}.\n${autoUrl}`
  );

  const volgendeFoto = () => setFotoIndex((i) => (i + 1) % aantalFotos);
  const vorigeFoto = () => setFotoIndex((i) => (i - 1 + aantalFotos) % aantalFotos);

  // In de vergroting: Esc sluit, pijltjes bladeren — zoals elke fotoviewer.
  useEffect(() => {
    if (!lightbox) return;
    const toets = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowRight") setFotoIndex((i) => (i + 1) % aantalFotos);
      if (e.key === "ArrowLeft") setFotoIndex((i) => (i - 1 + aantalFotos) % aantalFotos);
    };
    window.addEventListener("keydown", toets);
    return () => window.removeEventListener("keydown", toets);
  }, [lightbox, aantalFotos]);

  /**
   * Doorklikken zonder te wachten.
   *
   * WAT HIER EERDER GEBEURDE
   * Er hing één foto in beeld en bij een klik werd de bron vervangen. Pas op dat moment
   * begon de browser aan het ophalen: een half rondje naar de server van ongeveer 85 tot
   * 230 ms, plus uitpakken. Precies die tijd stond de bezoeker naar de vorige foto te
   * kijken terwijl hij al doorgeklikt had.
   *
   * Nu staan de buren al klaar. Ze hangen onzichtbaar op dezelfde plek en het doorklikken
   * is nog maar het omzetten van één doorzichtigheid — geen netwerk, geen uitpakken.
   *
   * Twee grendels, want vooruit laden mag nooit ten koste gaan van wat je nu ziet:
   * • het klaarzetten begint pas als de browser rustig is (requestIdleCallback), zodat de
   *   eerste foto — waar Google de laadtijd van de pagina aan afmeet — voorrang houdt;
   * • de buren laden met fetchPriority "low", zodat ze ook daarna nooit voordringen.
   *
   * Twee vooruit en twee terug. Ver genoeg om normaal doorbladeren voor te blijven, dicht
   * genoeg om op een telefoon niet stiekem de hele reeks binnen te halen.
   */
  const [rustig, setRustig] = useState(false);
  const [voorbeschouwd, setVoorbeschouwd] = useState<number | null>(null);

  useEffect(() => {
    if (aantalFotos < 2) return;
    type MetIdle = Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const w = window as MetIdle;
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(() => setRustig(true), { timeout: 2500 });
      return () => w.cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(() => setRustig(true), 1200);
    return () => window.clearTimeout(id);
  }, [aantalFotos]);

  const zichtbareFotos = useMemo(() => {
    if (!heeftFotos) return [];
    const uit = [fotoIndex];
    const voegToe = (i: number) => {
      const n = ((i % aantalFotos) + aantalFotos) % aantalFotos;
      if (!uit.includes(n)) uit.push(n);
    };
    if (rustig && aantalFotos > 1) [1, -1, 2, -2].forEach((stap) => voegToe(fotoIndex + stap));
    // Zweef je over een duimnagel, dan is dat de foto die je zo aanklikt.
    if (voorbeschouwd != null) voegToe(voorbeschouwd);
    return uit;
  }, [heeftFotos, fotoIndex, aantalFotos, rustig, voorbeschouwd]);

  return (
    <>
      {/* Broodkruimel */}
      <div className="pt-28 md:pt-52 pb-4 px-6" style={{ backgroundColor: "#001337" }}>
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-inter)" }}>
          <Link href="/aanbod" className="hover:text-white transition-colors flex items-center gap-1">
            <ArrowLeft size={12} /> Terug naar aanbod
          </Link>
          <ChevronRight size={10} />
          <span style={{ color: "rgba(255,255,255,0.7)" }}>{auto.merk} {auto.model}</span>
        </div>
      </div>

      {/* Hero: foto + hoofdinfo */}
      <div className="pb-0 px-6" style={{ backgroundColor: "#001337" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            {/* Foto / galerij */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className={`relative rounded-none overflow-hidden aspect-[16/10] ${videoAan ? "" : "cursor-pointer"}`}
                style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
                // Staat de video aan, dan hoort een klik bij de speler en niet bij de
                // vergroting van een foto die er niet staat.
                onClick={() => !videoAan && heeftFotos && setLightbox(true)}
              >
                {videoAan && auto.video ? (
                  /* De walkaround. `preload="none"` want hij mag de pagina niet vertragen,
                     `playsInline` zodat iOS hem in de pagina afspeelt in plaats van het
                     scherm over te nemen. */
                  <video
                    src={auto.video}
                    controls
                    autoPlay
                    preload="none"
                    playsInline
                    className="absolute inset-0 w-full h-full object-contain rounded-none"
                    style={{ backgroundColor: "#000000", borderRadius: 0 }}
                  />
                ) : heeftFotos ? (
                  zichtbareFotos.map((i) => (
                    <div
                      key={i}
                      className="absolute inset-0"
                      style={{ opacity: i === fotoIndex ? 1 : 0, transition: "opacity 120ms ease-out" }}
                      aria-hidden={i !== fotoIndex}
                    >
                      <AutoFoto
                        src={auto.fotos![i]}
                        alt={i === fotoIndex ? `${auto.merk} ${auto.model}` : ""}
                        merk={auto.merk}
                        sizes="(max-width: 1024px) 100vw, 60vw"
                        priority={i === 0}
                        // Foto 0 draagt priority (dat is de foto waar Google de laadtijd
                        // aan meet) en mag daar niet mee in de knoop raken; de rest laadt
                        // laag geprioriteerd zolang je er niet naar kijkt.
                        fetchPriority={i === fotoIndex || i === 0 ? undefined : "low"}
                      />
                    </div>
                  ))
                ) : (
                  <>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[180px] font-bold select-none" style={{ fontFamily: "var(--font-playfair)", color: "rgba(255,255,255,0.04)" }}>
                        {auto.merk.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 30% 70%, rgba(255,255,255,0.08) 0%, transparent 60%)" }} />
                  </>
                )}

                {!videoAan && aantalFotos > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); vorigeFoto(); }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-none flex items-center justify-center transition-all hover:bg-white/30"
                      style={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
                    >
                      <ChevronLeft size={16} color="white" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); volgendeFoto(); }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-none flex items-center justify-center transition-all hover:bg-white/30"
                      style={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
                    >
                      <ArrowRight size={16} color="white" />
                    </button>
                    <div className="absolute bottom-4 right-4 px-3 py-1 rounded-none text-xs font-semibold" style={{ backgroundColor: "rgba(0,0,0,0.5)", color: "rgba(255,255,255,0.8)", fontFamily: "var(--font-inter)", backdropFilter: "blur(4px)" }}>
                      {fotoIndex + 1} / {aantalFotos}
                    </div>
                  </>
                )}

                {!videoAan && (
                  <>
                    <div className="absolute top-4 left-4">
                      <span className="text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-none font-semibold" style={{ backgroundColor: "#ffffff", color: "#001337", fontFamily: "var(--font-inter)" }}>
                        {bodytypeLabel(auto)}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-none" style={{ backgroundColor: "rgba(0,0,0,0.4)", color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-inter)", backdropFilter: "blur(4px)" }}>
                        {auto.kleurExterieur}
                      </span>
                    </div>
                  </>
                )}
              </motion.div>

              {/* Walkaround-video: hij wisselt met het fotovak hierboven in plaats van
                  eronder te komen staan. Zo blijft de hoofdfoto de bovenste helft van de
                  pagina — die foto is waar Google de laadtijd aan meet — en hoeft de
                  bezoeker niet te scrollen om van de video terug te kunnen. */}
              {auto.video && (
                <button
                  type="button"
                  onClick={() => setVideoAan((aan) => !aan)}
                  className="flex items-center justify-center gap-2 w-full sm:w-auto mt-3 px-5 py-3 rounded-none text-sm font-semibold transition-all hover:bg-white/10"
                  style={{ border: "1px solid rgba(255,255,255,0.2)", color: "#ffffff", fontFamily: "var(--font-inter)" }}
                >
                  {videoAan ? <Camera size={14} /> : <Play size={14} />}
                  {videoAan ? "Terug naar de foto's" : "Bekijk walkaround-video"}
                </button>
              )}

              {/* Thumbnail rij — vanaf 640px. Op een telefoon zouden deze duimnagels de
                  prijs en de kenmerken onder de rand van het scherm duwen, en daar zijn
                  de pijlen en de teller op de foto zelf voor. */}
              {aantalFotos > 1 && (
                <div className="hidden sm:flex gap-2 mt-3 overflow-x-auto" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                  {auto.fotos!.map((foto, i) => (
                    <button
                      key={i}
                      onClick={() => setFotoIndex(i)}
                      onPointerEnter={() => setVoorbeschouwd(i)}
                      onFocus={() => setVoorbeschouwd(i)}
                      className="relative flex-shrink-0 w-20 h-14 rounded-none overflow-hidden transition-all"
                      style={{ border: fotoIndex === i ? "2px solid #ffffff" : "2px solid rgba(255,255,255,0.15)" }}
                      aria-label={`Foto ${i + 1}`}
                    >
                      <AutoFoto src={foto} alt="" merk={auto.merk} sizes="80px" tekstGrootte={22} lui />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Lightbox */}
            <AnimatePresence>
              {lightbox && heeftFotos && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[100] flex items-center justify-center"
                  style={{ backgroundColor: "rgba(0,0,0,0.92)" }}
                  onClick={() => setLightbox(false)}
                >
                  <button aria-label="Sluiten" className="absolute z-10 top-4 right-4 md:top-6 md:right-6 w-10 h-10 rounded-none flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
                    <X size={18} color="white" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); vorigeFoto(); }}
                    className="absolute z-10 left-2 md:left-6 w-10 h-10 md:w-12 md:h-12 rounded-none flex items-center justify-center hover:bg-white/20 transition-all"
                    style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                  >
                    <ChevronLeft size={20} color="white" />
                  </button>
                  {/* Inzoomen: tikken, knijpen, scrollen of de +/− knoppen (zie ZoomFoto).
                      Nog steeds next/image en niet het origineel van ruim 4 MB; ingezoomd
                      haalt ZoomFoto zelf een grotere variant op. key={fotoIndex}: elke foto
                      begint weer op 100%. */}
                  <ZoomFoto
                    key={fotoIndex}
                    src={auto.fotos![fotoIndex]}
                    alt={`${auto.merk} ${auto.model} — foto ${fotoIndex + 1} van ${aantalFotos}`}
                    onVorige={vorigeFoto}
                    onVolgende={volgendeFoto}
                  />
                  <button
                    onClick={(e) => { e.stopPropagation(); volgendeFoto(); }}
                    className="absolute z-10 right-2 md:right-6 w-10 h-10 md:w-12 md:h-12 rounded-none flex items-center justify-center hover:bg-white/20 transition-all"
                    style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                  >
                    <ArrowRight size={20} color="white" />
                  </button>
                  <div className="absolute top-6 md:top-8 left-1/2 -translate-x-1/2 text-sm" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-inter)" }}>
                    {fotoIndex + 1} / {aantalFotos}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Rechter info */}
            <div className="lg:col-span-2 pb-8">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-inter)" }}>
                  {auto.merk}
                </p>
                <h1 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-playfair)" }}>
                  {auto.model}
                </h1>

                {/* Prijs direct onder de kop, en de uitvoering eronder in plaats van
                    ertussen. Op een telefoon scheelt dat de twee regels die bepaalden of
                    de prijs nog net wel of net niet in beeld stond. */}
                <div className="mb-4 pb-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  <p className="text-4xl font-bold text-white" style={{ fontFamily: "var(--font-playfair)" }}>
                    {prijs.tekst},-
                    {prijs.achtervoegsel && (
                      <span className="text-lg font-semibold ml-2" style={{ color: "rgba(255,255,255,0.55)", fontFamily: "var(--font-inter)" }}>
                        {prijs.achtervoegsel}
                      </span>
                    )}
                  </p>
                  <p className="text-xs font-semibold mt-1.5" style={{ color: "rgba(255,255,255,0.75)", fontFamily: "var(--font-inter)" }}>
                    {btwLabel(auto)}
                  </p>
                  {prijs.tegenhanger && (
                    <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-inter)" }}>
                      Dat is {prijs.tegenhanger}
                    </p>
                  )}

                  {/* Leaseprijs direct onder de koopprijs: wie zakelijk koopt, denkt in
                      maandbedragen. Klik opent de calculator, waar hij looptijd en
                      aanbetaling zelf kan schuiven. */}
                  {leaseMaand !== null && (
                    <button
                      type="button"
                      onClick={() => switchTab("Financieren")}
                      onMouseEnter={armCalculator}
                      onTouchStart={armCalculator}
                      className="mt-4 w-full flex items-center justify-between gap-3 px-4 py-3 rounded-none text-left transition-colors hover:bg-white/10"
                      style={{ border: "1px solid rgba(255,255,255,0.18)", backgroundColor: "rgba(255,255,255,0.04)" }}
                    >
                      <span>
                        <span className="block text-[10px] tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-inter)" }}>
                          Financial lease vanaf
                        </span>
                        <span className="block text-2xl font-bold text-white" style={{ fontFamily: "var(--font-playfair)" }}>
                          {leaseTekst(leaseMaand)}
                          <span className="text-sm font-semibold ml-1" style={{ color: "rgba(255,255,255,0.55)", fontFamily: "var(--font-inter)" }}>
                            p/m
                          </span>
                        </span>
                        <span className="block text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-inter)" }}>
                          {LEASE_VOORWAARDEN}
                        </span>
                      </span>
                      <span className="flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap" style={{ color: "#ffffff", fontFamily: "var(--font-inter)" }}>
                        Bereken zelf <ArrowRight size={13} />
                      </span>
                    </button>
                  )}
                </div>

                <p className="text-sm mb-5" style={{ color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-inter)" }}>
                  {auto.versie}
                </p>

                {/* De vier waar het bij een occasion op staat of valt. Groter dan ze
                    stonden, en zonder vermogen en APK ertussen — die beslissen niets en
                    staan nu op één regel eronder. */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {[
                    { label: "Kilometerstand", value: `${auto.km.toLocaleString("nl-NL")} km` },
                    { label: "Bouwjaar", value: String(auto.bouwjaar) },
                    { label: "Brandstof", value: auto.brandstof },
                    { label: "Transmissie", value: auto.transmissie },
                  ].map((spec) => (
                    <div key={spec.label} className="py-3 px-4 rounded-none" style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div className="text-[9px] uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-inter)" }}>{spec.label}</div>
                      <div className="text-base font-semibold text-white" style={{ fontFamily: "var(--font-inter)" }}>{spec.value}</div>
                    </div>
                  ))}
                </div>

                <p className="text-xs mb-6" style={{ color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-inter)" }}>
                  {auto.vermogen} · APK tot {auto.apk} · {bodytypeLabel(auto)}
                </p>

                {/* ── Wat je hierna kunt doen ──
                    Hier stonden twee knoppen die allebei naar /contact gingen: één met
                    "Stuur een bericht" en één met "Proefrit aanvragen". Wie erop klikte
                    kwam op een leeg formulier en moest daar zelf uitleggen welke auto hij
                    bedoelde. Deze vier doen allemaal iets anders, en alle vier nemen ze
                    het voertuig mee. */}
                <div className="flex flex-col gap-3">
                  {/* WhatsApp mag hier zijn eigen groen houden: dit is de knop waar de
                      meeste eerste vragen vandaan komen, en in dat groen herkent iedereen
                      hem zonder te lezen. */}
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMMER}?text=${whatsappVraag}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2.5 py-4 px-5 rounded-none text-sm font-semibold text-center transition-all hover:opacity-90"
                    style={{ backgroundColor: "#25D366", color: "#ffffff", fontFamily: "var(--font-inter)" }}
                  >
                    {/* Officieel WhatsApp-logo (Simple Icons, CC0), zelfde pad als in ContactBlok. */}
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="#ffffff" aria-hidden="true" style={{ flexShrink: 0 }}>
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    Stel direct een vraag over dit voertuig
                  </a>

                  <button
                    type="button"
                    onClick={naarBezichtiging}
                    className="flex items-center justify-center gap-2 py-4 px-5 rounded-none text-sm font-semibold transition-all hover:opacity-90"
                    style={{ backgroundColor: "#ffffff", color: "#001337", fontFamily: "var(--font-inter)" }}
                  >
                    <CalendarDays size={15} />
                    Plan een bezichtiging
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => switchTab("Financieren")}
                      // Dezelfde vooruitgreep als op het tabblad zelf: zweven of
                      // aanraken is al genoeg om de calculator te laten laden.
                      onMouseEnter={armCalculator}
                      onFocus={armCalculator}
                      onTouchStart={armCalculator}
                      className="flex items-center justify-center gap-2 py-4 px-4 rounded-none text-sm font-semibold transition-all hover:bg-white/10"
                      style={{ border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.85)", fontFamily: "var(--font-inter)" }}
                    >
                      <Calculator size={14} />
                      Bereken financial lease
                    </button>
                    <button
                      type="button"
                      onClick={() => switchTab("Inruilen")}
                      className="flex items-center justify-center gap-2 py-4 px-4 rounded-none text-sm font-semibold transition-all hover:bg-white/10"
                      style={{ border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.85)", fontFamily: "var(--font-inter)" }}
                    >
                      <Repeat size={14} />
                      Vraag inruilvoorstel aan
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs balk */}
      <div className="sticky top-[85px] z-40" style={{ backgroundColor: "rgba(0,19,55,0.97)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="relative max-w-7xl mx-auto">
          <div
            ref={tabBarRef}
            onScroll={updateTabsMeer}
            className="px-6 flex items-stretch overflow-x-auto"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={(e) => { switchTab(tab); e.currentTarget.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" }); }}
                onMouseEnter={tab === "Financieren" ? armCalculator : undefined}
                onFocus={tab === "Financieren" ? armCalculator : undefined}
                onTouchStart={tab === "Financieren" ? armCalculator : undefined}
                className="flex items-center gap-1.5 px-4 sm:px-6 py-4 text-sm font-semibold tracking-wide transition-all relative shrink-0 whitespace-nowrap"
                style={{
                  fontFamily: "var(--font-inter)",
                  color: activeTab === tab ? "#ffffff" : "rgba(255,255,255,0.45)",
                  backgroundColor: "transparent",
                }}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: "#ffffff" }} />
                )}
              </button>
            ))}
          </div>
          {/* Mobiele hint: er zijn meer tabs (verdwijnt als je aan het einde bent) */}
          {tabsMeer && (
            <div
              aria-hidden="true"
              className="sm:hidden pointer-events-none absolute top-0 right-0 bottom-0 w-12 flex items-center justify-end pr-1"
              style={{ background: "linear-gradient(to right, rgba(0,19,55,0) 0%, rgba(0,19,55,0.97) 80%)" }}
            >
              <ChevronRight size={16} color="rgba(255,255,255,0.7)" />
            </div>
          )}
        </div>
      </div>

      {/* Tab inhoud */}
      <section ref={tabSectionRef} className="py-12 px-6" style={{ backgroundColor: "#ffffff" }}>
        <div className="max-w-7xl mx-auto">

          {activeTab === "Kenmerken" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <h2 className="text-2xl font-bold mb-8" style={{ fontFamily: "var(--font-playfair)", color: "#001337" }}>Kenmerken</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
                {[
                  { label: "Bouwjaar", value: String(auto.bouwjaar) },
                  { label: "Kilometerstand", value: `${auto.km.toLocaleString("nl-NL")} km` },
                  { label: "APK tot", value: auto.apk },
                  // Onderhoud en tellerstand alleen als we er iets over te melden
                  // hebben: een regel "Onderhoudshistorie — onbekend" leest als een
                  // waarschuwing, ook als er niets aan de hand is.
                  ...(auto.onderhoudshistorie ? [{ label: "Onderhoudshistorie", value: auto.onderhoudshistorie }] : []),
                  ...(auto.nap ? [{ label: "NAP-tellerstand", value: auto.nap }] : []),
                  { label: "Carrosserie", value: bodytypeLabel(auto) },
                  { label: "BTW / Marge", value: auto.btw },
                  { label: "Vermogen", value: auto.vermogen },
                  { label: "Brandstof", value: auto.brandstof },
                  { label: "Transmissie", value: auto.transmissie },
                  { label: "Bekleding", value: auto.bekleding },
                  { label: "Kleur exterieur", value: auto.kleurExterieur },
                  { label: "Merk", value: auto.merk },
                  { label: "Model", value: auto.model },
                ].map((kenmerk) => (
                  <div
                    key={kenmerk.label}
                    className="flex items-center justify-between gap-4 py-3 px-4 rounded-none"
                    style={{ backgroundColor: "rgba(0,19,55,0.03)", border: "1px solid rgba(0,19,55,0.06)" }}
                  >
                    <span className="text-sm flex-shrink-0" style={{ color: "rgba(0,19,55,0.5)", fontFamily: "var(--font-inter)" }}>{kenmerk.label}</span>
                    <span className="text-sm font-semibold text-right" style={{ color: "#001337", fontFamily: "var(--font-inter)" }}>{kenmerk.value}</span>
                  </div>
                ))}
              </div>

              {/* ── Bedrijfswagen-specificaties ──
                  Een zakelijke koper kijkt niet naar de bekleding maar naar wat erin
                  past en wat erachter kan. Deze vijf blijven hier staan ook als ze niet
                  ingevuld zijn: "Op aanvraag" is een antwoord, een ontbrekende regel
                  laat hem denken dat we het verzwijgen. */}
              {isBedrijfswagen(auto) && (
                <div className="mt-10">
                  <h3 className="text-lg font-bold mb-4" style={{ fontFamily: "var(--font-playfair)", color: "#001337" }}>
                    Bedrijfswagen-specificaties
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
                    {[
                      { label: "Laadruimte", value: opAanvraag(auto.laadruimte) },
                      { label: "Laadvermogen", value: opAanvraag(auto.laadvermogen) },
                      { label: "Trekgewicht", value: opAanvraag(auto.trekgewicht) },
                      { label: "Euro-emissieklasse", value: opAanvraag(auto.euroklasse) },
                      { label: "BTW", value: opAanvraag(auto.btw) },
                    ].map((spec) => (
                      <div
                        key={spec.label}
                        className="flex items-center justify-between gap-4 py-3 px-4 rounded-none"
                        style={{ backgroundColor: "rgba(0,19,55,0.03)", border: "1px solid rgba(0,19,55,0.06)" }}
                      >
                        <span className="text-sm flex-shrink-0" style={{ color: "rgba(0,19,55,0.5)", fontFamily: "var(--font-inter)" }}>{spec.label}</span>
                        <span className="text-sm font-semibold text-right" style={{ color: "#001337", fontFamily: "var(--font-inter)" }}>{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "Opties" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <h2 className="text-2xl font-bold mb-8" style={{ fontFamily: "var(--font-playfair)", color: "#001337" }}>Opties & uitrusting</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {auto.opties.map((cat) => (
                  <div key={cat.categorie}>
                    <h3 className="text-base font-bold mb-4 pb-2" style={{ color: "#001337", fontFamily: "var(--font-playfair)", borderBottom: "2px solid rgba(0,19,55,0.1)" }}>
                      {cat.categorie}
                    </h3>
                    <ul className="flex flex-col gap-2">
                      {cat.items.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-sm" style={{ color: "#374151", fontFamily: "var(--font-inter)" }}>
                          <div className="w-1.5 h-1.5 rounded-none mt-1.5 flex-shrink-0" style={{ backgroundColor: "#001337" }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "Omschrijving" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <h2 className="text-2xl font-bold mb-8" style={{ fontFamily: "var(--font-playfair)", color: "#001337" }}>Omschrijving</h2>
              <div className="max-w-3xl">
                {auto.omschrijving.split("\n\n").map((alinea, i) => (
                  <p key={i} className="text-sm leading-loose text-gray-600 mb-4" style={{ fontFamily: "var(--font-inter)" }}>
                    {alinea}
                  </p>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "Financieren" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-playfair)", color: "#001337" }}>Financieren</h2>
              <p className="text-sm text-gray-400 mb-8" style={{ fontFamily: "var(--font-inter)" }}>
                In samenwerking met In Lease Auto&apos;s bieden wij vrijblijvende financierings- en leasevoorstellen aan.
              </p>

              {/* Info: aanschafprijs + voordelen */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mb-8">
                {/* Aanschafprijs */}
                <div className="p-6" style={{ border: "1px solid rgba(0,19,55,0.1)", backgroundColor: "rgba(0,19,55,0.02)" }}>
                  <p className="text-xs tracking-widest uppercase mb-1" style={{ color: "rgba(0,19,55,0.4)", fontFamily: "var(--font-inter)" }}>Aanschafprijs voertuig</p>
                  <p className="text-3xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: "#001337" }}>
                    {prijs.tekst},-
                    {prijs.achtervoegsel && (
                      <span className="text-base font-semibold ml-2" style={{ color: "rgba(0,19,55,0.45)", fontFamily: "var(--font-inter)" }}>
                        {prijs.achtervoegsel}
                      </span>
                    )}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "rgba(0,19,55,0.4)", fontFamily: "var(--font-inter)" }}>
                    {auto.btw}
                    {prijs.tegenhanger ? ` · ${prijs.tegenhanger}` : ""}
                  </p>
                </div>

                {/* Voordelen */}
                <div className="p-6" style={{ border: "1px solid rgba(0,19,55,0.1)", backgroundColor: "rgba(0,19,55,0.02)" }}>
                  <div className="flex flex-col gap-3">
                    {[
                      { label: "Uitslag binnen 24 uur" },
                      { label: "Geen jaarcijfers nodig" },
                      { label: "Geen kilometerbeperking" },
                      { label: "Je wordt eigenaar van de auto" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-3">
                        {/* Vierkant bolletje, zoals de opsommingstekens op het
                            Opties-tabblad. Dit was het laatste ronde hoekje op deze pagina. */}
                        <div className="w-2 h-2 rounded-none flex-shrink-0" style={{ backgroundColor: "#22c55e" }} />
                        <span className="text-sm" style={{ color: "#001337", fontFamily: "var(--font-inter)" }}>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </motion.div>
          )}

          {/* Lease calculator — los van de tab-conditie gerenderd zodra 'armed' (hover/klik op
              Financieren), zodat de iframe vast in de achtergrond laadt en direct klaar is. */}
          {calcArmed && (
            <div className="max-w-4xl" style={{ display: activeTab === "Financieren" ? "block" : "none" }}>
              <p className="text-xs tracking-widest uppercase mb-3" style={{ color: "rgba(0,19,55,0.4)", fontFamily: "var(--font-inter)" }}>
                Bereken direct je maandbedrag
              </p>
              <div className="relative" style={{ minHeight: 975 }}>
                {!calcLoaded && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center" style={{ backgroundColor: "rgba(0,19,55,0.02)", border: "1px solid rgba(0,19,55,0.1)" }}>
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-6 h-6 rounded-full animate-spin" style={{ border: "2px solid rgba(0,19,55,0.15)", borderTopColor: "#001337" }} />
                      <span className="text-xs" style={{ color: "rgba(0,19,55,0.4)", fontFamily: "var(--font-inter)" }}>Calculator laden…</span>
                    </div>
                  </div>
                )}
                <iframe
                  src={calculatorSrc}
                  title="Lease calculator — In Lease Auto's"
                  width="100%"
                  height="975"
                  onLoad={() => setCalcLoaded(true)}
                  style={{ border: 0, borderRadius: 0, overflow: "hidden", display: "block", width: "100%" }}
                  allowFullScreen
                />
              </div>
              <p className="text-[11px] mt-3" style={{ color: "rgba(0,19,55,0.35)", fontFamily: "var(--font-inter)" }}>
                Vrijblijvende berekening in samenwerking met In Lease Auto&apos;s. Aan deze indicatie kunnen geen rechten worden ontleend.
              </p>
            </div>
          )}


          {/* Eenmaal geopend blijft dit paneel staan, verborgen in plaats van weggehaald.
              Anders gooit één tik op een ander tabblad het halve ingevulde formulier weg —
              inclusief vier al gekozen foto's. Dezelfde afweging als bij de calculator
              hierboven, maar daar ging het om laadtijd en hier om werk van de bezoeker. */}
          {inruilGeopend && (
            <div style={{ display: activeTab === "Inruilen" ? "block" : "none" }}>
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-playfair)", color: "#001337" }}>
                Je auto inruilen
              </h2>
              <p className="text-sm text-gray-500 mb-8 leading-relaxed max-w-2xl" style={{ fontFamily: "var(--font-inter)" }}>
                Rijd je nu al iets? Je huidige auto kan mee in de deal. Laat ons merk, model, bouwjaar en
                kilometerstand weten, dan taxeren we hem vrijblijvend en verrekenen we dat bedrag met de prijs
                van deze {auto.merk} {auto.model}.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-4xl">
                {INRUIL_STAPPEN.map((s) => (
                  <div key={s.stap} className="p-5 rounded-none" style={{ backgroundColor: "rgba(0,19,55,0.03)", border: "1px solid rgba(0,19,55,0.08)" }}>
                    <p className="text-[10px] tracking-widest uppercase mb-2" style={{ color: "rgba(0,19,55,0.35)", fontFamily: "var(--font-inter)" }}>
                      {s.stap}
                    </p>
                    <h3 className="text-base font-bold mb-2" style={{ fontFamily: "var(--font-playfair)", color: "#001337" }}>
                      {s.titel}
                    </h3>
                    <p className="text-xs leading-relaxed" style={{ color: "rgba(0,19,55,0.5)", fontFamily: "var(--font-inter)" }}>
                      {s.tekst}
                    </p>
                  </div>
                ))}
              </div>

              <AutoAanvraagFormulier soort="inruil" auto={auto} autoUrl={autoUrl} />

              <p className="text-xs mt-8" style={{ color: "rgba(0,19,55,0.4)", fontFamily: "var(--font-inter)" }}>
                Liever even appen of eerst lezen hoe we taxeren?{" "}
                <a
                  href={`https://wa.me/31621331374?text=${encodeURIComponent(
                    `Hallo Jimi, ik heb interesse in de ${auto.merk} ${auto.model} en wil mijn huidige auto inruilen.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold underline hover:opacity-70"
                  style={{ color: "#001337" }}
                >
                  Stuur een WhatsApp
                </a>{" "}
                of bekijk{" "}
                <Link href="/diensten/inkoop-taxatie" className="font-semibold underline hover:opacity-70" style={{ color: "#001337" }}>
                  hoe onze taxatie werkt
                </Link>
                .
              </p>
            </div>
          )}

        </div>
      </section>

      {/* ── Zelf bekijken en gebruikssporen ──
          Bewust niet achter een tabblad. Een koper twijfelt bij een occasion vooral over
          de staat. Geen garantiebeloftes hier (keuze van de eigenaar) — wel het aanbod om
          de auto zelf te komen bekijken en een eerlijk verhaal over de gebruikssporen. */}
      <section className="py-14 px-6" style={{ backgroundColor: "#f5f5f5" }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 md:p-7 rounded-none" style={{ backgroundColor: "#ffffff", border: "1px solid rgba(0,19,55,0.08)" }}>
            <div className="flex items-center gap-2.5 mb-3">
              <CalendarDays size={18} style={{ color: "#001337", flexShrink: 0 }} />
              <h2 className="text-lg font-bold" style={{ fontFamily: "var(--font-playfair)", color: "#001337" }}>
                Zelf bekijken &amp; proefrijden
              </h2>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(0,19,55,0.65)", fontFamily: "var(--font-inter)" }}>
              Foto&apos;s zeggen veel, maar zelf kijken zegt meer. Plan een bezichtiging in
              Barendrecht: dan nemen we de auto samen door en maak je een proefrit.
            </p>
            <button
              type="button"
              onClick={naarBezichtiging}
              className="inline-flex items-center gap-1.5 text-sm font-semibold mt-4 underline hover:opacity-70"
              style={{ color: "#001337", fontFamily: "var(--font-inter)" }}
            >
              Plan een bezichtiging
              <ArrowRight size={13} />
            </button>
          </div>

          <div className="p-6 md:p-7 rounded-none" style={{ backgroundColor: "#ffffff", border: "1px solid rgba(0,19,55,0.08)" }}>
            <div className="flex items-center gap-2.5 mb-3">
              <Info size={18} style={{ color: "#001337", flexShrink: 0 }} />
              <h2 className="text-lg font-bold" style={{ fontFamily: "var(--font-playfair)", color: "#001337" }}>
                Gebruikssporen &amp; bijzonderheden
              </h2>
            </div>
            <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "rgba(0,19,55,0.65)", fontFamily: "var(--font-inter)" }}>
              {auto.bijzonderheden?.trim() || BIJZONDERHEDEN_STANDAARD}
            </p>
          </div>
        </div>
      </section>

      <ContactBlok
        auto={auto}
        bezichtiging={bezichtiging}
        onBezichtiging={setBezichtiging}
      />

      {gerelateerd}

    </>
  );
}
