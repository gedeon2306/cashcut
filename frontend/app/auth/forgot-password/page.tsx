'use client'

import { useState } from 'react';
import { ROUTES } from '@/src/constants/routes'
import { ArrowLeft, Mail } from 'lucide-react';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import axios from 'axios';
import NavBar from '@/src/components/NavBar';
import Footer from '@/src/components/Footer';

export default function ForgotPasswordPage() {
  const router = useRouter()

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Veuillez entrer votre email');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('/api/forgot-password', { email });

      toast.success(res.data.message);
      setEmail('');
      const action = "forgot-password"
      router.replace(`${ROUTES.AUTH.EMAIL_SEND}${email ? `?email=${encodeURIComponent(email)}&action=${encodeURIComponent(action)}` : ''}`);
      router.refresh();
    } catch (error: any) {
      if (error?.response?.status === 400) {
        toast.error(error?.response?.data.error);
      } else {
        toast.error("Problème de connexion au serveur");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      <NavBar />

      <main className="flex-1 px-6 pt-28 pb-16 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="card bg-base-100 shadow-xl border border-base-200">
            <div className="card-body space-y-6">
              {/* Icon */}
              <div className="flex justify-center mb-2">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8 text-primary">
                    <path d="M12.5 1H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V12.5"></path>
                    <path d="M16 3v4"></path>
                    <path d="M8 3v4"></path>
                    <path d="M12 12h.01"></path>
                    <path d="M16 16h.01"></path>
                    <path d="M8 16h.01"></path>
                  </svg>
                </div>
              </div>

              {/* Header */}
              <div className="text-center">
                <h1 className="text-2xl font-bold mb-2">
                  Mot de passe oublié ?
                </h1>
                <p className="text-sm opacity-70">
                  Entrez votre adresse email pour recevoir un lien de réinitialisation.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Email</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50 pointer-events-none" />
                    <input
                      type="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nom@exemple.com"
                      required
                      className="input input-bordered pl-10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full"
                    />
                  </div>
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
                      Envoi en cours…
                    </>
                  ) : (
                    <>
                      Envoyer le lien
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                        <path d="M9 12h6m0 0l-3-3m3 3l-3 3"></path>
                      </svg>
                    </>
                  )}
                </button>
              </form>

              {/* Back to login */}
              <div className="flex justify-center">
                <Link
                  href={ROUTES.AUTH.LOGIN}
                  className="link link-hover text-sm flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Retour à la connexion
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
