import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Save, FileBox, Image as ImageIcon, MapPin, Tag, BookOpen, Clock, PenTool, ShieldCheck, Zap } from "lucide-react";
import toast, { Toaster } from "react-hot-toast"; // 1. Import Toast
import Mandala from "../assets/indMan.png"; 
import NavBar from "../Components/Navbar";
import api from "../API/api"; 

export default function UploadPage() {
  const [loading, setLoading] = useState(false);
  
  // Refs to manually clear file inputs after submit
  const thumbInputRef = useRef(null);
  const glbInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    summary: "",
    tags: "",
    history: "",
    architecture: "",
    conservation: "",
    modernRelevance: "",
  });

  const [files, setFiles] = useState({
    thumb: null,
    glb: null
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  // --- IMPROVED SUBMIT HANDLER ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    const toastId = toast.loading("Starting upload... (This may take a minute for large models)");

    try {
      const data = new FormData();
      
      // Append text fields
      Object.keys(formData).forEach(key => {
          data.append(key, formData[key]);
      });

      // Append files
      if (files.thumb) data.append('thumb', files.thumb);
      if (files.glb) data.append('glb', files.glb);

      // Send Request
      const response = await api.post('sites', data, {
        timeout: 600000 // 10 minutes timeout for large files
      });

      if (response.data) {
        // 2. Success Feedback
        toast.success("Site uploaded successfully!", { id: toastId });
        
        // 3. Reset Form State
        setFormData({
            title: "", location: "", summary: "", tags: "",
            history: "", architecture: "", conservation: "", modernRelevance: "",
        });
        setFiles({ thumb: null, glb: null });

        // 4. Clear File Inputs Visually
        if(thumbInputRef.current) thumbInputRef.current.value = "";
        if(glbInputRef.current) glbInputRef.current.value = "";
      }

    } catch (error) {
      console.error("Upload error", error);
      const msg = error.response?.data?.message || "Upload failed. Check connection.";
      toast.error(msg, { id: toastId });
    } finally {
      // 5. CRITICAL: Stop loading spinner
      setLoading(false); 
    }
  };

  // --- Animations ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 70, damping: 12 } }
  };

  const rotationVariants = {
    start: { rotate: 0 },
    end: { rotate: 360, transition: { duration: 40, ease: "linear", repeat: Infinity } }
  };

  return (
    <>
      {/* 6. Add Toaster Component */}
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
      
      <NavBar/>
      <section className="bg-gradient-to-br from-yellow-50 to-orange-100 min-h-screen py-5 relative overflow-hidden">
      
      {/* Background Elements */}
      {Mandala && (
        <motion.img
          src={Mandala}
          alt="Mandala Pattern"
          className="absolute top-0 right-0 w-[800px] h-[800px] translate-x-1/3 -translate-y-1/4 z-0 pointer-events-none opacity-[0.08]"
          variants={rotationVariants}
          initial="start"
          animate="end"
        />
      )}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/rice-paper.png')" }}></div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-serif font-extrabold text-red-900 mb-4 drop-shadow-sm">
            Add New <span className="text-yellow-700">Heritage Site</span>
          </h1>
          <p className="text-lg text-gray-700 font-light max-w-2xl mx-auto">
            Contribute to the digital archive. Upload 3D models and historical narratives to preserve India's legacy.
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.form 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border-t-4 border-yellow-600 p-8 md:p-12"
        >
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* LEFT COLUMN */}
            <div className="space-y-6">
              <motion.div variants={itemVariants}>
                <h3 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-yellow-600"/> Basic Information
                </h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Site Title</label>
                  <div className="relative">
                    <input name="title" required value={formData.title} placeholder="e.g. The Taj Mahal" onChange={handleChange} className="w-full p-2.5 bg-orange-50/50 border border-amber-200 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none transition" />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400"/>
                    <input name="location" value={formData.location} placeholder="Agra, Uttar Pradesh" onChange={handleChange} className="w-full pl-10 p-2.5 bg-orange-50/50 border border-amber-200 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none transition" />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Tags (comma separated)</label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-3 w-4 h-4 text-gray-400"/>
                    <input name="tags" value={formData.tags} placeholder="Mughal, Marble, Wonder" onChange={handleChange} className="w-full pl-10 p-2.5 bg-orange-50/50 border border-amber-200 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none transition" />
                  </div>
                </div>

                <div>
                   <label className="block text-sm font-bold text-gray-700 mb-1">Brief Summary</label>
                   <textarea name="summary" value={formData.summary} rows="3" placeholder="A short introduction..." onChange={handleChange} className="w-full p-3 bg-orange-50/50 border border-amber-200 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none transition resize-none"></textarea>
                </div>
              </motion.div>

              {/* Media Uploads */}
              <motion.div variants={itemVariants} className="pt-4 border-t border-orange-200">
                <h3 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2">
                  <FileBox className="w-5 h-5 text-yellow-600"/> Media Assets
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Thumbnail */}
                  <div className="border-2 border-dashed border-amber-300 rounded-xl p-4 text-center hover:bg-orange-50 transition cursor-pointer relative group">
                    <input 
                        type="file" 
                        name="thumb" 
                        ref={thumbInputRef} // Attached Ref
                        onChange={handleFileChange} 
                        accept="image/*" 
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                    />
                    <ImageIcon className="w-8 h-8 mx-auto text-amber-500 mb-2 group-hover:scale-110 transition"/>
                    <p className="text-sm font-medium text-gray-600">{files.thumb ? files.thumb.name : "Upload Thumbnail"}</p>
                    <p className="text-xs text-gray-400">JPG, PNG</p>
                  </div>

                  {/* GLB Model */}
                  <div className="border-2 border-dashed border-amber-300 rounded-xl p-4 text-center hover:bg-orange-50 transition cursor-pointer relative group">
                    <input 
                        type="file" 
                        name="glb" 
                        ref={glbInputRef} // Attached Ref
                        onChange={handleFileChange} 
                        accept=".glb,.gltf" 
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                    />
                    <FileBox className="w-8 h-8 mx-auto text-amber-500 mb-2 group-hover:scale-110 transition"/>
                    <p className="text-sm font-medium text-gray-600">{files.glb ? files.glb.name : "Upload 3D Model"}</p>
                    <p className="text-xs text-gray-400">.GLB, .GLTF</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-4">
               <motion.div variants={itemVariants}>
                <h3 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2">
                  <PenTool className="w-5 h-5 text-yellow-600"/> Detailed Narrative
                </h3>

                <div className="mb-4">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-1">
                        <Clock className="w-4 h-4 text-amber-600"/> History
                    </label>
                    <textarea name="history" value={formData.history} rows="3" onChange={handleChange} className="w-full p-3 bg-white border border-amber-200 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none shadow-sm transition"></textarea>
                </div>

                <div className="mb-4">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-1">
                        <PenTool className="w-4 h-4 text-amber-600"/> Architecture
                    </label>
                    <textarea name="architecture" value={formData.architecture} rows="3" onChange={handleChange} className="w-full p-3 bg-white border border-amber-200 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none shadow-sm transition"></textarea>
                </div>

                <div className="mb-4">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-1">
                        <ShieldCheck className="w-4 h-4 text-amber-600"/> Conservation Status
                    </label>
                    <textarea name="conservation" value={formData.conservation} rows="2" onChange={handleChange} className="w-full p-3 bg-white border border-amber-200 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none shadow-sm transition"></textarea>
                </div>

                <div className="mb-4">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-1">
                        <Zap className="w-4 h-4 text-amber-600"/> Modern Relevance
                    </label>
                    <textarea name="modernRelevance" value={formData.modernRelevance} rows="2" onChange={handleChange} className="w-full p-3 bg-white border border-amber-200 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none shadow-sm transition"></textarea>
                </div>
               </motion.div>
            </div>

          </div>

          <motion.div variants={itemVariants} className="mt-10 flex justify-end">
             <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0px 10px 20px rgba(0,0,0,0.2)" }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-bold text-lg rounded-full shadow-lg transition-all border-b-4 border-yellow-800 disabled:opacity-70 disabled:cursor-not-allowed"
             >
                {loading ? "Uploading..." : "Save Heritage Site"} 
                {!loading && <Save className="w-5 h-5"/>}
             </motion.button>
          </motion.div>

        </motion.form>
      </div>
    </section>
    </>
  );
}