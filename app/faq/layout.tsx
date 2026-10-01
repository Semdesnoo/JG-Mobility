import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Veelgestelde vragen | Bedrijfswagens & occasions Barendrecht",
  description:
    "Antwoorden op vragen over bedrijfswagens, occasions, inruil, financial lease en consignatie bij JG Mobility in Barendrecht — kosten, stappen en openingstijden.",
  alternates: {
    canonical: "https://www.jgmobility.nl/faq",
  },
  openGraph: {
    title: "Veelgestelde vragen | JG Mobility Barendrecht",
    description:
      "Bedrijfswagens, occasions, inruil, financial lease en consignatie — de meestgestelde vragen aan JG Mobility in Barendrecht, met antwoord.",
    url: "https://www.jgmobility.nl/faq",
  },
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return children;
}
