"use client";

import AnimateOnScroll from "@/components/AnimateOnScroll";
import { reviews, GOOGLE_SCORE, GOOGLE_AANTAL, GOOGLE_REVIEWS_URL } from "@/lib/reviews";

/**
 * Het reviewsblok zoals het op de homepage staat.
 *
 * WAAROM DIT EEN EIGEN COMPONENT IS
 * Deze opmaak stond in `app/HomeClient.tsx`. Hij moet nu ook op `/reviews` staan, en
 * dat is precies het moment waarop twee kopieën uit elkaar gaan lopen. De opmaak is
 * daarom ongewijzigd hierheen verhuisd; de data komt uit `lib/reviews.ts`.
 */

function Ster() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#f5c518">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

/** Het Google-logo in de merkkleuren — staat zowel in de scorekaart als bij de link. */
function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
  );
}

export default function ReviewsSection() {
  return (
    <section className="py-20 px-6" style={{ backgroundColor: "#f5f5f5" }}>
      <div className="max-w-7xl mx-auto">
        <AnimateOnScroll>
          {/* Header balk */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "rgba(0,19,55,0.45)", fontFamily: "var(--font-inter)" }}>
                Wat klanten zeggen
              </p>
              <h2 className="text-4xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: "#001337" }}>
                Klantbeoordelingen
              </h2>
            </div>

            {/* Google score blok — spiegelt Google's eigen "Beoordelingen"-kaart */}
            <div
              className="flex items-center gap-5 px-6 py-4 rounded-none"
              style={{ backgroundColor: "#001337", minWidth: "300px", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <GoogleLogo />
                  <span className="text-sm font-bold text-white" style={{ fontFamily: "var(--font-inter)" }}>Google reviews</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-playfair)" }}>
                    {GOOGLE_SCORE.toFixed(1).replace(".", ",")}
                  </span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => <Ster key={i} />)}
                  </div>
                  <span className="text-xs text-white/60" style={{ fontFamily: "var(--font-inter)" }}>
                    ({GOOGLE_AANTAL})
                  </span>
                </div>
              </div>
              <a
                href={GOOGLE_REVIEWS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-center whitespace-nowrap hover:opacity-80 transition-opacity"
                style={{ color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-inter)" }}
              >
                Beoordeel<br />ons op Google
              </a>
            </div>
          </div>
        </AnimateOnScroll>

        {/* Review kaarten — 3 reviews uit Google, vierkant naast elkaar op desktop. */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reviews.map((review, i) => (
            <AnimateOnScroll key={review.naam} delay={i * 0.08}>
              <div
                className="flex flex-col gap-3 p-6 h-full transition-shadow hover:shadow-md"
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid rgba(0,19,55,0.06)",
                  borderRadius: 0,
                }}
              >
                {/* Header: vierkante avatar + naam + "Review van Google" */}
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                    style={{
                      backgroundColor: review.kleur,
                      fontFamily: "var(--font-inter)",
                      borderRadius: 0,
                    }}
                  >
                    {review.initialen}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold leading-tight" style={{ color: "#001337", fontFamily: "var(--font-inter)" }}>
                      {review.naam}
                    </p>
                    <p className="text-[11px] text-gray-400 leading-tight mt-0.5" style={{ fontFamily: "var(--font-inter)" }}>
                      Review van Google
                    </p>
                  </div>
                </div>

                {/* Sterren */}
                <div className="flex gap-0.5">
                  {[...Array(review.sterren)].map((_, s) => <Ster key={s} />)}
                </div>

                {/* Tekst */}
                <p className="text-sm leading-relaxed text-gray-600 flex-1" style={{ fontFamily: "var(--font-inter)" }}>
                  &ldquo;{review.kort}&rdquo;
                </p>

                {/* Datum */}
                <p className="text-[11px] text-gray-400 pt-2" style={{ fontFamily: "var(--font-inter)" }}>
                  {review.datum}
                </p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>

        {/* Link naar alle reviews */}
        <div className="mt-8 text-center">
          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold hover:opacity-70 transition-opacity"
            style={{ color: "#001337", fontFamily: "var(--font-inter)" }}
          >
            <GoogleLogo />
            Bekijk onze reviews op Google
          </a>
        </div>
      </div>
    </section>
  );
}
