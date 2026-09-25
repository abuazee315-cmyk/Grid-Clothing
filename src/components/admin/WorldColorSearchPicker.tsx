import React, { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  Plus,
  Check,
  X,
  Sparkles,
  Pipette,
  Hash,
  Palette,
} from 'lucide-react';
import {
  WORLD_COLORS,
  WORLD_COLOR_FAMILIES,
  WorldColor,
  WorldColorFamily,
  findNearestWorldColor,
  searchWorldColors,
} from '../../data/worldColors';

export interface ColorItem {
  name: string;
  hex: string;
}

interface WorldColorSearchPickerProps {
  // Currently selected colors
  selectedColors: ColorItem[];
  // Callback when a color is added or toggled
  onToggleColor: (color: ColorItem) => void;
  // If true, only one color can be selected at a time (e.g. for an order item)
  singleSelect?: boolean;
  // Label to show
  label?: string;
  // Optional custom classes
  className?: string;
}

export const WorldColorSearchPicker: React.FC<WorldColorSearchPickerProps> = ({
  selectedColors,
  onToggleColor,
  singleSelect = false,
  label = 'COLORWAYS (WORLD PALETTE SEARCH)',
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFamily, setActiveFamily] = useState<WorldColorFamily>('All');
  const [showAdvancedPicker, setShowAdvancedPicker] = useState(false);

  // Custom picker state
  const [customHex, setCustomHex] = useState('#2563EB');
  const [customName, setCustomName] = useState('');

  // Nearest match calculation
  const nearestResult = useMemo(() => {
    return findNearestWorldColor(customHex);
  }, [customHex]);

  // Filtered colors from the world database
  const filteredColors = useMemo(() => {
    return searchWorldColors(searchQuery, activeFamily);
  }, [searchQuery, activeFamily]);

  const isColorSelected = (hex: string, name: string) => {
    return selectedColors.some(
      (c) => c.hex.toLowerCase() === hex.toLowerCase() || c.name.toLowerCase() === name.toLowerCase()
    );
  };

  const handleCustomHexChange = (hexVal: string) => {
    let clean = hexVal.trim();
    if (!clean.startsWith('#') && clean.length > 0) {
      clean = '#' + clean;
    }
    setCustomHex(clean);
  };

  const handleAddCustomColor = () => {
    if (!customHex) return;
    const nameToAdd = customName.trim() || (nearestResult.isExact ? nearestResult.color.name : `${nearestResult.color.name} (Custom)`);
    onToggleColor({
      name: nameToAdd,
      hex: customHex.toUpperCase(),
    });
    setCustomName('');
  };

  return (
    <div className={`space-y-3 bg-neutral-950/80 border border-neutral-800 rounded-lg p-3 sm:p-4 ${className}`}>
      {/* Header and Selected Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-3">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-cyan-400" />
          <label className="text-white text-xs font-mono font-bold uppercase tracking-wider">
            {label}
          </label>
          <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800 px-1.5 py-0.5 rounded font-mono">
            {WORLD_COLORS.length}+ World Shades
          </span>
        </div>

        <button
          type="button"
          onClick={() => setShowAdvancedPicker(!showAdvancedPicker)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono transition-colors cursor-pointer ${
            showAdvancedPicker
              ? 'bg-cyan-400 text-black font-bold'
              : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-700'
          }`}
        >
          <Pipette className="w-3 h-3" />
          <span>{showAdvancedPicker ? 'Hide Custom Spectrum' : 'Custom Spectrum / Hex'}</span>
        </button>
      </div>

      {/* Currently Selected Color Chips */}
      {selectedColors.length > 0 && (
        <div className="space-y-1">
          <div className="text-[10px] font-mono text-neutral-400 uppercase">
            Active Selected {singleSelect ? 'Color' : `Colors (${selectedColors.length})`}:
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {selectedColors.map((c) => (
              <div
                key={c.name + c.hex}
                className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-neutral-900 border border-cyan-500/50 text-white text-xs font-mono group"
              >
                <span
                  className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0 shadow-sm"
                  style={{ backgroundColor: c.hex }}
                />
                <span className="font-medium text-white">{c.name}</span>
                <span className="text-[10px] text-neutral-400 font-mono">{c.hex}</span>
                <button
                  type="button"
                  onClick={() => onToggleColor(c)}
                  className="ml-1 text-neutral-400 hover:text-rose-400 transition-colors cursor-pointer"
                  title="Remove color"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Advanced Custom Spectrum & Hex Eyedropper Drawer */}
      {showAdvancedPicker && (
        <div className="p-3 bg-neutral-900/90 border border-neutral-700 rounded-lg space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              PICK ANY OF 16.7 MILLION COLORS IN THE WORLD
            </span>
            <span className="text-[10px] text-neutral-400 font-mono">Real-Time Name Match</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            {/* Native HTML5 Color Spectrum Swatch */}
            <div className="sm:col-span-3 flex items-center gap-2.5">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden border-2 border-neutral-700 shadow-inner shrink-0 cursor-pointer group">
                <input
                  type="color"
                  value={customHex.startsWith('#') && customHex.length === 7 ? customHex : '#111111'}
                  onChange={(e) => handleCustomHexChange(e.target.value)}
                  className="absolute -top-4 -left-4 w-20 h-20 cursor-pointer opacity-0"
                  title="Click to open color spectrum wheel"
                />
                <div
                  className="w-full h-full flex items-center justify-center pointer-events-none transition-transform group-hover:scale-105"
                  style={{ backgroundColor: customHex }}
                >
                  <Pipette className="w-4 h-4 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
                </div>
              </div>

              <div>
                <div className="text-[10px] font-mono text-neutral-400">Color Spectrum</div>
                <div className="text-xs font-mono font-bold text-white uppercase">{customHex}</div>
              </div>
            </div>

            {/* Hex Input */}
            <div className="sm:col-span-3">
              <label className="text-[10px] font-mono text-neutral-400 block mb-1">
                HEX CODE (#)
              </label>
              <div className="relative">
                <Hash className="w-3 h-3 text-neutral-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={customHex}
                  onChange={(e) => handleCustomHexChange(e.target.value)}
                  placeholder="#1E40AF"
                  className="w-full pl-7 pr-2 py-1.5 bg-neutral-950 border border-neutral-700 rounded text-xs font-mono text-white focus:outline-none focus:border-cyan-400 uppercase"
                />
              </div>
            </div>

            {/* Custom or Auto-detected Name */}
            <div className="sm:col-span-4">
              <label className="text-[10px] font-mono text-neutral-400 block mb-1">
                COLOR NAME (Detected or Custom)
              </label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder={nearestResult.color.name || 'e.g. Tokyo Midnight Neon'}
                className="w-full px-2.5 py-1.5 bg-neutral-950 border border-neutral-700 rounded text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
              <div className="text-[9px] text-neutral-400 mt-1 truncate">
                Nearest World Match: <strong className="text-cyan-300">{nearestResult.color.name}</strong> ({nearestResult.color.family})
              </div>
            </div>

            {/* Add Button */}
            <div className="sm:col-span-2 flex items-end">
              <button
                type="button"
                onClick={handleAddCustomColor}
                className="w-full py-2 px-3 bg-cyan-400 hover:bg-cyan-300 text-black font-mono font-bold text-xs uppercase rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* World Colors Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search any colour in the world (e.g. Sage Green, Dusty Rose, Cobalt, Terracotta, Lilac, Ochre, #3b82f6...)"
          className="w-full pl-9 pr-9 py-2 bg-neutral-900 border border-neutral-700 hover:border-neutral-600 rounded-md text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 font-mono"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Color Family Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
        {WORLD_COLOR_FAMILIES.map((family) => {
          const isActive = activeFamily === family;
          return (
            <button
              key={family}
              type="button"
              onClick={() => setActiveFamily(family)}
              className={`px-2.5 py-1 rounded text-[10px] font-mono uppercase whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-cyan-400 text-black font-bold shadow-sm'
                  : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              {family}
            </button>
          );
        })}
      </div>

      {/* Results Count & Preset / Database Swatches Grid */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
          <span>
            Showing <strong className="text-white">{filteredColors.length}</strong> world colors
            {activeFamily !== 'All' ? ` in ${activeFamily}` : ''}
            {searchQuery ? ` matching "${searchQuery}"` : ''}:
          </span>
          <span className="text-neutral-500">Click to select/toggle</span>
        </div>

        <div className="max-h-52 overflow-y-auto pr-1 space-y-1 border border-neutral-800/80 rounded-md p-2 bg-neutral-950/60 scrollbar-thin">
          {filteredColors.length === 0 ? (
            <div className="py-6 text-center text-xs font-mono text-neutral-500">
              No matching world colors found for &ldquo;{searchQuery}&rdquo;.
              <div className="mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAdvancedPicker(true);
                    if (searchQuery.startsWith('#')) {
                      setCustomHex(searchQuery);
                    }
                  }}
                  className="text-cyan-400 hover:underline inline-flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Create custom shade with custom spectrum
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5">
              {filteredColors.map((color) => {
                const isSelected = isColorSelected(color.hex, color.name);
                return (
                  <button
                    key={color.name + color.hex}
                    type="button"
                    onClick={() =>
                      onToggleColor({
                        name: color.name,
                        hex: color.hex,
                      })
                    }
                    className={`flex items-center gap-2 p-1.5 rounded-md border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-950/80 border-cyan-400 text-white shadow-sm ring-1 ring-cyan-400/50'
                        : 'bg-neutral-900/90 border-neutral-800 text-neutral-300 hover:border-neutral-700 hover:bg-neutral-850'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-neutral-600/80 shrink-0 shadow-sm relative"
                      style={{ backgroundColor: color.hex }}
                    >
                      {isSelected && (
                        <Check className="w-2.5 h-2.5 text-white absolute inset-0 m-auto drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]" />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-medium truncate leading-tight">
                        {color.name}
                      </div>
                      <div className="text-[9px] font-mono text-neutral-400 truncate">
                        {color.hex}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
