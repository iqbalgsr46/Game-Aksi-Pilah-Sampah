import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
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

// ============================================================================
// Multi-Touch Draggable Trash Item
// ============================================================================
// Architecture:
//   - Each ScatteredTrashItem manages its own DragSession via refs (not state).
//   - A DragSession is an object { pointerId, startX, startY, initialX, initialY }
//     stored in sessionRef. Only one pointer may own this item at a time.
//   - All position updates happen via framer-motion's useMotionValue (no React
//     re-renders in the hot pointermove path).
//   - setPointerCapture is called on containerRef.current (not e.target) so
//     pointer events are reliably captured even if touch drifts off the SVG.
//   - Multiple ScatteredTrashItem instances can each be dragged simultaneously
//     by different pointers — they share zero mutable state between them.
// ============================================================================
function ScatteredTrashItem({ trash, onDrag, onDragEnd }) {
  // Refs for mutable drag state — avoids React re-renders during drag
  const containerRef = useRef(null);
  const sessionRef = useRef(null);
  const isDraggingRef = useRef(false);

  // MotionValues for GPU-accelerated transforms without re-renders
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const mScale = useMotionValue(1);

  // z-index is the only React state — triggers re-render only on grab/release
  const [zIndex, setZIndex] = useState(10);

  // ---- pointerdown: create DragSession, capture pointer ----
  const handlePointerDown = useCallback((e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    // Object locking: reject if already owned by another pointer
    if (isDraggingRef.current) return;

    // Stop propagation to prevent parent handlers from interfering
    e.stopPropagation();
    // Note: touch-action:'none' on the element handles scroll/zoom prevention.
    // We avoid e.preventDefault() here because React may register pointer events
    // as passive listeners, which would cause a warning or silent failure.

    // Capture on the container div (not e.target which may be an SVG child)
    const el = containerRef.current;
    if (!el) return;
    el.setPointerCapture(e.pointerId);

    // Create DragSession
    sessionRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      initialX: mx.get(),
      initialY: my.get(),
    };
    isDraggingRef.current = true;

    // Visual feedback via motionValue (no re-render)
    mScale.set(1.35);
    setZIndex(999);

    // Notify parent for bin-hover highlight
    if (onDrag) onDrag(trash.uid, e.clientX, e.clientY);
  }, [trash.uid, onDrag, mx, my, mScale]);

  // ---- pointermove: update position for THIS pointer only ----
  const handlePointerMove = useCallback((e) => {
    const session = sessionRef.current;
    if (!session || session.pointerId !== e.pointerId) return;

    // No e.preventDefault() needed — touch-action:'none' handles scrolling

    const dx = e.clientX - session.startX;
    const dy = e.clientY - session.startY;
    mx.set(session.initialX + dx);
    my.set(session.initialY + dy);

    // Notify parent for bin-hover highlight
    if (onDrag) onDrag(trash.uid, e.clientX, e.clientY);
  }, [trash.uid, onDrag, mx, my]);

  // ---- pointerup / pointercancel: finalize drag, cleanup session ----
  const handlePointerUp = useCallback((e) => {
    const session = sessionRef.current;
    if (!session || session.pointerId !== e.pointerId) return;

    // No e.preventDefault() needed — touch-action:'none' handles scrolling

    // Release capture
    const el = containerRef.current;
    if (el) {
      try { el.releasePointerCapture(e.pointerId); } catch (_) { /* already released */ }
    }

    // Clear session BEFORE callbacks to prevent race conditions
    isDraggingRef.current = false;
    sessionRef.current = null;

    // Visual reset
    mScale.set(1);
    setZIndex(10);

    // Notify parent with drop coordinates
    if (onDragEnd) onDragEnd(trash.uid, trash.category, e.clientX, e.clientY);

    // Snap back to origin
    animate(mx, 0, { type: "spring", stiffness: 300, damping: 20 });
    animate(my, 0, { type: "spring", stiffness: 300, damping: 20 });
  }, [trash.uid, trash.category, onDragEnd, mx, my, mScale]);

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: `${trash.x}%`,
        top: `${trash.y}%`,
        zIndex,
      }}
    >
      <motion.div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          x: mx,
          y: my,
          scale: mScale,
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

