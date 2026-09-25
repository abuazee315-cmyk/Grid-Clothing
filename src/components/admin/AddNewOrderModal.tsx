import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  ShoppingBag,
  User,
  MapPin,
  CreditCard,
  Truck,
  Check,
  Palette,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product, ProductSize, OrderStatus } from '../../types';
import { formatINR } from '../../utils/currency';
import { WorldColorSearchPicker, ColorItem } from './WorldColorSearchPicker';

interface AddNewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCreated?: (orderId: string) => void;
}

interface NewOrderItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  price: number;
  costPrice: number;
  selectedColor: string;
  colorHex: string;
  selectedSize: ProductSize;
  quantity: number;
  image: string;
}

export const AddNewOrderModal: React.FC<AddNewOrderModalProps> = ({
  isOpen,
  onClose,
  onOrderCreated,
}) => {
  const { products, addManualOrder } = useStore();

  // Customer State
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('India');

  // Payment & Logistics
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery (COD)');
  const [orderStatus, setOrderStatus] = useState<OrderStatus>('Processing');
  const [shippingFee, setShippingFee] = useState<number>(0);

  // Items State
  const [items, setItems] = useState<NewOrderItem[]>([
    {
      id: `item-${Date.now()}`,
      productId: products[0]?.id || '',
      productName: products[0]?.name || 'Heavyweight Boxy Hoodie',
      sku: products[0]?.sku || 'GRD-HD-101',
      price: products[0]?.price || 4999,
      costPrice: products[0]?.costPrice || 1750,
      selectedColor: products[0]?.colors?.[0]?.name || 'Onyx Black',
      colorHex: products[0]?.colors?.[0]?.hex || '#111111',
      selectedSize: 'L',
      quantity: 1,
      image: products[0]?.images?.[0] || '',
    },
  ]);

  // Which item is actively opening the World Color Search tool
  const [activeColorPickerIndex, setActiveColorPickerIndex] = useState<number | null>(null);

  // Validation
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectProductForItem = (index: number, prodId: string) => {
    const prod = products.find((p) => p.id === prodId);
    if (!prod) return;

    setItems((prev) => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        productId: prod.id,
        productName: prod.name,
        sku: prod.sku,
        price: prod.price,
        costPrice: prod.costPrice,
        selectedColor: prod.colors?.[0]?.name || 'Onyx Black',
        colorHex: prod.colors?.[0]?.hex || '#111111',
        image: prod.images?.[0] || '',
      };
      return copy;
    });
  };

  const handleUpdateItem = (index: number, updates: Partial<NewOrderItem>) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...updates };
      return copy;
    });
  };

  const handleAddItemRow = () => {
    const defaultProd = products[0];
    setItems((prev) => [
      ...prev,
      {
        id: `item-${Date.now()}-${Math.random()}`,
        productId: defaultProd?.id || '',
        productName: defaultProd?.name || 'Heavyweight Boxy Tee',
        sku: defaultProd?.sku || 'GRD-TS-202',
        price: defaultProd?.price || 2499,
        costPrice: defaultProd?.costPrice || 850,
        selectedColor: defaultProd?.colors?.[0]?.name || 'Onyx Black',
        colorHex: defaultProd?.colors?.[0]?.hex || '#111111',
        selectedSize: 'M',
        quantity: 1,
        image: defaultProd?.images?.[0] || '',
      },
    ]);
  };

  const handleRemoveItemRow = (index: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
    if (activeColorPickerIndex === index) {
      setActiveColorPickerIndex(null);
    }
  };

  // Color selection from the World Color Search Picker
  const handleColorPicked = (index: number, color: ColorItem) => {
    handleUpdateItem(index, {
      selectedColor: color.name,
      colorHex: color.hex,
    });
  };

  // Calculations
  const subtotal = items.reduce((acc, it) => acc + it.price * it.quantity, 0);
  const tax = Math.round(subtotal * 0.12); // 12% GST
  const grandTotal = subtotal + shippingFee + tax;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setErrorMsg('Please enter customer full name.');
      return;
    }
    if (!customerEmail.trim() || !customerEmail.includes('@')) {
      setErrorMsg('Please enter a valid customer email address.');
      return;
    }
    if (!street.trim() || !city.trim()) {
      setErrorMsg('Please provide a complete street address and city.');
      return;
    }
    if (items.length === 0) {
      setErrorMsg('Please add at least one line item to the order.');
      return;
    }

    setErrorMsg(null);

    const createdOrder = addManualOrder({
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim(),
      customerPhone: customerPhone.trim() || undefined,
      shippingAddress: {
        street: street.trim(),
        city: city.trim(),
        state: state.trim(),
        zip: zip.trim() || '400001',
        country: country.trim() || 'India',
      },
      items: items.map((it) => ({
        productId: it.productId,
        productName: it.productName,
        sku: it.sku,
        price: it.price,
        costPrice: it.costPrice,
        selectedColor: it.selectedColor,
        selectedSize: it.selectedSize,
        quantity: it.quantity,
        image: it.image,
      })),
      subtotal,
      shipping: shippingFee,
      tax,
      total: grandTotal,
      status: orderStatus,
      paymentMethod,
    });

    if (onOrderCreated) {
      onOrderCreated(createdOrder.id);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-neutral-950 border border-neutral-800 rounded-xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-fadeIn">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800 bg-neutral-900/60 sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-display uppercase tracking-wide">
                CREATE NEW ORDER // MANUAL ENTRY
              </h2>
              <p className="text-[11px] text-neutral-400 font-mono">
                Log direct telephone, walk-in, or VIP order with custom world colorway selection
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {errorMsg && (
            <div className="p-3 bg-rose-950/80 border border-rose-800 rounded-lg text-rose-200 text-xs font-mono flex items-center justify-between">
              <span>{errorMsg}</span>
              <button
                type="button"
                onClick={() => setErrorMsg(null)}
                className="text-rose-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Section 1: Customer & Shipping Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold">
              <User className="w-3.5 h-3.5" />
              <span>1. Customer & Delivery Address</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Arjun Mehta"
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-md text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="arjun@example.com"
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-md text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+91 98200 12345"
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-md text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-1">
              <div className="sm:col-span-2">
                <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="402, Highline Residency, Bandra West"
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-md text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Mumbai"
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-md text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">
                  ZIP / PIN Code
                </label>
                <input
                  type="text"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  placeholder="400050"
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-md text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Order Items & Colorway Search */}
          <div className="space-y-3 pt-3 border-t border-neutral-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>2. Order Items & Colorways</span>
              </div>

              <button
                type="button"
                onClick={handleAddItemRow}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            {/* Items List */}
            <div className="space-y-3">
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-3.5 bg-neutral-900/60 border border-neutral-800 rounded-lg space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-800/80">
                    <span className="text-[11px] font-mono text-neutral-400 font-bold uppercase">
                      Item #{idx + 1} • {item.sku}
                    </span>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItemRow(idx)}
                        className="text-neutral-500 hover:text-rose-400 transition-colors p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                    {/* Select Product */}
                    <div className="sm:col-span-4">
                      <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">
                        Select Product
                      </label>
                      <select
                        value={item.productId}
                        onChange={(e) => handleSelectProductForItem(idx, e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-neutral-950 border border-neutral-800 rounded text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                      >
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.sku}) - {formatINR(p.price)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Size */}
                    <div className="sm:col-span-2">
                      <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">
                        Size
                      </label>
                      <select
                        value={item.selectedSize}
                        onChange={(e) =>
                          handleUpdateItem(idx, {
                            selectedSize: e.target.value as ProductSize,
                          })
                        }
                        className="w-full px-2 py-1.5 bg-neutral-950 border border-neutral-800 rounded text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                      >
                        {(['XS', 'S', 'M', 'L', 'XL', 'XXL'] as ProductSize[]).map((sz) => (
                          <option key={sz} value={sz}>
                            {sz}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Color with World Color Search Button */}
                    <div className="sm:col-span-4">
                      <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">
                        Colorway (World Colors)
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setActiveColorPickerIndex(
                              activeColorPickerIndex === idx ? null : idx
                            )
                          }
                          className="flex-1 flex items-center justify-between px-2.5 py-1.5 bg-neutral-950 hover:bg-neutral-900 border border-neutral-700 hover:border-cyan-400 rounded text-xs font-mono text-white transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-neutral-600 shrink-0 shadow-sm"
                              style={{ backgroundColor: item.colorHex }}
                            />
                            <span className="truncate">{item.selectedColor}</span>
                          </div>
                          <span className="text-[10px] text-cyan-400 group-hover:underline uppercase shrink-0 font-bold ml-1">
                            {activeColorPickerIndex === idx ? 'Close' : 'Search Color'}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Quantity & Unit Price */}
                    <div className="sm:col-span-2 grid grid-cols-2 gap-1.5">
                      <div>
                        <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">
                          Qty
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="99"
                          value={item.quantity}
                          onChange={(e) =>
                            handleUpdateItem(idx, {
                              quantity: Math.max(1, parseInt(e.target.value) || 1),
                            })
                          }
                          className="w-full px-2 py-1.5 bg-neutral-950 border border-neutral-800 rounded text-xs text-white focus:outline-none focus:border-cyan-400 font-mono text-center"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">
                          Price
                        </label>
                        <div className="py-1.5 text-xs font-mono text-white font-bold truncate">
                          {formatINR(item.price * item.quantity)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expandable World Color Search Picker for this item */}
                  {activeColorPickerIndex === idx && (
                    <div className="pt-2 border-t border-neutral-800 animate-fadeIn">
                      <WorldColorSearchPicker
                        selectedColors={[
                          { name: item.selectedColor, hex: item.colorHex },
                        ]}
                        onToggleColor={(c) => {
                          handleColorPicked(idx, c);
                        }}
                        singleSelect={true}
                        label={`SEARCH ANY COLOR IN THE WORLD FOR ITEM #${idx + 1}`}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Payment, Logistics & Grand Total */}
          <div className="space-y-3 pt-3 border-t border-neutral-800">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold">
              <CreditCard className="w-3.5 h-3.5" />
              <span>3. Payment & Dispatch Logistics</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-md text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                >
                  <option value="Cash on delivery (COD)">1. Cash on delivery (COD)</option>
                  <option value="Google Pay (GPay UPI)">2. Google Pay (GPay UPI)</option>
                  <option value="UPI / PhonePe / Paytm">UPI / PhonePe / Paytm</option>
                  <option value="Credit / Debit Card">Credit / Debit Card</option>
                  <option value="Direct Admin Cash">Direct Admin Cash / Walk-in</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">
                  Initial Order Status
                </label>
                <select
                  value={orderStatus}
                  onChange={(e) => setOrderStatus(e.target.value as OrderStatus)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-md text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                >
                  <option value="Processing">Processing (New Order)</option>
                  <option value="Shipped">Shipped</option>
                  <option value="On the way">On the way</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">
                  Shipping Fee (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={shippingFee}
                  onChange={(e) => setShippingFee(Math.max(0, parseInt(e.target.value) || 0))}
                  placeholder="0 for Free Express"
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-md text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
            </div>

            {/* Summary Box */}
            <div className="p-4 bg-neutral-900/80 border border-neutral-800 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1 text-xs font-mono text-neutral-400">
                <div className="flex justify-between sm:justify-start sm:gap-6">
                  <span>Subtotal ({items.reduce((a, b) => a + b.quantity, 0)} items):</span>
                  <span className="text-white">{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between sm:justify-start sm:gap-6">
                  <span>12% GST Tax:</span>
                  <span className="text-white">{formatINR(tax)}</span>
                </div>
                <div className="flex justify-between sm:justify-start sm:gap-6">
                  <span>Shipping Fee:</span>
                  <span className="text-white">
                    {shippingFee === 0 ? 'FREE EXPRESS' : formatINR(shippingFee)}
                  </span>
                </div>
              </div>

              <div className="text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-neutral-800">
                <span className="text-[10px] font-mono text-neutral-400 uppercase block">
                  Total Order Amount
                </span>
                <span className="text-2xl font-black font-mono text-cyan-400">
                  {formatINR(grandTotal)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 text-xs font-mono transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black font-mono font-bold text-xs uppercase transition-colors cursor-pointer flex items-center gap-2 shadow-lg shadow-cyan-950"
            >
              <Check className="w-4 h-4" />
              <span>Create & Save Order</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
