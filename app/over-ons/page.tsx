"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Truck, Repeat, CreditCard, Handshake, MapPin, Phone, Mail } from "lucide-react";
import AnimateOnScroll from "@/components/AnimateOnScroll";

// Zelfde afspraak als in de Header en Footer: weergave met streepje, link
// internationaal.
const TELEFOON_LINK = "tel:+31621331374";
const TELEFOON_TEKST = "06-21331374";

// Waar JG Mobility voor is. Vier regels, geen verkoopverhaal: dit is letterlijk wat
// er gebeurt als je langskomt.
const watWijDoen = [
  {
    icon: <Truck size={22} />,
    title: "Bedrijfswagens",
    desc: "Bestelbussen voor ondernemers, met prijzen exclusief btw en papieren die kloppen.",
    href: "/bedrijfswagens",
  },
  {
    icon: <Handshake size={22} />,
    title: "Geselecteerde occasions",
    desc: "Personenauto's die we zelf zouden rijden — gecontroleerd voordat ze in het aanbod komen.",
    href: "/personenautos",
  },
  {
    icon: <Repeat size={22} />,
    title: "Inruil & taxatie",
    desc: "Je huidige auto of bus wordt getaxeerd en direct verrekend met je nieuwe voertuig.",
    href: "/diensten/inkoop-taxatie",
  },
  {
    icon: <CreditCard size={22} />,
    title: "Financial lease & consignatie",
    desc: "Zakelijk financieren regelen wij met onze partners; je auto laten verkopen kan via consignatie.",
    href: "/financial-lease",
  },
];

