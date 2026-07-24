import React from 'react';
import { ViewMode } from '../types';
import { LayoutGrid, Dumbbell, FolderKanban, Heart, Play } from 'lucide-react';

interface BottomNavProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  favoritesCount: number;
  workoutsCount: number;
  hasActiveSession?: boolean;
  onLaunchActiveSession?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentView,
  onNavigate,
  favoritesCount,
  workoutsCount,
  hasActiveSession = false,
  onLaunchActiveSession,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-3 py-2 pb-safe shadow-lg">
      {/* Optional Active Session Floating Pill bar if session in progress */}
      {hasActiveSession && currentView !== 'active-workout' && onLaunchActiveSession && (
        <button
          onClick={onLaunchActiveSession}
          className="w-full mb-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-xl flex items-center justify-between shadow-md text-xs font-semibold tracking-wide transition-colors"
        >
          <div className="flex items-center gap-2">
            <Play className="w-4 h-4 fill-white" />
            <span>Séance en cours</span>
          </div>
          <span className="text-[10px] bg-black/20 px-2 py-0.5 rounded-full font-mono">
            Reprendre →
          </span>
        </button>
      )}

      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Tab 1: Accueil (Zones Anatomiques) */}
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
            currentView === 'home'
              ? 'text-blue-600 font-semibold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <LayoutGrid className="w-5 h-5" />
          <span className="text-[10px] uppercase tracking-wider mt-1">
            Zones
          </span>
        </button>

        {/* Tab 2: Exercices (Catalogue & Filtres) */}
        <button
          onClick={() => onNavigate('list')}
          className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
            currentView === 'list'
              ? 'text-blue-600 font-semibold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Dumbbell className="w-5 h-5" />
          <span className="text-[10px] uppercase tracking-wider mt-1">
            Exercices
          </span>
        </button>

        {/* Tab 3: Mes Séances (Folders / Playlists) */}
        <button
          onClick={() => onNavigate('workouts')}
          className={`relative flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
            currentView === 'workouts'
              ? 'text-blue-600 font-semibold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <FolderKanban className="w-5 h-5" />
          <span className="text-[10px] uppercase tracking-wider mt-1">
            Séances
          </span>
          {workoutsCount > 0 && (
            <span className="absolute top-0 right-2 w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-mono flex items-center justify-center font-bold">
              {workoutsCount}
            </span>
          )}
        </button>

        {/* Tab 4: Favoris */}
        <button
          onClick={() => onNavigate('favorites')}
          className={`relative flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
            currentView === 'favorites'
              ? 'text-emerald-600 font-semibold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Heart className={`w-5 h-5 ${currentView === 'favorites' ? 'fill-emerald-600' : ''}`} />
          <span className="text-[10px] uppercase tracking-wider mt-1">
            Favoris
          </span>
          {favoritesCount > 0 && (
            <span className="absolute top-0 right-2 w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-mono flex items-center justify-center font-bold">
              {favoritesCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
