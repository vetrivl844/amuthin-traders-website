import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  Sparkles,
  Phone,
  ShieldCheck,
  Search,
  LayoutDashboard,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { initialNavigation, initialSiteConfig } from '../../data/initialData';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { SearchBar } from './SearchBar';

export const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { itemCount, openCartDrawer } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAuthenticated, isAdmin, logout, openAuthModal, openSignOutModal } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const navItems = initialNavigation;

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-stone-200/80 shadow-xs">
      {/* Top Notification Announcement Bar */}
      <div className="bg-[#14532D] text-stone-100 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] sm:text-xs">
            <span className="bg-[#FACC15] text-[#14532D] font-extrabold px-1.5 py-0.5 rounded text-[10px] tracking-wide">
              MILLETS FIRST
            </span>
            <span className="hidden md:inline font-medium">
              தமிழர் பாரம்பரியம் • 100% Unpolished Positive Millets & Heritage Rice
            </span>
            <span className="md:hidden font-medium">
              Free Delivery above ₹499 across India
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <a
              href={`tel:${initialSiteConfig.phone.replace(/\s+/g, '')}`}
              className="hidden sm:inline-flex items-center gap-1 hover:text-amber-300 transition-colors"
            >
              <Phone className="w-3 h-3 text-amber-400" />
              <span>{initialSiteConfig.phone}</span>
            </a>
            {isAdmin ? (
              <Link
                to="/admin"
                className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400 text-stone-950 hover:bg-amber-300 transition-colors"
              >
                <LayoutDashboard className="w-3 h-3" />
                <span>Admin Dashboard</span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal('admin', () => navigate('/admin'))}
                className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-800/90 hover:bg-emerald-700 text-amber-300 border border-emerald-700/60 transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-3 h-3 text-amber-400" />
                <span>Login as Admin</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Left: Mobile Menu Toggle & Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-stone-700 hover:bg-stone-100 rounded-xl cursor-pointer"
              aria-label="Open mobile menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-amber-50 border-2 border-[#166534] p-0.5 shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                <img
                  src="/assets/logo.png"
                  alt="Amuthin Traders Logo"
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    // Fallback to organic badge if image load issue
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-xl font-extrabold tracking-tight text-[#14532D] group-hover:text-[#166534] transition-colors leading-tight">
                  AMUTHIN TRADERS
                </span>
                <span className="text-[10px] sm:text-[11px] font-semibold text-[#4D7C0F] tracking-wide flex items-center gap-1">
                  <span>தமிழர் பாரம்பரியம்</span>
                  <span className="hidden sm:inline">• Traditional Foods</span>
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Desktop Global Search Bar */}
          <div className="hidden lg:flex flex-1 justify-center max-w-md mx-4">
            <SearchBar />
          </div>

          {/* Right Action Icons: Search (mobile), Wishlist, Account, Cart */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Mobile Search Icon */}
            <button
              type="button"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="lg:hidden p-2 text-stone-700 hover:text-[#166534] hover:bg-amber-50/60 rounded-full transition-colors cursor-pointer"
              aria-label="Search products"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Button */}
            <Link
              to="/wishlist"
              className="relative p-2 text-stone-700 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-in zoom-in">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Account / Admin Menu Dropdown */}
            <div className="relative">
              {isAuthenticated && user ? (
                <button
                  type="button"
                  onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                  className="flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-full hover:bg-stone-100 text-stone-700 transition-colors cursor-pointer border border-transparent hover:border-stone-200"
                  aria-label="Account options"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#166534] text-white flex items-center justify-center font-bold text-xs uppercase">
                    {user.name ? user.name.charAt(0) : 'U'}
                  </div>
                  <div className="hidden md:flex flex-col text-left text-xs">
                    <span className="font-bold text-stone-800 leading-none truncate max-w-[90px] lowercase">
                      {user.name}
                    </span>
                    <span className="text-[10px] text-stone-500 capitalize">
                      {isAdmin ? 'Administrator' : 'Customer'}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-500 hidden sm:block" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                  className="flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-1.5 rounded-full hover:bg-stone-100 text-stone-700 transition-colors cursor-pointer border border-stone-200 shadow-2xs"
                  aria-label="Sign in"
                >
                  <User className="w-4 h-4 text-[#166534]" />
                  <span className="text-xs font-bold text-stone-800 hidden sm:inline">Sign In</span>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
                </button>
              )}

              {/* Account Dropdown */}
              {accountMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                  onClick={() => setAccountMenuOpen(false)}
                >
                  {isAuthenticated && user ? (
                    <>
                      <div className="px-4 py-2 border-b border-stone-100">
                        <p className="text-xs font-bold text-stone-900 truncate lowercase">{user.name}</p>
                        <p className="text-[11px] text-stone-500 truncate">{user.phone || user.email}</p>
                        <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isAdmin ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                        }`}>
                          {isAdmin ? 'Administrator' : 'Verified Customer'}
                        </span>
                      </div>

                      <div className="py-1">
                        {!isAdmin && (
                          <>
                            <Link
                              to="/account"
                              className="flex items-center gap-2.5 px-4 py-2 text-xs text-stone-700 hover:bg-stone-50 hover:text-[#166534]"
                            >
                              <User className="w-4 h-4 text-stone-400" />
                              <span>My Profile & Orders</span>
                            </Link>
                            <Link
                              to="/orders/ord-1001"
                              className="flex items-center gap-2.5 px-4 py-2 text-xs text-stone-700 hover:bg-stone-50 hover:text-[#166534]"
                            >
                              <ShieldCheck className="w-4 h-4 text-stone-400" />
                              <span>Track Order</span>
                            </Link>
                          </>
                        )}

                        {isAdmin && (
                          <div className="border-b border-stone-100 pb-1 mb-1">
                            <Link
                              to="/admin"
                              className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-[#14532D] hover:bg-emerald-50"
                            >
                              <LayoutDashboard className="w-4 h-4 text-[#166534]" />
                              <span>Admin Dashboard</span>
                            </Link>
                            <Link
                              to="/admin/products"
                              className="flex items-center gap-2.5 px-4 py-2 text-xs text-stone-700 hover:bg-stone-50"
                            >
                              <span>Manage Products</span>
                            </Link>
                            <Link
                              to="/admin/orders"
                              className="flex items-center gap-2.5 px-4 py-2 text-xs text-stone-700 hover:bg-stone-50"
                            >
                              <span>Manage Orders</span>
                            </Link>
                          </div>
                        )}

                        {!isAdmin && (
                          <div className="border-t border-stone-100 pt-1 mt-1 space-y-0.5">
                            <button
                              type="button"
                              onClick={() => {
                                setAccountMenuOpen(false);
                                openAuthModal('admin', () => navigate('/admin'));
                              }}
                              className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 cursor-pointer text-left"
                            >
                              <div className="flex items-center gap-2">
                                <LayoutDashboard className="w-4 h-4 text-[#166534]" />
                                <span>Admin Dashboard</span>
                              </div>
                              <span className="text-[10px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded font-bold">Admin</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setAccountMenuOpen(false);
                                openAuthModal('admin', () => navigate('/admin'));
                              }}
                              className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-50 cursor-pointer text-left"
                            >
                              <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-[#166534]" />
                                <span>Login as Admin</span>
                              </div>
                              <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-bold">Portal</span>
                            </button>
                          </div>
                        )}

                        <div className="pt-1 mt-1 border-t border-stone-100">
                          <button
                            type="button"
                            onClick={() => {
                              setAccountMenuOpen(false);
                              openSignOutModal();
                            }}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 cursor-pointer text-left"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out / Switch Account</span>
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="p-2 space-y-1">
                      <div className="px-3 py-1.5 mb-1 text-[11px] text-stone-500 border-b border-stone-100">
                        Sign in to order & manage cart
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setAccountMenuOpen(false);
                          openAuthModal('customer');
                        }}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-bold text-white bg-[#166534] hover:bg-[#14532D] rounded-xl transition-all cursor-pointer text-left shadow-xs"
                      >
                        <User className="w-4 h-4 text-amber-300" />
                        <span>Customer Sign In</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAccountMenuOpen(false);
                          openAuthModal('admin', () => navigate('/admin'));
                        }}
                        className="w-full flex items-center justify-between px-3.5 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 rounded-xl transition-colors cursor-pointer text-left"
                      >
                        <div className="flex items-center gap-2">
                          <LayoutDashboard className="w-4 h-4 text-[#166534]" />
                          <span>Admin Dashboard</span>
                        </div>
                        <span className="text-[10px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded font-bold">Login</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAccountMenuOpen(false);
                          openAuthModal('admin', () => navigate('/admin'));
                        }}
                        className="w-full flex items-center justify-between px-3.5 py-2 text-xs font-bold text-stone-800 hover:bg-amber-50 rounded-xl transition-colors cursor-pointer text-left"
                      >
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-[#166534]" />
                          <span>Login as Admin</span>
                        </div>
                        <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-bold">Portal</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Cart Button */}
            <button
              type="button"
              onClick={openCartDrawer}
              className="relative flex items-center gap-2 bg-[#166534] hover:bg-[#14532D] text-white px-3 sm:px-4 py-2 rounded-full shadow-xs active:scale-95 transition-all cursor-pointer"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
              <span className="hidden sm:inline font-bold text-xs sm:text-sm">Cart</span>
              <span className="w-5 h-5 bg-amber-400 text-stone-950 font-extrabold text-xs rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Expandable */}
        {mobileSearchOpen && (
          <div className="lg:hidden pb-3 pt-1 px-1">
            <SearchBar onSearchSubmit={() => setMobileSearchOpen(false)} />
          </div>
        )}

        {/* Desktop Primary Category Navigation Bar */}
        <nav className="hidden lg:flex items-center gap-1 border-t border-stone-100 py-1.5 overflow-x-auto scrollbar-none">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const isMillets = item.isHighlight;

            return (
              <Link
                key={item.title}
                to={item.path}
                className={`relative px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isMillets
                    ? 'bg-amber-100/80 text-[#14532D] border border-amber-300 hover:bg-amber-200'
                    : isActive
                    ? 'bg-stone-100 text-[#166534]'
                    : 'text-stone-700 hover:text-[#166534] hover:bg-stone-50'
                }`}
              >
                {isMillets && <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />}
                <span>{item.title}</span>
                {item.badge && (
                  <span
                    className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded uppercase ${
                      isMillets
                        ? 'bg-[#166534] text-white'
                        : item.badge === 'Hot'
                        ? 'bg-rose-500 text-white'
                        : 'bg-stone-200 text-stone-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Mobile Side Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-2xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-[#FFFDF5] shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            {/* Mobile Drawer Header */}
            <div className="p-4 bg-[#14532D] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src="/assets/logo.png"
                  alt="Amuthin Traders Logo"
                  className="w-9 h-9 rounded-lg bg-amber-50 p-0.5 object-cover"
                />
                <div>
                  <h3 className="font-extrabold text-sm tracking-wide">AMUTHIN TRADERS</h3>
                  <p className="text-[11px] text-amber-300">தமிழர் பாரம்பரியம்</p>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg text-white/80 hover:text-white"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Navigation Links */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              <div className="mb-3 px-2 text-[10px] font-extrabold uppercase tracking-widest text-stone-500">
                Categories & Department
              </div>

              {navItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    item.isHighlight
                      ? 'bg-amber-100 text-[#14532D] font-bold border border-amber-300'
                      : 'text-stone-800 hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {item.isHighlight && (
                      <Sparkles className="w-4 h-4 text-amber-600 fill-amber-500" />
                    )}
                    <div>
                      <span>{item.title}</span>
                      {item.tamilSubtitle && (
                        <span className="block text-[11px] text-stone-500 font-normal">
                          {item.tamilSubtitle}
                        </span>
                      )}
                    </div>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.isHighlight
                          ? 'bg-[#166534] text-white'
                          : 'bg-rose-500 text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}

              <div className="pt-4 mt-4 border-t border-stone-200">
                <div className="px-2 text-[10px] font-extrabold uppercase tracking-widest text-stone-500 mb-2">
                  Account & Access
                </div>

                {isAuthenticated && user ? (
                  <div className="space-y-1">
                    <div className="px-3 py-1.5 mb-1 bg-stone-100 rounded-xl">
                      <p className="text-xs font-bold text-stone-900 lowercase">{user.name}</p>
                      <p className="text-[10px] text-stone-500">{user.phone}</p>
                    </div>

                    {!isAdmin ? (
                      <>
                        <Link
                          to="/account"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 rounded-xl"
                        >
                          <User className="w-4 h-4" />
                          <span>My Account & Orders</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            openAuthModal('admin', () => navigate('/admin'));
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-100 rounded-xl cursor-pointer text-left"
                        >
                          <div className="flex items-center gap-2">
                            <LayoutDashboard className="w-4 h-4 text-[#166534]" />
                            <span>Admin Dashboard</span>
                          </div>
                          <span className="text-[10px] bg-stone-200 text-stone-700 px-1.5 py-0.5 rounded font-bold">Admin</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            openAuthModal('admin', () => navigate('/admin'));
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-50 rounded-xl cursor-pointer text-left"
                        >
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-[#166534]" />
                            <span>Login as Admin</span>
                          </div>
                          <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-bold">Portal</span>
                        </button>
                      </>
                    ) : (
                      <Link
                        to="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-[#166534] hover:bg-emerald-50 rounded-xl"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        openSignOutModal();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-xl cursor-pointer text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out / Switch Account</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        openAuthModal('customer');
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#166534] text-white text-xs font-bold shadow-xs cursor-pointer"
                    >
                      <User className="w-4 h-4 text-amber-300" />
                      <span>Customer Sign In</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        openAuthModal('admin', () => navigate('/admin'));
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold border border-stone-200 cursor-pointer"
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#166534]" />
                      <span>Admin Dashboard</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        openAuthModal('admin', () => navigate('/admin'));
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-amber-50 text-amber-950 hover:bg-amber-100 text-xs font-bold border border-amber-200 cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4 text-[#166534]" />
                      <span>Login as Admin</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Drawer Footer */}
            <div className="p-4 bg-stone-100 border-t border-stone-200 text-xs text-stone-600">
              <p className="font-bold text-stone-900 mb-1">Customer Support:</p>
              <p>{initialSiteConfig.phone}</p>
              <p className="text-[11px] text-stone-500 mt-1">{initialSiteConfig.address}</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
