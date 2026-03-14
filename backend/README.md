## Backend – CashCut (API Django)

Ce dossier contient l’API **REST** de CashCut, basée sur :

- **Django**
- **Django REST Framework**
- **SimpleJWT** (authentification JWT)
- **drf-spectacular** (documentation OpenAPI / Swagger)
- **django-environ** (gestion des variables d’environnement)
- **corsheaders** (CORS)

L’API est responsable de la gestion :

- des **utilisateurs** (compte, profil, mot de passe),
- des **coiffeurs** (Barbers),
- des **transactions** (services réalisés),
- des **rapports mensuels**,
- des **données de tableau de bord**.

---

## Structure principale

- `manage.py` : script de gestion Django.
- `cashcut/`
  - `settings.py` : configuration du projet (DRF, JWT, CORS, base de données, langue, timezone, etc.).
  - `urls.py` : routes principales du backend, y compris `/api/` et `/api/docs/`.
  - `wsgi.py`, `asgi.py` : points d’entrée serveur.
- `api/`
  - `models.py` : définitions des modèles `User`, `Barber`, `Transaction`.
  - `serializers.py` : sérialisateurs DRF pour les modèles.
  - `views.py` : logique métier et endpoints.
  - `urls.py` : routes API (`/api/...`).
  - `admin.py` : enregistrement des modèles dans l’admin Django.
  - `migrations/` : migrations de base de données.
  - `tests.py` : point d’entrée pour les tests.

---

## Modèles

### `User`

- Modèle utilisateur personnalisé (`AUTH_USER_MODEL = 'api.User'`) basé sur `AbstractBaseUser`.
- Champs principaux :
  - `id` (UUID, clé primaire),
  - `name`,
  - `email` (unique, utilisé comme identifiant),
  - `ville`,
  - `created_at`,
  - `is_active`.
- `UserManager` avec méthode `create_user` qui gère le hash du mot de passe.

### `Barber`

- Représente un **coiffeur**.
- Champs :
  - `id` (UUID),
  - `user` (FK vers `User`, propriétaire),
  - `barber_name`,
  - `salary` (pourcentage de salaire, entier, ex. 40 pour 40 %),
  - `created_at`.

### `Transaction`

- Représente un **service réalisé** dans le salon.
- Champs :
  - `id` (UUID),
  - `user` (FK vers `User`),
  - `barber` (FK vers `Barber`),
  - `service` (texte, ex. "Coupe simple"),
  - `amount` (décimal),
  - `payment_method` (texte, ex. "Espèces", "Mobile Money"...),
  - `date` (date/heure du service),
  - `created_at` (date d’enregistrement).
- Ordre par défaut : `-created_at` (les plus récentes d’abord).

---

## Endpoints principaux

Tous les endpoints sont préfixés par `/api/` (voir `cashcut/urls.py` et `api/urls.py`).

### Authentification & utilisateurs

- `POST /api/register/`
  - Crée un nouvel utilisateur (email, nom, mot de passe, ville).
  - Réponse : message + infos de base de l’utilisateur.

- `POST /api/login/`
  - Délégué à `TokenObtainPairView` (SimpleJWT).
  - Renvoie un `access` et un `refresh` token.

- `POST /api/token/refresh/`
  - Rafraîchit le token d’accès à partir du `refresh`.

- `GET /api/profile/`
  - Retourne le profil de l’utilisateur connecté (id, name, email, ville).

- `PUT /api/profile/`
  - Met à jour partiellement le profil de l’utilisateur connecté.

- `DELETE /api/profile/`
  - Supprime le compte de l’utilisateur connecté.

- `PUT /api/password/`
  - Change le mot de passe (champs `currentPassword` et `newPassword`).

### Barbers

- `GET /api/barbers/`
  - Liste paginée des coiffeurs de l’utilisateur connecté (5 par page).

- `POST /api/barbers/`
  - Crée un nouveau coiffeur pour l’utilisateur connecté.

- `GET /api/barbers/<uuid:pk>/`
  - Détails d’un coiffeur.

- `PUT /api/barbers/<uuid:pk>/`
  - Met à jour un coiffeur (nom, salaire).

- `DELETE /api/barbers/<uuid:pk>/`
  - Supprime un coiffeur **et toutes ses transactions** (CASCADE).

### Transactions

- `GET /api/transactions/`
  - Liste paginée (15 par page) des transactions de l’utilisateur connecté.
  - Retour additionnel de la liste des barbers pour simplifier l’UI.

