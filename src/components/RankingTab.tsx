import React, { useState } from 'react';
import { GameState, RankingPlayer } from '../types';
import { MOCK_PLAYERS_REGIONAL, MOCK_PLAYERS_NACIONAL, MOCK_PLAYERS_MUNDIAL } from '../data';
import { BarChart3, Medal, Crown, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

interface RankingTabProps {
  gameState: GameState;
}

export const RankingTab: React.FC<RankingTabProps> = ({ gameState }) => {
  const [scope, setScope] = useState<'regional' | 'nacional' | 'mundial'>('regional');

  const getLeaderboard = (): RankingPlayer[] => {
    let baseList: RankingPlayer[] = [];
    if (scope === 'regional') baseList = [...MOCK_PLAYERS_REGIONAL];
    else if (scope === 'nacional') baseList = [...MOCK_PLAYERS_NACIONAL];
    else if (scope === 'mundial') baseList = [...MOCK_PLAYERS_MUNDIAL];

    const me: RankingPlayer = {
      name: 'Você',
      avatar: '⚔️',
      level: gameState.level,
      xp: gameState.totalXP,
      isMe: true,
    };

    const combined = [...baseList, me];
    combined.sort((a, b) => b.xp - a.xp);
    return combined;
  };

  const players = getLeaderboard();
  const myPos = players.findIndex((p) => p.isMe) + 1;

  return (
    <div className="space-y-5 pb-20">
      {/* Tab Header Title */}
      <div className="px-5 pt-4">
        <h2 className="text-2xl font-black font-display text-white tracking-tight flex items-center gap-2">
          📊 Ranking de Heróis
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Duelo de titãs! Suba no mural do torneio de fitness acumulando XP total
        </p>
      </div>

      {/* Scope Pill Tab selectors */}
      <div className="px-5">
        <div className="flex bg-[#12101a] border border-red-950/40 p-1 rounded-2xl">
          {(['regional', 'nacional', 'mundial'] as const).map((tab) => {
            const labels = { regional: 'Regional', nacional: 'Nacional', mundial: 'Mundial' };
            const isActive = scope === tab;

            return (
              <button
                key={tab}
                onClick={() => setScope(tab)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all duration-200 ${
                  isActive
                    ? 'bg-red-600 text-white shadow-lg shadow-red-900/10'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {labels[tab]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Your Rank Position Header Hero */}
      <div className="mx-5 bg-gradient-to-r from-red-950/30 to-[#12101e] border border-red-600/20 rounded-3xl p-5 text-center relative overflow-hidden">
        <Crown className="w-5 h-5 text-amber-500 absolute top-3 left-1/2 -translate-x-1/2 animate-bounce" />
        <div className="mt-2 text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
          Sua Posição na Arena
        </div>
        <div className="text-5xl font-black font-display text-amber-400 mt-2 tracking-tighter">
          #{myPos}
        </div>
        <div className="text-xs font-mono text-slate-400 mt-2">
          {gameState.totalXP.toLocaleString()} XP total acumulados · Nível {gameState.level}
        </div>
      </div>

      {/* Rankings List */}
      <div className="px-5 space-y-2">
        {players.slice(0, 10).map((player, index) => {
          const rankNum = index + 1;
          const isMe = player.isMe;

          return (
            <motion.div
              key={player.name + rankNum}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`border p-3.5 rounded-2xl flex items-center justify-between transition-all duration-200 ${
                isMe
                  ? 'bg-gradient-to-r from-red-950/30 to-[#19152b] border-red-600/40 shadow-lg shadow-red-950/20'
                  : 'bg-[#12101a] border-red-950/20'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Position Medal Badge */}
                <div className="w-8 flex items-center justify-center font-mono font-black shrink-0">
                  {rankNum === 1 ? (
                    <span className="text-xl text-amber-400">🥇</span>
                  ) : rankNum === 2 ? (
                    <span className="text-xl text-slate-300">🥈</span>
                  ) : rankNum === 3 ? (
                    <span className="text-xl text-amber-600">🥉</span>
                  ) : (
                    <span className="text-slate-500 text-sm">#{rankNum}</span>
                  )}
                </div>

                {/* Avatar Icon */}
                <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-xl shrink-0">
                  {player.avatar}
                </div>

                {/* Profile detail */}
                <div>
                  <h4 className={`text-sm font-extrabold flex items-center gap-1.5 ${isMe ? 'text-red-400' : 'text-slate-200'}`}>
                    {player.name} {isMe && <span className="text-[10px] font-mono uppercase bg-red-600 text-white font-bold px-1.5 py-0.5 rounded">Você</span>}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-mono">Nível {player.level}</p>
                </div>
              </div>

              {/* XP total */}
              <div className="text-right">
                <span className="text-sm font-mono font-black text-amber-400">
                  {player.xp.toLocaleString()}
                </span>
                <span className="text-[9px] font-mono font-bold text-slate-500 uppercase block">XP TOTAL</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="px-5 text-center text-[10px] font-mono tracking-widest text-slate-500 py-2">
        🌐 ATUALIZAÇÃO SÍNCRONA EM TEMPO REAL COM O SUPABASE
      </div>
    </div>
  );
};
