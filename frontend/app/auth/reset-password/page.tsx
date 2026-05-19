'use client'

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Lock, ShieldCheck } from 'lucide-react';
import NavBar from '@/src/components/NavBar';
import Footer from '@/src/components/Footer';

function ResetPasswordContent() {
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const uid = searchParams.get('uid');
  const token = searchParams.get('token');

  useEffect(() => {
    if (!uid || !token) {
      toast.error('Lien invalide ou expiré');
      setTimeout(() => router.push('/auth/forgot-password'), 2000);
      setIsValid(false);
    } else {
      setIsValid(true);
    }
  }, [uid, token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !passwordConfirm) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    if (password !== passwordConfirm) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (password.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid,
          token,
          password,
          password_confirm: passwordConfirm,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Mot de passe réinitialisé avec succès !');
        setTimeout(() => router.push('/auth/login'), 1500);
      } else {
        toast.error(data.error || 'Erreur lors de la réinitialisation');
      }
    } catch (error) {
      toast.error('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  if (!isValid) {
    return (
      <div className="card bg-base-100 shadow-xl border border-base-200 max-w-md w-full">
        <div className="card-body items-center text-center">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="text-sm opacity-70">Vérification du lien...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-xl border border-base-200 max-w-md w-full">
      <div className="card-body space-y-6">
        {/* Icon */}
        <div className="flex justify-center mb-2">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
        </div>

        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">
            Réinitialisation
          </h1>
          <p className="text-sm opacity-70">
            Choisissez un nouveau mot de passe sécurisé pour votre compte.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nouveau mot de passe */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Nouveau mot de passe</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50 pointer-events-none" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="input input-bordered pl-10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full"
              />
            </div>
          </div>

          {/* Confirmer mot de passe */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Confirmer le mot de passe</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50 pointer-events-none" />
              <input
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="••••••••"
                required
                className="input input-bordered pl-10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full"
              />
            </div>
            <label className="label">
              <span className="label-text-alt opacity-70">
                Minimum 8 caractères.
              </span>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Mise à jour en cours…
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                Mettre à jour le mot de passe
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      <NavBar />

      <main className="flex-1 px-6 pt-28 pb-16 flex items-center justify-center">
        <Suspense fallback={
          <div className="card bg-base-100 shadow-xl border border-base-200 max-w-md w-full">
            <div className="card-body items-center text-center">
              <div className="loading loading-spinner loading-lg text-primary"></div>
              <p className="text-sm opacity-70">Chargement...</p>
            </div>
          </div>
        }>
          <ResetPasswordContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
