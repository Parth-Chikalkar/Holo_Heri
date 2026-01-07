import React, { useState } from "react";
import { Play, Loader2 } from "lucide-react"; 
import { useNavigate } from "react-router-dom";

export default function SiteCard({ site, link }) {
  const nav = useNavigate();
  // State to track if the image is currently loading
  const [imageLoading, setImageLoading] = useState(true);

  // Helper to fix Google Drive links so they actually load
  const getVisibleImage = (url) => {
    if (!url) return "";
    if (url.includes("drive.google.com") && url.includes("id=")) {
      const id = url.split("id=")[1].split("&")[0];
      return `https://drive.google.com/thumbnail?id=${id}&sz=w800`;
    }
    return url;
  };

  function openViewer() {
    if (link) nav(link);
    else nav(`/viewer/${site._id}`);
  }

  return (
    <div 
      className="group bg-amber-50 rounded-3xl shadow-lg p-5 transition-all duration-200 ease-in-out relative overflow-hidden 
                  hover:shadow-2xl hover:border-amber-500 border border-transparent"
      style={{
        backgroundImage: "url('https://www.transparenttextures.com/patterns/cream-pixels.png')",
        backgroundBlendMode: 'overlay',
        transition: 'box-shadow 0.3s ease-in-out',
        '--tw-shadow': 'var(--tw-shadow-color-hover) 0 0 15px 5px, var(--tw-shadow)',
        '--tw-shadow-color-hover': 'rgba(255, 180, 0, 0.6)', 
      }}
    >
      
      {/* Image Container */}
      <div className="relative rounded-xl overflow-hidden shadow-md border-2 border-amber-300 h-48 bg-amber-100">
        
        {/* --- LOADER: Visible only while imageLoading is true --- */}
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
          </div>
        )}

        <img 
          src={getVisibleImage(site.thumb)} 
          alt={site.title} 
          referrerPolicy="no-referrer"
          
          // 1. When image finishes loading, stop the loader
          onLoad={() => setImageLoading(false)}
          
          // 2. If image fails, also stop the loader (so it doesn't spin forever)
          onError={(e) => {
            setImageLoading(false);
            e.target.style.display = 'none'; 
          }}

          // 3. Smooth fade-in effect using opacity
          className={`w-full h-full object-cover object-top transition-opacity duration-500 ${
            imageLoading ? "opacity-0" : "opacity-100"
          }`} 
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
      </div>

      {/* Content Area */}
      <div className="mt-4 text-center">
        <h3 className="text-2xl font-serif font-bold text-red-900 leading-tight mb-1">
          {site.title}
        </h3>
        
        <div className="text-sm text-amber-700 font-medium tracking-wide">
          {site.location || site.region}
        </div>

        <p className="mt-3 text-sm line-clamp-3 leading-tight text-gray-800 leading-relaxed font-light">
          {site.summary}
        </p>

        <button 
          onClick={openViewer}
          className="mt-5 inline-flex items-center justify-center gap-2 
                     bg-gradient-to-r from-amber-600 to-orange-700 
                     text-white font-semibold px-6 py-3 rounded-full hover:scale-105 transition hover:cursor-pointer
                     shadow-lg hover:shadow-xl transition-all ease-in-out border-b-4 border-amber-800"
        >
          <Play className="w-5 h-5 fill-current" /> <span className="text-base">Open Hologram</span>
        </button>

      </div>
    
    </div>
  );
}