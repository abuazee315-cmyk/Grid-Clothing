import React from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Settings,
  ArrowLeft,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatINR } from '../../utils/currency';
import { GridBrandLogo } from '../common/GridBrandLogo';

export const AdminSidebar: React.FC<{ onNavigate?: () => void }> = ({ onNavigate }) => {
  const {
    adminTab,
    setAdminTab,
    setActiveMode,
    kpis,
    orders,
    logoutAdmin,
    deliverySettings,
    firestoreConnected,
    firestoreDbId,
  } = useStore();

  const navItems = [
    {
      id: 'dashboard' as const,
      label: 'Financial Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'inventory' as const,
      label: 'Inventory & SKUs',
      icon: Package,
      badge: kpis.lowStockCount > 0 ? `${kpis.lowStockCount} Low` : null,
      badgeColor: 'bg-amber-400 text-black',
    },
    {
      id: 'orders' as const,
      label: 'Order Fulfillment',
      icon: ShoppingBag,
      badge: orders.filter((o) => o.status === 'Processing').length || null,
      badgeColor: 'bg-cyan-400 text-black',
    },
    {
      id: 'settings' as const,
      label: 'Store & Delivery',
      icon: Settings,
      badge: deliverySettings.isFreeDelivery ? 'Free Delivery' : `₹${deliverySettings.deliveryFee}`,
      badgeColor: deliverySettings.isFreeDelivery
        ? 'bg-emerald-400 text-black font-bold'
        : 'bg-neutral-800 text-neutral-300 font-mono',
    },
  ];

  return (
    <aside className="w-64 bg-neutral-950 border-r border-neutral-800 flex flex-col justify-between h-screen sticky top-0 shrink-0 select-none z-30">
      {/* Top Header */}
      <div>
        <div className="p-5 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <GridBrandLogo size="sm" />
            <div>
              <div className="font-display font-black text-sm text-white tracking-wider flex items-center gap-1">
                GRID <span className="text-cyan-400 text-[10px] font-mono">// ERP</span>
              </div>
              <span className="text-[10px] font-mono text-neutral-400 tracking-wider">
                ADMIN BACK-OFFICE
              </span>
            </div>
          </div>
          <p className="text-[10px] font-serif italic text-neutral-400 mt-2">
            &ldquo;Classic Form. Premium Feel.&rdquo;
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="p-3 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-neutral-400">
            Control Center
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = adminTab === item.id;
            return (
              <button
                key={item.id}
                id={`admin-nav-${item.id}`}
                onClick={() => {
                  setAdminTab(item.id);
                  if (onNavigate) onNavigate();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-mono transition-all cursor-pointer ${
                  isActive
                    ? 'bg-neutral-800 text-white font-bold border-l-2 border-cyan-400 shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900/80'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={16} className={isActive ? 'text-cyan-400' : 'text-neutral-500'} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-mono font-bold rounded ${
                      item.badgeColor || 'bg-neutral-700 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Quick KPI snapshot in sidebar */}
        <div className="mx-3 mt-4 p-3 bg-neutral-900/60 border border-neutral-800/80 rounded-md space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
            <span>NET REVENUE</span>
            <span className="text-cyan-400 font-bold">LIVE</span>
          </div>
          <p className="text-sm font-mono font-bold text-white">
            {formatINR(kpis.totalSales)}
          </p>
          <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 pt-1 border-t border-neutral-800">
            <span>Profit Margin</span>
            <span className="text-emerald-400 font-bold">{kpis.profitMarginPercent}%</span>
          </div>
        </div>
      </div>

      {/* Bottom Footer Actions */}
      <div className="p-3 border-t border-neutral-800 space-y-2">
        {/* Return to Customer Storefront */}
        <button
          id="admin-return-storefront-btn"
          onClick={() => setActiveMode('storefront')}
          className="w-full flex items-center justify-between px-3 py-2 rounded-md bg-white hover:bg-cyan-400 text-black text-xs font-mono font-bold transition-all cursor-pointer shadow"
        >
          <div className="flex items-center gap-2">
            <ArrowLeft size={14} />
            <span>Customer Storefront</span>
          </div>
          <ExternalLink size={13} />
        </button>

        {/* Lock Admin Panel (Passcode Gate) */}
        <button
          id="admin-lock-session-btn"
          onClick={logoutAdmin}
          className="w-full flex items-center justify-between px-3 py-2 rounded-md bg-neutral-900 hover:bg-rose-950/40 hover:text-rose-400 border border-neutral-800 hover:border-rose-800 text-neutral-300 text-xs font-mono transition-colors cursor-pointer"
          title="Lock ERP and return to storefront"
        >
          <div className="flex items-center gap-2">
            <Lock size={13} className="text-amber-400" />
            <span>Lock Admin Portal</span>
          </div>
          <span className="text-[10px] text-neutral-500 font-mono">Secure</span>
        </button>

        {/* Server & Environment Status */}
        <div className="px-2 pt-1 flex items-center justify-between text-[10px] font-mono text-neutral-400">
          <span
            className="flex items-center gap-1.5"
            title={`Connected to Firestore DB: ${firestoreDbId}`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                firestoreConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            ></span>
            {firestoreConnected ? 'DB: FIRESTORE LIVE' : 'DB: SYNCING...'}
          </span>
          <span className="text-[9px] text-neutral-500 font-mono">v4.2.0</span>
        </div>
      </div>
    </aside>
  );
};
