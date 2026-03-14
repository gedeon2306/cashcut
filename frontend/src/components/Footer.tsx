"use client";

import {
    Facebook,
    Github,
    Instagram,
    Linkedin,
    Twitter,
} from "lucide-react";
import Link from "next/link";
import { ROUTES } from "../constants/routes";

const Footer = () => {
    return (
        <div>
            <footer className="bottom-0 left-0 right-0 bg-base-100/80 border-t border-base-200">
                <div className="footer p-10 grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
                    <nav>
                        <header className="footer-title text-primary">Services</header>
                        <a className="link link-hover">Gestion des coiffeurs</a>
                        <a className="link link-hover">Gestion des transactions</a>
                        <a className="link link-hover">Statistiques &amp; reporting</a>
                        <a className="link link-hover">Gestion du profile</a>
                    </nav>
                    <nav>
                        <header className="footer-title text-primary">Entreprise</header>
                        <Link href={ROUTES.ABOUT} className="link link-hover">À propos</Link>
                        <Link href={ROUTES.LEGAL.MENTIONS} className="link link-hover">Mentions légales</Link>
                        <Link href={ROUTES.LEGAL.PRIVACY} className="link link-hover">Politique de confidentialité</Link>
                        <Link href={ROUTES.LEGAL.LICENCE} className="link link-hover">Licence</Link>
                    </nav>
                    <nav>
                        <header className="footer-title text-primary">Liens rapides</header>
                        <Link href="/#hero" className="link link-hover">Accueil</Link>
                        <Link href="/#about" className="link link-hover">Fonctionnalités</Link>
                        <Link href="/#pricing" className="link link-hover">Tarifs</Link>
                        <Link href="/#faq" className="link link-hover">FAQ</Link>
                    </nav>
                    <div>
                        <header className="footer-title italic text-primary">Réseaux sociaux</header>
                        <div className="flex gap-3 mb-4">
                            <a href="https://github.com/gedeon2306" target="_blanc" className="btn btn-ghost btn-circle btn-sm transition-all duration-300 hover:bg-primary/20">
                                <Github className="w-4 h-4" />
                            </a>
                            <a href="https://www.linkedin.com/in/g%C3%A9d%C3%A9on-gangou%C3%A9-2874063a2?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" target="_blanc" className="btn btn-ghost btn-circle btn-sm transition-all duration-300 hover:bg-primary/20">
                                <Linkedin className="w-4 h-4" />
                            </a>
                            <a href="https://www.instagram.com/_gedeon_jirehl_?igsh=ZXcxOXNrbzNwM3N6&utm_source=qr" target="_blanc" className="btn btn-ghost btn-circle btn-sm transition-all duration-300 hover:bg-primary/20">
                                <Instagram className="w-4 h-4" />
                            </a>
                        </div>
                        <div className="italic">
                            <h3 className="font-bold text-lg text-primary">CashCut</h3>
                            <p>Plateforme de gestion pour salons de coiffure.</p>
                        </div>
                    </div>
                </div>
                <div className="border-t border-neutral-focus px-6 py-4 text-center text-sm opacity-80">
                    Copyright © {new Date().getFullYear()} <span className="text-primary font-semibold">CashCut</span>. Tous droits réservés.
                </div>
            </footer>
        </div>
    );
};

export default Footer;