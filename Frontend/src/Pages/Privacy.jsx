import React from "react";
import { motion } from "framer-motion";
import { Lock, Eye, Database, Cookie, Mail, UserCheck } from "lucide-react";
import Mandala from "../assets/indMan.png"; 
import Navbar from "../Components/Navbar";

const Privacy = () => {
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
          alt="Mandala Background"
          className="absolute top-1/2 right-0 w-[900px] h-[900px] translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none opacity-[0.05]"
          animate={{ rotate: -360 }}
          transition={{ duration: 100, ease: "linear", repeat: Infinity }}
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
          <Lock className="w-12 h-12 text-yellow-700 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-serif font-extrabold text-red-900 mb-2">
            Privacy <span className="text-yellow-700">Policy</span>
          </h1>
          <p className="text-gray-600">Effective Date: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </motion.div>

        {/* The Policy Container */}
        <motion.div 
          className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-xl border border-yellow-200 overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header Strip */}
          <div className="bg-red-900 p-4 text-center">
            <p className="text-yellow-50 text-sm font-medium tracking-widest uppercase">Your Data Protection • Heritage Lab</p>
          </div>

          <div className="p-8 md:p-12 space-y-10">
            
            {/* Section 1: Introduction */}
            <motion.div variants={itemVariants}>
              <p className="text-gray-700 leading-relaxed text-justify">
                At <strong>HoloHeritage</strong> (operated by Heritage Lab, Sangli), we value your trust and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data when you visit our website, in compliance with the Information Technology Act, 2000, and applicable Indian laws.
              </p>
            </motion.div>

            <div className="w-full h-px bg-yellow-200/60"></div>

            {/* Section 2: What We Collect */}
            <motion.div variants={itemVariants}>
              <div className="flex items-center space-x-3 mb-4">
                <Database className="text-yellow-700 w-6 h-6" />
                <h3 className="text-xl font-serif font-bold text-gray-900">1. Information We Collect</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-orange-50 p-5 rounded-lg border border-orange-100">
                  <h4 className="font-bold text-red-900 mb-2 flex items-center"><UserCheck className="w-4 h-4 mr-2"/> Personal Information</h4>
                  <p className="text-sm text-gray-700">
                    We only collect personal data (Name, Email, Phone) that you voluntarily provide via our "Contact Us" or "Contribution" forms.
                  </p>
                </div>
                <div className="bg-orange-50 p-5 rounded-lg border border-orange-100">
                  <h4 className="font-bold text-red-900 mb-2 flex items-center"><Eye className="w-4 h-4 mr-2"/> Usage Data</h4>
                  <p className="text-sm text-gray-700">
                    We automatically collect non-personal data such as your IP address, browser type, and pages visited to help us improve website performance.
                  </p>
                </div>
              </div>
            </motion.div>

            <div className="w-full h-px bg-yellow-200/60"></div>

            {/* Section 3: How We Use Data */}
            <motion.div variants={itemVariants}>
              <div className="flex items-center space-x-3 mb-3">
                <Mail className="text-yellow-700 w-6 h-6" />
                <h3 className="text-xl font-serif font-bold text-gray-900">2. How We Use Your Information</h3>
              </div>
              <ul className="list-disc list-inside text-gray-700 ml-4 space-y-2 leading-relaxed">
                <li>To respond to your inquiries regarding heritage sites or collaborations.</li>
                <li>To improve our 3D viewer experience based on device compatibility data.</li>
                <li>To send periodic updates (only if you have opted into our newsletter).</li>
                <li><strong>We do not sell, trade, or rent your personal identification information to others.</strong></li>
              </ul>
            </motion.div>

            <div className="w-full h-px bg-yellow-200/60"></div>

            {/* Section 4: Cookies */}
            <motion.div variants={itemVariants}>
              <div className="flex items-center space-x-3 mb-3">
                <Cookie className="text-yellow-700 w-6 h-6" />
                <h3 className="text-xl font-serif font-bold text-gray-900">3. Cookies & Tracking</h3>
              </div>
              <p className="text-gray-700 leading-relaxed text-justify">
                Our site uses "cookies" to enhance your experience (e.g., remembering your preferred theme or 3D viewer settings). You may choose to set your web browser to refuse cookies, or to alert you when cookies are being sent. Note that some parts of the site (like the 3D model cache) may not function properly without them.
              </p>
            </motion.div>

            <div className="w-full h-px bg-yellow-200/60"></div>

            {/* Section 5: Third Party Links */}
            <motion.div variants={itemVariants}>
              <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">4. Third-Party Services</h3>
              <p className="text-gray-700 leading-relaxed text-justify">
                We may use third-party services (such as Google Analytics or Sketchfab APIs) to analyze traffic or display content. These parties have their own privacy policies. We are not responsible for the content or practices of these external sites.
              </p>
            </motion.div>

          </div>

          {/* Footer Strip */}
          <div className="bg-gray-50 p-6 border-t border-yellow-200 text-center">
            <p className="text-sm text-gray-500 mb-1">
              For any privacy concerns, please write to our Grievance Officer:
            </p>
            <p className="font-bold text-red-900">privacy@holoheritage.in</p>
            <p className="text-xs text-gray-400 mt-2">Sangli, Maharashtra, India</p>
          </div>

        </motion.div>
      </div>
    </section>
    </>
    
  );
};

export default Privacy;