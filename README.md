# HOME — Furniture, Reimagined.

An immersive furniture-shopping experience: a cinematic 3D entrance, a 3D room
designer (RoomVerse), an AI interior planner (HOME AI), and a Fit Engine that
checks whether a piece will actually work in your space.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start   # production check
```

Needs Node 20+ (built and tested on Node 22).

## What's built (Phase 1 + working slices of Phases 2–5)

| Area | Where | Notes |
|---|---|---|
| Cinematic landing + hotspots | `src/components/Hero.tsx`, `HeroScene.tsx` | Real three.js room, drifting camera, tappable hotspots |
| Discover (mood / space / type / search / sort) | `src/app/discover` | Filters live in the URL, so they're shareable |
| Editorial collections | `src/app/shop` | |
| Product page | `src/app/shop/[slug]`, `BuyBox.tsx` | Colour + material change the image/price live, inline fit check |
| **RoomVerse** | `src/app/roomverse` | R3F + Drei + Zustand. Drag, rotate, recolour, resize room, overlap warnings, autosave, share link |
| **HOME AI** | `src/lib/planner.ts`, `/api/design` | Structured result: picks, budget, palette, arrangement, reasoning, phased plan |
| **Fit Engine** | `src/lib/fit.ts`, `src/app/fit` | Wall space, doorway, floor balance, walkway |
| Compare (up to 4) | `src/app/compare` | |
| Wishlist, smart cart, 5-step checkout | `src/app/cart`, `checkout`, `wishlist` | Cart/wishlist persist in localStorage |

## Honest limitations

- **Data is in a TypeScript file** (`src/lib/catalog.ts`), not a database. Every page reads through its helpers, so swapping in Prisma/Postgres means changing that one file.
- **HOME AI is a deterministic engine**, not an LLM. It never invents products, and it runs with no API key. `parseBrief()` in `planner.ts` is the place to add an LLM with structured output; keep `design()` as the grounded step.
- **Product "photos" are generated SVG/3D**, not photography. Drop real images and `.glb` models in and swap them into `ProductArt.tsx` / `Furniture3D.tsx`.
- **Checkout is a demo.** No payment is taken and no card data is collected. Wire a real provider (for Ethiopia, look at Chapa / Telebirr) server-side.
- No auth, orders database, admin dashboard or AR yet (Phases 2, 6 and the admin section of the brief).

## Next steps, in order

1. **Database** — see `docs/phase-2-schema.prisma`; add Postgres + Prisma, move `catalog.ts` into it.
2. **Auth** — Auth.js, then persist cart/wishlist/room designs per user.
3. **Orders + admin** — orders table, stock decrement, a protected `/admin`.
4. **LLM layer** — structured-output call in `parseBrief`, validated against catalog slugs.
5. **NestJS** — only if you want the separate backend from the brief; Next route handlers are enough until then.
6. **Tests** — `fit.ts` and `planner.ts` are pure functions: unit-test them first (Vitest/Jest), then Playwright for the flows.

## Notes on this Next.js version

Next 16 has Cache Components on: reading `searchParams` must sit inside `<Suspense>` (see `discover/page.tsx`).
The 3D scenes deliberately use local lights, not drei's `<Environment preset>`, because that downloads an HDR
at runtime and a failed download would crash the page.
