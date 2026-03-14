'use client'
import NavBar from "@/src/components/NavBar";
import illustration from "@/public/illustrutions/authentication-dark.png"
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/src/constants/routes";
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast'
import axios from 'axios'
import { useState } from 'react';
import { Key } from "lucide-react";
import Footer from "@/src/components/Footer";

const LoginPage = () => {

  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      // ON APPELLE NEXT.JS (la route créée à l'étape 1)
      await axios.post('/api/login/', data);
      
      // Si ça marche, on va à l'accueil
      router.push(ROUTES.DASHBOARD.ROOT);
      router.refresh(); // Pour forcer le middleware à vérifier le nouveau cookie
    } catch (error: any) {
      const message = error.response?.data?.error || "Erreur de connexion";
      const status = error.response?.status;

      if (status === 401) {
          toast.error("Email ou mot de passe incorrect");
      } else if (status === 404) {
          toast.error("Compte introuvable");
      } else if (status === 429) {
          toast.error("Trop de tentatives, réessayez plus tard");
      } else if (status === 500) {
          toast.error("Erreur serveur, réessayez plus tard");
      } else {
          toast.error(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-100">
      <NavBar />

      <main className="px-6 pt-28 pb-16">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="card bg-base-100 shadow-xl border border-base-200">
            <div className="card-body space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">Connexion</h1>
                <p className="text-sm opacity-70">
                  Accédez à votre tableau de bord CashCut pour gérer vos
                  rendez-vous, votre équipe et vos clients.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Email</span>
                  </label>
                  <input
                    name="email"
                    type="email"
                    placeholder="vous@exemple.com"
                    className="input input-bordered focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Mot de passe</span>
                  </label>
                  <input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="input input-bordered focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full"
                  />
                  <label className="label">
                    <a
                      href="#"
                      className="label-text-alt link link-hover text-primary"
                    >
                      Mot de passe oublié ?
                    </a>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary w-full mt-2 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  {isSubmitting ? <span className="loading loading-spinner loading-sm" /> : <Key className="w-4 h-4" />}
                  {isSubmitting ? 'Connexion...' : 'Se connecter'}
                </button>
              </form>

              <p className="text-sm opacity-80">
                Pas encore de compte ?{" "}
                <Link href={ROUTES.AUTH.REGISTER} className="link link-primary">
                  Créer un compte
                </Link>
              </p>
            </div>
          </div>

          <div className="hidden lg:flex justify-center">
            <div className="max-w-md">
              <Image
                src={illustration}
                alt="Illustration Connexion"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </main>

      <Footer/>
    </div>
  );
};

export default LoginPage;

