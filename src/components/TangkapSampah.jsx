import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { TRASH_TYPES } from './TrashItems';
import { saveScore } from '../utils/leaderboard';

// Sub-component for dropping animation (particles & shrink)
const DropAnimation = ({ animation }) => {
  const { Component, x, y } = animation;
  return (
    <div style={{ position: 'absolute', left: x, top: y, pointerEvents: 'none', zIndex: 50 }}>
      <motion.div
        initial={{ scale: 1, opacity: 1, y: 0 }}
        animate={{ scale: 0, opacity: 0, y: 50 }}
        transition={{ duration: 0.5, ease: "easeIn" }}
        style={{ transform: 'translate(-50%, -50%)' }}
      >
        <Component />
      </motion.div>
      {/* Gelembung efek */}
      {[...Array(20)].map((_, i) => {
        const angle = (i / 20) * Math.PI * 2;
        const radius = 30 + Math.random() * 40;
        const tx = Math.cos(angle) * radius;
        const ty = Math.sin(angle) * radius;
        const size = 6 + Math.random() * 10;
        const colors = ['#facc15', '#60a5fa', '#34d399', '#f87171', '#fb923c'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        return (
          <motion.div
            key={i}
            initial={{ x: 0, y: 0, scale: 0.5, opacity: 1 }}
            animate={{ x: tx, y: ty, scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.4 + Math.random() * 0.3, ease: "easeOut" }}
            style={{
              position: 'absolute',
              width: size,
              height: size,
              borderRadius: '50%',
              backgroundColor: color,
              boxShadow: `0 0 8px ${color}`,
            }}
          />
        );
      })}
    </div>
  );
};

const FallingTrashItem = ({ trash }) => {
  return (
    <motion.div
      className="falling-trash"
      data-uid={trash.uid}
      data-category={trash.category}
      initial={{ top: '-15%', left: `${trash.startX}%` }}
      animate={{ top: '115%' }} // Animates down straight
      transition={{ duration: trash.speed, ease: "linear" }}
      style={{
        position: 'absolute',
        zIndex: 20,
        pointerEvents: 'none' // User interacts with bins, not the trash directly
      }}
    >
      <trash.Component />
    </motion.div>
  );
};

export default function TangkapSampah({ currentGroupName, onSaveSessionScore, onClose, onGoHome, playClickSound }) {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [activeTrash, setActiveTrash] = useState([]);
  const [dropAnimations, setDropAnimations] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [shakingBin, setShakingBin] = useState(null);
  const [combo, setCombo] = useState(1);
  const [floatingScores, setFloatingScores] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameId, setGameId] = useState(0); // State untuk mereset posisi tong
  
  const scoreRef = useRef(score);
  useEffect(() => { scoreRef.current = score; }, [score]);
  const hasSavedRef = useRef(false); // mencegah penyimpanan ganda
  
  const comboRef = useRef(combo);
  useEffect(() => { comboRef.current = combo; }, [combo]);

  // Audio Context
  const playSuccessSound = useCallback(() => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
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
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(150, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.3);
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
  const dragContainerRef = useRef(null);

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
    if (hasSavedRef.current) return; // sudah disimpan, jangan simpan lagi
    hasSavedRef.current = true;
    
    if (currentGroupName) {
      console.log('Saving score:', currentGroupName, scoreRef.current);
      saveScore(currentGroupName, scoreRef.current, 'TANGKAP');
      if (onSaveSessionScore) {
        onSaveSessionScore(currentGroupName, scoreRef.current);
      }
    }
  }, [gameOver]); // eslint-disable-line react-hooks/exhaustive-deps

  // Spawning Trash loop
  useEffect(() => {
    if (gameOver) return;

    let timeoutId;

    const spawnTrash = () => {
      const diffMultiplier = Math.floor(scoreRef.current / 100);
      const randomTrash = TRASH_TYPES[Math.floor(Math.random() * TRASH_TYPES.length)];
      
      // Melebarkan area jatuh: dari ujung kiri (2%) hingga ujung kanan (98%)
      const startX = 2 + Math.random() * 96;
      
      // Speed (duration in seconds) - gets faster with difficulty
      const baseSpeed = Math.max(3, 8 - (diffMultiplier * 0.8));
      const speed = baseSpeed + Math.random() * 2;

      setActiveTrash(prev => [
        ...prev, 
        { 
          uid: Date.now() + Math.random(), 
          ...randomTrash,
          startX,
          speed
        }
      ]);

      // Interval between spawns gets faster
      const nextInterval = Math.max(800, 2500 - (diffMultiplier * 300));
      timeoutId = setTimeout(spawnTrash, nextInterval);
    };

    timeoutId = setTimeout(spawnTrash, 1500);
    return () => clearTimeout(timeoutId);
  }, [gameOver]);

  // Handle Logic inside the game loop to avoid stale closure issues
  const handleCaught = useCallback((uid, category, binType, trashRect) => {
    setActiveTrash(prev => {
      const caughtItem = prev.find(t => t.uid === uid);
      if (!caughtItem) return prev; // Already handled

      // Trigger effects
      if (category === binType) {
        // Benar
        playSuccessSound();
        const currentCombo = comboRef.current;
        const earnedScore = 10 * currentCombo;
        setScore(s => s + earnedScore);
        
        if (currentCombo > 0 && currentCombo % 10 === 0) {
          setLives(l => (l < 5 ? l + 1 : l));
        }
        
        const newCombo = currentCombo + 1;
        setCombo(newCombo);
        
        setFloatingScores(fs => [...fs, {
          id: Date.now(),
          x: trashRect.left + (trashRect.width / 2),
          y: trashRect.top,
          text: newCombo > 2 ? `+${earnedScore} COMBO x${currentCombo}!` : `+${earnedScore}`,
          isCombo: newCombo > 2
        }]);

        setTimeout(() => setFloatingScores(fs => fs.slice(1)), 1000);
        
        setDropAnimations(da => [...da, {
          id: uid,
          Component: caughtItem.Component,
          x: trashRect.left + (trashRect.width / 2),
          y: trashRect.top + (trashRect.height / 2)
        }]);
        setTimeout(() => setDropAnimations(da => da.filter(anim => anim.id !== uid)), 1000);

      } else {
        // Salah
        playRejectSound();
        setCombo(1);
        setShakingBin(binType);
        setTimeout(() => setShakingBin(null), 500);
        setLives(l => {
          const newLives = l - 1;
          if (newLives <= 0) setGameOver(true);
          return newLives;
        });
      }

      return prev.filter(t => t.uid !== uid);
    });
  }, [playSuccessSound, playRejectSound]);

  const handleMissed = useCallback((uid) => {
    setActiveTrash(prev => {
      const missedItem = prev.find(t => t.uid === uid);
      if (!missedItem) return prev; // Already handled
      
      setCombo(1);
      setLives(l => {
        const newLives = l - 1;
        if (newLives <= 0) setGameOver(true);
        return newLives;
      });
      return prev.filter(t => t.uid !== uid);
    });
  }, []);

  // GAME LOOP for Collision Detection
  useEffect(() => {
    if (gameOver) return;
    let animationFrameId;
    
    const checkCollisions = () => {
      const trashEls = document.querySelectorAll('.falling-trash');
      const orgRect = organikRef.current?.getBoundingClientRect();
      const nonOrgRect = nonOrganikRef.current?.getBoundingClientRect();
      const b3Rect = b3Ref.current?.getBoundingClientRect();

      trashEls.forEach(trashEl => {
        if (trashEl.dataset.caught) return;
        
        const trashRect = trashEl.getBoundingClientRect();
        const uid = Number(trashEl.dataset.uid);
        const category = trashEl.dataset.category;

        // Check if missed (fell past screen)
        if (trashRect.top > window.innerHeight) {
          trashEl.dataset.caught = "true";
          handleMissed(uid);
          return;
        }

        const checkHit = (binRect) => {
          if (!binRect) return false;
          // Cek posisi horizontal (Tengah sampah ada di area kiri-kanan tong)
          const trashCenterX = trashRect.left + (trashRect.width / 2);
          // Cek posisi vertikal (Bawah sampah menyentuh 1/3 area atas tong)
          const trashBottomY = trashRect.bottom;
          const hitX = trashCenterX >= binRect.left && trashCenterX <= binRect.right;
          const hitY = trashBottomY >= binRect.top && trashBottomY <= (binRect.top + binRect.height * 0.4);
          return hitX && hitY;
        };

        if (checkHit(orgRect)) {
          trashEl.dataset.caught = "true";
          handleCaught(uid, category, 'Organik', trashRect);
        } else if (checkHit(nonOrgRect)) {
          trashEl.dataset.caught = "true";
          handleCaught(uid, category, 'Non Organik', trashRect);
        } else if (checkHit(b3Rect)) {
          trashEl.dataset.caught = "true";
          handleCaught(uid, category, 'B3', trashRect);
        }
      });

      animationFrameId = requestAnimationFrame(checkCollisions);
    };

    animationFrameId = requestAnimationFrame(checkCollisions);
    return () => cancelAnimationFrame(animationFrameId);
  }, [gameOver, handleCaught, handleMissed]);

  return (
    <main 
      className="relative w-screen h-screen overflow-hidden select-none bg-black"
      style={{ fontFamily: "'Plus Jakarta Sans', 'Blue Water', sans-serif" }}
    >
      <motion.div 
        className="absolute inset-0 z-50 bg-black pointer-events-none"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      
      <video 
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 z-0 w-full h-full object-cover"
        style={{ willChange: 'transform', transform: 'translateZ(0)', imageRendering: 'high-quality' }}
        src="/assets/videos/Grassy_field_swaying_in_breeze_202607181339.mp4"
      />

      {/* Play Area (Trash Items & Drag Bounds) */}
      <div className="absolute inset-0 z-30 pointer-events-none" ref={dragContainerRef}>
        {activeTrash.map((trash) => (
          <FallingTrashItem key={trash.uid} trash={trash} />
        ))}

        {dropAnimations.map(anim => (
          <DropAnimation key={anim.id} animation={anim} />
        ))}
      </div>

      {/* UI OVERLAY */}
      <div className="relative z-40 w-full h-full flex flex-col pointer-events-none">
        
        {/* Scoreboard & Timer */}
        <div className="absolute top-6 left-6 short:top-2 short:left-2 flex flex-wrap items-center gap-4 short:gap-2 pointer-events-auto">
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
        </div>

        {/* Group Name Display */}
        {currentGroupName && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 short:top-2 z-40 pointer-events-none">
            <div className="bg-white/80 backdrop-blur-sm px-8 py-2 short:px-4 short:py-1 rounded-full border-4 short:border-2 border-emerald-300 shadow-md">
              <span className="text-2xl short:text-xl font-bubbly text-emerald-800 uppercase tracking-widest">{currentGroupName}</span>
            </div>
          </div>
        )}

        {/* Back Button */}
        <div className="absolute top-6 right-6 short:top-2 short:right-2 pointer-events-auto z-50">
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

        {/* 3 Trash Bins at the Bottom (DRAGGABLE) */}
        <div key={gameId} className="absolute bottom-0 left-0 w-full flex justify-center items-end gap-12 md:gap-32 short:gap-6 pointer-events-auto pb-4 short:pb-2">
          
          {/* Organik Bin */}
          <motion.div 
            drag="x"
            dragConstraints={dragContainerRef}
            dragElastic={0.1}
            dragMomentum={false}
            className="cursor-grab active:cursor-grabbing"
          >
            <motion.div 
              ref={organikRef} 
              className="flex flex-col items-center"
              animate={shakingBin === 'Organik' ? { x: [-10, 10, -10, 10, -5, 5, 0] } : { x: 0 }}
              transition={{ duration: shakingBin === 'Organik' ? 0.4 : 0.2 }}
            >
              <img src="/assets/images/Sampah Organik.png" alt="Organik" className="w-32 h-40 md:w-48 md:h-60 short:w-20 short:h-28 object-contain drop-shadow-[0_20px_15px_rgba(0,0,0,0.5)] pointer-events-none" />
              <span className="mt-4 short:mt-1 px-4 py-2 short:px-2 short:py-1 bg-black/60 backdrop-blur-sm text-white font-bubbly text-xl md:text-2xl short:text-base rounded-xl border-2 border-white/30 whitespace-nowrap drop-shadow-md pointer-events-none">Organik</span>
            </motion.div>
          </motion.div>
          
          {/* Non Organik Bin */}
          <motion.div 
            drag="x"
            dragConstraints={dragContainerRef}
            dragElastic={0.1}
            dragMomentum={false}
            className="cursor-grab active:cursor-grabbing"
          >
            <motion.div 
              ref={nonOrganikRef} 
              className="flex flex-col items-center"
              animate={shakingBin === 'Non Organik' ? { x: [-10, 10, -10, 10, -5, 5, 0] } : { x: 0 }}
              transition={{ duration: shakingBin === 'Non Organik' ? 0.4 : 0.2 }}
            >
              <img src="/assets/images/Sampah Non Organik.png" alt="Non Organik" className="w-32 h-40 md:w-48 md:h-60 short:w-20 short:h-28 object-contain drop-shadow-[0_20px_15px_rgba(0,0,0,0.5)] pointer-events-none" />
              <span className="mt-4 short:mt-1 px-4 py-2 short:px-2 short:py-1 bg-black/60 backdrop-blur-sm text-white font-bubbly text-xl md:text-2xl short:text-base rounded-xl border-2 border-white/30 whitespace-nowrap drop-shadow-md pointer-events-none">Non Organik</span>
            </motion.div>
          </motion.div>
          
          {/* B3 Bin */}
          <motion.div 
            drag="x"
            dragConstraints={dragContainerRef}
            dragElastic={0.1}
            dragMomentum={false}
            className="cursor-grab active:cursor-grabbing"
          >
            <motion.div 
              ref={b3Ref} 
              className="flex flex-col items-center"
              animate={shakingBin === 'B3' ? { x: [-10, 10, -10, 10, -5, 5, 0] } : { x: 0 }}
              transition={{ duration: shakingBin === 'B3' ? 0.4 : 0.2 }}
            >
              <img src="/assets/images/Sampah B3.png" alt="B3" className="w-32 h-40 md:w-48 md:h-60 short:w-20 short:h-28 object-contain drop-shadow-[0_20px_15px_rgba(0,0,0,0.5)] pointer-events-none" />
              <span className="mt-4 short:mt-1 px-4 py-2 short:px-2 short:py-1 bg-black/60 backdrop-blur-sm text-white font-bubbly text-xl md:text-2xl short:text-base rounded-xl border-2 border-white/30 whitespace-nowrap drop-shadow-md pointer-events-none">B3</span>
            </motion.div>
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
        <div className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center pointer-events-auto">
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
            <p className="text-xl md:text-2xl short:text-lg text-red-300 font-bubbly mb-6 short:mb-2 text-center px-4">Kamu kelewatan terlalu banyak sampah atau salah tong!</p>
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
                setLives(5);
                setActiveTrash([]);
                setTimeLeft(60);
                setCombo(1);
                setGameOver(false);
                setGameId(id => id + 1);
              }}
              className="px-8 py-4 short:px-4 short:py-2 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-2xl border-4 short:border-2 border-white/50 text-white font-bubbly text-2xl md:text-3xl short:text-lg shadow-[0_6px_0_rgba(6,78,59,0.8)]"
            >
              Main Lagi
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                if(playClickSound) playClickSound();
                onClose();
              }}
              className="px-8 py-4 short:px-4 short:py-2 bg-gradient-to-b from-blue-400 to-blue-600 rounded-2xl border-4 short:border-2 border-white/50 text-white font-bubbly text-2xl md:text-3xl short:text-lg shadow-[0_6px_0_rgba(30,58,138,0.8)]"
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
              className="px-8 py-4 short:px-4 short:py-2 bg-gradient-to-b from-amber-400 to-amber-600 rounded-2xl border-4 short:border-2 border-white/50 text-white font-bubbly text-2xl md:text-3xl short:text-lg shadow-[0_6px_0_rgba(146,64,14,0.8)]"
            >
              Menu Game
            </motion.button>
          </div>
        </div>
      )}
    </main>
  );
}
