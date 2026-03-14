## CashCut

CashCut est une application de **gestion de salon de coiffure / barbershop** qui vous aide à suivre :

- vos **coiffeurs** (barbers) et leurs pourcentages de salaire,
- toutes les **transactions** (services, montants, moyens de paiement, dates),
- les **salaires** à verser,
- le **bénéfice net** de votre salon,
- un **tableau de bord** clair avec les indicateurs clés du jour.

Le projet est structuré en deux parties :

- **frontend** : interface web moderne en Next.js 16 + React 19 + Tailwind CSS 4 + DaisyUI.
- **backend** : API REST en Django + Django REST Framework + JWT (SimpleJWT) + drf-spectacular (docs swagger).

---

## Fonctionnalités principales

- **Gestion des utilisateurs**
  - Création de compte par email + mot de passe.
  - Authentification **JWT** (login, refresh token).
  - Profil utilisateur (nom, email, ville) consultable et modifiable.
  - Possibilité de **supprimer son compte**.
  - Changement de **mot de passe**.

- **Gestion des coiffeurs (Barbers)**
  - Ajout, liste, modification et suppression de coiffeurs.
  - Chaque coiffeur a :
    - un **nom**,
    - un **pourcentage de salaire** (par ex. 40 %),
    - une date de création.
  - Pagination (5 coiffeurs par page côté API).

- **Gestion des transactions**
  - Ajout de transactions liées à un coiffeur :
    - **service** (ex. "Coupe simple"),
    - **montant** (FCFA),
    - **moyen de paiement** (Espèces, Mobile Money, etc.),
    - **date** du service.
  - Liste paginée (15 transactions par page) avec filtre implicite par utilisateur connecté.
  - Lecture, modification et suppression d’une transaction.

- **Tableau de bord (Dashboard)**
  - Chiffre d’affaires du **jour**.
  - Chiffre d’affaires **d’hier** (comparaison %).
  - Nombre total de **coiffeurs**.
  - Somme des **salaires à verser** pour le mois courant.
  - Liste des **5 dernières transactions**.
  - **Classement des coiffeurs du jour** (CA, nombre de services, rang).

- **Rapports et salaires**
  - Rapport **mensuel** par coiffeur :
    - nombre de services,
    - chiffre d’affaires par coiffeur,
    - salaire à verser au coiffeur,
    - part du salon.
  - Résumé global pour le mois :
    - total encaissé,
    - total de salaires à verser,
    - **bénéfice net** du salon.

- **Expérience utilisateur**
  - UI moderne, responsive, basée sur **Tailwind CSS 4** et **DaisyUI**.
  - Notifications via **react-hot-toast**.
  - Animations légères via **framer-motion**.
  - Pages dédiées : landing marketing, tableau de bord, transactions, salaires, paramètres, profil, etc.

- **API & Sécurité**
  - Authentification **JWT** (`/api/login/`, `/api/token/refresh/`).
  - Limitation de débit (throttling) DRF.
  - Modèle utilisateur personnalisé (`api.User`) avec email comme identifiant.
  - Validation métier (montant > 0, contrôle de l’appartenance d’un coiffeur à l’utilisateur connecté, etc.).
  - Documentation OpenAPI/Swagger automatique via **drf-spectacular**.

---

## Architecture du projet

- `frontend/` : application Next.js (App Router).
- `backend/` : projet Django `cashcut` + app `api`.

Schéma simplifié :

- **Frontend (Next.js)**
  - `app/page.tsx` : page d’accueil (landing).
  - `app/auth/login/page.tsx` & `app/auth/register/page.tsx` : pages d’auth.
  - `app/dashboard/page.tsx` : tableau de bord.
  - `app/dashboard/transactions/page.tsx` : gestion des transactions.
  - `app/dashboard/salary/page.tsx` : gestion des salaires / rapports mensuels.
  - `app/dashboard/settings/page.tsx` : paramètres / profil.
  - `src/app/actions/actions.ts` : Server Actions (appel API, gestion JWT).
  - `src/constants/api.ts` : client Axios configuré avec `API_URL` / `NEXT_PUBLIC_API_URL`.

- **Backend (Django)**
  - `api/models.py` : modèles `User`, `Barber`, `Transaction`.
  - `api/serializers.py` : sérialisateurs DRF.
  - `api/views.py` : endpoints (auth, profil, barbers, transactions, rapports, dashboard).
  - `api/urls.py` : routes API (`/api/...`).
  - `cashcut/settings.py` : configuration Django, DRF, JWT, CORS, etc.
  - `cashcut/urls.py` : routes principales + docs swagger (`/api/docs/`).

