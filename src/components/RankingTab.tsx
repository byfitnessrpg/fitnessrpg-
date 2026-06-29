import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Flame, 
  Award, 
  Users, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  RefreshCw, 
  Sparkles,
  Lock,
  Shield,
  Crown
} from 'lucide-react';
import { GameState, Friend, FriendChallenge } from '../types';
import { ACHIEVEMENTS } from '../data';

interface RankingTabProps {
  gameState: GameState;
  onUpdateGameState: (state: GameState) => void;
}

// Rank definition for progressive Rank System
interface RankItem {
  letter: 'E' | 'D' | 'C' | 'B' | 'A' | 'S';
  name: string;
  required: number;
  desc: string;
  color: string;
  borderColor: string;
  bgColor: string;
  glowColor: string;
  icon: string;
  badgeBg: string;
}

export const ALL_RANKS: RankItem[] = [
  { letter: 'S', name: 'Rank S', required: 3700, desc: 'Pico supremo da evolução e atletas de elite.', color: 'text-amber-400', borderColor: 'border-amber-500', bgColor: 'bg-amber-950/20', glowColor: 'shadow-[0_0_15px_rgba(245,158,11,0.25)]', icon: '🦁', badgeBg: 'bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-600/20' },
  { letter: 'A', name: 'Rank A', required: 2500, desc: 'Atletas de alto rendimento com consistência exemplar.', color: 'text-red-500', borderColor: 'border-red-500', bgColor: 'bg-red-950/20', glowColor: 'shadow-[0_0_12px_rgba(239,68,68,0.2)]', icon: '🐉', badgeBg: 'bg-gradient-to-r from-red-500/10 to-red-600/15' },
  { letter: 'B', name: 'Rank B', required: 1500, desc: 'Avançado e focado. Hipertrofia sólida e força bruta.', color: 'text-cyan-400', borderColor: 'border-cyan-500', bgColor: 'bg-cyan-950/20', glowColor: 'shadow-[0_0_12px_rgba(6,182,212,0.2)]', icon: '🦅', badgeBg: 'bg-gradient-to-r from-cyan-500/10 to-blue-600/15' },
  { letter: 'C', name: 'Rank C', required: 800, desc: 'Intermediário equilibrado. Carga metabólica aumentada.', color: 'text-blue-400', borderColor: 'border-blue-500', bgColor: 'bg-blue-950/20', glowColor: 'shadow-[0_0_10px_rgba(59,130,246,0.15)]', icon: '🐏', badgeBg: 'bg-gradient-to-r from-blue-500/10 to-indigo-600/15' },
  { letter: 'D', name: 'Rank D', required: 300, desc: 'Iniciante moderado. Resistência física e tônus inicial.', color: 'text-purple-400', borderColor: 'border-purple-500', bgColor: 'bg-purple-950/20', glowColor: 'shadow-[0_0_10px_rgba(168,85,247,0.15)]', icon: '👿', badgeBg: 'bg-gradient-to-r from-purple-500/10 to-fuchsia-600/15' },
  { letter: 'E', name: 'Rank E', required: 0, desc: 'O ponto de partida. Foco no fortalecimento e regularidade.', color: 'text-emerald-400', borderColor: 'border-emerald-500', bgColor: 'bg-emerald-950/20', glowColor: 'shadow-[0_0_8px_rgba(16,185,129,0.15)]', icon: '🐉', badgeBg: 'bg-gradient-to-r from-emerald-500/10 to-teal-600/15' },
];

export const getCurrentRank = (points: number): RankItem => {
  for (let i = 0; i < ALL_RANKS.length; i++) {
    if (points >= ALL_RANKS[i].required) {
      return ALL_RANKS[i];
    }
  }
  return ALL_RANKS[ALL_RANKS.length - 1]; // Rank E
};

