import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { TRASH_TYPES } from './TrashItems';
import { saveScore } from '../utils/leaderboardUtils';

export default function CariSampah({ onClose, onGoHome, playClickSound, currentGroupName, onSaveSessionScore }) {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5); // Nyawa ditingkatkan menjadi 5
  const [missed, setMissed] = useState(0);
  const [activeTrash, setActiveTrash] = useState([]);
  const [dropAnimations, setDropAnimations] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [shakingBin, setShakingBin] = useState(null);
  const [hoveredBin, setHoveredBin] = useState(null);
  const [combo, setCombo] = useState(1);
  const [floatingScores, setFloatingScores] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60); // Waktu bermain 60 detik (1 menit)
  
  const scoreRef = useRef(score);
  const hasSavedRef = useRef(false);
  useEffect(() => { scoreRef.current = score; }, [score]);

  const playSuccessSound = useCallback(() => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      // Suara gelembung/pop ceria (matching dengan visual gelembung)
      osc.type = 'sine';
      
      const now = audioCtx.currentTime;
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.6, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
  }, []);

  const playRejectSound = useCallback(() => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      // Suara kasar (buzzer)
      oscillator.type = 'sawtooth';
      
      // Frekuensi rendah yang turun (kesan salah/gagal)
      oscillator.frequency.setValueAtTime(150, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.3);

      // Volume: mulai cepat, lalu memudar (volume diperbesar menjadi 0.8)
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.8, audioCtx.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);

      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
  }, []);

  const organikRef = useRef(null);
  const nonOrganikRef = useRef(null);
  const b3Ref = useRef(null);
  const containerRef = useRef(null);

  // Timer loop
  useEffect(() => {
    if (gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          setGameOver(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameOver]);

  // Save to leaderboard when game ends
  useEffect(() => {
    if (!gameOver) return;
    if (hasSavedRef.current) return;
    hasSavedRef.current = true;
    
    if (currentGroupName) {
      console.log('Saving score:', currentGroupName, scoreRef.current);
      saveScore(currentGroupName, scoreRef.current, 'CARI');
      if (onSaveSessionScore) {
        onSaveSessionScore(currentGroupName, scoreRef.current);
      }
    }
  }, [gameOver, currentGroupName, onSaveSessionScore]); // eslint-disable-line react-hooks/exhaustive-deps

  // Spawn trash loop (Dynamic Difficulty)
  useEffect(() => {
    if (gameOver) return;
    
    let timeoutId;

    const spawnTrash = () => {
      const currentScore = scoreRef.current;
      const diffMultiplier = Math.floor(currentScore / 100);

      const randomTrash = TRASH_TYPES[Math.floor(Math.random() * TRASH_TYPES.length)];
      // Posisi vertikal dinaikkan sedikit (sekitar 78% - 86% tinggi layar)
      const startY = 78 + Math.random() * 8;
      
      // Kecepatan dipercepat seiring skor (Base: 15s-22s, bertambah cepat hingga min 5s)
      const baseSpeed = Math.max(5, 15 - (diffMultiplier * 1.5));
      const speed = baseSpeed + Math.random() * 7;

      setActiveTrash(prev => [
        ...prev, 
        { 
          uid: Date.now() + Math.random(), 
          ...randomTrash,
          startY,
          speed
        }
      ]);

      // Rentang waktu dipercepat seiring skor (Base: 2500ms, min 800ms)
      const nextInterval = Math.max(800, 2500 - (diffMultiplier * 250));
      timeoutId = setTimeout(spawnTrash, nextInterval);
    };

    timeoutId = setTimeout(spawnTrash, 1000); // first spawn
    return () => clearTimeout(timeoutId);
  }, [gameOver]);

  const checkAnyBin = (x, y) => {
    const checkIntersect = (ref) => {
      if (!ref.current) return false;
      const rect = ref.current.getBoundingClientRect();
      const margin = 60;
      return (
        x >= rect.left - margin && 
        x <= rect.right + margin && 
        y >= rect.top - margin && 
        y <= rect.bottom + margin
      );
    };

    if (checkIntersect(organikRef)) return 'Organik';
    if (checkIntersect(nonOrganikRef)) return 'Non Organik';
    if (checkIntersect(b3Ref)) return 'B3';
    return null;
  };

  const handleDrag = (event, info) => {
    const bin = checkAnyBin(info.point.x, info.point.y);
    if (bin !== hoveredBin) {
      setHoveredBin(bin);
    }
  };

  const handleDragEnd = (event, info, uid, category) => {
    const dropX = info.point.x;
    const dropY = info.point.y;

    const droppedBin = checkAnyBin(dropX, dropY);
    setHoveredBin(null); // Reset efek hover saat dilepas

    if (droppedBin === category) {
      // Benar! Tambah animasi drop dan suara sukses
      playSuccessSound();
      
      const earnedScore = 10 * combo;
      setScore(s => s + earnedScore);
      
      // Bonus nyawa jika mencapai combo kelipatan 10 (dan nyawa belum penuh)
      if (combo % 10 === 0) {
        setLives(l => {
          if (l < 5) {
            // Bisa mainkan suara 1-UP khusus di sini kalau ada
            return l + 1;
          }
          return l;
        });
      }
      
      const newCombo = combo + 1;
      setCombo(newCombo);
      
      // Munculkan teks skor melayang
      setFloatingScores(prev => [...prev, {
        id: Date.now(),
        x: dropX,
        y: dropY - 50, // Muncul sedikit di atas kursor
        text: newCombo > 2 ? `+${earnedScore} COMBO x${combo}!` : `+${earnedScore}`,
        isCombo: newCombo > 2
      }]);

      // Hilangkan teks melayang setelah 1 detik
      setTimeout(() => {
        setFloatingScores(prev => prev.slice(1));
      }, 1000);
      
      const droppedItem = activeTrash.find(t => t.uid === uid);
      if (droppedItem) {
        setDropAnimations(prev => [...prev, {
          id: uid,
          Component: droppedItem.Component,
          category: category,
          x: dropX,
          y: dropY
        }]);
        setTimeout(() => {
          setDropAnimations(prev => prev.filter(anim => anim.id !== uid));
        }, 1000);
      }
      
      setActiveTrash(prev => prev.filter(t => t.uid !== uid));
    } else if (droppedBin !== null) {
      // Salah tong! Reset combo, kurangi nyawa
      setCombo(1);
      playRejectSound();
      
      setShakingBin(droppedBin);
      setTimeout(() => setShakingBin(null), 500); // Getar selama 0.5s

      setActiveTrash(prev => prev.filter(t => t.uid !== uid));
      setLives(l => {
        const newLives = l - 1;
        if (newLives <= 0) setGameOver(true);
        return newLives;
      });
    }
    // Jika dilepas di luar tong, sampah tetap ada & lanjut mengalir
  };

  const handleMissed = (uid) => {
    setCombo(1); // Reset combo karena terlewat
    setMissed(m => m + 1);
    setLives(l => {
      const newLives = l - 1;
      if (newLives <= 0) setGameOver(true);
      return newLives;
    });
    setActiveTrash(prev => prev.filter(t => t.uid !== uid));
  };

  return (
    <main 
      ref={containerRef}
      className="relative w-screen h-screen overflow-hidden select-none bg-black"
      style={{ fontFamily: "'Plus Jakarta Sans', 'Blue Water', sans-serif" }}
    >
      {/* Fade from black */}
      <motion.div 
        className="absolute inset-0 z-50 bg-black pointer-events-none"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      
      {/* Background Video */}
      <video 
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 z-0 w-full h-full object-cover"
        style={{ willChange: 'transform', transform: 'translateZ(0)', imageRendering: 'high-quality' }}
        src="/assets/videos/Grassy_field_with_flowing_water_202607181256.mp4"
      />

      {/* Play Area - Trash Items */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        {activeTrash.map((trash) => (
          <FlowingTrashItem 
            key={trash.uid} 
            trash={trash} 
            onDrag={handleDrag}
            onDragEnd={handleDragEnd} 
            onMissed={handleMissed}
          />
        ))}

        {/* Drop Animations (Particles & shrink) */}
        {dropAnimations.map(anim => (
          <DropAnimation key={anim.id} animation={anim} />
        ))}
      </div>

      {/* UI OVERLAY */}
      <div className="relative z-20 w-full h-full flex flex-col pointer-events-none">
        
        {/* Group Name Display */}
        {currentGroupName && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 short:top-2 z-40 pointer-events-none">
            <div className="bg-white/80 backdrop-blur-sm px-8 py-2 short:px-4 short:py-1 rounded-full border-4 short:border-2 border-emerald-300 shadow-md">
              <span className="text-2xl short:text-xl font-bubbly text-emerald-800 uppercase tracking-widest">{currentGroupName}</span>
            </div>
          </div>
        )}

        {/* Scoreboard & Timer */}
        <div className="absolute top-6 left-6 short:top-2 short:left-2 flex flex-wrap items-center gap-4 short:gap-2 pointer-events-auto z-40">
          
          {/* Timer */}
          <motion.div className="bg-gradient-to-b from-blue-500/90 to-blue-700/95 backdrop-blur-md border-[4px] short:border-2 border-blue-300/60 shadow-[0_6px_0_rgba(30,58,138,0.7),inset_0_4px_6px_rgba(255,255,255,0.3)] rounded-2xl px-6 py-3 short:px-3 short:py-1 flex items-center justify-center">
            <span className={`text-3xl short:text-xl font-bubbly tracking-wide drop-shadow-md ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-white'}`} style={{ WebkitTextStroke: timeLeft <= 10 ? '1.5px #7f1d1d' : '1.5px #1e3a8a' }}>
              Waktu : {timeLeft}s
            </span>
          </motion.div>

          <motion.div className="bg-gradient-to-b from-amber-500/90 to-amber-700/95 backdrop-blur-md border-[4px] short:border-2 border-amber-300/60 shadow-[0_6px_0_rgba(120,53,15,0.7),inset_0_4px_6px_rgba(255,255,255,0.3)] rounded-2xl px-6 py-3 short:px-3 short:py-1 flex flex-col items-center justify-center">
            <span className="text-3xl short:text-xl text-white font-bubbly tracking-wide drop-shadow-md" style={{ WebkitTextStroke: '1.5px #78350f' }}>
              Score : {score}
            </span>
            {combo > 1 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-lg short:text-sm text-yellow-300 font-bubbly tracking-wider mt-1 drop-shadow-md"
              >
                Combo x{combo}
              </motion.span>
            )}
          </motion.div>

          <motion.div className="bg-gradient-to-b from-amber-500/90 to-amber-700/95 backdrop-blur-md border-[4px] short:border-2 border-amber-300/60 shadow-[0_6px_0_rgba(120,53,15,0.7),inset_0_4px_6px_rgba(255,255,255,0.3)] rounded-2xl px-6 py-3 short:px-3 short:py-1 flex items-center justify-center gap-2 short:gap-1">
            {Array.from({ length: lives }).map((_, i) => (
              <svg 
                key={i}
                viewBox="0 0 24 24" fill="currentColor" 
                className="text-red-500 w-6 h-6 md:w-8 md:h-8 short:w-4 short:h-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            ))}
          </motion.div>

          <motion.div className="bg-gradient-to-b from-amber-500/90 to-amber-700/95 backdrop-blur-md border-[4px] short:border-2 border-amber-300/60 shadow-[0_6px_0_rgba(120,53,15,0.7),inset_0_4px_6px_rgba(255,255,255,0.3)] rounded-2xl px-6 py-3 short:px-3 short:py-1 flex items-center justify-center">
            <span className="text-3xl short:text-xl text-yellow-300 font-bubbly tracking-wide drop-shadow-md" style={{ WebkitTextStroke: '1.5px #78350f' }}>
              Lolos : {missed}x
            </span>
          </motion.div>
        </div>

        {/* Back Button */}
        <div className="absolute top-6 right-6 short:top-2 short:right-2 pointer-events-auto">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9, y: 4 }}
            className="relative overflow-hidden w-16 h-16 md:w-20 md:h-20 short:w-10 short:h-10 bg-gradient-to-b from-red-400/80 to-red-600/90 backdrop-blur-md rounded-2xl border-[4px] short:border-2 border-white/70 shadow-[0_6px_0_rgba(153,27,27,0.4),inset_0_4px_8px_rgba(255,255,255,0.4)] flex items-center justify-center cursor-pointer group"
            onClick={() => { if(playClickSound) playClickSound(); onClose(); }}
          >
            <svg className="w-8 h-8 md:w-10 md:h-10 short:w-6 short:h-6 text-white/90 drop-shadow-md group-hover:scale-105 transition-transform" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </motion.button>
        </div>

        {/* Trash Bins (Drop Targets) */}
        <div className="absolute bottom-[20%] md:bottom-[35%] short:bottom-[10%] left-0 w-full flex justify-center items-end gap-12 md:gap-32 short:gap-6 pointer-events-auto">
          {/* Organik Bin */}
          <motion.div 
            ref={organikRef} 
            className="flex flex-col items-center"
            animate={shakingBin === 'Organik' ? { x: [-10, 10, -10, 10, -5, 5, 0] } : hoveredBin === 'Organik' ? { scale: 1.15 } : { x: 0, scale: 1 }}
            transition={{ duration: shakingBin === 'Organik' ? 0.4 : 0.2 }}
          >
            <img src="/assets/images/Sampah Organik.png" alt="Organik" className="w-32 h-40 md:w-48 md:h-60 short:w-20 short:h-28 object-contain drop-shadow-[0_20px_15px_rgba(0,0,0,0.5)]" />
            <span className="mt-4 short:mt-1 px-4 py-2 short:px-2 short:py-1 bg-black/60 backdrop-blur-sm text-white font-bubbly text-xl md:text-2xl short:text-base rounded-xl border-2 border-white/30 whitespace-nowrap drop-shadow-md">Organik</span>
          </motion.div>
          {/* Non Organik Bin */}
          <motion.div 
            ref={nonOrganikRef} 
            className="flex flex-col items-center"
            animate={shakingBin === 'Non Organik' ? { x: [-10, 10, -10, 10, -5, 5, 0] } : hoveredBin === 'Non Organik' ? { scale: 1.15 } : { x: 0, scale: 1 }}
            transition={{ duration: shakingBin === 'Non Organik' ? 0.4 : 0.2 }}
          >
            <img src="/assets/images/Sampah Non Organik.png" alt="Non Organik" className="w-32 h-40 md:w-48 md:h-60 short:w-20 short:h-28 object-contain drop-shadow-[0_20px_15px_rgba(0,0,0,0.5)]" />
            <span className="mt-4 short:mt-1 px-4 py-2 short:px-2 short:py-1 bg-black/60 backdrop-blur-sm text-white font-bubbly text-xl md:text-2xl short:text-base rounded-xl border-2 border-white/30 whitespace-nowrap drop-shadow-md">Non Organik</span>
          </motion.div>
          {/* B3 Bin */}
          <motion.div 
            ref={b3Ref} 
            className="flex flex-col items-center"
            animate={shakingBin === 'B3' ? { x: [-10, 10, -10, 10, -5, 5, 0] } : hoveredBin === 'B3' ? { scale: 1.15 } : { x: 0, scale: 1 }}
            transition={{ duration: shakingBin === 'B3' ? 0.4 : 0.2 }}
          >
            <img src="/assets/images/Sampah B3.png" alt="B3" className="w-32 h-40 md:w-48 md:h-60 short:w-20 short:h-28 object-contain drop-shadow-[0_20px_15px_rgba(0,0,0,0.5)]" />
            <span className="mt-4 short:mt-1 px-4 py-2 short:px-2 short:py-1 bg-black/60 backdrop-blur-sm text-white font-bubbly text-xl md:text-2xl short:text-base rounded-xl border-2 border-white/30 whitespace-nowrap drop-shadow-md">B3</span>
          </motion.div>
        </div>

        {/* Floating Scores Overlay */}
        {floatingScores.map(fs => (
          <motion.div
            key={fs.id}
            initial={{ opacity: 1, y: 0, scale: fs.isCombo ? 1.5 : 1 }}
            animate={{ opacity: 0, y: -100, scale: fs.isCombo ? 2 : 1.2 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`absolute z-[9999] pointer-events-none font-bubbly ${fs.isCombo ? 'text-orange-400' : 'text-yellow-300'}`}
            style={{ 
              left: fs.x, 
              top: fs.y, 
              transform: 'translate(-50%, -50%)',
              textShadow: '0 4px 6px rgba(0,0,0,0.5)',
              WebkitTextStroke: fs.isCombo ? '2px #9a3412' : '1.5px #78350f',
              fontSize: fs.isCombo ? '3rem' : '2.5rem'
            }}
          >
            {fs.text}
          </motion.div>
        ))}

      </div>

      {/* Game Over / Time's Up Screen */}
      {gameOver && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center pointer-events-auto">
          <motion.h2 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 12 }}
            className={`text-6xl md:text-8xl short:text-4xl font-bubbly mb-4 drop-shadow-[0_10px_20px_rgba(255,0,0,0.5)] ${lives <= 0 ? 'text-red-500' : 'text-blue-400'}`}
            style={{ WebkitTextStroke: '3px white' }}
          >
            {lives <= 0 ? "GAME OVER" : "WAKTU HABIS!"}
          </motion.h2>
          {lives <= 0 && (
            <p className="text-xl md:text-2xl short:text-lg text-red-300 font-bubbly mb-6 short:mb-2 text-center px-4">Nyawa kamu telah habis akibat membuang sampah sembarangan!</p>
          )}
          <p className="text-4xl short:text-2xl text-white font-bubbly mb-12 short:mb-4">Score Akhir: {score}</p>
          
          <div className="flex flex-wrap gap-4 short:gap-2 justify-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                if(playClickSound) playClickSound();
                hasSavedRef.current = false;
                setScore(0);
                setLives(5); // Nyawa dipulihkan penuh ke 5
                setMissed(0);
                setActiveTrash([]);
                setTimeLeft(60); // Reset waktu kembali ke 60 detik (1 menit)
                setCombo(1); // Reset kombo kembali ke x1
                setGameOver(false);
              }}
              className="px-8 py-4 short:px-4 short:py-2 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-2xl border-4 short:border-2 border-white/50 text-white font-bubbly text-3xl short:text-xl shadow-[0_6px_0_rgba(6,78,59,0.8)]"
            >
              Main Lagi
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                if(playClickSound) playClickSound();
                if(onClose) onClose();
              }}
              className="px-8 py-4 short:px-4 short:py-2 bg-gradient-to-b from-blue-400 to-blue-600 rounded-2xl border-4 short:border-2 border-white/50 text-white font-bubbly text-3xl short:text-xl shadow-[0_6px_0_rgba(30,58,138,0.8)]"
            >
              Ganti Kelompok
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                if(playClickSound) playClickSound();
                if (onGoHome) onGoHome();
              }}
              className="px-8 py-4 short:px-4 short:py-2 bg-gradient-to-b from-amber-400 to-amber-600 rounded-2xl border-4 short:border-2 border-white/50 text-white font-bubbly text-3xl short:text-xl shadow-[0_6px_0_rgba(146,64,14,0.8)]"
            >
              Menu Game
            </motion.button>
          </div>
        </div>
      )}
    </main>
  );
}

