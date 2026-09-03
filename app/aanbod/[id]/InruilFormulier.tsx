"use client";

import { useState, useEffect, useRef } from "react";
import { Check, Plus, X, Loader2 } from "lucide-react";
import type { Auto } from "@/lib/autos";
import { verkleinFoto } from "@/lib/foto-verkleinen";

/**
 * Inruilaanvraag bij een auto uit het aanbod.
 *
 * De bezoeker vult zijn eigen kenteken in, wij zoeken dat op bij de RDW en tonen wat we
 * vinden. Dat is niet alleen service: het scheelt Jimi het narekenen van een typefout, en
 * de klant ziet meteen dat hij de goede auto te pakken heeft.
 *
 * De aanvraag gaat naar /api/inruil en komt daar zowel per mail als in het
 * Aanvragen-overzicht van het dashboard terecht.
 *
 * LET OP BIJ WIJZIGEN
 * Dit formulier controleert het antwoord van de server voordat het "gelukt" toont. Twee
 * andere formulieren op deze site doen dat niet — die melden succes zonder te kijken of
 * het bericht is aangekomen. Hou dat hier zo: een klant die denkt dat hij zich gemeld
 * heeft terwijl er niets binnenkwam, komt niet terug om het nog eens te proberen.
 */

const MAX_FOTOS = 4;

type RdwStand =
  | { soort: "leeg" }
  | { soort: "bezig" }
  | { soort: "gevonden"; omschrijving: string }
  | { soort: "niet_gevonden" };

const veldStijl: React.CSSProperties = {
  backgroundColor: "#ffffff",
  border: "1px solid rgba(0,19,55,0.15)",
  color: "#001337",
  fontFamily: "var(--font-inter)",
};

function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
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

