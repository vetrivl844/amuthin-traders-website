import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  ArrowRight,
  ShoppingBag,
  Tag,
  Check,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { QuantitySelector } from '../components/ui/QuantitySelector';
import { PriceDisplay } from '../components/ui/PriceDisplay';
import { EmptyState } from '../components/ui/EmptyState';

export const CartPage: React.FC = () => {
  const {
    cart,
    totals,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    couponCode,
    couponMessage,
    removeCoupon,
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  const { isAuthenticated, openAuthModal } = useAuth();
  const navigate = useNavigate();

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

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <EmptyState
          title="Your Shopping Cart is Empty"
          description="Looks like you haven't added any traditional millet grains, heritage food or kitchen essentials yet."
          actionText="Explore Traditional Millets"
          actionLink="/products/millets-traditional"
        />
      </div>
    );
  }

  const freeDeliveryThreshold = 499;
  const remainingForFree = Math.max(0, freeDeliveryThreshold - totals.subtotal);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title & Item Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-200 pb-4 gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Review your selected items before proceeding to safe checkout
          </p>
        </div>
        <button
          type="button"
          onClick={clearCart}
          className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 cursor-pointer self-start sm:self-auto"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear All Items</span>
        </button>
      </div>

      {/* Cart Layout: Left Products Table + Right Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {/* Free Shipping Alert Banner */}
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs text-stone-800">
              <Truck className="w-5 h-5 text-[#166534] shrink-0" />
              {remainingForFree > 0 ? (
                <span>
                  Add items worth <strong className="text-[#166534]">₹{remainingForFree}</strong> more to qualify for <strong>FREE Doorstep Delivery!</strong>
                </span>
              ) : (
                <span className="text-[#166534] font-bold">
                  Congratulations! You have unlocked FREE Express Delivery on this order.
                </span>
              )}
            </div>
            <Link
              to="/products/millets-traditional"
              className="text-xs font-bold text-[#166534] hover:underline whitespace-nowrap hidden sm:inline"
            >
              Add Millets
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 divide-y divide-stone-100 shadow-2xs overflow-hidden">
            {cart.map((item) => (
              <div
                key={`${item.product.id}-${item.selectedWeight}`}
                className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Product Info */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <Link to={`/products/${item.product.id}`}>
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl object-cover border border-stone-200 shrink-0 bg-stone-50"
                    />
                  </Link>

                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#4D7C0F]">
                      {item.product.brand || 'Amuthin Traders'}
                    </span>
                    <Link
                      to={`/products/${item.product.id}`}
                      className="block text-sm sm:text-base font-bold text-stone-900 hover:text-[#166534] transition-colors truncate"
                    >
                      {item.product.name}
                    </Link>
                    {item.product.tamilName && (
                      <p className="text-xs text-[#166534] font-medium">
                        {item.product.tamilName}
                      </p>
                    )}
                    <span className="inline-block mt-1 text-xs text-stone-500 font-medium">
                      Pack Size: <strong>{item.selectedWeight}</strong>
                    </span>
                  </div>
                </div>

                {/* Quantity & Item Subtotal */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                  <QuantitySelector
                    quantity={item.quantity}
                    onChange={(q) => updateQuantity(item.product.id, item.selectedWeight, q)}
                    size="sm"
                  />

                  <div className="text-right min-w-[5rem]">
                    <div className="text-sm sm:text-base font-extrabold text-[#14532D]">
                      ₹{item.product.salePrice * item.quantity}
                    </div>
                    {item.product.mrp > item.product.salePrice && (
                      <div className="text-[11px] text-stone-400 line-through">
                        ₹{item.product.mrp * item.quantity}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.product.id, item.selectedWeight)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Remove from Cart"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <Link
              to="/products/millets-traditional"
              className="text-xs sm:text-sm font-bold text-[#166534] hover:underline flex items-center gap-1.5"
            >
              <span>← Continue Shopping Millets &amp; Foods</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Order Summary (Section 22) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
            <h2 className="text-base font-extrabold text-stone-900 pb-3 border-b border-stone-100">
              Order Summary
            </h2>

            {/* Coupon Application Box */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1.5">
                Have a Coupon or Gift Code?
              </label>
              {couponCode ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Coupon <strong>{couponCode}</strong> Active!</span>
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
                      placeholder="e.g. AMUTHIN20, MILLET10"
                      value={inputCoupon}
                      onChange={(e) => setInputCoupon(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl outline-none uppercase font-semibold text-stone-800"
                    />
                    <Tag className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-2.5 pointer-events-none" />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
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

            {/* Subtotal Calculations */}
            <div className="space-y-2 text-xs sm:text-sm text-stone-600 pt-2 border-t border-stone-100">
              <div className="flex justify-between">
                <span>Items Total ({totals.itemCount} items)</span>
                <span className="font-semibold text-stone-900">₹{totals.subtotal}</span>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Special Coupon Savings</span>
                  <span>-₹{totals.discount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Doorstep Delivery</span>
                <span>
                  {totals.delivery === 0 ? (
                    <span className="text-emerald-700 font-bold uppercase text-xs">FREE</span>
                  ) : (
                    `₹${totals.delivery}`
                  )}
                </span>
              </div>

              <div className="flex justify-between text-base font-extrabold text-stone-900 pt-3 border-t border-stone-200">
                <span>Total Amount Payable</span>
                <span className="text-[#14532D] text-lg">₹{totals.total}</span>
              </div>
            </div>

            {/* Total Savings Highlight Badge */}
            {totals.savings > 0 && (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-center text-xs font-bold text-emerald-800 flex items-center justify-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>You are saving ₹{totals.savings} on this order!</span>
              </div>
            )}

            {/* Proceed to Checkout CTA */}
            <button
              type="button"
              onClick={() => {
                if (!isAuthenticated) {
                  openAuthModal('customer', () => {
                    navigate('/checkout');
                  });
                } else {
                  navigate('/checkout');
                }
              }}
              className="w-full py-3.5 rounded-xl bg-[#166534] hover:bg-[#14532D] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Trust Assurances */}
            <div className="space-y-2 pt-2 text-[11px] text-stone-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Secure SSL 256-Bit Encrypted Payments</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
                <span>Easy 7-day replacements on damaged packages</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
