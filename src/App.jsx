import React, { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase/config';
import { setUser, googleRedirectResultThunk } from './redux/slices/authSlice';
import { showToast } from './redux/slices/uiSlice';
import { doc, getDoc } from 'firebase/firestore';

// Layouts & Protection
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/protected/ProtectedRoute';
import AdminRoute from './components/protected/AdminRoute';

// Lazy-loaded Customer Pages
const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));
const Orders = lazy(() => import('./pages/Orders'));
const OrderDetail = lazy(() => import('./pages/OrderDetail'));
const Profile = lazy(() => import('./pages/Profile'));

// Lazy-loaded Auth Pages
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Lazy-loaded Admin Pages
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const ProductsAdmin = lazy(() => import('./pages/admin/ProductsAdmin'));
const CategoriesAdmin = lazy(() => import('./pages/admin/CategoriesAdmin'));
const OrdersAdmin = lazy(() => import('./pages/admin/OrdersAdmin'));
const UsersAdmin = lazy(() => import('./pages/admin/UsersAdmin'));

const PageLoader = () => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-4">
    <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Loading SkyMart…</p>
  </div>
);

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isRedirectPending } = useSelector((state) => state.auth);

  useEffect(() => {
    // 1. Check if the user just returned from a Google redirect sign-in
    dispatch(googleRedirectResultThunk()).then((result) => {
      if (result.payload) {
        // User completed Google Sign-In via redirect
        dispatch(showToast({ message: `Welcome, ${result.payload.displayName || 'there'}! 🎉`, type: 'success' }));
        navigate(result.payload.role === 'admin' ? '/admin' : '/');
      }
    });

    // 2. Firebase Auth state listener — keeps user in sync after page refreshes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          const userData = userDoc.exists()
            ? userDoc.data()
            : {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || user.email?.split('@')[0],
                photoURL: user.photoURL || '',
                role: 'customer',
                createdAt: new Date().toISOString()
              };
          dispatch(setUser(userData));
        } catch (e) {
          // Firestore blocked (ad-blocker) — use Firebase Auth data directly
          dispatch(setUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || 'User',
            photoURL: user.photoURL || '',
            role: 'customer',
            createdAt: new Date().toISOString()
          }));
        }
      } else {
        dispatch(setUser(null));
      }
    });

    return () => unsubscribe();
  }, [dispatch, navigate]);

  // Show a spinner while waiting for the Google redirect result to resolve
  if (isRedirectPending) {
    return <PageLoader />;
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Customer & Public Routes (MainLayout) */}
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/products" element={<MainLayout><Products /></MainLayout>} />
        <Route path="/products/:id" element={<MainLayout><ProductDetail /></MainLayout>} />
        <Route path="/cart" element={<MainLayout><Cart /></MainLayout>} />
        <Route path="/wishlist" element={<MainLayout><Wishlist /></MainLayout>} />

        {/* Protected Customer Routes */}
        <Route path="/checkout" element={<ProtectedRoute><MainLayout><Checkout /></MainLayout></ProtectedRoute>} />
        <Route path="/order-success" element={<ProtectedRoute><MainLayout><OrderSuccess /></MainLayout></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><MainLayout><Orders /></MainLayout></ProtectedRoute>} />
        <Route path="/orders/:id" element={<ProtectedRoute><MainLayout><OrderDetail /></MainLayout></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><MainLayout><Profile /></MainLayout></ProtectedRoute>} />

        {/* Auth Pages */}
        <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
        <Route path="/register" element={<MainLayout><Register /></MainLayout>} />
        <Route path="/forgot-password" element={<MainLayout><ForgotPassword /></MainLayout>} />
        <Route path="/reset-password" element={<MainLayout><ResetPassword /></MainLayout>} />

        {/* Protected Admin Routes (AdminLayout) */}
        <Route path="/admin" element={<AdminRoute><AdminLayout><Dashboard /></AdminLayout></AdminRoute>} />
        <Route path="/admin/products" element={<AdminRoute><AdminLayout><ProductsAdmin /></AdminLayout></AdminRoute>} />
        <Route path="/admin/categories" element={<AdminRoute><AdminLayout><CategoriesAdmin /></AdminLayout></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><AdminLayout><OrdersAdmin /></AdminLayout></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><AdminLayout><UsersAdmin /></AdminLayout></AdminRoute>} />

        {/* 404 Catch All */}
        <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
      </Routes>
    </Suspense>
  );
}

export default App;