// ============================================================================
// Main Game Component
// ============================================================================
export default function PilahSampah({ currentGroupName, onSaveSessionScore, onClose, onGoHome, playClickSound }) {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [scatteredTrash, setScatteredTrash] = useState([]);
  const [dropAnimations, setDropAnimations] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  // Set<string> — multiple bins can shake simultaneously during multi-touch
  const [shakingBins, setShakingBins] = useState(new Set());
  const [combo, setCombo] = useState(1);
  const [floatingScores, setFloatingScores] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60);

  // ---- Multi-touch bin hover tracking ----
  // Map<uid, binName|null> — tracks which bin each actively-dragged item is hovering.
  // We derive the "any bin hovered" state from this map for visual feedback.
  const activeDragHoversRef = useRef(new Map());
  const [hoveredBins, setHoveredBins] = useState(new Set());
  
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

  // ---- Bin hit-testing (pure function, no state dependency) ----
  const checkAnyBin = useCallback((px, py) => {
    const checkIntersect = (ref) => {
      if (!ref.current) return false;
      const rect = ref.current.getBoundingClientRect();
      const margin = 60;
      return (
        px >= rect.left - margin && 
        px <= rect.right + margin && 
        py >= rect.top - margin && 
        py <= rect.bottom + margin
      );
    };

    if (checkIntersect(organikRef)) return 'Organik';
    if (checkIntersect(nonOrganikRef)) return 'Non Organik';
    if (checkIntersect(b3Ref)) return 'B3';
    return null;
  }, []);

  // ---- Multi-touch drag handler: tracks per-uid bin hover ----
  // Called by each ScatteredTrashItem during drag. Each call is independent.
  const handleDrag = useCallback((uid, px, py) => {
    const bin = checkAnyBin(px, py);
    const prevBin = activeDragHoversRef.current.get(uid);
    
    // Only update React state if the hover changed for this specific uid
    if (bin !== prevBin) {
      activeDragHoversRef.current.set(uid, bin);
      // Derive the set of all currently-hovered bins from all active drags
      const allHovered = new Set();
      for (const b of activeDragHoversRef.current.values()) {
        if (b) allHovered.add(b);
      }
      setHoveredBins(allHovered);
    }
  }, [checkAnyBin]);

  // ---- Multi-touch drag end handler ----
  // Each pointer's drop is handled independently. No shared state is mutated
  // except through React's setState batching which is safe.
  const handleDragEnd = useCallback((uid, category, dropX, dropY) => {
    // Clean up hover tracking for this uid
    activeDragHoversRef.current.delete(uid);
    const allHovered = new Set();
    for (const b of activeDragHoversRef.current.values()) {
      if (b) allHovered.add(b);
    }
    setHoveredBins(allHovered);

    const droppedBin = checkAnyBin(dropX, dropY);

    if (droppedBin === category) {
      // Benar
      playSuccessSound();
      setCombo(prevCombo => {
        const earnedScore = 10 * prevCombo;
        setScore(s => s + earnedScore);

        if (prevCombo % 10 === 0) {
          setLives(l => (l < 5 ? l + 1 : l));
        }

        const newCombo = prevCombo + 1;

        setFloatingScores(prev => [...prev, {
          id: Date.now() + Math.random(),
          x: dropX,
          y: dropY - 50,
          text: newCombo > 2 ? `+${earnedScore} COMBO x${prevCombo}!` : `+${earnedScore}`,
          isCombo: newCombo > 2
        }]);
        setTimeout(() => setFloatingScores(prev => prev.slice(1)), 1000);

        return newCombo;
      });

      setScatteredTrash(prev => {
        const droppedItem = prev.find(t => t.uid === uid);
        if (droppedItem) {
          setDropAnimations(da => [...da, {
            id: uid,
            Component: droppedItem.Component,
            category: category,
            x: dropX,
            y: dropY
          }]);
          setTimeout(() => setDropAnimations(da => da.filter(anim => anim.id !== uid)), 1000);
        }
        return prev.filter(t => t.uid !== uid);
      });
    } else if (droppedBin !== null) {
      // Salah tong
      setCombo(1);
      playRejectSound();
      // Add this bin to the shaking set (supports multiple bins shaking at once)
      setShakingBins(prev => new Set(prev).add(droppedBin));
      setTimeout(() => {
        setShakingBins(prev => {
          const next = new Set(prev);
          next.delete(droppedBin);
          return next;
        });
      }, 500);

      // Force snap back by re-mounting the item (resets motion values)
      setScatteredTrash(prev => {
        const itemToReset = prev.find(t => t.uid === uid);
        if (!itemToReset) return prev;
        const filtered = prev.filter(t => t.uid !== uid);
        // Re-add with new uid to force re-mount and reset drag offset
        setTimeout(() => {
          setScatteredTrash(p => [...p, { ...itemToReset, uid: Date.now() + Math.random() }]);
        }, 10);
        return filtered;
      });
      
      setLives(l => {
        const newLives = l - 1;
        if (newLives <= 0) setGameOver(true);
        return newLives;
      });
    }
    // If dropped on grass (droppedBin === null), the snap-back animation
    // in ScatteredTrashItem handles returning to original position.
  }, [checkAnyBin, playSuccessSound, playRejectSound]);

  // Clean up all drag sessions on game reset
  const handleGameReset = useCallback(() => {
    activeDragHoversRef.current.clear();
    setHoveredBins(new Set());
    setShakingBins(new Set());
    hasSavedRef.current = false;
    setScore(0);
    setLives(5);
    setScatteredTrash([]);
    setTimeLeft(60);
    setCombo(1);
    setGameOver(false);
  }, []);

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
            animate={shakingBins.has('Organik') ? { x: [-10, 10, -10, 10, -5, 5, 0] } : hoveredBins.has('Organik') ? { scale: 1.15 } : { x: 0, scale: 1 }}
            transition={{ duration: shakingBins.has('Organik') ? 0.4 : 0.2 }}
          >
            <img src="/assets/images/Sampah Organik.png" alt="Organik" className="w-32 h-40 md:w-48 md:h-60 short:w-20 short:h-28 object-contain drop-shadow-[0_20px_15px_rgba(0,0,0,0.5)]" />
            <span className="mt-4 short:mt-1 px-4 py-2 short:px-2 short:py-1 bg-black/60 backdrop-blur-sm text-white font-bubbly text-xl md:text-2xl short:text-base rounded-xl border-2 border-white/30 whitespace-nowrap drop-shadow-md">Organik</span>
          </motion.div>
          {/* Non Organik Bin */}
          <motion.div 
            ref={nonOrganikRef} 
            className="flex flex-col items-center"
            animate={shakingBins.has('Non Organik') ? { x: [-10, 10, -10, 10, -5, 5, 0] } : hoveredBins.has('Non Organik') ? { scale: 1.15 } : { x: 0, scale: 1 }}
            transition={{ duration: shakingBins.has('Non Organik') ? 0.4 : 0.2 }}
          >
            <img src="/assets/images/Sampah Non Organik.png" alt="Non Organik" className="w-32 h-40 md:w-48 md:h-60 short:w-20 short:h-28 object-contain drop-shadow-[0_20px_15px_rgba(0,0,0,0.5)]" />
            <span className="mt-4 short:mt-1 px-4 py-2 short:px-2 short:py-1 bg-black/60 backdrop-blur-sm text-white font-bubbly text-xl md:text-2xl short:text-base rounded-xl border-2 border-white/30 whitespace-nowrap drop-shadow-md">Non Organik</span>
          </motion.div>
          {/* B3 Bin */}
          <motion.div 
            ref={b3Ref} 
            className="flex flex-col items-center"
            animate={shakingBins.has('B3') ? { x: [-10, 10, -10, 10, -5, 5, 0] } : hoveredBins.has('B3') ? { scale: 1.15 } : { x: 0, scale: 1 }}
            transition={{ duration: shakingBins.has('B3') ? 0.4 : 0.2 }}
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
                handleGameReset();
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
