"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  ArrowRight,
  Clock,
  MessageCircle,
  Zap,
  BadgeEuro,
  Repeat,
  CreditCard,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import AppointmentScheduler from "@/components/AppointmentScheduler";

// fontSize 16px is geen smaakkeuze: Safari op iOS zoomt automatisch in zodra je in
// een veld tikt dat kleiner is, en dan staat het formulier scheef in beeld. Volle
// breedte om dezelfde reden — één kolom tikt op een telefoon makkelijker in dan twee.
const inputStyle = {
  width: "100%",
  backgroundColor: "rgba(0,19,55,0.03)",
  border: "1px solid rgba(0,19,55,0.12)",
  borderRadius: 0,
  padding: "14px 16px",
  color: "#001337",
  fontSize: "16px",
  fontFamily: "var(--font-inter)",
  outline: "none",
};

// Alle panelen op deze pagina: wit, één dunne rand, vierkant.
const paneel = {
  backgroundColor: "#ffffff",
  border: "1px solid rgba(0,19,55,0.08)",
  borderRadius: 0,
};

/** Dezelfde kop boven elk blok, zodat planner, contact en kaart op één lijn liggen. */
function SectieKop({ boven, titel, tekst, zonderMarge }: { boven: string; titel: string; tekst?: string; zonderMarge?: boolean }) {
  return (
    <div className={zonderMarge ? "" : "mb-8 md:mb-10"}>
      <p className="text-xs tracking-widest uppercase mb-3" style={{ color: "rgba(0,19,55,0.45)", fontFamily: "var(--font-inter)" }}>
        {boven}
      </p>
      <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: "#001337" }}>
        {titel}
      </h2>
      {tekst && (
        <p className="text-sm text-gray-500 mt-3 max-w-lg leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>
          {tekst}
        </p>
      )}
    </div>
  );
}

// De tekstband onder de kop. Kort, feitelijk, elk item met een eigen icoon.
const TICKER = [
  { icon: MapPin, tekst: "Arnhemseweg 10a, Barendrecht" },
  { icon: Clock, tekst: "7 dagen bereikbaar · 10:00–21:00" },
  { icon: MessageCircle, tekst: "Direct contact met Jimi via WhatsApp" },
  { icon: Zap, tekst: "Reactie binnen 24 uur" },
  { icon: BadgeEuro, tekst: "Gratis taxatie van je auto" },
  { icon: Repeat, tekst: "Inruil mogelijk" },
  { icon: CreditCard, tekst: "Financial lease mogelijk" },
  { icon: Truck, tekst: "Bedrijfswagens & geselecteerde occasions" },
];

const labelStyle = {
  display: "block",
  fontSize: "10px",
  letterSpacing: "0.12em",
  textTransform: "uppercase" as const,
  color: "rgba(0,19,55,0.5)",
  marginBottom: "7px",
  fontFamily: "var(--font-inter)",
};