// Sub-component for individual trash items
function FlowingTrashItem({ trash, onDrag, onDragEnd, onMissed }) {
  const [isDragging, setIsDragging] = useState(false);
  const [hasMissed, setHasMissed] = useState(false);
  
  const wrapperControls = useAnimation();
  const bobControls = useAnimation();

  const stopAnimation = () => {
    wrapperControls.stop();
    bobControls.stop();
  };

  const resumeAnimation = () => {
    // Lanjutkan animasi dari posisi saat ini
    wrapperControls.start({
      x: "-140vw",
      transition: { duration: trash.speed, ease: "linear" }
    }).then(() => {
      // Jika animasi selesai (sampai ujung layar)
      if (!hasMissed) {
        setHasMissed(true);
        onMissed(trash.uid);
      }
    });
    
    bobControls.start({
      y: [0, -15, 0, 15, 0],
      rotate: [0, 8, -8, 0],
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
    });
  };

  useEffect(() => {
    resumeAnimation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePointerDown = () => {
    stopAnimation();
  };

  const handleDragStart = () => {
    setIsDragging(true);
    stopAnimation();
  };

  const handleDragEnd = (e, info) => {
    setIsDragging(false);
    onDragEnd(e, info, trash.uid, trash.category);
    // Jika tidak dilempar ke tong dan masih ada, lanjutkan aliran
    resumeAnimation();
  };

  return (
    <motion.div
      initial={{ x: "120vw" }}
      animate={wrapperControls}
      style={{
        position: 'absolute',
        top: `${trash.startY}%`,
        zIndex: isDragging ? 999 : 10,
        pointerEvents: 'none',
      }}
    >
      <motion.div
        animate={bobControls}
        style={{ pointerEvents: 'none' }}
      >
        <motion.div
          drag
          dragSnapToOrigin={true}
          dragMomentum={false}
          dragElastic={0.05}
          onPointerDown={handlePointerDown}
          onDragStart={handleDragStart}
          onDrag={onDrag}
          onDragEnd={handleDragEnd}
          whileDrag={{ scale: 1.35 }}
          style={{
            touchAction: 'none',
            cursor: 'grab',
            pointerEvents: 'auto',
            position: 'relative',
            zIndex: 20,
          }}
        >
          <trash.Component />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// Sub-component untuk animasi masuk tong dan partikel buih
function DropAnimation({ animation }) {
  const getBubbleColor = () => {
    switch(animation.category) {
      case 'Organik': return 'bg-green-500';
      case 'Non Organik': return 'bg-yellow-400';
      case 'B3': return 'bg-red-500';
      default: return 'bg-white';
    }
  };
  
  // Perbanyak jumlah partikel agar lebih jelas
  const bubbles = Array.from({ length: 20 });

  return (
    <div 
      className="absolute z-[9999] pointer-events-none"
      style={{ left: animation.x, top: animation.y, transform: 'translate(-50%, -50%)' }}
    >
      {/* Animasi sampah masuk tong */}
      <motion.div
        className="relative z-20"
        initial={{ scale: 1.35, y: -20, opacity: 1 }}
        animate={{ scale: 0, y: 50, opacity: 0 }}
        transition={{ duration: 0.35, ease: "easeIn" }}
      >
        <animation.Component />
      </motion.div>

      {/* Efek partikel buih (bubbles) */}
      {bubbles.map((_, i) => {
        // Ukuran partikel diperbesar
        const size = 30 + Math.random() * 40; 
        return (
          <motion.div
            key={i}
            // Hilangkan mix-blend-screen agar warna lebih tebal dan solid (persis seperti referensi)
            className={`absolute left-1/2 top-1/2 rounded-full ${getBubbleColor()} z-30`}
            style={{ width: size, height: size }}
            initial={{ 
              x: "-50%", 
              y: "-50%", 
              opacity: 0.9 
            }}
            animate={{ 
              x: `calc(-50% + ${(Math.random() - 0.5) * 160}px)`, 
              y: `calc(-50% - ${50 + Math.random() * 100}px)`, 
              opacity: 0,
              scale: 2 + Math.random()
            }}
            transition={{ duration: 0.6 + Math.random() * 0.4, ease: "easeOut" }}
          />
        );
      })}
    </div>
  );
}
