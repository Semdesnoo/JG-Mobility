"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle, TrendingUp, Clock, Shield, Eye, Handshake, BadgeCheck, CreditCard, Camera, Car, User } from "lucide-react";
import AnimateOnScroll from "@/components/AnimateOnScroll";

const voordelen = [
  { icon: <TrendingUp size={20} />, title: "Hogere verkoopprijs", desc: "Wij kennen de markt. Uw auto wordt professioneel gepresenteerd voor de hoogst mogelijke opbrengst." },
  { icon: <Clock size={20} />, title: "Jij doet niets", desc: "Geen foto's, geen advertenties, geen no-shows. Wij nemen het volledig uit uw handen." },
  { icon: <Shield size={20} />, title: "Volledig veilig", desc: "Geen vreemden over de vloer. Elke overdracht veilig en professioneel geregeld." },
  { icon: <Eye size={20} />, title: "Premium uitstraling", desc: "Professionele fotografie en plaatsing op de juiste kanalen voor maximaal bereik." },
  { icon: <Handshake size={20} />, title: "Persoonlijk contact", desc: "Jimi begeleidt het volledige proces. Altijd direct contact, geen tussenpersonen." },
  { icon: <BadgeCheck size={20} />, title: "€0 kosten vooraf", desc: "Geen instapkosten, geen advertentiekosten. Onze vergoeding is enkel bij succesvolle verkoop." },
  { icon: <Car size={20} />, title: "Maximaal bereik", desc: "Gepresenteerd aan ons kopers-netwerk én op meerdere advertentieplatformen." },
  { icon: <CreditCard size={20} />, title: "Zorgeloos afronden", desc: "Wij regelen betaling, kentekenoverdracht en alle papieren. U ontvangt het geld — zonder stress." },
];

const stappen = [
  { icon: <Camera size={20} />, step: "01", title: "Auto aanbieden", desc: "Vul ons formulier in en voeg foto's toe. Wij beoordelen uw auto en nemen contact op." },
  { icon: <Eye size={20} />, step: "02", title: "Professionele presentatie", desc: "Wij verzorgen fotografie, advertentietekst en plaatsing op premium platforms." },
  { icon: <Handshake size={20} />, step: "03", title: "Wij regelen alles", desc: "Bezichtigingen, onderhandelingen, overdracht — u hoeft nergens voor te komen." },
  { icon: <User size={20} />, step: "04", title: "U ontvangt het geld", desc: "Na verkoop ontvangt u het afgesproken bedrag direct. Klaar." },
];

