import React from 'react';
import { LogOut, Swords, User } from 'lucide-react';

interface HeaderProps {
  email: string | null;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ email, onLogout }) => {
  return (
    <div className="bg-[#050508]/95 backdrop-blur-md border-b border-purple-950/40 px-5 py-3 flex items-center justify-between sticky top-0 z-40">
      {/* Brand logo & title */}
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-blue-500 rounded-xl flex items-center justify-center shadow-[0_4px_12px_rgba(124,58,237,0.3)]">
          <Swords className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="text-[10px] font-mono font-extrabold tracking-widest text-purple-400 block leading-none">SYSTEM</span>
          <span className="text-base font-extrabold font-display text-white leading-none">ARISE WORKOUT</span>
        </div>
      </div>

      {/* User info & Logout */}
      {email && (
        <div className="flex items-center gap-3">
          <div className="hidden xs:flex flex-col items-end text-right">
            <span className="text-[10px] font-mono text-slate-500 uppercase">Status do Caçador</span>
            <span className="text-xs text-slate-300 font-medium max-w-[140px] truncate">{email}</span>
          </div>
          <button
            onClick={onLogout}
            title="Sair da arena"
            className="w-8 h-8 rounded-lg bg-purple-950/20 hover:bg-purple-950/50 border border-purple-900/30 text-purple-400 flex items-center justify-center transition-all duration-200 active:scale-90"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
