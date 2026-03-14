'use client'
import Link from 'next/link'
import { ROUTES } from '@/src/constants/routes'
import img404 from '@/public/illustrutions/404-not-found-smiley-dark.png'
import Image from 'next/image'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="hero">
        <div className="hero-content flex-col lg:flex-row-reverse gap-10">
          <div className="max-w-md">
            <Image
              src={img404}
              alt="Illustration 404 - page non trouvée"
              className="w-full max-w-sm mx-auto drop-shadow-xl"
              priority
            />
          </div>
          <div className="max-w-lg text-center lg:text-left space-y-4">
            <p className="text-sm font-semibold text-primary/80 tracking-widest">
              ERREUR 404
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-base-content">
              Oups, cette page n&apos;existe plus.
            </h1>
            <p className="text-base md:text-lg text-base-content/70">
              La ressource que vous cherchez a peut-être été déplacée, renommée ou n&apos;a
              jamais existé. Retournez au tableau de bord pour continuer votre navigation.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start pt-2">
              <Link href={ROUTES.HOME} className="btn btn-primary">
                Revenir à l&apos;accueil
              </Link>
              <button
                type="button"
                onClick={() => (typeof window !== 'undefined' ? window.history.back() : undefined)}
                className="btn btn-soft"
              >
                Revenir en arrière
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}