# Lighting (Orikami Studio) Admin Backend — Design

**Date:** 2026-06-02
**Repo:** `lighting_Web_V1` (Orikami Studio storefront)
**Goal:** Add a Lovia-style admin backend ("后台管理") to the existing Orikami Studio
storefront, without changing the public-facing site's stack or design.

---

## 1. Context

- **Existing site:** Next.js 16 (App Router) + React 19, Neon Postgres
  (`@neondatabase/serverless`), Stripe checkout. Storefront only — `app/shop`,
  `app/product/[slug]`, `app/checkout/success`, `app/api/checkout`,
  `app/api/webhook`. No admin, no auth.
- **Reference UX:** Lovia / `biroot-shop` admin (Vite + Supabase) — grouped
  left sidebar nav + sticky top bar + content outlet, with modules for
  products / orders / customers / news / coupons / settings.
- **Decision:** Keep Orikami's Next.js + Neon + Stripe stack. Build a **new**
  admin under `app/admin`, modelled on Lovia's admin *UX*, but using Orikami's
  own minimal brand design (warm paper palette, Cormorant / Inter / JetBrains
  Mono). We do **not** reuse Lovia's Vite components (incompatible stack).

### Existing data model (`schema.sql`)
- `products` — rich lighting fields: `slug, name, tagline, category, price_jpy,
  description, paper, diameter, height, bulb, cord, weight, assembly_level,
  assembly_time, image, in_stock, created_at`.
- `orders` — `stripe_session_id, email, status, total_jpy, created_at`.
- `order_items` — `order_id, product_id, quantity, price_jpy`.

> **Currency note (important):** Columns named `*_jpy` actually store **USD
> cents** (e.g. `3999` = `$39.99`); checkout uses `currency: "usd"` with
> `unit_amount: price_jpy`. We keep the column names as-is (avoid a churny
> migration) but the admin **displays and edits values as USD**, converting
> cents↔dollars at the UI boundary.

---

## 2. Scope (agreed)

Admin modules to build:

1. **Dashboard / Overview** — counts + revenue + low-stock signals.
2. **Products** — full CRUD over `products`, incl. lighting-specific fields,
   in-stock toggle, image.
3. **Orders** — list + detail (with `order_items`), status changes, Stripe
   session link.
4. **Customers** — aggregated from `orders.email` (+ optional manual notes).
5. **News / Blog** — article CRUD (new table); optional public `/journal` list.
6. **Coupons** — discount-code CRUD (new table); validated at checkout.
7. **Settings** — store name, currency, base config.
8. **Auth** — simple password login (env password + signed cookie session).

---

## 3. Architecture — Approach A: RSC + Server Actions

Chosen over API-routes-plus-react-query (more boilerplate) and lifting Lovia's
client SPA (fights Next.js).

- **Reads:** admin list/detail pages are **React Server Components** that query
  Neon directly via a per-entity data-access layer.
- **Writes:** mutations are **Server Actions** (`"use server"`) that validate
  input, run the Neon write, and `revalidatePath`.
- **Interactive bits only** (image field, confirm dialogs, toasts, forms with
  pending state) are client components.
- **Auth:** `middleware.ts` guards `/admin/*`, verifying a signed httpOnly
  cookie; unauthenticated → redirect to `/admin/login`.

### Directory layout (new)
```
app/
  admin/
    layout.tsx              # admin shell: sidebar + topbar + content
    page.tsx                # Dashboard / Overview
    login/page.tsx          # password login (public)
    products/
      page.tsx              # list
      new/page.tsx          # create form
      [id]/page.tsx         # edit form
    orders/
      page.tsx              # list
      [id]/page.tsx         # detail (+ order_items)
    customers/page.tsx
    news/
      page.tsx
      new/page.tsx
      [id]/page.tsx
    coupons/page.tsx
    settings/page.tsx
    actions/                # "use server" mutations, grouped per entity
      products.ts
      orders.ts
      news.ts
      coupons.ts
      settings.ts
      auth.ts
  api/
    checkout/route.ts       # MODIFIED: apply coupon discount
    webhook/route.ts        # MODIFIED: persist order_items + customer
components/
  admin/
    sidebar.tsx             # grouped nav (client)
    topbar.tsx
    data-table.tsx          # reusable list table
    stat-card.tsx
    form-field.tsx, dialog.tsx, toast.tsx, ...  # minimal UI primitives
lib/
  admin/
    auth.ts                 # cookie sign/verify, session helpers
    products.ts             # data access (queries) — reused by RSC pages
    orders.ts
    customers.ts
    news.ts
    coupons.ts
    settings.ts
middleware.ts               # guards /admin/*
```

> The `lib/admin/*.ts` files hold **queries (reads)**; `app/admin/actions/*.ts`
> hold **Server Actions (writes)**. Both call the existing `getDb()` from
> `lib/db.ts`. Single clear seam between data access and UI.

---

## 4. Auth (simple password)

- Env (in `.env.local`, gitignored — never committed):
  - `ADMIN_PASSWORD` — the admin login password.
  - `ADMIN_SESSION_SECRET` — HMAC key for signing the session cookie.
- `/admin/login` posts to a Server Action that compares the password
  (constant-time) and, on success, sets an httpOnly, `SameSite=Lax`, signed
  session cookie (`admin_session`) with an expiry (e.g. 7 days).
