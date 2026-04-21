<p align="center">
	<img src="./src/app/favicon.ico" alt="match-vault logo" width="92" height="92" />
</p>

<h1 align="center">match-vault</h1>

<p align="center"><i>Role-aware matchmaking app powered by Next.js, Prisma, Auth.js, and Pusher.</i></p>

<p align="center">
	<img src="https://img.shields.io/badge/VERSION-1.0.0-E11D48?style=for-the-badge&logo=semanticrelease&logoColor=white&labelColor=7F1D1D" alt="Version 1.0.0" />
	<img src="https://img.shields.io/badge/LICENSE-MIT-84CC16?style=for-the-badge&logo=opensourceinitiative&logoColor=white&labelColor=14532D" alt="MIT License" />
	<img src="https://img.shields.io/badge/TYPE-MATCHMAKING-8B5CF6?style=for-the-badge&labelColor=4C1D95" alt="Matchmaking app" />
</p>

<p align="center">
	<img src="https://img.shields.io/badge/NEXT.JS-16-14B8A6?style=for-the-badge&logo=next.js&logoColor=white&labelColor=0F766E" alt="Next.js" />
	<img src="https://img.shields.io/badge/REACT-19-06B6D4?style=for-the-badge&logo=react&logoColor=white&labelColor=155E75" alt="React" />
	<img src="https://img.shields.io/badge/TYPESCRIPT-5-3B82F6?style=for-the-badge&logo=typescript&logoColor=white&labelColor=1E3A8A" alt="TypeScript" />
	<img src="https://img.shields.io/badge/PRISMA-ORM-6366F1?style=for-the-badge&logo=prisma&logoColor=white&labelColor=4338CA" alt="Prisma" />
	<img src="https://img.shields.io/badge/POSTGRESQL-DATABASE-0EA5E9?style=for-the-badge&logo=postgresql&logoColor=white&labelColor=1E40AF" alt="PostgreSQL" />
	<img src="https://img.shields.io/badge/AUTH.JS-V5-7C3AED?style=for-the-badge&logo=auth0&logoColor=white&labelColor=5B21B6" alt="Auth.js" />
	<img src="https://img.shields.io/badge/PUSHER-REALTIME-A855F7?style=for-the-badge&logo=pusher&logoColor=white&labelColor=6D28D9" alt="Pusher" />
</p>

<p align="center">
	<a href="#-project-intro"><img src="https://img.shields.io/badge/EXPLORE-PROJECT%20INTRO-6366F1?style=for-the-badge&logo=gitbook&logoColor=white&labelColor=4F46E5" alt="Project intro" /></a>
	<a href="#-install-methods"><img src="https://img.shields.io/badge/SETUP-INSTALL%20GUIDE-14B8A6?style=for-the-badge&logo=readme&logoColor=white&labelColor=0F766E" alt="Install guide" /></a>
	<a href="#-available-scripts"><img src="https://img.shields.io/badge/RUN-SCRIPTS-A855F7?style=for-the-badge&logo=files&logoColor=white&labelColor=7E22CE" alt="Scripts" /></a>
</p>

## match-vault — README

Modern full-stack matchmaking application built with Next.js App Router, Prisma, PostgreSQL, NextAuth v5, and real-time messaging/notifications with Pusher.

## Table of Contents

