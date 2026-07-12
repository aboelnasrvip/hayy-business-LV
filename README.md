# HAYY Business Hub

Business dashboard for HAYY — manage places, posts, offers, events, reviews, and subscriptions from one neumorphic control panel.

---

## Overview

HAYY Business Hub is the web app for business owners who list on the HAYY platform. It covers the full journey from signup and onboarding through subscription payment, then day-to-day operations: locations, content, promotions, and customer feedback.

| Area | What you can do |
|------|-----------------|
| **Auth** | Register, login, Google OAuth, email verification, password reset |
| **Onboarding** | Business profile, CR / tax details, approval pending state |
| **Billing** | Subscription plans and payment flow |
| **Places** | Create and edit locations, categories, map pin, place profile |
| **Content** | Posts (with images), offers, events |
| **Engagement** | Ratings & reviews with replies, comments |
| **Profile** | Business logo, branding, account settings |

---

## Tech stack

| Layer | Tools |
|-------|--------|
| Framework | React , TypeScript, Vite  |
| UI | Tailwind CSS,  Framer Motion, Lucide |
| State | Redux Toolkit |
| Forms | React Hook Form, Zod |
| HTTP | Axios (Bearer auth + refresh-token interceptor) |
| Maps | Leaflet / React Leaflet, Google Maps |
| Theme | Light / dark (`next-themes`) |
| Tests | Vitest, Testing Library |

---

## Getting started

### Prerequisites

- **Node.js** 18+ (recommended: LTS)
- Access to the HAYY Business API
- Google OAuth client ID (for Google sign-in)

### Install

```bash
npm install
```

### Environment

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=https://your-api-host.example.com
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id
```

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Base URL for the HAYY Business API |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth 2.0 Web client ID |

> Never commit `.env`. Keep secrets out of the repo.

### Run locally

```bash
npm run dev
```

App runs at [http://localhost:8080](http://localhost:8080).

### Build & preview

```bash
npm run build
npm run preview
```

### Lint & test

```bash
npm run lint
npm run test
npm run test:watch
```

---

## Project structure

```
src/
├── components/
│   ├── dashboard/     # Layout, sidebar, location picker
│   ├── landing/       # Marketing page sections
│   ├── places/        # Place profile, modals, reviews, offers, events
│   └── ui/            # shadcn primitives
├── contexts/          # Language, business profile
├── i18n/              # Translation keys
├── pages/             # Route-level screens
├── services/          # API clients (auth, places, posts, …)
├── store/             # Redux slices (auth, business, payment)
└── hooks/             # Shared hooks
```

---

## App routes

### Public

| Path | Page |
|------|------|
| `/` | Landing |
| `/register` | Sign up |
| `/login` | Sign in |
| `/verify-email` | Email verification |
| `/forgot-password` | Request reset |
| `/reset-password` | Set new password |

### Onboarding & billing (protected)

| Path | Page |
|------|------|
| `/profile-setup` | Initial profile |
| `/business/onboarding` | Business details |
| `/onboarding/pending` | Awaiting approval |
| `/subscription-plans` | Plans |
| `/payment` | Checkout |
| `/payment/success` | Payment confirmation |

### Dashboard (protected)

| Path | Page |
|------|------|
| `/dashboard` | Overview |
| `/dashboard/places` | Places list |
| `/dashboard/places/:id` | Place profile |
| `/dashboard/posts` | Posts |
| `/dashboard/offers` | Offers |
| `/dashboard/events` | Events |
| `/dashboard/ratings` | Ratings & reviews |
| `/dashboard/comments` | Comments |
| `/dashboard/profile` | Business profile |

---

## Features

### Places
- Multi-location management with categories and map location
- Dedicated place profile (posts, offers, events, reviews)

### Content & promotions
- Posts with image upload (`multipart/form-data`)
- Offers with promo-style cards and images
- Events tied to places

### Reviews & engagement
- Per-place ratings overview
- Review cards with optional images and lightbox
- Reply, edit, and delete review replies

### Auth & session
- Email/password and Google OAuth
- Automatic token refresh on `401`
- Protected routes for dashboard and billing flows

### UX
- Neumorphic light/dark UI with HAYY orange accent (`#FE5D17`)
- English / Arabic language support
- Responsive dashboard layout

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server (port **8080**) |
| `npm run build` | Production build |
| `npm run build:dev` | Development-mode build |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |
| `npm run test` | Run Vitest once |
| `npm run test:watch` | Vitest watch mode |

---

## API integration

All authenticated requests go through `src/services/axiosInstance.ts`:

1. Attaches `Authorization: Bearer <token>` from `localStorage`
2. On `401`, refreshes via `/api/web/auth/refresh-token`
3. Retries the original request, or redirects to `/login` if refresh fails

Service modules live under `src/services/`:

- `authService` · `businessService` · `placesService`
- `postsService` · `offersService` · `eventsService`
- `reviewsService` · `paymentService` · `categoriesService`

---

## Deployment

The project includes `vercel.json` for Vercel. Set the same `VITE_*` variables in your hosting environment’s build settings, then:

```bash
npm run build
```

Static output is generated in `dist/`.

---

## License

Private — HAYY Business Hub. All rights reserved.
