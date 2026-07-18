import React from 'react';
import { motion } from 'framer-motion';

export default function PortalPage({ onRunGame }) {
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
    onRunGame();
  };

  return (
    <div className="flex h-screen w-screen bg-[#202020] text-gray-100 font-sans overflow-hidden">
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
          <div className="flex flex-col items-center cursor-pointer group hover:text-white text-gray-300">
             <span className="material-symbols-outlined text-[26px]">sports_esports</span>
             <span className="text-[12px] mt-1 font-semibold tracking-wide">Gaming</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer group hover:text-white text-gray-300">
             <span className="material-symbols-outlined text-[26px] -rotate-45">brush</span>
             <span className="text-[12px] mt-1 font-semibold tracking-wide">Themes</span>
          </div>
        </div>
        <div className="flex flex-col gap-6 w-full items-center mb-4">
          <div className="flex flex-col items-center cursor-pointer group hover:text-white text-gray-400">
             <span className="material-symbols-outlined text-[22px]">notifications</span>
             <span className="text-[10px] mt-1 font-medium text-center leading-tight">What's New</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer group hover:text-white text-gray-400">
             <span className="material-symbols-outlined text-[22px]">download</span>
             <span className="text-[10px] mt-1 font-medium">Downloads</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer group hover:text-white text-gray-400">
             <span className="material-symbols-outlined text-[22px]">library_books</span>
             <span className="text-[10px] mt-1 font-medium">Library</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#202020]">
        {/* Topbar */}
        <header className="h-[48px] flex items-center justify-between px-4 flex-shrink-0 z-30 bg-[#202020] gap-4">
           <div className="flex items-center gap-3 md:w-1/4 flex-shrink-0">
              <img src="/assets/images/github+logo+social+icon-1320193974176554630.png" alt="Github Logo" className="w-10 h-10 object-contain" />
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
        <main className="flex-1 overflow-y-auto scrollbar-hide">
           {/* Banner / Hero */}
           <div className="relative w-full h-[400px]">
              {/* Background Image & Gradient */}
              <div className="absolute inset-0 bg-[#202020]">
                {/* Background video on the right */}
                <video 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  className="absolute top-0 right-0 w-3/4 h-full object-cover opacity-60 pointer-events-none"
                >
                  <source src="/assets/videos/Lake_with_purple_mountains_twilight_202607181509.mp4" type="video/mp4" />
                </video>
                {/* Gradient Fade */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#202020] via-[#202020] to-transparent w-[65%] z-0"></div>
              </div>
              
              {/* Hero Content */}
              <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-14 z-10 w-full lg:w-[70%]">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 mb-5 mt-4 sm:mt-0">
                  <div className="w-20 h-20 md:w-[120px] md:h-[120px] rounded-xl shadow-lg flex-shrink-0 overflow-hidden border border-[#333] bg-[#2a2a2a]">
                     <img src="/assets/images/pp-game.png" alt="Game Icon" className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex flex-col pt-1">
                    <h1 className="text-2xl md:text-[34px] font-bold mb-1 tracking-wide leading-tight text-white">Game Aksi Pilah Sampah</h1>
                    <div className="text-[#4CC2FF] text-[13px] font-semibold mb-2 hover:underline cursor-pointer">Wulan Corporation</div>
                    <div className="flex items-center gap-3 text-[13px] text-gray-300 font-medium">
                      <div className="flex items-center">
                         <span className="font-bold text-white mr-1 text-sm">4.8</span>
                         <span className="material-symbols-outlined text-[13px] text-white">star</span>
                         <span className="ml-2">12K ratings</span>
                      </div>
                      <div className="text-gray-400">Action & adventure + 5</div>
                    </div>
                  </div>
                </div>

                <div className="mb-5 text-[13px] text-gray-200 max-w-2xl leading-relaxed uppercase tracking-wide">
                   GAME AKSI PILAH SAMPAH - GREAT GAMES ACROSS EVERY GENRE. PLAY FREE <br/>
                   <span className="normal-case text-gray-300 tracking-normal mt-1 block">The range of modes on this game is unmatched. Relax with sorting, catching, and finding...</span>
                </div>

                <div className="flex items-center gap-3 mb-6">
                  <motion.button 
                    whileTap={{ scale: 0.98 }}
                    onClick={handleRunGame}
                    className="bg-[#4CC2FF] hover:bg-[#3baeea] text-black font-semibold py-1.5 px-10 rounded text-[14px] shadow-sm transition-colors"
                  >
                    Run Game
                  </motion.button>
                  <button className="w-8 h-8 rounded flex items-center justify-center hover:bg-white/10 transition-colors">
                    <span className="material-symbols-outlined text-[18px] text-gray-200">ios_share</span>
                  </button>
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
              <div className="flex-1 lg:flex-[3] flex flex-col gap-6 min-w-0">
                
                {/* Screenshots Card */}
                <section className="bg-[#2a2a2a] rounded-lg border border-[#333] overflow-hidden">
                   <div className="flex items-center justify-between px-5 py-3 border-b border-[#333] bg-[#2d2d30] hover:bg-[#333] cursor-pointer transition-colors">
                     <h2 className="text-[15px] font-bold text-white">Screenshots</h2>
                     <span className="material-symbols-outlined text-gray-300 text-[20px]">chevron_right</span>
                   </div>
                   <div className="p-5 flex gap-4 overflow-x-auto scrollbar-hide snap-x bg-[#202020]">
                     {[1, 2, 3, 4, 5, 6].map((num) => (
                       <div key={num} className="h-[160px] md:h-[220px] w-[280px] md:w-[390px] flex-shrink-0 bg-[#1a1a1a] rounded-md snap-center overflow-hidden relative cursor-pointer group">
                         <img src={`/assets/images/image-${num}.png`} alt={`Screenshot ${num}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                       </div>
                     ))}
                   </div>
                </section>

                {/* Description Card */}
                <section className="bg-[#2a2a2a] rounded-lg border border-[#333] overflow-hidden">
                   <div className="flex items-center justify-between px-5 py-3 border-b border-[#333] bg-[#2d2d30]">
                     <h2 className="text-[15px] font-bold text-white">Description</h2>
                   </div>
                   <div className="p-5 text-[13px] text-gray-300 leading-relaxed bg-[#202020]">
                      <p className="uppercase tracking-wide mb-2 text-gray-200">GAME AKSI PILAH SAMPAH - GREAT GAMES ACROSS EVERY GENRE. PLAY FREE</p>
                      Permainan Edukasi Pilah Sampah ini adalah permainan edukasi tentang pemilahan dan pengolahan sampah.
                      Permainan board game bertema lingkungan ini bertujuan untuk mengedukasi pemainnya agar lebih cinta dan peduli lingkungan. <br/><br/>
                      Terdapat beberapa mode permainan seru yang bisa Anda nikmati. Tantang dirimu untuk memisahkan sampah dengan benar dan selamatkan bumi kita!
                   </div>
                </section>

              </div>

              {/* Right Column - Discover More */}
              <div className="flex-none w-full lg:w-[280px] xl:w-[300px] flex flex-col flex-shrink-0">
                 <div className="flex items-center gap-1 mb-4 cursor-pointer hover:underline w-fit">
                   <h2 className="text-[17px] font-semibold text-white">Discover more</h2>
                   <span className="material-symbols-outlined text-white text-[18px]">chevron_right</span>
                 </div>
                 
                 <div className="flex flex-col gap-5">
                    {/* Dummy Item 1 */}
                    <div className="flex gap-3 cursor-pointer group">
                      <div className="w-[100px] h-[100px] bg-green-500 rounded-md overflow-hidden relative flex-shrink-0 shadow-md">
                         <div className="absolute top-0 left-0 bg-green-600 text-[9px] font-bold px-1.5 py-0.5 text-white">Game Pass</div>
                         <div className="w-full h-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-[50px] text-black">smart_toy</span>
                         </div>
                      </div>
                      <div className="flex flex-col pt-1 flex-1">
                         <div className="font-semibold text-[13px] text-gray-100 group-hover:underline">Minecraft Launcher</div>
                         <div className="mt-auto flex justify-end">
                            <span className="bg-[#333] text-gray-300 text-[11px] px-2 py-0.5 rounded-sm">Owned</span>
                         </div>
                      </div>
                    </div>

                    {/* Dummy Item 2 */}
                    <div className="flex gap-3 cursor-pointer group">
                      <div className="w-[100px] h-[100px] bg-gradient-to-br from-blue-400 to-green-300 rounded-md overflow-hidden relative flex-shrink-0 shadow-md">
                         <div className="absolute top-0 left-0 bg-green-600 text-[9px] font-bold px-1.5 py-0.5 text-white">Game Pass</div>
                         <div className="w-full h-full flex items-center justify-center">
                            <img src="/assets/images/Sampah Organik.png" className="w-[80%] h-[80%] object-contain opacity-80" />
                         </div>
                      </div>
                      <div className="flex flex-col pt-1 flex-1">
                         <div className="font-semibold text-[13px] text-gray-100 group-hover:underline leading-snug">Minecraft: Java & Bedrock Edition for PC</div>
                         <div className="mt-auto flex justify-end">
                            <span className="text-gray-300 text-[12px]">Rp199.000</span>
                         </div>
                      </div>
                    </div>
                    
                    {/* Dummy Item 3 */}
                    <div className="flex gap-3 cursor-pointer group">
                      <div className="w-[100px] h-[100px] bg-gray-800 rounded-md overflow-hidden relative flex-shrink-0 shadow-md">
                         <div className="absolute top-0 left-0 bg-green-600 text-[9px] font-bold px-1.5 py-0.5 text-white">Game Pass</div>
                         <div className="w-full h-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-[40px] text-gray-500">sports_esports</span>
                         </div>
                      </div>
                      <div className="flex flex-col pt-1 flex-1">
                         <div className="font-semibold text-[13px] text-gray-100 group-hover:underline leading-snug">Call of Duty®: Warzone™</div>
                         <div className="mt-auto flex justify-end">
                            <span className="text-gray-300 text-[12px]">Free</span>
                         </div>
                      </div>
                    </div>

                 </div>
              </div>
           </div>
        </main>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
