## Frontend – CashCut

Ce dossier contient l’interface **web** de CashCut, développée avec :

- **Next.js 16.1.6** (App Router, SSR/SSG, Server Components)
- **React 19.2.3** (UI core)
- **TypeScript 5.x** (typage statique)
- **Tailwind CSS 4.x** (styling atomique)
- **DaisyUI 5.5.19** (composants UI prédéfinis)
- **Axios 1.13.6** (client HTTP)
- **react-hot-toast 2.6.0** (notifications toast)
- **framer-motion 12.35.0** (animations fluides)
- **lucide-react 0.577.0** (icônes SVG)

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
- **Animations fluides** pour améliorier l'UX (framer-motion).
- **Gestion des erreurs** via try/catch et messages utilisateur clairs.
- Stockage JWT dans des **cookies HTTP-only** pour plus de sécurité.
- Refresh automatique des tokens en cas d'expiration (401).

---

## Authentification & gestion JWT

L'authentification est gérée via :

1. **API routes Next** (`app/api/login/`, `app/api/register/`, `app/api/logout/`) :
   - Récupèrent les tokens auprès du backend Django.
   - Les stockent dans des **cookies HTTP-only**.

2. **Server Actions** (`src/app/actions/actions.ts`) :
   - Incluent automatiquement les tokens dans les requêtes à l'API.
   - Gèrent le rafraîchissement des tokens en cas de 401.

3. **Protection des routes** :
   - L'accès au `/dashboard` et ses sous-pages requiert une authentification valide.
   - Redirection automatique vers `/auth/login` si le token est manquant ou expiré.

---

## Déploiement

### Build de production

```bash
npm run build
npm start
```

### Sur Vercel (recommandé pour Next.js)

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel
```

> Pensez à configurer les variables d'environnement (NEXT_PUBLIC_API_URL, etc.) dans les paramètres Vercel.

### Sur d'autres plateformes (Netlify, Railway, etc.)

- Générer le build : `npm run build`
- Pointer le serveur vers le dossier `.next/` ou utiliser le Docker image de Next.js.
- Configurer les variables d'environnement.

---

## Structure du projet

```
frontend/
├── app/
│   ├── globals.css           # Styles globaux Tailwind + DaisyUI
│   ├── layout.tsx            # Layout principal
│   ├── page.tsx              # Landing page
│   ├── not-found.tsx         # Page 404
│   ├── auth/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   ├── confirm/page.tsx
│   │   ├── email-send/page.tsx
│   │   └── reset-password/page.tsx
│   ├── dashboard/
│   │   ├── page.tsx          # Dashboard principal
│   │   ├── transactions/page.tsx
│   │   ├── salary/page.tsx
│   │   ├── settings/page.tsx
│   │   ├── barbers/          # (page dédiée aux coiffeurs)
│   │   ├── [path]/page.tsx
│   │   └── layout.tsx        # Layout du dashboard
│   ├── a-propos/page.tsx
│   ├── mentions-legales/page.tsx
│   ├── politique-confidentialite/page.tsx
│   ├── licence/page.tsx
│   └── api/
│       ├── login/
│       ├── register/
│       ├── logout/
│       ├── confirm-email/
│       ├── confirm-login/
│       ├── forgot-password/
│       ├── resend-confirmation/
│       └── reset-password/
├── src/
│   ├── app/
│   │   └── actions/
│   │       └── actions.ts    # Server Actions (appels API, gestion JWT)
│   ├── components/
│   │   ├── FAQ.tsx
│   │   ├── Features.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   ├── NavBar.tsx
│   │   └── Pricing.tsx
│   ├── constants/
│   │   ├── api.ts            # Client Axios configuré
│   │   └── routes.ts
│   └── hooks/
│       └── useTheme.ts
├── public/
│   ├── images/
│   └── manifest.json
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── eslint.config.mjs
├── postcss.config.mjs
└── middleware.ts
```

---

## Dépendances principales

Voir `package.json` pour la liste complète :

| Package | Version | Usage |
|---------|---------|-------|
| **next** | 16.1.6 | Framework SSR/SSG |
| **react** | 19.2.3 | Bibliothèque UI |
| **typescript** | 5.x | Typage statique |
| **tailwindcss** | 4.x | Styling |
| **daisyui** | 5.5.19 | Composants UI |
| **axios** | 1.13.6 | Client HTTP |
| **react-hot-toast** | 2.6.0 | Notifications |
| **framer-motion** | 12.35.0 | Animations |
| **lucide-react** | 0.577.0 | Icônes |

---

## Conseils de développement

1. **Mode développement** : `npm run dev` lance un serveur avec hot-reload.
2. **TypeScript** : Vérifiez les erreurs avec votre IDE (VS Code recommandé).
3. **Linting** : Exécutez `npm run lint` régulièrement.
4. **Testing** : Ajoutez des tests unitaires/intégration avec Jest + React Testing Library (si besoin).
5. **Performance** : Utilisez l'onglet Network de DevTools et Lighthouse pour auditer.

---

## Problèmes courants

**Q: Les appels API retournent 401**  
A: Vérifiez que le backend tourne, que les tokens sont présents dans les cookies, et que `NEXT_PUBLIC_API_URL` est correctement configurée.

**Q: L'authentification ne fonctionne pas après le déploiement**  
A: Vérifiez que `NEXT_PUBLIC_API_URL` pointe vers l'URL du backend en production.

**Q: Le thème DaisyUI ne s'applique pas**  
A: Assurez-vous que `tailwind.config.ts` inclut DaisyUI et que `globals.css` importe les styles Tailwind.

---

**Dernière mise à jour** : mai 2026
- Pagination côté UI et affichage de totaux.
- Respect des conventions Next.js (App Router, `app/`, fichiers `page.tsx`, `layout.tsx`, etc.).