- `middleware.ts` runs on `/admin/:path*` except `/admin/login`; verifies the
  cookie signature + expiry; redirects to login otherwise.
- A logout action clears the cookie.
- Cookie value = `expiry.HMAC(expiry, secret)`; verified without a DB lookup.

---

## 5. Data model changes (`schema.sql` additions)

Append (do not rewrite existing tables):

```sql
-- News / blog articles
CREATE TABLE IF NOT EXISTS news (
  id          SERIAL PRIMARY KEY,
  slug        TEXT UNIQUE NOT NULL,
  title       TEXT NOT NULL,
  excerpt     TEXT,
  body        TEXT,                 -- markdown or HTML
  cover_image TEXT,
  status      TEXT DEFAULT 'draft', -- draft | published
  published_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Discount codes
CREATE TABLE IF NOT EXISTS coupons (
  id          SERIAL PRIMARY KEY,
  code        TEXT UNIQUE NOT NULL,
  kind        TEXT NOT NULL,        -- 'percent' | 'fixed'
  amount      INTEGER NOT NULL,     -- percent (1-100) or fixed USD cents
  active      BOOLEAN DEFAULT true,
  starts_at   TIMESTAMPTZ,
  ends_at     TIMESTAMPTZ,
  max_uses    INTEGER,
  used_count  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Lightweight store settings (single-row key/value)
CREATE TABLE IF NOT EXISTS settings (
  key   TEXT PRIMARY KEY,
  value TEXT
);
```

- **Customers** need no new table initially: derive a customer list by
  aggregating `orders` on `email` (order count, total spent, last order). A
  `customers` table can be added later if manual notes are needed — out of
  scope for v1 unless trivially cheap.
- **Order items:** the current webhook only inserts the `orders` row, not
  `order_items`. To make Orders detail meaningful, extend the webhook to insert
  `order_items` from the Stripe session line items (and optionally capture the
  customer). This is a small, contained change.

---

## 6. Checkout / webhook changes (contained)

- `app/api/checkout/route.ts`: accept an optional `couponCode`; if valid +
  active + within window + under `max_uses`, apply a Stripe discount (coupon /
  `discounts`) and decrement-on-use via the webhook. If no/invalid code,
  behave exactly as today.
- `app/api/webhook/route.ts`: on `checkout.session.completed`, in addition to
  the existing `orders` insert, also insert `order_items` (from expanded line
  items) and increment `coupons.used_count` if a code was used. Wrapped so a
  failure never 500s the webhook (mirrors current try/catch).

---

## 7. Admin UI shell (Orikami brand, Lovia structure)

- **Layout** (`app/admin/layout.tsx`): left sidebar + sticky top bar + scrollable
  content, same skeleton as Lovia's `AdminLayout`.
- **Sidebar groups** (mirroring Lovia's grouping, scoped to our modules):
  - *Operations:* Overview, Products, Orders, Customers, Coupons
  - *Content:* News
  - *System:* Settings, (Logout)
- **Design tokens:** reuse Orikami's palette from `app/globals.css`
  (`--bg #F5F0EB`, `--ink #3C3A36`, `--stone`, `--sand`, `--line`) and the three
  brand fonts. The admin reads as the *same brand* as the storefront — calm,
  paper-toned, minimal — **not** Lovia's jewellery look.
- **UI primitives:** add a *minimal* set only (button, input, textarea, select,
  table, dialog/confirm, toast, badge) as small Tailwind components under
  `components/admin/`. We do **not** pull in all of Radix/shadcn — just what
  these screens need. (If a robust dialog/select is wanted, selectively add the
  matching shadcn primitive; decide per-component during build.)

---

## 8. Module behaviour summary

| Module | Read (RSC) | Write (Server Action) |
|---|---|---|
| Dashboard | counts (products/orders/customers), revenue sum, low-stock list | — |
| Products | list + single | create / update / delete / toggle in_stock |
| Orders | list + detail w/ items | update status |
| Customers | aggregate from orders | — (v1 read-only) |
| News | list + single | create / update / delete / publish |
| Coupons | list | create / update / toggle active / delete |
| Settings | key/value rows | upsert settings |

---

## 9. Out of scope (v1, YAGNI)

- Multi-user admin accounts / roles (single shared password only).
- i18n / translations admin (Lovia has it; Orikami is single-language for now).
- Media library, menu builder, reviews, returns, newsletter, AI logs.
- A dedicated `customers` table with manual CRM notes.
- Public `/journal` blog pages are *optional*; the News admin + table can land
  first, the public list page can follow.

---

## 10. Risks / notes

- **Currency naming** (`*_jpy` = USD cents) is a latent footgun — documented in
  §1; the admin converts at the UI boundary and we keep names stable.
- **Server Actions + Neon**: ensure data-access runs only server-side (it does —
  `getDb()` reads `process.env.DATABASE_URL`). Never import `lib/admin/*` into a
  client component.
- **Webhook idempotency**: `order_items` insert must be safe under Stripe
  retries (insert keyed off `orders` row; guard duplicates).
- **No secrets in git** (per repo AGENTS.md): `ADMIN_PASSWORD`,
  `ADMIN_SESSION_SECRET`, DB/Stripe keys live only in `.env.local`.
