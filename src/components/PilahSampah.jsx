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

// Scattered Trash Component
function ScatteredTrashItem({ trash, onDrag, onDragEnd }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (e, info) => {
    setIsDragging(false);
    onDragEnd(e, info, trash.uid, trash.category);
  };

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: `${trash.x}%`,
        top: `${trash.y}%`,
        zIndex: isDragging ? 999 : 10,
      }}
    >
      <motion.div
        drag
        dragMomentum={false}
        dragElastic={0.05}
        onDragStart={handleDragStart}
        onDrag={onDrag}
        onDragEnd={handleDragEnd}
        whileDrag={{ scale: 1.35 }}
        style={{
          touchAction: 'none',
          cursor: 'grab',
          pointerEvents: 'auto',
          position: 'relative',
        }}
      >
        <trash.Component />
      </motion.div>
    </motion.div>
  );
}

export default function PilahSampah({ currentGroupName, onSaveSessionScore, onClose, onGoHome, playClickSound }) {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [scatteredTrash, setScatteredTrash] = useState([]);
  const [dropAnimations, setDropAnimations] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [shakingBin, setShakingBin] = useState(null);
  const [hoveredBin, setHoveredBin] = useState(null);
  const [combo, setCombo] = useState(1);
  const [floatingScores, setFloatingScores] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60);
  
  const scoreRef = useRef(score);
  useEffect(() => { scoreRef.current = score; }, [score]);
  const hasSavedRef = useRef(false);

  // Save to leaderboard when game ends
  useEffect(() => {
    if (!gameOver) return;
    if (hasSavedRef.current) return;
    hasSavedRef.current = true;
    if (currentGroupName) {
      console.log('PilahSampah: Saving score:', currentGroupName, scoreRef.current);
      saveScore(currentGroupName, scoreRef.current, 'PILAH');
      if (onSaveSessionScore) {
        onSaveSessionScore(currentGroupName, scoreRef.current);
      }
    }
  }, [gameOver]); // eslint-disable-line react-hooks/exhaustive-deps

  // Audio Context (Copied from CariSampah)
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
      gain.gain.linearRampToValueAtTime(2.0, now + 0.02);
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
      gainNode.gain.linearRampToValueAtTime(2.5, audioCtx.currentTime + 0.05);
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

  // Spawning Trash loop
  useEffect(() => {
    if (gameOver) return;
    const MAX_TRASH = 8;

    const getValidPosition = (existingItems) => {
      let x, y;
      let valid = false;
      let attempts = 0;
      
      while (!valid && attempts < 15) {
        x = 10 + Math.random() * 75;
        y = 55 + Math.random() * 30;
        valid = true;
        
        for (let item of existingItems) {
          const dx = Math.abs(item.x - x);
          const dy = Math.abs(item.y - y);
          // Berikan jarak minimal 12% secara horizontal dan 15% secara vertikal
          if (dx < 12 && dy < 15) {
            valid = false;
            break;
          }
        }
        attempts++;
      }
      return valid ? { x, y } : null; // Mengembalikan null jika sudah terlalu padat
    };

    const spawnInterval = setInterval(() => {
      setScatteredTrash(prev => {
        if (prev.length >= MAX_TRASH) return prev; // Limit max scattered items

        const pos = getValidPosition(prev);
        if (!pos) return prev; // Tunda spawn jika tidak ada ruang yang cukup

        const randomTrash = TRASH_TYPES[Math.floor(Math.random() * TRASH_TYPES.length)];
        return [
          ...prev,
          { uid: Date.now() + Math.random(), ...randomTrash, x: pos.x, y: pos.y }
        ];
      });
    }, 1500); // Try to spawn every 1.5 seconds

    // Initial spawn of 4 items
    setScatteredTrash([]);
    let currentInitial = [];
    for(let i=0; i<4; i++) {
      const pos = getValidPosition(currentInitial);
      if (pos) {
        const randomTrash = TRASH_TYPES[Math.floor(Math.random() * TRASH_TYPES.length)];
        currentInitial.push({ uid: Date.now() + Math.random(), ...randomTrash, x: pos.x, y: pos.y });
      }
    }
    setScatteredTrash(currentInitial);

    return () => clearInterval(spawnInterval);
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
    setHoveredBin(null);

    if (droppedBin === category) {
      // Benar
      playSuccessSound();
      const earnedScore = 10 * combo;
      setScore(s => s + earnedScore);
      
      if (combo % 10 === 0) {
        setLives(l => (l < 5 ? l + 1 : l));
      }
      
      const newCombo = combo + 1;
      setCombo(newCombo);
      
      setFloatingScores(prev => [...prev, {
        id: Date.now(),
        x: dropX,
        y: dropY - 50,
        text: newCombo > 2 ? `+${earnedScore} COMBO x${combo}!` : `+${earnedScore}`,
        isCombo: newCombo > 2
      }]);

      setTimeout(() => setFloatingScores(prev => prev.slice(1)), 1000);
      
      const droppedItem = scatteredTrash.find(t => t.uid === uid);
      if (droppedItem) {
        setDropAnimations(prev => [...prev, {
          id: uid,
          Component: droppedItem.Component,
          category: category,
          x: dropX,
          y: dropY
        }]);
        setTimeout(() => setDropAnimations(prev => prev.filter(anim => anim.id !== uid)), 1000);
      }
      setScatteredTrash(prev => prev.filter(t => t.uid !== uid));
    } else if (droppedBin !== null) {
      // Salah tong
      setCombo(1);
      playRejectSound();
      setShakingBin(droppedBin);
      setTimeout(() => setShakingBin(null), 500);

      // Force snap back by removing and re-adding the item (re-mount resets framer drag state)
      const itemToReset = scatteredTrash.find(t => t.uid === uid);
      if (itemToReset) {
        setScatteredTrash(prev => prev.filter(t => t.uid !== uid));
        setTimeout(() => {
          setScatteredTrash(prev => [...prev, itemToReset]);
        }, 10);
      }
      
      setLives(l => {
        const newLives = l - 1;
        if (newLives <= 0) setGameOver(true);
        return newLives;
      });
    } else {
      // Dilepas di rumput, jangan kembalikan posisinya, biarkan menetap (drag akan menahan posisinya jika dragSnapToOrigin tidak diset)
      // Kita tidak perlu update state karena Framer drag x/y offset sudah berada di tempat itu.
      // Opsional: kita update koordinat X/Y agar tidak ter-reset jika re-render
      // Tapi untuk kemudahan, framer drag offset akan bertahan.
    }
  };

  return (
    <main 
      ref={containerRef}
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

      {/* Play Area */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        {scatteredTrash.map((trash) => (
          <ScatteredTrashItem 
            key={trash.uid} 
            trash={trash} 
            onDrag={handleDrag}
            onDragEnd={handleDragEnd} 
          />
        ))}

        {dropAnimations.map(anim => (
          <DropAnimation key={anim.id} animation={anim} />
        ))}
      </div>

      {/* UI OVERLAY */}
      <div className="relative z-20 w-full h-full flex flex-col pointer-events-none">
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

        {/* Back Button */}
        <div className="absolute top-6 right-6 short:top-2 short:right-2 pointer-events-auto z-[60]">
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

        {/* Trash Bins (Drop Targets) - Positioned at TOP */}
        <div className="absolute top-[18%] short:top-[12%] left-0 w-full flex justify-center items-end gap-12 md:gap-32 short:gap-6 pointer-events-auto">
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
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center">
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
                setLives(5);
                setScatteredTrash([]);
                setTimeLeft(60);
                setCombo(1);
                setGameOver(false);
              }}
              className="px-8 py-4 short:px-4 short:py-2 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-2xl border-4 short:border-2 border-white/50 text-white font-bubbly text-2xl md:text-3xl short:text-xl shadow-[0_6px_0_rgba(6,78,59,0.8)]"
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
              className="px-8 py-4 bg-gradient-to-b from-blue-400 to-blue-600 rounded-2xl border-4 border-white/50 text-white font-bubbly text-2xl md:text-3xl shadow-[0_6px_0_rgba(30,58,138,0.8)]"
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
              className="px-8 py-4 bg-gradient-to-b from-amber-400 to-amber-600 rounded-2xl border-4 border-white/50 text-white font-bubbly text-2xl md:text-3xl shadow-[0_6px_0_rgba(146,64,14,0.8)]"
            >
              Menu Game
            </motion.button>
          </div>
        </div>
      )}
    </main>
  );
}