export default function ConsignatieDienstPage() {
  return (
    <>
      {/* Hero */}
      <div className="relative pt-52 pb-20 px-6 overflow-hidden" style={{ backgroundColor: "#001337" }}>
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 50% 80% at 80% 50%, rgba(255,255,255,0.04) 0%, transparent 70%)" }} />
        <div className="relative max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Link href="/diensten" className="inline-flex items-center gap-2 text-xs tracking-widest uppercase mb-6 hover:opacity-70 transition-opacity" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-inter)" }}>
              ← Diensten
            </Link>
          </motion.div>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }}
            className="text-xs tracking-widest uppercase mb-3" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-inter)" }}>
            Dienst 02
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-5" style={{ fontFamily: "var(--font-playfair)" }}>
            Consignatie
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm md:text-base max-w-xl" style={{ color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-inter)", lineHeight: 1.8 }}>
            U levert uw auto in bij JG Mobility. Wij regelen alles — van fotografie tot overdracht. U ontvangt de beste prijs, zonder gedoe.
          </motion.p>
        </div>
      </div>

      {/* Voordelen */}
      <section className="py-20 px-6" style={{ backgroundColor: "#ffffff" }}>
        <div className="max-w-6xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-14">
              <p className="text-xs tracking-widest uppercase mb-3" style={{ color: "rgba(0,19,55,0.4)", fontFamily: "var(--font-inter)" }}>Waarom consignatie</p>
              <h2 className="text-3xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: "#001337" }}>Wat u van ons krijgt</h2>
            </div>
          </AnimateOnScroll>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {voordelen.map((v, i) => (
              <AnimateOnScroll key={v.title} delay={i * 0.06}>
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

      {/* Hoe werkt het */}
      <section className="py-20 px-6" style={{ backgroundColor: "#f5f5f5" }}>
        <div className="max-w-4xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-14">
              <p className="text-xs tracking-widest uppercase mb-3" style={{ color: "rgba(0,19,55,0.4)", fontFamily: "var(--font-inter)" }}>In 4 stappen</p>
              <h2 className="text-3xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: "#001337" }}>Hoe werkt consignatie?</h2>
            </div>
          </AnimateOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stappen.map((s, i) => (
              <AnimateOnScroll key={s.step} delay={i * 0.1}>
                <div className="flex items-start gap-5 p-6 rounded-2xl" style={{ backgroundColor: "#ffffff", border: "1px solid rgba(0,19,55,0.07)" }}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#001337", color: "#ffffff" }}>{s.icon}</div>
                  <div>
                    <p className="text-[10px] tracking-widest uppercase mb-1" style={{ color: "rgba(0,19,55,0.3)", fontFamily: "var(--font-inter)" }}>STAP {s.step}</p>
                    <h3 className="font-bold mb-1" style={{ color: "#001337", fontFamily: "var(--font-playfair)" }}>{s.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "rgba(0,19,55,0.5)", fontFamily: "var(--font-inter)" }}>{s.desc}</p>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Tekst blokken */}
      <section className="py-20 px-6" style={{ backgroundColor: "#001337" }}>
        <div className="max-w-4xl mx-auto">
          {[
            { label: "Beste prijs", title: "Wij halen meer\nuit uw auto", desc: "Wij kennen de markt door en door. Uw voertuig wordt professioneel gepresenteerd op de juiste kanalen — zodat u altijd de hoogst mogelijke opbrengst kunt verwachten." },
            { label: "Geen gedoe", title: "U doet niets.\nWij doen alles.", desc: "Geen advertenties schrijven, geen no-shows, geen ellenlange onderhandelingen. Van de eerste foto tot de definitieve overdracht — wij nemen het volledig uit handen." },
            { label: "Veiligheid & zekerheid", title: "Betrouwbaar\nvan begin tot eind", desc: "Elke transactie verloopt veilig, met duidelijke afspraken en persoonlijk contact met Jimi. U weet altijd waar u aan toe bent." },
          ].map((item, i) => (
            <AnimateOnScroll key={item.label}>
              <div
                className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center py-14"
                style={{ borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.07)" : "none" }}
              >
                <div className={i % 2 === 1 ? "md:order-2" : ""}>
                  <p className="text-xs tracking-widest uppercase mb-3" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-inter)" }}>{item.label}</p>
                  <h2 className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: "var(--font-playfair)", whiteSpace: "pre-line", lineHeight: 1.15 }}>{item.title}</h2>
                </div>
                <div className={i % 2 === 1 ? "md:order-1" : ""}>
                  <div className="h-px mb-6" style={{ background: "linear-gradient(to right, rgba(255,255,255,0.15), transparent)" }} />
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-inter)" }}>{item.desc}</p>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6" style={{ backgroundColor: "#ffffff", borderTop: "1px solid rgba(0,19,55,0.06)" }}>
        <div className="max-w-3xl mx-auto text-center">
          <AnimateOnScroll>
            <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ fontFamily: "var(--font-playfair)", color: "#001337" }}>Uw auto in consignatie aanbieden?</h2>
            <p className="text-sm text-gray-500 mb-8" style={{ fontFamily: "var(--font-inter)" }}>Vrijblijvend en gratis — wij nemen contact op bij interesse.</p>
            <Link href="/consignatie" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm font-semibold transition-all hover:scale-105" style={{ backgroundColor: "#001337", color: "#ffffff", fontFamily: "var(--font-inter)" }}>
              Auto aanbieden
              <ArrowRight size={14} />
            </Link>
          </AnimateOnScroll>
        </div>
      </section>
    </>
  );
}
