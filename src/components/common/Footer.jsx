import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Mail, ShieldCheck, Truck, RefreshCw, CreditCard } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors">
      
      {/* Value Proposition Banners */}
      <div className="border-b border-slate-100 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center gap-2 p-2">
            <div className="p-3 bg-brand-500/10 rounded-2xl text-brand-600 dark:text-brand-400">
              <Truck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">Free Express Shipping</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">On all orders over $100</p>
          </div>

          <div className="flex flex-col items-center gap-2 p-2">
            <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">Secure Payments</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Powered by Razorpay & SSL</p>
          </div>

          <div className="flex flex-col items-center gap-2 p-2">
            <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-600 dark:text-purple-400">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">30-Day Easy Returns</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Money back guarantee</p>
          </div>

          <div className="flex flex-col items-center gap-2 p-2">
            <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-600 dark:text-amber-400">
              <CreditCard className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">Instant Checkout</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Test mode available</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-5 gap-8">
        
        {/* Brand info */}
        <div className="md:col-span-2 space-y-4">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white font-extrabold text-lg shadow-glow">
              S
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
              Sky<span className="text-brand-600 dark:text-brand-400">Mart</span>
              <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
            </span>
          </Link>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
            SkyMart is your premier destination for next-generation tech, curated fashion, and modern home lifestyle essentials.
          </p>
          
          {/* Newsletter */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Subscribe to Special Offers
            </label>
            <div className="flex items-center gap-2">
              <input
                type="email"
                placeholder="Enter your email..."
                className="px-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm rounded-xl transition-all flex items-center gap-1.5">
                <Mail className="w-4 h-4" /> Join
              </button>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-4">
            Shop Catalog
          </h4>
          <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
            <li><Link to="/products" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">All Products</Link></li>
            <li><Link to="/products?category=electronics" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Electronics</Link></li>
            <li><Link to="/products?category=fashion" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Fashion & Apparel</Link></li>
            <li><Link to="/products?category=footwear" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Footwear</Link></li>
            <li><Link to="/products?category=accessories" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Accessories</Link></li>
          </ul>
        </div>

        {/* Account Links */}
        <div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-4">
            Customer Care
          </h4>
          <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
            <li><Link to="/profile" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">My Account</Link></li>
            <li><Link to="/orders" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Track Orders</Link></li>
            <li><Link to="/wishlist" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Saved Wishlist</Link></li>
            <li><Link to="/cart" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">View Cart</Link></li>
          </ul>
        </div>

        {/* Legal / Admin */}
        <div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-4">
            Platform
          </h4>
          <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
            <li><Link to="/admin" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors font-medium">Admin Portal</Link></li>
            <li><a href="#" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Contact Support</a></li>
          </ul>
        </div>

      </div>

      {/* Sub-footer copyright */}
      <div className="border-t border-slate-100 dark:border-slate-800 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        © {new Date().getFullYear()} SkyMart Inc. All rights reserved. Designed with modern architecture & Vite.
      </div>
    </footer>
  );
};

export default Footer;