export default function OverOnsPage() {
  return (
    <>
      {/* Hero */}
      <div className="relative pt-28 md:pt-52 pb-20 px-6 overflow-hidden" style={{ backgroundColor: "#001337" }}>
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 50% 80% at 20% 50%, rgba(255,255,255,0.06) 0%, transparent 70%)" }} />
        <div className="relative max-w-7xl mx-auto">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="text-xs tracking-widest uppercase mb-3" style={{ color: "#ffffff", fontFamily: "var(--font-inter)" }}>
            Bedrijfswagens &amp; geselecteerde occasions
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl font-bold text-white" style={{ fontFamily: "var(--font-playfair)" }}>
            Over JG Mobility
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-5 text-sm md:text-base max-w-xl leading-relaxed" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-inter)" }}>
            Eén autobedrijf in Barendrecht, één aanspreekpunt. Jimi Gaillard verkoopt
            bedrijfswagens aan ondernemers en geselecteerde occasions aan particulieren —
            met inruil, financial lease en consignatie onder hetzelfde dak.
          </motion.p>
        </div>
      </div>

      {/* Verhaal sectie */}
      <section className="py-24 px-6" style={{ backgroundColor: "#ffffff" }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">
          <AnimateOnScroll direction="left">
            <div className="relative">
              {/* Echte showroom-foto met Jimi en de BMW X5 M. De gradient blijft
                  subtiel aanwezig voor visuele diepte zonder de foto te verbergen.

                  HIER KOMEN DE ECHTE BEDRIJFSFOTO'S
                  Zodra er foto's zijn van de locatie aan de Arnhemseweg (pand van
                  buiten, de bussen op het terrein, een aflevering), horen die hier en
                  in de sectie "Waar je ons vindt" hieronder. Zet ze in /public en
                  vervang deze <Image> door de nieuwe bestandsnaam; de verhouding
                  3/4 houdt de kolom in balans. Geen stockfoto's gebruiken — dan is
                  een enkele echte foto beter dan drie neppe. */}
              <div
                className="aspect-[3/4] overflow-hidden"
                style={{ borderRadius: "0" }}
              >
                <Image
                  src="/jimi-showroom.png"
                  alt="Jimi Gaillard in de showroom bij een BMW X5 M"
                  width={1152}
                  height={1366}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
              {/* Decoratief element */}
              <div
                className="absolute -bottom-4 -right-4 w-32 h-32 rounded-none -z-10"
                style={{ backgroundColor: "#001337", opacity: 0.1 }}
              />
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll direction="right">
            <div>
              <p className="text-xs tracking-widest uppercase mb-3" style={{ color: "rgba(0,19,55,0.45)", fontFamily: "var(--font-inter)" }}>
                Jimi Gaillard — Oprichter &amp; Eigenaar
              </p>
              <h2 className="text-4xl font-bold mb-8" style={{ fontFamily: "var(--font-playfair)", color: "#001337" }}>
                Passie voor auto&apos;s,<br />geboren uit ervaring
              </h2>

              <div className="flex flex-col gap-5 text-sm leading-loose text-gray-500" style={{ fontFamily: "var(--font-inter)" }}>
                <p>
                  Zolang ik me kan herinneren, draait bij mij alles om auto&apos;s. Als kind stond ik al met mijn neus tegen het raam van showrooms gedrukt en als tiener ging elke verdiende euro in een potje voor mijn eerste eigen wagen. Die fascinatie is nooit verdwenen; hij is door de jaren heen alleen maar groter geworden.
                </p>
                <p>
                  De afgelopen drie jaar heb ik van die passie mijn werk gemaakt. Ik dook de autobranche in en leerde de kneepjes van het vak bij verschillende dealers. Het was een leerzame tijd, maar ik ontdekte ook al snel waar mijn hart écht ligt: mensen eerlijk vooruithelpen. Ik merkte dat klanten geen behoefte hebben aan gladde verkooppraatjes of standaard scripts, maar aan oprecht advies van iemand die net zo enthousiast is over auto&apos;s als zijzelf.
                </p>
                <p>
                  Daarom doe ik het nu anders. Vanuit Barendrecht help ik je met JG Mobility bij de aan- of verkoop van je auto. Zonder die dure showroom of onnodige poespas, maar mét alle tijd en persoonlijke aandacht voor jou. Gewoon, van liefhebber tot liefhebber.
                </p>
              </div>

              <blockquote
                className="my-8 pl-5 italic text-base"
                style={{
                  fontFamily: "var(--font-playfair)",
                  color: "#001337",
                  borderLeft: "3px solid #001337",
                }}
              >
                &ldquo;Mijn mooiste resultaat? De klik tussen jou en je nieuwe auto.&rdquo;
              </blockquote>

              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 text-sm font-semibold"
                style={{ color: "#001337", fontFamily: "var(--font-inter)" }}
              >
                Neem contact op
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Wat wij doen */}
      <section className="py-24 px-6" style={{ backgroundColor: "#f5f5f5" }}>
        <div className="max-w-7xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-14">
              <p className="text-xs tracking-widest uppercase mb-3" style={{ color: "rgba(0,19,55,0.45)", fontFamily: "var(--font-inter)" }}>
                Waarvoor je bij ons terechtkomt
              </p>
              <h2 className="text-4xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: "#001337" }}>
                Wat JG Mobility doet
              </h2>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {watWijDoen.map((item, i) => (
              <AnimateOnScroll key={item.title} delay={i * 0.1}>
                <Link
                  href={item.href}
                  className="group flex flex-col p-6 h-full transition-all hover:shadow-md"
                  style={{ backgroundColor: "#ffffff", border: "1px solid rgba(0,19,55,0.07)" }}
                >
                  <div
                    className="w-11 h-11 rounded-none flex items-center justify-center mb-4"
                    style={{ backgroundColor: "#001337", color: "#ffffff" }}
                  >
                    {item.icon}
                  </div>
                  <h3 className="text-base font-bold mb-2" style={{ fontFamily: "var(--font-playfair)", color: "#001337" }}>
                    {item.title}
                  </h3>
                  <p className="text-xs leading-relaxed flex-1" style={{ color: "rgba(0,19,55,0.5)", fontFamily: "var(--font-inter)" }}>
                    {item.desc}
                  </p>
                  <span
                    className="inline-flex items-center gap-1.5 text-xs font-semibold mt-4 transition-all group-hover:gap-2.5"
                    style={{ color: "#001337", fontFamily: "var(--font-inter)" }}
                  >
                    Meer info <ArrowRight size={11} />
                  </span>
                </Link>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Waar je ons vindt */}
      <section className="py-24 px-6" style={{ backgroundColor: "#ffffff" }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          <AnimateOnScroll direction="left">
            <div>
              <p className="text-xs tracking-widest uppercase mb-3" style={{ color: "rgba(0,19,55,0.45)", fontFamily: "var(--font-inter)" }}>
                Waar je ons vindt
              </p>
              <h2 className="text-4xl font-bold mb-6" style={{ fontFamily: "var(--font-playfair)", color: "#001337" }}>
                Barendrecht,<br />tussen Rotterdam en Dordrecht
              </h2>
              <div className="flex items-start gap-3 mb-6">
                <MapPin size={16} style={{ color: "#001337", marginTop: 3, flexShrink: 0 }} />
                <div style={{ fontFamily: "var(--font-inter)" }}>
                  <p className="text-sm font-semibold" style={{ color: "#001337" }}>JG Mobility</p>
                  <p className="text-sm text-gray-500">Arnhemseweg 10a</p>
                  <p className="text-sm text-gray-500">2994 LA Barendrecht</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-gray-500 mb-8" style={{ fontFamily: "var(--font-inter)" }}>
                Bezoek en taxatie gaan altijd op afspraak — dan is er tijd voor je en staat de
                auto klaar. Zeven dagen per week bereikbaar van 10:00 tot 21:00.
              </p>

              {/* Contact-CTA's: bellen, appen of het formulier. Drie routes, want
                  niet iedereen pakt even makkelijk de telefoon. */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={TELEFOON_LINK}
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 text-sm font-semibold transition-all hover:opacity-90"
                  style={{ backgroundColor: "#001337", color: "#ffffff", fontFamily: "var(--font-inter)" }}
                >
                  <Phone size={14} />
                  {TELEFOON_TEKST}
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 text-sm font-semibold transition-all hover:opacity-70"
                  style={{ border: "1px solid rgba(0,19,55,0.2)", color: "#001337", fontFamily: "var(--font-inter)" }}
                >
                  <Mail size={14} />
                  Contactformulier
                </Link>
              </div>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll direction="right">
            {/* Kaart in plaats van een foto. Zodra er een echte buitenfoto van het
                pand is, kan die hierboven komen — de kaart mag dan blijven staan,
                want die beantwoordt een andere vraag ("waar is het?"). */}
            <div className="relative overflow-hidden" style={{ height: "360px", border: "1px solid rgba(0,19,55,0.1)" }}>
              <iframe
                src="https://www.google.com/maps?q=Arnhemseweg+10a,+2994+LA+Barendrecht&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="JG Mobility — Arnhemseweg 10a, 2994 LA Barendrecht"
              />
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center" style={{ backgroundColor: "#f5f5f5" }}>
        <AnimateOnScroll>
          <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "var(--font-playfair)", color: "#001337" }}>
            Op zoek naar een auto of bedrijfswagen?
          </h2>
          <p className="text-gray-500 text-sm mb-8 max-w-sm mx-auto" style={{ fontFamily: "var(--font-inter)" }}>
            Bekijk de voorraad of laat ons meezoeken naar het voertuig dat je nodig hebt.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/aanbod"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-none text-sm font-semibold transition-all hover:opacity-90"
              style={{ backgroundColor: "#001337", color: "#ffffff", fontFamily: "var(--font-inter)" }}
            >
              Bekijk het aanbod <ArrowRight size={14} />
            </Link>
            <Link
              href="/diensten/inkoop-taxatie"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-none text-sm font-semibold transition-all hover:opacity-70"
              style={{ border: "1px solid rgba(0,19,55,0.2)", color: "#001337", fontFamily: "var(--font-inter)" }}
            >
              Inruilvoorstel aanvragen
            </Link>
          </div>
        </AnimateOnScroll>
      </section>
    </>
  );
}
