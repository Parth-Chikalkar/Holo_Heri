// src/pages/HoloPage.jsx
import React, { useEffect, useRef } from 'react';
import NavBar from '../Components/Navbar';
import HaloHero from '../Components/HaloHero';
import Footer from '../Components/Footer';
import bgmFile from '../assets/bgM.mp3'; // adjust path

const HoloPage = () => {
  const audioRef = useRef(null);

  useEffect(() => {
    // create audio object once on mount
    audioRef.current = new Audio(bgmFile);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.6; // adjust volume 0.0 - 1.0

    // try to play (may be blocked by autoplay policies)
    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        // autoplay blocked — silently ignore or handle (see fallback option B)
        console.warn('Autoplay prevented:', err);
      });
    }

    // cleanup when navigating away (component unmount)
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <>
      <NavBar />
      <HaloHero />
      <Footer />
    </>
  );
};

export default HoloPage;
