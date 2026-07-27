import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import ScrollToTop from "@/components/ScrollToTop";
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

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  icons: {
    icon: "/Favicon.png",
    shortcut: "/Favicon.png",
    apple: "/Favicon.png",
  },
  title: {
    default: "JG Mobility | Autobedrijf Barendrecht — Inkoop, Verkoop & Consignatie",
    template: "%s | JG Mobility",
  },
  description:
    "JG Mobility in Barendrecht is uw specialist voor auto inkoop, verkoop en consignatie. Premium occasions, eerlijke taxatie en persoonlijk advies. Beoordeeld met 4,9 sterren.",
  keywords: [
    "auto inkoop Barendrecht",
    "auto verkoop Barendrecht",
    "auto inkoop Rotterdam",
    "auto verkopen Rotterdam",
    "auto consignatie Rotterdam",
    "auto consignatie Barendrecht",
    "auto taxatie Barendrecht",
    "auto taxatie Rotterdam",
    "occasions Barendrecht",
    "occasions Rotterdam",
    "autobedrijf Barendrecht",
    "autobedrijf Rotterdam",
    "auto inkoop Ridderkerk",
    "auto inkoop Dordrecht",
    "auto verkopen Ridderkerk",
    "auto verkopen Dordrecht",
    "auto inkoop Spijkenisse",
    "auto inkoop Capelle aan den IJssel",
    "auto inkoop Zwijndrecht",
    "auto inkoop Hendrik-Ido-Ambacht",
    "auto financiering Zuid-Holland",
    "premium occasions Zuid-Holland",
    "JG Mobility",
  ],
  authors: [{ name: "JG Mobility" }],
  creator: "JG Mobility",
  publisher: "JG Mobility",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: siteUrl,
    siteName: "JG Mobility",
    title: "JG Mobility | Autobedrijf Barendrecht — Inkoop, Verkoop & Consignatie",
    description:
      "JG Mobility in Barendrecht is uw specialist voor auto inkoop, verkoop en consignatie. Premium occasions, eerlijke taxatie en persoonlijk advies.",
    images: [
      {
        url: "/JG Mobility Transparant.png",
        width: 1200,
        height: 630,
        alt: "JG Mobility — Autobedrijf Barendrecht",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JG Mobility | Autobedrijf Barendrecht",
    description:
      "Specialist in auto inkoop, verkoop en consignatie in Barendrecht. Beoordeeld met 4,9 sterren.",
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
        "Specialist in auto consignatie, inkoop, taxatie en verkoop van premium occasions in Barendrecht.",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/JG%20Mobility%20Transparant.png`,
      },
      image: `${siteUrl}/Showroom%20Jimi%20Gaillard.png`,
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
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        bestRating: "5",
        worstRating: "1",
        reviewCount: "47",
      },
      review: [
        {
          "@type": "Review",
          reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
          author: { "@type": "Person", name: "Thomas V." },
          reviewBody: "Uitstekende service van Jimi. Mijn auto was binnen twee weken verkocht voor een eerlijke prijs. Geen gedoe, gewoon resultaat.",
        },
        {
          "@type": "Review",
          reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
          author: { "@type": "Person", name: "Kevin M." },
          reviewBody: "Heel fijn bedrijf. Geen verborgen kosten, altijd bereikbaar. Mijn Porsche is voor een topprijs verkocht. Blij mee!",
        },
      ],
      sameAs: [
        "https://www.instagram.com/jgmobility/",
        "https://www.facebook.com/profile.php?id=61588831825340",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "JG Mobility",
      description: "Premium auto consignatie, inkoop en verkoop in Barendrecht",
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
        <ChatWidget />
        <SpeedInsights />
      </body>
    </html>
  );
}
