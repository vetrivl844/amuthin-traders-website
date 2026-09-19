import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Layers,
  Tag,
  Users,
  Store,
  Menu,
  X,
  Plus,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { switchRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const adminNav = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { label: 'Categories', path: '/admin/categories', icon: Layers },
    { label: 'Offers & Coupons', path: '/admin/offers', icon: Tag },
    { label: 'Customers', path: '/admin/customers', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      {/* Admin Top Header */}
      <header className="bg-stone-900 text-white sticky top-0 z-30 border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800"
              aria-label="Toggle admin menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <img
                src="/assets/logo.png"
                alt="Amuthin"
                className="w-8 h-8 rounded-lg bg-white p-0.5 object-cover"
              />
              <div>
                <span className="font-extrabold text-sm sm:text-base tracking-wide text-white">
                  AMUTHIN ADMIN
                </span>
                <span className="text-[10px] text-amber-400 block -mt-1 font-semibold">
                  Store Management Console
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/products/new"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#166534] hover:bg-[#14532D] text-white text-xs font-bold transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </Link>

            <Link
              to="/"
              onClick={() => switchRole('customer')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-colors border border-stone-700"
            >
              <Store className="w-3.5 h-3.5 text-amber-400" />
              <span>Back to Store</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar (Desktop) */}
        <aside className="hidden lg:block lg:col-span-3 space-y-2">
          <div className="bg-white rounded-2xl border border-stone-200/90 p-3 shadow-2xs space-y-1">
            <div className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-wider text-stone-600">
              Management
            </div>
            {adminNav.map((item) => {
              const isActive =
                item.path === '/admin'
                  ? location.pathname === '/admin'
                  : location.pathname.startsWith(item.path);
              const Icon = item.icon;

              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#166534] text-white shadow-2xs'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div
              className="fixed inset-0 bg-black/50"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 w-64 bg-white p-4 shadow-2xl z-10 space-y-2 animate-in slide-in-from-left">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <span className="font-bold text-sm text-stone-900">Admin Navigation</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded text-stone-400 hover:text-stone-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {adminNav.map((item) => {
                const isActive =
                  item.path === '/admin'
                    ? location.pathname === '/admin'
                    : location.pathname.startsWith(item.path);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold ${
                      isActive
                        ? 'bg-[#166534] text-white'
                        : 'text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Main Admin Workspace Area */}
        <main className="lg:col-span-9 space-y-6">{children}</main>
      </div>
    </div>
  );
};
