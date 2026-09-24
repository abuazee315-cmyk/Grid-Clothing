import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Truck, Check, AlertCircle } from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { useStore } from '../../context/StoreContext';

interface OrderDateEditModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

// Helper to convert ISO string to YYYY-MM-DDTHH:mm for datetime-local input
const isoToInputDateTime = (isoString?: string): string => {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '';
    // Format to YYYY-MM-DDTHH:mm local time
    const pad = (n: number) => n.toString().padStart(2, '0');
    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch {
    return '';
  }
};

// Helper to convert input datetime-local string to ISO string
const inputToIsoString = (val: string): string => {
  if (!val) return '';
  try {
    const d = new Date(val);
    return isNaN(d.getTime()) ? '' : d.toISOString();
  } catch {
    return '';
  }
};

export const OrderDateEditModal: React.FC<OrderDateEditModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  const { updateOrderDates, updateOrderStatus } = useStore();

  const [orderDateInput, setOrderDateInput] = useState('');
  const [dispatchDateInput, setDispatchDateInput] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>('Processing');

  useEffect(() => {
    if (order) {
      setOrderDateInput(isoToInputDateTime(order.createdAt));
      setDispatchDateInput(isoToInputDateTime(order.dispatchDate));
      setSelectedStatus(order.status);
    }
  }, [order]);

  if (!isOpen || !order) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newCreatedAt = inputToIsoString(orderDateInput) || order.createdAt;
    const newDispatchDate = inputToIsoString(dispatchDateInput);

    // Update dates
    updateOrderDates(order.id, {
      createdAt: newCreatedAt,
      dispatchDate: newDispatchDate || undefined,
    });

    // Update status if changed
    if (selectedStatus !== order.status) {
      updateOrderStatus(order.id, selectedStatus);
    }

    onClose();
  };

  // Quick preset handlers
  const setOrderDateToday = () => {
    const now = new Date();
    setOrderDateInput(isoToInputDateTime(now.toISOString()));
  };

  const setOrderDateYesterday = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    setOrderDateInput(isoToInputDateTime(d.toISOString()));
  };

  const setDispatchToday = () => {
    const now = new Date();
    setDispatchDateInput(isoToInputDateTime(now.toISOString()));
    if (selectedStatus === 'Processing') {
      setSelectedStatus('Shipped');
    }
  };

  const setDispatchTomorrow = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(11, 0, 0, 0);
    setDispatchDateInput(isoToInputDateTime(d.toISOString()));
  };

  const clearDispatchDate = () => {
    setDispatchDateInput('');
  };

  const statusOptions: OrderStatus[] = ['Processing', 'Shipped', 'On the way', 'Delivered', 'Cancelled'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-xs" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-neutral-950 border border-neutral-800 rounded-xl shadow-2xl z-10 overflow-hidden text-white font-mono">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              <Calendar size={18} />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-white uppercase">
                CHANGE ORDER & DISPATCH DATES
              </h3>
              <p className="text-[11px] text-neutral-400">
                Order <strong className="text-cyan-400">{order.orderNumber}</strong> • {order.customerName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 sm:p-6 space-y-5 text-xs">
          {/* Status Quick Selection */}
          <div className="space-y-2">
            <label className="text-neutral-400 uppercase text-[10px] font-bold tracking-wider flex items-center gap-1.5">
              <Truck size={13} className="text-cyan-400" />
              <span>Fulfillment Status (4 Stages)</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {statusOptions.slice(0, 4).map((st) => {
                const isSelected = selectedStatus === st;
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setSelectedStatus(st)}
                    className={`py-2 px-2 text-center rounded border text-[11px] font-bold uppercase transition-all cursor-pointer ${
                      isSelected
                        ? st === 'Processing'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500 shadow-sm'
                          : st === 'Shipped'
                          ? 'bg-blue-500/20 text-blue-300 border-blue-500 shadow-sm'
                          : st === 'On the way'
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500 shadow-sm'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500 shadow-sm'
                        : 'bg-neutral-900/80 text-neutral-400 border-neutral-800 hover:bg-neutral-800 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date of Ordered Section */}
          <div className="p-3.5 bg-neutral-900/50 border border-neutral-800 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-white uppercase font-bold text-[11px] flex items-center gap-1.5">
                <Clock size={13} className="text-cyan-400" />
                <span>Date of Ordered</span>
              </label>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={setOrderDateToday}
                  className="px-2 py-0.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded text-[10px] transition-colors cursor-pointer"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={setOrderDateYesterday}
                  className="px-2 py-0.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded text-[10px] transition-colors cursor-pointer"
                >
                  Yesterday
                </button>
              </div>
            </div>

            <input
              type="datetime-local"
              required
              value={orderDateInput}
              onChange={(e) => setOrderDateInput(e.target.value)}
              className="w-full p-2.5 bg-neutral-950 border border-neutral-700 rounded text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
            />
            <p className="text-[10px] text-neutral-500">
              The exact timestamp when the customer completed checkout.
            </p>
          </div>

          {/* Date of Dispatch Section */}
          <div className="p-3.5 bg-neutral-900/50 border border-neutral-800 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-white uppercase font-bold text-[11px] flex items-center gap-1.5">
                <Truck size={13} className="text-amber-400" />
                <span>Date of Dispatch</span>
              </label>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={setDispatchToday}
                  className="px-2 py-0.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded text-[10px] transition-colors cursor-pointer"
                >
                  Set Today
                </button>
                <button
                  type="button"
                  onClick={setDispatchTomorrow}
                  className="px-2 py-0.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded text-[10px] transition-colors cursor-pointer"
                >
                  Tomorrow
                </button>
                {dispatchDateInput && (
                  <button
                    type="button"
                    onClick={clearDispatchDate}
                    className="px-2 py-0.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-900/50 rounded text-[10px] transition-colors cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <input
              type="datetime-local"
              value={dispatchDateInput}
              onChange={(e) => setDispatchDateInput(e.target.value)}
              className="w-full p-2.5 bg-neutral-950 border border-neutral-700 rounded text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
              placeholder="No dispatch date scheduled yet"
            />
            <p className="text-[10px] text-neutral-500">
              {dispatchDateInput
                ? 'Packages handed over to courier / in transit.'
                : 'Leave empty if this order is still processing at warehouse.'}
            </p>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 rounded text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-cyan-400 hover:bg-cyan-300 text-black font-bold uppercase rounded text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Check size={14} />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
