import React from 'react';
import { ViewMode } from '../types';
import { LayoutGrid, Dumbbell, FolderKanban, Heart, Play, LogOut } from 'lucide-react';

interface BottomNavProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  favoritesCount: number;
  workoutsCount: number;
  hasActiveSession?: boolean;
  onLaunchActiveSession?: () => void;
  onSignOut?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentView,
  onNavigate,
  favoritesCount,
  workoutsCount,
  hasActiveSession = false,
  onLaunchActiveSession,
  onSignOut,
}) => {
  const tabs = [
    { id: 'home' as ViewMode, icon: LayoutGrid, label: 'Zones' },
    { id: 'list' as ViewMode, icon: Dumbbell, label: 'Exercices' },
    { id: 'workouts' as ViewMode, icon: FolderKanban, label: 'Séances', count: workoutsCount },
    { id: 'favorites' as ViewMode, icon: Heart, label: 'Favoris', count: favoritesCount },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t-[3px] border-black px-3 py-2 pb-safe">

      {/* Active Session Pill */}
      {hasActiveSession && currentView !== 'active-workout' && onLaunchActiveSession && (
        <button
          onClick={onLaunchActiveSession}
          className="w-full mb-2 bg-black text-white py-2.5 px-4 rounded-xl border-2 border-black nb-shadow-sm nb-press flex items-center justify-between font-body font-bold text-xs tracking-wide"
        >
          <div className="flex items-center gap-2">
            <Play className="w-4 h-4 fill-white" />
            <span>Séance en cours</span>
          </div>
          <span className="font-mono text-[10px] bg-white/20 px-2 py-0.5 rounded-md">
            Reprendre →
          </span>
        </button>
      )}

      <div className="flex items-center max-w-md mx-auto gap-1">
        {/* Nav Tabs */}
        <div className="flex items-center justify-around flex-1">
          {tabs.map(({ id, icon: Icon, label, count }) => {
            const isActive = currentView === id;
            return (
              <button
                key={id}
                onClick={() => onNavigate(id)}
                className={`relative flex flex-col items-center py-1.5 px-3 rounded-xl transition-all nb-press ${
                  isActive
                    ? 'bg-black text-white border-2 border-black nb-shadow-sm'
                    : 'text-zinc-500 hover:text-black border-2 border-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive && id === 'favorites' ? 'fill-white' : ''}`} />
                <span className="font-body text-[9px] font-bold uppercase tracking-wider mt-1">
                  {label}
                </span>
                {count !== undefined && count > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-black text-white font-mono text-[9px] flex items-center justify-center font-bold border border-white">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Separator */}
        {onSignOut && (
          <div className="w-[2px] h-8 bg-black rounded-full mx-1 shrink-0" />
        )}

        {/* Logout — séparé visuellement */}
        {onSignOut && (
          <button
            onClick={onSignOut}
            className="flex flex-col items-center py-1.5 px-2.5 rounded-xl text-zinc-400 hover:text-black border-2 border-transparent hover:border-black hover:nb-shadow-sm transition-all nb-press shrink-0"
            title="Se déconnecter"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-body text-[9px] font-bold uppercase tracking-wider mt-1">
              Exit
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
