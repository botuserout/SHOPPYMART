import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCartDrawerOpen, toggleCartDrawer } from '../../redux/slices/uiSlice';
import { removeFromCart, updateQuantity, selectCartSubtotal, selectCartItemCount } from '../../redux/slices/cartSlice';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { motion, AnimatePresence } from 'framer-motion';

const CartDrawer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isOpen = useSelector((state) => state.ui.isCartDrawerOpen);
  const cartItems = useSelector((state) => state.cart.items);
  const subtotal = useSelector(selectCartSubtotal);
  const itemCount = useSelector(selectCartItemCount);

  if (!isOpen) return null;

  const handleClose = () => dispatch(setCartDrawerOpen(false));

  const handleProceedToCheckout = () => {
    handleClose();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-screen max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
                  Your Cart ({itemCount})
                </h3>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800/60 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag className="w-10 h-10 text-slate-400" />
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1">Your cart is empty</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mb-6">
                    Looks like you haven't added anything to your cart yet.
                  </p>
                  <button
                    onClick={() => {
                      handleClose();
                      navigate('/products');
                    }}
                    className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-semibold text-sm transition-all"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cartItems.map(({ product, quantity }) => (
                  <div 
                    key={product.id} 
                    className="flex gap-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/60"
                  >
                    <img 
                      src={product.images[0]} 
                      alt={product.name} 
                      className="w-20 h-20 rounded-xl object-cover bg-white" 
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 line-clamp-1">
                            {product.name}
                          </h4>
                          <button
                            onClick={() => dispatch(removeFromCart(product.id))}
                            className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-brand-600 dark:text-brand-400 font-medium capitalize mt-0.5">
                          {product.category}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                          {formatCurrency(product.price * quantity)}
                        </span>
                        
                        <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900">
                          <button
                            onClick={() => dispatch(updateQuantity({ productId: product.id, quantity: quantity - 1 }))}
                            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-l-lg text-slate-600 dark:text-slate-300"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-slate-900 dark:text-slate-100">
                            {quantity}
                          </span>
                          <button
                            onClick={() => dispatch(updateQuantity({ productId: product.id, quantity: quantity + 1 }))}
                            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-r-lg text-slate-600 dark:text-slate-300"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary */}
            {cartItems.length > 0 && (
              <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Subtotal</span>
                  <span className="font-bold text-lg text-slate-900 dark:text-slate-100">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Taxes and shipping calculated at checkout.
                </p>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => {
                      handleClose();
                      navigate('/cart');
                    }}
                    className="w-full py-3 px-4 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 font-semibold text-sm rounded-xl transition-all"
                  >
                    View Cart
                  </button>
                  <button
                    onClick={handleProceedToCheckout}
                    className="w-full py-3 px-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-brand-500/25 flex items-center justify-center gap-1.5 transition-all"
                  >
                    Checkout <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default CartDrawer;
