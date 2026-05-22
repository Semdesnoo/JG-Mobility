import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CheckCircle, Clock, MapPin, Phone, Shield, TrendingUp } from "lucide-react";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { steden, getStad } from "@/lib/steden";

const siteUrl = "https://www.jgmobility.nl";

export const revalidate = 2592000;

export async function generateStaticParams() {
  return steden.map((s) => ({ stad: s.slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ stad: string }>;
}): Promise<Metadata> {
  const { stad: slug } = await props.params;
  const stad = getStad(slug);
  if (!stad) return { title: "Niet gevonden" };

  return {
    title: `Auto Inkoop & Verkoop ${stad.naam} | JG Mobility Barendrecht`,
    description: `Auto verkopen in ${stad.naam}? JG Mobility in Barendrecht koopt uw auto direct in. Gratis taxatie, bod binnen 24 uur en directe betaling. Slechts ${stad.km} km van ${stad.naam}.`,
    keywords: [
      `auto inkoop ${stad.naam}`,
      `auto verkopen ${stad.naam}`,
      `auto taxatie ${stad.naam}`,
      `occasions ${stad.naam}`,
      `auto inkoop Barendrecht`,
      `auto verkopen Zuid-Holland`,
      `JG Mobility`,
    ],
    alternates: { canonical: `${siteUrl}/auto-inkoop/${stad.slug}` },
    openGraph: {
      title: `Auto Inkoop ${stad.naam} | JG Mobility`,
      description: `Uw auto verkopen in ${stad.naam}? Wij kopen hem direct in. Gratis taxatie, eerlijk bod binnen 24 uur.`,
      url: `${siteUrl}/auto-inkoop/${stad.slug}`,
      type: "website",
    },
  };
}

const stappen = [
  { step: "01", title: "Neem contact op", desc: "Bel, mail of stuur een bericht. Vertel ons het merk, model, bouwjaar en kilometerstand van uw auto." },
  { step: "02", title: "Gratis taxatie", desc: "Wij bepalen de marktwaarde op basis van actuele data en de staat van uw voertuig — snel en vrijblijvend." },
  { step: "03", title: "Bod binnen 24 uur", desc: "U ontvangt een eerlijk bod. Geen onderhandelingstactieken, geen verborgen kosten." },
  { step: "04", title: "Directe afhandeling", desc: "Akkoord? Wij regelen de overdracht, het kenteken en de betaling. Snel en professioneel." },
];

const voordelen = [
  { icon: <TrendingUp size={18} />, title: "Marktconforme prijs", desc: "Eerlijke waardering op basis van actuele marktdata en jarenlange ervaring." },
  { icon: <Clock size={18} />, title: "Bod binnen 24 uur", desc: "Geen weken wachten. U heeft een bod in handen voordat u het weet." },
  { icon: <Shield size={18} />, title: "Geen verplichtingen", desc: "Taxatie is volledig gratis en vrijblijvend." },
  { icon: <CheckCircle size={18} />, title: "Direct geld", desc: "Na akkoord wordt het bedrag direct overgemaakt — geen gedoe, geen vertraging." },
];

export default async function StadPage(props: {
  params: Promise<{ stad: string }>;
}) {
  const { stad: slug } = await props.params;
  const stad = getStad(slug);
  if (!stad) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["AutoDealer", "LocalBusiness"],
        "@id": `${siteUrl}/#organization`,
        name: "JG Mobility",
        url: siteUrl,
        telephone: "+31621331374",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Arnhemseweg 10a",
          addressLocality: "Barendrecht",
          postalCode: "2994 LA",
          addressRegion: "Zuid-Holland",
          addressCountry: "NL",
        },
        areaServed: { "@type": "City", name: stad.naam },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${siteUrl}/auto-inkoop/${stad.slug}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "Auto Inkoop", item: `${siteUrl}/diensten/inkoop-taxatie` },
          { "@type": "ListItem", position: 3, name: stad.naam, item: `${siteUrl}/auto-inkoop/${stad.slug}` },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <div className="relative pt-28 md:pt-52 pb-20 px-6 overflow-hidden" style={{ backgroundColor: "#001337" }}>
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 50% 80% at 20% 60%, rgba(255,255,255,0.04) 0%, transparent 70%)" }} />
        <div className="relative max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs tracking-widest uppercase mb-6" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-inter)" }}>
            <MapPin size={11} />
            <span>{stad.regio} · {stad.km} km van Barendrecht</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-5" style={{ fontFamily: "var(--font-playfair)" }}>
            Auto Inkoop<br />{stad.naam}
          </h1>
          <p className="text-sm md:text-base max-w-xl mb-8" style={{ color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-inter)", lineHeight: 1.8 }}>
            {stad.intro}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-semibold transition-all hover:scale-105"
              style={{ backgroundColor: "#ffffff", color: "#001337", fontFamily: "var(--font-inter)" }}
            >
              Gratis taxatie aanvragen <ArrowRight size={14} />
            </Link>
            <a
              href="tel:+31621331374"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-semibold transition-all hover:opacity-80"
              style={{ border: "1px solid rgba(255,255,255,0.2)", color: "#ffffff", fontFamily: "var(--font-inter)" }}
            >
              <Phone size={14} /> Direct bellen
            </a>
          </div>
        </div>
      </div>

      {/* Voordelen */}
      <section className="py-20 px-6" style={{ backgroundColor: "#ffffff" }}>
        <div className="max-w-6xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-14">
              <p className="text-xs tracking-widest uppercase mb-3" style={{ color: "rgba(0,19,55,0.4)", fontFamily: "var(--font-inter)" }}>
                Waarom klanten uit {stad.naam} kiezen voor JG Mobility
              </p>
              <h2 className="text-3xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: "#001337" }}>
                Uw auto verkopen in {stad.naam}
              </h2>
              <p className="mt-4 text-sm max-w-xl mx-auto" style={{ color: "rgba(0,19,55,0.5)", fontFamily: "var(--font-inter)", lineHeight: 1.8 }}>
                JG Mobility in Barendrecht bedient de hele regio {stad.regio}. Op slechts {stad.km} kilometer van {stad.naam} kunt u rekenen op persoonlijk contact, een eerlijke prijs en snelle afhandeling.
              </p>
            </div>
          </AnimateOnScroll>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {voordelen.map((v, i) => (
              <AnimateOnScroll key={v.title} delay={i * 0.08}>
                <div className="p-5 h-full" style={{ border: "1px solid rgba(0,19,55,0.08)", backgroundColor: "#fafafa" }}>
                  <div className="w-11 h-11 flex items-center justify-center mb-4" style={{ backgroundColor: "#001337", color: "#ffffff" }}>{v.icon}</div>
                  <h3 className="font-bold text-sm mb-2" style={{ color: "#001337", fontFamily: "var(--font-playfair)" }}>{v.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(0,19,55,0.5)", fontFamily: "var(--font-inter)" }}>{v.desc}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Stappen */}
      <section className="py-20 px-6" style={{ backgroundColor: "#fafafa" }}>
        <div className="max-w-4xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-14">
              <p className="text-xs tracking-widest uppercase mb-3" style={{ color: "rgba(0,19,55,0.4)", fontFamily: "var(--font-inter)" }}>Zo werkt het</p>
              <h2 className="text-3xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: "#001337" }}>
                Uw auto verkopen in 4 stappen
              </h2>
            </div>
          </AnimateOnScroll>
          <div className="flex flex-col gap-6">
            {stappen.map((s, i) => (
              <AnimateOnScroll key={s.step} delay={i * 0.08}>
                <div className="flex gap-6 items-start p-6" style={{ border: "1px solid rgba(0,19,55,0.08)", backgroundColor: "#ffffff" }}>
                  <span className="text-3xl font-bold flex-shrink-0" style={{ color: "rgba(0,19,55,0.1)", fontFamily: "var(--font-playfair)" }}>{s.step}</span>
                  <div>
                    <h3 className="font-bold text-sm mb-1" style={{ color: "#001337", fontFamily: "var(--font-playfair)" }}>{s.title}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: "rgba(0,19,55,0.5)", fontFamily: "var(--font-inter)" }}>{s.desc}</p>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Regio-overzicht */}
      <section className="py-20 px-6" style={{ backgroundColor: "#ffffff" }}>
        <div className="max-w-6xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-12">
              <p className="text-xs tracking-widest uppercase mb-3" style={{ color: "rgba(0,19,55,0.4)", fontFamily: "var(--font-inter)" }}>Heel Zuid-Holland</p>
              <h2 className="text-3xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: "#001337" }}>
                Ook actief in uw buurgemeenten
              </h2>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll delay={0.1}>
            <div className="flex flex-wrap gap-2 justify-center">
              {steden
                .filter((s) => s.slug !== stad.slug)
                .map((s) => (
                  <Link
                    key={s.slug}
                    href={`/auto-inkoop/${s.slug}`}
                    className="text-xs px-3 py-1.5 transition-all hover:opacity-70"
                    style={{ border: "1px solid rgba(0,19,55,0.12)", color: "rgba(0,19,55,0.6)", fontFamily: "var(--font-inter)" }}
                  >
                    {s.naam}
                  </Link>
                ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center" style={{ backgroundColor: "#001337" }}>
        <AnimateOnScroll>
          <p className="text-xs tracking-widest uppercase mb-3" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-inter)" }}>
            JG Mobility — {stad.naam} & omgeving
          </p>
          <h2 className="text-3xl font-bold mb-4 text-white" style={{ fontFamily: "var(--font-playfair)" }}>
            Klaar om uw auto te verkopen?
          </h2>
          <p className="text-sm mb-8 max-w-sm mx-auto" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-inter)" }}>
            Vanuit {stad.naam} bij ons in {stad.km} minuten. Gratis taxatie, bod binnen 24 uur, directe betaling.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-semibold transition-all hover:scale-105"
              style={{ backgroundColor: "#ffffff", color: "#001337", fontFamily: "var(--font-inter)" }}
            >
              Taxatie aanvragen <ArrowRight size={14} />
            </Link>
            <a
              href="tel:+31621331374"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-semibold"
              style={{ border: "1px solid rgba(255,255,255,0.2)", color: "#ffffff", fontFamily: "var(--font-inter)" }}
            >
              <Phone size={14} /> +31 6 21331374
            </a>
          </div>
        </AnimateOnScroll>
      </section>
    </>
  );
}
