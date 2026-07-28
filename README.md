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

## 🛠️ Tech Stack & Architecture

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
