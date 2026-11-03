# JOURNEY — Rebuilt Storefront

The original source code was lost; only the deployed build remained on the server.
This is a **full, readable rebuild** recovered from that build + the live services,
wired back to the **same working database** — so nothing had to be re-typed.

## Stack

| Original | This rebuild |
|---|---|
| React 19 + Vite | React 19 + Vite 8 (same) |
| Tailwind CSS v4 (oklch tokens) | Tailwind CSS v4, tokens recovered verbatim |
| Convex (cloud, live) | Convex — same deployment, `adorable-rooster-546` |
| Clerk (auth, live) | Clerk — same instance (`clerk.thejrny.com.ng`) |
| TanStack Router | React Router v7 (same URLs: `/`, `/products/$id`,…) |
| sonner toasts, xlsx | same |

## What works out of the box

- **Storefront** — live product feed from your Convex DB (NEW, MENS, WOMENS,
  ACCESSORIES, JERSEY, SHORTS), product pages with size picker + stock, bag
  drawer, currency toggle (₦/£), checkout (contact/delivery/courier/pay-with-
  Paystack/bank-transfer), about, contact, cookie banner, WhatsApp button, 404.
- **Admin panel** (`/admin`) — dashboard, product editor (incl. XLSX export),
  orders with status dropdown (sends status email via your live Convex
  action), customers, shipping methods, currency (NGN↔GBP editor + bulk rate),
  categories, homepage feed ordering, analytics, settings.
- Clerk + admin-role gate (`users:isAdmin`).

## Improvements over the original (asked-for "better")

- Bag now **persists across reloads** (the original lost the bag on every refresh).
- Paystack charges are computed in NGN correctly even when browsing in £.
- Admin dashboard/analytics/customers/shipping read live data with graceful
  errors instead of white screens.
- Currency/grid choice persisted in localStorage.

## Not wired yet (server functions that were in the lost backend source)

- `/admin/inventory` and the old category collections/drops pages — your live
  deployment exposes no matching public function names for these. The pages
  exist as clean stubs; inventory editing of a product's sizes is already
  possible in /admin/products.

## Environment (`.env`, already filled in)

```
VITE_CONVEX_URL=https://adorable-rooster-546.convex.cloud
VITE_CLERK_PUBLISHABLE_KEY=pk_live_Y2xlcmsudGhlanJueS5jb20ubmck
```

Both are public-by-design (this is how running sites connect).

## Run

```bash
cd site
npm install
npm run dev        # http://localhost:5173
npm run build      # outputs dist/ for deployment
```

## Deploy (thejrny.com.ng)

1. `npm run build`
2. Upload the contents of `site/dist/` to your web host's public directory
   (the same place the old `index.html` + `assets/` lived).
3. **Important — this only works when served from thejrny.com.ng** (or a
   subdomain): Clerk production keys are domain-locked. Never deploy to an
   unrelated domain without adding it in the Clerk dashboard.
4. The Paystack PHP proxies (`/api/paystack-init.php`,
   `/api/paystack-verify.php`) still live in your host's API directory — don't
   delete them; the checkout depends on them.
5. Admin sign-in at `/admin` works with the same Clerk account as before, once
   that account has the admin role in Convex (`users.isAdmin`).

## Recovered assets (outside `site/`)

- `images/` — all 22 product images mirrored locally from Cloudinary/Supabase.
- `pages/data_prod.json`, `data_cat.json`, `data_ship.json` — full database dumps.
- `RECOVERY-NOTES.md` — reconstruction notes (routes, copy, flows, statuses).
- `app.js` / `app.css` — the original deployed bundle, kept as reference.
