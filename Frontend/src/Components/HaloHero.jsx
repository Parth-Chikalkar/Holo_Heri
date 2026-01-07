import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Moon, Sun, Loader2, ArrowLeft, AlertCircle } from "lucide-react"; 
import GeometricBackground from "../assets/indMan.png";
import { useParams, Link, useSearchParams } from "react-router-dom"; 
import api from "../API/api"; 

// Wrapper to ensure children render correctly
const ModelViewer = ({ children, ...props }) => (
  <model-viewer {...props}>{children}</model-viewer>
);

export default function SiteDetails() {
  const { id } = useParams(); 
  const [searchParams] = useSearchParams();
  const urlType = searchParams.get("type") || "heritage"; 

  const [site, setSite] = useState(null);
  const [actualType, setActualType] = useState(urlType); 
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [modelError, setModelError] = useState(false); // Track if model fails to load

  // --- 1. BASE URL HELPER ---
  const getFileUrl = (path) => {
    if (!path) return "";
    if (path.includes("localhost:3000")) return path.replace("3000", "4000");
    if (path.startsWith("http") || path.startsWith("https")) return path;
    return `${import.meta.env.VITE_API_BASE_URL}/${path.replace(/^\//, "")}`;
  };

  // --- 2. IMAGE FIXER (For Posters/Photos) ---
  const getVisibleImage = (path) => {
    const url = getFileUrl(path);
    if (!url) return "";
    if (url.includes("drive.google.com") && url.includes("id=")) {
      try {
        const id = url.split("id=")[1].split("&")[0];
        return `https://drive.google.com/thumbnail?id=${id}&sz=w1200`;
      } catch (e) { return url; }
    }
    return url;
  };

  // --- 3. MODEL URL FIXER (SPECIFIC FOR GLB FILES) ---
// --- 3. MODEL URL FIXER (Connects to Proxy) ---
  const getModelUrl = (path) => {
    // Basic safety check
    if (!path) return "";
    
    // Check if it is a Google Drive Link
    if (path.includes("drive.google.com") && path.includes("id=")) {
      try {
        // Extract the ID from the messy URL
        const id = path.split("id=")[1].split("&")[0];
        
        // CRITICAL CHANGE: Return the link to YOUR backend, not Google
        return `${import.meta.env.VITE_API_BASE_URL}/api/proxy-model?id=${id}`;
        
      } catch (e) {
        console.error("Error parsing Drive ID", e);
        return path;
      }
    }

    // Fallback for other links
    if (path.startsWith("http")) return path;
    return `${import.meta.env.VITE_API_BASE_URL}/${path.replace(/^\//, "")}`;
  };

  useEffect(() => {
    const fetchSite = async () => {
      setLoading(true);
      try {
        const primaryEndpoint = urlType === 'culture' ? `culture/${id}` : `sites/${id}`;
        try {
            const response = await api.get(primaryEndpoint);
            setSite(response.data);
            setActualType(urlType); 
        } catch (primaryError) {
            if (primaryError.response && primaryError.response.status === 404) {
                const fallbackType = urlType === 'culture' ? 'heritage' : 'culture';
                const fallbackEndpoint = fallbackType === 'culture' ? `culture/${id}` : `sites/${id}`;
                const fallbackResponse = await api.get(fallbackEndpoint);
                setSite(fallbackResponse.data);
                setActualType(fallbackType); 
            } else { throw primaryError; }
        }
      } catch (error) {
        console.error("Failed to fetch details:", error);
        setSite(null);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchSite();
  }, [id, urlType]);

  if (loading) return <div className="h-screen flex items-center justify-center bg-orange-50"><Loader2 className="w-12 h-12 text-orange-600 animate-spin" /></div>;
  if (!site) return <div className="text-center p-10 text-xl font-serif text-red-900">Item not found in archive.</div>;

  const textVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
  const modelViewerVariants = { hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0 } };
  const rotationVariants = { start: { rotate: 0 }, end: { rotate: 360, transition: { duration: 40, ease: "linear", repeat: Infinity } } };
  
  // Content Mapping
  const contentSections = actualType === 'culture' 
    ? [ { title: "Origins & Mythology", content: site.origins }, { title: "Technique & Attire", content: site.technique }, { title: "Lineage & Community", content: site.lineage }, { title: "Cultural Significance", content: site.significance } ]
    : [ { title: "History & Context", content: site.history }, { title: "Architectural Highlights", content: site.architecture }, { title: "Conservation Efforts", content: site.conservation }, { title: "Modern Relevance", content: site.modernRelevance } ];

  const themeColor = actualType === 'culture' ? 'text-pink-900' : 'text-red-900';
  const highlightColor = actualType === 'culture' ? 'text-pink-700' : 'text-yellow-700';
  const tagBg = actualType === 'culture' ? 'bg-pink-100 text-pink-800 border-pink-200' : 'bg-orange-100 text-orange-800 border-orange-200';
  const borderTheme = actualType === 'culture' ? 'border-pink-500' : 'border-amber-500';

  return (
    <section className={`pt-10 relative overflow-hidden min-h-screen ${actualType === 'culture' ? 'bg-gradient-to-br from-pink-50 to-rose-100' : 'bg-gradient-to-br from-yellow-50 to-orange-100'}`}>
      
      <Link to="/sites" className="absolute top-6 left-6 z-50 p-3 bg-white/80 rounded-full hover:bg-white shadow-sm transition hover:scale-110">
         <ArrowLeft className={`w-6 h-6 ${actualType === 'culture' ? 'text-pink-900' : 'text-amber-900'}`} />
      </Link>

      {GeometricBackground && (
        <motion.img src={GeometricBackground} alt="Pattern" className="absolute hidden sm:inline-block top-1/2 left-1/2 w-[1900px] h-[1900px] -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none opacity-[0.15]" variants={rotationVariants} initial="start" animate="end" />
      )}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/rice-paper.png')" }}></div>

      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-8 relative z-10 h-[calc(100vh-40px)] overflow-hidden">
        
        {/* LEFT COLUMN: 3D Model */}
        <motion.div variants={modelViewerVariants} initial="hidden" animate="visible" className="order-1 md:sticky md:top-1 h-fit flex justify-center p-2 md:p-0">
          <motion.div 
            className={`w-full h-96 md:h-[500px] ${borderTheme} border-4 rounded-3xl overflow-hidden flex items-center justify-center p-2 relative shadow-2xl`}
            style={{ maxWidth: "min(100%, 600px)" }}
            animate={{
              backgroundColor: isDark ? "rgba(15, 23, 42, 0.8)" : "rgba(255, 255, 255, 0.8)",
              borderColor: isDark ? "rgba(255, 255, 255, 0.2)" : undefined,
            }}
          >
            <button onClick={() => setIsDark(!isDark)} className={`absolute top-4 right-4 z-50 p-2 rounded-full backdrop-blur-md shadow-md transition-colors ${isDark ? "bg-slate-800 text-yellow-400" : "bg-white text-orange-500"}`}>
              {isDark ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            
            {/* Error Message if Model Fails */}
            {modelError && (
                <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/10 backdrop-blur-sm p-6 text-center">
                    <AlertCircle className="w-10 h-10 text-red-600 mb-2" />
                    <p className="text-red-900 font-bold bg-white/80 px-4 py-2 rounded-lg shadow-sm">
                        Model failed to load. <br/> 
                        <span className="text-xs font-normal text-gray-800">Google Drive might be blocking the file.</span>
                    </p>
                </div>
            )}

            <ModelViewer
              // 4. USE THE MODEL URL FIXER
              src={getModelUrl(site.glb)}
              poster={getVisibleImage(site.thumb)}
              alt={site.title}
              
              // 5. CRITICAL: Allow cross-origin requests
              crossorigin="anonymous"
              
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
              
              // 6. LOG ERRORS to see what's wrong
              onError={(e) => {
                  console.error("Model Load Error:", e);
                  setModelError(true);
              }}
            >
            </ModelViewer>
          </motion.div>
        </motion.div>

        {/* RIGHT COLUMN: Info */}
        <motion.div variants={textVariants} initial="hidden" animate="visible" className="order-2 h-full overflow-y-scroll pl-2 pr-4 custom-scrollbar pb-32">
          <h2 className={`text-4xl md:text-5xl font-serif font-extrabold ${themeColor} mb-4 pt-2 leading-tight`}>
            <span className={highlightColor}>{site.title}</span>
          </h2>
          <div className="flex gap-2 flex-wrap mb-4">
            {site.tags?.map((tag, i) => (
                <span key={i} className={`px-3 py-1 ${tagBg} text-xs font-bold rounded-full border uppercase tracking-wide`}>{tag}</span>
            ))}
          </div>
          <p className="text-gray-800 text-lg font-light leading-relaxed pb-6 border-b border-yellow-300">{site.summary}</p>
          <div className="pt-6 space-y-8">
            {contentSections.map((section, i) => (
                section.content && (
                    <motion.div key={i} className="p-5 bg-white/80 rounded-xl shadow-md border border-yellow-200/50">
                        <h3 className={`text-xl font-bold ${actualType === 'culture' ? 'text-pink-800' : 'text-red-800'} mb-2`}>{section.title}</h3>
                        <p className="text-gray-700 leading-relaxed text-justify text-sm whitespace-pre-line">{section.content}</p>
                    </motion.div>
                )
             ))}
          </div>
          {/* Time Travel */}
          {actualType === 'heritage' && (site.oldSitePhoto || site.newSitePhoto) && (
            <div className="mt-8 pt-6 border-t-2 border-dashed border-yellow-400/50">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-serif font-extrabold text-red-900"><span className="text-yellow-700">Time Travel:</span> Then vs. Now</h2>
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <div className="bg-white/90 p-4 rounded-xl shadow-lg border-t-4 border-gray-500 relative">
                        <div className="absolute -top-3 left-4 bg-gray-600 text-white px-3 py-1 rounded text-xs font-bold shadow-sm">PAST</div>
                        <div className="h-40 rounded-lg overflow-hidden mb-3 border border-gray-300 bg-gray-100">
                            {site.oldSitePhoto ? <img src={getVisibleImage(site.oldSitePhoto)} referrerPolicy="no-referrer" className="w-full h-full object-cover filter sepia contrast-125" /> : <div className="h-full flex items-center justify-center text-xs text-gray-400">No Photo</div>}
                        </div>
                        <p className="text-gray-600 text-xs italic leading-relaxed">"{site.oldStructureDesc || "No description."}"</p>
                    </div>
                    <div className="bg-white/90 p-4 rounded-xl shadow-lg border-t-4 border-orange-500 relative">
                        <div className="absolute -top-3 right-4 bg-orange-600 text-white px-3 py-1 rounded text-xs font-bold shadow-sm">PRESENT</div>
                        <div className="h-40 rounded-lg overflow-hidden mb-3 border border-orange-200 bg-orange-50">
                            {site.newSitePhoto ? <img src={getVisibleImage(site.newSitePhoto)} referrerPolicy="no-referrer" className="w-full h-full object-cover" /> : <div className="h-full flex items-center justify-center text-xs text-orange-300">No Photo</div>}
                        </div>
                        <p className="text-gray-700 text-xs leading-relaxed">{site.newStructureDesc || "No description."}</p>
                    </div>
                </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}