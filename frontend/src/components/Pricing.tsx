"use client";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "../constants/routes";

const Pricing = () => {
    return (
        <div>
            <section id="pricing" className="py-24 bg-base-200 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-bold mb-4 italic">
                        Un lancement à prix doux.
                    </h2>
                    <p className="opacity-70 mb-10">
                        Profitez de toutes les fonctionnalités de CashCut gratuitement
                        pendant notre phase de lancement. Aucune carte bancaire requise.
                    </p>
                    <div className="flex justify-center">
                        <motion.div
                            whileHover={{ y: -8 }}
                            className="card w-full max-w-md bg-base-100 shadow-2xl border-2 border-primary/80 ring-4 ring-primary/20"
                        >
                            <div className="card-body">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-bold uppercase opacity-60 italic">
                                        Offre de lancement
                                    </h3>
                                    <span className="badge badge-primary badge-outline">
                                        0 FCFA / mois
                                    </span>
                                </div>
                                <div className="my-4">
                                    <span className="text-5xl font-extrabold">0 FCFA</span>
                                    <span className="text-sm opacity-60 italic"> / mois</span>
                                </div>
                                <ul className="text-left space-y-3 mb-8">
                                    {[
                                        "Accès à toutes les fonctionnalités",
                                        "Coiffeurs illimités",
                                        "Support technique dédié",
                                        "Mises à jour continues incluses",
                                    ].map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Link href={ROUTES.AUTH.REGISTER} className="btn btn-primary w-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl">
                                    Créer mon compte maintenant
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Pricing;