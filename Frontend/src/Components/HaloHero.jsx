import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Moon, Sun, Loader2, ArrowLeft, AlertCircle, Info } from "lucide-react"; 
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
  const [modelError, setModelError] = useState(false); 

  // --- NEW STATES FOR HOTSPOTS ---
  const [showHotspots, setShowHotspots] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState(null);

  // --- 1. BASE URL HELPER ---
  const getFileUrl = (path) => {
    if (!path) return "";
    if (path.includes("localhost:3000")) return path.replace("3000", "4000");
    if (path.startsWith("http") || path.startsWith("https")) return path;
    return `${import.meta.env.VITE_API_BASE_URL}/${path.replace(/^\//, "")}`;
  };

  // --- 2. IMAGE FIXER ---
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

  // --- 3. MODEL URL FIXER ---
  const getModelUrl = (path) => {
    if (!path) return "";
    if (path.includes("drive.google.com") && path.includes("id=")) {
      try {
        const id = path.split("id=")[1].split("&")[0];
        return `${import.meta.env.VITE_API_BASE_URL}/api/proxy-model?id=${id}`;
      } catch (e) {
        console.error("Error parsing Drive ID", e);
        return path;
      }
    }
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

  // Handle Hotspot Clicks
  const handleHotspotClick = (index, event) => {
    event.stopPropagation(); // Prevent model rotation
    if (activeHotspot === index) {
      setActiveHotspot(null); // Close if already open
    } else {
      setActiveHotspot(index); // Open new one
    }
  };

  // Close annotations when clicking background
  const handleBackgroundClick = () => {
    setActiveHotspot(null);
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-orange-50"><Loader2 className="w-12 h-12 text-orange-600 animate-spin" /></div>;
  if (!site) return <div className="text-center p-10 text-xl font-serif text-red-900">Item not found in archive.</div>;

  const textVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
  const modelViewerVariants = { hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0 } };
  const rotationVariants = { start: { rotate: 0 }, end: { rotate: 360, transition: { duration: 40, ease: "linear", repeat: Infinity } } };
  
  const contentSections = actualType === 'culture' 
    ? [ { title: "Origins & Mythology", content: site.origins }, { title: "Technique & Attire", content: site.technique }, { title: "Lineage & Community", content: site.lineage }, { title: "Cultural Significance", content: site.significance } ]
    : [ { title: "History & Context", content: site.history }, { title: "Architectural Highlights", content: site.architecture }, { title: "Conservation Efforts", content: site.conservation }, { title: "Modern Relevance", content: site.modernRelevance } ];

  const themeColor = actualType === 'culture' ? 'text-pink-900' : 'text-red-900';
  const highlightColor = actualType === 'culture' ? 'text-pink-700' : 'text-yellow-700';
  const tagBg = actualType === 'culture' ? 'bg-pink-100 text-pink-800 border-pink-200' : 'bg-orange-100 text-orange-800 border-orange-200';
  const borderTheme = actualType === 'culture' ? 'border-pink-500' : 'border-amber-500';

  return (
    <section className={`pt-10 relative overflow-hidden min-h-screen ${actualType === 'culture' ? 'bg-gradient-to-br from-pink-50 to-rose-100' : 'bg-gradient-to-br from-yellow-50 to-orange-100'}`} onClick={handleBackgroundClick}>
      
      {/* UPDATED STYLES FOR HOTSPOTS & ANNOTATIONS */}
      <style>{`
        .Hotspot {
          background: #ffffff;
          border-radius: 50%;
          width: 12px;
          height: 12px;
          border: 2px solid #007bff;
          cursor: pointer;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
          transition: all 0.3s ease;
          display: block;
          position: relative;
          opacity: 0.5;
        }
        .Hotspot.hidden {
          display: none;
        }
        .Hotspot:hover, .Hotspot.active {
          transform: scale(1.3);
          opacity: 1;
          border-color: #0056b3;
          z-index: 10;
        }

        /* --- REDUCED ANNOTATION SIZE --- */
        .HotspotAnnotation {
          display: none;
          background: #ffffff;
          border-radius: 6px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          
          /* Reduced Padding */
          padding: 8px 10px;
          
          position: absolute;
          
          /* Reduced Width */
          width: 180px;
          
          left: 20px;
          top: -10px;
          color: #333;
          line-height: 1.3;
          z-index: 100;
          pointer-events: auto;
          text-align: left;
          font-family: 'Segoe UI', sans-serif;
        }
        
        /* Tablet/Desktop Width */
        @media (min-width: 600px) {
           .HotspotAnnotation { width: 220px; }
        }

        .Hotspot.active .HotspotAnnotation {
          display: block;
        }
        
        /* Reduced Font Sizes */
        .HotspotAnnotation h3 {
          margin: 0 0 4px 0;
          font-size: 13px; /* Smaller header */
          color: #007bff;
          font-weight: bold;
        }
        .HotspotAnnotation p {
          margin: 0;
          font-size: 11px; /* Smaller text */
        }
      `}</style>

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
            {/* Theme Toggle */}
            <button onClick={() => setIsDark(!isDark)} className={`absolute top-4 right-4 z-50 p-2 rounded-full backdrop-blur-md shadow-md transition-colors ${isDark ? "bg-slate-800 text-yellow-400" : "bg-white text-orange-500"}`}>
              {isDark ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            
            {/* Toggle Info Points Button */}
            <button 
                onClick={(e) => { e.stopPropagation(); setShowHotspots(!showHotspots); }}
                className="absolute top-4 left-4 z-50 px-3 py-2 rounded-md backdrop-blur-md shadow-md transition-colors bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 flex items-center gap-2"
            >
                <Info size={16} />
                
            </button>

            {/* Error Message */}
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
              src={getModelUrl(site.glb)}
              poster={getVisibleImage(site.thumb)}
              alt={site.title}
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
              onError={(e) => {
                  console.error("Model Load Error:", e);
                  setModelError(true);
              }}
            >
                {/* --- HOTSPOTS --- */}
                
                <button 
                    className={`Hotspot ${!showHotspots ? 'hidden' : ''} ${activeHotspot === 1 ? 'active' : ''}`} 
                    slot="hotspot-1" 
                    data-position="0.11996549136712897m -0.660297867924796m -4.4235828999931535m" 
                    data-normal="-0.947823850017628m 0.25515014115177137m 0.1911239252631453m"
                    onClick={(e) => handleHotspotClick(1, e)}
                >
                    <div className="HotspotAnnotation">
                        <h3>Main Tower (Vimana)</h3>
                        <p>Principal shrine of the temple housing the main deity. Tallest structure, symbolizing Mount Meru.</p>
                    </div>
                </button>

                <button 
                    className={`Hotspot ${!showHotspots ? 'hidden' : ''} ${activeHotspot === 2 ? 'active' : ''}`} 
                    slot="hotspot-2" 
                    data-position="1.036577382153329m -0.5674720091017866m -4.416159482058665m" 
                    data-normal="0.9401525064778996m 0.2853078229403957m 0.18631347437137996m"
                    onClick={(e) => handleHotspotClick(2, e)}
                >
                    <div className="HotspotAnnotation">
                        <h3>Main Tower (Vimana)</h3>
                        <p>Principal shrine of the temple housing the main deity. Tallest structure, symbolizing Mount Meru.</p>
                    </div>
                </button>

                <button 
                    className={`Hotspot ${!showHotspots ? 'hidden' : ''} ${activeHotspot === 3 ? 'active' : ''}`} 
                    slot="hotspot-3" 
                    data-position="0.8600527644693159m -1.810127178146242m -3.6297291483192353m" 
                    data-normal="0.9944476538041479m 0.09018357827068177m -0.054229014869548106m"
                    onClick={(e) => handleHotspotClick(3, e)}
                >
                    <div className="HotspotAnnotation">
                        <h3>Subsidiary Towers</h3>
                        <p>Smaller supporting towers surrounding the main shrine. Follow the traditional Kalinga temple layout.</p>
                    </div>
                </button>

                <button 
                    className={`Hotspot ${!showHotspots ? 'hidden' : ''} ${activeHotspot === 5 ? 'active' : ''}`} 
                    slot="hotspot-5" 
                    data-position="-0.37826918008487875m -1.7633185397736653m -4.344624581895653m" 
                    data-normal="-0.9775031129394942m 0.10297211283885144m 0.1840771799303251m"
                    onClick={(e) => handleHotspotClick(5, e)}
                >
                    <div className="HotspotAnnotation">
                        <h3>Subsidiary Towers</h3>
                        <p>Smaller supporting towers surrounding the main shrine. Follow the traditional Kalinga temple layout.</p>
                    </div>
                </button>

                <button 
                    className={`Hotspot ${!showHotspots ? 'hidden' : ''} ${activeHotspot === 7 ? 'active' : ''}`} 
                    slot="hotspot-7" 
                    data-position="0.8542837741519639m -1.957261798408358m -1.2470051002202132m" 
                    data-normal="-0.07848740415918834m 0.4769908079952241m 0.8753967651736072m"
                    onClick={(e) => handleHotspotClick(7, e)}
                >
                    <div className="HotspotAnnotation">
                        <h3>Jagamohana (Assembly Hall)</h3>
                        <p>Congregational hall where devotees gather for worship. Located between the entrance and the main shrine.</p>
                    </div>
                </button>

                <button 
                    className={`Hotspot ${!showHotspots ? 'hidden' : ''} ${activeHotspot === 9 ? 'active' : ''}`} 
                    slot="hotspot-9" 
                    data-position="-0.507225121310278m -2.125322541126483m -2.015098956156416m" 
                    data-normal="-0.9068184247570564m 0.4181626190721036m 0.05310714200453255m"
                    onClick={(e) => handleHotspotClick(9, e)}
                >
                    <div className="HotspotAnnotation">
                        <h3>Jagamohana (Assembly Hall)</h3>
                        <p>Congregational hall where devotees gather for worship. Located between the entrance and the main shrine.</p>
                    </div>
                </button>

                <button 
                    className={`Hotspot ${!showHotspots ? 'hidden' : ''} ${activeHotspot === 10 ? 'active' : ''}`} 
                    slot="hotspot-10" 
                    data-position="0.5187906325037172m -3.7098099554956656m -0.5154049424781284m" 
                    data-normal="0.01908744330093676m 0.2493435412024196m 0.968226971308314m"
                    onClick={(e) => handleHotspotClick(10, e)}
                >
                    <div className="HotspotAnnotation">
                        <h3>Temple Entrance</h3>
                        <p>Ceremonial gateway aligned with the sun’s path. Marks the formal entry into the temple complex.</p>
                    </div>
                </button>

                <button 
                    className={`Hotspot ${!showHotspots ? 'hidden' : ''} ${activeHotspot === 12 ? 'active' : ''}`} 
                    slot="hotspot-12" 
                    data-position="0.5360795957505438m -3.453914319217133m -4.229035932376426m" 
                    data-normal="0.008220999659640823m 0.03487495039243339m 0.9993578703346073m"
                    onClick={(e) => handleHotspotClick(12, e)}
                >
                    <div className="HotspotAnnotation">
                        <h3>Dedicated to Surya</h3>
                        <p>The temple is dedicated to Surya, the Hindu Sun God. Surya is worshipped as the source of life.</p>
                    </div>
                </button>

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
                            {site.oldSitePhoto ? <img src={getVisibleImage(site.oldSitePhoto)} referrerPolicy="no-referrer" className="w-full h-full object-cover filter sepia contrast-125" alt="Past" /> : <div className="h-full flex items-center justify-center text-xs text-gray-400">No Photo</div>}
                        </div>
                        <p className="text-gray-600 text-xs italic leading-relaxed">"{site.oldStructureDesc || "No description."}"</p>
                    </div>
                    <div className="bg-white/90 p-4 rounded-xl shadow-lg border-t-4 border-orange-500 relative">
                        <div className="absolute -top-3 right-4 bg-orange-600 text-white px-3 py-1 rounded text-xs font-bold shadow-sm">PRESENT</div>
                        <div className="h-40 rounded-lg overflow-hidden mb-3 border border-orange-200 bg-orange-50">
                            {site.newSitePhoto ? <img src={getVisibleImage(site.newSitePhoto)} referrerPolicy="no-referrer" className="w-full h-full object-cover" alt="Present" /> : <div className="h-full flex items-center justify-center text-xs text-orange-300">No Photo</div>}
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