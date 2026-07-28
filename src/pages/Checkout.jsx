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
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  User,
  Smartphone,
  Wallet,
  Landmark,
  Banknote,
  Sparkles,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);
  const cartItems = useSelector((state) => state.cart.items);
  const subtotal = useSelector(selectCartSubtotal);
  const shipping = useSelector(selectCartShipping);
  const tax = useSelector(selectCartTax);
  const total = useSelector(selectCartTotal);

  // Payment Method Selection
  const [paymentMethod, setPaymentMethod] = useState('card');

  // Simulated Payment Form Inputs
  const [cardDetails, setCardDetails] = useState({
    number: '4532 8921 7741 9024',
    name: user?.displayName || 'Alex Johnson',
    expiry: '12/28',
    cvv: '892'
  });

  const [upiId, setUpiId] = useState('alex@okaxis');
  const [selectedWallet, setSelectedWallet] = useState('gpay');
  const [selectedBank, setSelectedBank] = useState('hdfc');
  const [formErrors, setFormErrors] = useState({});

  // Simulation Modal State
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState(0); // 0: Validating, 1: Connecting, 2: Processing, 3: Success

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      fullName: user?.displayName || '',
      email: user?.email || '',
      phone: '+1 (555) 234-5678',
      address: '742 Evergreen Terrace',
      city: 'Springfield',
      state: 'OR',
      postalCode: '97477',
      country: 'United States'
    }
  });

  if (cartItems.length === 0) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Your Cart is Empty</h2>
        <p className="text-sm text-slate-500">Add items to your cart before proceeding to checkout.</p>
        <button
          onClick={() => navigate('/products')}
          className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-colors"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  // Validate Simulated Payment Inputs
  const validatePaymentInputs = () => {
    const errs = {};
    if (paymentMethod === 'card') {
      if (!cardDetails.number || cardDetails.number.replace(/\s/g, '').length < 16) {
        errs.cardNumber = 'Valid 16-digit card number required';
      }
      if (!cardDetails.name.trim()) {
        errs.cardName = 'Cardholder name is required';
      }
      if (!cardDetails.expiry || !/^\d{2}\/\d{2}$/.test(cardDetails.expiry)) {
        errs.cardExpiry = 'Expiry required (MM/YY)';
      }
      if (!cardDetails.cvv || cardDetails.cvv.length < 3) {
        errs.cardCvv = 'Valid 3-digit CVV required';
      }
    } else if (paymentMethod === 'upi') {
      if (!upiId || !upiId.includes('@')) {
        errs.upiId = 'Valid UPI ID required (e.g. name@upi or phone@paytm)';
      }
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Generate Structured Order & Transaction IDs
  const generateIDs = () => {
    const today = new Date();
    const dateStr = today.getFullYear().toString() + 
      (today.getMonth() + 1).toString().padStart(2, '0') + 
      today.getDate().toString().padStart(2, '0');
    const randomSeq = Math.floor(100 + Math.random() * 900);
    
    return {
      orderNumber: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      transactionNumber: `TXN-${dateStr}${randomSeq}`
    };
  };

  // Helper method description for Firestore record
  const getPaymentMethodLabel = () => {
    switch (paymentMethod) {
      case 'card':
        return `Credit Card (Visa ending in ${cardDetails.number.slice(-4) || '8921'})`;
      case 'upi':
        return `UPI (${upiId || 'user@upi'})`;
      case 'wallet':
        const walletNames = { gpay: 'Google Pay', phonepe: 'PhonePe', paytm: 'Paytm', amazon: 'Amazon Pay' };
        return `Wallet (${walletNames[selectedWallet] || 'Google Pay'})`;
      case 'netbanking':
        const bankNames = { hdfc: 'HDFC Bank', icici: 'ICICI Bank', sbi: 'State Bank of India', axis: 'Axis Bank', kotak: 'Kotak Bank' };
        return `Net Banking (${bankNames[selectedBank] || 'HDFC Bank'})`;
      case 'cod':
        return 'Cash on Delivery (COD)';
      default:
        return 'Simulated Online Payment';
    }
  };

  // Execute Simulated Payment & Save Order to Firestore
  const onSubmitForm = async (shippingAddress) => {
    if (!validatePaymentInputs()) return;

    setIsProcessing(true);
    setProcessingStage(0);

    // Stage 1: Validating
    await new Promise(res => setTimeout(res, 600));
    setProcessingStage(1);

    // Stage 2: Connecting
    await new Promise(res => setTimeout(res, 700));
    setProcessingStage(2);

    // Stage 3: Processing Transaction
    await new Promise(res => setTimeout(res, 800));
    setProcessingStage(3);

    // Stage 4: Confirmed Success
    await new Promise(res => setTimeout(res, 600));

    const { orderNumber, transactionNumber } = generateIDs();

    const orderPayload = {
      id: orderNumber,
      orderNumber,
      transactionNumber,
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
      paymentMethod: getPaymentMethodLabel(),
      paymentStatus: 'Success',
      paymentTimestamp: new Date().toISOString(),
      subtotal,
      shippingFee: shipping,
      tax,
      totalAmount: total,
      status: 'Placed',
      createdAt: new Date().toISOString()
    };

    try {
      const resultAction = await dispatch(createOrderThunk(orderPayload));

      if (!resultAction.error) {
        dispatch(clearCart());
        dispatch(showToast({ message: 'Payment Successful! Order Confirmed 🎉', type: 'success' }));
        navigate('/order-success', { state: { order: resultAction.payload || orderPayload } });
      } else {
        dispatch(showToast({ message: 'Order creation failed.', type: 'error' }));
        setIsProcessing(false);
      }
    } catch (err) {
      console.error('Order creation error:', err);
      dispatch(showToast({ message: 'Error processing order.', type: 'error' }));
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-brand-500" />
          Secure Checkout
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Complete your order with our instant local payment simulation
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmitForm)} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column — Shipping & Payment Methods */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* 1. Shipping Address Section */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="w-9 h-9 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Shipping Address</h3>
                <p className="text-xs text-slate-500">Where should we deliver your order?</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    {...register('fullName')}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                {errors.fullName && <p className="text-xs text-rose-500 mt-1">{errors.fullName.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    {...register('email')}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    {...register('phone')}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                {errors.phone && <p className="text-xs text-rose-500 mt-1">{errors.phone.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">Country</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    {...register('country')}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                {errors.country && <p className="text-xs text-rose-500 mt-1">{errors.country.message}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">Street Address</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    {...register('address')}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                {errors.address && <p className="text-xs text-rose-500 mt-1">{errors.address.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">City</label>
                <input
                  type="text"
                  {...register('city')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                {errors.city && <p className="text-xs text-rose-500 mt-1">{errors.city.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">State</label>
                  <input
                    type="text"
                    {...register('state')}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  {errors.state && <p className="text-xs text-rose-500 mt-1">{errors.state.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">ZIP Code</label>
                  <input
                    type="text"
                    {...register('postalCode')}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  {errors.postalCode && <p className="text-xs text-rose-500 mt-1">{errors.postalCode.message}</p>}
                </div>
              </div>

            </div>
          </div>

          {/* 2. Payment Method Selector Section */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="w-9 h-9 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Payment Method</h3>
                <p className="text-xs text-slate-500">Choose your preferred local payment simulation</p>
              </div>
            </div>

            {/* Payment Method Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { id: 'card', label: 'Card', icon: CreditCard },
                { id: 'upi', label: 'UPI', icon: Smartphone },
                { id: 'wallet', label: 'Wallet', icon: Wallet },
                { id: 'netbanking', label: 'NetBanking', icon: Landmark },
                { id: 'cod', label: 'Cash on Delivery', icon: Banknote },
              ].map((method) => {
                const Icon = method.icon;
                const active = paymentMethod === method.id;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id)}
                    className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 ${
                      active
                        ? 'border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-400 font-extrabold shadow-md'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs">{method.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Dynamic Payment Method Input Form */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800">
              
              {/* Option A: Credit / Debit Card */}
              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-brand-500" /> Credit or Debit Card
                    </h4>
                    <span className="text-xs text-emerald-500 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                      ✓ Instant Simulation
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                      placeholder="4532 8921 7741 9024"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                    {formErrors.cardNumber && <p className="text-xs text-rose-500 mt-1">{formErrors.cardNumber}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Cardholder Name</label>
                      <input
                        type="text"
                        value={cardDetails.name}
                        onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                        placeholder="Alex Johnson"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                      {formErrors.cardName && <p className="text-xs text-rose-500 mt-1">{formErrors.cardName}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Expiry</label>
                        <input
                          type="text"
                          value={cardDetails.expiry}
                          onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                          placeholder="12/28"
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                        {formErrors.cardExpiry && <p className="text-xs text-rose-500 mt-1">{formErrors.cardExpiry}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">CVV</label>
                        <input
                          type="password"
                          maxLength={4}
                          value={cardDetails.cvv}
                          onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                          placeholder="892"
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                        {formErrors.cardCvv && <p className="text-xs text-rose-500 mt-1">{formErrors.cardCvv}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Option B: UPI */}
              {paymentMethod === 'upi' && (
                <div className="space-y-4">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-brand-500" /> UPI Instant Payment
                  </h4>
                  <p className="text-xs text-slate-500">Pay directly using any Virtual Private Address (VPA).</p>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">UPI ID / VPA</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="alex@okaxis or 9876543210@paytm"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                    {formErrors.upiId && <p className="text-xs text-rose-500 mt-1">{formErrors.upiId}</p>}
                  </div>
                </div>
              )}

              {/* Option C: Wallet */}
              {paymentMethod === 'wallet' && (
                <div className="space-y-4">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-brand-500" /> Select Digital Wallet
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'gpay', name: 'Google Pay' },
                      { id: 'phonepe', name: 'PhonePe' },
                      { id: 'paytm', name: 'Paytm' },
                      { id: 'amazon', name: 'Amazon Pay' },
                    ].map((w) => (
                      <button
                        key={w.id}
                        type="button"
                        onClick={() => setSelectedWallet(w.id)}
                        className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                          selectedWallet === w.id
                            ? 'border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-400 shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {w.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Option D: Net Banking */}
              {paymentMethod === 'netbanking' && (
                <div className="space-y-4">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <Landmark className="w-4 h-4 text-brand-500" /> Select Net Banking Bank
                  </h4>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="hdfc">HDFC Bank</option>
                    <option value="icici">ICICI Bank</option>
                    <option value="sbi">State Bank of India (SBI)</option>
                    <option value="axis">Axis Bank</option>
                    <option value="kotak">Kotak Mahindra Bank</option>
                  </select>
                </div>
              )}

              {/* Option E: Cash on Delivery */}
              {paymentMethod === 'cod' && (
                <div className="space-y-2">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <Banknote className="w-4 h-4 text-emerald-500" /> Cash on Delivery (COD)
                  </h4>
                  <p className="text-xs text-slate-500">
                    Pay with cash when your package is delivered to your address. No advance payment required.
                  </p>
                </div>
              )}

            </div>

          </div>

        </div>

        {/* Right Column — Order Summary & Submit Button */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6 sticky top-24">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4">
              Order Summary
            </h3>

            {/* Cart Items Thumbnail List */}
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-800"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-xs text-slate-900 dark:text-white truncate">{item.product.name}</h5>
                    <p className="text-[11px] text-slate-400">Qty: {item.quantity} × {formatCurrency(item.product.price)}</p>
                  </div>
                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                    {formatCurrency(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4 text-xs font-semibold">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span className="text-emerald-500 font-bold">FREE</span> : formatCurrency(shipping)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Tax (8%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-slate-900 dark:text-white border-t border-slate-100 dark:border-slate-800 pt-3">
                <span>Total Due</span>
                <span className="text-brand-600 dark:text-brand-400">{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 px-6 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              Pay {formatCurrency(total)} Now
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] font-bold text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              100% Simulated Offline Checkout — 0 Network Delay
            </div>
          </div>
        </div>

      </form>

      {/* Interactive Local Payment Processing Modal */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-200/80 dark:border-slate-800 text-center space-y-6"
            >
              {processingStage < 3 ? (
                <div className="space-y-4">
                  <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-4 border-brand-500/20 animate-ping" />
                    <div className="w-16 h-16 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center shadow-inner">
                      <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                  </div>

                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                    Processing Payment…
                  </h3>

                  <div className="space-y-2 text-xs font-semibold">
                    <p className={`transition-all ${processingStage >= 0 ? 'text-brand-600 dark:text-brand-400 font-bold' : 'text-slate-400'}`}>
                      ✓ Validating payment information…
                    </p>
                    <p className={`transition-all ${processingStage >= 1 ? 'text-brand-600 dark:text-brand-400 font-bold' : 'text-slate-400'}`}>
                      {processingStage >= 1 ? '✓ Connecting to payment gateway…' : '• Connecting to payment gateway…'}
                    </p>
                    <p className={`transition-all ${processingStage >= 2 ? 'text-brand-600 dark:text-brand-400 font-bold' : 'text-slate-400'}`}>
                      {processingStage >= 2 ? '✓ Processing transaction with bank…' : '• Processing transaction with bank…'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                    className="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto shadow-glow"
                  >
                    <CheckCircle2 className="w-12 h-12" />
                  </motion.div>

                  <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                    Payment Confirmed!
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Generating order receipt & saving to database…
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Checkout;
