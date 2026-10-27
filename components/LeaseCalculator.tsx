"use client";

import { useState } from "react";
import { preconnect } from "react-dom";

// In Lease Auto's lease-calculator (zelfde dealer als op de auto-pagina's).
// Gedeeld door /financial-lease en /diensten/financiering zodat beide nooit uit elkaar lopen.
const INLEASE_DEALER_ID = "13504";
const INLEASE_ORIGIN = "https://calculator.inleaseautos.nl";

export default function LeaseCalculator({ paginaUrl }: { paginaUrl: string }) {
  const [calcLoaded, setCalcLoaded] = useState(false);

  // Warm de verbinding met de calculator-server alvast (DNS/TLS vooraf).
  preconnect(INLEASE_ORIGIN);

  const src = `${INLEASE_ORIGIN}/?dealer_id=${INLEASE_DEALER_ID}&ref=${encodeURIComponent(paginaUrl)}`;

  return (
    <>
      <div className="relative" style={{ minHeight: 975 }}>
        {!calcLoaded && (
          <div className="absolute inset-0 z-10 flex items-center justify-center" style={{ backgroundColor: "#ffffff", border: "1px solid rgba(0,19,55,0.08)" }}>
            <div className="flex flex-col items-center gap-3">
              <div className="w-6 h-6 rounded-full animate-spin" style={{ border: "2px solid rgba(0,19,55,0.15)", borderTopColor: "#001337" }} />
              <span className="text-xs" style={{ color: "rgba(0,19,55,0.4)", fontFamily: "var(--font-inter)" }}>Calculator laden…</span>
            </div>
          </div>
        )}
        <iframe
          src={src}
          title="Lease calculator — In Lease Auto's"
          width="100%"
          height="975"
          onLoad={() => setCalcLoaded(true)}
          style={{ border: 0, borderRadius: 0, overflow: "hidden", display: "block", width: "100%" }}
          allowFullScreen
        />
      </div>
      <p className="text-[11px] mt-3 text-center" style={{ color: "rgba(0,19,55,0.35)", fontFamily: "var(--font-inter)" }}>
        Vrijblijvende berekening in samenwerking met In Lease Auto&apos;s. Aan deze indicatie kunnen geen rechten worden ontleend.
      </p>
    </>
  );
}
