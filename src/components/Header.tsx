import React from 'react';
import { Dumbbell, Search, LogOut } from 'lucide-react';

interface HeaderProps {
  userEmail?: string | null;
  onSignOut?: () => void;
  onSearchClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ userEmail, onSignOut, onSearchClick }) => {
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
            <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-400 block mt-0.5">
              Sketchnote · v2.0
            </span>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Search Icon */}
          {onSearchClick && (
            <button
              onClick={onSearchClick}
              className="w-10 h-10 rounded-xl border-2 border-black bg-white text-black flex items-center justify-center nb-shadow-sm nb-press hover:bg-zinc-50 transition-colors"
              title="Rechercher un exercice"
              aria-label="Ouvrir la recherche"
            >
              <Search className="w-5 h-5" />
            </button>
          )}

          {/* Logout — icon only, visually separated */}
          {onSignOut && (
            <button
              onClick={onSignOut}
              className="w-10 h-10 rounded-xl border-2 border-black bg-black text-white flex items-center justify-center nb-shadow-sm nb-press hover:bg-zinc-800 transition-colors"
              title={userEmail ? `Déconnexion (${userEmail})` : 'Déconnexion'}
              aria-label="Se déconnecter"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
