import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";

// --- FIX 1: Import the 'api' instance, NOT 'axios' ---
// Ensure this path matches where you saved api.js
import api from '../API/api'; 
// If api.js is in src/utils/api.js and this file is src/Components/LoginModal.jsx, 
// '../utils/api' is correct. If api.js is in src/, use '../api'.

export default function LoginModal({ onClose }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // --- FIX 2: Use 'api.post' ---
      // Your baseURL is already 'http://localhost:3000/api/holoheri/'
      // So we just add 'users/login' to complete the path.
      const response = await api.post("users/login", {
        username: username,
        password: password
      });

      const data = response.data;

      if (data.success) {
        // Fix 3: Setting the cookie manually
        document.cookie = `tokenPassed=${data.token}; path=/; max-age=604800; SameSite=Strict`;

        onClose();
        navigate("/upload");
      } else {
        setError(data.message || "Login failed");
      }

    } catch (err) {
      console.error("Login Error:", err); // Log error to console for debugging
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Server connection error. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // --- Framer Motion Variants ---
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2, delay: 0.1 } }
  };

  const modalContainerVariants = {
    hidden: { scale: 0.9, y: 30, opacity: 0 },
    visible: { 
      scale: 1, y: 0, opacity: 1,
      transition: { type: "spring", damping: 25, stiffness: 350, when: "beforeChildren", staggerChildren: 0.1 }
    },
    exit: { scale: 0.95, y: 20, opacity: 0, transition: { duration: 0.2 } }
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={onClose}
    >
      <motion.div 
        className="bg-white/95 p-8 rounded-3xl shadow-3xl w-full max-w-md relative border-t-[6px] border-orange-500 overflow-hidden"
        variants={modalContainerVariants}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-orange-100/50 to-transparent -z-10 pointer-events-none"></div>

        <motion.button 
          variants={itemVariants}
          onClick={onClose} 
          className="absolute top-5 right-5 text-gray-400 hover:text-red-600 transition-colors duration-200 bg-gray-100 hover:bg-red-50 p-2 rounded-full"
        >
          <X size={20} />
        </motion.button>
        
        <motion.h2 variants={itemVariants} className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-amber-800 to-red-700 mb-8 font-serif tracking-wide">
          Member Login
        </motion.h2>
        
        {error && (
          <motion.p variants={itemVariants} className="text-red-600 bg-red-50 border-l-4 border-red-500 p-3 rounded text-sm mb-6 font-medium">
            {error}
          </motion.p>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-bold text-amber-900 mb-1 ml-1">Username</label>
            <input 
              type="text" 
              className="w-full p-3 border-2 border-amber-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none transition-all bg-orange-50/30 text-amber-950 font-medium"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              disabled={isLoading}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
             <label className="block text-sm font-bold text-amber-900 mb-1 ml-1">Password</label>
            <input 
              type="password" 
              className="w-full p-3 border-2 border-amber-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none transition-all bg-orange-50/30 text-amber-950 font-medium"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
            />
          </motion.div>
          
          <motion.div variants={itemVariants} className="pt-4">
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-600 via-amber-500 to-red-600 text-white py-3.5 rounded-xl font-bold text-lg shadow-lg hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} /> Logging in...
                </>
              ) : (
                "Access Site"
              )}
            </button>
          </motion.div>
        </form>

          <motion.p variants={itemVariants} className="text-center text-amber-800/60 text-xs mt-6 font-serif italic">
            Enter your credentials to contribute to Holo Heri.
          </motion.p>
      </motion.div>
    </motion.div>
  );
}