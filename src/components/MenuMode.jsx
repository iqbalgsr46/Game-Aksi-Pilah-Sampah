import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function MenuMode({ onSelectMode, onClose, onOpenLeaderboard, isMuted, onToggleMute }) {
  return (
    <main className="relative w-screen h-screen overflow-hidden select-none bg-black"
      style={{ fontFamily: "'Plus Jakarta Sans', 'Blue Water', sans-serif" }}
    >
      {/* Overlay hitam untuk efek memudar (fade from black) saat halaman dimuat */}
      <motion.div 
        className="absolute inset-0 z-50 bg-black pointer-events-none"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      
      {/* ===== BACKGROUND VIDEO ===== */}
      <video 
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 z-0 w-full h-full object-cover"
        style={{ 
          willChange: 'transform', 
          transform: 'translateZ(0)',
          imageRendering: 'high-quality' 
        }}
        src="/assets/videos/Woman_holding_trash_bag_202607180748.mp4"
      />

      {/* ===== UI OVERLAY ===== */}
      <div className="relative z-10 w-full h-full flex flex-col">

        {/* ===== TOP BAR ===== */}
        <header className="w-full pt-6 px-6 flex justify-between items-start">
          {/* Left: Score */}
          <motion.div 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="flex items-center gap-3 bg-amber-500/75 backdrop-blur-md border-[6px] border-white/50 rounded-2xl px-6 py-3 shadow-[0_8px_0_rgba(146,64,14,0.4)]"
          >
            <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
            <span className="text-white text-2xl font-extrabold tracking-wide drop-shadow-sm">Score: 0</span>
          </motion.div>

          {/* Right: Action Buttons (Matches MainMenu sidebar exactly) */}
          <div className="absolute top-6 right-6 flex flex-col gap-4 z-10">
            {/* Tombol Keluar (Merah 3D) */}
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9, y: 4, transition: { type: "spring", stiffness: 400, damping: 10 } }}
              className="relative overflow-hidden w-16 h-16 md:w-20 md:h-20 bg-gradient-to-b from-red-400/50 to-red-600/60 backdrop-blur-md rounded-2xl border-[4px] border-white/70 flex items-center justify-center shadow-[0_6px_0_rgba(153,27,27,0.4),inset_0_4px_8px_rgba(255,255,255,0.4)] cursor-pointer group"
              onClick={onClose}
            >
              <div className="absolute top-1 left-2 w-3 h-3 md:w-4 md:h-4 bg-white/80 rounded-full blur-[0.5px]"></div>
              <div className="absolute top-1 left-6 w-1.5 h-1.5 md:w-2 md:h-2 bg-white/80 rounded-full blur-[0.5px]"></div>
              <div className="absolute bottom-2 right-2 w-2.5 h-2.5 md:w-3 md:h-3 bg-white/60 rounded-full blur-[0.5px]"></div>
              <svg className="w-8 h-8 md:w-10 md:h-10 text-white/90 drop-shadow-md group-hover:scale-105 transition-transform" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="6" y1="18" x2="18" y2="6" />
              </svg>
            </motion.button>

            {/* Tombol Leaderboard (Biru 3D) */}
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9, y: 4, transition: { type: "spring", stiffness: 400, damping: 10 } }}
              className="relative overflow-hidden w-16 h-16 md:w-20 md:h-20 bg-gradient-to-b from-cyan-400/50 to-blue-500/60 backdrop-blur-md rounded-2xl border-[4px] border-white/70 flex items-center justify-center shadow-[0_6px_0_rgba(30,58,138,0.4),inset_0_4px_8px_rgba(255,255,255,0.4)] cursor-pointer group"
              onClick={onOpenLeaderboard}
            >
              <div className="absolute top-1 left-2 w-3 h-3 md:w-4 md:h-4 bg-white/80 rounded-full blur-[0.5px]"></div>
              <div className="absolute top-1 left-6 w-1.5 h-1.5 md:w-2 md:h-2 bg-white/80 rounded-full blur-[0.5px]"></div>
              <div className="absolute bottom-2 right-2 w-2.5 h-2.5 md:w-3 md:h-3 bg-white/60 rounded-full blur-[0.5px]"></div>
              <svg className="w-10 h-10 md:w-12 md:h-12 text-white/90 fill-current drop-shadow-md group-hover:scale-105 transition-transform" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1" strokeLinejoin="round">
                <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0 0 11 15.9V19H7v2h10v-2h-4v-3.1a5.01 5.01 0 0 0 3.61-2.96C19.08 10.63 21 8.55 21 6V5c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
              </svg>
            </motion.button>

            {/* Tombol Mute Audio (Hijau / Abu-abu 3D) */}
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9, y: 4, transition: { type: "spring", stiffness: 400, damping: 10 } }}
              className={`relative overflow-hidden w-16 h-16 md:w-20 md:h-20 bg-gradient-to-b backdrop-blur-md rounded-2xl border-[4px] border-white/70 flex items-center justify-center cursor-pointer group ${isMuted ? 'from-slate-400/50 to-slate-600/60 shadow-[0_6px_0_rgba(71,85,105,0.4),inset_0_4px_8px_rgba(255,255,255,0.4)]' : 'from-green-400/50 to-green-600/60 shadow-[0_6px_0_rgba(22,101,52,0.4),inset_0_4px_8px_rgba(255,255,255,0.4)]'}`}
              onClick={onToggleMute}
            >
              <div className="absolute top-1 left-2 w-3 h-3 md:w-4 md:h-4 bg-white/80 rounded-full blur-[0.5px]"></div>
              <div className="absolute top-1 left-6 w-1.5 h-1.5 md:w-2 md:h-2 bg-white/80 rounded-full blur-[0.5px]"></div>
              <div className="absolute bottom-2 right-2 w-2.5 h-2.5 md:w-3 md:h-3 bg-white/60 rounded-full blur-[0.5px]"></div>
              {isMuted ? (
                <svg className="w-8 h-8 md:w-10 md:h-10 text-white/90 drop-shadow-md group-hover:scale-105 transition-transform" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
                  <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
                  <line x1="23" y1="9" x2="17" y2="15"></line>
                  <line x1="17" y1="9" x2="23" y2="15"></line>
                </svg>
              ) : (
                <svg className="w-8 h-8 md:w-10 md:h-10 text-white/90 drop-shadow-md group-hover:scale-105 transition-transform" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
                  <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                </svg>
              )}
            </motion.button>
          </div>
        </header>

        {/* ===== MAIN CONTENT ===== */}
        <main className="flex-1 w-full flex items-center justify-between px-16 lg:px-32 mt-6 relative">
          
          {/* Left Side: Character */}
          <div className="w-1/2 h-full relative flex items-end justify-center pb-24">
            

          </div>

          {/* Right Side: Title & Menu Buttons */}
          <div className="w-1/2 max-w-md flex flex-col gap-6 items-center mr-8 lg:mr-24">
            
            {/* Title */}
            <motion.h1 
              animate={{ y: -15 }}
              transition={{ repeat: Infinity, repeatType: "mirror", duration: 2, ease: "easeInOut" }}
              className="text-6xl md:text-8xl text-white mb-6 text-center"
              style={{ 
                fontFamily: "'Blue Water', cursive, sans-serif",
                WebkitTextStroke: '3px #166534',
                textShadow: '0 6px 0 #166534, 0 8px 15px rgba(0,0,0,0.3)',
                willChange: 'transform',
              }}
            >
              Go Green
            </motion.h1>

            {/* Mode Buttons (Translucent Glass Jelly Style with Vibrant Colors) */}
            {[
              { label: 'Pilah Sampah', mode: 'PILAH', bgClass: 'from-emerald-400/75 to-emerald-600/85', shadow: 'rgba(22,101,52,0.45)' },
              { label: 'Cari Sampah', mode: 'CARI', bgClass: 'from-amber-300/75 to-amber-500/85', shadow: 'rgba(146,64,14,0.45)' },
              { label: 'Tangkap Sampah', mode: 'TANGKAP', bgClass: 'from-red-400/75 to-red-600/85', shadow: 'rgba(153,27,27,0.45)' },
            ].map((btn, i) => (
              <motion.button
                key={btn.mode}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 150, damping: 20, delay: 0.2 + i * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98, y: 8 }}
                onClick={() => onSelectMode(btn.mode)}
                className={`relative w-full py-6 px-8 rounded-[2.5rem] border-[6px] border-white/50 bg-gradient-to-b ${btn.bgClass} backdrop-blur-md flex items-center justify-center gap-4 group overflow-hidden cursor-pointer`}
                style={{
                  boxShadow: `0 8px 0 ${btn.shadow}, inset 0 8px 16px rgba(255,255,255,0.4), 0 12px 20px rgba(0,0,0,0.25)`,
                }}
              >
                {/* Glossy overlay dots */}
                <div className="absolute top-2 left-6 w-5 h-5 bg-white/80 rounded-full blur-[0.5px]"></div>
                <div className="absolute top-1 left-3 w-3 h-3 bg-white/80 rounded-full blur-[0.5px]"></div>

                {/* Top Inner Curve Highlight */}
                <div className="absolute top-1 left-12 right-12 h-2 bg-gradient-to-b from-white/60 to-transparent rounded-full blur-[0.5px]"></div>
                
                {/* Bottom Inner Curve Highlight */}
                <div className="absolute bottom-1.5 left-10 right-10 h-1.5 bg-gradient-to-t from-white/50 to-transparent rounded-full blur-[0.5px]"></div>

                {/* Bottom Right Dot */}
                <div className="absolute bottom-2 right-4 w-2 h-2 bg-white/70 rounded-full blur-[0.5px]"></div>
                
                <span className="text-white text-3xl md:text-4xl font-extrabold tracking-wide drop-shadow-[0_4px_0_rgba(0,0,0,0.3)] group-hover:scale-105 transition-transform relative z-10">
                  {btn.label}
                </span>
              </motion.button>
            ))}
          </div>


        </main>

        {/* ===== FOOTER ===== */}
        <footer className="w-full pb-4 flex items-center justify-center px-4">
          <motion.p 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-sm text-white font-bold max-w-2xl bg-black/40 px-6 py-2 rounded-full backdrop-blur-sm"
          >
            Ayo Jaga Kebersihan! Pilah sampahmu sekarang untuk masa depan bumi.
          </motion.p>
        </footer>

      </div>
    </main>
  );
}
