import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Phone, User, Lock, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    authModalMode,
    closeAuthModal,
    setAuthModalMode,
    loginCustomer,
    loginAdmin,
  } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Customer form fields (ONLY Phone & Name)
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  // Admin form fields (Username & Password)
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [adminError, setAdminError] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens or mode changes
  useEffect(() => {
    if (isAuthModalOpen) {
      setAdminError('');
      setIsSubmitting(false);
    }
  }, [isAuthModalOpen, authModalMode]);

  if (!isAuthModalOpen) return null;

  const handleCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerPhone.trim() || !customerName.trim()) {
      showToast('Please enter your phone number and name', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      // Auto-lowercasing the name
      const lowerName = customerName.trim().toLowerCase();
      await loginCustomer(lowerName, customerPhone.trim());
      showToast(`Welcome, ${lowerName}!`, 'success');
      setCustomerName('');
      setCustomerPhone('');
    } catch {
      showToast('Failed to sign in. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');

    if (!adminUser.trim() || !adminPass.trim()) {
      setAdminError('Please provide both username and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await loginAdmin(adminUser, adminPass);
      if (res.success) {
        showToast('Logged in as Administrator', 'success');
        setAdminUser('');
        setAdminPass('');
        navigate('/admin');
      } else {
        setAdminError(res.message || 'Invalid username or password.');
      }
    } catch {
      setAdminError('Unexpected error during admin authentication.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-[#FFFDF5] rounded-3xl shadow-2xl border border-stone-200 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="bg-[#14532D] text-white p-5 sm:p-6 relative">
          <button
            type="button"
            onClick={closeAuthModal}
            className="absolute top-4 right-4 p-1.5 rounded-full text-stone-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-widest mb-1.5">
            <Sparkles className="w-3.5 h-3.5 fill-amber-400" />
            <span>{authModalMode === 'customer' ? 'Customer Sign In' : 'Admin Security Access'}</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white">
            {authModalMode === 'customer'
              ? 'Welcome to Amuthin Traders'
              : 'Administrator Portal'}
          </h3>
          <p className="text-xs text-stone-200 mt-1">
            {authModalMode === 'customer'
              ? 'Enter your mobile number & name to add to cart and place orders.'
              : 'Enter authorized administrator credentials to manage the store.'}
          </p>
        </div>

        {/* Form Body */}
        <div className="p-5 sm:p-6 space-y-4">
          {authModalMode === 'customer' ? (
            /* Customer Login Form: Phone & Name only */
            <form onSubmit={handleCustomerSubmit} className="space-y-4">
              {/* Phone Number Field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-800">
                  Mobile Number <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g. 9842154321"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#166534] focus:border-transparent transition-all shadow-xs"
                    autoFocus
                  />
                </div>
                <p className="text-[11px] text-stone-500">
                  We'll use this for your order delivery updates and tracking.
                </p>
              </div>

              {/* Name Field with Auto-lowercasing Note */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-800">
                  Your Name <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Karthick Raja"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#166534] focus:border-transparent transition-all shadow-xs"
                  />
                </div>
                {customerName.trim() && (
                  <p className="text-[11px] text-[#166534] font-medium flex items-center gap-1">
                    <span>Saved profile name:</span>
                    <span className="font-bold bg-amber-100 px-1.5 py-0.5 rounded text-stone-800">
                      {customerName.trim().toLowerCase()}
                    </span>
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3 rounded-xl bg-[#166534] hover:bg-[#14532D] text-white font-bold text-sm shadow-md active:scale-98 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Signing in...' : 'Sign In & Continue Shopping'}
              </button>
            </form>
          ) : (
            /* Admin Login Form: Username & Password */
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              {adminError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>{adminError}</span>
                </div>
              )}

              {/* Username */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-800">
                  Admin Username <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={adminUser}
                    onChange={(e) => setAdminUser(e.target.value)}
                    placeholder="e.g. admin"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#166534] focus:border-transparent transition-all shadow-xs"
                    autoFocus
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-800">
                  Admin Password <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={adminPass}
                    onChange={(e) => setAdminPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#166534] focus:border-transparent transition-all shadow-xs"
                  />
                </div>
              </div>

              {/* Demo Hint Banner */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-[11px] text-amber-900">
                <span className="font-bold">Authorized credentials:</span> username{' '}
                <code className="bg-amber-200/60 px-1 py-0.5 rounded font-mono font-bold">admin</code> • password{' '}
                <code className="bg-amber-200/60 px-1 py-0.5 rounded font-mono font-bold">amuthin123</code>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-[#14532D] hover:bg-[#0f3d21] text-amber-300 font-extrabold text-sm shadow-md active:scale-98 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Verifying Admin...' : 'Login as Store Admin'}
              </button>
            </form>
          )}

          {/* Footer Switcher */}
          <div className="pt-3 border-t border-stone-200 text-center">
            {authModalMode === 'customer' ? (
              <button
                type="button"
                onClick={() => setAuthModalMode('admin')}
                className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-[#166534] font-semibold cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-[#166534]" />
                <span>Store Manager? </span>
                <span className="text-[#166534] underline">Login as Admin</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setAuthModalMode('customer')}
                className="text-xs text-stone-600 hover:text-[#166534] font-semibold cursor-pointer"
              >
                Shopping as Customer? <span className="text-[#166534] underline">Customer Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
