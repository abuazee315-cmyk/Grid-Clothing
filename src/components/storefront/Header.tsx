import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  ShoppingBag,
  SlidersHorizontal,
  X,
  ArrowRight,
  ShieldCheck,
  Menu,
  ChevronDown,
  Sparkles,
  User,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatINR } from '../../utils/currency';
import { GridBrandLogo } from '../common/GridBrandLogo';

export const Header: React.FC<{
  onOpenFilters?: () => void;
}> = ({ onOpenFilters }) => {
  const {
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    cartCount,
    setIsCartOpen,
    setActiveMode,
    products,
    setSelectedProduct,
    currentCustomer,
    setIsCustomerAuthOpen,
    setCustomerAuthTab,
    isAdminAuthenticated,
    deliverySettings,
  } = useStore();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Search auto-suggest products
  const matchingProducts = searchQuery.trim()
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.sku.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 4)
    : [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const categories = [
    { id: 'all', label: 'All Catalog' },
    { id: 'new-arrivals', label: 'New Arrivals' },
    { id: 'hoodies', label: 'Hoodies' },
    { id: 'tees', label: 'Boxy Tees' },
    { id: 'pants', label: 'Cargo & Pants' },
    { id: 'jackets', label: 'Outerwear' },
    { id: 'accessories', label: 'Accessories' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800">
      {/* Top Banner Ticker */}
      <div className="bg-neutral-900 border-b border-neutral-800 text-[11px] font-mono tracking-wider py-1.5 px-4 text-neutral-400 overflow-hidden select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-neutral-300 font-semibold">GRID CLOTHING</span>
            <span className="text-cyan-400 font-bold hidden xs:inline sm:inline">"CLASSIC FORM. PREMIUM FEEL."</span>
            <span className="hidden sm:inline text-neutral-500">|</span>
            <span className="hidden md:inline text-neutral-400">480 GSM Bespoke Knits & Technical Fabrics</span>
          </div>
          <div className="flex items-center gap-4 text-neutral-300">
            {deliverySettings.isFreeDelivery ? (
              <span className="hidden md:inline text-emerald-400 font-bold">✨ FREE EXPRESS DELIVERY ON ALL ORDERS</span>
            ) : deliverySettings.enableFreeDeliveryThreshold ? (
              <span className="hidden md:inline text-cyan-400">
                FREE DELIVERY OVER {formatINR(deliverySettings.freeDeliveryThreshold)}
              </span>
            ) : (
              <span className="hidden md:inline text-neutral-300">
                EXPRESS DELIVERY: {formatINR(deliverySettings.deliveryFee)}
              </span>
            )}
            <span className="text-neutral-500 hidden sm:inline">•</span>
            <span>PROMO: <strong className="text-white">GRID10</strong> (10% OFF)</span>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4">
          {/* Mobile Menu Button */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 text-neutral-300 hover:text-white rounded-md hover:bg-neutral-900 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-left group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <GridBrandLogo />
                <div className="flex flex-col">
                  <div className="font-display font-black text-lg sm:text-xl tracking-tight text-white flex items-center gap-1.5">
                    GRID <span className="text-cyan-400 text-xs font-mono font-normal tracking-widest">// CLOTHING</span>
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-mono tracking-wider text-cyan-400 font-semibold -mt-0.5">
                    CLASSIC FORM. PREMIUM FEEL.
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* Desktop Search Bar */}
          <div ref={searchRef} className="relative hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500"
              />
              <input
                id="storefront-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Search heavyweight hoodies, cargo, tees..."
                className="w-full pl-9 pr-8 py-2 bg-neutral-900 border border-neutral-800 rounded-md text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Quick search popup results */}
            {isSearchFocused && searchQuery.trim() && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-neutral-900 border border-neutral-700 rounded-lg shadow-2xl p-2 z-50 overflow-hidden">
                <div className="text-[11px] font-mono uppercase text-neutral-400 px-3 py-1.5 border-b border-neutral-800 flex justify-between">
                  <span>Found {matchingProducts.length} Results</span>
                  <span className="text-cyan-400">Instant Preview</span>
                </div>
                {matchingProducts.length > 0 ? (
                  <div className="divide-y divide-neutral-800/60 mt-1">
                    {matchingProducts.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          setSelectedProduct(p);
                          setIsSearchFocused(false);
                        }}
                        className="flex items-center gap-3 p-2 hover:bg-neutral-800 rounded cursor-pointer transition-colors"
                      >
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-10 h-10 object-cover rounded bg-neutral-800 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-white truncate">{p.name}</p>
                          <p className="text-[11px] text-neutral-400 font-mono">{formatINR(p.price)} • {p.sku}</p>
                        </div>
                        <span className="text-[10px] font-mono text-cyan-400 uppercase bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800">
                          View
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center text-xs text-neutral-400">
                    No items matching "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Filter Drawer Toggle (Mobile) */}
            {onOpenFilters && (
              <button
                id="mobile-filters-trigger"
                onClick={onOpenFilters}
                className="lg:hidden p-2 text-neutral-300 hover:text-white rounded-md hover:bg-neutral-900 border border-neutral-800"
                title="Open filters"
              >
                <SlidersHorizontal size={18} />
              </button>
            )}

            {/* Customer Account & Sign In / Log In Trigger */}
            <button
              id="header-customer-account-btn"
              onClick={() => {
                setCustomerAuthTab(currentCustomer ? 'profile' : 'signin');
                setIsCustomerAuthOpen(true);
              }}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-cyan-500/50 text-neutral-200 text-xs font-mono font-medium rounded-md transition-all group cursor-pointer"
              title={currentCustomer ? `Client Account: ${currentCustomer.name}` : 'Customer Sign In / Register'}
            >
              <div className="w-5 h-5 rounded-full bg-cyan-400/20 text-cyan-300 flex items-center justify-center font-bold text-[10px]">
                {currentCustomer ? currentCustomer.name.slice(0, 1).toUpperCase() : <User size={13} className="text-cyan-400" />}
              </div>
              <span className="hidden sm:inline font-bold">
                {currentCustomer ? currentCustomer.name.split(' ')[0] : 'SIGN IN'}
              </span>
            </button>

            {/* Shopping Cart Trigger */}
            <button
              id="header-cart-toggle-btn"
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2.5 px-3 sm:px-3.5 py-2 bg-white text-black hover:bg-neutral-200 font-medium text-xs tracking-wider rounded-md transition-all cursor-pointer select-none"
            >
              <ShoppingBag size={16} />
              <span className="font-semibold hidden sm:inline">BAG</span>
              <span className="inline-flex items-center justify-center bg-black text-white text-[11px] font-mono font-bold w-5 h-5 rounded-full">
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar with Instant Results Dropdown */}
        <div className="md:hidden pb-2.5">
          <div className="relative w-full">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search catalog, hoodies, tees..."
              className="w-full pl-9 pr-8 py-2.5 bg-neutral-900 border border-neutral-800 rounded-md text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-cyan-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white p-1"
              >
                <X size={14} />
              </button>
            )}

            {/* Mobile Instant search results dropdown */}
            {searchQuery.trim() && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-neutral-900 border border-neutral-700 rounded-lg shadow-2xl p-2 z-50 overflow-hidden">
                <div className="text-[10px] font-mono uppercase text-neutral-400 px-2.5 py-1 border-b border-neutral-800 flex justify-between">
                  <span>Found {matchingProducts.length} Results</span>
                  <span className="text-cyan-400">Instant Preview</span>
                </div>
                {matchingProducts.length > 0 ? (
                  <div className="divide-y divide-neutral-800/60 mt-1 max-h-56 overflow-y-auto">
                    {matchingProducts.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          setSelectedProduct(p);
                        }}
                        className="flex items-center gap-2.5 p-2 hover:bg-neutral-800 rounded cursor-pointer transition-colors"
                      >
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-9 h-9 object-cover rounded bg-neutral-800 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-white truncate">{p.name}</p>
                          <p className="text-[10px] text-neutral-400 font-mono">{formatINR(p.price)}</p>
                        </div>
                        <span className="text-[9px] font-mono text-cyan-400 uppercase bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800 shrink-0">
                          View
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-4 text-center text-xs text-neutral-400 font-mono">
                    No items matching "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Horizontal Category Pills Bar (Touch-friendly 1-tap browsing) */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2.5 pb-1 -mx-4 px-4">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    if (searchQuery) setSearchQuery('');
                  }}
                  className={`px-3 py-1.5 text-[11px] uppercase tracking-wider font-mono transition-all rounded-full whitespace-nowrap cursor-pointer shrink-0 min-h-[36px] flex items-center ${
                    isActive
                      ? 'bg-cyan-400 text-black font-bold shadow-md shadow-cyan-400/20'
                      : 'bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Navigation Bar (Desktop) */}
        <nav className="hidden lg:flex items-center justify-start gap-1 py-2.5 border-t border-neutral-800/80 overflow-x-auto no-scrollbar">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  if (searchQuery) setSearchQuery('');
                }}
                className={`px-3.5 py-1.5 text-xs uppercase tracking-wider font-mono transition-all rounded-md whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-neutral-100 text-neutral-950 font-bold shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </nav>

        {/* Mobile Category Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-neutral-800 space-y-3 bg-neutral-950">
            {/* Brand Motto in Mobile Menu */}
            <div className="px-3 py-2 bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-cyan-950/40 border border-cyan-500/20 rounded-lg">
              <span className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase font-bold block">
                Brand Motto
              </span>
              <p className="text-xs font-mono font-bold text-cyan-400 mt-0.5 tracking-wider uppercase">
                "CLASSIC FORM. PREMIUM FEEL."
              </p>
            </div>

            {/* Mobile Customer Account Card */}
            <div className="p-3 bg-neutral-900/80 border border-neutral-800 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-cyan-400/20 border border-cyan-400/40 text-cyan-300 flex items-center justify-center font-bold text-xs">
                  {currentCustomer ? currentCustomer.name.slice(0, 1).toUpperCase() : <User size={15} className="text-cyan-400" />}
                </div>
                <div>
                  <p className="text-white text-xs font-bold font-mono">
                    {currentCustomer ? currentCustomer.name : 'Customer Account'}
                  </p>
                  <p className="text-[10px] text-neutral-400 font-mono">
                    {currentCustomer ? currentCustomer.email : 'Sign in to view orders & address'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCustomerAuthTab(currentCustomer ? 'profile' : 'signin');
                  setIsCustomerAuthOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-1.5 bg-cyan-400 hover:bg-cyan-300 text-black font-mono font-bold text-[11px] rounded uppercase cursor-pointer min-h-[36px] flex items-center"
              >
                {currentCustomer ? 'Account' : 'Sign In'}
              </button>
            </div>

            <div className="space-y-1">
              <div className="px-2 py-1 text-[10px] font-mono uppercase text-neutral-400 tracking-wider">
                Product Categories
              </div>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 text-xs font-mono uppercase rounded flex items-center justify-between min-h-[42px] cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-cyan-500/10 text-cyan-400 font-bold border-l-2 border-cyan-400'
                      : 'text-neutral-300 hover:bg-neutral-900'
                  }`}
                >
                  <span>{cat.label}</span>
                  {activeCategory === cat.id && <ChevronDown size={14} className="-rotate-90" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
