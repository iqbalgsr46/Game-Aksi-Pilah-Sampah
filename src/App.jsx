import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import MainMenu from './components/MainMenu';
import MenuMode from './components/MenuMode';
import IntroCutscene from './components/IntroCutscene';
import CariSampah from './components/CariSampah';
import PilahSampah from './components/PilahSampah';
import TangkapSampah from './components/TangkapSampah';
import Leaderboard from './components/Leaderboard';
import GroupRegistration from './components/GroupRegistration';
import PortalPage from './components/PortalPage';
import OrientationOverlay from './components/OrientationOverlay';

function App() {
  const [gameState, setGameState] = useState('PORTAL'); // PORTAL, START, INTRO_CUTSCENE, MODE_SELECTION, PLAYING, GAMEOVER, LEADERBOARD, GROUP_REGISTRATION
  const [previousGameState, setPreviousGameState] = useState(null);
  const [selectedMode, setSelectedMode] = useState(null); // 'PILAH', 'CARI', 'TANGKAP'
  const [currentGroupName, setCurrentGroupName] = useState('');
  const [sessionGroups, setSessionGroups] = useState([]); // { name, hasPlayed, score }
  const [isMuted, setIsMuted] = useState(false);
  const bgmRef = useRef(null);
  const audioCtxRef = useRef(null);

  // Menangani pemutaran audio
  useEffect(() => {
    if (bgmRef.current) {
      bgmRef.current.volume = 0.4; // Volume tidak terlalu keras
      if (isMuted || gameState === 'INTRO_CUTSCENE' || gameState === 'PORTAL') {
        bgmRef.current.pause();
      } else {
        const playPromise = bgmRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((e) => console.log("Autoplay diblokir oleh browser sampai user berinteraksi."));
        }
      }
    }
  }, [isMuted, gameState]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Suara klik tanpa delay menggunakan Web Audio API
  const playClickSound = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.type = 'sine';
      // Nada pop (menggelembung) yang naik cepat
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.05);
      
      // Durasi sangat singkat (0.08 detik) agar responsif
      gainNode.gain.setValueAtTime(1.0, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {
      console.log("Audio API Error:", e);
    }
  };

  const handleStartGame = () => {
    playClickSound();
    setGameState('INTRO_CUTSCENE');
  };

  const handleSelectMode = (mode) => {
    playClickSound();
    console.log("Mode selected:", mode);
    setSelectedMode(mode);
    setGameState('GROUP_REGISTRATION');
  };

  const handleOpenLeaderboard = () => {
    playClickSound();
    setPreviousGameState(gameState);
    setGameState('LEADERBOARD');
  };

  const handleSaveSessionScore = (groupName, score) => {
    setSessionGroups(prev => prev.map(g => g.name === groupName ? { ...g, hasPlayed: true, score } : g));
  };

  const handleResetSessionTurns = () => {
    setSessionGroups(prev => prev.map(g => ({ ...g, hasPlayed: false, score: 0 })));
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-black" onClick={() => { if(!isMuted && bgmRef.current && gameState !== 'PORTAL' && gameState !== 'INTRO_CUTSCENE') bgmRef.current.play(); }}>
      {/* Layar Peringatan Putar HP (Hanya muncul jika HP dalam posisi portrait) */}
      <OrientationOverlay />

      {/* Global Audio Elements */}
      <audio 
        ref={bgmRef} 
        src={gameState === 'PLAYING' ? "/assets/audio/The_Cleanest_Sweep (1).mp3" : "/assets/audio/Inventory_Management.mp3"} 
        loop 
      />

      {/* Area Transisi Mulus Portal <-> Main Menu */}
      <AnimatePresence mode="wait">
        {gameState === 'PORTAL' && (
          <motion.div 
            key="portal" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0, scale: 1.05 }} 
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute inset-0 z-50 bg-[#f4f4f4]"
          >
            <PortalPage onRunGame={() => setGameState('START')} />
          </motion.div>
        )}

        {gameState === 'START' && (
          <motion.div 
            key="start"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 z-40"
          >
            <MainMenu 
              onStartGame={handleStartGame} 
              onOpenLeaderboard={handleOpenLeaderboard}
              onExit={() => {
                setGameState('PORTAL');
                try {
                  if (document.fullscreenElement && document.exitFullscreen) {
                    document.exitFullscreen().catch(err => console.log(err));
                  }
                } catch (e) {}
              }}
              isMuted={isMuted}
              onToggleMute={toggleMute}
              playClickSound={playClickSound}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {gameState === 'INTRO_CUTSCENE' && (
        <IntroCutscene onComplete={() => setGameState('MODE_SELECTION')} />
      )}
      
      {(gameState === 'MODE_SELECTION' || gameState === 'GROUP_REGISTRATION') && (
        <MenuMode 
          onSelectMode={handleSelectMode} 
          onClose={() => { playClickSound(); setGameState('START'); }} 
          onOpenLeaderboard={handleOpenLeaderboard}
          isMuted={isMuted}
          onToggleMute={toggleMute}
          playClickSound={playClickSound}
        />
      )}

      {gameState === 'LEADERBOARD' && (
        <Leaderboard 
          onClose={() => { playClickSound(); setGameState(previousGameState || 'START'); }}
          playClickSound={playClickSound}
        />
      )}

      {gameState === 'GROUP_REGISTRATION' && (
        <GroupRegistration
          groups={sessionGroups}
          onAddGroup={(name) => setSessionGroups([...sessionGroups, { name, hasPlayed: false, score: 0 }])}
          onRemoveGroup={(name) => setSessionGroups(sessionGroups.filter(g => g.name !== name))}
          onResetTurns={handleResetSessionTurns}
          onStartTurn={(name) => {
            playClickSound();
            setCurrentGroupName(name);
            setGameState('PLAYING');
          }}
          onClose={() => { playClickSound(); setGameState('MODE_SELECTION'); }}
          playClickSound={playClickSound}
        />
      )}

      {gameState === 'PLAYING' && selectedMode === 'CARI' && (
        <CariSampah 
          currentGroupName={currentGroupName}
          onSaveSessionScore={handleSaveSessionScore}
          onClose={() => { playClickSound(); setGameState('GROUP_REGISTRATION'); }}
          onGoHome={() => { playClickSound(); setGameState('MODE_SELECTION'); }}
          playClickSound={playClickSound}
        />
      )}

      {gameState === 'PLAYING' && selectedMode === 'PILAH' && (
        <PilahSampah 
          currentGroupName={currentGroupName}
          onSaveSessionScore={handleSaveSessionScore}
          onClose={() => { playClickSound(); setGameState('GROUP_REGISTRATION'); }}
          onGoHome={() => { playClickSound(); setGameState('MODE_SELECTION'); }}
          playClickSound={playClickSound}
        />
      )}

      {gameState === 'PLAYING' && selectedMode === 'TANGKAP' && (
        <TangkapSampah 
          currentGroupName={currentGroupName}
          onSaveSessionScore={handleSaveSessionScore}
          onClose={() => { playClickSound(); setGameState('GROUP_REGISTRATION'); }}
          onGoHome={() => { playClickSound(); setGameState('MODE_SELECTION'); }}
          playClickSound={playClickSound}
        />
      )}

      {gameState === 'PLAYING' && selectedMode !== 'CARI' && selectedMode !== 'PILAH' && selectedMode !== 'TANGKAP' && (
        <div className="flex items-center justify-center w-full h-full text-white text-3xl font-bubbly relative z-10">
          <p>Game Arena ({selectedMode} - Coming Soon)</p>
          <button onClick={() => { playClickSound(); setGameState('MODE_SELECTION'); }} className="absolute top-10 left-10 p-4 bg-red-500 rounded-xl">Kembali</button>
        </div>
      )}

      {gameState === 'GAMEOVER' && (
        <div className="flex items-center justify-center w-full h-full text-white text-3xl font-bubbly relative z-10">
          <p>Game Over</p>
          <button onClick={() => { playClickSound(); setGameState('START'); }} className="absolute top-10 left-10 p-4 bg-red-500 rounded-xl">Ke Menu Utama</button>
        </div>
      )}
    </div>
  );
}

export default App;
