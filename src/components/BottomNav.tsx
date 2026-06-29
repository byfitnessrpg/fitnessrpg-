import React from 'react';
import { Home, Dumbbell, Trophy, BarChart3, User, TrendingUp, Users, Crown } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  theme?: 'dark' | 'light';
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, theme = 'dark' }) => {
  const isLight = theme === 'light';
  const navItems = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'missions', label: 'Treinos', icon: Dumbbell },
    { id: 'evolution', label: 'Evolução', icon: TrendingUp },
    { id: 'achievements', label: 'Conquistas', icon: Trophy },
    { id: 'ranking', label: 'Amigos', icon: Users },
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'premium', label: 'Premium', icon: Crown },
  ];


  return (
    <nav className={`fixed bottom-0 left-0 right-0 h-18 backdrop-blur-md flex items-center justify-around z-40 max-w-md mx-auto transition-all duration-300 ${
      isLight 
        ? 'bg-white/95 border-t border-slate-200/80 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]' 
        : 'bg-[#050508]/95 border-t border-slate-900 shadow-2xl'
    }`}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className="flex-1 h-full flex flex-col items-center justify-center gap-1 text-xs transition-all duration-200 relative group overflow-hidden active:scale-95"
          >
            {/* Liquid selection bar */}
            {isActive && (
              <span className={`absolute top-0 left-1/4 right-1/4 h-[3px] rounded-b-full transition-all duration-300 ${
                isLight 
                  ? 'bg-sky-500 shadow-[0_2px_8px_rgba(14,165,233,0.4)]' 
                  : 'bg-sky-400 rounded-b-full shadow-[0_2px_10px_rgba(14,165,233,0.6)]'
              }`} />
            )}

            <div
              className={`p-1.5 rounded-xl transition-all duration-300 ${
                isActive
                  ? (isLight ? 'text-sky-600 scale-110 bg-sky-50 font-bold' : 'text-sky-400 scale-110 bg-sky-950/20')
                  : (isLight ? 'text-slate-400 group-hover:text-slate-600' : 'text-slate-500 group-hover:text-slate-300')
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>

            <span
              className={`text-[9px] font-mono tracking-wider font-semibold transition-all duration-200 uppercase ${
                isActive 
                  ? (isLight ? 'text-sky-600 font-bold' : 'text-sky-400 font-bold') 
                  : (isLight ? 'text-slate-400 group-hover:text-slate-600' : 'text-slate-500 group-hover:text-slate-300')
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
