import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function IntroCutscene({ onComplete }) {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const videoRef = useRef(null);
  const audioInitialized = useRef(false);

  // Logika untuk memperbesar volume video (amplify) melebih batas normal 100%
  useEffect(() => {
    if (!videoRef.current || audioInitialized.current) return;
    audioInitialized.current = true;
    
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioCtx.createMediaElementSource(videoRef.current);
      const gainNode = audioCtx.createGain();
      
      // Tingkatkan volume hingga 3x lipat (300%)
      gainNode.gain.value = 3.0; 
      
      source.connect(gainNode);
      gainNode.connect(audioCtx.destination);
    } catch (e) {
      console.error("Audio API Error (Video Boost):", e);
    }
  }, []);
  
  const handleVideoEnd = () => {
    // Mulai efek memudar (fade out)
    setIsFadingOut(true);
    // Tunggu animasi fade out selesai (1 detik) sebelum lanjut ke halaman berikutnya
    setTimeout(() => {
      onComplete();
    }, 1000); 
  };

  return (
    <div className="absolute inset-0 z-50 bg-black flex items-center justify-center overflow-hidden">
      {/* Overlay hitam untuk efek memudar (fade to black) */}
      <motion.div 
        className="absolute inset-0 z-10 bg-black pointer-events-none"
        initial={{ opacity: 1 }}
        animate={{ opacity: isFadingOut ? 1 : 0 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
      <video
        ref={videoRef}
        autoPlay
        playsInline
        crossOrigin="anonymous"
        onEnded={handleVideoEnd}
        className="w-full h-full object-cover z-0"
        src="/assets/videos/Cartoon_person_throws_trash_202607180515.mp4"
      />
    </div>
  );
}
