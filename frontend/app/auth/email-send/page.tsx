'use client'

import { ROUTES } from '@/src/constants/routes'
import Link from 'next/link'
import { ArrowLeft, Mail, RefreshCw } from 'lucide-react';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import NavBar from '@/src/components/NavBar';
import Footer from '@/src/components/Footer';

function EmailSentContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const action = searchParams.get('action') || '';

  const [resent, setResent] = useState(false);
  const [resending, setResending] = useState(false);

  const handleResend = async () => {
    if (resent || resending) return;

    if (!email || !action) {
      toast.error("Impossible de renvoyer : email ou données manquant.");
      return;
    }

    setResending(true);
    try {
      if (action === 'inscription' || action === 'forgot-password') {
        await axios.post('/api/resend-confirmation', { email, action });
        setResent(true);
        toast.success('Email renvoyé !');
      } else {
        toast.error('Données invalides')
        return
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Erreur lors du renvoi de l'email.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl border border-base-200 max-w-md w-full">
      <div className="card-body items-center text-center space-y-6">
        {/* Icon */}
        <div className="flex justify-center mb-2">
          <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Mail className="w-9 h-9 text-primary" />
          </div>
        </div>

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold mb-2">
            Email envoyé !
          </h1>
          <p className="text-sm opacity-70">
            Un lien de confirmation a été envoyé à <span className="font-semibold text-primary">{email}</span>.
            Vérifiez votre boîte de réception.
          </p>
        </div>

        {/* Info Box */}
        <div className="alert alert-info text-left">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span className="text-xs">
            Le lien est valable <span className="font-medium">10 minutes</span>.
            Pensez à vérifier vos <span className="font-medium">spams</span> si vous ne le trouvez pas.
          </span>
        </div>

        {/* Resend Button */}
        <button
          onClick={handleResend}
          disabled={resent || resending}
          className="btn btn-outline btn-primary w-full transition-all duration-200"
        >
          {resending ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Envoi en cours…
            </>
          ) : resent ? (
            <>
              ✓ Email renvoyé !
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              Renvoyer l&apos;email
            </>
          )}
        </button>

        {/* Back Link */}
        <div>
          <Link
            href={ROUTES.AUTH.LOGIN}
            className="link link-hover text-sm flex items-center gap-2 justify-center"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function EmailSentPage() {
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
          <EmailSentContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
