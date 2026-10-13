# MarketHub E-Commerce Milestone

This adds the full e-commerce backend + frontend for Kisan MarketHub on top
of your existing authentication system — products, categories, cart, orders
with status tracking, Razorpay payments, and an admin panel. **No auth files
were touched.**

## What's new

### Backend (`backend/src`)
- `models/`: `Category`, `Product`, `Cart`, `Order` (with `orderStatus` +
  append-only `statusHistory` for tracking)
- `services/`: `product.service.js`, `category.service.js`, `cart.service.js`
  (recalculates price/stock live — never trusts stored values),
  `order.service.js` (checkout, payment verification, cancellation, admin
  status updates), `payment.service.js` (Razorpay, kept isolated per best
  practice)
- `controllers/` + `routes/`: full REST surface — see table below
- `scripts/seedCategories.js` — populates the 8 default categories
- `scripts/makeAdmin.js` — promotes a registered user to `admin` (the only
  way to create an admin — role can never be set from the frontend)

### Frontend (`client/src`)
- `services/productApi.js`, `cartApi.js`, `orderApi.js`
- `store/cartStore.js` — replaces the old `localStorage` cart
- Rewired `pages/MarketHub/MarketHub.jsx` and `Cart.jsx` to hit the real API
- New: `ProductDetail.jsx`, `Checkout.jsx` (Razorpay integration),
  `OrderDetail.jsx` (status timeline), `pages/dashboard/MyOrders.jsx` (was
  an empty stub, now built out)
- New admin panel: `pages/admin/` (`AdminLayout`, `AdminDashboard`,
  `AdminProducts`, `AdminCategories`, `AdminOrders`)
- `components/AdminRoute.jsx` — guards `/admin/*` by `role === "admin"`,
  not just login
- `Navbar.jsx` updated with a cart badge, orders link, and an admin-only
  shield icon

## How the pieces fit together

**Public vs. protected vs. admin** — enforced on the backend, not just hidden in the UI:
| Area | Access |
|---|---|
| Browse products/categories (`GET /products`, `GET /categories`) | Public |
| Cart, checkout, my orders | `requireAuth` — any logged-in user |
| Create/edit/delete products, categories | `requireRole("admin", "seller")` / `requireRole("admin")` |
| Admin dashboard, order status updates | `requireRole("admin")` |

**Cart pricing is never trusted from the frontend.** Every time the cart is
read, `cart.service.js` re-fetches the live `Product` price and stock. If a
product's price changed since it was added, the cart shows both the old and
new price (`priceChanged` flag) — it never silently overcharges or undercharges.

**Checkout → Payment → Order status, step by step:**
1. `POST /api/orders` validates the cart against live stock/price one more
   time, creates an `Order` with `orderStatus: "pending"`, and — for
   Razorpay — creates a matching Razorpay order.
2. The frontend opens Razorpay's checkout widget (loaded dynamically in
   `Checkout.jsx`, not on every page load).
3. On success, Razorpay calls back with a payment id + signature. The
   frontend sends these to `POST /api/orders/verify-payment`.
4. The backend verifies the signature with `crypto.timingSafeEqual` — this
   is the **only** thing that marks an order paid. A frontend
   `paymentSuccess: true` claim is never trusted on its own.
5. Once verified: stock is decremented, the cart is cleared,
   `orderStatus` moves to `"confirmed"`, and a `statusHistory` entry is
   appended.
6. From there, the **admin** moves the order through
   `processing → shipped → out_for_delivery → delivered` via
   `AdminOrders.jsx`, each change appended to `statusHistory` — this is
   what powers the timeline on the customer's `OrderDetail.jsx` page.
7. Customers can cancel while status is still `pending`/`confirmed`/`processing`;
   cancelling after payment restores the reserved stock.

**Cash on Delivery** skips the Razorpay round-trip entirely — stock is
reserved immediately and the order goes straight to `"confirmed"`.

## Setup

### 1. Backend

```bash
cd backend
npm install                 # pulls in the new `razorpay` package
```

Your existing `.env` was **not overwritten** — I appended these placeholders
to the bottom of it:

```env
RAZORPAY_KEY_ID=rzp_test_REPLACE_ME
RAZORPAY_KEY_SECRET=REPLACE_ME
DEFAULT_SHIPPING_FEE=49
FREE_SHIPPING_THRESHOLD=999
TAX_RATE_PERCENT=0
```

Get test keys from the [Razorpay Dashboard](https://dashboard.razorpay.com/app/keys)
(Test Mode toggle in the top right → Settings → API Keys) and replace those
two values. **If you skip this step, online payments just show as "not
configured" on the checkout page and customers can still check out with Cash
on Delivery** — nothing breaks.

Then seed the default categories and create your first admin:

```bash
npm run seed:categories
npm run dev                          # start the server first
npm run make:admin you@example.com   # in another terminal, after you've registered that email normally
```

`make:admin` only works on an email that has **already registered and
verified** through the normal signup flow — it just flips their `role` to
`admin` in the database. This is deliberate: your spec requires that role
can never be set via the frontend or any API request body.

### 2. Frontend

```bash
cd client
npm install    # no new packages needed — axios/zustand were already added in the auth milestone
npm run dev
```

Nothing new to configure in `client/.env` — it already points at your
backend's `VITE_API_URL`.

### 3. Try it end to end

1. Log in as your admin user → click the shield icon in the navbar → **Admin
   Products** → add a product (paste an image URL — there's no file upload
   service yet, see note below).
2. Log in as a normal customer → **MarketHub** → add it to cart → **Checkout**.
3. If Razorpay test keys are set: pay with Razorpay's test card
   `4111 1111 1111 1111`, any future expiry, any CVV. If not: choose Cash on
   Delivery.
4. Check **My Orders** → open the order → see the status timeline.
5. Back in **Admin → Orders**, change the status to `shipped` → refresh the
   customer's order page → the timeline updates.

## Known limitations (intentionally out of scope for this pass)

- **No image upload** — product images are pasted URLs, not file uploads.
  Adding Cloudinary/multer (like your reference `server.zip` had) is a
  natural next milestone.
- **No product reviews yet** — `rating`/`reviewCount` fields exist on
  `Product` for when that's built.
- **No saved addresses** — checkout uses a one-off address form each time,
  since the User Profile + Addresses milestone (from your original spec)
  hasn't been built yet. Once it is, `Checkout.jsx` can pull from a saved
  address list instead.
- **Seller role exists but isn't differentiated in the UI** — `requireRole("admin", "seller")`
  is already on the product-management routes, so a multi-seller frontend
  can be layered on later without backend changes.
