/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { StorefrontView } from './components/storefront/StorefrontView';
import { AdminView } from './components/admin/AdminView';
import { CustomerAuthModal } from './components/auth/CustomerAuthModal';
import { AdminPasscodeModal } from './components/auth/AdminPasscodeModal';
import { ProductBillModal } from './components/common/ProductBillModal';
import { CheckCircle, Info, X } from 'lucide-react';

const RootContent: React.FC = () => {
  const {
    activeMode,
    notification,
    setNotification,
    printingBillOrder,
    closePrintBill,
  } = useStore();

  return (
    <div className="relative min-h-screen bg-neutral-950 font-sans antialiased text-neutral-100">
      {/* Dynamic View Swapper */}
      {activeMode === 'storefront' ? <StorefrontView /> : <AdminView />}

      {/* Global Customer Authentication & Profile Modal */}
      <CustomerAuthModal />

      {/* Global Administrator Passcode Gate Modal */}
      <AdminPasscodeModal />

      {/* Global Printable Products Bill / Tax Invoice Modal */}
      <ProductBillModal
        order={printingBillOrder}
        isOpen={Boolean(printingBillOrder)}
        onClose={closePrintBill}
      />

      {/* Global Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 bg-neutral-900/95 border border-cyan-500/40 text-white rounded-lg shadow-2xl backdrop-blur-md animate-fade-in font-mono text-xs max-w-sm">
          <div className="p-1 rounded bg-cyan-400/10 text-cyan-400">
            <CheckCircle size={16} />
          </div>
          <span className="flex-1">{notification}</span>
          <button
            onClick={() => setNotification(null)}
            className="p-1 text-neutral-400 hover:text-white transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <RootContent />
    </StoreProvider>
  );
}

