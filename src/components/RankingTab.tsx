import React, { useState } from 'react';
import { GameState, RankingPlayer } from '../types';
import { MOCK_PLAYERS_REGIONAL, MOCK_PLAYERS_NACIONAL, MOCK_PLAYERS_MUNDIAL } from '../data';
import { BarChart3, Medal, Crown, TrendingUp, Shield } from 'lucide-react';
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
      name: gameState.charName || 'Você',
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
    <div className="space-y-5 pb-20 cyber-grid min-h-screen">
      {/* Tab Header Title */}
      <div className="px-5 pt-4">
        <h2 className="text-xl font-black font-display text-white tracking-widest flex items-center gap-2 uppercase">
          <Shield className="w-5 h-5 text-sky-400" />
          RANKING DE CAÇADORES
        </h2>
        <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase tracking-wider">
          Mural de classificação global baseado em energia e poder total
        </p>
      </div>

      {/* Scope Pill Tab selectors */}
      <div className="px-5">
        <div className="flex bg-black border border-slate-900 p-1 rounded-2xl shadow-[inset_0_0_15px_rgba(0,0,0,0.8)]">
          {(['regional', 'nacional', 'mundial'] as const).map((tab) => {
            const labels = { regional: 'Regional', nacional: 'Nacional', mundial: 'Mundial' };
            const isActive = scope === tab;

            return (
              <button
                key={tab}
                onClick={() => setScope(tab)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-black shadow-[0_0_12px_rgba(255,255,255,0.2)] font-black'
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
      <div className="mx-5 bg-black border-2 border-sky-400 rounded-3xl p-6 text-center relative overflow-hidden shadow-[0_0_20px_rgba(14,165,233,0.25)]">
        <Crown className="w-5 h-5 text-sky-400 absolute top-3.5 left-1/2 -translate-x-1/2 animate-bounce" />
        <div className="mt-2 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
          Sua Classificação Geral
        </div>
        <div className="text-5xl font-black font-display text-white mt-1.5 tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.25)]">
          RANK #{myPos}
        </div>
        <div className="text-[10px] font-mono text-sky-400 mt-2.5 uppercase tracking-wider font-bold">
          {gameState.totalXP.toLocaleString()} XP total acumulados · Level {gameState.level}
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
                  ? 'bg-gradient-to-r from-sky-950/20 to-[#07070a] border-sky-400 shadow-[0_0_15px_rgba(14,165,233,0.15)]'
                  : 'bg-black border-slate-900'
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
                <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-900 flex items-center justify-center text-lg shrink-0">
                  {player.avatar}
                </div>

                {/* Profile detail */}
                <div>
                  <h4 className={`text-sm font-black flex items-center gap-1.5 uppercase ${isMe ? 'text-sky-400' : 'text-slate-200'}`}>
                    {player.name} {isMe && <span className="text-[9px] font-mono uppercase bg-white text-black font-black px-1.5 py-0.5 rounded shadow">Você</span>}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-mono">Level {player.level}</p>
                </div>
              </div>

              {/* XP total */}
              <div className="text-right">
                <span className="text-sm font-mono font-black text-white">
                  {player.xp.toLocaleString()}
                </span>
                <span className="text-[9px] font-mono font-bold text-slate-500 uppercase block">XP TOTAL</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="px-5 text-center text-[9px] font-mono tracking-widest text-slate-600 py-2">
        SESSÃO AUTENTICADA COM O SISTEMA ATIVO
      </div>
    </div>
  );
};
