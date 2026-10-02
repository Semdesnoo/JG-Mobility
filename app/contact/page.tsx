import ContactClient from "./ContactClient";

export const metadata = {
  title: "Contact | JG Mobility Barendrecht",
  description:
    "Contact met JG Mobility, Arnhemseweg 10a in Barendrecht. Bel of app +31 6 21331374 over een bedrijfswagen, occasion, inruil of financial lease. Bezoek op afspraak.",
  alternates: {
    canonical: "https://www.jgmobility.nl/contact",
  },
  openGraph: {
    title: "Contact | JG Mobility Barendrecht",
    description:
      "Bel, app of mail JG Mobility in Barendrecht over bedrijfswagens, occasions, inruil en financial lease. Bezoek op afspraak.",
    url: "https://www.jgmobility.nl/contact",
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
