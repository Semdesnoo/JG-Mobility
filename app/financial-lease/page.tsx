import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import FinancialLeaseFormulier from "./FinancialLeaseFormulier";

/**
 * Financial lease voor ondernemers.
 *
 * WAAROM DEZE PAGINA NAAST /diensten/financiering BESTAAT
 * Die pagina legt alle financieringsvormen naast elkaar en zet de calculator bovenaan.
 * Wie "financial lease bedrijfswagen" zoekt wil maar één van die vormen weten, en wil
 * vooral weten wat het voor zíjn onderneming betekent. Daarom staat hier de uitleg van
 * die ene vorm, met een kort formulier eronder in plaats van een calculator: wat een
 * ondernemer kan leasen hangt af van zijn cijfers, en dat gesprek gaat per telefoon.
 *
 * Deze pagina is een servercomponent: de uitleg hieronder staat dus in de HTML die Google
 * krijgt. Alleen het formulier is een client-component.
 */

const siteUrl = "https://www.jgmobility.nl";
const paginaUrl = `${siteUrl}/financial-lease`;

export const metadata: Metadata = {
  title: "Financial Lease Bedrijfswagen",
  description:
    "Financial lease voor ondernemers bij JG Mobility in Barendrecht. Je bedrijfswagen vanaf dag één op naam van je onderneming, btw verrekenbaar bij een BTW-voertuig. Vraag een vrijblijvend voorstel aan.",
  keywords: [
    "financial lease bedrijfswagen Barendrecht",
    "financial lease bedrijfswagen",
    "financial lease Barendrecht",
    "financial lease Rotterdam",
    "bestelbus financial lease",
    "zakelijk leasen Zuid-Holland",
    "JG Mobility",
  ],
  alternates: { canonical: paginaUrl },
  openGraph: {
    title: "Financial Lease Bedrijfswagen | JG Mobility",
    description:
      "Zakelijk een bedrijfswagen financieren via financial lease. Vanaf dag één op naam van je onderneming, btw verrekenbaar bij een BTW-voertuig. JG Mobility, Barendrecht.",
    url: paginaUrl,
  },
};

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
    { "@type": "ListItem", position: 2, name: "Financial Lease", item: paginaUrl },
  ],
};

const service = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Financial Lease Bedrijfswagen",
  description:
    "Financial lease voor ondernemers: het voertuig staat vanaf de eerste dag op naam van je onderneming en is na de laatste termijn volledig je eigendom. In samenwerking met In Lease Auto's.",
  provider: { "@type": "AutoDealer", name: "JG Mobility", url: siteUrl },
  areaServed: ["Barendrecht", "Rotterdam", "Ridderkerk", "Dordrecht", "Hendrik-Ido-Ambacht", "Spijkenisse", "Capelle aan den IJssel", "Zwijndrecht", "Zuid-Holland"],
  serviceType: "Financial Lease",
};

/** Hoe de vorm werkt. Vier dingen die een ondernemer vooraf wil weten. */
const uitleg = [
  {
    titel: "Vanaf dag één van je onderneming",
    tekst:
      "Het voertuig komt op naam van je bedrijf en op je balans te staan. Je rijdt er dus niet in als huurder: je bouwt eigendom op, en na de laatste termijn is hij juridisch helemaal van jou.",
  },
  {
    titel: "Btw verrekenbaar bij een BTW-voertuig",
    tekst:
      "Is het voertuig een BTW-voertuig, dan is de btw voor jou als ondernemer verrekenbaar en financier je het bedrag exclusief btw. Bij een margeauto valt er geen btw te verrekenen — dat staat bij elk voertuig in ons aanbod vermeld.",
  },
  {
    titel: "Looptijd die bij het voertuig past",
    tekst:
      "Looptijden van 12 tot 72 maanden zijn in de markt gebruikelijk. Wat voor jou kan hangt af van de leeftijd van het voertuig en van je aanvraag — dat hoor je van ons voordat je iets ondertekent.",
  },
  {
    titel: "Aanbetaling en slottermijn als stuur",
    tekst:
      "Met een aanbetaling vooraf en een slottermijn aan het eind bepaal je zelf je maandlast. Let op: een slottermijn verlaagt die maandlast, maar dat bedrag betaal je aan het eind in één keer.",
  },
];

