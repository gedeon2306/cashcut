"use client";

import NavBar from "@/src/components/NavBar";
import Footer from "@/src/components/Footer";
import Link from "next/link";
import { FileText } from "lucide-react";
import { ROUTES } from "@/src/constants/routes";

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-base-100">
      <NavBar />
      <main className="px-4 md:px-8 pt-28 pb-16">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="rounded-full p-2 bg-primary/10 border border-base-200">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                Mentions légales
              </h1>
              <p className="text-sm text-base-content/70 mt-1">
                Informations légales relatives au service CashCut
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-lg border border-base-200">
            <div className="card-body p-6 md:p-8 space-y-6 text-base-content/80">
              <section>
                <h2 className="text-lg font-bold text-base-content mb-2">
                  1. Éditeur du site
                </h2>
                <p className="text-sm md:text-base">
                  Le service CashCut est proposé par l&apos;éditeur du projet. Pour toute question
                  relative aux mentions légales, vous pouvez nous contacter via les moyens
                  indiqués sur la plateforme.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-base-content mb-2">
                  2. Objet du service
                </h2>
                <p className="text-sm md:text-base">
                  CashCut est une plateforme de gestion destinée aux salons de coiffure. Elle permet
                  de gérer les coiffeurs, les transactions, les salaires et les statistiques du
                  salon. L&apos;utilisation du service est soumise à l&apos;acceptation des présentes
                  mentions et de la politique de confidentialité.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-base-content mb-2">
                  3. Hébergement
                </h2>
                <p className="text-sm md:text-base">
                  L&apos;application et les données associées sont hébergées conformément aux
                  réglementations en vigueur. Les traitements des données personnelles sont
                  décrits dans la page Politique de confidentialité.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-base-content mb-2">
                  4. Propriété intellectuelle
                </h2>
                <p className="text-sm md:text-base">
                  L&apos;ensemble des éléments du service CashCut (textes, interfaces, logos,
                  logiciels) est protégé par le droit d&apos;auteur et les dispositions de la
                  licence du projet. Toute reproduction ou utilisation non autorisée peut
                  constituer une contrefaçon.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-base-content mb-2">
                  5. Limitation de responsabilité
                </h2>
                <p className="text-sm md:text-base">
                  CashCut est fourni &quot;en l&apos;état&quot;. L&apos;éditeur s&apos;efforce d&apos;assurer la
                  disponibilité et la fiabilité du service mais ne peut garantir une absence
                  totale d&apos;interruption ou d&apos;erreur. L&apos;utilisateur reste responsable de
                  l&apos;usage qu&apos;il fait des données et des fonctionnalités du salon.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-base-content mb-2">
                  6. Droit applicable
                </h2>
                <p className="text-sm md:text-base">
                  Les présentes mentions légales sont régies par le droit applicable au pays
                  d&apos;établissement de l&apos;éditeur. En cas de litige, les tribunaux compétents
                  seront ceux du ressort concerné.
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
