import React from "react";
import { motion } from "framer-motion";
import { Scroll, Users, Globe, Target } from "lucide-react";
import Mandala from "../assets/indMan.png"; // Ensure this path is correct
import NavBar from "../Components/Navbar";
import Navbar from "../Components/Navbar";

const About = () => {
  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 50 } }
  };

  const rotationVariants = {
    start: { rotate: 0 },
    end: { rotate: 360, transition: { duration: 60, ease: "linear", repeat: Infinity } }
  };

  // Content Data
  const features = [
    {
      icon: <Scroll className="w-8 h-8 text-yellow-700" />,
      title: "Preserving History",
      desc: "Digitizing India's monuments into high-fidelity 3D models to ensure they live forever in the digital realm."
    },
    {
      icon: <Users className="w-8 h-8 text-yellow-700" />,
      title: "Cultural Storytelling",
      desc: "Weaving mythology and facts together to create immersive narratives that resonate with modern audiences."
    },
    {
      icon: <Globe className="w-8 h-8 text-yellow-700" />,
      title: "Global Access",
      desc: "Making India's rich heritage accessible to anyone, anywhere, through web-based holographic technology."
    }
  ];

  return (
    <>
    <Navbar/>
 
    <section className="relative min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 py-20 overflow-hidden">
      
      {/* 🌟 Background Elements */}
      {Mandala && (
              <motion.img
                src={Mandala}
                alt="Geometric Indian Mandala Pattern"
                className="absolute top-1/2 md:inline-block hidden left-1/2 w-[1900px] h-[1900px] -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none"
                style={{ opacity: 0.15 }} // Increased opacity slightly from 0.05 to 0.08 for better presence
                variants={rotationVariants}
                initial="start"
                animate="end"
              />
            )}
     
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/rice-paper.png')" }}></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header Section */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-serif font-extrabold text-red-900 mb-6 drop-shadow-sm">
            Bridging the <span className="text-yellow-700">Past</span> & <span className="text-yellow-700">Future</span>
          </h1>
          <p className="text-xl text-gray-700 font-light leading-relaxed">
            HoloHeritage is a dedicated initiative to preserve India's architectural marvels using cutting-edge holographic technology. We believe history shouldn't just be read—it should be experienced.
          </p>
        </motion.div>

        {/* Vision Cards */}
        <motion.div 
          className="grid md:grid-cols-3 gap-8 mb-20"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {features.map((item, idx) => (
            <motion.div 
              key={idx}
              variants={itemVariants}
              className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl border-b-4 border-yellow-600 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                {item.icon}
              </div>
              <h3 className="text-2xl font-serif font-bold text-red-900 mb-3">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Mission Statement */}
        <motion.div 
          className="bg-red-900 rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Decorative Circle */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-500 rounded-full blur-[80px] opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
          
          <Target className="w-12 h-12 text-yellow-400 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Our Mission</h2>
          <p className="text-lg md:text-xl text-yellow-50 font-light max-w-4xl mx-auto leading-relaxed">
            "To build the world's most comprehensive digital archive of Indian heritage, ensuring that the intricate craftsmanship of our ancestors is never lost to time, decay, or disaster."
          </p>
        </motion.div>

      </div>
    </section>
       
    </>
  );
};

export default About;