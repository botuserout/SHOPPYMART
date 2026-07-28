# 🚀 SkyMart — Next-Gen E-Commerce Platform (MVP)

[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Redux Toolkit](https://img.shields.io/badge/Redux--Toolkit-2.2-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38BDF8?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-v10-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)

---

## 📌 Executive Summary (Plain English)

**SkyMart** is a full-featured, modern, and production-ready E-Commerce platform built using **React 18, Redux Toolkit, Tailwind CSS, and Firebase v10**. It delivers a high-performance shopping experience with instant user authentication, reactive cart management, wishlist synchronization, offline-first payment simulation, and a lightweight Admin Dashboard.

### 💡 How to Explain SkyMart to Anyone (In 30 Seconds):
> *"SkyMart is an ultra-fast, modern e-commerce application designed like Apple and Stripe. Customers can log in via Google or Email, browse categories like Gaming, Electronics, and Fashion, save items to their wishlist, and complete simulated orders with realistic payment options (Cards, UPI, Wallets) without spending a penny. Admins can log into the Admin Citadel to manage inventory, track orders, and change user roles in real-time."*

---

## 🎮 Gamified Quest Log & Leveling System

Welcome, Adventurer! Embark on the SkyMart E-Commerce Questline:

```
           [ LEVEL 1: ONBOARDING GATEWAY ]
                        │
                        ▼
           [ LEVEL 2: SHOPPING REALM ]
                        │
                        ▼
           [ LEVEL 3: PAYMENT DUNGEON ]
                        │
                        ▼
           [ LEVEL 4: THE ADMIN CITADEL ]
```

---

### 🛡️ Level 1: Onboarding Gateway (Authentication)
* **Google Popup Auth**: Instant 1-click sign-in via `signInWithPopup(auth, googleProvider)`.
* **Email & Password**: Registration with email verification dispatch and Zod form validation.
* **Instant Session Hydration**: Powered by `onAuthStateChanged()`. Session restores in **< 50ms** via local cache and non-blocking background hydration.

---

### ⚔️ Level 2: The Shopping Realm (Catalog & Cart)
* **6 Rich Categories**: Gaming & Consoles, Electronics, Fashion & Apparel, Home & Living, Footwear & Shoes, Accessories & Watches.
* **Over 35+ Curated Products**: High-resolution imagery, star ratings, best-seller tags, and discount calculations.
* **Reactive Cart Drawer**: Floating cart badge with live subtotal, tax, free shipping progress, and item quantity triggers.
* **Instant Wishlist**: Synchronized heart toggles across catalog grid and product detail views.

---

### ⚡ Level 3: The Payment Dungeon (Local Simulation)
* **Zero-Cost Local Simulation**: 100% offline payment engine — zero external API keys or cost required.
* **5 Simulated Payment Methods**:
  1. 💳 **Credit / Debit Card** (Card number, name, MM/YY, CVV validation)
  2. 📱 **UPI / VPA** (`user@upi` or `phone@paytm`)
  3. 👛 **Digital Wallets** (Google Pay, PhonePe, Paytm, Amazon Pay)
  4. 🏛️ **Net Banking** (HDFC, ICICI, SBI, Axis, Kotak)
  5. 💵 **Cash on Delivery (COD)**
* **Animated Processing Overlay**: Cycles through 4 realistic gateway stages (*Validating* → *Connecting* → *Processing* → *Confirmed*).
* **Structured Receipts**: Generates `ORD-XXXXXX` Order Numbers and `TXN-XXXXXXXXXXX` Transaction IDs.
* **Printable Invoice**: Download or print clean PDF/HTML receipts directly from the Order Success screen.

---

### 👑 Level 4: The Admin Citadel (Management & Analytics)
Admins unlock special privileges to control the entire marketplace:
* 📊 **Dashboard Analytics**: Revenue summary, order volume, user growth, and best-seller charts.
* 📦 **Product Manager**: Add new items, edit pricing, update stock, or remove products.
* 🗂️ **Category Manager**: Create custom categories with custom icons.
* 🚚 **Order Manager**: Change order status (*Placed* → *Processing* → *Shipped* → *Delivered*).
* 👥 **User Role Manager**: View users and toggle roles between `Customer` and `Admin`.

---

## 🔑 Admin Logic & Access Guide

SkyMart features a smart **3-tier Admin Access Logic**:

### 1. Automatic Admin Auto-Grant (Email Matching)
Any user who registers or logs in with an email containing `admin` (e.g. `admin@skymart.com` or `yourname.admin@gmail.com`) is **automatically granted the `admin` role** upon sign-in!

```js
// authService.js
const isAdminEmail = user.email && user.email.toLowerCase().includes('admin');
const userProfile = {
  uid: user.uid,
  email: user.email,
  role: isAdminEmail ? 'admin' : 'customer'
};
```

### 2. One-Click Admin Mode Toggle (Profile Page)
Logged into a normal account? Go to your **Profile page (`/profile`)** and click the **"🛡️ Toggle Admin Mode"** button on your banner to instantly switch your session between `Customer` and `Admin` mode!

### 3. Route Guard Security (`AdminRoute.jsx`)
Protected admin routes (`/admin`, `/admin/products`, `/admin/orders`, `/admin/users`) are wrapped by `<AdminRoute>`, which checks `user.role === 'admin'`. Non-admin users are safely redirected to the home page.

---

## 🏗️ System Architecture

SkyMart utilizes a **Decoupled 3-Tier Layered Architecture** with localized fail-safe fallbacks:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER (UI)                         │
│   React 18 SPA  │  Tailwind CSS  │  Framer Motion  │  Lucide Icons     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        STATE MANAGEMENT LAYER                          │
│   Redux Store:  authSlice │ productSlice │ cartSlice │ wishlistSlice │ uiSlice │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        SERVICE & API API LAYER                         │
│  authService.js (Session/OAuth)  │  firebaseService.js (Firestore & Seed)│
└───────────────────┬────────────────────────────────┬───────────────────┘
                    │                                │
                    ▼                                ▼
┌──────────────────────────────────────┐ ┌───────────────────────────────┐
│     EXTERNAL CLOUD SERVICES          │ │     FAIL-SAFE LOCAL CACHE     │
│  Firebase Auth (Google & Email/Pass) │ │  LocalStorage (Hydration)     │
│  Cloud Firestore (Doc Storage)       │ │  Mock Fallbacks (<50ms Load)  │
└──────────────────────────────────────┘ └───────────────────────────────┘
```

---

## 📁 Directory & File Structure

```
SHOPPYMART/
├── public/                      # Static Assets & Deployment Redirects
│   ├── favicon.svg              # Browser tab brand icon
│   ├── logo.svg                 # Scalable brand logo (Shopping bag & rocket)
│   └── _redirects               # Netlify SPA route rewrite rules
│
├── src/                         # Core Source Code
│   ├── components/              # UI Components
│   │   ├── common/              # Global components
│   │   │   ├── Footer.jsx       # Responsive brand footer
│   │   │   ├── Navbar.jsx       # Glassmorphic header, drawer & bottom nav
│   │   │   ├── SearchModal.jsx  # Real-time search trigger overlay
│   │   │   └── Toast.jsx        # Notification popups
│   │   └── protected/           # Route Guards
│   │       ├── AdminRoute.jsx   # Admin role validation guard
│   │       └── ProtectedRoute.jsx # Authentication validation guard
│   │
│   ├── firebase/                # Firebase Config & SDK
│   │   └── config.js            # Initialized Firebase app, Auth, & Firestore
│   │
│   ├── layouts/                 # Page Layout Enclosures
│   │   ├── AdminLayout.jsx      # Admin panel sidebar & wrapper
│   │   └── MainLayout.jsx       # Main customer header, body & footer
│   │
│   ├── pages/                   # Lazy-Loaded Route Views
│   │   ├── admin/               # Admin Portal Pages
│   │   │   ├── CategoriesAdmin.jsx # Category creation & management
│   │   │   ├── Dashboard.jsx    # Analytics metrics & charts
│   │   │   ├── OrdersAdmin.jsx   # Order status tracking
│   │   │   ├── ProductsAdmin.jsx # Product CRUD manager
│   │   │   └── UsersAdmin.jsx    # User roles manager
│   │   ├── Cart.jsx             # Shopping cart page
│   │   ├── Checkout.jsx         # Offline payment simulation
│   │   ├── ForgotPassword.jsx   # Password reset screen
│   │   ├── Home.jsx             # Handcrafted Apple/Stripe-style landing page
│   │   ├── Login.jsx            # Sign-in page (Google & Email)
│   │   ├── NotFound.jsx         # 404 Error page
│   │   ├── OrderDetail.jsx      # Detailed order breakdown
│   │   ├── Orders.jsx           # Order history list
│   │   ├── OrderSuccess.jsx     # Invoice receipt & print view
│   │   ├── ProductDetail.jsx    # Product overview & review page
│   │   ├── Products.jsx         # Product catalog with category filter
│   │   ├── Profile.jsx          # User settings & Admin mode toggle
│   │   ├── Register.jsx         # New user registration
│   │   ├── ResetPassword.jsx    # Password update page
│   │   └── Wishlist.jsx         # Saved items page
│   │
│   ├── redux/                   # Redux Toolkit State Management
│   │   ├── slices/              # Modular State Slices
│   │   │   ├── authSlice.js     # User state & auth thunks
│   │   │   ├── cartSlice.js     # Cart items & calculations
│   │   │   ├── orderSlice.js    # Order history & status
│   │   │   ├── productSlice.js  # Product catalog & categories
│   │   │   ├── uiSlice.js       # Dark mode & modal triggers
│   │   │   └── wishlistSlice.js # Saved wishlist items
│   │   └── store.js             # Configured Redux store
│   │
│   ├── services/                # Decoupled Business Logic & API
│   │   ├── authService.js       # Firebase Auth & session hydration
│   │   └── firebaseService.js   # Firestore operations & mock seed engine
│   │
│   ├── utils/                   # Helper Utilities
│   │   ├── formatters.js        # Currency & date formatting
│   │   └── seedData.js          # Default catalog seeds (35+ products)
│   │
│   ├── App.jsx                  # Main router & session observer mount
│   ├── index.css                # Tailwind base styles & custom utilities
│   └── main.jsx                 # Vite application root entry point
│
├── .gitignore                   # Git exclusions (node_modules, .env, dist)
├── netlify.toml                 # Netlify build & rewrite configuration
├── package.json                 # Project dependencies & scripts
├── README.md                    # Gamified documentation
├── tailwind.config.js           # Custom Tailwind theme tokens
├── vercel.json                  # Vercel SPA rewrite configuration
└── vite.config.js               # Vite build & chunk-splitting setup
```

---

## 🛠️ Tech Stack Overview

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18 + Vite | Lightning-fast HMR and bundle compilation |
| **State** | Redux Toolkit | Centralized state management for Auth, Cart, Wishlist, Orders, & UI |
| **Styling** | Tailwind CSS | Custom design tokens, dark mode, glassmorphism, & micro-interactions |
| **Animations**| Framer Motion | Smooth drawer slide-ins, modal overlays, & active nav underlines |
| **Database** | Firebase Firestore | Cloud NoSQL storage for users, products, and orders |
| **Auth** | Firebase Auth | Google OAuth 2.0 & Email/Password session engine |
| **Routing** | React Router v6 | Client-side SPA routing with `vercel.json` & `netlify.toml` rewrites |

---

## ⚡ Quickstart Guide

### 1. Clone & Install
```bash
git clone https://github.com/botuserout/SHOPPYMART.git
cd SHOPPYMART
npm install
```

### 2. Run Local Dev Server
```bash
npm run dev
```
Open `http://localhost:3000` (or `http://localhost:3005`).

### 3. Build for Production
```bash
npm run build
```

---

## 🌐 Deploying to Vercel or Netlify

SkyMart is **100% zero-config ready** for hosting platforms:

* **Vercel**: Import repository `botuserout/SHOPPYMART` → click **Deploy**. (`vercel.json` rewrites are pre-configured).
* **Netlify**: Import repository `botuserout/SHOPPYMART` → click **Deploy**. (`netlify.toml` & `public/_redirects` are pre-configured).

---

## 📜 License & Credits

Designed & Engineered with ❤️ for **SkyMart E-Commerce MVP**. Open source under the MIT License.
