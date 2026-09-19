import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Plus,
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { adminService } from '../../services/adminService';
import { orderService } from '../../services/orderService';
import { DashboardStats, Order } from '../../types';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      try {
        const [s, ords] = await Promise.all([
          adminService.getDashboardStats(),
          orderService.getOrders(),
        ]);
        setStats(s);
        setRecentOrders(ords.slice(0, 5));
      } catch (err) {
        console.error('Failed to load admin stats', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  if (loading || !stats) {
    return (
      <AdminLayout>
        <div className="py-20 flex justify-center">
          <LoadingSpinner size="lg" message="Loading store analytics and metrics..." />
        </div>
      </AdminLayout>
    );
  }

  const statCards = [
    {
      title: 'Total Sales Revenue',
      value: `₹${stats.totalSales.toLocaleString()}`,
      change: '+18% this month',
      icon: DollarSign,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders.toString(),
      change: '100% fulfilled',
      icon: ShoppingCart,
      color: 'text-blue-700 bg-blue-50 border-blue-200',
    },
    {
      title: 'Active Catalog Products',
      value: stats.totalProducts.toString(),
      change: '11 categories',
      icon: Package,
      color: 'text-amber-700 bg-amber-50 border-amber-200',
    },
    {
      title: 'Registered Customers',
      value: stats.totalCustomers.toString(),
      change: 'Active shoppers',
      icon: Users,
      color: 'text-purple-700 bg-purple-50 border-purple-200',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900">
              Dashboard Overview
            </h1>
            <p className="text-xs text-stone-500">
              Amuthin Traders • Traditional Millets &amp; Multi-Category Operations
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/admin/products/new"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#166534] hover:bg-[#14532D] text-white text-xs font-bold transition-all shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </Link>
          </div>
        </div>

        {/* Low Stock Warning Alert if any */}
        {stats.lowStockCount > 0 && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2.5 text-amber-900 font-semibold">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <span>
                <strong>{stats.lowStockCount} products</strong> have stock levels below threshold (&lt;25 units).
              </span>
            </div>
            <Link
              to="/admin/products"
              className="text-amber-800 hover:text-amber-950 font-bold underline shrink-0"
            >
              View Inventory
            </Link>
          </div>
        )}

        {/* 4 Metric Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-stone-500">{card.title}</span>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${card.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-stone-900">{card.value}</div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                  <TrendingUp className="w-3 h-3" />
                  <span>{card.change}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Orders Section */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h2 className="text-sm font-extrabold text-stone-900">Recent Customer Orders</h2>
            <Link
              to="/admin/orders"
              className="text-xs font-bold text-[#166534] hover:underline flex items-center gap-1"
            >
              <span>View All Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-600">
              <thead className="bg-stone-50 text-stone-700 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Payment</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="p-3 font-bold text-stone-900">#{order.id}</td>
                    <td className="p-3">
                      <div className="font-semibold text-stone-900">{order.customer?.name || order.customerName || 'Customer'}</div>
                      <div className="text-[10px] text-stone-400">{order.shippingAddress?.city || 'Tamil Nadu'}</div>
                    </td>
                    <td className="p-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="p-3 font-bold text-[#14532D]">₹{order.totalAmount}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-stone-100 font-medium text-[10px]">
                        {order.paymentMethod}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-emerald-100 text-[#166534]">
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <Link
                        to={`/orders/${order.id}`}
                        className="text-xs font-bold text-[#166534] hover:underline"
                      >
                        Inspect
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
