/**
 * Zwevende WhatsApp-knop rechtsonder.
 *
 * WAAROM HIER GEEN CHATVENSTER MEER ZIT
 * Op deze plek stond een nagebouwd chatgesprek met vaste antwoorden. Dat leidde je via
 * keuzeknopjes naar "Open WhatsApp" en "Nu bellen" — maar het nummer daarachter was nooit
 * ingevuld: WHATSAPP_NUMBER stond op "31" en PHONE_NUMBER op een lege tekst. Wie het hele
 * gesprek doorliep kwam dus op wa.me/31 uit, oftewel nergens. Eén tik die meteen in het
 * gesprek met Jimi eindigt is eerlijker dan een bot die je een rondje laat lopen.
 *
 * Dit is bewust geen client-component: het is een gewone link, dus er hoeft geen regel
 * JavaScript voor naar de browser.
 */

"use client";

import { useEffect, useState } from "react";

// Zelfde nummer als achter alle tel:-links op de site. Internationaal, zonder + of
// spaties — zo wil wa.me het hebben.
const WHATSAPP_NUMMER = "31621331374";

export default function WhatsAppKnop() {
  // Verberg de knop zodra het mobiele menu open is. De Header zet een
  // data-attribuut op <body> zodra 'menuOpen' aan staat; wij lezen dat hier
  // en renderen niets terwijl het er staat. Een korte animatie houdt het
  // natuurlijk — geen abrupte pop.
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const check = () => setMenuOpen(document.body.hasAttribute("data-menu-open"));
    check();
    // Observer voor het geval een ander component het attribuut vanuit een
    // ander deel van de boom zet — wij gebruiken alleen de Header, maar dit
    // maakt de koppeling robuust tegen toekomstige wijzigingen.
    const observer = new MutationObserver(check);
    observer.observe(document.body, { attributes: true, attributeFilter: ["data-menu-open"] });
    return () => observer.disconnect();
  }, []);

  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMMER}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Stuur Jimi een WhatsApp-bericht"
      title="WhatsApp Jimi"
      aria-hidden={menuOpen || undefined}
      tabIndex={menuOpen ? -1 : undefined}
      className="fixed bottom-4 right-4 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-200 hover:scale-110"
      style={{
        backgroundColor: "#ffffff",
        opacity: menuOpen ? 0 : 1,
        pointerEvents: menuOpen ? "none" : "auto",
        transform: menuOpen ? "translateY(8px)" : "translateY(0)",
      }}
    >
      {/* Het officiële WhatsApp-logo (Simple Icons, CC0) in de merkkleur. */}
      <svg width="26" height="26" viewBox="0 0 24 24" fill="#25D366" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
      </svg>
    </a>
  );
}
