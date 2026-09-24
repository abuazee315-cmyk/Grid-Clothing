import React from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCategory } from '../../types';

interface CategoryTile {
  id: ProductCategory;
  title: string;
  subtitle: string;
  image: string;
  count: number;
}

export const CategoryGrid: React.FC = () => {
  const { setActiveCategory, products } = useStore();

  const categories: CategoryTile[] = [
    {
      id: 'hoodies',
      title: 'HEAVYWEIGHT HOODIES',
      subtitle: '460-500 GSM loopback cotton fleece & double jacquard',
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
      count: products.filter((p) => p.category === 'hoodies').length,
    },
    {
      id: 'tees',
      title: 'BOXY & GRAPHIC TEES',
      subtitle: '280 GSM dense crewnecks & screenprints',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
      count: products.filter((p) => p.category === 'tees').length,
    },
    {
      id: 'pants',
      title: 'TECHNICAL CARGOS',
      subtitle: 'CORDURA® ripstop, magnetic fidlocks & flared sweatpants',
      image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80',
      count: products.filter((p) => p.category === 'pants').length,
    },
    {
      id: 'jackets',
      title: 'OUTERWEAR & BOMBERS',
      subtitle: '3-layer waterproof shells & reversible MA-1 flight satin',
      image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80',
      count: products.filter((p) => p.category === 'jackets').length,
    },
    {
      id: 'accessories',
      title: 'MODULAR ACCESSORIES',
      subtitle: '1050D ballistic slings, industrial webbing & caps',
      image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&auto=format&fit=crop&q=80',
      count: products.filter((p) => p.category === 'accessories').length,
    },
  ];

  const handleSelectCategory = (catId: ProductCategory) => {
    setActiveCategory(catId);
    const catalogSection = document.getElementById('product-catalog-section');
    catalogSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-14 bg-neutral-950 border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
          <div>
            <span className="text-[11px] font-mono tracking-widest text-cyan-400 uppercase">
              // ARCHIVE SEGMENTS
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-white mt-1">
              EXPLORE BY CATEGORY
            </h2>
          </div>
          <p className="text-xs font-mono text-neutral-400">
            Selected modular streetwear silhouettes
          </p>
        </div>

        {/* Bento / Staggered Streetwear Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Main Large Feature: Hoodies */}
          <div
            onClick={() => handleSelectCategory(categories[0].id)}
            className="md:col-span-2 lg:col-span-2 relative group rounded-lg overflow-hidden border border-neutral-800 hover:border-neutral-600 cursor-pointer h-72 sm:h-96 transition-all"
          >
            <img
              src={categories[0].image}
              alt={categories[0].title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90 contrast-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
            
            <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-xs px-2.5 py-1 rounded text-[11px] font-mono text-white border border-neutral-700">
              {categories[0].count} ITEMS IN ARCHIVE
            </div>

            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
              <div>
                <span className="text-cyan-400 text-xs font-mono uppercase tracking-widest">SIGNATURE LINE</span>
                <h3 className="font-display font-black text-2xl sm:text-3xl text-white uppercase mt-0.5">
                  {categories[0].title}
                </h3>
                <p className="text-neutral-300 text-xs sm:text-sm max-w-md mt-1">
                  {categories[0].subtitle}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center group-hover:bg-cyan-400 transition-colors shrink-0 ml-4">
                <ArrowUpRight size={20} />
              </div>
            </div>
          </div>

          {/* Tees */}
          <div
            onClick={() => handleSelectCategory(categories[1].id)}
            className="relative group rounded-lg overflow-hidden border border-neutral-800 hover:border-neutral-600 cursor-pointer h-72 sm:h-96 transition-all"
          >
            <img
              src={categories[1].image}
              alt={categories[1].title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90 contrast-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
            
            <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-xs px-2.5 py-1 rounded text-[11px] font-mono text-white border border-neutral-700">
              {categories[1].count} ITEMS
            </div>

            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
              <div>
                <h3 className="font-display font-black text-xl text-white uppercase">
                  {categories[1].title}
                </h3>
                <p className="text-neutral-400 text-xs mt-1 line-clamp-2">
                  {categories[1].subtitle}
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center group-hover:bg-cyan-400 transition-colors shrink-0 ml-2">
                <ArrowUpRight size={16} />
              </div>
            </div>
          </div>

          {/* Bottom 3 categories */}
          {categories.slice(2).map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleSelectCategory(cat.id)}
              className="relative group rounded-lg overflow-hidden border border-neutral-800 hover:border-neutral-600 cursor-pointer h-64 transition-all"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-transparent" />
              
              <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-xs px-2.5 py-1 rounded text-[11px] font-mono text-white border border-neutral-700">
                {cat.count} ITEMS
              </div>

              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                <div>
                  <h3 className="font-display font-black text-lg text-white uppercase">
                    {cat.title}
                  </h3>
                  <p className="text-neutral-400 text-xs mt-0.5 line-clamp-1">
                    {cat.subtitle}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center group-hover:bg-cyan-400 transition-colors shrink-0 ml-2">
                  <ArrowUpRight size={16} />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
