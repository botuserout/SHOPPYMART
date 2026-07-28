import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserOrdersThunk } from '../redux/slices/orderSlice';
import { Link } from 'react-router-dom';
import { formatCurrency, formatDate, getOrderStatusBadge } from '../utils/formatters';
import { Package, Clock, ArrowRight, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const Orders = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { userOrders, isLoading } = useSelector((state) => state.orders);

  useEffect(() => {
    if (user) {
      dispatch(fetchUserOrdersThunk({ userId: user.uid, isAdmin: false }));
    }
  }, [dispatch, user]);

  if (!user) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold">Please log in to view your order history</h2>
        <Link to="/login" className="px-6 py-2.5 bg-brand-600 text-white font-bold rounded-xl inline-block">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Your Order History</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Track delivery progress, review receipt, and manage past purchases
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map(n => <div key={n} className="h-32 rounded-3xl skeleton-shimmer" />)}
        </div>
      ) : userOrders.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <Package className="w-16 h-16 text-slate-400 mx-auto" />
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">No Orders Placed Yet</h3>
          <p className="text-sm text-slate-500 max-w-xs mx-auto">You haven't placed any orders with SkyMart yet.</p>
          <Link to="/products" className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-600 text-white font-bold text-xs rounded-xl shadow-md">
            Start Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {userOrders.map((order) => (
            <motion.div 
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Order ID</span>
                  <h4 className="font-mono font-bold text-sm text-slate-900 dark:text-white">{order.id}</h4>
                </div>

                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Date</span>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{formatDate(order.createdAt)}</span>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${getOrderStatusBadge(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Items row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{item.name}</p>
                        <span className="text-[11px] text-slate-400">Qty: {item.quantity} × {formatCurrency(item.price)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:items-end justify-between border-t sm:border-t-0 border-slate-100 dark:border-slate-800 pt-3 sm:pt-0">
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block">Total Amount</span>
                    <span className="text-xl font-extrabold text-brand-600 dark:text-brand-400">
                      {formatCurrency(order.totalAmount)}
                    </span>
                  </div>

                  <Link
                    to={`/orders/${order.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline mt-2"
                  >
                    View Receipt & Details <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

    </div>
  );
};

export default Orders;
