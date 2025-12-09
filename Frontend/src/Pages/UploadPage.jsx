import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Save,
  FileBox,
  Image as ImageIcon,
  MapPin,
  Tag,
  BookOpen,
  Clock,
  PenTool,
  ShieldCheck,
  Zap,
  History,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Mandala from "../assets/indMan.png";
import NavBar from "../Components/Navbar";
import api from "../API/api";

// NEW imports
import ReactQuill from "react-quill-new";
import "quill/dist/quill.snow.css";
import DOMPurify from "dompurify";

export default function UploadPage() {
  const [loading, setLoading] = useState(false);

  // Refs to manually clear file inputs after submit
  const thumbInputRef = useRef(null);
  const glbInputRef = useRef(null);
  const oldPhotoRef = useRef(null);
  const newPhotoRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    summary: "",
    tags: "",
    history: "",
    architecture: "",
    conservation: "",
    modernRelevance: "",
    oldStructureDesc: "",
    newStructureDesc: "",
  });

  const [files, setFiles] = useState({
    thumb: null,
    glb: null,
    oldSitePhoto: null,
    newSitePhoto: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    setFiles({ ...files, [e.target.name]: file || null });
  };

  // Quill config
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["blockquote", "code-block"],
      ["link", "image"],
      ["clean"],
    ],
  };

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "blockquote",
    "code-block",
    "link",
    "image",
  ];

  const handleQuillChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    const toastId = toast.loading("Starting upload... (This may take a minute)");

    try {
      const data = new FormData();

      const htmlFields = new Set([
        "summary",
        "history",
        "architecture",
        "conservation",
        "modernRelevance",
        "oldStructureDesc",
        "newStructureDesc",
      ]);

      Object.keys(formData).forEach((key) => {
        let value = formData[key] ?? "";
        if (htmlFields.has(key)) value = DOMPurify.sanitize(value);
        data.append(key, value);
      });

      if (files.thumb) data.append("thumb", files.thumb);
      if (files.glb) data.append("glb", files.glb);
      if (files.oldSitePhoto) data.append("oldSitePhoto", files.oldSitePhoto);
      if (files.newSitePhoto) data.append("newSitePhoto", files.newSitePhoto);

      const response = await api.post("sites", data, { timeout: 600000 });

      if (response.data) {
        toast.success("Site uploaded successfully!", { id: toastId });

        setFormData({
          title: "",
          location: "",
          summary: "",
          tags: "",
          history: "",
          architecture: "",
          conservation: "",
          modernRelevance: "",
          oldStructureDesc: "",
          newStructureDesc: "",
        });
        setFiles({ thumb: null, glb: null, oldSitePhoto: null, newSitePhoto: null });

        [thumbInputRef, glbInputRef, oldPhotoRef, newPhotoRef].forEach((ref) => {
          if (ref.current) ref.current.value = "";
        });
      }
    } catch (error) {
      console.error("Upload error", error);
      const msg = error.response?.data?.message || "Upload failed. Check connection.";
      toast.error(msg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 70, damping: 12 } },
  };

  const rotationVariants = {
    start: { rotate: 0 },
    end: { rotate: 360, transition: { duration: 40, ease: "linear", repeat: Infinity } },
  };

  return (
    <>
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />

      {/* Embedded styling for nicer Quill editors */}
      <style>{`
        .custom-quill .ql-toolbar {
          border-top-left-radius: 12px;
          border-top-right-radius: 12px;
          border-bottom: 1px solid rgba(0,0,0,0.06);
          background: #fff;
          padding: 6px 8px;
        }
        .custom-quill .ql-container {
          border-bottom-left-radius: 12px;
          border-bottom-right-radius: 12px;
          border: 1px solid rgba(0,0,0,0.06);
          box-shadow: none;
          background: #fff;
        }
        .custom-quill .ql-editor {
          padding: 16px;
          font-size: 15px;
          line-height: 1.6;
          color: #1f2937;
        }
        .custom-quill.small .ql-editor { min-height: 120px; }
        .custom-quill.medium .ql-editor { min-height: 180px; }
        .custom-quill.large .ql-editor { min-height: 260px; }
        .custom-quill .ql-editor.ql-blank::before {
          color: rgba(31,41,55,0.45);
          left: 16px;
        }
        .custom-quill .ql-container:focus-within {
          box-shadow: 0 6px 18px rgba(34,197,94,0.06);
          border-color: rgba(245,158,11,0.25);
        }
        .custom-quill .ql-toolbar .ql-formats button {
          border-radius: 8px;
        }
      `}</style>

      <NavBar />
      <section className="bg-gradient-to-br from-yellow-50 to-orange-100 min-h-screen py-6 relative overflow-hidden">
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
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/rice-paper.png')" }} />

        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-extrabold text-red-900 mb-4 drop-shadow-sm">
              Add New <span className="text-yellow-700">Heritage Site</span>
            </h1>
            <p className="text-lg text-gray-700 font-light max-w-2xl mx-auto">
              Contribute to the digital archive. Upload 3D models and historical narratives to preserve India's legacy.
            </p>
          </motion.div>

          <motion.form variants={containerVariants} initial="hidden" animate="visible" onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border-t-4 border-yellow-600 p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* LEFT COLUMN: now includes Modern Relevance */}
              <div className="space-y-6">
                <motion.div variants={itemVariants}>
                  <h3 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-yellow-600" /> Basic Information
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
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <input name="location" value={formData.location} placeholder="Agra, Uttar Pradesh" onChange={handleChange} className="w-full pl-10 p-2.5 bg-orange-50/50 border border-amber-200 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none transition" />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-bold text-gray-700 mb-1">Tags (comma separated)</label>
                    <div className="relative">
                      <Tag className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <input name="tags" value={formData.tags} placeholder="Mughal, Marble, Wonder" onChange={handleChange} className="w-full pl-10 p-2.5 bg-orange-50/50 border border-amber-200 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none transition" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Brief Summary</label>
                    <div className="custom-quill small bg-white border border-amber-200 rounded-xl overflow-hidden">
                      <ReactQuill value={formData.summary} onChange={(val) => handleQuillChange("summary", val)} modules={quillModules} formats={quillFormats} theme="snow" placeholder="A short introduction..." />
                    </div>
                  </div>
                </motion.div>

                {/* Media Uploads */}
                <motion.div variants={itemVariants} className="pt-4 border-t border-orange-200">
                  <h3 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2">
                    <FileBox className="w-5 h-5 text-yellow-600" /> Media Assets
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Thumbnail */}
                    <div className="border-2 border-dashed border-amber-300 rounded-xl p-4 text-center hover:bg-orange-50 transition cursor-pointer relative group">
                      <input type="file" name="thumb" ref={thumbInputRef} onChange={handleFileChange} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
                      <ImageIcon className="w-8 h-8 mx-auto text-amber-500 mb-2 group-hover:scale-110 transition" />
                      <p className="text-sm font-medium text-gray-600">{files.thumb ? files.thumb.name : "Upload Thumbnail"}</p>
                      <p className="text-xs text-gray-400">JPG, PNG</p>
                    </div>

                    {/* GLB Model */}
                    <div className="border-2 border-dashed border-amber-300 rounded-xl p-4 text-center hover:bg-orange-50 transition cursor-pointer relative group">
                      <input type="file" name="glb" ref={glbInputRef} onChange={handleFileChange} accept=".glb,.gltf" className="absolute inset-0 opacity-0 cursor-pointer" />
                      <FileBox className="w-8 h-8 mx-auto text-amber-500 mb-2 group-hover:scale-110 transition" />
                      <p className="text-sm font-medium text-gray-600">{files.glb ? files.glb.name : "Upload 3D Model"}</p>
                      <p className="text-xs text-gray-400">.GLB, .GLTF</p>
                    </div>
                  </div>

                  {/* MOVED: Modern Relevance (from right -> left) */}
                  <div className="mt-6">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-1">
                      <Zap className="w-4 h-4 text-amber-600" /> Modern Relevance
                    </label>
                    <div className="custom-quill medium bg-white border border-amber-200 rounded-xl overflow-hidden shadow-sm">
                      <ReactQuill value={formData.modernRelevance} onChange={(val) => handleQuillChange("modernRelevance", val)} modules={quillModules} formats={quillFormats} theme="snow" placeholder="Why this site matters today..." />
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* RIGHT COLUMN (now without Modern Relevance) */}
              <div className="space-y-4">
                <motion.div variants={itemVariants}>
                  <h3 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2">
                    <PenTool className="w-5 h-5 text-yellow-600" /> Detailed Narrative
                  </h3>

                  <div className="mb-4">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-1">
                      <Clock className="w-4 h-4 text-amber-600" /> History
                    </label>
                    <div className="custom-quill large bg-white border border-amber-200 rounded-xl overflow-hidden shadow-sm">
                      <ReactQuill value={formData.history} onChange={(val) => handleQuillChange("history", val)} modules={quillModules} formats={quillFormats} theme="snow" placeholder="Historical narrative..." />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-1">
                      <PenTool className="w-4 h-4 text-amber-600" /> Architecture
                    </label>
                    <div className="custom-quill large bg-white border border-amber-200 rounded-xl overflow-hidden shadow-sm">
                      <ReactQuill value={formData.architecture} onChange={(val) => handleQuillChange("architecture", val)} modules={quillModules} formats={quillFormats} theme="snow" placeholder="Architectural details..." />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-1">
                      <ShieldCheck className="w-4 h-4 text-amber-600" /> Conservation Status
                    </label>
                    <div className="custom-quill medium bg-white border border-amber-200 rounded-xl overflow-hidden shadow-sm">
                      <ReactQuill value={formData.conservation} onChange={(val) => handleQuillChange("conservation", val)} modules={quillModules} formats={quillFormats} theme="snow" placeholder="Conservation details..." />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* THEN vs NOW */}
            <motion.div variants={itemVariants} className="mt-10 pt-6 border-t border-orange-200">
              <h3 className="text-xl font-bold text-red-900 mb-6 flex items-center gap-2">
                <History className="w-5 h-5 text-yellow-600" /> Time Travel: Then vs. Now
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* PAST */}
                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 shadow-sm">
                  <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded text-xs">PAST</span> Historical Structure
                  </h4>

                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 mb-4 text-center relative hover:bg-gray-100 transition cursor-pointer">
                    <input type="file" name="oldSitePhoto" ref={oldPhotoRef} onChange={handleFileChange} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
                    <ImageIcon className="w-6 h-6 mx-auto text-gray-400 mb-1" />
                    <p className="text-sm font-medium text-gray-500">{files.oldSitePhoto?.name || "Upload Historical Photo 📸"}</p>
                  </div>

                  <div className="custom-quill large bg-white border border-gray-300 rounded-xl overflow-hidden">
                    <ReactQuill value={formData.oldStructureDesc} onChange={(val) => handleQuillChange("oldStructureDesc", val)} modules={quillModules} formats={quillFormats} theme="snow" placeholder="Describe how the site looked in the past..." />
                  </div>
                </div>

                {/* PRESENT */}
                <div className="p-5 bg-orange-50 rounded-2xl border border-orange-200 shadow-sm">
                  <h4 className="font-bold text-orange-800 mb-3 flex items-center gap-2">
                    <span className="bg-orange-200 text-orange-700 px-2 py-0.5 rounded text-xs">PRESENT</span> Current State
                  </h4>

                  <div className="border-2 border-dashed border-orange-300 rounded-xl p-4 mb-4 text-center relative hover:bg-orange-100 transition cursor-pointer">
                    <input type="file" name="newSitePhoto" ref={newPhotoRef} onChange={handleFileChange} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
                    <ImageIcon className="w-6 h-6 mx-auto text-orange-400 mb-1" />
                    <p className="text-sm font-medium text-orange-600">{files.newSitePhoto?.name || "Upload Current Photo 📸"}</p>
                  </div>

                  <div className="custom-quill large bg-white border border-orange-200 rounded-xl overflow-hidden">
                    <ReactQuill value={formData.newStructureDesc} onChange={(val) => handleQuillChange("newStructureDesc", val)} modules={quillModules} formats={quillFormats} theme="snow" placeholder="Describe the site's condition today..." />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-10 flex justify-end">
              <motion.button whileHover={{ scale: 1.02, boxShadow: "0px 10px 20px rgba(0,0,0,0.2)" }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-bold text-lg rounded-full shadow-lg transition-all border-b-4 border-yellow-800 disabled:opacity-70 disabled:cursor-not-allowed">
                {loading ? "Uploading..." : "Save Heritage Site"} {!loading && <Save className="w-5 h-5" />}
              </motion.button>
            </motion.div>
          </motion.form>
        </div>
      </section>
    </>
  );
}
