"use client";

import { useState, useEffect, useRef } from "react";
import { Check, Loader2 } from "lucide-react";

/**
 * De aanvraag onderaan /financial-lease.
 *
 * Kort met opzet: vier verplichte velden, twee die mogen. Een ondernemer die op zijn werk
 * even tussendoor kijkt vult geen tien vakjes in, en wat er écht nodig is om te kunnen
 * rekenen — cijfers, looptijd, aanbetaling — komt in het telefoongesprek erna.
 *
 * Net als het inruilformulier controleert dit formulier het antwoord van de server voordat
 * het "gelukt" toont. Een ondernemer die denkt dat hij een aanvraag heeft lopen en twee
 * dagen zit te wachten op niets, komt niet terug.
 */

const veldStijl: React.CSSProperties = {
  backgroundColor: "#ffffff",
  border: "1px solid rgba(0,19,55,0.15)",
  color: "#001337",
  fontFamily: "var(--font-inter)",
};

// 16px (text-base) en niet kleiner: op een iPhone zoomt Safari het hele scherm in zodra
// je in een veld tikt dat kleiner dan 16px is, en daarna staat de pagina scheef.
const veldKlasse =
  "w-full px-4 py-3 text-base outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#001337]";

function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor: string }) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-xs font-semibold mb-1.5"
      style={{ color: "rgba(0,19,55,0.6)", fontFamily: "var(--font-inter)" }}
    >
      {children}
    </label>
  );
}

