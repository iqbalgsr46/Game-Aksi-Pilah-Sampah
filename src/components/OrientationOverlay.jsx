import React from 'react';
import { motion } from 'framer-motion';

export default function OrientationOverlay() {
  return (
    <div className="hidden portrait:flex fixed inset-0 z-[9999] bg-slate-900 flex-col items-center justify-center p-8 text-center">
      {/* Animasi HP Berputar */}
      <motion.div
        animate={{ rotate: [-90, 0, -90] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", repeatDelay: 1 }}
        className="mb-8 w-24 h-40 border-4 border-white rounded-3xl flex items-center justify-center relative bg-slate-800"
      >
        {/* Notch / Speaker */}
        <div className="absolute top-2 w-8 h-1.5 bg-white/50 rounded-full"></div>
        {/* Layar pura-pura */}
        <div className="w-[85%] h-[80%] bg-emerald-500 rounded-lg mt-2 flex items-center justify-center overflow-hidden">
           <svg className="w-10 h-10 text-white/50 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
           </svg>
        </div>
      </motion.div>

      <h1 className="text-3xl md:text-5xl text-yellow-400 font-bubbly mb-4 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
        Putar Layar Anda!
      </h1>
      
      <p className="text-lg md:text-2xl text-white font-medium max-w-sm leading-relaxed drop-shadow-md">
        Game ini didesain khusus untuk dimainkan dalam posisi layar mendatar (lanskap).
        <br/><br/>
        <span className="text-emerald-400 font-bold bg-white/10 px-4 py-2 rounded-xl inline-block mt-2">Mohon putar HP Anda sekarang</span>
      </p>
    </div>
  );
}
