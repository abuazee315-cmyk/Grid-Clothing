import React from 'react';
import { Printer, X, CheckCircle, Truck, Calendar, MapPin, Tag } from 'lucide-react';
import { Order } from '../../types';
import { formatINR } from '../../utils/currency';
import { GridBrandLogo } from './GridBrandLogo';

interface ProductBillModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductBillModal: React.FC<ProductBillModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedOrderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const formattedDispatchDate = order.dispatchDate
    ? new Date(order.dispatchDate).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Scheduled within 24 Hours';

  const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div
      id="product-bill-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto"
    >
      <div className="relative w-full h-full sm:h-auto my-0 sm:my-auto max-w-4xl bg-neutral-950 sm:border border-neutral-800 sm:rounded-xl shadow-2xl overflow-hidden flex flex-col sm:max-h-[95vh]">
        {/* Top Control Bar (Hidden when printed) */}
        <div className="no-print flex items-center justify-between px-4 sm:px-5 py-3 bg-neutral-900 border-b border-neutral-800 shrink-0 safe-area-pt">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-cyan-400/10 text-cyan-400 rounded">
              <Printer size={16} />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">
                Product Bill // Tax Invoice
              </h3>
              <p className="text-[11px] font-mono text-neutral-400">
                Order Ref: <span className="text-cyan-400 font-semibold">{order.orderNumber}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="print-products-bill-btn"
              type="button"
              onClick={handlePrint}
              className="px-3.5 sm:px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-black font-mono font-bold text-xs uppercase rounded transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer shadow-lg shadow-cyan-500/20 min-h-[38px]"
            >
              <Printer size={14} />
              <span>Print Bill</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white bg-neutral-800/80 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
              title="Close Bill Preview"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Bill Container */}
        <div className="p-2.5 sm:p-8 overflow-y-auto bg-neutral-900/40 touch-scroll safe-area-pb flex-1">
          {/* Printable Sheet (Always formatted with high contrast light background for crisp physical paper print) */}
          <div
            id="printable-product-bill"
            className="bg-white text-neutral-900 p-4 sm:p-10 rounded-lg shadow-xl max-w-3xl mx-auto border border-neutral-200 font-sans"
          >
            {/* Header: Store Identity & Invoice Title */}
            <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-neutral-900 pb-6 gap-4">
              <div className="flex items-start gap-3">
                <GridBrandLogo size="lg" className="border-neutral-900" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-black text-2xl tracking-tighter text-black uppercase">
                      GRID // CLOTHING
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-black text-white rounded">
                      OFFICIAL ATELIER
                    </span>
                  </div>
                  <p className="text-xs font-serif italic text-neutral-800 font-semibold mt-1">
                    "Classic Form. Premium Feel."
                  </p>
                  <p className="text-xs text-neutral-600 mt-0.5 font-medium">
                    Architectural Heavyweight Garments & Streetwear Co.
                  </p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Fulfillment Hubs: New Delhi • Bengaluru • Kochi, India
                  </p>
                  <p className="text-[11px] text-neutral-500 font-mono mt-0.5">
                    GSTIN: <strong>29AAACG8921P1Z9</strong> • IEC: 0518920199
                  </p>
                  <p className="text-[11px] text-neutral-500 font-mono">
                    Email: support@gridclothing.ai • Web: gridclothing.ai
                  </p>
                </div>
              </div>

              <div className="sm:text-right flex flex-col items-start sm:items-end">
                <span className="text-xs font-mono font-bold tracking-widest uppercase bg-neutral-100 text-neutral-800 px-2.5 py-1 rounded border border-neutral-300">
                  RETAIL TAX INVOICE
                </span>
                <p className="font-mono text-xs text-neutral-700 mt-2">
                  Invoice No:{' '}
                  <strong className="text-black text-sm">INV-{order.orderNumber}</strong>
                </p>
                <p className="font-mono text-xs text-neutral-600">
                  Order Ref: <strong>{order.orderNumber}</strong>
                </p>
                <p className="font-mono text-xs text-neutral-600">
                  Date: <strong>{formattedOrderDate}</strong>
                </p>
                <p className="font-mono text-xs text-neutral-600">
                  Payment: <strong>{order.paymentMethod}</strong>
                </p>
                <p className="font-mono text-[11px] text-emerald-700 font-bold mt-1">
                  Status: {order.status.toUpperCase()}
                </p>
              </div>
            </div>

            {/* Bill To & Dispatch Address Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-5 border-b border-neutral-200 text-xs">
              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                <span className="font-mono font-bold text-[10px] text-neutral-500 uppercase tracking-wider block mb-1">
                  BILLED & DELIVERED TO:
                </span>
                <p className="font-bold text-sm text-black">{order.customerName}</p>
                <p className="text-neutral-700 mt-0.5">{order.shippingAddress.street}</p>
                <p className="text-neutral-700">
                  {order.shippingAddress.city}, {order.shippingAddress.state} -{' '}
                  <span className="font-bold font-mono">{order.shippingAddress.zip}</span>
                </p>
                <p className="text-neutral-700">{order.shippingAddress.country}</p>
                <p className="text-neutral-600 font-mono mt-1 text-[11px]">
                  Email: {order.customerEmail}
                </p>
              </div>

              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 flex flex-col justify-between">
                <div>
                  <span className="font-mono font-bold text-[10px] text-neutral-500 uppercase tracking-wider block mb-1">
                    SHIPPING & DISPATCH METHOD:
                  </span>
                  <p className="font-bold text-black text-xs">
                    {order.shippingOption ||
                      (order.shipping === 0 ? '1. Free Delivery' : '2. Delivery Charge')}
                  </p>
                  <p className="text-neutral-600 text-[11px] mt-0.5">
                    Dispatch Date:{' '}
                    <strong className="text-neutral-900">{formattedDispatchDate}</strong>
                  </p>
                  {order.trackingNumber && (
                    <p className="text-neutral-600 text-[11px] font-mono mt-0.5">
                      Courier AWB: <strong>{order.trackingNumber}</strong>
                    </p>
                  )}
                </div>

                <div className="mt-2 pt-2 border-t border-neutral-200 text-[11px] text-neutral-600 flex justify-between">
                  <span>Shipping Fee Charged:</span>
                  <strong className={order.shipping === 0 ? 'text-emerald-700' : 'text-neutral-900'}>
                    {order.shipping === 0 ? 'FREE (₹0)' : formatINR(order.shipping)}
                  </strong>
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="py-5 border-b border-neutral-200">
              <h4 className="font-mono text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-2.5">
                ORDERED PRODUCTS ({totalQuantity} {totalQuantity === 1 ? 'UNIT' : 'UNITS'})
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b-2 border-neutral-900 bg-neutral-100 text-neutral-700 font-mono text-[10px] uppercase">
                      <th className="py-2.5 px-3">Sl.</th>
                      <th className="py-2.5 px-3">Product Description</th>
                      <th className="py-2.5 px-3">Variant Details</th>
                      <th className="py-2.5 px-3 text-right">Unit Price</th>
                      <th className="py-2.5 px-3 text-center">Qty</th>
                      <th className="py-2.5 px-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 font-mono text-xs">
                    {order.items.map((item, index) => {
                      const lineTotal = item.price * item.quantity;
                      return (
                        <tr key={index} className="hover:bg-neutral-50/60">
                          <td className="py-3 px-3 text-neutral-500 font-semibold">{index + 1}</td>
                          <td className="py-3 px-3 font-sans">
                            <span className="font-bold text-neutral-900 block">
                              {item.productName}
                            </span>
                            <span className="text-[10px] text-neutral-500 font-mono">
                              SKU: {item.productId.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-[11px] text-neutral-700">
                            <span>Size: <strong>{item.selectedSize}</strong></span>
                            <span className="mx-1">•</span>
                            <span>Color: <strong>{item.selectedColor}</strong></span>
                          </td>
                          <td className="py-3 px-3 text-right text-neutral-800">
                            {formatINR(item.price)}
                          </td>
                          <td className="py-3 px-3 text-center font-bold text-neutral-900">
                            {item.quantity}
                          </td>
                          <td className="py-3 px-3 text-right font-bold text-neutral-900">
                            {formatINR(lineTotal)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Calculations & Invoice Total */}
            <div className="py-5 border-b border-neutral-200 flex flex-col sm:flex-row justify-between items-start gap-6">
              {/* Payment & Terms */}
              <div className="text-xs text-neutral-600 max-w-sm space-y-1.5">
                <span className="font-mono font-bold text-[10px] text-neutral-500 uppercase tracking-wider block">
                  TERMS & CONDITIONS:
                </span>
                <p className="text-[11px] leading-relaxed text-neutral-600">
                  1. 30-day exchange window valid with intact security tags & invoice copy.
                </p>
                <p className="text-[11px] leading-relaxed text-neutral-600">
                  2. All prices inclusive of applicable Goods and Services Tax (GST).
                </p>
                <p className="text-[11px] leading-relaxed text-neutral-600">
                  3. Computer generated tax invoice; no physical signature needed.
                </p>
              </div>

              {/* Price Breakdown */}
              <div className="w-full sm:w-72 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal:</span>
                  <span className="font-bold text-neutral-900">{formatINR(order.subtotal)}</span>
                </div>

                {order.discount > 0 && (
                  <div className="flex justify-between text-rose-600 font-semibold">
                    <span>Discount Applied:</span>
                    <span>- {formatINR(order.discount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-neutral-600">
                  <span className="truncate pr-2">
                    Delivery ({order.shippingOption || (order.shipping === 0 ? '1. Free' : '2. Charge')}):
                  </span>
                  <span className={`font-bold ${order.shipping === 0 ? 'text-emerald-700' : 'text-neutral-900'}`}>
                    {order.shipping === 0 ? 'FREE' : formatINR(order.shipping)}
                  </span>
                </div>

                <div className="flex justify-between text-neutral-600">
                  <span>Estimated GST (12%):</span>
                  <span className="font-bold text-neutral-900">{formatINR(order.tax)}</span>
                </div>

                <div className="pt-2.5 border-t-2 border-neutral-900 flex justify-between items-baseline text-sm">
                  <span className="font-display font-bold uppercase text-black">Total Paid:</span>
                  <span className="font-display font-black text-xl text-black">
                    {formatINR(order.total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Bill Footer & Barcode Sign-off */}
            <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div>
                <p className="font-display font-bold text-xs text-neutral-900 uppercase">
                  Thank you for shopping with GRID // CLOTHING
                </p>
                <p className="text-[11px] font-serif italic text-neutral-700 mt-0.5">
                  Classic Form. Premium Feel.
                </p>
                <p className="text-[10px] text-neutral-500 font-mono mt-0.5">
                  For support & care enquiries: care@gridclothing.ai • Authorized Tax Invoice
                </p>
              </div>

              {/* Barcode Graphic Marker */}
              <div className="text-right font-mono flex flex-col items-center sm:items-end">
                <div className="flex items-center gap-0.5 h-6">
                  {[4, 2, 6, 2, 4, 8, 2, 6, 4, 2, 8, 4, 2, 6, 4, 8, 2, 4, 6].map((w, idx) => (
                    <div
                      key={idx}
                      className="bg-black h-full"
                      style={{ width: `${w}px` }}
                    />
                  ))}
                </div>
                <span className="text-[9px] text-neutral-500 tracking-widest mt-1">
                  *{order.orderNumber}*
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Close / Action */}
        <div className="no-print px-5 py-3 bg-neutral-900 border-t border-neutral-800 flex items-center justify-between">
          <p className="text-xs font-mono text-neutral-400">
            Tip: Click &quot;Print Bill&quot; to print directly on an A4 printer or save as PDF.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded text-xs font-mono uppercase cursor-pointer"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
