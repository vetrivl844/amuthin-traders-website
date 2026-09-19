import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  Clock,
  Printer,
  ChevronRight,
  Phone,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Order } from '../types';
import { orderService } from '../services/orderService';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { EmptyState } from '../components/ui/EmptyState';

export const OrderTrackingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await orderService.getOrderById(id);
        setOrder(data || null);
      } catch (err) {
        console.error('Failed to load order', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner size="lg" message="Retrieving order details & tracking status..." />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-16 max-w-xl mx-auto px-4">
        <EmptyState
          title="Order Not Found"
          description={`We could not locate order details for reference ID "${id}". Please check your order ID or browse your account history.`}
          actionText="View Account Orders"
          actionLink="/account"
        />
      </div>
    );
  }

  const steps = [
    { title: 'Order Placed', desc: 'Received & logged in system' },
    { title: 'Confirmed', desc: 'Verified with farming stock' },
    { title: 'Packed at Mill', desc: 'Triple cleaned & sealed' },
    { title: 'Shipped / Out for Delivery', desc: 'Dispatched via express courier' },
    { title: 'Delivered', desc: 'Handed over at doorstep' },
  ];

  const statusIndexMap: Record<string, number> = {
    Placed: 0,
    Confirmed: 1,
    Processing: 2,
    Shipped: 3,
    Delivered: 4,
    Cancelled: -1,
  };

  const currentStepIndex = statusIndexMap[order.orderStatus] ?? 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-stone-500">
        <Link to="/" className="hover:text-[#166534]">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/account" className="hover:text-[#166534]">Orders</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-stone-900 font-bold">{order.id}</span>
      </div>

      {/* Confirmation & Order Header Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-[#166534]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900">
                  Order #{order.id}
                </h1>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#166534]">
                  {order.orderStatus}
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })} • Expected Delivery in 24-48 Hours
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-700 hover:bg-stone-50 flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>
          </div>
        </div>

        {/* Visual Timeline Stepper */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-4">
            Live Fulfillment Tracking
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {steps.map((step, idx) => {
              const isCompleted = currentStepIndex >= idx;
              const isCurrent = currentStepIndex === idx;

              return (
                <div
                  key={step.title}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between gap-2 ${
                    isCurrent
                      ? 'bg-emerald-50 border-[#166534] shadow-xs'
                      : isCompleted
                      ? 'bg-stone-50/70 border-stone-200'
                      : 'bg-white border-dashed border-stone-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                        isCompleted
                          ? 'bg-[#166534] text-white'
                          : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {isCompleted ? '✓' : idx + 1}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-200/80 px-2 py-0.2 rounded-full">
                        In Progress
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">{step.title}</h4>
                    <p className="text-[11px] text-stone-500 mt-0.5">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Details Grid: Items + Delivery Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Ordered Items (2 cols) */}
        <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
          <h3 className="text-sm font-extrabold text-stone-900 pb-3 border-b border-stone-100 flex items-center gap-2">
            <Package className="w-4 h-4 text-[#166534]" />
            <span>Items in this Shipment ({order.items.length})</span>
          </h3>

          <div className="divide-y divide-stone-100">
            {order.items.map((item, idx) => {
              const img = item.productImage || item.product?.images[0];
              const name = item.productName || item.product?.name;
              const tamil = item.product?.tamilName;
              const weight = item.weight || item.selectedWeight || '1 kg';
              const pId = item.productId || item.product?.id || idx;
              const lineTotal = item.total || (item.price ? item.price * item.quantity : 0);

              return (
                <div
                  key={`${pId}-${weight}-${idx}`}
                  className="py-3.5 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    {img && (
                      <img
                        src={img}
                        alt={name}
                        className="w-14 h-14 rounded-xl object-cover border border-stone-200 shrink-0"
                      />
                    )}
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-stone-900 line-clamp-1">
                        {name}
                      </h4>
                      {tamil && (
                        <p className="text-xs text-[#166534]">{tamil}</p>
                      )}
                      <span className="text-[11px] text-stone-500">
                        Pack: {weight} • Qty: {item.quantity}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs sm:text-sm font-extrabold text-[#14532D]">
                      ₹{lineTotal}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-stone-100 space-y-2 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-stone-900">₹{order.subtotal}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Discount Applied</span>
                <span>-₹{order.discount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery Charges</span>
              <span>{order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}</span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-stone-900 pt-2 border-t border-stone-200">
              <span>Total Paid</span>
              <span className="text-[#14532D] text-base">₹{order.totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Delivery Address & Help (1 col) */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4 text-xs">
            <h3 className="text-sm font-extrabold text-stone-900 pb-2 border-b border-stone-100 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#166534]" />
              <span>Delivery Address</span>
            </h3>
            <div>
              <p className="font-bold text-stone-900 text-sm">{order.shippingAddress.fullName}</p>
              <p className="text-stone-600 mt-1">{order.shippingAddress.street}</p>
              <p className="text-stone-600">{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
              <p className="text-stone-600 mt-1 font-medium">Contact: {order.shippingAddress.phone}</p>
            </div>

            <div className="pt-3 border-t border-stone-100">
              <h4 className="font-bold text-stone-800 mb-1">Payment Method:</h4>
              <p className="text-stone-600">
                {order.paymentMethod} •{' '}
                <span
                  className={`font-bold ${
                    order.paymentStatus === 'Paid' ? 'text-emerald-700' : 'text-amber-700'
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </p>
            </div>
          </div>

          <div className="bg-amber-50 p-6 rounded-3xl border border-amber-200 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#166534] text-white flex items-center justify-center mx-auto">
              <Phone className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-stone-900 text-xs sm:text-sm">Need Help With Your Order?</h4>
            <p className="text-[11px] text-stone-600">
              Our team in Dindigul is available from 8:00 AM to 9:00 PM to assist you.
            </p>
            <a
              href="tel:+919443218765"
              className="inline-block px-4 py-2 rounded-xl bg-white text-[#166534] border border-amber-300 font-bold text-xs hover:bg-stone-50"
            >
              Call +91 94432 18765
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
