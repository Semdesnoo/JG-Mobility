import { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blog";
import { getAutos } from "@/lib/autos-db";
import { steden } from "@/lib/steden";

const siteUrl = "https://www.jgmobility.nl";

export const revalidate = 300;

// De modelpagina's onder /bedrijfswagens. Eén lijst, zodat een nieuw model hier maar
// op één plek bij hoeft.
const bedrijfswagenModellen = ["sprinter", "master", "crafter", "transit", "vito"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [autos] = await Promise.all([getAutos()]);

  const bedrijfswagenUrls: MetadataRoute.Sitemap = bedrijfswagenModellen.map((model) => ({
    url: `${siteUrl}/bedrijfswagens/${model}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const stedenUrls: MetadataRoute.Sitemap = steden.map((s) => ({
    url: `${siteUrl}/auto-inkoop/${s.slug}`,
    lastModified: new Date("2026-05-22"),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const blogUrls: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const autoUrls: MetadataRoute.Sitemap = autos
    .filter((a) => a.slug)
    .map((a) => ({
      url: `${siteUrl}/aanbod/${a.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.85,
    }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/aanbod`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/bedrijfswagens`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/personenautos`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/bedrijfswagens/zero-emissiezones`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/financial-lease`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/recent-verkocht`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/reviews`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/consignatie`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/diensten`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/diensten/consignatie`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${siteUrl}/diensten/inkoop-taxatie`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/diensten/financiering`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/diensten/afleverpakketten`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/over-ons`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
    ...bedrijfswagenUrls,
    ...stedenUrls,
    ...autoUrls,
    ...blogUrls,
  ];
}
