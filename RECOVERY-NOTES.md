Recovered from https://thejrny.com.ng/ on 2026-11-03.

==== WHAT SURVIVED (nothing is actually lost) ==========================

1. DATABASE — still live in the cloud
   Convex deployment:  https://adorable-rooster-546.convex.cloud
   Public functions used by storefront (all queryable via /api/query):
     products:list, products:get{id}
     categories:list, categories:upsert, categories:remove
     users:isAdmin, users:upsert
     orders:list, orders:create, orders:updateStatus, orders:markPendingTransfer
     shipping:listActive, shipping:list, shipping:upsert, shipping:remove
   HTTP actions:
     https://adorable-rooster-546.convex.site/send-order-email
     https://adorable-rooster-546.convex.site/send-status-email
   Recovered data: pages/data_prod.json (22 products), pages/data_cat.json (6 categories),
   pages/data_ship.json (3 shipping options). orders:list is auth-protected (private, good).

2. AUTH — Clerk (still configured)
   Publishable key (public by design): pk_live_Y2xlcmsudGhlanJueS5jb20ubmck
   Instance domain: clerk.thejrny.com.ng  (= base64 in the key: "clerk.thejrny.com.ng$")

3. PRODUCT IMAGES — all mirrored locally in ./images/
   Sources: Supabase storage (mwngpxysmoylmeplukuk.supabase.co, bucket product-images)
   and Cloudinary (res.cloudinary.com, cloud dlikyxmqf, folder thejrny/<slug>/<name>).

4. DESIGN/CODE — recovered from the deployed bundle
   app.js (614 KB minified React bundle), app.css (Tailwind v4 compiled), favicons.
   Rendered HTML captures of every page are in ./pages/.

==== SITE INVENTORY =====================================================

Design system (from compiled CSS + class names):
  palette: bg "bone" (off-white), ink (near-black), mute (gray), ash, line (hairline borders)
  type: text-mono everywhere (monospace, likely a mono font), tiny sizes 9-14px
  vibe: minimal minimalism, hairline borders, all-caps tiny mono labels
  pages: NEW (/, shows is_new products), category pages /mens /womens /accessories /jersey /shorts,
  product /products/$id, checkout /checkout, about /about, contact /contact, admin /admin/*

Storefront features:
  - currency toggle ₦ NAIRA / £ POUNDS (state, persists)
  - grid toggle "Grid 6 per row" (cycles columns; cols stored in Bb() hook)
  - bag drawer (slide-in right, 400px, cart context Ec() w/ count + items by productId+size)
  - cookie banner (CONTINUE / OPT OUT)
  - WhatsApp floating button -> wa.me/2348137731227
  - footer: © JOURNEY 2026 | ABOUT | CONTACT | SHIPS WORLDWIDE
  - admin link "connexion administrateur →" -> /admin

Homepage grid:
  header: sticky, bg-bone. Top strip: currency buttons + admin link, border-b, 9px mono.
  nav: grid-cols-[40px_1fr_56px], categories from categories:list ("NEW" first, then others,
  slug = name.toLowerCase().replace(/\s+/g,'-')). bag button with count + bag svg icon.
  grid: grid-cols-3 md:grid-cols-6 gap-x-3 gap-y-10 md:4/14, cards = link to /products/$id,
  image aspect-[3/4] object-cover w/ hover-zoom, staggered animate-rise (80ms x index capped 600),
  below: code (11px mono ink), then price (10px mono mute, currency-aware xj() price display).

Product page:
  image aspect-[4/5] max-w-[640px] centered, bg-ash.
  centered: code 12px mono, name 13px ink/60, price 14px mono.
  "+" button (h-8 w-8 plus icon) -> opens bottom sheet "SELECT SIZE"
  bottom sheet: fixed bottom, bg-bone border-t, slides translate-y-full hidden,
    price, size grid-cols-4 sm:grid-cols-7 (labels mono 12, border-b underline on select),
    add button disabled until size picked ("SELECT A SIZE" -> adds to bag).
  back link "← BACK" to "/".
  product_sizes include label/sku/stock; tones = hex color swatches [#0a0a0a ...].

Checkout (empty-bag state captured):
  /checkout centered max-w-[640px] "Your bag is empty." + SHOP NEW link.
  full flow: bag -> checkout page, requires sign in ("Please sign in to checkout"),
  creates order via orders:create, then send-order-email HTTP action;
  shipping chosen from shipping:listActive (GUO Transport, et al; region NG; eta "2–4 days");
  order has status transitions + markPendingTransfer + send-status-email on updateStatus.
  title: "Checkout — JOURNEY".

About: one centered paragraph (text-[14px] leading-[1.8], max-w-xl):
  "Journey is a single-batch wardrobe. Each artifact is produced once, in a finite
   quantity, and not restocked. The website is the brand. The product feed is the
   interface. Silence is the loudest statement."

Contact: form EMAIL (input) + MESSAGE (textarea 5 rows) + SEND button, POSTS somewhere
  (likely Convex contact fn or the convex.site email endpoint).

Cookie banner: fixed bottom, max-w-2xl, "WE USE COOKIES" + body + CONTINUE / OPT OUT.

Admin (existing, from bundle):
  routes: /admin dashboard + /admin/products|inventory|categories|collections|drops|
  orders|customers|shipping|currency|analytics|homepage|settings
  sidebar groups: OVERVIEW (Dashboard), CATALOG (Products, Inventory, Categories, ...),
  Orders, Analytics, Settings. Requires Clerk sign-in with admin role (users:isAdmin).
  Product admin: upsert w/ product_sizes (label, sku, stock) + tones (color_name,
  color_hex) + categories; has "journey-products-template.xlsx" bulk import.
  Currency: settings price_ngn/price_gbp. Currency hook bh() {currency, setCurrency}.

Routing: TanStack Router (createRootRoute "/"+ createRoute with /products/$id pattern, Ve()).

Tech stack of original: Vite + React 19.2 + Tailwind CSS v4 + TanStack Router + TanStack Query
(@tanstack/react-query "Ss/Xr/vk" hooks) + Convex (react) + Clerk + sonner (toasts) +
lucide-style inline svg icons + WhatsApp svg.
Convex client ws: wss://adorable-rooster-546.convex.cloud/api/1.42.1/sync

===== MISC =====
WhatsApp: wa.me/2348137731227, msg "Hi JOURNEY, I'd like to ask about an order."
Currency display: xj(product, selected) => selected?.price_ngn ?? product.price_ngn —
  meaning size overrides? Note: individual sizes may have own price_ngn (product_sizes rows).
Stock summary: Xf(p) = product_sizes.reduce((s,i)=>s+i.stock,0) — stock badge.
