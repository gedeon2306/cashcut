"use client";

import { ROUTES } from '@/src/constants/routes'
import Link from 'next/link'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUserProfile } from '@/src/app/actions/actions';
import { LogOut, Scissors, SunMoon } from "lucide-react";
import toast from 'react-hot-toast';
import { useTheme } from '@/src/hooks/useTheme';

const NavBar = () => {
  const { theme, changeTheme, themes } = useTheme();

  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      const profile = await getUserProfile();
      if (profile) {
        setUserName(profile.name);
      }
    };
    loadProfile();
  }, []);

  const handleLogout = async () => {
    setIsSubmitting(true);
    try {
      await axios.post('/api/logout');
      router.push(ROUTES.AUTH.LOGIN);
      router.refresh();
    } catch {
      toast.error("Erreur lors de la déconnexion");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="navbar bg-base-100/80 backdrop-blur-md fixed top-0 z-50 px-4 md:px-10 border-b border-base-200">
        <div className="navbar-start">
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-1 p-2 shadow bg-base-100 rounded-box w-52"
            >
              {userName ? (
                <>
                  <li>
                    <Link href={ROUTES.DASHBOARD.ROOT}>Tableau de bord</Link>
                  </li>
                  <li>
                    <Link href={ROUTES.DASHBOARD.BARBERS}>Coiffeurs</Link>
                  </li>
                  <li>
                    <Link href={ROUTES.DASHBOARD.TRANSACTIONS}>Transactions</Link>
                  </li>
                  <li>
                    <Link href={ROUTES.DASHBOARD.SALARY}>Salaires</Link>
                  </li>
                  <li>
                    <Link href={ROUTES.DASHBOARD.SETTINGS}>Paramètres</Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link href="/#hero">Accueil</Link>
                  </li>
                  <li>
                    <Link href="/#about">Fonctionnalités</Link>
                  </li>
                  <li>
                    <Link href="/#pricing">Tarifs</Link>
                  </li>
                  <li>
                    <Link href="/#faq">FAQ</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
          <Link
            href={ROUTES.HOME}
            className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-primary cursor-pointer"
          >
            <Scissors className="w-7 h-7" />
            <span>CashCut</span>
          </Link>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 font-medium">
            {userName ? (
              <>
                <li>
                  <Link href={ROUTES.DASHBOARD.ROOT}>Tableau de bord</Link>
                </li>
                <li>
                  <Link href={ROUTES.DASHBOARD.BARBERS}>Coiffeurs</Link>
                </li>
                <li>
                  <Link href={ROUTES.DASHBOARD.TRANSACTIONS}>Transactions</Link>
                </li>
                <li>
                  <Link href={ROUTES.DASHBOARD.SALARY}>Salaires</Link>
                </li>
                <li>
                  <Link href={ROUTES.DASHBOARD.SETTINGS}>Paramètres</Link>
                </li>
              </> 
            ) : (
              <>
                <li>
                  <Link
                    href="/#hero"
                    className="hover:text-primary transition-all duration-300"
                  >
                    Accueil
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#about"
                    className="hover:text-primary transition-all duration-300"
                  >
                    Fonctionnalités
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#pricing"
                    className="hover:text-primary transition-all duration-300"
                  >
                    Tarifs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#faq"
                    className="hover:text-primary transition-all duration-300"
                  >
                    FAQ
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>

        <div className="navbar-end gap-2">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-sm md:btn-md shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl">
              <SunMoon />
              <svg
                width="12px"
                height="12px"
                className="inline-block h-2 w-2 fill-current opacity-60"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 2048 2048">
                <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
              </svg>
            </div>
            <ul tabIndex={-1} className="dropdown-content bg-base-300 rounded-box z-1 right-0.5 w-52 p-2 shadow-2xl">
              {themes.map((t) => (
                <li key={t}>
                  <button
                    onClick={() => changeTheme(t)}
                    className={`btn btn-sm btn-block btn-ghost justify-start ${theme === t ? 'btn-active' : ''}`}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {userName ? (
            <div className="tooltip tooltip-error tooltip-bottom" data-tip="Déconnexion">
              <button
                disabled={isSubmitting}
                onClick={handleLogout}
                className="btn btn-error btn-sm md:btn-md m-1 transition-all duration-300 hover:-translate-y-0.5"
              >
                {isSubmitting ? <span className="loading loading-spinner loading-sm" /> : <LogOut className="w-4 h-4" />}
              </button>
            </div>
          ) : (
            <>
              <Link
                href={ROUTES.AUTH.REGISTER}
                className="btn btn-primary btn-sm md:btn-md shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
              >
                S&apos;inscrire
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;