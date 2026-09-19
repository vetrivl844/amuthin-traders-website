import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye, Filter } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { orderService } from '../../services/orderService';
import { Order, OrderStatus } from '../../types';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      const updated = await orderService.updateOrderStatus(orderId, newStatus);
      if (updated) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o))
        );
      }
    } catch (err) {
      console.error('Failed to update status', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((o) =>
    statusFilter === 'all' ? true : o.orderStatus === statusFilter
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900">
              Orders Management
            </h1>
            <p className="text-xs text-stone-500">
              Monitor customer order fulfillment, update packing stages and delivery status
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500 font-semibold">Filter:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs px-3 py-2 bg-white border border-stone-300 rounded-xl outline-none"
            >
              <option value="all">All Statuses ({orders.length})</option>
              <option value="Placed">Placed</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
          {loading ? (
            <div className="p-12">
              <LoadingSpinner size="md" message="Loading customer orders..." />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-12 text-center text-xs text-stone-500">
              No orders found matching status &ldquo;{statusFilter}&rdquo;.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-600">
                <thead className="bg-stone-50 text-stone-700 font-bold uppercase tracking-wider text-[10px] border-b border-stone-200">
                  <tr>
                    <th className="p-3">Order ID</th>
                    <th className="p-3">Customer Details</th>
                    <th className="p-3">Items Summary</th>
                    <th className="p-3">Total Amount</th>
                    <th className="p-3">Payment</th>
                    <th className="p-3">Fulfillment Status</th>
                    <th className="p-3 text-right">View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="p-3 font-extrabold text-stone-900">
                        #{o.id}
                        <div className="text-[10px] text-stone-400 font-normal">
                          {new Date(o.createdAt).toLocaleDateString()}
                        </div>
                      </td>

                      <td className="p-3">
                        <div className="font-bold text-stone-900">{o.customer?.name || o.customerName || 'Customer'}</div>
                        <div className="text-[11px] text-stone-500">{o.shippingAddress?.phone || o.customerPhone}</div>
                        <div className="text-[10px] text-stone-400">{o.shippingAddress?.city || 'Tamil Nadu'}</div>
                      </td>

                      <td className="p-3">
                        <div className="text-[11px] font-semibold text-stone-800">
                          {o.items.length} product(s)
                        </div>
                        <div className="text-[10px] text-stone-500 line-clamp-1 max-w-[160px]">
                          {o.items.map((i) => i.productName || i.product?.name).join(', ')}
                        </div>
                      </td>

                      <td className="p-3 font-extrabold text-[#14532D]">
                        ₹{o.totalAmount}
                      </td>

                      <td className="p-3">
                        <span className="font-semibold text-stone-800 block text-[11px]">
                          {o.paymentMethod}
                        </span>
                        <span
                          className={`text-[10px] font-bold ${
                            o.paymentStatus === 'Paid' ? 'text-emerald-700' : 'text-amber-700'
                          }`}
                        >
                          {o.paymentStatus}
                        </span>
                      </td>

                      <td className="p-3">
                        <select
                          value={o.orderStatus}
                          disabled={updatingId === o.id}
                          onChange={(e) =>
                            handleStatusChange(o.id, e.target.value as OrderStatus)
                          }
                          className="text-[11px] font-bold p-1.5 rounded-lg border border-stone-300 bg-stone-50 outline-none cursor-pointer"
                        >
                          <option value="Placed">Placed</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>

                      <td className="p-3 text-right">
                        <Link
                          to={`/orders/${o.id}`}
                          className="p-1.5 inline-block text-stone-500 hover:text-[#166534] hover:bg-emerald-50 rounded-lg transition-colors"
                          title="View order tracking details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};
