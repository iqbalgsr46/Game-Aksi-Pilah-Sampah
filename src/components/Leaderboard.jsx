import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getLeaderboard, clearLeaderboard } from '../utils/leaderboard';

export default function Leaderboard({ onClose, playClickSound }) {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    setScores(getLeaderboard());
  }, []);

  const handleClear = () => {
    if (window.confirm("Apakah Anda yakin ingin mereset papan peringkat?")) {
      clearLeaderboard();
      setScores([]);
      if (playClickSound) playClickSound();
    }
  };

  return (
    <main 
      className="relative w-screen h-screen overflow-hidden flex items-center justify-center select-none bg-black"
      style={{ fontFamily: "'Plus Jakarta Sans', 'Blue Water', sans-serif" }}
    >
      {/* Background Video Penuh Tanpa Filter Gelap */}
      <video 
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 z-0 w-full h-full object-cover"
        style={{ willChange: 'transform', transform: 'translateZ(0)', imageRendering: 'high-quality' }}
        src="/assets/videos/Lake_with_purple_mountains_twilight_202607181509.mp4"
      />

      {/* Konten Utama Terpusat */}
      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center justify-center px-4 md:px-8 py-12">
        
        {/* Header Judul Besar */}
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="text-center mb-6 md:mb-8 w-full"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl text-white font-bubbly drop-shadow-[0_10px_10px_rgba(0,0,0,0.6)] tracking-wider" style={{ WebkitTextStroke: '3px #1e3a8a' }}>
            PAPAN PERINGKAT
          </h1>
        </motion.div>

        {/* Daftar Skor (Dalam Container Glassmorphism yang Rapi) */}
        {scores.length === 0 ? (
          <div className="w-full flex items-center justify-center">
            <div className="bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-[3rem] p-12 shadow-2xl text-center">
              <p className="text-4xl text-white font-bubbly drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
                Belum ada juara!<br/><span className="text-2xl opacity-80 mt-2 block">Mainkan gamenya sekarang!</span>
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center">
            {/* Glassmorphism Container */}
            <div className="w-full h-[60vh] md:h-[65vh] bg-white/10 backdrop-blur-xl border border-white/30 rounded-[2.5rem] p-4 md:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden">
              
              {/* Scrollable List */}
              <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/40 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/60 transition-colors">
                {scores.map((entry, index) => (
                  <motion.div 
                    key={entry.id}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 * index, type: "spring", stiffness: 100 }}
                    className={`flex items-center justify-between py-4 px-4 md:py-5 md:px-6 rounded-2xl border-2 shadow-lg relative group ${
                      index === 0 ? 'bg-gradient-to-r from-yellow-500/90 to-yellow-400/90 border-yellow-200 text-yellow-50' :
                      index === 1 ? 'bg-gradient-to-r from-slate-400/90 to-slate-300/90 border-white text-slate-50' :
                      index === 2 ? 'bg-gradient-to-r from-orange-600/90 to-orange-500/90 border-orange-200 text-orange-50' :
                      'bg-gradient-to-r from-blue-900/80 to-blue-800/80 border-blue-400/50 text-blue-50'
                    }`}
                  >
                    {/* Glass shine effect on hover (Isolated to prevent text clipping) */}
                    <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out" />
                    </div>
                    
                    {/* Ranking & Group Name */}
                    <div className="flex items-center gap-4 md:gap-5 relative z-10">
                      <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-2xl md:text-3xl font-bold border-2 shadow-inner shrink-0 ${
                        index === 0 ? 'bg-yellow-300 border-yellow-100 text-yellow-700 shadow-yellow-600' : 
                        index === 1 ? 'bg-slate-200 border-white text-slate-600 shadow-slate-400' : 
                        index === 2 ? 'bg-orange-300 border-orange-100 text-orange-800 shadow-orange-600' : 
                        'bg-blue-800/50 border-blue-300 text-white'
                      }`}>
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : (index + 1)}
                      </div>
                      <h2 className="text-2xl md:text-4xl font-bubbly drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] uppercase tracking-wide truncate max-w-[200px] md:max-w-[16rem]">
                        {entry.groupName}
                      </h2>
                    </div>

                    {/* Score & Mode */}
                    <div className="flex flex-col items-end justify-center relative z-10 shrink-0">
                      <span className="text-4xl md:text-5xl font-bubbly drop-shadow-[0_4px_4px_rgba(0,0,0,0.6)] leading-none">
                        {entry.score}
                      </span>
                      <span className="text-xs md:text-sm font-bold uppercase tracking-widest opacity-90 drop-shadow-md mt-1">
                        Mode: {entry.mode}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tombol Aksi di Sudut Kanan Bawah */}
      <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 z-20 flex gap-4">
        {scores.length > 0 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9, y: 4, transition: { type: "spring", stiffness: 400, damping: 10 } }}
            onClick={handleClear}
            title="Reset Data"
            className="relative overflow-hidden w-14 h-14 md:w-16 md:h-16 bg-gradient-to-b from-orange-400/60 to-orange-600/70 backdrop-blur-md rounded-2xl border-[4px] border-white/70 flex items-center justify-center shadow-[0_6px_0_rgba(154,52,18,0.4),inset_0_4px_8px_rgba(255,255,255,0.4)] cursor-pointer group"
          >
            <div className="absolute top-1 left-2 w-3 h-3 md:w-4 md:h-4 bg-white/80 rounded-full blur-[0.5px]"></div>
            <div className="absolute top-1 left-6 w-1.5 h-1.5 md:w-2 md:h-2 bg-white/80 rounded-full blur-[0.5px]"></div>
            <div className="absolute bottom-2 right-2 w-2.5 h-2.5 md:w-3 md:h-3 bg-white/60 rounded-full blur-[0.5px]"></div>
            <svg className="w-7 h-7 md:w-8 md:h-8 text-white/90 drop-shadow-md group-hover:scale-105 transition-transform" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </motion.button>
        )}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9, y: 4, transition: { type: "spring", stiffness: 400, damping: 10 } }}
          onClick={() => {
            if(playClickSound) playClickSound();
            onClose();
          }}
          title="Kembali"
          className="relative overflow-hidden w-14 h-14 md:w-16 md:h-16 bg-gradient-to-b from-red-400/60 to-red-600/70 backdrop-blur-md rounded-2xl border-[4px] border-white/70 flex items-center justify-center shadow-[0_6px_0_rgba(153,27,27,0.4),inset_0_4px_8px_rgba(255,255,255,0.4)] cursor-pointer group"
        >
          <div className="absolute top-1 left-2 w-3 h-3 md:w-4 md:h-4 bg-white/80 rounded-full blur-[0.5px]"></div>
          <div className="absolute top-1 left-6 w-1.5 h-1.5 md:w-2 md:h-2 bg-white/80 rounded-full blur-[0.5px]"></div>
          <div className="absolute bottom-2 right-2 w-2.5 h-2.5 md:w-3 md:h-3 bg-white/60 rounded-full blur-[0.5px]"></div>
          <svg className="w-8 h-8 md:w-9 md:h-9 text-white/90 drop-shadow-md group-hover:scale-105 transition-transform" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="6" y1="18" x2="18" y2="6" />
          </svg>
        </motion.button>
      </div>

    </main>
  );
}
