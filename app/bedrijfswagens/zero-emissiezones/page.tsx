import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calendar, ExternalLink, Info, MapPin } from "lucide-react";
import AnimateOnScroll from "@/components/AnimateOnScroll";

const siteUrl = "https://www.jgmobility.nl";
const zesUrl = "https://www.opwegnaarzes.nl";

/**
 * Uitleg over de zero-emissiezones voor bestelauto's.
 *
 * WAAROM DEZE PAGINA ZO VOORZICHTIG GEFORMULEERD IS
 * De regels zijn landelijk afgesproken maar worden per gemeente ingevoerd, en de
 * overgangsregeling hangt af van de emissieklasse én de datum eerste toelating van het
 * voertuig. Dat betekent dat er geen enkel antwoord bestaat dat voor iedereen klopt, en
 * dat wat vandaag klopt over twee jaar achterhaald kan zijn. Een autobedrijf dat hier
 * harde data neerzet, geeft iemand die net een bus heeft gekocht een verkeerd beeld.
 *
 * Daarom staat op deze pagina hoe het systeem wérkt, met bij elk jaartal een voorbehoud,
 * en verwijst elke sectie door naar opwegnaarzes.nl — de officiële voorlichtingssite waar
 * per gemeente de actuele regels en de ontheffingen staan. Geen bedragen, geen
 * boetehoogtes en geen beloftes over welke bus straks nog waar mag komen.
 *
 * Er wordt hier bewust geen kentekencheck nagebouwd: wie dat wil doen hoort dat te doen
 * op de site die er over gaat, met de gegevens die daar actueel zijn.
 */

export const metadata: Metadata = {
  title: "Zero-emissiezones voor bestelauto's — wat betekent dit?",
  description:
    "Sinds 1 januari 2025 hebben meerdere gemeenten, waaronder Rotterdam, een zero-emissiezone voor bestelauto's. Uitleg over de overgangsregeling, emissieklassen en ontheffingen.",
  keywords: [
    "zero-emissiezone bestelauto",
    "zero-emissiezone Rotterdam",
    "milieuzone bestelbus",
    "overgangsregeling zero-emissiezone",
    "bedrijfswagen kopen Barendrecht",
    "JG Mobility",
  ],
  alternates: { canonical: `${siteUrl}/bedrijfswagens/zero-emissiezones` },
  openGraph: {
    title: "Zero-emissiezones voor bestelauto's | JG Mobility",
    description:
      "Wat de zero-emissiezones betekenen voor een gebruikte bestelauto: de overgangsregeling, emissieklassen en waar u de actuele regels controleert.",
    url: `${siteUrl}/bedrijfswagens/zero-emissiezones`,
    type: "website",
  },
};

/**
 * De overgangsregeling in grote lijnen. De jaartallen staan er met opzet als "ongeveer"
 * bij: ze hangen af van de datum eerste toelating van het voertuig en kunnen per situatie
 * anders uitvallen. De regel eronder — vanaf 2030 alleen uitstootvrij — is het eindbeeld
 * waar de hele regeling naartoe werkt.
 */
const overgang = [
  {
    klasse: "Euro 5 en ouder",
    termijn: "Doorgaans tot ongeveer 2027",
    uitleg:
      "Voor bestelauto's met emissieklasse Euro 5 of lager geldt de kortste overgangstermijn. Hoe lang die in uw geval precies duurt, hangt af van de datum eerste toelating.",
  },
  {
    klasse: "Euro 6",
    termijn: "Doorgaans tot ongeveer 2028",
    uitleg:
      "Een Euro 6-bestelauto mag er in de meeste gevallen langer in. Ook hier bepaalt de datum eerste toelating het werkelijke eindpunt.",
  },
  {
    klasse: "Uitstootvrij",
    termijn: "Altijd welkom",
    uitleg:
      "Elektrische en andere uitstootvrije bestelauto's mogen de zones zonder beperking in. Vanaf 2030 is dat volgens de landelijke afspraken de enige categorie die nog overblijft.",
  },
];

