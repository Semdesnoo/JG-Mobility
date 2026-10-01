"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle, Clock, TrendingUp, Shield, ArrowRight } from "lucide-react";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import AutoAanvraagFormulier from "@/components/AutoAanvraagFormulier";

/**
 * Gratis inruilvoorstel — de pagina waar iemand zijn eigen auto aanbiedt.
 *
 * WAAROM HET FORMULIER NU BOVENAAN STAAT
 * Hier stonden eerst vier blokken uitleg en pas onderaan het formulier: voordelen, de vier
 * stappen, een tekstblok over eerlijk bieden, en dan — na ruim drie keer scrollen — het
 * vakje waar je je kenteken kon invullen. Wie hier binnenkomt is al over de streep; die
 * zoekt niet naar argumenten maar naar het invulveld. De uitleg staat er nog, maar nu
 * eronder, voor wie hem nodig heeft.
 */

const stappen = [
  {
    step: "01",
    title: "Kenteken en foto's",
    desc: "Vul je kenteken in — merk, model en bouwjaar halen we er automatisch bij. Foto's mogen, maar hoeven niet.",
  },
  {
    step: "02",
    title: "Gratis taxatie",
    desc: "Wij bepalen de marktwaarde op basis van actuele data en de staat van je voertuig. Vrijblijvend.",
  },
  {
    step: "03",
    title: "Bod binnen 24 uur",
    desc: "Je hoort snel wat je auto waard is. Inruilen tegen een auto uit ons aanbod of gewoon verkopen — jij kiest.",
  },
];

const voordelen = [
  { icon: <TrendingUp size={20} />, title: "Marktconforme prijs", desc: "Wij gebruiken actuele marktdata en jarenlange ervaring om uw auto eerlijk te waarderen." },
  { icon: <Clock size={20} />, title: "Binnen 24 uur bod", desc: "Geen weken wachten. U heeft een bod in handen voordat u het weet." },
  { icon: <Shield size={20} />, title: "Geen verplichtingen", desc: "Taxatie is volledig gratis en vrijblijvend. U beslist zelf of u ons bod accepteert." },
  { icon: <CheckCircle size={20} />, title: "Direct geld", desc: "Na akkoord wordt het bedrag direct overgemaakt. Geen gedoe, geen vertraging." },
];

