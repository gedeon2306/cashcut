"use client";

import NavBar from "@/src/components/NavBar";
import Footer from "@/src/components/Footer";
import Link from "next/link";
import { Scale } from "lucide-react";
import { ROUTES } from "@/src/constants/routes";

export default function LicencePage() {
  return (
    <div className="min-h-screen bg-base-100">
      <NavBar />
      <main className="px-4 md:px-8 pt-28 pb-16">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="rounded-full p-2 bg-primary/10 border border-base-200">
              <Scale className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                Licence
              </h1>
              <p className="text-sm text-base-content/70 mt-1">
                Conditions d&apos;utilisation et de réutilisation du projet CashCut
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-lg border border-base-200">
            <div className="card-body p-6 md:p-8 space-y-6 text-base-content/80">
              <section>
                <h2 className="text-lg font-bold text-base-content mb-2">
                  1. Objet
                </h2>
                <p className="text-sm md:text-base">
                  CashCut est une plateforme de gestion pour salons de coiffure. La présente
                  licence définit les conditions dans lesquelles vous pouvez utiliser le
                  service et, le cas échéant, le code source du projet.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-base-content mb-2">
                  2. Utilisation du service
                </h2>
                <p className="text-sm md:text-base">
                  L&apos;accès à CashCut est autorisé pour un usage personnel ou professionnel
                  lié à la gestion d&apos;un salon de coiffure. Vous vous engagez à ne pas
                  utiliser le service à des fins illicites, à ne pas tenter de compromettre
                  la sécurité ou la disponibilité du service, et à respecter les données
                  des autres utilisateurs si le contexte l&apos;exige.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-base-content mb-2">
                  3. Propriété intellectuelle
                </h2>
                <p className="text-sm md:text-base">
                  L&apos;ensemble des éléments de CashCut (code, design, textes, marques) reste
                  la propriété de l&apos;éditeur ou des contributeurs, sauf mention contraire
                  dans le dépôt du projet. Toute réutilisation du code ou des assets doit
                  respecter la licence indiquée dans le dépôt (par exemple MIT, Apache, etc.)
                  et les éventuelles attributions demandées.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-base-content mb-2">
                  4. Données et contenu
                </h2>
                <p className="text-sm md:text-base">
                  Vous conservez la propriété des données que vous saisissez dans CashCut
                  (coiffeurs, transactions, paramètres). En utilisant le service, vous
                  accordez les droits nécessaires à leur traitement pour assurer le
                  fonctionnement de la plateforme, conformément à la Politique de
                  confidentialité.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-base-content mb-2">
                  5. Évolution et disponibilité
                </h2>
                <p className="text-sm md:text-base">
                  L&apos;éditeur se réserve le droit de faire évoluer CashCut, d&apos;en modifier
                  les fonctionnalités ou les conditions d&apos;accès, et d&apos;interrompre le
                  service en cas de nécessité, dans la mesure du possible avec un préavis
                  ou une communication aux utilisateurs.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-base-content mb-2">
                  6. Contact
                </h2>
                <p className="text-sm md:text-base">
                  Pour toute question relative à la licence, à la réutilisation du code ou
                  aux conditions d&apos;utilisation, vous pouvez nous contacter via les
                  canaux indiqués sur la plateforme ou dans le dépôt du projet.
                </p>
              </section>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={ROUTES.LEGAL.MENTIONS} className="btn btn-ghost btn-sm">
              Mentions légales
            </Link>
            <Link href={ROUTES.LEGAL.PRIVACY} className="btn btn-ghost btn-sm">
              Politique de confidentialité
            </Link>
            <Link href={ROUTES.HOME} className="btn btn-primary btn-sm">
              Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
