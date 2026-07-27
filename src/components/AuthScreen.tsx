import React, { useState } from 'react';
import {
  Dumbbell, Mail, Lock, AlertCircle, CheckCircle,
  ArrowRight, Loader2, Film, Bookmark, FolderPlus,
  Globe, KeyRound, HelpCircle,
} from 'lucide-react';

interface AuthScreenProps {
  onSignInWithGoogle: () => void;
  onSignInWithEmail: (email: string, pass: string) => Promise<void>;
  onSignUpWithEmail: (email: string, pass: string) => Promise<{ needsConfirmation: boolean }>;
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

  const switchMode = (m: 'login' | 'signup' | 'forgot') => {
    setMode(m); setErrorMsg(null); setSuccessMsg(null);
  };

  const formatAuthError = (err: unknown): string => {
    let rawMsg = '';
    if (typeof err === 'string') {
      rawMsg = err;
    } else if (err && typeof err === 'object') {
      if ('message' in err && typeof (err as { message: unknown }).message === 'string') {
        rawMsg = (err as { message: string }).message;
      } else if ('error_description' in err && typeof (err as { error_description: unknown }).error_description === 'string') {
        rawMsg = (err as { error_description: string }).error_description;
      } else {
        try {
          const str = JSON.stringify(err);
          rawMsg = str !== '{}' ? str : '';
        } catch {
          rawMsg = '';
        }
      }
    }

    const msg = rawMsg.toLowerCase();

    if (!msg || msg === '{}' || msg === 'null' || msg === 'undefined') {
      return 'Une erreur est survenue lors de l\'authentification. Veuillez vérifier vos identifiants ou réessayer.';
    }
    if (msg.includes('invalid login credentials') || msg.includes('invalid_credentials')) {
      return 'Email ou mot de passe incorrect.';
    }
    if (msg.includes('email not confirmed')) {
      return 'Vous devez d\'abord confirmer votre email. Vérifiez votre boîte mail (y compris les spams).';
    }
    if (msg.includes('at least 6 characters') || msg.includes('password should be') || msg.includes('weak_password')) {
      return 'Le mot de passe doit faire au moins 6 caractères.';
    }
    if (msg.includes('rate limit') || msg.includes('too many requests') || msg.includes('over_email_send_rate_limit')) {
      return 'Trop de tentatives en peu de temps. Réessayez dans une minute.';
    }
    if (msg.includes('valid email') || msg.includes('invalid email') || msg.includes('unable to validate')) {
      return 'Adresse email invalide.';
    }
    if (msg.includes('request_timeout') || msg.includes('timeout')) {
      return 'Le serveur prend du temps à répondre. Vérifiez votre connexion internet ou réessayez.';
    }
    if (msg.includes('signup_disabled')) {
      return 'L\'inscription par email est désactivée. Utilisez "Continuer avec Google".';
    }

    return rawMsg;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setErrorMsg(null); setSuccessMsg(null); setIsSubmitting(true);
    try {
      if (mode === 'login') {
        if (!password) return;
        await onSignInWithEmail(email, password);
      } else if (mode === 'signup') {
        if (!password) return;
        const result = await onSignUpWithEmail(email, password);
        if (result.needsConfirmation) {
          setSuccessMsg('Si cette adresse n\'est pas déjà inscrite, un email de confirmation vous a été envoyé. Vérifiez votre boîte mail (et les spams).');
        }
      } else {
        await onResetPassword(email);
        setSuccessMsg('Si un compte existe avec cet email, un lien de réinitialisation a été envoyé. Vérifiez votre boîte mail (et les spams).');
      }
    } catch (err: unknown) {
      setErrorMsg(formatAuthError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-8">

      {/* Brand */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-black flex items-center justify-center border-2 border-black nb-shadow mb-4">
          <Dumbbell className="w-8 h-8 text-white" />
        </div>
        <h1 className="font-sketch text-5xl text-black" style={{ letterSpacing: '0.05em' }}>
          GymHack
        </h1>
        <p className="font-mono text-[11px] text-zinc-500 uppercase tracking-widest mt-2 text-center">
          1 324 exercices · Sketchnote UI · v2.0
        </p>
      </div>

      {/* Feature pills */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {[
          { icon: Dumbbell, label: '1 324 exercices' },
          { icon: Film,     label: 'GIFs animés' },
          { icon: Bookmark, label: 'Favoris' },
          { icon: FolderPlus, label: 'Séances' },
          { icon: Globe,    label: '10 langues' },
        ].map(({ icon: Icon, label }) => (
          <span
            key={label}
            className="px-2.5 py-1 rounded-lg border-2 border-black bg-white font-mono text-[10px] font-bold text-black flex items-center gap-1.5 nb-shadow-sm"
          >
            <Icon className="w-3 h-3" />
            <span>{label}</span>
          </span>
        ))}
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-sm border-2 border-black rounded-2xl bg-white nb-shadow p-6">

        {/* Mode Tabs */}
        {mode !== 'forgot' && (
          <div className="grid grid-cols-2 p-1 border-2 border-black rounded-xl mb-5 bg-zinc-100">
            {(['login', 'signup'] as const).map((m) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={`py-2 rounded-lg font-body font-bold text-xs transition-all nb-press ${
                  mode === m
                    ? 'bg-black text-white border-2 border-black nb-shadow-sm'
                    : 'text-zinc-500 hover:text-black border-2 border-transparent'
                }`}
              >
                {m === 'login' ? 'Connexion' : 'Inscription'}
              </button>
            ))}
          </div>
        )}

        {/* Forgot password header */}
        {mode === 'forgot' && (
          <div className="flex items-center justify-between mb-5 pb-3 border-b-2 border-black">
            <div className="flex items-center gap-2 font-body font-bold text-sm text-black">
              <KeyRound className="w-4 h-4" />
              <span>Réinitialisation</span>
            </div>
            <button onClick={() => switchMode('login')} className="font-mono text-[11px] font-bold text-black underline">
              ← Retour
            </button>
          </div>
        )}

        {/* Google OAuth */}
        {mode !== 'forgot' && (
          <>
            <button
              id="btn-google-signin"
              onClick={onSignInWithGoogle}
              disabled={isLoading || isSubmitting}
              className="w-full flex items-center justify-center gap-3 bg-white border-2 border-black text-black font-body font-bold text-xs py-3 rounded-xl nb-shadow nb-press hover:bg-zinc-50 transition-colors disabled:opacity-60"
            >
              <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Continuer avec Google
            </button>

            <div className="my-4 flex items-center gap-3">
              <div className="flex-1 h-[2px] bg-black" />
              <span className="font-mono text-[10px] font-bold text-black uppercase tracking-wider">ou</span>
              <div className="flex-1 h-[2px] bg-black" />
            </div>
          </>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block font-mono text-[10px] font-bold uppercase text-black mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="gymhack229@gmail.com"
                className="w-full bg-zinc-50 border-2 border-black rounded-xl pl-10 pr-3 py-2.5 font-body text-xs text-black placeholder-zinc-400 focus:outline-none focus:bg-white nb-shadow-sm transition-all"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-mono text-[10px] font-bold uppercase text-black">Mot de passe</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => switchMode('forgot')}
                    className="font-mono text-[10px] font-bold text-black flex items-center gap-1 underline"
                  >
                    <HelpCircle className="w-3 h-3" />
                    Oublié ?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-50 border-2 border-black rounded-xl pl-10 pr-3 py-2.5 font-body text-xs text-black placeholder-zinc-400 focus:outline-none focus:bg-white nb-shadow-sm transition-all"
                />
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl border-2 border-black bg-zinc-100 flex items-start gap-2 text-black text-xs nb-shadow-sm">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="font-body">{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl border-2 border-black bg-black text-white flex items-start gap-2 text-xs nb-shadow-sm">
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="font-body">{successMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="w-full py-3 rounded-xl border-2 border-black bg-black text-white font-body font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 nb-shadow nb-press hover:bg-zinc-800 transition-colors disabled:opacity-60"
          >
            {isSubmitting ? (
              <><Loader2 className="w-4 h-4 animate-spin" /><span>Traitement…</span></>
            ) : mode === 'login' ? (
              <><span>Se connecter</span><ArrowRight className="w-4 h-4" /></>
            ) : mode === 'signup' ? (
              <><span>Créer mon compte</span><ArrowRight className="w-4 h-4" /></>
            ) : (
              <><span>Envoyer l'email</span><Mail className="w-4 h-4" /></>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
