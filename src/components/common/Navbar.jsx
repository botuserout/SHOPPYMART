import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleDarkMode, toggleSearchModal, toggleCartDrawer } from '../../redux/slices/uiSlice';
import { logoutThunk } from '../../redux/slices/authSlice';
import { selectCartItemCount } from '../../redux/slices/cartSlice';
import { 
  Sun, 
  Moon, 
  Search, 
  ShoppingBag, 
  Heart, 
  User, 
  LogOut, 
  Shield, 
  Package, 
  Menu, 
  X, 
  ChevronDown,
  Sparkles,
  Bell,
  Settings,
  Compass,
  Home,
  UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const darkMode = useSelector((state) => state.ui.darkMode);
  const user = useSelector((state) => state.auth.user);
  const itemCount = useSelector(selectCartItemCount);
  const wishlistCount = useSelector((state) => state.wishlist.items.length);

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  const userMenuRef = useRef(null);

  // Monitor scroll for premium floating navigation blur effect
  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle outside clicks to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header 
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          hasScrolled 
            ? 'bg-white/85 dark:bg-slate-950/85 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 py-3 shadow-sm' 
            : 'bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-900 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* 1. Logo Section */}
          <Link to="/" className="flex items-center gap-2.5 group relative" aria-label="SkyMart Home">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform duration-300">
              S
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-slate-950 dark:text-white flex items-center gap-1">
                Sky<span className="bg-gradient-to-r from-brand-600 to-indigo-500 bg-clip-text text-transparent dark:from-brand-400 dark:to-indigo-400">Mart</span>
                <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 -mt-1">
                Next-Gen Commerce
              </span>
            </div>
          </Link>

          {/* 2. Desktop Navigation Center */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium" aria-label="Main Navigation">
            {[
              { path: '/', label: 'Home' },
              { path: '/products', label: 'Explore Products' },
            ].map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative py-2 px-1 transition-colors duration-200 ${
                    active 
                      ? 'text-brand-600 dark:text-brand-400 font-bold' 
                      : 'text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400'
                  }`}
                >
                  {link.label}
                  {active && (
                    <motion.div 
                      layoutId="navbar-underline" 
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-500 rounded-full"
                    />
                  )}
                </Link>
              );
            })}

            {user?.role === 'admin' && (
              <Link 
                to="/admin" 
                className="px-3.5 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-bold flex items-center gap-1.5 transition-all hover:scale-105"
              >
                <Shield className="w-3.5 h-3.5" /> Admin Portal
              </Link>
            )}
          </nav>

          {/* 3. Action Icons & Avatar */}
          <div className="flex items-center gap-1 sm:gap-2">
            
            {/* Search Button */}
            <button
              onClick={() => dispatch(toggleSearchModal())}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors focus:ring-2 focus:ring-brand-500/20 outline-none"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => dispatch(toggleDarkMode())}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors focus:ring-2 focus:ring-brand-500/20 outline-none"
              aria-label="Toggle Dark/Light Mode"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors focus:ring-2 focus:ring-brand-500/20 outline-none"
              aria-label={`Wishlist, ${wishlistCount} items`}
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center px-1">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <button
              onClick={() => dispatch(toggleCartDrawer())}
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors focus:ring-2 focus:ring-brand-500/20 outline-none"
              aria-label={`Cart, ${itemCount} items`}
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-4 rounded-full bg-brand-600 text-white text-[9px] font-bold flex items-center justify-center px-1">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Notifications Dot Indicator (Stripe Style) */}
            <div className="relative hidden sm:block p-2 rounded-xl text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-indigo-500" />
            </div>

            {/* Auth Dropdown / Buttons */}
            <div className="relative ml-2" ref={userMenuRef}>
              {user ? (
                <>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors border border-slate-200/40 dark:border-slate-800/40 focus:ring-2 focus:ring-brand-500/20 outline-none"
                    aria-expanded={isUserMenuOpen}
                    aria-label="User account menu"
                  >
                    <img
                      src={user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80'}
                      alt={user.displayName || 'User profile'}
                      className="w-7.5 h-7.5 rounded-lg object-cover ring-2 ring-brand-500/10"
                    />
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Card */}
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2.5 w-60 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800/80 py-2.5 z-50 overflow-hidden"
                      >
                        {/* Profile Info Summary */}
                        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/80 mb-1 space-y-1">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Account</p>
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.displayName || 'SkyMart User'}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                          <span className="inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide bg-brand-500/10 text-brand-600 dark:text-brand-400">
                            {user.role === 'admin' ? '🛡️ Admin' : '👤 Customer'}
                          </span>
                        </div>

                        {/* Dropdown Items */}
                        <div className="py-1">
                          {[
                            { to: '/profile', label: 'My Profile', icon: User },
                            { to: '/orders', label: 'Order History', icon: Package },
                          ].map((item) => {
                            const Icon = item.icon;
                            return (
                              <Link
                                key={item.to}
                                to={item.to}
                                onClick={() => setIsUserMenuOpen(false)}
                                className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                              >
                                <Icon className="w-4 h-4 text-slate-400" />
                                {item.label}
                              </Link>
                            );
                          })}

                          {user.role === 'admin' && (
                            <Link
                              to="/admin"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-500/5 dark:hover:bg-amber-500/10 transition-colors"
                            >
                              <Shield className="w-4 h-4 text-amber-500" />
                              Admin Dashboard
                            </Link>
                          )}
                        </div>

                        {/* Sign Out Button */}
                        <div className="border-t border-slate-100 dark:border-slate-800/80 pt-1.5 mt-1">
                          <button
                            onClick={handleLogout}
                            className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>

                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <div className="hidden sm:flex items-center gap-1.5">
                  <Link
                    to="/login"
                    className="px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-slate-950 hover:bg-slate-900 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 rounded-xl text-xs font-bold shadow-sm shadow-slate-950/10 dark:shadow-none transition-all hover:scale-[1.02]"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Drawer Menu Trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors ml-1 focus:ring-2 focus:ring-brand-500/20"
              aria-label="Toggle Navigation Drawer"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </header>

      {/* 4. Sliding Mobile Menu Drawer Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Drawer Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-slate-950/50 md:hidden"
            />

            {/* Drawer Container */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed top-0 bottom-0 right-0 z-50 w-72 bg-white dark:bg-slate-950 shadow-2xl border-l border-slate-200/50 dark:border-slate-800/50 p-6 flex flex-col justify-between md:hidden"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-lg text-slate-950 dark:text-white">Menu Navigation</span>
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {[
                    { path: '/', label: 'Home Page', icon: Home },
                    { path: '/products', label: 'Explore Products', icon: Compass },
                    { path: '/wishlist', label: 'My Wishlist', icon: Heart },
                  ].map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 py-3 px-4 rounded-xl text-sm font-bold transition-all ${
                          isActive(link.path)
                            ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {link.label}
                      </Link>
                    );
                  })}

                  {user && (
                    <>
                      <Link
                        to="/profile"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 py-3 px-4 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        Account Profile
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 py-3 px-4 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900"
                      >
                        <Package className="w-4 h-4 text-slate-400" />
                        My Orders
                      </Link>
                    </>
                  )}
                </div>
              </div>

              {/* Bottom Drawer Actions */}
              <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5 px-2 py-1">
                      <img
                        src={user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80'}
                        alt={user.displayName || 'User'}
                        className="w-9 h-9 rounded-lg object-cover"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-950 dark:text-white truncate">{user.displayName}</p>
                        <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full py-3 bg-rose-500/10 hover:bg-rose-500/25 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="py-3 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 text-center text-xs font-bold text-slate-800 dark:text-slate-200 rounded-xl"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="py-3 bg-brand-600 hover:bg-brand-700 text-center text-xs font-bold text-white rounded-xl shadow-md shadow-brand-500/10"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 5. Mobile Bottom Sticky Navigation (Apple/Shopify Style) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-t border-slate-200/50 dark:border-slate-800/50 py-2.5 px-6 flex items-center justify-between md:hidden print:hidden shadow-lg">
        {[
          { path: '/', label: 'Home', icon: Home },
          { path: '/products', label: 'Shop', icon: Compass },
          { path: 'search', label: 'Search', icon: Search, action: () => dispatch(toggleSearchModal()) },
          { path: 'cart', label: 'Cart', icon: ShoppingBag, action: () => dispatch(toggleCartDrawer()), badge: itemCount },
          { path: user ? '/profile' : '/login', label: 'Account', icon: UserCheck },
        ].map((item, idx) => {
          const Icon = item.icon;
          const active = item.path && isActive(item.path);
          return (
            <button
              key={idx}
              type="button"
              onClick={item.action ? item.action : () => navigate(item.path)}
              className={`relative flex flex-col items-center gap-1 text-[10px] font-bold transition-all focus:outline-none ${
                active 
                  ? 'text-brand-600 dark:text-brand-400' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[15px] h-3.5 rounded-full bg-brand-600 text-white text-[8px] font-extrabold flex items-center justify-center px-0.5 shadow-sm">
                    {item.badge}
                  </span>
                )}
              </div>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};

export default Navbar;
