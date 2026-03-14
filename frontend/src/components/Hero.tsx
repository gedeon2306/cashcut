"use client";

import { motion } from "framer-motion";
import {
  Scissors,
  BarChart3,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ROUTES } from "../constants/routes";

const Hero = () => {

  const router = useRouter();

  return (
    <div>
      <section
        id="hero"
        className="hero min-h-[90vh] bg-base-200 px-6 py-16 lg:py-24"
      >
        <div className="hero-content flex-col lg:flex-row gap-12 max-w-7xl mx-auto">
          <motion.div
            className="lg:w-1/2 text-center lg:text-left space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="badge badge-secondary badge-outline mb-2">
              Plateforme pour salons de coiffure
            </span>
            <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight">
              Gérez votre salon avec{" "}
              <span className="text-primary">style et simplicité.</span>
            </h1>
            <p className="text-lg opacity-80 max-w-xl mx-auto lg:mx-0">
              CashCut gère vos coiffeurs, leurs salaire, et vos statistiques
              dans une interface élégante, pensée pour les
              salons de coiffure modernes en Afrique notament en République du Congo.
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <motion.button
                onClick={() => router.push(ROUTES.AUTH.LOGIN)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="btn btn-primary btn-lg px-8 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
              >
                Commencer gratuitement
              </motion.button>
              {/* <button className="btn btn-outline btn-lg px-8 transition-all duration-300 hover:-translate-y-0.5">
                Voir la démo
              </button> */}
            </div>
            <p className="text-sm opacity-70">
              100% gratuit au lancement • Aucun engagement • Annulation en un
              clic
            </p>
          </motion.div>

          <motion.div
            className="lg:w-1/2 w-full"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mockup-window border border-base-300 bg-base-100 shadow-2xl">
              <div className="bg-linear-to-br from-primary/10 via-secondary/10 to-accent/10 px-6 py-8 lg:px-10 lg:py-10">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm font-semibold text-primary/80 uppercase tracking-wide">
                      Données en temps réel
                    </p>
                    <p className="text-xs opacity-70">
                      Transactions, coiffeurs et statistiques en un coup d&apos;œil
                    </p>
                  </div>
                  <span className="badge badge-primary badge-outline">
                    Live
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="card bg-base-100/80 border border-base-200 shadow-sm">
                    <div className="card-body p-4">
                      <div className="flex items-center justify-between mb-2">
                        <BarChart3 className="w-5 h-5 text-secondary" />
                      </div>
                      <p className="text-xs opacity-70 mb-1">
                        Chiffre d&apos;affaires du jour
                      </p>
                      <p className="text-2xl font-bold">450 000 FCFA</p>
                    </div>
                  </div>

                  <div className="card bg-base-100/80 border border-base-200 shadow-sm">
                    <div className="card-body p-4">
                      <div className="flex items-center justify-between mb-2">
                        <BarChart3 className="w-5 h-5 text-accent" />
                      </div>
                      <p className="text-xs opacity-70 mb-1">
                        Chiffre affaires d&apos;hier
                      </p>
                      <p className="text-2xl font-bold">560 000 FCFA</p>
                    </div>
                  </div>

                  <div className="card bg-base-100/80 border border-base-200 shadow-sm">
                    <div className="card-body p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Scissors className="w-5 h-5 text-primary" />
                        <span className="badge badge-primary badge-sm">+2</span>
                      </div>
                      <p className="text-xs opacity-70 mb-1">
                        Nombre de coiffeurs
                      </p>
                      <p className="text-2xl font-bold">6</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-base-100/90 border border-dashed border-base-300 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <Users className="w-6 h-6 text-primary mt-1" />
                    <div>
                      <p className="font-semibold">
                        Organisez votre salon en quelques clics
                      </p>
                      <p className="text-xs opacity-70">
                        Gérez les vos coiffeurs, les transactions et la
                        charge de travail sur une seule vue.
                      </p>
                    </div>
                  </div>
                  <Link href={ROUTES.AUTH.REGISTER} className="btn btn-primary btn-sm sm:btn-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
                    Tester CashCut
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Hero;