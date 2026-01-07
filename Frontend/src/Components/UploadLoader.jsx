import { motion } from "framer-motion";
import { Landmark, Palette } from "lucide-react";

export default function UploadLoader({ type }) {
  const isCulture = type === "culture";

  return (
    <motion.div
      className={`fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-md
      ${isCulture 
        ? "bg-gradient-to-br from-pink-900/70 via-rose-800/70 to-purple-900/70" 
        : "bg-gradient-to-br from-amber-900/70 via-orange-800/70 to-yellow-900/70"}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="text-center text-white max-w-md px-6">
        
        {/* ICON */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
          className="mb-6 inline-block"
        >
          {isCulture ? (
            <Palette className="w-20 h-20 text-pink-300" />
          ) : (
            <Landmark className="w-20 h-20 text-yellow-300" />
          )}
        </motion.div>

        {/* TITLE */}
        <motion.h2
          className="text-2xl md:text-3xl font-serif font-bold mb-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          Preserving History...
        </motion.h2>

        {/* SUBTEXT */}
        <motion.p
          className="text-sm md:text-base text-white/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Uploading data to the archive and digital vault.  
          Please do not close or refresh this page.
        </motion.p>

        {/* LOADING BAR */}
        <motion.div className="mt-8 h-2 w-full bg-white/20 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full 
              ${isCulture ? "bg-pink-400" : "bg-yellow-400"}`}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 20, repeat: Infinity }}
          />
        </motion.div>

      </div>
    </motion.div>
  );
}
