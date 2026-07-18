import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function PortalPage({ onRunGame }) {
  const [showStickyHeader, setShowStickyHeader] = useState(false);

  const handleScroll = (e) => {
    if (e.target.scrollTop > 280) {
      setShowStickyHeader(true);
    } else {
      setShowStickyHeader(false);
    }
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
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#202020] relative">
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
        <main className="flex-1 overflow-y-auto scrollbar-hide" onScroll={handleScroll}>
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
                    <div className="text-[#4CC2FF] text-[13px] font-semibold mb-2 hover:underline cursor-pointer">balsdev Corporation</div>
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
                      
                      <div className="mt-6">
                         <span className="text-[#4CC2FF] text-[13px] hover:underline font-medium cursor-pointer">Show more</span>
                      </div>
                   </div>
                </section>

                {/* Ratings and reviews Card */}
                <section className="bg-[#2a2a2a] rounded-lg border border-[#333] overflow-hidden">
                   <div className="flex items-center justify-between px-5 py-3 border-b border-[#333] bg-[#2d2d30] hover:bg-[#333] cursor-pointer transition-colors">
                     <h2 className="text-[15px] font-bold text-white">Ratings and reviews</h2>
                     <span className="material-symbols-outlined text-gray-300 text-[20px]">chevron_right</span>
                   </div>
                   <div className="p-6 bg-[#202020]">
                      <div className="flex flex-col md:flex-row gap-8 mb-8">
                         <div className="flex flex-col justify-center items-center md:items-start">
                            <div className="text-[52px] font-bold text-white leading-none mb-2">4.2</div>
                            <div className="text-[11px] text-gray-400 font-semibold tracking-wide">287 RATINGS</div>
                         </div>
                         <div className="flex flex-col gap-2 flex-1 max-w-[280px]">
                            {/* Bars */}
                            {[
                               { star: 5, percent: '65%' },
                               { star: 4, percent: '15%' },
                               { star: 3, percent: '8%' },
                               { star: 2, percent: '4%' },
                               { star: 1, percent: '8%' },
                            ].map((item) => (
                               <div key={item.star} className="flex items-center gap-2 text-[11px] text-gray-300 font-medium">
                                  <span className="w-1.5 text-right">{item.star}</span>
                                  <span className="material-symbols-outlined text-[10px] text-[#e65100]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                  <div className="flex-1 h-1.5 bg-[#444] rounded-full overflow-hidden ml-1">
                                     <div className="h-full bg-[#e65100] rounded-full" style={{ width: item.percent }}></div>
                                  </div>
                               </div>
                            ))}
                         </div>
                      </div>

                      <div className="flex flex-col gap-3">
                         <h3 className="text-[17px] font-bold text-white">good</h3>
                         <div className="flex items-center gap-4">
                            <div className="flex items-center text-[#e65100]">
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
                      
                      <div className="mt-8">
                         <span className="text-[#4CC2FF] text-[13px] hover:underline font-medium cursor-pointer">See all</span>
                      </div>
                   </div>
                </section>

                {/* Features Card */}
                <section className="bg-[#2a2a2a] rounded-lg border border-[#333] overflow-hidden">
                   <div className="flex items-center px-5 py-3 border-b border-[#333] bg-[#2d2d30]">
                     <h2 className="text-[15px] font-bold text-white">Features</h2>
                   </div>
                   <div className="p-5 flex flex-col gap-4 text-[13px] text-gray-200 bg-[#202020] uppercase tracking-wide">
                      <div>3 MODE PERMAINAN EDUKATIF</div>
                      <div>BERMAIN BERSAMA KELOMPOK</div>
                      <div>KENALI BERBAGAI JENIS SAMPAH</div>
                      <div>PAPAN PERINGKAT KOMPETITIF</div>
                   </div>
                </section>

                {/* What's new in this version Card */}
                <section className="bg-[#2a2a2a] rounded-lg border border-[#333] overflow-hidden">
                   <div className="flex items-center px-5 py-3 border-b border-[#333] bg-[#2d2d30]">
                     <h2 className="text-[15px] font-bold text-white">What's new in this version</h2>
                   </div>
                   <div className="p-5 text-[13px] text-gray-200 bg-[#202020]">
                      Pembaruan terbaru untuk Game Aksi Pilah Sampah membawa antarmuka portal baru yang elegan, penambahan foto tangkapan layar asli, dan perbaikan performa untuk memastikan pengalaman bermain edukatif yang lebih lancar.
                   </div>
                </section>

                {/* System Requirements Card */}
                <section className="bg-[#2a2a2a] rounded-lg border border-[#333] overflow-hidden">
                   <div className="flex items-center px-5 py-3 border-b border-[#333] bg-[#2d2d30]">
                     <h2 className="text-[15px] font-bold text-white">System Requirements</h2>
                   </div>
                   <div className="p-5 text-[13px] text-gray-200 bg-[#202020]">
                      <div className="flex items-start gap-3 mb-5">
                         <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                            <span className="material-symbols-outlined text-white text-[16px] font-bold">check</span>
                         </div>
                         <div className="leading-relaxed">
                            This product should work on your device. Items with a checkmark meet the developer's system requirements.
                         </div>
                      </div>
                      <span className="text-[#4CC2FF] text-[13px] hover:underline font-medium cursor-pointer">Show more</span>
                   </div>
                </section>

                {/* Additional Information Card */}
                <section className="bg-[#2a2a2a] rounded-lg border border-[#333] overflow-hidden">
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
                </section>

              </div>

              {/* Right Column - Discover More */}
              <div className="flex-none w-full lg:w-[280px] xl:w-[300px] flex flex-col flex-shrink-0 sticky top-4 self-start">
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
