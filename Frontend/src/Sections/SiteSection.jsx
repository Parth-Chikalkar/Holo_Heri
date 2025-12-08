import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Filters from "../Components/Filters";
import SiteCard from "../Components/SiteCard";
import { SITES } from "../data/sites";
import Mandala from "../assets/indMan.png";

export default function SitesSection() {
  const [query, setQuery] = useState("");

  const rotationVariants = {
    start: { rotate: 0 },
    end: {
      rotate: 360,
      transition: { duration: 40, ease: "linear", repeat: Infinity },
    },
  };

  // LIVE FILTERING HAPPENS HERE
  const filteredSites = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SITES;

    return SITES.filter((s) => {
      const combined =
        `${s.title} ${s.location} ${s.summary} ${s.tags?.join(" ")}`;
      return combined.toLowerCase().includes(q);
    });
  }, [query]);

  return (
    <section
      id="sites"
      className="bg-gradient-to-br from-amber-50 via-yellow-100 to-orange-200 py-4 relative overflow-hidden"
    >
      {/* MANDALA BACKGROUND */}
      <motion.img
        src={Mandala}
        alt="Mandala pattern"
        className="absolute hidden sm:inline-block top-1/2 left-1/2 w-[2200px] h-[2200px] -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none"
        style={{ opacity: 0.10, filter: "drop-shadow(0 0 8px rgba(255,180,0,0.3))" }}
        variants={rotationVariants}
        initial="start"
        animate="end"
      />

      {/* RICE PAPER TEXTURE */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none z-0"
        style={{
          backgroundImage:
            "url('https://www.transparenttextures.com/patterns/rice-paper.png')",
        }}
      />

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex justify-between  items-center mb-10">
         
          <Filters onSearch={(q) => setQuery(q)} />
        </div>

        {/* ✔ IF MATCHES FOUND → SHOW GRID */}
        {filteredSites.length > 0 ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredSites.map((site) => (
              <SiteCard key={site.id} site={site} />
            ))}
          </div>
        ) : (
          
          <div className="py-20 flex flex-col items-center text-center">
            <div className="bg-white/70 backdrop-blur-sm border border-amber-300/50 rounded-2xl p-10 shadow-xl max-w-lg">
              <h3 className="text-2xl font-bold text-amber-800 mb-2">
                No Results Found
              </h3>

              <p className="text-slate-700 text-sm mb-6">
                We couldn’t find any heritage sites matching{" "}
                <span className="font-semibold text-amber-700">“{query}”</span>.
              </p>

              <button
                className="px-6 py-2 bg-amber-600 text-white rounded-full hover:bg-amber-700 transition"
                onClick={() => setQuery("")}
              >
                Show all sites
              </button>

              <p className="text-xs text-slate-500 mt-4">
                Try searching by: Maharashtra, Temple, Mughal, Cave, Stone…
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
