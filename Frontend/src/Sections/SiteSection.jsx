import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react"; // Import Loader for loading state
import Filters from "../Components/Filters";
import SiteCard from "../Components/SiteCard";
import Mandala from "../assets/indMan.png";
import api from "../API/api"; // Import your Axios instance

export default function SitesSection() {
  const [query, setQuery] = useState("");
  const [sites, setSites] = useState([]); // Store fetched sites here
  const [loading, setLoading] = useState(true); // Loading state


 
  // --- 1. FETCH SITES FROM BACKEND ---
  useEffect(() => {
    const fetchSites = async () => {
      try {
        
        const response = await api.get('/sites');
        
        // Your controller returns: { page: 1, limit: 12, total: 5, data: [...] }
        // So we set the 'data' array to our state
        if (response.data && response.data.data) {
            setSites(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch sites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSites();
  }, []);

  const rotationVariants = {
    start: { rotate: 0 },
    end: {
      rotate: 360,
      transition: { duration: 40, ease: "linear", repeat: Infinity },
    },
  };

  // --- 2. LIVE FILTERING (Updated to use 'sites' state) ---
  const filteredSites = useMemo(() => {
    const q = query.trim().toLowerCase();
    
    // If no sites loaded yet, return empty
    if (!sites.length) return [];
    
    if (!q) return sites;

    return sites.filter((s) => {
      // Ensure properties exist before checking (backend data safety)
      const title = s.title || "";
      const location = s.location || "";
      const summary = s.summary || "";
      const tags = Array.isArray(s.tags) ? s.tags.join(" ") : "";

      const combined = `${title} ${location} ${summary} ${tags}`;
      return combined.toLowerCase().includes(q);
    });
  }, [query, sites]);

  return (
    <section
      id="sites"
      className="bg-gradient-to-br from-amber-50 via-yellow-100 to-orange-200 py-4 relative overflow-hidden min-h-screen"
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
        <div className="flex justify-between items-center mb-10">
          <Filters onSearch={(q) => setQuery(q)} />
        </div>

        {/* 3. LOADING STATE */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Loader2 className="w-12 h-12 text-amber-600 animate-spin mb-4" />
            <p className="text-amber-800 font-medium">Loading Heritage Sites...</p>
          </div>
        ) : (
          <>
            {/* 4. RESULTS GRID */}
            {filteredSites.length > 0 ? (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {filteredSites.map((site) => (
                  // Pass the MongoDB _id as the key
                  <SiteCard key={site._id} site={site} />
                ))}
              </div>
            ) : (
              /* NO RESULTS STATE */
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
          </>
        )}
      </div>
    </section>
  );
}