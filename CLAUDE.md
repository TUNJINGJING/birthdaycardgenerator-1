# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Birthday Card Generator (birthdaycardgenerator.com) — a Next.js 14 app for creating personalized birthday cards via AI (Replicate API text-to-image). The Typography Tool (client-side DOM-to-image) was removed in favor of AI-only generation on the homepage.

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for development
npm run build:prod   # Production build (NODE_ENV=production)
npm run start        # Start production server
npm run lint         # ESLint
```

Uses npm (package-lock.json). No test framework configured.

## Architecture

### Routing (App Router + next-intl)

All pages live under `src/app/[locale]/(free)/`. The `(free)` route group provides a shared layout with Navbar + Footer + Toaster. Currently only `en` locale is active.

**Pages:**
- `/` — Homepage: TopHero + AI Card Generator (WorkerOriginal, the main feature)
- `/ai-card` — (may be removed, duplicates homepage)
- `/text-to-image` — (removed, was older duplicate of AI generation)
- `/pricing` — Pricing tiers
- `/dashboard` — User's generated cards gallery (requires auth)
- `/legal/privacy-policy`, `/legal/terms-of-service` — Legal pages
- `/share/[shareId]` — Shared card view

### Key Components — What to Keep vs Remove

**KEEP (AI Card flow):**
- `src/components/replicate/text-to-image/worker-original.tsx` — Main AI card generator with style selector + greeting presets
- `src/components/replicate/text-to-image/worker-original-wraper.tsx` — Server component that fetches effect config from DB
- `src/components/replicate/text-to-image/img-output-original.tsx` — AI output display with download + share
- `src/components/birthday-card/StyleSelector.tsx` — 4 style options (warm/funny/formal/cute)
- `src/components/birthday-card/GreetingPresets.tsx` + `greetingPresetsData.ts` — Preset birthday messages by category
- `src/components/birthday-card/CardPlaceholder.tsx`, `BirthdayCardLogo.tsx` — Supporting UI

**REMOVE (Typography Tool):**
- `src/components/typography-card/TypographyGenerator.tsx` — Client-side card builder (name/message/style → snapdom export)
- `src/lib/cardStyles.ts` — Typography card style definitions (minimalist/playful/elegant)
- `src/lib/colors.ts`, `src/config/colors.json`, `src/config/fonts.ts` — Typography style configs

**OLDER DUPLICATE (consider removing):**
- `src/components/replicate/text-to-image/worker.tsx` — Older AI worker (simpler UI, no greeting presets)
- `src/components/replicate/text-to-image/worker-wraper.tsx` — Wrapper for the older worker
- `src/components/replicate/text-to-image/img-output.tsx` — Older output component
- `src/app/[locale]/(free)/text-to-image/page.tsx` — Page using the older worker

### Backend Structure

- `src/backend/config/db.ts` — PostgreSQL connection pool (via `POSTGRES_URL` env var)
- `src/backend/models/` — Data access layer (user, effect, effect_result, subscription_plan, user_subscription, credit_usage, payment_history)
- `src/backend/service/` — Business logic layer
- `src/backend/service/generate-_check.ts` — Validates user credits before AI generation
- `src/backend/type/type.ts` — Core interfaces: User, Effect, EffectResult, SubscriptionPlan, UserSubscription, CreditUsage, PaymentHistory

### API Routes

- `POST /api/predictions/text_to_image` — Calls Replicate API to generate card image, creates effect_result record
- `GET /api/predictions/[id]` — Poll prediction status
- `POST /api/webhook/replicate` — Replicate webhook for prediction updates
- `POST /api/webhook/stripe` — Stripe payment webhook
- `POST /api/checkout` — Stripe checkout session creation
- `POST /api/effect_result/list_by_user_id` — Paginated user results
- `POST /api/effect_result/update` — Update result after generation completes
- `POST /api/share/create` — Create shareable link
- Auth via NextAuth (`src/app/api/auth/[...nextauth]/route.ts`) with Google OAuth

### External Services

- **Replicate** — AI image generation (text-to-image model)
- **Stripe** — Payments and subscriptions
- **Cloudflare R2** — Image storage
- **PostgreSQL** (Supabase) — Database
- **NextAuth** — Authentication (Google OAuth)

### State Management

- `src/contexts/app.tsx` — AppContext: user state, sidebar state
- `src/providers/session.tsx` — NextAuth session provider
- `src/contexts/theme.tsx` — Theme provider

### Environment Variables

Required (see `.env.production`): `POSTGRES_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXTAUTH_SECRET`, `REPLICATE_API_TOKEN`, `REPLICATE_URL`, `STRIPE_PUBLIC_KEY`, `STRIPE_PRIVATE_KEY`, `STRIPE_WEBHOOK_SECRET`, R2 credentials.
