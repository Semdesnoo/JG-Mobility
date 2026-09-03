"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, ArrowRight, CheckCircle } from "lucide-react";
import type { Auto } from "@/lib/autos";
import { prijsWeergave } from "@/lib/prijs";

/**
 * Contact opnemen over déze auto.
 *
 * WAAROM DIT GEEN TABBLAD MEER IS
 * Dit stond achter het tabblad "Contact", naast Kenmerken, Opties, Omschrijving en
 * Financieren. Wie de auto mooi vond en wilde reageren, moest daarvoor eerst een tabblad
 * aanklikken dat er net zo uitzag als vier informatieve tabbladen. De belangrijkste
 * handeling op de hele pagina zat achter een klik die niets beloofde.
 *
 * Nu staat het onder de auto, altijd zichtbaar, precies waar iemand uitkomt die de foto's
 * en de kenmerken heeft doorgenomen.
 */

const WHATSAPP_NUMMER = "31621331374";
const MAPS_LINK = "https://www.google.com/maps/search/?api=1&query=JG+Mobility+Barendrecht";

export default function ContactBlok({ auto }: { auto: Auto }) {
  const [interesse, setInteresse] = useState(false);
  const prijs = prijsWeergave(auto);
  const prijsMetBtw = `${prijs.tekst}${prijs.achtervoegsel ? ` ${prijs.achtervoegsel}` : ""}`;

  const interesseMail =
    `mailto:info@jgmobility.nl?subject=Interesse in ${auto.merk} ${auto.model} (${prijsMetBtw})` +
    `&body=Hallo Jimi,%0D%0A%0D%0AIk heb interesse in de ${auto.merk} ${auto.model} uit ${auto.bouwjaar} ` +
    `(${auto.km.toLocaleString("nl-NL")} km) voor ${prijsMetBtw}. Kunt u contact met mij opnemen?` +
    `%0D%0A%0D%0AMet vriendelijke groet,`;

  const whatsappBericht = encodeURIComponent(
    `Hallo Jimi, ik heb interesse in de ${auto.merk} ${auto.model} uit ${auto.bouwjaar} (${prijsMetBtw}).`
  );

  const regels = [
    {
      icon: <Mail size={14} />,
      label: "E-mail",
      value: "info@jgmobility.nl",
      href: `mailto:info@jgmobility.nl?subject=Interesse ${auto.merk} ${auto.model}`,
      extern: false,
    },
    {
      icon: <Phone size={14} />,
      label: "Telefoon",
      value: "+31 6 21331374",
      href: "tel:+31621331374",
      extern: false,
    },
    {
      // Stond op href="#": dat sprong naar de bovenkant van de pagina terwijl de regel
      // eruitzag als een link. Nu opent hij de kaart, net als in de footer.
      icon: <MapPin size={14} />,
      label: "Locatie",
      value: "Barendrecht, Zuid-Holland",
      href: MAPS_LINK,
      extern: true,
    },
  ];

  return (
    <section aria-labelledby="contact-kop" className="py-16 px-6" style={{ backgroundColor: "#ffffff", borderTop: "1px solid rgba(0,19,55,0.06)" }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "rgba(0,19,55,0.45)", fontFamily: "var(--font-inter)" }}>
            Interesse?
          </p>
          <h2 id="contact-kop" className="text-2xl md:text-3xl font-bold mb-8" style={{ fontFamily: "var(--font-playfair)", color: "#001337" }}>
            Neem contact op
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Links: hoe je Jimi bereikt */}
            <div>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed max-w-md" style={{ fontFamily: "var(--font-inter)" }}>
                Interesse in de {auto.merk} {auto.model}? Neem vrijblijvend contact op met Jimi. We plannen graag een proefrit of beantwoorden al je vragen.
              </p>
              <div className="flex flex-col gap-4">
                {regels.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    {...(item.extern ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="flex items-center gap-4 group w-fit"
                  >
                    <div className="w-9 h-9 rounded-none flex items-center justify-center flex-shrink-0" style={{ border: "1px solid rgba(0,19,55,0.15)" }}>
                      <span style={{ color: "#001337" }}>{item.icon}</span>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400" style={{ fontFamily: "var(--font-inter)" }}>{item.label}</div>
                      <div className="text-sm font-semibold group-hover:opacity-70 transition-opacity" style={{ color: "#001337", fontFamily: "var(--font-inter)" }}>
                        {item.value}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Rechts: de twee manieren om nú te reageren */}
            <div className="p-6 md:p-8 rounded-none" style={{ backgroundColor: "rgba(0,19,55,0.03)", border: "1px solid rgba(0,19,55,0.08)" }}>
              {!interesse ? (
                <>
                  <h3 className="text-lg font-bold mb-2" style={{ fontFamily: "var(--font-playfair)", color: "#001337" }}>
                    Interesse aangeven
                  </h3>
                  <p className="text-xs text-gray-400 mb-5" style={{ fontFamily: "var(--font-inter)" }}>
                    Stuur direct een bericht over deze auto — merk, bouwjaar en prijs staan er al in. Wij reageren binnen 24 uur.
                  </p>
                  <div className="flex flex-col gap-3">
                    <a
                      href={interesseMail}
                      onClick={() => setTimeout(() => setInteresse(true), 500)}
                      className="flex items-center justify-center gap-2 w-full py-3.5 rounded-none text-sm font-semibold transition-all hover:opacity-90"
                      style={{ backgroundColor: "#001337", color: "#ffffff", fontFamily: "var(--font-inter)" }}
                    >
                      <Mail size={14} />
                      Stuur interesse-mail
                      <ArrowRight size={14} />
                    </a>
                    <a
                      href={`https://wa.me/${WHATSAPP_NUMMER}?text=${whatsappBericht}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3.5 rounded-none text-sm font-semibold transition-all hover:opacity-90"
                      style={{ backgroundColor: "#ffffff", color: "#001337", border: "1px solid rgba(0,19,55,0.15)", fontFamily: "var(--font-inter)" }}
                    >
                      {/* Officieel WhatsApp-logo (Simple Icons, CC0), zelfde als de zwevende knop. */}
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="#25D366" aria-hidden="true">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                      </svg>
                      Stuur een WhatsApp
                    </a>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center gap-3 text-center py-6">
                  <CheckCircle size={28} color="#001337" />
                  <p className="text-sm font-semibold" style={{ color: "#001337", fontFamily: "var(--font-playfair)" }}>E-mailclient geopend!</p>
                  <p className="text-xs text-gray-400" style={{ fontFamily: "var(--font-inter)" }}>We nemen zo snel mogelijk contact op.</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
