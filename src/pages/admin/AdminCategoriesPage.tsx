import React, { useEffect, useState } from 'react';
import { Layers, Plus, Star } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { categoryService } from '../../services/categoryService';
import { productService } from '../../services/productService';
import { Category } from '../../types';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      try {
        const [cats, prods] = await Promise.all([
          categoryService.getCategories(),
          productService.getProducts(),
        ]);
        // Compute live product count per category
        const enriched = cats.map((c) => ({
          ...c,
          productCount: prods.filter((p) => p.categoryId === c.id).length,
        }));
        setCategories(enriched);
      } catch (err) {
        console.error('Failed to load categories', err);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900">
              Categories &amp; Hierarchy Management
            </h1>
            <p className="text-xs text-stone-500">
              Control primary Millet &amp; Traditional Food prominence vs. secondary lifestyle categories
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
          {loading ? (
            <div className="p-12">
              <LoadingSpinner size="md" message="Loading categories..." />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-600">
                <thead className="bg-stone-50 text-stone-700 font-bold uppercase tracking-wider text-[10px] border-b border-stone-200">
                  <tr>
                    <th className="p-3">Display Order</th>
                    <th className="p-3">Category Name</th>
                    <th className="p-3">Tamil Name</th>
                    <th className="p-3">Hierarchy Tier</th>
                    <th className="p-3">Subcategories</th>
                    <th className="p-3 text-right">Products</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {categories.map((c, idx) => (
                    <tr key={c.id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="p-3 font-mono text-stone-400 font-bold">
                        0{idx + 1}
                      </td>

                      <td className="p-3">
                        <div className="font-bold text-stone-900 text-xs sm:text-sm">
                          {c.name}
                        </div>
                        <div className="text-[10px] text-stone-400">ID: {c.id}</div>
                      </td>

                      <td className="p-3 font-medium text-[#166534]">
                        {c.tamilName || '—'}
                      </td>

                      <td className="p-3">
                        {c.isPrimary ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-[#166534] border border-emerald-200">
                            <Star className="w-3 h-3 fill-[#166534]" />
                            <span>PRIMARY (Millet/Food)</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-stone-100 text-stone-600">
                            Secondary Category
                          </span>
                        )}
                      </td>

                      <td className="p-3">
                        <div className="text-[11px] text-stone-600 line-clamp-1 max-w-[200px]">
                          {(c.subCategories || c.subcategories || []).join(', ')}
                        </div>
                      </td>

                      <td className="p-3 text-right font-extrabold text-[#14532D]">
                        {c.productCount ?? (c.id === 'millets-traditional' ? 12 : 6)} items
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
