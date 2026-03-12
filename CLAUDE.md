# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Monorepo Structure

This is an npm workspaces monorepo for **Dash Delivery**, a freight/courier booking platform.

```
dashdelivery/
├── apps/
│   ├── api/          # Express + TypeScript backend (port 4500)
│   └── web/          # Next.js 16 frontend (port 3000)
├── packages/
│   ├── types/        # Shared TypeScript types
│   └── utils/        # Shared utilities
├── firebase.json     # Firestore + Storage rules config
└── package.json      # Root workspace config
```

## Commands

### Root (run both apps concurrently)
```bash
npm run dev        # Starts both api and web concurrently
npm run build      # Builds all workspaces
npm run lint       # Lints all workspaces
```

### API (`apps/api`)
```bash
npm run dev        # ts-node-dev with hot reload
npm run build      # tsc compile to dist/
npm run start      # Run compiled dist/index.js
npm run seed:firebase   # Seed Firebase with ts-node
```

### Web (`apps/web`)
```bash
npm run dev        # next dev
npm run build      # next build
npm run lint       # eslint
npx jest           # Run all tests
npx jest src/lib/pricing.test.ts   # Run a single test file
```

### Database (Prisma — run from `apps/api`)
```bash
npx prisma migrate dev     # Apply migrations (SQLite dev DB)
npx prisma studio          # Open Prisma Studio UI
npx prisma generate        # Regenerate client after schema changes
```

## Architecture

### Dual Data Storage
The API uses **two databases simultaneously**:
- **SQLite via Prisma** (`apps/api/prisma/dev.db`) — primary relational data: Bookings, Quotes, Invoices, Users, PriceRules, Services, ContentBlocks, SiteSettings, etc.
- **Firebase Firestore** — audit logs (`audit_logs` collection) and Firebase Auth for user identity/JWT verification.

### Authentication Flow
1. Frontend uses Firebase Auth (client SDK in `apps/web/src/lib/firebase/config.ts`) to sign in.
2. Firebase ID tokens are attached to all API requests via the axios interceptor in `apps/web/src/lib/api.ts`.
3. The API middleware (`apps/api/src/middleware/auth.ts`) verifies tokens using `firebase-admin` and checks for `ADMIN` or `SUPER_ADMIN` custom claims.
4. Admin UI (`apps/web/src/app/admin/layout.tsx`) guards routes client-side with `onAuthStateChanged`, redirecting to `/admin/login` if unauthenticated.

### API Structure (`apps/api/src/`)
- `index.ts` — Express app with three route groups:
  - `POST /api/v1/admin/auth/*` — login/logout (strict rate limit: 10/hr)
  - `GET|PUT /api/v1/admin/*` — protected admin routes (requires ADMIN/SUPER_ADMIN role)
  - `GET|POST /api/v1/*` — public routes (price calculator, tracking, services, etc.)
- `routes/` — route definitions (thin, delegate to controllers)
- `controllers/` — business logic handlers
- `services/` — `emailService`, `pdfService` (PDFKit), `vatService`
- `lib/schemas.ts` — Zod validation schemas for all request bodies
- `lib/audit.ts` — writes admin actions to Firestore `audit_logs` collection

### Web Structure (`apps/web/src/`)
- `app/` — Next.js App Router pages
  - `app/admin/` — admin dashboard (dark theme, isolated CSS via `admin.css`)
  - `app/admin/(dashboard)/` — route group for dashboard pages with shared layout
  - `app/book/` — public booking flow
  - `app/track/` — parcel tracking
- `components/` — shared components (admin, booking steps, sections, ui)
- `lib/api.ts` — axios instance with Firebase token interceptor; `fetcher` helper for SWR
- `lib/pricing.ts` — pure pricing calculation logic (used in tests)

### Admin Panel Isolation
The admin panel uses a scoped dark theme completely separate from the public site. Key details:
- `apps/web/src/app/admin/admin.css` contains all admin-specific CSS variables and layout classes
- The admin layout uses inline styles and `id="admin-root"` to prevent global style leakage
- Public nav/footer components are excluded from `/admin` routes via the admin layout

## Environment Variables

### `apps/api/.env`
```
FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY
PORT                    # defaults to 4500
ALLOWED_ORIGINS         # comma-separated, defaults to http://localhost:3000
SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
```

### `apps/web/.env.local`
```
NEXT_PUBLIC_API_URL                     # API base URL, defaults to http://localhost:4000/api/v1
NEXT_PUBLIC_FIREBASE_API_KEY, _AUTH_DOMAIN, _PROJECT_ID, _STORAGE_BUCKET, _MESSAGING_SENDER_ID, _APP_ID
FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY   # server-side admin SDK
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY
SENDGRID_API_KEY
```

> Note: The web `api.ts` defaults to port 4000 but the API runs on 4500 — ensure `NEXT_PUBLIC_API_URL` is set correctly in `.env.local`.

## Key Conventions

- All API responses follow `{ success: boolean, data?: any, message?: string }` shape.
- Zod schemas in `apps/api/src/lib/schemas.ts` validate all incoming request bodies.
- Admin mutations should call `logAuditAction()` from `apps/api/src/lib/audit.ts`.
- The web uses SWR with the `fetcher` helper from `lib/api.ts` for data fetching in admin pages.
- `Invoice.line_items` is stored as a JSON string in SQLite (not a native JSON column); parse/stringify on read/write.
