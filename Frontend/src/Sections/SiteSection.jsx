import React, { useState, useCallback } from "react"; // 1. Import useCallback
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react"; 
import Filters from "../Components/Filters";
import SiteCard from "../Components/SiteCard";
import Mandala from "../assets/indMan.png";
import api from "../API/api"; 

export default function SitesSection() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false); // Start false, Filters will trigger it

  // --- MAIN FETCH & FILTER LOGIC ---
  // 2. Wrap the entire function in useCallback
  const handleSearch = useCallback(async (query, category = "all") => {
    setLoading(true);
    try {
      let fetchedData = [];

      // A. Fetch Heritage Sites
      if (category === "all" || category === "heritage") {
        try {
            const res = await api.get("/sites");
            const data = res.data.data || res.data;
            const taggedSites = Array.isArray(data) ? data.map(s => ({ ...s, type: 'heritage' })) : [];
            fetchedData = [...fetchedData, ...taggedSites];
        } catch (err) {
            console.error("Error fetching sites:", err);
        }
      }

      // B. Fetch Cultural Forms
      if (category === "all" || category === "culture") {
        try {
            const res = await api.get("/culture");
            const data = res.data.data || res.data;
            const taggedCulture = Array.isArray(data) ? data.map(c => ({ ...c, type: 'culture' })) : [];
            fetchedData = [...fetchedData, ...taggedCulture];
        } catch (err) {
            console.warn("Error fetching culture:", err);
        }
      }

      // C. Local Filtering
      if (query) {
        const q = query.toLowerCase().trim();
        fetchedData = fetchedData.filter((item) => {
          const titleMatch = item.title?.toLowerCase().includes(q);
          const locVal = item.location || item.region || "";
          const locMatch = locVal.toLowerCase().includes(q);
          const tagsMatch = Array.isArray(item.tags) && item.tags.some(t => t.toLowerCase().includes(q));
          
          return titleMatch || locMatch || tagsMatch;
        });
      }

      setResults(fetchedData);

    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  }, []); // 3. Empty dependency array ensures this function never changes

  // Note: We REMOVED the useEffect() here because the Filters component
  // automatically triggers the search once when it mounts.

  const rotationVariants = {
    start: { rotate: 0 },
    end: { rotate: 360, transition: { duration: 40, ease: "linear", repeat: Infinity } },
  };

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
        style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/rice-paper.png')" }}
      />

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* FILTERS */}
        <div className="flex justify-between items-center mb-10">
          <Filters onSearch={handleSearch} />
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Loader2 className="w-12 h-12 text-amber-600 animate-spin mb-4" />
            <p className="text-amber-800 font-medium">Loading Archive...</p>
          </div>
        ) : (
          <>
            {/* RESULTS GRID */}
            {results.length > 0 ? (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {results.map((item) => (
                  <SiteCard 
                    key={item._id} 
                    site={item} 
                    // Pass the correct viewer link
                    link={`/viewer/${item._id}?type=${item.type}`}
                  />
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
                    We couldn’t find any items matching your search.
                  </p>
                  <button
                    className="px-6 py-2 bg-amber-600 text-white rounded-full hover:bg-amber-700 transition"
                    onClick={() => handleSearch("", "all")}
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}