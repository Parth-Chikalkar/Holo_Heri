import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import NavBar from '../Components/Navbar';
import Hero from '../Components/Hero';
import Footer from '../Components/Footer';
import Preloader from '../Components/Preloader'; 

const HomePage = () => {
  // ✅ FIX: Check storage IMMEDIATELY. 
  // If "hasVisitedHome" exists, loading starts as FALSE.
  // If it doesn't exist, loading starts as TRUE.
  const [loading, setLoading] = useState(() => {
    return !sessionStorage.getItem("hasVisitedHome");
  });

  useEffect(() => {
    // Only run the timer if we are actually loading
    if (loading) {
      window.scrollTo(0, 0);
      
      const timer = setTimeout(() => {
        setLoading(false);
        // Save the flag so it doesn't load next time
        sessionStorage.setItem("hasVisitedHome", "true");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [loading]);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <Preloader key="preloader" />}
      </AnimatePresence>

      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <NavBar />
          <Hero />
          <Footer />
        </motion.div>
      )}
    </>
  );
}

export default HomePage;