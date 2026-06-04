# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Collision** — a coworking space management webapp with three distinct surfaces:
1. **Marketing site** — public-facing landing page with scroll animations, contact links (email, WhatsApp, Instagram), and a "Get a Quote" form that saves contacts to the database.
2. **Admin portal** (`/admin`) — protected dashboard for the owner to manage clients, seats, payments, billing, and expenses per branch.
3. **Client portal** (`/portal`) — protected area for members to view their attendance, seat info, and billing status.

Dark/light theme is available throughout all surfaces via `next-themes`.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Styling**: Tailwind CSS v4 (CSS-first `@theme`, no `tailwind.config`) + shadcn/ui
- **Animations**: Framer Motion (scroll-driven on the marketing site)
- **Auth**: NextAuth.js v5 (credentials provider — bcrypt password in DB)
- **Database**: Prisma **7** + SQLite via the **better-sqlite3 driver adapter**
- **Theme**: `next-themes` with a `ThemeProvider` wrapping the root layout
- **Fonts**: Space Grotesk (headings) + DM Sans (body)
- **Brand**: "CO-LLISION" — teal/cyan palette chosen to match the real interior; contact details and copy live in `content.md` and `lib/site.ts`

## Gotchas (Prisma 7 + NextAuth v5 on Edge)

- **Prisma 7 removed `url` from `schema.prisma`.** The datasource URL lives in `prisma.config.ts`. The runtime client (`lib/db.ts`) and `prisma/seed.ts` must construct `new PrismaClient({ adapter })` with `new PrismaBetterSqlite3({ url: "file:<abs path>" })` — passing a raw path string or `datasourceUrl` will fail.
- **Auth is split** into `lib/auth.config.ts` (edge-safe, no Prisma — used by `middleware.ts`) and `lib/auth.ts` (adds the Credentials provider, Node runtime). Never import `lib/db.ts` from middleware.
- **shadcn defaulted to base-ui**, whose API differs from radix (`render` vs `asChild`). `dialog.tsx` and `select.tsx` were replaced with canonical radix versions; other primitives remain base-ui.
- **lucide-react has no `Instagram` export** in this version — use `components/icons/instagram.tsx`.
- Framer Motion v12 needs `type: "spring" as const` in inline transitions.
- Real space photos live in `public/spaces/`.

## Dev Commands

```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Production build (also runs full TS type-check)
npm run lint         # ESLint
npm run seed         # Seed admin + demo client + branches/seats/expenses
npx prisma studio    # GUI to inspect/edit the database
npx prisma db push   # Push schema changes to dev.db (no migration file)
npx prisma generate  # Regenerate Prisma client after schema changes
```

### Seed logins
- Admin:  `admin@collision.pk` / `admin123`
- Client: `demo@collision.pk` / `client123`

## Architecture

### Route Groups
- `app/(marketing)/` — unauthenticated public routes; shares a minimal layout with the navbar and footer.
- `app/(admin)/admin/` — requires `role === "ADMIN"` session; has its own sidebar layout.
- `app/(portal)/portal/` — requires any authenticated session; simplified sidebar for clients.
- `app/api/` — API routes for auth (`/api/auth/[...nextauth]`), contacts, clients, payments, attendance.

### Auth Flow
`lib/auth.ts` configures NextAuth. The `role` field on the `User` model (`ADMIN` | `CLIENT`) gates access in middleware (`middleware.ts`) using `withAuth` from `next-auth/middleware`. Admins can access both `/admin` and `/portal`; clients only `/portal`.

### Data Model (Prisma)
Key models: `User` (auth + role), `Branch`, `Client` (linked to `User`), `Seat`, `Invoice`, `Payment`, `Expense`, `Attendance`, `ContactInquiry`.

### Theme
`components/theme-provider.tsx` wraps the app. Toggle lives in the shared navbar. Classes use Tailwind's `dark:` variant; `darkMode: "class"` is set in `tailwind.config.ts`.

### Marketing Animations
Scroll animations use Framer Motion's `useInView` / `motion` components inside `components/marketing/`. Each section fades/slides in on scroll — keep animation logic co-located with the section component, not in a global hook.
