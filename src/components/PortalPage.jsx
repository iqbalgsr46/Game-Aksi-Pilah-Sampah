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
    <div className="flex h-screen w-screen bg-[#202020] text-white font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-16 flex flex-col items-center py-4 bg-[#202020] border-r border-gray-700/50 flex-shrink-0">
        <div className="mb-8">
          <span className="material-symbols-outlined text-gray-400 cursor-pointer hover:text-white transition-colors text-2xl">home</span>
        </div>
        <div className="flex flex-col gap-6 w-full items-center flex-grow">
          <div className="p-2 bg-gray-800 rounded-lg cursor-pointer">
             <span className="material-symbols-outlined text-[#4CC2FF] text-2xl">grid_view</span>
          </div>
          <div className="p-2 cursor-pointer group relative">
             <span className="material-symbols-outlined text-gray-400 group-hover:text-white transition-colors text-2xl">sports_esports</span>
             <div className="absolute left-1/2 -translate-x-1/2 -left-3 top-1/2 -translate-y-1/2 w-1 h-4 bg-transparent rounded-r-md"></div>
          </div>
          <div className="p-2 cursor-pointer group">
             <span className="material-symbols-outlined text-gray-400 group-hover:text-white transition-colors text-2xl">library_books</span>
          </div>
        </div>
        <div className="flex flex-col gap-6 items-center mt-auto">
          <span className="material-symbols-outlined text-gray-400 cursor-pointer hover:text-white transition-colors text-2xl">download</span>
          <span className="material-symbols-outlined text-gray-400 cursor-pointer hover:text-white transition-colors text-2xl">settings</span>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative bg-[#202020]">
        {/* Topbar */}
        <header className="h-14 flex items-center justify-between px-6 flex-shrink-0 z-10 absolute top-0 w-full bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
           <div className="flex-1 flex items-center gap-4 pointer-events-auto">
              <span className="material-symbols-outlined text-gray-400 text-xl cursor-pointer hover:text-white">arrow_back</span>
           </div>
           
           <div className="flex-[2] flex justify-center pointer-events-auto">
             <div className="flex items-center bg-[#303030]/80 backdrop-blur-md rounded-full px-4 py-1.5 w-full max-w-md border border-gray-600 focus-within:border-blue-500 focus-within:bg-[#404040]">
               <span className="material-symbols-outlined text-gray-400 text-lg mr-2">search</span>
               <input type="text" placeholder="Search apps, games, and more" className="bg-transparent border-none outline-none text-sm w-full text-white placeholder-gray-400" />
             </div>
           </div>

           <div className="flex-1 flex justify-end items-center pointer-events-auto">
             <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-sm font-bold shadow-md cursor-pointer border border-gray-500 hover:border-white transition-colors">
               W
             </div>
           </div>
        </header>

        {/* Scrollable Area */}
        <main className="flex-1 overflow-y-auto pb-20 scrollbar-hide">
           {/* Banner / Hero */}
           <div className="relative w-full h-[350px] md:h-[450px]">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#1b2a47] via-[#2d1b4e] to-[#4a1c40]">
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
              </div>
              
              {/* Hero Content */}
              <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 bg-gradient-to-t from-[#202020] via-[#202020]/90 to-transparent flex flex-col md:flex-row items-end justify-between">
                <div className="flex items-end gap-6 max-w-3xl w-full z-10">
                  <div className="w-24 h-24 md:w-36 md:h-36 rounded-2xl shadow-2xl bg-gradient-to-br from-green-400 to-emerald-600 border border-white/20 flex items-center justify-center flex-shrink-0">
                     <span className="material-symbols-outlined text-white text-[64px]">recycling</span>
                  </div>
                  
                  <div className="flex flex-col mb-1">
                    <h1 className="text-3xl md:text-5xl font-bold mb-2 tracking-tight text-white drop-shadow-md">Game Aksi Pilah Sampah</h1>
                    <div className="text-[#4CC2FF] text-sm font-medium mb-3 hover:underline cursor-pointer">Wulan Corporation</div>
                    <div className="flex items-center gap-4 text-xs text-gray-300 font-medium">
                      <div className="flex items-center">
                         <span className="font-bold text-white mr-1">4.8</span>
                         <span className="material-symbols-outlined text-[14px] text-white/90">star</span>
                         <span className="ml-2 text-gray-400">12K ratings</span>
                      </div>
                      <div className="h-3 w-px bg-gray-600"></div>
                      <div>Education & Action • 10+</div>
                    </div>
                  </div>
                </div>
              </div>
           </div>

           {/* Content Grid */}
           <div className="px-8 md:px-12 flex flex-col lg:flex-row gap-8 mt-6">
              
              {/* Left Column - Main Details */}
              <div className="flex-[3] flex flex-col gap-8">
                
                {/* Action Bar */}
                <div className="flex items-center gap-4">
                  <motion.button 
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleRunGame}
                    className="bg-[#4CC2FF] hover:bg-[#3baeea] text-black font-semibold py-2 px-10 rounded-md shadow-lg transition-colors flex items-center gap-2"
                  >
                    Mainkan
                  </motion.button>
                  <button className="w-10 h-10 rounded bg-[#2A2A2A] hover:bg-[#333] flex items-center justify-center border border-gray-700 transition-colors">
                    <span className="material-symbols-outlined text-lg">share</span>
                  </button>
                </div>

                <div className="bg-[#262626] p-4 rounded-xl flex items-center gap-4 border border-gray-700/50">
                  <div className="w-10 h-10 bg-yellow-500 rounded flex items-center justify-center text-black font-bold text-xl flex-shrink-0">
                    E
                  </div>
                  <div>
                    <div className="font-semibold text-sm">EVERYONE</div>
                    <div className="text-xs text-gray-400 mt-0.5">Educational, Action, Environmental</div>
                  </div>
                </div>

                {/* Screenshots */}
                <section>
                   <div className="flex items-center justify-between mb-4">
                     <h2 className="text-xl font-semibold">Screenshots</h2>
                     <span className="material-symbols-outlined text-gray-400 cursor-pointer hover:text-white transition-colors">chevron_right</span>
                   </div>
                   <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                     <img src="/assets/images/Sampah B3.png" alt="Screenshot 1" className="h-48 md:h-56 w-auto object-contain bg-[#2A2A2A] rounded-xl snap-center flex-shrink-0 border border-gray-700/50 p-6 hover:border-gray-500 transition-colors cursor-pointer" />
                     <img src="/assets/images/Sampah Organik.png" alt="Screenshot 2" className="h-48 md:h-56 w-auto object-contain bg-[#2A2A2A] rounded-xl snap-center flex-shrink-0 border border-gray-700/50 p-6 hover:border-gray-500 transition-colors cursor-pointer" />
                     <img src="/assets/images/Sampah Non Organik.png" alt="Screenshot 3" className="h-48 md:h-56 w-auto object-contain bg-[#2A2A2A] rounded-xl snap-center flex-shrink-0 border border-gray-700/50 p-6 hover:border-gray-500 transition-colors cursor-pointer" />
                   </div>
                </section>

                {/* Description */}
                <section className="bg-[#262626] rounded-xl p-6 border border-gray-700/50">
                   <h2 className="text-lg font-semibold mb-3">Description</h2>
                   <p className="text-sm text-gray-300 leading-relaxed">
                      Permainan Edukasi Pilah Sampah ini adalah permainan edukasi tentang pemilahan dan pengolahan sampah.
                      Permainan board game bertema lingkungan ini bertujuan untuk mengedukasi pemainnya agar lebih cinta dan peduli lingkungan. <br/><br/>
                      Terdapat beberapa mode permainan seru yang bisa Anda nikmati. Tantang dirimu untuk memisahkan sampah dengan benar dan selamatkan bumi kita!
                   </p>
                </section>

              </div>

              {/* Right Column - Discover More */}
              <div className="flex-1 flex flex-col">
                 <div className="flex items-center justify-between mb-4">
                   <h2 className="text-lg font-semibold">Discover more</h2>
                   <span className="material-symbols-outlined text-gray-400 cursor-pointer text-sm hover:text-white transition-colors">arrow_forward_ios</span>
                 </div>
                 
                 <div className="flex flex-col gap-4">
                    {/* Dummy Item 1 */}
                    <div className="bg-[#2A2A2A] rounded-xl overflow-hidden hover:bg-[#333] transition-colors cursor-pointer border border-gray-700/50">
                      <div className="h-24 bg-gradient-to-r from-blue-600 to-cyan-500 relative flex items-center justify-center">
                         <span className="material-symbols-outlined text-white/50 text-4xl">sports_esports</span>
                         <div className="absolute top-2 left-2 bg-green-600 text-[10px] font-bold px-2 py-0.5 rounded text-white">Game Pass</div>
                      </div>
                      <div className="p-3">
                         <div className="font-semibold text-sm truncate">Eco Builder</div>
                         <div className="text-xs text-gray-400 mt-1 flex justify-between items-center">
                            <span>GreenTech Games</span>
                            <span className="bg-gray-700 px-2 py-1 rounded text-white">Owned</span>
                         </div>
                      </div>
                    </div>

                    {/* Dummy Item 2 */}
                    <div className="bg-[#2A2A2A] rounded-xl overflow-hidden hover:bg-[#333] transition-colors cursor-pointer border border-gray-700/50">
                      <div className="h-24 bg-gradient-to-r from-orange-600 to-red-500 relative flex items-center justify-center">
                         <span className="material-symbols-outlined text-white/50 text-4xl">forest</span>
                      </div>
                      <div className="p-3">
                         <div className="font-semibold text-sm truncate">Save The Forest</div>
                         <div className="text-xs text-gray-400 mt-1 flex justify-between items-center">
                            <span>Nature Studio</span>
                            <span className="text-gray-300 font-medium">Free</span>
                         </div>
                      </div>
                    </div>
                 </div>
              </div>
           </div>
        </main>
      </div>
      
      {/* Custom Scrollbar styling */}
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
