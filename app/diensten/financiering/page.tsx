"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle, CreditCard, Shield, Clock, Percent } from "lucide-react";
import AnimateOnScroll from "@/components/AnimateOnScroll";

const voordelen = [
  { icon: <Percent size={20} />, title: "Scherpe rente", desc: "Via onze partners bieden wij toegang tot concurrerende leningen met lage maandlasten." },
  { icon: <Clock size={20} />, title: "Snelle goedkeuring", desc: "In veel gevallen ontvangt u binnen één werkdag uitsluitsel over uw aanvraag." },
  { icon: <Shield size={20} />, title: "Transparant & veilig", desc: "Geen kleine lettertjes. Wij leggen alles helder uit voordat u tekent." },
  { icon: <CreditCard size={20} />, title: "Meerdere opties", desc: "Van private lease tot doorlopend krediet — wij vinden de oplossing die bij u past." },
];

const opties = [
  {
    title: "Autolening",
    desc: "Een traditionele lening specifiek voor de aankoop van uw voertuig. Vaste maandlasten, overzichtelijk en voorspelbaar.",
    punten: ["Vaste looptijd", "Vaste rente", "Direct eigenaar", "Vrij kilometrage"],
  },
  {
    title: "Private Lease",
    desc: "U rijdt een vast bedrag per maand, inclusief verzekering, wegenbelasting en onderhoud. Geen zorgen, gewoon rijden.",
    punten: ["All-in maandbedrag", "Geen restwaarde-risico", "Altijd nieuw voertuig", "Fiscaal voordelig"],
  },
  {
    title: "Financial Lease",
    desc: "U financiert het voertuig via een leasemaatschappij en wordt aan het einde eigenaar. Populair voor zakelijke rijders.",
    punten: ["Fiscaal aftrekbaar", "Eigendom na looptijd", "Flexibele looptijd", "Zakelijk voordelig"],
  },
];

