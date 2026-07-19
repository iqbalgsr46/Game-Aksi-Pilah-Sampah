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
import GamingPage from './components/GamingPage';
import OrientationOverlay from './components/OrientationOverlay';

function App() {
  const [gameState, setGameState] = useState('PORTAL'); // PORTAL, START, INTRO_CUTSCENE, MODE_SELECTION, PLAYING, GAMEOVER, LEADERBOARD, GROUP_REGISTRATION
  const [previousGameState, setPreviousGameState] = useState(null);
  const [selectedMode, setSelectedMode] = useState(null); // 'PILAH', 'CARI', 'TANGKAP'
  const [currentGroupName, setCurrentGroupName] = useState('');
  const [sessionGroups, setSessionGroups] = useState([]); // { name, hasPlayed, score }
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const bgmRef = useRef(null);
  const audioCtxRef = useRef(null);

  // Track fullscreen state changes (e.g. if user presses ESC)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    playClickSound();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Menangani pemutaran audio
  useEffect(() => {
    if (bgmRef.current) {
      bgmRef.current.volume = 1.0; // Volume maksimal
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
      gainNode.gain.setValueAtTime(2.5, ctx.currentTime);
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
        src={gameState === 'PLAYING' ? "/assets/audio/The_Cleanest_Sweep (1).mp3" : "/assets/audio/Sundial_on_the_Terrace.mp3"} 
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
            className="absolute inset-0 z-50 bg-[#202020]"
          >
            <PortalPage onRunGame={() => setGameState('START')} onOpenGaming={() => setGameState('GAMING')} />
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
        
        {gameState === 'GAMING' && (
          <motion.div 
            key="gaming"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-50 bg-[#1b1d22]"
          >
            <GamingPage 
              onClose={() => setGameState('PORTAL')} 
              onRunGame={() => setGameState('START')} 
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

      {/* Global Fullscreen Toggle Button - Pojok Kiri Bawah */}
      {gameState !== 'PORTAL' && (
        <div className="absolute bottom-6 left-6 short:bottom-3 short:left-3 z-[100]">
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? "Keluar Layar Penuh" : "Layar Penuh"}
            className="relative overflow-hidden w-12 h-12 md:w-14 md:h-14 short:w-10 short:h-10 bg-gradient-to-b from-green-400/50 to-green-600/60 backdrop-blur-md rounded-2xl border-[3px] border-white/70 flex items-center justify-center shadow-[0_4px_0_rgba(22,101,52,0.4),inset_0_4px_8px_rgba(255,255,255,0.4)] cursor-pointer group hover:scale-105 active:scale-95 transition-all"
          >
            <div className="absolute top-1 left-2 w-2 h-2 md:w-3 md:h-3 short:w-1.5 short:h-1.5 bg-white/80 rounded-full blur-[0.5px]"></div>
            {isFullscreen ? (
              <svg className="w-6 h-6 md:w-7 md:h-7 short:w-5 short:h-5 text-white drop-shadow-md group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="8 3 8 8 3 8"></polyline>
                <polyline points="16 3 16 8 21 8"></polyline>
                <polyline points="8 21 8 16 3 16"></polyline>
                <polyline points="16 21 16 16 21 16"></polyline>
              </svg>
            ) : (
              <svg className="w-6 h-6 md:w-7 md:h-7 short:w-5 short:h-5 text-white drop-shadow-md group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 3 21 3 21 9"></polyline>
                <polyline points="9 21 3 21 3 15"></polyline>
                <line x1="21" y1="3" x2="14" y2="10"></line>
                <line x1="3" y1="21" x2="10" y2="14"></line>
              </svg>
            )}
          </button>
        </div>
      )}

    </div>
  );
}

export default App;
