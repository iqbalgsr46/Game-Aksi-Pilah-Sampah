import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { reviewsData } from '../data/reviewsData';

export default function ReviewsModal({ isOpen, onClose }) {
  const [filter, setFilter] = useState('Most recent');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-10"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-[#2a2a2a] w-full max-w-4xl h-[85vh] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-[#444] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#333] bg-[#2d2d30]">
              <h2 className="text-[15px] font-bold text-white">Ratings and reviews</h2>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Filter */}
            <div className="px-6 py-4 border-b border-[#333] bg-[#2a2a2a]">
              <button className="flex items-center justify-between bg-[#333] hover:bg-[#3a3a3a] transition-colors rounded text-gray-200 text-[13px] px-4 py-2 w-48 border border-[#444]">
                {filter}
                <span className="material-symbols-outlined text-[16px]">keyboard_arrow_down</span>
              </button>
            </div>

            {/* Reviews List */}
            <div className="flex-1 overflow-y-auto bg-[#252525] p-6 flex flex-col gap-8 scrollbar-hide">
              {reviewsData.map((review) => (
                <div key={review.id} className="flex flex-col gap-2 border-b border-[#333] pb-6 last:border-0 last:pb-0">
                  <h3 className="text-white font-bold text-[15px] tracking-wide uppercase">{review.title}</h3>
                  <div className="flex items-center text-[#e65100]">
                     {[...Array(5)].map((_, i) => (
                       <span key={i} className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: i < review.rating ? "'FILL' 1" : "'FILL' 0" }}>star</span>
                     ))}
                  </div>
                  <p className="text-gray-300 text-[13px] leading-relaxed mt-1">
                    {review.content}
                  </p>
                  <div className="flex justify-between items-center text-[12px] text-gray-400 mt-2">
                     <div>
                       <span className="text-gray-200 font-medium">{review.author}</span> 
                       <span className="ml-3 text-gray-500">{review.timeAgo}</span>
                     </div>
                     <div className="flex items-center gap-4">
                        <button className="flex items-center gap-1.5 hover:text-white transition-colors">
                          <span className="material-symbols-outlined text-[16px]">thumb_up</span>
                          <span>{review.likes}</span>
                        </button>
                        <button className="flex items-center gap-1.5 hover:text-white transition-colors">
                          <span className="material-symbols-outlined text-[16px]">thumb_down</span>
                          <span>{review.dislikes}</span>
                        </button>
                        <button className="flex items-center hover:text-white transition-colors ml-1">
                          <span className="material-symbols-outlined text-[16px]">outlined_flag</span>
                        </button>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
