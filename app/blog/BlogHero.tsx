"use client";

import { motion } from "framer-motion";

export default function BlogHero() {
  return (
    <div className="relative pt-28 md:pt-52 pb-20 px-6 overflow-hidden" style={{ backgroundColor: "#001337" }}>
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 50% 80% at 20% 50%, rgba(255,255,255,0.06) 0%, transparent 70%)" }} />
      <div className="relative max-w-7xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xs tracking-widest uppercase mb-3"
          style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-inter)" }}
        >
          Kennis & tips
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-5xl md:text-6xl font-bold text-white"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Blog
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-5 text-sm max-w-xl leading-relaxed"
          style={{ color: "rgba(255,255,255,0.55)", fontFamily: "var(--font-inter)" }}
        >
          Handige artikelen over auto consignatie, inkoop, verkoop, taxatie en financiering — van JG Mobility.
        </motion.p>
      </div>
    </div>
  );
}
