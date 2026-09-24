import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  X,
  CheckCircle2,
  Package,
  MapPin,
  Phone,
  LogOut,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  Truck,
  ShieldCheck,
  ShieldAlert,
  KeyRound,
  ArrowRight,
  Printer,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatINR } from '../../utils/currency';

export const CustomerAuthModal: React.FC = () => {
  const {
    isCustomerAuthOpen,
    setIsCustomerAuthOpen,
    customerAuthTab,
    setCustomerAuthTab,
    currentCustomer,
    customerSignIn,
    customerSignUp,
    customerSignOut,
    updateCustomerProfile,
    customerOrders,
    setIsCartOpen,
    isAdminAuthenticated,
    verifyAdminPasscode,
    setActiveMode,
    logoutAdmin,
    openPrintBill,
  } = useStore();

  // Admin Passcode Form State within Sign In modal
  const [adminPasscode, setAdminPasscode] = useState('');
  const [showAdminPasscode, setShowAdminPasscode] = useState(false);
  const [adminLocalError, setAdminLocalError] = useState<string | null>(null);
  const [isAdminSubmitting, setIsAdminSubmitting] = useState(false);

  // Sign In Form State
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);

  // Sign Up Form State
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpStreet, setSignUpStreet] = useState('');
  const [signUpCity, setSignUpCity] = useState('');
  const [signUpState, setSignUpState] = useState('');
  const [signUpZip, setSignUpZip] = useState('');
  const [signUpCountry, setSignUpCountry] = useState('India');
  const [signUpError, setSignUpError] = useState<string | null>(null);

  // Profile Edit State
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileStreet, setProfileStreet] = useState('');
  const [profileCity, setProfileCity] = useState('');
  const [profileState, setProfileState] = useState('');
  const [profileZip, setProfileZip] = useState('');
  const [profileCountry, setProfileCountry] = useState('India');

  // Load customer details into profile editor when currentCustomer changes
  useEffect(() => {
    if (currentCustomer) {
      setProfileName(currentCustomer.name || '');
      setProfilePhone(currentCustomer.phone || '');
      setProfileStreet(currentCustomer.savedAddress?.street || '');
      setProfileCity(currentCustomer.savedAddress?.city || '');
      setProfileState(currentCustomer.savedAddress?.state || '');
      setProfileZip(currentCustomer.savedAddress?.zip || '');
      setProfileCountry(currentCustomer.savedAddress?.country || 'India');
    }
  }, [currentCustomer]);

  // Reset errors on tab change
  useEffect(() => {
    setSignInError(null);
    setSignUpError(null);
    setAdminLocalError(null);
  }, [customerAuthTab]);

  if (!isCustomerAuthOpen) return null;

  const handleAdminSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminPasscode.trim()) return;
    setAdminLocalError(null);
    setIsAdminSubmitting(true);
    setTimeout(() => {
      const success = verifyAdminPasscode(adminPasscode);
      setIsAdminSubmitting(false);
      if (success) {
        setAdminPasscode('');
        setIsCustomerAuthOpen(false);
      } else {
        setAdminLocalError('Invalid administrator passcode. Access denied.');
      }
    }, 200);
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError(null);
    const res = customerSignIn(signInEmail, signInPassword);
    if (!res.success) {
      setSignInError(res.error || 'Failed to sign in.');
    } else {
      setSignInEmail('');
      setSignInPassword('');
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpError(null);
    const res = customerSignUp({
      name: signUpName,
      email: signUpEmail,
      password: signUpPassword,
      phone: signUpPhone,
      street: signUpStreet,
      city: signUpCity,
      state: signUpState,
      zip: signUpZip,
      country: signUpCountry,
    });

    if (!res.success) {
      setSignUpError(res.error || 'Failed to create account.');
    } else {
      setSignUpName('');
      setSignUpEmail('');
      setSignUpPassword('');
      setSignUpPhone('');
      setSignUpStreet('');
      setSignUpCity('');
      setSignUpState('');
      setSignUpZip('');
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCustomerProfile({
      name: profileName,
      phone: profilePhone,
      savedAddress: {
        street: profileStreet,
        city: profileCity,
        state: profileState,
        zip: profileZip,
        country: profileCountry,
      },
    });
  };

  const totalSpentByCustomer = customerOrders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={() => setIsCustomerAuthOpen(false)} />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-neutral-950 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* Header with Brand & Close Button */}
        <div className="px-5 py-4 bg-neutral-900/90 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 bg-white text-black font-display font-black flex items-center justify-center text-xs">
              G
            </div>
            <div>
              <h2 className="font-display font-black text-sm text-white tracking-wide flex items-center gap-1.5">
                GRID{' '}
                <span className="text-cyan-400 text-xs font-mono">
                  {customerAuthTab === 'admin' ? '// ADMIN & STAFF PORTAL' : '// CLIENT ACCOUNT'}
                </span>
              </h2>
            </div>
          </div>
          <button
            onClick={() => setIsCustomerAuthOpen(false)}
            className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-neutral-800 bg-neutral-900/40 text-xs font-mono">
          {!currentCustomer ? (
            <>
              <button
                type="button"
                onClick={() => setCustomerAuthTab('signin')}
                className={`flex-1 py-3 text-center transition-all font-bold cursor-pointer ${
                  customerAuthTab === 'signin'
                    ? 'text-cyan-400 border-b-2 border-cyan-400 bg-neutral-900/80'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900/40'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setCustomerAuthTab('signup')}
                className={`flex-1 py-3 text-center transition-all font-bold cursor-pointer ${
                  customerAuthTab === 'signup'
                    ? 'text-cyan-400 border-b-2 border-cyan-400 bg-neutral-900/80'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900/40'
                }`}
              >
                Create Account
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setCustomerAuthTab('profile')}
                className={`flex-1 py-3 text-center transition-all font-bold cursor-pointer ${
                  customerAuthTab === 'profile'
                    ? 'text-cyan-400 border-b-2 border-cyan-400 bg-neutral-900/80'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900/40'
                }`}
              >
                Profile & Address
              </button>
              <button
                type="button"
                onClick={() => setCustomerAuthTab('orders')}
                className={`flex-1 py-3 text-center transition-all font-bold cursor-pointer flex items-center justify-center gap-1.5 ${
                  customerAuthTab === 'orders'
                    ? 'text-cyan-400 border-b-2 border-cyan-400 bg-neutral-900/80'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900/40'
                }`}
              >
                <span>My Orders</span>
                <span className="px-1.5 py-0.2 bg-neutral-800 text-neutral-300 text-[10px] rounded-full">
                  {customerOrders.length}
                </span>
              </button>
            </>
          )}

          {/* Admin & Staff Portal Tab */}
          <button
            type="button"
            id="auth-modal-admin-tab-btn"
            onClick={() => setCustomerAuthTab('admin')}
            className={`px-3 sm:px-4 py-3 text-center transition-all font-bold cursor-pointer flex items-center justify-center gap-1.5 border-l border-neutral-800 ${
              customerAuthTab === 'admin'
                ? 'text-cyan-400 border-b-2 border-cyan-400 bg-neutral-900/80'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900/40'
            }`}
            title="Administrator & Staff Portal Access"
          >
            <ShieldCheck size={14} className={customerAuthTab === 'admin' ? 'text-cyan-400' : 'text-neutral-500'} />
            <span className="hidden sm:inline">Staff / Admin</span>
            <span className="sm:hidden">Admin</span>
            {isAdminAuthenticated && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            )}
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* ================= SIGN IN TAB ================= */}
          {!currentCustomer && customerAuthTab === 'signin' && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <h3 className="font-display font-black text-lg text-white">WELCOME BACK</h3>
                <p className="text-neutral-400 text-xs">
                  Access your orders, saved delivery addresses, and VIP drop access.
                </p>
              </div>

              {signInError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-300 text-xs font-mono">
                  {signInError}
                </div>
              )}

              <form onSubmit={handleSignIn} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-neutral-300 font-mono text-[11px] uppercase">Email Address</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                    <input
                      type="email"
                      required
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      placeholder="client@domain.com"
                      className="w-full pl-9 pr-3 py-2 bg-neutral-900 border border-neutral-700 focus:border-cyan-400 rounded-lg text-white font-mono placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[11px] font-mono">
                    <label className="text-neutral-300 uppercase">Password</label>
                  </div>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                    <input
                      type={showSignInPassword ? 'text' : 'password'}
                      required
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2 bg-neutral-900 border border-neutral-700 focus:border-cyan-400 rounded-lg text-white font-mono placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignInPassword(!showSignInPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                      tabIndex={-1}
                    >
                      {showSignInPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-cyan-400 hover:bg-cyan-300 text-black font-display font-black text-xs uppercase tracking-wider rounded-lg transition-all shadow-lg shadow-cyan-500/20 cursor-pointer"
                >
                  SIGN IN TO ACCOUNT
                </button>
              </form>

              {/* Store Administration Entry Option */}
              <div className="pt-3 border-t border-neutral-800 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck size={13} className="text-cyan-400" />
                    <span>Store Management</span>
                  </span>
                  <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">Staff ERP</span>
                </div>
                <button
                  type="button"
                  id="signin-switch-to-admin-btn"
                  onClick={() => setCustomerAuthTab('admin')}
                  className="w-full py-2.5 px-3 bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700/80 hover:border-cyan-400/50 rounded-lg text-neutral-200 text-xs font-mono flex items-center justify-between transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 text-left">
                    <div className="w-7 h-7 rounded-md bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                      <ShieldCheck size={15} />
                    </div>
                    <div>
                      <span className="font-bold text-white block">Switch to Admin Panel</span>
                      <span className="text-[10px] text-neutral-400">Inventory, orders, dispatch dates & settings</span>
                    </div>
                  </div>
                  <span className="text-cyan-400 font-bold text-xs group-hover:translate-x-1 transition-transform">
                    Enter →
                  </span>
                </button>
              </div>

              <div className="text-center pt-2">
                <span className="text-neutral-400">Don't have an account? </span>
                <button
                  type="button"
                  onClick={() => setCustomerAuthTab('signup')}
                  className="text-cyan-400 hover:text-cyan-300 font-bold underline cursor-pointer"
                >
                  Create one now
                </button>
              </div>
            </div>
          )}

          {/* ================= SIGN UP TAB ================= */}
          {!currentCustomer && customerAuthTab === 'signup' && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <h3 className="font-display font-black text-lg text-white">CREATE CLIENT PROFILE</h3>
                <p className="text-neutral-400 text-xs">
                  Join the GRID Collective for expedited checkout and order archives.
                </p>
              </div>

              {signUpError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-300 text-xs font-mono">
                  {signUpError}
                </div>
              )}

              <form onSubmit={handleSignUp} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-neutral-300 font-mono text-[11px] uppercase">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={signUpName}
                      onChange={(e) => setSignUpName(e.target.value)}
                      placeholder="e.g. Arjun Mehta"
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 focus:border-cyan-400 rounded-lg text-white font-mono placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-neutral-300 font-mono text-[11px] uppercase">Phone Number</label>
                    <input
                      type="tel"
                      value={signUpPhone}
                      onChange={(e) => setSignUpPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 focus:border-cyan-400 rounded-lg text-white font-mono placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-300 font-mono text-[11px] uppercase">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    placeholder="arjun@domain.com"
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 focus:border-cyan-400 rounded-lg text-white font-mono placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-300 font-mono text-[11px] uppercase">Password (min 6 chars) *</label>
                  <div className="relative">
                    <input
                      type={showSignUpPassword ? 'text' : 'password'}
                      required
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-3 pr-10 py-2 bg-neutral-900 border border-neutral-700 focus:border-cyan-400 rounded-lg text-white font-mono placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                      tabIndex={-1}
                    >
                      {showSignUpPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* Optional Shipping Address Info */}
                <div className="pt-2 border-t border-neutral-800 space-y-2">
                  <div className="flex items-center gap-1.5 text-neutral-400 font-mono text-[11px] uppercase">
                    <MapPin size={13} className="text-cyan-400" />
                    <span>Default Delivery Address (Optional)</span>
                  </div>

                  <input
                    type="text"
                    value={signUpStreet}
                    onChange={(e) => setSignUpStreet(e.target.value)}
                    placeholder="Street Address, Apt / Suite"
                    className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-800 focus:border-cyan-400 rounded-lg text-white font-mono placeholder-neutral-500"
                  />

                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={signUpCity}
                      onChange={(e) => setSignUpCity(e.target.value)}
                      placeholder="City"
                      className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 focus:border-cyan-400 rounded-lg text-white font-mono placeholder-neutral-500"
                    />
                    <input
                      type="text"
                      value={signUpState}
                      onChange={(e) => setSignUpState(e.target.value)}
                      placeholder="State"
                      className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 focus:border-cyan-400 rounded-lg text-white font-mono placeholder-neutral-500"
                    />
                    <input
                      type="text"
                      value={signUpZip}
                      onChange={(e) => setSignUpZip(e.target.value)}
                      placeholder="PIN / Zip"
                      className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 focus:border-cyan-400 rounded-lg text-white font-mono placeholder-neutral-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-cyan-400 hover:bg-cyan-300 text-black font-display font-black text-xs uppercase tracking-wider rounded-lg transition-all shadow-lg shadow-cyan-500/20 cursor-pointer mt-2"
                >
                  CREATE ACCOUNT & SIGN IN
                </button>
              </form>

              <div className="text-center pt-2 space-y-1">
                <div>
                  <span className="text-neutral-400">Already have an account? </span>
                  <button
                    type="button"
                    onClick={() => setCustomerAuthTab('signin')}
                    className="text-cyan-400 hover:text-cyan-300 font-bold underline cursor-pointer"
                  >
                    Sign In
                  </button>
                </div>
                <div className="text-[11px]">
                  <span className="text-neutral-500">Store administrator or staff? </span>
                  <button
                    type="button"
                    onClick={() => setCustomerAuthTab('admin')}
                    className="text-cyan-400 hover:text-cyan-300 font-bold underline cursor-pointer"
                  >
                    Admin Sign In
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= PROFILE TAB (LOGGED IN) ================= */}
          {currentCustomer && customerAuthTab === 'profile' && (
            <div className="space-y-4">
              {/* Profile Card Header */}
              <div className="p-4 bg-neutral-900/60 border border-neutral-800 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-cyan-400/20 border border-cyan-400/40 text-cyan-300 font-display font-black text-lg flex items-center justify-center">
                    {currentCustomer.name.slice(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">{currentCustomer.name}</h3>
                    <p className="text-neutral-400 text-xs font-mono">{currentCustomer.email}</p>
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      GRID ARCHIVE MEMBER
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={customerSignOut}
                  className="px-3 py-1.5 bg-neutral-800 hover:bg-rose-950/40 hover:text-rose-400 hover:border-rose-900/50 border border-neutral-700 text-neutral-300 text-xs font-mono rounded flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Sign out of customer account"
                >
                  <LogOut size={13} />
                  <span>Sign Out</span>
                </button>
              </div>

              {/* Account Quick Metrics */}
              <div className="grid grid-cols-2 gap-3 font-mono">
                <div className="p-3 bg-neutral-900/40 border border-neutral-800 rounded-lg">
                  <span className="text-[10px] text-neutral-400 block uppercase">Total Purchases</span>
                  <span className="text-base font-bold text-white">{customerOrders.length} Orders</span>
                </div>
                <div className="p-3 bg-neutral-900/40 border border-neutral-800 rounded-lg">
                  <span className="text-[10px] text-neutral-400 block uppercase">Cumulative Billed</span>
                  <span className="text-base font-bold text-cyan-400">{formatINR(totalSpentByCustomer)}</span>
                </div>
              </div>

              {/* Saved Shipping Details Form */}
              <form onSubmit={handleSaveProfile} className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-mono text-xs uppercase font-bold text-neutral-300 flex items-center gap-1.5">
                    <MapPin size={14} className="text-cyan-400" />
                    <span>Saved Delivery Address</span>
                  </h4>
                  <span className="text-[10px] text-neutral-500 font-mono">Auto-fills during checkout</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-neutral-400 font-mono text-[10px] uppercase">Full Name</label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 focus:border-cyan-400 rounded text-white font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-neutral-400 font-mono text-[10px] uppercase">Phone</label>
                    <input
                      type="tel"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 focus:border-cyan-400 rounded text-white font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-400 font-mono text-[10px] uppercase">Street Address / Landmark</label>
                  <input
                    type="text"
                    value={profileStreet}
                    onChange={(e) => setProfileStreet(e.target.value)}
                    placeholder="Building, street, flat number"
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 focus:border-cyan-400 rounded text-white font-mono"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <label className="text-neutral-400 font-mono text-[10px] uppercase">City</label>
                    <input
                      type="text"
                      value={profileCity}
                      onChange={(e) => setProfileCity(e.target.value)}
                      className="w-full px-2.5 py-2 bg-neutral-900 border border-neutral-800 focus:border-cyan-400 rounded text-white font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-neutral-400 font-mono text-[10px] uppercase">State</label>
                    <input
                      type="text"
                      value={profileState}
                      onChange={(e) => setProfileState(e.target.value)}
                      className="w-full px-2.5 py-2 bg-neutral-900 border border-neutral-800 focus:border-cyan-400 rounded text-white font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-neutral-400 font-mono text-[10px] uppercase">PIN Code</label>
                    <input
                      type="text"
                      value={profileZip}
                      onChange={(e) => setProfileZip(e.target.value)}
                      className="w-full px-2.5 py-2 bg-neutral-900 border border-neutral-800 focus:border-cyan-400 rounded text-white font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-mono font-bold text-xs uppercase tracking-wider rounded transition-colors cursor-pointer"
                >
                  SAVE SHIPPING ADDRESS
                </button>
              </form>

              {/* Staff / Admin Management Option for logged in users */}
              <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-cyan-400" />
                    <span>Store Administration</span>
                  </p>
                  <p className="text-[10px] text-neutral-400">Inventory & order dispatch workspace</p>
                </div>
                <button
                  type="button"
                  onClick={() => setCustomerAuthTab('admin')}
                  className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-cyan-400 font-mono text-xs rounded transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>Admin Portal</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          )}

          {/* ================= MY ORDERS TAB (LOGGED IN) ================= */}
          {currentCustomer && customerAuthTab === 'orders' && (
            <div className="space-y-3">
              {customerOrders.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto text-neutral-500">
                    <ShoppingBag size={22} />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-white">NO ORDERS YET</h4>
                    <p className="text-xs text-neutral-400 max-w-xs mx-auto mt-1">
                      You haven't placed any orders with this client account yet. Explore our latest heavyweight drop!
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomerAuthOpen(false);
                      window.scrollTo({ top: 500, behavior: 'smooth' });
                    }}
                    className="px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-black font-display font-black text-xs uppercase tracking-wider rounded cursor-pointer"
                  >
                    EXPLORE DROP 04
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {customerOrders.map((order) => {
                    const statusColors: Record<string, string> = {
                      Processing: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
                      Shipped: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
                      'On the way': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
                      Delivered: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
                      Cancelled: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
                    };

                    return (
                      <div
                        key={order.id}
                        className="p-4 bg-neutral-900/60 border border-neutral-800 rounded-lg space-y-3 font-mono"
                      >
                        {/* Order Top Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 pb-2.5">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-xs">{order.orderNumber}</span>
                              <span
                                className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                                  statusColors[order.status] || 'bg-neutral-800 text-neutral-300'
                                }`}
                              >
                                {order.status}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 mt-1 text-[10px] text-neutral-400">
                              <span>
                                Ordered: {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </span>
                              {order.dispatchDate && (
                                <span className="text-cyan-400">
                                  • Dispatched: {new Date(order.dispatchDate).toLocaleDateString('en-IN', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                  })}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-[10px] text-neutral-400 block">TOTAL BILLED</span>
                            <span className="font-bold text-white text-sm">{formatINR(order.total)}</span>
                          </div>
                        </div>

                        {/* Order Items List */}
                        <div className="space-y-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2.5 text-xs">
                              <img
                                src={item.image}
                                alt={item.productName}
                                className="w-10 h-12 object-cover rounded bg-neutral-800 border border-neutral-700 shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-white truncate text-[11px]">{item.productName}</p>
                                <p className="text-[10px] text-neutral-400">
                                  {item.selectedSize} • {item.selectedColor} • Qty: {item.quantity}
                                </p>
                              </div>
                              <span className="font-bold text-neutral-300 text-xs shrink-0">
                                {formatINR(item.price * item.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Tracking Info if Shipped */}
                        {order.trackingNumber && (
                          <div className="p-2.5 bg-neutral-950/80 rounded border border-neutral-800/80 flex items-center justify-between text-[10px]">
                            <span className="flex items-center gap-1.5 text-neutral-400">
                              <Truck size={13} className="text-cyan-400" />
                              <span>Courier Waybill: <strong>{order.trackingNumber}</strong></span>
                            </span>
                            <span className="text-emerald-400 font-bold">IN TRANSIT</span>
                          </div>
                        )}

                        {/* Order Footer with Delivery Option & Print Bill Button */}
                        <div className="pt-2.5 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                          <span className="text-neutral-400">
                            Shipping:{' '}
                            <strong className="text-neutral-300">
                              {order.shippingOption ||
                                (order.shipping === 0 ? '1. Free Delivery' : '2. Delivery Charge')}
                            </strong>
                            {' • '}
                            <span className={order.shipping === 0 ? 'text-emerald-400 font-bold' : 'text-cyan-400 font-bold'}>
                              {order.shipping === 0 ? 'FREE' : formatINR(order.shipping)}
                            </span>
                          </span>

                          <button
                            type="button"
                            onClick={() => openPrintBill(order)}
                            className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 hover:text-white text-cyan-400 font-bold rounded border border-neutral-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                            title="Print Products Bill / Tax Invoice"
                          >
                            <Printer size={13} />
                            <span>Print Bill</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ================= ADMIN & STAFF TAB ================= */}
          {customerAuthTab === 'admin' && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 mx-auto mb-1">
                  <ShieldCheck size={22} />
                </div>
                <h3 className="font-display font-black text-lg text-white">ADMINISTRATOR ACCESS GATE</h3>
                <p className="text-neutral-400 text-xs max-w-sm mx-auto">
                  Staff authentication portal for warehouse inventory, live order dispatch controls, delivery fee toggles, and financial reporting.
                </p>
              </div>

              {adminLocalError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-300 text-xs font-mono flex items-center gap-2">
                  <ShieldAlert size={15} className="shrink-0 text-rose-400" />
                  <span>{adminLocalError}</span>
                </div>
              )}

              {isAdminAuthenticated ? (
                /* Already Authenticated State */
                <div className="space-y-3 p-4 bg-neutral-900/60 border border-cyan-500/30 rounded-xl">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span className="font-mono text-xs font-bold text-emerald-400">
                        ADMIN SESSION UNLOCKED
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded">
                      SUPER ADMIN
                    </span>
                  </div>

                  <p className="text-neutral-300 text-xs">
                    Your administrative credentials have been verified. You can enter the management workspace or lock your session.
                  </p>

                  <div className="pt-2 flex flex-col gap-2">
                    <button
                      type="button"
                      id="launch-admin-erp-btn"
                      onClick={() => {
                        setIsCustomerAuthOpen(false);
                        setActiveMode('admin');
                      }}
                      className="w-full py-2.5 bg-cyan-400 hover:bg-cyan-300 text-black font-display font-black text-xs uppercase tracking-wider rounded-lg transition-all shadow-lg shadow-cyan-500/20 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>OPEN ADMIN ERP DASHBOARD</span>
                      <ArrowRight size={15} />
                    </button>

                    <button
                      type="button"
                      onClick={() => logoutAdmin()}
                      className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white font-mono text-xs rounded-lg transition-colors cursor-pointer"
                    >
                      Lock Administrator Session
                    </button>
                  </div>
                </div>
              ) : (
                /* Unauthenticated Passcode Form */
                <form onSubmit={handleAdminSignIn} className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[11px] font-mono">
                      <label className="text-neutral-300 uppercase">Master Passcode</label>
                      <span className="text-cyan-400 text-[10px]">Staff Protected</span>
                    </div>
                    <div className="relative">
                      <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                      <input
                        id="admin-modal-passcode-input"
                        type={showAdminPasscode ? 'text' : 'password'}
                        required
                        value={adminPasscode}
                        onChange={(e) => setAdminPasscode(e.target.value)}
                        placeholder="Enter master admin passcode"
                        className="w-full pl-9 pr-10 py-2.5 bg-neutral-900 border border-neutral-700 focus:border-cyan-400 rounded-lg text-white font-mono placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAdminPasscode(!showAdminPasscode)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                        tabIndex={-1}
                      >
                        {showAdminPasscode ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    id="admin-verify-btn"
                    disabled={isAdminSubmitting}
                    className="w-full py-2.5 bg-cyan-400 hover:bg-cyan-300 text-black font-display font-black text-xs uppercase tracking-wider rounded-lg transition-all shadow-lg shadow-cyan-500/20 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <KeyRound size={14} />
                    <span>{isAdminSubmitting ? 'VERIFYING CREDENTIALS...' : 'UNLOCK & ENTER ADMIN PANEL'}</span>
                  </button>
                </form>
              )}

              <div className="text-center pt-2 border-t border-neutral-800/80">
                <button
                  type="button"
                  onClick={() => setCustomerAuthTab(currentCustomer ? 'profile' : 'signin')}
                  className="text-neutral-400 hover:text-white text-xs font-mono underline cursor-pointer"
                >
                  ← Return to Customer {currentCustomer ? 'Profile' : 'Sign In'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
