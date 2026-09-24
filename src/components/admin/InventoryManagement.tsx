import React, { useState, useMemo, useRef } from 'react';
import {
  Plus,
  Search,
  SlidersHorizontal,
  Edit2,
  Trash2,
  AlertTriangle,
  X,
  Package,
  Layers,
  ArrowUpDown,
  Check,
  Upload,
  Image as ImageIcon,
  RefreshCw,
  Sparkles,
  Eye,
  ArrowLeft,
  ArrowRight,
  Star,
  Camera,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product, ProductCategory, ProductSize } from '../../types';
import { formatINR } from '../../utils/currency';

// Curated 4-Photo Photoshoot Packs for Streetwear E-Commerce (Front, Back, Detail, Lifestyle)
export interface CuratedPhotoPack {
  name: string;
  category: ProductCategory;
  description: string;
  images: [string, string, string, string];
}

const CURATED_PHOTO_PACKS: CuratedPhotoPack[] = [
  {
    name: 'Heavyweight Fleece Hoodie (4 Angles)',
    category: 'hoodies',
    description: 'Front Studio • Back Silhouette • Fabric Macro • Model Street',
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000&auto=format&fit=crop&q=80',
    ],
  },
  {
    name: 'Vintage Boxy Acid Tee (4 Angles)',
    category: 'tees',
    description: 'Front Flat • Drop-Shoulder Back • Collar Rib Macro • Lifestyle Fit',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1000&auto=format&fit=crop&q=80',
    ],
  },
  {
    name: 'Technical Multi-Pocket Cargo (4 Angles)',
    category: 'pants',
    description: 'Full Front Standing • Hardware Pockets • Ripstop Weave • Sneaker Drape',
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=1000&auto=format&fit=crop&q=80',
    ],
  },
  {
    name: 'Tech Shell Cyber Parka (4 Angles)',
    category: 'jackets',
    description: 'Front Shell • AquaGuard Zippers • Membrane Macro • Night Urban Stance',
    images: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1000&auto=format&fit=crop&q=80',
    ],
  },
  {
    name: 'Modular Ballistic Sling (4 Angles)',
    category: 'accessories',
    description: 'Front Angle • Open Pocket Layout • Ballistic Nylon Weave • Crossbody Fit',
    images: [
      'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1000&auto=format&fit=crop&q=80',
    ],
  },
];

const PHOTO_SLOT_GUIDES = [
  { label: 'Photo 1 • Cover / Front View', hint: 'Primary catalog thumbnail & cover angle', isPrimary: true },
  { label: 'Photo 2 • Back / Silhouette', hint: 'Displayed on storefront card hover & back view' },
  { label: 'Photo 3 • Fabric / Macro Detail', hint: 'Close-up texture, stitch, tags, or hardware' },
  { label: 'Photo 4 • On-Body / Lifestyle Fit', hint: 'Streetwear drape and model movement' },
  { label: 'Photo 5 • Extra Angle', hint: 'Additional alternative perspective' },
];

const AVAILABLE_SIZES: ProductSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const COLOR_PRESETS = [
  { name: 'Onyx Black', hex: '#111111' },
  { name: 'Chalk White', hex: '#F3F4F6' },
  { name: 'Washed Charcoal', hex: '#374151' },
  { name: 'Vintage Olive', hex: '#4D5340' },
  { name: 'Cobalt Blue', hex: '#1E40AF' },
  { name: 'Crimson Red', hex: '#991B1B' },
  { name: 'Cyber Neon', hex: '#06B6D4' },
];

