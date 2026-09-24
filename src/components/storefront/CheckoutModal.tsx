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
    paymentMethod: 'card', // card, apple_pay, klarna
    cardNumber: '4242 •••• •••• 4242',
    cardExpiry: '10/28',
    cardCvc: '889',
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
      formData.paymentMethod === 'apple_pay'
        ? 'Apple Pay'
        : formData.paymentMethod === 'klarna'
        ? 'Klarna (4x interest-free)'
        : 'Credit Card (•••• 4242)';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md"
        onClick={() => {
          if (step !== 4) setIsCheckoutOpen(false);
        }}
      />

      {/* Main Checkout Modal */}
      <div className="relative w-full max-w-3xl bg-neutral-950 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden z-10 my-auto text-white">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/60">
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
              className="p-2 text-neutral-400 hover:text-white rounded-md hover:bg-neutral-800 transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Step Progress Tracker */}
        {step !== 4 && (
          <div className="px-6 py-3 bg-neutral-900/30 border-b border-neutral-800/80">
            <div className="flex items-center justify-between max-w-md mx-auto text-xs font-mono">
              <div className={`flex items-center gap-2 ${step >= 1 ? 'text-cyan-400 font-bold' : 'text-neutral-500'}`}>
                <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">
                  1
                </span>
                <span>Shipping</span>
              </div>
              <div className="w-8 h-[1px] bg-neutral-800" />
              <div className={`flex items-center gap-2 ${step >= 2 ? 'text-cyan-400 font-bold' : 'text-neutral-500'}`}>
                <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">
                  2
                </span>
                <span>Payment</span>
              </div>
              <div className="w-8 h-[1px] bg-neutral-800" />
              <div className={`flex items-center gap-2 ${step >= 3 ? 'text-cyan-400 font-bold' : 'text-neutral-500'}`}>
                <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">
                  3
                </span>
                <span>Review</span>
              </div>
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="p-4 sm:p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
          
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
                  <label className="text-neutral-400 uppercase">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-2.5 bg-neutral-900 border border-neutral-800 rounded text-white focus:outline-none focus:border-cyan-400"
                    placeholder="Marcus Vance"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-400 uppercase">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-2.5 bg-neutral-900 border border-neutral-800 rounded text-white focus:outline-none focus:border-cyan-400"
                    placeholder="marcus@domain.com"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-400 uppercase">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-2.5 bg-neutral-900 border border-neutral-800 rounded text-white focus:outline-none focus:border-cyan-400"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-neutral-400 uppercase">Street Address *</label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    className="w-full p-2.5 bg-neutral-900 border border-neutral-800 rounded text-white focus:outline-none focus:border-cyan-400"
                    placeholder="424 Broadway, Apt 4B"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-400 uppercase">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full p-2.5 bg-neutral-900 border border-neutral-800 rounded text-white focus:outline-none focus:border-cyan-400"
                    placeholder="New York"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-neutral-400 uppercase">State/Province</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full p-2.5 bg-neutral-900 border border-neutral-800 rounded text-white focus:outline-none focus:border-cyan-400"
                      placeholder="NY"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-neutral-400 uppercase">Postal Code *</label>
                    <input
                      type="text"
                      name="zip"
                      value={formData.zip}
                      onChange={handleInputChange}
                      className="w-full p-2.5 bg-neutral-900 border border-neutral-800 rounded text-white focus:outline-none focus:border-cyan-400"
                      placeholder="10013"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-neutral-400 uppercase">Country</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full p-2.5 bg-neutral-900 border border-neutral-800 rounded text-white focus:outline-none focus:border-cyan-400"
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
                  Select payment gateway or enter card details
                </p>
              </div>

              {/* Payment Method Tabs */}
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
                  className={`p-3 rounded-lg border text-center font-mono text-xs transition-all ${
                    formData.paymentMethod === 'card'
                      ? 'border-cyan-400 bg-cyan-950/30 text-white font-bold'
                      : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <CreditCard size={18} className="mx-auto mb-1 text-cyan-400" />
                  Credit / Debit
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'apple_pay' })}
                  className={`p-3 rounded-lg border text-center font-mono text-xs transition-all ${
                    formData.paymentMethod === 'apple_pay'
                      ? 'border-cyan-400 bg-cyan-950/30 text-white font-bold'
                      : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <span className="text-base block mb-1"></span>
                  Apple Pay
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'klarna' })}
                  className={`p-3 rounded-lg border text-center font-mono text-xs transition-all ${
                    formData.paymentMethod === 'klarna'
                      ? 'border-cyan-400 bg-cyan-950/30 text-white font-bold'
                      : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <span className="font-display font-black text-pink-400 block mb-1">K.</span>
                  Klarna (4x)
                </button>
              </div>

              {/* Mock Credit Card Form */}
              {formData.paymentMethod === 'card' && (
                <div className="p-4 bg-neutral-900/60 border border-neutral-800 rounded-lg space-y-4 text-xs font-mono">
                  <div className="space-y-1">
                    <label className="text-neutral-400 uppercase">Card Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded text-white font-mono focus:outline-none focus:border-cyan-400"
                        placeholder="•••• •••• •••• 4242"
                      />
                      <CreditCard size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-neutral-400 uppercase">Expiration</label>
                      <input
                        type="text"
                        name="cardExpiry"
                        value={formData.cardExpiry}
                        onChange={handleInputChange}
                        className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded text-white font-mono focus:outline-none focus:border-cyan-400"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-neutral-400 uppercase">CVC / CVV</label>
                      <input
                        type="text"
                        name="cardCvc"
                        value={formData.cardCvc}
                        onChange={handleInputChange}
                        className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded text-white font-mono focus:outline-none focus:border-cyan-400"
                        placeholder="889"
                      />
                    </div>
                  </div>
                </div>
              )}

              {formData.paymentMethod === 'apple_pay' && (
                <div className="p-6 bg-neutral-900/60 border border-neutral-800 rounded-lg text-center space-y-2">
                  <p className="text-sm font-bold text-white">Apple Pay Instant Checkout</p>
                  <p className="text-xs font-mono text-neutral-400">
                    Touch ID / Face ID authorized for {formatINR(effectiveCartTotal)}
                  </p>
                </div>
              )}

              {formData.paymentMethod === 'klarna' && (
                <div className="p-4 bg-pink-950/20 border border-pink-900/40 rounded-lg text-xs font-mono space-y-2 text-pink-200">
                  <p className="font-bold text-white">4 Interest-free installments of {formatINR(effectiveCartTotal / 4)}</p>
                  <p className="text-neutral-400">First payment due today, remaining every 2 weeks automatically.</p>
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
                  <p className="text-white font-bold uppercase">{formData.paymentMethod}</p>
                  <p className="text-neutral-400">Billed: {formatINR(effectiveCartTotal)}</p>
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
                  <span>AUTHORIZE & PLACE ORDER ({formatINR(effectiveCartTotal)})</span>
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
