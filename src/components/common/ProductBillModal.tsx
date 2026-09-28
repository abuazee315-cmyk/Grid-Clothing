import React from 'react';
import { Printer, X, Truck, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Order } from '../../types';
import { formatINR } from '../../utils/currency';
import { GridBrandLogo } from './GridBrandLogo';
import { getBillPaymentInfo } from '../../utils/paymentUtils';

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
  const paymentInfo = getBillPaymentInfo(order.paymentMethod);

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
                Product Bill // Retail Tax Invoice
              </h3>
              <p className="text-[11px] font-mono text-neutral-400">
                Order Ref: <span className="text-cyan-400 font-semibold">{order.orderNumber}</span> • Bill Payment:{' '}
                <strong className="text-white">{paymentInfo.billLabel}</strong>
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
                    &quot;Classic Form. Premium Feel.&quot;
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
                
                {/* PROMINENT PAYMENT METHOD FIELD IN BILL */}
                <div className="mt-2 pt-2 border-t border-neutral-200 flex flex-col sm:items-end">
                  <p className="font-mono text-xs text-neutral-700">
                    Payment in Bill:
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="font-display font-black text-base text-black bg-neutral-100 border border-neutral-300 px-2 py-0.5 rounded shadow-sm">
                      {paymentInfo.billLabel}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-500 mt-0.5">
                    {paymentInfo.channel}
                  </span>
                  {paymentInfo.recipientPhone && (
                    <span className="text-[10px] font-mono font-bold text-cyan-800 mt-0.5">
                      Paid to Phone: +91 {paymentInfo.recipientPhone}
                    </span>
                  )}
                </div>

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
                      (order.shipping === 0 ? 'Free Delivery' : 'Standard Delivery')}
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
                  <strong className={order.shipping === 0 ? 'text-emerald-700 font-bold' : 'text-neutral-900 font-bold'}>
                    {order.shipping === 0 ? 'FREE (₹0)' : formatINR(order.shipping)}
                  </strong>
                </div>
              </div>
            </div>

            {/* Line Items Table: Clear Product Price, Qty, and Line Total */}
            <div className="py-5 border-b border-neutral-200">
              <div className="flex items-center justify-between mb-2.5">
                <h4 className="font-mono text-[11px] font-bold text-neutral-700 uppercase tracking-wider">
                  ORDERED PRODUCTS ({totalQuantity} {totalQuantity === 1 ? 'UNIT' : 'UNITS'})
                </h4>
                <span className="text-[10px] font-mono text-neutral-500">
                  All unit prices in INR (₹)
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b-2 border-neutral-900 bg-neutral-100 text-neutral-700 font-mono text-[10px] uppercase">
                      <th className="py-2.5 px-3">Sl.</th>
                      <th className="py-2.5 px-3">Product Description</th>
                      <th className="py-2.5 px-3">Variant Details</th>
                      <th className="py-2.5 px-3 text-right">Product Price (Unit)</th>
                      <th className="py-2.5 px-3 text-center">Qty</th>
                      <th className="py-2.5 px-3 text-right">Product Total</th>
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
                          <td className="py-3 px-3 text-right font-bold text-neutral-800">
                            {formatINR(item.price)}
                          </td>
                          <td className="py-3 px-3 text-center font-bold text-neutral-900">
                            {item.quantity}
                          </td>
                          <td className="py-3 px-3 text-right font-black text-neutral-900">
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
              
              {/* Payment Verification Certificate Box & Terms */}
              <div className="text-xs text-neutral-600 max-w-sm w-full space-y-3">
                {/* User's Exact Requirement: In bill GPay, P-Pay, or Cash on delivery */}
                <div className={`p-4 rounded-lg border ${
                  paymentInfo.type === 'gpay'
                    ? 'bg-cyan-50/70 border-cyan-300 text-cyan-950'
                    : paymentInfo.type === 'phonepe'
                    ? 'bg-purple-50/70 border-purple-300 text-purple-950'
                    : 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                }`}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-bold text-[10px] uppercase text-neutral-700">
                      BILL PAYMENT METHOD:
                    </span>
                    <span className={`font-mono font-black text-xs px-2.5 py-0.5 rounded uppercase border shadow-sm ${
                      paymentInfo.type === 'gpay'
                        ? 'bg-cyan-600 text-white border-cyan-700'
                        : paymentInfo.type === 'phonepe'
                        ? 'bg-purple-700 text-white border-purple-800'
                        : 'bg-emerald-700 text-white border-emerald-800'
                    }`}>
                      {paymentInfo.billLabel}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-neutral-900 mt-2">
                    {paymentInfo.description}
                  </p>

                  {paymentInfo.recipientPhone && (
                    <div className="mt-2.5 p-2 bg-white/95 rounded border border-neutral-300 text-[11px] font-mono flex items-center justify-between shadow-xs">
                      <span className="text-neutral-600 font-medium">Merchant Payee Phone:</span>
                      <strong className="text-neutral-950 font-bold tracking-wider">+91 {paymentInfo.recipientPhone}</strong>
                    </div>
                  )}

                  <div className="mt-2.5 pt-2 border-t border-neutral-200/80 space-y-1 font-mono text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Settlement Mode:</span>
                      <strong className="text-neutral-900">{paymentInfo.channel}</strong>
                    </div>
                    {paymentInfo.details && paymentInfo.details !== paymentInfo.billLabel && (
                      <div className="flex justify-between text-[10px] text-neutral-500">
                        <span>Reference:</span>
                        <span className="font-medium text-neutral-700 truncate max-w-[190px]">
                          {paymentInfo.details}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1 pt-1">
                  <span className="font-mono font-bold text-[10px] text-neutral-500 uppercase tracking-wider block">
                    TAX INVOICE TERMS:
                  </span>
                  <p className="text-[11px] leading-relaxed text-neutral-600">
                    1. 30-day exchange window valid with intact security tags & invoice copy.
                  </p>
                  <p className="text-[11px] leading-relaxed text-neutral-600">
                    2. All prices inclusive of applicable Goods and Services Tax (GST).
                  </p>
                  <p className="text-[11px] leading-relaxed text-neutral-600">
                    3. Official computer generated tax invoice; no physical signature needed.
                  </p>
                </div>
              </div>

              {/* Price Breakdown Container */}
              <div className="w-full sm:w-80 space-y-2 text-xs font-mono bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                <div className="flex justify-between text-neutral-600">
                  <span>Product Price Subtotal:</span>
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
                    Delivery ({order.shippingOption || (order.shipping === 0 ? 'Free Delivery' : 'Standard Delivery')}):
                  </span>
                  <span className={`font-bold ${order.shipping === 0 ? 'text-emerald-700' : 'text-neutral-900'}`}>
                    {order.shipping === 0 ? 'FREE (₹0)' : formatINR(order.shipping)}
                  </span>
                </div>

                <div className="flex justify-between text-neutral-600">
                  <span>Estimated GST (12%):</span>
                  <span className="font-bold text-neutral-900">{formatINR(order.tax)}</span>
                </div>

                <div className="pt-3 border-t-2 border-neutral-900 flex justify-between items-baseline text-sm">
                  <div className="flex flex-col">
                    <span className="font-display font-black uppercase text-black text-sm">
                      {paymentInfo.type === 'cod' ? 'Total Due on Delivery:' : 'Total Amount Paid:'}
                    </span>
                    <span className="text-[10px] text-neutral-500 font-mono">
                      Billed via {paymentInfo.billLabel}
                    </span>
                  </div>
                  <span className="font-display font-black text-2xl text-black">
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
                  Official Retail Tax Invoice • Care: care@gridclothing.ai • Payment: {paymentInfo.billLabel}
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
