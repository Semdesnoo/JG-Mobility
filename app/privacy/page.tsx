import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy- & cookieverklaring",
  description:
    "Hoe JG Mobility omgaat met je persoonsgegevens: welke gegevens de formulieren versturen, wie ze verwerkt, hoe lang we ze bewaren en welke rechten je hebt.",
  alternates: { canonical: "https://www.jgmobility.nl/privacy" },
  robots: {
    index: true,
    follow: true,
  },
};

/**
 * Privacy- & cookieverklaring.
 *
 * WAT HIER WEL EN NIET IN STAAT
 * Alles hieronder is afgeleid van wat de site daadwerkelijk doet: de velden die de
 * formulieren versturen (`app/api/contact/route.ts` en `lib/auto-aanvraag.ts`), de
 * partijen die daarbij betrokken zijn (Resend voor de mail, Vercel voor hosting,
 * statistiek en foto-opslag, Neon voor de database) en de meetinstrumenten die in
 * `app/layout.tsx` staan. Verandert een formulier of komt er een dienst bij, dan moet
 * deze pagina mee.
 *
 * TE BEVESTIGEN DOOR JG MOBILITY
 * De bewaartermijnen hieronder volgen de wettelijke administratieplicht (7 jaar) en
 * zijn voor de rest op "zo kort als nodig" gezet. Wie een afwijkende termijn
 * afspreekt, past dat hier aan. Hetzelfde geldt voor de verwerkersovereenkomsten met
 * de genoemde leveranciers: die worden per leverancier afgesloten en zijn niet iets
 * dat deze pagina kan vaststellen.
 */

const LAATST_BIJGEWERKT = "1 oktober 2026";

const kop = {
  fontFamily: "var(--font-playfair)",
  color: "#001337",
};

const tekst = {
  fontFamily: "var(--font-inter)",
  color: "rgba(0,19,55,0.65)",
};

function Sectie({ titel, children }: { titel: string; children: React.ReactNode }) {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-4" style={kop}>
        {titel}
      </h2>
      <div className="flex flex-col gap-4 text-sm leading-loose" style={tekst}>
        {children}
      </div>
    </div>
  );
}

