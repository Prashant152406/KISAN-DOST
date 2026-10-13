# Kisan Dost 🌾

An AI-powered web platform for farmers. It brings **crop recommendation**, **plant disease detection** and an **online farm marketplace** into one application.

A farmer can check which crop suits their land, photograph a sick leaf and get a diagnosis with remedies, and then buy seeds, fertilizers and tools from the built-in shop, all from one login.

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [System Architecture](#system-architecture)
4. [Project Structure](#project-structure)
5. [Prerequisites](#prerequisites)
6. [Setup and Installation](#setup-and-installation)
7. [Environment Variables](#environment-variables)
8. [Pages and Routes](#pages-and-routes)
9. [API Reference](#api-reference)
10. [Machine Learning Models](#machine-learning-models)
11. [Authentication and Security](#authentication-and-security)
12. [MarketHub (E-commerce)](#markethub-e-commerce)
13. [Admin Panel](#admin-panel)
14. [Troubleshooting](#troubleshooting)
15. [Known Limitations](#known-limitations)
16. [Roadmap](#roadmap)
17. [Credits](#credits)

---

## Features

### 🌱 Crop Recommendation
- Predicts the best crops from 7 inputs: **N, P, K, temperature, humidity, pH, rainfall**
- Covers **22 crops**, shows the top 5 with a match percentage
- **"Use my location"** button: the browser asks permission, then temperature, humidity and rainfall are filled in automatically
- **Soil report upload:** upload a photo or PDF of a soil health card and the N, P, K and pH values are read for you
- Every auto-filled value stays editable
- **Growing guide** for each recommended crop: season, sowing time, steps, irrigation, fertilizers, pests and control, harvest time, tips

### 🍃 Plant Disease Detection
- Upload a leaf photo **or capture one live with the camera**
- Identifies **38 conditions across 14 crops** (healthy leaves included)
- Shows the top 3 predictions with confidence
- Instant remedy note for every class: symptoms, cause, recommended solution, precautions
- Optional **detailed AI treatment plan**: organic options, chemical options, application tips, prevention schedule, and when to see an agriculture officer
- No pesticide dosages are given anywhere. Users are told to follow the product label or ask an extension officer.

### 🛒 MarketHub (Farmer Marketplace)
- Product catalogue with search, category filters, price and rating filters, sorting and pagination
- Cart that always uses live prices and stock
- Checkout with **Razorpay** (UPI, cards, netbanking) or **Cash on Delivery**
- Order history with a visual **status timeline** and order cancellation
- Admin panel for products, categories and orders

### 🔐 Accounts
- Register with email and password, verified by a **6-digit OTP**
- **Google Sign-In**, with automatic account linking
- Forgot and reset password, change password
- Multi-device sessions: see your devices and log out of one or all

### 🌾 Crop Seasons
- Information pages for 14 crops (rice, wheat, bajra, jowar, maize, soybean, millet, oat, gram, rapeseed, cucumber, pumpkin, bitter gourd, barley)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, React Router 7, Zustand, Tailwind CSS 4, Axios, lucide-react |
| Main backend | Node.js, Express 4, MongoDB, Mongoose 8, Zod, Nodemailer |
| ML service | Python, FastAPI, scikit-learn, TensorFlow/Keras, pandas, Pillow |
| AI (generative) | Google Gemini API (`google-genai` SDK) |
| Weather | Open-Meteo API (free, no key) |
| Payments | Razorpay |
| Auth | Server-side sessions with HTTP-only cookies, Google Identity Services |

---

## System Architecture

The project runs as **three separate services**:

```
┌──────────────────────┐
│  React client        │  http://localhost:5173
│  (Vite)              │
└─────────┬────────────┘
          │ talks to both backends independently
   ┌──────┴────────────────────────────┐
   ▼                                   ▼
┌─────────────────────┐      ┌──────────────────────────┐
│ Node/Express API    │      │ FastAPI ML service       │
│ :5000               │      │ :8001                    │
│ auth, products,     │      │ crop model, disease      │
│ cart, orders, pay   │      │ model, Gemini, weather   │
└─────────┬───────────┘      └────────────┬─────────────┘
          ▼                               ▼
      MongoDB                  Razorpay / Open-Meteo / Gemini
```

**Why the ML code is a separate service:** Node.js cannot run scikit-learn or TensorFlow models. Keeping ML in its own FastAPI service also means it can be restarted or scaled without touching the shop. The two backends never call each other.

---

## Project Structure

```
Project/
├── client/                      React frontend
│   └── src/
│       ├── App.jsx              All routes and route guards
│       ├── components/          ProtectedRoute, GuestRoute, AdminRoute,
│       │                        GoogleButton, FarmToolsTabs, crop pages
│       ├── pages/
│       │   ├── auth/            Login, Register, VerifyOtp, ForgotPassword,
│       │   │                    ResetPassword, Profile
│       │   ├── MarketHub/       MarketHub, ProductDetail, Cart, Checkout,
│       │   │                    OrderDetail
│       │   ├── dashboard/       MyOrders
│       │   ├── admin/           AdminLayout, AdminDashboard, AdminProducts,
│       │   │                    AdminCategories, AdminOrders
│       │   ├── Recommendation.jsx
│       │   ├── DiseaseDetection.jsx
│       │   └── CropSeasons.jsx
│       ├── services/            api.js, authApi.js, productApi.js, cartApi.js,
│       │                        orderApi.js, cropRecommendationApi.js
│       └── store/               authStore.js, cartStore.js
│
├── backend/                     Node.js / Express API
│   ├── server.js                Entry point
│   ├── scripts/                 seedCategories.js, makeAdmin.js
│   └── src/
│       ├── app.js               Express app and middleware
│       ├── config/              env.js, db.js
│       ├── models/              User, Session, EmailVerification,
│       │                        PasswordResetToken, Category, Product,
│       │                        Cart, Order
│       ├── services/            Business logic (auth, otp, session, email,
│       │                        google, product, category, cart, order, payment)
│       ├── controllers/         HTTP handlers
│       ├── routes/              URL definitions and guards
│       ├── middleware/          auth, validation, errors, rate limits
│       ├── validators/          Zod schemas
│       └── utils/               helpers (slugify, crypto, errors)
│
└── crop-ml-service/             Python / FastAPI ML service
    ├── requirements.txt
    ├── .env.example
    └── app/
        ├── main.py              FastAPI app and startup model loading
        ├── config.py            Settings from .env
        ├── schemas.py           Request/response models
        ├── ml/                  Models and data files
        │   ├── crop_recommendation_model.joblib
        │   ├── label_encoder.joblib
        │   ├── crop_model_meta.json
        │   ├── crop_metadata.py          Crop display names
        │   ├── plant_disease_model.keras
        │   ├── disease_classes.py        38 class names in model order
        │   ├── disease_info.json         Remedy notes for each class
        │   └── disease_info_store.py
        ├── services/            ml_service, disease_service,
        │                        weather_service, gemini_service
        └── routers/             predict, weather, soil_report,
                                 crop_info, disease
```

---

## Prerequisites

Install these first on your computer:

| Tool | Version | Used for | Check with |
|---|---|---|---|
| **Git** | any recent | Getting the code | `git --version` |
| **Git LFS** | any recent | Downloading the ML model files | `git lfs version` |
| **Node.js** (with npm) | 18 or newer | Frontend and main backend | `node --version` |
| **MongoDB** | local install **or** a free MongoDB Atlas cluster | Database | `mongod --version` (local only) |
| **Python** | **3.10, 3.11 or 3.12** (3.12 recommended) | ML service | `python --version` |

> **Important:** do not use Python 3.14 for the ML service. TensorFlow (used for disease detection) has no release for it. If 3.14 is your default, install Python 3.12 next to it and create the virtual environment with `py -3.12 -m venv venv`.

You also need these accounts or keys:

- A **Gmail account with an App Password**, to send OTP and password-reset emails (Google Account, Security, 2-Step Verification, App passwords).
- A free **Gemini API key** from https://aistudio.google.com/apikey (soil report reading, growing guides, treatment plans). Crop and disease prediction still work without it.
- *Optional:* a **Google OAuth Client ID** (Google Sign-In) from https://console.cloud.google.com. Add `http://localhost:5173` under "Authorized JavaScript origins".
- *Optional:* **Razorpay test keys** from https://dashboard.razorpay.com (Test Mode). Without them, checkout works with Cash on Delivery only.

---

## Setup and Installation

Follow these steps in order. Commands are for Windows PowerShell. On macOS or Linux, use the alternatives shown in comments.

### Step 1. Get the code

```powershell
git lfs install
git clone https://github.com/Prashant152406/KISAN-DOST.git
cd KISAN-DOST
```

Run `git lfs install` **before** cloning. The two model files are stored with Git LFS, and without it they download as tiny text pointers and the ML service will fail to load them.

Check that the models downloaded properly:

```powershell
dir crop-ml-service\app\ml
```

`crop_recommendation_model.joblib` should be about 110 MB and `plant_disease_model.keras` about 45 MB. If they are only a few KB, run `git lfs pull`.

### Step 2. Start MongoDB

- **Local install:** make sure the MongoDB service is running. The default connection string is `mongodb://127.0.0.1:27017/kisan-dost`.
- **Atlas:** create a free cluster, add a database user, allow your IP address under Network Access, and copy the connection string.

### Step 3. Set up the main backend (Node.js)

```powershell
cd backend
npm install
copy .env.example .env        # macOS / Linux: cp .env.example .env
```

Open `backend\.env` and fill in the values (see [Environment Variables](#environment-variables)). At minimum set `MONGO_URI`, `SESSION_SECRET`, the `EMAIL_*` values, and `FRONTEND_URL=http://localhost:5173`.

Generate a strong session secret with:

```powershell
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Step 4. Set up the ML service (Python)

```powershell
cd ..\crop-ml-service
py -3.12 -m venv venv         # macOS / Linux: python3.12 -m venv venv
venv\Scripts\activate         # macOS / Linux: source venv/bin/activate
python -m pip install --upgrade pip setuptools wheel
pip install -r requirements.txt
copy .env.example .env        # macOS / Linux: cp .env.example .env
```

Run the lines **one at a time**. Pasting them together on one line makes `venv` treat the rest as its own arguments. `pip install` takes a few minutes because TensorFlow is large.

Open `crop-ml-service\.env` and set `GOOGLE_API_KEY` to your Gemini key.

### Step 5. Set up the frontend (React)

```powershell
cd ..\client
npm install
copy .env.example .env        # macOS / Linux: cp .env.example .env
```

Open `client\.env` and check that it contains:

```env
VITE_API_URL=http://localhost:5000/api
VITE_CROP_API_URL=http://localhost:8001/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

`VITE_GOOGLE_CLIENT_ID` is only needed for the Google button. Vite reads `.env` only at startup, so restart `npm run dev` after any change.

### Step 6. Start all three services

Open **three terminals** from the project root:

```powershell
# Terminal 1: main backend
cd backend
npm run dev                   # http://localhost:5000

# Terminal 2: ML service (virtual environment active)
cd crop-ml-service
venv\Scripts\activate
uvicorn app.main:app --reload --port 8001

# Terminal 3: frontend
cd client
npm run dev                   # http://localhost:5173
```

Wait for "MongoDB connected" in Terminal 1, then check the ML service at http://localhost:8001/health. It should show:

```json
{ "status": "ok", "crop_model_loaded": true, "disease_model_loaded": true, "gemini_configured": true }
```

Open http://localhost:5173 in your browser.

### Step 7. Add starter data and an admin account

1. In a new terminal, from the `backend` folder, create the default product categories:
   ```powershell
   npm run seed:categories
   ```
2. In the browser, register a normal account and verify the OTP that arrives by email.
3. Make that account an admin (the only way to create an admin):
   ```powershell
   npm run make:admin your@email.com
   ```
4. Log in again. A shield icon appears in the navbar for the admin panel. Add a few products there (use any image URL, since file upload is not built yet). **Descriptions must be at least 10 characters.**

### Step 8. Quick test

| Feature | How to test |
|---|---|
| Crop recommendation | Go to `/recommendations`, enter N=90, P=42, K=43, temperature=20.9, humidity=82, pH=6.5, rainfall=203. **Rice** should be the top match. |
| Weather auto-fill | Click "Use My Current Location" and allow the permission prompt. |
| Disease detection | Go to `/disease-detection` and upload a clear photo of a single leaf, or use the camera. |
| Marketplace | As a customer, add a product to the cart and check out with Cash on Delivery (or Razorpay test card `4111 1111 1111 1111`). |
| Order tracking | As admin, change the order status, then reopen the order as the customer to see the timeline update. |

---

## Environment Variables

### `backend/.env`

| Variable | Purpose |
|---|---|
| `PORT` | API port (default 5000) |
| `NODE_ENV` | `development` or `production` |
| `MONGO_URI` | MongoDB connection string |
| `SESSION_SECRET` | Long random string |
| `COOKIE_NAME` | Session cookie name |
| `SESSION_TTL_DAYS` | Session lifetime (default 30) |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google Sign-In (ID must match the frontend) |
| `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASSWORD`, `EMAIL_FROM` | SMTP for OTP and reset emails |
| `FRONTEND_URL` | Frontend origin, used for CORS and email links |
| `OTP_EXPIRY_MINUTES`, `OTP_MAX_ATTEMPTS`, `OTP_RESEND_COOLDOWN_SECONDS`, `OTP_MAX_RESENDS_PER_WINDOW` | OTP rules |
| `PENDING_ACCOUNT_TTL_HOURS` | Unverified accounts are auto-deleted after this time |
| `RESET_TOKEN_EXPIRY_MINUTES` | Password reset link lifetime |
| `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` | Razorpay keys |
| `DEFAULT_SHIPPING_FEE`, `FREE_SHIPPING_THRESHOLD`, `TAX_RATE_PERCENT` | Order pricing (defaults 49, 999, 0) |

### `client/.env`

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Node backend URL |
| `VITE_GOOGLE_CLIENT_ID` | Same Client ID as the backend |
| `VITE_CROP_API_URL` | FastAPI ML service URL |

> Anything starting with `VITE_` is visible in the browser. Never put secrets there.

### `crop-ml-service/.env`

| Variable | Purpose |
|---|---|
| `GOOGLE_API_KEY` | Gemini key (soil reports, growing guides, treatment plans) |
| `GEMINI_MODEL` | Model name (default `gemini-2.5-flash`) |
| `FRONTEND_ORIGIN` | Must exactly match the Vite URL, or CORS blocks requests |
| `PORT` | Service port (default 8001) |

---

## Pages and Routes

| Route | Access | Page |
|---|---|---|
| `/` | Public | Home |
| `/crop-seasons` | Public | Crop seasons and the 14 crop detail pages |
| `/recommendations` | Public | Crop recommendation |
| `/disease-detection` | Public | Plant disease detection |
| `/markethub` | Public | Product listing |
| `/markethub/product/:slug` | Public | Product detail |
| `/markethub/cart` | Logged in | Cart |
| `/markethub/checkout` | Logged in | Checkout and payment |
| `/markethub/orders` | Logged in | My orders |
| `/markethub/orders/:id` | Logged in | Order detail with status timeline |
| `/profile` | Logged in | Profile, sessions, change password |
| `/login`, `/register`, `/verify-otp`, `/forgot-password`, `/reset-password/:token` | Guests only | Account pages |
| `/admin`, `/admin/products`, `/admin/categories`, `/admin/orders` | Admin only | Admin panel |

Route guards: `ProtectedRoute` (needs a session), `GuestRoute` (logged-in users are sent away), `AdminRoute` (needs the admin role).

---

## API Reference

### Node backend, base URL `http://localhost:5000/api`

**Auth**

| Method | Endpoint | Access |
|---|---|---|
| POST | `/auth/register` | Public |
| POST | `/auth/verify-email` | Public |
| POST | `/auth/resend-otp` | Public |
| POST | `/auth/login` | Public |
| POST | `/auth/google` | Public |
| POST | `/auth/logout`, `/auth/logout-all` | Logged in |
| GET | `/auth/me`, `/auth/sessions` | Logged in |
| DELETE | `/auth/sessions/:id` | Logged in |
| POST | `/auth/forgot-password`, `/auth/reset-password` | Public |
| PATCH | `/auth/change-password` | Logged in |

**Products and categories**

| Method | Endpoint | Access |
|---|---|---|
| GET | `/products`, `/products/:slug` | Public |
| GET | `/products/admin/all` | Admin / seller |
| POST, PATCH, DELETE | `/products`, `/products/:id` | Admin / seller |
| GET | `/categories` | Public |
| POST, PATCH, DELETE | `/categories`, `/categories/:id` | Admin |

**Cart and orders**

| Method | Endpoint | Access |
|---|---|---|
| GET, POST, PATCH, DELETE | `/cart`, `/cart/items`, `/cart/items/:productId` | Logged in |
| GET | `/orders/payment-status` | Public |
| POST | `/orders`, `/orders/verify-payment` | Logged in |
| GET | `/orders`, `/orders/:id` | Logged in |
| POST | `/orders/:id/cancel` | Logged in |
| GET | `/orders/admin/all` | Admin |
| PATCH | `/orders/admin/:id/status` | Admin |
| GET | `/admin/dashboard` | Admin |

Responses use one shape:

```json
{ "success": true, "message": "...", "data": {} }
{ "success": false, "message": "...", "code": "VALIDATION_ERROR", "errors": [{ "field": "...", "message": "..." }] }
```

### ML service, base URL `http://localhost:8001/api`

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/predict` | Soil and climate values to top crops |
| GET | `/weather?lat=&lon=` | Temperature, humidity, rainfall estimate |
| POST | `/soil-report/extract` | Soil report image or PDF to N, P, K, pH |
| POST | `/crop-info` | Growing guide for a crop |
| POST | `/disease/predict` | Leaf image to top 3 diseases and remedy info |
| POST | `/disease/treatment-plan` | Detailed AI treatment plan |
| GET | `/health` (no `/api` prefix) | Service and model status |

Example, `POST /api/predict`:

```json
{ "N": 90, "P": 42, "K": 43, "temperature": 20.9, "humidity": 82, "ph": 6.5, "rainfall": 203, "top_n": 5 }
```

---

## Machine Learning Models

### Crop recommendation

| | |
|---|---|
| Model | ExtraTreesClassifier, 700 trees |
| Data | 2,200 records, 22 crops, 100 per crop |
| Inputs | N, P, K, temperature, humidity, pH, rainfall (raw values, **no scaling**) |
| Split | 70% train, 15% validation, 15% test |
| Accuracy | 99.70% validation, **99.09% test** (327 of 330) |
| Files | `crop_recommendation_model.joblib`, `label_encoder.joblib` |

**Crops:** rice, maize, chickpea, kidney beans, pigeon peas, moth beans, mung bean, black gram, lentil, pomegranate, banana, mango, grapes, watermelon, muskmelon, apple, orange, papaya, coconut, cotton, jute, coffee.

Most important features: humidity, rainfall, potassium. Least important: pH.

> **Do not apply a scaler to this model.** It was trained on raw values. A `scaler.pkl` that ships in some export folders belongs to an earlier experiment and gives wrong results here.

### Disease detection

| | |
|---|---|
| Model | EfficientNetB0 (ImageNet weights) plus a custom dense head |
| Input | 224 × 224 RGB. The model has its own rescaling layer, so feed raw 0–255 pixels |
| Data | Augmented PlantVillage-style dataset: 70,295 training and 17,572 validation images |
| Classes | 38 classes, 14 crops |
| Training | Stage 1: frozen backbone, 10 epochs. Stage 2: fine-tuning at a low learning rate |
| Accuracy | 95.57% after stage 1, **98.66% validation** after fine-tuning (macro F1 0.986) |
| File | `plant_disease_model.keras` |

**Crops covered:** apple, blueberry, cherry, corn (maize), grape, orange, peach, bell pepper, potato, raspberry, soybean, squash, strawberry, tomato.

The class order in `disease_classes.py` must match the order the model was trained with. Do not reorder it.

### Generative AI (Gemini)

Used for three things: reading soil reports, writing crop growing guides, and writing disease treatment plans. All outputs use a fixed JSON schema, so the frontend always receives typed fields. Growing guides and treatment plans are cached in memory.

---

## Authentication and Security

- **Sessions, not JWTs in localStorage.** An opaque token goes in an HTTP-only cookie. Only its SHA-256 hash is stored in the database. Any device can be revoked.
- **Passwords:** bcrypt, 12 rounds.
- **OTP:** 6 digits, stored hashed, expires in 10 minutes, 5 attempts, 60-second resend cooldown, max 5 resends per hour.
- **Unverified accounts** are deleted automatically after 24 hours (MongoDB TTL index).
- **Password reset** returns the same response whether or not the email exists, so accounts cannot be enumerated. A reset logs out all devices.
- **Google Sign-In** is verified on the server. If the email already exists, Google is linked to that account instead of creating a duplicate.
- **Roles** (`customer`, `seller`, `admin`) are read from the database. They cannot be set from any HTTP request.
- **Express hardening:** helmet, CORS limited to the frontend origin, JSON body size cap, NoSQL-injection sanitising, and rate limits (auth 20 per 15 min, OTP 10 per 10 min, password reset 5 per 15 min).
- **Server is the authority** on user identity, role, price, totals, stock and payment status. None of these is taken from the browser.

---

## MarketHub (E-commerce)

- **Cart** stores only product IDs and quantities. On every read the server recalculates live price and stock, drops unavailable products, caps quantity at stock, and flags price changes.
- **Orders** store snapshots of item names, prices and the shipping address, so later catalogue edits never change an old order.
- **Payment:** Razorpay online payments are confirmed only when the server verifies the Razorpay HMAC signature. Closing the payment window leaves the order `pending` so the customer can retry. Cash on Delivery is confirmed immediately.
- **Order statuses:** `pending → confirmed → processing → shipped → out_for_delivery → delivered`, plus `cancelled`, `returned`, `refunded`. Every change is appended to a status history that powers the timeline.
- **Cancelling** is allowed until the order ships. A paid order gets its stock restored.
- **Shipping:** ₹49 flat, free above ₹999. Tax rate is configurable (default 0).
- **Products** are soft-deleted (`isActive: false`), so old orders still resolve.

---

## Admin Panel

Reached at `/admin` after `npm run make:admin`.

| Page | What it does |
|---|---|
| Dashboard | Product count, order counts, pending orders, users, revenue |
| Products | Add, edit, deactivate products (image URL, price, stock, crop types, dosage, etc.) |
| Categories | Add and delete categories (a category with children cannot be deleted) |
| Orders | View all orders, filter by status, update status and tracking number |

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `pip install` fails and tries to compile scikit-learn, pydantic-core or TensorFlow | You are on Python 3.14. Create the venv with Python 3.12 (`py -3.12 -m venv venv`) |
| Model files are only a few KB, or the ML service fails to load them | Git LFS was not installed when you cloned. Run `git lfs install` then `git lfs pull` |
| `disease_model_loaded: false` at `/health` | TensorFlow is missing or the Python version is wrong. The startup log prints the reason |
| `AttributeError: 'Settings' object has no attribute 'CROP_MODEL_PATH'` | `app/config.py` is the old version. Replace it with the current one |
| "Continue with Google" button is missing | `client/.env` has no `VITE_GOOGLE_CLIENT_ID`. Add it and restart Vite |
| Google login fails with `GOOGLE_TOKEN_INVALID` | Client IDs in `backend/.env` and `client/.env` do not match |
| Admin "Add product" shows only "Validation failed" (HTTP 422) | Open the browser Network tab, then the response. Common cause: description shorter than 10 characters |
| Browser shows CORS errors | `FRONTEND_URL` / `FRONTEND_ORIGIN` must exactly match the Vite URL, including the port |
| Cookies not set in production | Use HTTPS on both sides and set `NODE_ENV=production` |
| Camera button does not work | Camera access needs `localhost` or HTTPS, plus browser permission |
| Server seems stuck on first start (Windows) | Check for a hidden Windows Firewall prompt behind the terminal |
| `401` on `/api/auth/me` in the console | Normal when not logged in. The app checks for a session on load |

---

## Known Limitations

- The crop model was trained on a small public dataset (2,200 rows). It has not been tested on real farm data.
- **Rainfall** is estimated from the last 30 days of weather, but the model was trained on seasonal rainfall. The field is editable for this reason.
- The disease model was trained on clean, lab-style leaf photos. Field photos are harder. It knows only 14 crops (no rice, wheat or cotton) and has no "unknown" class, so a leaf from another crop still gets one of the 38 labels.
- Gemini outputs (soil report reading, growing guides, treatment plans) have not been reviewed by agriculture experts.
- Product images are pasted URLs. There is no file upload yet.
- No product reviews, wishlist, coupons or saved addresses yet.
- English only.

---

## Roadmap

- [ ] Field-photo test set and a pilot with real farmers
- [ ] Disease coverage for rice, wheat, cotton and other major Indian crops, plus an "unknown" outcome
- [ ] Seasonal rainfall data per district
- [ ] Regional languages and voice input
- [ ] Mandi price forecasting and a multilingual chatbot
- [ ] Lighter on-device model for low-end phones
- [ ] Image upload (Cloudinary or S3), product reviews, saved addresses, wishlist, coupons
- [ ] Seller dashboard in the frontend

---

## Credits

- **Team:** *GREEN INTELECT*
- **College:** *KIET GROUP OF INSTITUTION GHAZIBAD*
- **Datasets:** Kaggle Crop Recommendation dataset; PlantVillage-based "New Plant Diseases Dataset (Augmented)"
- **Services:** Google Gemini API, Open-Meteo, Razorpay
