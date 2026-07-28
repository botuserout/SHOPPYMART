import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { showToast } from '../redux/slices/uiSlice';
import { User, Mail, Shield, MapPin, KeyRound, Package, Heart, Save } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const userOrders = useSelector((state) => state.orders.userOrders);
  const wishlistCount = useSelector((state) => state.wishlist.items.length);

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [address, setAddress] = useState('123 Shopping Avenue, Suite 400');
  const [city, setCity] = useState('New York');
  const [state, setState] = useState('NY');
  const [zip, setZip] = useState('10001');

  const handleSaveProfile = (e) => {
    e.preventDefault();
    dispatch(showToast({ message: 'Profile information updated successfully!', type: 'success' }));
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Account Profile</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your personal information, address preferences, & account credentials
        </p>
      </div>

      {/* Header Info Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-xl flex flex-col sm:flex-row items-center gap-6">
        <img
          src={user?.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80'}
          alt="Avatar"
          className="w-20 h-20 rounded-2xl object-cover border-4 border-white/20 shadow-md"
        />
        <div className="space-y-1 text-center sm:text-left flex-1">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h2 className="text-2xl font-extrabold">{user?.displayName || 'Valued Customer'}</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md">
              {user?.role || 'Customer'}
            </span>
          </div>
          <p className="text-xs text-slate-200">{user?.email}</p>
        </div>

        <div className="flex gap-4 border-t sm:border-t-0 sm:border-l border-white/20 pt-4 sm:pt-0 sm:pl-6 text-center">
          <div>
            <span className="text-2xl font-extrabold block">{userOrders.length}</span>
            <span className="text-[11px] text-slate-200 font-medium">Orders</span>
          </div>
          <div>
            <span className="text-2xl font-extrabold block">{wishlistCount}</span>
            <span className="text-[11px] text-slate-200 font-medium">Saved Items</span>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        
        {/* Personal Details */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <User className="w-5 h-5 text-brand-500" /> Personal Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-400 text-sm cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Address Book */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <MapPin className="w-5 h-5 text-brand-500" /> Saved Delivery Address
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Street Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">State</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Zip Code</label>
                <input
                  type="text"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-8 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-brand-500/25 flex items-center gap-2"
        >
          <Save className="w-4 h-4" /> Save Profile Changes
        </button>

      </form>

    </div>
  );
};

export default Profile;
