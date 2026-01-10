import React, { useState, useRef, useEffect } from "react";
import { X, Send, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import apii from "../../API/apii"; 

// 1. Custom Gemini Sparkle Icon
const GeminiIcon = ({ className }) => (
  <svg 
    viewBox="0 0 512 512" 
    fill="currentColor" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M256,0c0,141.385,114.615,256,256,256c-141.385,0-256,114.615-256,256C256,370.615,141.385,256,0,256 C141.385,256,256,141.385,256,0z" />
  </svg>
);

export const GeminiAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([
    { role: "ai", text: "Namaste! 🙏 I am your Heritage Guide. Ask me about India's history or sites." },
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!query.trim()) return;

    const userMessage = query;
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setQuery("");
    setLoading(true);

    try {
      const res = await apii.post("/ask", { query: userMessage });
      setMessages((prev) => [...prev, { role: "ai", text: res.data.answer }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "❌ Apologies, I cannot reach the heritage archives right now." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-4 font-sans">
      
      {/* Chat Interface Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-[360px] sm:w-[380px] h-[520px] bg-[#FAF9F6] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-[#D4C5A5]"
          >
            {/* Header - Royal Heritage Red */}
            <div className="px-5 py-4 bg-[#8B2E2E] flex justify-between items-center shadow-md">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-white/10 rounded-full backdrop-blur-sm">
                  <Sparkles size={16} className="text-yellow-400" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-yellow-50 tracking-wide leading-none">
                    Heritage Guide
                  </h3>
                  <p className="text-[10px] text-red-200 uppercase tracking-wider mt-1 opacity-90">
                    Powered by Gemini AI
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Chat Area - Cream Texture Background */}
            <div 
              ref={scrollRef} 
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FAF9F6]"
            >
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`px-4 py-3 text-[14px] leading-relaxed max-w-[85%] shadow-sm
                      ${msg.role === "user"
                        ? "bg-[#D97706] text-white rounded-2xl rounded-br-none" // User: Saffron/Orange
                        : "bg-white border border-stone-200 text-gray-800 rounded-2xl rounded-bl-none" // AI: White
                      }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-white border border-stone-100 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input Area - Clean & Modern */}
            <div className="p-4 bg-white border-t border-stone-100">
              <div className="relative flex items-center bg-stone-100 rounded-full border border-stone-200 px-2 py-1 focus-within:ring-2 focus-within:ring-[#8B2E2E]/20 focus-within:border-[#8B2E2E]/50 transition-all">
                <input
                  className="flex-1 bg-transparent px-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
                  placeholder="Ask about history, monuments..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button
                  onClick={handleSend}
                  disabled={!query.trim() || loading}
                  className={`p-2 rounded-full m-1 transition-all duration-200
                    ${!query.trim() 
                      ? "bg-gray-200 text-gray-400" 
                      : "bg-[#8B2E2E] text-white hover:bg-[#702424] shadow-sm hover:shadow-md"
                    }`}
                >
                  <Send size={16} className={query.trim() ? "ml-0.5" : ""} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 z-50
          ${isOpen 
            ? "bg-white text-gray-600 border border-gray-200" 
            : "bg-gradient-to-br from-[#8B2E2E] to-[#682222] text-yellow-400 border-2 border-yellow-500/30"
          }`}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="gemini"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                animate={{ rotate: [0, 10, 0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                <GeminiIcon className="w-8 h-8 drop-shadow-md" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

    </div>
  );
};