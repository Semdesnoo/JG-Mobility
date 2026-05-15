import Link from "next/link";
import { ArrowRight, Clock, ArrowUpRight } from "lucide-react";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { blogPosts, formatDate } from "@/lib/blog";
import { fetchPexelsPhoto } from "@/lib/pexels";
import type { PexelsPhoto } from "@/lib/pexels";
import BlogHero from "./BlogHero";

export const revalidate = 86400; // Hervalideer elke 24 uur (Pexels foto's)

export const metadata = {
  title: "Blog | JG Mobility",
  description:
    "Handige artikelen over auto consignatie, inkoop, verkoop, taxatie en financiering — van JG Mobility in Barendrecht.",
};

export default async function BlogPage() {
  const photos = await Promise.all(
    blogPosts.map((post) => fetchPexelsPhoto(post.imageQuery))
  );

  const [featured, ...rest] = blogPosts;
  const featuredPhoto: PexelsPhoto | null = photos[0];
  const restPhotos = photos.slice(1);

  return (
    <>
      <BlogHero />

      {/* Featured post — full-width hero card */}
      <section className="px-6 pt-16 pb-0" style={{ backgroundColor: "#ffffff" }}>
        <div className="max-w-7xl mx-auto">
          <AnimateOnScroll>
            <Link
              href={`/blog/${featured.slug}`}
              className="group relative flex overflow-hidden"
              style={{ height: "520px" }}
            >
              {/* Image */}
              {featuredPhoto ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={featuredPhoto.src.large}
                  alt={featuredPhoto.alt}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0" style={{ backgroundColor: "#001337" }} />
              )}

              {/* Cinematic gradient overlay */}
              <div
                className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-90"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,19,55,0.96) 0%, rgba(0,19,55,0.65) 45%, rgba(0,19,55,0.15) 100%)",
                }}
              />

              {/* Top-right arrow icon */}
              <div
                className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0"
                style={{ backgroundColor: "rgba(255,255,255,0.15)", backdropFilter: "blur(4px)" }}
              >
                <ArrowUpRight size={16} color="#ffffff" />
              </div>

              {/* Content */}
              <div className="relative flex flex-col justify-end w-full p-8 md:p-14">
                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-3 mb-5">
                  <span
                    className="inline-block text-xs font-bold tracking-widest uppercase px-3 py-1"
                    style={{ backgroundColor: "#ffffff", color: "#001337", fontFamily: "var(--font-inter)" }}
                  >
                    {featured.category}
                  </span>
                  <span
                    className="flex items-center gap-1.5 text-xs"
                    style={{ color: "rgba(255,255,255,0.55)", fontFamily: "var(--font-inter)" }}
                  >
                    <Clock size={11} /> {featured.readTime} min
                  </span>
                  <span
                    className="text-xs"
                    style={{ color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-inter)" }}
                  >
                    {formatDate(featured.date)}
                  </span>
                </div>

                {/* Title */}
                <h2
                  className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-4 max-w-3xl transition-opacity duration-300 group-hover:opacity-90"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {featured.title}
                </h2>

                {/* Excerpt */}
                <p
                  className="text-sm leading-relaxed max-w-xl mb-7 transition-opacity duration-300"
                  style={{ color: "rgba(255,255,255,0.65)", fontFamily: "var(--font-inter)" }}
                >
                  {featured.excerpt}
                </p>

                {/* CTA */}
                <div
                  className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase transition-all duration-300 group-hover:gap-3"
                  style={{ color: "#ffffff", fontFamily: "var(--font-inter)" }}
                >
                  Lees artikel <ArrowRight size={13} />
                </div>
              </div>
            </Link>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Remaining posts — dynamic asymmetric grid */}
      <section className="py-16 px-6 pb-24" style={{ backgroundColor: "#ffffff" }}>
        <div className="max-w-7xl mx-auto">
          {/* Section label */}
          <div className="flex items-center gap-4 mb-10">
            <div className="h-px flex-1" style={{ backgroundColor: "rgba(0,19,55,0.08)" }} />
            <span
              className="text-xs tracking-widest uppercase"
              style={{ color: "rgba(0,19,55,0.35)", fontFamily: "var(--font-inter)" }}
            >
              Meer artikelen
            </span>
            <div className="h-px flex-1" style={{ backgroundColor: "rgba(0,19,55,0.08)" }} />
          </div>

          {/* Grid: 2 columns on md, posts alternate in visual weight */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {rest.map((post, i) => {
              const photo: PexelsPhoto | null = restPhotos[i];
              const isTall = i === 0 || i === 3; // first and last are taller

              return (
                <AnimateOnScroll key={post.slug} delay={i * 0.07}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1"
                    style={{
                      border: "1px solid rgba(0,19,55,0.07)",
                      backgroundColor: "#ffffff",
                    }}
                  >
                    {/* Image area */}
                    <div
                      className="relative overflow-hidden flex-shrink-0"
                      style={{
                        height: isTall ? "280px" : "220px",
                        backgroundColor: "#001337",
                      }}
                    >
                      {photo ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={photo.src.large}
                          alt={photo.alt}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span
                            className="text-5xl font-bold opacity-10 text-white"
                            style={{ fontFamily: "var(--font-playfair)" }}
                          >
                            JG
                          </span>
                        </div>
                      )}

                      {/* Gradient overlay */}
                      <div
                        className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-80"
                        style={{
                          background:
                            "linear-gradient(to top, rgba(0,19,55,0.6) 0%, transparent 55%)",
                        }}
                      />

                      {/* Category badge - bottom left */}
                      <span
                        className="absolute bottom-4 left-4 text-xs font-bold tracking-widest uppercase px-3 py-1"
                        style={{
                          backgroundColor: "#001337",
                          color: "#ffffff",
                          fontFamily: "var(--font-inter)",
                        }}
                      >
                        {post.category}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="px-6 py-6 flex flex-col flex-1">
                      {/* Meta */}
                      <div
                        className="flex items-center gap-1.5 mb-3 text-xs"
                        style={{ color: "rgba(0,19,55,0.38)", fontFamily: "var(--font-inter)" }}
                      >
                        <Clock size={10} />
                        {post.readTime} min lezen
                        <span className="mx-1">·</span>
                        {formatDate(post.date)}
                      </div>

                      {/* Title */}
                      <h2
                        className="text-lg font-bold leading-snug mb-3 transition-opacity duration-200 group-hover:opacity-60 flex-1"
                        style={{ fontFamily: "var(--font-playfair)", color: "#001337" }}
                      >
                        {post.title}
                      </h2>

                      {/* Excerpt */}
                      <p
                        className="text-sm leading-relaxed mb-5"
                        style={{ color: "rgba(0,19,55,0.52)", fontFamily: "var(--font-inter)" }}
                      >
                        {post.excerpt}
                      </p>

                      {/* Bottom CTA row */}
                      <div
                        className="flex items-center justify-between pt-4"
                        style={{ borderTop: "1px solid rgba(0,19,55,0.07)" }}
                      >
                        <span
                          className="text-xs font-bold tracking-widest uppercase flex items-center gap-1.5 transition-all duration-200 group-hover:gap-2.5"
                          style={{ color: "#001337", fontFamily: "var(--font-inter)" }}
                        >
                          Lees artikel <ArrowRight size={11} />
                        </span>
                      </div>
                    </div>
                  </Link>
                </AnimateOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-24 px-6 text-center"
        style={{ backgroundColor: "#001337" }}
      >
        <AnimateOnScroll>
          <p
            className="text-xs tracking-widest uppercase mb-3"
            style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-inter)" }}
          >
            JG Mobility — Barendrecht
          </p>
          <h2
            className="text-3xl font-bold mb-4 text-white"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Direct een vraag stellen?
          </h2>
          <p
            className="text-sm mb-8 max-w-sm mx-auto"
            style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-inter)" }}
          >
            We helpen je graag persoonlijk verder. Neem vrijblijvend contact op.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 text-sm font-semibold transition-all hover:scale-105"
            style={{
              backgroundColor: "#ffffff",
              color: "#001337",
              fontFamily: "var(--font-inter)",
            }}
          >
            Contact opnemen <ArrowRight size={14} />
          </Link>
        </AnimateOnScroll>
      </section>
    </>
  );
}
