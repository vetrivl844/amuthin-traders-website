import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Check, Truck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { QuantitySelector } from '../ui/QuantitySelector';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    totals,
    isCartDrawerOpen,
    closeCartDrawer,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    couponCode,
    couponMessage,
    removeCoupon,
  } = useCart();
  const { isAuthenticated, openAuthModal } = useAuth();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  const navigate = useNavigate();

  if (!isCartDrawerOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!inputCoupon.trim()) return;
    const res = await applyCoupon(inputCoupon);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setInputCoupon('');
    }
  };

  const freeShippingThreshold = 499;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - totals.subtotal);
  const freeShippingPercent = Math.min(100, Math.round((totals.subtotal / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-2xs transition-opacity animate-in fade-in"
        onClick={closeCartDrawer}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#166534]" />
              <h2 className="text-base font-bold text-stone-900">
                Your Shopping Cart ({totals.itemCount})
              </h2>
            </div>
            <button
              onClick={closeCartDrawer}
              className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-amber-50/80 px-4 py-3 border-b border-amber-200/70 text-xs">
            <div className="flex items-center justify-between font-semibold text-stone-800 mb-1.5">
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#166534]" />
                {amountToFreeShipping > 0 ? (
                  <span>
                    Add <strong className="text-[#166534]">₹{amountToFreeShipping}</strong> more for <strong>FREE Delivery!</strong>
                  </span>
                ) : (
                  <span className="text-[#166534] font-bold">
                    You have unlocked FREE Delivery!
                  </span>
                )}
              </div>
              <span className="text-[11px] text-stone-600">{freeShippingPercent}%</span>
            </div>
            <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[#166534] h-full transition-all duration-300"
                style={{ width: `${freeShippingPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 divide-y divide-stone-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-500">
                <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
                  <ShoppingBag className="w-8 h-8 text-[#166534]" />
                </div>
                <h3 className="font-bold text-stone-800 text-base">Your cart is empty</h3>
                <p className="text-xs text-stone-500 mt-1 mb-6">
                  Add nutritious Tamil millets, heritage grains or kitchen essentials.
                </p>
                <button
                  onClick={() => {
                    closeCartDrawer();
                    navigate('/products/millets-traditional');
                  }}
                  className="px-5 py-2.5 rounded-full bg-[#166534] text-white text-xs font-bold hover:bg-[#14532D] shadow-xs cursor-pointer"
                >
                  Explore Millets
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedWeight}`}
                  className="py-3.5 flex gap-3 items-start"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-cover border border-stone-200 shrink-0 bg-stone-50"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-stone-900 truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-[11px] text-[#4D7C0F] font-medium">
                      Pack: {item.selectedWeight}
                    </p>
                    <div className="flex items-baseline gap-1.5 mt-0.5">
                      <span className="text-xs font-bold text-[#14532D]">
                        ₹{item.product.salePrice}
                      </span>
                      {item.product.mrp > item.product.salePrice && (
                        <span className="text-[10px] text-stone-400 line-through">
                          ₹{item.product.mrp}
                        </span>
                      )}
                    </div>

                    {/* Quantity & Delete Controls */}
                    <div className="flex items-center justify-between mt-2">
                      <QuantitySelector
                        size="sm"
                        quantity={item.quantity}
                        onChange={(q) => updateQuantity(item.product.id, item.selectedWeight, q)}
                      />
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.product.id, item.selectedWeight)}
                        className="p-1 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer Summary & Checkout */}
          {cart.length > 0 && (
            <div className="p-4 border-t border-stone-200 bg-stone-50/80 space-y-3">
              {/* Coupon input */}
              <div>
                {couponCode ? (
                  <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Code: <strong>{couponCode}</strong> applied</span>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-stone-400 hover:text-rose-600 font-bold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Coupon code (e.g. AMUTHIN20)"
                        value={inputCoupon}
                        onChange={(e) => setInputCoupon(e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-white border border-stone-300 rounded-lg outline-none uppercase font-semibold text-stone-800"
                      />
                      <Tag className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-2.5 pointer-events-none" />
                    </div>
                    <button
                      type="submit"
                      className="px-3 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-bold cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponError && <p className="text-[11px] text-rose-600 mt-1">{couponError}</p>}
                {couponMessage && !couponError && (
                  <p className="text-[11px] text-emerald-700 mt-1">{couponMessage}</p>
                )}
              </div>

              {/* Price Calculations */}
              <div className="space-y-1.5 text-xs text-stone-600 pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900">₹{totals.subtotal}</span>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Coupon Discount</span>
                    <span>-₹{totals.discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>
                    {totals.delivery === 0 ? (
                      <span className="text-emerald-700 font-bold uppercase text-[11px]">FREE</span>
                    ) : (
                      `₹${totals.delivery}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-stone-900 pt-2 border-t border-stone-200">
                  <span>Total Amount</span>
                  <span className="text-[#14532D] text-base">₹{totals.total}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/cart"
                  onClick={closeCartDrawer}
                  className="w-full py-2.5 rounded-xl border border-stone-300 text-stone-800 text-center text-xs font-bold hover:bg-stone-100 transition-colors"
                >
                  View Full Cart
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    closeCartDrawer();
                    if (!isAuthenticated) {
                      openAuthModal('customer', () => {
                        navigate('/checkout');
                      });
                    } else {
                      navigate('/checkout');
                    }
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#166534] hover:bg-[#14532D] text-white text-center text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
