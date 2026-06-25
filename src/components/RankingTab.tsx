import React, { useState } from 'react';
import { GameState, Friend, FriendChallenge } from '../types';
import { 
  Users, Flame, Award, Plus, Trash2, Sparkles, Clock, 
  Copy, Trophy, Send, RefreshCw, Crown, ChevronRight, Check, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RankingTabProps {
  gameState: GameState;
  onUpdateGameState: (newState: GameState) => void;
}

export const RankingTab: React.FC<RankingTabProps> = ({ gameState, onUpdateGameState }) => {
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
      setAddError('Você já está conectado com este caçador!');
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

    setAddSuccess(`Caçador ${friendName} adicionado com sucesso!`);
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

      {/* 1. SEÇÃO CÓDIGO DE AMIGO (Friend Code & Connection Panel) */}
      <div className="mx-4 bg-[#07060a] border border-slate-900 rounded-3xl p-5 shadow-lg space-y-4">
        <div>
          <span className="text-[10px] font-mono tracking-wider font-extrabold text-sky-400 uppercase block">CONEXÃO MULTIPLAYER</span>
          <h3 className="text-base font-black text-white flex items-center gap-1.5 tracking-tight font-display">
            🤝 Código de Amigo
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">
            Compartilhe seu código ou adicione seus companheiros para treinar juntos.
          </p>
        </div>

        {/* Display My Code */}
        <div className="bg-[#030205] border border-slate-900 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[9px] font-mono font-bold text-slate-500 uppercase block">SEU CÓDIGO DE CAÇADOR</span>
            <span className="text-lg font-black font-mono text-sky-400 tracking-wider block mt-0.5">{myCode}</span>
          </div>
          <button
            onClick={handleCopyCode}
            className={`px-4 py-2.5 rounded-xl border font-mono text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
              copied 
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' 
                : 'bg-sky-500/5 hover:bg-sky-500/15 border-sky-500/30 text-sky-400'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'COPIADO!' : 'COPIAR'}
          </button>
        </div>

        {/* Form Add Friend */}
        <form onSubmit={handleAddFriend} className="space-y-2">
          <label className="text-[10px] font-mono font-bold text-slate-500 uppercase block">CONECTAR COM NOVO AMIGO</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Digite o código (Ex: THAIS123)"
              value={friendCodeInput}
              onChange={(e) => setFriendCodeInput(e.target.value)}
              className="flex-1 bg-[#030205] border border-slate-800 rounded-xl px-4 py-3 text-xs font-mono text-white focus:outline-none focus:border-sky-500/50"
            />
            <button
              type="submit"
              className="px-5 bg-sky-500 hover:bg-sky-400 text-black text-xs font-black font-mono tracking-wider uppercase rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-all active:scale-95 shadow-[0_4px_12px_rgba(14,165,233,0.15)]"
            >
              <Plus className="w-4 h-4 stroke-[3px]" />
              ADICIONAR
            </button>
          </div>
          {addError && <p className="text-[10px] font-mono text-red-400 font-semibold">{addError}</p>}
          {addSuccess && <p className="text-[10px] font-mono text-emerald-400 font-semibold">{addSuccess}</p>}
        </form>
      </div>

      {/* 2. SEÇÃO LIGA DOS AMIGOS (Leaderboard based on Weekly XP) */}
      <div className="mx-4 bg-[#07060a] border border-slate-900 rounded-3xl p-5 shadow-lg space-y-5">
        <div className="flex items-center justify-between border-b border-slate-900 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-500">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[9px] font-mono font-black text-yellow-500 tracking-wider block uppercase">COMPETIÇÃO DIÁRIA & SEMANAL</span>
              <h3 className="text-sm font-black text-white uppercase tracking-tight font-display">🏆 Liga dos Amigos</h3>
            </div>
          </div>
          <span className="text-[10px] font-mono font-black text-slate-500 bg-[#050508] border border-slate-900 px-2.5 py-1 rounded-full uppercase tracking-wider">
            {leaderboard.length} MEMBROS
          </span>
        </div>

        {/* Explanation and Resete Semanal details */}
        <div className="bg-[#030205] border border-slate-900 rounded-2xl p-4 space-y-3 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-20 h-20 bg-yellow-500/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-mono font-extrabold text-white uppercase tracking-wide">COMPETIÇÃO SEMANAL</h4>
              <p className="text-[10.5px] text-slate-400 font-sans leading-relaxed">
                Toda segunda-feira o XP da competição volta para 0, mas o seu XP acumulado da conta continua intocado. Assim todo mundo tem chance de vencer!
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2.5 border-t border-slate-900 text-xs font-mono">
            <span className="text-slate-500">Próximo reset automático:</span>
            <span className="text-yellow-500 font-bold uppercase tracking-wider animate-pulse">SEGUNDA 00:00</span>
          </div>

          {/* SIMULATE RESET BUTTON */}
          <button
            onClick={handleSimulateWeeklyReset}
            className="w-full py-2 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 hover:border-yellow-500/50 rounded-xl text-[10px] font-mono font-black tracking-widest text-yellow-400 uppercase transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Simular Reinício de Temporada
          </button>
        </div>

        {/* CAMPEÃO DA SEMANA PREVIEW */}
        {weeklyLeader && (
          <div className="bg-gradient-to-r from-amber-500/10 via-slate-950 to-transparent border border-amber-500/20 rounded-2xl p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-400 text-xl border border-amber-500/30">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[9px] font-mono font-black text-amber-400 uppercase tracking-widest">🥇 CAMPEÃO DA SEMANA</div>
              <h4 className="text-xs font-black text-white uppercase mt-0.5">
                {weeklyLeader.isMe ? 'Você' : weeklyLeader.name} <span className="font-mono text-slate-500 font-normal">({weeklyLeader.weeklyXP} XP)</span>
              </h4>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Receberá o <span className="text-amber-300 font-bold">Título Temporário: Campeão da Semana</span> no domingo!
              </p>
            </div>
          </div>
        )}

        {/* Ranking List */}
        <div className="space-y-2">
          {leaderboard.map((player, index) => {
            const rankNum = index + 1;
            const isMe = player.isMe;

            return (
              <div
                key={player.code}
                className={`border p-3 rounded-2xl flex items-center justify-between transition-all duration-200 ${
                  isMe
                    ? 'bg-gradient-to-r from-sky-950/20 to-[#07070a] border-sky-400 shadow-[0_0_15px_rgba(14,165,233,0.15)]'
                    : 'bg-black border-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Position Medal Badge */}
                  <div className="w-7 flex items-center justify-center font-mono font-black shrink-0">
                    {rankNum === 1 ? (
                      <span className="text-xl">🥇</span>
                    ) : rankNum === 2 ? (
                      <span className="text-xl">🥈</span>
                    ) : rankNum === 3 ? (
                      <span className="text-xl">🥉</span>
                    ) : (
                      <span className="text-slate-500 text-xs">#{rankNum}</span>
                    )}
                  </div>

                  {/* Avatar Icon */}
                  <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-900 flex items-center justify-center text-base shrink-0">
                    {player.avatar}
                  </div>

                  {/* Profile detail */}
                  <div>
                    <h4 className={`text-xs font-black flex items-center gap-1 uppercase ${isMe ? 'text-sky-400' : 'text-slate-200'}`}>
                      {player.name} 
                      {isMe && (
                        <span className="text-[8px] font-mono uppercase bg-white text-black font-black px-1.5 py-0.5 rounded ml-1 tracking-wider">
                          Você
                        </span>
                      )}
                    </h4>
                    <p className="text-[9px] text-slate-500 font-mono">Level {player.level} · {player.streak}🔥 dias</p>
                  </div>
                </div>

                {/* XP total */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs font-mono font-black text-white">
                      {player.weeklyXP.toLocaleString()}
                    </span>
                    <span className="text-[8px] font-mono font-bold text-slate-500 uppercase block">XP LIGA</span>
                  </div>
                  
                  {/* Remove friend button only for non-me and if they are added friends */}
                  {!isMe && (
                    <button
                      onClick={() => handleDeleteFriend(player.code, player.name)}
                      className="text-slate-600 hover:text-red-400 p-1 rounded hover:bg-red-950/20 transition-colors cursor-pointer ml-1"
                      title="Remover Amigo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. SEÇÃO DESAFIOS ENTRE AMIGOS (Challenges) */}
      <div className="mx-4 bg-[#07060a] border border-slate-900 rounded-3xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-slate-900 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[9px] font-mono font-black text-purple-400 tracking-wider block uppercase">COMBATES COOPERATIVOS</span>
              <h3 className="text-sm font-black text-white uppercase tracking-tight font-display">🎯 Desafios Entre Amigos</h3>
            </div>
          </div>
          
          <button
            onClick={() => setShowChallengeCreator(!showChallengeCreator)}
            className="px-2.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-mono text-[9px] font-black rounded-lg uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-3 h-3 stroke-[3px]" />
            CRIAR
          </button>
        </div>

        {/* Creator Overlay Form */}
        <AnimatePresence>
          {showChallengeCreator && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-[#030205] border border-slate-900 rounded-2xl p-4 space-y-3 overflow-hidden"
            >
              <h4 className="text-xs font-mono font-extrabold text-white uppercase tracking-wide">NOVO DESAFIO</h4>
              <form onSubmit={handleCreateChallenge} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-mono font-bold text-slate-500 uppercase block">Nome do Desafio</label>
                  <input
                    type="text"
                    placeholder="Ex: Desafio de 100 Flexões"
                    value={newChallengeTitle}
                    onChange={(e) => setNewChallengeTitle(e.target.value)}
                    className="w-full bg-black border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono font-bold text-slate-500 uppercase block">Exercício Base</label>
                    <select
                      value={newChallengeType}
                      onChange={(e) => setNewChallengeType(e.target.value as any)}
                      className="w-full bg-black border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="flexoes">Flexões</option>
                      <option value="agachamentos">Agachamentos</option>
                      <option value="prancha">Pranchas (Segundos)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-mono font-bold text-slate-500 uppercase block">Meta (Reps/S)</label>
                    <input
                      type="number"
                      min={10}
                      max={1000}
                      value={newChallengeTarget}
                      onChange={(e) => setNewChallengeTarget(parseInt(e.target.value) || 100)}
                      className="w-full bg-black border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="flex gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowChallengeCreator(false)}
                    className="flex-1 py-2 border border-slate-800 hover:border-slate-700 text-slate-400 text-[10px] font-mono font-bold rounded-xl uppercase tracking-wider"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-mono font-black rounded-xl uppercase tracking-wider"
                  >
                    Publicar Desafio
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Challenge list mapping */}
        <div className="space-y-4">
          {challenges.length > 0 ? (
            challenges.map((ch) => {
              // Find my progress
              const myPart = ch.participants.find(p => p.code === myCode);
              const myProg = myPart ? myPart.progress : 0;
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
          Veja a sequência consecutiva do seu grupo de caçadores e incentive quem estiver ficando lento!
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
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-900/80 flex items-center justify-center text-sm">
                    {player.avatar}
                  </div>
                  <div>
                    <h5 className={`text-xs font-black uppercase ${isPlayerMe ? 'text-sky-400' : 'text-slate-300'}`}>
                      {player.name} {isPlayerMe && <span className="text-[8px] font-normal text-slate-500 lowercase">(me)</span>}
                    </h5>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-[10px] font-mono font-extrabold text-orange-400 flex items-center gap-0.5">
                        <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                        {player.streak} dias seguidos
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

      <div className="px-5 text-center text-[9px] font-mono tracking-widest text-slate-600 py-2 uppercase">
        ⚡ CONECTADO AO COORDENADOR MULTIPLAYER DA LIGA DE AMIGOS
      </div>
    </div>
  );
};
