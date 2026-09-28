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
  Building2,
  Copy,
  Phone,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStore } from '../../context/StoreContext';
import { Order } from '../../types';
import { formatINR } from '../../utils/currency';
import { IndianBankSelector } from './IndianBankSelector';
import { IndianBank } from '../../data/indianBanks';
import {
  getBillPaymentInfo,
  MERCHANT_PAYMENT_PHONE,
  MERCHANT_PAYMENT_PHONE_FORMATTED,
  generateUpiUri,
  generateGPayIntentUri,
  generatePhonePeIntentUri,
  getUpiQrCodeUrl,
} from '../../utils/paymentUtils';

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
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [showGPayQr, setShowGPayQr] = useState(false);
  const [showPhonePeQr, setShowPhonePeQr] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'India',
    paymentMethod: 'cod', // 'cod' (Cash on delivery), 'gpay' (Google Pay), or 'phonepe' (PhonePe)
    paymentSubOption: 'phone_transfer' as 'phone_transfer' | 'collect_upi',
    upiTransactionUtr: '',
    gpayUpiId: '',
    phonepeUpiId: '',
    selectedBankId: 'corporation-bank',
    selectedBankName: 'Corporation Bank',
  });

  const handleCopyPhone = () => {
    try {
      navigator.clipboard.writeText(MERCHANT_PAYMENT_PHONE);
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2500);
    } catch {
      // fallback
    }
  };

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

  const handleBankSelect = (bank: IndianBank) => {
    setFormData((prev) => {
      const cleanPrefix = prev.phone ? prev.phone.replace(/[^0-9]/g, '').slice(-10) : '';
      let nextGpayUpi = prev.gpayUpiId;
      let nextPhonepeUpi = prev.phonepeUpiId;

      const userPart = prev.gpayUpiId.includes('@')
        ? prev.gpayUpiId.split('@')[0]
        : (prev.gpayUpiId || cleanPrefix);

      if (bank.gpaySuffix && userPart) {
        nextGpayUpi = `${userPart}${bank.gpaySuffix}`;
      }
      if (bank.phonepeSuffix && userPart) {
        nextPhonepeUpi = `${userPart}${bank.phonepeSuffix}`;
      }

      return {
        ...prev,
        selectedBankId: bank.id,
        selectedBankName: bank.name,
        gpayUpiId: nextGpayUpi,
        phonepeUpiId: nextPhonepeUpi,
      };
    });
  };

  const handlePlaceOrder = () => {
    let paymentLabel = 'Cash on delivery';
    if (formData.paymentMethod === 'gpay') {
      if (formData.paymentSubOption === 'phone_transfer') {
        const utr = formData.upiTransactionUtr.trim();
        paymentLabel = utr
          ? `G-Pay • Paid to Phone 9611856691 (UTR: ${utr})`
          : `G-Pay • Paid to Phone 9611856691`;
      } else {
        const vpa = formData.gpayUpiId && formData.gpayUpiId.trim() ? formData.gpayUpiId.trim() : '';
        paymentLabel = vpa ? `G-Pay • ${formData.selectedBankName} (${vpa})` : `G-Pay • ${formData.selectedBankName}`;
      }
    } else if (formData.paymentMethod === 'phonepe') {
      if (formData.paymentSubOption === 'phone_transfer') {
        const utr = formData.upiTransactionUtr.trim();
        paymentLabel = utr
          ? `P-Pay • Paid to Phone 9611856691 (UTR: ${utr})`
          : `P-Pay • Paid to Phone 9611856691`;
      } else {
        const vpa = formData.phonepeUpiId && formData.phonepeUpiId.trim() ? formData.phonepeUpiId.trim() : '';
        paymentLabel = vpa ? `P-Pay • ${formData.selectedBankName} (${vpa})` : `P-Pay • ${formData.selectedBankName}`;
      }
    }

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
                    placeholder="Enter your full name"
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
                    placeholder="name@example.com"
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
                    placeholder="10-digit mobile number"
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
                    placeholder="Flat / House No., Street, Area"
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
                    placeholder="City"
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
                      placeholder="State / Region"
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
                      placeholder="PIN Code"
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
                  Select your preferred payment option: Cash on Delivery, Google Pay, or PhonePe
                </p>
              </div>

              {/* Payment Method Selection: 3 Options (1. Cash on delivery) (2. Google Pay) (3. PhonePe) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1. Cash on Delivery */}
                <button
                  type="button"
                  id="checkout-pay-method-cod-btn"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                  className={`p-3.5 rounded-xl border text-left font-mono transition-all flex flex-col justify-between relative overflow-hidden cursor-pointer ${
                    formData.paymentMethod === 'cod'
                      ? 'border-emerald-400/80 bg-emerald-950/25 text-white shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-400/50'
                      : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <div className={`p-2 rounded-lg shrink-0 ${
                        formData.paymentMethod === 'cod'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-neutral-800 text-neutral-400'
                      }`}>
                        <Banknote size={20} />
                      </div>
                      {formData.paymentMethod === 'cod' && (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full font-bold">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <span className="font-display font-bold text-sm text-white block">
                      1. Cash on delivery
                    </span>
                    <p className="text-[11px] text-neutral-400 leading-snug mt-1">
                      Pay in cash or scan courier QR on doorstep arrival
                    </p>
                    <div className="mt-2 text-xs font-mono font-bold text-emerald-400">
                      Due: {formatINR(effectiveCartTotal)}
                    </div>
                  </div>
                  <span className="inline-block mt-3 text-[10px] uppercase tracking-wider text-emerald-400 font-semibold">
                    ✓ No advance payment
                  </span>
                </button>

                {/* 2. Google Pay (G-Pay) */}
                <button
                  type="button"
                  id="checkout-pay-method-gpay-btn"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'gpay' })}
                  className={`p-3.5 rounded-xl border text-left font-mono transition-all flex flex-col justify-between relative overflow-hidden cursor-pointer ${
                    formData.paymentMethod === 'gpay'
                      ? 'border-cyan-400/80 bg-cyan-950/25 text-white shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-400/50'
                      : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <div className={`p-2 rounded-lg shrink-0 flex items-center justify-center ${
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
                      {formData.paymentMethod === 'gpay' && (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 rounded-full font-bold">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <span className="font-display font-bold text-sm text-white flex items-center gap-1.5">
                      2. G-Pay
                      <span className="text-[9px] font-mono px-1.5 py-0.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded font-bold">
                        GPay
                      </span>
                    </span>
                    <p className="text-[11px] text-neutral-400 leading-snug mt-1">
                      Online direct pay with Indian Bank & UPI
                    </p>
                    <div className="mt-2 text-xs font-mono font-bold text-cyan-400">
                      Direct Pay: {formatINR(effectiveCartTotal)}
                    </div>
                  </div>
                  <span className="inline-block mt-3 text-[10px] uppercase tracking-wider text-cyan-400 font-semibold">
                    ⚡ Pay {formatINR(effectiveCartTotal)} Direct
                  </span>
                </button>

                {/* 3. PhonePe (P-Pay) */}
                <button
                  type="button"
                  id="checkout-pay-method-phonepe-btn"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'phonepe' })}
                  className={`p-3.5 rounded-xl border text-left font-mono transition-all flex flex-col justify-between relative overflow-hidden cursor-pointer ${
                    formData.paymentMethod === 'phonepe'
                      ? 'border-purple-400/80 bg-purple-950/25 text-white shadow-lg shadow-purple-500/10 ring-1 ring-purple-400/50'
                      : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <div className={`p-2 rounded-lg shrink-0 flex items-center justify-center ${
                        formData.paymentMethod === 'phonepe'
                          ? 'bg-purple-500/20 text-white border border-purple-500/40'
                          : 'bg-neutral-800 text-neutral-400'
                      }`}>
                        {/* PhonePe Purple Brand Icon */}
                        <div className="w-5 h-5 bg-[#5f259f] rounded-md flex items-center justify-center text-white font-bold text-xs shadow-sm">
                          पे
                        </div>
                      </div>
                      {formData.paymentMethod === 'phonepe' && (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 bg-purple-500/20 text-purple-400 border border-purple-500/40 rounded-full font-bold">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <span className="font-display font-bold text-sm text-white flex items-center gap-1.5">
                      3. P-Pay
                      <span className="text-[9px] font-mono px-1.5 py-0.5 bg-purple-900/60 text-purple-300 border border-purple-800/60 rounded font-bold">
                        PhonePe
                      </span>
                    </span>
                    <p className="text-[11px] text-neutral-400 leading-snug mt-1">
                      Online direct pay with Indian Bank & UPI
                    </p>
                    <div className="mt-2 text-xs font-mono font-bold text-purple-400">
                      Direct Pay: {formatINR(effectiveCartTotal)}
                    </div>
                  </div>
                  <span className="inline-block mt-3 text-[10px] uppercase tracking-wider text-purple-400 font-semibold">
                    ⚡ Pay {formatINR(effectiveCartTotal)} Direct
                  </span>
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
                        <span className="px-2 py-0.5 text-[10px] font-mono bg-emerald-950/60 text-emerald-400 border border-emerald-800 rounded font-bold">
                          Bill Payment: Cash on delivery
                        </span>
                      </div>
                      <p className="text-neutral-400 mt-1 leading-relaxed text-xs">
                        No online transaction required right now. You inspect the parcel and pay our courier executive when it arrives.
                      </p>
                    </div>
                  </div>

                  {/* Explicit Price Breakdown for COD */}
                  <div className="p-3.5 bg-neutral-950/90 border border-neutral-800 rounded-lg space-y-2">
                    <span className="text-[10px] uppercase text-neutral-400 block font-bold tracking-wider">
                      Price of Products & Payable Summary
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="p-2 bg-neutral-900 rounded border border-neutral-800/80">
                        <span className="text-[10px] text-neutral-500 block">Product Price</span>
                        <span className="font-bold text-white">{formatINR(cartSubtotal)}</span>
                      </div>
                      <div className="p-2 bg-neutral-900 rounded border border-neutral-800/80">
                        <span className="text-[10px] text-neutral-500 block">Delivery Fee</span>
                        <span className={effectiveShippingFee === 0 ? 'text-emerald-400 font-bold' : 'text-white font-bold'}>
                          {effectiveShippingFee === 0 ? 'FREE (₹0)' : formatINR(effectiveShippingFee)}
                        </span>
                      </div>
                      <div className="p-2 bg-neutral-900 rounded border border-neutral-800/80">
                        <span className="text-[10px] text-neutral-500 block">GST (12%)</span>
                        <span className="font-bold text-white">{formatINR(cartTax)}</span>
                      </div>
                      <div className="p-2 bg-emerald-950/40 rounded border border-emerald-800/60">
                        <span className="text-[10px] text-emerald-400 block font-bold">Total Due on Arrival</span>
                        <span className="font-bold text-emerald-300 text-sm">{formatINR(effectiveCartTotal)}</span>
                      </div>
                    </div>
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

                  <div className="p-3 bg-emerald-950/20 border border-emerald-900/40 rounded-lg text-neutral-300 text-[11px] flex items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
                      <span>
                        Bill will be issued with payment method: <strong className="text-emerald-300">Cash on delivery</strong>
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold px-2 py-0.5 bg-emerald-950 border border-emerald-800 rounded">
                      INVOICE READY
                    </span>
                  </div>
                </div>
              )}

              {/* GOOGLE PAY (G-PAY) DETAILS VIEW WITH INDIAN BANK SELECTION */}
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
                        <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                          G-Pay (Google Pay) Online Direct Pay
                          <span className="text-[10px] font-normal px-1.5 py-0.5 bg-cyan-900/40 text-cyan-300 rounded border border-cyan-800/50">
                            Instant UPI
                          </span>
                        </h4>
                        <p className="text-[11px] text-neutral-400">Direct online payment via your Google Pay UPI & Indian bank</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-neutral-400 uppercase block">Direct Pay Price</span>
                      <span className="font-bold text-cyan-400 text-base">{formatINR(effectiveCartTotal)}</span>
                    </div>
                  </div>

                  {/* Explicit What is the Price Breakdown when paying online direct via G-Pay */}
                  <div className="p-3.5 bg-neutral-950/90 border border-cyan-500/20 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase text-cyan-400 block font-bold tracking-wider">
                        Online Direct Pay Price Breakdown
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400">
                        In Bill: <strong className="text-white">G-Pay</strong>
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="p-2 bg-neutral-900 rounded border border-neutral-800/80">
                        <span className="text-[10px] text-neutral-500 block">Product Price</span>
                        <span className="font-bold text-white">{formatINR(cartSubtotal)}</span>
                      </div>
                      <div className="p-2 bg-neutral-900 rounded border border-neutral-800/80">
                        <span className="text-[10px] text-neutral-500 block">Delivery Fee</span>
                        <span className={effectiveShippingFee === 0 ? 'text-emerald-400 font-bold' : 'text-white font-bold'}>
                          {effectiveShippingFee === 0 ? 'FREE (₹0)' : formatINR(effectiveShippingFee)}
                        </span>
                      </div>
                      <div className="p-2 bg-neutral-900 rounded border border-neutral-800/80">
                        <span className="text-[10px] text-neutral-500 block">GST (12%)</span>
                        <span className="font-bold text-white">{formatINR(cartTax)}</span>
                      </div>
                      <div className="p-2 bg-cyan-950/50 rounded border border-cyan-500/40">
                        <span className="text-[10px] text-cyan-400 block font-bold">Total Direct Pay (G-Pay)</span>
                        <span className="font-bold text-cyan-300 text-sm">{formatINR(effectiveCartTotal)}</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-cyan-200/90 leading-snug pt-1">
                      ⚡ When you enter to pay online direct via G-Pay, the total price debited is <strong>{formatINR(effectiveCartTotal)}</strong>. Zero hidden fees. In your product bill, the payment method will be issued as <strong>G-Pay</strong>.
                    </p>
                  </div>

                  {/* Option Selector: Pay to Phone 9611856691 vs Bank UPI */}
                  <div className="flex rounded-lg bg-neutral-950 p-1 border border-neutral-800 gap-1">
                    <button
                      type="button"
                      id="gpay-suboption-phone-btn"
                      onClick={() => setFormData({ ...formData, paymentSubOption: 'phone_transfer' })}
                      className={`flex-1 py-2 px-3 rounded-md text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[38px] ${
                        formData.paymentSubOption === 'phone_transfer'
                          ? 'bg-cyan-500 text-black shadow-md'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <Phone size={13} />
                      <span>Option A: Pay to Phone 9611856691</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-black/25 text-black font-extrabold uppercase">
                        FAST
                      </span>
                    </button>
                    <button
                      type="button"
                      id="gpay-suboption-upi-btn"
                      onClick={() => setFormData({ ...formData, paymentSubOption: 'collect_upi' })}
                      className={`flex-1 py-2 px-3 rounded-md text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[38px] ${
                        formData.paymentSubOption === 'collect_upi'
                          ? 'bg-cyan-500 text-black shadow-md'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <Building2 size={13} />
                      <span>Option B: Linked Bank & UPI</span>
                    </button>
                  </div>

                  {/* OPTION A: DIRECT TRANSFER TO PHONE 9611856691 */}
                  {formData.paymentSubOption === 'phone_transfer' && (
                    <div className="space-y-3 pt-1">
                      {/* Merchant Phone Card */}
                      <div className="p-4 bg-cyan-950/40 border border-cyan-500/40 rounded-xl space-y-3">
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div>
                            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block font-bold">
                              MERCHANT RECIPIENT PHONE NUMBER
                            </span>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xl sm:text-2xl font-mono font-black text-white tracking-wider">
                                {MERCHANT_PAYMENT_PHONE_FORMATTED}
                              </span>
                              <span className="text-[10px] px-2 py-0.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded font-bold">
                                G-PAY READY
                              </span>
                            </div>
                            <p className="text-[11px] text-neutral-300 mt-0.5">
                              Beneficiary: <strong className="text-white">GRID Clothing</strong> • UPI: <span className="font-mono text-cyan-300">9611856691@upi</span>
                            </p>
                          </div>

                          {/* Copy Button */}
                          <button
                            type="button"
                            id="gpay-copy-phone-btn"
                            onClick={handleCopyPhone}
                            className={`px-3.5 py-2 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer min-h-[38px] ${
                              copiedPhone
                                ? 'bg-emerald-500 text-black'
                                : 'bg-white hover:bg-cyan-300 text-black shadow-md'
                            }`}
                          >
                            {copiedPhone ? <Check size={14} /> : <Copy size={14} />}
                            <span>{copiedPhone ? 'Copied 9611856691!' : 'Copy Phone Number'}</span>
                          </button>
                        </div>

                        {/* Action buttons: Open GPay App & Show QR Code */}
                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-cyan-500/20">
                          <a
                            href={generateGPayIntentUri(effectiveCartTotal)}
                            className="px-3.5 py-2 bg-cyan-400 hover:bg-cyan-300 text-black rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer min-h-[36px]"
                          >
                            <ExternalLink size={13} />
                            <span>Open Google Pay App (Pay {formatINR(effectiveCartTotal)})</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => setShowGPayQr(!showGPayQr)}
                            className="px-3 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer min-h-[36px]"
                          >
                            <QrCode size={13} className="text-cyan-400" />
                            <span>{showGPayQr ? 'Hide UPI QR Code' : 'Show UPI QR Code'}</span>
                          </button>
                        </div>

                        {/* Dynamic QR Code Display */}
                        {showGPayQr && (
                          <div className="p-4 bg-white rounded-lg border border-neutral-300 text-center space-y-2 max-w-xs mx-auto shadow-xl">
                            <p className="text-[11px] font-mono text-neutral-900 font-bold">
                              Scan with G-Pay to pay {formatINR(effectiveCartTotal)} to 9611856691
                            </p>
                            <img
                              src={getUpiQrCodeUrl(effectiveCartTotal)}
                              alt="Scan with G-Pay to pay 9611856691"
                              className="w-40 h-40 mx-auto object-contain"
                            />
                            <p className="text-[10px] font-mono text-neutral-600">
                              Direct payment to: 9611856691 (GRID Clothing)
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Step-by-step instructions */}
                      <div className="p-3 bg-neutral-950/80 border border-neutral-800 rounded-lg space-y-1.5 text-[11px] text-neutral-300 font-mono">
                        <span className="text-[10px] uppercase text-cyan-400 font-bold block">
                          How to Pay to Phone Number 9611856691 via G-Pay:
                        </span>
                        <ol className="list-decimal list-inside space-y-1 text-neutral-300">
                          <li>Open <strong className="text-white">Google Pay (G-Pay)</strong> on your phone.</li>
                          <li>Tap <strong className="text-white">&quot;Pay phone number&quot;</strong>.</li>
                          <li>Enter Phone Number: <strong className="text-cyan-300">9611856691</strong> (GRID Clothing).</li>
                          <li>Pay exact amount: <strong className="text-white">{formatINR(effectiveCartTotal)}</strong> with your UPI PIN.</li>
                        </ol>
                      </div>

                      {/* Optional 12-digit UPI UTR / Ref No Input */}
                      <div className="space-y-1.5 p-3 bg-neutral-900/60 rounded-lg border border-neutral-800">
                        <label className="text-neutral-300 uppercase text-[10px] font-mono font-bold block">
                          12-Digit UPI UTR / Ref Number (Optional - from your Google Pay receipt):
                        </label>
                        <input
                          type="text"
                          name="upiTransactionUtr"
                          value={formData.upiTransactionUtr}
                          onChange={handleInputChange}
                          maxLength={18}
                          placeholder="e.g. 428190823412"
                          className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                        />
                        <span className="text-[10px] text-neutral-400 block font-mono">
                          Entering the UTR will print the transaction reference directly on your product bill.
                        </span>
                      </div>
                    </div>
                  )}

                  {/* OPTION B: LINKED INDIAN BANK & USER UPI ID */}
                  {formData.paymentSubOption === 'collect_upi' && (
                    <div className="space-y-4 pt-1">
                      {/* Linked Indian Bank Selector Component */}
                      <IndianBankSelector
                        selectedBankId={formData.selectedBankId}
                        onSelectBank={handleBankSelect}
                        paymentApp="gpay"
                      />

                      {/* GPay UPI ID Input */}
                      <div className="space-y-2 pt-1 border-t border-neutral-800/70">
                        <label className="text-neutral-400 uppercase text-[11px] block">
                          Google Pay UPI ID (Linked to {formData.selectedBankName})
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="gpayUpiId"
                            value={formData.gpayUpiId}
                            onChange={handleInputChange}
                            className="w-full p-3 sm:p-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-white text-base sm:text-xs font-mono focus:outline-none focus:border-cyan-400 min-h-[44px]"
                            placeholder="yourname@okcorp or 9820154321@okunion"
                          />
                          <Smartphone size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                        </div>

                        {/* Quick Handle Suggestions */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[10px] text-neutral-500">Quick handles for {formData.selectedBankName}:</span>
                          {['@okcorp', '@okunion', '@okbaroda', '@oksbi', '@okhdfcbank'].map((suffix) => (
                            <button
                              key={suffix}
                              type="button"
                              onClick={() => {
                                const phoneDigits = formData.phone ? formData.phone.replace(/[^0-9]/g, '').slice(-10) : '';
                                const base = formData.gpayUpiId.includes('@')
                                  ? formData.gpayUpiId.split('@')[0]
                                  : (formData.gpayUpiId || phoneDigits);
                                setFormData({ ...formData, gpayUpiId: base ? `${base}${suffix}` : suffix });
                              }}
                              className={`px-2 py-0.5 text-[10px] rounded border transition-colors cursor-pointer ${
                                formData.gpayUpiId.endsWith(suffix)
                                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 font-bold'
                                  : 'bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 border-neutral-700 hover:border-cyan-400'
                              }`}
                            >
                              {suffix}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* QR & Security Info */}
                  <div className="p-3 bg-neutral-900/80 border border-neutral-800 rounded-lg flex items-center justify-between gap-3 text-[11px]">
                    <div className="flex items-center gap-2 text-neutral-300">
                      <QrCode size={18} className="text-cyan-400 shrink-0" />
                      <span>Official G-Pay Direct Settlement via NPCI UPI</span>
                    </div>
                    <span className="px-2 py-1 bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 rounded text-[10px] font-bold shrink-0">
                      NPCI UPI ENCRYPTED
                    </span>
                  </div>
                </div>
              )}

              {/* PHONEPE (P-PAY) DETAILS VIEW WITH INDIAN BANK SELECTION */}
              {formData.paymentMethod === 'phonepe' && (
                <div className="p-5 bg-gradient-to-b from-neutral-900/90 to-neutral-950/80 border border-purple-500/30 rounded-xl space-y-4 text-xs font-mono">
                  <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3 flex-wrap gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#5f259f] flex items-center justify-center text-white font-bold text-base shadow-sm">
                        पे
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                          P-Pay (PhonePe) Online Direct Pay
                          <span className="text-[10px] font-normal px-1.5 py-0.5 bg-purple-900/40 text-purple-300 rounded border border-purple-800/50">
                            Instant UPI
                          </span>
                        </h4>
                        <p className="text-[11px] text-neutral-400">Direct online payment via your PhonePe UPI & Indian bank</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-neutral-400 uppercase block">Direct Pay Price</span>
                      <span className="font-bold text-purple-400 text-base">{formatINR(effectiveCartTotal)}</span>
                    </div>
                  </div>

                  {/* Explicit What is the Price Breakdown when paying online direct via P-Pay */}
                  <div className="p-3.5 bg-neutral-950/90 border border-purple-500/20 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase text-purple-400 block font-bold tracking-wider">
                        Online Direct Pay Price Breakdown
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400">
                        In Bill: <strong className="text-white">P-Pay</strong>
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="p-2 bg-neutral-900 rounded border border-neutral-800/80">
                        <span className="text-[10px] text-neutral-500 block">Product Price</span>
                        <span className="font-bold text-white">{formatINR(cartSubtotal)}</span>
                      </div>
                      <div className="p-2 bg-neutral-900 rounded border border-neutral-800/80">
                        <span className="text-[10px] text-neutral-500 block">Delivery Fee</span>
                        <span className={effectiveShippingFee === 0 ? 'text-emerald-400 font-bold' : 'text-white font-bold'}>
                          {effectiveShippingFee === 0 ? 'FREE (₹0)' : formatINR(effectiveShippingFee)}
                        </span>
                      </div>
                      <div className="p-2 bg-neutral-900 rounded border border-neutral-800/80">
                        <span className="text-[10px] text-neutral-500 block">GST (12%)</span>
                        <span className="font-bold text-white">{formatINR(cartTax)}</span>
                      </div>
                      <div className="p-2 bg-purple-950/50 rounded border border-purple-500/40">
                        <span className="text-[10px] text-purple-400 block font-bold">Total Direct Pay (P-Pay)</span>
                        <span className="font-bold text-purple-300 text-sm">{formatINR(effectiveCartTotal)}</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-purple-200/90 leading-snug pt-1">
                      ⚡ When you enter to pay online direct via P-Pay, the total price debited is <strong>{formatINR(effectiveCartTotal)}</strong>. Zero hidden fees. In your product bill, the payment method will be issued as <strong>P-Pay</strong>.
                    </p>
                  </div>

                  {/* Option Selector: Pay to Phone 9611856691 vs Bank UPI */}
                  <div className="flex rounded-lg bg-neutral-950 p-1 border border-neutral-800 gap-1">
                    <button
                      type="button"
                      id="phonepe-suboption-phone-btn"
                      onClick={() => setFormData({ ...formData, paymentSubOption: 'phone_transfer' })}
                      className={`flex-1 py-2 px-3 rounded-md text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[38px] ${
                        formData.paymentSubOption === 'phone_transfer'
                          ? 'bg-purple-500 text-white shadow-md'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <Phone size={13} />
                      <span>Option A: Pay to Phone 9611856691</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-black/35 text-white font-extrabold uppercase">
                        FAST
                      </span>
                    </button>
                    <button
                      type="button"
                      id="phonepe-suboption-upi-btn"
                      onClick={() => setFormData({ ...formData, paymentSubOption: 'collect_upi' })}
                      className={`flex-1 py-2 px-3 rounded-md text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[38px] ${
                        formData.paymentSubOption === 'collect_upi'
                          ? 'bg-purple-500 text-white shadow-md'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <Building2 size={13} />
                      <span>Option B: Linked Bank & UPI</span>
                    </button>
                  </div>

                  {/* OPTION A: DIRECT TRANSFER TO PHONE 9611856691 */}
                  {formData.paymentSubOption === 'phone_transfer' && (
                    <div className="space-y-3 pt-1">
                      {/* Merchant Phone Card */}
                      <div className="p-4 bg-purple-950/40 border border-purple-500/40 rounded-xl space-y-3">
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div>
                            <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider block font-bold">
                              MERCHANT RECIPIENT PHONE NUMBER
                            </span>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xl sm:text-2xl font-mono font-black text-white tracking-wider">
                                {MERCHANT_PAYMENT_PHONE_FORMATTED}
                              </span>
                              <span className="text-[10px] px-2 py-0.5 bg-purple-900/60 text-purple-300 border border-purple-800 rounded font-bold">
                                PHONEPE READY
                              </span>
                            </div>
                            <p className="text-[11px] text-neutral-300 mt-0.5">
                              Beneficiary: <strong className="text-white">GRID Clothing</strong> • UPI: <span className="font-mono text-purple-300">9611856691@ybl</span>
                            </p>
                          </div>

                          {/* Copy Button */}
                          <button
                            type="button"
                            id="phonepe-copy-phone-btn"
                            onClick={handleCopyPhone}
                            className={`px-3.5 py-2 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer min-h-[38px] ${
                              copiedPhone
                                ? 'bg-emerald-500 text-black'
                                : 'bg-white hover:bg-purple-200 text-black shadow-md'
                            }`}
                          >
                            {copiedPhone ? <Check size={14} /> : <Copy size={14} />}
                            <span>{copiedPhone ? 'Copied 9611856691!' : 'Copy Phone Number'}</span>
                          </button>
                        </div>

                        {/* Action buttons: Open PhonePe App & Show QR Code */}
                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-purple-500/20">
                          <a
                            href={generatePhonePeIntentUri(effectiveCartTotal)}
                            className="px-3.5 py-2 bg-purple-500 hover:bg-purple-400 text-white rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer min-h-[36px]"
                          >
                            <ExternalLink size={13} />
                            <span>Open PhonePe App (Pay {formatINR(effectiveCartTotal)})</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => setShowPhonePeQr(!showPhonePeQr)}
                            className="px-3 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer min-h-[36px]"
                          >
                            <QrCode size={13} className="text-purple-400" />
                            <span>{showPhonePeQr ? 'Hide UPI QR Code' : 'Show UPI QR Code'}</span>
                          </button>
                        </div>

                        {/* Dynamic QR Code Display */}
                        {showPhonePeQr && (
                          <div className="p-4 bg-white rounded-lg border border-neutral-300 text-center space-y-2 max-w-xs mx-auto shadow-xl">
                            <p className="text-[11px] font-mono text-neutral-900 font-bold">
                              Scan with PhonePe to pay {formatINR(effectiveCartTotal)} to 9611856691
                            </p>
                            <img
                              src={getUpiQrCodeUrl(effectiveCartTotal)}
                              alt="Scan with PhonePe to pay 9611856691"
                              className="w-40 h-40 mx-auto object-contain"
                            />
                            <p className="text-[10px] font-mono text-neutral-600">
                              Direct payment to: 9611856691 (GRID Clothing)
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Step-by-step instructions */}
                      <div className="p-3 bg-neutral-950/80 border border-neutral-800 rounded-lg space-y-1.5 text-[11px] text-neutral-300 font-mono">
                        <span className="text-[10px] uppercase text-purple-400 font-bold block">
                          How to Pay to Phone Number 9611856691 via PhonePe (P-Pay):
                        </span>
                        <ol className="list-decimal list-inside space-y-1 text-neutral-300">
                          <li>Open <strong className="text-white">PhonePe (P-Pay)</strong> on your phone.</li>
                          <li>Tap <strong className="text-white">&quot;To Mobile Number&quot;</strong>.</li>
                          <li>Enter Phone Number: <strong className="text-purple-300">9611856691</strong> (GRID Clothing).</li>
                          <li>Pay exact amount: <strong className="text-white">{formatINR(effectiveCartTotal)}</strong> with your UPI PIN.</li>
                        </ol>
                      </div>

                      {/* Optional 12-digit UPI UTR / Ref No Input */}
                      <div className="space-y-1.5 p-3 bg-neutral-900/60 rounded-lg border border-neutral-800">
                        <label className="text-neutral-300 uppercase text-[10px] font-mono font-bold block">
                          12-Digit UPI UTR / Ref Number (Optional - from your PhonePe receipt):
                        </label>
                        <input
                          type="text"
                          name="upiTransactionUtr"
                          value={formData.upiTransactionUtr}
                          onChange={handleInputChange}
                          maxLength={18}
                          placeholder="e.g. 428190823412"
                          className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded text-white text-xs font-mono focus:outline-none focus:border-purple-400"
                        />
                        <span className="text-[10px] text-neutral-400 block font-mono">
                          Entering the UTR will print the transaction reference directly on your product bill.
                        </span>
                      </div>
                    </div>
                  )}

                  {/* OPTION B: LINKED INDIAN BANK & USER UPI ID */}
                  {formData.paymentSubOption === 'collect_upi' && (
                    <div className="space-y-4 pt-1">
                      {/* Linked Indian Bank Selector Component */}
                      <IndianBankSelector
                        selectedBankId={formData.selectedBankId}
                        onSelectBank={handleBankSelect}
                        paymentApp="phonepe"
                      />

                      {/* PhonePe UPI ID Input */}
                      <div className="space-y-2 pt-1 border-t border-neutral-800/70">
                        <label className="text-neutral-400 uppercase text-[11px] block">
                          PhonePe UPI ID (Linked to {formData.selectedBankName})
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="phonepeUpiId"
                            value={formData.phonepeUpiId}
                            onChange={handleInputChange}
                            className="w-full p-3 sm:p-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-white text-base sm:text-xs font-mono focus:outline-none focus:border-purple-400 min-h-[44px]"
                            placeholder="yourname@ybl or 9820154321@uboi or yourname@barodampay"
                          />
                          <Smartphone size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                        </div>

                        {/* Quick Handle Suggestions for PhonePe */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[10px] text-neutral-500">Quick handles for PhonePe:</span>
                          {['@ybl', '@uboi', '@barodampay', '@ibl', '@axl'].map((suffix) => (
                            <button
                              key={suffix}
                              type="button"
                              onClick={() => {
                                const phoneDigits = formData.phone ? formData.phone.replace(/[^0-9]/g, '').slice(-10) : '';
                                const base = formData.phonepeUpiId.includes('@')
                                  ? formData.phonepeUpiId.split('@')[0]
                                  : (formData.phonepeUpiId || phoneDigits);
                                setFormData({ ...formData, phonepeUpiId: base ? `${base}${suffix}` : suffix });
                              }}
                              className={`px-2 py-0.5 text-[10px] rounded border transition-colors cursor-pointer ${
                                formData.phonepeUpiId.endsWith(suffix)
                                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/60 font-bold'
                                  : 'bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 border-neutral-700 hover:border-purple-400'
                              }`}
                            >
                              {suffix}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* QR & Security Info */}
                  <div className="p-3 bg-neutral-900/80 border border-neutral-800 rounded-lg flex items-center justify-between gap-3 text-[11px]">
                    <div className="flex items-center gap-2 text-neutral-300">
                      <QrCode size={18} className="text-purple-400 shrink-0" />
                      <span>Official PhonePe Direct Settlement via NPCI UPI</span>
                    </div>
                    <span className="px-2 py-1 bg-purple-950/60 border border-purple-800/60 text-purple-400 rounded text-[10px] font-bold shrink-0">
                      NPCI UPI ENCRYPTED
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
                  className={`w-full sm:w-auto px-6 py-3.5 font-display font-bold text-xs uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 cursor-pointer min-h-[44px] ${
                    formData.paymentMethod === 'phonepe'
                      ? 'bg-purple-400 hover:bg-purple-300 text-black'
                      : formData.paymentMethod === 'gpay'
                      ? 'bg-cyan-400 hover:bg-cyan-300 text-black'
                      : 'bg-white hover:bg-emerald-400 text-black'
                  }`}
                >
                  <span>
                    {formData.paymentMethod === 'gpay'
                      ? `Review & Pay ${formatINR(effectiveCartTotal)} via G-Pay`
                      : formData.paymentMethod === 'phonepe'
                      ? `Review & Pay ${formatINR(effectiveCartTotal)} via P-Pay`
                      : `Continue with Cash on delivery (${formatINR(effectiveCartTotal)})`}
                  </span>
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
                  <span className="text-neutral-500 uppercase text-[10px]">Payment Method:</span>
                  <p className="text-white font-bold uppercase flex items-center gap-1.5 mt-0.5">
                    {formData.paymentMethod === 'gpay'
                      ? formData.paymentSubOption === 'phone_transfer'
                        ? '2. G-Pay (Direct Pay to Phone 9611856691)'
                        : `2. G-Pay (${formData.selectedBankName})`
                      : formData.paymentMethod === 'phonepe'
                      ? formData.paymentSubOption === 'phone_transfer'
                        ? '3. P-Pay (Direct Pay to Phone 9611856691)'
                        : `3. P-Pay (${formData.selectedBankName})`
                      : '1. Cash on delivery'}
                  </p>
                  <p className="text-neutral-300 text-[11px] mt-0.5">
                    {formData.paymentMethod === 'gpay'
                      ? formData.paymentSubOption === 'phone_transfer'
                        ? `Direct Online Pay: ${formatINR(effectiveCartTotal)} to Phone 9611856691 via G-Pay`
                        : `Direct Online Pay: ${formatINR(effectiveCartTotal)} via G-Pay UPI`
                      : formData.paymentMethod === 'phonepe'
                      ? formData.paymentSubOption === 'phone_transfer'
                        ? `Direct Online Pay: ${formatINR(effectiveCartTotal)} to Phone 9611856691 via P-Pay`
                        : `Direct Online Pay: ${formatINR(effectiveCartTotal)} via P-Pay UPI`
                      : `Pay ${formatINR(effectiveCartTotal)} in cash/UPI upon doorstep delivery`}
                  </p>
                  {formData.upiTransactionUtr && (
                    <p className="text-[10px] text-cyan-300 font-mono mt-0.5">
                      UTR Reference: {formData.upiTransactionUtr}
                    </p>
                  )}
                  <span className="text-[10px] text-cyan-400 font-mono block mt-1">
                    Bill of Product will show: <strong>{formData.paymentMethod === 'gpay' ? 'G-Pay' : formData.paymentMethod === 'phonepe' ? 'P-Pay' : 'Cash on delivery'}</strong>
                  </span>
                </div>
              </div>

              {/* Final Totals Table */}
              <div className="p-3 bg-neutral-900/80 rounded border border-neutral-800 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-neutral-400">
                  <span>Product Price (Subtotal)</span>
                  <span className="text-white font-bold">{formatINR(cartSubtotal)}</span>
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
                  <span className="text-white">
                    {formData.paymentMethod === 'cod' ? 'Total Due on Delivery' : 'Total Direct Pay Amount'}
                  </span>
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
                  className={`w-full sm:w-auto px-8 py-3.5 text-black font-display font-black text-xs uppercase tracking-wider rounded transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg min-h-[46px] ${
                    formData.paymentMethod === 'phonepe'
                      ? 'bg-purple-400 hover:bg-purple-300 shadow-purple-500/20'
                      : formData.paymentMethod === 'gpay'
                      ? 'bg-cyan-400 hover:bg-cyan-300 shadow-cyan-500/20'
                      : 'bg-emerald-400 hover:bg-emerald-300 shadow-emerald-500/20'
                  }`}
                >
                  <Lock size={14} />
                  <span>
                    {formData.paymentMethod === 'gpay'
                      ? `PAY VIA G-PAY DIRECT (${formatINR(effectiveCartTotal)})`
                      : formData.paymentMethod === 'phonepe'
                      ? `PAY VIA P-PAY DIRECT (${formatINR(effectiveCartTotal)})`
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
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">PAYMENT IN BILL</span>
                  <div className="text-right">
                    <span className="font-bold text-white px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700">
                      {getBillPaymentInfo(completedOrder.paymentMethod).billLabel}
                    </span>
                    <span className="text-[10px] text-neutral-400 block mt-0.5">
                      {getBillPaymentInfo(completedOrder.paymentMethod).channel}
                    </span>
                    {getBillPaymentInfo(completedOrder.paymentMethod).recipientPhone && (
                      <span className="text-[10px] text-cyan-400 font-mono font-bold block mt-0.5">
                        Paid to Phone: +91 {getBillPaymentInfo(completedOrder.paymentMethod).recipientPhone}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">PRODUCT PRICE</span>
                  <span className="font-bold text-white">{formatINR(completedOrder.subtotal)}</span>
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
                <div className="flex justify-between border-t border-neutral-800 pt-1.5">
                  <span className="text-neutral-400 font-bold">TOTAL BILLED</span>
                  <span className="font-bold text-cyan-400 text-sm">{formatINR(completedOrder.total)}</span>
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
