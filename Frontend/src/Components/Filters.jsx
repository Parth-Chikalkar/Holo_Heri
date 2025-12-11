import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Search, Landmark, Palette, Layers } from "lucide-react";

export default function Filters({ onSearch = () => {}, debounceMs = 180 }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all"); // New State
  const timer = useRef(null);

  const formVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 10, delay: 0.1 } },
  };

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      if (typeof onSearch === "function") {
        // Pass BOTH query and category to parent
        onSearch(query.trim(), category);
      }
    }, debounceMs);

    return () => clearTimeout(timer.current);
  }, [query, category, onSearch, debounceMs]);

  return (
    <motion.div variants={formVariants} initial="hidden" animate="visible" className="w-full mb-8">
      <div className="flex flex-col md:flex-row gap-4 items-center bg-white/80 backdrop-blur-md p-2 rounded-3xl shadow-lg border border-orange-100">
        
        {/* Search Input */}
        <div className="relative flex-grow w-full">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="pl-12 pr-4 py-3 w-full bg-orange-50/50 rounded-full border-none focus:ring-2 focus:ring-yellow-300 outline-none text-gray-700 transition-all"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-700 w-5 h-5" />
        </div>

        {/* Category Tabs */}
        <div className="flex p-1 bg-orange-50 rounded-full w-full md:w-auto">
            {['all', 'heritage', 'culture'].map((tab) => (
                <button
                    key={tab}
                    onClick={() => setCategory(tab)}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 w-full md:w-auto justify-center
                    ${category === tab 
                        ? 'bg-yellow-600 text-white shadow-md transform scale-105' 
                        : 'text-gray-500 hover:text-yellow-600'
                    }`}
                >
                    {tab === 'all' && <Layers size={16} />}
                    {tab === 'heritage' && <Landmark size={16} />}
                    {tab === 'culture' && <Palette size={16} />}
                    <span className="capitalize">{tab}</span>
                </button>
            ))}
        </div>

      </div>
    </motion.div>
  );
}