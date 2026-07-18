import React from 'react';
import { motion } from 'framer-motion';

export default function TrashBinModal({ bin, onClose }) {
  if (!bin) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
        className="bg-[#202020] border border-[#333] rounded-xl overflow-hidden w-full max-w-md shadow-2xl flex flex-col relative"
      >
        <div className="absolute top-3 right-3 z-10">
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-white hover:text-black transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className={`w-full h-48 flex items-center justify-center ${bin.bgColor || 'bg-[#1a1a1a]'}`}>
          {bin.image ? (
            <img src={bin.image} alt={bin.title} className="h-40 object-contain drop-shadow-xl" />
          ) : bin.IconComponent ? (
            <div className="transform scale-[1.2] origin-center flex items-center justify-center w-[100px] h-[100px]">
              <bin.IconComponent />
            </div>
          ) : null}
        </div>

        <div className="p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded text-white ${bin.tagColor}`}>
              {bin.tag}
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mb-3">{bin.title}</h2>
          <p className="text-gray-300 text-[14px] leading-relaxed">
            {bin.description}
          </p>
          
          <div className="mt-6 flex justify-end">
            <button 
              onClick={onClose}
              className="px-5 py-2 bg-[#333] hover:bg-[#444] text-white rounded-md text-sm font-semibold transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