export const InventoryManagement: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all');
  const [sortField, setSortField] = useState<'name' | 'stock' | 'price' | 'sku'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const multiFileInputRef = useRef<HTMLInputElement>(null);
  const slotFileInputRef = useRef<HTMLInputElement>(null);
  const [activeUploadSlot, setActiveUploadSlot] = useState<number | null>(null);
  const [previewPhotoIndex, setPreviewPhotoIndex] = useState(0);

  // Form State for Adding / Editing (Stores full array of 3 or 4 photos)
  const [formData, setFormData] = useState<{
    name: string;
    sku: string;
    category: ProductCategory;
    price: number;
    costPrice: number;
    stock: number;
    description: string;
    fabricDetails: string;
    fitDetails: string;
    badge: string;
    images: string[];
    selectedSizes: ProductSize[];
    selectedColors: { name: string; hex: string }[];
  }>({
    name: '',
    sku: '',
    category: 'hoodies',
    price: 4999,
    costPrice: 1750,
    stock: 25,
    description: 'Constructed from premium heavyweight combed cotton with reinforced seams and relaxed drape.',
    fabricDetails: '100% Combed Heavy Cotton (480 GSM)',
    fitDetails: 'Relaxed Boxy Drop-Shoulder Silhouette',
    badge: 'NEW DROP',
    images: [...CURATED_PHOTO_PACKS[0].images],
    selectedSizes: ['S', 'M', 'L', 'XL'],
    selectedColors: [
      { name: 'Onyx Black', hex: '#111111' },
      { name: 'Washed Charcoal', hex: '#374151' },
    ],
  });

  const generateSku = (cat: string) => {
    const prefixMap: Record<string, string> = {
      hoodies: 'HD',
      tees: 'TS',
      pants: 'PT',
      jackets: 'JK',
      accessories: 'AC',
    };
    const code = prefixMap[cat] || 'ST';
    return `GRD-${code}-${Math.floor(100 + Math.random() * 900)}`;
  };

  const handleOpenAddModal = () => {
    const defaultCat = 'hoodies';
    const pack = CURATED_PHOTO_PACKS.find((p) => p.category === defaultCat) || CURATED_PHOTO_PACKS[0];
    setFormData({
      name: '',
      sku: generateSku(defaultCat),
      category: defaultCat,
      price: 4999,
      costPrice: 1750,
      stock: 25,
      description: 'Heavyweight streetwear construction with tailored drape and reinforced double-needle seams.',
      fabricDetails: '100% Combed Heavy Cotton (480 GSM)',
      fitDetails: 'Relaxed Boxy Drop-Shoulder Silhouette',
      badge: 'NEW DROP',
      images: [...pack.images],
      selectedSizes: ['S', 'M', 'L', 'XL'],
      selectedColors: [
        { name: 'Onyx Black', hex: '#111111' },
        { name: 'Washed Charcoal', hex: '#374151' },
      ],
    });
    setPreviewPhotoIndex(0);
    setEditingProduct(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    const catPack = CURATED_PHOTO_PACKS.find((cp) => cp.category === p.category) || CURATED_PHOTO_PACKS[0];
    const loadedImages = p.images && p.images.length > 0 ? [...p.images] : [...catPack.images];
    // Ensure at least 3-4 images loaded
    if (loadedImages.length < 4) {
      for (let i = loadedImages.length; i < 4; i++) {
        if (catPack.images[i]) loadedImages.push(catPack.images[i]);
      }
    }
    setFormData({
      name: p.name,
      sku: p.sku,
      category: p.category,
      price: p.price,
      costPrice: p.costPrice,
      stock: p.stock,
      description: p.description,
      fabricDetails: p.fabricDetails,
      fitDetails: p.fitDetails,
      badge: p.badge || '',
      images: loadedImages,
      selectedSizes: p.sizes || ['S', 'M', 'L', 'XL'],
      selectedColors: p.colors || [{ name: 'Onyx Black', hex: '#111111' }],
    });
    setPreviewPhotoIndex(0);
    setIsAddModalOpen(true);
  };

  // Upload Multiple Photos from Device (select 3-4 photos at once)
  const handleMultipleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 4);
    if (files.length === 0) return;
    const readers = files.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (loadEvt) => resolve(loadEvt.target?.result as string);
        reader.readAsDataURL(file);
      });
    });
    Promise.all(readers).then((newUrls) => {
      setFormData((prev) => {
        const updated = [...newUrls, ...prev.images.slice(newUrls.length)].slice(0, 4);
        return { ...prev, images: updated };
      });
      setPreviewPhotoIndex(0);
    });
    e.target.value = '';
  };

  // Upload single photo to a specific slot (1, 2, 3, or 4)
  const triggerSlotUpload = (idx: number) => {
    setActiveUploadSlot(idx);
    slotFileInputRef.current?.click();
  };

  const handleSlotFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (activeUploadSlot === null) return;
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        if (loadEvt.target?.result) {
          const url = loadEvt.target.result as string;
          setFormData((prev) => {
            const copy = [...prev.images];
            copy[activeUploadSlot] = url;
            return { ...prev, images: copy };
          });
        }
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const updateImageSlot = (idx: number, url: string) => {
    setFormData((prev) => {
      const copy = [...prev.images];
      copy[idx] = url;
      return { ...prev, images: copy };
    });
  };

  const removeImageSlot = (idx: number) => {
    setFormData((prev) => {
      if (prev.images.length <= 1) return prev;
      const copy = prev.images.filter((_, i) => i !== idx);
      return { ...prev, images: copy };
    });
    setPreviewPhotoIndex(0);
  };

  const moveImageSlot = (from: number, to: number) => {
    setFormData((prev) => {
      if (to < 0 || to >= prev.images.length) return prev;
      const copy = [...prev.images];
      const [item] = copy.splice(from, 1);
      copy.splice(to, 0, item);
      return { ...prev, images: copy };
    });
    setPreviewPhotoIndex(to);
  };

  const setPrimarySlot = (idx: number) => {
    if (idx === 0) return;
    moveImageSlot(idx, 0);
  };

  const addPhotoSlot = () => {
    setFormData((prev) => {
      if (prev.images.length >= 6) return prev;
      const catPack = CURATED_PHOTO_PACKS.find((p) => p.category === prev.category) || CURATED_PHOTO_PACKS[0];
      const fallbackUrl = catPack.images[prev.images.length % catPack.images.length];
      return { ...prev, images: [...prev.images, fallbackUrl] };
    });
  };

  const applyPhotoPack = (pack: CuratedPhotoPack) => {
    setFormData((prev) => ({
      ...prev,
      images: [...pack.images],
    }));
    setPreviewPhotoIndex(0);
  };

  // Toggle size
  const toggleSize = (sz: ProductSize) => {
    setFormData((prev) => {
      const exists = prev.selectedSizes.includes(sz);
      const updated = exists
        ? prev.selectedSizes.filter((s) => s !== sz)
        : [...prev.selectedSizes, sz];
      return { ...prev, selectedSizes: updated.length > 0 ? updated : [sz] };
    });
  };

  // Toggle color
  const toggleColor = (c: { name: string; hex: string }) => {
    setFormData((prev) => {
      const exists = prev.selectedColors.some((item) => item.name === c.name);
      const updated = exists
        ? prev.selectedColors.filter((item) => item.name !== c.name)
        : [...prev.selectedColors, c];
      return { ...prev, selectedColors: updated.length > 0 ? updated : [c] };
    });
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    const validImages = formData.images.filter((img) => typeof img === 'string' && img.trim().length > 0);
    const finalImages = validImages.length > 0 ? validImages : [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=1000&auto=format&fit=crop&q=80',
    ];

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: formData.name,
        sku: formData.sku,
        category: formData.category,
        price: Number(formData.price),
        costPrice: Number(formData.costPrice),
        stock: Number(formData.stock),
        description: formData.description,
        fabricDetails: formData.fabricDetails,
        fitDetails: formData.fitDetails,
        badge: formData.badge || undefined,
        images: finalImages,
        sizes: formData.selectedSizes,
        colors: formData.selectedColors,
      });
      setSuccessToast(`Product "${formData.name}" updated with ${finalImages.length} photos!`);
    } else {
      addProduct({
        name: formData.name,
        sku: formData.sku,
        category: formData.category,
        price: Number(formData.price),
        costPrice: Number(formData.costPrice),
        stock: Number(formData.stock),
        rating: 5.0,
        reviewsCount: 1,
        isTrending: false,
        isNewArrival: true,
        badge: formData.badge || 'NEW DROP',
        colors: formData.selectedColors,
        sizes: formData.selectedSizes,
        images: finalImages,
        description: formData.description,
        fabricDetails: formData.fabricDetails,
        fitDetails: formData.fitDetails,
      });
      setSuccessToast(`Product "${formData.name}" published with ${finalImages.length} photos!`);
    }

    setIsAddModalOpen(false);
    setEditingProduct(null);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
        if (stockFilter === 'low' && (p.stock > 15 || p.stock === 0)) return false;
        if (stockFilter === 'out' && p.stock > 0) return false;

        if (search.trim()) {
          const q = search.toLowerCase();
          return (
            p.name.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        if (typeof valA === 'string') {
          return sortOrder === 'asc'
            ? valA.localeCompare(valB as string)
            : (valB as string).localeCompare(valA);
        } else {
          return sortOrder === 'asc'
            ? (valA as number) - (valB as number)
            : (valB as number) - (valA as number);
        }
      });
  }, [products, search, selectedCategory, stockFilter, sortField, sortOrder]);

  const handleSortToggle = (field: typeof sortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto text-white">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-800 gap-4">
        <div>
          <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest">
            // INVENTORY CONTROL
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white uppercase mt-1">
            SKU & WAREHOUSE CONTROL
          </h1>
        </div>

        <button
          id="admin-add-product-btn"
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-black font-mono text-xs font-bold uppercase rounded flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Plus size={16} />
          <span>Add New Product SKU</span>
        </button>
      </div>

      {/* Control Bar: Search & Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        {/* Search */}
        <div className="sm:col-span-5 relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by Name, SKU, or Category..."
            className="w-full pl-9 pr-4 py-2 bg-neutral-900 border border-neutral-800 rounded-md text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Category Filter */}
        <div className="sm:col-span-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-md text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
          >
            <option value="all">All Categories ({products.length} SKUs)</option>
            <option value="hoodies">Heavyweight Hoodies</option>
            <option value="tees">Boxy Tees</option>
            <option value="pants">Technical Pants & Cargo</option>
            <option value="jackets">Outerwear & Bombers</option>
            <option value="accessories">Modular Accessories</option>
          </select>
        </div>

        {/* Stock status filter */}
        <div className="sm:col-span-3">
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value as any)}
            className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-md text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
          >
            <option value="all">All Stock Statuses</option>
            <option value="low">Low Stock (≤15 units)</option>
            <option value="out">Out of Stock (0 units)</option>
          </select>
        </div>
      </div>

      {/* Main Inventory Data Table */}
      <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-neutral-900/90 text-neutral-400 uppercase text-[10px] border-b border-neutral-800">
              <tr>
                <th className="py-3 px-4">Item</th>
                <th
                  onClick={() => handleSortToggle('sku')}
                  className="py-3 px-4 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>SKU</span>
                    <ArrowUpDown size={11} />
                  </div>
                </th>
                <th className="py-3 px-4">Category</th>
                <th
                  onClick={() => handleSortToggle('price')}
                  className="py-3 px-4 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>Retail</span>
                    <ArrowUpDown size={11} />
                  </div>
                </th>
                <th className="py-3 px-4">Cost Price</th>
                <th className="py-3 px-4">Margin %</th>
                <th
                  onClick={() => handleSortToggle('stock')}
                  className="py-3 px-4 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>Stock</span>
                    <ArrowUpDown size={11} />
                  </div>
                </th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {filteredProducts.map((p) => {
                const marginPercent = Math.round(((p.price - p.costPrice) / p.price) * 100);
                const isLowStock = p.stock > 0 && p.stock <= 15;
                const isOutOfStock = p.stock === 0;

                return (
                  <tr key={p.id} className="hover:bg-neutral-800/40 transition-colors">
                    {/* Item thumbnail and name */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative shrink-0">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-10 h-12 object-cover rounded bg-neutral-900 border border-neutral-800"
                            referrerPolicy="no-referrer"
                          />
                          <span
                            title={`${p.images.length} photoshoot angles`}
                            className="absolute -bottom-1 -right-1 px-1 py-0.5 bg-neutral-950 text-cyan-400 border border-neutral-700 text-[8px] font-bold rounded flex items-center gap-0.5 shadow-sm"
                          >
                            <Camera size={8} />
                            {p.images.length}
                          </span>
                        </div>
                        <div className="max-w-xs">
                          <p className="font-bold text-white line-clamp-1">{p.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-neutral-400">{p.sizes.join(', ')}</span>
                            <span className="text-[9px] text-cyan-400/80 font-mono">
                              • {p.images.length} Photos
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* SKU */}
                    <td className="py-3 px-4 font-bold text-cyan-400">{p.sku}</td>

                    {/* Category */}
                    <td className="py-3 px-4 uppercase text-neutral-300">{p.category}</td>

                    {/* Price */}
                    <td className="py-3 px-4 font-bold text-white">{formatINR(p.price)}</td>

                    {/* Cost */}
                    <td className="py-3 px-4 text-neutral-400">{formatINR(p.costPrice)}</td>

                    {/* Margin */}
                    <td className="py-3 px-4">
                      <span className="text-emerald-400 font-bold">{marginPercent}%</span>
                    </td>

                    {/* Stock units */}
                    <td className="py-3 px-4 font-bold text-white">{p.stock} units</td>

                    {/* Status Badge */}
                    <td className="py-3 px-4">
                      {isOutOfStock ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950/60 text-rose-400 border border-rose-800">
                          OUT OF STOCK
                        </span>
                      ) : isLowStock ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950/60 text-amber-400 border border-amber-800">
                          LOW STOCK ({p.stock})
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800">
                          OPTIMAL ({p.stock})
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-cyan-400 transition-colors"
                          title="Edit SKU"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setProductToDelete(p)}
                          className="p-1.5 rounded hover:bg-rose-500/20 text-neutral-400 hover:text-rose-400 transition-colors cursor-pointer"
                          title={`Delete SKU ${p.sku}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-12 text-center text-xs font-mono text-neutral-400">
            No products found matching the current search & filters.
          </div>
        )}
      </div>

      {/* Success Notification Toast */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 border border-emerald-500/50 text-white px-4 py-3 rounded-lg shadow-2xl flex items-center gap-3 animate-fade-in font-mono text-xs">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-emerald-400">{successToast}</span>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <div
            className="fixed inset-0 bg-black/85 backdrop-blur-xs"
            onClick={() => {
              setIsAddModalOpen(false);
              setEditingProduct(null);
            }}
          />

          <div className="relative w-full max-w-4xl bg-neutral-950 border border-neutral-800 rounded-xl shadow-2xl z-10 overflow-hidden text-white flex flex-col max-h-[90vh]">
            <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/70">
              <div className="flex items-center gap-2.5">
                <Package size={18} className="text-cyan-400" />
                <h3 className="font-display font-bold text-base uppercase text-white tracking-wide">
                  {editingProduct ? `EDIT SKU: ${editingProduct.sku}` : 'ADD NEW PRODUCT TO STOREFRONT'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingProduct(null);
                }}
                className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-5 space-y-5 overflow-y-auto text-xs font-mono">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Form Fields */}
                <div className="lg:col-span-7 space-y-4">
                  {/* Product Title */}
                  <div className="space-y-1">
                    <label className="text-neutral-400 uppercase text-[10px] font-bold">Product Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-2.5 bg-neutral-900 border border-neutral-800 rounded text-white focus:outline-none focus:border-cyan-400"
                      placeholder="e.g. Acid-Wash Heavyweight Oversized Hoodie 480GSM"
                    />
                  </div>

                  {/* SKU and Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-neutral-400 uppercase text-[10px] font-bold">SKU Code *</label>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, sku: generateSku(formData.category) })}
                          className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <RefreshCw size={10} />
                          <span>Generate</span>
                        </button>
                      </div>
                      <input
                        type="text"
                        required
                        value={formData.sku}
                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                        className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded text-white focus:outline-none focus:border-cyan-400 uppercase"
                        placeholder="GRD-HD-101"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-neutral-400 uppercase text-[10px] font-bold">Category *</label>
                      <select
                        value={formData.category}
                        onChange={(e) => {
                          const cat = e.target.value as ProductCategory;
                          setFormData({
                            ...formData,
                            category: cat,
                            sku: generateSku(cat),
                          });
                        }}
                        className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded text-white focus:outline-none focus:border-cyan-400"
                      >
                        <option value="hoodies">Heavyweight Hoodies</option>
                        <option value="tees">Boxy Tees</option>
                        <option value="pants">Technical Cargo & Pants</option>
                        <option value="jackets">Outerwear & Bombers</option>
                        <option value="accessories">Modular Accessories</option>
                      </select>
                    </div>
                  </div>

                  {/* Pricing and Stock */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-neutral-400 uppercase text-[10px] font-bold">Retail Price (₹) *</label>
                      <input
                        type="number"
                        min={1}
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                        className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-neutral-400 uppercase text-[10px] font-bold">Cost Price (₹) *</label>
                      <input
                        type="number"
                        min={1}
                        required
                        value={formData.costPrice}
                        onChange={(e) => setFormData({ ...formData, costPrice: Number(e.target.value) })}
                        className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-neutral-400 uppercase text-[10px] font-bold">Stock Units *</label>
                      <input
                        type="number"
                        min={0}
                        required
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                        className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  {/* Promo Badge */}
                  <div className="space-y-1">
                    <label className="text-neutral-400 uppercase text-[10px] font-bold">Promo Badge</label>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {['NEW DROP', 'BESTSELLER', 'LIMITED RUN', 'ARCHIVE SALE'].map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setFormData({ ...formData, badge: formData.badge === b ? '' : b })}
                          className={`px-2 py-1 rounded text-[10px] uppercase font-bold border transition-colors cursor-pointer ${
                            formData.badge === b
                              ? 'bg-cyan-400 text-black border-cyan-400'
                              : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                      <input
                        type="text"
                        value={formData.badge}
                        onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                        className="flex-1 min-w-[120px] p-1.5 bg-neutral-900 border border-neutral-800 rounded text-white text-[11px] focus:outline-none focus:border-cyan-400"
                        placeholder="Or custom badge..."
                      />
                    </div>
                  </div>

                  {/* Sizes Selection */}
                  <div className="space-y-1.5">
                    <label className="text-neutral-400 uppercase text-[10px] font-bold">Available Sizes</label>
                    <div className="flex items-center gap-2 flex-wrap">
                      {AVAILABLE_SIZES.map((sz) => {
                        const isSelected = formData.selectedSizes.includes(sz);
                        return (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => toggleSize(sz)}
                            className={`px-3 py-1.5 rounded text-xs font-bold border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-white text-black border-white shadow-sm'
                                : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-700'
                            }`}
                          >
                            {sz}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Colors Selection */}
                  <div className="space-y-1.5">
                    <label className="text-neutral-400 uppercase text-[10px] font-bold">Colorways</label>
                    <div className="flex items-center gap-2 flex-wrap">
                      {COLOR_PRESETS.map((c) => {
                        const isSelected = formData.selectedColors.some((item) => item.name === c.name);
                        return (
                          <button
                            key={c.name}
                            type="button"
                            onClick={() => toggleColor(c)}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-neutral-800 text-white border-cyan-400'
                                : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-700'
                            }`}
                          >
                            <span
                              className="w-3 h-3 rounded-full border border-neutral-600 shrink-0"
                              style={{ backgroundColor: c.hex }}
                            />
                            <span>{c.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Fabric & Fit Details */}
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <label className="text-neutral-400 uppercase text-[10px] font-bold">Fabric Details & GSM</label>
                      <input
                        type="text"
                        value={formData.fabricDetails}
                        onChange={(e) => setFormData({ ...formData, fabricDetails: e.target.value })}
                        className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded text-white focus:outline-none focus:border-cyan-400"
                        placeholder="100% Combed Heavy Cotton (480 GSM)"
                      />
                      <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                        {[
                          '100% Heavy Cotton (480 GSM)',
                          'Diagonal French Terry (420 GSM)',
                          'Compact Single Jersey (260 GSM)',
                          'Nylon Ripstop 2-Ply Technical Fabric',
                        ].map((fab) => (
                          <button
                            key={fab}
                            type="button"
                            onClick={() => setFormData({ ...formData, fabricDetails: fab })}
                            className="text-[9px] text-neutral-400 bg-neutral-900 hover:text-white px-2 py-0.5 rounded border border-neutral-800 cursor-pointer"
                          >
                            {fab}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-neutral-400 uppercase text-[10px] font-bold">Fit Details</label>
                      <input
                        type="text"
                        value={formData.fitDetails}
                        onChange={(e) => setFormData({ ...formData, fitDetails: e.target.value })}
                        className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded text-white focus:outline-none focus:border-cyan-400"
                        placeholder="Relaxed Boxy Drop-Shoulder Silhouette"
                      />
                    </div>
                  </div>

                  {/* Product Description */}
                  <div className="space-y-1">
                    <label className="text-neutral-400 uppercase text-[10px] font-bold">Product Description</label>
                    <textarea
                      rows={2}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded text-white focus:outline-none focus:border-cyan-400 font-sans text-xs"
                    />
                  </div>
                </div>

                {/* Right Column: Multi-Photo Manager (3 or 4 Photos Standard) & Live Preview */}
                <div className="lg:col-span-5 space-y-4">
                  {/* Photo Lookbook Management Box */}
                  <div className="p-4 bg-neutral-900/60 border border-neutral-800 rounded-lg space-y-3">
                    <div className="flex items-center justify-between pb-1 border-b border-neutral-800/80">
                      <span className="text-cyan-400 uppercase font-bold text-[10px] flex items-center gap-1.5">
                        <Camera size={13} />
                        <span>PRODUCT LOOKBOOK PHOTOS</span>
                      </span>
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                          formData.images.length >= 3 && formData.images.length <= 4
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : formData.images.length > 4
                            ? 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                            : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}
                      >
                        {formData.images.length} / 4 Photos Configured
                      </span>
                    </div>

                    <p className="text-[10px] text-neutral-400">
                      Streetwear standard requires <strong className="text-white">3 to 4 distinct angles</strong> (Front Cover, Back Silhouette, Fabric Macro, Lifestyle Fit) for high conversions.
                    </p>

                    {/* Hidden File Inputs */}
                    <input
                      type="file"
                      ref={multiFileInputRef}
                      onChange={handleMultipleFileUpload}
                      accept="image/*"
                      multiple
                      className="hidden"
                    />
                    <input
                      type="file"
                      ref={slotFileInputRef}
                      onChange={handleSlotFileUpload}
                      accept="image/*"
                      className="hidden"
                    />

                    {/* Quick Batch Actions */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => multiFileInputRef.current?.click()}
                        className="py-2 px-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded border border-neutral-700 font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors text-[11px]"
                      >
                        <Upload size={13} className="text-cyan-400" />
                        <span>Upload 3–4 Files</span>
                      </button>

                      <button
                        type="button"
                        onClick={addPhotoSlot}
                        disabled={formData.images.length >= 5}
                        className="py-2 px-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white rounded border border-neutral-800 font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors text-[11px] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus size={13} className="text-emerald-400" />
                        <span>Add Angle Slot</span>
                      </button>
                    </div>

                    {/* Curated 4-Photo Photoshoot Sets (1-Click Apply) */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-neutral-400 uppercase font-bold flex items-center gap-1">
                          <Sparkles size={11} className="text-amber-400" />
                          <span>1-Click Curated 4-Angle Shoots</span>
                        </span>
                        <span className="text-[9px] text-neutral-500 font-mono">4 Angles per pack</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {CURATED_PHOTO_PACKS.map((pack) => (
                          <button
                            key={pack.name}
                            type="button"
                            onClick={() => applyPhotoPack(pack)}
                            className="p-1.5 rounded bg-neutral-950 hover:bg-neutral-800/80 border border-neutral-800 hover:border-cyan-500/50 transition-all text-left flex items-center gap-2 cursor-pointer group"
                          >
                            {/* 4 Mini Tiles */}
                            <div className="grid grid-cols-2 gap-0.5 w-8 h-10 shrink-0 rounded overflow-hidden bg-neutral-900 border border-neutral-800">
                              {pack.images.map((img, i) => (
                                <img
                                  key={i}
                                  src={img}
                                  alt=""
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              ))}
                            </div>
                            <div className="min-w-0">
                              <p className="text-[10px] font-bold text-white group-hover:text-cyan-400 truncate">
                                {pack.name.split(' (')[0]}
                              </p>
                              <p className="text-[8px] text-neutral-400 truncate font-sans">
                                {pack.category.toUpperCase()} • 4 Angles
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Individual Photo Slots (1 to 4) */}
                    <div className="space-y-2 pt-2 border-t border-neutral-800/80">
                      <span className="text-[10px] text-neutral-400 uppercase font-bold block">
                        Configured Angles ({formData.images.length} Photos)
                      </span>

                      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                        {formData.images.map((imgUrl, idx) => {
                          const guide = PHOTO_SLOT_GUIDES[idx] || {
                            label: `Photo ${idx + 1} • Extra Perspective`,
                            hint: 'Additional lookbook angle',
                            isPrimary: false,
                          };

                          return (
                            <div
                              key={idx}
                              className={`p-2.5 rounded-lg border transition-all ${
                                previewPhotoIndex === idx
                                  ? 'bg-neutral-950 border-cyan-500/80 ring-1 ring-cyan-500/30'
                                  : 'bg-neutral-950/70 border-neutral-800 hover:border-neutral-700'
                              }`}
                            >
                              {/* Slot Header */}
                              <div className="flex items-center justify-between mb-1.5">
                                <div className="flex items-center gap-1.5">
                                  <span
                                    className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                                      idx === 0
                                        ? 'bg-cyan-400 text-black'
                                        : 'bg-neutral-800 text-neutral-300'
                                    }`}
                                  >
                                    {idx === 0 ? '★ Primary Cover' : `Angle ${idx + 1}`}
                                  </span>
                                  <span className="text-[10px] text-neutral-300 font-bold truncate">
                                    {guide.label.split(' • ')[1] || guide.label}
                                  </span>
                                </div>

                                {/* Slot Controls */}
                                <div className="flex items-center gap-1">
                                  {idx > 0 && (
                                    <button
                                      type="button"
                                      onClick={() => setPrimarySlot(idx)}
                                      title="Set as Primary Cover (Photo 1)"
                                      className="p-1 text-neutral-400 hover:text-amber-400 rounded hover:bg-neutral-800 cursor-pointer"
                                    >
                                      <Star size={12} />
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => moveImageSlot(idx, idx - 1)}
                                    disabled={idx === 0}
                                    title="Move Left/Up"
                                    className="p-1 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                  >
                                    <ChevronLeft size={13} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => moveImageSlot(idx, idx + 1)}
                                    disabled={idx === formData.images.length - 1}
                                    title="Move Right/Down"
                                    className="p-1 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                  >
                                    <ChevronRight size={13} />
                                  </button>
                                  {formData.images.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => removeImageSlot(idx)}
                                      title="Remove this photo"
                                      className="p-1 text-neutral-500 hover:text-rose-400 rounded hover:bg-neutral-800 cursor-pointer"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  )}
                                </div>
                              </div>

                              {/* Slot Row */}
                              <div className="flex items-center gap-2">
                                {/* Thumbnail (Clickable to Preview on Card) */}
                                <button
                                  type="button"
                                  onClick={() => setPreviewPhotoIndex(idx)}
                                  className={`relative w-12 h-14 rounded overflow-hidden shrink-0 border transition-all ${
                                    previewPhotoIndex === idx
                                      ? 'border-cyan-400 ring-2 ring-cyan-400/40'
                                      : 'border-neutral-700 opacity-80 hover:opacity-100'
                                  }`}
                                  title="Click to preview on live storefront card"
                                >
                                  <img
                                    src={imgUrl}
                                    alt={`Angle ${idx + 1}`}
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                  <div className="absolute inset-x-0 bottom-0 bg-black/70 py-0.5 text-center text-[7px] text-white">
                                    {previewPhotoIndex === idx ? 'PREVIEW' : `#${idx + 1}`}
                                  </div>
                                </button>

                                {/* URL Input & Slot Upload */}
                                <div className="flex-1 space-y-1 min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <input
                                      type="url"
                                      required
                                      value={imgUrl}
                                      onChange={(e) => updateImageSlot(idx, e.target.value)}
                                      className="flex-1 p-1.5 bg-neutral-900 border border-neutral-800 rounded text-white text-[11px] focus:outline-none focus:border-cyan-400 font-mono"
                                      placeholder="https://images.unsplash.com/..."
                                    />
                                    <button
                                      type="button"
                                      onClick={() => triggerSlotUpload(idx)}
                                      className="px-2 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white rounded border border-neutral-700 font-bold text-[10px] shrink-0 flex items-center gap-1 cursor-pointer"
                                      title="Replace this photo with file from computer"
                                    >
                                      <Upload size={11} className="text-cyan-400" />
                                      <span>Upload</span>
                                    </button>
                                  </div>
                                  <p className="text-[8px] text-neutral-500 truncate font-sans">
                                    {guide.hint}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Live Storefront Card Preview with 4-Photo Switcher */}
                  <div className="p-4 bg-neutral-900/60 border border-neutral-800 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-400 uppercase font-bold text-[10px] flex items-center gap-1.5">
                        <Eye size={12} className="text-cyan-400" />
                        <span>STOREFRONT CARD PREVIEW</span>
                      </span>
                      <span className="text-[9px] text-cyan-400 font-mono font-bold">
                        Angle {previewPhotoIndex + 1} of {formData.images.length}
                      </span>
                    </div>

                    <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-3 space-y-2.5">
                      {/* Main Preview Image */}
                      <div className="relative aspect-4/5 w-full bg-neutral-900 rounded overflow-hidden border border-neutral-800/80">
                        <img
                          src={formData.images[previewPhotoIndex] || formData.images[0]}
                          alt={formData.name || 'Product Preview'}
                          className="w-full h-full object-cover transition-all duration-300"
                          referrerPolicy="no-referrer"
                        />
                        {formData.badge && (
                          <div className="absolute top-2 left-2">
                            <span className="px-2 py-0.5 bg-cyan-400 text-black font-bold text-[9px] uppercase tracking-wider rounded">
                              {formData.badge}
                            </span>
                          </div>
                        )}
                        <div className="absolute top-2 right-2">
                          <span className="px-1.5 py-0.5 bg-black/80 text-white font-mono text-[9px] rounded backdrop-blur-xs border border-white/10 flex items-center gap-1">
                            <Camera size={9} className="text-cyan-400" />
                            {formData.images.length} Photos
                          </span>
                        </div>
                        <div className="absolute bottom-2 right-2">
                          <span className="px-1.5 py-0.5 bg-black/80 text-white font-mono text-[9px] rounded backdrop-blur-xs">
                            {formData.stock > 0 ? `${formData.stock} in stock` : 'Out of stock'}
                          </span>
                        </div>
                      </div>

                      {/* Interactive 4-Thumbnail Switcher Strip */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[9px] text-neutral-400">
                          <span>Interactive Photo Test (Click angles to inspect):</span>
                        </div>
                        <div className="grid grid-cols-4 gap-1.5">
                          {formData.images.map((img, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setPreviewPhotoIndex(i)}
                              className={`relative aspect-4/5 rounded overflow-hidden border transition-all cursor-pointer ${
                                previewPhotoIndex === i
                                  ? 'border-cyan-400 ring-2 ring-cyan-400/40 scale-102'
                                  : 'border-neutral-800 opacity-70 hover:opacity-100'
                              }`}
                            >
                              <img
                                src={img}
                                alt={`Angle ${i + 1}`}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-x-0 bottom-0 bg-black/75 py-0.5 text-center text-[7px] text-white font-mono">
                                #{i + 1}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] text-cyan-400 font-bold uppercase">{formData.category}</span>
                        <h4 className="font-bold text-white text-xs truncate">
                          {formData.name || 'Product Name (Fill in on left)'}
                        </h4>
                        <div className="flex items-center justify-between mt-1">
                          <span className="font-mono text-cyan-400 font-bold text-sm">
                            {formatINR(formData.price)}
                          </span>
                          <span className="text-[10px] text-neutral-500 font-mono">
                            Cost: {formatINR(formData.costPrice)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-3 pt-4 border-t border-neutral-800">
                <div>
                  {editingProduct && (
                    <button
                      type="button"
                      onClick={() => setProductToDelete(editingProduct)}
                      className="px-3.5 py-2 rounded bg-rose-950/60 hover:bg-rose-900 border border-rose-800/80 text-rose-300 hover:text-rose-100 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Trash2 size={13} />
                      <span>Delete SKU</span>
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setEditingProduct(null);
                    }}
                    className="px-4 py-2 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded bg-cyan-400 hover:bg-cyan-300 text-black font-bold uppercase transition-colors cursor-pointer flex items-center gap-2 shadow-lg shadow-cyan-950"
                  >
                    <Check size={14} />
                    <span>{editingProduct ? 'Update Product' : 'Publish Product to Store'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete SKU Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/85 backdrop-blur-xs animate-fade-in"
            onClick={() => setProductToDelete(null)}
          />
          <div className="relative bg-neutral-950 border border-rose-600/50 rounded-xl p-6 max-w-md w-full shadow-2xl z-10 space-y-5 animate-scale-up font-mono">
            {/* Header */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                <AlertTriangle size={20} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-display font-black text-sm uppercase tracking-wide">
                    Confirm SKU Deletion
                  </h3>
                  <button
                    onClick={() => setProductToDelete(null)}
                    className="p-1 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>
                <p className="text-neutral-400 text-xs mt-1">
                  Are you sure you want to permanently delete this product from the inventory and storefront?
                </p>
              </div>
            </div>

            {/* Product Snapshot Card */}
            <div className="p-3 bg-neutral-900/90 border border-neutral-800 rounded-lg flex items-center gap-3">
              <div className="w-12 h-14 bg-black rounded overflow-hidden shrink-0 border border-neutral-700">
                <img
                  src={productToDelete.images[0]}
                  alt={productToDelete.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                  {productToDelete.sku}
                </span>
                <h4 className="text-white text-xs font-bold truncate">
                  {productToDelete.name}
                </h4>
                <div className="flex items-center gap-3 text-[11px] text-neutral-400 mt-0.5">
                  <span className="text-white font-bold">{formatINR(productToDelete.price)}</span>
                  <span>•</span>
                  <span>{productToDelete.stock} units in stock</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-rose-950/20 border border-rose-900/40 rounded-lg text-rose-300/90 text-[11px] leading-relaxed">
              ⚠️ <strong>Warning:</strong> This will instantly remove this SKU from customer catalog, search index, and stock records.
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const skuCode = productToDelete.sku;
                  const prodName = productToDelete.name;
                  deleteProduct(productToDelete.id);
                  if (editingProduct?.id === productToDelete.id) {
                    setEditingProduct(null);
                    setIsAddModalOpen(false);
                  }
                  setProductToDelete(null);
                  setSuccessToast(`SKU ${skuCode} ("${prodName}") successfully deleted.`);
                  setTimeout(() => setSuccessToast(null), 4000);
                }}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase transition-colors flex items-center gap-2 cursor-pointer shadow-lg shadow-rose-950"
              >
                <Trash2 size={14} />
                <span>Delete Permanently</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
