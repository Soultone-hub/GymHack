import React from 'react';
import { Dumbbell, LogOut, User as UserIcon } from 'lucide-react';

interface HeaderProps {
  userEmail?: string | null;
  onSignOut?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ userEmail, onSignOut }) => {
  return (
    <header className="w-full bg-white border-b-[3px] border-black px-4 py-3 sticky top-0 z-40 nb-shadow">
      <div className="max-w-lg mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center border-2 border-black nb-shadow-sm shrink-0">
            <Dumbbell className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-sketch text-3xl text-black leading-none block" style={{ lineHeight: '1' }}>
              GymHack
            </span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500 block mt-0.5">
              Sketchnote · v2.0
            </span>
          </div>
        </div>

        {/* User Info & Logout */}
        <div className="flex items-center gap-2">
          {userEmail && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border-2 border-black bg-zinc-100 nb-shadow-sm">
              <UserIcon className="w-3.5 h-3.5 shrink-0 text-black" />
              <span className="font-mono text-[10px] font-medium text-black truncate max-w-[120px]">
                {userEmail}
              </span>
            </div>
          )}

          {onSignOut && (
            <button
              onClick={onSignOut}
              className="px-3 py-1.5 rounded-lg border-2 border-black bg-white text-black font-body font-bold text-xs flex items-center gap-1.5 nb-shadow nb-press hover:bg-zinc-100 transition-colors"
              title="Déconnexion"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Quitter</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
