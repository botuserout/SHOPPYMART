import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  Package, 
  ArrowRight, 
  ShoppingBag, 
  Truck, 
  Calendar, 
  Printer, 
  CreditCard, 
  Receipt, 
  ShieldCheck 
} from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';
import { motion } from 'framer-motion';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="py-12 max-w-3xl mx-auto space-y-8">
      
      {/* Main Order Confirmation Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xl text-center space-y-6 print:shadow-none print:border-none print:p-0"
      >
        
        {/* Checkmark Icon */}
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto shadow-glow print:hidden">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <span className="inline-block px-3.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs uppercase tracking-wider rounded-full print:hidden">
          ✓ Payment Authorized & Order Confirmed
        </span>

        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Thank You For Your Order!
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Your order has been placed and is currently being processed.
          </p>
        </div>

        {/* Structured IDs Highlight */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto text-left">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800">
            <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Order Reference</span>
            <p className="font-mono font-bold text-sm text-brand-600 dark:text-brand-400 mt-0.5">
              {order?.orderNumber || order?.id || 'ORD-100245'}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800">
            <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Transaction ID</span>
            <p className="font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400 mt-0.5">
              {order?.transactionNumber || order?.paymentId || 'TXN-20260728001'}
            </p>
          </div>
        </div>

        {/* Detailed Printable Invoice Card */}
        {order && (
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800 text-left space-y-6">
            
            {/* Header Meta */}
            <div className="flex flex-wrap items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 text-xs font-semibold text-slate-500 gap-2">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-brand-500" /> {formatDate(order.createdAt || new Date())}
              </span>
              <span className="flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-brand-500" /> {order.paymentMethod}
              </span>
            </div>

            {/* Shipping Address Summary */}
            {order.shippingAddress && (
              <div className="text-xs space-y-1 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-4">
                <span className="font-bold uppercase text-[10px] tracking-wider text-slate-400 block mb-1">Delivering To</span>
                <p className="font-bold text-slate-900 dark:text-white">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.email} • {order.shippingAddress.phone}</p>
              </div>
            )}

            {/* Purchased Items List */}
            <div className="space-y-4">
              <span className="font-bold uppercase text-[10px] tracking-wider text-slate-400 block">Invoice Items</span>
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-800" />
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

            {/* Cost Breakdown */}
            <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-2 text-xs font-semibold">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotal || order.totalAmount * 0.9)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Shipping</span>
                <span>{order.shippingFee === 0 ? 'FREE' : formatCurrency(order.shippingFee || 0)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Tax</span>
                <span>{formatCurrency(order.tax || order.totalAmount * 0.08)}</span>
              </div>
              <div className="flex justify-between font-extrabold text-sm text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-800 pt-3">
                <span>Total Paid</span>
                <span className="text-brand-600 dark:text-brand-400">{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>

          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-4 flex flex-wrap justify-center gap-3 print:hidden">
          <button
            onClick={handlePrint}
            className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all"
          >
            <Printer className="w-4 h-4" /> Download / Print Invoice
          </button>
          
          <Link
            to="/orders"
            className="px-5 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all"
          >
            <Package className="w-4 h-4" /> View My Orders
          </Link>
          
          <Link
            to="/products"
            className="px-5 py-3 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-all"
          >
            <ShoppingBag className="w-4 h-4" /> Continue Shopping
          </Link>
        </div>

      </motion.div>

    </div>
  );
};

export default OrderSuccess;
