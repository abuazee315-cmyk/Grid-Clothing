import React, { useState, useRef } from 'react';
import {
  X,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  ShoppingBag,
  Plus,
  Minus,
  Check,
  Info,
  Ruler,
  ChevronLeft,
  ChevronRight,
  Camera,
} from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { formatINR } from '../../utils/currency';

export const ProductDetailModal: React.FC<{
  product: Product;
  onClose: () => void;
}> = ({ product, onClose }) => {
  const { addToCart } = useStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<Product['sizes'][number]>(
    product.sizes.includes('L') ? 'L' : product.sizes[0] || 'M'
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors[0]?.name || 'Standard'
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'care'>('details');
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  // Touch swipe support for mobile
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const totalPhotos = product.images.length;

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % totalPhotos);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + totalPhotos) % totalPhotos);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 45;
    const isRightSwipe = distance < -45;

    if (isLeftSwipe && totalPhotos > 1) {
      nextImage();
    } else if (isRightSwipe && totalPhotos > 1) {
      prevImage();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const activeColorHex =
    product.colors.find((c) => c.name === selectedColor)?.hex || '#111111';

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card - Full screen on mobile, floating card on tablet/desktop */}
      <div className="relative w-full h-full sm:h-auto sm:max-h-[90vh] max-w-5xl bg-neutral-950 sm:border border-neutral-800 sm:rounded-xl shadow-2xl overflow-hidden z-10 my-0 sm:my-auto text-white flex flex-col">
        {/* Mobile Sticky Header Bar with Close Button */}
        <div className="sm:hidden px-4 py-3 bg-neutral-950/95 border-b border-neutral-800 flex items-center justify-between sticky top-0 z-30 safe-area-pt">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">// {product.category}</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 -mr-1 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-300 hover:text-white min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer"
            aria-label="Close product view"
          >
            <X size={18} />
          </button>
        </div>

        {/* Desktop Close Button */}
        <button
          id="product-detail-close-btn"
          onClick={onClose}
          className="hidden sm:flex absolute top-4 right-4 z-20 p-2.5 rounded-full bg-neutral-900/80 border border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          aria-label="Close product view"
        >
          <X size={18} />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto pb-24 sm:pb-0 touch-scroll">
          {/* Left Column: Image Gallery with Mobile Touch Swipe */}
          <div className="lg:col-span-6 bg-neutral-900/50 p-3 sm:p-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-neutral-800">
            {/* Main Stage Image */}
            <div
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="relative aspect-[4/5] rounded-lg overflow-hidden bg-neutral-900 border border-neutral-800 group select-none touch-pan-y"
            >
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={`${product.name} view ${activeImageIndex + 1}`}
                className="w-full h-full object-cover object-center transition-all duration-300"
                referrerPolicy="no-referrer"
              />

              {product.badge && (
                <span className="absolute top-3 left-3 px-2.5 py-1 bg-white text-black text-[10px] font-mono font-black uppercase rounded tracking-wider shadow">
                  {product.badge}
                </span>
              )}

              {/* Photo Angle Counter Badge */}
              {totalPhotos > 1 && (
                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 bg-black/80 backdrop-blur-xs text-white text-[10px] font-mono rounded border border-white/10 shadow">
                  <Camera size={11} className="text-cyan-400" />
                  <span>{activeImageIndex + 1} / {totalPhotos} Photos</span>
                </div>
              )}

              {/* Left/Right Navigation Arrows */}
              {totalPhotos > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 hover:bg-black text-white border border-white/20 transition-all opacity-80 sm:opacity-0 sm:group-hover:opacity-100 hover:scale-110 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                    aria-label="Previous photo angle"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 hover:bg-black text-white border border-white/20 transition-all opacity-80 sm:opacity-0 sm:group-hover:opacity-100 hover:scale-110 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                    aria-label="Next photo angle"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              {/* Mobile Swipe Guidance indicator dots */}
              {totalPhotos > 1 && (
                <div className="absolute inset-x-0 bottom-2 flex justify-center items-center gap-1.5 z-10 sm:hidden">
                  {product.images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImageIndex(i)}
                      className={`h-1.5 rounded-full transition-all ${
                        activeImageIndex === i ? 'w-6 bg-cyan-400' : 'w-1.5 bg-white/50'
                      }`}
                      aria-label={`Jump to photo ${i + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* Angle Description Subtitle */}
              {totalPhotos > 1 && (
                <div className="hidden sm:flex absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent items-center justify-between text-[10px] text-neutral-300 font-mono">
                  <span>
                    {activeImageIndex === 0
                      ? 'Angle 1 • Front View / Cover'
                      : activeImageIndex === 1
                      ? 'Angle 2 • Back View / Silhouette'
                      : activeImageIndex === 2
                      ? 'Angle 3 • Fabric / Detail Macro'
                      : 'Angle 4 • On-Body / Lifestyle'}
                  </span>
                  <span className="text-[9px] text-neutral-400">Click or swipe to rotate</span>
                </div>
              )}
            </div>

            {/* Thumbnail Navigators (3 or 4 Photos Gallery) */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 no-scrollbar">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-14 sm:w-16 h-18 sm:h-20 rounded-md overflow-hidden border-2 transition-all flex-shrink-0 bg-neutral-900 group cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-cyan-400 scale-105 ring-2 ring-cyan-400/30'
                        : 'border-neutral-800 hover:border-neutral-600 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Angle ${idx + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-black/80 py-0.5 text-center text-[8px] font-mono text-white">
                      #{idx + 1}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Spec & Variant Selectors */}
          <div className="lg:col-span-6 p-4 sm:p-6 lg:p-8 flex flex-col justify-between space-y-5 sm:space-y-6">
            <div>
              {/* Micro Header */}
              <div className="flex items-center justify-between text-xs font-mono text-neutral-400 pb-1">
                <span className="text-cyan-400 uppercase tracking-widest hidden sm:inline">// {product.category}</span>
                <span>SKU: {product.sku}</span>
                <span className="sm:hidden text-cyan-400 uppercase">{product.category}</span>
              </div>

              {/* Title */}
              <h2 className="font-display font-black text-xl sm:text-2xl lg:text-3xl text-white uppercase tracking-tight">
                {product.name}
              </h2>

              {/* Price & Rating */}
              <div className="flex items-center justify-between mt-2.5 pb-3 border-b border-neutral-800">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-2xl sm:text-3xl font-bold text-white">
                    {formatINR(product.price)}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 bg-neutral-900 px-2.5 py-1 rounded border border-neutral-800 text-xs font-mono">
                  <Star size={13} className="text-amber-400 fill-amber-400" />
                  <span className="font-bold text-white">{product.rating}</span>
                  <span className="text-neutral-500">|</span>
                  <span className="text-neutral-400">{product.reviewsCount} reviews</span>
                </div>
              </div>

              {/* Stock Status Indicator */}
              <div className="mt-3.5">
                {product.stock > 15 ? (
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/30 border border-emerald-900/50 px-3 py-1.5 rounded-md">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>IN STOCK — Ready for express dispatch ({product.stock} units)</span>
                  </div>
                ) : product.stock > 0 ? (
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-400 bg-amber-950/30 border border-amber-900/50 px-3 py-1.5 rounded-md">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                    <span>LOW INVENTORY: Only {product.stock} units left</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs font-mono text-rose-400 bg-rose-950/30 border border-rose-900/50 px-3 py-1.5 rounded-md">
                    <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                    <span>OUT OF STOCK — Restocking shortly</span>
                  </div>
                )}
              </div>

              {/* Color Selector */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-neutral-400 uppercase tracking-wider">COLOR:</span>
                  <span className="text-white font-bold">{selectedColor}</span>
                </div>
                <div className="flex items-center gap-3">
                  {product.colors.map((color) => {
                    const isSelected = selectedColor === color.name;
                    return (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={`relative w-9 h-9 sm:w-8 sm:h-8 rounded-full border-2 transition-transform flex items-center justify-center cursor-pointer min-h-[38px] min-w-[38px] ${
                          isSelected
                            ? 'border-cyan-400 scale-110 ring-2 ring-cyan-400/40'
                            : 'border-neutral-700 hover:scale-105 active:scale-95'
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      >
                        {isSelected && (
                          <Check
                            size={14}
                            className={
                              color.hex === '#E6E4DF' || color.hex === '#FAFAFA'
                                ? 'text-black'
                                : 'text-white'
                            }
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Size Selector with touch-friendly pills */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-neutral-400 uppercase tracking-wider">SELECT SIZE:</span>
                  <button
                    onClick={() => setShowSizeGuide(!showSizeGuide)}
                    className="text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer py-1"
                  >
                    <Ruler size={13} /> Size Guide
                  </button>
                </div>

                {showSizeGuide && (
                  <div className="p-3 bg-neutral-900 border border-neutral-700 rounded-md text-[11px] font-mono text-neutral-300 space-y-1 animate-fadeIn">
                    <p className="font-bold text-white">GRID FIT GUIDE:</p>
                    <p>• Engineered with a boxy, dropped-shoulder silhouette.</p>
                    <p>• Size down for standard fitted drape, or select your true size for intended streetwear volume.</p>
                  </div>
                )}

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {product.sizes.map((size) => {
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-3 min-h-[46px] text-xs font-mono font-bold rounded-md border transition-all cursor-pointer flex items-center justify-center active:scale-95 ${
                          isSelected
                            ? 'bg-white text-black border-white shadow-md shadow-white/10'
                            : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-600 active:bg-neutral-800'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Desktop Quantity Stepper & Add to Cart */}
              <div className="hidden sm:flex mt-6 items-center gap-3">
                <div className="flex items-center border border-neutral-800 rounded-md bg-neutral-900 h-12">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3.5 h-full text-neutral-400 hover:text-white transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-10 text-center font-mono font-bold text-sm text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="px-3.5 h-full text-neutral-400 hover:text-white transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <button
                  id="product-modal-add-to-cart-btn"
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="flex-1 h-12 bg-white hover:bg-cyan-400 text-black font-display font-black text-xs uppercase tracking-wider rounded-md transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingBag size={16} />
                  <span>ADD TO BAG — {formatINR(product.price * quantity)}</span>
                </button>
              </div>

              {/* Tabbed Specs, Fabric & Construction details */}
              <div className="mt-5 pt-3 border-t border-neutral-800">
                <div className="flex border-b border-neutral-800 text-xs font-mono mb-3">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`pb-2 px-3 uppercase tracking-wider font-semibold transition-colors cursor-pointer min-h-[36px] flex items-center ${
                      activeTab === 'details'
                        ? 'text-cyan-400 border-b-2 border-cyan-400'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('specs')}
                    className={`pb-2 px-3 uppercase tracking-wider font-semibold transition-colors cursor-pointer min-h-[36px] flex items-center ${
                      activeTab === 'specs'
                        ? 'text-cyan-400 border-b-2 border-cyan-400'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Fabric & Fit
                  </button>
                  <button
                    onClick={() => setActiveTab('care')}
                    className={`pb-2 px-3 uppercase tracking-wider font-semibold transition-colors cursor-pointer min-h-[36px] flex items-center ${
                      activeTab === 'care'
                        ? 'text-cyan-400 border-b-2 border-cyan-400'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Care Instructions
                  </button>
                </div>

                <div className="text-xs text-neutral-300 leading-relaxed font-sans min-h-[56px]">
                  {activeTab === 'details' && <p>{product.description}</p>}
                  {activeTab === 'specs' && (
                    <div className="space-y-1.5 font-mono text-[11px]">
                      <p><strong className="text-white">FABRIC:</strong> {product.fabricDetails}</p>
                      <p><strong className="text-white">SILHOUETTE:</strong> {product.fitDetails}</p>
                    </div>
                  )}
                  {activeTab === 'care' && (
                    <p className="font-mono text-[11px] text-neutral-400">
                      {product.careInstructions || 'Machine wash cold with like garments. Line dry to retain fabric density and structure.'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Micro Guarantees Footer */}
            <div className="pt-3 border-t border-neutral-800/80 grid grid-cols-3 gap-2 text-[10px] font-mono text-neutral-400">
              <div className="flex items-center gap-1.5">
                <Truck size={13} className="text-cyan-400 shrink-0" />
                <span>Express Dispatch</span>
              </div>
              <div className="flex items-center gap-1.5">
                <RotateCcw size={13} className="text-cyan-400 shrink-0" />
                <span>30-Day Free Returns</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-cyan-400 shrink-0" />
                <span>Authentic Bespoke</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sticky Bottom Action Bar (Ensures Add to Bag is always 1-tap accessible) */}
        <div className="sm:hidden fixed bottom-0 inset-x-0 bg-neutral-950/95 backdrop-blur-md border-t border-neutral-800 p-3 z-40 safe-area-pb flex items-center gap-2.5 shadow-2xl">
          <div className="flex items-center border border-neutral-800 rounded bg-neutral-900 h-11 shrink-0">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="px-2.5 h-full text-neutral-400 active:text-white flex items-center justify-center min-w-[36px]"
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </button>
            <span className="w-7 text-center font-mono font-bold text-xs text-white">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
              className="px-2.5 h-full text-neutral-400 active:text-white flex items-center justify-center min-w-[36px]"
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>

          <button
            id="mobile-product-modal-add-to-bag-btn"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="flex-1 h-11 bg-white active:bg-cyan-400 text-black font-display font-black text-xs uppercase tracking-wider rounded transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
          >
            <ShoppingBag size={16} />
            <span>ADD TO BAG • {formatINR(product.price * quantity)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

