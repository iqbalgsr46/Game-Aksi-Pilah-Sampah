# 🎮 Dokumen Spesifikasi Desain UI: Menu Utama "Game Pilah Sampah"

Dokumen ini berisi spesifikasi arsitektur front-end, structural layout, dan desain interaksi untuk halaman utama (**Start Screen**) Game Pilah Sampah "Go Green". Desain ini disesuaikan dengan gaya *bubbly* dan animasi *jelly 3D*.

---

## 1. Persiapan Aset & Font

Sebelum menjalankan kode, pastikan kamu menambahkan font *bubbly* ke dalam file `index.html` (di dalam tag `<head>`):
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap" rel="stylesheet">
```
Konfigurasi `tailwind.config.js` untuk font utama:
```javascript
theme: {
  extend: {
    fontFamily: {
      bubbly: ['"Fredoka One"', 'cursive'],
    }
  }
}
```

---

## 2. Arsitektur Layout & Komposisi Halaman

Halaman menggunakan pendekatan **Full-Screen Canvas Layout** dengan rasio aspek dinamis.

    +-------------------------------------------------------------+
    | [z-10] TOP RIGHT SIDEBAR:                                    |
    | (X) Keluar [Merah] | (👥) Leaderboard [Biru] | (🔊) Audio [Hijau] |
    |                                                             |
    |                         [z-10] CENTER TITLE:                 |
    |                         "Game Pilah Sampah"                 |
    |                            "Go Green..."                    |
    |                                                             |
    |                         [z-10] CENTER PLAY:                 |
    |                             [ ▶ ] (Biru)                    |
    |                                                             |
    | [z-10] BOTTOM FOOTER:                                       |
    | "Selamatkan Lingkunganmu dari Sampah...!!!"                 |
    +-------------------------------------------------------------+
    | [z-0] BACKGROUND LAYER: Ilustrasi Taman & Jalan Tanah       |
    +-------------------------------------------------------------+

---

## 3. Kerangka Kode Siap Pakai (React + Tailwind + Framer Motion)

Salin kode `MainMenu.jsx` ini. Kode ini sudah dilengkapi dengan efek animasi *spring/jelly* dan bayangan 3D bergaya kaca (*glossy*).

```jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function MainMenu({ onStartGame, onOpenLeaderboard }) {
  const [isMuted, setIsMuted] = useState(false);

  // Konfigurasi animasi spring untuk efek "Jelly/3D Press"
  const jellyButtonHover = { scale: 1.05 };
  const jellyButtonTap = { 
    scale: 0.9, 
    y: 4, 
    transition: { type: "spring", stiffness: 400, damping: 10 } 
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-slate-900 select-none font-bubbly">
      {/* 1. BACKGROUND LAYER */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/assets/images/bg-main-menu.png')" }}
      />

      {/* 2. RIGHT SIDEBAR MENU */}
      <div className="absolute top-6 right-6 flex flex-col gap-4 z-10">
        {/* Tombol Keluar (Merah 3D) */}
        <motion.button 
          whileHover={jellyButtonHover}
          whileTap={jellyButtonTap}
          className="w-14 h-14 bg-gradient-to-b from-red-400 to-red-600 rounded-xl border-2 border-white flex items-center justify-center text-white font-bold text-2xl shadow-[0_6px_0_#991b1b,inset_0_4px_8px_rgba(255,255,255,0.6)]"
          onClick={() => window.close()}
        >
          ✕
        </motion.button>

        {/* Tombol Leaderboard (Biru 3D) */}
        <motion.button 
          whileHover={jellyButtonHover}
          whileTap={jellyButtonTap}
          className="w-14 h-14 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-xl border-2 border-white flex items-center justify-center text-white shadow-[0_6px_0_#1e3a8a,inset_0_4px_8px_rgba(255,255,255,0.6)]"
          onClick={onOpenLeaderboard}
        >
          <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 1.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
          </svg>
        </motion.button>

        {/* Tombol Mute Audio (Hijau 3D) */}
        <motion.button 
          whileHover={jellyButtonHover}
          whileTap={jellyButtonTap}
          className={`w-14 h-14 bg-gradient-to-b ${isMuted ? 'from-amber-400 to-amber-600 shadow-[0_6px_0_#92400e,inset_0_4px_8px_rgba(255,255,255,0.6)]' : 'from-green-400 to-green-600 shadow-[0_6px_0_#166534,inset_0_4px_8px_rgba(255,255,255,0.6)]'} rounded-xl border-2 border-white flex items-center justify-center text-white`}
          onClick={() => setIsMuted(!isMuted)}
        >
          {isMuted ? (
            <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM4.34 2.93L2.93 4.34 7.29 8.7H3v6.6h4.4l5.6 5.6v-6.9l4.66 4.66c-.73.57-1.54 1.01-2.43 1.28v2.04c1.44-.32 2.74-1.02 3.82-1.99l2.42 2.42 1.41-1.41L4.34 2.93zM13 4.4L10.66 6.74 13 9.08V4.4z"/></svg>
          ) : (
            <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
          )}
        </motion.button>
      </div>

      {/* 3. CENTER CONTENT BLOCK (Teks Bubbly & Tombol Play) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
        
        {/* Judul Game */}
        <motion.div 
          animate={{ y: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
          className="text-center mb-12 flex flex-col items-center"
        >
          <h1 
            className="text-5xl md:text-7xl text-yellow-400 tracking-wide drop-shadow-[0_8px_4px_rgba(0,0,0,0.3)]"
            style={{ 
              WebkitTextStroke: '3px white', 
              paintOrder: 'stroke fill' 
            }}
          >
            Game Pilah Sampah
          </h1>
          <h2 
            className="text-4xl md:text-6xl text-green-400 tracking-wider -rotate-3 mt-1 drop-shadow-[0_6px_4px_rgba(0,0,0,0.3)]"
            style={{ 
              WebkitTextStroke: '2.5px white', 
              paintOrder: 'stroke fill' 
            }}
          >
            Go Green...
          </h2>
        </motion.div>

        {/* Tombol Play (Glossy Jelly Button) */}
        <motion.button 
          whileHover={jellyButtonHover}
          whileTap={jellyButtonTap}
          className="pointer-events-auto w-36 h-36 md:w-44 md:h-44 bg-gradient-to-b from-cyan-300 to-cyan-500 rounded-[2.5rem] md:rounded-[3rem] border-[6px] border-white flex items-center justify-center shadow-[0_12px_0_#0284c7,inset_0_8px_16px_rgba(255,255,255,0.8)] cursor-pointer group"
          onClick={onStartGame}
        >
          <svg 
            className="w-20 h-20 text-white fill-current transform translate-x-2 group-hover:scale-105 transition-transform duration-200" 
            viewBox="0 0 24 24"
            style={{ filter: 'drop-shadow(0 4px 2px rgba(0,0,0,0.2))' }}
          >
            <path d="M8 5v14l11-7z"/>
          </svg>
        </motion.button>
      </div>

      {/* 4. FOOTER EDUCATIONAL TEXT */}
      <div className="absolute bottom-6 w-full text-center px-4 z-10 font-sans">
        <p className="text-white text-sm md:text-base font-bold tracking-wide drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
          Selamatkan Lingkunganmu dari Sampah...!!! Agar tercipta lingkungan yang indah.
        </p>
      </div>
    </main>
  );
}
```