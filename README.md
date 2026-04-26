# FlowDrop

Work first. Structure follows.

FlowDrop is a dark-theme-first productivity workspace for small teams. It includes a complete onboarding flow, dashboard shell, drop feed, AI insights surface, and a typed UI component library built with Next.js App Router.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4 + design tokens
- Framer Motion transitions
- Zustand global state
- TanStack Query server-state caching
- Zod schema validation
- Prisma + PostgreSQL schema scaffold
- OpenAI client scaffold
- NextAuth config scaffold

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Configure env vars:

```bash
cp .env.example .env.local
```

3. Generate Prisma client:

```bash
npm run prisma:generate
```

4. Start dev server:

```bash
npm run dev
```

## Scripts

- `npm run dev` - start local dev server
- `npm run build` - production build
- `npm run start` - run production server
- `npm run lint` - lint codebase
- `npm run prisma:generate` - generate Prisma client
- `npm run prisma:migrate` - run Prisma dev migrations

## Routes

- `/auth/login` - split-screen login/landing gate
- `/auth/onboarding` - multi-step onboarding
- `/home` - dashboard home with feed + team pulse
- `/drops` - drops list
- `/team` - team flow view
- `/insights` - AI insights + suggestion banner
- `/files` - files empty-state flow
- `/archive` - archive empty-state flow

## Notes

- Mock data is intentionally marked with `TODO: replace with real API call` comments.
- API access is organized under `src/lib`.
- The app is scaffolded for Supabase/PostgreSQL + Prisma integration and can be connected by updating env vars and implementing real endpoints.
