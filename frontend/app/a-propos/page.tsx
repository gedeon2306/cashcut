"use client";

import NavBar from "@/src/components/NavBar";
import Footer from "@/src/components/Footer";
import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  Github,
  Linkedin,
  Instagram,
  ExternalLink,
  User,
  Globe,
} from "lucide-react";
import { ROUTES } from "@/src/constants/routes";

const DEVELOPER = {
  photo: "/images/developer.png",
  firstName: "Gédéon Jihrel",
  lastName: "GANGOUE MBIMI",
  pseudo: "JihrelDev",
  email: "gedeon.jirehl.gangoue23@gmail.com",
  portfolio: "https://jihreldev.pythonanywhere.com",
  role: "Développeur full-stack",
  bio: "Passionné par le développement web et les outils qui simplifient le quotidien des professionnels. CashCut est né du besoin d’une gestion simple et claire pour les salons de coiffure.",
  socials: [
    { name: "GitHub", url: "https://github.com/gedeon2306", icon: Github },
    { name: "LinkedIn", url: "https://www.linkedin.com/in/g%C3%A9d%C3%A9on-gangou%C3%A9-2874063a2?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app", icon: Linkedin },
    { name: "Instagram", url: "https://www.instagram.com/_gedeon_jirehl_?igsh=ZXcxOXNrbzNwM3N6&utm_source=qr", icon: Instagram },
  ],
};

export default function AProposPage() {
  const fullName = `${DEVELOPER.firstName} ${DEVELOPER.lastName}`;
  const initials = `${DEVELOPER.firstName[0] || ""}${DEVELOPER.lastName[0] || ""}`.toUpperCase();

  return (
    <div className="min-h-screen bg-base-100">
      <NavBar />
      <main className="px-4 md:px-8 pt-28 pb-16">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="rounded-full p-2 bg-primary/10 border border-base-200">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                À propos
              </h1>
              <p className="text-sm text-base-content/70 mt-1">
                Qui se cache derrière CashCut
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-lg border border-base-200 overflow-hidden">
            <div className="card-body p-0">
              {/* Photo / Avatar + infos principales */}
              <div className="p-6 md:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-base-200">
                {DEVELOPER.photo ? (
                  <div className="relative w-40 h-40 rounded-2xl overflow-hidden border-2 border-base-200 shrink-0">
                    <Image
                      src={DEVELOPER.photo}
                      alt={fullName}
                      fill
                      className="object-fill"
                      sizes="1024px"
                    />
                  </div>
                ) : (
                  <div className="avatar placeholder shrink-0">
                    <div className="w-40 h-40 rounded-2xl bg-primary/20 text-primary border-2 border-base-200 flex items-center justify-center">
                      <span className="text-4xl font-bold">{initials}</span>
                    </div>
                  </div>
                )}
                <div className="flex-1 text-center sm:text-left space-y-2">
                  <h2 className="text-2xl font-bold text-base-content">
                    {fullName}
                  </h2>
                  {DEVELOPER.pseudo && (
                    <p className="text-primary font-medium">@{DEVELOPER.pseudo}</p>
                  )}
                  <p className="text-sm text-base-content/70">{DEVELOPER.role}</p>
                  <a
                    href={`mailto:${DEVELOPER.email}`}
                    className="inline-flex items-center gap-2 text-sm link link-primary"
                  >
                    <Mail className="w-4 h-4" />
                    {DEVELOPER.email}
                  </a>
                  <br />
                  <a
                    href={DEVELOPER.portfolio}
                    target="_blanc"
                    className="inline-flex items-center gap-2 text-sm link link-primary"
                  >
                    <Globe className="w-4 h-4" />
                    {DEVELOPER.portfolio}
                  </a>
                </div>
              </div>

              {/* Bio */}
              <div className="p-6 md:p-8 space-y-4">
                <h3 className="text-lg font-bold text-base-content">
                  En quelques mots
                </h3>
                <p className="text-base-content/80 text-sm md:text-base leading-relaxed">
                  {DEVELOPER.bio}
                </p>
              </div>

              {/* Réseaux sociaux */}
              {DEVELOPER.socials.length > 0 && (
                <div className="px-6 md:px-8 pb-6 md:pb-8">
                  <h3 className="text-lg font-bold text-base-content mb-3">
                    Réseaux sociaux
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {DEVELOPER.socials.map((social) => {
                      const Icon = social.icon;
                      return (
                        <a
                          key={social.name}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline btn-sm gap-2"
                        >
                          <Icon className="w-4 h-4" />
                          {social.name}
                          <ExternalLink className="w-3 h-3 opacity-70" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
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
