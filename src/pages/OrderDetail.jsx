import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { formatCurrency, formatDate, getOrderStatusBadge } from '../utils/formatters';
import { ArrowLeft, CheckCircle2, Truck, Package, MapPin, CreditCard, ShieldCheck } from 'lucide-react';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const userOrders = useSelector((state) => state.orders.userOrders);
  const order = userOrders.find(o => o.id === id) || userOrders[0];

  if (!order) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold">Order Details Not Found</h2>
        <Link to="/orders" className="text-brand-600 font-bold hover:underline">Back to Orders</Link>
      </div>
    );
  }

  const statuses = ['Placed', 'Processing', 'Shipped', 'Delivered'];
  const currentStatusIndex = statuses.indexOf(order.status) !== -1 ? statuses.indexOf(order.status) : 0;

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      
      <button
        onClick={() => navigate('/orders')}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Order History
      </button>

      {/* Header Info */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Order ID</span>
            <h1 className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">{order.id}</h1>
            <p className="text-xs text-slate-400 mt-0.5">Placed on {formatDate(order.createdAt)}</p>
          </div>

          <span className={`px-4 py-1.5 rounded-full text-xs font-extrabold border ${getOrderStatusBadge(order.status)}`}>
            {order.status}
          </span>
        </div>

        {/* Delivery Progress Bar */}
        <div className="py-4 space-y-3">
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Shipment Status Tracker</h4>
          <div className="grid grid-cols-4 gap-2 text-center">
            {statuses.map((st, idx) => {
              const isPassed = idx <= currentStatusIndex;
              return (
                <div key={st} className="space-y-1.5">
                  <div className={`h-2 rounded-full transition-all ${isPassed ? 'bg-brand-600 shadow-glow' : 'bg-slate-200 dark:bg-slate-800'}`} />
                  <span className={`text-[11px] font-bold block ${isPassed ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400'}`}>
                    {st}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Shipping Address & Payment Specs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-brand-500" /> Delivery Address
            </h4>
            <p className="text-sm font-bold text-slate-900 dark:text-white">{order.shippingAddress?.fullName}</p>
            <p className="text-xs text-slate-500">{order.shippingAddress?.address}, {order.shippingAddress?.city}</p>
            <p className="text-xs text-slate-500">{order.shippingAddress?.state} {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}</p>
            <p className="text-xs text-slate-500">Phone: {order.shippingAddress?.phone}</p>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-emerald-500" /> Payment Receipt
            </h4>
            <p className="text-xs text-slate-500">Method: <span className="font-bold text-slate-800 dark:text-slate-200">{order.paymentMethod}</span></p>
            <p className="text-xs text-slate-500 font-mono">Reference: {order.paymentId}</p>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Payment Verified
            </span>
          </div>
        </div>

        {/* Itemized breakdown */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Ordered Items</h4>
          <div className="space-y-3">
            {order.items?.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800">
                <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <h5 className="font-bold text-sm text-slate-900 dark:text-white truncate">{item.name}</h5>
                  <span className="text-xs text-slate-400">Qty: {item.quantity} × {formatCurrency(item.price)}</span>
                </div>
                <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 space-y-1.5 text-xs text-slate-500 text-right">
            <p>Subtotal: <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(order.subtotal)}</span></p>
            <p>Shipping: <span className="font-bold text-slate-900 dark:text-white">{order.shippingFee === 0 ? 'FREE' : formatCurrency(order.shippingFee)}</span></p>
            <p>Tax: <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(order.tax)}</span></p>
            <p className="text-lg font-extrabold text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-800">
              Total Amount: <span className="text-brand-600 dark:text-brand-400">{formatCurrency(order.totalAmount)}</span>
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};

export default OrderDetail;
