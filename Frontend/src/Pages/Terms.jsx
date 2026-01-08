import React from "react";
import { motion } from "framer-motion";
import { Scale, Shield, Copyright, FileText, AlertCircle } from "lucide-react";
import Mandala from "../assets/indMan.png"; 
import Navbar from "../Components/Navbar";

const Terms = () => {
  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <>
    <Navbar/>
   
    <section className="relative min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 py-20 overflow-hidden">
      
      {/* 🌟 Background Elements */}
      {Mandala && (
        <motion.img
          src={Mandala}
          alt="Mandala"
          className="absolute top-0 left-0 w-[1000px] h-[1000px] -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none opacity-[0.05]"
          animate={{ rotate: 360 }}
          transition={{ duration: 120, ease: "linear", repeat: Infinity }}
        />
      )}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/rice-paper.png')" }}></div>

      <div className="max-w-5xl mx-auto px-4 relative z-10">
        
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Scale className="w-12 h-12 text-yellow-700 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-serif font-extrabold text-red-900 mb-2">
            Terms & <span className="text-yellow-700">Conditions</span>
          </h1>
          <p className="text-gray-600">Last Updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </motion.div>

        {/* The "Scroll" / Legal Document Container */}
        <motion.div 
          className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-xl border border-yellow-200 overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header Strip */}
          <div className="bg-red-900 p-4 text-center">
            <p className="text-yellow-50 text-sm font-medium tracking-widest uppercase">Official Site Policy • Heritage Lab</p>
          </div>

          <div className="p-8 md:p-12 space-y-10">
            
            {/* Clause 1: Introduction */}
            <motion.div variants={itemVariants}>
              <div className="flex items-center space-x-3 mb-3">
                <FileText className="text-yellow-700 w-6 h-6" />
                <h3 className="text-xl font-serif font-bold text-gray-900">1. Acceptance of Terms</h3>
              </div>
              <p className="text-gray-700 leading-relaxed text-justify">
                By accessing and using <strong>HoloHeri</strong> (the "Website"), you agree to comply with and be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our website. These terms are governed by the laws of India.
              </p>
            </motion.div>

            <div className="w-full h-px bg-yellow-200/60"></div>

            {/* Clause 2: Intellectual Property */}
            <motion.div variants={itemVariants}>
              <div className="flex items-center space-x-3 mb-3">
                <Copyright className="text-yellow-700 w-6 h-6" />
                <h3 className="text-xl font-serif font-bold text-gray-900">2. Intellectual Property Rights</h3>
              </div>
              <p className="text-gray-700 leading-relaxed text-justify mb-2">
                All content on this website, including but not limited to:
              </p>
              <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                <li>3D Models (.glb/.gltf files)</li>
                <li>Holographic renders and animations</li>
                <li>Historical narratives, text, and code</li>
              </ul>
              <p className="text-gray-700 leading-relaxed text-justify mt-2">
                ...are the exclusive property of <strong>Heritage Lab</strong> or its content creators and are protected by Indian Copyright Law and international treaties. You may not reproduce, distribute, or reverse-engineer our 3D assets without explicit written permission.
              </p>
            </motion.div>

            <div className="w-full h-px bg-yellow-200/60"></div>

            {/* Clause 3: User Conduct */}
            <motion.div variants={itemVariants}>
              <div className="flex items-center space-x-3 mb-3">
                <Shield className="text-yellow-700 w-6 h-6" />
                <h3 className="text-xl font-serif font-bold text-gray-900">3. Permitted Use</h3>
              </div>
              <p className="text-gray-700 leading-relaxed text-justify">
                You are granted a limited license to access and use the website for personal, educational, and non-commercial purposes only. You agree not to use the site for any unlawful purpose or to conduct any activity that would disrupt or damage the website's functionality (e.g., scraping, data mining, or introducing viruses).
              </p>
            </motion.div>

            <div className="w-full h-px bg-yellow-200/60"></div>

            {/* Clause 4: Disclaimer */}
            <motion.div variants={itemVariants}>
              <div className="flex items-center space-x-3 mb-3">
                <AlertCircle className="text-yellow-700 w-6 h-6" />
                <h3 className="text-xl font-serif font-bold text-gray-900">4. Disclaimer of Accuracy</h3>
              </div>
              <p className="text-gray-700 leading-relaxed text-justify">
                While we strive for historical accuracy, our 3D reconstructions and narratives are artistic interpretations based on available archaeological data. Heritage Lab does not guarantee that all information is 100% historically precise or complete. The content is provided "as is" for educational visualization.
              </p>
            </motion.div>

            <div className="w-full h-px bg-yellow-200/60"></div>

            {/* Clause 5: Jurisdiction */}
            <motion.div variants={itemVariants}>
              <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">5. Governing Law & Jurisdiction</h3>
              <p className="text-gray-700 leading-relaxed text-justify">
                These terms shall be governed by and construed in accordance with the laws of India. Any disputes arising under or in connection with these terms shall be subject to the exclusive jurisdiction of the courts located in <span className="font-semibold text-red-900">Sangli, Maharashtra</span>.
              </p>
            </motion.div>

          </div>

          {/* Footer Strip */}
          <div className="bg-gray-50 p-6 border-t border-yellow-200 text-center">
            <p className="text-sm text-gray-500">
              Questions regarding these terms? <a href="/contact" className="text-yellow-700 font-bold hover:underline">Contact us</a>
            </p>
          </div>

        </motion.div>
      </div>
    </section>
     </>
  );
};

export default Terms;