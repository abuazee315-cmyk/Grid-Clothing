import React, { useState, useRef, useEffect } from 'react';
import { useStore, ADMIN_PASSCODE } from '../../context/StoreContext';
import { AdminSidebar } from './AdminSidebar';
import { AdminDashboard } from './AdminDashboard';
import { InventoryManagement } from './InventoryManagement';
import { OrderFulfillment } from './OrderFulfillment';
import { StoreSettings } from './StoreSettings';
import {
  Menu,
  X,
  ArrowLeft,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  ShieldAlert,
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const {
    adminTab,
    setActiveMode,
    isAdminAuthenticated,
    adminPasscodeError,
    verifyAdminPasscode,
    logoutAdmin,
  } = useStore();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Passcode gate state if opened directly
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAdminAuthenticated) {
      setPasscode('');
      inputRef.current?.focus();
    }
  }, [isAdminAuthenticated]);

  // If not authenticated, render the dedicated Passcode Gate Screen
  if (!isAdminAuthenticated) {
    const handleUnlock = (e: React.FormEvent) => {
      e.preventDefault();
      if (!passcode.trim()) return;
      setIsVerifying(true);
      setTimeout(() => {
        const ok = verifyAdminPasscode(passcode);
        setIsVerifying(false);
        if (!ok) {
          inputRef.current?.focus();
          inputRef.current?.select();
        }
      }, 200);
    };

    const handleAutoFill = () => {
      setPasscode(ADMIN_PASSCODE);
      setTimeout(() => {
        verifyAdminPasscode(ADMIN_PASSCODE);
      }, 150);
    };

    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4 selection:bg-cyan-400 selection:text-black">
        {/* Decorative Grid Lines Background */}
        <div className="w-full max-w-md bg-neutral-900/90 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden animate-fade-in backdrop-blur-md">
          {/* Header Bar */}
          <div className="px-6 py-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <span className="font-mono text-xs uppercase tracking-wider text-neutral-300 font-bold">
                GRID // ERP SECURITY GATE
              </span>
            </div>
            <button
              onClick={() => setActiveMode('storefront')}
              className="text-neutral-400 hover:text-white text-xs font-mono flex items-center gap-1 transition-colors"
            >
              <ArrowLeft size={13} />
              <span>Storefront</span>
            </button>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 mb-1">
                <Lock size={28} />
              </div>
              <h2 className="font-display font-black text-xl text-white tracking-wide">
                ADMINISTRATOR ACCESS
              </h2>
              <p className="text-xs text-neutral-400 max-w-xs mx-auto leading-relaxed">
                Enter your administrative passcode to unlock inventory controls, order tracking, and live financial metrics.
              </p>
            </div>

            {adminPasscodeError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg flex items-start gap-2.5 text-rose-300 text-xs font-mono">
                <ShieldAlert size={16} className="text-rose-400 shrink-0 mt-0.5" />
                <span>{adminPasscodeError}</span>
              </div>
            )}

            <form onSubmit={handleUnlock} className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[11px] font-mono">
                  <label htmlFor="gate-passcode" className="text-neutral-300 uppercase">
                    Admin Passcode
                  </label>
                  <span className="text-neutral-500 text-[10px]">Case-sensitive</span>
                </div>

                <div className="relative">
                  <input
                    id="gate-passcode"
                    ref={inputRef}
                    type={showPasscode ? 'text' : 'password'}
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Enter passcode..."
                    className="w-full pl-3.5 pr-10 py-2.5 bg-neutral-950 border border-neutral-700 focus:border-cyan-400 rounded-lg text-sm text-white font-mono placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasscode(!showPasscode)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                    tabIndex={-1}
                  >
                    {showPasscode ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Demo Hint & Quick Fill */}
              <div className="p-3 bg-neutral-950/60 border border-neutral-800 rounded-lg flex items-center justify-between text-[11px] font-mono">
                <div className="flex items-center gap-1.5 text-neutral-400">
                  <KeyRound size={13} className="text-cyan-400 shrink-0" />
                  <span>Passcode:</span>
                  <code className="text-cyan-300 bg-neutral-800/80 px-1.5 py-0.5 rounded font-mono select-all">
                    {ADMIN_PASSCODE}
                  </code>
                </div>
                <button
                  type="button"
                  onClick={handleAutoFill}
                  className="text-[10px] text-cyan-400 hover:text-cyan-300 underline font-bold transition-colors cursor-pointer"
                >
                  Auto-fill
                </button>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <button
                  type="button"
                  onClick={() => setActiveMode('storefront')}
                  className="flex-1 py-2.5 px-4 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs font-mono rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft size={14} />
                  <span>Back to Store</span>
                </button>

                <button
                  type="submit"
                  disabled={isVerifying || !passcode.trim()}
                  className="flex-1 py-2.5 px-4 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed text-black text-xs font-display font-black tracking-wider uppercase rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-500/20"
                >
                  {isVerifying ? (
                    <span>VERIFYING...</span>
                  ) : (
                    <>
                      <ShieldCheck size={15} />
                      <span>UNLOCK ERP</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col lg:flex-row selection:bg-cyan-400 selection:text-black">
      {/* Mobile Admin Top Navigation Bar */}
      <div className="lg:hidden p-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 rounded bg-neutral-900 border border-neutral-800 text-white"
          >
            {mobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="font-display font-black text-base tracking-wider text-white">
            GRID <span className="text-cyan-400 text-xs font-mono">// ERP</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={logoutAdmin}
            className="px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 rounded text-xs font-mono text-neutral-300 hover:text-rose-400 flex items-center gap-1"
            title="Lock Admin Portal"
          >
            <Lock size={12} className="text-amber-400" />
            <span>Lock</span>
          </button>
          <button
            onClick={() => setActiveMode('storefront')}
            className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded text-xs font-mono text-cyan-400 flex items-center gap-1.5"
          >
            <ArrowLeft size={13} />
            <span>Storefront</span>
          </button>
        </div>
      </div>

      {/* Persistent Left Sidebar on Desktop */}
      <div className="hidden lg:block">
        <AdminSidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-xs"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-neutral-950 z-10 shadow-2xl">
            <AdminSidebar onNavigate={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Admin Content Canvas */}
      <main className="flex-1 min-w-0 overflow-y-auto min-h-screen bg-neutral-950">
        {adminTab === 'dashboard' && <AdminDashboard />}
        {adminTab === 'inventory' && <InventoryManagement />}
        {adminTab === 'orders' && <OrderFulfillment />}
        {adminTab === 'settings' && <StoreSettings />}
      </main>
    </div>
  );
};
