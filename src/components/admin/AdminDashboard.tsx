import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  Package,
  AlertTriangle,
  ShoppingBag,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Layers,
  Sparkles,
  Plus,
  Clock,
  Truck,
  Edit2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus } from '../../types';
import { formatINR, formatINRCompact } from '../../utils/currency';
import { OrderDateEditModal } from './OrderDateEditModal';

export const AdminDashboard: React.FC = () => {
  const { kpis, monthlyFinancials, categoryPerformance, orders, updateOrderStatus, setAdminTab } = useStore();
  const [editingDatesOrder, setEditingDatesOrder] = useState<Order | null>(null);

  const recentOrders = orders.slice(0, 5);
  const fulfillmentStatuses: OrderStatus[] = ['Processing', 'Shipped', 'On the way', 'Delivered'];

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto text-white">
      {/* Top Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-800 gap-4">
        <div>
          <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest">
            // EXECUTIVE ANALYTICS
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white uppercase mt-1">
            FINANCIAL OVERVIEW & KPIs
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="admin-dashboard-add-product-btn"
            onClick={() => setAdminTab('inventory')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-cyan-400 rounded text-xs font-mono text-white transition-colors cursor-pointer"
          >
            <Plus size={14} className="text-cyan-400" />
            <span>Add Product</span>
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded text-xs font-mono text-neutral-300">
            <Calendar size={14} className="text-cyan-400" />
            <span>H2 2026 FISCAL CYCLE</span>
          </div>
          <button
            onClick={() => setAdminTab('orders')}
            className="px-3.5 py-1.5 bg-cyan-400 hover:bg-cyan-300 text-black font-mono text-xs font-bold uppercase rounded transition-colors cursor-pointer"
          >
            Manage Orders ({kpis.activeOrders})
          </button>
        </div>
      </div>

      {/* Top Row: 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1: Total Sales */}
        <div className="p-5 bg-neutral-900/70 border border-neutral-800 rounded-lg space-y-3 relative overflow-hidden group hover:border-neutral-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
              Total Gross Sales
            </span>
            <div className="p-2 rounded bg-neutral-800 text-cyan-400">
              <DollarSign size={16} />
            </div>
          </div>
          <div>
            <div className="font-mono font-bold text-2xl sm:text-3xl text-white">
              {formatINR(kpis.totalSales)}
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 mt-1">
              <ArrowUpRight size={14} />
              <span>+18.4% vs previous 30d</span>
            </div>
          </div>
          <div className="text-[11px] text-neutral-400 font-mono pt-2 border-t border-neutral-800/80">
            Average Order Value: {formatINR(kpis.averageOrderValue)}
          </div>
        </div>

        {/* KPI 2: Net Profit */}
        <div className="p-5 bg-neutral-900/70 border border-neutral-800 rounded-lg space-y-3 relative overflow-hidden group hover:border-neutral-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
              Net Profit
            </span>
            <div className="p-2 rounded bg-neutral-800 text-emerald-400">
              <TrendingUp size={16} />
            </div>
          </div>
          <div>
            <div className="font-mono font-bold text-2xl sm:text-3xl text-emerald-400">
              {formatINR(kpis.netProfit)}
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 mt-1">
              <ArrowUpRight size={14} />
              <span>{kpis.profitMarginPercent}% Operating Margin</span>
            </div>
          </div>
          <div className="text-[11px] text-neutral-400 font-mono pt-2 border-t border-neutral-800/80">
            Cost of Goods Ratio: {(100 - kpis.profitMarginPercent).toFixed(1)}%
          </div>
        </div>

        {/* KPI 3: Active Orders */}
        <div className="p-5 bg-neutral-900/70 border border-neutral-800 rounded-lg space-y-3 relative overflow-hidden group hover:border-neutral-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
              Active Orders
            </span>
            <div className="p-2 rounded bg-neutral-800 text-white">
              <ShoppingBag size={16} />
            </div>
          </div>
          <div>
            <div className="font-mono font-bold text-2xl sm:text-3xl text-white">
              {kpis.activeOrders}
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 mt-1">
              <span>{orders.filter((o) => o.status === 'Processing').length} Processing in Queue</span>
            </div>
          </div>
          <div className="text-[11px] text-neutral-400 font-mono pt-2 border-t border-neutral-800/80">
            Dispatched via DHL Express & FedEx
          </div>
        </div>

        {/* KPI 4: Low Stock Warnings */}
        <div className="p-5 bg-neutral-900/70 border border-neutral-800 rounded-lg space-y-3 relative overflow-hidden group hover:border-neutral-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
              Low Stock Warnings
            </span>
            <div className="p-2 rounded bg-amber-950 text-amber-400 border border-amber-900">
              <AlertTriangle size={16} />
            </div>
          </div>
          <div>
            <div className="font-mono font-bold text-2xl sm:text-3xl text-amber-400">
              {kpis.lowStockCount}
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono text-amber-400 mt-1">
              <span>Under 15 units threshold</span>
            </div>
          </div>
          <div className="text-[11px] text-neutral-400 font-mono pt-2 border-t border-neutral-800/80">
            <button
              onClick={() => setAdminTab('inventory')}
              className="text-cyan-400 hover:underline"
            >
              Inspect Affected SKUs →
            </button>
          </div>
        </div>
      </div>

      {/* Chart Row: 1. Revenue vs Profit (Line Chart) & 2. Category Performance (Bar Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Line Chart: Revenue vs Profit Over Last 6 Months */}
        <div className="lg:col-span-7 bg-neutral-900/50 border border-neutral-800 rounded-lg p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800/80 pb-3">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                // TRAJECTORY
              </span>
              <h3 className="font-display font-bold text-lg text-white">
                Revenue vs. Net Profit (Last 6 Months)
              </h3>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-cyan-400 inline-block" />
                <span className="text-neutral-300">Gross Revenue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
                <span className="text-neutral-300">Net Profit</span>
              </div>
            </div>
          </div>

          {/* Line Chart Render */}
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={monthlyFinancials}
                margin={{ top: 10, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                <XAxis
                  dataKey="month"
                  stroke="#737373"
                  tick={{ fill: '#a3a3a3', fontSize: 11, fontFamily: 'monospace' }}
                />
                <YAxis
                  stroke="#737373"
                  tick={{ fill: '#a3a3a3', fontSize: 11, fontFamily: 'monospace' }}
                  tickFormatter={(val) => formatINRCompact(val)}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0a0a0a',
                    borderColor: '#262626',
                    borderRadius: '8px',
                    color: '#fff',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                  }}
                  formatter={(value: any) => [formatINR(Number(value)), '']}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Gross Revenue"
                  stroke="#22d3ee"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#22d3ee' }}
                  activeDot={{ r: 6, fill: '#67e8f9' }}
                />
                <Line
                  type="monotone"
                  dataKey="profit"
                  name="Net Profit"
                  stroke="#34d399"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#34d399' }}
                  activeDot={{ r: 6, fill: '#6ee7b7' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-xs font-mono text-neutral-400 text-right">
            Gross revenue scaled by +117% from April to September
          </div>
        </div>

        {/* Bar Chart: Category Performance (Volume & Revenue) */}
        <div className="lg:col-span-5 bg-neutral-900/50 border border-neutral-800 rounded-lg p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                // SEGMENT ANALYSIS
              </span>
              <h3 className="font-display font-bold text-lg text-white">
                Category Performance
              </h3>
            </div>
            <span className="text-xs font-mono text-neutral-400">Total Units Sold</span>
          </div>

          {/* Bar Chart Render */}
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryPerformance}
                layout="vertical"
                margin={{ top: 10, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" horizontal={false} />
                <XAxis
                  type="number"
                  stroke="#737373"
                  tick={{ fill: '#a3a3a3', fontSize: 11, fontFamily: 'monospace' }}
                />
                <YAxis
                  type="category"
                  dataKey="categoryName"
                  stroke="#737373"
                  width={110}
                  tick={{ fill: '#d4d4d4', fontSize: 10, fontFamily: 'monospace' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0a0a0a',
                    borderColor: '#262626',
                    borderRadius: '8px',
                    color: '#fff',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                  }}
                  formatter={(value: any, name: any) => [
                    name === 'volume' ? `${value} Units` : formatINR(value),
                    name === 'volume' ? 'Volume Sold' : 'Revenue',
                  ]}
                />
                <Bar
                  dataKey="volume"
                  name="Volume"
                  fill="#0055FF"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-xs font-mono text-neutral-400 flex items-center justify-between">
            <span>Highest Volume: Boxy Tees</span>
            <span className="text-cyan-400">Highest Margin: Hoodies</span>
          </div>
        </div>

      </div>

      {/* Bottom Table: Recent Incoming Orders */}
      <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div>
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
              // DISPATCH QUEUE
            </span>
            <h3 className="font-display font-bold text-lg text-white">
              Recent Incoming Orders
            </h3>
          </div>
          <button
            onClick={() => setAdminTab('orders')}
            className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
          >
            <span>View All {orders.length} Orders</span>
            <ArrowUpRight size={13} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-400 uppercase text-[10px]">
                <th className="py-2.5 px-3">Order #</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Items</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Date of Ordered</th>
                <th className="py-2.5 px-3">Date of Dispatch</th>
                <th className="py-2.5 px-3">Fulfillment Status</th>
                <th className="py-2.5 px-3 text-right">Edit Dates</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {recentOrders.map((order) => {
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
                    <td className="py-3 px-3 font-bold text-cyan-400">{order.orderNumber}</td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-white">{order.customerName}</p>
                      <p className="text-[10px] text-neutral-400">{order.customerEmail}</p>
                    </td>
                    <td className="py-3 px-3 text-neutral-300">
                      {order.items.reduce((s, i) => s + i.quantity, 0)} pcs (
                      {order.items[0]?.productName.slice(0, 18)}...)
                    </td>
                    <td className="py-3 px-3 font-bold text-white">{formatINR(order.total)}</td>
                    {/* Date of Ordered */}
                    <td className="py-3 px-3">
                      <span className="flex items-center gap-1.5 text-neutral-300">
                        <Clock size={12} className="text-cyan-400 shrink-0" />
                        <span>{orderedDateFormatted}</span>
                      </span>
                    </td>
                    {/* Date of Dispatch */}
                    <td className="py-3 px-3">
                      {dispatchDateFormatted ? (
                        <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                          <Truck size={12} className="text-emerald-400 shrink-0" />
                          <span>{dispatchDateFormatted}</span>
                        </span>
                      ) : (
                        <span className="text-neutral-500 text-[11px] italic flex items-center gap-1">
                          <Clock size={11} />
                          <span>Pending Dispatch</span>
                        </span>
                      )}
                    </td>
                    {/* Interactive Fulfillment Status Dropdown */}
                    <td className="py-3 px-3">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase cursor-pointer border focus:outline-none ${
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
                        {fulfillmentStatuses.map((st) => (
                          <option key={st} value={st} className="bg-neutral-900 text-white font-mono">
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>
                    {/* Edit Dates Action */}
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setEditingDatesOrder(order)}
                        className="p-1.5 rounded bg-neutral-800 hover:bg-cyan-950 hover:text-cyan-400 border border-neutral-700 text-neutral-300 text-[11px] transition-colors inline-flex items-center gap-1 cursor-pointer"
                        title="Change Date of Dispatch or Date of Ordered"
                      >
                        <Calendar size={12} />
                        <span>Edit Dates</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Date Edit Modal */}
      <OrderDateEditModal
        order={editingDatesOrder}
        isOpen={Boolean(editingDatesOrder)}
        onClose={() => setEditingDatesOrder(null)}
      />
    </div>
  );
};
