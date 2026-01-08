import React from "react";
import { motion } from "framer-motion";
import { Briefcase, PenTool, Code, Search, Send, MapPin, Clock } from "lucide-react";
import Mandala from "../assets/indMan.png"; 
import Navbar from "../Components/Navbar";

const Careers = () => {
  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 40 } }
  };

  // Job Listings Data
  const jobs = [
    {
      id: 1,
      title: "3D Heritage Artist",
      type: "Full-time",
      location: "Sangli (Hybrid)",
      icon: <PenTool className="w-6 h-6 text-white" />,
      desc: "Expert in Blender/Maya? We need someone to sculpt intricate temple carvings and optimize high-poly scans for the web (GLB/glTF pipelines).",
      tags: ["Blender", "Texturing", "Optimization"]
    },
    {
      id: 2,
      title: "Historical Researcher",
      type: "Internship",
      location: "Remote / On-site",
      icon: <Search className="w-6 h-6 text-white" />,
      desc: "Dig into archives and mythology. You will be responsible for writing the 'Story' behind every monument we digitize.",
      tags: ["History", "Content Writing", "Research"]
    },
    {
      id: 3,
      title: "Frontend Developer",
      type: "Part-time",
      location: "Remote",
      icon: <Code className="w-6 h-6 text-white" />,
      desc: "Help us build the holographic web interface using React, Three.js, and Framer Motion. Knowledge of WebXR is a plus.",
      tags: ["React", "Three.js", "Tailwind"]
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
          alt="Mandala Background"
          className="absolute top-0 right-0 w-[800px] h-[800px] translate-x-1/3 -translate-y-1/4 z-0 pointer-events-none opacity-[0.08]"
          animate={{ rotate: 360 }}
          transition={{ duration: 80, ease: "linear", repeat: Infinity }}
        />
      )}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/rice-paper.png')" }}></div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        
        {/* Header Section */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Briefcase className="w-12 h-12 text-yellow-700 mx-auto mb-4" />
          <h1 className="text-4xl md:text-6xl font-serif font-extrabold text-red-900 mb-4">
            Build the <span className="text-yellow-700">Future</span> of the Past
          </h1>
          <p className="text-xl text-gray-700 font-light max-w-2xl mx-auto leading-relaxed">
            At Heritage Lab, we aren't just writing code or making models. We are preserving civilization's greatest stories. Join us in our mission to digitize India's history.
          </p>
        </motion.div>

        {/* Job Listings Container */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {jobs.map((job) => (
            <motion.div 
              key={job.id} 
              variants={cardVariants}
              whileHover={{ y: -10 }}
              className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-yellow-200 flex flex-col justify-between h-full hover:shadow-2xl transition-all duration-300"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-red-900 rounded-lg shadow-md">
                    {job.icon}
                  </div>
                  <span className="text-xs font-bold bg-orange-100 text-orange-800 px-3 py-1 rounded-full border border-orange-200 uppercase tracking-wide">
                    {job.type}
                  </span>
                </div>
                
                <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">{job.title}</h3>
                
                <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
                  <span className="flex items-center"><MapPin className="w-3 h-3 mr-1" /> {job.location}</span>
                </div>

                <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                  {job.desc}
                </p>

                {/* Skills Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {job.tags.map((tag, i) => (
                    <span key={i} className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded border border-gray-200">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <motion.a
                href={`mailto:careers@holoheritage.in?subject=Application for ${job.title}`}
                whileTap={{ scale: 0.95 }}
                className="w-full mt-auto bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 rounded-xl flex items-center justify-center space-x-2 transition-colors shadow-md"
              >
                <span>Apply Now</span>
                <Send className="w-4 h-4" />
              </motion.a>
            </motion.div>
          ))}
        </motion.div>

        {/* General Application Section */}
        <motion.div 
          className="mt-20 bg-red-900 rounded-3xl p-10 text-center relative overflow-hidden shadow-2xl"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          
          <h2 className="text-3xl font-serif font-bold text-white mb-4 relative z-10">Don't see your role?</h2>
          <p className="text-yellow-100 mb-8 max-w-xl mx-auto relative z-10">
            We are always looking for passionate historians, archaeologists, and creative technologists. If you think you can contribute to the Heritage Lab, say hello.
          </p>
          
          <a 
            href="mailto:careers@holoheritage.in?subject=General Application"
            className="inline-flex items-center bg-white text-red-900 font-bold px-8 py-3 rounded-full hover:bg-yellow-50 transition-colors shadow-lg relative z-10"
          >
            Send your Resume
          </a>
        </motion.div>

      </div>
    </section>
     </>
  );
};

export default Careers;