---

## Prérequis

- **Node.js** ≥ 18 (recommandé) + npm, yarn ou pnpm.
- **Python** ≥ 3.10.
- **pip** + (optionnel) `virtualenv` / `venv`.

---

## Installation rapide

Cloner le dépôt :

```bash
git clone https://github.com/gedeon2306/cashcut.git
cd cashCut
```

### 1. Backend (Django / API)

Depuis le dossier `backend/` :

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate  # Windows
# source .venv/bin/activate  # macOS / Linux

pip install -r requirements.txt
```

Créer le fichier d’environnement `.env` dans `backend/` :

```env
SECRET_KEY=change-moi-en-production
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

Appliquer les migrations et démarrer le serveur :

```bash
python manage.py migrate
python manage.py runserver  # http://127.0.0.1:8000
```

Quelques URLs utiles côté backend :

- **API** : `http://127.0.0.1:8000/api/`
- **Docs Swagger** : `http://127.0.0.1:8000/api/docs/`
- **Schema OpenAPI** : `http://127.0.0.1:8000/api/schema/`

### 2. Frontend (Next.js)

Depuis le dossier `frontend/` :

```bash
cd frontend
npm install
```

Créer un fichier `.env.local` dans `frontend/` :

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/
# Optionnel côté serveur Next :
API_URL=http://127.0.0.1:8000/
```

Lancer le serveur de développement :

```bash
npm run dev
```

L’interface est disponible sur :

- `http://localhost:3000`

---

## Scripts utiles

### Frontend (`frontend/package.json`)

- **`npm run dev`** : démarre le serveur Next.js en mode développement.
- **`npm run build`** : build de production.
- **`npm run start`** : démarre le serveur Next.js en mode production (après `build`).
- **`npm run lint`** : exécute ESLint.

### Backend

- **`python manage.py runserver`** : démarre le serveur Django (dev).
- **`python manage.py createsuperuser`** : crée un compte admin Django.
- **`python manage.py migrate`** : applique les migrations.

---

## API – Aperçu des endpoints

Tous les endpoints sont préfixés par `/api/` côté backend.

- **Auth**
  - `POST /api/register/` : inscription.
  - `POST /api/login/` : obtention du couple `access` / `refresh` (JWT).
  - `POST /api/token/refresh/` : rafraîchir le token d’accès.

- **Profil**
  - `GET /api/profile/` : récupérer le profil de l’utilisateur connecté.
  - `PUT /api/profile/` : mettre à jour le profil.
  - `DELETE /api/profile/` : supprimer le compte.
  - `PUT /api/password/` : changer le mot de passe.

- **Barbers**
  - `GET /api/barbers/` : liste paginée des coiffeurs de l’utilisateur.
  - `POST /api/barbers/` : créer un coiffeur.
  - `GET /api/barbers/<uuid>/` : détails d’un coiffeur.
  - `PUT /api/barbers/<uuid>/` : mettre à jour un coiffeur.
  - `DELETE /api/barbers/<uuid>/` : supprimer un coiffeur.

- **Transactions**
  - `GET /api/transactions/` : liste paginée des transactions.
  - `POST /api/transactions/` : créer une transaction.
  - `GET /api/transactions/<uuid>/` : détails d’une transaction.
  - `PUT /api/transactions/<uuid>/` : mettre à jour une transaction.
  - `DELETE /api/transactions/<uuid>/` : supprimer une transaction.

- **Rapports & Dashboard**
  - `POST /api/reports/monthly/` : rapport mensuel par coiffeur + résumé salon.
  - `GET /api/dashboard/` : données complètes du tableau de bord.

Pour plus de détails, consultez la documentation Swagger (`/api/docs/`).

---

## Déploiement (pistes générales)

- **Backend**
  - Passer `DEBUG=False`.
  - Générer une **nouvelle SECRET_KEY** sécurisée.
  - Configurer la base de données (MySQL, PostgreSQL, etc. – un exemple MySQL est déjà commenté dans `settings.py`).
  - Servir via Gunicorn / uWSGI + Nginx.

- **Frontend**
  - Construire le projet : `npm run build`.
  - Servir le build soit avec `next start` derrière un reverse proxy, soit le déployer sur une plateforme comme Vercel.
  - Mettre à jour `NEXT_PUBLIC_API_URL` pour pointer vers l’URL publique de l’API.

---

## Licence

Ce projet est fourni **tel quel** pour vos besoins de gestion de salon.  
Vous pouvez l’adapter et le modifier selon vos besoins internes.

