import React, { useRef, useState } from 'react';
import { GameState } from '../types';
import { Award, Zap, Flame, Shield, RotateCcw, Edit2, Download, Check, Share2, Copy, Users, CheckCircle2, Sparkles, Lock, Bell, Sun, Moon } from 'lucide-react';
import { motion } from 'motion/react';
import * as htmlToImage from 'html-to-image';
import { NOTIFICATION_DATABASE, getIntelligentMessage, loadNotificationHistory, resetNotificationHistory, NotificationCategory } from '../lib/notificationEngine';

interface ProfileTabProps {
  gameState: GameState;
  xpNeeded: number;
  onReset: () => void;
  onUpdateGameState: (newState: GameState) => void;
  onTriggerReassessment?: () => void;
  onNavigateToPremium?: () => void;
  user?: any;
  onLogout?: () => void;
  onLoginTrigger?: () => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  gameState,
  xpNeeded,
  onReset,
  onUpdateGameState,
  onTriggerReassessment,
  onNavigateToPremium,
  user,
  onLogout,
  onLoginTrigger,
  theme = 'dark',
  onToggleTheme,
}) => {
  const isLight = theme === 'light';
  const isPremium = !!gameState.isPremium;

  const pct = Math.min(100, Math.round((gameState.xp / xpNeeded) * 100));
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [copiedInviteCode, setCopiedInviteCode] = useState(false);
  const [sharedInvite, setSharedInvite] = useState(false);

  const [reassessmentCountdown, setReassessmentCountdown] = useState<string>('');
  const [isReassessmentLocked, setIsReassessmentLocked] = useState<boolean>(false);
  const [selectedNotificationCategory, setSelectedNotificationCategory] = useState<NotificationCategory>('bom_dia');
  const [notificationLogs, setNotificationLogs] = useState<string[]>([]);

  React.useEffect(() => {
    const updateCountdown = () => {
      if (!gameState.proxima_reavaliacao) {
        setIsReassessmentLocked(false);
        setReassessmentCountdown('');
        return;
      }
      const nextDate = new Date(gameState.proxima_reavaliacao);
      if (isNaN(nextDate.getTime())) {
        setIsReassessmentLocked(false);
        setReassessmentCountdown('');
        return;
      }
      const now = new Date();
      const diffTime = nextDate.getTime() - now.getTime();

      if (diffTime <= 0) {
        setIsReassessmentLocked(false);
        setReassessmentCountdown('');
      } else {
        setIsReassessmentLocked(true);
        const totalSecs = Math.floor(diffTime / 1000);
        const days = Math.floor(totalSecs / (3600 * 24));
        const hours = Math.floor((totalSecs % (3600 * 24)) / 3600);
        const mins = Math.floor((totalSecs % 3600) / 60);
        const secs = totalSecs % 60;

        const formattedSecs = String(secs).padStart(2, '0');
        const formattedMins = String(mins).padStart(2, '0');
        const formattedHours = String(hours).padStart(2, '0');

        if (days > 0) {
          setReassessmentCountdown(`${days}d ${formattedHours}:${formattedMins}`);
        } else {
          setReassessmentCountdown(`${formattedHours}:${formattedMins}:${formattedSecs}`);
        }
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [gameState.proxima_reavaliacao]);

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
    { label: 'Metas Concluídas', val: gameState.totalMissions, sub: 'treinos' },
    { label: 'Chama Ativa (Streak)', val: `${gameState.streak}🔥`, sub: 'dias seguidos' },
    { label: 'XP Acumulado', val: gameState.totalXP.toLocaleString(), sub: 'xp total' },
    { label: 'Conquistas Coletadas', val: gameState.unlockedAchievements.length, sub: 'emblemas' },
    { label: 'Volume de Flexões', val: gameState.totalFlexoes, sub: 'flexões totais' },
    { label: 'Força de Agachamento', val: gameState.totalAgacham, sub: 'agachamentos' },
    { label: 'Resistência de Prancha', val: `${Math.floor(gameState.totalPrancha / 60)}m`, sub: 'tempo total' },
    { label: 'Recorde Diário', val: gameState.maxDayMissions, sub: 'treinos em um dia' },
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
      link.download = `carteira-atleta-${gameState.charName || 'atleta'}.png`;
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

      {/* COMPARTILHAMENTO / CAPTURA DE TELA: Área da Carteira de Atleta */}
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
              <h3 className="text-xl font-extrabold font-display text-white">{gameState.charName || 'Atleta de Calistenia'}</h3>
              <span
                className={`inline-block px-4 py-1 border rounded-full text-[10px] font-bold tracking-widest font-mono uppercase ${
                  rankColors[rank as keyof typeof rankColors]
                }`}
              >
                Aptidão: {rank} · {gameState.charClass || 'Calistenia'}
              </span>
              <p className="text-[11px] text-slate-500 font-mono pt-1">
                {gameState.xp} / {xpNeeded} XP para o próximo nível ({pct}%)
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="space-y-4">
            <h4 className={`text-xs font-mono font-extrabold tracking-widest uppercase flex items-center gap-1.5 border-t pt-4 transition-colors duration-300 ${
              isLight ? 'text-slate-500 border-slate-100' : 'text-slate-400 border-slate-900/60'
            }`}>
              <Award className="w-4 h-4 text-sky-400" />
              ATRIBUTOS REGISTRADOS
            </h4>

            <div className="grid grid-cols-2 gap-3">
              {stats.map((s) => (
                <div key={s.label} className={`border rounded-2xl p-4 transition-all duration-300 hover:border-sky-500/25 ${
                  isLight ? 'bg-slate-50/50 border-slate-150' : 'bg-[#050508] border-slate-900'
                }`}>
                  <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wide block">
                    {s.label}
                  </span>
                  <span className={`text-2xl font-black font-display block mt-1 leading-none transition-colors duration-300 ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}>
                    {s.val}
                  </span>
                  <span className={`text-[9px] font-mono block mt-1 uppercase tracking-wider transition-colors duration-300 ${
                    isLight ? 'text-slate-600' : 'text-slate-400'
                  }`}>
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
              SALVAR CARTÃO DE EVOLUÇÃO (PRINT)
            </>
          )}
        </button>
        <p className="text-[10px] text-slate-500 font-mono pt-1 uppercase tracking-wider">
          Mande para seus amigos e desafie eles a subirem de nível!
        </p>
      </div>

      {/* SEÇÃO AVALIAÇÃO FÍSICA & EVOLUÇÃO */}
      {!gameState.avaliacao_concluida && (
        <div className="px-5 space-y-4 animate-in fade-in-50 duration-300">
          <div className="bg-[#07060a] border-2 border-dashed border-slate-800 rounded-3xl p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto">
              <Award className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1">
              <span className="text-[9px] font-mono font-black text-cyan-400 tracking-wider block uppercase">ATUALIZAÇÃO DE SISTEMA DISPONÍVEL</span>
              <h3 className="text-sm font-black text-white uppercase tracking-tight font-display">Aptidão Física Geral</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed max-w-xs mx-auto">
                Realize sua primeira avaliação física para calcular seu nível de Aptidão Física (E-Rank até S-Rank) e calibrar suas missões diárias de acordo com seu corpo!
              </p>
            </div>
            <button
              onClick={() => onTriggerReassessment ? onTriggerReassessment() : null}
              className="w-full py-3 bg-cyan-400 hover:bg-cyan-300 text-black font-mono text-xs font-black tracking-widest uppercase rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 shadow-[0_0_15px_rgba(6,182,212,0.25)]"
            >
              ✨ REALIZAR AVALIAÇÃO AGORA
            </button>
          </div>
        </div>
      )}

      {gameState.avaliacao_concluida && (
        <div className="px-5 space-y-4 animate-in fade-in-50 duration-300">
          <div className="bg-[#07060a] border border-slate-900 rounded-3xl p-5 shadow-lg space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-900/60 pb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
                <Award className="w-4 h-4 text-amber-500" />
              </div>
              <div>
                <span className="text-[9px] font-mono font-black text-amber-500 tracking-wider block uppercase">ANÁLISE DE EVOLUÇÃO</span>
                <h3 className="text-sm font-black text-white uppercase tracking-tight font-display">📊 Avaliação Física</h3>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-[#030205] p-3 rounded-xl border border-slate-900">
                <span className="text-slate-500 font-mono block text-[9px] uppercase">Perfil Fitness</span>
                <span className="text-sm font-black text-amber-400 block mt-1">🏅 {gameState.nivel_fitness || 'Não definido'}</span>
              </div>
              <div className="bg-[#030205] p-3 rounded-xl border border-slate-900">
                <span className="text-slate-500 font-mono block text-[9px] uppercase">Próxima Reavaliação</span>
                <span className={`text-xs font-bold block mt-1 ${!isPremium ? 'text-yellow-500 font-mono' : isReassessmentLocked ? 'text-amber-500 font-mono' : 'text-emerald-400'}`}>
                  {!isPremium ? 'Bloqueada 🔒' : isReassessmentLocked ? reassessmentCountdown : '✓ Disponível agora!'}
                </span>
              </div>
            </div>

            {gameState.missao_personalizada && (
              <div className="bg-[#030205]/60 p-4 rounded-2xl border border-slate-900 space-y-2">
                <span className="text-slate-400 font-mono text-[9px] uppercase block tracking-wider">Missão Personalizada Ativa</span>
                <div className="flex justify-between text-xs font-mono text-slate-300">
                  <span>💪 Flexões: <strong className="text-white">{gameState.missao_personalizada.flexoes}</strong></span>
                  <span>🦵 Agacham: <strong className="text-white">{gameState.missao_personalizada.agachamentos}</strong></span>
                  <span>🔥 Prancha: <strong className="text-white">{gameState.missao_personalizada.prancha}s</strong></span>
                </div>
              </div>
            )}

            {!isPremium ? (
              <button
                onClick={onNavigateToPremium}
                className="w-full py-3 bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-600 text-black font-mono text-xs font-black tracking-widest uppercase rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 shadow-md hover:brightness-110"
              >
                👑 Ativar Reavaliação Inteligente
              </button>
            ) : isReassessmentLocked ? (
              <div className="w-full py-3 bg-[#0c0a0f] border border-slate-900/60 text-slate-500 font-mono text-xs font-bold tracking-wider uppercase rounded-xl flex flex-col items-center justify-center gap-1 shadow-inner select-none">
                <span className="flex items-center gap-1.5 text-[9px] font-black text-amber-500/80 uppercase tracking-widest">
                  <Lock className="w-3.5 h-3.5 text-amber-500/80" /> Reavaliação Bloqueada
                </span>
                <span className="text-sm font-black text-slate-300 font-mono tracking-widest mt-0.5">{reassessmentCountdown}</span>
              </div>
            ) : (
              <button
                onClick={onTriggerReassessment}
                className="w-full py-3 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white font-mono text-xs font-black tracking-widest uppercase rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 shadow-[0_4px_12px_rgba(245,158,11,0.1)]"
              >
                🔄 Realizar Reavaliação Agora
              </button>
            )}
          </div>
        </div>
      )}

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
            Convide amigos para treinar no Fitness Evolution. Fortaleça sua consistência e evoluam juntos, sem recompensas materiais – apenas o poder da comunidade e do progresso mútuo.
          </p>

          {/* Código de Convite */}
          <div className="bg-[#030205] border border-slate-900 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between gap-2 min-w-0">
              <div className="min-w-0 flex-1">
                <span className="text-[9px] font-mono font-bold text-slate-500 uppercase block">SEU CÓDIGO DE CONVITE</span>
                <span className="text-lg font-black font-mono text-sky-400 tracking-wider block mt-0.5 truncate" title={gameState.friendCode || 'FIT-ATLETA'}>
                  {gameState.friendCode && gameState.friendCode.length > 12 
                    ? `${gameState.friendCode.substring(0, 10)}...` 
                    : (gameState.friendCode || 'FIT-ATLETA')}
                </span>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(gameState.friendCode || 'FIT-ATLETA');
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
                const inviteCode = gameState.friendCode || 'FIT-ATLETA';
                const inviteLink = `https://fitnessevolution.vercel.app?ref=${inviteCode}`;
                const shareText = `Estou evoluindo no Fitness Evolution. Venha iniciar sua jornada comigo.\nLink: ${inviteLink}\nCódigo de Convite: ${inviteCode}`;
                
                if (navigator.share) {
                  navigator.share({
                    title: 'Fitness Evolution',
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

      {/* SEÇÃO PREFERÊNCIAS DE SISTEMA (ILUMINAÇÃO E NOTIFICAÇÕES) */}
      <div className="px-5 space-y-4 mt-4">
        <div className={`border rounded-3xl p-5 shadow-lg space-y-5 transition-colors duration-300 ${
          isLight ? 'bg-white border-slate-200' : 'bg-[#07060a] border border-slate-900'
        }`}>
          <div className={`flex items-center gap-2 border-b pb-3 ${isLight ? 'border-slate-100' : 'border-slate-900/60'}`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isLight ? 'bg-sky-50 text-sky-500' : 'bg-sky-50/10 text-sky-400 border border-sky-500/30'
            }`}>
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <span className={`text-[9px] font-mono font-black tracking-wider block uppercase ${
                isLight ? 'text-sky-600' : 'text-sky-400'
              }`}>PREFERÊNCIAS DE INTERFACE</span>
              <h3 className={`text-sm font-black uppercase tracking-tight font-display ${
                isLight ? 'text-slate-800' : 'text-white'
              }`}>⚙️ Configurações & Lembretes</h3>
            </div>
          </div>

          {/* 1. Opção de Iluminação (Tema) */}
          {onToggleTheme && (
            <div className={`flex items-center justify-between border rounded-2xl p-4 transition-colors duration-300 ${
              isLight ? 'bg-slate-50/50 border-slate-100' : 'bg-[#030205] border border-slate-900'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-300 ${
                  isLight ? 'bg-amber-50 border-amber-200 text-amber-500 shadow-sm' : 'bg-sky-950/20 border-sky-900/30 text-amber-400'
                }`}>
                  {isLight ? <Sun className="w-4 h-4 fill-amber-500/10" /> : <Moon className="w-4 h-4" />}
                </div>
                <div>
                  <span className={`text-xs font-black font-mono uppercase block ${isLight ? 'text-slate-800' : 'text-white'}`}>Iluminação (Tema)</span>
                  <span className="text-[10px] font-mono text-slate-500 uppercase block mt-0.5">
                    {isLight ? 'Modo Claro Ativo' : 'Modo Escuro Ativo'}
                  </span>
                </div>
              </div>
              <button
                onClick={onToggleTheme}
                title={isLight ? 'Ativar Modo Escuro' : 'Ativar Modo Claro'}
                className={`w-12 h-6 rounded-full transition-all duration-300 relative p-1 cursor-pointer flex items-center ${
                  isLight ? 'bg-slate-200' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full transition-all duration-300 shadow-md ${
                    isLight ? 'bg-sky-500 translate-x-0' : 'bg-cyan-400 translate-x-6'
                  }`}
                />
              </button>
            </div>
          )}

          {/* 2. Opção de Receber Notificações - Blue Visibility Upgrade */}
          <div className={`flex flex-col gap-3.5 border rounded-2xl p-4 transition-all duration-300 ${
            isLight 
              ? 'bg-blue-50/50 border-blue-200 shadow-sm' 
              : 'bg-[#040612] border border-blue-500/40 shadow-[0_0_12px_rgba(59,130,246,0.1)]'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-300 ${
                  isLight ? 'bg-blue-100 border-blue-300 text-blue-600 shadow-sm' : 'bg-blue-500/20 border-blue-500/40 text-blue-400'
                }`}>
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <span className={`text-xs font-black font-mono uppercase block ${isLight ? 'text-blue-900' : 'text-blue-400'}`}>
                    Ativar Notificações de Treino
                  </span>
                  <span className={`text-[10px] font-mono uppercase block mt-0.5 ${gameState.notificacoes_ativas ? 'text-emerald-400 font-extrabold' : 'text-blue-300/80'}`}>
                    {gameState.notificacoes_ativas ? 'STATUS: ATIVADO' : 'STATUS: DESATIVADO'}
                  </span>
                </div>
              </div>
              <button
                onClick={async () => {
                  if (gameState.notificacoes_ativas) {
                    onUpdateGameState({
                      ...gameState,
                      notificacoes_ativas: false
                    });
                  } else {
                    const { requestNotificationPermission } = await import('../lib/notifications');
                    const token = await requestNotificationPermission();
                    if (token) {
                      onUpdateGameState({
                        ...gameState,
                        notificacoes_ativas: true,
                        notificacoes_token: token
                      });
                    } else {
                      alert("Para ativar as notificações, permita o acesso nas configurações do navegador.");
                    }
                  }
                }}
                className={`w-12 h-6 rounded-full transition-all duration-300 relative p-1 cursor-pointer flex items-center ${
                  gameState.notificacoes_ativas ? 'bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.5)]' : 'bg-blue-950 border border-blue-500/50'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full transition-all duration-300 shadow-sm ${
                    gameState.notificacoes_ativas 
                      ? 'bg-white translate-x-6' 
                      : 'bg-blue-400 translate-x-0'
                  }`}
                />
              </button>
            </div>
            {!gameState.notificacoes_ativas && (
              <span className={`text-[9.5px] font-mono block ${isLight ? 'text-blue-800' : 'text-blue-400/90'}`}>
                ℹ️ Clique no seletor azul para receber alertas diários de treinos e streaks.
              </span>
            )}
          </div>

          {gameState.notificacoes_ativas && (
            <div className="space-y-4 animate-fadeIn">
              {/* Escolha de dias de treino */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wide block">Dias Programados para Treino</span>
                <div className="flex justify-between gap-1">
                  {[
                    { id: 'Seg', label: 'S' },
                    { id: 'Ter', label: 'T' },
                    { id: 'Qua', label: 'Q' },
                    { id: 'Qui', label: 'Q' },
                    { id: 'Sex', label: 'S' },
                    { id: 'Sab', label: 'S' },
                    { id: 'Dom', label: 'D' }
                  ].map((day) => {
                    const currentDays = gameState.cronograma_dias || ['Seg', 'Qua', 'Sex'];
                    const isSelected = currentDays.includes(day.id);
                    return (
                      <button
                        key={day.id}
                        onClick={() => {
                          let updatedDays;
                          if (isSelected) {
                            updatedDays = currentDays.filter(d => d !== day.id);
                          } else {
                            updatedDays = [...currentDays, day.id];
                          }
                          onUpdateGameState({
                            ...gameState,
                            cronograma_dias: updatedDays
                          });
                        }}
                        className={`w-9 h-9 border font-mono font-bold text-xs flex items-center justify-center transition-all cursor-pointer rounded-lg ${
                          isSelected
                            ? 'bg-[#040a12]/40 border-cyan-400 text-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.3)]'
                            : 'bg-[#0c0a0f]/80 border-slate-900 text-slate-500 hover:border-slate-850'
                        }`}
                      >
                        {day.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Janela preferida */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wide block">Horário Preferido (Janela)</span>
                <div className="grid grid-cols-2 gap-2">
                  {['Manhã', 'Tarde', 'Noite', 'Madrugada'].map((windowName) => {
                    const isSelected = gameState.cronograma_janela === windowName;
                    return (
                      <button
                        key={windowName}
                        onClick={() => {
                          onUpdateGameState({
                            ...gameState,
                            cronograma_janela: windowName
                          });
                        }}
                        className={`py-2 px-3 border text-center transition-all duration-200 cursor-pointer rounded-xl text-xs font-bold uppercase tracking-wider ${
                          isSelected
                            ? 'bg-[#040a12]/40 border-cyan-400 text-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.25)]'
                            : 'bg-[#0c0a0f]/80 border-slate-900 text-slate-500 hover:border-slate-850'
                        }`}
                      >
                        {windowName}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* CENTRAL DE NOTIFICAÇÕES INTELIGENTES (INTERACTIVE HUB) */}
              <div className={`mt-4 border-t pt-4 space-y-4 ${isLight ? 'border-slate-100' : 'border-slate-900/60'}`}>
                <div>
                  <span className={`text-[10px] font-mono font-extrabold tracking-wider block uppercase ${isLight ? 'text-cyan-600' : 'text-cyan-400'}`}>
                    CENTRAL DE NOTIFICAÇÕES INTELIGENTES
                  </span>
                  <p className="text-[10.5px] text-slate-500 font-medium leading-relaxed mt-0.5">
                    O sistema seleciona mensagens aleatórias e evita que a mesma se repita em dias consecutivos. Escolha uma categoria para inspecionar e testar o algoritmo:
                  </p>
                </div>

                {/* Seleção de Categoria */}
                <div className="grid grid-cols-4 gap-1.5">
                  {(Object.keys(NOTIFICATION_DATABASE) as NotificationCategory[]).map((catKey) => {
                    const cat = NOTIFICATION_DATABASE[catKey];
                    const isCatSelected = selectedNotificationCategory === catKey;
                    return (
                      <button
                        key={catKey}
                        onClick={() => setSelectedNotificationCategory(catKey)}
                        title={cat.name}
                        className={`py-1.5 rounded-xl border text-base flex flex-col items-center justify-center transition-all cursor-pointer ${
                          isCatSelected
                            ? 'bg-cyan-500/10 border-cyan-400 text-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.15)]'
                            : (isLight ? 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300' : 'bg-[#0c0a0f]/80 border-slate-900 text-slate-400 hover:border-slate-800')
                        }`}
                      >
                        <span>{cat.icon}</span>
                        <span className="text-[7.5px] font-bold font-mono uppercase tracking-tight mt-0.5 max-w-full truncate px-1">
                          {cat.name.split(' ')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Painel da Categoria Selecionada */}
                {selectedNotificationCategory && (() => {
                  const catInfo = NOTIFICATION_DATABASE[selectedNotificationCategory];
                  const history = loadNotificationHistory();
                  const catHist = history[selectedNotificationCategory] || { lastSentText: '', usedTexts: [] };
                  
                  return (
                    <div className={`rounded-2xl p-3.5 border space-y-3 transition-all ${
                      isLight ? 'bg-slate-50/50 border-slate-200/60' : 'bg-[#030205] border-slate-900'
                    }`}>
                      {/* Header da categoria */}
                      <div className="flex items-start gap-2.5">
                        <span className="text-2xl">{catInfo.icon}</span>
                        <div className="space-y-0.5">
                          <h4 className={`text-xs font-extrabold uppercase font-display tracking-tight ${isLight ? 'text-slate-800' : 'text-white'}`}>
                            {catInfo.name}
                          </h4>
                          <p className="text-[10px] text-slate-500 leading-normal font-medium">
                            {catInfo.description}
                          </p>
                        </div>
                      </div>

                      {/* Mensagens disponíveis na categoria */}
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wide block">
                          Banco de Mensagens ({catInfo.messages.length})
                        </span>
                        <div className="max-h-24 overflow-y-auto space-y-1 pr-1 scrollbar-thin scrollbar-thumb-slate-800">
                          {catInfo.messages.map((msg, i) => {
                            const isLastSent = msg === catHist.lastSentText;
                            const isUsedInCycle = catHist.usedTexts.includes(msg);
                            
                            return (
                              <div
                                key={i}
                                className={`p-2 rounded-xl text-[10px] leading-snug border transition-all ${
                                  isLastSent
                                    ? (isLight ? 'bg-amber-50/70 border-amber-200 text-amber-800' : 'bg-amber-950/20 border-amber-500/20 text-amber-300')
                                    : isUsedInCycle
                                    ? (isLight ? 'bg-slate-100 border-slate-200 text-slate-500' : 'bg-slate-900/40 border-slate-900 text-slate-400')
                                    : (isLight ? 'bg-white border-slate-100 text-slate-700' : 'bg-[#08070c] border-slate-950 text-slate-300')
                                }`}
                              >
                                <div className="flex items-center justify-between gap-1.5">
                                  <span className="flex-1">{msg}</span>
                                  {isLastSent && (
                                    <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[7.5px] font-mono uppercase font-extrabold shrink-0">
                                      Última Enviada
                                    </span>
                                  )}
                                  {!isLastSent && isUsedInCycle && (
                                    <span className="text-slate-500 text-[7.5px] font-mono uppercase font-bold shrink-0">
                                      No ciclo
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Status do algoritmo de repetição */}
                      <div className={`p-2 rounded-xl border flex items-center justify-between text-[9.5px] font-mono ${
                        isLight ? 'bg-slate-100/50 border-slate-150' : 'bg-[#09080d] border-slate-950'
                      }`}>
                        <div className="space-y-0.5">
                          <span className="text-slate-500 uppercase block">STATUS DO ALGORITMO:</span>
                          <span className={`${isLight ? 'text-emerald-700' : 'text-emerald-400'} font-bold uppercase block`}>
                            🛡️ Garantia de não-repetição ativa
                          </span>
                        </div>
                        <div className="text-right space-y-0.5">
                          <span className="text-slate-500 uppercase block">CICLO ATUAL:</span>
                          <span className={`${isLight ? 'text-sky-700 font-bold' : 'text-sky-400'} uppercase block`}>
                            {catHist.usedTexts.length} / {catInfo.messages.length} UTILIZADAS
                          </span>
                        </div>
                      </div>

                      {/* Ações */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => {
                            resetNotificationHistory(selectedNotificationCategory);
                            setNotificationLogs(prev => [
                              `[${new Date().toLocaleTimeString('pt-BR')}] Histórico limpo para a categoria "${catInfo.name}".`,
                              ...prev
                            ]);
                          }}
                          className={`py-2 text-[10px] font-mono font-bold uppercase rounded-xl border transition-all flex items-center justify-center gap-1 cursor-pointer ${
                            isLight
                              ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600'
                              : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-400'
                          }`}
                        >
                          <RotateCcw className="w-3 h-3" />
                          Limpar Histórico
                        </button>

                        <button
                          onClick={async () => {
                            const { triggerTestNotification } = await import('../lib/notifications');
                            const { title, body } = getIntelligentMessage(selectedNotificationCategory);
                            await triggerTestNotification(title, body);
                            
                            setNotificationLogs(prev => [
                              `[${new Date().toLocaleTimeString('pt-BR')}] [Faro Inteligente] Escolhido: "${body}"`,
                              ...prev
                            ]);
                          }}
                          className="py-2 bg-[#040a12]/50 hover:bg-cyan-950/20 border border-cyan-500/20 hover:border-cyan-500/50 text-cyan-400 font-mono font-bold uppercase text-[10px] rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3 animate-bounce" />
                          Simular Envio
                        </button>
                      </div>
                    </div>
                  );
                })()}

                {/* Histórico/Log do Simulador */}
                {notificationLogs.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wide">
                        LOG DO MOTOR DE SELEÇÃO
                      </span>
                      <button
                        onClick={() => setNotificationLogs([])}
                        className="text-[8px] font-mono text-red-400 hover:text-red-300 uppercase underline"
                      >
                        Limpar Logs
                      </button>
                    </div>
                    <div className={`p-2.5 rounded-xl border max-h-24 overflow-y-auto font-mono text-[9px] space-y-1 ${
                      isLight ? 'bg-slate-100 border-slate-200 text-slate-600' : 'bg-[#030205] border-slate-950 text-slate-400'
                    }`}>
                      {notificationLogs.map((log, index) => (
                        <div key={index} className="border-b border-slate-900/10 last:border-0 pb-1 last:pb-0 leading-normal">
                          {log}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}
        </div>
      </div>

      {/* Danger Zone Controls */}
      <div className="px-5 pt-2 space-y-3">
        {user ? (
          <button
            onClick={onLogout}
            className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold font-mono tracking-wider text-xs uppercase rounded-xl flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
          >
            Sair da Conta (Logout)
          </button>
        ) : (
          <button
            onClick={onLoginTrigger}
            className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-black font-mono tracking-wider text-xs uppercase rounded-xl flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-[0_4px_15px_rgba(6,182,212,0.25)]"
          >
            Conectar Conta / Fazer Login
          </button>
        )}

        <button
          onClick={onReset}
          className="w-full py-3.5 bg-red-950/10 hover:bg-red-950/30 border border-red-900/20 text-red-400 font-bold font-mono tracking-wider text-xs uppercase rounded-xl flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          Zerar Histórico de Treino
        </button>
      </div>
    </div>
  );
};