/** Precies de punten die ook bij de calculator op de autopagina's staan — geen nieuwe beloftes. */
const voordelen = [
  "Uitslag binnen 24 uur",
  "Geen jaarcijfers nodig",
  "Geen kilometerbeperking",
  "Je wordt eigenaar van het voertuig",
];

const stappen = [
  {
    stap: "01",
    titel: "Laat je gegevens achter",
    tekst: "Vier velden: naam, bedrijfsnaam, telefoon en e-mail. Weet je al welk voertuig je wilt? Zet het erbij.",
  },
  {
    stap: "02",
    titel: "Wij dienen de aanvraag in",
    tekst: "Wij leggen je aanvraag voor aan In Lease Auto's, onze leasepartner. In de meeste gevallen heb je binnen 24 uur uitsluitsel.",
  },
  {
    stap: "03",
    titel: "Rijden en afschrijven",
    tekst: "Na ondertekening regelen wij de aflevering en het kenteken. Daarna rijdt je bedrijfswagen voor je — op naam van je onderneming.",
  },
];

export default function FinancialLeasePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }} />

      {/* Hero */}
      <div className="relative pt-28 md:pt-52 pb-16 md:pb-20 px-6 overflow-hidden" style={{ backgroundColor: "#001337" }}>
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 50% 80% at 20% 60%, rgba(255,255,255,0.04) 0%, transparent 70%)" }} />
        <div className="relative max-w-7xl mx-auto">
          <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-inter)" }}>
            Zakelijk financieren
          </p>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-5" style={{ fontFamily: "var(--font-playfair)" }}>
            Financial lease
          </h1>
          <p className="text-sm md:text-base max-w-xl" style={{ color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-inter)", lineHeight: 1.8 }}>
            Een bedrijfswagen of occasion zakelijk financieren zonder er in één keer je werkkapitaal
            aan kwijt te zijn. Je betaalt in termijnen, het voertuig staat vanaf dag één op naam van je
            onderneming. Wij verzorgen de aanvraag samen met In Lease Auto&apos;s.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <a
              href="#lease-aanvragen"
              className="flex items-center justify-center gap-2 py-4 px-6 rounded-none text-sm font-semibold transition-all hover:opacity-90"
              style={{ backgroundColor: "#ffffff", color: "#001337", fontFamily: "var(--font-inter)" }}
            >
              Vraag een leasevoorstel aan
              <ArrowRight size={14} />
            </a>
            <Link
              href="/bedrijfswagens"
              className="flex items-center justify-center gap-2 py-4 px-6 rounded-none text-sm font-semibold transition-all hover:bg-white/10"
              style={{ border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.8)", fontFamily: "var(--font-inter)" }}
            >
              Bekijk onze bedrijfswagens
            </Link>
          </div>
        </div>
      </div>

      {/* Hoe het werkt */}
      <section className="py-16 md:py-20 px-6" style={{ backgroundColor: "#ffffff" }}>
        <div className="max-w-5xl mx-auto">
          <AnimateOnScroll>
            <div className="mb-10">
              <p className="text-xs tracking-widest uppercase mb-3" style={{ color: "rgba(0,19,55,0.4)", fontFamily: "var(--font-inter)" }}>
                Voor ondernemers
              </p>
              <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ fontFamily: "var(--font-playfair)", color: "#001337" }}>
                Wat financial lease is
              </h2>
              <p className="text-sm max-w-2xl leading-relaxed" style={{ color: "rgba(0,19,55,0.65)", fontFamily: "var(--font-inter)" }}>
                Bij financial lease financiert een leasemaatschappij het voertuig en betaal jij in
                maandtermijnen. Het verschil met private lease of operational lease: dit is een
                financiering, geen huur. Onderhoud, verzekering en wegenbelasting regel je zelf —
                daardoor is de maandlast lager en kies je zelf bij wie je het onderhoud laat doen.
              </p>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {uitleg.map((u, i) => (
              <AnimateOnScroll key={u.titel} delay={i * 0.08}>
                <div className="p-6 rounded-none h-full" style={{ border: "1px solid rgba(0,19,55,0.08)", backgroundColor: "#fafafa" }}>
                  <h3 className="text-base font-bold mb-2" style={{ fontFamily: "var(--font-playfair)", color: "#001337" }}>
                    {u.titel}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(0,19,55,0.6)", fontFamily: "var(--font-inter)" }}>
                    {u.tekst}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Voordelen + stappen */}
      <section className="py-16 md:py-20 px-6" style={{ backgroundColor: "#001337" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <AnimateOnScroll direction="left">
            <div>
              <p className="text-xs tracking-widest uppercase mb-3" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-inter)" }}>
                Waarom ondernemers hiervoor kiezen
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6" style={{ fontFamily: "var(--font-playfair)", lineHeight: 1.2 }}>
                Je bus aan het werk,<br />je spaargeld op de bank.
              </h2>
              <div className="flex flex-col gap-4">
                {voordelen.map((punt) => (
                  <div key={punt} className="flex items-center gap-3">
                    <CheckCircle size={16} style={{ color: "rgba(255,255,255,0.4)", flexShrink: 0 }} />
                    <span className="text-sm" style={{ color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-inter)" }}>
                      {punt}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs mt-6 leading-relaxed" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-inter)" }}>
                Wil je eerst zelf rekenen? Op{" "}
                <Link href="/diensten/financiering" className="font-semibold underline hover:opacity-70" style={{ color: "rgba(255,255,255,0.7)" }}>
                  onze financieringspagina
                </Link>{" "}
                staat de calculator van In Lease Auto&apos;s. Aan die indicatie kunnen geen rechten worden ontleend.
              </p>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll direction="right">
            <div className="flex flex-col gap-4">
              {stappen.map((s) => (
                <div key={s.stap} className="flex items-start gap-5 p-5 rounded-none" style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <span className="text-2xl font-bold flex-shrink-0" style={{ fontFamily: "var(--font-playfair)", color: "rgba(255,255,255,0.15)" }}>
                    {s.stap}
                  </span>
                  <div>
                    <h3 className="font-bold mb-1 text-white" style={{ fontFamily: "var(--font-playfair)" }}>
                      {s.titel}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-inter)" }}>
                      {s.tekst}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Het formulier */}
      <section id="lease-aanvragen" className="py-16 px-6" style={{ backgroundColor: "#ffffff", borderTop: "1px solid rgba(0,19,55,0.06)" }}>
        <div className="max-w-3xl mx-auto">
          <AnimateOnScroll>
            <div className="mb-8">
              <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "rgba(0,19,55,0.45)", fontFamily: "var(--font-inter)" }}>
                Vrijblijvend
              </p>
              <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ fontFamily: "var(--font-playfair)", color: "#001337" }}>
                Vraag een leasevoorstel aan
              </h2>
              <p className="text-sm max-w-xl leading-relaxed" style={{ color: "rgba(0,19,55,0.65)", fontFamily: "var(--font-inter)" }}>
                Laat je gegevens achter, dan bellen we je om door te nemen wat er mogelijk is. Je
                krijgt meteen een bevestiging per mail, dus je weet dat je aanvraag binnen is.
              </p>
            </div>

            <FinancialLeaseFormulier />

            <p className="text-xs mt-8" style={{ color: "rgba(0,19,55,0.65)", fontFamily: "var(--font-inter)" }}>
              Liever even bellen of appen?{" "}
              <a href="tel:+31621331374" className="font-semibold underline hover:opacity-70" style={{ color: "#001337" }}>
                06-21331374
              </a>{" "}
              —{" "}
              <a
                href="https://wa.me/31621331374"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline hover:opacity-70"
                style={{ color: "#001337" }}
              >
                WhatsApp
              </a>
            </p>
          </AnimateOnScroll>
        </div>
      </section>
    </>
  );
}
