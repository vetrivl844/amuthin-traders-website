import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, RefreshCw, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const SignOutPage: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout, openAuthModal } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await logout();
    showToast('Signed out successfully', 'info');
    navigate('/');
  };

  const handleSwitchAccount = async () => {
    await logout();
    showToast('Signed out. Please enter your mobile number and name.', 'info');
    openAuthModal('customer');
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12 sm:py-16">
      <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-sm space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center">
            <LogOut className="w-8 h-8 text-[#166534]" />
          </div>
          <h1 className="text-2xl font-black text-stone-900">
            {isAuthenticated ? 'Sign Out / Switch Account' : 'You are Signed Out'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600">
            {isAuthenticated
              ? 'Manage your current store session or sign in with another account.'
              : 'You are currently not signed in. Log in using your mobile number and name.'}
          </p>
        </div>

        {/* User Card if Authenticated */}
        {isAuthenticated && user && (
          <div className="flex items-center gap-3.5 p-4 bg-stone-50 rounded-2xl border border-stone-200">
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
        )}

        {/* Action Controls */}
        <div className="space-y-3 pt-2">
          {isAuthenticated ? (
            <>
              {/* Switch Account */}
              <button
                type="button"
                onClick={handleSwitchAccount}
                className="w-full p-3.5 rounded-2xl bg-[#166534] hover:bg-[#14532D] text-white flex items-center justify-between transition-all shadow-xs cursor-pointer group"
              >
                <div className="flex items-center gap-3 text-left">
                  <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                    <RefreshCw className="w-4 h-4 text-amber-300 group-hover:rotate-180 transition-transform duration-500" />
                  </div>
                  <div>
                    <div className="text-sm font-bold leading-tight">
                      Login with Different Account
                    </div>
                    <div className="text-[11px] text-emerald-200 leading-tight mt-0.5">
                      Uses Mobile Number & Name only
                    </div>
                  </div>
                </div>
                <span className="text-xs font-bold text-amber-300 bg-white/10 px-2.5 py-1 rounded-lg">
                  Switch
                </span>
              </button>

              {/* Complete Sign Out */}
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full p-3.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 flex items-center justify-between transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3 text-left">
                  <div className="w-9 h-9 rounded-xl bg-rose-200/70 text-rose-700 flex items-center justify-center shrink-0">
                    <LogOut className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold leading-tight">
                      Sign Out Completely
                    </div>
                    <div className="text-[11px] text-rose-500 leading-tight mt-0.5">
                      Clear current session
                    </div>
                  </div>
                </div>
                <span className="text-xs font-bold text-rose-700 bg-rose-200/60 px-2.5 py-1 rounded-lg">
                  Sign Out
                </span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => openAuthModal('customer')}
              className="w-full py-3.5 rounded-2xl bg-[#166534] hover:bg-[#14532D] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all"
            >
              <User className="w-4 h-4 text-amber-300" />
              <span>Sign In with Phone & Name</span>
            </button>
          )}

          {/* Return to store */}
          <Link
            to="/"
            className="w-full py-3 rounded-2xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Store Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
