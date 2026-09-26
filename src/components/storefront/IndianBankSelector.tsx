import React, { useState, useMemo } from 'react';
import { Search, Check, Building2, ChevronDown, ChevronUp, Sparkles, X } from 'lucide-react';
import { IndianBank, INDIAN_BANKS, searchIndianBanks } from '../../data/indianBanks';

interface IndianBankSelectorProps {
  selectedBankId: string;
  onSelectBank: (bank: IndianBank) => void;
  paymentApp: 'gpay' | 'phonepe';
  className?: string;
}

// User-specified featured banks: Corporation Bank, Union Bank of India, Bank of Baroda
const PRIORITY_FEATURED_BANK_IDS = [
  'corporation-bank',
  'union-bank-of-india',
  'bank-of-baroda',
  'state-bank-of-india',
  'hdfc-bank',
  'icici-bank',
  'axis-bank',
  'punjab-national-bank',
];

export const IndianBankSelector: React.FC<IndianBankSelectorProps> = ({
  selectedBankId,
  onSelectBank,
  paymentApp,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFullListOpen, setIsFullListOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Currently selected bank object
  const currentSelectedBank = useMemo(() => {
    return (
      INDIAN_BANKS.find((b) => b.id === selectedBankId) ||
      INDIAN_BANKS.find((b) => b.id === 'corporation-bank') ||
      INDIAN_BANKS[0]
    );
  }, [selectedBankId]);

  // Featured banks list (Corporation Bank, Union Bank, Bank of Baroda, etc.)
  const priorityBanks = useMemo(() => {
    return PRIORITY_FEATURED_BANK_IDS.map((id) =>
      INDIAN_BANKS.find((b) => b.id === id)
    ).filter(Boolean) as IndianBank[];
  }, []);

  // Filtered banks based on search query
  const filteredBanks = useMemo(() => {
    const results = searchIndianBanks(searchQuery);
    if (selectedCategory === 'All') return results;
    return results.filter((b) => b.category === selectedCategory);
  }, [searchQuery, selectedCategory]);

  const categories = ['All', 'Public Sector', 'Private Sector', 'Small Finance / Payment'];

  const appAccent = paymentApp === 'gpay' ? 'cyan' : 'purple';
  const appName = paymentApp === 'gpay' ? 'Google Pay' : 'PhonePe';

  return (
    <div className={`space-y-3 font-mono text-xs ${className}`}>
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Building2 size={14} className={paymentApp === 'gpay' ? 'text-cyan-400' : 'text-purple-400'} />
          <span className="text-white font-bold uppercase tracking-wider text-[11px]">
            Select Linked Bank Account ({appName})
          </span>
        </div>
        <span className="text-[10px] text-neutral-400">
          50+ Indian Banks Supported
        </span>
      </div>

      {/* Prominently Featured Bank Buttons: Corporation Bank, Union Bank of India, Bank of Baroda */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[10px] text-neutral-400">
          <span className="flex items-center gap-1">
            <Sparkles size={11} className="text-amber-400" />
            <span>Featured Banks (Popular in India):</span>
          </span>
          <span className="text-neutral-500">Tap to select instantly</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          {priorityBanks.map((bank) => {
            const isSelected = bank.id === currentSelectedBank.id;
            const isRequestedBank =
              bank.id === 'corporation-bank' ||
              bank.id === 'union-bank-of-india' ||
              bank.id === 'bank-of-baroda';

            return (
              <button
                key={bank.id}
                type="button"
                onClick={() => onSelectBank(bank)}
                className={`p-2 rounded-lg border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? paymentApp === 'gpay'
                      ? 'border-cyan-400 bg-cyan-950/40 text-white ring-1 ring-cyan-400/50 shadow-sm shadow-cyan-500/20'
                      : 'border-purple-400 bg-purple-950/40 text-white ring-1 ring-purple-400/50 shadow-sm shadow-purple-500/20'
                    : 'border-neutral-800 bg-neutral-900/70 text-neutral-300 hover:border-neutral-700 hover:bg-neutral-800/80'
                }`}
              >
                {isRequestedBank && (
                  <span className="absolute top-1 right-1 text-[8px] font-bold px-1 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    ★ Top
                  </span>
                )}
                <div className="pr-4">
                  <p className="font-bold text-[11px] truncate text-white leading-tight">
                    {bank.name}
                  </p>
                  <p className="text-[9px] text-neutral-400 truncate mt-0.5">
                    {bank.shortName} • {bank.category.replace(' Sector', '')}
                  </p>
                </div>
                <div className="mt-2 flex items-center justify-between pt-1 border-t border-neutral-800/50">
                  <span className="text-[9px] text-neutral-500 font-mono">
                    {paymentApp === 'gpay' ? bank.gpaySuffix : bank.phonepeSuffix}
                  </span>
                  {isSelected && (
                    <span
                      className={`text-[9px] font-bold flex items-center gap-0.5 ${
                        paymentApp === 'gpay' ? 'text-cyan-400' : 'text-purple-400'
                      }`}
                    >
                      <Check size={10} /> Active
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Currently Selected Bank Card */}
      <div
        className={`p-3 rounded-lg border flex items-center justify-between gap-3 ${
          paymentApp === 'gpay'
            ? 'bg-cyan-950/20 border-cyan-500/30'
            : 'bg-purple-950/20 border-purple-500/30'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
              paymentApp === 'gpay'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                : 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
            }`}
          >
            {currentSelectedBank.shortName.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-white text-xs truncate">
                {currentSelectedBank.name}
              </span>
              <span className="text-[9px] px-1.5 py-0.5 bg-neutral-800 text-neutral-300 rounded border border-neutral-700">
                {currentSelectedBank.category}
              </span>
            </div>
            <p className="text-[10px] text-neutral-400 truncate mt-0.5">
              Default UPI Suffix:{' '}
              <strong className={paymentApp === 'gpay' ? 'text-cyan-300' : 'text-purple-300'}>
                {paymentApp === 'gpay' ? currentSelectedBank.gpaySuffix : currentSelectedBank.phonepeSuffix}
              </strong>
              {' '}• Ready for 1-tap PIN authorization
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsFullListOpen(!isFullListOpen)}
          className={`shrink-0 px-2.5 py-1.5 rounded text-[10px] font-bold border transition-colors flex items-center gap-1 cursor-pointer ${
            paymentApp === 'gpay'
              ? 'border-cyan-500/40 bg-cyan-900/30 text-cyan-300 hover:bg-cyan-900/50'
              : 'border-purple-500/40 bg-purple-900/30 text-purple-300 hover:bg-purple-900/50'
          }`}
        >
          <span>{isFullListOpen ? 'Close Bank Search' : 'Search Any Bank'}</span>
          {isFullListOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
      </div>

      {/* SEARCH ANY BANK IN INDIA - Expandable Bank Browser */}
      {isFullListOpen && (
        <div className="p-3 bg-neutral-900/95 border border-neutral-800 rounded-xl space-y-2.5 animate-fadeIn">
          <div className="flex items-center justify-between pb-1 border-b border-neutral-800">
            <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
              <Search size={12} className={paymentApp === 'gpay' ? 'text-cyan-400' : 'text-purple-400'} />
              Search Any Bank in India ({INDIAN_BANKS.length} registered banks)
            </span>
            <button
              type="button"
              onClick={() => setIsFullListOpen(false)}
              className="text-neutral-500 hover:text-white p-1 cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>

          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by bank name, e.g. Corporation, Union, Baroda, Canara, SBI, Axis..."
              className="w-full pl-8 pr-8 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-cyan-400 font-mono"
              autoFocus
            />
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-500" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white cursor-pointer"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[10px]">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2 py-0.5 rounded whitespace-nowrap border transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? paymentApp === 'gpay'
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold'
                      : 'bg-purple-500/20 text-purple-300 border-purple-500/50 font-bold'
                    : 'bg-neutral-800/80 text-neutral-400 border-neutral-700 hover:text-neutral-200'
                }`}
              >
                {cat}
              </button>
            ))}
            <span className="text-neutral-500 text-[9px] ml-auto shrink-0">
              Found {filteredBanks.length} banks
            </span>
          </div>

          {/* Bank Results List */}
          <div className="max-h-48 overflow-y-auto space-y-1 pr-1 divide-y divide-neutral-800/40">
            {filteredBanks.length === 0 ? (
              <div className="p-4 text-center text-neutral-500 text-xs">
                No bank found matching "{searchQuery}". Try typing another keyword.
              </div>
            ) : (
              filteredBanks.map((bank) => {
                const isSelected = bank.id === currentSelectedBank.id;
                const isRequestedBank =
                  bank.id === 'corporation-bank' ||
                  bank.id === 'union-bank-of-india' ||
                  bank.id === 'bank-of-baroda';

                return (
                  <button
                    key={bank.id}
                    type="button"
                    onClick={() => {
                      onSelectBank(bank);
                      setIsFullListOpen(false);
                    }}
                    className={`w-full p-2 text-left rounded-md flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                      isSelected
                        ? paymentApp === 'gpay'
                          ? 'bg-cyan-950/40 text-cyan-300 font-bold'
                          : 'bg-purple-950/40 text-purple-300 font-bold'
                        : 'hover:bg-neutral-800/60 text-neutral-300'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-white truncate">{bank.name}</span>
                        {isRequestedBank && (
                          <span className="text-[8px] px-1 bg-amber-400/20 text-amber-300 border border-amber-400/40 rounded">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-neutral-500">
                        {bank.category} • Suffix:{' '}
                        <span className="text-neutral-400 font-mono">
                          {paymentApp === 'gpay' ? bank.gpaySuffix : bank.phonepeSuffix}
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] px-1.5 py-0.5 bg-neutral-800 rounded text-neutral-400">
                        {bank.shortName}
                      </span>
                      {isSelected ? (
                        <Check
                          size={14}
                          className={paymentApp === 'gpay' ? 'text-cyan-400' : 'text-purple-400'}
                        />
                      ) : (
                        <span className="text-[10px] text-neutral-500 hover:text-white">
                          Select →
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
