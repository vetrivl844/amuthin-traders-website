import React from 'react';
import { X, LogOut, User, RefreshCw, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const SignOutModal: React.FC = () => {
  const {
    isSignOutModalOpen,
    closeSignOutModal,
    logout,
    signOutAndSwitchAccount,
    user,
    isAdmin,
  } = useAuth();
  const { showToast } = useToast();

  if (!isSignOutModalOpen) return null;

  const handleSignOut = async () => {
    await logout();
    showToast('Signed out successfully', 'info');
  };

  const handleSwitchAccount = async () => {
    await signOutAndSwitchAccount();
    showToast('Ready for new sign in. Enter mobile number & name.', 'info');
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
            onClick={closeSignOutModal}
            className="absolute top-4 right-4 p-1.5 rounded-full text-stone-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-widest mb-1.5">
            <LogOut className="w-3.5 h-3.5" />
            <span>Account Session</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white">
            Sign Out or Switch Account
          </h3>
          <p className="text-xs text-stone-200 mt-1">
            Choose whether to log out completely or switch to a different customer account.
          </p>
        </div>

        {/* Current Account Details */}
        <div className="p-5 sm:p-6 space-y-4">
          {user ? (
            <div className="flex items-center gap-3.5 p-3.5 bg-stone-100/80 rounded-2xl border border-stone-200">
              <div className="w-12 h-12 rounded-full bg-[#166534] text-white flex items-center justify-center font-bold text-lg uppercase shrink-0 shadow-2xs">
                {user.name ? user.name.charAt(0) : 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-stone-900 truncate lowercase">
                    {user.name}
                  </p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isAdmin ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                  }`}>
                    {isAdmin ? 'Admin' : 'Customer'}
                  </span>
                </div>
                <p className="text-xs text-stone-500 truncate mt-0.5">
                  {user.phone || user.email || 'Mobile account'}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3 text-xs text-stone-500 bg-stone-100 rounded-xl">
              No active session found.
            </div>
          )}

          {/* Action Options */}
          <div className="space-y-2.5 pt-1">
            {/* Switch Account Option */}
            <button
              type="button"
              onClick={handleSwitchAccount}
              className="w-full p-3 rounded-2xl bg-[#166534] hover:bg-[#14532D] text-white flex items-center justify-between transition-all shadow-xs cursor-pointer group"
            >
              <div className="flex items-center gap-3 text-left">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <RefreshCw className="w-4 h-4 text-amber-300 group-hover:rotate-180 transition-transform duration-500" />
                </div>
                <div>
                  <div className="text-xs font-bold leading-tight">
                    Login with Different Account
                  </div>
                  <div className="text-[10px] text-emerald-200 leading-tight mt-0.5">
                    Sign in using another Phone Number & Name only
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-bold text-amber-300 bg-white/10 px-2 py-1 rounded-lg">
                Switch
              </span>
            </button>

            {/* Direct Sign Out Option */}
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full p-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 flex items-center justify-between transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3 text-left">
                <div className="w-8 h-8 rounded-xl bg-rose-200/70 text-rose-700 flex items-center justify-center shrink-0">
                  <LogOut className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold leading-tight">
                    Sign Out Completely
                  </div>
                  <div className="text-[10px] text-rose-500 leading-tight mt-0.5">
                    Clear current session from this browser
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-bold text-rose-700 bg-rose-200/60 px-2 py-1 rounded-lg">
                Sign Out
              </span>
            </button>
          </div>

          {/* Cancel */}
          <div className="pt-2">
            <button
              type="button"
              onClick={closeSignOutModal}
              className="w-full py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
            >
              Stay Signed In / Keep Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
