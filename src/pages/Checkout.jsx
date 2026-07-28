import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addressSchema } from '../schemas/addressSchema';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  selectCartSubtotal, 
  selectCartShipping, 
  selectCartTax, 
  selectCartTotal, 
  clearCart 
} from '../redux/slices/cartSlice';
import { createOrderThunk } from '../redux/slices/orderSlice';
import { showToast } from '../redux/slices/uiSlice';
import { formatCurrency } from '../utils/formatters';
import { 
  ShieldCheck, 
  CreditCard, 
  Truck, 
  CheckCircle2, 
  Lock, 
  ArrowRight, 
  Building, 
  MapPin, 
  Phone, 
  Mail, 
  User 
} from 'lucide-react';
import { motion } from 'framer-motion';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);
  const cartItems = useSelector((state) => state.cart.items);
  const subtotal = useSelector(selectCartSubtotal);
  const shipping = useSelector(selectCartShipping);
  const tax = useSelector(selectCartTax);
  const total = useSelector(selectCartTotal);

  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      fullName: user?.displayName || '',
      email: user?.email || '',
      phone: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'United States'
    }
  });

  if (cartItems.length === 0) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold">No items in cart for checkout</h2>
        <button
          onClick={() => navigate('/products')}
          className="px-6 py-2.5 bg-brand-600 text-white font-bold rounded-xl"
        >
          Return to Store
        </button>
      </div>
    );
  }

  // Handle Order Placement & Razorpay SDK Checkout
  const handleFinalizeOrder = async (shippingAddress, paymentDetails) => {
    setIsProcessing(true);
    try {
      const orderPayload = {
        userId: user?.uid || 'guest-' + Date.now(),
        userEmail: shippingAddress.email,
        items: cartItems.map(item => ({
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.images[0]
        })),
        shippingAddress,
        paymentMethod: paymentDetails.method,
        paymentId: paymentDetails.paymentId || 'pay_' + Math.random().toString(36).substring(2, 9),
        subtotal,
        shippingFee: shipping,
        tax,
        totalAmount: total,
        status: 'Placed'
      };

      const resultAction = await dispatch(createOrderThunk(orderPayload));

      if (!resultAction.error) {
        dispatch(clearCart());
        dispatch(showToast({ message: 'Order successfully placed!', type: 'success' }));
        navigate('/order-success', { state: { order: resultAction.payload } });
      } else {
        dispatch(showToast({ message: 'Order placement failed.', type: 'error' }));
      }
    } catch (err) {
      console.error(err);
      dispatch(showToast({ message: 'Error processing order', type: 'error' }));
    } finally {
      setIsProcessing(false);
    }
  };

  const onSubmitForm = (shippingAddress) => {
    if (paymentMethod === 'razorpay') {
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || '';
      const isRealKey = razorpayKey && 
                        !razorpayKey.includes('YourKeyId') && 
                        !razorpayKey.includes('dummy') && 
                        razorpayKey.startsWith('rzp_');

      if (isRealKey && typeof window !== 'undefined' && window.Razorpay) {
        const options = {
          key: razorpayKey,
          amount: Math.round(total * 100),
          currency: 'INR',
          name: 'SkyMart E-Commerce',
          description: 'Payment for SkyMart Order',
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&auto=format&fit=crop&q=80',
          handler: function (response) {
            handleFinalizeOrder(shippingAddress, {
              method: 'Razorpay (Test Mode)',
              paymentId: response.razorpay_payment_id
            });
          },
          prefill: {
            name: shippingAddress.fullName,
            email: shippingAddress.email,
            contact: shippingAddress.phone || '9999999999'
          },
          theme: {
            color: '#4f46e5'
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
              dispatch(showToast({ message: 'Razorpay checkout cancelled.', type: 'info' }));
            }
          }
        };

        try {
          const rzp = new window.Razorpay(options);
          rzp.on('payment.failed', function (response) {
            setIsProcessing(false);
            dispatch(showToast({ message: 'Razorpay payment failed. Using Test Order mode.', type: 'error' }));
          });
          rzp.open();
        } catch (e) {
          handleFinalizeOrder(shippingAddress, {
            method: 'Razorpay (Test Mode)',
            paymentId: 'pay_test_' + Math.random().toString(36).substring(2, 9)
          });
        }
      } else {
        // Automatic Test Mode Simulation when no live Razorpay Key is configured
        setIsProcessing(true);
        setTimeout(() => {
          handleFinalizeOrder(shippingAddress, {
            method: 'Razorpay (Test Mode)',
            paymentId: 'pay_test_' + Math.random().toString(36).substring(2, 9)
          });
        }, 800);
      }
    } else {
      // Cash on Delivery
      handleFinalizeOrder(shippingAddress, {
        method: 'Cash on Delivery (COD)',
        paymentId: 'COD-' + Date.now()
      });
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Title */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Secure Checkout</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Complete your delivery details and test payment to place order
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmitForm)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Delivery & Payment Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Shipping Address Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
              <MapPin className="w-5 h-5 text-brand-500" /> 1. Shipping Address
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  {...register('fullName')}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
                {errors.fullName && <p className="text-xs text-rose-500 mt-1">{errors.fullName.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  {...register('email')}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
                {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="+1 (555) 000-0000"
                  {...register('phone')}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
                {errors.phone && <p className="text-xs text-rose-500 mt-1">{errors.phone.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Country
                </label>
                <input
                  type="text"
                  {...register('country')}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
                {errors.country && <p className="text-xs text-rose-500 mt-1">{errors.country.message}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  placeholder="123 Shopping Avenue, Suite 400"
                  {...register('address')}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
                {errors.address && <p className="text-xs text-rose-500 mt-1">{errors.address.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  City
                </label>
                <input
                  type="text"
                  {...register('city')}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
                {errors.city && <p className="text-xs text-rose-500 mt-1">{errors.city.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  State / Zip Code
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="State"
                    {...register('state')}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Zip"
                    {...register('postalCode')}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
                {(errors.state || errors.postalCode) && (
                  <p className="text-xs text-rose-500 mt-1">State and Postal code required</p>
                )}
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
              <CreditCard className="w-5 h-5 text-brand-500" /> 2. Payment Method
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Razorpay Option */}
              <div 
                onClick={() => setPaymentMethod('razorpay')}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                  paymentMethod === 'razorpay'
                    ? 'border-brand-600 bg-brand-50/30 dark:bg-brand-950/30 shadow-md'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-brand-600" /> Razorpay Test Mode
                  </span>
                  <div className={`w-4 h-4 rounded-full border-2 ${paymentMethod === 'razorpay' ? 'border-brand-600 bg-brand-600' : 'border-slate-300'}`} />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Pay securely using Credit Cards, UPI, Netbanking, or Wallet test sandbox.
                </p>
              </div>

              {/* COD Option */}
              <div 
                onClick={() => setPaymentMethod('cod')}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                  paymentMethod === 'cod'
                    ? 'border-brand-600 bg-brand-50/30 dark:bg-brand-950/30 shadow-md'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <Truck className="w-5 h-5 text-amber-500" /> Cash on Delivery
                  </span>
                  <div className={`w-4 h-4 rounded-full border-2 ${paymentMethod === 'cod' ? 'border-brand-600 bg-brand-600' : 'border-slate-300'}`} />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Pay with cash directly to courier agent upon order doorstep delivery.
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* Right Column: Order Summary Sidebar */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-lg space-y-4">
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
              Order Summary ({cartItems.length} items)
            </h3>

            {/* Cart Items list preview */}
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
              {cartItems.map(({ product, quantity }) => (
                <div key={product.id} className="flex items-center gap-3">
                  <img src={product.images[0]} alt={product.name} className="w-12 h-12 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">{product.name}</h5>
                    <span className="text-[11px] text-slate-400">Qty: {quantity}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {formatCurrency(product.price * quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Cost breakdown */}
            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {shipping === 0 ? 'FREE' : formatCurrency(shipping)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Est. Tax (8%)</span>
                <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>Grand Total</span>
                <span className="text-brand-600 dark:text-brand-400">{formatCurrency(total)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isProcessing ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Pay & Complete Order ({formatCurrency(total)}) <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </div>
        </div>

      </form>

    </div>
  );
};

export default Checkout;
