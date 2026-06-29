import React from 'react';
import { LogOut, Swords, Shield, Sun, Moon, Crown } from 'lucide-react';
import fitnessRpgLogo from '../assets/images/blue_crest_logo_1782655072782.jpg';

interface HeaderProps {
  email: string | null;
  onLogout: () => void;
  activeTab: string;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
  isPremium?: boolean;
  onNavigateToPremium?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  email, 
  onLogout, 
  activeTab, 
  theme = 'dark', 
  onToggleTheme,
  isPremium = false,
  onNavigateToPremium
}) => {
  // Generate current week dates or a static high-fidelity list modeled after the reference mockup
  // Today's date info
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 is Sunday, 1 is Monday, etc.
  
  // Create an array of 7 days centered around today or corresponding to the current week
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    // Offset relative to Monday of this week or simply centered on today
    const diff = i - (dayOfWeek === 0 ? 6 : dayOfWeek - 1); // Align so Monday is first
    d.setDate(today.getDate() + diff);
    return {
      num: d.getDate(),
      isToday: d.getDate() === today.getDate() && d.getMonth() === today.getMonth(),
      dayName: d.toLocaleDateString('pt-BR', { weekday: 'short' }).substring(0, 1),
    };
  });

  // Calculate high-fidelity title based on active tab matching references (e.g. TRAINING, EVOLUTION, RANKING)
  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'home':
        return 'PAINEL INICIAL';
      case 'missions':
        return 'TREINOS & METAS';
      case 'achievements':
        return 'CONQUISTAS & RECORDES';
      case 'ranking':
        return 'RANKING DE ATLETAS';
      case 'profile':
        return 'MEU PERFIL FITNESS';
      default:
        return 'EVOLUTION';
    }
  };

  const isLight = theme === 'light';

  return (
    <div className={`pt-4 pb-3 px-5 flex flex-col gap-3 sticky top-0 z-40 relative transition-colors duration-300 ${
      isLight 
        ? 'bg-slate-50 border-b border-slate-200 shadow-sm' 
        : 'bg-[#000000] border-b border-slate-900/80'
    }`}>
      {/* Upper Brand section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-lg overflow-hidden border flex items-center justify-center transition-all ${
            isLight 
              ? 'border-sky-500/25 bg-white shadow-[0_2px_10px_rgba(14,165,233,0.15)]' 
              : 'border-sky-500/30 bg-[#050508] shadow-[0_0_12px_rgba(14,165,233,0.25)]'
          }`}>
            <img 
              src={fitnessRpgLogo} 
              alt="Fitness Evolution Logo" 
              className="w-full h-full object-cover" 
              referrerPolicy="no-referrer" 
            />
          </div>
          <div>
            <h1 className={`text-lg font-black font-display tracking-widest leading-none uppercase transition-colors duration-300 ${
              isLight ? 'text-slate-800' : 'text-white'
            }`}>
              {getHeaderTitle()}
            </h1>
          </div>
        </div>

        {/* Right HUD metrics: theme toggle & logout */}
        <div className="flex items-center gap-2">
          {onNavigateToPremium && (
            <button
              onClick={onNavigateToPremium}
              title={isPremium ? 'Membro Premium Ativo 👑' : 'Seja Premium 👑'}
              className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all duration-200 active:scale-90 ${
                isPremium
                  ? 'bg-gradient-to-r from-yellow-500/15 via-amber-500/10 to-yellow-600/15 border-yellow-500/40 text-yellow-500 shadow-[0_0_12px_rgba(234,179,8,0.25)] animate-pulse'
                  : isLight
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-400 hover:text-slate-600'
                  : 'bg-slate-950/20 hover:bg-slate-950/40 border-slate-900/30 text-slate-500 hover:text-slate-300'
              }`}
            >
              <Crown className="w-4 h-4 fill-current text-yellow-500" />
            </button>
          )}

          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              title={isLight ? 'Ativar Modo Escuro' : 'Ativar Modo Claro'}
              className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all duration-200 active:scale-90 ${
                isLight 
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-amber-500' 
                  : 'bg-sky-950/20 hover:bg-sky-950/40 border-sky-900/30 text-amber-400'
              }`}
            >
              {isLight ? <Moon className="w-4 h-4 fill-amber-500/10" /> : <Sun className="w-4 h-4" />}
            </button>
          )}

          {email && (
            <button
              onClick={onLogout}
              title="Sair"
              className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all duration-200 active:scale-90 ${
                isLight
                  ? 'bg-red-50 hover:bg-red-100 border-red-200 text-red-500'
                  : 'bg-red-950/20 hover:bg-red-950/40 border-red-900/30 text-red-400'
              }`}
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* High-Fidelity Calendar Bar - EXACTLY AS SHOWN ON THE PHONES IN THE SCREENSHOTS */}
      <div className={`flex items-center justify-between p-1.5 rounded-2xl transition-all duration-300 ${
        isLight 
          ? 'bg-slate-100/90 border border-slate-200/60 shadow-inner' 
          : 'bg-[#07060a]/40 border border-slate-900/50'
      }`}>
        {days.map((day, idx) => (
          <div
            key={idx}
            className="flex-1 flex flex-col items-center justify-center"
          >
            {day.isToday ? (
              <div className={`w-9 h-9 rounded-full flex flex-col items-center justify-center font-black transition-all ${
                isLight 
                  ? 'bg-slate-950 text-white shadow-[0_3px_12px_rgba(15,23,42,0.3)]' 
                  : 'bg-white text-black shadow-[0_2px_10px_rgba(255,255,255,0.4)]'
              }`}>
                <span className="text-[12px] font-mono leading-none">{day.num}</span>
                <span className="text-[7px] font-mono font-black tracking-widest uppercase mt-0.5 leading-none">
                  {day.dayName}
                </span>
              </div>
            ) : (
              <div className={`w-8 h-8 rounded-full bg-transparent flex flex-col items-center justify-center transition-all ${
                isLight 
                  ? 'hover:bg-slate-200 text-slate-600 hover:text-slate-900' 
                  : 'hover:bg-slate-900/40 text-slate-400 hover:text-slate-200'
              }`}>
                <span className="text-[11px] font-mono font-bold leading-none">{day.num}</span>
                <span className={`text-[7px] font-mono leading-none mt-0.5 ${
                  isLight ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  {day.dayName}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
