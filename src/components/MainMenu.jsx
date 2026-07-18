import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function MainMenu({ onStartGame, onOpenLeaderboard, onExit, isMuted, onToggleMute, playClickSound }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const jellyButtonHover = { scale: 1.05 };
  const jellyButtonTap = { 
    scale: 0.9, 
    y: 4, 
    transition: { type: "spring", stiffness: 400, damping: 10 } 
  };

  const handleMouseMove = (e) => {
    // Hitung posisi mouse dari -1 hingga 1 berdasarkan pusat layar
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = (e.clientY / window.innerHeight) * 2 - 1;
    setMousePosition({ x, y });

    // Posisi mouse tidak perlu mengubah state catDirection lagi
    // 3D rotation akan otomatis tertangani oleh mousePosition.x dan y
  };

  return (
    <main 
      className="relative w-screen h-screen overflow-hidden bg-slate-900 select-none font-bubbly"
      onMouseMove={handleMouseMove}
    >
      {/* 1. INTERACTIVE BACKGROUND LAYER (Parallax Video) */}
      <motion.div 
        className="absolute -inset-[100px] z-0"
        animate={{
          x: mousePosition.x * 40, // Bergeser searah kursor
          y: mousePosition.y * 40,
        }}
        transition={{ type: "spring", stiffness: 50, damping: 30 }}
      >
        <video 
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          src="/assets/videos/Green_valley_with_river_wildflowers_202607180817.mp4"
        />
      </motion.div>

      {/* 2. SIDEBAR ACTION BUTTONS */}
      <div className="absolute top-6 short:top-2 right-6 short:right-2 flex flex-col gap-4 short:gap-2 z-20">
        {/* Tombol Keluar (Merah 3D) */}
        <motion.button 
          whileHover={jellyButtonHover}
          whileTap={jellyButtonTap}
          className="relative overflow-hidden w-16 h-16 md:w-20 md:h-20 short:w-12 short:h-12 bg-gradient-to-b from-red-400/80 to-red-600/90 backdrop-blur-md rounded-2xl border-[4px] border-white/70 shadow-[0_6px_0_rgba(153,27,27,0.4),inset_0_4px_8px_rgba(255,255,255,0.4)] flex items-center justify-center cursor-pointer group"
          onClick={() => { 
            if(playClickSound) playClickSound(); 
            setTimeout(() => {
              if (onExit) onExit();
              else window.close();
            }, 100); 
          }}
        >
          <div className="absolute top-1 left-2 w-3 h-3 md:w-4 md:h-4 short:w-2 short:h-2 bg-white/80 rounded-full blur-[0.5px]"></div>
          <div className="absolute top-1 left-6 w-1.5 h-1.5 md:w-2 md:h-2 short:hidden bg-white/80 rounded-full blur-[0.5px]"></div>
          <div className="absolute bottom-2 right-2 w-2.5 h-2.5 md:w-3 md:h-3 short:w-1.5 short:h-1.5 bg-white/60 rounded-full blur-[0.5px]"></div>
          <svg className="w-8 h-8 md:w-10 md:h-10 short:w-6 short:h-6 text-white/90 drop-shadow-md group-hover:scale-105 transition-transform" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="6" y1="18" x2="18" y2="6" />
          </svg>
        </motion.button>

        {/* Tombol Leaderboard (Biru 3D) */}
        <motion.button 
          whileHover={jellyButtonHover}
          whileTap={jellyButtonTap}
          className="relative overflow-hidden w-16 h-16 md:w-20 md:h-20 short:w-12 short:h-12 bg-gradient-to-b from-cyan-400/50 to-blue-500/60 backdrop-blur-md rounded-2xl border-[4px] border-white/70 flex items-center justify-center shadow-[0_6px_0_rgba(30,58,138,0.4),inset_0_4px_8px_rgba(255,255,255,0.4)] cursor-pointer group"
          onClick={onOpenLeaderboard}
        >
          <div className="absolute top-1 left-2 w-3 h-3 md:w-4 md:h-4 short:w-2 short:h-2 bg-white/80 rounded-full blur-[0.5px]"></div>
          <div className="absolute top-1 left-6 w-1.5 h-1.5 md:w-2 md:h-2 short:hidden bg-white/80 rounded-full blur-[0.5px]"></div>
          <div className="absolute bottom-2 right-2 w-2.5 h-2.5 md:w-3 md:h-3 short:w-1.5 short:h-1.5 bg-white/60 rounded-full blur-[0.5px]"></div>
          <svg className="w-10 h-10 md:w-12 md:h-12 short:w-7 short:h-7 text-white/90 fill-current drop-shadow-md group-hover:scale-105 transition-transform" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1" strokeLinejoin="round">
            <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0 0 11 15.9V19H7v2h10v-2h-4v-3.1a5.01 5.01 0 0 0 3.61-2.96C19.08 10.63 21 8.55 21 6V5c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
          </svg>
        </motion.button>

        {/* Tombol Mute Audio (Hijau / Abu-abu 3D) */}
        <motion.button 
          whileHover={jellyButtonHover}
          whileTap={jellyButtonTap}
          className={`relative overflow-hidden w-16 h-16 md:w-20 md:h-20 short:w-12 short:h-12 bg-gradient-to-b backdrop-blur-md rounded-2xl border-[4px] border-white/70 flex items-center justify-center cursor-pointer group ${isMuted ? 'from-slate-400/50 to-slate-600/60 shadow-[0_6px_0_rgba(71,85,105,0.4),inset_0_4px_8px_rgba(255,255,255,0.4)]' : 'from-green-400/50 to-green-600/60 shadow-[0_6px_0_rgba(22,101,52,0.4),inset_0_4px_8px_rgba(255,255,255,0.4)]'}`}
          onClick={onToggleMute}
        >
          <div className="absolute top-1 left-2 w-3 h-3 md:w-4 md:h-4 short:w-2 short:h-2 bg-white/80 rounded-full blur-[0.5px]"></div>
          <div className="absolute top-1 left-6 w-1.5 h-1.5 md:w-2 md:h-2 short:hidden bg-white/80 rounded-full blur-[0.5px]"></div>
          <div className="absolute bottom-2 right-2 w-2.5 h-2.5 md:w-3 md:h-3 short:w-1.5 short:h-1.5 bg-white/60 rounded-full blur-[0.5px]"></div>
          {isMuted ? (
            <svg className="w-8 h-8 md:w-10 md:h-10 short:w-6 short:h-6 text-white/90 drop-shadow-md group-hover:scale-105 transition-transform" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
              <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
              <line x1="23" y1="9" x2="17" y2="15"></line>
              <line x1="17" y1="9" x2="23" y2="15"></line>
            </svg>
          ) : (
            <svg className="w-8 h-8 md:w-10 md:h-10 short:w-6 short:h-6 text-white/90 drop-shadow-md group-hover:scale-105 transition-transform" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
              <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
          )}
        </motion.button>
      </div>

      {/* 3. CENTER CONTENT BLOCK (Teks Bubbly & Tombol Play) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
        
        {/* Judul Game */}
        <div className="text-center mb-12 short:mb-4 flex flex-col items-center">
          <motion.h1 
            animate={{ y: [0, -15, 0], rotate: [-2, 2, -2], scale: [1, 1.02, 1] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="text-5xl md:text-7xl short:text-4xl text-yellow-400 tracking-wide drop-shadow-[4px_6px_0_rgba(71,85,105,0.8)]"
            style={{ 
              WebkitTextStroke: '4px #1e293b', 
              paintOrder: 'stroke fill' 
            }}
          >
            Game Pilah Sampah
          </motion.h1>
          <motion.h2 
            animate={{ y: [0, 10, 0], rotate: [-4, 0, -4], scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
            className="text-4xl md:text-6xl short:text-3xl text-green-400 tracking-wider -rotate-3 mt-1 drop-shadow-[3px_5px_0_rgba(71,85,105,0.8)]"
            style={{ 
              WebkitTextStroke: '3px #1e293b', 
              paintOrder: 'stroke fill' 
            }}
          >
            Go Green...
          </motion.h2>
        </div>

        {/* Tombol Play (Glossy Jelly Button) */}
        <motion.button 
          animate={{ rotate: [-3, 3, -3] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          whileHover={jellyButtonHover}
          whileTap={jellyButtonTap}
          className="relative pointer-events-auto w-44 h-44 md:w-56 md:h-56 short:w-28 short:h-28 bg-gradient-to-b from-cyan-300/30 to-cyan-500/40 backdrop-blur-md rounded-[3rem] md:rounded-[4rem] short:rounded-[2rem] border-[8px] short:border-[4px] border-white/50 flex items-center justify-center shadow-[0_12px_0_rgba(2,132,199,0.3),inset_0_8px_16px_rgba(255,255,255,0.4)] cursor-pointer group overflow-hidden"
          onClick={onStartGame}
        >
          {/* Efek kilap gelembung (Glossy dots) */}
          <div className="absolute top-4 left-6 w-8 h-8 md:w-10 md:h-10 short:w-5 short:h-5 bg-white/70 rounded-full blur-[1px]"></div>
          <div className="absolute top-3 left-16 w-4 h-4 md:w-6 md:h-6 short:w-3 short:h-3 bg-white/70 rounded-full blur-[1px]"></div>
          <div className="absolute bottom-4 right-6 w-6 h-6 md:w-8 md:h-8 short:w-4 short:h-4 bg-white/50 rounded-full blur-[1px]"></div>

          <svg 
            className="w-24 h-24 md:w-28 md:h-28 short:w-14 short:h-14 text-white/90 fill-current transform translate-x-2 group-hover:scale-105 transition-transform duration-200 drop-shadow-md" 
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinejoin="round"
          >
            <path d="M5 3l14 9-14 9V3z" />
          </svg>
        </motion.button>
      </div>

      {/* 4. FOOTER EDUCATIONAL TEXT */}
      <div className="absolute bottom-6 w-full text-center px-4 z-10 pointer-events-none">
        <motion.p 
          animate={{ scale: [1, 1.03, 1], rotate: [-1, 1, -1] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="text-white text-lg md:text-2xl tracking-wide drop-shadow-[0_3px_3px_rgba(0,0,0,0.8)]"
        >
          Selamatkan Lingkunganmu dari Sampah...!!!
        </motion.p>
      </div>
    </main>
  );
}