export const RankingTab: React.FC<RankingTabProps> = ({ gameState, onUpdateGameState }) => {
  const [subTab, setSubTab] = useState<'ranks' | 'badges' | 'global'>('ranks');
  const [friendCodeInput, setFriendCodeInput] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [addError, setAddError] = useState<string>('');
  const [addSuccess, setAddSuccess] = useState<string>('');
  
  // Challenge creator form states
  const [showChallengeCreator, setShowChallengeCreator] = useState<boolean>(false);
  const [newChallengeTitle, setNewChallengeTitle] = useState<string>('');
  const [newChallengeTarget, setNewChallengeTarget] = useState<number>(100);
  const [newChallengeType, setNewChallengeType] = useState<'flexoes' | 'agachamentos' | 'prancha'>('flexoes');

  // Local notification toasts for poking friends
  const [pokeToast, setPokeToast] = useState<string | null>(null);

  // Fallback default state structures
  const myCode = gameState.friendCode || 'VOCE-123';
  const myName = gameState.charName || 'Você';
  const myAvatar = gameState.profilePic || '⚔️';
  const myStreak = gameState.streak || 0;
  const myLevel = gameState.level || 1;
  const myWeeklyXP = gameState.weeklyXP || 0;

  const friends = gameState.friends || [];
  const challenges = gameState.friendChallenges || [];

  // 1. Compile League Leaderboard (Me + Friends)
  const leaderboard = [
    {
      code: myCode,
      name: myName,
      avatar: myAvatar,
      level: myLevel,
      weeklyXP: myWeeklyXP,
      streak: myStreak,
      isMe: true
    },
    ...friends.map(f => ({ ...f, isMe: false }))
  ].sort((a, b) => b.weeklyXP - a.weeklyXP);

  // Calculate current candidate for Weekly Champion (Sunday)
  const weeklyLeader = leaderboard[0];

  // 2. Add Friend Handler
  const handleAddFriend = (e: React.FormEvent) => {
    e.preventDefault();
    setAddError('');
    setAddSuccess('');
    
    const code = friendCodeInput.trim().toUpperCase();
    if (!code) {
      setAddError('Por favor, insira um código.');
      return;
    }

    if (code === myCode) {
      setAddError('Você não pode adicionar o seu próprio código!');
      return;
    }

    if (friends.some(f => f.code === code)) {
      setAddError('Você já está conectado com este atleta!');
      return;
    }

    // Extract a possible name or use a fun generator based on entered code
    let friendName = 'Recruta';
    let friendAvatar = '🛡️';
    
    const parts = code.split('-');
    if (parts[0] && parts[0].length >= 3) {
      friendName = parts[0].charAt(0) + parts[0].slice(1).toLowerCase();
    } else {
      friendName = code.slice(0, 5);
    }

    // Assign custom avatars based on some simple formulas
    const avatars = ['🦁', '🦊', '🦅', '🐻', '🐼', '🐯', '🐺', '🦉', '🦎'];
    const charCodeSum = friendName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    friendAvatar = avatars[charCodeSum % avatars.length];

    const newFriend: Friend = {
      code,
      name: friendName,
      avatar: friendAvatar,
      level: Math.max(1, (charCodeSum % 7) + 2),
      weeklyXP: Math.floor(200 + (charCodeSum % 1500)),
      streak: Math.max(1, charCodeSum % 15)
    };

    const updatedFriends = [...friends, newFriend];

    // Auto add this friend to any existing challenges they aren't in
    const updatedChallenges = challenges.map(ch => {
      if (ch.participants.some(p => p.code === code)) return ch;
      return {
        ...ch,
        participants: [
          ...ch.participants,
          {
            code: newFriend.code,
            name: newFriend.name,
            progress: Math.floor(Math.random() * (ch.target * 0.4)) // random starting progress
          }
        ]
      };
    });

    onUpdateGameState({
      ...gameState,
      friends: updatedFriends,
      friendChallenges: updatedChallenges
    });

    setAddSuccess(`Atleta ${friendName} adicionado com sucesso!`);
    setFriendCodeInput('');
    setTimeout(() => setAddSuccess(''), 4000);
  };

  // 3. Create Challenge Handler
  const handleCreateChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    const title = newChallengeTitle.trim();
    if (!title) {
      setAddError('Por favor, informe o título do desafio.');
      return;
    }

    const newChallenge: FriendChallenge = {
      id: `ch-${Date.now()}`,
      title,
      target: newChallengeTarget,
      exerciseType: newChallengeType,
      creatorCode: myCode,
      participants: [
        { code: myCode, name: myName, progress: 0 },
        ...friends.map(f => ({
          code: f.code,
          name: f.name,
          progress: Math.floor(Math.random() * (newChallengeTarget * 0.3)) // realistic starting progress
        }))
      ]
    };

    onUpdateGameState({
      ...gameState,
      friendChallenges: [...challenges, newChallenge]
    });

    setNewChallengeTitle('');
    setShowChallengeCreator(false);
    triggerPokeToast(`🎯 Desafio "${title}" criado com sucesso! Seus amigos foram convidados.`);
  };

  // 4. Manual Progress Incrementor (for easy testing & flexible logging)
  const handleAdvanceChallengeProgress = (challengeId: string, amount: number) => {
    const updatedChallenges = challenges.map(ch => {
      if (ch.id !== challengeId) return ch;
      return {
        ...ch,
        participants: ch.participants.map(p => {
          if (p.code === myCode) {
            return { ...p, progress: Math.min(ch.target, p.progress + amount) };
          }
          return p;
        })
      };
    });

    onUpdateGameState({
      ...gameState,
      friendChallenges: updatedChallenges
    });

    triggerPokeToast(`💪 Progresso atualizado! +${amount} repetições completadas.`);
  };

  // 5. Delete Challenge Handler
  const handleDeleteChallenge = (challengeId: string) => {
    const updated = challenges.filter(ch => ch.id !== challengeId);
    onUpdateGameState({
      ...gameState,
      friendChallenges: updated
    });
    triggerPokeToast('🗑️ Desafio removido do seu painel.');
  };

  // 6. Delete Friend Handler
  const handleDeleteFriend = (friendCode: string, name: string) => {
    const updatedFriends = friends.filter(f => f.code !== friendCode);
    // Also clean up their representation from challenges
    const updatedChallenges = challenges.map(ch => ({
      ...ch,
      participants: ch.participants.filter(p => p.code !== friendCode)
    }));

    onUpdateGameState({
      ...gameState,
      friends: updatedFriends,
      friendChallenges: updatedChallenges
    });

    triggerPokeToast(`❌ Conexão removida com ${name}.`);
  };

  // 7. Reset weekly season simulation handler
  const handleSimulateWeeklyReset = () => {
    if (window.confirm('Deseja simular o reinício da temporada semanal? Todos os XPs de competição voltarão para 0. Seu XP acumulado da conta continuará intacto!')) {
      
      // Resets your competition XP and randomize / reset friends weekly XP
      const resetFriends = friends.map(f => ({
        ...f,
        weeklyXP: 0
      }));

      const resetChallenges = challenges.map(ch => ({
        ...ch,
        participants: ch.participants.map(p => ({
          ...p,
          progress: 0
        }))
      }));

      onUpdateGameState({
        ...gameState,
        weeklyXP: 0,
        friends: resetFriends,
        friendChallenges: resetChallenges
      });

      triggerPokeToast('📅 Temporada reiniciada! XP da competição zerado para todos.');
    }
  };

  // 8. Friend Poking logic
  const handlePokeFriend = (friendName: string) => {
    const messages = [
      `Você enviou um incentivo flamejante para ${friendName}! 🔥`,
      `Você mandou uma notificação de "Bora Treinar!" para ${friendName}! 👊`,
      `Você cutucou ${friendName} para que ele não perca as chamas de streak! ⚡`,
      `Mensagem de motivação enviada com sucesso para ${friendName}! 👑`
    ];
    const rand = messages[Math.floor(Math.random() * messages.length)];
    triggerPokeToast(rand);
  };

  const triggerPokeToast = (msg: string) => {
    setPokeToast(msg);
    setTimeout(() => {
      setPokeToast(null);
    }, 4000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(myCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentRankInfo = getCurrentRank(gameState.totalXP || 0);
  
  // Find next rank in ALL_RANKS
  const reversedRanks = [...ALL_RANKS].reverse(); // E, D, C, B, A, S
  const currentIndex = reversedRanks.findIndex(r => r.letter === currentRankInfo.letter);
  const nextRankInfo = currentIndex < reversedRanks.length - 1 ? reversedRanks[currentIndex + 1] : null;
  
  // Progress calculation
  let progressPct = 0;
  let pointsRemaining = 0;
  if (nextRankInfo) {
    const currentMin = currentRankInfo.required;
    const nextMax = nextRankInfo.required;
    const earnedInCurrentTier = (gameState.totalXP || 0) - currentMin;
    const tierRange = nextMax - currentMin;
    progressPct = Math.min(100, Math.max(0, (earnedInCurrentTier / tierRange) * 100));
    pointsRemaining = nextMax - (gameState.totalXP || 0);
  } else {
    progressPct = 100;
  }

  return (
    <div className="space-y-6 pb-24 cyber-grid min-h-screen pt-4">
      
      {/* Toast Alert Notice */}
      <AnimatePresence>
        {pokeToast && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 16, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-14 left-4 right-4 z-50 mx-auto max-w-sm bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950 border border-sky-400 text-white rounded-2xl p-4 shadow-[0_0_20px_rgba(14,165,233,0.3)] flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-sky-500/10 flex items-center justify-center shrink-0 text-sky-400 border border-sky-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <p className="text-xs font-mono font-bold leading-relaxed">{pokeToast}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sub-tabs Selection Bar */}
      <div className="mx-4 bg-[#050508]/85 border border-slate-900 rounded-2xl p-1 flex items-center justify-around gap-1">
        <button
          onClick={() => setSubTab('ranks')}
          className={`flex-1 py-2 rounded-xl text-[10.5px] font-mono font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            subTab === 'ranks'
              ? 'bg-sky-400 text-black shadow-[0_0_12px_rgba(6,182,212,0.3)]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Crown className="w-4 h-4" />
          <span>Ranks</span>
        </button>

        <button
          onClick={() => setSubTab('badges')}
          className={`flex-1 py-2 rounded-xl text-[10.5px] font-mono font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            subTab === 'badges'
              ? 'bg-sky-400 text-black shadow-[0_0_12px_rgba(6,182,212,0.3)]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Badges</span>
        </button>

        <button
          onClick={() => setSubTab('global')}
          className={`flex-1 py-2 rounded-xl text-[10.5px] font-mono font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            subTab === 'global'
              ? 'bg-sky-400 text-black shadow-[0_0_12px_rgba(6,182,212,0.3)]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Global</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* SUBTAB 1: RANKS */}
        {subTab === 'ranks' && (
          <motion.div
            key="subtab-ranks"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-5"
          >
            {/* Main Progress Card */}
            <div className="mx-4 bg-gradient-to-br from-[#0c0f1a] to-[#04060e] border border-cyan-500/25 rounded-3xl p-5 shadow-[0_0_20px_rgba(6,182,212,0.1)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-cyan-400/20" />
              <div className="absolute right-[-20px] bottom-[-20px] w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl ${currentRankInfo.bgColor} border-2 ${currentRankInfo.borderColor} ${currentRankInfo.glowColor} flex items-center justify-center text-3xl font-black relative shrink-0`}>
                  <span className="absolute -top-1.5 -right-1.5 bg-cyan-400 text-black text-[7px] px-1 py-0.5 rounded font-mono font-black uppercase leading-none tracking-widest shadow">
                    ATUAL
                  </span>
                  {currentRankInfo.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-mono font-black text-cyan-400 uppercase tracking-[0.2em] block leading-none">SEU RANQUE ATUAL</span>
                  <h4 className="text-lg font-black text-white uppercase mt-1 tracking-tight flex items-center gap-1.5">
                    <span>{currentRankInfo.name}</span>
                  </h4>
                  <p className="text-[10px] font-mono text-slate-400 mt-0.5 leading-tight truncate">
                    {currentRankInfo.desc}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1 font-mono text-xs">
                    <span className="text-slate-300 font-extrabold">{(gameState.totalXP || 0).toLocaleString()} <span className="text-slate-500 font-normal">PONTOS TOTAIS</span></span>
                  </div>
                </div>
              </div>

              {/* Progress bar towards next tier */}
              <div className="mt-5 space-y-2">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-slate-400 font-bold">PROGRESSO DE RANQUE</span>
                  {nextRankInfo ? (
                    <span className="text-cyan-400 font-extrabold">
                      Faltam {pointsRemaining} XP para o {nextRankInfo.name}
                    </span>
                  ) : (
                    <span className="text-amber-400 font-black tracking-widest animate-pulse">PICO SUPREMO ALCANÇADO 👑</span>
                  )}
                </div>
                <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-900/60">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                  />
                </div>
                <div className="flex justify-between text-[8px] font-mono text-slate-500 font-bold uppercase tracking-wider">
                  <span>{currentRankInfo.name} ({currentRankInfo.required} XP)</span>
                  {nextRankInfo && <span>{nextRankInfo.name} ({nextRankInfo.required} XP)</span>}
                </div>
              </div>
            </div>

            {/* List of ranks */}
            <div className="px-4 space-y-3">
              <h3 className="text-xs font-black font-display text-white tracking-widest uppercase mb-1">
                🎖️ TABELA DE RANQUES DO SISTEMA
              </h3>
              
              {ALL_RANKS.map((rk) => {
                const isCurrent = rk.letter === currentRankInfo.letter;
                const isUnlocked = (gameState.totalXP || 0) >= rk.required;
                
                return (
                  <div
                    key={rk.letter}
                    className={`border rounded-2xl p-4 transition-all duration-300 relative overflow-hidden flex items-center justify-between gap-4 ${
                      isCurrent
                        ? 'bg-[#0a0f1d] border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                        : isUnlocked
                        ? 'bg-[#030305]/90 border-slate-900/60'
                        : 'bg-[#010102]/60 border-slate-950 opacity-40'
                    }`}
                  >
                    {/* Rank Badge with custom gradient accent */}
                    <div className="flex items-center gap-3.5">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl ${rk.bgColor} border ${rk.borderColor} shrink-0`}>
                        {rk.icon}
                      </div>
                      <div>
                        <h4 className={`text-xs font-black uppercase tracking-tight flex items-center gap-2 ${rk.color}`}>
                          <span>{rk.name}</span>
                          {isCurrent && (
                            <span className="text-[7px] font-mono font-black text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 px-1.5 py-0.5 rounded uppercase tracking-widest animate-pulse">
                              ATUAL
                            </span>
                          )}
                        </h4>
                        <p className="text-[9.5px] text-slate-400 font-mono mt-0.5 leading-snug">
                          {rk.desc}
                        </p>
                        <span className="text-[9px] font-mono text-slate-500 block mt-1 uppercase font-bold tracking-wider">
                          Requisito: <span className="text-slate-300 font-black">{rk.required} PONTOS</span>
                        </span>
                      </div>
                    </div>

                    {/* Status Indicator Tag */}
                    <div className="shrink-0 text-right font-mono text-[8.5px] font-bold">
                      {isCurrent ? (
                        <span className="inline-flex items-center gap-1 text-cyan-400 uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                          ATIVO
                        </span>
                      ) : isUnlocked ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 uppercase tracking-wider">
                          <Check className="w-3 h-3" />
                          LIBERADO
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-600 bg-slate-950 px-2 py-1 rounded border border-slate-900 uppercase tracking-wider">
                          BLOQUEADO
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* SUBTAB 2: BADGES */}
        {subTab === 'badges' && (
          <motion.div
            key="subtab-badges"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* Stats Counter Progress Card */}
            <div className="mx-4 bg-black border border-slate-900 rounded-3xl p-5 relative overflow-hidden shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-mono tracking-widest font-black text-sky-400 block uppercase">
                    COLEÇÃO DE EMBLEMAS
                  </span>
                  <span className="text-sm font-black text-white leading-tight uppercase font-display">Sala de Conquistas</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-mono font-black text-white">
                    {gameState.unlockedAchievements.length}<span className="text-slate-600 text-xs">/{ACHIEVEMENTS.length}</span>
                  </span>
                  <span className="text-[9px] font-mono text-slate-500 block mt-0.5">
                    {ACHIEVEMENTS.length > 0 ? Math.round((gameState.unlockedAchievements.length / ACHIEVEMENTS.length) * 100) : 0}% COMPLETO
                  </span>
                </div>
              </div>

              <div className="w-full h-1.5 bg-slate-950 rounded-full mt-4 overflow-hidden border border-slate-900">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${ACHIEVEMENTS.length > 0 ? (gameState.unlockedAchievements.length / ACHIEVEMENTS.length) * 100 : 0}%` }}
                  transition={{ duration: 0.8 }}
                  className="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full shadow-[0_0_10px_rgba(14,165,233,0.3)]"
                />
              </div>
            </div>

            {/* Achievements Grid */}
            <div className="px-4">
              <div className="grid grid-cols-2 gap-3">
                {ACHIEVEMENTS.map((ach) => {
                  const isUnlocked = gameState.unlockedAchievements.includes(ach.id);

                  return (
                    <motion.div
                      key={ach.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`border rounded-2xl p-4 text-center flex flex-col items-center justify-between transition-all duration-300 min-h-[150px] relative ${
                        isUnlocked
                          ? 'bg-[#050508]/60 border-sky-400 shadow-[0_0_15px_rgba(14,165,233,0.15)]'
                          : 'bg-[#000000] border-slate-950 opacity-40'
                      }`}
                    >
                      {isUnlocked && (
                        <Sparkles className="w-3.5 h-3.5 text-sky-400 absolute top-2.5 right-2.5 animate-pulse" />
                      )}

                      {/* Avatar Icon */}
                      <div
                        className={`w-11 h-11 rounded-full flex items-center justify-center text-xl transition-transform duration-300 ${
                          isUnlocked
                            ? 'bg-sky-500/10 border border-sky-500/20'
                            : 'bg-slate-950 border border-slate-900/60'
                        }`}
                      >
                        {isUnlocked ? ach.icon : '🔒'}
                      </div>

                      {/* Info Text */}
                      <div className="mt-2 space-y-0.5">
                        <h4 className={`text-[10.5px] font-black tracking-tight uppercase ${isUnlocked ? 'text-sky-400' : 'text-slate-400'}`}>
                          {ach.title}
                        </h4>
                        <p className="text-[9px] text-slate-500 leading-snug font-mono px-1">
                          {ach.desc}
                        </p>
                      </div>

                      {/* Lower Badge check tag */}
                      <div className="mt-2.5 w-full font-mono text-[8px]">
                        {isUnlocked ? (
                          <span className="inline-flex items-center gap-1 font-extrabold text-sky-400 bg-sky-950/20 border border-sky-500/25 px-2 py-0.5 rounded uppercase tracking-wider">
                            DESBLOQUEADA
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-slate-600 bg-slate-950 px-2.5 py-0.5 rounded border border-slate-950 uppercase tracking-wider">
                            BLOQUEADA
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* SUBTAB 3: GLOBAL */}
        {subTab === 'global' && (
          <motion.div
            key="subtab-global"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* 1. SEÇÃO CÓDIGO DE AMIGO (Friend Code & Connection Panel) */}
            <div className="mx-4 bg-[#07060a] border border-slate-900 rounded-3xl p-5 shadow-lg space-y-4">
              <div>
                <span className="text-[10px] font-mono tracking-wider font-extrabold text-sky-400 uppercase block">CONEXÃO ENTRE ATLETAS</span>
                <h3 className="text-base font-black text-white flex items-center gap-1.5 tracking-tight font-display">
                  🤝 Código de Amigo
                </h3>
                <p className="text-[11px] text-slate-400 mt-1">
                  Compartilhe seu código ou adicione seus companheiros para treinar juntos.
                </p>
              </div>

              {/* Display My Code */}
              <div className="bg-[#030205] border border-slate-900 rounded-2xl p-4 flex items-center justify-between gap-3 min-w-0">
                <div className="min-w-0 flex-1">
                  <span className="text-[9px] font-mono font-bold text-slate-500 uppercase block">SEU CÓDIGO DE ATLETA</span>
                  <span className="text-lg font-black font-mono text-sky-400 tracking-wider block mt-0.5 truncate" title={myCode}>
                    {myCode && myCode.length > 12 ? `${myCode.substring(0, 10)}...` : myCode}
                  </span>
                </div>
                <button
                  onClick={handleCopyCode}
                  className={`px-4 py-2.5 rounded-xl border font-mono text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                    copied 
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' 
                      : 'bg-sky-500/5 hover:bg-sky-500/15 border-sky-500/30 text-sky-400'
                  }`}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>

              {/* Add Friend Form */}
              <form onSubmit={handleAddFriend} className="space-y-3 pt-1">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                    Conectar Novo Amigo
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="INSIRA O CÓDIGO DO AMIGO"
                      value={friendCodeInput}
                      onChange={(e) => setFriendCodeInput(e.target.value)}
                      className="flex-1 bg-black border border-slate-900 rounded-xl px-4 py-3 font-mono text-xs font-bold text-white uppercase placeholder:text-slate-700 focus:outline-none focus:border-sky-500/40"
                    />
                    <button
                      type="submit"
                      className="px-4 bg-sky-400 hover:bg-sky-300 text-black rounded-xl font-mono text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Conectar</span>
                    </button>
                  </div>
                </div>

                {addError && <p className="text-[10.5px] font-mono text-red-400 font-bold">{addError}</p>}
                {addSuccess && <p className="text-[10.5px] font-mono text-emerald-400 font-bold">{addSuccess}</p>}
              </form>
            </div>

            {/* 2. SEÇÃO LIGA DOS AMIGOS (Leaderboard) */}
            <div className="mx-4 bg-[#07060a] border border-slate-900 rounded-3xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-500">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[9px] font-mono font-black text-yellow-500 tracking-wider block uppercase">LIGA SEMANAL ATIVA</span>
                    <h3 className="text-sm font-black text-white uppercase tracking-tight font-display">🏆 Liga dos Amigos</h3>
                  </div>
                </div>
                
                {/* Reset button simulator */}
                <button
                  onClick={handleSimulateWeeklyReset}
                  className="px-2.5 py-1.5 bg-slate-950 hover:bg-slate-900 border border-slate-900 hover:border-slate-800 rounded-lg text-[9px] font-mono font-bold text-slate-400 hover:text-slate-200 transition-all flex items-center gap-1 cursor-pointer"
                  title="Simular Reset de Temporada Semanal (Domingo)"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset Sim</span>
                </button>
              </div>

              {/* Champion Card Banner */}
              {weeklyLeader && (
                <div className="bg-gradient-to-r from-yellow-500/10 via-amber-500/5 to-transparent border border-yellow-500/20 rounded-2xl p-4 flex items-center gap-3.5 relative overflow-hidden">
                  <div className="absolute right-3 top-3 opacity-10">
                    <Crown className="w-16 h-16 text-yellow-500" />
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-2xl shrink-0">
                    👑
                  </div>
                  <div>
                    <span className="text-[8px] font-mono font-black text-yellow-500 tracking-widest block uppercase">LÍDER DA TEMPORADA</span>
                    <h4 className="text-xs font-black text-white uppercase tracking-tight mt-0.5">{weeklyLeader.name}</h4>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Acumulou <span className="text-yellow-400 font-extrabold">{weeklyLeader.weeklyXP} XP</span> de treino esta semana!
                    </p>
                  </div>
                </div>
              )}

              {/* Leaderboard rows */}
              <div className="space-y-2.5 pt-2">
                {leaderboard.map((player, index) => {
                  const isPlayerMe = player.code === myCode;
                  const rankPos = index + 1;

                  return (
                    <div 
                      key={player.code}
                      className={`rounded-2xl p-3 flex items-center justify-between gap-3 border transition-all ${
                        isPlayerMe 
                          ? 'bg-sky-950/15 border-sky-400/40 shadow-[0_0_15px_rgba(14,165,233,0.08)]' 
                          : 'bg-[#030205] border-slate-900/60 hover:border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {/* Position Indicator */}
                        <div className="w-5 text-center shrink-0">
                          {rankPos === 1 ? (
                            <span className="text-yellow-500 text-xs font-black">1º</span>
                          ) : rankPos === 2 ? (
                            <span className="text-slate-300 text-xs font-black">2º</span>
                          ) : rankPos === 3 ? (
                            <span className="text-amber-600 text-xs font-black">3º</span>
                          ) : (
                            <span className="text-slate-600 text-[10px] font-mono font-bold">{rankPos}º</span>
                          )}
                        </div>

                        {/* Player Avatar */}
                        <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-900 flex items-center justify-center text-base shrink-0 overflow-hidden relative">
                          {player.avatar && (player.avatar.startsWith('http') || player.avatar.startsWith('data:')) ? (
                            <img src={player.avatar} alt={player.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" crossOrigin="anonymous" />
                          ) : (
                            player.avatar
                          )}
                          
                          {/* Streak Badge overlay */}
                          <span className="absolute -bottom-1 -right-1 bg-black border border-slate-900 rounded-full px-1 text-[8px] font-mono font-extrabold text-orange-500 flex items-center gap-0.5 leading-none">
                            {player.streak}🔥
                          </span>
                        </div>

                        {/* Player details */}
                        <div className="min-w-0 flex-1">
                          {(() => {
                            const isPremiumUser = !!player.isPremium || (isPlayerMe && !!gameState.isPremium);
                            return (
                              <>
                                <h5 className={`text-xs font-black uppercase truncate flex items-center gap-1.5 ${
                                  isPremiumUser 
                                    ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(234,179,8,0.25)]' 
                                    : isPlayerMe 
                                    ? 'text-sky-400' 
                                    : 'text-slate-200'
                                }`}>
                                  <span className="truncate max-w-[120px]" title={player.name}>{player.name}</span>
                                  {isPremiumUser && (
                                    <span className="text-[10px] text-yellow-500 animate-pulse shrink-0" title="Usuário Premium">👑</span>
                                  )}
                                  {isPlayerMe && <span className="text-[8px] font-medium text-slate-500 lowercase shrink-0">(você)</span>}
                                </h5>
                                <span className="text-[9.5px] font-mono text-slate-500 block mt-0.5">
                                  NÍVEL {player.level}
                                </span>
                              </>
                            );
                          })()}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-mono font-black text-white block">
                          {player.weeklyXP.toLocaleString()} <span className="text-slate-500 text-[9px] font-normal">XP</span>
                        </span>
                        
                        {/* Action buttons if not me (Delete connection option) */}
                        {!isPlayerMe ? (
                          <button
                            onClick={() => handleDeleteFriend(player.code, player.name)}
                            className="text-slate-600 hover:text-red-400 text-[9px] font-mono mt-1 inline-block uppercase transition-colors hover:underline cursor-pointer"
                            title="Remover conexão"
                          >
                            Remover
                          </button>
                        ) : (
                          <span className="text-[8px] font-mono text-sky-400 bg-sky-950/30 px-1 py-0.5 rounded border border-sky-900/30">
                            COORDENAÇÃO
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. SEÇÃO DESAFIOS ENTRE AMIGOS */}
            <div className="mx-4 bg-[#07060a] border border-slate-900 rounded-3xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-500">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[9px] font-mono font-black text-purple-500 tracking-wider block uppercase">COMPETIÇÕES COOPERATIVAS</span>
                    <h3 className="text-sm font-black text-white uppercase tracking-tight font-display">⚔️ Desafios Entre Amigos</h3>
                  </div>
                </div>

                <button
                  onClick={() => setShowChallengeCreator(!showChallengeCreator)}
                  className="px-2.5 py-1.5 bg-purple-500 text-black hover:bg-purple-400 rounded-lg text-[9px] font-mono font-black uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Novo Desafio</span>
                </button>
              </div>

              {/* Challenge creator form modal inline */}
              {showChallengeCreator && (
                <motion.form 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-black border border-purple-500/20 rounded-2xl p-4 space-y-3 pt-3"
                  onSubmit={handleCreateChallenge}
                >
                  <span className="text-[8.5px] font-mono font-black text-purple-400 tracking-widest uppercase block border-b border-slate-900 pb-1.5">
                    ⚙️ CONFIGURADOR DE DESAFIO
                  </span>

                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-slate-400 uppercase font-bold">Título do Desafio</label>
                    <input
                      type="text"
                      placeholder="Ex: Maratona de Flexões"
                      value={newChallengeTitle}
                      onChange={(e) => setNewChallengeTitle(e.target.value)}
                      className="w-full bg-[#050508] border border-slate-900 rounded-lg px-3 py-2 font-mono text-xs text-white uppercase placeholder:text-slate-800 focus:outline-none focus:border-purple-500/35"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-slate-400 uppercase font-bold">Atividade</label>
                      <select
                        value={newChallengeType}
                        onChange={(e) => setNewChallengeType(e.target.value as any)}
                        className="w-full bg-[#050508] border border-slate-900 rounded-lg px-3 py-2 font-mono text-xs text-white focus:outline-none focus:border-purple-500/35"
                      >
                        <option value="flexoes">FLEXÕES</option>
                        <option value="agachamentos">AGACHAMENTOS</option>
                        <option value="prancha">PRANCHA (S)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-slate-400 uppercase font-bold">Meta Alvo (Repetições)</label>
                      <input
                        type="number"
                        min="10"
                        max="1000"
                        value={newChallengeTarget}
                        onChange={(e) => setNewChallengeTarget(parseInt(e.target.value) || 100)}
                        className="w-full bg-[#050508] border border-slate-900 rounded-lg px-3 py-2 font-mono text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-purple-500 hover:bg-purple-400 text-black font-mono text-[10px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer"
                    >
                      Criar e Convidar Amigos
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowChallengeCreator(false)}
                      className="px-3 py-2 bg-slate-950 border border-slate-900 text-slate-400 hover:text-white font-mono text-[10px] uppercase rounded-lg transition-all cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>
                </motion.form>
              )}

              {/* Active Challenges List */}
              <div className="space-y-3 pt-1">
                {challenges.length > 0 ? (
                  challenges.map((ch) => {
                    const isCreator = ch.creatorCode === myCode;

                    return (
                      <div 
                        key={ch.id} 
                        className="bg-[#030205] border border-slate-900 rounded-2xl p-4 space-y-3 relative overflow-hidden"
                      >
                        {/* Header challenge card */}
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[8px] font-mono font-black text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                              {ch.exerciseType.toUpperCase()} · META {ch.target}
                            </span>
                            <h4 className="text-sm font-black text-white uppercase mt-1 tracking-tight">{ch.title}</h4>
                          </div>
                          {isCreator && (
                            <button
                              onClick={() => handleDeleteChallenge(ch.id)}
                              className="text-slate-600 hover:text-red-400 p-1.5 rounded hover:bg-red-950/20 transition-colors cursor-pointer"
                              title="Excluir Desafio"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        {/* List of participants with their progress bars */}
                        <div className="space-y-2.5 pt-1">
                          {ch.participants.map((p) => {
                            const isParticipantMe = p.code === myCode || p.name === 'Você';
                            const pct = Math.min(100, (p.progress / ch.target) * 100);
                            const isComplete = p.progress >= ch.target;

                            return (
                              <div key={p.code} className="space-y-1">
                                <div className="flex justify-between items-center text-[10.5px] font-mono">
                                  <span className={`font-bold flex items-center gap-1.5 ${isParticipantMe ? 'text-sky-400' : 'text-slate-400'}`}>
                                    {isParticipantMe ? 'Você (Me)' : p.name}
                                    {isComplete && <span className="text-[9px] text-emerald-400">🏆 Completo!</span>}
                                  </span>
                                  <span className="font-extrabold text-white">
                                    {p.progress}/{ch.target} <span className="text-slate-500 text-[9px]">({Math.floor(pct)}%)</span>
                                  </span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden flex">
                                  <div 
                                    className={`h-full rounded-full transition-all duration-500 ${
                                      isComplete 
                                        ? 'bg-emerald-500' 
                                        : isParticipantMe ? 'bg-sky-400' : 'bg-purple-500/60'
                                    }`}
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Manual trigger help so users don't have to fully complete missions to see list state changing */}
                        <div className="pt-2 border-t border-slate-900/60 flex items-center justify-between text-[10px] font-mono">
                          <span className="text-slate-500">Log alternativo rápido para testes:</span>
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => handleAdvanceChallengeProgress(ch.id, 10)}
                              className="px-2 py-1 bg-[#0b0a0e] border border-slate-800 hover:border-slate-700 hover:text-white rounded text-slate-400 font-extrabold transition-all cursor-pointer"
                            >
                              +10 Reps
                            </button>
                            <button
                              onClick={() => handleAdvanceChallengeProgress(ch.id, 25)}
                              className="px-2 py-1 bg-[#0b0a0e] border border-slate-800 hover:border-slate-700 hover:text-white rounded text-slate-400 font-extrabold transition-all cursor-pointer"
                            >
                              +25 Reps
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-[10px] text-slate-500 text-center uppercase font-mono py-4">Nenhum desafio ativo no momento.</p>
                )}
              </div>
            </div>

            {/* 4. SEÇÃO SEU GRUPO (Fire Streaks display) */}
            <div className="mx-4 bg-[#07060a] border border-slate-900 rounded-3xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-500">
                    <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
                  </div>
                  <div>
                    <span className="text-[9px] font-mono font-black text-orange-500 tracking-wider block uppercase">ATIVIDADE E CONSISTÊNCIA</span>
                    <h3 className="text-sm font-black text-white uppercase tracking-tight font-display">🔥 Seu Grupo (Dias de Fogo)</h3>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-400">
                Veja a sequência consecutiva do seu grupo de amigos e incentive quem estiver ficando lento!
              </p>

              {/* Group list exactly as requested: Pedro 5 dias, Ana 8 dias, João 12 dias, Você 4 dias */}
              <div className="space-y-3 pt-1">
                {leaderboard.map((player) => {
                  const isPlayerMe = player.code === myCode;

                  return (
                    <div 
                      key={player.code + '-group'}
                      className="bg-[#030205] border border-slate-900/60 rounded-2xl p-3 flex items-center justify-between hover:border-slate-800 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-900/80 flex items-center justify-center text-sm shrink-0 overflow-hidden">
                          {player.avatar && (player.avatar.startsWith('http') || player.avatar.startsWith('data:')) ? (
                            <img src={player.avatar} alt={player.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" crossOrigin="anonymous" />
                          ) : (
                            player.avatar
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h5 className={`text-xs font-black uppercase ${isPlayerMe ? 'text-sky-400' : 'text-slate-300'} truncate flex items-center gap-1.5`}>
                            <span className="truncate max-w-[110px] block" title={player.name}>{player.name}</span>
                            {isPlayerMe && <span className="text-[8px] font-normal text-slate-500 lowercase shrink-0">(me)</span>}
                          </h5>
                          <div className="flex items-center gap-1.5 mt-0.5 text-[10px] font-mono flex-wrap">
                            <span className="font-extrabold text-orange-400 flex items-center gap-0.5 shrink-0">
                              <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500 animate-pulse" />
                              {player.streak} dias
                            </span>
                            <span className="text-[8px] text-slate-400 font-bold bg-slate-900/50 px-1 py-0.5 rounded tracking-wide max-w-[70px] truncate" title={player.code}>
                              ID: {player.code && player.code.length > 6 ? player.code.substring(0, 6) : player.code}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Poke interaction button */}
                      {!isPlayerMe ? (
                        <button
                          onClick={() => handlePokeFriend(player.name)}
                          className="px-3 py-1.5 bg-orange-500/10 hover:bg-orange-500 text-orange-400 hover:text-black border border-orange-500/20 rounded-lg text-[9px] font-mono font-black uppercase tracking-wider transition-all cursor-pointer"
                        >
                          Incentivar
                        </button>
                      ) : (
                        <span className="text-[9px] font-mono font-extrabold text-slate-600 uppercase pr-2">VOCÊ ESTÁ ATIVO</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-5 text-center text-[9px] font-mono tracking-widest text-slate-600 py-2 uppercase">
        ⚡ CONECTADO AO COORDENADOR MULTIPLAYER DA LIGA DE AMIGOS
      </div>
    </div>
  );
};
