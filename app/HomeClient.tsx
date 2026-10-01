"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  Phone,
  Repeat,
  CreditCard,
  Handshake,
  ShieldCheck,
  Search,
  Package,
} from "lucide-react";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import AutoKaart from "@/components/AutoKaart";
import ReviewsSection from "@/components/ReviewsSection";
import type { Auto } from "@/lib/autos";

// Vast nummer, één keer opgeschreven. Weergave met streepje zoals mensen het zelf
// intikken; achter de link het internationale formaat, want anders belt een
// buitenlandse simkaart niet door.
const TELEFOON_LINK = "tel:+31621331374";
const TELEFOON_TEKST = "06-21331374";
const WHATSAPP_URL = "https://wa.me/31621331374";

// De vraag die ondernemers stellen staat al in het bericht, zodat Jimi meteen weet
// waarover het gaat zonder dat de bezoeker iets hoeft te typen.
const WHATSAPP_BEDRIJFSWAGEN_URL =
  "https://wa.me/31621331374?text=Hoi%20Jimi%2C%20ik%20zoek%20een%20specifieke%20bedrijfswagen.%20Kun%20je%20meezoeken%3F";

// De vier dingen waar elke koper binnen tien seconden antwoord op wil. "Mogelijk"
// staat er bewust bij inruil en garantie: het hangt van de auto af, en een harde
// belofte die we niet bij elk voertuig kunnen nakomen is geen belofte.
const usps = [
  { icon: <Repeat size={20} />, label: "Inruil mogelijk" },
  { icon: <CreditCard size={20} />, label: "Financial lease" },
  { icon: <Handshake size={20} />, label: "Persoonlijke service" },
  { icon: <ShieldCheck size={20} />, label: "Garantie mogelijk" },
];

// De bedrijfswagens waar in deze regio het meest naar gezocht wordt. De pagina's
// zelf staan onder /bedrijfswagens/[model].
const bedrijfswagenModellen = [
  { label: "Sprinter", href: "/bedrijfswagens/sprinter" },
  { label: "Master", href: "/bedrijfswagens/master" },
  { label: "Crafter", href: "/bedrijfswagens/crafter" },
  { label: "Transit", href: "/bedrijfswagens/transit" },
  { label: "Vito", href: "/bedrijfswagens/vito" },
];

// Geen verhalen, wel redenen. Alles hieronder is controleerbaar: het zijn de
// afspraken die Jimi bij elke verkoop nakomt, geen cijfers die we niet hard kunnen
// maken.
const redenen = [
  "Eén aanspreekpunt: je hebt altijd direct Jimi aan de lijn",
  "Bedrijfswagens én geselecteerde occasions onder één dak",
  "Inruil van je huidige auto of bus is mogelijk",
  "Financial lease voor ondernemers — wij regelen de aanvraag",
  "Geen verborgen kosten: de prijs die je ziet, is de prijs",
  "Alles rondom aflevering, papieren en kenteken nemen wij over",
];

// De diensten als compacte rij. Consignatie staat hier bewust niet tussen: dat is
// een verkoopverhaal en geen koopverhaal, en krijgt daarom één regel onderaan.
const dienstenLinks = [
  { icon: <Search size={18} />, label: "Inruil & taxatie", href: "/diensten/inkoop-taxatie" },
  { icon: <CreditCard size={18} />, label: "Financial lease", href: "/financial-lease" },
  { icon: <Package size={18} />, label: "Afleverpakketten", href: "/diensten/afleverpakketten" },
  { icon: <ArrowUpRight size={18} />, label: "Alle diensten", href: "/diensten" },
];

