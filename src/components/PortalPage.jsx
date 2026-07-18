import React from 'react';
import { motion } from 'framer-motion';

export default function PortalPage({ onRunGame }) {
  const handleRunGame = () => {
    // 1. Request Fullscreen first (harus sinkron dengan click event)
    try {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch((err) => {
          console.log("Fullscreen ditolak oleh browser:", err);
        });
      }
    } catch (error) {
      console.log("Fullscreen tidak didukung:", error);
    }

    // 2. Langsung masuk ke game
    onRunGame();
  };
  return (
    <div className="min-h-screen bg-[#f4f4f4] font-sans text-gray-800">
      
      {/* Top Header / Nav (Optional, usually itch.io has a small dark nav, but we'll stick to the layout) */}
      <div className="w-full bg-white border-b border-gray-200 py-3 px-6 shadow-sm flex items-center justify-between hidden">
        {/* Placeholder for top nav if needed */}
      </div>

      <main className="max-w-4xl mx-auto py-12 px-4 md:px-8 relative">
        
        {/* Game Container Placeholder */}
        <div className="w-full aspect-video bg-[#e5e5e5] rounded flex items-center justify-center mb-8 shadow-sm border border-gray-300 relative overflow-hidden group">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRunGame}
            className="flex items-center gap-2 bg-[#fa5c5c] hover:bg-[#e04e4e] text-white font-medium py-3 px-6 rounded shadow-md transition-colors z-10"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Run game
          </motion.button>
        </div>

        {/* Text Description */}
        <div className="bg-transparent rounded">
          <h1 className="text-xl md:text-2xl font-bold mb-4 text-[#222]">
            Game Aksi Pilah Sampah
          </h1>
          
          <p className="text-[15px] text-[#444] mb-6 leading-relaxed max-w-3xl">
            Permainan Edukasi Pilah Sampah ini adalah permainan edukasi tentang pemilahan dan pengolahan sampah. 
            Permainan board game bertema lingkungan ini bertujuan untuk mengedukasi pemainnya agar lebih cinta dan peduli lingkungan.
          </p>
        </div>

      </main>
    </div>
  );
}