export default function InkoopTaxatiePage() {
  return (
    <>
      {/* Hero */}
      <div className="relative pt-28 md:pt-52 pb-14 md:pb-20 px-6 overflow-hidden" style={{ backgroundColor: "#001337" }}>
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 50% 80% at 20% 60%, rgba(255,255,255,0.04) 0%, transparent 70%)" }} />
        <div className="relative max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Link href="/diensten" className="inline-flex items-center gap-2 text-xs tracking-widest uppercase mb-6 hover:opacity-70 transition-opacity" style={{ color: "#ffffff", fontFamily: "var(--font-inter)" }}>
              ← Diensten
            </Link>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-5" style={{ fontFamily: "var(--font-playfair)" }}>
            Gratis inruilvoorstel
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm md:text-base max-w-xl" style={{ color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-inter)", lineHeight: 1.8 }}>
            Wat is je auto waard? Vul je kenteken in en je hoort binnen 24 uur wat wij ervoor
            bieden. Inruilen tegen een voertuig uit ons aanbod of gewoon verkopen — allebei kan,
            en allebei is vrijblijvend.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.3 }}>
            <a
              href="#taxatie-aanvragen"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto mt-8 py-4 px-6 rounded-none text-sm font-semibold transition-all hover:opacity-90"
              style={{ backgroundColor: "#ffffff", color: "#001337", fontFamily: "var(--font-inter)" }}
            >
              Ontvang een gratis inruilvoorstel
              <ArrowRight size={14} />
            </a>
          </motion.div>
        </div>
      </div>

      {/* Drie stappen — kort, want het echte werk staat er direct onder */}
      <section className="py-12 px-6" style={{ backgroundColor: "#f5f5f5" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          {stappen.map((s, i) => (
            <AnimateOnScroll key={s.step} delay={i * 0.08}>
              <div className="p-5 rounded-none h-full" style={{ backgroundColor: "#ffffff", border: "1px solid rgba(0,19,55,0.07)" }}>
                <p className="text-[10px] tracking-widest uppercase mb-2" style={{ color: "rgba(0,19,55,0.35)", fontFamily: "var(--font-inter)" }}>
                  {s.step}
                </p>
                <h2 className="text-base font-bold mb-2" style={{ color: "#001337", fontFamily: "var(--font-playfair)" }}>
                  {s.title}
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(0,19,55,0.55)", fontFamily: "var(--font-inter)" }}>
                  {s.desc}
                </p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </section>

      {/* Het taxatieformulier zelf. Hier stond een knop naar de contactpagina; wie zijn
          auto wil laten taxeren moest daar opnieuw uitleggen waar het over ging. Nu kan
          hij het in één keer kwijt, met kenteken en foto's erbij. */}
      <section id="taxatie-aanvragen" className="py-14 md:py-16 px-6" style={{ backgroundColor: "#ffffff" }}>
        <div className="max-w-3xl mx-auto">
          <AnimateOnScroll>
            <div className="mb-8">
              <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "rgba(0,19,55,0.45)", fontFamily: "var(--font-inter)" }}>
                Gratis en vrijblijvend
              </p>
              <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ fontFamily: "var(--font-playfair)", color: "#001337" }}>
                Vraag je voorstel aan
              </h2>
              <p className="text-sm max-w-xl leading-relaxed" style={{ color: "rgba(0,19,55,0.65)", fontFamily: "var(--font-inter)" }}>
                Vul je kenteken in — we halen merk, model en bouwjaar er automatisch bij. Hoe meer je
                erbij zet, hoe scherper het bod dat je terugkrijgt. Je hoort binnen 24 uur van ons en
                krijgt meteen een bevestiging per mail.
              </p>
            </div>

            <AutoAanvraagFormulier soort="taxatie" />

            <p className="text-xs mt-8" style={{ color: "rgba(0,19,55,0.65)", fontFamily: "var(--font-inter)" }}>
              Liever even bellen of appen?{" "}
              <a href="tel:+31621331374" className="font-semibold underline hover:opacity-70" style={{ color: "#001337" }}>
                06-21331374
              </a>{" "}
              —{" "}
              <a
                href="https://wa.me/31621331374"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline hover:opacity-70"
                style={{ color: "#001337" }}
              >
                WhatsApp
              </a>
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Voordelen */}
      <section className="py-16 md:py-20 px-6" style={{ backgroundColor: "#ffffff", borderTop: "1px solid rgba(0,19,55,0.06)" }}>
        <div className="max-w-6xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-10 md:mb-14">
              <p className="text-xs tracking-widest uppercase mb-3" style={{ color: "rgba(0,19,55,0.4)", fontFamily: "var(--font-inter)" }}>Waarom bij JG Mobility</p>
              <h2 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: "#001337" }}>Wat u van ons krijgt</h2>
            </div>
          </AnimateOnScroll>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {voordelen.map((v, i) => (
              <AnimateOnScroll key={v.title} delay={i * 0.08}>
                <div className="p-5 rounded-none h-full" style={{ border: "1px solid rgba(0,19,55,0.08)", backgroundColor: "#fafafa" }}>
                  <div className="w-11 h-11 rounded-none flex items-center justify-center mb-4" style={{ backgroundColor: "#001337", color: "#ffffff" }}>{v.icon}</div>
                  <h3 className="font-bold text-sm mb-2" style={{ color: "#001337", fontFamily: "var(--font-playfair)" }}>{v.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(0,19,55,0.5)", fontFamily: "var(--font-inter)" }}>{v.desc}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Tekst blok */}
      <section className="py-16 md:py-20 px-6" style={{ backgroundColor: "#001337" }}>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">
          <AnimateOnScroll direction="left">
            <div>
              <p className="text-xs tracking-widest uppercase mb-3" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-inter)" }}>Waar wij staan</p>
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-5" style={{ fontFamily: "var(--font-playfair)", lineHeight: 1.2 }}>
                Een eerlijk bod.<br />Altijd.
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-inter)" }}>
                Bij JG Mobility krijgt u geen laag startbod om daarna te onderhandelen. Wij geven u direct ons beste bod, gebaseerd op de werkelijke marktwaarde. Eerlijk, transparant en zonder spelletjes.
              </p>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll direction="right">
            <div className="flex flex-col gap-4">
              {["Geen verborgen kosten", "Betaling direct na overdracht", "Alle merken en modellen welkom", "Ook bij schade of hoge kilometerstand"].map((punt) => (
                <div key={punt} className="flex items-center gap-3">
                  <CheckCircle size={16} style={{ color: "rgba(255,255,255,0.4)", flexShrink: 0 }} />
                  <span className="text-sm" style={{ color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-inter)" }}>{punt}</span>
                </div>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </>
  );
}
