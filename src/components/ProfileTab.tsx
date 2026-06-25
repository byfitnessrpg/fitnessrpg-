import React, { useRef, useState } from 'react';
import { GameState } from '../types';
import { Award, Zap, Flame, Shield, RotateCcw, Edit2, Download, Check, Share2, Copy, Users, CheckCircle2, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import * as htmlToImage from 'html-to-image';

interface ProfileTabProps {
  gameState: GameState;
  xpNeeded: number;
  onReset: () => void;
  onUpdateGameState: (newState: GameState) => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({ gameState, xpNeeded, onReset, onUpdateGameState }) => {
  const pct = Math.min(100, Math.round((gameState.xp / xpNeeded) * 100));
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [copiedInviteCode, setCopiedInviteCode] = useState(false);
  const [sharedInvite, setSharedInvite] = useState(false);

  // Circular ring calculations
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - pct / 100);

  const getRankName = (lv: number) => {
    if (lv < 5) return 'Bronze';
    if (lv < 10) return 'Prata';
    if (lv < 20) return 'Ouro';
    if (lv < 35) return 'Diamante';
    return 'Lendário';
  };

  const rank = getRankName(gameState.level);

  const rankColors = {
    Bronze: 'bg-slate-950 text-slate-400 border-slate-800',
    Prata: 'bg-slate-900 text-slate-300 border-slate-700',
    Ouro: 'bg-sky-950/40 text-sky-400 border-sky-500/30 shadow-[0_0_10px_rgba(14,165,233,0.1)]',
    Diamante: 'bg-blue-950 text-blue-400 border-blue-500/30',
    Lendário: 'bg-white text-black border-white font-black',
  };

  const stats = [
    { label: 'Contratos Completos', val: gameState.totalMissions, sub: 'quests' },
    { label: 'Chama Ativa (Streak)', val: `${gameState.streak}🔥`, sub: 'dias seguidos' },
    { label: 'XP Acumulado', val: gameState.totalXP.toLocaleString(), sub: 'xp total' },
    { label: 'Conquistas Coletadas', val: gameState.unlockedAchievements.length, sub: 'emblemas' },
    { label: 'Guerreiro das Flexões', val: gameState.totalFlexoes, sub: 'flexões totais' },
    { label: 'Pernas de Aço', val: gameState.totalAgacham, sub: 'agachamentos' },
    { label: 'Prancha do Destino', val: `${Math.floor(gameState.totalPrancha / 60)}m`, sub: 'tempo total' },
    { label: 'Recorde Diário', val: gameState.maxDayMissions, sub: 'quests completas' },
  ];

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

  const handleExportCard = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    setExportSuccess(false);
    try {
      // Força um pequeno delay para garantir renderização perfeita
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      const dataUrl = await htmlToImage.toPng(cardRef.current, {
        cacheBust: true,
        backgroundColor: '#030305',
        quality: 1,
        pixelRatio: 2, // Imagem super nítida para compartilhamento
        style: {
          transform: 'scale(1)',
          padding: '16px',
        }
      });
      
      const link = document.createElement('a');
      link.download = `licenca-cacador-${gameState.charName || 'guerreiro'}.png`;
      link.href = dataUrl;
      link.click();
      
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (error) {
      console.error('Erro ao gerar imagem:', error);
      alert('Não foi possível gerar o cartão como imagem. Se estiver no celular, tente segurar a tela ou abrir em uma aba externa!');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 pb-24 cyber-grid min-h-screen">
      {/* Hidden file input for gallery upload on tab */}
      <input
        type="file"
        id="profile-pic-input-tab"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* COMPARTILHAMENTO / CAPTURA DE TELA: Área da Carteira de Caçador */}
      <div className="px-4 pt-4">
        <div 
          ref={cardRef} 
          className="bg-[#030305] border border-sky-500/25 rounded-3xl p-5 shadow-[0_0_25px_rgba(14,165,233,0.05)] relative overflow-hidden"
        >
          {/* Decorações do Cartão Oficial */}
          <div className="absolute right-[-20px] top-[-20px] w-48 h-48 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute left-[-20px] bottom-[-20px] w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="text-center pb-4 mb-2 border-b border-slate-900/60 flex items-center justify-between">
            <span className="text-[9px] font-mono font-black text-sky-400 tracking-widest uppercase">
              SISTEMA DE SUPORTE ATIVO
            </span>
            <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider">
              LICENÇA OFICIAL
            </span>
          </div>

          {/* Visual profile header card */}
          <div className="flex flex-col items-center text-center space-y-3 mb-6">
            {/* Progress Circular ring */}
            <div className="relative w-28 h-28 flex items-center justify-center group cursor-pointer" onClick={() => document.getElementById('profile-pic-input-tab')?.click()}>
              <svg className="w-28 h-28 absolute transform -rotate-90 z-10 pointer-events-none">
                {/* Background circle */}
                <circle
                  cx="56"
                  cy="56"
                  r={radius}
                  className="stroke-slate-950 fill-none"
                  strokeWidth="6"
                />
                {/* Animated primary circle */}
                <motion.circle
                  cx="56"
                  cy="56"
                  r={radius}
                  className="stroke-sky-400 fill-none"
                  strokeWidth="6"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: offset }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  strokeLinecap="round"
                />
              </svg>
              {/* Portrait or Level display */}
              <div className="w-20 h-20 rounded-full overflow-hidden bg-slate-950 border border-slate-900 flex flex-col items-center justify-center leading-none relative">
                {gameState.profilePic ? (
                  <img src={gameState.profilePic} alt="Portrait" className="w-full h-full object-cover" referrerPolicy="no-referrer" crossOrigin="anonymous" />
                ) : (
                  <>
                    <span className="text-3xl font-black font-mono text-white leading-none">{gameState.level}</span>
                    <span className="text-[8px] font-mono font-extrabold text-slate-500 uppercase mt-1 tracking-wider">
                      NÍVEL
                    </span>
                  </>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Edit2 className="w-4 h-4 text-white" />
                </div>
              </div>
              {/* Level Badge if profile picture is active */}
              {gameState.profilePic && (
                <div className="absolute bottom-0 right-1 w-7 h-7 rounded-full bg-white text-black border border-slate-950 flex items-center justify-center font-mono font-black text-xs z-20 shadow-lg">
                  {gameState.level}
                </div>
              )}
            </div>

            {/* Hero title & Class Rank name tag */}
            <div className="space-y-1">
              <h3 className="text-xl font-extrabold font-display text-white">{gameState.charName || 'Guerreiro da Disciplina'}</h3>
              <span
                className={`inline-block px-4 py-1 border rounded-full text-[10px] font-bold tracking-widest font-mono uppercase ${
                  rankColors[rank as keyof typeof rankColors]
                }`}
              >
                Tier {rank} · {gameState.charClass || 'Caçador'}
              </span>
              <p className="text-[11px] text-slate-500 font-mono pt-1">
                {gameState.xp} / {xpNeeded} XP para o próximo nível ({pct}%)
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono font-extrabold tracking-widest text-slate-400 uppercase flex items-center gap-1.5 border-t border-slate-900/60 pt-4">
              <Award className="w-4 h-4 text-sky-400" />
              ATRIBUTOS REGISTRADOS
            </h4>

            <div className="grid grid-cols-2 gap-3">
              {stats.map((s) => (
                <div key={s.label} className="bg-[#050508] border border-slate-900 rounded-2xl p-4 hover:border-sky-500/20 transition-colors">
                  <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wide block">
                    {s.label}
                  </span>
                  <span className="text-2xl font-black font-display text-white block mt-1 leading-none">
                    {s.val}
                  </span>
                  <span className="text-[9px] font-mono text-slate-400 block mt-1 uppercase tracking-wider">
                    {s.sub}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Botão de Exportação do Card */}
      <div className="px-5 space-y-1 text-center">
        <button
          onClick={handleExportCard}
          disabled={isExporting}
          className="w-full py-4 bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 text-black font-black font-mono tracking-widest text-xs uppercase rounded-xl flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 shadow-[0_0_20px_rgba(14,165,233,0.3)] disabled:opacity-50"
        >
          {isExporting ? (
            <>
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              GERANDO IMAGEM DA LICENÇA...
            </>
          ) : exportSuccess ? (
            <>
              <Check className="w-4 h-4 text-black stroke-[3px]" />
              LICENÇA SALVA! ENVIE PARA SEU AMIGO
            </>
          ) : (
            <>
              <Download className="w-4 h-4 text-black stroke-[3px]" />
              SALVAR LICENÇA DE CAÇADOR (PRINT)
            </>
          )}
        </button>
        <p className="text-[10px] text-slate-500 font-mono pt-1 uppercase tracking-wider">
          Mande para seus amigos e desafie eles a subirem de nível!
        </p>
      </div>

      {/* SEÇÃO COMPANHEIROS DE JORNADA */}
      <div className="px-5 space-y-4">
        <div className="bg-[#07060a] border border-slate-900 rounded-3xl p-5 shadow-lg space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-900/60 pb-3">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[9px] font-mono font-black text-sky-400 tracking-wider block uppercase">CRESCIMENTO CONJUNTO</span>
              <h3 className="text-sm font-black text-white uppercase tracking-tight font-display">🤝 Companheiros de Jornada</h3>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            Convide amigos para treinar no FitnessRPG. Fortaleça sua consistência e evoluam juntos, sem recompensas materiais – apenas o poder da comunidade e do progresso mútuo.
          </p>

          {/* Código de Convite */}
          <div className="bg-[#030205] border border-slate-900 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between gap-2 min-w-0">
              <div className="min-w-0 flex-1">
                <span className="text-[9px] font-mono font-bold text-slate-500 uppercase block">SEU CÓDIGO DE CONVITE</span>
                <span className="text-lg font-black font-mono text-sky-400 tracking-wider block mt-0.5 truncate" title={gameState.friendCode || 'FIT-CACADOR'}>
                  {gameState.friendCode && gameState.friendCode.length > 12 
                    ? `${gameState.friendCode.substring(0, 10)}...` 
                    : (gameState.friendCode || 'FIT-CACADOR')}
                </span>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(gameState.friendCode || 'FIT-CACADOR');
                  setCopiedInviteCode(true);
                  setTimeout(() => setCopiedInviteCode(false), 2000);
                }}
                className={`px-3 py-2 rounded-xl border font-mono text-[10px] font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                  copiedInviteCode 
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' 
                    : 'bg-sky-500/5 hover:bg-sky-500/15 border-sky-500/30 text-sky-400'
                }`}
              >
                {copiedInviteCode ? <Check className="w-3 h-3 stroke-[3px]" /> : <Copy className="w-3 h-3" />}
                {copiedInviteCode ? 'COPIADO!' : 'COPIAR'}
              </button>
            </div>
          </div>

          {/* Compartilhamento e Estatística Motivacional */}
          <div className="space-y-3">
            {/* Mensagem Motivacional baseada em recrutamento */}
            <div className="bg-sky-500/5 border border-sky-500/10 rounded-2xl p-3.5 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-mono font-bold text-white uppercase">Incentivo Comunitário</p>
                {(gameState.recruitsCount || 0) > 0 ? (
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                    "Você inspirou <span className="text-sky-400 font-extrabold">{(gameState.recruitsCount || 0)}</span> {((gameState.recruitsCount || 0) === 1) ? 'pessoa' : 'pessoas'} a iniciar sua jornada."
                  </p>
                ) : (
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Convide amigos para iniciar sua jornada juntos.
                  </p>
                )}
              </div>
            </div>

            {/* Botão de Compartilhar */}
            <button
              onClick={() => {
                const inviteCode = gameState.friendCode || 'FIT-CACADOR';
                const inviteLink = `https://fitnessrpg.vercel.app?ref=${inviteCode}`;
                const shareText = `Estou evoluindo no FitnessRPG. Venha iniciar sua jornada comigo.\nLink: ${inviteLink}\nCódigo de Convite: ${inviteCode}`;
                
                if (navigator.share) {
                  navigator.share({
                    title: 'FitnessRPG',
                    text: shareText,
                    url: inviteLink,
                  }).then(() => {
                    setSharedInvite(true);
                    setTimeout(() => setSharedInvite(false), 3000);
                  }).catch(() => {
                    navigator.clipboard.writeText(shareText);
                    setSharedInvite(true);
                    setTimeout(() => setSharedInvite(false), 3000);
                  });
                } else {
                  navigator.clipboard.writeText(shareText);
                  setSharedInvite(true);
                  setTimeout(() => setSharedInvite(false), 3000);
                }
              }}
              className="w-full py-3 bg-sky-500 hover:bg-sky-400 text-black font-mono text-xs font-black tracking-widest uppercase rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 shadow-[0_4px_12px_rgba(14,165,233,0.15)]"
            >
              <Share2 className="w-4 h-4 stroke-[3px]" />
              {sharedInvite ? 'CONVITE COPIADO!' : 'CONVIDAR AMIGOS'}
            </button>
          </div>

          {/* Seção de Marcos de Recrutamento */}
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wide">MARCOS DE RECRUTAMENTO</span>
              <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-900">
                <span className="text-[10px] font-mono text-slate-400 font-bold">Convidados:</span>
                <span className="text-[11px] font-mono font-black text-sky-400">{(gameState.recruitsCount || 0)}</span>
              </div>
            </div>

            <div className="space-y-2">
              {[
                { target: 1, label: 'Primeiro Companheiro' },
                { target: 3, label: 'Líder de Equipe' },
                { target: 5, label: 'Inspirador' },
                { target: 10, label: 'Mentor' },
                { target: 25, label: 'Lenda da Comunidade' }
              ].map((m) => {
                const isUnlocked = (gameState.recruitsCount || 0) >= m.target;
                return (
                  <div 
                    key={m.target}
                    className={`p-3 rounded-2xl border flex items-center justify-between transition-colors duration-200 ${
                      isUnlocked 
                        ? 'bg-sky-950/10 border-sky-500/20' 
                        : 'bg-black/40 border-slate-900/60 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs border ${
                        isUnlocked 
                          ? 'bg-sky-400/10 border-sky-400/30 text-sky-400' 
                          : 'bg-slate-950 border-slate-900 text-slate-600'
                      }`}>
                        {m.target}
                      </div>
                      <div>
                        <h5 className={`text-xs font-black uppercase ${isUnlocked ? 'text-sky-300' : 'text-slate-500'}`}>
                          {m.label}
                        </h5>
                        <p className="text-[9px] text-slate-500 font-mono uppercase tracking-wider">
                          Requer {m.target} {m.target === 1 ? 'amigo' : 'amigos'}
                        </p>
                      </div>
                    </div>
                    {isUnlocked ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-800 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone Controls */}
      <div className="px-5 pt-2">
        <button
          onClick={onReset}
          className="w-full py-3.5 bg-red-950/10 hover:bg-red-950/30 border border-red-900/20 text-red-400 font-bold font-mono tracking-wider text-xs uppercase rounded-xl flex items-center justify-center gap-2 transition-all duration-200"
        >
          <RotateCcw className="w-4 h-4" />
          Zerar Histórico de Treino
        </button>
      </div>
    </div>
  );
};
