import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "JG Mobility",
    short_name: "JG Mobility",
    description: "Autobedrijf Barendrecht — Inkoop, Verkoop & Consignatie",
    start_url: "/",
    display: "standalone",
    background_color: "#001337",
    theme_color: "#001337",
    icons: [
      {
        src: "/Favicon.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/Favicon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
