import React from 'react';
import { SlidersHorizontal, RotateCcw, Check } from 'lucide-react';
import { ProductCategory } from '../../types';
import { formatINR } from '../../utils/currency';

interface FilterState {
  category: string;
  sizes: string[];
  colors: string[];
  minPrice: number;
  maxPrice: number;
  inStockOnly: boolean;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating';
}

interface ProductFilterSidebarProps {
  filters: FilterState;
  onChange: (newFilters: FilterState) => void;
  onReset: () => void;
  totalResults: number;
  isMobileDrawer?: boolean;
  onCloseMobile?: () => void;
}

export const ProductFilterSidebar: React.FC<ProductFilterSidebarProps> = ({
  filters,
  onChange,
  onReset,
  totalResults,
  isMobileDrawer = false,
  onCloseMobile,
}) => {
  const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const availableColors = [
    { name: 'Onyx Black', hex: '#111111' },
    { name: 'Washed Charcoal', hex: '#333333' },
    { name: 'Bone White', hex: '#E6E4DF' },
    { name: 'Electric Cobalt', hex: '#0055FF' },
    { name: 'Cyber Lime', hex: '#A3E635' },
    { name: 'Battleship Olive', hex: '#3B4232' },
    { name: 'Safety Orange', hex: '#EA580C' },
    { name: 'Heather Gray', hex: '#9CA3AF' },
  ];

  const categories = [
    { id: 'all', label: 'All Catalog' },
    { id: 'hoodies', label: 'Heavyweight Hoodies' },
    { id: 'tees', label: 'Boxy Tees' },
    { id: 'pants', label: 'Cargo & Pants' },
    { id: 'jackets', label: 'Outerwear' },
    { id: 'accessories', label: 'Accessories' },
  ];

  const toggleSize = (size: string) => {
    const nextSizes = filters.sizes.includes(size)
      ? filters.sizes.filter((s) => s !== size)
      : [...filters.sizes, size];
    onChange({ ...filters, sizes: nextSizes });
  };

  const toggleColor = (colorName: string) => {
    const nextColors = filters.colors.includes(colorName)
      ? filters.colors.filter((c) => c !== colorName)
      : [...filters.colors, colorName];
    onChange({ ...filters, colors: nextColors });
  };

  const hasActiveFilters =
    filters.sizes.length > 0 ||
    filters.colors.length > 0 ||
    filters.minPrice > 1500 ||
    filters.maxPrice < 16000 ||
    filters.inStockOnly;

  return (
    <aside className={`space-y-6 ${isMobileDrawer ? 'p-6 bg-neutral-950 text-white' : ''}`}>
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-cyan-400" />
          <h3 className="font-display font-bold text-sm tracking-wider uppercase text-white">
            FILTERS
          </h3>
          <span className="text-[11px] font-mono text-neutral-400">({totalResults})</span>
        </div>

        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
          >
            <RotateCcw size={12} /> Reset
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="space-y-2.5">
        <label className="text-[11px] font-mono uppercase text-neutral-400 tracking-wider">
          Category
        </label>
        <div className="space-y-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onChange({ ...filters, category: cat.id })}
              className={`w-full text-left px-2.5 py-1.5 rounded text-xs font-mono transition-colors flex items-center justify-between ${
                filters.category === cat.id
                  ? 'bg-neutral-800 text-white font-bold border-l-2 border-cyan-400'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <span>{cat.label}</span>
              {filters.category === cat.id && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3 pt-2 border-t border-neutral-800">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-mono uppercase text-neutral-400 tracking-wider">
            Price Range
          </label>
          <span className="text-xs font-mono font-bold text-white">
            {formatINR(filters.minPrice)} — {formatINR(filters.maxPrice)}
          </span>
        </div>

        <input
          type="range"
          min={1500}
          max={16000}
          step={250}
          value={filters.maxPrice}
          onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
          className="w-full accent-cyan-400 bg-neutral-800 h-1.5 rounded-lg appearance-none cursor-pointer"
        />

        <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500">
          <span>Min: ₹1,500</span>
          <span>Max: ₹16,000</span>
        </div>
      </div>

      {/* Size Selector Grid */}
      <div className="space-y-2.5 pt-2 border-t border-neutral-800">
        <label className="text-[11px] font-mono uppercase text-neutral-400 tracking-wider">
          Sizes
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {allSizes.map((size) => {
            const isSelected = filters.sizes.includes(size);
            return (
              <button
                key={size}
                onClick={() => toggleSize(size)}
                className={`py-2 text-xs font-mono font-bold rounded border transition-all ${
                  isSelected
                    ? 'bg-white text-black border-white'
                    : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-600'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Color Filter Swatches */}
      <div className="space-y-2.5 pt-2 border-t border-neutral-800">
        <label className="text-[11px] font-mono uppercase text-neutral-400 tracking-wider">
          Color Palette
        </label>
        <div className="grid grid-cols-4 gap-2">
          {availableColors.map((col) => {
            const isSelected = filters.colors.includes(col.name);
            return (
              <button
                key={col.name}
                onClick={() => toggleColor(col.name)}
                title={col.name}
                className={`relative aspect-square rounded-md border flex items-center justify-center transition-all ${
                  isSelected ? 'border-cyan-400 scale-105 ring-2 ring-cyan-400/30' : 'border-neutral-800 hover:border-neutral-600'
                }`}
                style={{ backgroundColor: col.hex }}
              >
                {isSelected && (
                  <Check
                    size={14}
                    className={
                      col.hex === '#E6E4DF' || col.hex === '#FAFAFA'
                        ? 'text-black font-bold'
                        : 'text-white font-bold'
                    }
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* In-Stock Only Toggle */}
      <div className="pt-3 border-t border-neutral-800">
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => onChange({ ...filters, inStockOnly: e.target.checked })}
            className="w-4 h-4 rounded border-neutral-700 bg-neutral-900 text-cyan-400 focus:ring-cyan-400"
          />
          <span className="text-xs font-mono text-neutral-300">In-Stock Items Only</span>
        </label>
      </div>

      {/* Mobile Drawer Close Button */}
      {isMobileDrawer && onCloseMobile && (
        <div className="pt-4">
          <button
            onClick={onCloseMobile}
            className="w-full py-3 bg-white text-black font-bold text-xs uppercase tracking-wider rounded font-mono"
          >
            Apply Filters ({totalResults})
          </button>
        </div>
      )}
    </aside>
  );
};