export default function ZeroEmissiezonesPage() {
  return (
    <>
      {/* Hero */}
      <div className="relative pt-28 md:pt-52 pb-20 px-6 overflow-hidden" style={{ backgroundColor: "#001337" }}>
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 50% 80% at 20% 60%, rgba(255,255,255,0.04) 0%, transparent 70%)" }}
        />
        <div className="relative max-w-7xl mx-auto">
          <Link
            href="/bedrijfswagens"
            className="inline-flex items-center gap-2 text-xs tracking-widest uppercase mb-6 hover:opacity-70 transition-opacity"
            style={{ color: "#ffffff", fontFamily: "var(--font-inter)" }}
          >
            &larr; Bedrijfswagens
          </Link>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-5" style={{ fontFamily: "var(--font-playfair)" }}>
            Zero-emissiezones<br />voor bestelauto&apos;s
          </h1>
          <p className="text-sm md:text-base max-w-2xl" style={{ color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-inter)", lineHeight: 1.8 }}>
            Sinds 1 januari 2025 hebben verschillende Nederlandse gemeenten — waaronder Rotterdam —
            een zero-emissiezone voor bestelauto&apos;s. Hieronder leest u hoe de regeling in grote
            lijnen werkt en waar u kunt nagaan wat er voor uw voertuig en uw route geldt.
          </p>
        </div>
      </div>

      {/* De waarschuwing hoort bovenaan en niet in de voetnoot: wie hier komt neemt een
          aankoopbeslissing, en dan moet hij weten dat dit een uitleg is en geen besluit. */}
      <section className="py-10 px-6" style={{ backgroundColor: "#f5f5f5" }}>
        <div className="max-w-4xl mx-auto">
          <div className="p-5 md:p-6 flex items-start gap-4" style={{ backgroundColor: "#ffffff", border: "1px solid rgba(0,19,55,0.12)" }}>
            <span className="flex-shrink-0 mt-0.5" style={{ color: "#001337" }}>
              <Info size={18} />
            </span>
            <div>
              <p className="text-sm font-semibold mb-2" style={{ color: "#001337", fontFamily: "var(--font-inter)" }}>
                Controleer altijd de actuele regels op opwegnaarzes.nl
              </p>
              <p className="text-xs leading-relaxed mb-3" style={{ color: "rgba(0,19,55,0.6)", fontFamily: "var(--font-inter)" }}>
                De zones worden per gemeente ingevoerd en de regels en termijnen kunnen wijzigen. Wij
                zijn geen overheid en kunnen u geen uitsluitsel geven over uw voertuig of uw route.
                Op opwegnaarzes.nl — de officiële voorlichtingssite over de zero-emissiezones — vindt
                u per gemeente de actuele regels, de overgangstermijnen en de mogelijkheden voor
                ontheffing.
              </p>
              <a
                href={zesUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 text-xs tracking-widest uppercase font-semibold hover:opacity-70 transition-opacity"
                style={{ color: "#001337", fontFamily: "var(--font-inter)" }}
              >
                Naar opwegnaarzes.nl
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Wat het is */}
      <section className="py-16 px-6" style={{ backgroundColor: "#ffffff" }}>
        <div className="max-w-3xl mx-auto">
          <AnimateOnScroll>
            <p className="text-xs tracking-widest uppercase mb-3" style={{ color: "rgba(0,19,55,0.45)", fontFamily: "var(--font-inter)" }}>
              Waar gaat het over
            </p>
            <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ fontFamily: "var(--font-playfair)", color: "#001337" }}>
              Wat is een zero-emissiezone?
            </h2>
            <div className="flex flex-col gap-5 text-sm md:text-base" style={{ color: "rgba(0,19,55,0.65)", fontFamily: "var(--font-inter)", lineHeight: 1.9 }}>
              <p>
                Een zero-emissiezone is een afgebakend gebied in een stad waar op termijn alleen nog
                uitstootvrije bestel- en vrachtauto&apos;s mogen komen. Het is iets anders dan een
                milieuzone: een milieuzone sluit de oudste dieselvoertuigen uit, terwijl een
                zero-emissiezone uiteindelijk naar nul uitstoot gaat. Personenauto&apos;s vallen
                buiten deze zones.
              </p>
              <p>
                De eerste gemeenten zijn op 1 januari 2025 begonnen, waaronder Rotterdam. Welke
                gemeenten een zone hebben, waar die precies ligt en op welke tijden hij geldt,
                verschilt per stad — de gemeente stelt de zone zelf vast. Op opwegnaarzes.nl staat de
                actuele lijst met gemeenten en kaarten van de zones.
              </p>
              <p>
                Belangrijk voor wie nu een gebruikte bestelauto koopt: een bus die vandaag nog
                probleemloos de binnenstad in rijdt, kan dat door de overgangsregeling over een paar
                jaar niet meer. Dat is geen reden om geen diesel te kopen — het is wel een reden om
                vooraf te weten welke emissieklasse u koopt en waar u ermee komt.
              </p>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Overgangsregeling */}
      <section className="py-16 px-6" style={{ backgroundColor: "#f5f5f5" }}>
        <div className="max-w-5xl mx-auto">
          <AnimateOnScroll>
            <div className="mb-10">
              <p className="text-xs tracking-widest uppercase mb-3" style={{ color: "rgba(0,19,55,0.45)", fontFamily: "var(--font-inter)" }}>
                Niet van de ene op de andere dag
              </p>
              <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ fontFamily: "var(--font-playfair)", color: "#001337" }}>
                De overgangsregeling
              </h2>
              <p className="text-sm max-w-2xl leading-relaxed" style={{ color: "rgba(0,19,55,0.6)", fontFamily: "var(--font-inter)" }}>
                Bestaande bestelauto&apos;s mogen de zone na invoering nog een aantal jaren in. Hoe
                lang, hangt af van de emissieklasse van het voertuig en van de datum eerste toelating.
                De jaartallen hieronder zijn daarom een richting en geen toezegging.
              </p>
            </div>
          </AnimateOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {overgang.map((rij, i) => (
              <AnimateOnScroll key={rij.klasse} delay={i * 0.08}>
                <div className="p-5 h-full" style={{ backgroundColor: "#ffffff", border: "1px solid rgba(0,19,55,0.08)" }}>
                  <div
                    className="w-11 h-11 flex items-center justify-center mb-4"
                    style={{ backgroundColor: "#001337", color: "#ffffff" }}
                  >
                    <Calendar size={18} />
                  </div>
                  <h3 className="font-bold text-sm mb-1" style={{ color: "#001337", fontFamily: "var(--font-playfair)" }}>
                    {rij.klasse}
                  </h3>
                  <p className="text-xs font-semibold mb-3" style={{ color: "rgba(0,19,55,0.45)", fontFamily: "var(--font-inter)" }}>
                    {rij.termijn}
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(0,19,55,0.55)", fontFamily: "var(--font-inter)" }}>
                    {rij.uitleg}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
          <AnimateOnScroll delay={0.1}>
            <p className="text-xs mt-6 leading-relaxed" style={{ color: "rgba(0,19,55,0.5)", fontFamily: "var(--font-inter)" }}>
              Volgens de landelijke afspraken geldt vanaf 2030 dat in de zones alleen nog uitstootvrije
              bestel- en vrachtauto&apos;s welkom zijn. Wat er in de jaren daarvoor precies voor uw
              voertuig geldt, controleert u op{" "}
              <a
                href={zesUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline hover:opacity-70"
                style={{ color: "#001337" }}
              >
                opwegnaarzes.nl
              </a>
              .
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Ontheffingen */}
      <section className="py-16 px-6" style={{ backgroundColor: "#ffffff" }}>
        <div className="max-w-3xl mx-auto">
          <AnimateOnScroll>
            <p className="text-xs tracking-widest uppercase mb-3" style={{ color: "rgba(0,19,55,0.45)", fontFamily: "var(--font-inter)" }}>
              Uitzonderingen
            </p>
            <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ fontFamily: "var(--font-playfair)", color: "#001337" }}>
              Ontheffingen
            </h2>
            <div className="flex flex-col gap-5 text-sm md:text-base" style={{ color: "rgba(0,19,55,0.65)", fontFamily: "var(--font-inter)", lineHeight: 1.9 }}>
              <p>
                Naast de overgangsregeling bestaan er ontheffingen. Die zijn er in landelijke en in
                gemeentelijke vorm, en ze lopen van ontheffingen voor bijzondere voertuigen tot een
                beperkt aantal dagontheffingen per jaar voor wie de zone af en toe toch in moet.
              </p>
              <p>
                Welke ontheffing in uw situatie van toepassing is, of u ervoor in aanmerking komt en
                hoe u die aanvraagt, verschilt per regeling en per gemeente. Wij kunnen dat voor u
                niet beoordelen — op opwegnaarzes.nl staat per gemeente welke mogelijkheden er zijn
                en waar u de aanvraag doet.
              </p>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Wat u er bij ons aan merkt */}
      <section className="py-16 px-6" style={{ backgroundColor: "#f5f5f5" }}>
        <div className="max-w-3xl mx-auto">
          <AnimateOnScroll>
            <div className="p-6 md:p-8" style={{ backgroundColor: "#ffffff", border: "1px solid rgba(0,19,55,0.08)" }}>
              <div className="flex items-start gap-4">
                <span
                  className="w-11 h-11 flex-shrink-0 flex items-center justify-center"
                  style={{ backgroundColor: "#001337", color: "#ffffff" }}
                >
                  <MapPin size={18} />
                </span>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold mb-3" style={{ fontFamily: "var(--font-playfair)", color: "#001337" }}>
                    Waar u bij het kopen op let
                  </h2>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(0,19,55,0.6)", fontFamily: "var(--font-inter)" }}>
                    Vraag bij elke gebruikte bestelauto twee dingen na: de emissieklasse en de datum
                    eerste toelating. Met die twee gegevens kunt u op opwegnaarzes.nl zien wat er voor
                    het voertuig geldt. Weten wij de emissieklasse van een bus uit onze voorraad, dan
                    zetten we die erbij; staat hij er niet, vraag het ons dan — we zoeken het op.
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(0,19,55,0.6)", fontFamily: "var(--font-inter)" }}>
                    En kijk naar uw eigen werkgebied. Komt u nooit in een stad met een zone, dan is
                    een oudere diesel nog jaren een verstandige keuze. Rijdt u dagelijks de
                    Rotterdamse binnenstad in, dan weegt de emissieklasse zwaarder dan de kilometerprijs.
                  </p>
                </div>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center" style={{ backgroundColor: "#001337" }}>
        <AnimateOnScroll>
          <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "#ffffff", fontFamily: "var(--font-inter)" }}>
            Op zoek naar een bedrijfswagen?
          </p>
          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
            Bekijk onze bedrijfswagens
          </h2>
          <p className="text-sm mb-8 max-w-md mx-auto leading-relaxed" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-inter)" }}>
            Prijzen exclusief btw, financial lease mogelijk en inruil welkom. Twijfelt u of een bus
            bij uw werkgebied past? Bel ons, dan kijken we er samen naar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/bedrijfswagens"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-semibold transition-all hover:scale-105"
              style={{ backgroundColor: "#ffffff", color: "#001337", fontFamily: "var(--font-inter)" }}
            >
              Naar de bedrijfswagens <ArrowRight size={14} />
            </Link>
            <a
              href="tel:+31621331374"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-semibold transition-all hover:opacity-80"
              style={{ border: "1px solid rgba(255,255,255,0.2)", color: "#ffffff", fontFamily: "var(--font-inter)" }}
            >
              +31 6 21331374
            </a>
          </div>
        </AnimateOnScroll>
      </section>
    </>
  );
}
