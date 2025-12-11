import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save, FileBox, Image as ImageIcon, MapPin, Tag, BookOpen,
  Clock, PenTool, ShieldCheck, Zap, History, Info, 
  Landmark, Palette, ArrowLeft, Music, Feather, Users, Layers
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Mandala from "../assets/indMan.png";
import NavBar from "../Components/Navbar";
import api from "../API/api";

export default function UploadPage() {
  const [selection, setSelection] = useState(null); 
  const [loading, setLoading] = useState(false);

  // Refs for clearing file inputs
  const thumbInputRef = useRef(null);
  const glbInputRef = useRef(null);
  const oldPhotoRef = useRef(null);
  const newPhotoRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "", location: "", summary: "", tags: "", category: "",
    history: "", architecture: "", conservation: "", modernRelevance: "",
    oldStructureDesc: "", newStructureDesc: "",
  });

  const [files, setFiles] = useState({
    thumb: null, glb: null, oldSitePhoto: null, newSitePhoto: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    setFiles({ ...files, [e.target.name]: file || null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    const toastId = toast.loading("Uploading to Archive...");

    try {
      const data = new FormData();

      // 1. Process Text Fields (With Fix for Tags)
      Object.keys(formData).forEach((key) => {
        if (key === 'tags') {
            // ✅ FIX: Ensure 'Culture' or 'Heritage' tag is always included
            let tagsValue = formData[key] || "";
            const autoTag = selection === 'culture' ? 'Culture' : 'Heritage';
            
            // Only append if it's not already there
            if (!tagsValue.toLowerCase().includes(autoTag.toLowerCase())) {
                tagsValue = tagsValue ? `${tagsValue}, ${autoTag}` : autoTag;
            }
            data.append('tags', tagsValue);
        } else {
            // Append other fields normally
            data.append(key, formData[key] || "");
        }
      });

      // 2. Append Common Files
      if (files.thumb) data.append("thumb", files.thumb);
      if (files.glb) data.append("glb", files.glb);
      
      // 3. Append Heritage-Specific Files
      if (selection === 'heritage') {
          if (files.oldSitePhoto) data.append("oldSitePhoto", files.oldSitePhoto);
          if (files.newSitePhoto) data.append("newSitePhoto", files.newSitePhoto);
      }

      // 4. Send to Correct Endpoint
      const endpoint = selection === 'culture' ? 'culture' : 'sites';
      const response = await api.post(endpoint, data, { timeout: 600000 });

      if (response.data) {
        toast.success("Uploaded successfully!", { id: toastId });
        
        // Reset Form State
        setFormData({ 
            title: "", location: "", summary: "", tags: "", category: "", 
            history: "", architecture: "", conservation: "", modernRelevance: "", 
            oldStructureDesc: "", newStructureDesc: "" 
        });
        setFiles({ thumb: null, glb: null, oldSitePhoto: null, newSitePhoto: null });
        
        // Clear File Inputs
        [thumbInputRef, glbInputRef, oldPhotoRef, newPhotoRef].forEach((ref) => { 
            if (ref.current) ref.current.value = ""; 
        });
        
        setSelection(null); // Return to menu
      }
    } catch (error) {
      console.error("Upload error", error);
      const msg = error.response?.data?.message || "Upload failed.";
      toast.error(msg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  // Animation Variants
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

  return (
    <>
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
      <NavBar />
      
      <section className={`min-h-screen py-10 relative overflow-hidden transition-colors duration-700 ${selection === 'culture' ? 'bg-gradient-to-br from-pink-50 via-rose-50 to-red-100' : 'bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-100'}`}>
        
        {/* Background Elements */}
        {Mandala && (
          <motion.img src={Mandala} alt="Pattern" className="absolute top-0 right-0 w-[900px] h-[900px] translate-x-1/3 -translate-y-1/4 z-0 pointer-events-none opacity-[0.06]" animate={{ rotate: 360 }} transition={{ duration: 60, ease: "linear", repeat: Infinity }} />
        )}
        <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-multiply" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/rice-paper.png')" }} />

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            {selection === null ? (
               <>
                 <h1 className="text-4xl md:text-6xl font-serif font-extrabold text-red-900 mb-3 drop-shadow-sm tracking-tight">
                    What are you <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-orange-600">Preserving?</span>
                 </h1>
               </>
            ) : (
               <div className="relative">
                 <button onClick={() => setSelection(null)} className="absolute left-0 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 text-gray-600 transition-all flex items-center gap-2 pr-4 text-sm font-bold">
                    <ArrowLeft className="w-5 h-5"/> Back
                 </button>
                 <h1 className={`text-4xl font-serif font-extrabold mb-2 ${selection === 'culture' ? 'text-pink-900' : 'text-red-900'}`}>
                    {selection === 'heritage' ? "Add Heritage Site" : "Add Cultural Form"}
                 </h1>
               </div>
            )}
          </motion.div>

          {/* === SELECTION SCREEN === */}
          <AnimatePresence mode="wait">
            {selection === null && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
                >
                    {/* HERITAGE CARD */}
                    <motion.div 
                        whileHover={{ y: -10, boxShadow: "0 25px 50px -12px rgba(234, 88, 12, 0.25)" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelection('heritage')}
                        className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 border-2 border-white cursor-pointer shadow-xl group flex flex-col items-center text-center gap-6"
                    >
                        <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-500 transition-colors duration-500">
                            <Landmark className="w-12 h-12 text-orange-600 group-hover:text-white transition-colors duration-500"/>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-orange-700 transition-colors">Heritage Site</h2>
                            <p className="text-gray-600 leading-relaxed">Monuments, Forts, Temples.</p>
                        </div>
                    </motion.div>

                    {/* CULTURE CARD */}
                    <motion.div 
                        whileHover={{ y: -10, boxShadow: "0 25px 50px -12px rgba(236, 72, 153, 0.25)" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelection('culture')}
                        className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 border-2 border-white cursor-pointer shadow-xl group flex flex-col items-center text-center gap-6"
                    >
                        <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center group-hover:bg-pink-500 transition-colors duration-500">
                            <Palette className="w-12 h-12 text-pink-600 group-hover:text-white transition-colors duration-500"/>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-pink-700 transition-colors">Cultural Practice</h2>
                            <p className="text-gray-600 leading-relaxed">Dance, Music, Crafts, Rituals.</p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
          </AnimatePresence>

          {/* === HERITAGE FORM (Orange Theme) === */}
          {selection === 'heritage' && (
              <motion.form 
                variants={containerVariants} 
                initial="hidden" 
                animate="visible" 
                onSubmit={handleSubmit} 
                className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-orange-900/10 border border-white/50 p-6 md:p-10 overflow-hidden"
              >
                {/* 1. CORE DETAILS */}
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-6 pb-2 border-b border-orange-100">
                        <div className="p-2 bg-orange-100 rounded-lg text-orange-600"><BookOpen className="w-5 h-5"/></div>
                        <h3 className="text-xl font-bold text-gray-800">Core Information</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <motion.div variants={itemVariants} className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-bold text-gray-600 mb-2 ml-1">Site Title</label>
                            <input name="title" required value={formData.title} placeholder="e.g. The Sun Temple of Konark" onChange={handleChange} 
                                className="w-full p-4 bg-orange-50/50 border border-orange-100 rounded-2xl focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition-all placeholder:text-gray-400 font-serif text-lg text-gray-800" />
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <label className="block text-sm font-bold text-gray-600 mb-2 ml-1 flex items-center gap-2"><MapPin className="w-4 h-4 text-orange-400"/> Location</label>
                            <input name="location" value={formData.location} placeholder="City, State" onChange={handleChange} 
                                className="w-full p-3.5 bg-orange-50/30 border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none transition-all" />
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <label className="block text-sm font-bold text-gray-600 mb-2 ml-1 flex items-center gap-2"><Tag className="w-4 h-4 text-orange-400"/> Tags</label>
                            <input name="tags" value={formData.tags} placeholder="Temple, Stone, UNESCO..." onChange={handleChange} 
                                className="w-full p-3.5 bg-orange-50/30 border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none transition-all" />
                        </motion.div>

                        <motion.div variants={itemVariants} className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-bold text-gray-600 mb-2 ml-1 flex items-center gap-2"><Info className="w-4 h-4 text-orange-400"/> Brief Summary</label>
                            <textarea name="summary" value={formData.summary} rows="3" placeholder="A short, captivating introduction to the site..." onChange={handleChange} 
                                className="w-full p-4 bg-orange-50/30 border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none transition-all resize-none text-gray-700 leading-relaxed"></textarea>
                        </motion.div>
                    </div>
                </div>

                {/* 2. MEDIA ASSETS */}
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-6 pb-2 border-b border-orange-100">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><FileBox className="w-5 h-5"/></div>
                        <h3 className="text-xl font-bold text-gray-800">Visual Assets</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <motion.div variants={itemVariants} className="relative group">
                            <div className="border-2 border-dashed border-blue-200 rounded-2xl p-6 text-center hover:bg-blue-50/50 transition-colors cursor-pointer h-full flex flex-col items-center justify-center min-h-[160px]">
                                <input type="file" name="thumb" ref={thumbInputRef} onChange={handleFileChange} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                                <div className="p-3 bg-blue-100 text-blue-600 rounded-full mb-3 group-hover:scale-110 transition-transform"><ImageIcon className="w-6 h-6"/></div>
                                <p className="font-semibold text-gray-600">{files.thumb ? files.thumb.name : "Upload Thumbnail"}</p>
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="relative group">
                            <div className="border-2 border-dashed border-amber-300 rounded-2xl p-6 text-center hover:bg-amber-50/50 transition-colors cursor-pointer h-full flex flex-col items-center justify-center min-h-[160px]">
                                <input type="file" name="glb" ref={glbInputRef} onChange={handleFileChange} accept=".glb,.gltf" className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                                <div className="p-3 bg-amber-100 text-amber-600 rounded-full mb-3 group-hover:scale-110 transition-transform"><FileBox className="w-6 h-6"/></div>
                                <p className="font-semibold text-gray-600">{files.glb ? files.glb.name : "Upload 3D Model"}</p>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* 3. DEEP DIVE NARRATIVE */}
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-6 pb-2 border-b border-orange-100">
                        <div className="p-2 bg-red-100 rounded-lg text-red-700"><PenTool className="w-5 h-5"/></div>
                        <h3 className="text-xl font-bold text-gray-800">Deep Dive</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <motion.div variants={itemVariants}>
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-600 mb-2 ml-1"><Clock className="w-4 h-4 text-red-500"/> History</label>
                            <textarea name="history" value={formData.history} rows="5" onChange={handleChange} className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-400 outline-none shadow-sm transition-all text-sm leading-relaxed" placeholder="Chronological history..." />
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-600 mb-2 ml-1"><PenTool className="w-4 h-4 text-red-500"/> Architecture</label>
                            <textarea name="architecture" value={formData.architecture} rows="5" onChange={handleChange} className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-400 outline-none shadow-sm transition-all text-sm leading-relaxed" placeholder="Structural details..." />
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-600 mb-2 ml-1"><ShieldCheck className="w-4 h-4 text-red-500"/> Conservation</label>
                            <textarea name="conservation" value={formData.conservation} rows="4" onChange={handleChange} className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-400 outline-none shadow-sm transition-all text-sm leading-relaxed" placeholder="Restoration efforts..." />
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-600 mb-2 ml-1"><Zap className="w-4 h-4 text-red-500"/> Modern Relevance</label>
                            <textarea name="modernRelevance" value={formData.modernRelevance} rows="4" onChange={handleChange} className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-400 outline-none shadow-sm transition-all text-sm leading-relaxed" placeholder="Significance today..." />
                        </motion.div>
                    </div>
                </div>

                {/* 4. TIME TRAVEL: Then vs. Now */}
                <motion.div variants={itemVariants} className="bg-gradient-to-br from-gray-50 to-orange-50/50 rounded-3xl p-6 md:p-8 border border-orange-100/50">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-purple-100 rounded-lg text-purple-700"><History className="w-5 h-5"/></div>
                        <h3 className="text-xl font-bold text-gray-800">Time Travel: Then vs. Now</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* PAST CARD */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border-t-4 border-gray-400">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xs font-bold tracking-wider bg-gray-100 text-gray-600 px-2 py-1 rounded uppercase">The Past</span>
                                <span className="text-gray-400 text-xs">Monochrome / Vintage</span>
                            </div>
                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 mb-4 text-center relative hover:bg-gray-50 cursor-pointer transition-colors">
                                <input type="file" name="oldSitePhoto" ref={oldPhotoRef} onChange={handleFileChange} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                                <ImageIcon className="w-6 h-6 mx-auto text-gray-400 mb-1"/>
                                <p className="text-xs font-medium text-gray-500">{files.oldSitePhoto?.name || "Upload Historical Photo"}</p>
                            </div>
                            <textarea name="oldStructureDesc" value={formData.oldStructureDesc} onChange={handleChange} rows="3" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 outline-none text-sm" placeholder="Description of the past structure..." />
                        </div>

                        {/* PRESENT CARD */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border-t-4 border-orange-500">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xs font-bold tracking-wider bg-orange-100 text-orange-700 px-2 py-1 rounded uppercase">The Present</span>
                                <span className="text-orange-300 text-xs">Vibrant / Current</span>
                            </div>
                            <div className="border-2 border-dashed border-orange-200 rounded-xl p-4 mb-4 text-center relative hover:bg-orange-50 cursor-pointer transition-colors">
                                <input type="file" name="newSitePhoto" ref={newPhotoRef} onChange={handleFileChange} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                                <ImageIcon className="w-6 h-6 mx-auto text-orange-500 mb-1"/>
                                <p className="text-xs font-medium text-orange-600">{files.newSitePhoto?.name || "Upload Modern Photo"}</p>
                            </div>
                            <textarea name="newStructureDesc" value={formData.newStructureDesc} onChange={handleChange} rows="3" className="w-full p-3 bg-orange-50/50 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none text-sm" placeholder="Description of current condition..." />
                        </div>
                    </div>
                </motion.div>

                {/* SUBMIT */}
                <motion.div variants={itemVariants} className="mt-10 flex justify-end">
                    <motion.button
                        whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(234, 88, 12, 0.4)" }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-yellow-600 to-orange-700 hover:from-yellow-500 hover:to-orange-600 text-white font-bold text-lg rounded-full shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? "Uploading..." : "Save to Archive"} <Save className="w-5 h-5"/>
                    </motion.button>
                </motion.div>
              </motion.form>
          )}

          {/* === CULTURE FORM (Pink Theme - WITH CATEGORY) === */}
          {selection === 'culture' && (
             <motion.form 
               variants={containerVariants} 
               initial="hidden" 
               animate="visible" 
               onSubmit={handleSubmit} 
               className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-pink-900/10 border border-white/50 p-6 md:p-10 overflow-hidden"
             >
                {/* 1. CORE INFO */}
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-6 pb-2 border-b border-pink-100">
                        <div className="p-2 bg-pink-100 rounded-lg text-pink-600"><Music className="w-5 h-5"/></div>
                        <h3 className="text-xl font-bold text-gray-800">Art Form Details</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <motion.div variants={itemVariants} className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-bold text-gray-600 mb-2 ml-1">Title of Art Form</label>
                            <input name="title" required value={formData.title} placeholder="e.g. Kathakali Dance" onChange={handleChange} 
                                className="w-full p-4 bg-pink-50/50 border border-pink-100 rounded-2xl focus:ring-2 focus:ring-pink-400 outline-none transition-all font-serif text-lg" />
                        </motion.div>

                        {/* CATEGORY INPUT */}
                        <motion.div variants={itemVariants}>
                            <label className="block text-sm font-bold text-gray-600 mb-2 ml-1 flex items-center gap-2"><Layers className="w-4 h-4 text-pink-500"/> Category</label>
                            <input name="category" required value={formData.category} placeholder="e.g. Dance, Food, Music" onChange={handleChange} 
                                className="w-full p-3.5 bg-pink-50/30 border border-pink-100 rounded-xl focus:ring-2 focus:ring-pink-400 outline-none transition-all" />
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <label className="block text-sm font-bold text-gray-600 mb-2 ml-1">Region of Origin</label>
                            <input name="location" value={formData.location} placeholder="e.g. Kerala, India" onChange={handleChange} 
                                className="w-full p-3.5 bg-pink-50/30 border border-pink-100 rounded-xl focus:ring-2 focus:ring-pink-400 outline-none" />
                        </motion.div>
                        <motion.div variants={itemVariants} className="col-span-1 md:col-span-2">
                             <label className="block text-sm font-bold text-gray-600 mb-2 ml-1">Brief Summary</label>
                             <textarea name="summary" value={formData.summary} rows="3" placeholder="Describe the essence of this art form..." onChange={handleChange} 
                                className="w-full p-4 bg-pink-50/30 border border-pink-100 rounded-xl focus:ring-2 focus:ring-pink-400 outline-none resize-none"></textarea>
                        </motion.div>
                        <motion.div variants={itemVariants} className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-bold text-gray-600 mb-2 ml-1 flex items-center gap-2"><Tag className="w-4 h-4 text-pink-500"/> Tags</label>
                            <input name="tags" value={formData.tags} placeholder="Classical, Story, Mudras..." onChange={handleChange} 
                                className="w-full p-3.5 bg-pink-50/30 border border-pink-100 rounded-xl focus:ring-2 focus:ring-pink-400 outline-none transition-all" />
                        </motion.div>
                    </div>
                </div>

                {/* 2. MEDIA (GLB = 3D Artifact) */}
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-6 pb-2 border-b border-pink-100">
                        <div className="p-2 bg-purple-100 rounded-lg text-purple-600"><FileBox className="w-5 h-5"/></div>
                        <h3 className="text-xl font-bold text-gray-800">Digital Assets</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <motion.div variants={itemVariants} className="border-2 border-dashed border-purple-200 rounded-2xl p-6 text-center hover:bg-purple-50/50 cursor-pointer min-h-[160px] flex flex-col justify-center relative">
                            <input type="file" name="thumb" ref={thumbInputRef} onChange={handleFileChange} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                            <ImageIcon className="w-8 h-8 mx-auto text-purple-400 mb-2"/>
                            <p className="font-semibold text-gray-600">{files.thumb ? files.thumb.name : "Cover Image"}</p>
                        </motion.div>

                        <motion.div variants={itemVariants} className="border-2 border-dashed border-pink-300 rounded-2xl p-6 text-center hover:bg-pink-50/50 cursor-pointer min-h-[160px] flex flex-col justify-center relative">
                            <input type="file" name="glb" ref={glbInputRef} onChange={handleFileChange} accept=".glb,.gltf" className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                            <FileBox className="w-8 h-8 mx-auto text-pink-500 mb-2"/>
                            <p className="font-semibold text-gray-600">{files.glb ? files.glb.name : "3D Capture (GLB)"}</p>
                            <p className="text-xs text-gray-400 mt-1">Upload 3D Motion or Artifact</p>
                        </motion.div>
                    </div>
                </div>

                {/* 3. DEEP DIVE (Mapped for Culture) */}
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-6 pb-2 border-b border-pink-100">
                        <div className="p-2 bg-rose-100 rounded-lg text-rose-700"><Feather className="w-5 h-5"/></div>
                        <h3 className="text-xl font-bold text-gray-800">Cultural Narrative</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* History -> Origins */}
                        <motion.div variants={itemVariants}>
                            <label className="text-sm font-bold text-gray-600 mb-2 ml-1 flex gap-2"><History className="w-4 h-4 text-rose-500"/> Origins & Mythology</label>
                            <textarea name="history" value={formData.history} rows="4" onChange={handleChange} className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 outline-none text-sm" placeholder="How did it start? What is the legend?" />
                        </motion.div>

                        {/* Architecture -> Technique */}
                        <motion.div variants={itemVariants}>
                            <label className="text-sm font-bold text-gray-600 mb-2 ml-1 flex gap-2"><PenTool className="w-4 h-4 text-rose-500"/> Technique & Attire</label>
                            <textarea name="architecture" value={formData.architecture} rows="4" onChange={handleChange} className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 outline-none text-sm" placeholder="Costumes, Instruments, Steps..." />
                        </motion.div>

                        {/* Conservation -> Lineage */}
                        <motion.div variants={itemVariants}>
                            <label className="text-sm font-bold text-gray-600 mb-2 ml-1 flex gap-2"><Users className="w-4 h-4 text-rose-500"/> Lineage & Community</label>
                            <textarea name="conservation" value={formData.conservation} rows="4" onChange={handleChange} className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 outline-none text-sm" placeholder="Which community performs this?" />
                        </motion.div>

                         {/* Modern Relevance */}
                         <motion.div variants={itemVariants}>
                            <label className="text-sm font-bold text-gray-600 mb-2 ml-1 flex gap-2"><Zap className="w-4 h-4 text-rose-500"/> Cultural Significance</label>
                            <textarea name="modernRelevance" value={formData.modernRelevance} rows="4" onChange={handleChange} className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 outline-none text-sm" placeholder="Festivals, Global status..." />
                        </motion.div>
                    </div>
                </div>

                {/* SUBMIT */}
                <motion.div variants={itemVariants} className="mt-10 flex justify-end">
                    <motion.button
                        whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(236, 72, 153, 0.4)" }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-pink-600 to-rose-700 hover:from-pink-500 hover:to-rose-600 text-white font-bold text-lg rounded-full shadow-xl transition-all"
                    >
                        {loading ? "Uploading..." : "Save Cultural Form"} <Save className="w-5 h-5"/>
                    </motion.button>
                </motion.div>
             </motion.form>
          )}

        </div>
      </section>
    </>
  );
}