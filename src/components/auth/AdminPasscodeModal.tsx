import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldAlert,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  X,
  ShieldCheck,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminPasscodeModal: React.FC = () => {
  const {
    isAdminPasscodeModalOpen,
    setIsAdminPasscodeModalOpen,
    adminPasscodeError,
    verifyAdminPasscode,
    setActiveMode,
  } = useStore();

  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAdminPasscodeModalOpen) {
      setPasscode('');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isAdminPasscodeModalOpen]);

  if (!isAdminPasscodeModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const success = verifyAdminPasscode(passcode);
      setIsSubmitting(false);
      if (success) {
        setPasscode('');
      } else {
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    }, 200);
  };

  const handleCancel = () => {
    setIsAdminPasscodeModalOpen(false);
    setActiveMode('storefront');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      {/* Backdrop click */}
      <div className="fixed inset-0" onClick={handleCancel} />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-neutral-950 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden z-10">
        {/* Top Decorative Terminal Bar */}
        <div className="px-5 py-3.5 bg-neutral-900/90 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="font-mono text-xs uppercase tracking-wider text-neutral-300 font-bold">
              GRID // ERP SECURITY GATE
            </span>
          </div>
          <button
            onClick={handleCancel}
            className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            title="Cancel and return to storefront"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6 sm:p-7 space-y-5">
          {/* Header Icon & Intro */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 mb-1">
              <Lock size={24} />
            </div>
            <h3 className="font-display font-black text-lg sm:text-xl text-white tracking-wide">
              ADMINISTRATOR ACCESS REQUIRED
            </h3>
            <p className="text-xs text-neutral-400 max-w-xs mx-auto leading-relaxed">
              This area contains real-time inventory management, financial analytics, and order fulfillment controls.
            </p>
          </div>

          {/* Error Message */}
          {adminPasscodeError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg flex items-start gap-2.5 text-rose-300 text-xs font-mono animate-shake">
              <ShieldAlert size={16} className="text-rose-400 shrink-0 mt-0.5" />
              <span>{adminPasscodeError}</span>
            </div>
          )}

          {/* Passcode Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[11px] font-mono">
                <label htmlFor="admin-passcode-input" className="text-neutral-300 uppercase tracking-wider">
                  Admin Passcode
                </label>
                <span className="text-neutral-500 text-[10px]">Case-sensitive</span>
              </div>

              <div className="relative">
                <input
                  id="admin-passcode-input"
                  ref={inputRef}
                  type={showPasscode ? 'text' : 'password'}
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter passcode to unlock..."
                  autoComplete="off"
                  className="w-full pl-3.5 pr-10 py-2.5 bg-neutral-900 border border-neutral-700 focus:border-cyan-400 rounded-lg text-sm text-white font-mono placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
                  tabIndex={-1}
                >
                  {showPasscode ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs font-mono rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Back to Store</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting || !passcode.trim()}
                className="flex-1 py-2.5 px-4 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed text-black text-xs font-display font-black tracking-wider uppercase rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-500/20"
              >
                {isSubmitting ? (
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
};
