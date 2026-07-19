import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function GamingPage({ onClose, onRunGame }) {
  const [time, setTime] = useState("");
  
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full h-full bg-[#1b1d22] text-white flex flex-col font-sans overflow-hidden select-none relative"
    >
      
      {/* Top Header Overlay */}
      <div className="absolute top-0 right-0 w-full p-6 flex justify-end items-center gap-6 z-30 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none">
        <span className="material-symbols-outlined text-[28px] cursor-pointer hover:text-white text-gray-200 pointer-events-auto">search</span>
        <span className="material-symbols-outlined text-[28px] cursor-pointer hover:text-white text-gray-200 pointer-events-auto">wifi</span>
        <div className="flex items-center gap-2 text-gray-200 pointer-events-auto">
          <span className="material-symbols-outlined text-[28px]">battery_full</span>
          <span className="text-xl font-medium tracking-wide">{time}</span>
        </div>
        <div className="w-9 h-9 rounded-full bg-[#333]/80 border border-gray-500 flex items-center justify-center cursor-pointer hover:bg-gray-600 transition-colors pointer-events-auto">
          <span className="material-symbols-outlined text-[24px]">help</span>
        </div>
      </div>

      {/* Hero Banner Section */}
      <div className="relative w-full h-[55%] min-h-[400px] flex-shrink-0">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1b1d22]/90 via-transparent to-transparent z-10 pointer-events-none"></div>
        <div className="absolute bottom-0 w-full h-[200px] bg-gradient-to-t from-[#1b1d22] via-[#1b1d22]/80 to-transparent z-10 pointer-events-none"></div>
        
        {/* Banner Image */}
        <img src="/assets/images/image-1.png" alt="Game Banner" className="w-full h-full object-cover object-center brightness-90" />
      </div>

      {/* Main Container for the rest */}
      <div className="flex-1 overflow-y-auto premium-scrollbar relative z-20 -mt-10 flex flex-col">
         {/* Action Bar */}
         <div className="px-12 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex flex-col md:flex-row md:items-center gap-10">
              {/* Play Button */}
              <button 
                onClick={onRunGame}
                className="bg-[#5cba46] hover:bg-[#6cda52] active:scale-95 transition-all text-white px-10 py-3.5 rounded-sm flex items-center justify-center gap-3 shadow-lg"
              >
                <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                <span className="text-[20px] font-bold tracking-wide">Mainkan</span>
              </button>
              
              {/* Stats */}
              <div className="flex gap-14">
                 <div className="flex flex-col">
                    <span className="text-[12px] text-gray-400 font-bold tracking-widest uppercase mb-1">Terakhir Dimainkan</span>
                    <span className="text-xl font-semibold text-gray-100">Hari ini</span>
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[12px] text-gray-400 font-bold tracking-widest uppercase mb-1">Waktu Bermain</span>
                    <span className="text-xl font-semibold text-gray-100">0 jam</span>
                 </div>
              </div>
            </div>
            
            {/* Right Icons */}
            <div className="flex items-center gap-4">
               <button className="w-[50px] h-[50px] bg-[#2d323a] hover:bg-[#3a414b] rounded flex items-center justify-center text-gray-300 transition-colors">
                  <span className="material-symbols-outlined text-[28px]">sports_esports</span>
               </button>
               <button className="w-[50px] h-[50px] bg-[#2d323a] hover:bg-[#3a414b] rounded flex items-center justify-center text-gray-300 transition-colors">
                  <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>settings</span>
               </button>
            </div>
         </div>

         {/* Navigation Tabs */}
         <div className="px-12 flex flex-wrap items-center gap-8 mt-4">
            <button className="bg-[#484d56] text-white px-5 py-2 rounded-full text-sm font-bold tracking-[0.15em] uppercase shadow-sm">Aktivitas</button>
            <button className="text-gray-400 hover:text-white px-3 py-2 text-sm font-bold tracking-[0.15em] uppercase transition-colors">Milikmu</button>
            <button className="text-gray-400 hover:text-white px-3 py-2 text-sm font-bold tracking-[0.15em] uppercase transition-colors">Komunitas</button>
            <button className="text-gray-400 hover:text-white px-3 py-2 text-sm font-bold tracking-[0.15em] uppercase transition-colors">Info Game</button>
         </div>

         {/* Content Area */}
         <div className="flex-1 px-12 mt-12 pb-20">
            <h2 className="text-[22px] font-bold text-gray-100 mb-6 tracking-wide">Aktivitas</h2>
            
            <div className="w-full h-14 bg-[#2b2f38] border border-[#3a3f4a] rounded flex items-center px-6 mb-8 cursor-text hover:border-gray-500 transition-colors">
               <span className="text-[#7e8590] italic text-[17px] font-medium tracking-wide">Bagikan opinimu tentang game ini ke teman-temanmu...</span>
            </div>
            
            <div className="w-full h-[220px] border-[2px] border-dashed border-[#3a3f4a] rounded flex items-center justify-center bg-[#21242a]">
               <span className="text-[#686f78] font-medium text-[17px] tracking-wide">Tidak ada aktivitas terkini dari pengembang ataupun dari temanmu.</span>
            </div>
         </div>
      </div>

      {/* Bottom Footer */}
      <div className="h-[72px] bg-[#1a1c21] border-t border-[#2d313a] flex items-center justify-between px-12 flex-shrink-0 z-40 relative">
         <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 10px 15px -3px rgba(0, 0, 0, 0.2)' }}></div>
         <div className="flex items-center gap-4 cursor-pointer group relative z-10">
            <div className="w-[34px] h-[34px] rounded-full bg-white flex items-center justify-center">
              <span className="text-black font-bold text-[10px] uppercase tracking-tighter">Steam</span>
            </div>
            <span className="text-white font-bold tracking-[0.2em] uppercase text-[13px] group-hover:text-gray-300">Menu</span>
         </div>
         
         <div className="flex items-center gap-12 relative z-10">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={onRunGame}>
               <div className="w-[34px] h-[34px] rounded-full bg-white flex items-center justify-center text-black font-black text-[17px]">A</div>
               <span className="text-white font-bold tracking-[0.2em] uppercase text-[13px] group-hover:text-gray-300">Pilih</span>
            </div>
            <div className="flex items-center gap-3 cursor-pointer group" onClick={onClose}>
               <div className="w-[34px] h-[34px] rounded-full bg-white flex items-center justify-center text-black font-black text-[17px]">B</div>
               <span className="text-white font-bold tracking-[0.2em] uppercase text-[13px] group-hover:text-gray-300">Kembali</span>
            </div>
         </div>
      </div>
      
    </motion.div>
  );
}
