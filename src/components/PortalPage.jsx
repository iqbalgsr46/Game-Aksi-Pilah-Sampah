import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TrashBinModal from './TrashBinModal';
import { TRASH_TYPES } from './TrashItems';
import Lenis from 'lenis';
import { useDraggableScroll } from '../hooks/useDraggableScroll';
const scrollVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.25, 0.1, 0.25, 1] } }
};

const GamepadLoadingOverlay = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 2.5 }}
    transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
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

export default function PortalPage({ onRunGame, onOpenGaming, playClickSound }) {
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const [isTransitioningToGaming, setIsTransitioningToGaming] = useState(false);
  const [selectedScreenshot, setSelectedScreenshot] = useState(null);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isReviewsExpanded, setIsReviewsExpanded] = useState(false);
  const [selectedTrashBin, setSelectedTrashBin] = useState(null);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [isSysReqExpanded, setIsSysReqExpanded] = useState(false);
  const screenshots = [1, 2, 3, 4, 5, 6];

  React.useEffect(() => {
    const handleGlobalClick = (e) => {
      const isClickable = e.target.closest('button') || e.target.closest('a') || e.target.closest('.cursor-pointer');
      if (isClickable && playClickSound) {
        playClickSound();
      }
    };
    document.addEventListener('click', handleGlobalClick, true);
    return () => document.removeEventListener('click', handleGlobalClick, true);
  }, [playClickSound]);

  const mainScrollRef = React.useRef(null);
  const contentRef = React.useRef(null);
  const carouselRef = useDraggableScroll();

  React.useEffect(() => {
    if (!mainScrollRef.current || !contentRef.current) return;
    
    const lenis = new Lenis({
      wrapper: mainScrollRef.current,
      content: contentRef.current,
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    lenis.on('scroll', (e) => {
      if (e.scroll > 280) {
        setShowStickyHeader(true);
      } else {
        setShowStickyHeader(false);
      }
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://game-aksi-pilah-sampah.vercel.app");
    setShowShareMenu(false);
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Game Aksi Pilah Sampah',
        text: 'Ayo mainkan Game Aksi Pilah Sampah, game edukasi seru untuk belajar peduli lingkungan!',
        url: 'https://game-aksi-pilah-sampah.vercel.app',
      })
      .catch((error) => console.log('Error sharing', error));
    } else {
      alert("Fitur share langsung tidak didukung di peramban ini. Silakan gunakan Copy Link.");
    }
    setShowShareMenu(false);
  };

  const handleRunGame = () => {
    try {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch((err) => {
          console.log("Fullscreen ditolak oleh browser:", err);
        });
      }
    } catch (error) {
      console.log("Fullscreen tidak didukung:", error);
    }

    const startAudio = new Audio('/assets/audio/gaming_start.wav');
    startAudio.volume = 1.0;
    startAudio.play().catch(e => console.log('Audio play failed:', e));

    setIsTransitioningToGaming(true);
    
    setTimeout(() => {
      const endAudio = new Audio('/assets/audio/gaming_end.wav');
      endAudio.volume = 1.0;
      endAudio.play().catch(e => console.log('Audio play failed:', e));
      
      onRunGame();
    }, 2500);
  };

  const handleOpenGamingClick = () => {
    try {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch((err) => {
          console.log("Fullscreen ditolak oleh browser:", err);
        });
      }
    } catch (error) {
      console.log("Fullscreen tidak didukung:", error);
    }

    const startAudio = new Audio('/assets/audio/gaming_start.wav');
    startAudio.volume = 1.0;
    startAudio.play().catch(e => console.log('Audio play failed:', e));

    setIsTransitioningToGaming(true);
    
    setTimeout(() => {
      const endAudio = new Audio('/assets/audio/gaming_end.wav');
      endAudio.volume = 1.0;
      endAudio.play().catch(e => console.log('Audio play failed:', e));
      
      onOpenGaming();
    }, 2500);
  };

  return (
    <div className="flex h-screen w-screen bg-[#202020] text-gray-100 font-sans overflow-hidden">
      <AnimatePresence>
        {isTransitioningToGaming && <GamepadLoadingOverlay key="loading-overlay" />}
      </AnimatePresence>
      {/* Sidebar - Hidden on mobile, visible on medium+ */}
      <aside className="hidden md:flex w-[72px] flex-col items-center py-2 bg-[#202020] border-r border-[#333] flex-shrink-0 z-20">
        <div className="mb-6 w-full flex justify-center mt-3">
          <div className="relative flex items-center justify-center w-[52px] h-[52px] bg-[#333] rounded-lg cursor-pointer">
             <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[4px] h-[22px] bg-[#4CC2FF] rounded-r-md"></div>
             <span className="material-symbols-outlined text-[#4CC2FF] text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
          </div>
        </div>
        <div className="flex flex-col gap-7 w-full items-center flex-grow mt-2">
          <div className="flex flex-col items-center cursor-pointer group hover:text-white text-gray-200">
             <span className="material-symbols-outlined text-[26px]">dashboard_customize</span>
             <span className="text-[12px] mt-1 font-semibold tracking-wide">Apps</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer group hover:text-white text-gray-300" onClick={handleOpenGamingClick}>
             <span className="material-symbols-outlined text-[26px]">sports_esports</span>
             <span className="text-[12px] mt-1 font-semibold tracking-wide">Gaming</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer group hover:text-white text-gray-300">
             <span className="material-symbols-outlined text-[26px] -rotate-45">brush</span>
             <span className="text-[12px] mt-1 font-semibold tracking-wide">Themes</span>
          </div>
        </div>
        <div className="flex flex-col gap-6 w-full items-center mb-6">
          <a href="https://github.com/iqbalgsr46" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center cursor-pointer group hover:text-white text-gray-300 transition-colors">
             <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
               <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
             </svg>
             <span className="text-[12px] mt-1 font-semibold tracking-wide">GitHub</span>
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#202020] relative">
        {/* Topbar */}
        <header className="h-[48px] flex items-center justify-between px-4 flex-shrink-0 z-30 bg-[#202020] gap-4">
           <div className="flex items-center gap-3 md:w-1/4 flex-shrink-0">
              <div className="w-5 h-5 grid grid-cols-2 gap-[1px]">
                 <div className="bg-[#f25022]"></div><div className="bg-[#7fba00]"></div>
                 <div className="bg-[#00a4ef]"></div><div className="bg-[#ffb900]"></div>
              </div>
              <span className="hidden sm:inline text-xs font-semibold tracking-wide text-white">Microsoft Store KW</span>
           </div>
           
           <div className="flex-1 flex justify-center">
             <div className="flex items-center bg-[#303030] rounded-full px-3 py-1.5 w-full max-w-[500px] border border-[#444] focus-within:border-blue-500">
               <input type="text" placeholder="Search apps, games, and more" className="bg-transparent border-none outline-none text-[13px] w-full text-white placeholder-gray-400 ml-1" />
               <span className="material-symbols-outlined text-gray-400 text-[18px] ml-2">search</span>
             </div>
           </div>

           <div className="md:w-1/4 flex justify-end items-center flex-shrink-0">
             <div className="w-7 h-7 rounded-full bg-blue-600 border border-gray-600 flex items-center justify-center overflow-hidden cursor-pointer">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Profile" className="w-full h-full object-cover" />
             </div>
           </div>
        </header>


        {/* Scrollable Area */}
        <main ref={mainScrollRef} className="flex-1 overflow-y-auto premium-scrollbar">
           <div ref={contentRef}>
             {/* Banner / Hero */}
           <div className="relative w-full h-[400px]">
              {/* Background Image & Video */}
              <div className="absolute inset-0 bg-[#202020]">
                {/* Masked Background video */}
                <div 
                  className="absolute top-0 right-0 w-[85%] h-full pointer-events-none"
                  style={{
                    maskImage: 'linear-gradient(to right, transparent 0%, black 40%, black 85%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 40%, black 85%, transparent 100%)'
                  }}
                >
                  <div 
                    className="absolute inset-0 w-full h-full"
                    style={{
                      maskImage: 'linear-gradient(to top, transparent 0%, black 25%, black 100%)',
                      WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 25%, black 100%)'
                    }}
                  >
                    <video 
                      autoPlay 
                      loop 
                      muted 
                      playsInline 
                      className="w-full h-full object-cover opacity-60"
                    >
                      <source src="/assets/videos/Lake_with_purple_mountains_twilight_202607181509.mp4" type="video/mp4" />
                    </video>
                  </div>
                </div>
              </div>
              
              {/* Hero Content */}
              <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-14 z-10 w-full lg:w-[70%]">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 mb-5 mt-4 sm:mt-0">
                  <div className="w-20 h-20 md:w-[120px] md:h-[120px] rounded-xl shadow-lg flex-shrink-0 overflow-hidden border border-[#333] bg-[#2a2a2a]">
                     <img src="/assets/images/pp-game.png" alt="Game Icon" className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex flex-col pt-1">
                    <h1 className="text-2xl md:text-[34px] font-bold mb-1 tracking-wide leading-tight text-white">Game Aksi Pilah Sampah</h1>
                    <div className="text-[#4CC2FF] text-[13px] font-semibold mb-2 hover:underline cursor-pointer">balsdev Corporation</div>
                    <div className="flex items-center gap-3 text-[13px] text-gray-300 font-medium">
                      <div className="flex items-center">
                         <span className="font-bold text-white mr-1 text-sm">5.0</span>
                         <span className="material-symbols-outlined text-[13px] text-white">star</span>
                         <span className="ml-2">290k rating</span>
                      </div>
                      <div className="text-gray-400">Action & adventure + 5</div>
                    </div>
                  </div>
                </div>

                <div className="mb-5 text-[13px] text-gray-200 max-w-2xl leading-relaxed uppercase tracking-wide">
                   GAME AKSI PILAH SAMPAH - GREAT GAMES ACROSS EVERY GENRE. PLAY FREE <br/>
                   <span className="normal-case text-gray-300 tracking-normal mt-1 block">The range of modes on this game is unmatched. Relax with sorting, catching, and finding...</span>
                </div>

                <div className="flex items-center gap-3 mb-6 relative">
                  <motion.button 
                    whileTap={{ scale: 0.98 }}
                    onClick={handleRunGame}
                    className="bg-[#4CC2FF] hover:bg-[#3baeea] text-black font-semibold py-1.5 px-10 rounded text-[14px] shadow-sm transition-colors"
                  >
                    Run Game
                  </motion.button>
                  <div className="relative">
                    <button 
                      onClick={() => setShowShareMenu(!showShareMenu)}
                      onBlur={() => setTimeout(() => setShowShareMenu(false), 200)}
                      className="w-9 h-9 rounded flex items-center justify-center hover:bg-white/10 transition-colors focus:bg-white/10"
                    >
                      <span className="material-symbols-outlined text-[20px] text-gray-200">shortcut</span>
                    </button>

                    <AnimatePresence>
                      {showShareMenu && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute left-0 top-full mt-2 w-48 bg-[#2a2a2a] rounded-lg shadow-xl border border-[#444] overflow-hidden z-50 flex flex-col py-1"
                        >
                          <button 
                            onClick={handleCopyLink}
                            className="flex items-center gap-3 px-4 py-2 hover:bg-white/10 text-white text-[13px] text-left transition-colors"
                          >
                            <span className="material-symbols-outlined text-[18px]">content_copy</span>
                            Copy link
                          </button>
                          <button 
                            onClick={handleNativeShare}
                            className="flex items-center gap-3 px-4 py-2 hover:bg-white/10 text-white text-[13px] text-left transition-colors"
                          >
                            <span className="material-symbols-outlined text-[18px]">shortcut</span>
                            Share
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="flex items-center gap-3 border-t border-[#444] pt-4 w-fit pr-10">
                  <div className="w-8 h-8 bg-yellow-500 rounded-sm flex items-center justify-center text-black font-bold text-lg flex-shrink-0">
                    <span className="material-symbols-outlined text-black text-xl">family_home</span>
                  </div>
                  <div>
                    <div className="font-bold text-[11px] text-white tracking-wide">PARENTAL GUIDANCE RECOMMENDED</div>
                    <div className="text-[10px] text-gray-400">Parental Guidance Recommended</div>
                    <div className="text-[9px] text-gray-500">In-Game Purchases (Includes Random Items), Users Interact</div>
                  </div>
                </div>
              </div>
           </div>

           {/* Content Grid */}
           <div className="px-6 md:px-14 flex flex-col lg:flex-row gap-8 pb-12 mt-2">
              
              {/* Left Column - Main Details */}
              <div className="flex-1 lg:flex-[3] flex flex-col gap-6 min-w-0 relative">
                 
                 {/* Sticky Game Header */}
                 <div className="sticky top-2 z-40 h-0 w-full -mt-6">
                   <div className={`bg-[#272727] rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.6)] border border-[#3a3a3a] flex items-center justify-between p-2.5 px-4 w-full transition-all duration-300 ${showStickyHeader ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
                     <div className="flex items-center gap-4">
                       <div className="w-[52px] h-[52px] rounded-md overflow-hidden bg-[#2a2a2a] flex-shrink-0 shadow-sm border border-[#444]">
                         <img src="/assets/images/pp-game.png" alt="Game Icon" className="w-full h-full object-cover" />
                       </div>
                       <div className="flex flex-col">
                         <div className="text-[17px] font-bold text-white leading-tight">Game Aksi Pilah Sampah</div>
                         <div className="text-[13px] text-gray-400 font-medium mt-0.5 leading-tight">balsdev Corporation</div>
                       </div>
                     </div>
                     <button onClick={handleRunGame} className="bg-[#4CC2FF] hover:bg-[#3baeea] text-black font-semibold py-1.5 px-8 rounded text-[13px] shadow-sm transition-colors">
                       Run Game
                     </button>
                   </div>
                 </div>
                
                 {/* Screenshots Card */}
                <motion.section 
                   initial="hidden"
                   whileInView="visible"
                   viewport={{ once: false, amount: 0.1 }}
                   variants={scrollVariants}
                   className="bg-[#2a2a2a] rounded-lg border border-[#333] overflow-hidden">
                   <div className="flex items-center justify-between px-5 py-3 border-b border-[#333] bg-[#2d2d30] hover:bg-[#333] cursor-pointer transition-colors">
                     <h2 className="text-[15px] font-bold text-white">Screenshots</h2>
                     <span className="material-symbols-outlined text-gray-300 text-[20px]">chevron_right</span>
                   </div>
                   <div ref={carouselRef} className="p-5 flex gap-4 overflow-x-auto scrollbar-hide snap-x bg-[#202020] select-none">
                     {screenshots.map((num) => (
                       <div 
                         key={num} 
                         onClick={() => setSelectedScreenshot(num)}
                         className="h-[160px] md:h-[220px] w-[280px] md:w-[390px] flex-shrink-0 bg-[#1a1a1a] rounded-md snap-center overflow-hidden relative cursor-pointer group"
                       >
                         <img src={`/assets/images/image-${num}.png`} alt={`Screenshot ${num}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                       </div>
                     ))}
                   </div>
                </motion.section>

                {/* Description Card */}
                <motion.section 
                   initial="hidden"
                   whileInView="visible"
                   viewport={{ once: false, amount: 0.1 }}
                   variants={scrollVariants}
                   className="bg-[#2a2a2a] rounded-lg border border-[#333] overflow-hidden">
                   <div className="flex items-center justify-between px-5 py-3 border-b border-[#333] bg-[#2d2d30]">
                     <h2 className="text-[15px] font-bold text-white">Description</h2>
                   </div>
                   <div className="p-5 text-[13px] text-gray-300 leading-relaxed bg-[#202020]">
                      {!isDescExpanded ? (
                        <>
                          <p className="uppercase tracking-wide mb-2 text-gray-200">GAME AKSI PILAH SAMPAH - GREAT GAMES ACROSS EVERY GENRE. PLAY FREE</p>
                          Permainan Edukasi Pilah Sampah ini adalah permainan edukasi tentang pemilahan dan pengolahan sampah.
                          Permainan board game bertema lingkungan ini bertujuan untuk mengedukasi pemainnya agar lebih cinta dan peduli lingkungan. <br/><br/>
                          Terdapat beberapa mode permainan seru yang bisa Anda nikmati. Tantang dirimu untuk memisahkan sampah dengan benar dan selamatkan bumi kita!
                        </>
                      ) : (
                        <div className="flex flex-col gap-4">
                          <p className="uppercase tracking-wide text-gray-200">GAME AKSI PILAH SAMPAH – BERMAIN SAMBIL MENYELAMATKAN BUMI. MAIN GRATIS</p>
                          <p>Permainan Edukasi Pilah Sampah ini adalah permainan edukasi tentang pemilahan dan pengolahan sampah. Permainan board game bertema lingkungan ini bertujuan untuk mengedukasi pemainnya agar lebih cinta dan peduli lingkungan.</p>
                          <p>Tantang dirimu dengan berbagai mode permainan seru. Pisahkan sampah organik, anorganik, dan B3 dengan tepat, pelajari cara daur ulang, dan jadilah pahlawan lingkungan. Temukan berbagai jenis tempat sampah dan sampah yang sering kita temui sehari-hari.</p>
                          <p>Mulai mainkan Game Aksi Pilah Sampah hari ini dan kumpulkan poin kepedulian lingkungan sebanyak-banyaknya untuk membuka berbagai wawasan baru tentang pelestarian alam.</p>
                          
                          <p className="uppercase tracking-wide text-gray-200 mt-2">APA YANG BISA KAMU LAKUKAN DI GAME INI</p>
                          
                          <div>
                            <p className="font-bold text-gray-200 mb-1">TEMUKAN CARA BARU BELAJAR LINGKUNGAN</p>
                            <ul className="list-disc pl-5 space-y-1">
                              <li>Selami petualangan mengumpulkan dan memilah sampah yang berserakan</li>
                              <li>Jelajahi berbagai jenis sampah: Organik, Anorganik, Kertas, Plastik, dan B3</li>
                              <li>Berpacu dengan waktu untuk menyelamatkan lingkungan dengan cara yang menyenangkan</li>
                            </ul>
                          </div>

                          <div>
                            <p className="font-bold text-gray-200 mb-1">KENALI MACAM-MACAM TEMPAT SAMPAH</p>
                            <ul className="list-disc pl-5 space-y-1">
                              <li>Pelajari fungsi dari setiap warna tempat sampah dengan detail</li>
                              <li>Baca informasi edukatif tentang bahan berbahaya dan beracun (B3)</li>
                              <li>Pahami cara pengolahan sampah untuk masa depan yang lebih baik</li>
                            </ul>
                          </div>

                          <div>
                            <p className="font-bold text-gray-200 mb-1">BERMAIN KAPAN SAJA, DI MANA SAJA</p>
                            <ul className="list-disc pl-5 space-y-1">
                              <li>Mainkan di handphone, tablet, maupun komputer kamu</li>
                              <li>Nikmati interaksi layar sentuh yang responsif (mendukung fitur multi-touch)</li>
                            </ul>
                          </div>

                          <div>
                            <p className="font-bold text-gray-200 mb-1">COCOK UNTUK SEMUA UMUR</p>
                            <ul className="list-disc pl-5 space-y-1">
                              <li>Grafis visual yang ramah anak dan antarmuka yang mudah dipahami</li>
                              <li>Animasi interaktif yang membuat proses belajar tidak membosankan</li>
                            </ul>
                          </div>

                          <div>
                            <p className="font-bold text-gray-200 mb-1">KEAMANAN & EDUKASI TERJAMIN</p>
                            <ul className="list-disc pl-5 space-y-1">
                              <li>Dirancang khusus sebagai media pembelajaran interaktif (serious game)</li>
                              <li>Membantu orang tua dan guru dalam mengajarkan kepedulian lingkungan sejak dini</li>
                              <li>Lingkungan bermain yang aman, positif, dan penuh dengan pesan edukasi</li>
                            </ul>
                          </div>

                          <div className="flex flex-col gap-1 mt-2 text-[12px] text-gray-400">
                            <p>MAINKAN SEKARANG: https://game-aksi-pilah-sampah.vercel.app</p>
                            <p>KATEGORI: Edukasi, Simulasi, Lingkungan</p>
                            <p>PLATFORM: Website (Desktop & Mobile)</p>
                            <p>KONTROL: Mouse & Layar Sentuh (Multi-touch)</p>
                            <p>LISENSI: Gratis untuk Dimainkan (Free to Play)</p>
                          </div>

                          <p className="mt-2 text-[12px] text-gray-400">HARAP DIPERHATIKAN: Game ini berbasis website dan sepenuhnya membutuhkan koneksi internet yang stabil untuk dapat dimainkan.</p>
                        </div>
                      )}
                      
                      <div className="mt-6">
                         <span 
                           onClick={() => setIsDescExpanded(!isDescExpanded)}
                           className="text-[#4CC2FF] text-[13px] hover:underline font-medium cursor-pointer"
                         >
                           {isDescExpanded ? 'Show less' : 'Show more'}
                         </span>
                      </div>
                   </div>
                </motion.section>

                {/* Ratings and reviews Card */}
                <motion.section 
                   initial="hidden"
                   whileInView="visible"
                   viewport={{ once: false, amount: 0.1 }}
                   variants={scrollVariants}
                   className="bg-[#2a2a2a] rounded-lg border border-[#333] overflow-hidden">
                   <div className="flex items-center justify-between px-5 py-3 border-b border-[#333] bg-[#2d2d30] hover:bg-[#333] cursor-pointer transition-colors">
                     <h2 className="text-[15px] font-bold text-white">Ratings and reviews</h2>
                     <span className="material-symbols-outlined text-gray-300 text-[20px]">chevron_right</span>
                   </div>
                   <div className="p-6 bg-[#202020]">
                      <div className="flex flex-col md:flex-row gap-8 mb-8 items-center md:items-start">
                         <div className="flex flex-col justify-center items-center md:items-start w-[140px]">
                            <div className="text-[72px] font-normal text-white leading-none mb-2 tracking-tight">4.9</div>
                            <div className="text-[12px] text-gray-400 font-medium tracking-wide">288 RATINGS</div>
                         </div>
                         <div className="flex flex-col gap-2.5 flex-1 w-full max-w-[280px]">
                            {/* Bars */}
                            {[
                               { star: 5, percent: '95%' },
                               { star: 4, percent: '5%' },
                               { star: 3, percent: '0%' },
                               { star: 2, percent: '0%' },
                               { star: 1, percent: '0%' },
                            ].map((item) => (
                               <div key={item.star} className="flex items-center gap-2 text-[12px] text-gray-300 font-medium">
                                  <span className="w-2 text-right">{item.star}</span>
                                  <span className="material-symbols-outlined text-[13px] text-[#e86a04]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                  <div className="flex-1 h-2.5 bg-[#4d3c2b] rounded-full ml-1">
                                     <div className="h-full bg-[#e86a04] rounded-full" style={{ width: item.percent }}></div>
                                  </div>
                               </div>
                            ))}
                         </div>
                      </div>

                      <div className="flex flex-col gap-3">
                         <h3 className="text-[17px] font-bold text-white">good</h3>
                         <div className="flex items-center gap-4">
                            <div className="flex items-center text-[#e86a04]">
                               {[1,2,3,4,5].map(i => (
                                 <span key={i} className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                               ))}
                            </div>
                            <div className="flex items-center gap-1.5 text-[#4CC2FF] text-[10px] font-bold uppercase tracking-wide">
                               <span className="material-symbols-outlined text-[14px]">emoji_events</span>
                               MOST HELPFUL FAVORABLE REVIEW
                            </div>
                         </div>
                         <p className="text-[13px] text-gray-300 leading-relaxed mb-3">
                           this game platform is so fun theres variants of simple and fun games but i only can talk to the people tht have the same age group soo its okay..
                         </p>
                         <div className="flex justify-between items-center text-[12px] text-gray-400 mt-2">
                            <div><span className="text-gray-200 font-medium">lusiana</span> <span className="ml-2">2 months ago</span></div>
                            <div className="flex items-center gap-3">
                               <span>4 people found this helpful</span>
                               <span className="material-symbols-outlined text-[18px] cursor-pointer hover:text-white">outlined_flag</span>
                            </div>
                         </div>
                      </div>

                      {isReviewsExpanded && (
                        <div className="flex flex-col gap-8 mt-8 border-t border-[#333] pt-8">
                           <div className="flex flex-col gap-3">
                               <h3 className="text-[17px] font-bold text-white">Sangat Edukatif!</h3>
                               <div className="flex items-center gap-4">
                                  <div className="flex items-center text-[#e86a04]">
                                     {[1,2,3,4,5].map(i => (
                                       <span key={i} className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                     ))}
                                  </div>
                               </div>
                               <p className="text-[13px] text-gray-300 leading-relaxed mb-3">
                                 Game ini sangat membantu anak saya untuk mengerti cara memilah sampah yang benar. Grafisnya bagus dan mudah dimengerti. Terima kasih!
                               </p>
                               <div className="flex justify-between items-center text-[12px] text-gray-400 mt-2">
                                  <div><span className="text-gray-200 font-medium">Budi Santoso</span> <span className="ml-2">1 week ago</span></div>
                                  <div className="flex items-center gap-3">
                                     <span>12 people found this helpful</span>
                                     <span className="material-symbols-outlined text-[18px] cursor-pointer hover:text-white">outlined_flag</span>
                                  </div>
                               </div>
                           </div>
                           
                           <div className="flex flex-col gap-3">
                               <h3 className="text-[17px] font-bold text-white">Seru banget</h3>
                               <div className="flex items-center gap-4">
                                  <div className="flex items-center text-[#e86a04]">
                                     {[1,2,3,4].map(i => (
                                       <span key={i} className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                     ))}
                                     <span className="material-symbols-outlined text-[13px] text-[#4d3c2b]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                  </div>
                               </div>
                               <p className="text-[13px] text-gray-300 leading-relaxed mb-3">
                                 Gamenya seru dan menantang pas level tinggi. Tapi sayang sampahnya kadang agak susah dibedakan antara kertas dan karton. Overall mantap.
                               </p>
                               <div className="flex justify-between items-center text-[12px] text-gray-400 mt-2">
                                  <div><span className="text-gray-200 font-medium">Rina</span> <span className="ml-2">3 weeks ago</span></div>
                                  <div className="flex items-center gap-3">
                                     <span>2 people found this helpful</span>
                                     <span className="material-symbols-outlined text-[18px] cursor-pointer hover:text-white">outlined_flag</span>
                                  </div>
                               </div>
                           </div>
                        </div>
                      )}
                      
                      <div className="mt-8">
                         <span onClick={() => setIsReviewsExpanded(!isReviewsExpanded)} className="text-[#4CC2FF] text-[13px] hover:underline font-medium cursor-pointer">
                           {isReviewsExpanded ? 'Show less' : 'See all'}
                         </span>
                      </div>
                   </div>
                </motion.section>

                {/* Features Card */}
                <motion.section 
                   initial="hidden"
                   whileInView="visible"
                   viewport={{ once: false, amount: 0.1 }}
                   variants={scrollVariants}
                   className="bg-[#2a2a2a] rounded-lg border border-[#333] overflow-hidden">
                   <div className="flex items-center px-5 py-3 border-b border-[#333] bg-[#2d2d30]">
                     <h2 className="text-[15px] font-bold text-white">Features</h2>
                   </div>
                   <div className="p-5 flex flex-col gap-4 text-[13px] text-gray-200 bg-[#202020] uppercase tracking-wide">
                      <div>3 MODE PERMAINAN EDUKATIF</div>
                      <div>BERMAIN BERSAMA KELOMPOK</div>
                      <div>KENALI BERBAGAI JENIS SAMPAH</div>
                      <div>PAPAN PERINGKAT KOMPETITIF</div>
                   </div>
                </motion.section>

                {/* What's new in this version Card */}
                <motion.section 
                   initial="hidden"
                   whileInView="visible"
                   viewport={{ once: false, amount: 0.1 }}
                   variants={scrollVariants}
                   className="bg-[#2a2a2a] rounded-lg border border-[#333] overflow-hidden">
                   <div className="flex items-center px-5 py-3 border-b border-[#333] bg-[#2d2d30]">
                     <h2 className="text-[15px] font-bold text-white">What's new in this version</h2>
                   </div>
                   <div className="p-5 text-[13px] text-gray-200 bg-[#202020]">
                      Pembaruan terbaru untuk Game Aksi Pilah Sampah membawa antarmuka portal baru yang elegan, penambahan foto tangkapan layar asli, dan perbaikan performa untuk memastikan pengalaman bermain edukatif yang lebih lancar.
                   </div>
                </motion.section>

                {/* System Requirements Card */}
                <motion.section 
                   initial="hidden"
                   whileInView="visible"
                   viewport={{ once: false, amount: 0.1 }}
                   variants={scrollVariants}
                   className="bg-[#2a2a2a] rounded-lg border border-[#333] overflow-hidden">
                   <div className="flex items-center px-5 py-3 border-b border-[#333] bg-[#2d2d30]">
                     <h2 className="text-[15px] font-bold text-white">System Requirements</h2>
                   </div>
                   <div className="p-5 text-[13px] text-gray-200 bg-[#202020]">
                      <div className="flex items-start gap-3 mb-5">
                         <div className="w-5 h-5 rounded-full bg-[#107c10] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                            <span className="material-symbols-outlined text-white text-[16px] font-bold">check</span>
                         </div>
                         <div className="leading-relaxed">
                            This product should work on your device. Items with a checkmark meet the developer's system requirements.
                         </div>
                      </div>
                      
                      {isSysReqExpanded && (
                        <div className="flex flex-col gap-4 mb-6 ml-1">
                           <div className="flex items-center gap-3">
                              <span className="material-symbols-outlined text-[#107c10] text-[16px]">check</span>
                              <div className="text-gray-300"><span className="font-semibold text-white">Available on:</span> PC, Mobile, Tablet</div>
                           </div>
                           <div className="flex items-center gap-3">
                              <span className="material-symbols-outlined text-[#107c10] text-[16px]">check</span>
                              <div className="text-gray-300"><span className="font-semibold text-white">OS:</span> Any OS (Windows, macOS, Android, iOS)</div>
                           </div>
                           <div className="flex items-center gap-3">
                              <span className="material-symbols-outlined text-[#107c10] text-[16px]">check</span>
                              <div className="text-gray-300"><span className="font-semibold text-white">Browser:</span> Chrome, Edge, Safari, Firefox</div>
                           </div>
                           <div className="flex items-center gap-3">
                              <span className="material-symbols-outlined text-[#107c10] text-[16px]">check</span>
                              <div className="text-gray-300"><span className="font-semibold text-white">Architecture:</span> x64, ARM (Web-based)</div>
                           </div>
                        </div>
                      )}

                      <span 
                        onClick={() => setIsSysReqExpanded(!isSysReqExpanded)}
                        className="text-[#4CC2FF] text-[13px] hover:underline font-medium cursor-pointer"
                      >
                        {isSysReqExpanded ? 'Show less' : 'Show more'}
                      </span>
                   </div>
                </motion.section>

                {/* Additional Information Card */}
                <motion.section 
                   initial="hidden"
                   whileInView="visible"
                   viewport={{ once: false, amount: 0.1 }}
                   variants={scrollVariants}
                   className="bg-[#2a2a2a] rounded-lg border border-[#333] overflow-hidden">
                   <div className="flex items-center px-5 py-3 border-b border-[#333] bg-[#2d2d30]">
                     <h2 className="text-[15px] font-bold text-white">Additional information</h2>
                   </div>
                   <div className="p-6 bg-[#202020]">
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-6 text-[13px]">
                        
                        {/* Published by */}
                        <div className="flex flex-col gap-1">
                           <div className="flex items-center gap-2 text-gray-300 font-semibold mb-1">
                              <span className="material-symbols-outlined text-[18px]">domain</span>
                              Published by
                           </div>
                           <span className="text-[#4CC2FF] hover:underline cursor-pointer">balsdev Corporation</span>
                           <div className="text-gray-400">© balsdev Corporation</div>
                        </div>

                        {/* Release date */}
                        <div className="flex flex-col gap-1">
                           <div className="flex items-center gap-2 text-gray-300 font-semibold mb-1">
                              <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                              Release date
                           </div>
                           <div className="text-gray-400">18/07/2026</div>
                        </div>

                        {/* Genres */}
                        <div className="flex flex-col gap-1">
                           <div className="flex items-center gap-2 text-gray-300 font-semibold mb-1">
                              <span className="material-symbols-outlined text-[18px]">category</span>
                              Genres
                           </div>
                           <span className="text-[#4CC2FF] hover:underline cursor-pointer">Education</span>
                           <span className="text-[#4CC2FF] hover:underline cursor-pointer">Family & kids</span>
                           <span className="text-[#4CC2FF] hover:underline cursor-pointer mt-1">Show more</span>
                        </div>

                        {/* Approximate size */}
                        <div className="flex flex-col gap-1">
                           <div className="flex items-center gap-2 text-gray-300 font-semibold mb-1">
                              <span className="material-symbols-outlined text-[18px]">straighten</span>
                              Approximate size
                           </div>
                           <div className="text-gray-400">45.2 MB</div>
                        </div>

                        {/* Installation */}
                        <div className="flex flex-col gap-1">
                           <div className="flex items-center gap-2 text-gray-300 font-semibold mb-1">
                              <span className="material-symbols-outlined text-[18px]">download</span>
                              Installation
                           </div>
                           <div className="text-gray-400 leading-relaxed">
                              Play directly on your web browser or install as a Progressive Web App (PWA) on compatible devices.
                           </div>
                        </div>

                        {/* This app can */}
                        <div className="flex flex-col gap-1">
                           <div className="flex items-center gap-2 text-gray-300 font-semibold mb-1">
                              <span className="material-symbols-outlined text-[18px]">verified_user</span>
                              This app can
                           </div>
                           <div className="text-gray-400 leading-relaxed">
                              Access your internet connection<br/>
                              Play audio and video
                           </div>
                           <span className="text-[#4CC2FF] hover:underline cursor-pointer mt-1">Permissions info</span>
                        </div>

                        {/* Supported languages */}
                        <div className="flex flex-col gap-1">
                           <div className="flex items-center gap-2 text-gray-300 font-semibold mb-1">
                              <span className="material-symbols-outlined text-[18px]">language</span>
                              Supported languages
                           </div>
                           <div className="text-gray-400">Indonesian (Indonesia)</div>
                        </div>

                        {/* Publisher Info */}
                        <div className="flex flex-col gap-1">
                           <div className="flex items-center gap-2 text-gray-300 font-semibold mb-1">
                              <span className="material-symbols-outlined text-[18px]">info</span>
                              Publisher Info
                           </div>
                           <span className="text-[#4CC2FF] hover:underline cursor-pointer">balsdev Corporation support</span>
                           <span className="text-[#4CC2FF] hover:underline cursor-pointer">balsdev Corporation website</span>
                           <span className="text-[#4CC2FF] hover:underline cursor-pointer mt-1">Show more</span>
                        </div>

                        {/* Additional terms */}
                        <div className="flex flex-col gap-1">
                           <div className="flex items-center gap-2 text-gray-300 font-semibold mb-1">
                              <span className="material-symbols-outlined text-[18px]">description</span>
                              Additional terms
                           </div>
                           <span className="text-[#4CC2FF] hover:underline cursor-pointer">balsdev Corporation privacy policy</span>
                           <span className="text-[#4CC2FF] hover:underline cursor-pointer">Terms of transaction</span>
                        </div>

                        {/* Report this product */}
                        <div className="flex flex-col gap-1">
                           <div className="flex items-center gap-2 text-gray-300 font-semibold mb-1">
                              <span className="material-symbols-outlined text-[18px]">flag</span>
                              Report this product
                           </div>
                           <span className="text-[#4CC2FF] hover:underline cursor-pointer">Report this product for violating rules</span>
                        </div>

                     </div>
                   </div>
                </motion.section>

              </div>

              {/* Right Column - Discover More */}
              <div className="flex-none w-full lg:w-[280px] xl:w-[300px] flex flex-col flex-shrink-0 sticky top-4 self-start">
                 <div className="flex items-center gap-1 mb-4 cursor-pointer hover:underline w-fit">
                   <h2 className="text-[17px] font-semibold text-white">Macam-macam Tempat Sampah</h2>
                   <span className="material-symbols-outlined text-white text-[18px]">chevron_right</span>
                 </div>
                 
                 <div className="flex flex-col gap-5">
                    {/* Dummy Item 1 */}
                    <motion.div 
                       initial="hidden"
                       whileInView="visible"
                       viewport={{ once: false, amount: 0.1 }}
                       variants={scrollVariants}
                       onClick={() => setSelectedTrashBin({
                         title: 'Sampah Organik',
                         image: '/assets/images/Sampah Organik.png',
                         bgColor: 'bg-green-500',
                         tagColor: 'bg-green-600',
                         tag: 'Organik',
                         description: 'Sampah organik adalah barang-barang buangan yang berasal dari sisa-sisa makhluk hidup, baik itu hewan, tanaman, maupun manusia yang dapat terurai secara alami di alam tanpa perlu campur tangan bahan kimia buatan. Contohnya adalah sisa makanan, sayuran, buah-buahan, dan daun kering.'
                       })}
                       className="flex gap-3 cursor-pointer group">
                      <div className="w-[100px] h-[100px] bg-green-500 rounded-md overflow-hidden relative flex-shrink-0 shadow-md">
                         <div className="absolute top-0 left-0 bg-green-600 text-[9px] font-bold px-1.5 py-0.5 text-white">Organik</div>
                         <div className="w-full h-full flex items-center justify-center p-2">
                            <img src="/assets/images/Sampah Organik.png" className="w-full h-full object-contain drop-shadow-md" alt="Organik" />
                         </div>
                      </div>
                      <div className="flex flex-col pt-1 flex-1">
                         <div className="font-semibold text-[13px] text-gray-100 group-hover:underline">Sampah Organik</div>
                         <div className="text-[11px] text-gray-400 mt-1 leading-snug">Sampah yang mudah membusuk seperti sisa makanan dan daun.</div>
                         <div className="mt-auto flex justify-end">
                            <span className="bg-[#333] text-gray-300 text-[11px] px-2 py-0.5 rounded-sm">Pelajari</span>
                         </div>
                      </div>
                    </motion.div>

                    {/* Dummy Item 2 */}
                    <motion.div 
                       initial="hidden"
                       whileInView="visible"
                       viewport={{ once: false, amount: 0.1 }}
                       variants={scrollVariants}
                       onClick={() => setSelectedTrashBin({
                         title: 'Sampah Anorganik',
                         image: '/assets/images/Sampah Non Organik.png',
                         bgColor: 'bg-yellow-500',
                         tagColor: 'bg-yellow-600',
                         tag: 'Anorganik',
                         description: 'Sampah anorganik adalah sampah yang sudah tidak dipakai lagi dan sulit terurai. Sampah jenis ini tidak bisa hancur secara alami dengan sendirinya, biasanya membutuhkan waktu bertahun-tahun atau campur tangan manusia untuk dapat didaur ulang. Contohnya adalah plastik, botol minuman, kaleng, dan kaca.'
                       })}
                       className="flex gap-3 cursor-pointer group">
                      <div className="w-[100px] h-[100px] bg-yellow-500 rounded-md overflow-hidden relative flex-shrink-0 shadow-md">
                         <div className="absolute top-0 left-0 bg-yellow-600 text-[9px] font-bold px-1.5 py-0.5 text-white">Anorganik</div>
                         <div className="w-full h-full flex items-center justify-center p-2">
                            <img src="/assets/images/Sampah Non Organik.png" className="w-full h-full object-contain drop-shadow-md" alt="Anorganik" />
                         </div>
                      </div>
                      <div className="flex flex-col pt-1 flex-1">
                         <div className="font-semibold text-[13px] text-gray-100 group-hover:underline leading-snug">Sampah Anorganik</div>
                         <div className="text-[11px] text-gray-400 mt-1 leading-snug">Sulit terurai, seperti plastik, kaca, dan kaleng.</div>
                         <div className="mt-auto flex justify-end">
                            <span className="bg-[#333] text-gray-300 text-[11px] px-2 py-0.5 rounded-sm">Pelajari</span>
                         </div>
                      </div>
                    </motion.div>
                    
                    {/* Dummy Item 3 */}
                    <motion.div 
                       initial="hidden"
                       whileInView="visible"
                       viewport={{ once: false, amount: 0.1 }}
                       variants={scrollVariants}
                       onClick={() => setSelectedTrashBin({
                         title: 'Sampah B3',
                         image: '/assets/images/Sampah B3.png',
                         bgColor: 'bg-red-500',
                         tagColor: 'bg-red-600',
                         tag: 'B3',
                         description: 'Sampah B3 (Bahan Berbahaya dan Beracun) adalah jenis sampah yang karena sifat, konsentrasi, maupun jumlahnya dapat mencemarkan, merusak lingkungan hidup, dan membahayakan kesehatan serta kelangsungan hidup manusia dan makhluk hidup lainnya. Contohnya adalah baterai bekas, lampu neon, kemasan pestisida, dan sisa bahan kimia.'
                       })}
                       className="flex gap-3 cursor-pointer group">
                      <div className="w-[100px] h-[100px] bg-red-500 rounded-md overflow-hidden relative flex-shrink-0 shadow-md">
                         <div className="absolute top-0 left-0 bg-red-600 text-[9px] font-bold px-1.5 py-0.5 text-white">B3</div>
                         <div className="w-full h-full flex items-center justify-center p-2">
                            <img src="/assets/images/Sampah B3.png" className="w-full h-full object-contain drop-shadow-md" alt="B3" />
                         </div>
                      </div>
                      <div className="flex flex-col pt-1 flex-1">
                         <div className="font-semibold text-[13px] text-gray-100 group-hover:underline leading-snug">Sampah B3</div>
                         <div className="text-[11px] text-gray-400 mt-1 leading-snug">Bahan Berbahaya & Beracun seperti baterai dan obat.</div>
                         <div className="mt-auto flex justify-end">
                            <span className="bg-[#333] text-gray-300 text-[11px] px-2 py-0.5 rounded-sm">Pelajari</span>
                         </div>
                      </div>
                     </motion.div>

                  </div>
                  
                  {/* Macam-macam Sampah Section */}
                  <div className="flex items-center gap-1 mt-8 mb-4 cursor-pointer hover:underline w-fit">
                    <h2 className="text-[17px] font-semibold text-white">Macam-macam Sampah</h2>
                    <span className="material-symbols-outlined text-white text-[18px]">chevron_right</span>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                     {TRASH_TYPES.map((trash, index) => {
                        const Icon = trash.Component;
                        let desc = trash.description;

                        return (
                           <motion.div 
                              key={index}
                              initial="hidden"
                              whileInView="visible"
                              viewport={{ once: false, amount: 0.1 }}
                              variants={scrollVariants}
                              onClick={() => setSelectedTrashBin({
                                title: trash.name,
                                IconComponent: Icon,
                                bgColor: 'bg-[#1a1a1a]',
                                tagColor: trash.category === 'Organik' ? 'bg-green-600' : trash.category === 'Non Organik' ? 'bg-yellow-600' : 'bg-red-600',
                                tag: trash.category,
                                description: desc
                              })}
                              className="flex gap-3 cursor-pointer group items-center bg-[#2a2a2a] p-2 rounded-lg border border-[#333] hover:bg-[#333] transition-colors">
                             <div className="w-[60px] h-[60px] bg-[#1a1a1a] rounded-md overflow-hidden relative flex-shrink-0 flex items-center justify-center shadow-inner">
                                <div className="transform scale-[0.8] origin-center flex items-center justify-center w-[100px] h-[100px]">
                                   <Icon />
                                </div>
                             </div>
                             <div className="flex flex-col flex-1">
                                <div className="font-semibold text-[13px] text-gray-100 group-hover:text-[#4CC2FF] transition-colors">{trash.name}</div>
                                <div className="text-[11px] text-gray-400 mt-0.5">{desc}</div>
                             </div>
                           </motion.div>
                        )
                     })}
                  </div>

               </div>
            </div>
           </div>
        </main>
      </div>
      


      {/* Screenshot Modal */}
      <AnimatePresence>
        {selectedScreenshot !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 md:p-10"
            onClick={() => setSelectedScreenshot(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white hover:bg-white/20 p-2 rounded-full transition-colors flex items-center justify-center cursor-pointer"
              onClick={(e) => { e.stopPropagation(); setSelectedScreenshot(null); }}
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-6xl w-full flex-1 flex flex-col justify-center items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-[#1a1a1a] p-2 md:p-4 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-[#333]">
                <img 
                  src={`/assets/images/image-${selectedScreenshot}.png`} 
                  alt={`Screenshot ${selectedScreenshot}`} 
                  className="w-auto h-auto max-w-full max-h-[75vh] object-contain rounded-lg" 
                />
              </div>
              <div className="text-center mt-6">
                <div className="text-white font-semibold text-[15px] mb-2">Screenshot {selectedScreenshot}</div>
                <div className="inline-flex items-center justify-center bg-[#2a2a2a] text-gray-400 text-[12px] px-4 py-1.5 rounded-full border border-[#444]">
                  <span className="text-white font-bold mr-1">{selectedScreenshot}</span> / {screenshots.length}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Trash Bin Info Modal */}
      <AnimatePresence>
        {selectedTrashBin && (
          <TrashBinModal 
            bin={selectedTrashBin} 
            onClose={() => setSelectedTrashBin(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
