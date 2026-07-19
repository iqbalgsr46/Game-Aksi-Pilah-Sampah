import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function GamingPage({ onClose, onRunGame }) {
  const [time, setTime] = useState("");
  const [battery, setBattery] = useState({ level: 100, charging: false, supported: true });
  const [wifi, setWifi] = useState({ online: navigator.onLine });
  const [playStats, setPlayStats] = useState({ lastPlayed: 'Belum pernah', playTimeStr: '0 jam' });
  
  useEffect(() => {
    // Load Play Stats
    const loadStats = () => {
      const totalMs = parseInt(localStorage.getItem('totalPlayTimeMs') || '0', 10);
      const lastPlayedMs = parseInt(localStorage.getItem('lastPlayedDate') || '0', 10);

      let playTimeStr = '0 jam';
      if (totalMs > 0) {
        const totalMinutes = Math.floor(totalMs / 60000);
        if (totalMinutes < 60) {
          playTimeStr = `${totalMinutes} menit`;
        } else {
          const hours = (totalMinutes / 60).toFixed(1);
          playTimeStr = `${hours.replace('.0', '')} jam`;
        }
      }

      let lastPlayed = 'Belum pernah';
      if (lastPlayedMs > 0) {
        const date = new Date(lastPlayedMs);
        const today = new Date();
        if (date.toDateString() === today.toDateString()) {
          lastPlayed = 'Hari ini';
        } else {
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          if (date.toDateString() === yesterday.toDateString()) {
            lastPlayed = 'Kemarin';
          } else {
            lastPlayed = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
          }
        }
      }
      setPlayStats({ lastPlayed, playTimeStr });
    };
    loadStats();
    
    // Time Logic
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }));
    };
    updateTime();
    const timeInterval = setInterval(updateTime, 60000);

    // Battery Logic
    let batteryManager;
    const updateBattery = (b) => {
      setBattery({ level: Math.floor(b.level * 100), charging: b.charging, supported: true });
    };
    if ('getBattery' in navigator) {
      navigator.getBattery().then((b) => {
        batteryManager = b;
        updateBattery(b);
        b.addEventListener('levelchange', () => updateBattery(b));
        b.addEventListener('chargingchange', () => updateBattery(b));
      }).catch(() => {
        setBattery(prev => ({ ...prev, supported: false }));
      });
    } else {
      setBattery(prev => ({ ...prev, supported: false }));
    }

    // WiFi Logic
    const updateOnlineStatus = () => {
      setWifi({ online: navigator.onLine });
    };
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      clearInterval(timeInterval);
      if (batteryManager) {
        batteryManager.removeEventListener('levelchange', () => updateBattery(batteryManager));
        batteryManager.removeEventListener('chargingchange', () => updateBattery(batteryManager));
      }
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
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
        <span className="material-symbols-outlined text-[28px] cursor-pointer hover:text-white text-gray-200 pointer-events-auto" title={wifi.online ? 'Connected' : 'Offline'}>
          {wifi.online ? 'wifi' : 'wifi_off'}
        </span>
        <div className="flex items-center gap-3 text-gray-200 pointer-events-auto" title={battery.supported ? `${battery.level}%${battery.charging ? ' (Charging)' : ''}` : 'Battery'}>
           {battery.supported ? (
             <div className="relative w-4 h-6 border-[2px] border-gray-200 rounded-sm flex flex-col justify-end p-[1px]">
               <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1 bg-gray-200 rounded-t-sm"></div>
               <div className={`w-full rounded-[1px] transition-all duration-500 ${battery.charging ? 'bg-green-400' : battery.level <= 20 ? 'bg-red-500' : 'bg-gray-200'}`} style={{ height: `${battery.level}%` }}></div>
               {battery.charging && <span className="material-symbols-outlined absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[12px] text-black">bolt</span>}
             </div>
           ) : (
             <span className="material-symbols-outlined text-[28px]">battery_full</span>
           )}
           <span className="text-[22px] font-medium tracking-wide leading-none">{time}</span>
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
                    <span className="text-xl font-semibold text-gray-100">{playStats.lastPlayed}</span>
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[12px] text-gray-400 font-bold tracking-widest uppercase mb-1">Waktu Bermain</span>
                    <span className="text-xl font-semibold text-gray-100">{playStats.playTimeStr}</span>
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
         <div className="px-12 flex flex-wrap items-center justify-center gap-8 mt-4">
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
         <div className="flex items-center gap-3 cursor-pointer group relative z-10">
            <div className="bg-white rounded-full px-5 py-1.5 flex items-center justify-center">
              <span className="text-[#1a1c21] font-black text-[13px] uppercase tracking-[0.1em]">Gaming</span>
            </div>
            <span className="text-white font-bold tracking-[0.15em] uppercase text-[15px] group-hover:text-gray-300">Menu</span>
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
