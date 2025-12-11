import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

/**
 * Live Filters component
 * - Calls onSearch(query) whenever the user types (debounced).
 * - If you want immediate (no debounce), set debounceMs = 0
 *
 * Props:
 *  - onSearch: function(query: string)  // required (but guarded)
 *  - debounceMs: number (optional) default 180
 */
export default function Filters({ onSearch = () => {}, debounceMs = 180 }) {
  const [query, setQuery] = useState("");
  const timer = useRef(null);

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 80, damping: 10, delay: 0.1 },
    },
  };

  useEffect(() => {
    // clear previous timer
    if (timer.current) clearTimeout(timer.current);

    if (!debounceMs || debounceMs <= 0) {
      // immediate call
      if (typeof onSearch === "function") onSearch(query.trim());
      return;
    }

    timer.current = setTimeout(() => {
      if (typeof onSearch === "function") onSearch(query.trim());
    }, debounceMs);

    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }
    };
  }, [query, onSearch, debounceMs]);

  return (
    <motion.div
      variants={formVariants}
      initial="hidden"
      animate="visible"
      className="w-full "
    >
      <div
        className="flex sm:gap-4 flex-row items-center sm:gap- w-full p-4 rounded-xl
                   bg-gradient-to-r  from-amber-500/10 to-red-500/10 shadow-lg border border-yellow-100"
      >
        <div className="relative flex-grow w-full sm:w-72 md:w-96">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for Sites..."
         
            className="pl-12  pr-4 py-3 w-full sm:rounded-full rounded-l-full shadow-md bg-white text-gray-800
                       focus:outline-none focus:ring-4 focus:ring-yellow-300 transition-all duration-300 sm:border sm:border-gray-200"
            aria-label="Search heritage sites"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-700 w-5 h-5" />
        </div>

        {/* Keep a button for accessibility / manual search if needed — it just triggers onSearch immediately */}
        <motion.button
          type="button"
          onClick={() => typeof onSearch === "function" && onSearch(query.trim())}
          whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0,0,0,0.15)" }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-yellow-600  hover:bg-yellow-700  text-white font-semibold md:rounded-full rounded-r-full shadow-lg"
        >
          Search
        </motion.button>
      </div>
    </motion.div>
  );
}
