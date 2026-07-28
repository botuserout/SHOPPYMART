import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { 
  removeFromCart, 
  updateQuantity, 
  clearCart, 
  selectCartSubtotal, 
  selectCartShipping, 
  selectCartTax, 
  selectCartTotal 
} from '../redux/slices/cartSlice';
import { showToast } from '../redux/slices/uiSlice';
import { formatCurrency } from '../utils/formatters';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Tag, 
  ArrowLeft, 
  Truck, 
  ShieldCheck 
} from 'lucide-react';
import { motion } from 'framer-motion';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.items);
  const subtotal = useSelector(selectCartSubtotal);
  const shipping = useSelector(selectCartShipping);
  const tax = useSelector(selectCartTax);
  const total = useSelector(selectCartTotal);
  const freeShippingThreshold = useSelector((state) => state.cart.freeShippingThreshold);

  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'SKY20') {
      setDiscount(subtotal * 0.2); // 20% off
      dispatch(showToast({ message: '20% Promo discount applied!', type: 'success' }));
    } else {
      dispatch(showToast({ message: 'Invalid promo code. Try "SKY20"', type: 'error' }));
    }
  };

  const finalTotal = Math.max(0, total - discount);
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  if (cartItems.length === 0) {
    return (
      <div className="py-20 text-center space-y-6 max-w-md mx-auto">
        <div className="w-24 h-24 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Your Shopping Cart is Empty</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Discover our full catalog of next-gen gadgets, fashion, and home lifestyle products.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-brand-500/25 transition-all"
        >
          Explore Catalog <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Shopping Cart</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Review your items before proceeding to checkout</p>
        </div>
        <button
          onClick={() => {
            dispatch(clearCart());
            dispatch(showToast({ message: 'Cart cleared', type: 'info' }));
          }}
          className="text-xs font-bold text-rose-500 hover:underline flex items-center gap-1"
        >
          <Trash2 className="w-4 h-4" /> Clear All
        </button>
      </div>

      {/* Free Shipping Progress */}
      <div className="p-4 rounded-2xl bg-brand-50/50 dark:bg-slate-900/80 border border-brand-100 dark:border-slate-800 space-y-2">
        <div className="flex justify-between items-center text-xs font-bold">
          <span className="flex items-center gap-1.5 text-brand-600 dark:text-brand-400">
            <Truck className="w-4 h-4" /> 
            {subtotal >= freeShippingThreshold 
              ? '🎉 You unlocked FREE Express Shipping!' 
              : `Add ${formatCurrency(freeShippingThreshold - subtotal)} more for FREE Shipping`}
          </span>
          <span className="text-slate-500">{progressToFreeShipping.toFixed(0)}%</span>
        </div>
        <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-brand-600 transition-all duration-300"
            style={{ width: `${progressToFreeShipping}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map(({ product, quantity }) => (
            <motion.div 
              key={product.id}
              layout
              className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center gap-5"
            >
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-24 h-24 rounded-2xl object-cover bg-slate-100 dark:bg-slate-800"
              />

              <div className="flex-1 min-w-0 space-y-1 text-center sm:text-left">
                <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                  {product.category}
                </span>
                <h3 className="font-bold text-base text-slate-900 dark:text-white truncate">
                  {product.name}
                </h3>
                <p className="text-xs text-slate-400">Unit Price: {formatCurrency(product.price)}</p>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 p-1">
                  <button
                    onClick={() => dispatch(updateQuantity({ productId: product.id, quantity: quantity - 1 }))}
                    className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold text-slate-900 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => dispatch(updateQuantity({ productId: product.id, quantity: quantity + 1 }))}
                    className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <span className="font-extrabold text-base text-slate-900 dark:text-white min-w-[70px] text-right">
                  {formatCurrency(product.price * quantity)}
                </span>

                <button
                  onClick={() => dispatch(removeFromCart(product.id))}
                  className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}

          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors pt-2"
          >
            <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </Link>
        </div>

        {/* Order Summary Box */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-lg space-y-4">
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
              Order Summary
            </h3>

            {/* Promo code form */}
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Promo Code (SKY20)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 uppercase"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold rounded-xl"
              >
                Apply
              </button>
            </form>

            <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                  <span>Promo Discount (20%)</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {shipping === 0 ? <span className="text-emerald-500 font-bold">FREE</span> : formatCurrency(shipping)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Estimated Tax (8%)</span>
                <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(tax)}</span>
              </div>

              <div className="flex justify-between text-base font-extrabold text-slate-900 dark:text-white pt-3 border-t border-slate-100 dark:border-slate-800">
                <span>Total</span>
                <span className="text-brand-600 dark:text-brand-400">{formatCurrency(finalTotal)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 active:scale-98 transition-all"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 font-semibold pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> Guaranteed 256-Bit SSL Checkout
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Cart;
