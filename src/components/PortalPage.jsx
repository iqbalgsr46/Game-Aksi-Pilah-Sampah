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
    <div className="flex h-screen w-screen bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#0f0f0f] text-white font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-16 flex flex-col items-center py-4 bg-white/5 backdrop-blur-2xl border-r border-white/10 flex-shrink-0 z-20 shadow-[4px_0_24px_rgba(0,0,0,0.5)]">
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
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Topbar */}
        <header className="h-14 flex items-center justify-between px-6 flex-shrink-0 z-30 absolute top-0 w-full bg-[#1a1a1a]/40 backdrop-blur-3xl border-b border-white/10 shadow-lg">
           <div className="flex-1 flex items-center gap-4">
              <span className="material-symbols-outlined text-gray-400 text-xl cursor-pointer hover:text-white transition-colors">arrow_back</span>
           </div>
           
           <div className="flex-[2] flex justify-center">
             <div className="flex items-center bg-white/10 backdrop-blur-md rounded-full px-4 py-1.5 w-full max-w-md border border-white/10 focus-within:border-blue-400 focus-within:bg-white/20 transition-all duration-300 shadow-inner">
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
           <div className="relative w-full h-[350px] md:h-[450px] overflow-hidden">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#1b2a47] via-[#2d1b4e] to-[#4a1c40]">
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent mix-blend-overlay"></div>
                {/* Glowing orbs for premium feel */}
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-500/30 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-500/20 rounded-full blur-[100px]"></div>
              </div>
              
              {/* Hero Content */}
              <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/80 to-transparent flex flex-col md:flex-row items-end justify-between backdrop-blur-[2px]">
                <div className="flex items-end gap-6 max-w-3xl w-full z-10">
                  <div className="w-24 h-24 md:w-36 md:h-36 rounded-3xl shadow-[0_0_40px_rgba(52,211,153,0.3)] bg-gradient-to-br from-green-400 to-emerald-600 border border-white/30 flex items-center justify-center flex-shrink-0 backdrop-blur-xl relative overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-50"></div>
                     <span className="material-symbols-outlined text-white text-[64px] relative z-10 drop-shadow-lg">recycling</span>
                  </div>
                  
                  <div className="flex flex-col mb-1 bg-[#1a1a1a]/40 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 shadow-2xl">
                    <h1 className="text-3xl md:text-5xl font-extrabold mb-2 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 drop-shadow-md">Game Aksi Pilah Sampah</h1>
                    <div className="text-[#4CC2FF] text-sm font-semibold mb-3 hover:text-[#7dd3fc] transition-colors cursor-pointer drop-shadow">Wulan Corporation</div>
                    <div className="flex items-center gap-4 text-xs text-gray-200 font-medium">
                      <div className="flex items-center bg-white/10 px-2 py-1 rounded-full border border-white/10">
                         <span className="font-bold text-white mr-1">4.8</span>
                         <span className="material-symbols-outlined text-[14px] text-yellow-400 drop-shadow">star</span>
                         <span className="ml-2 text-gray-300">12K ratings</span>
                      </div>
                      <div className="h-4 w-px bg-white/20"></div>
                      <div className="bg-white/10 px-3 py-1 rounded-full border border-white/10">Education & Action • 10+</div>
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
                <div className="flex items-center gap-4 mt-2">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleRunGame}
                    className="bg-gradient-to-r from-[#00A4EF] to-[#2dbbff] hover:from-[#11b5ff] hover:to-[#4cc8ff] text-white font-bold py-2.5 px-12 rounded-xl shadow-[0_0_20px_rgba(0,164,239,0.4)] border border-white/20 transition-all flex items-center gap-2 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/20 blur-[2px] opacity-0 hover:opacity-100 transition-opacity"></div>
                    <span className="relative z-10">Mainkan</span>
                  </motion.button>
                  <button className="w-11 h-11 rounded-xl bg-white/5 backdrop-blur-lg hover:bg-white/10 flex items-center justify-center border border-white/10 shadow-lg transition-all">
                    <span className="material-symbols-outlined text-lg text-white/80">share</span>
                  </button>
                </div>

                <div className="bg-white/5 backdrop-blur-xl p-4 rounded-2xl flex items-center gap-4 border border-white/10 shadow-xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center text-black font-extrabold text-2xl shadow-inner border border-white/20 flex-shrink-0">
                    E
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white tracking-wide">EVERYONE</div>
                    <div className="text-xs text-gray-300 mt-1">Educational, Action, Environmental</div>
                  </div>
                </div>

                {/* Screenshots */}
                <section>
                   <div className="flex items-center justify-between mb-5">
                     <h2 className="text-2xl font-bold tracking-tight text-white/90">Screenshots</h2>
                     <span className="material-symbols-outlined text-white/50 cursor-pointer hover:text-white transition-colors bg-white/5 p-1 rounded-full border border-white/10">chevron_right</span>
                   </div>
                   <div className="flex gap-5 overflow-x-auto pb-6 scrollbar-hide snap-x">
                     <div className="h-48 md:h-60 w-80 md:w-96 flex-shrink-0 bg-white/5 backdrop-blur-xl rounded-2xl snap-center border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-6 hover:border-white/30 hover:bg-white/10 transition-all cursor-pointer flex items-center justify-center relative overflow-hidden group">
                       <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                       <img src="/assets/images/Sampah B3.png" alt="Screenshot 1" className="h-full w-auto object-contain drop-shadow-2xl relative z-10" />
                     </div>
                     <div className="h-48 md:h-60 w-80 md:w-96 flex-shrink-0 bg-white/5 backdrop-blur-xl rounded-2xl snap-center border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-6 hover:border-white/30 hover:bg-white/10 transition-all cursor-pointer flex items-center justify-center relative overflow-hidden group">
                       <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                       <img src="/assets/images/Sampah Organik.png" alt="Screenshot 2" className="h-full w-auto object-contain drop-shadow-2xl relative z-10" />
                     </div>
                     <div className="h-48 md:h-60 w-80 md:w-96 flex-shrink-0 bg-white/5 backdrop-blur-xl rounded-2xl snap-center border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-6 hover:border-white/30 hover:bg-white/10 transition-all cursor-pointer flex items-center justify-center relative overflow-hidden group">
                       <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                       <img src="/assets/images/Sampah Non Organik.png" alt="Screenshot 3" className="h-full w-auto object-contain drop-shadow-2xl relative z-10" />
                     </div>
                   </div>
                </section>

                {/* Description */}
                <section className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-xl mb-12">
                   <h2 className="text-2xl font-bold mb-4 tracking-tight text-white/90">Description</h2>
                   <p className="text-[15px] text-gray-300 leading-relaxed">
                      Permainan Edukasi Pilah Sampah ini adalah permainan edukasi tentang pemilahan dan pengolahan sampah.
                      Permainan board game bertema lingkungan ini bertujuan untuk mengedukasi pemainnya agar lebih cinta dan peduli lingkungan. <br/><br/>
                      Terdapat beberapa mode permainan seru yang bisa Anda nikmati. Tantang dirimu untuk memisahkan sampah dengan benar dan selamatkan bumi kita!
                   </p>
                </section>

              </div>

              {/* Right Column - Discover More */}
              <div className="flex-1 flex flex-col pl-0 lg:pl-4">
                 <div className="flex items-center justify-between mb-5">
                   <h2 className="text-xl font-bold tracking-tight text-white/90">Discover more</h2>
                 </div>
                 
                 <div className="flex flex-col gap-5">
                    {/* Dummy Item 1 */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-white/10 shadow-lg group">
                      <div className="h-28 bg-gradient-to-br from-blue-600 to-cyan-500 relative flex items-center justify-center overflow-hidden">
                         <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                         <span className="material-symbols-outlined text-white/70 text-5xl drop-shadow-lg relative z-10">sports_esports</span>
                         <div className="absolute top-3 left-3 bg-gradient-to-r from-green-500 to-emerald-600 text-[10px] font-extrabold px-2.5 py-1 rounded-md text-white shadow-md z-20 border border-white/20">Game Pass</div>
                      </div>
                      <div className="p-4">
                         <div className="font-bold text-[15px] truncate text-white/90 group-hover:text-white">Eco Builder</div>
                         <div className="text-xs text-gray-400 mt-1.5 flex justify-between items-center">
                            <span className="font-medium">GreenTech Games</span>
                            <span className="bg-white/10 px-2.5 py-1 rounded-md text-white border border-white/10">Owned</span>
                         </div>
                      </div>
                    </div>

                    {/* Dummy Item 2 */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-white/10 shadow-lg group">
                      <div className="h-28 bg-gradient-to-br from-orange-600 to-red-500 relative flex items-center justify-center overflow-hidden">
                         <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                         <span className="material-symbols-outlined text-white/70 text-5xl drop-shadow-lg relative z-10">forest</span>
                      </div>
                      <div className="p-4">
                         <div className="font-bold text-[15px] truncate text-white/90 group-hover:text-white">Save The Forest</div>
                         <div className="text-xs text-gray-400 mt-1.5 flex justify-between items-center">
                            <span className="font-medium">Nature Studio</span>
                            <span className="text-gray-300 font-semibold bg-white/5 px-2.5 py-1 rounded-md border border-white/5">Free</span>
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
