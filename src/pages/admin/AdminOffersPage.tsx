import React, { useEffect, useState } from 'react';
import { Tag, Plus, CheckCircle2 } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { offerService } from '../../services/offerService';
import { Offer } from '../../types';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export const AdminOffersPage: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOffers = async () => {
      setLoading(true);
      try {
        const data = await offerService.getOffers();
        setOffers(data);
      } catch (err) {
        console.error('Failed to load offers', err);
      } finally {
        setLoading(false);
      }
    };
    loadOffers();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900">
              Promotional Offers &amp; Coupon Codes
            </h1>
            <p className="text-xs text-stone-500">
              Manage discount percentages, minimum order requirements, and coupon validity
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
          {loading ? (
            <div className="p-12">
              <LoadingSpinner size="md" message="Loading coupons..." />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-600">
                <thead className="bg-stone-50 text-stone-700 font-bold uppercase tracking-wider text-[10px] border-b border-stone-200">
                  <tr>
                    <th className="p-3">Coupon Code</th>
                    <th className="p-3">Offer Title</th>
                    <th className="p-3">Discount %</th>
                    <th className="p-3">Min Order</th>
                    <th className="p-3">Valid Till</th>
                    <th className="p-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {offers.map((offer) => (
                    <tr key={offer.id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="p-3">
                        <span className="font-mono text-xs font-extrabold text-[#166534] bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                          {offer.code}
                        </span>
                      </td>

                      <td className="p-3">
                        <div className="font-bold text-stone-900">{offer.title}</div>
                        <div className="text-[11px] text-stone-500">{offer.description}</div>
                      </td>

                      <td className="p-3 font-extrabold text-amber-700">
                        {offer.discountPercent}% OFF
                      </td>

                      <td className="p-3 text-stone-800">
                        ₹{offer.minOrderAmount}
                      </td>

                      <td className="p-3 text-stone-500">
                        {offer.validTill}
                      </td>

                      <td className="p-3 text-right">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-[#166534]">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Active</span>
                        </span>
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
