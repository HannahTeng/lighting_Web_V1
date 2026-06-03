@AGENTS.md

# Orikami Studio — Claude Instructions

## Workflow: Superpowers

Every coding task follows this sequence in order. Do not skip steps.

### 1. Plan
Think through the full scope before touching any file. Identify which files change, what the edge cases are, and what could break. State the plan explicitly before implementing.

### 2. Implement
Make the changes. Prefer editing existing files over creating new ones. Keep diffs minimal — no cleanup, no refactor, no extra features beyond what the task requires.

### 3. Simplify
After implementing, review the changed code with the `/simplify` skill. Remove redundant logic, unnecessary abstractions, dead branches, and any code that was added "just in case."

### 4. Verify
Run these checks in order before calling anything done:

```bash
# Type check
node node_modules/typescript/bin/tsc --noEmit

# Build
npm run build
```

Fix every error before proceeding. Do not suppress or work around type errors.

### 5. Deploy
Follow the deploy gate below — preview first, production only after explicit confirmation.

---

## Deploy Gate

```bash
# 1. Preview deploy
vercel

# 2. Share the preview URL and wait for confirmation

# 3. Production — only after the user says "looks good" or similar
vercel --prod
```

Never deploy to production without explicit user confirmation in the same conversation turn.

---

## UI: Taste Skill Principles

Apply these to every UI change, no exceptions.

**Layout**
- Use a clear grid baseline. Align to it. Don't invent spacing values per-component.
- Padding increments: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 80 / 96px. Nothing in between.
- Leave room to breathe. Dense UIs feel cheap here.

**Hierarchy**
- One dominant element per section. Everything else supports it.
- Three levels maximum: primary, secondary, muted. No fourth tier.
- Size and weight carry hierarchy — color alone does not.

**Typography**
- Cormorant: headlines, display, editorial moments.
- JetBrains Mono: labels, metadata, counters, tags.
- Inter: body copy, UI prose.
- Never mix more than two typefaces in one component.

**Banned patterns**
- Generic SaaS cards: drop-shadow + border-radius + icon + heading + body + CTA in a grid of 3. Never.
- Random gradients: no decorative `from-purple-500 to-pink-500` style. Gradients must be functional (depth, light direction, material).
- Inline color overrides that fight the design token system (`--ink`, `--ink-soft`, `--stone`, `--sand`, `--bg`, `--bg-alt`, `--surface`, `--line`).
- Emoji in UI copy.
- Centered body text beyond 3 lines.

**Motion**
- Scroll-driven: sync to `requestAnimationFrame`, coalesce via a single pending-flag, never lerp `currentTime`.
- Entrance: `opacity 0→1` + `translateY 14px→0`, 1.1s cubic `0.2,0.7,0.2,1`, stagger with `data-d` attributes via the `Reveal` component.
- No bounce, no spring, no overshooting. This is paper and light — nothing bounces.

---

## Project Conventions

- **Framework**: Next.js App Router. Read `node_modules/next/dist/docs/` before using any Next.js API — this version may differ from training data.
- **Styles**: Tailwind v4 (`@import "tailwindcss"`). Responsive via `sm:` prefix (≥ 640px). Mobile-first.
- **Fonts**: loaded via `next/font/google` in `app/layout.tsx` as CSS variables — `--font-cormorant`, `--font-jetbrains`, `--font-inter`.
- **Design tokens**: defined in `app/globals.css` under `:root`. Always use them; never hardcode hex values that duplicate a token.
- **Reveal**: use the `<Reveal>` component for scroll-entrance animations. Accepts `delay={1|2|3|4}` for staggering.
- **Cart**: global state via `CartProvider` + `useCart()` hook in `lib/cart`.
- **Products**: sourced from `lib/products.ts` via `PRODUCTS` array and `formatPrice()`.

## Mobile Rules

- SVG/canvas sizing: use `vmin` units, never bare `vh` — `vh` overflows on portrait phones.
- Padding: `px-5` default, `sm:px-14` on larger viewports.
- Multi-column grids: always provide a `grid-cols-1` fallback, then `sm:grid-cols-N`.
- Hide decorative/secondary elements with `hidden sm:block`, not by removing them.
- Minimum touch target: 44×44px for any interactive element.
