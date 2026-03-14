"use client";

import { motion } from "framer-motion";
import {
    Scissors,
    BadgeDollarSign,
    BarChart3,
    CreditCard,
    ShieldUser,
    Palette,
} from "lucide-react";

const Features = () => {
    return (
        <div>
            <section id="about" className="py-24 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="text-4xl font-bold mb-4 italic leading-tight">
                        Tout pour votre salon, au même endroit.
                    </h2>
                    <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
                    <p className="mt-4 opacity-70 max-w-2xl mx-auto">
                        Des fonctionnalités pensées pour les salons de coiffure en Afrique :
                        suivez vos coiffeurs, vos transactions, vos salaires et vos statistiques
                        sans vous perdre dans des fichiers Excel.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        {
                            title: "Gestion des coiffeurs",
                            desc: "Ajoutez vos coiffeurs, définissez leur pourcentage de salaire et centralisez toutes leurs performances dans un seul espace.",
                            icon: Scissors,
                        },
                        {
                            title: "Suivi des transactions",
                            desc: "Enregistrez chaque coupe, chaque paiement et chaque méthode (espèces, mobile money, virement) pour ne rien perdre de vue.",
                            icon: CreditCard,
                        },
                        {
                            title: "Gestion des salaires",
                            desc: "Calculez automatiquement ce que vous devez à chaque coiffeur à la fin du mois, sans prise de tête ni calcul manuel.",
                            icon: BadgeDollarSign,
                        },
                        {
                            title: "Tableau de bord clair",
                            desc: "Visualisez votre chiffre d'affaires du jour, vos meilleurs coiffeurs et l'activité récente dès que vous ouvrez CashCut.",
                            icon: BarChart3,
                        },
                        {
                            title: "Fiche salon & équipe",
                            desc: "Gérez votre profil, les informations de votre salon et gardez une vue structurée sur votre équipe au quotidien.",
                            icon: ShieldUser,
                        },
                        {
                            title: "Choix du théme",
                            desc: "Choisissez le theme que vos préférez pour mieux utiliser l'application et travailler plus vite dans les meilleures conditions.",
                            icon: Palette,
                        },
                    ].map((feature, idx) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -6 }}
                                className="card bg-base-100 shadow-xl border border-base-200 hover:border-primary/60 transition-all duration-300"
                            >
                                <div className="card-body">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <h3 className="card-title text-lg">{feature.title}</h3>
                                    </div>
                                    <p className="opacity-75 text-sm">{feature.desc}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
};

export default Features;