export default function ContactClient() {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "contact",
        naam: (form.elements.namedItem("naam") as HTMLInputElement).value,
        email: (form.elements.namedItem("email") as HTMLInputElement).value,
        telefoon: (form.elements.namedItem("telefoon") as HTMLInputElement).value,
        bericht: (form.elements.namedItem("bericht") as HTMLTextAreaElement).value,
      }),
    });
    setLoading(false);
    setSuccess(true);
  };

  return (
    <>
      {/* Hero */}
      <div className="relative pt-28 md:pt-52 pb-12 px-6 overflow-hidden" style={{ backgroundColor: "#001337" }}>
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 50% 80% at 80% 50%, rgba(255,255,255,0.03) 0%, transparent 70%)" }} />
        <div className="relative max-w-5xl mx-auto">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="text-xs tracking-widest uppercase mb-3" style={{ color: "#ffffff", fontFamily: "var(--font-inter)" }}>
            Neem contact op
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl font-bold text-white" style={{ fontFamily: "var(--font-playfair)" }}>
            Contact
          </motion.h1>
        </div>
      </div>

      {/* Ticker */}
      <div className="overflow-hidden py-5" style={{ backgroundColor: "#001337", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <style>{`
          @keyframes ticker {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .ticker-track {
            display: flex;
            width: max-content;
            animation: ticker 45s linear infinite;
          }
          .ticker-track:hover { animation-play-state: paused; }
          @media (prefers-reduced-motion: reduce) {
            .ticker-track { animation-duration: 120s; }
          }
        `}</style>
        <div className="ticker-track">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center gap-0">
              {/* Wie hier is, heeft ons al gevonden — die heeft geen verkoopargumenten meer
                  nodig maar antwoorden. Vandaar alleen controleerbare feiten, elk los te
                  lezen met een icoon ervoor, want de band schuift voorbij en niemand leest
                  hem van begin tot eind. "Bereikbaar" en niet "open": de afsprakenplanner
                  hieronder laat geen zondagen toe. */}
              {TICKER.map(({ icon: Icoon, tekst }) => (
                <span key={tekst} className="flex items-center gap-8 px-8">
                  <span className="flex items-center gap-2.5 whitespace-nowrap">
                    <Icoon size={15} color="#ffffff" strokeWidth={1.75} style={{ opacity: 0.9 }} />
                    <span
                      className="text-xs font-semibold tracking-widest uppercase"
                      style={{ color: "rgba(255,255,255,0.85)", fontFamily: "var(--font-inter)" }}
                    >
                      {tekst}
                    </span>
                  </span>
                  <span aria-hidden="true" style={{ width: 1, height: 14, backgroundColor: "rgba(255,255,255,0.18)" }} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── AFSPRAAK ──
          Eén breedte (max-w-5xl) en één kopstijl voor elk blok op deze pagina: dan lijnen
          planner, contactblok en kaart precies onder elkaar uit en oogt de pagina strak. */}
      <section className="py-16 md:py-20 px-6" style={{ backgroundColor: "#ffffff" }}>
        <div className="max-w-5xl mx-auto">
          <SectieKop
            boven="Kom langs"
            titel="Plan een afspraak"
            tekst="Kies een datum en tijdstip dat u uitkomt. Vul uw e-mailadres in en wij bevestigen de afspraak zo snel mogelijk."
          />
          <AppointmentScheduler />
        </div>
      </section>

      {/* ── CONTACT ──
          Twee panelen naast elkaar, even hoog, op een licht grijze achtergrond. Hier stond
          eerst een los streepje boven het formulier zonder kop; nu heeft elk paneel een
          eigen titel op dezelfde hoogte. */}
      <section className="py-16 md:py-20 px-6" style={{ backgroundColor: "#f5f5f5" }}>
        <div className="max-w-5xl mx-auto">
          <SectieKop boven="Liever schrijven of bellen?" titel="Neem contact op" />

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6 items-stretch">
            {/* Contactinfo */}
            <div className="md:col-span-2 flex flex-col p-6 md:p-8" style={paneel}>
              <h3 className="text-lg font-bold mb-6" style={{ fontFamily: "var(--font-playfair)", color: "#001337" }}>
                Bereikbaarheid
              </h3>
              <ul className="flex flex-col gap-5">
                {[
                  { icon: <MapPin size={14} color="#001337" />, boven: "Arnhemseweg 10a", onder: "2994 LA Barendrecht", href: undefined },
                  { icon: <Phone size={14} color="#001337" />, boven: "+31 6 21331374", onder: "Bellen of appen, 10:00–21:00", href: "tel:+31621331374" },
                  { icon: <Mail size={14} color="#001337" />, boven: "info@jgmobility.nl", onder: "Reactie binnen 24 uur", href: "mailto:info@jgmobility.nl" },
                ].map((r) => (
                  <li key={r.boven} className="flex items-start gap-4">
                    <div className="w-9 h-9 flex items-center justify-center flex-shrink-0" style={{ border: "1px solid rgba(0,19,55,0.15)" }}>
                      {r.icon}
                    </div>
                    <div className="min-w-0">
                      {r.href ? (
                        <a href={r.href} className="text-sm font-semibold hover:opacity-70 transition-opacity break-all" style={{ color: "#001337", fontFamily: "var(--font-inter)" }}>
                          {r.boven}
                        </a>
                      ) : (
                        <p className="text-sm font-semibold" style={{ color: "#001337", fontFamily: "var(--font-inter)" }}>{r.boven}</p>
                      )}
                      <p className="text-xs mt-0.5" style={{ color: "rgba(0,19,55,0.5)", fontFamily: "var(--font-inter)" }}>{r.onder}</p>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Consignatie als rustige regel onderaan het paneel (mt-auto), niet als
                  apart kaartje: het is een zijspoor, geen tweede hoofdactie. */}
              <Link
                href="/consignatie"
                className="group mt-8 md:mt-auto pt-5 flex items-center justify-between gap-3 text-sm font-semibold hover:opacity-70 transition-opacity"
                style={{ color: "#001337", fontFamily: "var(--font-inter)", borderTop: "1px solid rgba(0,19,55,0.08)" }}
              >
                Auto verkopen via consignatie?
                <ArrowRight size={14} className="flex-shrink-0 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Formulier */}
            <div className="md:col-span-3 p-6 md:p-8" style={paneel}>
              {success ? (
                <div className="flex flex-col items-center justify-center h-full py-12 gap-6">
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-center justify-center"
                    style={{ width: 96, height: 96, backgroundColor: "#001337", borderRadius: 0 }}
                  >
                    <CheckCircle size={44} color="#ffffff" strokeWidth={1.5} />
                  </motion.div>
                  <div className="text-center">
                    <p className="text-xl font-bold mb-2" style={{ color: "#001337", fontFamily: "var(--font-playfair)" }}>
                      Bericht ontvangen!
                    </p>
                    <p className="text-sm text-gray-500 max-w-xs mx-auto leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>
                      Uw bericht is succesvol bij ons binnengekomen. We nemen zo snel mogelijk contact met u op.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-bold mb-6" style={{ fontFamily: "var(--font-playfair)", color: "#001337" }}>
                    Stuur een bericht
                  </h3>
                  {/* Vier velden: precies wat /api/contact nodig heeft. Naam en telefoon
                      naast elkaar vanaf tablet; op de telefoon alles in één kolom. */}
                  <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label style={labelStyle}>Naam *</label>
                      <input name="naam" required autoComplete="name" style={inputStyle} placeholder="Jouw naam" />
                    </div>
                    <div>
                      <label style={labelStyle}>Telefoonnummer</label>
                      <input name="telefoon" type="tel" autoComplete="tel" style={inputStyle} placeholder="06 ..." />
                    </div>
                    <div className="sm:col-span-2">
                      <label style={labelStyle}>E-mailadres *</label>
                      <input name="email" type="email" required autoComplete="email" style={inputStyle} placeholder="jouw@email.nl" />
                    </div>
                    <div className="sm:col-span-2">
                      <label style={labelStyle}>Bericht *</label>
                      <textarea
                        name="bericht"
                        required
                        rows={5}
                        style={{ ...inputStyle, resize: "vertical" }}
                        placeholder="Hoe kan ik je helpen?"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-semibold tracking-wide transition-all hover:opacity-90"
                        style={{
                          backgroundColor: "#001337",
                          color: "#ffffff",
                          fontFamily: "var(--font-inter)",
                          opacity: loading ? 0.7 : 1,
                          minHeight: "48px",
                        }}
                      >
                        <Send size={14} />
                        {loading ? "Versturen..." : "Verstuur bericht"}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── ADRES & KAART ──
          Het adres staat hierboven al in het rijtje bereikbaarheid, maar wie wil
          langskomen zoekt een kaart. Daarom één blok waarin het adres groot staat én
          de kaart op volle breedte: dan hoeft niemand te kopiëren en plakken.
          De iframe staat op lazy — hij staat onderaan de pagina en Google Maps is
          zwaar; hem meteen laden kost zichtbaar laadtijd bovenaan. */}
      <section className="py-16 md:py-20 px-6" style={{ backgroundColor: "#ffffff" }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <SectieKop boven="Ons adres" titel="Arnhemseweg 10a, Barendrecht" zonderMarge />
            <a
              href="https://www.google.com/maps/search/?api=1&query=Arnhemseweg+10a,+2994+LA+Barendrecht"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 text-sm font-semibold hover:opacity-70 transition-opacity"
              style={{ color: "#001337", fontFamily: "var(--font-inter)" }}
            >
              <MapPin size={14} />
              Route plannen
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div style={{ border: "1px solid rgba(0,19,55,0.1)", height: "380px" }}>
            <iframe
              src="https://www.google.com/maps?q=Arnhemseweg+10a,+2994+LA+Barendrecht&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="JG Mobility op de kaart — Arnhemseweg 10a, 2994 LA Barendrecht"
            />
          </div>
        </div>
      </section>
    </>
  );
}
