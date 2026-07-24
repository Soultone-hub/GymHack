# GymHack 🏋️⚡

**GymHack** est une application web moderne (PWA) de musculation et de fitness permettant de naviguer parmi **1 324 exercices animés**, de gérer ses favoris et d'exécuter des séances de musculation personnalisées.

L'application utilise **Supabase** comme Backend-as-a-Service (Base de données PostgreSQL, Authentification OAuth & Email, Storage d'images/GIFs et politiques RLS) et **Brevo** pour l'envoi d'emails transactionnels.

---

## ✨ Fonctionnalités Principales

- 🏋️ **Catalogue complet de 1 324 exercices** : Filtrage rapide par zone anatomique (dos, poitrine, bras, etc.) et par type d'équipement (haltères, poulie, poids du corps...).
- 🎬 **Animations GIF & Vignettes HD** : Chaque exercice est accompagné d'une animation GIF interactive hébergée sur Supabase Storage.
- 🌍 **Support Multilingue (10 langues)** : Instructions d'exécution détaillées disponibles en Français, Anglais, Espagnol, Italien, etc.
- 🔐 **Authentification Sécurisée** :
  - **Google OAuth** (connexion en un clic).
  - **Email / Mot de passe** avec confirmation d'email via **Brevo SMTP**.
  - **Réinitialisation de mot de passe** ("Mot de passe oublié ?").
- 🛡️ **Protection des données (RLS)** : Les favoris et dossiers de séances sont strictement privés et isolés par utilisateur grâce aux politiques *Row Level Security*.
- 🔖 **Favoris & Séances** : Marquage d'exercices en favoris et création de routines personnalisées avec réordonnancement.
- 🎨 **Design Premium** : Interface réactive sombre/claire avec animations fluides (Framer Motion) et icônes **Lucide React**.

---

## 🛠️ Stack Technique

- **Frontend** : React 19, Vite, TypeScript, TailwindCSS v4, Framer Motion, Lucide React Icons.
- **Backend / BDD** : Supabase (PostgreSQL, Supabase Auth, Supabase Storage, RLS).
- **Emailing** : Brevo (SMTP personnalisée).
- **Dataset** : Gym Visual (1 324 fiches d'exercices enrichies).

---

## 🚀 Guide d'Installation & Configuration

### 1. Prérequis
- **Node.js** (v18+) & `npm`
- Un compte **[Supabase](https://supabase.com)** (Gratuit)
- Un compte **[Brevo](https://www.brevo.com)** (Gratuit, pour l'envoi d'emails)

---

### 2. Cloner le projet & Installer les dépendances

```bash
git clone https://github.com/Soultone-hub/GymHack.git
cd GymHack
npm install
```

---

### 3. Configurer la base de données Supabase

1. Créez un nouveau projet sur **[Supabase](https://supabase.com)**.
2. Allez dans le **SQL Editor** de votre Dashboard Supabase.
3. Copiez et exécutez le fichier [`supabase/schema.sql`](./supabase/schema.sql) pour créer les tables (`exercises`, `user_favorites`, `workout_folders`, `folder_exercises`) et les politiques RLS.

---

### 4. Configurer les variables d'environnement (`.env.local`)

Créez un fichier `.env.local` à la racine du projet en vous basant sur `.env.example` :

```env
# Client Frontend (Vite)
VITE_SUPABASE_URL="https://votre-projet.supabase.co"
VITE_SUPABASE_ANON_KEY="votre-anon-key"

# Script d'importation Admin
SUPABASE_URL="https://votre-projet.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="votre-service-role-key"
DATASET_PATH="C:/projet-perso/DATA/GymHack-dataset"
```

---

### 5. Importer les 1 324 exercices & médias

Exécutez le script d'importation pour créer les buckets Supabase Storage (`exercise-images` et `exercise-videos`), uploader les vignettes JPG/GIFs et peupler la base de données :

```bash
npm run import
```

---

### 6. Lancer l'application en mode développement

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:3000`.

---

## 📜 Scripts Disponibles

| Commande | Description |
|---|---|
| `npm run dev` | Lance le serveur de développement Vite |
| `npm run build` | Compile l'application pour la production (`dist/`) |
| `npm run lint` | Exécute la vérification de types TypeScript (`tsc --noEmit`) |
| `npm run import` | Exécute le script d'importation des 1 324 exercices vers Supabase |

---

## 📁 Architecture du Projet

```text
GymHack/
├── scripts/
│   └── import.ts             # Script d'import du dataset vers Supabase
├── src/
│   ├── components/           # Composants réutilisables (Cards, Auth, Modals, Nav)
│   ├── data/                 # Métadonnées UI & traductions des zones/équipements
│   ├── hooks/                # Hook central useGymData (Auth, DB, Favs, Workouts)
│   ├── lib/                  # Initialisation du client Supabase
│   ├── services/             # Services API (exerciseService, favoritesService, workoutService)
│   ├── views/                # Vues principales (Home, ExerciseList, Detail, Favorites, Workouts)
│   ├── App.tsx               # Routeur principal & conteneur d'état
│   ├── main.tsx              # Point d'entrée React
│   └── types.ts              # Definitions des types TypeScript
├── supabase/
│   └── schema.sql            # Schéma SQL PostgreSQL + Politiques RLS
├── .env.example              # Modèle de variables d'environnement
├── package.json              # Dépendances & scripts
└── tsconfig.json             # Configuration TypeScript
```

---

## 📄 Licence

Projet sous licence MIT. Dataset d'exercices & visuels © Gym Visual (utilisés sous licence attribuée).
