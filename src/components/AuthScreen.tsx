import React from 'react';
import { Dumbbell, LogIn, Zap } from 'lucide-react';

interface AuthScreenProps {
  onSignInWithGoogle: () => void;
  isLoading?: boolean;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onSignInWithGoogle, isLoading }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 px-6 relative overflow-hidden">
      {/* Background glow blobs */}
      <div className="absolute top-[-120px] left-[-80px] w-[400px] h-[400px] rounded-full bg-blue-600/20 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-80px] right-[-60px] w-[320px] h-[320px] rounded-full bg-indigo-500/20 blur-[80px] pointer-events-none" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm">

        {/* Logo & Brand */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/40 mb-4">
            <Dumbbell className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white uppercase">
            GymHack
          </h1>
          <p className="text-slate-400 text-sm mt-1.5 text-center">
            Bibliothèque de 1&nbsp;324 exercices · Suivi de séances
          </p>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {[
            '💪 1 324 exercices',
            '🎬 GIFs animés',
            '🔖 Favoris',
            '📋 Séances personnalisées',
            '🌍 10 langues',
          ].map((label) => (
            <span
              key={label}
              className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium"
            >
              {label}
            </span>
          ))}
        </div>

        {/* Sign-in card */}
        <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 shadow-2xl">
          <p className="text-center text-xs text-slate-400 uppercase tracking-widest font-semibold mb-5">
            Connexion
          </p>

          {/* Google OAuth Button */}
          <button
            id="btn-google-signin"
            onClick={onSignInWithGoogle}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-900 font-semibold text-sm py-3.5 rounded-2xl transition-all shadow-md disabled:opacity-60"
          >
            {/* Google logo */}
            <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            {isLoading ? 'Connexion…' : 'Continuer avec Google'}
          </button>

          <div className="mt-5 flex items-center gap-3 text-slate-600">
            <div className="flex-1 h-px bg-slate-700" />
            <span className="text-xs">ou</span>
            <div className="flex-1 h-px bg-slate-700" />
          </div>

          <p className="text-center text-[11px] text-slate-500 mt-4 leading-relaxed">
            En vous connectant, vous acceptez nos conditions d'utilisation.
            Vos données sont synchronisées de façon sécurisée via Supabase.
          </p>
        </div>

        {/* Offline badge */}
        <div className="flex items-center justify-center gap-1.5 mt-6 text-[11px] text-slate-500">
          <Zap className="w-3 h-3 text-emerald-500" />
          <span>Application PWA — fonctionnel hors-ligne après la première connexion</span>
        </div>
      </div>
    </div>
  );
};
