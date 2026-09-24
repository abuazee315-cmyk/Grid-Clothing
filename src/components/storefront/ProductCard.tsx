import React, { useState } from 'react';
import { ShoppingBag, Eye, Star, Check } from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { formatINR } from '../../utils/currency';

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { setSelectedProduct, addToCart } = useStore();
  const [isHovered, setIsHovered] = useState(false);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const activeColor = product.colors[selectedColorIndex] || product.colors[0];
  const totalPhotos = product.images.length;
  // If user is hovering card and haven't selected a specific dot, default to secondary image (slot 1) if available
  const displayImage = isHovered && activePhotoIndex === 0 && totalPhotos > 1
    ? (product.images[1] || product.images[0])
    : (product.images[activePhotoIndex] || product.images[0]);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultSize = product.sizes.includes('L') ? 'L' : product.sizes[0] || 'M';
    addToCart(product, defaultSize, activeColor.name, 1);
  };

  return (
    <div
      className="group bg-neutral-900/40 border border-neutral-800/80 hover:border-neutral-600 rounded-lg overflow-hidden transition-all duration-300 flex flex-col justify-between"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setActivePhotoIndex(0);
      }}
    >
      {/* Visual Image Stage */}
      <div
        onClick={() => setSelectedProduct(product)}
        className="relative aspect-[4/5] bg-neutral-900 overflow-hidden cursor-pointer"
      >
        <img
          src={displayImage}
          alt={product.name}
          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.badge && (
            <span className="px-2 py-0.5 bg-white text-black text-[10px] font-mono font-black uppercase rounded tracking-wider shadow-md">
              {product.badge}
            </span>
          )}
          {product.stock <= 10 && product.stock > 0 && (
            <span className="px-2 py-0.5 bg-amber-400 text-black text-[10px] font-mono font-bold uppercase rounded">
              LOW STOCK: {product.stock}
            </span>
          )}
          {product.stock === 0 && (
            <span className="px-2 py-0.5 bg-rose-600 text-white text-[10px] font-mono font-bold uppercase rounded">
              OUT OF STOCK
            </span>
          )}
        </div>

        {/* Top-Right Multi-Photo Count Badge */}
        {totalPhotos > 1 && (
          <div className="absolute top-3 right-3 z-10">
            <span className="px-1.5 py-0.5 bg-black/80 backdrop-blur-xs text-neutral-300 text-[9px] font-mono rounded border border-white/10 flex items-center gap-1 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              {totalPhotos} photos
            </span>
          </div>
        )}

        {/* Vertical Photo Angle Selector on Card Hover */}
        {totalPhotos > 1 && (
          <div className="absolute top-10 right-3 flex flex-col gap-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {product.images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onMouseEnter={(e) => {
                  e.stopPropagation();
                  setActivePhotoIndex(idx);
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePhotoIndex(idx);
                }}
                className={`w-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                  (activePhotoIndex === idx || (activePhotoIndex === 0 && isHovered && idx === 1))
                    ? 'bg-cyan-400 h-4 shadow-sm shadow-cyan-400/50'
                    : 'bg-white/40 hover:bg-white h-2'
                }`}
                title={`Angle ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Hover Quick Action Deck */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-2">
          <button
            onClick={() => setSelectedProduct(product)}
            className="flex-1 py-2.5 bg-neutral-900/90 hover:bg-neutral-800 text-white text-xs font-mono rounded flex items-center justify-center gap-1.5 transition-colors border border-neutral-700"
          >
            <Eye size={13} /> Quick View
          </button>
          <button
            onClick={handleQuickAdd}
            disabled={product.stock <= 0}
            className="flex-1 py-2.5 bg-white hover:bg-cyan-400 text-black text-xs font-mono font-bold rounded flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingBag size={13} /> Add
          </button>
        </div>
      </div>

      {/* Information Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category & SKU */}
          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
            <span className="uppercase tracking-wider">{product.category}</span>
            <div className="flex items-center gap-1 text-amber-400">
              <Star size={11} fill="currentColor" />
              <span className="text-white font-bold">{product.rating}</span>
              <span className="text-neutral-400">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => setSelectedProduct(product)}
            className="font-display font-bold text-sm text-white hover:text-cyan-400 transition-colors cursor-pointer mt-1 line-clamp-1"
          >
            {product.name}
          </h3>

          <p className="text-[11px] text-neutral-400 font-mono mt-0.5 line-clamp-1">
            {product.fabricDetails}
          </p>
        </div>

        {/* Sizes preview */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-mono text-neutral-400 uppercase mr-1">SIZES:</span>
          {product.sizes.map((s) => (
            <span
              key={s}
              className="text-[10px] font-mono px-1 py-0.5 bg-neutral-800/80 text-neutral-300 rounded"
            >
              {s}
            </span>
          ))}
        </div>

        {/* Bottom price and color swatches */}
        <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between">
          <div>
            <span className="text-base font-extrabold font-mono text-white">{formatINR(product.price)}</span>
          </div>

          {/* Color swatches */}
          <div className="flex items-center gap-1.5">
            {product.colors.map((color, idx) => (
              <button
                key={color.name}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedColorIndex(idx);
                }}
                title={color.name}
                className={`w-4 h-4 sm:w-3.5 sm:h-3.5 rounded-full border transition-transform cursor-pointer ${
                  selectedColorIndex === idx
                    ? 'border-cyan-400 scale-125 ring-1 ring-cyan-400/40'
                    : 'border-neutral-700 hover:scale-110'
                }`}
                style={{ backgroundColor: color.hex }}
              />
            ))}
          </div>
        </div>

        {/* Mobile Dedicated Touch Action Buttons (Accessible on touch screens without hover) */}
        <div className="md:hidden pt-2 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedProduct(product)}
            className="flex-1 py-2 bg-neutral-900 active:bg-cyan-400 active:text-black border border-neutral-800 rounded text-[11px] font-mono font-medium text-neutral-200 flex items-center justify-center gap-1.5 transition-colors min-h-[38px] cursor-pointer"
          >
            <Eye size={12} />
            <span>Select Size</span>
          </button>
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={product.stock <= 0}
            className="px-3.5 py-2 bg-white active:bg-cyan-400 text-black rounded text-[11px] font-mono font-bold flex items-center justify-center gap-1 transition-colors disabled:opacity-40 min-h-[38px] cursor-pointer"
            title="Quick Add to Bag"
          >
            <ShoppingBag size={12} />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
