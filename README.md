<p align="center">
	<img src="./src/app/favicon.ico" alt="match-me logo" width="120" height="120" />
</p>

<h1 align="center">match-me</h1>

<p align="center">
	<img src="https://img.shields.io/badge/APP-match--me-black?style=for-the-badge" alt="match-me app" />
	<img src="https://img.shields.io/badge/VERSION-v0.1.0-CB3837?style=for-the-badge" alt="Version v0.1.0" />
	<img src="https://img.shields.io/badge/LICENSE-MIT-97CA00?style=for-the-badge" alt="MIT License" />
	<img src="https://img.shields.io/badge/TYPE-MATCHMAKING-7B42F6?style=for-the-badge" alt="Matchmaking app" />
</p>

# match-me — README

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

`match-me` is a role-aware matchmaking platform with:

- Email/password + social authentication (Google/GitHub)
- Profile onboarding and completion flow
- Member discovery with filters/pagination
- Likes (including mutual likes)
- Real-time chat and real-time notifications
- Admin photo moderation

It is designed as an MVP-friendly production-ready foundation for social/match applications.

## 📁 Project structure

```txt
match-me/
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
git clone <your-repo-url> match-me
cd match-me
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
