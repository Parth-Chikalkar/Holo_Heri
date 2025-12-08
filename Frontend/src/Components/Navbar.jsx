import React, { useState } from "react";
import { Menu, X, MapPin } from "lucide-react";
import { Link } from "react-router-dom"; // Essential for routing
import logo from "../assets/2025.png"

export default function NavBar() {
  const [open, setOpen] = useState(false);

  // Helper function to close the mobile menu on link click
  const closeMenu = () => setOpen(false);

  return (
    // Richer gradient suggesting saffron, marigold, and deep red
    <header className="bg-gradient-to-r from-orange-600 via-amber-500 to-red-600 text-white sticky top-0 z-50 shadow-xl border-b-2 border-amber-700/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20"> {/* Increased height slightly */}
          
          {/* Logo/Branding */}
          <Link to='/' className="flex items-center gap-3">
            {/* Logo: Stylized Golden Motif (Modified Star) */}
            <div className="w-17 h-17 overflow-hidden bg-yellow-100 rounded-full flex items-center justify-center shadow-2xl border-2 border-amber-800">
              <img src={logo} alt="Holo Heri Logo" className="w-full h-full object-cover"/> {/* Added alt text and object-cover */}
            </div>
            <div>
              {/* Stronger Title with subtle shadow */}
              <div className="font-serif font-extrabold text-2xl tracking-wider text-yellow-50 drop-shadow-md">
                Holo Heri
              </div>
              {/* Smaller subtitle in a rich red-orange */}
              <div className="text-xs text-orange-200 font-light italic">
                Sanskriti · Virasat · Kahaniyan
              </div>
            </div>
          </Link>
          

          {/* Desktop Navigation (No changes needed here) */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="hover:text-yellow-200 transition duration-300 relative group">
              Home
              <span className="absolute left-0 bottom-[-5px] w-0 h-[2px] bg-yellow-200 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/sites" className="hover:text-yellow-200 transition duration-300 relative group">
              Sites
              <span className="absolute left-0 bottom-[-5px] w-0 h-[2px] bg-yellow-200 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/about" className="hover:text-yellow-200 transition duration-300 relative group">
              About
              <span className="absolute left-0 bottom-[-5px] w-0 h-[2px] bg-yellow-200 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/contact" className="hover:text-yellow-200 transition duration-300 relative group">
              Contact
              <span className="absolute left-0 bottom-[-5px] w-0 h-[2px] bg-yellow-200 group-hover:w-full transition-all duration-300"></span>
            </Link>

            {/* Visit Button */}
            <button className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-red-800 font-semibold px-4 py-2 rounded-full transition duration-300 shadow-lg hover:shadow-xl">
              <MapPin className="w-5 h-5"/>
              Visit Now
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-menu">
            {open ? <X size={30}/> : <Menu size={30}/>}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown (WITH ANIMATION AND ROUTING FIXES)
        
        - Added 'transition', 'ease-in-out', 'duration-500', and 'max-h-0' for the slide animation.
        - Used conditional classes to transition 'max-h-0' to 'max-h-screen' when 'open' is true.
        - Replaced <a> with <Link> for proper React Router functionality.
      */}
      <div 
        id="mobile-menu"
        className={`
          md:hidden bg-red-700/95 shadow-inner border-t border-amber-500/50 pb-2 overflow-hidden
          transition-all ease-in-out duration-500
          ${open ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        
        {/* Full-width, clickable <Link> components */}
        <Link to="/" onClick={closeMenu} className="block w-full py-3 px-6 text-lg hover:bg-red-600/90 transition duration-200 border-b border-red-800">
          Home
        </Link>
        <Link to="/sites" onClick={closeMenu} className="block w-full py-3 px-6 text-lg hover:bg-red-600/90 transition duration-200 border-b border-red-800">
          Sites
        </Link>
        <Link to="/about" onClick={closeMenu} className="block w-full py-3 px-6 text-lg hover:bg-red-600/90 transition duration-200 border-b border-red-800">
          About
        </Link>
        <Link to="/contact" onClick={closeMenu} className="block w-full py-3 px-6 text-lg hover:bg-red-600/90 transition duration-200">
          Contact
        </Link>

        {/* Mobile Visit Button */}
        <div className="p-4">
          <button className="w-full inline-flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-red-800 font-semibold px-4 py-3 rounded-lg transition duration-300 shadow-md">
            <MapPin className="w-5 h-5"/>
            Visit Now
          </button>
        </div>
      </div>
    </header>
  );
}