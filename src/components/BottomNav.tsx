import React from 'react';
import { Home, Swords, Trophy, BarChart3, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'missions', label: 'Missões', icon: Swords },
    { id: 'achievements', label: 'Conquistas', icon: Trophy },
    { id: 'ranking', label: 'Ranking', icon: BarChart3 },
    { id: 'profile', label: 'Perfil', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-18 bg-[#12101a]/95 backdrop-blur-md border-t border-red-950/40 flex items-center justify-around z-40 max-w-md mx-auto shadow-2xl">
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
              <span className="absolute top-0 left-1/4 right-1/4 h-[3px] bg-red-600 rounded-b-full shadow-[0_2px_8px_rgba(220,38,38,0.5)]" />
            )}

            <div
              className={`p-1.5 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'text-red-500 scale-110 bg-red-950/20'
                  : 'text-slate-500 group-hover:text-slate-300'
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>

            <span
              className={`text-[10px] font-mono tracking-wider font-semibold transition-all duration-200 ${
                isActive ? 'text-red-400 font-bold' : 'text-slate-500 group-hover:text-slate-300'
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
