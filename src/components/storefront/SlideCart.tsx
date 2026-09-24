import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Tag,
  Truck,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatINR } from '../../utils/currency';

export const SlideCart: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
    cartDiscountAmount,
    cartShipping,
    cartTax,
    cartTotal,
    promoCode,
    promoDiscount,
    promoError,
    applyPromoCode,
    removePromoCode,
    setIsCheckoutOpen,
    clearCart,
    deliverySettings,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');

  if (!isCartOpen) return null;

  const isGlobalFreeDelivery = deliverySettings.isFreeDelivery;
  const isThresholdEnabled = deliverySettings.enableFreeDeliveryThreshold;
  const freeShippingThreshold = deliverySettings.freeDeliveryThreshold || 4999;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const progressPercent = isGlobalFreeDelivery
    ? 100
    : isThresholdEnabled
    ? Math.min(100, (cartSubtotal / freeShippingThreshold) * 100)
    : 100;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyPromoCode(couponInput);
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-2 sm:pl-10">
        <div className="w-screen max-w-md bg-neutral-950 border-l border-neutral-800 text-white flex flex-col shadow-2xl">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag size={18} className="text-cyan-400" />
              <h2 className="font-display font-black text-base uppercase tracking-wider text-white">
                YOUR BAG ({cart.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-md transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-neutral-900/90 px-4 py-3 border-b border-neutral-800">
            <div className="flex items-center justify-between text-xs font-mono mb-1.5">
              {isGlobalFreeDelivery ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <Truck size={13} /> 100% Free Express Delivery Active!
                </span>
              ) : isThresholdEnabled ? (
                remainingForFreeShipping > 0 ? (
                  <span className="text-neutral-300">
                    Add <strong className="text-cyan-400">{formatINR(remainingForFreeShipping)}</strong> for Free Delivery
                  </span>
                ) : (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <Truck size={13} /> Free Express Delivery Unlocked!
                  </span>
                )
              ) : (
                <span className="text-neutral-300 flex items-center gap-1.5">
                  <Truck size={13} className="text-cyan-400" /> Standard Delivery: <strong className="text-cyan-400">{formatINR(deliverySettings.deliveryFee)}</strong>
                </span>
              )}
              <span className="text-[10px] text-neutral-400">
                {isGlobalFreeDelivery ? 'FREE' : isThresholdEnabled ? `${Math.round(progressPercent)}%` : formatINR(deliverySettings.deliveryFee)}
              </span>
            </div>
            {isThresholdEnabled && !isGlobalFreeDelivery && (
              <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-400 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            )}
            {isGlobalFreeDelivery && (
              <div className="w-full bg-emerald-950/60 h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 w-full" />
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-500">
                  <ShoppingBag size={28} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-base text-white">Your bag is empty</h3>
                  <p className="text-xs text-neutral-400 font-mono">Explore our collection and add architectural streetwear pieces.</p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 bg-white hover:bg-cyan-400 text-black font-mono text-xs font-bold uppercase rounded transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3.5 p-3 rounded-lg bg-neutral-900/50 border border-neutral-800/80 group"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-24 object-cover rounded bg-neutral-900 shrink-0"
                    referrerPolicy="no-referrer"
                  />

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-display font-bold text-xs sm:text-sm text-white line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-neutral-500 hover:text-rose-400 p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-[11px] font-mono text-neutral-400">
                        <span>SIZE: <strong className="text-white">{item.selectedSize}</strong></span>
                        <span>•</span>
                        <span>{item.selectedColor}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-neutral-800 rounded bg-neutral-950">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="px-2 py-0.5 text-neutral-400 hover:text-white"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="px-2 text-xs font-mono font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="px-2 py-0.5 text-neutral-400 hover:text-white"
                        >
                          <Plus size={11} />
                        </button>
                      </div>

                      <div className="text-right font-mono font-bold text-xs text-white">
                        {formatINR(item.product.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with Summary & Checkout */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-neutral-800 bg-neutral-950 space-y-4">
              {/* Promo Code Box */}
              <div className="space-y-1">
                {promoCode ? (
                  <div className="flex items-center justify-between p-2 rounded bg-cyan-950/40 border border-cyan-800 text-xs font-mono text-cyan-400">
                    <span className="flex items-center gap-1.5">
                      <Tag size={13} />
                      Code: <strong>{promoCode}</strong> ({(promoDiscount * 100)}% Off)
                    </span>
                    <button
                      onClick={removePromoCode}
                      className="text-neutral-400 hover:text-white text-[11px] underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo Code (e.g. GRID10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 uppercase"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-xs font-mono font-bold rounded text-white transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {promoError && (
                  <p className="text-[10px] font-mono text-rose-400">{promoError}</p>
                )}
              </div>

              {/* Tally Subtotal Breakdown */}
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-neutral-400">
                  <span>Subtotal</span>
                  <span className="text-white">{formatINR(cartSubtotal)}</span>
                </div>

                {cartDiscountAmount > 0 && (
                  <div className="flex justify-between text-cyan-400">
                    <span>Discount</span>
                    <span>-{formatINR(cartDiscountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-neutral-400">
                  <span>Shipping</span>
                  <span>{cartShipping === 0 ? 'FREE' : formatINR(cartShipping)}</span>
                </div>

                <div className="flex justify-between text-neutral-400">
                  <span>Estimated GST (12%)</span>
                  <span>{formatINR(cartTax)}</span>
                </div>

                <div className="pt-2 border-t border-neutral-800 flex justify-between text-sm font-bold">
                  <span className="text-white font-display">TOTAL</span>
                  <span className="text-cyan-400 font-mono text-base">{formatINR(cartTotal)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                id="cart-proceed-checkout-btn"
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 bg-white hover:bg-cyan-400 text-black font-display font-black text-xs uppercase tracking-wider rounded transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight size={15} />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-neutral-500">
                <ShieldCheck size={12} className="text-cyan-400" />
                <span>256-Bit Encrypted Secure Checkout</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