export default function FinancialLeaseFormulier() {
  const [naam, setNaam] = useState("");
  const [bedrijfsnaam, setBedrijfsnaam] = useState("");
  const [telefoon, setTelefoon] = useState("");
  const [email, setEmail] = useState("");
  const [voertuig, setVoertuig] = useState("");
  const [bericht, setBericht] = useState("");
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState("");
  const [klaar, setKlaar] = useState(false);
  const honeypot = useRef<HTMLInputElement>(null);
  // Na het versturen springt de aandacht naar de bevestiging, anders valt de focus terug
  // naar het begin van de pagina en hoort een schermlezergebruiker niets.
  const bevestiging = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (klaar) bevestiging.current?.focus();
  }, [klaar]);

  /**
   * Komt de bezoeker van een autopagina (?auto=Volkswagen Transporter), dan staat het
   * voertuig er al in.
   *
   * Bewust via window.location en niet met useSearchParams: die haak dwingt Next.js om
   * deze pagina pas in de browser te tekenen, en dan staat de uitleg erboven niet meer in
   * de HTML van de server. Dezelfde afweging als bij het merkfilter op /aanbod.
   */
  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("auto");
    if (param) setVoertuig(param.slice(0, 200));
  }, []);

  const versturen = async (e: React.FormEvent) => {
    e.preventDefault();
    setFout("");

    if (!naam.trim() || !bedrijfsnaam.trim() || !telefoon.trim() || !email.trim()) {
      setFout("Vul je naam, bedrijfsnaam, telefoonnummer en e-mailadres in.");
      return;
    }

    setBezig(true);
    try {
      const res = await fetch("/api/financial-lease", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          naam,
          bedrijfsnaam,
          telefoon,
          email,
          voertuig,
          bericht,
          website: honeypot.current?.value ?? "",
        }),
      });
      const data = await res.json().catch(() => null);

      // Wél kijken of het gelukt is voordat we "gelukt" zeggen.
      if (!res.ok || !data?.ok) {
        setFout(data?.error ?? "Het versturen lukte niet. Probeer het nog eens, of bel ons even.");
        return;
      }
      setKlaar(true);
    } catch {
      setFout("We konden je aanvraag niet versturen. Controleer je verbinding en probeer het nog eens.");
    } finally {
      setBezig(false);
    }
  };

  if (klaar) {
    return (
      <div
        ref={bevestiging}
        role="status"
        tabIndex={-1}
        className="p-8 rounded-none flex flex-col items-center text-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#001337]"
        style={{ backgroundColor: "rgba(0,19,55,0.03)", border: "1px solid rgba(0,19,55,0.08)" }}
      >
        <div className="w-12 h-12 rounded-none flex items-center justify-center" style={{ backgroundColor: "#001337" }}>
          <Check size={22} color="#ffffff" />
        </div>
        <h3 className="text-xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: "#001337" }}>
          Je aanvraag is binnen
        </h3>
        <p className="text-sm max-w-md" style={{ color: "rgba(0,19,55,0.55)", fontFamily: "var(--font-inter)" }}>
          Je krijgt een bevestiging per mail. We bellen je om door te nemen wat er mogelijk is
          {voertuig.trim() ? ` voor de ${voertuig.trim()}` : ""}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={versturen}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="lease-naam">Naam *</Label>
          <input
            id="lease-naam"
            value={naam}
            onChange={(e) => setNaam(e.target.value)}
            autoComplete="name"
            className={veldKlasse}
            style={veldStijl}
          />
        </div>
        <div>
          <Label htmlFor="lease-bedrijf">Bedrijfsnaam *</Label>
          <input
            id="lease-bedrijf"
            value={bedrijfsnaam}
            onChange={(e) => setBedrijfsnaam(e.target.value)}
            autoComplete="organization"
            placeholder="bijv. Jansen Installatietechniek"
            className={veldKlasse}
            style={veldStijl}
          />
        </div>
        <div>
          <Label htmlFor="lease-telefoon">Telefoonnummer *</Label>
          <input
            id="lease-telefoon"
            type="tel"
            value={telefoon}
            onChange={(e) => setTelefoon(e.target.value)}
            autoComplete="tel"
            placeholder="06 ..."
            className={veldKlasse}
            style={veldStijl}
          />
        </div>
        <div>
          <Label htmlFor="lease-email">E-mailadres *</Label>
          <input
            id="lease-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className={veldKlasse}
            style={veldStijl}
          />
        </div>
      </div>

      <div className="mb-4">
        <Label htmlFor="lease-voertuig">Gewenst voertuig (optioneel)</Label>
        <input
          id="lease-voertuig"
          value={voertuig}
          onChange={(e) => setVoertuig(e.target.value.slice(0, 200))}
          placeholder="bijv. Volkswagen Transporter — of een kenteken uit ons aanbod"
          className={veldKlasse}
          style={veldStijl}
        />
      </div>

      <div className="mb-6">
        <Label htmlFor="lease-bericht">Bericht (optioneel)</Label>
        <textarea
          id="lease-bericht"
          value={bericht}
          onChange={(e) => setBericht(e.target.value.slice(0, 2000))}
          rows={4}
          placeholder="Denk aan je gewenste looptijd, een aanbetaling die je in gedachten hebt, of hoe lang je onderneming bestaat."
          className="w-full px-4 py-3 text-base outline-none resize-y focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#001337]"
          style={veldStijl}
        />
      </div>

      {/* Onzichtbaar voor mensen, aantrekkelijk voor bots. */}
      <input ref={honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

      {fout && (
        <div
          role="alert"
          className="mb-4 px-4 py-3 text-sm"
          style={{ backgroundColor: "#fee2e2", border: "1px solid #fca5a5", color: "#b91c1c", fontFamily: "var(--font-inter)" }}
        >
          {fout}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={bezig}
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-none text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: "#001337", color: "#ffffff", fontFamily: "var(--font-inter)" }}
        >
          {bezig && <Loader2 size={14} className="animate-spin" />}
          {bezig ? "Versturen…" : "Vraag een leasevoorstel aan"}
        </button>
        <p className="text-xs max-w-xs" style={{ color: "rgba(0,19,55,0.65)", fontFamily: "var(--font-inter)" }}>
          We gebruiken je gegevens alleen om je leaseaanvraag te beantwoorden.
        </p>
      </div>
    </form>
  );
}
