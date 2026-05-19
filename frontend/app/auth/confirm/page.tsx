'use client'

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import axios from 'axios';
import { ROUTES } from '@/src/constants/routes';
import toast from 'react-hot-toast';
import NavBar from '@/src/components/NavBar';
import Footer from '@/src/components/Footer';
import { CheckCircle2 } from 'lucide-react';

function ConfirmContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const uid = searchParams.get('uid');
    const token = searchParams.get('token');
    const action = searchParams.get('action');

    if (!uid || !token || !action) {
      toast.error('Page non trouvée');
      router.replace(ROUTES.HOME);
      return;
    }

    const saveTokensAndRedirect = async () => {
      try {
        if (action === 'inscription') {
          const confirmRes = await axios.post('/api/confirm-email', { uid, token, action });
          const { access, refresh } = confirmRes.data;
          await axios.post('/api/confirm-login', { access, refresh });
          router.replace(ROUTES.DASHBOARD.ROOT);
        } else if (action === 'forgot-password') {
          await axios.post('/api/confirm-email', { uid, token, action });
          router.replace(`${ROUTES.AUTH.RESET_PASSWORD}?uid=${encodeURIComponent(uid)}&token=${encodeURIComponent(token)}`);
        } else {
          toast.error('Données invalides');
          router.replace(ROUTES.HOME);
        }
        router.refresh();
      } catch (error: any) {
        if (error?.response?.status === 400) {
          const email = error?.response?.data?.email || '';
          toast.error(error?.response?.data.error);
          router.replace(`${ROUTES.AUTH.EMAIL_SEND}${email ? `?email=${encodeURIComponent(email)}&action=${encodeURIComponent(action)}` : ''}`);
        } else {
          toast.error('Erreur lors de la confirmation, veuillez réessayer');
          router.replace(ROUTES.AUTH.EMAIL_SEND);
        }
        router.refresh();
      }
    };

    saveTokensAndRedirect();
  }, [router, searchParams]);

  return (
    <div className="text-center space-y-4">
      <div className="flex justify-center mb-4">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
      <p className="text-lg font-semibold">Confirmation en cours...</p>
      <p className="text-sm opacity-70">
        Merci de patienter pendant que nous finalisons votre connexion.
      </p>
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      <NavBar />

      <main className="flex-1 px-6 pt-28 pb-16 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="card bg-base-100 shadow-xl border border-base-200">
            <div className="card-body items-center text-center">
              <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">
                  Confirmation
                </h1>
                <p className="text-sm opacity-70">
                  Vérification de votre email en cours
                </p>
              </div>

              <Suspense fallback={
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="loading loading-spinner loading-lg text-primary"></div>
                  </div>
                  <p className="text-sm opacity-70">Chargement...</p>
                </div>
              }>
                <ConfirmContent />
              </Suspense>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
