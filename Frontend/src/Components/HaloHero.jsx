import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, BookOpen, Sidebar, Moon, Sun } from "lucide-react"; // Added Moon/Sun
import GeometricBackground from "../assets/indMan.png";
import { SITES } from "../data/sites";
import { useParams } from "react-router-dom";

// Ensure this component handles resizing correctly
const ModelViewer = (props) => <model-viewer {...props} />;

export default function HaloHero() {
  const { id } = useParams();
  const site = SITES.find((s) => s.id === id);

  // 1. State for the Theme Toggle
  const [isDark, setIsDark] = useState(false);

  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 70,
        damping: 10,
        staggerChildren: 0.2,
      },
    },
  };

  const modelViewerVariants = {
    hidden: { opacity: 0, x: -50, scale: 0.95 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 70,
        damping: 10,
        delay: 0.5,
      },
    },
  };

  const rotationVariants = {
    start: { rotate: 0 },
    end: {
      rotate: 360,
      transition: {
        duration: 40,
        ease: "linear",
        repeat: Infinity,
      },
    },
  };

  const generateLongContent = () => {
    const sections = [];
    const titles = [
      "History & Context",
      "Architectural Highlights",
      "Conservation Efforts",
      "Modern Relevance",
    ];
    const text =
      "This section provides extensive details about the model, including its historical background, construction methods, and cultural impact. Scroll down to read more about the intricate details of this heritage site and its significance in world history. The fixed 3D model on the left ensures you always have a visual reference as you delve into the text.";

    for (let i = 0; i < 4; i++) {
      sections.push(
        <motion.div
          key={i}
          className="mb-12 p-6 bg-white/70 rounded-xl shadow-lg border border-yellow-200"
        >
          <h3 className="text-2xl font-bold text-red-800 mb-3">{titles[i]}</h3>
          <p className="text-gray-700">{text.repeat(i + 1)}</p>
        </motion.div>
      );
    }
    return sections;
  };

  return (
    <section className="bg-gradient-to-br from-yellow-50 to-orange-100 pt-10 relative overflow-hidden">
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
        
        {/* === LEFT COLUMN: 3D Model Viewer (FIXED) === */}
        <motion.div
          variants={modelViewerVariants}
          initial="hidden"
          animate="visible"
          className="order-1  md:sticky md:top-1 h-fit flex justify-center p-4 md:p-0"
        >
          {/* 2. Enhanced Container with Theme State 
              We use `animate` to smoothly interpolate colors and shadows
          */}
          <motion.div
            className="w-full h-96 md:h-[500px] border-amber-500 border-5 rounded-3xl overflow-hidden flex items-center justify-center p-2 relative"
            style={{ maxWidth: "min(100%, 600px)" }}
            
            // Dynamic Styles based on isDark state
            animate={{
              backgroundColor: isDark 
                ? "rgba(15, 23, 42, 0.8)"   // Dark Slate Backdrop
                : "rgba(255, 255, 255, 0.5)", // Light Backdrop
              
                borderColor: isDark 
                  ? "rgba(234, 179, 8, 0.3)"  // Dim Gold Border
                  : "rgba(253, 224, 71, 1)",  // Bright Yellow Border
                
                boxShadow: !isDark
                  ? "0px 20px 50px -10px rgba(0,0,0,0.9), 0px 0px 30px rgba(234, 179, 8, 0.15)" // Dark shadow + Gold Glow
                  : "0px 20px 40px -5px rgba(0,0,0,0.15), 0px 8px 10px -6px rgba(0,0,0,0.1)", // Soft Light Shadow
            }}
            
         
            transition={{ duration: 0.5, ease: "easeInOut" }}
            
        
          >
            
            {/* 3. Theme Toggle Button */}
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
              src={site?.glb} // Added optional chaining for safety
              alt="3D Model"
              ar
              ar-modes="webxr scene-viewer quick-look"
              camera-controls
              touch-action="pan-y"
              auto-rotate
              shadow-intensity={isDark ? "2" : "1"} // Stronger shadow in dark mode
              environment-image="neutral"
              className="w-full h-full"
            />
          </motion.div>
        </motion.div>

        {/* --- --- --- --- --- --- --- */}

        {/* === RIGHT COLUMN: Model Information Panel === */}
        <motion.div
          variants={textVariants}
          initial="hidden"
          animate="visible"
          className="order-2 h-full overflow-y-scroll pl-4 pr-8 custom-scrollbar"
        >
          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-serif font-extrabold text-red-900 leading-tight drop-shadow-md mb-8 pt-4"
            variants={textVariants}
          >
            <span className="text-yellow-700">Detailed</span> Model Information
          </motion.h2>

          <motion.p
            className="mt-6 text-gray-800 text-xl font-light leading-relaxed pb-8 border-b border-yellow-300"
            variants={textVariants}
          >
            This immersive view allows you to inspect the model while continuously
            scrolling through its documentation, architectural history, and
            interactive details.
          </motion.p>

          <div className="pt-8">{generateLongContent()}</div>

          <motion.div
            className="mt-8 flex flex-col sm:flex-row gap-4 mb-32"
            variants={textVariants}
          ></motion.div>
        </motion.div>
      </div>
    </section>
  );
}