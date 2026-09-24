import React, { useState } from 'react';
import {
  RotateCcw,
  Save,
  Check,
  Shield,
  Truck,
  Database,
  Globe,
  Tag,
  Zap,
  CheckCircle2,
  AlertCircle,
  Percent,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatINR } from '../../utils/currency';

export const StoreSettings: React.FC = () => {
  const {
    resetStoreData,
    products,
    orders,
    deliverySettings,
    updateDeliverySettings,
    firestoreConnected,
    firestoreDbId,
  } = useStore();

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Store profile metadata
  const [storeMeta, setStoreMeta] = useState(() => {
    try {
      const saved = localStorage.getItem('grid_clothing_store_meta_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      storeName: 'GRID CLOTHING',
      storeTagline: 'Architectural Streetwear Atelier',
      storeUrl: 'https://gridclothing.ai',
      domainName: 'gridclothing.ai',
      supportEmail: 'support@gridclothing.ai',
      currency: 'INR (₹)',
      salesTaxRate: 12.0,
      lowStockThreshold: 15,
      dispatchHubPrimary: 'Mumbai Atelier & Logistics Hub (Worli)',
      dispatchHubSecondary: 'Bengaluru Express Center (Indiranagar)',
    };
  });

  // Local state for delivery settings form to allow atomic saving or quick preset application
  const [deliveryForm, setDeliveryForm] = useState({
    isFreeDelivery: deliverySettings.isFreeDelivery,
    deliveryFee: deliverySettings.deliveryFee,
    enableFreeDeliveryThreshold: deliverySettings.enableFreeDeliveryThreshold,
    freeDeliveryThreshold: deliverySettings.freeDeliveryThreshold,
    expressCourierName: deliverySettings.expressCourierName || 'FedEx / Bluedart Express',
  });

  const handleDeliveryPreset = (preset: {
    isFreeDelivery: boolean;
    deliveryFee: number;
    enableFreeDeliveryThreshold: boolean;
    freeDeliveryThreshold: number;
  }) => {
    const updated = {
      ...deliveryForm,
      ...preset,
    };
    setDeliveryForm(updated);
    updateDeliverySettings(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem('grid_clothing_store_meta_v1', JSON.stringify(storeMeta));
    } catch {
      // ignore
    }
    updateDeliverySettings({
      isFreeDelivery: deliveryForm.isFreeDelivery,
      deliveryFee: Number(deliveryForm.deliveryFee) || 0,
      enableFreeDeliveryThreshold: deliveryForm.enableFreeDeliveryThreshold,
      freeDeliveryThreshold: Number(deliveryForm.freeDeliveryThreshold) || 0,
      expressCourierName: deliveryForm.expressCourierName,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-5xl mx-auto text-white font-mono text-xs">
      {/* Top Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-800 gap-4">
        <div>
          <div className="text-[11px] text-cyan-400 uppercase tracking-widest">
            // PLATFORM CONFIGURATION & LOGISTICS
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white uppercase mt-1">
            STORE SETTINGS & DELIVERY FEE
          </h1>
          <p className="text-neutral-400 text-xs mt-1">
            Configure storewide delivery fees, free delivery rules, and dispatch parameters.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-950/70 border border-emerald-500/40 px-3 py-1.5 rounded animate-pulse">
            <Check size={14} />
            <span>Delivery & Store Rules Saved</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* ========================================================================= */}
        {/* MAIN FEATURE: DELIVERY FEE & FREE DELIVERY CONTROLS */}
        {/* ========================================================================= */}
        <div className="bg-neutral-900/60 border-2 border-cyan-500/40 rounded-xl p-5 sm:p-7 space-y-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
            <div className="flex items-center gap-2.5 text-white">
              <div className="w-8 h-8 rounded-lg bg-cyan-400 text-black flex items-center justify-center font-bold">
                <Truck size={18} />
              </div>
              <div>
                <h2 className="font-display font-black text-base sm:text-lg uppercase text-white tracking-wide">
                  Delivery Fee & Free Delivery Settings
                </h2>
                <p className="text-[11px] text-neutral-400">
                  Control whether customers enjoy Free Delivery or specify your custom delivery charge.
                </p>
              </div>
            </div>

            {/* Current Active Status Pill */}
            <div
              className={`px-3 py-1.5 rounded-full border text-[11px] font-bold flex items-center gap-1.5 self-start sm:self-auto ${
                deliveryForm.isFreeDelivery
                  ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                  : 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full animate-ping ${
                  deliveryForm.isFreeDelivery ? 'bg-emerald-400' : 'bg-cyan-400'
                }`}
              />
              {deliveryForm.isFreeDelivery ? (
                <span>100% FREE DELIVERY ACTIVE (₹0)</span>
              ) : (
                <span>
                  FEE: {formatINR(deliveryForm.deliveryFee)}
                  {deliveryForm.enableFreeDeliveryThreshold
                    ? ` (FREE > ${formatINR(deliveryForm.freeDeliveryThreshold)})`
                    : ' (FLAT)'}
                </span>
              )}
            </div>
          </div>

          {/* 1-Click Quick Presets */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-neutral-400 text-[11px] uppercase tracking-wider">
              <Zap size={13} className="text-amber-400" />
              <span>Quick 1-Click Delivery Presets:</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                type="button"
                onClick={() =>
                  handleDeliveryPreset({
                    isFreeDelivery: true,
                    deliveryFee: 0,
                    enableFreeDeliveryThreshold: false,
                    freeDeliveryThreshold: 0,
                  })
                }
                className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                  deliveryForm.isFreeDelivery
                    ? 'border-emerald-400 bg-emerald-950/40 text-emerald-200'
                    : 'border-neutral-800 bg-neutral-950 hover:border-neutral-700 text-neutral-300'
                }`}
              >
                <div className="font-bold text-xs flex items-center gap-1">
                  <span className="text-emerald-400">★</span> Always Free
                </div>
                <div className="text-[10px] text-neutral-400 mt-0.5">₹0 on all orders</div>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleDeliveryPreset({
                    isFreeDelivery: false,
                    deliveryFee: 99,
                    enableFreeDeliveryThreshold: true,
                    freeDeliveryThreshold: 2999,
                  })
                }
                className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                  !deliveryForm.isFreeDelivery &&
                  deliveryForm.deliveryFee === 99 &&
                  deliveryForm.freeDeliveryThreshold === 2999
                    ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200'
                    : 'border-neutral-800 bg-neutral-950 hover:border-neutral-700 text-neutral-300'
                }`}
              >
                <div className="font-bold text-xs text-white">₹99 Standard</div>
                <div className="text-[10px] text-neutral-400 mt-0.5">Free over ₹2,999</div>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleDeliveryPreset({
                    isFreeDelivery: false,
                    deliveryFee: 149,
                    enableFreeDeliveryThreshold: true,
                    freeDeliveryThreshold: 4999,
                  })
                }
                className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                  !deliveryForm.isFreeDelivery &&
                  deliveryForm.deliveryFee === 149 &&
                  deliveryForm.freeDeliveryThreshold === 4999
                    ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200'
                    : 'border-neutral-800 bg-neutral-950 hover:border-neutral-700 text-neutral-300'
                }`}
              >
                <div className="font-bold text-xs text-white">₹149 Express</div>
                <div className="text-[10px] text-neutral-400 mt-0.5">Free over ₹4,999</div>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleDeliveryPreset({
                    isFreeDelivery: false,
                    deliveryFee: 199,
                    enableFreeDeliveryThreshold: false,
                    freeDeliveryThreshold: 0,
                  })
                }
                className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                  !deliveryForm.isFreeDelivery &&
                  deliveryForm.deliveryFee === 199 &&
                  !deliveryForm.enableFreeDeliveryThreshold
                    ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200'
                    : 'border-neutral-800 bg-neutral-950 hover:border-neutral-700 text-neutral-300'
                }`}
              >
                <div className="font-bold text-xs text-white">Flat ₹199</div>
                <div className="text-[10px] text-neutral-400 mt-0.5">No free threshold</div>
              </button>
            </div>
          </div>

          {/* Primary Option Radio Cards: Free Delivery vs Custom Delivery Fee */}
          <div className="space-y-3">
            <label className="text-neutral-400 uppercase text-[10px] tracking-wider block">
              Choose Primary Delivery Policy
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Option 1: 100% Free Delivery */}
              <label
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                  deliveryForm.isFreeDelivery
                    ? 'border-emerald-400 bg-emerald-950/30 ring-2 ring-emerald-400/20'
                    : 'border-neutral-800 bg-neutral-950/80 hover:border-neutral-700 opacity-75'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="deliveryMode"
                      checked={deliveryForm.isFreeDelivery}
                      onChange={() => setDeliveryForm({ ...deliveryForm, isFreeDelivery: true })}
                      className="text-emerald-400 w-4 h-4"
                    />
                    <div>
                      <span className="font-display font-bold text-sm text-white block">
                        (1. Free Delivery)
                      </span>
                      <span className="text-[11px] text-emerald-400 font-semibold">
                        ₹0 delivery fee for every order
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded text-[10px] font-bold">
                    1. FREE DELIVERY
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Best for promotions and storewide free shipping. Every customer receives 100% free delivery with ₹0 shipping charged.
                </p>
              </label>

              {/* Option 2: Delivery Charge */}
              <label
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                  !deliveryForm.isFreeDelivery
                    ? 'border-cyan-400 bg-cyan-950/30 ring-2 ring-cyan-400/20'
                    : 'border-neutral-800 bg-neutral-950/80 hover:border-neutral-700 opacity-75'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="deliveryMode"
                      checked={!deliveryForm.isFreeDelivery}
                      onChange={() => setDeliveryForm({ ...deliveryForm, isFreeDelivery: false })}
                      className="text-cyan-400 w-4 h-4"
                    />
                    <div>
                      <span className="font-display font-bold text-sm text-white block">
                        (2. Delivery Charge)
                      </span>
                      <span className="text-[11px] text-cyan-400 font-semibold">
                        Charge delivery fee rate on orders
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded text-[10px] font-bold">
                    2. DELIVERY CHARGE
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Put your delivery charge rate below (e.g. ₹99, ₹149, ₹199). Customers can select this rate at checkout.
                </p>
              </label>
            </div>
          </div>

          {/* Delivery Fee Input & Threshold Options */}
          <div
            className={`p-5 rounded-xl border transition-all space-y-5 ${
              !deliveryForm.isFreeDelivery
                ? 'bg-neutral-950 border-cyan-500/40 ring-1 ring-cyan-500/20'
                : 'bg-neutral-950/50 border-neutral-800 opacity-80'
            }`}
          >
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <div className="flex items-center gap-2">
                <Tag size={15} className="text-cyan-400" />
                <h4 className="font-display font-bold text-xs uppercase text-white">
                  Put Delivery Charge Rate & Settings
                </h4>
              </div>
              {deliveryForm.isFreeDelivery && (
                <span className="text-[10px] text-neutral-500">
                  (Inactive while &quot;1. Free Delivery&quot; is store default)
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Delivery Fee Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-neutral-300 uppercase text-[11px] font-bold">
                    Put Delivery Charge Rate (₹ INR) *
                  </label>
                  <span className="text-[10px] text-cyan-400">Rate charged for option 2</span>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 font-bold text-sm">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    placeholder="e.g. 149"
                    value={deliveryForm.deliveryFee}
                    onChange={(e) =>
                      setDeliveryForm({
                        ...deliveryForm,
                        deliveryFee: Math.max(0, Number(e.target.value) || 0),
                      })
                    }
                    className="w-full pl-8 pr-3 py-2.5 bg-neutral-900 border border-neutral-700 rounded-lg text-white font-bold text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  />
                </div>
                <p className="text-[10px] text-neutral-400">
                  Put any delivery fee you want (e.g. 99, 149, 199, 250). If ₹0 is entered, delivery is free.
                </p>
              </div>

              {/* Courier Partner Name */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-neutral-300 uppercase text-[11px] font-bold">
                    Courier Partner Description
                  </label>
                  <span className="text-[10px] text-neutral-500">Visible at checkout</span>
                </div>
                <input
                  type="text"
                  placeholder="e.g. FedEx / Bluedart Express"
                  value={deliveryForm.expressCourierName}
                  onChange={(e) =>
                    setDeliveryForm({ ...deliveryForm, expressCourierName: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                />
                <p className="text-[10px] text-neutral-400">
                  Displayed next to the delivery speed in customer checkout.
                </p>
              </div>
            </div>

            {/* Threshold Checkbox & Input */}
            <div className="pt-2 border-t border-neutral-800 space-y-4">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={deliveryForm.enableFreeDeliveryThreshold}
                  onChange={(e) =>
                    setDeliveryForm({
                      ...deliveryForm,
                      enableFreeDeliveryThreshold: e.target.checked,
                    })
                  }
                  className="mt-0.5 text-cyan-400 rounded bg-neutral-900 border-neutral-700"
                />
                <div>
                  <span className="text-white font-bold text-xs block">
                    Offer Free Delivery for orders above a minimum purchase threshold
                  </span>
                  <span className="text-neutral-400 text-[11px]">
                    When order subtotal reaches or exceeds this amount, the delivery fee becomes ₹0 FREE automatically.
                  </span>
                </div>
              </label>

              {deliveryForm.enableFreeDeliveryThreshold && (
                <div className="ml-6 pl-3 border-l-2 border-cyan-500/50 space-y-2 max-w-sm">
                  <label className="text-neutral-300 uppercase text-[10px] font-bold block">
                    Minimum Order For Free Delivery (₹ INR)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 font-bold text-sm">
                      ₹
                    </span>
                    <input
                      type="number"
                      min="1"
                      step="100"
                      value={deliveryForm.freeDeliveryThreshold}
                      onChange={(e) =>
                        setDeliveryForm({
                          ...deliveryForm,
                          freeDeliveryThreshold: Math.max(0, Number(e.target.value) || 0),
                        })
                      }
                      className="w-full pl-8 pr-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white font-bold text-sm focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <p className="text-[10px] text-neutral-400">
                    Customers whose bag totals {formatINR(deliveryForm.freeDeliveryThreshold)} or more get 100% Free Shipping.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Live Customer Experience Simulator */}
          <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase">
              <CheckCircle2 size={15} />
              <span>Live Customer Experience Simulation</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-neutral-900/60 rounded border border-neutral-800 space-y-1">
                <span className="text-[10px] text-neutral-400 uppercase block">Cart Drawer Banner:</span>
                <p className="text-white font-bold">
                  {deliveryForm.isFreeDelivery ? (
                    <span className="text-emerald-400">
                      🎉 100% Free Express Delivery Active on All Orders!
                    </span>
                  ) : deliveryForm.enableFreeDeliveryThreshold ? (
                    <span>
                      Add {formatINR(deliveryForm.freeDeliveryThreshold)} for Free Express Delivery (otherwise {formatINR(deliveryForm.deliveryFee)})
                    </span>
                  ) : (
                    <span>
                      Standard Delivery Fee: {formatINR(deliveryForm.deliveryFee)} on all orders
                    </span>
                  )}
                </p>
              </div>

              <div className="p-3 bg-neutral-900/60 rounded border border-neutral-800 space-y-1">
                <span className="text-[10px] text-neutral-400 uppercase block">Checkout Shipping Line:</span>
                <p className="text-white font-bold">
                  {deliveryForm.isFreeDelivery ? (
                    <span className="text-emerald-400 font-mono">Shipping: FREE (₹0)</span>
                  ) : deliveryForm.enableFreeDeliveryThreshold ? (
                    <span className="font-mono">
                      Shipping: {formatINR(deliveryForm.deliveryFee)} (Free on orders &ge; {formatINR(deliveryForm.freeDeliveryThreshold)})
                    </span>
                  ) : (
                    <span className="font-mono">Shipping: {formatINR(deliveryForm.deliveryFee)} Flat</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ATELIER IDENTITY */}
        {/* ========================================================================= */}
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 text-white border-b border-neutral-800 pb-2">
            <Globe size={16} className="text-cyan-400" />
            <h3 className="font-display font-bold text-sm uppercase">Atelier Identity</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-neutral-400 uppercase text-[10px]">Store Brand Name</label>
              <input
                type="text"
                value={storeMeta.storeName}
                onChange={(e) => setStoreMeta({ ...storeMeta, storeName: e.target.value })}
                className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div className="space-y-1">
              <label className="text-neutral-400 uppercase text-[10px]">Operating Currency</label>
              <input
                type="text"
                disabled
                value={storeMeta.currency}
                className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded text-neutral-400"
              />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <label className="text-neutral-400 uppercase text-[10px]">Brand Descriptor</label>
              <input
                type="text"
                value={storeMeta.storeTagline}
                onChange={(e) => setStoreMeta({ ...storeMeta, storeTagline: e.target.value })}
                className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div className="space-y-1">
              <label className="text-neutral-400 uppercase text-[10px] flex items-center justify-between">
                <span>Official Website URL (.ai)</span>
                <span className="text-cyan-400 font-bold">ACTIVE DOMAIN</span>
              </label>
              <input
                type="text"
                value={storeMeta.storeUrl}
                onChange={(e) => setStoreMeta({ ...storeMeta, storeUrl: e.target.value })}
                placeholder="https://gridclothing.ai"
                className="w-full p-2.5 bg-neutral-950 border border-cyan-500/40 rounded text-white font-mono focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div className="space-y-1">
              <label className="text-neutral-400 uppercase text-[10px]">Support & Concierge Email (.ai)</label>
              <input
                type="email"
                value={storeMeta.supportEmail}
                onChange={(e) => setStoreMeta({ ...storeMeta, supportEmail: e.target.value })}
                placeholder="support@gridclothing.ai"
                className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded text-white font-mono focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAX & INVENTORY RULES */}
        {/* ========================================================================= */}
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 text-white border-b border-neutral-800 pb-2">
            <Percent size={16} className="text-cyan-400" />
            <h3 className="font-display font-bold text-sm uppercase">Tax & Inventory Thresholds</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-neutral-400 uppercase text-[10px]">Standard GST Apparel Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={storeMeta.salesTaxRate}
                onChange={(e) => setStoreMeta({ ...storeMeta, salesTaxRate: Number(e.target.value) })}
                className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div className="space-y-1">
              <label className="text-neutral-400 uppercase text-[10px]">Low Inventory Warning Alert (Units)</label>
              <input
                type="number"
                value={storeMeta.lowStockThreshold}
                onChange={(e) => setStoreMeta({ ...storeMeta, lowStockThreshold: Number(e.target.value) })}
                className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* FULFILLMENT NODES */}
        {/* ========================================================================= */}
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 text-white border-b border-neutral-800 pb-2">
            <Shield size={16} className="text-cyan-400" />
            <h3 className="font-display font-bold text-sm uppercase">Active Fulfillment Nodes</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 bg-neutral-950 rounded border border-neutral-800">
              <span className="text-[10px] text-cyan-400 block">PRIMARY NODE (WEST REGION)</span>
              <p className="font-bold text-white mt-1">{storeMeta.dispatchHubPrimary}</p>
              <p className="text-neutral-400 text-[11px]">Direct express courier dispatch across Mumbai, Pune & Gujarat</p>
            </div>
            <div className="p-3 bg-neutral-950 rounded border border-neutral-800">
              <span className="text-[10px] text-cyan-400 block">SECONDARY NODE (SOUTH REGION)</span>
              <p className="font-bold text-white mt-1">{storeMeta.dispatchHubSecondary}</p>
              <p className="text-neutral-400 text-[11px]">Direct express dispatch across Bengaluru, Chennai & Hyderabad</p>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CLOUD DATABASE STATUS (FIRESTORE) */}
        {/* ========================================================================= */}
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
            <div className="flex items-center gap-2 text-white">
              <Database size={16} className="text-cyan-400" />
              <h3 className="font-display font-bold text-sm uppercase">Cloud Database (Google Firestore)</h3>
            </div>
            <span
              className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded flex items-center gap-1.5 ${
                firestoreConnected
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                  : 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  firestoreConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              {firestoreConnected ? 'ACTIVE & CONNECTED' : 'INITIALIZING'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 bg-neutral-950 rounded border border-neutral-800 font-mono text-xs">
              <span className="text-[10px] text-neutral-400 uppercase block">Database ID</span>
              <p className="text-cyan-400 font-bold mt-1 break-all">{firestoreDbId}</p>
              <p className="text-neutral-500 text-[10px] mt-1">Multi-region NoSQL persistent cluster</p>
            </div>
            <div className="p-3 bg-neutral-950 rounded border border-neutral-800 font-mono text-xs">
              <span className="text-[10px] text-neutral-400 uppercase block">Synchronized Collections</span>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-700 text-neutral-300 text-[11px]">
                  products ({products.length})
                </span>
                <span className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-700 text-neutral-300 text-[11px]">
                  orders ({orders.length})
                </span>
                <span className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-700 text-neutral-300 text-[11px]">
                  settings
                </span>
              </div>
              <p className="text-neutral-500 text-[10px] mt-1.5">Real-time bi-directional streaming</p>
            </div>
          </div>
        </div>

        {/* Save Settings Action Button */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-neutral-400 text-xs flex items-center gap-2">
            <AlertCircle size={14} className="text-cyan-400" />
            <span>Changes take effect immediately across all storefront carts and checkout orders.</span>
          </div>

          <button
            id="admin-save-settings-btn"
            type="submit"
            className="px-8 py-3 bg-cyan-400 hover:bg-cyan-300 text-black font-display font-black uppercase text-xs tracking-wider rounded-lg transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
          >
            <Save size={15} />
            <span>Save Delivery & Store Settings</span>
          </button>
        </div>
      </form>

      {/* Demo Data Management & Reset Section */}
      <div className="mt-12 pt-6 border-t border-neutral-800 space-y-3 bg-neutral-900/30 p-5 rounded-lg border border-neutral-800">
        <div className="flex items-center gap-2 text-amber-400">
          <Database size={16} />
          <h4 className="font-bold uppercase text-xs">Sandbox & Mock Data Controls</h4>
        </div>
        <p className="text-neutral-400 text-xs">
          Currently managing <strong className="text-white">{products.length} active SKUs</strong> and{' '}
          <strong className="text-white">{orders.length} order history records</strong> in local sandbox storage.
        </p>
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Reset all products, orders, and delivery settings to initial showcase demo defaults?')) {
              resetStoreData();
              setDeliveryForm({
                isFreeDelivery: false,
                deliveryFee: 149,
                enableFreeDeliveryThreshold: true,
                freeDeliveryThreshold: 4999,
                expressCourierName: 'FedEx / Bluedart Express',
              });
            }
          }}
          className="px-4 py-2 bg-neutral-900 hover:bg-rose-950 hover:text-rose-400 border border-neutral-700 text-neutral-300 rounded flex items-center gap-2 transition-colors cursor-pointer"
        >
          <RotateCcw size={14} />
          <span>Reset All Mock Data to Factory Demo Defaults</span>
        </button>
      </div>
    </div>
  );
};
