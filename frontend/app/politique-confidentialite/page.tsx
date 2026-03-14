"use client";

import NavBar from "@/src/components/NavBar";
import Footer from "@/src/components/Footer";
import Link from "next/link";
import { Shield } from "lucide-react";
import { ROUTES } from "@/src/constants/routes";

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="min-h-screen bg-base-100">
      <NavBar />
      <main className="px-4 md:px-8 pt-28 pb-16">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="rounded-full p-2 bg-primary/10 border border-base-200">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                Politique de confidentialité
              </h1>
              <p className="text-sm text-base-content/70 mt-1">
                Comment CashCut traite et protège vos données
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-lg border border-base-200">
            <div className="card-body p-6 md:p-8 space-y-6 text-base-content/80">
              <section>
                <h2 className="text-lg font-bold text-base-content mb-2">
                  1. Données collectées
                </h2>
                <p className="text-sm md:text-base mb-2">
                  CashCut collecte les données nécessaires au fonctionnement du service pour
                  les propriétaires de salons et leurs équipes :
                </p>
                <ul className="list-disc list-inside text-sm md:text-base space-y-1 ml-2">
                  <li>Données de compte : nom, adresse e-mail, ville</li>
                  <li>Données des coiffeurs : noms, taux de rémunération</li>
                  <li>Données des transactions : services, montants, moyens de paiement, dates</li>
                  <li>Données techniques : token d&apos;authentification, logs d&apos;accès si applicable</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-bold text-base-content mb-2">
                  2. Finalité du traitement
                </h2>
                <p className="text-sm md:text-base">
                  Les données sont utilisées uniquement pour fournir les fonctionnalités de
                  CashCut : gestion des coiffeurs, enregistrement des transactions, calcul des
                  salaires, tableaux de bord et rapports. Elles ne sont pas vendues à des tiers
                  ni utilisées à des fins de publicité ciblée.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-base-content mb-2">
                  3. Sécurité
                </h2>
                <p className="text-sm md:text-base">
                  Nous mettons en œuvre des mesures techniques et organisationnelles adaptées
                  (connexions chiffrées HTTPS, authentification par token, bonnes pratiques
                  de développement) pour protéger vos données contre l&apos;accès non autorisé, la
                  perte ou l&apos;altération.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-base-content mb-2">
                  4. Conservation et suppression
                </h2>
                <p className="text-sm md:text-base">
                  Les données sont conservées tant que votre compte est actif. Vous pouvez
                  demander la suppression de votre compte et des données associées via les
                  paramètres du profil ou en nous contactant. Les données seront supprimées
                  dans un délai raisonnable, sauf obligation légale de conservation.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-base-content mb-2">
                  5. Vos droits
                </h2>
                <p className="text-sm md:text-base">
                  Conformément à la réglementation en vigueur, vous disposez d&apos;un droit
                  d&apos;accès, de rectification, de limitation du traitement et d&apos;effacement de
                  vos données personnelles. Pour exercer ces droits ou poser une question,
                  contactez-nous via les moyens indiqués sur la plateforme.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-base-content mb-2">
                  6. Modifications
                </h2>
                <p className="text-sm md:text-base">
                  Cette politique peut être mise à jour pour refléter les évolutions du
                  service ou des obligations légales. La date de dernière mise à jour sera
                  indiquée en bas de page. Nous vous invitons à la consulter régulièrement.
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