- [🚀 Project intro](#-project-intro)
- [📁 Project structure](#-project-structure)
- [⭐ Differentiators](#-differentiators)
- [🔧 Features](#-features)
- [🧰 Tech stack](#-tech-stack)
- [⚙️ Install methods](#️-install-methods)
	- [📦 npm / Node](#-npm--node)
- [🔐 Environment variables](#-environment-variables)
- [🗄️ Database structure](#️-database-structure)
- [📜 Available scripts](#-available-scripts)
- [🚀 Deployment notes](#-deployment-notes)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## 🚀 Project intro

`match-vault` is a role-aware matchmaking platform with:

- Email/password + social authentication (Google/GitHub)
- Profile onboarding and completion flow
- Member discovery with filters/pagination
- Likes (including mutual likes)
- Real-time chat and real-time notifications
- Admin photo moderation

It is designed as an MVP-friendly production-ready foundation for social/match applications.

## 📁 Project structure

```txt
match-vault/
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── public/
│   └── images/
├── scripts/
│   ├── checkCounts.js
│   └── with-db-env.mjs
├── src/
│   ├── app/
│   │   ├── (auth)/               # login/register/verify/reset/profile-complete
│   │   ├── actions/              # server actions (auth/member/like/message/admin)
│   │   ├── admin/moderation/
│   │   ├── api/                  # auth, health, pusher-auth, sign-image
│   │   ├── lists/
│   │   ├── members/
│   │   └── messages/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── auth.ts
│   ├── auth.config.ts
│   ├── middleware.ts
│   └── routes.ts
├── package.json
└── README.md
```

## ⭐ Differentiators

- Server Actions first approach for core domain operations
- Auth.js + Prisma adapter with role and profile-completion-aware middleware guards
- Real-time UX via Pusher (chat updates, likes, presence-style notifications)
- Practical Neon/Vercel database env fallback handling (`DATABASE_URL`/`DIRECT_URL` auto-resolution)
- Admin moderation workflow for uploaded photos

## 🔧 Features

### Core features

| Feature | Status | Notes |
| --- | --- | --- |
| Credentials auth | ✅ Current | Register, login, email verification, password reset |
| Social auth | ✅ Current | Google + GitHub providers (optional via env vars) |
| Profile completion flow | ✅ Current | OAuth users are redirected until profile is completed |
| Member browsing | ✅ Current | Filter by age/gender/photo + pagination |
| Likes & lists | ✅ Current | Source likes, target likes, mutual likes |
| Messaging | ✅ Current | Real-time thread updates + inbox/outbox view |
| Photo uploads | ✅ Current | Cloudinary upload + signed API route |
| Admin moderation | ✅ Current | Approve/reject pending photos |
| Health endpoint | ✅ Current | DB connectivity check (`/api/health/db`) |

### Route protection behavior

- Public route: `/`
- Auth routes: `/login`, `/register`, `/register/success`, `/verify-email`, `/forgot-password`, `/reset-password`
- All other app routes require authentication
- `/admin/*` routes require `ADMIN` role
- OAuth users with incomplete profile are redirected to `/profile-complete`

## 🧰 Tech stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Auth:** NextAuth/Auth.js v5 + Prisma Adapter
- **Database:** PostgreSQL + Prisma ORM
- **UI:** HeroUI + Tailwind CSS 4
- **Forms/Validation:** React Hook Form + Zod
- **Realtime:** Pusher + pusher-js
- **Media:** Cloudinary + next-cloudinary
- **Email:** Resend

## ⚙️ Install methods

### 📦 npm / Node

Prerequisites:

- Node.js 20+
- PostgreSQL database (local or hosted, e.g. Neon)

```bash
git clone <your-repo-url> match-vault
cd match-vault
npm install
```

1) Create your `.env` file (see [Environment variables](#-environment-variables)).

2) Apply migrations:

```bash
npx prisma migrate dev
```

3) Seed sample data:

```bash
npx prisma db seed
```

4) Start development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## 🔐 Environment variables

Create a `.env` in project root:

```env
# Database (minimum)
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Optional DB fallbacks supported by this repo
POSTGRES_PRISMA_URL=""
POSTGRES_URL=""
POSTGRES_URL_NON_POOLING=""
NEON_DATABASE_URL=""
NEON_POSTGRES_URL=""

# Auth.js / NextAuth
AUTH_SECRET="your-random-secret"
NEXTAUTH_URL="http://localhost:3000"

# Credentials email flows
RESEND_API_KEY=""
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# Optional social providers
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""

# Cloudinary (upload + signature)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=""
NEXT_PUBLIC_CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

# Pusher (real-time)
PUSHER_APP_ID=""
NEXT_PUBLIC_PUSHER_APP_KEY=""
PUSHER_APP_SECRET=""

# Optional diagnostics
DEBUG_ERRORS="false"
```

Notes:

- `src/lib/prisma.ts` and `scripts/with-db-env.mjs` auto-map several Vercel/Neon env names into `DATABASE_URL` and `DIRECT_URL`.
- If Pusher env vars are missing, real-time features will fail where server/client instances are required.

## 🗄️ Database structure

Prisma models in this repo:

- `User` (role, profile completion, auth data)
- `Member` (public profile, demographic details)
- `Photo` (member media + moderation state)
- `Like` (source/target relation; composite PK)
- `Message` (thread messages with soft-delete flags)
- `Token` (email verification + password reset tokens)
- `Account` (OAuth account linkage)

Enums:

- `Role`: `ADMIN`, `MEMBER`
- `TokenType`: `VERIFICATION`, `PASSWORD_RESET`

## 📜 Available scripts

```bash
npm run dev            # start dev server
npm run build          # production build
npm run start          # run production server
npm run lint           # lint project
npm run vercel-build   # prisma generate + migrate deploy + seed + build
```

Utility scripts:

- `node scripts/checkCounts.js` — quick sanity counts for `User` and `Member`
- `node scripts/with-db-env.mjs <command>` — run command with DB env fallbacks resolved

## 🚀 Deployment notes

- The `vercel-build` script is configured for deploy-time Prisma generation, migration, seeding, and Next.js build.
- Seed creates demo users and an admin account:
	- Admin email: `admin@test.com`
	- Default seed password: `password`
- Rotate seed credentials and production secrets before public deployment.

## 🤝 Contributing

- Fork the repository and create a feature branch.
- Keep pull requests focused and include verification steps.
- Never commit secrets or real credentials.

## 📄 License

This project is licensed under the MIT License.
See the `LICENSE` file for details.
