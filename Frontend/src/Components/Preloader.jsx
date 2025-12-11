import React from "react";
import { motion } from "framer-motion";
import Mandala from "../assets/indMan.png"; 
import Logo from "../assets/2025.png"; 

export default function Preloader() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-orange-50 overflow-hidden"
    >
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/rice-paper.png')" }}></div>

      <div className="relative flex flex-col items-center justify-center">
        
        {/* 1. THE ROTATING MANDALA (Now Much Larger) */}
        <motion.div
          className="absolute"
          animate={{ rotate: 360 }}
          transition={{ 
            duration: 20, // Slower rotation looks more majestic for large images
            ease: "linear", 
            repeat: Infinity 
          }}
        >
          <img 
            src={Mandala} 
            alt="Loading..." 
            
            className="w-[650px] h-[650px] md:w-[900px] md:h-[900px] opacity-15 object-contain drop-shadow-2xl" 
          >

          </img>
        </motion.div>

        {/* 2. CENTER CONTENT */}
        <div className="z-10 flex flex-col items-center justify-center">
            
            {/* Logo Image */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="mb-6"
            >
               <img 
                 src={Logo} 
                 alt="HoloHeri Logo" 
                 className="w-28 rounded-full border-amber-600 border-1 h-28 md:w-40 md:h-40 object-contain drop-shadow-md" 
               />
            </motion.div>

            {/* App Name */}
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-4xl md:text-6xl font-serif font-extrabold text-red-900 tracking-wider text-center"
            >
              Holo<span className="text-yellow-700">Heri</span>
            </motion.h1>



            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="text-sm md:text-lg text-amber-800 mt-2 font-medium tracking-widest uppercase text-center"
            >
              Sanskriti · Virasat · Kahaniyan
            </motion.p>
        </div>

      </div>
    </motion.div>
  );
}