export default function InruilFormulier({ auto, autoUrl }: { auto: Auto; autoUrl: string }) {
  const [kenteken, setKenteken] = useState("");
  const [km, setKm] = useState("");
  const [bijzonderheden, setBijzonderheden] = useState("");
  const [naam, setNaam] = useState("");
  const [email, setEmail] = useState("");
  const [telefoon, setTelefoon] = useState("");
  const [fotos, setFotos] = useState<(File | null)[]>(Array(MAX_FOTOS).fill(null));
  const [rdw, setRdw] = useState<RdwStand>({ soort: "leeg" });
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

  // Kenteken opzoeken bij de RDW. Open data, geen sleutel nodig, rechtstreeks vanuit de
  // browser — precies wat elke kentekencheck-site doet.
  useEffect(() => {
    const schoon = kenteken.replace(/[^a-z0-9]/gi, "").toUpperCase();
    if (schoon.length < 6) {
      setRdw({ soort: "leeg" });
      return;
    }
    setRdw({ soort: "bezig" });
    const gestopt = { waarde: false };
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`https://opendata.rdw.nl/resource/m9d7-ebf2.json?kenteken=${schoon}`);
        const data = await res.json();
        if (gestopt.waarde) return;
        if (Array.isArray(data) && data.length > 0) {
          const v = data[0];
          const hoofdletter = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "");
          const jaar = v.datum_eerste_toelating ? String(v.datum_eerste_toelating).slice(0, 4) : "";
          const omschrijving = [hoofdletter(v.merk ?? ""), v.handelsbenaming ?? "", jaar]
            .filter(Boolean)
            .join(" ");
          setRdw({ soort: "gevonden", omschrijving });
        } else {
          setRdw({ soort: "niet_gevonden" });
        }
      } catch {
        // Ligt de RDW eruit, dan is dat geen reden om de aanvraag tegen te houden.
        if (!gestopt.waarde) setRdw({ soort: "leeg" });
      }
    }, 600);
    return () => {
      gestopt.waarde = true;
      clearTimeout(t);
    };
  }, [kenteken]);

  const kiesFoto = async (index: number, bestand: File | undefined) => {
    if (!bestand) return;
    setFout("");
    const klein = await verkleinFoto(bestand);
    setFotos((vorige) => vorige.map((f, i) => (i === index ? klein : f)));
  };

  const versturen = async (e: React.FormEvent) => {
    e.preventDefault();
    setFout("");

    if (!naam.trim() || !email.trim() || !kenteken.trim()) {
      setFout("Vul in elk geval je naam, e-mailadres en kenteken in.");
      return;
    }

    setBezig(true);
    try {
      const fd = new FormData();
      fd.append("kenteken", kenteken);
      fd.append("km", km);
      fd.append("bijzonderheden", bijzonderheden);
      fd.append("naam", naam);
      fd.append("email", email);
      fd.append("telefoon", telefoon);
      fd.append("mijnAuto", rdw.soort === "gevonden" ? rdw.omschrijving : "");
      fd.append("autoNaam", `${auto.merk} ${auto.model}`);
      fd.append("autoId", String(auto.id));
      fd.append("autoUrl", autoUrl);
      fd.append("website", honeypot.current?.value ?? "");
      fotos.forEach((f) => f && fd.append("fotos", f));

      const res = await fetch("/api/inruil", { method: "POST", body: fd });
      const data = await res.json().catch(() => null);

      // Wél kijken of het gelukt is voordat we "gelukt" zeggen.
      if (!res.ok || !data?.ok) {
        setFout(data?.error ?? "Het versturen lukte niet. Probeer het nog eens, of app ons even.");
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
      <div ref={bevestiging} role="status" tabIndex={-1} className="p-8 rounded-none flex flex-col items-center text-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#001337]" style={{ backgroundColor: "rgba(0,19,55,0.03)", border: "1px solid rgba(0,19,55,0.08)" }}>
        <div className="w-12 h-12 rounded-none flex items-center justify-center" style={{ backgroundColor: "#001337" }}>
          <Check size={22} color="#ffffff" />
        </div>
        <h3 className="text-xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: "#001337" }}>
          Je aanvraag is binnen
        </h3>
        <p className="text-sm max-w-md" style={{ color: "rgba(0,19,55,0.55)", fontFamily: "var(--font-inter)" }}>
          Jimi bekijkt je {rdw.soort === "gevonden" ? rdw.omschrijving : "auto"} en neemt contact met je op met een
          indicatie van de inruilwaarde bij deze {auto.merk} {auto.model}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={versturen} className="max-w-3xl">
      {/* ── Jouw auto ── */}
      <h3 className="text-lg font-bold mb-5" style={{ fontFamily: "var(--font-playfair)", color: "#001337" }}>
        Jouw auto
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="inruil-kenteken">Kenteken *</Label>
          <div className="flex items-center gap-2">
            {/* De vertrouwde gele plaat met de blauwe EU-strook. */}
            <div className="flex items-stretch flex-1 min-w-0 rounded-none overflow-hidden" style={{ border: "1px solid rgba(0,19,55,0.25)" }}>
              <div className="flex flex-col items-center justify-center px-1.5 flex-shrink-0" style={{ backgroundColor: "#0b3ca8", width: 26 }}>
                <span className="text-[7px] font-bold leading-none" style={{ color: "#f7d117" }}>★★★</span>
                <span className="text-[9px] font-bold leading-none mt-0.5 text-white">NL</span>
              </div>
              <input
                id="inruil-kenteken"
                value={kenteken}
                onChange={(e) => setKenteken(e.target.value.toUpperCase().slice(0, 10))}
                placeholder="AB-123-C"
                autoComplete="off"
                className="flex-1 min-w-0 px-3 py-2.5 text-base font-bold tracking-widest uppercase outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#001337]"
                style={{ backgroundColor: "#f7d117", color: "#001337", fontFamily: "var(--font-inter)" }}
              />
            </div>
            {rdw.soort === "bezig" && <Loader2 size={16} className="animate-spin flex-shrink-0" style={{ color: "rgba(0,19,55,0.4)" }} />}
            {rdw.soort === "gevonden" && <Check size={18} className="flex-shrink-0" style={{ color: "#15803d" }} />}
          </div>
          <p className="text-[11px] mt-1.5" style={{ fontFamily: "var(--font-inter)", color: rdw.soort === "niet_gevonden" ? "#b45309" : "rgba(0,19,55,0.65)" }}>
            {rdw.soort === "gevonden"
              ? rdw.omschrijving
              : rdw.soort === "niet_gevonden"
                ? "Dit kenteken vinden we niet bij de RDW — je kunt gewoon doorgaan."
                : "We zoeken je auto er automatisch bij."}
          </p>
        </div>

        <div>
          <Label htmlFor="inruil-km">Kilometerstand (schatting)</Label>
          <input
            id="inruil-km"
            value={km}
            onChange={(e) => setKm(e.target.value.replace(/\D/g, "").slice(0, 7))}
            inputMode="numeric"
            placeholder="bijv. 145000"
            className="w-full px-4 py-2.5 text-base sm:text-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#001337]"
            style={veldStijl}
          />
        </div>
      </div>

      <div className="mb-4">
        <Label>Foto&apos;s van je auto (optioneel)</Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {fotos.map((foto, i) => (
            <div key={i} className="relative">
              {/* sr-only in plaats van hidden: display:none haalt het veld uit de
                  tabvolgorde, en dan is het vak met het toetsenbord onbereikbaar. */}
              <label
                className="flex flex-col items-center justify-center gap-1 h-24 cursor-pointer transition-all hover:opacity-80 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#001337]"
                style={{
                  border: foto ? "1px solid #001337" : "1px dashed rgba(0,19,55,0.25)",
                  backgroundColor: foto ? "rgba(0,19,55,0.04)" : "#ffffff",
                }}
              >
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  aria-label={`Foto ${i + 1} van je auto kiezen`}
                  className="sr-only"
                  onChange={(e) => {
                    kiesFoto(i, e.target.files?.[0]);
                    // Leegmaken, anders vuurt onChange niet als je hetzelfde bestand
                    // opnieuw kiest nadat je het hebt verwijderd.
                    e.target.value = "";
                  }}
                />
                {foto ? (
                  <>
                    <Check size={16} style={{ color: "#15803d" }} />
                    <span className="text-[10px] px-2 text-center truncate w-full" style={{ color: "#001337", fontFamily: "var(--font-inter)" }}>
                      {Math.round(foto.size / 1024)} kB
                    </span>
                  </>
                ) : (
                  <>
                    <Plus size={16} style={{ color: "rgba(0,19,55,0.35)" }} />
                    <span className="text-[10px]" style={{ color: "rgba(0,19,55,0.45)", fontFamily: "var(--font-inter)" }}>
                      Foto {i + 1}
                    </span>
                  </>
                )}
              </label>
              {foto && (
                <button
                  type="button"
                  onClick={() => setFotos((v) => v.map((f, j) => (j === i ? null : f)))}
                  aria-label={`Foto ${i + 1} verwijderen`}
                  className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center rounded-none"
                  style={{ backgroundColor: "#001337" }}
                >
                  <X size={12} color="#ffffff" />
                </button>
              )}
            </div>
          ))}
        </div>
        <p className="text-xs mt-2" style={{ color: "rgba(0,19,55,0.65)", fontFamily: "var(--font-inter)" }}>
          JPG of PNG. Te grote foto&apos;s worden automatisch verkleind voor het versturen.
        </p>
      </div>

      <div className="mb-8">
        <Label htmlFor="inruil-bijzonderheden">Bijzonderheden (optioneel)</Label>
        <textarea
          id="inruil-bijzonderheden"
          value={bijzonderheden}
          onChange={(e) => setBijzonderheden(e.target.value.slice(0, 2000))}
          rows={4}
          placeholder="Denk aan panoramadak, trekhaak of lichtmetalen velgen — maar ook aan eventuele schade."
          className="w-full px-4 py-3 text-base sm:text-sm outline-none resize-y focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#001337]"
          style={veldStijl}
        />
      </div>

      {/* ── Contactgegevens ── */}
      <h3 className="text-lg font-bold mb-5" style={{ fontFamily: "var(--font-playfair)", color: "#001337" }}>
        Jouw gegevens
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div>
          <Label htmlFor="inruil-naam">Naam *</Label>
          <input id="inruil-naam" value={naam} onChange={(e) => setNaam(e.target.value)} autoComplete="name" className="w-full px-4 py-2.5 text-base sm:text-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#001337]" style={veldStijl} />
        </div>
        <div>
          <Label htmlFor="inruil-email">E-mailadres *</Label>
          <input id="inruil-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className="w-full px-4 py-2.5 text-base sm:text-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#001337]" style={veldStijl} />
        </div>
        <div>
          <Label htmlFor="inruil-telefoon">Telefoonnummer</Label>
          <input id="inruil-telefoon" type="tel" value={telefoon} onChange={(e) => setTelefoon(e.target.value)} autoComplete="tel" placeholder="+31 6 ..." className="w-full px-4 py-2.5 text-base sm:text-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#001337]" style={veldStijl} />
        </div>
      </div>

      {/* Onzichtbaar voor mensen, aantrekkelijk voor bots. */}
      <input ref={honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

      {fout && (
        <div role="alert" className="mb-4 px-4 py-3 text-sm" style={{ backgroundColor: "#fee2e2", border: "1px solid #fca5a5", color: "#b91c1c", fontFamily: "var(--font-inter)" }}>
          {fout}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={bezig}
          className="flex items-center gap-2 px-8 py-3.5 rounded-none text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: "#001337", color: "#ffffff", fontFamily: "var(--font-inter)" }}
        >
          {bezig && <Loader2 size={14} className="animate-spin" />}
          {bezig ? "Versturen…" : "Aanvraag versturen"}
        </button>
        <p className="text-xs max-w-xs" style={{ color: "rgba(0,19,55,0.65)", fontFamily: "var(--font-inter)" }}>
          We gebruiken je gegevens alleen om je inruilaanvraag te beantwoorden.
        </p>
      </div>
    </form>
  );
}