function Lijst({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-sm leading-relaxed" style={tekst}>
          <span className="mt-1.5 w-1.5 h-1.5 flex-shrink-0" style={{ backgroundColor: "#001337" }} />
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function PrivacyPage() {
  // Google Analytics staat alleen op de site als NEXT_PUBLIC_GA_ID gezet is (zie
  // app/layout.tsx). Staat het niet aan, dan hoort er ook geen alinea over te staan:
  // een verklaring die cookies beschrijft die er niet zijn, is onjuist.
  const googleAnalyticsActief = Boolean(process.env.NEXT_PUBLIC_GA_ID);

  return (
    <>
      {/* Hero */}
      <div className="relative pt-28 md:pt-52 pb-16 px-6 overflow-hidden" style={{ backgroundColor: "#001337" }}>
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 50% 80% at 20% 50%, rgba(255,255,255,0.06) 0%, transparent 70%)" }} />
        <div className="relative max-w-3xl mx-auto">
          <p className="text-xs tracking-widest uppercase mb-3" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-inter)" }}>
            Juridisch
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white" style={{ fontFamily: "var(--font-playfair)" }}>
            Privacy- &amp; cookieverklaring
          </h1>
          <p className="mt-5 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)", fontFamily: "var(--font-inter)" }}>
            Laatst bijgewerkt: {LAATST_BIJGEWERKT}
          </p>
        </div>
      </div>

      <section className="py-20 px-6" style={{ backgroundColor: "#ffffff" }}>
        <div className="max-w-3xl mx-auto">

          <Sectie titel="Wie verwerkt je gegevens?">
            <p>
              JG Mobility is verantwoordelijk voor de verwerking van persoonsgegevens zoals
              beschreven in deze verklaring. Wij houden ons daarbij aan de Algemene verordening
              gegevensbescherming (AVG).
            </p>
            <div
              className="p-6"
              style={{ border: "1px solid rgba(0,19,55,0.1)", backgroundColor: "#fafafa" }}
            >
              <p className="text-sm font-semibold mb-1" style={{ color: "#001337", fontFamily: "var(--font-inter)" }}>
                JG Mobility
              </p>
              <p className="text-sm" style={tekst}>Arnhemseweg 10a, 2994 LA Barendrecht</p>
              <p className="text-sm" style={tekst}>KvK 42042275 · BTW NL005450398B70</p>
              <p className="text-sm mt-2" style={tekst}>
                <a href="mailto:info@jgmobility.nl" className="font-semibold hover:opacity-70 transition-opacity" style={{ color: "#001337" }}>
                  info@jgmobility.nl
                </a>
                {" · "}
                <a href="tel:+31621331374" className="font-semibold hover:opacity-70 transition-opacity" style={{ color: "#001337" }}>
                  06-21331374
                </a>
              </p>
            </div>
          </Sectie>

          <Sectie titel="Welke gegevens we ontvangen en waarom">
            <p>
              Wij verzamelen geen gegevens die je ons niet zelf geeft. Alles hieronder komt uit
              een formulier dat je invult of uit een bericht dat je stuurt.
            </p>

            <p className="font-semibold" style={{ color: "#001337" }}>Contactformulier</p>
            <Lijst
              items={[
                "Naam, telefoonnummer, e-mailadres en je bericht",
                "Doel: je vraag beantwoorden en contact met je opnemen",
                "Grondslag: uitvoering van de overeenkomst of ons gerechtvaardigd belang om op een vraag te reageren",
              ]}
            />

            <p className="font-semibold mt-4" style={{ color: "#001337" }}>Afspraak plannen</p>
            <Lijst
              items={[
                "E-mailadres, telefoonnummer en de gekozen datum en tijd",
                "Doel: de afspraak inplannen en bevestigen",
              ]}
            />

            <p className="font-semibold mt-4" style={{ color: "#001337" }}>Taxatie- en inruilaanvraag</p>
            <Lijst
              items={[
                "Naam, e-mailadres, telefoonnummer, het kenteken van je auto en eventuele foto's en opmerkingen",
                "Doel: de waarde van je auto bepalen en een voorstel doen",
                "Een kenteken zegt iets over een voertuig, maar in combinatie met jouw naam behandelen wij het als persoonsgegeven",
              ]}
            />

            <p className="font-semibold mt-4" style={{ color: "#001337" }}>Consignatieformulier</p>
            <Lijst
              items={[
                "Naam, e-mailadres, telefoonnummer, gegevens en foto's van je auto, gewenste vraagprijs en opmerkingen",
                "Doel: beoordelen of wij je auto in consignatie kunnen nemen en contact met je opnemen",
                "De aanvraag en de meegestuurde foto's worden opgeslagen zodat wij hem later kunnen terugvinden",
              ]}
            />
          </Sectie>

          <Sectie titel="Wie je gegevens voor ons verwerkt">
            <p>
              Wij schakelen een aantal leveranciers in om de site te laten werken en de
              formulieren bij ons te krijgen. Zij mogen je gegevens alleen gebruiken voor de
              opdracht die wij hun geven.
            </p>
            <Lijst
              items={[
                "Resend — bezorgt de e-mails die uit de formulieren komen, inclusief de bevestiging aan jou",
                "Vercel — hosting van deze website, opslag van de foto's die je meestuurt, en de statistieken die hieronder beschreven staan",
                "Neon — de database waarin aanvragen worden bewaard zodat wij ze kunnen opvolgen",
              ]}
            />
            <p>
              Verder geven wij je gegevens niet aan anderen, tenzij dat nodig is om je verzoek
              uit te voeren (bijvoorbeeld een financieringsaanvraag die je ons vraagt in te
              dienen) of wanneer de wet ons daartoe verplicht. Wij verkopen geen gegevens en
              gebruiken ze niet voor advertenties.
            </p>
          </Sectie>

          <Sectie titel="Cookies en statistieken">
            <p>
              Voor het meten van bezoek gebruiken wij Vercel Analytics en Vercel Speed Insights.
              Die werken zonder cookies: ze plaatsen niets op je apparaat en bouwen geen profiel
              van je op. Wij zien daarmee hoeveel mensen een pagina bekijken en hoe snel de site
              laadt, niet wie je bent.
            </p>
            <p>
              De kaart op de contact- en over-ons-pagina wordt geladen van Google Maps. Zodra je
              die kaart in beeld krijgt, kan Google je IP-adres en browsergegevens ontvangen; daar
              geldt het privacybeleid van Google voor.
            </p>
            {googleAnalyticsActief ? (
              <p>
                Op deze site staat daarnaast Google Analytics 4 aan. Dat plaatst wél cookies en
                meet hoe bezoekers de site gebruiken. Wil je dat niet, dan kun je cookies in je
                browser blokkeren of de Google Analytics opt-out-browserextensie gebruiken.
              </p>
            ) : (
              <p>
                Google Analytics staat op deze site uit. Zou dat veranderen, dan vermeldt deze
                pagina dat hier — en dan plaatsen we wél cookies, waarover je op dat moment
                geïnformeerd wordt.
              </p>
            )}
          </Sectie>

          <Sectie titel="Hoe lang we je gegevens bewaren">
            <Lijst
              items={[
                "Vragen en berichten waaruit geen afspraak of koop volgt: niet langer dan nodig om ze af te handelen, en daarna maximaal twee jaar",
                "Taxatie-, inruil- en consignatieaanvragen: zolang het dossier loopt en daarna maximaal twee jaar, zodat wij een eerder voorstel kunnen terugvinden",
                "Gegevens die bij een koop of verkoop horen: zeven jaar, omdat de Belastingdienst die bewaartermijn voor onze administratie voorschrijft",
                "Je kunt ons altijd vragen je gegevens eerder te verwijderen — zie hieronder",
              ]}
            />
          </Sectie>

          <Sectie titel="Je rechten">
            <p>Je hebt op grond van de AVG het recht om:</p>
            <Lijst
              items={[
                "je gegevens in te zien en een kopie op te vragen",
                "onjuiste gegevens te laten corrigeren of aanvullen",
                "je gegevens te laten verwijderen",
                "de verwerking te laten beperken",
                "bezwaar te maken tegen de verwerking",
                "je gegevens in een overdraagbaar formaat te ontvangen",
                "een eerder gegeven toestemming in te trekken",
              ]}
            />
            <p>
              Stuur je verzoek naar{" "}
              <a href="mailto:info@jgmobility.nl" className="font-semibold hover:opacity-70 transition-opacity" style={{ color: "#001337" }}>
                info@jgmobility.nl
              </a>
              . Wij reageren binnen een maand. Om te voorkomen dat wij gegevens aan de verkeerde
              persoon geven, kunnen wij je vragen je verzoek te doen vanaf het e-mailadres dat je
              bij ons gebruikte.
            </p>
          </Sectie>

          <Sectie titel="Klacht over hoe wij met je gegevens omgaan">
            <p>
              Ben je niet tevreden over hoe wij je verzoek behandelen? Laat het ons weten, dan
              zoeken we het samen uit. Je hebt daarnaast altijd het recht een klacht in te dienen
              bij de Autoriteit Persoonsgegevens, de Nederlandse privacytoezichthouder, via{" "}
              <a
                href="https://www.autoriteitpersoonsgegevens.nl/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold hover:opacity-70 transition-opacity"
                style={{ color: "#001337" }}
              >
                autoriteitpersoonsgegevens.nl
              </a>
              .
            </p>
          </Sectie>

          <Sectie titel="Beveiliging en wijzigingen">
            <p>
              De site werkt volledig via een versleutelde verbinding (https) en toegang tot
              aanvragen is beperkt tot JG Mobility. Merk je dat gegevens niet goed beveiligd zijn
              of zie je misbruik? Neem dan contact met ons op.
            </p>
            <p>
              Deze verklaring kan wijzigen, bijvoorbeeld wanneer de site een nieuw formulier
              krijgt. De datum bovenaan laat zien wanneer de laatste wijziging is doorgevoerd.
            </p>
          </Sectie>

          <div className="pt-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 text-sm font-semibold transition-all hover:opacity-90"
              style={{ backgroundColor: "#001337", color: "#ffffff", fontFamily: "var(--font-inter)" }}
            >
              Vraag over je gegevens? Neem contact op
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
