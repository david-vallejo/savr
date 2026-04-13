# Savr

> **The Netflix of food subscriptions.** Pre-order chef-cooked meals 24+ hours ahead and save up to 30%. SavrBot plans your week, wallet credit earns bonus, pickup or delivery on demand.

A production-grade pnpm monorepo with a React web app, React Native mobile app, shared UI/data/auth packages, and Supabase-ready backend — mock-first so you can run everything locally with zero credentials.

---

## Stack

| Layer | Tool |
| --- | --- |
| Monorepo | pnpm workspaces |
| Web | React 19 + Vite 7 + react-router 7 |
| Mobile | Expo SDK 54 + React Native 0.81 + React Navigation 7 |
| Language | TypeScript 5.9 |
| Backend | Supabase (mock-first) |
| Styling | CSS-in-JS (web) + StyleSheet (mobile), shared design tokens |

## Project layout

```
├── apps/
│   ├── web/                React + Vite app
│   │   └── src/
│   │       ├── pages/      Home · Login · Menu · MealDetail · Cart · Plans
│   │       │               Dashboard · Wallet · Bot · Orders · Profile · Settings
│   │       ├── navigation/ Router, PublicLayout, ProtectedLayout
│   │       └── components/
│   └── mobile/             Expo + React Native app (tab navigator)
│       └── src/
│           ├── screens/    Same 12 screens, re-implemented natively
│           └── navigation/ Tab + nested stack navigators
├── packages/
│   ├── ui/                 Shared cross-platform components (.tsx + .native.tsx)
│   │                       Button · Card · Badge · Chip · Input · PriceTag
│   │                       EmptyState · Header · Layout · NavigationBar · SavrLogo
│   ├── data/               In-memory domain store (meals, plans, cart, orders,
│   │                       wallet, SavrBot) with persistence on web.
│   │                       Drop-in replacement point for Supabase.
│   ├── auth/               Supabase + mock-mode auth provider
│   └── config/             Brand tokens, theme palette, env init
└── supabase/
    └── schema.sql          Auth-ready schema for when you wire real credentials
```

## Quick start

```bash
pnpm install
pnpm web      # http://localhost:5173
pnpm mobile   # Expo dev server → Expo Go or simulator
```

No Supabase credentials needed — the app runs in **mock mode** by default. Log in with `user` / `password`.

## Features

- **Landing page** · Chipotle-inspired hero, pillars, featured meals, plan highlight, CTA
- **Menu** · 8 chef-cooked meals, category filters, lead-time discount selector
- **Meal detail + Bowl Builder** · Pick protein / base / extras / sauce / upgrades, real-time pricing with lead-time discount
- **Cart + Checkout** · Pickup or delivery, fulfillment details, pre-order savings calc
- **Plans** · 6 prepaid packs & subscriptions (single, weekly, family, office)
- **Dashboard** · Today's deal, upcoming order, wallet balance, quick links
- **Wallet** · Balance, top-up deals with bonus credit, recent history
- **SavrBot** · Conversational AI meal planner (keyword-matched mock replies with action suggestions)
- **Orders** · Scheduled / cooking / ready / completed, cancel flow
- **Profile** · Display name, favorite protein, goal, allergies
- **Settings** · Notifications, session, log out

## Mock vs. real Supabase

Mock mode is the default and covers auth, cart, wallet, orders and SavrBot. Everything is persisted to `localStorage` on web and in-memory on mobile.

To switch to real Supabase, run `supabase/schema.sql` on your project and drop your keys into:

```bash
# apps/web/.env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...

# apps/mobile/.env
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
```

Mock mode auto-disables when credentials are present (see `packages/config/src/env.ts`). The data layer in `packages/data/` is designed to be the single place you'd swap in Supabase queries.

## Design system

Brand tokens live in `packages/config/src/theme.ts` and are consumed identically by both web and mobile. Palette is Chipotle-inspired warmth:

- **Charcoal** `#1A1512` (inverse surfaces)
- **Masa Cream** `#F7F1E6` (default surface)
- **Tomato** `#C8102E` (brand accent)
- **Ember** `#E86A2C` (highlight)
- **Avocado** `#5A8C3A` (secondary)

Typography: Inter (body) + Archivo (display, condensed feel for big headlines).

## Scripts

```bash
pnpm web              # Start Vite dev server
pnpm web:build        # Typecheck + production build
pnpm mobile           # Start Expo dev server
pnpm typecheck        # Typecheck every workspace
pnpm env:encrypt      # Encrypt .env → .env.enc for safe commits
pnpm env:decrypt      # Restore .env from .env.enc
```
