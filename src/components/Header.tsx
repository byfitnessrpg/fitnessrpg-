import React from 'react';
import { LogOut, Swords, Shield } from 'lucide-react';

interface HeaderProps {
  email: string | null;
  onLogout: () => void;
  activeTab: string;
}

export const Header: React.FC<HeaderProps> = ({ email, onLogout, activeTab }) => {
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

  // Calculate high-fidelity title based on active tab matching references (e.g. TRAINING, ARISE AI, RANKING)
  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'home':
        return 'SISTEMA PRINCIPAL';
      case 'missions':
        return 'TREINAMENTO';
      case 'achievements':
        return 'CONQUISTAS';
      case 'ranking':
        return 'CLASSIFICAÇÃO';
      case 'profile':
        return 'PERFIL DO CAÇADOR';
      default:
        return 'SISTEMA PRINCIPAL';
    }
  };

  return (
    <div className="bg-[#000000] border-b border-slate-900/80 pt-4 pb-3 px-5 flex flex-col gap-3 sticky top-0 z-40 relative">
      {/* Upper Brand section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-black border border-sky-500/30 flex items-center justify-center shadow-[0_0_10px_rgba(14,165,233,0.15)]">
            <Shield className="w-4.5 h-4.5 text-sky-400" />
          </div>
          <div>
            <h1 className="text-lg font-black font-display tracking-widest text-white leading-none uppercase">
              {getHeaderTitle()}
            </h1>
          </div>
        </div>

        {/* Right HUD metrics: logout */}
        <div className="flex items-center gap-3">
          {email && (
            <button
              onClick={onLogout}
              title="Sair da arena"
              className="w-8 h-8 rounded-lg bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 text-red-400 flex items-center justify-center transition-all duration-200 active:scale-90"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* High-Fidelity Calendar Bar - EXACTLY AS SHOWN ON THE PHONES IN THE SCREENSHOTS */}
      <div className="flex items-center justify-between bg-[#07060a]/40 border border-slate-900/50 p-1.5 rounded-2xl">
        {days.map((day, idx) => (
          <div
            key={idx}
            className="flex-1 flex flex-col items-center justify-center"
          >
            {day.isToday ? (
              <div className="w-9 h-9 rounded-full bg-white flex flex-col items-center justify-center text-black font-black shadow-[0_2px_10px_rgba(255,255,255,0.4)] transition-all">
                <span className="text-[12px] font-mono leading-none">{day.num}</span>
                <span className="text-[7px] font-mono font-black tracking-widest uppercase mt-0.5 leading-none">
                  {day.dayName}
                </span>
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-transparent hover:bg-slate-900/40 flex flex-col items-center justify-center text-slate-400 hover:text-slate-200 transition-all">
                <span className="text-[11px] font-mono font-bold leading-none">{day.num}</span>
                <span className="text-[7px] font-mono text-slate-500 leading-none mt-0.5">
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
