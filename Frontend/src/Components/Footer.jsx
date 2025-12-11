import React from "react";
import { ArrowUpRight } from "lucide-react"; 
import { Link } from "react-router-dom";

export default function Footer() {
 return (
  // 🌟 Using deep red-900 and a subtle yellow border to match the heritage theme
  <footer className="bg-red-900 text-yellow-200 py-12 border-t-4 border-yellow-600 shadow-inner">
   <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">

    {/* Column 1: Branding and Amazing Description */}
    <div className="col-span-2 md:col-span-1">
     <h4 className="text-3xl font-serif font-bold text-yellow-400 mb-2 tracking-wider">
      Holo Heri
     </h4>
     <p className="text-sm font-light italic text-orange-200 leading-relaxed">
      We are the custodians of digital heritage. Our mission is to capture the majesty, 
      mystery, and detailed artistry of India’s past, rendering it into interactive, 
      living holographic experiences for generations to explore.
     </p>
     <p className="text-xs mt-6 text-yellow-300 opacity-70">
      &copy; {new Date().getFullYear()} Holo Heri. All rights reserved.
     </p>
    </div>

        {/* Column 2: Quick Links (Now using <Link>) */}
        <div>
          <h5 className="text-xl font-serif font-semibold text-yellow-500 mb-4 border-b border-yellow-800 pb-1">Navigation</h5>
          <ul className="text-sm space-y-2">
            <li>
              <Link to="/" className="hover:text-yellow-400 transition duration-200">Home</Link>
            </li>
            <li>
              <Link to="/sites" className="hover:text-yellow-400 transition duration-200">Sacred Sites</Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-yellow-400 transition duration-200">Our Story</Link>
            </li>
            <li>
              <Link to="/blog" className="hover:text-yellow-400 transition duration-200">Digital Archive</Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Resources (Now using <Link>) */}
        <div>
          <h5 className="text-xl font-serif font-semibold text-yellow-500 mb-4 border-b border-yellow-800 pb-1">Resources</h5>
          <ul className="mt-2 text-sm space-y-2">
            <li>
              <Link to="/support" className="hover:text-yellow-400 transition duration-200">Help Center</Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-yellow-400 transition duration-200">Privacy Policy</Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-yellow-400 transition duration-200">Terms of Service</Link>
            </li>
            <li>
              <Link to="/careers" className="hover:text-yellow-400 transition duration-200">Careers <ArrowUpRight className="inline w-3 h-3 ml-1"/></Link>
            </li>
          </ul>
        </div>

    {/* Column 4: Contact and Social (Using <a> for external links) */}
    <div>
     <h5 className="text-xl font-serif font-semibold text-yellow-500 mb-4 border-b border-yellow-800 pb-1">Connect</h5>
     <p className="text-sm mb-4">
           Email: <a href="mailto:holoheriofficial@gmail.com" className="text-yellow-300 hover:text-yellow-100 transition duration-200">holoheriofficial@gmail.com</a>
     </p>
     
     <div className="flex space-x-4 text-2xl">
      {/* Social Icons using <Link> tags, as requested. 
              Note: For external links like these, using the standard <a> tag is usually recommended. */}
      <Link to="#" className="hover:text-yellow-400 transition duration-200" aria-label="Facebook">
        {/* Placeholder for social icon (e.g., Lucide or SVG) */}
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
      </Link>
      <Link to="#" className="hover:text-yellow-400 transition duration-200" aria-label="Twitter">
        {/* Placeholder for social icon (e.g., Lucide or SVG) */}
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2 1.7-1.4 1.2-4.5-2.2-4.5 2.5 1.7 5.7-.3 8-2.5 1.3-.2 1.3-2.1 0-2.3 2.1-2 4.1-4.8 4.7-7.2z"/></svg>
      </Link>
      <Link 
       to="https://www.instagram.com/holoheri_2k25?igsh=MW5vd3dyM3lmOGtvMQ==" 
       className="hover:text-yellow-400 transition duration-200" 
       aria-label="Instagram"
       target="_blank" 
       rel="noopener noreferrer"
      >
        {/* Placeholder for social icon (e.g., Lucide or SVG) */}
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.5" y1="6.5" y2="6.5"/></svg>
      </Link>
     </div>
    </div>

   </div>
  </footer>
 );
}