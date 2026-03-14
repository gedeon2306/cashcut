"use client";

const FAQ = () => {
    return (
        <div>
            <section id="faq" className="py-24 px-6 max-w-3xl mx-auto">
                <h2 className="text-4xl font-bold mb-12 text-center italic">
                    Questions fréquentes
                </h2>
                <div className="space-y-4">
                    <div className="collapse collapse-plus bg-base-200">
                        <input type="radio" name="faq-accordion" defaultChecked />
                        <div className="collapse-title text-xl font-medium">
                            La plateforme est-elle simple à utiliser ?
                        </div>
                        <div className="collapse-content">
                            <p className="opacity-80">
                                Oui. CashCut est conçu pour des équipes qui n&apos;ont pas le
                                temps de se former pendant des semaines. En quelques minutes,
                                vous pouvez créer votre compte, ajouter vos coiffeurs et
                                commencer à gérer votre salon.
                            </p>
                        </div>
                    </div>
                    <div className="collapse collapse-plus bg-base-200">
                        <input type="radio" name="faq-accordion" />
                        <div className="collapse-title text-xl font-medium">
                            Mes données sont-elles sécurisées ?
                        </div>
                        <div className="collapse-content">
                            <p className="opacity-80">
                                Nous utilisons les bonnes pratiques de sécurité de
                                l&apos;écosystème Next.js, des connexions chiffrées (HTTPS) et
                                des sauvegardes régulières pour protéger vos informations et
                                celles de vos clients.
                            </p>
                        </div>
                    </div>
                    <div className="collapse collapse-plus bg-base-200">
                        <input type="radio" name="faq-accordion" />
                        <div className="collapse-title text-xl font-medium">
                            Quel type de support technique proposez-vous ?
                        </div>
                        <div className="collapse-content">
                            <p className="opacity-80">
                                Notre équipe vous accompagne par e-mail et messagerie pour la
                                mise en place, les questions du quotidien et la remontée de
                                nouvelles idées. Nous publions également des tutoriels et des
                                guides pour votre équipe.
                            </p>
                        </div>
                    </div>
                    <div className="collapse collapse-plus bg-base-200">
                        <input type="radio" name="faq-accordion" />
                        <div className="collapse-title text-xl font-medium">
                            La plateforme est-elle complétement gratuite ?
                        </div>
                        <div className="collapse-content">
                            <p className="opacity-80">
                                Oui, CashCut est entièrement gratuit pendant la phase de lancement.
                                Vous pouvez créer un compte, ajouter vos coiffeurs, enregistrer des
                                transactions et générer vos rapports sans frais cachés. Si des
                                offres premium arrivent plus tard, la version gratuite restera
                                toujours utilisable pour la gestion de base de votre salon.
                            </p>
                        </div>
                    </div>
                    <div className="collapse collapse-plus bg-base-200">
                        <input type="radio" name="faq-accordion" />
                        <div className="collapse-title text-xl font-medium">
                            Puis-je utiliser CashCut sur téléphone ou tablette ?
                        </div>
                        <div className="collapse-content">
                            <p className="opacity-80">
                                Oui, l&apos;interface est entièrement responsive. Vous pouvez suivre vos chiffres,
                                ajouter des transactions ou consulter les salaires depuis un smartphone, une tablette
                                ou un ordinateur sans installer d&apos;application supplémentaire.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default FAQ;