"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle, Clock, TrendingUp, Shield, Phone } from "lucide-react";
import AnimateOnScroll from "@/components/AnimateOnScroll";

const stappen = [
  { step: "01", title: "Neem contact op", desc: "Bel, mail of stuur een bericht. Vertel ons de basics: merk, model, bouwjaar en kilometerstand." },
  { step: "02", title: "Gratis taxatie", desc: "Wij bepalen de marktwaarde op basis van actuele data en de staat van uw voertuig. Snel en zonder verplichtingen." },
  { step: "03", title: "Aanbod ontvangen", desc: "U ontvangt een eerlijk bod binnen 24 uur. Geen onderhandelingstactieken, geen verborgen kosten." },
  { step: "04", title: "Directe afhandeling", desc: "Akkoord? Wij regelen de overdracht, het kenteken en de betaling. Alles snel en professioneel." },
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
      <div className="relative pt-28 md:pt-52 pb-20 px-6 overflow-hidden" style={{ backgroundColor: "#001337" }}>
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 50% 80% at 20% 60%, rgba(255,255,255,0.04) 0%, transparent 70%)" }} />
        <div className="relative max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Link href="/diensten" className="inline-flex items-center gap-2 text-xs tracking-widest uppercase mb-6 hover:opacity-70 transition-opacity" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-inter)" }}>
              ← Diensten
            </Link>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-5" style={{ fontFamily: "var(--font-playfair)" }}>
            Inkoop & Taxatie
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm md:text-base max-w-xl" style={{ color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-inter)", lineHeight: 1.8 }}>
            Wij taxeren en kopen uw auto direct in. Eerlijk, transparant en zonder gedoe — u heeft binnen 24 uur een bod in handen.
          </motion.p>
        </div>
      </div>

      {/* Voordelen */}
      <section className="py-20 px-6" style={{ backgroundColor: "#ffffff" }}>
        <div className="max-w-6xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-14">
              <p className="text-xs tracking-widest uppercase mb-3" style={{ color: "rgba(0,19,55,0.4)", fontFamily: "var(--font-inter)" }}>Waarom bij JG Mobility</p>
              <h2 className="text-3xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: "#001337" }}>Wat u van ons krijgt</h2>
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

      {/* Hoe werkt het */}
      <section className="py-20 px-6" style={{ backgroundColor: "#f5f5f5" }}>
        <div className="max-w-4xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-14">
              <p className="text-xs tracking-widest uppercase mb-3" style={{ color: "rgba(0,19,55,0.4)", fontFamily: "var(--font-inter)" }}>Stap voor stap</p>
              <h2 className="text-3xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: "#001337" }}>Hoe werkt het?</h2>
            </div>
          </AnimateOnScroll>
          <div className="flex flex-col gap-4">
            {stappen.map((s, i) => (
              <AnimateOnScroll key={s.step} delay={i * 0.1}>
                <div className="flex items-start gap-6 p-6 rounded-none" style={{ backgroundColor: "#ffffff", border: "1px solid rgba(0,19,55,0.07)" }}>
                  <span className="text-3xl font-bold flex-shrink-0" style={{ fontFamily: "var(--font-playfair)", color: "rgba(0,19,55,0.12)" }}>{s.step}</span>
                  <div>
                    <h3 className="font-bold mb-1" style={{ color: "#001337", fontFamily: "var(--font-playfair)" }}>{s.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "rgba(0,19,55,0.5)", fontFamily: "var(--font-inter)" }}>{s.desc}</p>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Tekst blok */}
      <section className="py-20 px-6" style={{ backgroundColor: "#001337" }}>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">
          <AnimateOnScroll direction="left">
            <div>
              <p className="text-xs tracking-widest uppercase mb-3" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-inter)" }}>Waar wij staan</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-5" style={{ fontFamily: "var(--font-playfair)", lineHeight: 1.2 }}>
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

      {/* CTA */}
      <section className="py-16 px-6" style={{ backgroundColor: "#ffffff", borderTop: "1px solid rgba(0,19,55,0.06)" }}>
        <div className="max-w-3xl mx-auto text-center">
          <AnimateOnScroll>
            <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ fontFamily: "var(--font-playfair)", color: "#001337" }}>Klaar om uw auto te verkopen?</h2>
            <p className="text-sm text-gray-500 mb-8" style={{ fontFamily: "var(--font-inter)" }}>Neem contact op en ontvang binnen 24 uur een gratis taxatie.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-none text-sm font-semibold transition-all hover:scale-105" style={{ backgroundColor: "#001337", color: "#ffffff", fontFamily: "var(--font-inter)" }}>
                Gratis taxatie aanvragen
                <ArrowRight size={14} />
              </Link>
              <a href="tel:" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-none text-sm font-semibold transition-all hover:opacity-85" style={{ backgroundColor: "#001337", color: "#ffffff", fontFamily: "var(--font-inter)" }}>
                <Phone size={14} />
                Bel direct
              </a>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </>
  );
}
