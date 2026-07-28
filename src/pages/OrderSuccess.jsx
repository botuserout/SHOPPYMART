import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, Home, ShoppingBag, Truck, Calendar } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';
import { motion } from 'framer-motion';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  return (
    <div className="py-12 max-w-3xl mx-auto space-y-8">
      
      {/* Banner */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl text-center space-y-4"
      >
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto shadow-glow">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs uppercase tracking-wider rounded-full">
          Payment Verified & Order Confirmed
        </span>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Thank You For Your Order!
        </h1>

        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Order reference <span className="font-mono font-bold text-brand-600 dark:text-brand-400">{order?.id || 'ORD-98234'}</span> has been placed. We sent a confirmation to your email.
        </p>

        {/* Order Details Card */}
        {order && (
          <div className="mt-8 p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800 text-left space-y-4">
            <div className="flex flex-wrap items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-brand-500" /> Placed on {formatDate(order.createdAt)}</span>
              <span className="flex items-center gap-1.5"><Truck className="w-4 h-4 text-brand-500" /> Method: {order.paymentMethod}</span>
            </div>

            {/* Item List */}
            <div className="space-y-3">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-xs text-slate-900 dark:text-white truncate">{item.name}</h5>
                    <span className="text-[11px] text-slate-400">Qty: {item.quantity} × {formatCurrency(item.price)}</span>
                  </div>
                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between font-extrabold text-sm text-slate-900 dark:text-white">
              <span>Total Paid</span>
              <span className="text-brand-600 dark:text-brand-400">{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>
        )}

        <div className="pt-6 flex flex-wrap justify-center gap-4">
          <Link
            to="/orders"
            className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2"
          >
            <Package className="w-4 h-4" /> View Order Status
          </Link>
          <Link
            to="/products"
            className="px-6 py-3 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs rounded-xl flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" /> Continue Shopping
          </Link>
        </div>

      </motion.div>

    </div>
  );
};

export default OrderSuccess;
