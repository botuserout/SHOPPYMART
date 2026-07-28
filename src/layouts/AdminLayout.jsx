import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleDarkMode } from '../redux/slices/uiSlice';
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  ShoppingBag, 
  Users, 
  ArrowLeft, 
  Sun, 
  Moon, 
  ShieldAlert, 
  Sparkles 
} from 'lucide-react';
import ToastContainer from '../components/common/ToastContainer';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.ui.darkMode);
  const user = useSelector((state) => state.auth.user);

  const navItems = [
    { label: 'Dashboard Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Products Manager', path: '/admin/products', icon: Package },
    { label: 'Categories', path: '/admin/categories', icon: Layers },
    { label: 'Orders List', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Users & Roles', path: '/admin/users', icon: Users },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <ToastContainer />

      {/* Admin Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex border-r border-slate-800">
        
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-brand-600 flex items-center justify-center text-white font-extrabold text-lg shadow-glow">
            A
          </div>
          <div>
            <h2 className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1">
              SkyMart <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">ADMIN</span>
            </h2>
            <p className="text-[10px] text-slate-400">Management Suite</p>
          </div>
        </div>

        {/* Admin Navigation */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map(({ label, path, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-colors ${
                isActive(path)
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Back to Customer Store */}
        <div className="p-4 border-t border-slate-800">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Customer Store
          </Link>
        </div>

      </aside>

      {/* Main Admin Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Admin Topbar */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="md:hidden p-2 text-slate-600 dark:text-slate-300"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-500" />
              {navItems.find(i => i.path === location.pathname)?.label || 'Admin Portal'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => dispatch(toggleDarkMode())}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-800">
              <img
                src={user?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'}
                alt="Admin"
                className="w-8 h-8 rounded-lg object-cover"
              />
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{user?.displayName || 'Administrator'}</p>
                <p className="text-[10px] text-slate-400">{user?.email}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Navigation bar for Admin */}
        <div className="md:hidden flex overflow-x-auto bg-slate-900 text-white p-2 border-b border-slate-800 gap-2">
          {navItems.map(({ label, path, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
                isActive(path) ? 'bg-brand-600 text-white' : 'text-slate-400'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </Link>
          ))}
        </div>

        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
