import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  QrCode,
  Banknote,
  CheckCircle2,
  Lock,
  ArrowRight,
  UserCheck,
  LogIn,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { orderService } from '../services/orderService';
import { customerService } from '../services/customerService';
import { Address } from '../types';

export const CheckoutPage: React.FC = () => {
  const { cart, totals, clearCart } = useCart();
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [submitting, setSubmitting] = useState(false);

  // Address Form State
  const [address, setAddress] = useState<Address>({
    fullName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    street: 'Plot No. 42, Cauvery Nagar, 2nd Cross',
    city: 'Dindigul',
    state: 'Tamil Nadu',
    pincode: '624001',
    landmark: 'Near Uzhavar Santhai',
  });

  // Sync user info when authenticated
  useEffect(() => {
    if (user && user.name) {
      setAddress((prev) => ({
        ...prev,
        fullName: user.name,
        phone: user.phone || prev.phone,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'NetBanking' | 'COD'>('UPI');
  const [upiId, setUpiId] = useState('karthick@okaxis');

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-stone-900">Your cart is empty</h2>
        <p className="text-xs sm:text-sm text-stone-500">
          Please add products to your cart before proceeding to checkout.
        </p>
        <Link
          to="/products/millets-traditional"
          className="inline-block px-6 py-2.5 rounded-full bg-[#166534] text-white text-xs font-bold"
        >
          Shop Millets
        </Link>
      </div>
    );
  }

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.fullName || !address.phone || !address.street || !address.pincode) {
      alert('Please fill in all required shipping address fields');
      return;
    }
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      openAuthModal('customer', () => {
        handlePlaceOrder();
      });
      return;
    }

    setSubmitting(true);
    try {
      const mappedPayment =
        paymentMethod === 'COD'
          ? ('Cash on Delivery' as const)
          : paymentMethod === 'Card'
          ? ('Credit Card' as const)
          : paymentMethod === 'NetBanking'
          ? ('Net Banking' as const)
          : ('UPI' as const);

      const newOrder = await orderService.createOrder({
        customer: {
          id: user?.id || 'cust-1',
          name: address.fullName,
          email: address.email || user?.email || 'care@amuthintraders.com',
          phone: address.phone,
        },
        items: cart,
        shippingAddress: address,
        paymentMethod: mappedPayment,
        subtotal: totals.subtotal,
        deliveryFee: totals.delivery,
        discount: totals.discount,
        totalAmount: totals.total,
      });

      // Save address to customer profile
      await customerService.addAddress(user?.id || 'cust-1', address);

      // Clear cart
      await clearCart();

      // Notify global toast
      showToast('Order successful! Your order has been placed.', 'success');

      // Navigate to order tracking page
      navigate(`/orders/${newOrder.id}`);
    } catch (err) {
      console.error('Order creation failed', err);
      showToast('Could not complete order. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Checkout Stepper Header */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-2xs">
        <div className="flex items-center justify-center max-w-xl mx-auto">
          {/* Step 1 */}
          <div
            className={`flex items-center gap-2 cursor-pointer ${
              currentStep >= 1 ? 'text-[#166534] font-bold' : 'text-stone-400'
            }`}
            onClick={() => setCurrentStep(1)}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold ${
                currentStep >= 1 ? 'bg-[#166534] text-white' : 'bg-stone-200 text-stone-600'
              }`}
            >
              1
            </div>
            <span className="text-xs sm:text-sm">Delivery Address</span>
          </div>

          <div
            className={`w-12 sm:w-20 h-0.5 mx-3 ${
              currentStep === 2 ? 'bg-[#166534]' : 'bg-stone-200'
            }`}
          />

          {/* Step 2 */}
          <div
            className={`flex items-center gap-2 ${
              currentStep === 2 ? 'text-[#166534] font-bold' : 'text-stone-400'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold ${
                currentStep === 2 ? 'bg-[#166534] text-white' : 'bg-stone-200 text-stone-600'
              }`}
            >
              2
            </div>
            <span className="text-xs sm:text-sm">Payment &amp; Review</span>
          </div>
        </div>
      </div>

      {/* Auth Prompt if not logged in */}
      {!isAuthenticated && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-amber-900 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <LogIn className="w-5 h-5 text-amber-700 shrink-0" />
            <p className="text-xs sm:text-sm font-medium">
              Please <strong className="font-bold">log in with your phone &amp; name</strong> to complete order placement and save your delivery details.
            </p>
          </div>
          <button
            type="button"
            onClick={() => openAuthModal('customer')}
            className="px-4 py-2 bg-[#166534] hover:bg-[#14532D] text-white text-xs font-bold rounded-xl whitespace-nowrap cursor-pointer transition-colors shadow-2xs"
          >
            Log In to Continue
          </button>
        </div>
      )}

      {/* Main Form Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Form Steps */}
        <div className="lg:col-span-8 space-y-6">
          {currentStep === 1 ? (
            /* STEP 1: Delivery Address Form */
            <form
              onSubmit={handleAddressSubmit}
              className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 space-y-5 shadow-2xs"
            >
              <div className="flex items-center gap-2.5 pb-4 border-b border-stone-100">
                <Truck className="w-5 h-5 text-[#166534]" />
                <h2 className="text-base sm:text-lg font-extrabold text-stone-900">
                  Shipping &amp; Delivery Address
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    className="w-full text-xs sm:text-sm p-3 border border-stone-300 rounded-xl outline-none focus:ring-1 focus:ring-[#166534]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Phone Number (WhatsApp Delivery Updates) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="w-full text-xs sm:text-sm p-3 border border-stone-300 rounded-xl outline-none focus:ring-1 focus:ring-[#166534]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Email Address (For Invoices &amp; Tracking) *
                </label>
                <input
                  type="email"
                  required
                  value={address.email}
                  onChange={(e) => setAddress({ ...address, email: e.target.value })}
                  className="w-full text-xs sm:text-sm p-3 border border-stone-300 rounded-xl outline-none focus:ring-1 focus:ring-[#166534]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  House / Flat / Door No. &amp; Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  placeholder="e.g. 42 Cauvery Street, 2nd Main Road"
                  className="w-full text-xs sm:text-sm p-3 border border-stone-300 rounded-xl outline-none focus:ring-1 focus:ring-[#166534]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">City / Town *</label>
                  <input
                    type="text"
                    required
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full text-xs sm:text-sm p-3 border border-stone-300 rounded-xl outline-none focus:ring-1 focus:ring-[#166534]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="w-full text-xs sm:text-sm p-3 border border-stone-300 rounded-xl outline-none focus:ring-1 focus:ring-[#166534]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">PIN Code *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={address.pincode}
                    onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                    className="w-full text-xs sm:text-sm p-3 border border-stone-300 rounded-xl outline-none focus:ring-1 focus:ring-[#166534]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Landmark (Optional)
                </label>
                <input
                  type="text"
                  value={address.landmark || ''}
                  onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                  placeholder="Near temple, bus stop or recognizable building"
                  className="w-full text-xs sm:text-sm p-3 border border-stone-300 rounded-xl outline-none"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-xl bg-[#166534] hover:bg-[#14532D] text-white font-extrabold text-sm flex items-center gap-2 shadow-md cursor-pointer transition-all active:scale-95"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          ) : (
            /* STEP 2: Payment Selection */
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 space-y-6 shadow-2xs">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-5 h-5 text-[#166534]" />
                  <h2 className="text-base sm:text-lg font-extrabold text-stone-900">
                    Select Payment Method
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-xs text-[#166534] font-bold hover:underline"
                >
                  Edit Address
                </button>
              </div>

              {/* Delivery Address Summary preview */}
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-700">
                <p className="font-bold text-stone-900">{address.fullName} ({address.phone})</p>
                <p>{address.street}, {address.city}, {address.state} - {address.pincode}</p>
              </div>

              {/* Payment Methods Options */}
              <div className="space-y-3">
                {/* 1. UPI */}
                <label
                  className={`p-4 rounded-xl border-2 flex items-start gap-3.5 cursor-pointer transition-all ${
                    paymentMethod === 'UPI'
                      ? 'border-[#166534] bg-emerald-50/40'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'UPI'}
                    onChange={() => setPaymentMethod('UPI')}
                    className="mt-1 text-[#166534] focus:ring-[#166534]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900 text-sm flex items-center gap-2">
                        <QrCode className="w-4 h-4 text-[#166534]" />
                        UPI Instant (GPay / PhonePe / Paytm / QR)
                      </span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        Fastest
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-1">
                      Pay directly using any verified UPI application on your mobile device.
                    </p>

                    {paymentMethod === 'UPI' && (
                      <div className="mt-3 pt-3 border-t border-emerald-200/60">
                        <label className="text-[11px] font-bold text-stone-700 block mb-1">
                          Your UPI ID / VPA
                        </label>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="e.g. mobile@upi"
                          className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-lg outline-none"
                        />
                      </div>
                    )}
                  </div>
                </label>

                {/* 2. Credit/Debit Card */}
                <label
                  className={`p-4 rounded-xl border-2 flex items-start gap-3.5 cursor-pointer transition-all ${
                    paymentMethod === 'Card'
                      ? 'border-[#166534] bg-emerald-50/40'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'Card'}
                    onChange={() => setPaymentMethod('Card')}
                    className="mt-1 text-[#166534] focus:ring-[#166534]"
                  />
                  <div className="flex-1">
                    <span className="font-bold text-stone-900 text-sm flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#166534]" />
                      Credit / Debit Card (Visa, MasterCard, RuPay)
                    </span>
                    <p className="text-xs text-stone-500 mt-0.5">
                      All Indian &amp; international cards supported via secure 3D-Secure authentication.
                    </p>
                  </div>
                </label>

                {/* 3. Cash on Delivery */}
                <label
                  className={`p-4 rounded-xl border-2 flex items-start gap-3.5 cursor-pointer transition-all ${
                    paymentMethod === 'COD'
                      ? 'border-[#166534] bg-emerald-50/40'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="mt-1 text-[#166534] focus:ring-[#166534]"
                  />
                  <div className="flex-1">
                    <span className="font-bold text-stone-900 text-sm flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-[#166534]" />
                      Cash on Delivery (Pay at Doorstep)
                    </span>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Pay cash or scan courier QR code upon successful delivery of fresh grains.
                    </p>
                  </div>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-xs font-bold text-stone-600 hover:text-stone-900"
                >
                  ← Back to Address
                </button>
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={submitting}
                  className="px-8 py-3.5 rounded-xl bg-[#166534] hover:bg-[#14532D] text-white font-extrabold text-sm flex items-center gap-2 shadow-md cursor-pointer transition-all active:scale-95 disabled:opacity-50"
                >
                  <Lock className="w-4 h-4 text-amber-300" />
                  <span>{submitting ? 'Placing Order...' : `Pay ₹${totals.total} & Place Order`}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Order Items & Pricing Overview */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-extrabold text-stone-900 pb-3 border-b border-stone-100">
              Order Preview ({totals.itemCount} items)
            </h3>

            {/* Compact items list */}
            <div className="max-h-60 overflow-y-auto divide-y divide-stone-100 pr-1">
              {cart.map((i) => (
                <div key={`${i.product.id}-${i.selectedWeight}`} className="py-2.5 flex items-center gap-3">
                  <img
                    src={i.product.images[0]}
                    alt=""
                    className="w-12 h-12 rounded-lg object-cover border border-stone-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-stone-900 truncate">{i.product.name}</p>
                    <p className="text-[11px] text-stone-500">
                      {i.quantity} x ₹{i.product.salePrice} ({i.selectedWeight})
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#14532D]">
                    ₹{i.product.salePrice * i.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2 text-xs text-stone-600 pt-3 border-t border-stone-100">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-bold text-stone-900">₹{totals.subtotal}</span>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Coupon Savings</span>
                  <span>-₹{totals.discount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Doorstep Delivery</span>
                <span>
                  {totals.delivery === 0 ? (
                    <span className="text-emerald-700 font-bold uppercase text-[11px]">FREE</span>
                  ) : (
                    `₹${totals.delivery}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-stone-900 pt-2 border-t border-stone-200">
                <span>Total Amount</span>
                <span className="text-[#14532D] text-lg">₹{totals.total}</span>
              </div>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl text-[11px] text-stone-500 space-y-1.5 border border-stone-200">
              <div className="flex items-center gap-1.5 text-stone-700 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Amuthin Freshness Guarantee</span>
              </div>
              <p>
                Every packet is freshly sealed, pesticide-free, and dispatched directly from Tamil Nadu mills.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
