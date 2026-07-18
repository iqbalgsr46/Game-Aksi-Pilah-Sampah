import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function GroupRegistration({ groups, onAddGroup, onRemoveGroup, onResetTurns, onStartTurn, onClose, playClickSound }) {
  const [inputValue, setInputValue] = useState('');

  const handleAddGroup = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    if (playClickSound) playClickSound();
    
    // Cegah nama ganda
    if (groups.some(g => g.name.toLowerCase() === inputValue.trim().toLowerCase())) {
      alert("Nama kelompok ini sudah ada!");
      return;
    }

    onAddGroup(inputValue.trim());
    setInputValue('');
  };

  const handleRemoveGroup = (name) => {
    if (playClickSound) playClickSound();
    onRemoveGroup(name);
  };

  return (
    <div 
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-black/65 backdrop-blur-md select-none"
      style={{ fontFamily: "'Plus Jakarta Sans', 'Blue Water', sans-serif" }}
    >
      
      {/* Decorative Title */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring" }}
        className="absolute top-10"
      >
        <h1 className="text-5xl md:text-7xl text-white font-bubbly drop-shadow-lg text-center" style={{ WebkitTextStroke: '2px #064e3b' }}>
          Daftar Kelompok
        </h1>
      </motion.div>

      <div className="relative z-10 w-11/12 max-w-5xl h-[70vh] bg-white/90 backdrop-blur-md rounded-3xl p-6 md:p-10 shadow-2xl border-4 border-emerald-200 flex flex-col md:flex-row gap-8">
        
        {/* Kolom Kiri: Form Tambah */}
        <div className="flex-1 flex flex-col">
          <h2 className="text-3xl text-emerald-800 font-bubbly mb-6">Tambah Kelompok Baru</h2>
          <form onSubmit={handleAddGroup} className="flex flex-col gap-4">
            <input 
              type="text" 
              placeholder="Ketik nama kelompok..." 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl border-4 border-emerald-300 text-xl md:text-2xl font-medium text-gray-700 placeholder:text-gray-400 placeholder:text-lg md:placeholder:text-xl focus:outline-none focus:border-emerald-500 shadow-inner transition-colors"
              maxLength={15}
              autoFocus
            />
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full py-4 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-2xl border-4 border-white/50 text-white font-bubbly text-3xl shadow-[0_6px_0_rgba(6,78,59,0.8)]"
            >
              Tambah
            </motion.button>
          </form>        </div>

        {/* Kolom Kanan: Daftar Kelompok & Tombol Main */}
        <div className="flex-[1.5] flex flex-col bg-emerald-50/80 rounded-2xl p-6 border-2 border-emerald-200">
          <div className="flex justify-between items-center mb-4 border-b-2 border-emerald-200 pb-2">
            <h2 className="text-3xl text-emerald-800 font-bubbly">Siapa yang mau main?</h2>
            {groups.some(g => g.hasPlayed) && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { if(playClickSound) playClickSound(); onResetTurns(); }}
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bubbly text-lg rounded-xl shadow-md"
              >
                Reset Giliran
              </motion.button>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-3 scrollbar-thin scrollbar-thumb-emerald-400">
            {groups.length === 0 ? (
              <div className="h-full flex items-center justify-center text-center">
                <p className="text-2xl text-emerald-600/60 font-bubbly">Belum ada kelompok yang terdaftar.<br/>Ayo daftarkan di sebelah kiri!</p>
              </div>
            ) : (
              groups.map((group, index) => (
                <motion.div 
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  key={index}
                  className={`flex items-center justify-between p-4 rounded-xl shadow-sm border-2 group transition-all ${
                    group.hasPlayed ? 'bg-gray-100 border-gray-200 opacity-75' : 'bg-white border-emerald-100'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-gray-700 uppercase tracking-wide">{group.name}</span>
                    {group.hasPlayed && (
                      <span className="text-sm font-bold text-emerald-600 uppercase">Sudah Main (Skor: {group.score})</span>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleRemoveGroup(group.name)}
                      className="px-4 py-2 bg-red-100 text-red-600 rounded-lg font-bold hover:bg-red-200"
                    >
                      X
                    </button>
                    {!group.hasPlayed ? (
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onStartTurn(group.name)}
                        className="px-6 py-2 bg-gradient-to-b from-blue-400 to-blue-600 text-white font-bubbly text-xl rounded-xl shadow-[0_4px_0_rgba(30,58,138,0.5)]"
                      >
                        MAIN
                      </motion.button>
                    ) : (
                      <div className="px-4 py-2 bg-gray-300 text-gray-600 font-bubbly text-lg rounded-xl border border-gray-400">
                        SELESAI
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

      </div>

      <div className="absolute top-6 left-6 z-20">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { if(playClickSound) playClickSound(); onClose(); }}
          className="px-6 py-3 bg-gradient-to-b from-red-400 to-red-600 rounded-2xl border-4 border-white/50 text-white font-bubbly text-2xl shadow-[0_6px_0_rgba(153,27,27,0.8)]"
        >
          Kembali
        </motion.button>
      </div>
    </div>
  );
}
