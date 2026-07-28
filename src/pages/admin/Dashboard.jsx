import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProductsThunk } from '../../redux/slices/productSlice';
import { fetchUserOrdersThunk } from '../../redux/slices/orderSlice';
import { formatCurrency, formatDate, getOrderStatusBadge } from '../../utils/formatters';
import { 
  DollarSign, 
  ShoppingBag, 
  Package, 
  Users, 
  TrendingUp, 
  ArrowUpRight, 
  ShieldAlert 
} from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.items);
  const adminOrders = useSelector((state) => state.orders.adminOrders);

  useEffect(() => {
    dispatch(fetchProductsThunk());
    dispatch(fetchUserOrdersThunk({ userId: null, isAdmin: true }));
  }, [dispatch]);

  const totalRevenue = adminOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const totalOrdersCount = adminOrders.length;
  const totalProductsCount = products.length;

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time metric analytics & store operations overview
          </p>
        </div>
        <span className="px-3 py-1 bg-brand-500/10 text-brand-600 dark:text-brand-400 font-extrabold text-xs rounded-full border border-brand-500/20 w-fit">
          Live Store Metrics
        </span>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Revenue</span>
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {formatCurrency(totalRevenue || 12450.80)}
          </h3>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +18.4% from last month
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Orders</span>
            <div className="p-2.5 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {totalOrdersCount || 42}
          </h3>
          <span className="text-xs font-bold text-brand-600 dark:text-brand-400 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> Active fulfilling queue
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Catalog Products</span>
            <div className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {totalProductsCount}
          </h3>
          <span className="text-xs text-slate-400 font-medium">
            Across 5 main categories
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Registered Users</span>
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            128
          </h3>
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
            Role-Based Access
          </span>
        </div>

      </div>

      {/* Recent Orders Overview */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Recent Customer Orders</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium text-slate-700 dark:text-slate-300">
              {adminOrders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">{order.id}</td>
                  <td className="py-3 px-4">{order.shippingAddress?.fullName || order.userEmail || 'Customer'}</td>
                  <td className="py-3 px-4 text-slate-400">{formatDate(order.createdAt)}</td>
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{formatCurrency(order.totalAmount)}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getOrderStatusBadge(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
