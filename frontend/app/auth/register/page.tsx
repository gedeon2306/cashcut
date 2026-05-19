'use client'
import NavBar from "@/src/components/NavBar";
import illustration from "@/public/illustrutions/register-dark.png"
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/src/constants/routes";
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast'
import axios from 'axios'
import { useState } from 'react';
import { UserPlus } from "lucide-react";
import Footer from "@/src/components/Footer";

const RegisterPage = () => {

  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      await axios.post('/api/register', data);

      const email = formData.get('email') as string;
      const action = 'inscription';
      router.push(`${ROUTES.AUTH.EMAIL_SEND}?email=${encodeURIComponent(email)}&action=${action}`);
      router.refresh();
    } catch (err: any) {
      if (err?.response?.status === 400) {
        if(err?.response?.data?.email && err?.response?.data?.email == "user with this email already exists."){
          toast.error("Cet email est déjà utilisé");
        } else if(err?.response?.data?.email) {
          toast.error(err?.response?.data?.email);
        }else{
          toast.error(err?.response?.data?.error);
        }
      } else {
        toast.error("Problème de connexion au serveur");
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
                <h1 className="text-3xl font-bold mb-2">
                  Créer un compte CashCut
                </h1>
                <p className="text-sm opacity-70">
                  Paramétrez votre salon de coiffure en quelques minutes et
                  commencez à centraliser vos rendez-vous.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Nom du salon / responsable
                    </span>
                  </label>
                  <input
                    name="name"
                    type="text"
                    placeholder="Salon Élégance"
                    className="input input-bordered focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full"
                  />
                </div>

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
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input input-bordered focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full"
                  />
                  <label className="label">
                    <span className="label-text-alt opacity-70">
                      Minimum 8 caractères, avec lettres et chiffres.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary w-full mt-2 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  {isSubmitting ? <span className="loading loading-spinner loading-sm" /> : <UserPlus className="w-4 h-4" />}
                  {isSubmitting ? 'Création...' : 'Créer un compte'}
                </button>
              </form>

              <p className="text-sm opacity-80">
                Vous avez déjà un compte ?{" "}
                <Link href={ROUTES.AUTH.LOGIN} className="link link-primary">
                  Se connecter
                </Link>
              </p>
            </div>
          </div>

          <div className="hidden lg:flex justify-center">
            <div className="max-w-md">
              <Image
                src={illustration}
                alt="Illustration - Création de compte"
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

export default RegisterPage;

