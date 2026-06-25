import React, { useState, useEffect } from 'react';
import { Exercise, GameState } from '../types';
import {
  Swords, Trophy, Target, Sparkles, Check, Play, Zap, Plus, Settings,
  Droplet, Flame, Shield, Heart, Brain, Edit2, RotateCcw, Award, Star,
  AlertTriangle, FlameKindling, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { OATH_OPTIONS } from '../App';
import { ExerciseIcon } from './ExerciseIcon';

interface HomeTabProps {
  gameState: GameState;
  exercises: Exercise[];
  onStartExercise: (id: string) => void;
  scaledTarget: (ex: Exercise) => number;
  onUpdateGameState: (newState: GameState) => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  gameState,
  exercises,
  onStartExercise,
  scaledTarget,
  onUpdateGameState,
}) => {
  // Gracefully handle undefined fields from gameState
  const level = gameState.level;
  const xp = gameState.xp;
  const streak = gameState.streak;
  const str = gameState.str || 10;
  const agi = gameState.agi || 10;
  const sta = gameState.sta || 10;
  const int = gameState.int || 10;
  const waterIntake = gameState.waterIntake !== undefined ? gameState.waterIntake : 0;
  const waterGoal = gameState.waterGoal || 2000;
  const charClass = gameState.charClass || 'Caçador';
  const charName = gameState.charName || 'Mcfly';
  const statPoints = gameState.statPoints || 0;

  // Local settings toggle state
  const [showSettings, setShowSettings] = useState(false);
  const [tempName, setTempName] = useState(charName);
  const [selectedClass, setSelectedClass] = useState(charClass);

  const completedCount = gameState.completedToday.length;
  const totalCount = exercises.length;
  const percentCompleted = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const activeQuests = exercises.filter((e) => !gameState.completedToday.includes(e.id));
  const completedQuests = exercises.filter((e) => gameState.completedToday.includes(e.id));

  // HP and Mana dynamic calculation
  // Starts at 50% HP and goes up 15% with each quest completed
  const currentHP = Math.min(100, 50 + completedCount * 15);
  // Starts at 40% MP and goes up 20% with each quest completed
  const currentMP = Math.min(100, 40 + completedCount * 20);
  const currentHydration = Math.min(100, Math.round((waterIntake / waterGoal) * 100));

  // Power Level and Rank calculation
  // Power Level = STR * 2 + STA * 2 + AGI * 3 + INT * 2
  const totalPower = str * 2 + sta * 2 + agi * 3 + int * 2;
  
  const getRank = (power: number) => {
    if (power < 100) return { name: 'E-RANK', badge: 'E', color: 'text-slate-400 border-slate-500 bg-slate-950/40' };
    if (power < 150) return { name: 'D-RANK', badge: 'D', color: 'text-emerald-400 border-emerald-500 bg-emerald-950/40' };
    if (power < 220) return { name: 'C-RANK', badge: 'C', color: 'text-blue-400 border-blue-500 bg-blue-950/40' };
    if (power < 300) return { name: 'B-RANK', badge: 'B', color: 'text-purple-400 border-purple-500 bg-purple-950/40' };
    if (power < 400) return { name: 'A-RANK', badge: 'A', color: 'text-red-400 border-red-500 bg-red-950/40' };
    return { name: 'S-RANK', badge: 'S', color: 'text-amber-400 border-amber-500 bg-amber-950/40 animate-pulse font-black' };
  };

  const rank = getRank(totalPower);
  const activeOath = OATH_OPTIONS.find((opt) => opt.id === gameState.chosenOath);

  // Live Timer till Midnight
  const [countdown, setCountdown] = useState('06:00:00');

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(23, 59, 59, 999);
      const diff = midnight.getTime() - now.getTime();
      if (diff <= 0) {
        setCountdown('00:00:00');
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setCountdown(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      );
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  // Spend Stat Point function
  const spendStatPoint = (attribute: 'str' | 'agi' | 'sta' | 'int') => {
    if (statPoints <= 0) return;
    
    const updatedState = { ...gameState };
    updatedState.statPoints = (updatedState.statPoints || 0) - 1;
    
    if (attribute === 'str') updatedState.str = (updatedState.str || 10) + 1;
    else if (attribute === 'agi') updatedState.agi = (updatedState.agi || 10) + 1;
    else if (attribute === 'sta') updatedState.sta = (updatedState.sta || 10) + 1;
    else if (attribute === 'int') updatedState.int = (updatedState.int || 10) + 1;

    onUpdateGameState(updatedState);
  };

  // Add water log function
  const addWater = (amount: number) => {
    const updatedState = { ...gameState };
    const prevIntake = updatedState.waterIntake !== undefined ? updatedState.waterIntake : 0;
    updatedState.waterIntake = prevIntake + amount;
    onUpdateGameState(updatedState);
  };

  const resetWater = () => {
    const updatedState = { ...gameState };
    updatedState.waterIntake = 0;
    onUpdateGameState(updatedState);
  };

  const saveSettings = () => {
    const updatedState = { ...gameState };
    updatedState.charName = tempName.trim() || 'Mcfly';
    updatedState.charClass = selectedClass;
    onUpdateGameState(updatedState);
    setShowSettings(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2.5 * 1024 * 1024) {
      alert("A imagem selecionada é muito grande! Escolha uma imagem menor que 2.5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      const updatedState = { ...gameState, profilePic: base64String };
      onUpdateGameState(updatedState);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6 pb-12 cyber-grid min-h-screen">
      {/* Hidden file input for gallery upload */}
      <input
        type="file"
        id="profile-pic-input"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* 1. TOP STATS BAR - SOLO LEVELING HUD PORTRAIT FRAME */}
      <div className="mx-4 mt-4 bg-gradient-to-b from-[#050508] to-[#000000] border border-slate-900 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        {/* Glow behind Avatar */}
        <div className="absolute top-0 left-0 w-36 h-36 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col items-center justify-center text-center pb-5">
          {/* Avatar / Portrait container in a sleek rounded rectangle with double-line neon blue border */}
          <div className="relative mb-3 group cursor-pointer" onClick={() => document.getElementById('profile-pic-input')?.click()}>
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 border-2 border-sky-400 p-0.5 shadow-[0_0_20px_rgba(14,165,233,0.35)] relative overflow-hidden flex items-center justify-center">
              {gameState.profilePic ? (
                <img src={gameState.profilePic} alt="Portrait" className="w-full h-full object-cover rounded-xl" referrerPolicy="no-referrer" />
              ) : (
                <span className="select-none text-4xl filter drop-shadow-[0_2px_8px_rgba(14,165,233,0.5)]">👤</span>
              )}
              {/* Hover Edit Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl">
                <Edit2 className="w-4 h-4 text-white" />
              </div>
            </div>
            
            {/* Level Badge placed at bottom corner */}
            <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-white text-black border border-slate-950 flex items-center justify-center font-mono font-black text-xs shadow-lg">
              {level}
            </div>
          </div>

          {/* Name Display */}
          <h2 className="text-xl font-extrabold text-white tracking-widest flex items-center gap-2 leading-none">
            {charName ? charName.toUpperCase() : 'JUNG SINWOO'}
            <button 
              onClick={() => {
                setTempName(charName);
                setSelectedClass(charClass);
                setShowSettings(!showSettings);
              }}
              className="text-slate-500 hover:text-white transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          </h2>
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-1 block font-bold">
            @{charName ? charName.toLowerCase().replace(/\s+/g, '') : 'jungsinwoo'}
          </span>
        </div>

        {/* Inline settings editor panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-5 p-4 rounded-2xl bg-slate-950/95 border border-sky-500/30 space-y-4 overflow-hidden shadow-[0_0_20px_rgba(14,165,233,0.1)]"
            >
              <div>
                <label className="block text-[10px] font-mono font-extrabold tracking-widest text-slate-400 uppercase mb-1.5">
                  Nome do Caçador
                </label>
                <input
                  type="text"
                  maxLength={16}
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500 font-bold"
                  placeholder="Seu nome"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-extrabold tracking-widest text-slate-400 uppercase mb-1.5">
                  Selecione sua Classe de RPG
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Caçador', 'Arqueiro', 'Guerreiro', 'Mago', 'Assassino'].map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedClass(c)}
                      className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                        selectedClass === c
                          ? 'bg-sky-950/40 border-sky-500 text-sky-300'
                          : 'bg-slate-900 border-slate-800/80 text-slate-400 hover:text-white'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-extrabold tracking-widest text-slate-400 uppercase mb-1.5">
                  Foto de Perfil (Galeria)
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => document.getElementById('profile-pic-input')?.click()}
                    className="flex-1 py-2 bg-black hover:bg-slate-900 border border-slate-800 rounded-xl text-xs text-sky-400 hover:text-sky-300 transition-all font-bold uppercase tracking-wider"
                  >
                    Selecionar da Galeria
                  </button>
                  {gameState.profilePic && (
                    <button
                      type="button"
                      onClick={() => {
                        const updatedState = { ...gameState };
                        delete updatedState.profilePic;
                        onUpdateGameState(updatedState);
                      }}
                      className="px-4 py-2 bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 rounded-xl text-xs text-red-400 hover:text-red-300 transition-all font-bold"
                    >
                      Remover Foto
                    </button>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={saveSettings}
                  className="flex-1 py-2 bg-white hover:bg-slate-200 text-black text-xs font-black uppercase tracking-wider rounded-xl transition-all"
                >
                  Salvar Alterações
                </button>
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-xs text-slate-400 hover:text-white rounded-xl transition-all"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* HP, Mana & Hydration bars exactly styled as Solo Leveling HUD */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* HP Bar */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10px] font-mono">
              <span className="font-bold text-red-500 flex items-center gap-1.5 uppercase tracking-wider">
                <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                HP (VIGOR)
              </span>
              <span className="font-black text-slate-300">{currentHP}%</span>
            </div>
            <div className="w-full h-3 bg-slate-950 border border-slate-900 rounded-md p-[1px] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${currentHP}%` }}
                className="h-full bg-gradient-to-r from-red-600 to-rose-500 rounded-sm shadow-[0_0_8px_rgba(239,68,68,0.4)]"
              />
            </div>
          </div>

          {/* MP Bar */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10px] font-mono">
              <span className="font-bold text-sky-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5 fill-sky-400 text-sky-400" />
                MP (ENERGIA)
              </span>
              <span className="font-black text-slate-300">{currentMP}%</span>
            </div>
            <div className="w-full h-3 bg-slate-950 border border-slate-900 rounded-md p-[1px] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${currentMP}%` }}
                className="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-sm shadow-[0_0_8px_rgba(14,165,233,0.4)]"
              />
            </div>
          </div>
        </div>

        {/* S-Rank circle dial system */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-slate-900/60">
          {/* Stat 1: RANK Dial */}
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-black border-2 border-sky-400 flex items-center justify-center relative shadow-[0_0_12px_rgba(14,165,233,0.25)]">
              <span className="text-xl font-black text-white font-mono tracking-tighter">
                {rank.badge}
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase mt-2">Rank</span>
          </div>

          {/* Stat 2: LEVEL Dial */}
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-[#050508] border border-dashed border-sky-400/60 flex items-center justify-center relative shadow-[0_0_10px_rgba(14,165,233,0.15)]">
              <span className="text-lg font-black text-white font-mono">
                {level}
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase mt-2">Nível</span>
          </div>

          {/* Stat 3: Workouts Completed Dial */}
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-[#050508] border border-dashed border-sky-400/60 flex items-center justify-center relative shadow-[0_0_10px_rgba(14,165,233,0.15)]">
              <span className="text-base font-black text-white font-mono">
                {completedCount}
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase mt-2">Treinos</span>
          </div>
        </div>

        {/* Character Information Sheets List Card */}
        <div className="bg-black/40 border border-slate-900/80 rounded-2xl p-4.5 mt-5 space-y-3 font-mono text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-slate-900/40">
            <span className="text-slate-500">Classe:</span>
            <span className="text-white font-extrabold">{charClass}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-slate-900/40">
            <span className="text-slate-500">Título:</span>
            <span className="text-sky-400 font-extrabold uppercase tracking-wider">
              {level >= 20 ? 'CAÇADOR DE MONSTROS' : level >= 8 ? 'SOBREVIVENTE' : 'JOGADOR'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">ID:</span>
            <span className="text-slate-600 tracking-widest text-[9px] font-black">■■■■■■■■■</span>
          </div>
        </div>
      </div>

      {/* 3. QUEST INFO NEON CONTAINER - EXACTLY COMPLYING WITH IMAGE 2 AND IMAGE 5 CODES */}
      <div className="mx-4 bg-black border-2 border-sky-400 rounded-3xl p-6 shadow-[0_0_25px_rgba(14,165,233,0.3)] relative overflow-hidden">
        {/* Neon blue radial pulse background */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Quest Info Header Tag */}
        <div className="flex items-center justify-between mb-4 border-b border-slate-900 pb-3">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-sky-400 animate-pulse" />
            <span className="text-sm font-black tracking-widest text-white uppercase font-display">
              QUEST INFO
            </span>
          </div>
          {/* Live countdown timer ticks down to midnight exactly as references show */}
          <div className="font-mono text-xs font-black text-sky-400 bg-sky-950/20 border border-sky-500/20 rounded px-2.5 py-1 tracking-wider">
            {countdown}
          </div>
        </div>

        {/* Quest Arc title in display typography */}
        <h3 className="text-base font-black text-white tracking-widest uppercase font-mono">
          Treino de Sung Jinwoo
        </h3>
        <p className="text-[10px] text-slate-500 font-mono mt-1 mb-5 uppercase tracking-wide">
          SISTEMA ATIVO DIÁRIO DE ATIVIDADES
        </p>

        {/* Quest Items List - Interactive click to start */}
        <div className="space-y-2.5 my-4 font-mono text-xs">
          {exercises.map((ex) => {
            const isCompleted = gameState.completedToday.includes(ex.id);
            const target = scaledTarget(ex);
            return (
              <div
                key={ex.id}
                onClick={() => !isCompleted && onStartExercise(ex.id)}
                className={`flex items-center justify-between py-2 px-3 border transition-all cursor-pointer rounded-lg ${
                  isCompleted
                    ? 'bg-emerald-950/10 border-emerald-500/10 opacity-40'
                    : 'bg-[#07070a] border-slate-900 hover:border-sky-500/40 hover:bg-slate-950'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ExerciseIcon pose={ex.pose} size="sm" />
                  <span className={`font-black tracking-wider ${isCompleted ? 'text-slate-500 line-through' : 'text-white'}`}>
                    {ex.name.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`font-mono text-[11px] ${isCompleted ? 'text-emerald-500' : 'text-sky-400'}`}>
                    [{isCompleted ? target : 0}/{target}]
                  </span>
                  {!isCompleted && (
                    <button className="w-5 h-5 rounded bg-sky-950 flex items-center justify-center text-sky-400 border border-sky-500/20 hover:bg-sky-500 hover:text-black hover:border-sky-500 transition-all">
                      <Play className="w-2.5 h-2.5 fill-current" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Red Warning Box from Sung Jinwoo quest interface - MATCHES SCREENSHOT EXACTLY */}
        <div className="my-5 p-4 rounded-xl bg-red-950/15 border border-red-500/25 flex gap-2.5 items-start">
          <AlertTriangle className="w-4.5 h-4.5 text-red-500 shrink-0 mt-0.5 animate-pulse" />
          <p className="text-[10px] leading-relaxed text-red-400 font-semibold font-mono uppercase tracking-wider">
            AVISO - O não cumprimento desta quest dentro do limite de tempo resultará em penalidade apropriada.
          </p>
        </div>

        {/* Big high-contrast action button */}
        {activeQuests.length > 0 ? (
          <button
            onClick={() => onStartExercise(activeQuests[0].id)}
            className="w-full py-4 bg-white hover:bg-slate-200 text-black font-black font-display text-xs tracking-widest uppercase rounded-xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.25)] active:scale-98 flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-current text-black" />
            Iniciar Quest
          </button>
        ) : (
          <div className="w-full py-3.5 bg-emerald-950/20 border border-emerald-500/30 text-emerald-400 font-bold text-center rounded-xl text-xs uppercase tracking-wider font-mono">
            ✓ QUEST COMPLETA COM SUCESSO
          </div>
        )}
      </div>

      {/* 1.5. ACTIVE OATH / PACT FROM THE GAME MASTER */}
      {activeOath && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 bg-gradient-to-r from-amber-950/20 via-amber-900/10 to-transparent border border-amber-500/20 rounded-2xl p-4 shadow-lg relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center gap-2 text-amber-500 mb-2 border-b border-amber-500/10 pb-2">
            <span className="text-lg">{activeOath.icon}</span>
            <div className="flex-1 flex justify-between items-center">
              <span className="text-[10px] font-mono font-black tracking-widest uppercase">
                JURAMENTO: {activeOath.title.toUpperCase()}
              </span>
              <span className="text-[8px] px-1.5 py-0.5 rounded-md font-mono font-bold bg-amber-500/10 text-amber-400">
                {activeOath.effect.toUpperCase()}
              </span>
            </div>
          </div>
          
          <p className="text-[10.5px] text-slate-300 leading-relaxed italic font-medium">
            "{activeOath.quote}"
          </p>
        </motion.div>
      )}

      {/* 2. DYNAMIC POWER LEVEL RATING RAMP - SOLO LEVELING TOTAL COMBAT RATING */}
      <div className="mx-4 bg-gradient-to-r from-[#07060a] via-[#0d0a14] to-[#07060a] border border-slate-900 rounded-2xl p-4 flex items-center justify-between shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 w-24 h-24 bg-purple-500/5 rounded-full blur-xl pointer-events-none" />
        <div className="space-y-0.5">
          <span className="text-[10px] font-mono font-extrabold tracking-widest text-purple-400 uppercase">PODER TOTAL DO CAÇADOR</span>
          <p className="text-xs text-slate-400 font-medium">Desenvolva seus status treinando diariamente</p>
        </div>
        <div className="text-right">
          <motion.div
            key={totalPower}
            initial={{ scale: 0.95 }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.3 }}
            className="text-4xl font-extrabold font-display bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(245,158,11,0.25)] tracking-tight font-mono leading-none"
          >
            {totalPower}
          </motion.div>
          <span className="text-[9px] font-mono font-extrabold text-amber-500 tracking-wider">PODER DE COMBATE</span>
        </div>
      </div>

      {/* 5. CONTROLE DE HIDRATAÇÃO (ÁGUA) */}
      <div className="mx-4 bg-[#07060a] border border-slate-900 rounded-3xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono tracking-wider font-extrabold text-sky-400 uppercase block">META DIÁRIA</span>
            <h3 className="text-base font-black text-white font-display">Controle de Hidratação</h3>
          </div>
          <span className="text-base font-mono font-black text-sky-400">
            {waterIntake} <span className="text-slate-500 text-xs">/ {waterGoal} ml</span>
          </span>
        </div>

        {/* Alerta de hidratação */}
        <div className={`p-4 rounded-2xl flex items-center justify-between border transition-all duration-300 ${
          waterIntake >= waterGoal
            ? 'bg-sky-950/20 border-sky-500/30 text-sky-300'
            : 'bg-slate-950/50 border-slate-900 text-slate-400'
        }`}>
          <div className="space-y-1 max-w-[200px]">
            <span className="text-xs font-bold text-white block">
              {waterIntake >= waterGoal ? '🎉 Hidratação Concluída!' : 'Mantenha sua hidratação!'}
            </span>
            <span className="text-[10.5px] leading-snug block text-slate-400">
              {waterIntake >= waterGoal 
                ? 'Excelente! Seu guerreiro está pronto com hidratação de 100%.'
                : 'Beba água regularmente para manter seus atributos em nível máximo durante os treinos.'}
            </span>
          </div>
          <div className="w-12 h-12 shrink-0 flex items-center justify-center text-3xl filter drop-shadow-[0_2px_8px_rgba(14,165,233,0.4)]">
            💧
          </div>
        </div>

        {/* Botões de controle de água */}
        <div className="flex gap-2">
          <button
            onClick={() => addWater(250)}
            className="flex-1 py-2.5 bg-sky-950/20 hover:bg-sky-950/40 border border-sky-500/20 hover:border-sky-500/50 text-sky-400 text-xs font-bold rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> 250 ml
          </button>
          <button
            onClick={() => addWater(500)}
            className="flex-1 py-2.5 bg-sky-950/20 hover:bg-sky-950/40 border border-sky-500/20 hover:border-sky-500/50 text-sky-400 text-xs font-bold rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> 500 ml
          </button>
          <button
            onClick={resetWater}
            title="Resetar contador"
            className="px-3 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-500 hover:text-slate-300 rounded-xl transition-all active:scale-95 flex items-center justify-center"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
