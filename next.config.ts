import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // WAAROM DIT ZO KRAP STAAT
    // Voor elke maat en elk formaat dat hier staat haalt de beeldoptimalisatie het
    // ORIGINEEL opnieuw op uit de opslag. Zes breedtes maal twee formaten is twaalf keer
    // het hele bestand voor één foto -- en met een paar honderd autofoto's is de gratis
    // datalimiet van Vercel dan in weken op.
    //
    // Drie breedtes dekken in de praktijk alles: telefoon, tablet en een groot scherm.
    // Alleen WebP, want dat wordt door elke browser ondersteund die er nog toe doet en
    // scheelt de helft van de varianten. Van twaalf naar drie: vier keer minder verkeer
    // en vier keer minder transformaties.
    formats: ["image/webp"],
    minimumCacheTTL: 31536000,
    deviceSizes: [640, 1080, 1920],
    imageSizes: [128, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "prod.pictures.autoscout24.net",
      },
      {
        // Vercel Blob — gedeelde foto-opslag waar de admin auto-foto's naartoe uploadt
        protocol: "https",
        hostname: "**.public.blob.vercel-storage.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        source: "/:path*\\.mp4",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/:path*\\.png",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/:path*\\.jpg",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/:path*\\.jpeg",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/:path*\\.svg",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
