# 🚀 SkyMart - Modern E-Commerce Platform (MVP)

## Project Vision

SkyMart is a modern, responsive e-commerce platform built using React, Redux Toolkit, Tailwind CSS, and Firebase. The goal is to create a complete shopping experience with secure authentication, product browsing, cart management, wishlist functionality, checkout, payment integration, and a lightweight admin dashboard.

This project is designed as an MVP (Minimum Viable Product) that demonstrates production-ready architecture while remaining simple enough to complete within a short development timeline.

---

# Objectives

- Build a clean and responsive shopping experience.
- Implement secure authentication using Firebase.
- Store all application data in Firestore.
- Manage application state using Redux Toolkit.
- Integrate a test payment gateway.
- Provide a small admin dashboard for product management.
- Deploy on Vercel.

---

# Target Users

## Customer

Customers should be able to

- Register
- Login
- Login with Google
- Verify Email
- Reset Password
- Browse Products
- Search Products
- Filter Products
- View Product Details
- Add to Cart
- Manage Wishlist
- Checkout
- Complete Test Payment
- View Order History
- Edit Profile

---

## Administrator

Administrators should be able to

- Login
- Add Products
- Edit Products
- Delete Products
- Manage Categories
- View Orders
- Manage Users

---

# Tech Stack

## Frontend

- React
- Vite
- Redux Toolkit
- React Router DOM
- Tailwind CSS
- React Hook Form
- Zod
- Framer Motion

## Backend

Backend-less Architecture

Using Firebase

- Firebase Authentication
- Firestore Database
- Firebase Storage (optional)

## Payment

- Razorpay Test Mode

## Deployment

- Vercel

---

# Authentication

Authentication should support

## Local Authentication

- Register
- Login
- Logout
- Email Verification
- Forgot Password
- Reset Password

## Social Authentication

- Google Login

## Password Strength

Password field should display

- Weak
- Medium
- Strong

using zxcvbn.

---

# User Roles

## Customer

Default role after registration.

## Admin

Stored in Firestore.

Role based route protection.

---

# Main Features

## Home

- Hero Banner
- Featured Products
- Categories
- Best Sellers
- Trending Products

---

## Products

- Product Listing
- Product Details
- Search
- Filter
- Sort
- Pagination

---

## Cart

- Add Item
- Remove Item
- Update Quantity
- Total Calculation

---

## Wishlist

- Add Product
- Remove Product

---

## Checkout

- Shipping Address
- Payment Method
- Order Summary

---

## Payment

Razorpay Test Mode

After successful payment

- Save Order
- Show Success Page

---

## Orders

- Order History
- Order Details
- Status

---

## Profile

- Personal Information
- Address
- Password
- Orders

---

# Admin Dashboard

Dashboard includes

- Products
- Categories
- Orders
- Users

---

# Firestore Collections

users

products

categories

cart

wishlist

orders

reviews

---

# Security

- Protected Routes
- Firebase Authentication
- Firestore Rules
- Role Based Access
- Input Validation

---

# Redux Toolkit

Slices

- authSlice
- productSlice
- cartSlice
- wishlistSlice
- orderSlice
- uiSlice

---

# Folder Structure

src/

components/

pages/

layouts/

redux/

firebase/

hooks/

services/

utils/

schemas/

assets/

---

# Nice UI Features

- Responsive Design
- Dark Mode
- Loading Skeletons
- Toast Notifications
- Search Suggestions
- Empty States
- Animations

---

# Future Scope

- Stripe Payment
- Coupons
- Reviews
- Inventory Management
- AI Recommendations
- Admin Analytics
- Multi Vendor Support