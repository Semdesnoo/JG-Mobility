"use client";

import Link from "next/link";
import { Mail, MapPin, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#001337", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12 mb-10 md:mb-16 items-start">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="mb-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/JG Mobility Transparant.png"
                alt="JG Mobility"
                className="h-20 md:h-40 w-auto object-contain"
                style={{ filter: "brightness(0) invert(1)" }}
              />
            </div>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs" style={{ fontFamily: "var(--font-inter)" }}>
              Specialist in consignatie, inkoop en verkoop van premium auto&apos;s. Persoonlijk, transparant en betrouwbaar — vanuit Barendrecht.
            </p>
            <div className="flex gap-3 mt-6">
              {[
                { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>, href: "#", label: "Instagram" },
                { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>, href: "#", label: "Facebook" },
                {
                  icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.27 8.27 0 004.84 1.55V6.79a4.85 4.85 0 01-1.07-.1z"/></svg>,
                  href: "#",
                  label: "TikTok",
                },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  title={social.label}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                  style={{
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.4)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = "#ffffff";
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.4)";
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.1)";
                  }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigatie */}
          <div className="pt-0 md:pt-10">
            <h4 className="text-xs font-semibold tracking-widest uppercase mb-5" style={{ color: "#ffffff", fontFamily: "var(--font-inter)" }}>
              Navigatie
            </h4>
            <ul className="flex flex-col gap-3">
              {[
                { label: "Diensten", href: "/diensten" },
                { label: "Consignatie", href: "/consignatie" },
                { label: "Aanbod", href: "/aanbod" },
                { label: "Ons Verhaal", href: "/over-ons" },
                { label: "Contact", href: "/contact" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm transition-colors"
                    style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-inter)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Adres */}
          <div className="pt-0 md:pt-10">
            <h4 className="text-xs font-semibold tracking-widest uppercase mb-5" style={{ color: "#ffffff", fontFamily: "var(--font-inter)" }}>
              Adres
            </h4>
            <div className="flex items-start gap-3 mb-4">
              <MapPin size={14} style={{ color: "rgba(255,255,255,0.5)", marginTop: 2, flexShrink: 0 }} />
              <div>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-inter)" }}>Arnhemseweg 10a</p>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-inter)" }}>2994 LA Barendrecht</p>
                <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-inter)" }}>Zuid-Holland</p>
              </div>
            </div>
            <a
              href="mailto:info@jgmobility.nl"
              className="flex items-center gap-3 text-sm transition-colors"
              style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-inter)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
            >
              <Mail size={14} style={{ color: "rgba(255,255,255,0.5)" }} />
              info@jgmobility.nl
            </a>
          </div>

          {/* Openingstijden */}
          <div className="pt-0 md:pt-10">
            <h4 className="text-xs font-semibold tracking-widest uppercase mb-5" style={{ color: "#ffffff", fontFamily: "var(--font-inter)" }}>
              Openingstijden
            </h4>
            <div className="flex items-start gap-3">
              <Clock size={14} style={{ color: "rgba(255,255,255,0.5)", marginTop: 2, flexShrink: 0 }} />
              <ul className="flex flex-col gap-2">
                {[
                  { dag: "Ma t/m vr", tijd: "09:00 – 18:00" },
                  { dag: "Zaterdag", tijd: "10:00 – 17:00" },
                  { dag: "Zondag", tijd: "Op afspraak" },
                ].map((r) => (
                  <li key={r.dag} className="flex justify-between gap-4 text-xs" style={{ fontFamily: "var(--font-inter)" }}>
                    <span style={{ color: "rgba(255,255,255,0.4)" }}>{r.dag}</span>
                    <span style={{ color: "rgba(255,255,255,0.7)" }}>{r.tijd}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Kaart */}
        <a
          href="https://www.google.com/maps/place/JD+Automotive/@51.8598507,4.5113226,17z/data=!3m1!4b1!4m6!3m5!1s0x47c433eb642769f3:0xfa7987adb9abfa6e!8m2!3d51.8598474!4d4.5138975!16s%2Fg%2F11ywjsm022?entry=ttu"
          target="_blank"
          rel="noopener noreferrer"
          className="block mb-10 md:mb-16 relative overflow-hidden group"
          style={{ borderRadius: 0, height: "220px", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          {/* Wereldkaart SVG achtergrond in website-blauw */}
          <div className="absolute inset-0" style={{
            backgroundColor: "#001a45",
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 500'%3E%3Cpath fill='%23002060' d='M140 120 Q160 90 200 100 Q240 80 260 110 Q300 90 320 120 Q340 100 370 110 Q390 90 410 100 L420 140 Q400 160 380 150 Q360 170 340 155 Q310 175 290 160 Q260 180 230 165 Q200 185 170 170 Q150 160 140 140 Z M450 80 Q480 60 510 70 Q540 55 570 65 Q600 50 630 65 Q660 50 690 60 L700 95 Q670 115 640 100 Q610 120 580 105 Q550 125 520 110 Q490 130 460 115 Z M720 90 Q750 70 780 80 Q810 65 840 75 Q860 60 880 70 L890 100 Q870 120 845 108 Q820 125 795 112 Q768 130 742 117 Z M100 200 Q130 180 160 190 Q190 170 220 185 Q250 165 280 180 L290 215 Q260 235 230 220 Q200 240 170 225 Q140 245 110 230 Z M320 195 Q360 175 400 185 Q440 165 470 180 Q500 160 530 175 L535 210 Q505 230 475 215 Q445 235 415 220 Q382 240 352 225 Z M560 185 Q600 165 640 175 Q680 155 710 170 Q740 150 770 165 L775 200 Q745 220 715 205 Q685 225 655 210 Q622 230 592 215 Z M800 175 Q840 155 870 165 Q900 145 930 160 L935 195 Q905 215 875 200 Q845 220 815 205 Z M50 280 Q90 260 130 270 Q170 250 210 265 Q250 245 280 260 L285 295 Q255 315 225 300 Q195 320 165 305 Q135 325 105 310 Q75 330 52 315 Z M310 270 Q350 250 390 260 Q430 240 460 255 Q490 235 520 250 L525 285 Q495 305 465 290 Q435 310 405 295 Q372 315 342 300 Z M550 260 Q590 240 620 250 Q650 230 680 245 Q710 225 740 240 L745 275 Q715 295 685 280 Q655 300 625 285 Q595 305 565 290 Z M775 250 Q815 230 845 240 Q875 220 905 235 L910 268 Q880 288 850 273 Q820 293 792 278 Z'/%3E%3C/svg%3E")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }} />
          {/* Subtiele blauwe gradient overlay */}
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at center, rgba(0,32,96,0.4) 0%, rgba(0,19,55,0.7) 100%)",
          }} />
          {/* Hover overlay */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
            background: "radial-gradient(ellipse at center, rgba(255,255,255,0.05) 0%, transparent 70%)",
          }} />

          {/* Pin + tekst */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="flex flex-col items-center gap-3 px-10 py-6 text-center"
              style={{
                backgroundColor: "rgba(0,10,30,0.75)",
                border: "1px solid rgba(255,255,255,0.12)",
                backdropFilter: "blur(6px)",
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <div>
                <p className="text-sm font-bold text-white mb-1" style={{ fontFamily: "var(--font-playfair)" }}>
                  Barendrecht, Zuid-Holland
                </p>
                <p className="text-xs group-hover:text-white/70 transition-colors" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-inter)" }}>
                  Klik om te openen in Google Maps →
                </p>
              </div>
            </div>
          </div>
        </a>

        {/* Bottom */}
        <div
          className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.2)", fontFamily: "var(--font-inter)" }}
        >
          <span>© {new Date().getFullYear()} JG Mobility. Alle rechten voorbehouden.</span>
          <span>KvK: — &nbsp;·&nbsp; BTW: —</span>
        </div>
      </div>
    </footer>
  );
}
