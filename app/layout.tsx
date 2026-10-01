import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppKnop from "@/components/WhatsAppKnop";
import ScrollToTop from "@/components/ScrollToTop";
import { reviews, GOOGLE_SCORE, GOOGLE_AANTAL } from "@/lib/reviews";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = "https://www.jgmobility.nl";

// Google Search Console verifieert met een meta-tag. De waarde is geen geheim, maar
// hij hoort niet in de code: zet NEXT_PUBLIC_GSC_VERIFICATION in de omgeving en de
// tag verschijnt. Staat hij er niet, dan laten we de tag weg in plaats van een lege
// of verzonnen waarde te zetten.
const gscVerificatie = process.env.NEXT_PUBLIC_GSC_VERIFICATION;

// Eén beschrijving voor de homepage, gericht op waar mensen écht op zoeken:
// "bedrijfswagen kopen Barendrecht", "occasions Barendrecht" en "bedrijfswagens
// Rotterdam". Onder de 160 tekens, want daarna kapt Google hem af. Geen
// sterrenclaims — de echte score staat in de JSON-LD hieronder.
const siteBeschrijving =
  "Bedrijfswagen of occasion kopen in Barendrecht? JG Mobility verkoopt bedrijfswagens en geselecteerde occasions in Barendrecht en regio Rotterdam. Inruil mogelijk.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  icons: {
    icon: "/Favicon.png",
    shortcut: "/Favicon.png",
    apple: "/Favicon.png",
  },
  title: {
    default: "JG Mobility | Bedrijfswagens & Occasions Barendrecht",
    template: "%s | JG Mobility",
  },
  description: siteBeschrijving,
  keywords: [
    "bedrijfswagen kopen Barendrecht",
    "bedrijfswagens Barendrecht",
    "bedrijfswagens Rotterdam",
    "bedrijfswagen kopen Rotterdam",
    "bestelbus kopen Barendrecht",
    "occasions Barendrecht",
    "occasions Rotterdam",
    "occasion kopen Barendrecht",
    "autobedrijf Barendrecht",
    "autobedrijf Rotterdam",
    "financial lease bedrijfswagen",
    "financial lease Barendrecht",
    "auto inruilen Barendrecht",
    "auto taxatie Barendrecht",
    "auto inkoop Barendrecht",
    "auto consignatie Barendrecht",
    "auto consignatie Rotterdam",
    "bedrijfswagens Ridderkerk",
    "occasions Dordrecht",
    "auto kopen Zuid-Holland",
    "JG Mobility",
  ],
  authors: [{ name: "JG Mobility" }],
  creator: "JG Mobility",
  publisher: "JG Mobility",
  alternates: {
    canonical: siteUrl,
  },
  ...(gscVerificatie ? { verification: { google: gscVerificatie } } : {}),
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: siteUrl,
    siteName: "JG Mobility",
    title: "JG Mobility | Bedrijfswagens & Occasions Barendrecht",
    description: siteBeschrijving,
    images: [
      {
        url: "/JG Mobility Transparant.png",
        width: 1200,
        height: 630,
        alt: "JG Mobility — Bedrijfswagens & Occasions Barendrecht",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JG Mobility | Bedrijfswagens & Occasions Barendrecht",
    description:
      "Bedrijfswagens en geselecteerde occasions in Barendrecht. Inruil mogelijk, financial lease voor ondernemers.",
    images: ["/JG Mobility Transparant.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["AutoDealer", "LocalBusiness"],
      "@id": `${siteUrl}/#organization`,
      name: "JG Mobility",
      description:
        "Autobedrijf in Barendrecht, gespecialiseerd in bedrijfswagens en geselecteerde occasions. Inruil, financial lease, taxatie en consignatie.",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/JG%20Mobility%20Transparant.png`,
      },
      // Verwees naar /Showroom Jimi Gaillard.png — dat bestand staat niet in /public,
      // dus Google kreeg een 404 terug voor de afbeelding van het bedrijf.
      image: `${siteUrl}/jimi-showroom.png`,
      telephone: "+31621331374",
      email: "info@jgmobility.nl",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Arnhemseweg 10a",
        addressLocality: "Barendrecht",
        postalCode: "2994 LA",
        addressRegion: "Zuid-Holland",
        addressCountry: "NL",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 51.85985,
        longitude: 4.51390,
      },
      hasMap: "https://www.google.com/maps/search/?api=1&query=JG+Mobility+Barendrecht",
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          opens: "10:00",
          closes: "21:00",
        },
      ],
      areaServed: [
        { "@type": "City", name: "Barendrecht" },
        { "@type": "City", name: "Rotterdam" },
        { "@type": "City", name: "Ridderkerk" },
        { "@type": "City", name: "Dordrecht" },
        { "@type": "City", name: "Spijkenisse" },
        { "@type": "City", name: "Capelle aan den IJssel" },
        { "@type": "City", name: "Hendrik-Ido-Ambacht" },
        { "@type": "City", name: "Zwijndrecht" },
      ],
      priceRange: "€€",
      currenciesAccepted: "EUR",
      founder: {
        "@type": "Person",
        "@id": `${siteUrl}/#jimi-gaillard`,
        name: "Jimi Gaillard",
        jobTitle: "Oprichter & Eigenaar",
      },
      // Score, aantal én citaten komen uit lib/reviews.ts, dezelfde bron als de
      // reviewkaarten op de site. Hier stond eerder 4,9 uit 47 reviews met twee
      // verzonnen citaten; dat is onjuiste informatie in rich results en precies
      // waar Google structured data voor kan negeren.
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: GOOGLE_SCORE.toFixed(1),
        bestRating: "5",
        worstRating: "1",
        reviewCount: String(GOOGLE_AANTAL),
      },
      review: reviews.map((review) => ({
        "@type": "Review",
        reviewRating: { "@type": "Rating", ratingValue: String(review.sterren), bestRating: "5" },
        author: { "@type": "Person", name: review.naam },
        reviewBody: review.tekst,
      })),
      sameAs: [
        "https://www.instagram.com/jgmobility/",
        "https://www.facebook.com/profile.php?id=61588831825340",
        "https://www.tiktok.com/@jg.mobility",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "JG Mobility",
      description: "Bedrijfswagens en geselecteerde occasions in Barendrecht",
      inLanguage: "nl-NL",
      publisher: { "@id": `${siteUrl}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${siteUrl}/aanbod?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // GA4 gaat alleen mee als er een meet-id is. Zonder id staat er niets in de
  // pagina: geen lege gtag-aanroep, geen request naar Google, en de
  // privacyverklaring blijft kloppen (die leest dezelfde variabele).
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="nl" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col overflow-x-hidden">
        <ScrollToTop />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppKnop />
        <Analytics />
        <SpeedInsights />
        {gaId && (
          <>
            {/* afterInteractive: meten mag nooit vóór de pagina zelf gaan. */}
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
