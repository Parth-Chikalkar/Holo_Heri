import React from "react";
import { Play } from "lucide-react"; // Removed unused 'Link' import to avoid confusion
import { useNavigate } from "react-router-dom";

// Updated props to accept 'link'
export default function SiteCard({ site, link }) {
  const nav = useNavigate();

  const getFileUrl = (path) => {
    if (!path) return "";

    // 1. If it's a "localhost:3000" URL from the DB, force it to 4000
    if (path.includes("localhost:3000")) {
      return path.replace("3000", "4000");
    }

    // 2. If it's already a full valid URL (Cloudinary or corrected Local), use it
    if (path.startsWith("http") || path.startsWith("https")) {
      return path;
    }

    // 3. If it's a relative path (e.g. "uploads/file.png"), prepend the Env Variable
    // This uses the value from Step 1 (http://localhost:4000)
    return `${import.meta.env.VITE_API_BASE_URL}/${path.replace(/^\//, "")}`;
  };

  function openViewer() {
    // ✅ Use the custom link if provided (handles ?type=culture), otherwise default
    if (link) {
        nav(link);
    } else {
        nav(`/viewer/${site._id}`);
    }
  }

  return (
    // Outer Container: Set as 'group' to enable group-hover utility. Removed translate/scale.
    // Added a custom hover box-shadow for a soft, deep glow effect.
    <div 
      className="group bg-amber-50  rounded-3xl shadow-lg p-5 transition-all duration-200 ease-in-out relative overflow-hidden 
                  hover:shadow-2xl hover:border-amber-500 border border-transparent"
      style={{
        backgroundImage: "url('https://www.transparenttextures.com/patterns/cream-pixels.png')",
        backgroundBlendMode: 'overlay',
        // Custom style for the soft, deep saffron/amber glow on hover
        transition: 'box-shadow 0.3s ease-in-out',
        '--tw-shadow': 'var(--tw-shadow-color-hover) 0 0 15px 5px, var(--tw-shadow)',
        '--tw-shadow-color-hover': 'rgba(255, 180, 0, 0.6)', // Soft amber color
      }}
    >
      
      {/* Image Container: Kept elevated look, removed scale on image */}
      <div className="relative rounded-xl overflow-hidden shadow-md border-2 border-amber-300">
        <img 
          src={getFileUrl(site.thumb)} 
          alt={site.title} 
          // Removed hover:scale-105 here
          className="w-full h-48 object-cover object-top transition-transform duration-500" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>

      {/* Content Area */}
      <div className="mt-4 text-center">
        <h3 className="text-2xl font-serif font-bold text-red-900 leading-tight mb-1">
          {site.title}
        </h3>
        {/* Handle location vs region for Culture items */}
        <div className="text-sm text-amber-700 font-medium tracking-wide">
          {site.location || site.region}
        </div>

        <p className="mt-3 text-sm line-clamp-3 leading-tight text-gray-800 leading-relaxed font-light">
          {site.summary}
        </p>

        {/* Action Button: Kept existing shadow, removed scale. */}
        <button 
          onClick={openViewer}
          className="mt-5 inline-flex items-center justify-center gap-2 
                     bg-gradient-to-r from-amber-600 to-orange-700 
                     text-white font-semibold px-6 py-3 rounded-full hover:scale-105 transition hover:cursor-pointer
                     shadow-lg hover:shadow-xl transition-all  ease-in-out border-b-4 border-amber-800"
        >
          <Play className="w-5 h-5 fill-current" /> <span className="text-base">Open Hologram</span>
        </button>

      </div>
    
    </div>
  );
}