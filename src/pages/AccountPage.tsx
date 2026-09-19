import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Package,
  MapPin,
  Clock,
  ShieldCheck,
  Edit2,
  Plus,
  ArrowRight,
  Sparkles,
  LogOut,
  LayoutDashboard,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { customerService } from '../services/customerService';
import { Order, Address } from '../types';
import { Modal } from '../components/ui/Modal';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export const AccountPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isAuthenticated, openAuthModal, openSignOutModal } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  // Address modal state
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [newAddress, setNewAddress] = useState<Address>({
    fullName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    street: '',
    city: 'Dindigul',
    state: 'Tamil Nadu',
    pincode: '624001',
    landmark: '',
  });

  useEffect(() => {
    const loadAccountData = async () => {
      setLoading(true);
      try {
        const [ordList, addrList] = await Promise.all([
          orderService.getOrders(),
          customerService.getAddresses(),
        ]);
        setOrders(ordList);
        setAddresses(addrList);
      } catch (err) {
        console.error('Failed to load account details', err);
      } finally {
        setLoading(false);
      }
    };

    loadAccountData();
  }, []);

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.street || !newAddress.pincode) return;
    const updated = await customerService.addAddress(newAddress);
    setAddresses(updated);
    setAddressModalOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading your Amuthin account profile..." />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-[#166534] flex items-center justify-center">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-stone-900">Please Sign In</h2>
        <p className="text-sm text-stone-600">
          Sign in with your phone number and name to access your profile, addresses, and track previous orders.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => openAuthModal('customer')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#166534] hover:bg-[#14532D] text-white font-bold text-sm cursor-pointer shadow-md transition-all flex items-center justify-center gap-2"
          >
            <User className="w-4 h-4 text-amber-300" />
            <span>Sign In with Phone & Name</span>
          </button>
          <button
            type="button"
            onClick={() => openAuthModal('admin', () => navigate('/admin'))}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold text-sm cursor-pointer border border-amber-200 transition-all flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-[#166534]" />
            <span>Login as Admin</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Account Overview Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#166534] text-white flex items-center justify-center font-extrabold text-2xl shadow-xs uppercase">
            {user.name ? user.name.charAt(0) : 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 lowercase">
                {user.name}
              </h1>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full capitalize ${
                isAdmin ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
              }`}>
                {user.role}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">{user.email || 'No email provided'} • {user.phone}</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {isAdmin ? (
            <Link
              to="/admin"
              className="px-4 py-2.5 rounded-xl bg-[#14532D] hover:bg-[#0f3d21] text-amber-300 text-xs font-bold flex items-center gap-2 transition-colors shadow-2xs"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Admin Dashboard</span>
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => openAuthModal('admin', () => navigate('/admin'))}
              className="px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-[#166534]" />
              <span>Login as Admin</span>
            </button>
          )}

          <button
            type="button"
            onClick={openSignOutModal}
            className="px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out / Switch</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Orders (Left 8 cols) & Saved Addresses (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Order History */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-stone-200">
            <h2 className="text-lg font-extrabold text-stone-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-[#166534]" />
              <span>My Order History ({orders.length})</span>
            </h2>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-stone-200 text-center text-stone-500">
              No orders placed yet.
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-100">
                    <div>
                      <span className="font-extrabold text-stone-900 text-sm sm:text-base">
                        Order #{order.id}
                      </span>
                      <p className="text-xs text-stone-500">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#166534]">
                        {order.orderStatus}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                        {order.paymentMethod} ({order.paymentStatus})
                      </span>
                    </div>
                  </div>

                  {/* Items summary */}
                  <div className="flex items-center gap-3 overflow-x-auto py-1">
                    {order.items.map((i, idx) => {
                      const img = i.productImage || i.product?.images[0];
                      const name = i.productName || i.product?.name;
                      const weight = i.weight || i.selectedWeight || '1 kg';
                      const pId = i.productId || i.product?.id || idx;

                      return (
                        <div
                          key={`${pId}-${weight}-${idx}`}
                          className="flex items-center gap-2 bg-stone-50 p-2 rounded-xl border border-stone-200 shrink-0 text-xs"
                        >
                          {img && (
                            <img
                              src={img}
                              alt=""
                              className="w-8 h-8 rounded-md object-cover"
                            />
                          )}
                          <div>
                            <p className="font-bold text-stone-800 line-clamp-1 max-w-[120px]">
                              {name}
                            </p>
                            <span className="text-stone-500 text-[10px]">
                              {i.quantity}x {weight}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Footer with Total and Track Order button */}
                  <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                    <div className="text-xs text-stone-600">
                      Total: <strong className="text-stone-900 text-sm">₹{order.totalAmount}</strong>
                    </div>

                    <Link
                      to={`/orders/${order.id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#166534] hover:bg-[#14532D] text-white text-xs font-bold transition-all shadow-2xs"
                    >
                      <span>Track Shipment</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Saved Addresses & Customer Perks */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#166534]" />
                <span>Saved Addresses</span>
              </h3>
              <button
                type="button"
                onClick={() => setAddressModalOpen(true)}
                className="text-xs font-bold text-[#166534] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            <div className="space-y-3">
              {addresses.map((addr, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/50 text-xs space-y-1"
                >
                  <p className="font-bold text-stone-900">{addr.fullName}</p>
                  <p className="text-stone-600">{addr.street}</p>
                  <p className="text-stone-600">{addr.city}, {addr.state} - {addr.pincode}</p>
                  <p className="text-stone-500 font-medium">Ph: {addr.phone}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Traditional Health Club Card */}
          <div className="bg-gradient-to-br from-[#166534] to-[#14532D] text-white p-6 rounded-3xl shadow-sm space-y-3">
            <div className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-400 text-stone-950">
              <Sparkles className="w-3 h-3" />
              <span>LOYALTY BENEFITS</span>
            </div>
            <h4 className="font-extrabold text-base">Amuthin Traditional Club</h4>
            <p className="text-xs text-stone-200 leading-relaxed">
              Enjoy priority harvesting slots, direct cold-pressed oil refill discounts, and complimentary millet recipe handbooks.
            </p>
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      <Modal
        isOpen={addressModalOpen}
        onClose={() => setAddressModalOpen(false)}
        title="Add Delivery Address"
      >
        <form onSubmit={handleAddAddress} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">Full Name</label>
            <input
              type="text"
              required
              value={newAddress.fullName}
              onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
              className="w-full text-xs p-2.5 border border-stone-300 rounded-xl outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">Phone Number</label>
            <input
              type="tel"
              required
              value={newAddress.phone}
              onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
              className="w-full text-xs p-2.5 border border-stone-300 rounded-xl outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">Street Address</label>
            <input
              type="text"
              required
              value={newAddress.street}
              onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
              className="w-full text-xs p-2.5 border border-stone-300 rounded-xl outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">City</label>
              <input
                type="text"
                required
                value={newAddress.city}
                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                className="w-full text-xs p-2.5 border border-stone-300 rounded-xl outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">PIN Code</label>
              <input
                type="text"
                required
                value={newAddress.pincode}
                onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                className="w-full text-xs p-2.5 border border-stone-300 rounded-xl outline-none"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-[#166534] hover:bg-[#14532D] text-white text-xs font-bold rounded-xl cursor-pointer"
          >
            Save Address
          </button>
        </form>
      </Modal>
    </div>
  );
};
