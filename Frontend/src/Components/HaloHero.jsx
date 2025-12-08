import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Loader2 } from "lucide-react"; 
import GeometricBackground from "../assets/indMan.png";
import { useParams } from "react-router-dom";
import api from "../API/api"; 

// Wrapper to ensure children (loading bar) render correctly
const ModelViewer = ({ children, ...props }) => (
  <model-viewer {...props}>{children}</model-viewer>
);

export default function SiteDetails() {
  const { id } = useParams(); 
  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);

  // ✅ FIX 1: Restore the Helper Function
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

  // --- FETCH DATA FROM BACKEND ---
  useEffect(() => {
    const fetchSite = async () => {
      try {
        const response = await api.get(`sites/${id}`);
        setSite(response.data);
      } catch (error) {
        console.error("Failed to fetch site:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchSite();
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-orange-50">
        <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
      </div>
    );
  }

  if (!site) return <div className="text-center p-10 text-xl">Site not found.</div>;

  // --- VARIANTS ---
  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 70, damping: 10, staggerChildren: 0.2 } },
  };

  const modelViewerVariants = {
    hidden: { opacity: 0, x: -50, scale: 0.95 },
    visible: { opacity: 1, x: 0, scale: 1, transition: { type: "spring", stiffness: 70, damping: 10, delay: 0.5 } },
  };

  const rotationVariants = {
    start: { rotate: 0 },
    end: { rotate: 360, transition: { duration: 40, ease: "linear", repeat: Infinity } },
  };

  // --- DYNAMIC CONTENT SECTIONS ---
  const contentSections = [
    { title: "History & Context", content: site.history },
    { title: "Architectural Highlights", content: site.architecture },
    { title: "Conservation Efforts", content: site.conservation },
    { title: "Modern Relevance", content: site.modernRelevance },
  ];

  return (
    <section className="bg-gradient-to-br from-yellow-50 to-orange-100 pt-10 relative overflow-hidden min-h-screen">
      
      {/* 🌟 Rotating Background Element */}
      {GeometricBackground && (
        <motion.img
          src={GeometricBackground}
          alt="Geometric Background Pattern"
          className="absolute hidden sm:inline-block top-1/2 left-1/2 w-[1900px] h-[1900px] -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none"
          style={{ opacity: 0.2 }}
          variants={rotationVariants}
          initial="start"
          animate="end"
        />
      )}

      {/* Rice Paper Texture Overlay */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "url('https://www.transparenttextures.com/patterns/rice-paper.png')",
        }}
      ></div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 relative z-10 h-[calc(100vh-40px)] overflow-hidden">
        
        {/* === LEFT COLUMN: 3D Model Viewer === */}
        <motion.div
          variants={modelViewerVariants}
          initial="hidden"
          animate="visible"
          className="order-1 md:sticky md:top-1 h-fit flex justify-center p-4 md:p-0"
        >
          <motion.div
            className="w-full h-96 md:h-[500px] border-amber-500 border-5 rounded-3xl overflow-hidden flex items-center justify-center p-2 relative"
            style={{ maxWidth: "min(100%, 600px)" }}
            
            // Dynamic Styles based on isDark state
            animate={{
              backgroundColor: isDark 
                ? "rgba(15, 23, 42, 0.8)"   
                : "rgba(255, 255, 255, 0.5)", 
              
                borderColor: isDark 
                  ? "rgba(234, 179, 8, 0.3)"  
                  : "rgba(253, 224, 71, 1)",  
                
                boxShadow: !isDark
                  ? "0px 20px 50px -10px rgba(0,0,0,0.9), 0px 0px 30px rgba(234, 179, 8, 0.15)"
                  : "0px 20px 40px -5px rgba(0,0,0,0.15), 0px 8px 10px -6px rgba(0,0,0,0.1)", 
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            
            {/* Theme Toggle Button */}
            <motion.button
              onClick={() => setIsDark(!isDark)}
              className={`absolute top-4 right-4 z-50 p-2 rounded-full backdrop-blur-md border shadow-md transition-colors duration-300
                ${isDark 
                  ? "bg-slate-800/50 border-slate-600 text-yellow-400 hover:bg-slate-700" 
                  : "bg-white/60 border-yellow-200 text-orange-500 hover:bg-white/80"
                }`}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1 }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={isDark ? "dark" : "light"}
                  initial={{ y: -20, opacity: 0, rotate: -90 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: 20, opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  {isDark ? <Moon size={20} /> : <Sun size={20} />}
                </motion.div>
              </AnimatePresence>
            </motion.button>

            {/* 3D Model Viewer */}
            <ModelViewer
              src={getFileUrl(site.glb)}        
              // ✅ FIX 2: Restore the Poster (Thumbnail)
              poster={getFileUrl(site.thumb)}   
              
              alt={`3D Model of ${site.title}`}
              ar
              ar-modes="webxr scene-viewer quick-look"
              camera-controls
              touch-action="pan-y"
              auto-rotate
              shadow-intensity={isDark ? "2" : "1"} 
              environment-image="neutral"
              className="w-full h-full"
              loading="eager" 
              reveal="auto"
            >
                {/* ✅ FIX 3: Restore the Loading Bar */}
                <div slot="progress-bar" className="w-full h-1 bg-gray-200 absolute top-0 left-0">
                    <div className="h-full bg-orange-500 transition-all duration-300" style={{width: "100%"}}></div>
                </div>
            </ModelViewer>
          </motion.div>
        </motion.div>

        {/* === RIGHT COLUMN: Information Panel === */}
        <motion.div
          variants={textVariants}
          initial="hidden"
          animate="visible"
          className="order-2 h-full overflow-y-scroll pl-4 pr-8 custom-scrollbar pb-32"
        >
          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-serif font-extrabold text-red-900 leading-tight drop-shadow-md mb-8 pt-4"
            variants={textVariants}
          >
            <span className="text-yellow-700">{site.title}</span>
          </motion.h2>

           {/* Tags */}
           <motion.div variants={textVariants} className="flex gap-2 flex-wrap mb-6">
            {site.tags && site.tags.map((tag, i) => (
                <span key={i} className="px-3 py-1 bg-orange-100 text-orange-800 text-sm font-semibold rounded-full border border-orange-200 uppercase tracking-wide">
                    {tag}
                </span>
            ))}
          </motion.div>

          <motion.p
            className="mt-6 text-gray-800 text-xl font-light leading-relaxed pb-8 border-b border-yellow-300"
            variants={textVariants}
          >
            {site.summary}
          </motion.p>

          <div className="pt-8 space-y-12">
            {contentSections.map((section, i) => (
                section.content && (
                    <motion.div
                        key={i}
                        variants={textVariants}
                        className="mb-12 p-6 bg-white/70 rounded-xl shadow-lg border border-yellow-200"
                    >
                        <h3 className="text-2xl font-bold text-red-800 mb-3">{section.title}</h3>
                        <p className="text-gray-700 whitespace-pre-line leading-relaxed text-justify">
                            {section.content}
                        </p>
                    </motion.div>
                )
             ))}
          </div>

        </motion.div>
      </div>
    </section>
  );
}