import React, { useState } from 'react';
import { GameState } from '../types';
import { 
  Crown, Sparkles, TrendingUp, Dumbbell, Award, Flame, Zap, 
  Lock, Unlock, ArrowLeft, Shield, Compass, Brain, Check, Swords
} from 'lucide-react';
import { motion } from 'motion/react';

interface PremiumBenefitsScreenProps {
  gameState: GameState;
  onUpdateGameState: (state: GameState) => void;
  onClose?: () => void;
  theme?: 'dark' | 'light';
}

export const PremiumBenefitsScreen: React.FC<PremiumBenefitsScreenProps> = ({
  gameState,
  onUpdateGameState,
  onClose,
  theme = 'dark',
}) => {
  const isLight = theme === 'light';
  const isPremium = !!gameState.isPremium;
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'semanal' | 'mensal' | 'vitalicio'>('semanal');

  const handleTogglePremium = () => {
    const updatedState = {
      ...gameState,
      isPremium: !isPremium
    };
    onUpdateGameState(updatedState);
    if (!isPremium) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  };

  return (
    <div className={`min-h-screen pb-24 transition-colors duration-300 relative select-none ${
      isLight ? 'bg-slate-950 text-slate-100' : 'bg-black text-slate-100'
    } cyber-grid`}>
      {/* Confetti simulation overlay */}
      {showConfetti && (
        <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center pointer-events-none overflow-hidden">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-950 border border-yellow-500/50 p-6 rounded-3xl text-center shadow-[0_0_40px_rgba(234,179,8,0.3)] max-w-xs mx-4"
          >
            <div className="w-14 h-14 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto text-2xl animate-bounce mb-3">
              👑
            </div>
            <h4 className="text-sm font-black text-yellow-400 font-display uppercase tracking-widest">SISTEMA ATUALIZADO</h4>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed font-mono">
              Parabéns! Você acaba de se tornar um Atleta de Elite de Classe Premium! Todos os recursos foram desbloqueados.
            </p>
          </motion.div>
        </div>
      )}

      {/* Main Hero Banner with Anime Warrior image */}
      <div className="relative w-full h-[360px] overflow-hidden rounded-b-[2.5rem] border-b border-sky-500/10">
        <img
          src="/src/assets/images/premium_hero_banner_1782674764491.jpg"
          alt="Benefícios do Fitness Evolution Premium"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-top"
        />
        {/* Dark linear gradient overlay from bottom to top */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020104] via-[#020104]/50 to-transparent" />
        
        {/* Top overlay back button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 rounded-full border border-sky-500/20 bg-black/50 text-sky-400 hover:text-white hover:bg-black/80 transition-all cursor-pointer backdrop-blur-sm shadow-[0_0_12px_rgba(14,165,233,0.3)]"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}

        {/* Overlaid Title text at the bottom-left of the image */}
        <div className="absolute bottom-6 left-5 right-5 space-y-1">
          <h2 className="text-xl font-extrabold text-white tracking-wide uppercase">
            Benefícios do
          </h2>
          <h1 className="text-2xl font-black bg-gradient-to-r from-sky-400 via-blue-400 to-sky-300 bg-clip-text text-transparent uppercase tracking-tight">
            Fitness Evolution Premium
          </h1>
          <p className="text-[10.5px] font-sans text-slate-400 leading-snug tracking-normal max-w-xs">
            Mais recursos para você evoluir ainda mais e alcançar o próximo nível.
          </p>
        </div>
      </div>

      {/* Feature list container */}
      <div className="max-w-md mx-auto px-5 pt-8 space-y-6">
        {/* Feature 1: Biblioteca Exclusiva de Exercícios */}
        <div className="flex gap-4">
          <div className="w-11 h-11 rounded-full border border-sky-500/20 bg-sky-950/20 flex items-center justify-center text-sky-400 shrink-0 shadow-[0_0_12px_rgba(14,165,233,0.1)]">
            <Dumbbell className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">
              Biblioteca Exclusiva de Exercícios
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans font-medium">
              Desbloqueie novos exercícios que deixam suas missões mais variadas e desafiadoras.
            </p>
          </div>
        </div>
        
        <div className="w-full h-[1px] bg-slate-900/60" />

        {/* Feature 2: Estatísticas Avançadas */}
        <div className="flex gap-4">
          <div className="w-11 h-11 rounded-full border border-sky-500/20 bg-sky-950/20 flex items-center justify-center text-sky-400 shrink-0 shadow-[0_0_12px_rgba(14,165,233,0.1)]">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">
              Estatísticas Avançadas
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans font-medium">
              Visualize gráficos completos, evolução detalhada, desempenho, consistência, força e muito mais.
            </p>
          </div>
        </div>

        <div className="w-full h-[1px] bg-slate-900/60" />

        {/* Feature 3: Treinos e Desafios Elite */}
        <div className="flex gap-4">
          <div className="w-11 h-11 rounded-full border border-sky-500/20 bg-sky-950/20 flex items-center justify-center text-sky-400 shrink-0 shadow-[0_0_12px_rgba(14,165,233,0.1)]">
            <Dumbbell className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">
              Treinos e Desafios Elite
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans font-medium">
              Receba desafios exclusivos com maior dificuldade.
            </p>
            {/* Bullet points exactly matched */}
            <div className="space-y-1 pt-1.5 pl-1.5">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.5)]" />
                <span className="text-[10px] font-sans font-black text-slate-300">XP extra</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.5)]" />
                <span className="text-[10px] font-sans font-black text-slate-300">Medalhas exclusivas</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.5)]" />
                <span className="text-[10px] font-sans font-black text-slate-300">Recompensas especiais</span>
              </div>
            </div>
            <p className="text-[9.5px] font-mono text-slate-500 pt-1 leading-normal">
              Essas medalhas aparecem no seu perfil e demonstram sua dedicação.
            </p>
          </div>
        </div>

        <div className="w-full h-[1px] bg-slate-900/60" />

        {/* Feature 4: Reavaliação Inteligente */}
        <div className="flex gap-4">
          <div className="w-11 h-11 rounded-full border border-sky-500/20 bg-sky-950/20 flex items-center justify-center text-sky-400 shrink-0 shadow-[0_0_12px_rgba(14,165,233,0.1)]">
            <Brain className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">
              Reavaliação Inteligente
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans font-medium">
              A cada 10 dias o Sistema reavalia sua evolução automaticamente.
            </p>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans font-medium">
              O treino é ajustado conforme seu progresso, aumentando a dificuldade de forma inteligente para continuar gerando evolução.
            </p>
          </div>
        </div>

        <div className="w-full h-[1px] bg-slate-900/60" />

        {/* Feature 5: Perfil Premium */}
        <div className="flex gap-4">
          <div className="w-11 h-11 rounded-full border border-sky-500/20 bg-sky-950/20 flex items-center justify-center text-sky-400 shrink-0 shadow-[0_0_12px_rgba(14,165,233,0.1)]">
            <Shield className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">
              Perfil Premium
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans font-medium">
              Mostre que você faz parte da elite.
            </p>
            {/* Bullet points exactly matched */}
            <div className="space-y-1 pt-1.5 pl-1.5">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.5)]" />
                <span className="text-[10px] font-sans font-black text-slate-300">Selo Premium dourado no perfil</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.5)]" />
                <span className="text-[10px] font-sans font-black text-slate-300 font-medium">Nick dourado</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.5)]" />
                <span className="text-[10px] font-sans font-black text-slate-300 font-medium">Selo exibido no Ranking de Amigos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Plan list selector */}
        <div className="pt-6 space-y-3">
          {/* Semanal Plan */}
          <div
            onClick={() => setSelectedPlan('semanal')}
            className={`border rounded-2xl p-4 flex items-center justify-between transition-all duration-300 cursor-pointer ${
              selectedPlan === 'semanal'
                ? 'border-blue-500 bg-blue-950/15 shadow-[0_0_15px_rgba(37,99,235,0.15)] animate-pulse-subtle'
                : 'border-slate-900 bg-[#07060a]/80 hover:border-slate-800'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              {selectedPlan === 'semanal' ? (
                <div className="w-5 h-5 rounded-full bg-blue-600 border border-blue-500 flex items-center justify-center text-white shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full border border-slate-800 bg-[#07060a] shrink-0" />
              )}
              <div>
                <h4 className="text-xs font-black text-white uppercase tracking-tight">Semanal</h4>
                <p className="text-[9.5px] text-slate-400 font-sans tracking-wide">
                  Ideal para experimentar todos os recursos Premium.
                </p>
              </div>
            </div>
            <div className="text-right shrink-0 pl-2">
              <span className="text-sm font-black text-white font-sans">R$ 5,99</span>
            </div>
          </div>

          {/* Mensal Plan */}
          <div
            onClick={() => setSelectedPlan('mensal')}
            className={`border rounded-2xl p-4 flex items-center justify-between transition-all duration-300 cursor-pointer ${
              selectedPlan === 'mensal'
                ? 'border-blue-500 bg-blue-950/15 shadow-[0_0_15px_rgba(37,99,235,0.15)]'
                : 'border-slate-900 bg-[#07060a]/80 hover:border-slate-800'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              {selectedPlan === 'mensal' ? (
                <div className="w-5 h-5 rounded-full bg-blue-600 border border-blue-500 flex items-center justify-center text-white shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full border border-slate-800 bg-[#07060a] shrink-0" />
              )}
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h4 className="text-xs font-black text-white uppercase tracking-tight">Mensal</h4>
                  <span className="bg-sky-500/20 border border-sky-400/20 text-sky-400 text-[8px] font-black font-sans px-1.5 py-0.5 rounded-full uppercase scale-90 origin-left">
                    Mais Popular
                  </span>
                </div>
                <p className="text-[9.5px] text-slate-400 font-sans tracking-wide">
                  Desbloqueie todos os recursos Premium por um mês.
                </p>
              </div>
            </div>
            <div className="text-right shrink-0 pl-2">
              <span className="text-sm font-black text-white font-sans">R$ 11,99</span>
            </div>
          </div>

          {/* Vitalício Plan */}
          <div
            onClick={() => setSelectedPlan('vitalicio')}
            className={`border rounded-2xl p-4 flex items-center justify-between transition-all duration-300 cursor-pointer ${
              selectedPlan === 'vitalicio'
                ? 'border-blue-500 bg-blue-950/15 shadow-[0_0_15px_rgba(37,99,235,0.15)]'
                : 'border-slate-900 bg-[#07060a]/80 hover:border-slate-800'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              {selectedPlan === 'vitalicio' ? (
                <div className="w-5 h-5 rounded-full bg-blue-600 border border-blue-500 flex items-center justify-center text-white shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full border border-slate-800 bg-[#07060a] shrink-0" />
              )}
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h4 className="text-xs font-black text-white uppercase tracking-tight">Vitalício</h4>
                  <span className="bg-blue-500/20 border border-blue-400/20 text-blue-400 text-[8px] font-black font-sans px-1.5 py-0.5 rounded-full uppercase scale-90 origin-left">
                    Melhor custo-benefício
                  </span>
                </div>
                <p className="text-[9.5px] text-slate-400 font-sans tracking-wide">
                  Pague apenas uma vez e tenha acesso permanente ao Fitness Evolution Premium.
                </p>
              </div>
            </div>
            <div className="text-right shrink-0 pl-2">
              <span className="text-sm font-black text-white font-sans">R$ 36,99</span>
            </div>
          </div>
        </div>

        {/* CTA Button and footnote */}
        <div className="pt-6 pb-12 space-y-3">
          <button
            onClick={handleTogglePremium}
            className={`w-full py-4 text-xs font-black uppercase tracking-widest rounded-2xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 duration-300 ${
              isPremium
                ? 'bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-mono'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:brightness-110 active:scale-[0.98]'
            }`}
          >
            {isPremium ? '✕ DESATIVAR LICENÇA PREMIUM (MOCK/TESTE)' : 'Desbloquear Fitness Evolution Premium'}
          </button>
          
          <p className="text-[10px] text-slate-500 font-sans font-bold text-center tracking-normal leading-relaxed max-w-[320px] mx-auto">
            Invista na sua evolução e desbloqueie a experiência completa do Fitness Evolution.
          </p>
        </div>
      </div>
    </div>
  );
};
