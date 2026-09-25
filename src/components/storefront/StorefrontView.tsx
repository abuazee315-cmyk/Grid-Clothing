import React, { useState, useMemo } from 'react';
import {
  SlidersHorizontal,
  ChevronDown,
  ArrowUpDown,
  Search,
  Sparkles,
  Package,
  Layers,
  RotateCcw,
  X,
  ShoppingBag,
  User,
  Shield,
  LayoutGrid,
  Columns2,
  Rows3,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Header } from './Header';
import { HeroBanner } from './HeroBanner';
import { TrendingCarousel } from './TrendingCarousel';
import { CategoryGrid } from './CategoryGrid';
import { ProductFilterSidebar } from './ProductFilterSidebar';
import { ProductCard } from './ProductCard';
import { ProductDetailModal } from './ProductDetailModal';
import { SlideCart } from './SlideCart';
import { CheckoutModal } from './CheckoutModal';
import { Product } from '../../types';
import { GridBrandLogo } from '../common/GridBrandLogo';

export const StorefrontView: React.FC = () => {
  const {
    products,
    selectedProduct,
    setSelectedProduct,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    setActiveMode,
    setIsCustomerAuthOpen,
    setCustomerAuthTab,
    cartCount,
    setIsCartOpen,
    currentCustomer,
  } = useStore();

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  // Mobile grid layout: 2-col (compact double) or 1-col (large single)
  const [gridDensity, setGridDensity] = useState<'1-col' | '2-col'>('2-col');

  // Faceted filter state
  const [filters, setFilters] = useState<{
    category: string;
    sizes: string[];
    colors: string[];
    minPrice: number;
    maxPrice: number;
    inStockOnly: boolean;
    sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating';
  }>({
    category: activeCategory,
    sizes: [],
    colors: [],
    minPrice: 1500,
    maxPrice: 16000,
    inStockOnly: false,
    sortBy: 'featured',
  });

  // Sync activeCategory from header with filters
  React.useEffect(() => {
    setFilters((prev) => ({ ...prev, category: activeCategory }));
  }, [activeCategory]);

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    if (newFilters.category !== activeCategory) {
      setActiveCategory(newFilters.category);
    }
  };

  const handleResetFilters = () => {
    setFilters({
      category: 'all',
      sizes: [],
      colors: [],
      minPrice: 1500,
      maxPrice: 16000,
      inStockOnly: false,
      sortBy: 'featured',
    });
    setActiveCategory('all');
    setSearchQuery('');
  };

  // Filtered & sorted products computation
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      if (filters.category === 'new-arrivals') {
        if (!product.isNewArrival) return false;
      } else if (filters.category !== 'all') {
        if (product.category !== filters.category) return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = product.name.toLowerCase().includes(query);
        const matchCategory = product.category.toLowerCase().includes(query);
        const matchSku = product.sku.toLowerCase().includes(query);
        const matchDesc = product.description.toLowerCase().includes(query);
        if (!matchName && !matchCategory && !matchSku && !matchDesc) return false;
      }

      // Price filter
      if (product.price < filters.minPrice || product.price > filters.maxPrice) {
        return false;
      }

      // Sizes filter
      if (filters.sizes.length > 0) {
        const hasSize = product.sizes.some((s) => filters.sizes.includes(s));
        if (!hasSize) return false;
      }

      // Colors filter
      if (filters.colors.length > 0) {
        const hasColor = product.colors.some((c) => filters.colors.includes(c.name));
        if (!hasColor) return false;
      }

      // In stock filter
      if (filters.inStockOnly && product.stock <= 0) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price-asc') return a.price - b.price;
      if (filters.sortBy === 'price-desc') return b.price - a.price;
      if (filters.sortBy === 'rating') return b.rating - a.rating;
      return 0; // featured default order
    });
  }, [products, filters, searchQuery]);

  const showHeroAndEditorial = !searchQuery.trim() && (activeCategory === 'all' || activeCategory === 'new-arrivals');

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-cyan-400 selection:text-black pb-20 md:pb-0">
      {/* Sticky Top Header */}
      <Header onOpenFilters={() => setMobileFilterOpen(true)} />

      {/* Hero Banner (Homepage / New Arrivals) */}
      {showHeroAndEditorial && <HeroBanner />}

      {/* Trending Carousel (Homepage) */}
      {showHeroAndEditorial && <TrendingCarousel />}

      {/* Category Grid Showcase (Homepage) */}
      {showHeroAndEditorial && <CategoryGrid />}

      {/* Main Catalog & Browsing Section */}
      <main id="product-catalog-section" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Catalog Section Header & Sorting Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 mb-8 border-b border-neutral-800 gap-4">
          <div>
            <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
              <span>// INVENTORY ARCHIVE</span>
              <span>•</span>
              <span className="text-neutral-400">{filteredProducts.length} ARTICLES DISPLAYED</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase mt-1">
              {searchQuery
                ? `RESULTS FOR "${searchQuery}"`
                : filters.category === 'all'
                ? 'CURRENT RUNNING CATALOG'
                : filters.category === 'new-arrivals'
                ? 'NEW ARRIVALS // DROP 04'
                : `${filters.category.toUpperCase()} COLLECTION`}
            </h2>
          </div>

          {/* Sort By, Mobile Filter Trigger & Mobile Grid Density Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Grid Density Toggle: 1-col vs 2-col */}
            <div className="sm:hidden flex items-center bg-neutral-900 border border-neutral-800 rounded-md p-0.5">
              <button
                type="button"
                onClick={() => setGridDensity('2-col')}
                className={`p-1.5 rounded transition-colors ${
                  gridDensity === '2-col' ? 'bg-cyan-400 text-black' : 'text-neutral-400 hover:text-white'
                }`}
                title="2-Column Grid View"
                aria-label="2-Column Grid View"
              >
                <Columns2 size={15} />
              </button>
              <button
                type="button"
                onClick={() => setGridDensity('1-col')}
                className={`p-1.5 rounded transition-colors ${
                  gridDensity === '1-col' ? 'bg-cyan-400 text-black' : 'text-neutral-400 hover:text-white'
                }`}
                title="Single Column Detailed View"
                aria-label="Single Column Detailed View"
              >
                <Rows3 size={15} />
              </button>
            </div>

            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden px-2.5 sm:px-3.5 py-2 bg-neutral-900 border border-neutral-800 rounded-md text-xs font-mono text-neutral-300 hover:text-white flex items-center gap-1.5 sm:gap-2 min-h-[38px]"
            >
              <SlidersHorizontal size={14} className="text-cyan-400" />
              <span>Filters ({filters.sizes.length + filters.colors.length + (filters.inStockOnly ? 1 : 0)})</span>
            </button>

            <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-md px-2.5 sm:px-3 py-1.5 text-xs font-mono min-h-[38px]">
              <ArrowUpDown size={13} className="text-neutral-500" />
              <span className="text-neutral-400 hidden sm:inline">SORT:</span>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer text-xs"
              >
                <option value="featured" className="bg-neutral-900 text-white">Featured Architecture</option>
                <option value="price-asc" className="bg-neutral-900 text-white">Price: Low to High</option>
                <option value="price-desc" className="bg-neutral-900 text-white">Price: High to Low</option>
                <option value="rating" className="bg-neutral-900 text-white">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Catalog Layout: Sidebar + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-3 sticky top-28 bg-neutral-900/30 p-5 rounded-lg border border-neutral-800/80">
            <ProductFilterSidebar
              filters={filters}
              onChange={handleFilterChange}
              onReset={handleResetFilters}
              totalResults={filteredProducts.length}
            />
          </div>

          {/* Products Grid - Dynamic 1-col or 2-col on Mobile, 2-col on Tablet, 3-col on Desktop */}
          <div className="lg:col-span-9">
            {filteredProducts.length > 0 ? (
              <div
                className={
                  gridDensity === '2-col'
                    ? 'grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-2.5 sm:gap-6'
                    : 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6'
                }
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center bg-neutral-900/20 border border-neutral-800 rounded-lg p-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-neutral-900 flex items-center justify-center text-neutral-500 mx-auto">
                  <Package size={28} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-lg text-white">No items match your criteria</h3>
                  <p className="text-xs font-mono text-neutral-400">
                    Try broadening your size, color, or price filters.
                  </p>
                </div>
                <button
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 bg-neutral-100 hover:bg-cyan-400 text-black font-mono text-xs font-bold uppercase rounded transition-colors cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Brand Editorial Lookbook Strip */}
      <section className="bg-neutral-900/50 border-t border-neutral-800 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Brand Motto & Identity Statement */}
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-cyan-400 font-mono text-xs tracking-widest uppercase">// BRAND PHILOSOPHY</span>
            <h3 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
              CLASSIC FORM. PREMIUM FEEL.
            </h3>
            <p className="text-xs text-neutral-400 font-mono leading-relaxed">
              Every garment is engineered with architectural geometry, heavyweight luxury drapes, and meticulous Japanese & European technical finishes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-neutral-950 border border-neutral-800 rounded-lg space-y-2">
              <span className="text-cyan-400 font-mono text-xs">// BESPOKE KNITTING</span>
              <h4 className="font-display font-bold text-base text-white">480 GSM Cotton Loopback</h4>
              <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                Knitted from combed GOTS-certified ring-spun yarn. Heavy enough to drape with architectural gravity without bagging.
              </p>
            </div>
            <div className="p-6 bg-neutral-950 border border-neutral-800 rounded-lg space-y-2">
              <span className="text-cyan-400 font-mono text-xs">// HARDWARE & LOCKS</span>
              <h4 className="font-display font-bold text-base text-white">AquaGuard & Fidlock</h4>
              <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                Engineered with Japanese matte polyurethane waterproof zippers and German magnetic quick-release buckle hardware.
              </p>
            </div>
            <div className="p-6 bg-neutral-950 border border-neutral-800 rounded-lg space-y-2">
              <span className="text-cyan-400 font-mono text-xs">// ETHICAL DISPATCH</span>
              <h4 className="font-display font-bold text-base text-white">Carbon Neutral Express Delivery</h4>
              <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                Direct dispatch from our Kerala & Karnataka fulfillment hubs in 100% biodegradable cornstarch compostable mailers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Global Streetwear Footer */}
      <footer className="bg-neutral-950 border-t border-neutral-800 text-neutral-400 text-xs font-mono py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-neutral-800/80">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <GridBrandLogo size="md" />
                <div className="font-display font-black text-xl tracking-tight text-white flex items-center gap-1.5">
                  GRID <span className="text-cyan-400 text-xs font-mono font-normal tracking-widest">// CLOTHING</span>
                </div>
              </div>
              <p className="text-xs font-serif italic text-neutral-300">
                &ldquo;Classic Form. Premium Feel.&rdquo;
              </p>
              <p className="text-[11px] leading-relaxed text-neutral-500">
                Architectural streetwear atelier. Established 2024. All garments designed and numbered in limited batch productions.
              </p>
            </div>

            <div className="space-y-2">
              <h5 className="font-bold text-white text-[11px] uppercase tracking-wider">Collections</h5>
              <ul className="space-y-1.5 text-[11px]">
                <li><button onClick={() => setActiveCategory('hoodies')} className="hover:text-white transition-colors cursor-pointer">Heavyweight Hoodies</button></li>
                <li><button onClick={() => setActiveCategory('tees')} className="hover:text-white transition-colors cursor-pointer">Boxy Oversized Tees</button></li>
                <li><button onClick={() => setActiveCategory('pants')} className="hover:text-white transition-colors cursor-pointer">Technical Cargo & Pants</button></li>
                <li><button onClick={() => setActiveCategory('jackets')} className="hover:text-white transition-colors cursor-pointer">Waterproof Outerwear</button></li>
              </ul>
            </div>

            <div className="space-y-2">
              <h5 className="font-bold text-white text-[11px] uppercase tracking-wider">Atelier Locations</h5>
              <ul className="space-y-1 text-[11px] text-neutral-500">
                <li>INDIA: Connaught Place, New Delhi</li>
                <li>KERALA: Marine Drive Atelier, Kochi</li>
                <li>KARNATAKA: Indiranagar Flagship, Bengaluru</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h5 className="font-bold text-white text-[11px] uppercase tracking-wider">Client Services</h5>
              <p className="text-[11px] text-neutral-500">
                Track shipments, view orders, and manage client profile.
              </p>
              <div className="text-[10px] font-mono text-neutral-400 space-y-0.5 pt-0.5">
                <div>Web: <span className="text-cyan-400 font-bold">gridclothing.ai</span></div>
                <div>Support: <span className="text-neutral-300">care@gridclothing.ai</span></div>
              </div>
              <button
                onClick={() => {
                  setCustomerAuthTab('signin');
                  setIsCustomerAuthOpen(true);
                }}
                className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 hover:text-white font-bold text-xs rounded transition-colors cursor-pointer"
              >
                Sign In / Client Account →
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-500 gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <p>© 2026 GRID CLOTHING CO. ALL RIGHTS RESERVED. // CLASSIC FORM. PREMIUM FEEL.</p>
              <span className="hidden sm:inline text-neutral-700">•</span>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 font-mono text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse"></span>
                <span>Published by <strong className="text-white">Lovable</strong></span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span>PRIVACY POLICY</span>
              <span>TERMS OF SERVICE</span>
              <span>SUSTAINABILITY INDEX</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Filters Slide-in Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/80" onClick={() => setMobileFilterOpen(false)} />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-neutral-950 border-l border-neutral-800 z-10 overflow-y-auto">
            <div className="p-4 border-b border-neutral-800 flex justify-between items-center">
              <span className="font-display font-bold text-sm text-white uppercase">Filter Catalog</span>
              <button onClick={() => setMobileFilterOpen(false)} className="p-1 text-neutral-400 hover:text-white cursor-pointer">
                <X size={18} />
              </button>
            </div>
            <ProductFilterSidebar
              filters={filters}
              onChange={handleFilterChange}
              onReset={handleResetFilters}
              totalResults={filteredProducts.length}
              isMobileDrawer={true}
              onCloseMobile={() => setMobileFilterOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Mobile Sticky Bottom Navigation Dock (Optimized touch targets for mobile devices) */}
      <nav
        id="mobile-bottom-nav-dock"
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-neutral-950/95 backdrop-blur-md border-t border-neutral-800/90 px-2 py-2 flex items-center justify-around shadow-2xl safe-area-pb"
      >
        <button
          type="button"
          onClick={() => {
            handleResetFilters();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex flex-col items-center gap-1 text-neutral-400 hover:text-white active:text-cyan-400 cursor-pointer min-w-[50px] py-1"
        >
          <Layers size={18} />
          <span className="text-[10px] font-mono">Store</span>
        </button>

        <button
          type="button"
          onClick={() => setMobileFilterOpen(true)}
          className="relative flex flex-col items-center gap-1 text-neutral-400 hover:text-white active:text-cyan-400 cursor-pointer min-w-[50px] py-1"
        >
          <SlidersHorizontal size={18} />
          <span className="text-[10px] font-mono">Filter</span>
          {(filters.sizes.length + filters.colors.length + (filters.inStockOnly ? 1 : 0)) > 0 && (
            <span className="absolute 0 right-2 w-4 h-4 bg-cyan-400 text-black text-[9px] font-mono font-black rounded-full flex items-center justify-center">
              {filters.sizes.length + filters.colors.length + (filters.inStockOnly ? 1 : 0)}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center gap-1 text-neutral-400 hover:text-white active:text-cyan-400 cursor-pointer min-w-[50px] py-1"
        >
          <ShoppingBag size={18} />
          <span className="text-[10px] font-mono">Bag</span>
          {cartCount > 0 && (
            <span className="absolute 0 right-2 w-4 h-4 bg-cyan-400 text-black text-[9px] font-mono font-black rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            setCustomerAuthTab(currentCustomer ? 'profile' : 'signin');
            setIsCustomerAuthOpen(true);
          }}
          className="flex flex-col items-center gap-1 text-neutral-400 hover:text-white active:text-cyan-400 cursor-pointer min-w-[50px] py-1"
        >
          <User size={18} />
          <span className="text-[10px] font-mono">
            {currentCustomer ? currentCustomer.name.split(' ')[0] : 'Account'}
          </span>
        </button>
      </nav>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* Slide-over Cart */}
      <SlideCart />

      {/* Multi-step Checkout Modal */}
      <CheckoutModal />
    </div>
  );
};