export default function FinancieringPage() {
  return (
    <>
      {/* Hero */}
      <div className="relative pt-40 pb-20 px-6 overflow-hidden" style={{ backgroundColor: "#001337" }}>
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 50% 80% at 20% 60%, rgba(255,255,255,0.04) 0%, transparent 70%)" }} />
        <div className="relative max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Link href="/diensten" className="inline-flex items-center gap-2 text-xs tracking-widest uppercase mb-6 hover:opacity-70 transition-opacity" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-inter)" }}>
              ← Diensten
            </Link>
          </motion.div>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }}
            className="text-xs tracking-widest uppercase mb-3" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-inter)" }}>
            Dienst 03
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-5" style={{ fontFamily: "var(--font-playfair)" }}>
            Financiering
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm md:text-base max-w-xl" style={{ color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-inter)", lineHeight: 1.8 }}>
            Via onze financieringspartners bieden wij u toegang tot scherpe leningen en leasemogelijkheden. Wij begeleiden u van aanvraag tot goedkeuring.
          </motion.p>
        </div>
      </div>

      {/* Voordelen */}
      <section className="py-20 px-6" style={{ backgroundColor: "#ffffff" }}>
        <div className="max-w-6xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-14">
              <p className="text-xs tracking-widest uppercase mb-3" style={{ color: "rgba(0,19,55,0.4)", fontFamily: "var(--font-inter)" }}>Waarom via JG Mobility</p>
              <h2 className="text-3xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: "#001337" }}>Voordelen van onze financiering</h2>
            </div>
          </AnimateOnScroll>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {voordelen.map((v, i) => (
              <AnimateOnScroll key={v.title} delay={i * 0.08}>
                <div className="p-5 rounded-2xl h-full" style={{ border: "1px solid rgba(0,19,55,0.08)", backgroundColor: "#fafafa" }}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: "#001337", color: "#ffffff" }}>{v.icon}</div>
                  <h3 className="font-bold text-sm mb-2" style={{ color: "#001337", fontFamily: "var(--font-playfair)" }}>{v.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(0,19,55,0.5)", fontFamily: "var(--font-inter)" }}>{v.desc}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Opties */}
      <section className="py-20 px-6" style={{ backgroundColor: "#f5f5f5" }}>
        <div className="max-w-5xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-14">
              <p className="text-xs tracking-widest uppercase mb-3" style={{ color: "rgba(0,19,55,0.4)", fontFamily: "var(--font-inter)" }}>Kies wat bij u past</p>
              <h2 className="text-3xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: "#001337" }}>Financieringsopties</h2>
            </div>
          </AnimateOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {opties.map((o, i) => (
              <AnimateOnScroll key={o.title} delay={i * 0.1}>
                <div className="p-6 md:p-8 rounded-2xl h-full flex flex-col" style={{ backgroundColor: "#ffffff", border: "1px solid rgba(0,19,55,0.07)" }}>
                  <h3 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-playfair)", color: "#001337" }}>{o.title}</h3>
                  <p className="text-sm leading-relaxed mb-5 flex-1" style={{ color: "rgba(0,19,55,0.5)", fontFamily: "var(--font-inter)" }}>{o.desc}</p>
                  <ul className="flex flex-col gap-2">
                    {o.punten.map((p) => (
                      <li key={p} className="flex items-center gap-2 text-xs" style={{ color: "rgba(0,19,55,0.6)", fontFamily: "var(--font-inter)" }}>
                        <CheckCircle size={12} style={{ color: "#001337", flexShrink: 0 }} />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Hoe werkt het */}
      <section className="py-20 px-6" style={{ backgroundColor: "#001337" }}>
        <div className="max-w-4xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-14">
              <p className="text-xs tracking-widest uppercase mb-3" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-inter)" }}>Stap voor stap</p>
              <h2 className="text-3xl font-bold text-white" style={{ fontFamily: "var(--font-playfair)" }}>Hoe gaat het in zijn werk?</h2>
            </div>
          </AnimateOnScroll>
          <div className="flex flex-col gap-4">
            {[
              { step: "01", title: "Vertel uw wensen", desc: "Welk voertuig wilt u kopen? Wat is uw budget? Wij luisteren en adviseren." },
              { step: "02", title: "Aanvraag indienen", desc: "Wij dienen de aanvraag in bij onze financieringspartners en zoeken de beste optie voor u." },
              { step: "03", title: "Goedkeuring ontvangen", desc: "In de meeste gevallen ontvangt u binnen één werkdag uitsluitsel." },
              { step: "04", title: "Rijden maar", desc: "Na ondertekening regelen wij de rest. U rijdt weg in uw nieuwe auto." },
            ].map((s, i) => (
              <AnimateOnScroll key={s.step} delay={i * 0.08}>
                <div className="flex items-start gap-6 p-6 rounded-2xl" style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <span className="text-3xl font-bold flex-shrink-0" style={{ fontFamily: "var(--font-playfair)", color: "rgba(255,255,255,0.1)" }}>{s.step}</span>
                  <div>
                    <h3 className="font-bold mb-1 text-white" style={{ fontFamily: "var(--font-playfair)" }}>{s.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-inter)" }}>{s.desc}</p>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6" style={{ backgroundColor: "#ffffff", borderTop: "1px solid rgba(0,19,55,0.06)" }}>
        <div className="max-w-3xl mx-auto text-center">
          <AnimateOnScroll>
            <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ fontFamily: "var(--font-playfair)", color: "#001337" }}>Financiering aanvragen?</h2>
            <p className="text-sm text-gray-500 mb-8" style={{ fontFamily: "var(--font-inter)" }}>Neem contact op en wij helpen u aan de beste financieringsoplossing.</p>
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm font-semibold transition-all hover:scale-105" style={{ backgroundColor: "#001337", color: "#ffffff", fontFamily: "var(--font-inter)" }}>
              Neem contact op
              <ArrowRight size={14} />
            </Link>
          </AnimateOnScroll>
        </div>
      </section>
    </>
  );
}
