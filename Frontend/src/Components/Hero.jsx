import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react"; 
import HomeBanner from "../assets/HomeBanner.png"; 
import Mandala from "../assets/indMan.png" // The imported Mandala image
import { Link } from "react-router-dom";

export default function Hero() {
  // Animation variants for the text content
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

  // Animation variants for the image
  const imageVariants = {
    hidden: { opacity: 0, x: 50, scale: 0.95 },
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

  // 🌀 Rotation Animation for the Mandala (Constant Speed)
  const rotationVariants = {
    start: { rotate: 0 },
    end: {
      rotate: 360,
      transition: {
        duration: 40, // Adjust duration for speed (e.g., 40s for a slow, constant spin)
        ease: "linear",
        repeat: Infinity,
      },
    },
  };

  return (
    <section className="bg-gradient-to-br from-yellow-50 to-orange-100 py-10 h-[calc(100vh-4rem)] md:py-24 relative overflow-hidden">
      
      {/* 🌟 Rotating Mandala Background Element */}
      {Mandala && (
        <motion.img
          src={Mandala}
          alt="Geometric Indian Mandala Pattern"
          className="absolute top-1/2 md:inline-block hidden left-1/2 w-[1900px] h-[1900px] -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none"
          style={{ opacity: 0.2 }} // Increased opacity slightly from 0.05 to 0.08 for better presence
          variants={rotationVariants}
          initial="start"
          animate="end"
        />
      )}

      {/* Rice Paper Texture Overlay (Keep) */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/rice-paper.png')" }}></div>

      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* Left Column: Text Content */}
        <motion.div
          variants={textVariants}
          initial="hidden"
          animate="visible"
          className="order-2 md:order-1"
        >
          <motion.h1 
            className="text-[47px] md:text-6xl lg:text-7xl font-serif font-extrabold text-red-900 leading-tight drop-shadow-md"
            variants={textVariants}
          >
            <span className="text-yellow-700 ">Explore</span> India's Living Heritage
          </motion.h1>

          <motion.p 
            className="mt-6 text-gray-800 text-lg md:text-xl font-light leading-relaxed"
            variants={textVariants}
          >
            Delve into interactive holographic experiences for historic sites — view 3D models, 
            read timeless stories, and bring them to life with your pyramid display.
          </motion.p>

          <motion.div 
            className="mt-15 sm:mt-8 flex flex-row justify-between sm:justify-start sm:flex-row gap-4"
            variants={textVariants}
          >
            <Link to='/sites'>
            <motion.a 
              
              className="inline-flex items-center justify-center px-8 py-4  bg-yellow-600 hover:bg-yellow-700 text-red-900 font-bold sm:text-lg  rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-b-4 border-yellow-700"
              whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0,0,0,0.3)" }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Sites <ArrowRight className="ml-2 w-5 h-5" />
            </motion.a>
            </Link>
            <Link to='/about'>
            <motion.div 
              
              className="inline-flex items-center justify-center  px-8 py-4 bg-white/90 hover:bg-white text-yellow-800 font-semibold sm:text-lg rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 border-b-2 border-gray-200"
              whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0,0,0,0.15)" }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More <BookOpen className="ml-2 w-5 h-5" />
            </motion.div>
            </Link>
          </motion.div>
        </motion.div>

        {/* Right Column: Image with Advanced Hover Animation */}
        <motion.div 
          className="order-1 md:order-2 flex justify-center p-4 md:p-0 relative"
          variants={imageVariants}
          initial="hidden"
          animate="visible"
        >
          {HomeBanner && (
            <motion.div
              className="relative rounded-3xl shadow-2xl border-4 border-yellow-300 overflow-hidden cursor-pointer rotate-3 hover:rotate-0 transition-transform duration-500 ease-in-out"
              style={{ maxWidth: 'min(100%, 600px)' }}
              whileHover={{
                scale: 1.02,
                boxShadow: "0px 15px 30px rgba(0, 0, 0, 0.4)",
              }}
            >
              <img 
                src={HomeBanner} 
                alt="Holographic display of Indian heritage" 
                className="max-w-full h-auto object-cover"
              />

              {/* 💧 Holographic Water Ripple Overlay */}
              <motion.div
                className="absolute inset-0 z-10 pointer-events-none rounded-3xl"
                initial={{ opacity: 0 }}
                whileHover={{
                  opacity: 1,
                  filter: 'url(#wavy)',
                }}
                transition={{ duration: 0.4 }}
                style={{
                  background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 70%)',
                }}
              />
              
            </motion.div>
          )}

          {/* SVG Filter for the "Wavy" effect (Hidden from view) */}
          <svg style={{ position: 'absolute', top: 0, left: 0, width: 0, height: 0 }} xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="wavy">
                <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="1" result="turbulence"/>
                <feDisplacementMap in2="turbulence" in="SourceGraphic" scale="20" xChannelSelector="R" yChannelSelector="G"/>
              </filter>
            </defs>
          </svg>

        </motion.div>
      </div>
    </section>
  );
}