export default function HomeClient({
  nieuwBinnen,
  bedrijfswagens,
  recentVerkocht,
}: {
  nieuwBinnen: Auto[];
  bedrijfswagens: Auto[];
  recentVerkocht: Auto[];
}) {
  const videoDesktopRef = useRef<HTMLVideoElement>(null);
  const videoMobielRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Only play the video that is actually visible — avoids loading both on mobile
    const ref = window.innerWidth < 768 ? videoMobielRef : videoDesktopRef;
    if (ref.current) {
      ref.current.muted = true;
      ref.current.play().catch(() => {});
    }
  }, []);

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="relative w-full overflow-hidden" style={{ height: "100vh" }}>
        {/* Video achtergrond — desktop */}
        <video
          ref={videoDesktopRef}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 w-full h-full object-cover hidden md:block"
        >
          <source src="/Hero%20Laptop.mp4" type="video/mp4" />
        </video>

        {/* Video achtergrond — mobiel */}
        <video
          ref={videoMobielRef}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 w-full h-full object-cover block md:hidden"
        >
          <source src="/Hero%20Mobiel.mp4" type="video/mp4" />
        </video>

        {/* Donkere gradient over de video. De beelden wisselen van licht naar donker,
            dus zonder deze laag valt witte tekst op sommige frames weg. Onderaan het
            donkerst, want daar staan de knoppen en het telefoonnummer. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,19,55,0.55) 0%, rgba(0,19,55,0.35) 40%, rgba(0,19,55,0.75) 100%)",
          }}
        />

        {/* Tekst overlay */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 gap-8 md:pt-32">
          <div className="jg-opkomen">
            <p
              className="text-xs tracking-widest uppercase mb-4"
              style={{ color: "rgba(255,255,255,0.75)", fontFamily: "var(--font-inter)" }}
            >
              Bedrijfswagens &amp; Geselecteerde Occasions
            </p>
            <h1
              style={{
                fontFamily: "var(--font-playfair)",
                color: "#ffffff",
                fontSize: "clamp(28px, 4vw, 54px)",
                fontWeight: 700,
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                textAlign: "center",
                maxWidth: "18ch",
                marginInline: "auto",
              }}
            >
              Jouw volgende auto of bedrijfswagen begint bij JG Mobility.
            </h1>
          </div>

          {/* Twee knoppen: de bezoeker kiest zelf of hij voor zijn werk of voor
              privé komt. Op mobiel onder elkaar en vol breed, zodat ze met één duim
              te raken zijn. */}
          <div className="jg-opkomen-na flex flex-col sm:flex-row gap-3 w-full sm:w-auto max-w-xs sm:max-w-none">
            <Link
              href="/bedrijfswagens"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 text-xs font-semibold tracking-widest uppercase transition-all hover:opacity-90"
              style={{ backgroundColor: "#ffffff", color: "#001337", fontFamily: "var(--font-inter)" }}
            >
              Bekijk bedrijfswagens
              <ArrowRight size={13} />
            </Link>
            <Link
              href="/personenautos"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 text-xs font-semibold tracking-widest uppercase transition-all hover:opacity-90"
              style={{
                backgroundColor: "rgba(0,19,55,0.55)",
                color: "#ffffff",
                fontFamily: "var(--font-inter)",
                border: "1px solid rgba(255,255,255,0.35)",
              }}
            >
              Bekijk personenauto&apos;s
              <ArrowRight size={13} />
            </Link>
          </div>

          {/* Direct contact onder de knoppen. Wie liever belt dan klikt, hoeft niet
              eerst naar de contactpagina. */}
          <div
            className="jg-opkomen-na flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm"
            style={{ color: "rgba(255,255,255,0.85)", fontFamily: "var(--font-inter)" }}
          >
            <a href={TELEFOON_LINK} className="flex items-center gap-2 font-semibold hover:opacity-70 transition-opacity">
              <Phone size={14} />
              {TELEFOON_TEKST}
            </a>
            <span style={{ color: "rgba(255,255,255,0.35)" }}>of</span>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold hover:opacity-70 transition-opacity"
            >
              stuur een WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ─── TRUSTBAR ───
          De scheidslijntjes zijn de achtergrond die door een 1px-gap heen schijnt. Dat
          werkt bij twee kolommen (mobiel) net zo goed als bij vier, zonder een lijn die
          aan de rand van het scherm blijft hangen. De kleur is een iets lichter marine
          dan de vakjes zelf — een doorzichtig wit zou over de witte pagina-achtergrond
          als een harde witte streep uitpakken. */}
      <section style={{ backgroundColor: "#1b2c4e" }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px">
          {usps.map((usp) => (
            <div
              key={usp.label}
              className="flex items-center justify-center gap-3 px-4 py-5 text-center"
              style={{ backgroundColor: "#001337" }}
            >
              <span style={{ color: "rgba(255,255,255,0.55)" }}>{usp.icon}</span>
              <span
                className="text-xs md:text-sm font-semibold"
                style={{ color: "#ffffff", fontFamily: "var(--font-inter)" }}
              >
                {usp.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── NIEUW BINNEN ─── */}
      <section className="py-20 px-6" style={{ backgroundColor: "#f5f5f5" }}>
        <div className="max-w-7xl mx-auto">
          <AnimateOnScroll>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "rgba(0,19,55,0.45)", fontFamily: "var(--font-inter)" }}>
                  Net toegevoegd
                </p>
                <h2 className="text-4xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: "#001337" }}>
                  Nieuw binnen
                </h2>
              </div>
              <Link
                href="/aanbod"
                className="flex items-center gap-2 text-sm font-semibold group"
                style={{ color: "#001337", fontFamily: "var(--font-inter)" }}
              >
                Bekijk volledige voorraad
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nieuwBinnen.map((auto, i) => (
              <AnimateOnScroll key={auto.id} delay={i * 0.08} direction="up">
                <AutoKaart auto={auto} sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw" />
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BEDRIJFSWAGENS ─── */}
      <section className="py-20 px-6 relative overflow-hidden" style={{ backgroundColor: "#001337" }}>
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 60% 80% at 15% 40%, rgba(255,255,255,0.07) 0%, transparent 70%)" }}
        />
        <div className="relative z-10 max-w-7xl mx-auto">
          <AnimateOnScroll>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-5">
              <div>
                <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-inter)" }}>
                  Voor ondernemers
                </p>
                <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
                  Bedrijfswagens
                </h2>
                {/* Deze sectie spreekt met "u" waar de rest van de homepage "je"
                    gebruikt: hier staat de ondernemer die iets voor zijn zaak koopt,
                    en dat is dezelfde toon als op de bedrijfswagenpagina's. */}
                <p className="text-sm leading-relaxed max-w-xl" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-inter)" }}>
                  BTW-voertuigen met prijzen exclusief btw, financial lease voor op de zaak en
                  inruil van uw huidige bus. U rijdt weg met een bedrijfswagen die past bij het
                  werk dat u ermee doet.
                </p>
              </div>
              <Link
                href="/bedrijfswagens"
                className="flex items-center gap-2 text-sm font-semibold group flex-shrink-0"
                style={{ color: "#ffffff", fontFamily: "var(--font-inter)" }}
              >
                Alle bedrijfswagens
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </AnimateOnScroll>

          {bedrijfswagens.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bedrijfswagens.map((auto, i) => (
                <AnimateOnScroll key={auto.id} delay={i * 0.08} direction="up">
                  <AutoKaart auto={auto} sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw" />
                </AnimateOnScroll>
              ))}
            </div>
          ) : (
            /* Geen bedrijfswagen op voorraad? Dan is een leeg raster een doodlopende
               weg. Deze kaart maakt er een gesprek van: Jimi zoekt mee. */
            <AnimateOnScroll>
              <div
                className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8"
                style={{ border: "1px solid rgba(255,255,255,0.14)", backgroundColor: "rgba(255,255,255,0.04)" }}
              >
                <div>
                  <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
                    Zoekt u een specifieke bedrijfswagen? Wij zoeken mee
                  </h3>
                  <p className="text-sm leading-relaxed max-w-xl" style={{ color: "rgba(255,255,255,0.55)", fontFamily: "var(--font-inter)" }}>
                    Vertel ons welk model, welke laadruimte en welk budget u in gedachten heeft.
                    Via ons netwerk zoeken wij een passende bus voor u.
                  </p>
                </div>
                <a
                  href={WHATSAPP_BEDRIJFSWAGEN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 text-sm font-semibold flex-shrink-0 transition-all hover:opacity-90"
                  style={{ backgroundColor: "#ffffff", color: "#001337", fontFamily: "var(--font-inter)" }}
                >
                  Laat ons meezoeken
                  <ArrowRight size={14} />
                </a>
              </div>
            </AnimateOnScroll>
          )}

          {/* Snelkoppelingen naar de modellen waar het meest op gezocht wordt. */}
          <AnimateOnScroll>
            <div className="flex flex-wrap items-center gap-2 mt-8">
              <span className="text-xs tracking-widest uppercase mr-1" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-inter)" }}>
                Populair
              </span>
              {bedrijfswagenModellen.map((model) => (
                <Link
                  key={model.href}
                  href={model.href}
                  className="px-4 py-2 text-xs font-semibold transition-all hover:bg-white/10"
                  style={{
                    border: "1px solid rgba(255,255,255,0.22)",
                    color: "rgba(255,255,255,0.85)",
                    fontFamily: "var(--font-inter)",
                    minHeight: "44px",
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                >
                  {model.label}
                </Link>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ─── WAAROM JG MOBILITY ─── */}
      <section className="py-20 px-6" style={{ backgroundColor: "#ffffff" }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
          <AnimateOnScroll direction="left">
            <div className="aspect-[4/3] rounded-none relative overflow-hidden">
              <Image
                src="/jimi-showroom.png"
                alt="Jimi Gaillard bij een BMW X5 M in de showroom"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll direction="right">
            <div>
              <p className="text-xs tracking-widest uppercase mb-3" style={{ color: "rgba(0,19,55,0.45)", fontFamily: "var(--font-inter)" }}>
                Zaken doen met Jimi
              </p>
              <h2 className="text-4xl font-bold mb-6" style={{ fontFamily: "var(--font-playfair)", color: "#001337" }}>
                Waarom kiezen voor<br />JG Mobility?
              </h2>
              <ul className="flex flex-col gap-3 mb-8">
                {redenen.map((reden) => (
                  <li key={reden} className="flex items-start gap-3 text-sm" style={{ fontFamily: "var(--font-inter)", color: "#374151" }}>
                    <div className="w-1.5 h-1.5 rounded-none flex-shrink-0 mt-1.5" style={{ backgroundColor: "#001337" }} />
                    {reden}
                  </li>
                ))}
              </ul>
              <Link
                href="/over-ons"
                className="group inline-flex items-center gap-2 text-sm font-semibold"
                style={{ color: "#001337", fontFamily: "var(--font-inter)" }}
              >
                Over JG Mobility
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ─── INRUIL ─── */}
      <section className="relative py-24 px-6 overflow-hidden" style={{ backgroundColor: "#001337" }}>
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 60% 80% at 80% 50%, rgba(255,255,255,0.08) 0%, transparent 70%)" }}
        />
        <AnimateOnScroll>
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-inter)" }}>
              Gratis & vrijblijvend
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: "var(--font-playfair)" }}>
              Jouw auto inruilen?
            </h2>
            <p className="text-sm leading-relaxed mb-10 max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-inter)" }}>
              Wij taxeren je huidige auto of bus en verrekenen de waarde direct met je nieuwe
              voertuig. Eén aanspreekpunt, één afspraak, geen dubbele verkoop.
            </p>
            <div className="flex justify-center">
              <Link
                href="/diensten/inkoop-taxatie"
                className="group inline-flex items-center justify-center gap-2 px-8 py-5 rounded-none text-sm font-semibold tracking-wide transition-all hover:opacity-90"
                style={{ backgroundColor: "#ffffff", color: "#001337", fontFamily: "var(--font-inter)" }}
              >
                Ontvang een gratis inruilvoorstel
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </AnimateOnScroll>
      </section>

      {/* ─── REVIEWS ─── */}
      <ReviewsSection />

      {/* ─── RECENT VERKOCHT ───
          Alleen als er écht verkochte auto's zijn. Een kopje "Recent verkocht" boven
          een leeg raster is slechter dan geen kopje. */}
      {recentVerkocht.length > 0 && (
        <section className="py-20 px-6" style={{ backgroundColor: "#ffffff" }}>
          <div className="max-w-7xl mx-auto">
            <AnimateOnScroll>
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                <div>
                  <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "rgba(0,19,55,0.45)", fontFamily: "var(--font-inter)" }}>
                    Deze gingen al weg
                  </p>
                  <h2 className="text-4xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: "#001337" }}>
                    Recent verkocht
                  </h2>
                </div>
                <Link
                  href="/recent-verkocht"
                  className="flex items-center gap-2 text-sm font-semibold group"
                  style={{ color: "#001337", fontFamily: "var(--font-inter)" }}
                >
                  Bekijk recent verkocht
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </AnimateOnScroll>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentVerkocht.map((auto, i) => (
                <AnimateOnScroll key={auto.id} delay={i * 0.08} direction="up">
                  <AutoKaart auto={auto} sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw" />
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── DIENSTEN (compacte rij) ─── */}
      <section className="py-16 px-6" style={{ backgroundColor: "#f5f5f5" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {dienstenLinks.map((dienst) => (
              <Link
                key={dienst.href}
                href={dienst.href}
                className="group flex items-center gap-3 px-5 py-5 transition-all hover:shadow-md"
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid rgba(0,19,55,0.08)",
                  minHeight: "64px",
                }}
              >
                <span style={{ color: "#001337" }}>{dienst.icon}</span>
                <span
                  className="text-sm font-semibold leading-snug"
                  style={{ color: "#001337", fontFamily: "var(--font-inter)" }}
                >
                  {dienst.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Consignatie als tweede CTA: wie zijn auto wil laten verkopen vindt het,
              zonder dat het de koper in de weg zit. */}
          <div className="mt-6 text-center">
            <Link
              href="/consignatie"
              className="group inline-flex items-center gap-2 text-sm hover:opacity-70 transition-opacity"
              style={{ color: "rgba(0,19,55,0.6)", fontFamily: "var(--font-inter)" }}
            >
              Je auto laten verkopen via consignatie?
              <span className="font-semibold" style={{ color: "#001337" }}>
                Bekijk consignatie
              </span>
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
