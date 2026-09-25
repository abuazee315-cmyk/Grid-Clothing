import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Flame, Plus, Eye } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { formatINR } from '../../utils/currency';

export const TrendingCarousel: React.FC = () => {
  const { products, setSelectedProduct, addToCart } = useStore();
  const carouselRef = useRef<HTMLDivElement>(null);

  const trendingProducts = products.filter((p) => p.isTrending);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 340;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-12 bg-neutral-950 border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs tracking-widest uppercase mb-1">
              <Flame size={15} />
              <span>COMMUNITY FAVORITES</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-white">
              TRENDING NOW
            </h2>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-2.5 rounded-md bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-600 transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2.5 rounded-md bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-600 transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Carousel Row */}
        <div
          ref={carouselRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory touch-pan-x"
        >
          {trendingProducts.map((product) => (
            <div
              key={product.id}
              className="w-[240px] sm:w-[320px] flex-shrink-0 snap-start group bg-neutral-900/60 border border-neutral-800 hover:border-neutral-600 rounded-lg overflow-hidden transition-all flex flex-col"
            >
              {/* Product Image Stage */}
              <div className="relative aspect-[4/5] bg-neutral-900 overflow-hidden cursor-pointer" onClick={() => setSelectedProduct(product)}>
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />

                {/* Badge */}
                {product.badge && (
                  <span className="absolute top-3 left-3 px-2 py-0.5 bg-white text-black text-[10px] font-mono font-black uppercase rounded tracking-wider shadow">
                    {product.badge}
                  </span>
                )}

                {/* Quick actions overlay for desktop hover */}
                <div className="hidden sm:flex absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center gap-2 p-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProduct(product);
                    }}
                    className="px-3 py-2 bg-neutral-950/90 text-white hover:bg-white hover:text-black text-xs font-mono rounded flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Eye size={14} /> Quick View
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product, product.sizes[0] || 'M', product.colors[0]?.name || 'Standard', 1);
                    }}
                    className="px-3 py-2 bg-cyan-400 text-black hover:bg-cyan-300 text-xs font-mono font-bold rounded flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus size={14} /> Add
                  </button>
                </div>

                {/* Stock Indicator */}
                {product.stock <= 15 && (
                  <div className="absolute bottom-2 left-2 text-[10px] font-mono text-amber-400 bg-black/75 backdrop-blur-xs px-2 py-0.5 rounded border border-amber-900/50">
                    Low Stock: {product.stock} left
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-neutral-400 mb-1">
                    <span className="uppercase tracking-wider">{product.category}</span>
                    <span>{product.sku}</span>
                  </div>
                  <h3
                    onClick={() => setSelectedProduct(product)}
                    className="font-display font-bold text-xs sm:text-sm text-white hover:text-cyan-400 transition-colors cursor-pointer line-clamp-1"
                  >
                    {product.name}
                  </h3>
                </div>

                <div className="mt-3 pt-2.5 border-t border-neutral-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-sm sm:text-base font-bold font-mono text-white">{formatINR(product.price)}</span>
                  </div>

                  {/* Available Color Swatches */}
                  <div className="flex items-center gap-1">
                    {product.colors.slice(0, 4).map((c) => (
                      <span
                        key={c.name}
                        title={c.name}
                        className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border border-neutral-600 inline-block"
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                    {product.colors.length > 4 && (
                      <span className="text-[10px] font-mono text-neutral-400">+{product.colors.length - 4}</span>
                    )}
                  </div>
                </div>

                {/* Mobile direct tap buttons */}
                <div className="sm:hidden pt-2 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedProduct(product)}
                    className="flex-1 py-1.5 bg-neutral-900 active:bg-cyan-400 active:text-black border border-neutral-800 rounded text-[10px] font-mono font-medium text-neutral-200 flex items-center justify-center gap-1 min-h-[34px]"
                  >
                    <Eye size={11} /> View
                  </button>
                  <button
                    type="button"
                    onClick={() => addToCart(product, product.sizes[0] || 'M', product.colors[0]?.name || 'Standard', 1)}
                    className="px-3 py-1.5 bg-white active:bg-cyan-400 text-black rounded text-[10px] font-mono font-bold flex items-center justify-center gap-1 min-h-[34px]"
                  >
                    <Plus size={11} /> Bag
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
