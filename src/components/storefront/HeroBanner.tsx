import React from 'react';
import { ArrowRight, Flame, Shield, Sparkles, Layers } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const HeroBanner: React.FC = () => {
  const { setActiveCategory } = useStore();

  return (
    <section className="relative w-full overflow-hidden bg-neutral-950 border-b border-neutral-800">
      {/* Background Graphic Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      
      {/* Subtle Radial Glow in Electric Cyan */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-neutral-800/20 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Text & Spec Sheet */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex flex-wrap items-center gap-2 px-3 py-1.5 bg-neutral-900 border border-cyan-500/30 text-xs font-mono rounded-full text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="font-bold tracking-wide text-white uppercase">CLASSIC FORM. PREMIUM FEEL.</span>
              <span className="text-neutral-500 hidden sm:inline">|</span>
              <span className="text-neutral-300 hidden sm:inline">COLLECTION 04</span>
            </div>

            <div className="space-y-2">
              <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl tracking-tighter text-white uppercase leading-none">
                CLASSIC FORM. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-cyan-400">
                  PREMIUM FEEL.
                </span>
              </h1>
              <p className="text-neutral-300 text-sm sm:text-base lg:text-lg max-w-xl font-normal leading-relaxed pt-2">
                <span className="text-cyan-400 font-semibold font-mono block text-xs sm:text-sm mb-1 tracking-wider uppercase">
                  "CLASSIC FORM. PREMIUM FEEL."
                </span>
                Engineered from custom 480 GSM loopback cotton fleece and Cordura® ripstop. Zero unnecessary ornamentation. Precision boxy silhouettes built to outlast decades.
              </p>
            </div>

            {/* Micro spec metrics */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 py-2.5 max-w-lg border-y border-neutral-800/80">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono uppercase text-neutral-400">DENSITY</span>
                <p className="text-xs sm:text-sm font-bold font-mono text-white">480 GSM</p>
                <p className="text-[10px] sm:text-[11px] text-neutral-400 truncate">Loopback fleece</p>
              </div>
              <div className="space-y-0.5 border-x border-neutral-800/80 px-2 sm:px-3">
                <span className="text-[10px] font-mono uppercase text-neutral-400">HARDWARE</span>
                <p className="text-xs sm:text-sm font-bold font-mono text-white truncate">YKK + FIDLOCK</p>
                <p className="text-[10px] sm:text-[11px] text-neutral-400 truncate">Magnetic lock</p>
              </div>
              <div className="space-y-0.5 pl-1.5 sm:pl-2">
                <span className="text-[10px] font-mono uppercase text-neutral-400">DRAFT CUT</span>
                <p className="text-xs sm:text-sm font-bold font-mono text-white truncate">BOXY DROP</p>
                <p className="text-[10px] sm:text-[11px] text-neutral-400 truncate">Relaxed fit</p>
              </div>
            </div>

            {/* CTAs with mobile full-width responsive buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                id="hero-shop-collection-btn"
                onClick={() => {
                  setActiveCategory('hoodies');
                  const el = document.getElementById('product-catalog-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-6 py-3.5 bg-white text-black hover:bg-cyan-400 font-display font-extrabold text-xs uppercase tracking-wider rounded transition-all flex items-center justify-center gap-2 group cursor-pointer shadow-lg shadow-white/5 min-h-[44px]"
              >
                <span>SHOP NEW DROP</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="hero-explore-catalog-btn"
                onClick={() => {
                  setActiveCategory('all');
                  const el = document.getElementById('product-catalog-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-6 py-3.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white font-mono text-xs uppercase tracking-wider rounded transition-all cursor-pointer min-h-[44px] flex items-center justify-center"
              >
                ALL PRODUCTS (12)
              </button>
            </div>
          </div>

          {/* Right Hero Lookbook Showcase Image */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none group">
              {/* Outer frame border */}
              <div className="relative rounded-lg overflow-hidden border border-neutral-700/80 bg-neutral-900 shadow-2xl aspect-[4/5]">
                <img
                  src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=1000&auto=format&fit=crop&q=80"
                  alt="GRID Collection 04 Overdraft Hoodie"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 filter contrast-105"
                  referrerPolicy="no-referrer"
                />

                {/* Overlaid Streetwear Badges */}
                <div className="absolute top-4 left-4 bg-neutral-950/80 backdrop-blur-md px-3 py-1.5 rounded border border-neutral-700 text-[11px] font-mono text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  <span>LOOKBOOK ITEM #01 // 480GSM HOODIE</span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 bg-neutral-950/90 backdrop-blur-md p-3.5 rounded border border-neutral-700/80 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-mono text-neutral-400 uppercase">FEATURED DROP</div>
                    <div className="text-sm font-bold text-white">Overdraft Heavyweight Hoodie</div>
                    <div className="text-xs font-mono text-cyan-400">₹7,999 • 4 Colors</div>
                  </div>
                  <button
                    onClick={() => {
                      setActiveCategory('hoodies');
                      const el = document.getElementById('product-catalog-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-3 py-1.5 bg-neutral-100 hover:bg-cyan-400 hover:text-black text-neutral-900 font-mono text-xs font-bold rounded transition-colors"
                  >
                    VIEW
                  </button>
                </div>
              </div>

              {/* Decorative corner brackets */}
              <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400 pointer-events-none" />
              <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400 pointer-events-none" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
