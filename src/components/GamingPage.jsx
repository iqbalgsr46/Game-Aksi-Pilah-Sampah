import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MenuItem = ({ icon, label }) => (
  <div className="flex items-center gap-6 px-10 py-3 cursor-pointer hover:bg-white/10 transition-colors group">
    <span className="material-symbols-outlined text-[26px] text-gray-300 group-hover:text-white" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
    <span className="text-[19px] font-medium text-[#dcdedf] group-hover:text-white tracking-wide">{label}</span>
  </div>
);

const GamepadLoadingOverlay = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
    className="fixed inset-0 z-[9999] bg-[radial-gradient(ellipse_at_center,_#1c202a_0%,_#090a0d_100%)] flex items-center justify-center"
  >
    <svg width="320" height="320" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <motion.path
        d="M22 42 C 22 28, 32 24, 50 24 C 68 24, 78 28, 78 42 L 82 62 C 84 70, 78 74, 72 72 C 67 70, 65 65, 62 62 L 58 58 C 55 55, 45 55, 42 58 L 38 62 C 35 65, 33 70, 28 72 C 22 74, 16 70, 18 62 Z"
        stroke="white"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0.2 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
      />
      <motion.circle
        cx="50" cy="36" r="4"
        stroke="white"
        strokeWidth="2.5"
        initial={{ opacity: 0.2, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1.1 }}
        transition={{ duration: 0.8, ease: "easeInOut", repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
      />
    </svg>
  </motion.div>
);

export default function GamingPage({ onClose, onRunGame, playClickSound }) {
  const [time, setTime] = useState("");
  const [battery, setBattery] = useState({ level: 100, charging: false, supported: true });
  const [wifi, setWifi] = useState({ online: navigator.onLine });
  const [playStats, setPlayStats] = useState({ lastPlayed: 'Belum pernah', playTimeStr: '0 jam' });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Aktivitas');
  const [isLoading, setIsLoading] = useState(false);

  const handleRunGameClick = () => {
    if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(err => console.log(err));
    }
    const startAudio = new Audio('/assets/audio/gaming_start.wav');
    startAudio.volume = 1.0;
    startAudio.play().catch(e => console.log(e));
    
    setIsLoading(true);
    setTimeout(() => {
      const endAudio = new Audio('/assets/audio/gaming_end.wav');
      endAudio.volume = 1.0;
      endAudio.play().catch(e => console.log(e));
      onRunGame();
    }, 2500);
  };

  useEffect(() => {
    const handleGlobalClick = (e) => {
      const isClickable = e.target.closest('button') || e.target.closest('.cursor-pointer');
      if (isClickable && playClickSound) {
        playClickSound();
      }
    };
    document.addEventListener('click', handleGlobalClick, true);
    return () => document.removeEventListener('click', handleGlobalClick, true);
  }, [playClickSound]);
  
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
    <>
      <AnimatePresence>
        {isLoading && <GamepadLoadingOverlay />}
      </AnimatePresence>

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
        <div className="absolute inset-0 bg-gradient-to-r from-[#1b1d22] via-[#1b1d22]/80 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute bottom-0 w-full h-[200px] bg-gradient-to-t from-[#1b1d22] via-[#1b1d22]/80 to-transparent z-10 pointer-events-none"></div>
        
        {/* Banner Image */}
        <img src="/assets/images/banner-gaming-mode.png" alt="Game Banner" className="w-full h-full object-cover object-center brightness-90" />

        {/* Game Info Overlay */}
        <div className="absolute bottom-40 left-12 z-20 flex flex-col gap-5 max-w-3xl">
          <div className="flex items-center gap-6">
            <img src="/assets/images/pp-game.png" alt="Logo" className="w-32 h-32 rounded-2xl shadow-xl object-cover border-[1px] border-white/10" />
            <div className="flex flex-col">
              <h1 className="text-5xl font-extrabold text-white mb-2 tracking-wide drop-shadow-lg">Game Aksi Pilah Sampah</h1>
              <p className="text-[#38bdf8] font-bold text-[17px] mb-2 drop-shadow">balsdev Corporation</p>
              <div className="flex items-center text-gray-300 text-[15px] font-medium gap-4 drop-shadow">
                <span className="flex items-center gap-1 text-white font-bold"><span className="text-[17px]">5.0</span> ☆</span>
                <span>290k rating</span>
                <span>Action & adventure + 5</span>
              </div>
            </div>
          </div>
          
          <div className="text-gray-300 text-[15px] mt-2 flex flex-col gap-1.5 drop-shadow-md">
            <p className="uppercase tracking-wide font-semibold text-gray-200">GAME AKSI PILAH SAMPAH - GREAT GAMES ACROSS EVERY GENRE. PLAY FREE</p>
            <p>The range of modes on this game is unmatched. Relax with sorting, catching, and finding...</p>
          </div>
        </div>
      </div>

      {/* Main Container for the rest */}
      <div className="flex-1 overflow-y-auto premium-scrollbar relative z-20 -mt-10 flex flex-col">
         {/* Action Bar */}
         <div className="px-12 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex flex-col md:flex-row md:items-center gap-10">
              {/* Play Button */}
              <button 
                onClick={handleRunGameClick}
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
            {['Aktivitas', 'Milikmu', 'Info Game'].map((tab) => (
               <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 rounded-full text-sm font-bold tracking-[0.15em] uppercase transition-colors shadow-sm ${
                     activeTab === tab 
                     ? 'bg-[#484d56] text-white' 
                     : 'text-gray-400 hover:text-white bg-transparent'
                  }`}
               >
                  {tab}
               </button>
            ))}
         </div>

         {/* Content Area */}
         <div className="flex-1 flex flex-col px-12 mt-8 pb-8">
            <h2 className="text-[22px] font-bold text-gray-100 mb-4 tracking-wide flex-shrink-0">{activeTab}</h2>
            
            <div className="w-full flex-1 min-h-[100px] max-h-[220px] border-[2px] border-dashed border-[#3a3f4a] rounded flex items-center justify-center bg-[#21242a] p-6 overflow-y-auto premium-scrollbar">
               
               {activeTab === 'Aktivitas' && (
                  <span className="text-[#686f78] font-medium text-[17px] tracking-wide text-center">
                     Tidak ada aktivitas terkini dari pengembang.
                  </span>
               )}

               {activeTab === 'Milikmu' && (
                  <div className="flex flex-col items-center justify-center gap-2 text-[#686f78] h-full">
                     <span className="material-symbols-outlined text-[40px] mb-1">sports_esports</span>
                     <p className="font-medium text-[17px] tracking-wide text-center text-gray-300">Waktu Bermain: <span className="text-white">{playStats.playTimeStr}</span></p>
                     <p className="font-medium text-[15px] tracking-wide text-center">Terakhir Dimainkan: {playStats.lastPlayed}</p>
                     <p className="font-medium text-[14px] tracking-wide text-center mt-2 italic text-[#5cba46]">Mainkan game untuk meningkatkan statistikmu!</p>
                  </div>
               )}

               {activeTab === 'Info Game' && (
                  <div className="flex flex-col justify-center h-full text-[#dcdedf] w-full max-w-4xl mx-auto">
                     <h3 className="text-xl font-bold mb-3 text-white">Game Aksi Pilah Sampah</h3>
                     <p className="text-[16px] leading-relaxed mb-4 text-[#8a919e]">
                        Game edukasi interaktif yang dirancang untuk meningkatkan kesadaran lingkungan. 
                        Pemain ditantang untuk memilah sampah dengan cepat dan tepat ke dalam kategori yang benar demi menyelamatkan bumi.
                     </p>
                     <ul className="list-disc pl-5 text-[15px] text-[#8a919e] space-y-1">
                        <li><strong className="text-gray-300">Organik:</strong> Sisa makanan, daun, sayur, dll.</li>
                        <li><strong className="text-gray-300">Anorganik:</strong> Plastik, kaca, kertas, kardus, dll.</li>
                        <li><strong className="text-gray-300">B3:</strong> Baterai, lampu, obat-obatan, elektronik, dll.</li>
                     </ul>
                  </div>
               )}
               
            </div>
         </div>
      </div>

      {/* Bottom Footer */}
      <div className="h-[72px] bg-[#1a1c21] border-t border-[#2d313a] flex items-center justify-between px-12 flex-shrink-0 z-40 relative">
         <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 10px 15px -3px rgba(0, 0, 0, 0.2)' }}></div>
         <div className="flex items-center gap-3 cursor-pointer group relative z-10" onClick={() => setIsMenuOpen(true)}>
            <div className="bg-white rounded-full px-5 py-1.5 flex items-center justify-center">
              <span className="text-[#1a1c21] font-black text-[13px] uppercase tracking-[0.1em]">Gaming</span>
            </div>
            <span className="text-white font-bold tracking-[0.15em] uppercase text-[15px] group-hover:text-gray-300">Menu</span>
         </div>
         
         <div className="flex items-center gap-12 relative z-10">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={handleRunGameClick}>
               <div className="w-[34px] h-[34px] rounded-full bg-white flex items-center justify-center text-black font-black text-[17px]">A</div>
               <span className="text-white font-bold tracking-[0.2em] uppercase text-[13px] group-hover:text-gray-300">Pilih</span>
            </div>
            <div className="flex items-center gap-3 cursor-pointer group" onClick={onClose}>
               <div className="w-[34px] h-[34px] rounded-full bg-white flex items-center justify-center text-black font-black text-[17px]">B</div>
               <span className="text-white font-bold tracking-[0.2em] uppercase text-[13px] group-hover:text-gray-300">Kembali</span>
            </div>
         </div>
      </div>
      
      {/* Sidebar Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <div className="absolute inset-0 z-[100] flex">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
              onClick={() => setIsMenuOpen(false)}
            />
            
            {/* Sidebar */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="relative w-[340px] h-full bg-[#131519] flex flex-col shadow-2xl"
            >
               <div className="flex-1 overflow-y-auto py-10 flex flex-col gap-1 mt-6">
                 <MenuItem icon="home" label="Beranda" />
                 <MenuItem icon="grid_view" label="Perpustakaan" />
                 <MenuItem icon="sell" label="Toko" />
                 <MenuItem icon="group" label="Teman &amp; Obrolan" />
                 <MenuItem icon="image" label="Media" />
                 <MenuItem icon="download" label="Unduhan" />
                 <MenuItem icon="settings" label="Pengaturan" />
                 <MenuItem icon="power_settings_new" label="Daya" />
               </div>
               
               {/* Bottom Button matching the footer */}
               <div className="h-[72px] flex items-center px-12 cursor-pointer border-t border-transparent" onClick={() => setIsMenuOpen(false)}>
                  <div className="flex items-center gap-3 group relative z-10">
                    <div className="bg-white rounded-full px-5 py-1.5 flex items-center justify-center shadow-lg">
                      <span className="text-[#1a1c21] font-black text-[13px] uppercase tracking-[0.1em]">Gaming</span>
                    </div>
                    <span className="text-white font-bold tracking-[0.15em] uppercase text-[15px] group-hover:text-gray-300">Menu</span>
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
    </>
  );
}
