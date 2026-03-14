## Frontend – CashCut

Ce dossier contient l’interface **web** de CashCut, développée avec :

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS 4** + **DaisyUI**
- **Axios** (client HTTP)
- **react-hot-toast** (notifications)
- **framer-motion** (animations)

Le frontend consomme l’API Django exposée par le backend (voir `../backend`).

---

## Fonctionnalités UI

- **Landing page marketing**
  - `app/page.tsx` : page d’accueil avec sections Hero, Features, Pricing, FAQ, Footer.
  - Mises en avant des bénéfices de CashCut pour les salons de coiffure.

- **Authentification**
  - `app/auth/login/page.tsx` : page de connexion.
  - `app/auth/register/page.tsx` : page d’inscription.
  - Utilisation d’API routes Next (`app/api/login/route.ts`, `app/api/register/route.ts`, `app/api/logout/route.ts`) pour gérer les appels au backend et les cookies.
  - Stockage des tokens **JWT** dans des cookies HTTP-only (`access_token`, `refresh_token`).

- **Tableau de bord**
  - `app/dashboard/page.tsx` :
    - affiche les **KPI** du jour (CA du jour, CA d’hier, nombre de coiffeurs, salaires à verser),
    - liste les **dernières transactions**,
    - affiche un **classement des coiffeurs** en temps réel (CA et services du jour),
    - propose des actions rapides (nouvelle transaction, ajouter un coiffeur, voir les rapports).
  - Formulaire modal pour **ajouter une transaction** directement depuis le dashboard.
  - Formulaire modal pour **ajouter un coiffeur**.

- **Gestion des transactions**
  - `app/dashboard/transactions/page.tsx` :
    - liste paginée des transactions (15 par page),
    - calcul du **total encaissé** sur la page,
    - ajout d’une transaction (coiffeur, service, montant, moyen de paiement, date),
    - **édition** et **suppression** de transaction via des modales,
    - affichage détaillé des dates (service, enregistrement).

- **Gestion des salaires / rapports mensuels**
  - `app/dashboard/salary/page.tsx` :
    - formulaire pour choisir un **mois** et une **année**,
    - appel à l’endpoint `/api/reports/monthly/`,
    - affichage du **résumé global** (CA, salaires totaux, bénéfice net),
    - tableau détaillé par coiffeur (nombre de services, total encaissé, salaire, part du salon).

- **Paramètres / profil**
  - `app/dashboard/settings/page.tsx` :
    - gère le **profil** (nom, email, ville),
    - changement de **mot de passe**,
    - possibilité de **supprimer le compte** (en s’appuyant sur les actions côté backend).

- **Pages légales / info**
  - `app/a-propos/page.tsx` : page À propos.
  - `app/politique-confidentialite/page.tsx` : politique de confidentialité.
  - `app/mentions-legales/page.tsx` : mentions légales.
  - `app/licence/page.tsx` : licence / informations de droit d’usage.
  - `app/not-found.tsx` : page 404 personnalisée.

---

## Structure principale

- `app/`
  - `layout.tsx` : layout global (Navbar, thème, etc.).
  - `globals.css` : styles globaux Tailwind + DaisyUI.
  - `page.tsx` : landing page.
  - `auth/` : pages de login / register.
  - `dashboard/` : pages du tableau de bord (accueil, transactions, salaires, paramètres).
  - `a-propos`, `mentions-legales`, `politique-confidentialite`, `licence` : pages de contenu.
  - `api/` : routes Next API (login, register, logout).

- `src/app/actions/actions.ts` :
  - Server Actions qui encapsulent la logique d’appel à l’API Django :
    - `getBarbers`, `addBarber`, `updateBarber`, `deleteBarber`,
    - `getTransactions`, `addTransaction`, `updateTransaction`, `deleteTransaction`,
    - `getUserProfile`, `updateUserProfile`, `deleteUserProfile`,
    - `updatePassword`,
    - `stats` (rapports mensuels),
    - `dashboard` (données du tableau de bord).
  - Gestion du **refresh token** via `refreshAccessToken()` en cas de 401.

- `src/constants/api.ts` :
  - client Axios avec :
    - `baseURL: (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL) + 'api/'`.

- `src/components/*` :
  - composants UI (Navbar, Hero, Features, Pricing, FAQ, Footer, etc.).

---

## Variables d’environnement

Créer un fichier `.env.local` dans `frontend/` (non commité) :

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/
# Optionnel pour les Server Actions (côté serveur)
API_URL=http://127.0.0.1:8000/
```

> **Important** :  
> - `NEXT_PUBLIC_API_URL` est utilisé côté **client** (navigateur).  
> - `API_URL` est utilisé côté **serveur** (Server Actions / API routes).

En production, ces valeurs doivent pointer vers l’URL publique du backend Django.

---

## Installation & lancement (développement)

Depuis le dossier `frontend/` :

```bash
npm install
npm run dev
```

L’application est disponible sur :

- `http://localhost:3000`

Assurez-vous que le backend Django tourne en parallèle (en général sur `http://127.0.0.1:8000/`).

---

## Scripts disponibles

Dans `frontend/package.json` :

- **`npm run dev`** : lance le serveur Next.js (mode développement).
- **`npm run build`** : build de production.
- **`npm run start`** : démarre le serveur Next.js en mode production (après `build`).
- **`npm run lint`** : exécute ESLint.

---

## Bonnes pratiques UI déjà utilisées

- Design **responsive** (mobile-first) avec Tailwind + DaisyUI.
- Composants réutilisables (Navbar, Footer, cartes, tableaux).
- Feedback utilisateur systématique (toasts de succès/erreur).
- Pagination côté UI et affichage de totaux.
- Respect des conventions Next.js (App Router, `app/`, fichiers `page.tsx`, `layout.tsx`, etc.).

