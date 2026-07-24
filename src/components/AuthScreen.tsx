import React, { useState } from 'react';
import {
  Dumbbell,
  Mail,
  Lock,
  AlertCircle,
  CheckCircle,
  Zap,
  ArrowRight,
  Loader2,
  Film,
  Bookmark,
  FolderPlus,
  Globe,
  KeyRound,
  HelpCircle,
} from 'lucide-react';

interface AuthScreenProps {
  onSignInWithGoogle: () => void;
  onSignInWithEmail: (email: string, pass: string) => Promise<void>;
  onSignUpWithEmail: (email: string, pass: string) => Promise<void>;
  onResetPassword: (email: string) => Promise<void>;
  isLoading?: boolean;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onSignInWithGoogle,
  onSignInWithEmail,
  onSignUpWithEmail,
  onResetPassword,
  isLoading = false,
}) => {
  const [mode, setMode]                 = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg]         = useState<string | null>(null);
  const [successMsg, setSuccessMsg]     = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setErrorMsg(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        if (!password) return;
        await onSignInWithEmail(email, password);
      } else if (mode === 'signup') {
        if (!password) return;
        await onSignUpWithEmail(email, password);
        setSuccessMsg(
          'Un email de confirmation vous a été envoyé via Brevo ! Veuillez vérifier votre boîte de réception.',
        );
      } else if (mode === 'forgot') {
        await onResetPassword(email);
        setSuccessMsg(
          'Un email de réinitialisation de mot de passe vous a été envoyé via Brevo !',
        );
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Une erreur est survenue';
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 px-4 py-8 relative overflow-hidden">
      {/* Background glow blobs */}
      <div className="absolute top-[-120px] left-[-80px] w-[400px] h-[400px] rounded-full bg-blue-600/20 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-80px] right-[-60px] w-[320px] h-[320px] rounded-full bg-indigo-500/20 blur-[80px] pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-sm">

        {/* Logo & Brand */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/40 mb-3">
            <Dumbbell className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white uppercase">
            GymHack
          </h1>
          <p className="text-slate-400 text-xs mt-1 text-center">
            Bibliothèque de 1&nbsp;324 exercices · Suivi de séances
          </p>
        </div>

        {/* Feature pills (Lucide icons replacing emojis) */}
        <div className="flex flex-wrap gap-1.5 justify-center mb-6">
          {[
            { icon: Dumbbell, label: '1 324 exercices' },
            { icon: Film, label: 'GIFs animés' },
            { icon: Bookmark, label: 'Favoris' },
            { icon: FolderPlus, label: 'Séances' },
            { icon: Globe, label: '10 langues' },
          ].map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700/80 text-slate-300 text-[11px] font-medium flex items-center gap-1.5"
            >
              <Icon className="w-3 h-3 text-blue-400" />
              <span>{label}</span>
            </span>
          ))}
        </div>

        {/* Auth Card */}
        <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-700/60 rounded-3xl p-6 shadow-2xl">

          {/* Mode Switcher Tabs */}
          {mode !== 'forgot' && (
            <div className="grid grid-cols-2 p-1 bg-slate-900/60 rounded-2xl mb-5 border border-slate-700/50">
              <button
                onClick={() => { setMode('login'); setErrorMsg(null); setSuccessMsg(null); }}
                className={`py-2 rounded-xl text-xs font-semibold transition-all ${
                  mode === 'login'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Connexion
              </button>
              <button
                onClick={() => { setMode('signup'); setErrorMsg(null); setSuccessMsg(null); }}
                className={`py-2 rounded-xl text-xs font-semibold transition-all ${
                  mode === 'signup'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Inscription
              </button>
            </div>
          )}

          {/* Title for Forgot Password Mode */}
          {mode === 'forgot' && (
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-700/60">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <KeyRound className="w-4 h-4 text-blue-400" />
                <span>Réinitialisation du mot de passe</span>
              </div>
              <button
                onClick={() => { setMode('login'); setErrorMsg(null); setSuccessMsg(null); }}
                className="text-xs text-blue-400 hover:underline"
              >
                Retour
              </button>
            </div>
          )}

          {/* Google OAuth Button (hidden in forgot mode) */}
          {mode !== 'forgot' && (
            <>
              <button
                id="btn-google-signin"
                onClick={onSignInWithGoogle}
                disabled={isLoading || isSubmitting}
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-900 font-semibold text-xs py-3 rounded-2xl transition-all shadow-md disabled:opacity-60"
              >
                <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                <span>Continuer avec Google</span>
              </button>

              <div className="my-4 flex items-center gap-3 text-slate-600">
                <div className="flex-1 h-px bg-slate-700/60" />
                <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">ou email</span>
                <div className="flex-1 h-px bg-slate-700/60" />
              </div>
            </>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">
                Adresse Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="gymhack229@gmail.com"
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-semibold uppercase text-slate-400">
                    Mot de passe
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => { setMode('forgot'); setErrorMsg(null); setSuccessMsg(null); }}
                      className="text-[11px] text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <HelpCircle className="w-3 h-3" />
                      <span>Mot de passe oublié ?</span>
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Error Message Alert */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2 text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Success Message Alert */}
            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2 text-emerald-300 text-xs">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Traitement…</span>
                </>
              ) : mode === 'login' ? (
                <>
                  <span>Se connecter</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : mode === 'signup' ? (
                <>
                  <span>Créer mon compte</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Envoyer l'email de réinitialisation</span>
                  <Mail className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Offline / PWA Footer info */}
        <div className="flex items-center justify-center gap-1.5 mt-5 text-[11px] text-slate-500">
          <Zap className="w-3.5 h-3.5 text-emerald-500" />
          <span>Synchronisation automatique via Supabase & Brevo</span>
        </div>
      </div>
    </div>
  );
};
