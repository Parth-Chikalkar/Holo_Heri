import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import Mandala from "../assets/indMan.png"; 
import Navbar from "../Components/Navbar";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your form logic here
    alert("Message Sent! (Connect this to your backend)");
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <>
    <Navbar/>
    <section className="relative min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 py-20 flex items-center justify-center overflow-hidden">
      
      {/* 🌟 Background Elements */}
      {Mandala && (
        <motion.img
          src={Mandala}
          alt="Mandala Pattern"
          className="absolute bottom-0 left-0 w-[900px] h-[900px] -translate-x-1/3 translate-y-1/3 z-0 pointer-events-none opacity-[0.08]"
          animate={{ rotate: 360 }}
          transition={{ duration: 80, ease: "linear", repeat: Infinity }}
        />
      )}
      
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/rice-paper.png')" }}></div>

      <div className="max-w-6xl w-full mx-auto px-4 grid md:grid-cols-2 gap-12 relative z-10">
        
        {/* Left Side: Contact Info */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col justify-center space-y-8"
        >
          <div>
            <h1 className="text-5xl md:text-6xl font-serif font-extrabold text-red-900 mb-4">
              Get in <span className="text-yellow-700">Touch</span>
            </h1>
            <p className="text-lg text-gray-700 font-light">
              Have a question about a monument? Want to contribute a model? We'd love to hear from fellow heritage enthusiasts.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center space-x-4 bg-white/60 p-4 rounded-xl shadow-sm">
              <div className="bg-orange-100 p-3 rounded-full text-red-800"><Mail /></div>
              <div>
                <h4 className="font-bold text-gray-900">Email Us</h4>
                <p className="text-gray-600">holoheriofficial@gmail.com</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 bg-white/60 p-4 rounded-xl shadow-sm">
              <div className="bg-orange-100 p-3 rounded-full text-red-800"><MapPin /></div>
              <div>
                <h4 className="font-bold text-gray-900">Visit Us</h4>
                <p className="text-gray-600">Heritage Lab Headquarters, Walchand College of Engineering, Vishrambag, Sangli, Maharashtra, India – 416415</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 bg-white/60 p-4 rounded-xl shadow-sm">
              <div className="bg-orange-100 p-3 rounded-full text-red-800"><Phone /></div>
              <div>
                <h4 className="font-bold text-gray-900">Call Us</h4>
                <p className="text-gray-600">+91 86699 01209</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side: The Form */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border-t-8 border-yellow-600"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Your Name</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none transition-all"
                placeholder="Ex. Parth Chikalkar"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Email Address</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none transition-all"
                placeholder="Ex. parth@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Message</label>
              <textarea 
                name="message" 
                value={formData.message} 
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none transition-all resize-none"
                placeholder="Tell us what's on your mind..."
                required
              ></textarea>
            </div>

            <motion.button 
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-red-900 hover:bg-red-800 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center space-x-2 transition-colors"
            >
              <span>Send Message</span>
              <Send className="w-5 h-5" />
            </motion.button>
          </form>
        </motion.div>

      </div>
    </section>
    </>
  );
};

export default Contact;