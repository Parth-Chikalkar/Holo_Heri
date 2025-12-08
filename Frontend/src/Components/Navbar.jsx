import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/2025.png";
import { FaPlus } from "react-icons/fa";
import LoginModal from "./LoginModal";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();

  const closeMenu = () => setOpen(false);

  // --- HELPER: GET COOKIE BY NAME ---
  const getCookie = (name) => {
    // Split cookie string and find the one starting with "name="
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  // --- AUTH CHECK FUNCTION ---
  const handleAddSiteClick = (e) => {
    e.preventDefault();
    closeMenu();

    // Check manually for "tokenPassed"
    const token = getCookie("tokenPassed");

    if (token) {
      navigate("/upload"); // Valid token found
    } else {
      setShowLogin(true); // Token missing, show modal
    }
  };

  return (
    <>
      <AnimatePresence>
        {showLogin && (
           <LoginModal key="login-modal" onClose={() => setShowLogin(false)} />
        )}
      </AnimatePresence>

      <header className="bg-gradient-to-r from-orange-600 via-amber-500 to-red-600 text-white sticky top-0 z-50 shadow-xl border-b-2 border-amber-700/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo Section */}
            <Link to='/' className="flex items-center gap-3">
              <div className="w-17 h-17 overflow-hidden bg-yellow-100 rounded-full flex items-center justify-center shadow-2xl border-2 border-amber-800">
                <img src={logo} alt="Holo Heri Logo" className="w-full h-full object-cover"/>
              </div>
              <div>
                <div className="font-serif font-extrabold text-2xl tracking-wider text-yellow-50 drop-shadow-md">
                  Holo Heri
                </div>
                <div className="text-xs text-orange-200 font-light italic">
                  Sanskriti · Virasat · Kahaniyan
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
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

              {/* Desktop Button with Auth Check */}
              <button 
                onClick={handleAddSiteClick}
                className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-red-800 font-semibold px-4 py-2 rounded-full transition duration-300 shadow-lg hover:shadow-xl cursor-pointer"
              >
                <FaPlus className="w-5 h-5" />
                Add Site
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
              {open ? <X size={30}/> : <Menu size={30}/>}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div 
          id="mobile-menu"
          className={`
            md:hidden bg-red-700/95 shadow-inner border-t border-amber-500/50 pb-2 overflow-hidden
            transition-all ease-in-out duration-500
            ${open ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}
          `}
        >
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

          {/* Mobile Button with Auth Check */}
          <div className="p-4">
            <button 
              onClick={handleAddSiteClick}
              className="w-full inline-flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-red-800 font-semibold px-4 py-3 rounded-lg transition duration-300 shadow-md"
            >
              <FaPlus className="w-5 h-5" />
              Add Site (Visit Now)
            </button>
          </div>
        </div>
      </header>
    </>
  );
}