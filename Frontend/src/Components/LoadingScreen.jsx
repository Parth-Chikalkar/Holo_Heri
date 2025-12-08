import React from "react";
import { motion } from "framer-motion";

export default function LoadingScreen() {
  return (
    <motion.div 
      className="fixed inset-0 bg-yellow-100 flex flex-col items-center justify-center z-[9999]"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="w-20 h-20 border-8 border-yellow-600 border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
      />

      <motion.h1 
        className="text-3xl font-bold text-yellow-800 mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 1 }}
      >
        Loading...
      </motion.h1>
    </motion.div>
  );
}