- `POST /api/transactions/`
  - Crée une transaction (champ `barber_id` obligatoire).

- `GET /api/transactions/<uuid:pk>/`
  - Détails d’une transaction.

- `PUT /api/transactions/<uuid:pk>/`
  - Met à jour une transaction (montant, date, barber, etc.).

- `DELETE /api/transactions/<uuid:pk>/`
  - Supprime une transaction.

### Rapports

- `POST /api/reports/monthly/`
  - Corps attendu :
    - `month` (1–12),
    - `year`.
  - Réponse :
    - `barbers` : pour chaque coiffeur, nombre de services, total encaissé, salaire à verser, part salon.
    - `summary` : total encaissé, total salaires, bénéfice net.

### Dashboard

- `GET /api/dashboard/`
  - Renvoie l’ensemble des données nécessaires au tableau de bord :
    - infos utilisateur (nom, ville),
    - chiffre d’affaires du **jour**,
    - chiffre d’affaires **d’hier**,
    - nombre de **coiffeurs**,
    - total des **salaires à verser** pour le mois en cours,
    - dernières transactions (5 dernières),
    - classement des coiffeurs du jour (CA, nombre de services, rang),
    - liste des barbers.

---

## Configuration & variables d’environnement

Les variables sont gérées via `django-environ` dans `cashcut/settings.py` :

- `SECRET_KEY` : clé secrète Django.
- `DEBUG` : booléen (`True` ou `False`).
- `ALLOWED_HOSTS` : liste d’hôtes autorisés.
- `CORS_ALLOWED_ORIGINS` : liste des origines autorisées pour le frontend.

Créer un fichier `.env` dans le dossier `backend/` (même niveau que `manage.py` et `cashcut/`) :

```env
SECRET_KEY=change-moi-en-production
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

> En production :
> - mettre `DEBUG=False`,
> - ajuster `ALLOWED_HOSTS` et `CORS_ALLOWED_ORIGINS` en fonction du domaine.

---

## Base de données

Configuration actuelle (développement) dans `settings.py` :

- **SQLite** par défaut :

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
```

Une configuration **MySQL** est déjà commentée et prête à être activée pour la production (avec fichier `my.cnf`).

---

## Installation & lancement (développement)

Depuis le dossier `backend/` :

```bash
python -m venv .venv
.venv\Scripts\activate  # Windows
# source .venv/bin/activate  # macOS / Linux

pip install -r requirements.txt
```

Appliquer les migrations :

```bash
python manage.py migrate
```

(Optionnel) créer un superuser pour accéder à l’admin Django :

```bash
python manage.py createsuperuser
```

Démarrer le serveur :

```bash
python manage.py runserver  # http://127.0.0.1:8000
```

---

## Documentation API

Grâce à **drf-spectacular**, la documentation est générée automatiquement :

- **Schema OpenAPI** : `GET /api/schema/`
- **Interface Swagger UI** : `GET /api/docs/`

Ces routes sont définies dans `cashcut/urls.py` :

- `path('api/schema/', SpectacularAPIView.as_view(), name='schema')`
- `path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui')`

---

## Sécurité & bonnes pratiques

- Authentification par **JWT** :
  - tokens générés via `TokenObtainPairView` (`/api/login/`),
  - renouvelés via `TokenRefreshView` (`/api/token/refresh/`),
  - validés par `JWTAuthentication` (DRF).
- Modèle utilisateur personnalisé (`api.User`) pour utiliser l’email comme identifiant.
- Throttling DRF :
  - `AnonRateThrottle` et `UserRateThrottle` avec des limites configurées.
- Validation métier :
  - montant de transaction strictement positif (`validate_amount`),
  - vérification que le `barber` appartient à l’utilisateur connecté (`validate` du `TransactionSerializer`).
- Gestion fine des permissions :
  - `AllowAny` pour l’inscription,
  - `IsAuthenticated` pour toutes les opérations liées au compte, barbers, transactions, rapports, dashboard.

---

## Tests

Vous pouvez ajouter/étendre les tests dans `api/tests.py`, puis exécuter :

```bash
python manage.py test
```

---

## Déploiement (idées générales)

- Passer sur une base **MySQL** ou **PostgreSQL**.
- Servir l’application via **Gunicorn** ou **uWSGI** derrière un reverse proxy (Nginx).
- Configurer un stockage persistant pour la base de données.
- Mettre à jour les variables d’environnement (DEBUG, SECRET_KEY, ALLOWED_HOSTS, CORS_ALLOWED_ORIGINS).

