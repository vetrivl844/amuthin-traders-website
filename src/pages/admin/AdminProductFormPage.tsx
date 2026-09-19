import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Sparkles, CheckCircle2 } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { Product, Category } from '../../types';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export const AdminProductFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    tamilName: '',
    categoryId: 'millets-traditional',
    subCategoryId: 'Raw Millets',
    mrp: 150,
    salePrice: 120,
    weight: '1 kg',
    stock: 50,
    brand: 'Amuthin Traders',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=700&auto=format&fit=crop&q=80',
    description: '',
    benefits: 'High dietary fiber, Low glycemic index, 100% unpolished native grain',
    recipes: 'Cook with 1:2.5 water ratio for porridge, upma or wholesome idli-dosa batter',
    saleProduct: false,
    featured: false,
    newProduct: true,
  });

  useEffect(() => {
    const initForm = async () => {
      setLoading(true);
      try {
        const cats = await categoryService.getCategories();
        setCategories(cats);

        if (isEditing && id) {
          const existing = await productService.getProductById(id);
          if (existing) {
            setFormData({
              name: existing.name,
              tamilName: existing.tamilName || '',
              categoryId: existing.categoryId,
              subCategoryId: existing.subCategoryId || '',
              mrp: existing.mrp,
              salePrice: existing.salePrice,
              weight: existing.weight || '1 kg',
              stock: existing.stock,
              brand: existing.brand || 'Amuthin Traders',
              imageUrl: existing.images[0] || '',
              description: existing.description,
              benefits: existing.benefits ? existing.benefits.join(', ') : '',
              recipes: existing.recipes ? existing.recipes.join('; ') : '',
              saleProduct: Boolean(existing.saleProduct),
              featured: Boolean(existing.featured),
              newProduct: Boolean(existing.newProduct),
            });
          }
        }
      } catch (err) {
        console.error('Failed to init form', err);
      } finally {
        setLoading(false);
      }
    };
    initForm();
  }, [id, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const discount = Math.max(0, Math.round(((formData.mrp - formData.salePrice) / formData.mrp) * 100));

      const payload: Partial<Product> = {
        name: formData.name.trim(),
        tamilName: formData.tamilName.trim(),
        categoryId: formData.categoryId,
        subCategoryId: formData.subCategoryId,
        mrp: Number(formData.mrp),
        salePrice: Number(formData.salePrice),
        discount,
        weight: formData.weight,
        availableWeights: [formData.weight, '2 kg', '5 kg'],
        stock: Number(formData.stock),
        brand: formData.brand,
        images: [formData.imageUrl],
        description: formData.description,
        benefits: formData.benefits.split(',').map((s) => s.trim()).filter(Boolean),
        recipes: formData.recipes.split(';').map((s) => s.trim()).filter(Boolean),
        saleProduct: formData.saleProduct,
        featured: formData.featured,
        newProduct: formData.newProduct,
      };

      if (isEditing && id) {
        await productService.updateProduct(id, payload);
        setSuccessMsg('Product updated successfully!');
      } else {
        await productService.addProduct(payload as any);
        setSuccessMsg('New product published to store!');
      }

      setTimeout(() => {
        navigate('/admin/products');
      }, 1200);
    } catch (err) {
      console.error('Error saving product', err);
      alert('Could not save product. Please check input values.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="py-20 flex justify-center">
          <LoadingSpinner size="lg" message="Loading form data..." />
        </div>
      </AdminLayout>
    );
  }

  const currentCategory = categories.find((c) => c.id === formData.categoryId);

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/admin/products"
              className="p-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-stone-900"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900">
                {isEditing ? 'Edit Product' : 'Add New Product'}
              </h1>
              <p className="text-xs text-stone-500">
                {isEditing ? `Updating product ID: ${id}` : 'Create a fresh catalog item'}
              </p>
            </div>
          </div>
        </div>

        {/* Product Form Card */}
        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h2 className="text-sm font-extrabold text-stone-900 pb-2 border-b border-stone-100">
              Product Identity &amp; Heritage Info
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Product Name (English) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Foxtail Millet (Thinai)"
                  className="w-full text-xs p-3 border border-stone-300 rounded-xl outline-none focus:ring-1 focus:ring-[#166534]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Tamil Name (தமிழ் பெயர்)
                </label>
                <input
                  type="text"
                  value={formData.tamilName}
                  onChange={(e) => setFormData({ ...formData, tamilName: e.target.value })}
                  placeholder="e.g. தினை அரிசி"
                  className="w-full text-xs p-3 border border-stone-300 rounded-xl outline-none focus:ring-1 focus:ring-[#166534]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Category *
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full text-xs p-3 border border-stone-300 rounded-xl outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Subcategory
                </label>
                <input
                  type="text"
                  value={formData.subCategoryId}
                  onChange={(e) => setFormData({ ...formData, subCategoryId: e.target.value })}
                  placeholder="e.g. Raw Millets"
                  className="w-full text-xs p-3 border border-stone-300 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Brand Name
                </label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full text-xs p-3 border border-stone-300 rounded-xl outline-none"
                />
              </div>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="space-y-4 pt-4 border-t border-stone-100">
            <h2 className="text-sm font-extrabold text-stone-900 pb-2 border-b border-stone-100">
              Pricing, Pack Size &amp; Stock
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  MRP Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={formData.mrp}
                  onChange={(e) => setFormData({ ...formData, mrp: Number(e.target.value) })}
                  className="w-full text-xs p-3 border border-stone-300 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Sale Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={formData.salePrice}
                  onChange={(e) => setFormData({ ...formData, salePrice: Number(e.target.value) })}
                  className="w-full text-xs p-3 border border-stone-300 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Standard Pack *
                </label>
                <input
                  type="text"
                  required
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  placeholder="e.g. 1 kg"
                  className="w-full text-xs p-3 border border-stone-300 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Current Stock *
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                  className="w-full text-xs p-3 border border-stone-300 rounded-xl outline-none"
                />
              </div>
            </div>
          </div>

          {/* Media & Content */}
          <div className="space-y-4 pt-4 border-t border-stone-100">
            <h2 className="text-sm font-extrabold text-stone-900 pb-2 border-b border-stone-100">
              Media &amp; Detailed Content
            </h2>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Image URL (Unsplash or direct asset) *
              </label>
              <input
                type="url"
                required
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full text-xs p-3 border border-stone-300 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Description *
              </label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Nutritional characteristics, farm collective origin..."
                className="w-full text-xs p-3 border border-stone-300 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Health Benefits (Comma-separated)
              </label>
              <input
                type="text"
                value={formData.benefits}
                onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                placeholder="High fiber, Low GI, Calcium-rich..."
                className="w-full text-xs p-3 border border-stone-300 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Traditional Recipes &amp; Usage (Semicolon-separated)
              </label>
              <input
                type="text"
                value={formData.recipes}
                onChange={(e) => setFormData({ ...formData, recipes: e.target.value })}
                placeholder="Cook with 1:2.5 water for upma; prepare breakfast porridge..."
                className="w-full text-xs p-3 border border-stone-300 rounded-xl outline-none"
              />
            </div>
          </div>

          {/* Toggles */}
          <div className="pt-4 border-t border-stone-100 flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-xs font-bold text-stone-800 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.saleProduct}
                onChange={(e) => setFormData({ ...formData, saleProduct: e.target.checked })}
                className="rounded text-[#166534] focus:ring-[#166534] w-4 h-4"
              />
              <span>Feature on &ldquo;Today&apos;s Best Deals&rdquo;</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-bold text-stone-800 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="rounded text-[#166534] focus:ring-[#166534] w-4 h-4"
              />
              <span>Featured Home Carousel</span>
            </label>
          </div>

          {/* Submit */}
          <div className="pt-6 border-t border-stone-100 flex items-center justify-between">
            <Link
              to="/admin/products"
              className="text-xs font-bold text-stone-600 hover:text-stone-900"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 rounded-xl bg-[#166534] hover:bg-[#14532D] text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all active:scale-95 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : isEditing ? 'Update Product' : 'Publish Product'}</span>
            </button>
          </div>

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}
        </form>
      </div>
    </AdminLayout>
  );
};
