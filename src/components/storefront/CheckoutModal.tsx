import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Truck,
  CreditCard,
  Lock,
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
  ExternalLink,
  UserCheck,
  User,
  Check,
  Edit2,
  Tag,
  Zap,
  Printer,
  Banknote,
  Smartphone,
  QrCode,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStore } from '../../context/StoreContext';
import { Order } from '../../types';
import { formatINR } from '../../utils/currency';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    cartDiscountAmount,
    cartShipping,
    cartTax,
    cartTotal,
    createOrder,
    setActiveMode,
    setAdminTab,
    currentCustomer,
    setIsCustomerAuthOpen,
    setCustomerAuthTab,
    requestAdminAccess,
    deliverySettings,
    openPrintBill,
  } = useStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: Shipping, 2: Payment, 3: Review, 4: Confirmed Success
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Form states with default Indian shipping profile
  const [formData, setFormData] = useState({
    name: 'Arjun Mehta',
    email: 'arjun@gridclothing.ai',
    phone: '+91 98201 54321',
    street: 'B-402, Horizon Towers, Worli Sea Face',
    city: 'Mumbai',
    state: 'Maharashtra',
    zip: '400018',
    country: 'India',
    paymentMethod: 'cod', // 'cod' (Cash on delivery) or 'gpay' (Google Pay)
    gpayUpiId: 'arjun@okhdfcbank',
  });

  // Prepopulate customer details if logged in
  useEffect(() => {
    if (currentCustomer) {
      setFormData((prev) => ({
        ...prev,
        name: currentCustomer.name || prev.name,
        email: currentCustomer.email || prev.email,
        phone: currentCustomer.phone || prev.phone,
        street: currentCustomer.savedAddress?.street || prev.street,
        city: currentCustomer.savedAddress?.city || prev.city,
        state: currentCustomer.savedAddress?.state || prev.state,
        zip: currentCustomer.savedAddress?.zip || prev.zip,
        country: currentCustomer.savedAddress?.country || prev.country || 'India',
      }));
    }
  }, [currentCustomer]);

  if (!isCheckoutOpen) return null;

  const effectiveShippingFee = cartShipping;
  const effectiveCartTotal = cartTotal;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = () => {
    const paymentLabel =
      formData.paymentMethod === 'gpay'
        ? (formData.gpayUpiId && formData.gpayUpiId.trim() ? `Google Pay (${formData.gpayUpiId.trim()})` : 'Google Pay (GPay UPI)')
        : 'Cash on delivery (COD)';

    const shippingMethodLabel =
      cartShipping === 0
        ? 'Free Delivery'
        : (deliverySettings.expressCourierName || 'Standard Delivery');

    const newOrder = createOrder({
      customerName: formData.name,
      customerEmail: formData.email,
      shippingAddress: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        country: formData.country,
      },
      paymentMethod: paymentLabel,
      shippingOption: shippingMethodLabel,
      shippingFee: effectiveShippingFee,
    });

    setCompletedOrder(newOrder);
    setStep(4);

    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0055FF', '#A3E635', '#ffffff', '#22d3ee'],
      });
    } catch {
      // ignore
    }
  };

  const handleViewInAdmin = () => {
    setIsCheckoutOpen(false);
    setAdminTab('orders');
    requestAdminAccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md"
        onClick={() => {
          if (step !== 4) setIsCheckoutOpen(false);
        }}
      />

      {/* Main Checkout Modal */}
      <div className="relative w-full h-full sm:h-auto sm:max-h-[90vh] max-w-3xl bg-neutral-950 sm:border border-neutral-800 sm:rounded-xl shadow-2xl overflow-hidden z-10 my-0 sm:my-auto text-white flex flex-col">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/60 safe-area-pt">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-white text-black font-display font-black text-xs flex items-center justify-center">
              G
            </div>
            <div>
              <h2 className="font-display font-bold text-sm tracking-wider uppercase text-white">
                {step === 4 ? 'ORDER CONFIRMATION' : 'GRID // SECURE CHECKOUT'}
              </h2>
              <span className="text-[10px] font-mono text-neutral-400">
                256-BIT SSL ENCRYPTED GATEWAY
              </span>
            </div>
          </div>

          {step !== 4 && (
            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="p-2 text-neutral-400 hover:text-white rounded-md hover:bg-neutral-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
              aria-label="Close Checkout"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Step Progress Tracker */}
        {step !== 4 && (
          <div className="px-4 sm:px-6 py-3 bg-neutral-900/30 border-b border-neutral-800/80">
            <div className="flex items-center justify-between max-w-md mx-auto text-xs font-mono">
              <div className={`flex items-center gap-1.5 sm:gap-2 ${step >= 1 ? 'text-cyan-400 font-bold' : 'text-neutral-500'}`}>
                <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">
                  1
                </span>
                <span>Shipping</span>
              </div>
              <div className="w-6 sm:w-8 h-[1px] bg-neutral-800" />
              <div className={`flex items-center gap-1.5 sm:gap-2 ${step >= 2 ? 'text-cyan-400 font-bold' : 'text-neutral-500'}`}>
                <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">
                  2
                </span>
                <span>Payment</span>
              </div>
              <div className="w-6 sm:w-8 h-[1px] bg-neutral-800" />
              <div className={`flex items-center gap-1.5 sm:gap-2 ${step >= 3 ? 'text-cyan-400 font-bold' : 'text-neutral-500'}`}>
                <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">
                  3
                </span>
                <span>Review</span>
              </div>
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 p-4 sm:p-6 sm:p-8 overflow-y-auto touch-scroll safe-area-pb">
          
          {/* STEP 1: SHIPPING & CONTACT */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="border-b border-neutral-800 pb-3">
                <h3 className="font-display font-bold text-lg text-white">
                  1. Contact & Delivery Address
                </h3>
                <p className="text-xs font-mono text-neutral-400">
                  Where should we dispatch your parcel?
                </p>
              </div>

              {/* Customer Account Indicator / Sign In Helper */}
              {currentCustomer ? (
                <div className="p-3 bg-cyan-950/30 border border-cyan-500/30 rounded-lg flex items-center justify-between font-mono text-xs text-cyan-200">
                  <div className="flex items-center gap-2">
                    <UserCheck size={16} className="text-cyan-400 shrink-0" />
                    <div>
                      <span>Signed in as <strong>{currentCustomer.name}</strong></span>
                      <span className="text-[10px] text-neutral-400 block font-normal">{currentCustomer.email}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-cyan-400 font-bold bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded">
                    ADDRESS SYNCED
                  </span>
                </div>
              ) : (
                <div className="p-3 bg-neutral-900/80 border border-neutral-800 rounded-lg flex items-center justify-between font-mono text-xs text-neutral-300">
                  <div className="flex items-center gap-2">
                    <User size={15} className="text-cyan-400 shrink-0" />
                    <span>Have a GRID client account?</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomerAuthTab('signin');
                      setIsCustomerAuthOpen(true);
                    }}
                    className="text-cyan-400 hover:text-cyan-300 font-bold text-xs underline cursor-pointer"
                  >
                    Sign In / Register →
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-neutral-400 uppercase text-[11px]">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-3 sm:p-2.5 bg-neutral-900 border border-neutral-800 rounded text-white text-base sm:text-xs focus:outline-none focus:border-cyan-400 min-h-[44px]"
                    placeholder="Marcus Vance"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-400 uppercase text-[11px]">Email Address *</label>
                  <input
                    type="email"
                    inputMode="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 sm:p-2.5 bg-neutral-900 border border-neutral-800 rounded text-white text-base sm:text-xs focus:outline-none focus:border-cyan-400 min-h-[44px]"
                    placeholder="marcus@domain.com"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-400 uppercase text-[11px]">Phone Number</label>
                  <input
                    type="tel"
                    inputMode="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-3 sm:p-2.5 bg-neutral-900 border border-neutral-800 rounded text-white text-base sm:text-xs focus:outline-none focus:border-cyan-400 min-h-[44px]"
                    placeholder="+91 98201 54321"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-neutral-400 uppercase text-[11px]">Street Address *</label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    className="w-full p-3 sm:p-2.5 bg-neutral-900 border border-neutral-800 rounded text-white text-base sm:text-xs focus:outline-none focus:border-cyan-400 min-h-[44px]"
                    placeholder="B-402, Horizon Towers, Worli"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-400 uppercase text-[11px]">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full p-3 sm:p-2.5 bg-neutral-900 border border-neutral-800 rounded text-white text-base sm:text-xs focus:outline-none focus:border-cyan-400 min-h-[44px]"
                    placeholder="Mumbai"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-neutral-400 uppercase text-[11px]">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full p-3 sm:p-2.5 bg-neutral-900 border border-neutral-800 rounded text-white text-base sm:text-xs focus:outline-none focus:border-cyan-400 min-h-[44px]"
                      placeholder="Maharashtra"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-neutral-400 uppercase text-[11px]">Postal Code *</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      name="zip"
                      value={formData.zip}
                      onChange={handleInputChange}
                      className="w-full p-3 sm:p-2.5 bg-neutral-900 border border-neutral-800 rounded text-white text-base sm:text-xs focus:outline-none focus:border-cyan-400 min-h-[44px]"
                      placeholder="400018"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-neutral-400 uppercase text-[11px]">Country</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full p-3 sm:p-2.5 bg-neutral-900 border border-neutral-800 rounded text-white text-base sm:text-xs focus:outline-none focus:border-cyan-400 min-h-[44px]"
                  >
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Germany">Germany</option>
                    <option value="Japan">Japan</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="Singapore">Singapore</option>
                    <option value="France">France</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-cyan-400 text-black font-display font-bold text-xs uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: PAYMENT */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="border-b border-neutral-800 pb-3">
                <h3 className="font-display font-bold text-lg text-white">
                  2. Select Payment Method
                </h3>
                <p className="text-xs font-mono text-neutral-400">
                  Select your preferred payment option: Cash on Delivery or Google Pay
                </p>
              </div>

              {/* Payment Method Selection: 2 Types (1. Cash on delivery) (2. Google Pay) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* 1. Cash on Delivery */}
                <button
                  type="button"
                  id="checkout-pay-method-cod-btn"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                  className={`p-4 rounded-xl border text-left font-mono transition-all flex items-start gap-3.5 relative overflow-hidden cursor-pointer ${
                    formData.paymentMethod === 'cod'
                      ? 'border-emerald-400/80 bg-emerald-950/20 text-white shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-400/50'
                      : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                  }`}
                >
                  <div className={`p-2.5 rounded-lg shrink-0 ${
                    formData.paymentMethod === 'cod'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}>
                    <Banknote size={22} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-display font-bold text-sm text-white">
                        1. Cash on delivery
                      </span>
                      {formData.paymentMethod === 'cod' && (
                        <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full font-bold">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-400 leading-snug">
                      Pay in cash or scan courier UPI QR upon package arrival at your doorstep
                    </p>
                    <span className="inline-block mt-2 text-[10px] uppercase tracking-wider text-emerald-400 font-semibold">
                      ✓ No advance payment
                    </span>
                  </div>
                </button>

                {/* 2. Google Pay */}
                <button
                  type="button"
                  id="checkout-pay-method-gpay-btn"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'gpay' })}
                  className={`p-4 rounded-xl border text-left font-mono transition-all flex items-start gap-3.5 relative overflow-hidden cursor-pointer ${
                    formData.paymentMethod === 'gpay'
                      ? 'border-cyan-400/80 bg-cyan-950/20 text-white shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-400/50'
                      : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                  }`}
                >
                  <div className={`p-2.5 rounded-lg shrink-0 flex items-center justify-center ${
                    formData.paymentMethod === 'gpay'
                      ? 'bg-white/10 text-white border border-cyan-500/40'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}>
                    {/* Google G Brand Logo */}
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-display font-bold text-sm text-white flex items-center gap-1.5">
                        2. Google Pay
                        <span className="text-[10px] font-mono px-1.5 py-0.5 bg-white/10 text-white rounded font-normal">GPay</span>
                      </span>
                      {formData.paymentMethod === 'gpay' && (
                        <span className="text-[10px] font-mono px-2 py-0.5 bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 rounded-full font-bold">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-400 leading-snug">
                      Instant, fast & secured 1-tap UPI payment linked to Google Pay
                    </p>
                    <span className="inline-block mt-2 text-[10px] uppercase tracking-wider text-cyan-400 font-semibold">
                      ⚡ Instant UPI Authorization
                    </span>
                  </div>
                </button>
              </div>

              {/* CASH ON DELIVERY DETAILS VIEW */}
              {formData.paymentMethod === 'cod' && (
                <div className="p-5 bg-gradient-to-b from-neutral-900/90 to-neutral-950/80 border border-emerald-500/30 rounded-xl space-y-4 text-xs font-mono">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 shrink-0 mt-0.5">
                      <Truck size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <h4 className="font-bold text-sm text-white flex items-center gap-2">
                          Cash on Delivery (COD) Selected
                        </h4>
                        <span className="px-2 py-0.5 text-[10px] font-mono bg-emerald-950/60 text-emerald-400 border border-emerald-800 rounded">
                          Pay on Arrival
                        </span>
                      </div>
                      <p className="text-neutral-400 mt-1 leading-relaxed text-xs">
                        No online transaction required right now. You inspect the parcel and pay our courier executive when it arrives.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="p-3.5 bg-neutral-900/90 border border-neutral-800/80 rounded-lg space-y-1">
                      <span className="text-[10px] uppercase text-neutral-500 block font-bold">
                        Exact Cash Due on Delivery
                      </span>
                      <p className="text-xl font-bold text-emerald-400 font-mono">
                        {formatINR(effectiveCartTotal)}
                      </p>
                      <span className="text-[10px] text-neutral-400 block">
                        Includes all taxes and {effectiveShippingFee === 0 ? 'Free Shipping' : 'shipping fee'}
                      </span>
                    </div>

                    <div className="p-3.5 bg-neutral-900/90 border border-neutral-800/80 rounded-lg space-y-1.5">
                      <span className="text-[10px] uppercase text-neutral-500 block font-bold">
                        Accepted Payment Modes at Doorstep
                      </span>
                      <ul className="text-[11px] text-neutral-300 space-y-1 font-mono">
                        <li className="flex items-center gap-1.5">
                          <Check size={13} className="text-emerald-400 shrink-0" />
                          <span>INR Cash banknotes (exact change appreciated)</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <Check size={13} className="text-emerald-400 shrink-0" />
                          <span>Scan delivery partner QR via any UPI app</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-950/20 border border-emerald-900/40 rounded-lg text-neutral-300 text-[11px] flex items-center gap-2.5">
                    <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
                    <span>
                      Delivery updates & dispatch code will be sent to <strong className="text-white">{formData.phone}</strong>
                    </span>
                  </div>
                </div>
              )}

              {/* GOOGLE PAY DETAILS VIEW */}
              {formData.paymentMethod === 'gpay' && (
                <div className="p-5 bg-gradient-to-b from-neutral-900/90 to-neutral-950/80 border border-cyan-500/30 rounded-xl space-y-4 text-xs font-mono">
                  <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3 flex-wrap gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center p-1.5 shadow-sm">
                        <svg className="w-full h-full" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white">Google Pay Fast Checkout</h4>
                        <p className="text-[11px] text-neutral-400">Direct UPI debit linked to your Google account</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-neutral-500 uppercase block">Total Payable</span>
                      <span className="font-bold text-cyan-400 text-sm">{formatINR(effectiveCartTotal)}</span>
                    </div>
                  </div>

                  {/* GPay UPI ID Input */}
                  <div className="space-y-2">
                    <label className="text-neutral-400 uppercase text-[11px] block">
                      Google Pay UPI ID (Optional / Fast Authorization)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="gpayUpiId"
                        value={formData.gpayUpiId}
                        onChange={handleInputChange}
                        className="w-full p-3 sm:p-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-white text-base sm:text-xs font-mono focus:outline-none focus:border-cyan-400 min-h-[44px]"
                        placeholder="yourname@okhdfcbank or 9820154321@oksbi"
                      />
                      <Smartphone size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                    </div>

                    {/* Quick Handle Suggestions */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] text-neutral-500">Popular handles:</span>
                      {['@okhdfcbank', '@oksbi', '@okaxis', '@okicici'].map((suffix) => (
                        <button
                          key={suffix}
                          type="button"
                          onClick={() => {
                            const base = formData.gpayUpiId.includes('@')
                              ? formData.gpayUpiId.split('@')[0]
                              : (formData.gpayUpiId || 'arjun');
                            setFormData({ ...formData, gpayUpiId: `${base}${suffix}` });
                          }}
                          className="px-2 py-0.5 bg-neutral-800/80 hover:bg-neutral-700 text-[10px] text-cyan-400 rounded border border-neutral-700 hover:border-cyan-400 transition-colors cursor-pointer"
                        >
                          {suffix}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* QR & Security Info */}
                  <div className="p-3 bg-neutral-900/80 border border-neutral-800 rounded-lg flex items-center justify-between gap-3 text-[11px]">
                    <div className="flex items-center gap-2 text-neutral-300">
                      <QrCode size={18} className="text-cyan-400 shrink-0" />
                      <span>Google Pay UPI payment request will be initiated directly</span>
                    </div>
                    <span className="px-2 py-1 bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 rounded text-[10px] font-bold shrink-0">
                      SECURE 256-BIT
                    </span>
                  </div>
                </div>
              )}

              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 text-xs font-mono text-neutral-400 hover:text-white flex items-center justify-center gap-1.5 min-h-[42px] cursor-pointer"
                >
                  <ArrowLeft size={14} /> Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-cyan-400 text-black font-display font-bold text-xs uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
                >
                  <span>Review Order</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: REVIEW & CONFIRM */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="border-b border-neutral-800 pb-3">
                <h3 className="font-display font-bold text-lg text-white">
                  3. Order Review & Authorization
                </h3>
                <p className="text-xs font-mono text-neutral-400">
                  Verify items and finalize your streetwear acquisition
                </p>
              </div>

              {/* Items summary */}
              <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2 bg-neutral-900/40 border border-neutral-800 rounded text-xs font-mono"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-10 h-12 object-cover rounded bg-neutral-900"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <p className="font-bold text-white line-clamp-1">{item.product.name}</p>
                        <p className="text-[11px] text-neutral-400">
                          {item.selectedSize} / {item.selectedColor} • Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-white">
                      {formatINR(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Shipping and payment recap */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono bg-neutral-900/30 p-3 rounded border border-neutral-800">
                <div>
                  <span className="text-neutral-500 uppercase text-[10px]">Dispatching To:</span>
                  <p className="text-white font-bold">{formData.name}</p>
                  <p className="text-neutral-400">{formData.street}, {formData.city}, {formData.zip}</p>
                  <p className="text-cyan-400 text-[11px] mt-1 font-semibold">
                    Method: {cartShipping === 0 ? 'Free Delivery' : (deliverySettings.expressCourierName || 'Standard Delivery')}
                  </p>
                </div>
                <div>
                  <span className="text-neutral-500 uppercase text-[10px]">Payment:</span>
                  <p className="text-white font-bold uppercase">
                    {formData.paymentMethod === 'gpay' ? '2. Google Pay (UPI)' : '1. Cash on Delivery (COD)'}
                  </p>
                  <p className="text-neutral-400">
                    {formData.paymentMethod === 'gpay'
                      ? `Instant UPI debit: ${formatINR(effectiveCartTotal)}`
                      : `Pay ${formatINR(effectiveCartTotal)} in cash/UPI on arrival`}
                  </p>
                </div>
              </div>

              {/* Final Totals Table */}
              <div className="p-3 bg-neutral-900/80 rounded border border-neutral-800 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-neutral-400">
                  <span>Subtotal</span>
                  <span className="text-white">{formatINR(cartSubtotal)}</span>
                </div>
                {cartDiscountAmount > 0 && (
                  <div className="flex justify-between text-cyan-400">
                    <span>Discount Applied</span>
                    <span>-{formatINR(cartDiscountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-400">
                  <span>
                    Shipping ({cartShipping === 0 ? 'Free Delivery' : (deliverySettings.expressCourierName || 'Standard Delivery')})
                  </span>
                  <span className={effectiveShippingFee === 0 ? 'text-emerald-400 font-bold' : 'text-cyan-400 font-bold'}>
                    {effectiveShippingFee === 0 ? 'FREE' : formatINR(effectiveShippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Estimated GST (12%)</span>
                  <span>{formatINR(cartTax)}</span>
                </div>
                <div className="pt-2 border-t border-neutral-800 flex justify-between text-sm font-bold">
                  <span className="text-white">Total Amount Due</span>
                  <span className="text-cyan-400 font-mono text-base">{formatINR(effectiveCartTotal)}</span>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 text-xs font-mono text-neutral-400 hover:text-white flex items-center justify-center gap-1.5 min-h-[42px] cursor-pointer"
                >
                  <ArrowLeft size={14} /> Back
                </button>
                <button
                  id="checkout-confirm-place-order-btn"
                  type="button"
                  onClick={handlePlaceOrder}
                  className="w-full sm:w-auto px-8 py-3.5 bg-cyan-400 hover:bg-cyan-300 text-black font-display font-black text-xs uppercase tracking-wider rounded transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20 min-h-[46px]"
                >
                  <Lock size={14} />
                  <span>
                    {formData.paymentMethod === 'gpay'
                      ? `PAY VIA GOOGLE PAY (${formatINR(effectiveCartTotal)})`
                      : `CONFIRM CASH ON DELIVERY ORDER (${formatINR(effectiveCartTotal)})`}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: ORDER CONFIRMED SUCCESS */}
          {step === 4 && completedOrder && (
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 bg-cyan-500/20 text-cyan-400 border border-cyan-400/40 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 size={36} />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
                  // TRANSACTION SUCCESSFUL
                </span>
                <h3 className="font-display font-black text-2xl sm:text-3xl text-white uppercase">
                  ORDER CONFIRMED
                </h3>
                <p className="text-xs font-mono text-neutral-400">
                  A receipt and dispatch notification have been sent to{' '}
                  <span className="text-white">{completedOrder.customerEmail}</span>
                </p>
              </div>

              {/* Order Voucher Card */}
              <div className="max-w-md mx-auto p-4 bg-neutral-900 border border-neutral-800 rounded-lg text-left text-xs font-mono space-y-2">
                <div className="flex justify-between border-b border-neutral-800 pb-2">
                  <span className="text-neutral-400">ORDER NUMBER</span>
                  <span className="font-bold text-cyan-400">{completedOrder.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">PAYMENT METHOD</span>
                  <span className="font-bold text-cyan-400">{completedOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">SHIPPING METHOD</span>
                  <span className="font-bold text-white">
                    {completedOrder.shippingOption || (completedOrder.shipping === 0 ? 'Free Delivery' : 'Standard Delivery')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">SHIPPING CHARGE</span>
                  <span className={`font-bold ${completedOrder.shipping === 0 ? 'text-emerald-400' : 'text-cyan-400'}`}>
                    {completedOrder.shipping === 0 ? 'FREE' : formatINR(completedOrder.shipping)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">TOTAL BILLED</span>
                  <span className="font-bold text-white">{formatINR(completedOrder.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">STATUS</span>
                  <span className="text-amber-400 font-bold bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800">
                    {completedOrder.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">ESTIMATED DISPATCH</span>
                  <span className="text-neutral-300">Within 24 Hours</span>
                </div>
              </div>

              {/* Action Buttons: Print Bill, View in Admin, Continue */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <button
                  id="checkout-print-products-bill-btn"
                  type="button"
                  onClick={() => completedOrder && openPrintBill(completedOrder)}
                  className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-neutral-200 text-black font-mono text-xs font-bold uppercase rounded transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-white/10"
                >
                  <Printer size={15} />
                  <span>Print Products Bill</span>
                </button>
                <button
                  id="checkout-view-in-admin-btn"
                  onClick={handleViewInAdmin}
                  className="w-full sm:w-auto px-6 py-3 bg-cyan-400 hover:bg-cyan-300 text-black font-mono text-xs font-bold uppercase rounded transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ExternalLink size={14} />
                  <span>View in Admin Orders</span>
                </button>
                <button
                  onClick={() => setIsCheckoutOpen(false)}
                  className="w-full sm:w-auto px-6 py-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white font-mono text-xs uppercase rounded transition-colors cursor-pointer"
                >
                  Continue Browsing
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
