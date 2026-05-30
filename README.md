# Val AI OS

Dashboard web pour gérer des agents IA — powered by **#Val**.

## Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS** — design sombre professionnel
- **Zustand** — état persistant (localStorage)
- **jose** — JWT pour l'authentification
- **lucide-react** — icônes

## Fonctionnalités

| Section | Description |
|---|---|
| **Login** | Accès protégé par mot de passe + cookie JWT httpOnly |
| **Overview** | Dashboard avec stats, résumé agents et kanban |
| **Agents** | Gestion des agents IA + chat Super Agent coordinateur |
| **Kanban** | Board 5 colonnes (Backlog → Done) avec priorités |
| **Vault** | Mémoire partagée entre agents (clé/valeur catégorisée) |
| **Paramètres** | Configuration API, Super Agent, sécurité |

## Démarrage rapide

```bash
# 1. Cloner et installer
git clone <repo>
cd val-ai-os
npm install

# 2. Configurer l'environnement
cp .env.local.example .env.local
# Éditer .env.local avec ton mot de passe et JWT secret

# 3. Lancer en développement
npm run dev
# → http://localhost:3000
```

## Variables d'environnement

```env
# .env.local
DASHBOARD_PASSWORD=ton-mot-de-passe
JWT_SECRET=une-clé-aléatoire-de-32-caractères-minimum
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> Le mot de passe par défaut (dev) est `val2024` — **change-le avant de déployer**.

## Structure du projet

```
src/
├── app/
│   ├── login/              # Page de login
│   ├── dashboard/
│   │   ├── page.tsx        # Overview
│   │   ├── agents/         # Gestion agents + Super Agent chat
│   │   ├── kanban/         # Kanban board
│   │   ├── vault/          # Mémoire partagée
│   │   └── settings/       # Paramètres
│   └── api/auth/           # Routes login/logout
├── components/layout/      # Sidebar + TopBar
├── lib/
│   ├── auth.ts             # JWT + vérification mot de passe
│   └── store.ts            # Zustand stores (agents, kanban, vault, chat)
├── types/                  # Types TypeScript partagés
└── proxy.ts                # Auth guard (remplace middleware Next.js 15+)
```

## Déploiement

Compatible **Vercel**, **Railway**, ou tout hébergeur Node.js.

```bash
npm run build
npm run start
```

---

*Val AI OS — Système de gestion d'agents IA*
