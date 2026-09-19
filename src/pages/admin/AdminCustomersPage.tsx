import React, { useEffect, useState } from 'react';
import { Users, ShieldCheck, Mail, Phone } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { adminService } from '../../services/adminService';
import { Customer } from '../../types';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export const AdminCustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCustomers = async () => {
      setLoading(true);
      try {
        const data = await adminService.getCustomers();
        setCustomers(data);
      } catch (err) {
        console.error('Failed to load customers', err);
      } finally {
        setLoading(false);
      }
    };
    loadCustomers();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900">
              Customer Accounts
            </h1>
            <p className="text-xs text-stone-500">
              Manage registered shoppers, profile contacts, order history and access roles
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
          {loading ? (
            <div className="p-12">
              <LoadingSpinner size="md" message="Loading customer accounts..." />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-600">
                <thead className="bg-stone-50 text-stone-700 font-bold uppercase tracking-wider text-[10px] border-b border-stone-200">
                  <tr>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Contact</th>
                    <th className="p-3">Account Role</th>
                    <th className="p-3">Total Orders</th>
                    <th className="p-3">Total Spent</th>
                    <th className="p-3 text-right">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#166534] font-extrabold flex items-center justify-center text-xs">
                            {c.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-stone-900 text-xs sm:text-sm">
                              {c.name}
                            </div>
                            <div className="text-[10px] text-stone-400">ID: {c.id}</div>
                          </div>
                        </div>
                      </td>

                      <td className="p-3">
                        <div className="text-stone-900 font-medium flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-stone-400" />
                          <span>{c.email}</span>
                        </div>
                        <div className="text-[11px] text-stone-500 flex items-center gap-1.5 mt-0.5">
                          <Phone className="w-3 h-3 text-stone-400" />
                          <span>{c.phone}</span>
                        </div>
                      </td>

                      <td className="p-3">
                        <span
                          className={`capitalize px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            c.role === 'admin'
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-emerald-100 text-[#166534]'
                          }`}
                        >
                          {c.role}
                        </span>
                      </td>

                      <td className="p-3 font-semibold text-stone-800">
                        {c.orderHistory?.length || 2} orders
                      </td>

                      <td className="p-3 font-extrabold text-[#14532D]">
                        ₹{c.totalSpent?.toLocaleString() || 1480}
                      </td>

                      <td className="p-3 text-right text-stone-400 text-[11px]">
                        {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'Active'}
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
