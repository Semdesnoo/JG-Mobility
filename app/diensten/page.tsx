"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Car, Handshake, CreditCard, Package } from "lucide-react";
import AnimateOnScroll from "@/components/AnimateOnScroll";

const diensten = [
  {
    icon: <Car size={28} />,
    nummer: "01",
    title: "Inkoop & Taxatie",
    sub: "Eerlijke waardebepaling, direct afgehandeld",
    desc: "Wij taxeren uw auto snel en eerlijk op basis van actuele marktdata. Geen verborgen kosten, geen tijdverspilling. U weet binnen 24 uur wat uw auto waard is — en wij kopen hem direct in als het past.",
    href: "/diensten/inkoop-taxatie",
    punten: ["Gratis taxatie", "Marktconforme prijzen", "Directe afhandeling", "Geen verplichtingen"],
  },
  {
    icon: <Handshake size={28} />,
    nummer: "02",
    title: "Consignatie",
    sub: "Uw auto verkopen zonder zorgen",
    desc: "U levert uw auto in bij JG Mobility. Wij regelen alles: professionele fotografie, advertenties, onderhandelingen en de complete overdracht. U ontvangt de beste marktprijs — zonder ook maar één no-show.",
    href: "/diensten/consignatie",
    punten: ["€0 kosten vooraf", "Professionele presentatie", "Persoonlijk contact", "Veilige overdracht"],
  },
  {
    icon: <CreditCard size={28} />,
    nummer: "03",
    title: "Financiering",
    sub: "Flexibele oplossingen voor uw aankoop",
    desc: "Via onze financieringspartners bieden wij u toegang tot scherpe leningen en leasemogelijkheden. Geen ingewikkeld papierwerk — wij begeleiden u van aanvraag tot goedkeuring.",
    href: "/diensten/financiering",
    punten: ["Lage maandlasten", "Snelle goedkeuring", "Meerdere aanbieders", "Volledig begeleid"],
  },
  {
    icon: <Package size={28} />,
    nummer: "04",
    title: "Afleverpakketten",
    sub: "Uw nieuwe auto klaar voor de weg",
    desc: "Van een grondige APK-keuring tot een volledige detailing beurt — wij leveren uw voertuig af precies zoals u het wil hebben. Kies uit onze pakketten of stel zelf samen.",
    href: "/diensten/afleverpakketten",
    punten: ["APK & keuring", "Professionele detailing", "Garantieopties", "Maatwerk mogelijk"],
  },
];

export default function DienstenPage() {
  return (
    <>
      {/* Hero */}
      <div className="relative pt-28 md:pt-52 pb-20 px-6 overflow-hidden" style={{ backgroundColor: "#001337" }}>
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 80% at 80% 50%, rgba(255,255,255,0.04) 0%, transparent 70%)" }} />
        <div className="relative max-w-7xl mx-auto">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="text-xs tracking-widest uppercase mb-3" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-inter)" }}>
            Wat wij doen
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-5" style={{ fontFamily: "var(--font-playfair)" }}>
            Onze diensten
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm md:text-base max-w-xl" style={{ color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-inter)", lineHeight: 1.8 }}>
            JG Mobility ontzorgt u volledig — of u nu uw auto wilt verkopen, een nieuwe wilt financieren of rijklaar wilt laten afleveren.
          </motion.p>
        </div>
      </div>

      {/* Diensten */}
      <section className="py-20 px-6" style={{ backgroundColor: "#ffffff" }}>
        <div className="max-w-6xl mx-auto flex flex-col gap-6">
          {diensten.map((d, i) => (
            <AnimateOnScroll key={d.title} delay={i * 0.08}>
              <Link href={d.href} className="group block">
                <div
                  className="grid grid-cols-1 md:grid-cols-[72px_1fr_auto] gap-6 md:gap-10 items-center p-6 md:p-8 rounded-none transition-all duration-300 group-hover:shadow-lg"
                  style={{ border: "1px solid rgba(0,19,55,0.08)", backgroundColor: "#fafafa" }}
                >
                  {/* Nummer + icon */}
                  <div className="flex md:flex-col items-center gap-4 md:gap-2">
                    <span className="text-xs font-bold tracking-widest" style={{ color: "rgba(0,19,55,0.2)", fontFamily: "var(--font-inter)" }}>{d.nummer}</span>
                    <div className="w-12 h-12 rounded-none flex items-center justify-center" style={{ backgroundColor: "#001337", color: "#ffffff" }}>
                      {d.icon}
                    </div>
                  </div>

                  {/* Tekst */}
                  <div>
                    <p className="text-xs tracking-widest uppercase mb-1" style={{ color: "rgba(0,19,55,0.35)", fontFamily: "var(--font-inter)" }}>{d.sub}</p>
                    <h2 className="text-xl md:text-2xl font-bold mb-3" style={{ fontFamily: "var(--font-playfair)", color: "#001337" }}>{d.title}</h2>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(0,19,55,0.5)", fontFamily: "var(--font-inter)" }}>{d.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {d.punten.map((p) => (
                        <span key={p} className="text-xs px-3 py-1 rounded-none" style={{ backgroundColor: "rgba(0,19,55,0.06)", color: "rgba(0,19,55,0.6)", fontFamily: "var(--font-inter)" }}>
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Pijl */}
                  <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-none transition-all duration-300 group-hover:bg-[#001337] group-hover:border-[#001337]" style={{ border: "1px solid rgba(0,19,55,0.15)", color: "rgba(0,19,55,0.4)" }}>
                    <ArrowRight size={16} className="transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-white" />
                  </div>
                </div>
              </Link>
            </AnimateOnScroll>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6" style={{ backgroundColor: "#001337" }}>
        <div className="max-w-3xl mx-auto text-center">
          <AnimateOnScroll>
            <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-inter)" }}>Vrijblijvend</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-5" style={{ fontFamily: "var(--font-playfair)" }}>
              Niet zeker welke dienst bij u past?
            </h2>
            <p className="text-sm text-white/45 mb-8 leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>
              Jimi denkt graag met u mee. Neem contact op en bespreek vrijblijvend wat de beste optie is voor uw situatie.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-none text-sm font-semibold transition-all hover:scale-105"
              style={{ backgroundColor: "#ffffff", color: "#001337", fontFamily: "var(--font-inter)" }}
            >
              Neem contact op
              <ArrowRight size={14} />
            </Link>
          </AnimateOnScroll>
        </div>
      </section>
    </>
  );
}
