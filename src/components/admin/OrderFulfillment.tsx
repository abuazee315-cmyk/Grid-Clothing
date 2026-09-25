import React, { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  Eye,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  X,
  ExternalLink,
  ShoppingBag,
  Calendar,
  Check,
  Edit2,
  Printer,
  Plus,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus } from '../../types';
import { formatINR } from '../../utils/currency';
import { OrderDateEditModal } from './OrderDateEditModal';
import { AddNewOrderModal } from './AddNewOrderModal';

export const OrderFulfillment: React.FC = () => {
  const { orders, updateOrderStatus, updateOrderDates, openPrintBill } = useStore();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editingDatesOrder, setEditingDatesOrder] = useState<Order | null>(null);
  const [isAddOrderOpen, setIsAddOrderOpen] = useState(false);

  // Inspector internal date editing state
  const [inspectorOrderDate, setInspectorOrderDate] = useState('');
  const [inspectorDispatchDate, setInspectorDispatchDate] = useState('');
  const [inspectorSavedMsg, setInspectorSavedMsg] = useState(false);

  const statuses: OrderStatus[] = ['Processing', 'Shipped', 'On the way', 'Delivered', 'Cancelled'];

  const handleOpenInspector = (order: Order) => {
    setSelectedOrder(order);
    setInspectorSavedMsg(false);
    // Format dates for inputs
    try {
      const dOrder = new Date(order.createdAt);
      const pad = (n: number) => n.toString().padStart(2, '0');
      setInspectorOrderDate(
        `${dOrder.getFullYear()}-${pad(dOrder.getMonth() + 1)}-${pad(dOrder.getDate())}T${pad(dOrder.getHours())}:${pad(dOrder.getMinutes())}`
      );
    } catch {
      setInspectorOrderDate('');
    }

    if (order.dispatchDate) {
      try {
        const dDisp = new Date(order.dispatchDate);
        const pad = (n: number) => n.toString().padStart(2, '0');
        setInspectorDispatchDate(
          `${dDisp.getFullYear()}-${pad(dDisp.getMonth() + 1)}-${pad(dDisp.getDate())}T${pad(dDisp.getHours())}:${pad(dDisp.getMinutes())}`
        );
      } catch {
        setInspectorDispatchDate('');
      }
    } else {
      setInspectorDispatchDate('');
    }
  };

  const handleSaveInspectorDates = () => {
    if (!selectedOrder) return;
    const newCreatedAt = inspectorOrderDate ? new Date(inspectorOrderDate).toISOString() : selectedOrder.createdAt;
    const newDispatchDate = inspectorDispatchDate ? new Date(inspectorDispatchDate).toISOString() : undefined;

    updateOrderDates(selectedOrder.id, {
      createdAt: newCreatedAt,
      dispatchDate: newDispatchDate,
    });

    setSelectedOrder({
      ...selectedOrder,
      createdAt: newCreatedAt,
      dispatchDate: newDispatchDate,
    });

    setInspectorSavedMsg(true);
    setTimeout(() => setInspectorSavedMsg(false), 3000);
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (statusFilter !== 'all' && o.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          o.orderNumber.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerEmail.toLowerCase().includes(q) ||
          o.shippingAddress.city.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [orders, search, statusFilter]);

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto text-white">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-800 gap-4">
        <div>
          <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest">
            // FULFILLMENT & DISPATCH
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white uppercase mt-1">
            ORDER LOGISTICS & FULFILLMENT
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs font-mono text-neutral-400 hidden sm:block">
            <span>TOTAL QUEUE: <strong className="text-white">{orders.length} ORDERS</strong></span>
          </div>
          <button
            type="button"
            onClick={() => setIsAddOrderOpen(true)}
            className="px-3.5 py-2 bg-cyan-400 hover:bg-cyan-300 text-black font-mono text-xs font-bold uppercase rounded-md flex items-center gap-2 transition-colors cursor-pointer shadow-md shadow-cyan-950"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Order</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['all', 'Processing', 'Shipped', 'On the way', 'Delivered', 'Cancelled'].map((status) => {
            const count =
              status === 'all'
                ? orders.length
                : orders.filter((o) => o.status === status).length;
            const isActive = statusFilter === status;

            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-md text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-white text-black font-bold'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <span>{status === 'all' ? 'All Orders' : status}</span>
                <span className="ml-1.5 opacity-70">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order #, client, email..."
            className="w-full pl-9 pr-4 py-2 bg-neutral-900 border border-neutral-800 rounded-md text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-neutral-900/90 text-neutral-400 uppercase text-[10px] border-b border-neutral-800">
              <tr>
                <th className="py-3 px-4">Order Ref</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Delivery Destination</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Date of Ordered</th>
                <th className="py-3 px-4">Date of Dispatch</th>
                <th className="py-3 px-4">Fulfillment Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {filteredOrders.map((order) => {
                const totalUnits = order.items.reduce((s, i) => s + i.quantity, 0);
                const orderedDateFormatted = new Date(order.createdAt).toLocaleDateString('en-IN', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });
                const dispatchDateFormatted = order.dispatchDate
                  ? new Date(order.dispatchDate).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : null;

                return (
                  <tr key={order.id} className="hover:bg-neutral-800/40 transition-colors">
                    {/* Order Ref & Timestamp */}
                    <td className="py-3 px-4">
                      <span className="font-bold text-cyan-400 block">{order.orderNumber}</span>
                      <span className="text-[10px] text-neutral-500">
                        {totalUnits} items
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="py-3 px-4">
                      <p className="font-bold text-white">{order.customerName}</p>
                      <p className="text-[10px] text-neutral-400">{order.customerEmail}</p>
                    </td>

                    {/* Destination */}
                    <td className="py-3 px-4 text-neutral-300">
                      <p>{order.shippingAddress.city}, {order.shippingAddress.country}</p>
                      <p className="text-[10px] text-neutral-500 truncate max-w-[150px]">{order.shippingAddress.street}</p>
                    </td>

                    {/* Total Amount */}
                    <td className="py-3 px-4">
                      <span className="font-bold text-white">{formatINR(order.total)}</span>
                      <span className="text-[10px] text-neutral-500 block">{order.paymentMethod}</span>
                    </td>

                    {/* Date of Ordered */}
                    <td className="py-3 px-4">
                      <span className="flex items-center gap-1.5 text-neutral-300">
                        <Clock size={12} className="text-cyan-400 shrink-0" />
                        <span>{orderedDateFormatted}</span>
                      </span>
                    </td>

                    {/* Date of Dispatch */}
                    <td className="py-3 px-4">
                      {dispatchDateFormatted ? (
                        <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                          <Truck size={12} className="text-emerald-400 shrink-0" />
                          <span>{dispatchDateFormatted}</span>
                        </span>
                      ) : (
                        <span className="text-neutral-500 text-[11px] italic flex items-center gap-1">
                          <Clock size={11} />
                          <span>Pending</span>
                        </span>
                      )}
                    </td>

                    {/* Interactive Status Dropdown */}
                    <td className="py-3 px-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className={`px-2.5 py-1.5 rounded text-[11px] font-bold uppercase cursor-pointer border focus:outline-none ${
                          order.status === 'Processing'
                            ? 'bg-amber-950/70 text-amber-400 border-amber-800'
                            : order.status === 'Shipped'
                            ? 'bg-blue-950/70 text-blue-400 border-blue-800'
                            : order.status === 'On the way'
                            ? 'bg-cyan-950/70 text-cyan-400 border-cyan-800'
                            : order.status === 'Delivered'
                            ? 'bg-emerald-950/70 text-emerald-400 border-emerald-800'
                            : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                        }`}
                      >
                        {statuses.map((st) => (
                          <option key={st} value={st} className="bg-neutral-900 text-white font-mono">
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Action Buttons: Edit Dates, Print Bill & Inspect */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openPrintBill(order)}
                          className="px-2 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 hover:text-white border border-neutral-700 text-neutral-300 text-xs font-mono transition-colors inline-flex items-center gap-1 cursor-pointer"
                          title="Print Products Bill / Tax Invoice"
                        >
                          <Printer size={12} className="text-cyan-400" />
                          <span>Print Bill</span>
                        </button>
                        <button
                          onClick={() => setEditingDatesOrder(order)}
                          className="px-2 py-1.5 rounded bg-neutral-800 hover:bg-cyan-950 hover:text-cyan-400 border border-neutral-700 text-neutral-300 text-xs font-mono transition-colors inline-flex items-center gap-1 cursor-pointer"
                          title="Change Date of Dispatch and Date of Ordered"
                        >
                          <Calendar size={12} />
                          <span>Dates</span>
                        </button>
                        <button
                          onClick={() => handleOpenInspector(order)}
                          className="px-2.5 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-mono transition-colors inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Eye size={12} />
                          <span>Inspect</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="py-12 text-center text-xs font-mono text-neutral-400">
            No orders found in this status category.
          </div>
        )}
      </div>

      {/* Order Detail Modal / Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-xs" onClick={() => setSelectedOrder(null)} />

          <div className="relative w-full max-w-2xl bg-neutral-950 border border-neutral-800 rounded-xl shadow-2xl z-10 overflow-hidden text-white">
            <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/60">
              <div className="flex items-center gap-2.5">
                <ShoppingBag size={18} className="text-cyan-400" />
                <div>
                  <h3 className="font-display font-bold text-base text-white">
                    ORDER {selectedOrder.orderNumber}
                  </h3>
                  <span className="text-[10px] font-mono text-neutral-400">
                    Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openPrintBill(selectedOrder)}
                  className="px-3 py-1.5 bg-white hover:bg-neutral-200 text-black font-bold rounded text-xs transition-colors flex items-center gap-1.5 cursor-pointer uppercase shadow"
                  title="Print Products Bill"
                >
                  <Printer size={13} />
                  <span>Print Bill</span>
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-neutral-800"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs font-mono">
              {/* Status updater */}
              <div className="flex items-center justify-between p-3.5 bg-neutral-900/80 rounded-lg border border-neutral-800">
                <div>
                  <span className="text-neutral-400 uppercase text-[10px]">CURRENT FULFILLMENT STATUS</span>
                  <p className="text-sm font-bold text-white mt-0.5">{selectedOrder.status}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-neutral-400">Change:</span>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => {
                      const newSt = e.target.value as OrderStatus;
                      updateOrderStatus(selectedOrder.id, newSt);
                      setSelectedOrder({ ...selectedOrder, status: newSt });
                    }}
                    className="p-1.5 bg-neutral-950 border border-neutral-700 rounded text-white font-bold cursor-pointer"
                  >
                    {statuses.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Order & Dispatch Dates Timeline Editor */}
              <div className="p-4 bg-neutral-900/70 rounded-lg border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                  <span className="text-cyan-400 uppercase font-bold text-[11px] flex items-center gap-1.5">
                    <Calendar size={13} />
                    <span>TIMELINE: DATE OF ORDERED & DISPATCH</span>
                  </span>
                  {inspectorSavedMsg && (
                    <span className="text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                      <Check size={12} />
                      <span>Dates Saved!</span>
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Date of Ordered */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-neutral-400 uppercase font-bold flex items-center gap-1">
                      <Clock size={11} className="text-cyan-400" />
                      <span>Date of Ordered</span>
                    </label>
                    <input
                      type="datetime-local"
                      value={inspectorOrderDate}
                      onChange={(e) => setInspectorOrderDate(e.target.value)}
                      className="w-full p-2 bg-neutral-950 border border-neutral-700 rounded text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  {/* Date of Dispatch */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] text-neutral-400 uppercase font-bold flex items-center gap-1">
                        <Truck size={11} className="text-emerald-400" />
                        <span>Date of Dispatch</span>
                      </label>
                      {inspectorDispatchDate && (
                        <button
                          type="button"
                          onClick={() => setInspectorDispatchDate('')}
                          className="text-[9px] text-rose-400 hover:underline cursor-pointer"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <input
                      type="datetime-local"
                      value={inspectorDispatchDate}
                      onChange={(e) => setInspectorDispatchDate(e.target.value)}
                      className="w-full p-2 bg-neutral-950 border border-neutral-700 rounded text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end pt-1">
                  <button
                    type="button"
                    onClick={handleSaveInspectorDates}
                    className="px-3 py-1.5 bg-cyan-400 hover:bg-cyan-300 text-black font-bold rounded text-xs transition-colors flex items-center gap-1.5 cursor-pointer uppercase"
                  >
                    <Check size={13} />
                    <span>Save Order Dates</span>
                  </button>
                </div>
              </div>

              {/* Customer & Shipping Details */}
              <div className="grid grid-cols-2 gap-4 p-3.5 bg-neutral-900/40 rounded-lg border border-neutral-800">
                <div>
                  <span className="text-neutral-500 uppercase text-[10px]">CUSTOMER INFORMATION</span>
                  <p className="font-bold text-white mt-1">{selectedOrder.customerName}</p>
                  <p className="text-neutral-400">{selectedOrder.customerEmail}</p>
                  <p className="text-cyan-400 mt-1">Payment: {selectedOrder.paymentMethod}</p>
                </div>

                <div>
                  <span className="text-neutral-500 uppercase text-[10px]">DELIVERY ADDRESS</span>
                  <p className="text-white mt-1">{selectedOrder.shippingAddress.street}</p>
                  <p className="text-neutral-400">
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zip}
                  </p>
                  <p className="text-neutral-400">{selectedOrder.shippingAddress.country}</p>
                  {selectedOrder.trackingNumber && (
                    <p className="text-emerald-400 mt-1">Tracking: {selectedOrder.trackingNumber}</p>
                  )}
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                <span className="text-neutral-500 uppercase text-[10px]">LINE ITEMS</span>
                <div className="divide-y divide-neutral-800 border border-neutral-800 rounded-lg overflow-hidden">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="p-3 bg-neutral-900/30 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="w-12 h-14 object-cover rounded bg-neutral-900 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <p className="font-bold text-white">{item.productName}</p>
                          <p className="text-[11px] text-neutral-400">
                            SKU: {item.sku} • {item.selectedSize} / {item.selectedColor}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-white">{formatINR(item.price * item.quantity)}</p>
                        <p className="text-neutral-400">{item.quantity} × {formatINR(item.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals Breakdown */}
              <div className="p-3.5 bg-neutral-900/80 rounded-lg border border-neutral-800 space-y-1 text-xs">
                <div className="flex justify-between text-neutral-400">
                  <span>Subtotal</span>
                  <span className="text-white">{formatINR(selectedOrder.subtotal)}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-cyan-400">
                    <span>Discount</span>
                    <span>-{formatINR(selectedOrder.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-400">
                  <span>Shipping {selectedOrder.shippingOption ? `(${selectedOrder.shippingOption})` : ''}</span>
                  <span className={selectedOrder.shipping === 0 ? 'text-emerald-400 font-bold' : 'text-cyan-400 font-bold'}>
                    {selectedOrder.shipping === 0 ? 'FREE' : formatINR(selectedOrder.shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Estimated GST (12%)</span>
                  <span>{formatINR(selectedOrder.tax)}</span>
                </div>
                <div className="pt-2 border-t border-neutral-800 flex justify-between font-bold text-sm">
                  <span className="text-white font-display">TOTAL BILLED</span>
                  <span className="text-cyan-400 font-mono text-base">{formatINR(selectedOrder.total)}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-neutral-900/60 border-t border-neutral-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => openPrintBill(selectedOrder)}
                className="px-4 py-2 bg-white hover:bg-neutral-200 text-black font-mono font-bold text-xs uppercase rounded transition-colors flex items-center gap-2 cursor-pointer shadow"
              >
                <Printer size={14} />
                <span>Print Products Bill</span>
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded text-xs font-mono"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Date Edit Modal */}
      <OrderDateEditModal
        order={editingDatesOrder}
        isOpen={Boolean(editingDatesOrder)}
        onClose={() => setEditingDatesOrder(null)}
      />

      {/* Add New Order Modal with World Colorway Search */}
      <AddNewOrderModal
        isOpen={isAddOrderOpen}
        onClose={() => setIsAddOrderOpen(false)}
        onOrderCreated={(orderId) => {
          const ord = orders.find((o) => o.id === orderId);
          if (ord) setSelectedOrder(ord);
        }}
      />
    </div>
  );
};
