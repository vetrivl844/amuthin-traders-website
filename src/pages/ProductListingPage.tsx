import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Filter, Sparkles } from 'lucide-react';
import { Product, Category, Brand } from '../types';
import { productService, ProductFilters, ProductSortOption } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { ProductGrid } from '../components/product/ProductGrid';
import { FilterPanel } from '../components/product/FilterPanel';
import { SortDropdown } from '../components/product/SortDropdown';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export const ProductListingPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId?: string }>();
  const [searchParams] = useSearchParams();
  const subCategoryParam = searchParams.get('subcategory');

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter & Sort state
  const [filters, setFilters] = useState<ProductFilters>({
    categoryId: categoryId || undefined,
    subCategoryId: subCategoryParam || undefined,
  });
  const [sort, setSort] = useState<ProductSortOption>('popular');

  // Sync categoryId param with filters
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      categoryId: categoryId || undefined,
      subCategoryId: subCategoryParam || undefined,
    }));
  }, [categoryId, subCategoryParam]);

  // Load categories & brands once
  useEffect(() => {
    const loadMeta = async () => {
      try {
        const [cats, brs] = await Promise.all([
          categoryService.getCategories(),
          productService.getBrands(),
        ]);
        setCategories(cats);
        setBrands(brs);
      } catch (err) {
        console.error('Failed to load categories/brands', err);
      }
    };
    loadMeta();
  }, []);

  // Fetch products whenever filters or sort change
  const fetchFilteredProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await productService.getProducts(filters, sort);
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products', err);
    } finally {
      setLoading(false);
    }
  }, [filters, sort]);

  useEffect(() => {
    fetchFilteredProducts();
  }, [fetchFilteredProducts]);

  const activeCategory = useMemo(() => {
    return categories.find((c) => c.id === filters.categoryId);
  }, [categories, filters.categoryId]);

  const isMilletCategory = filters.categoryId === 'millets-traditional';

  const handleResetFilters = () => {
    setFilters({
      categoryId: categoryId || undefined,
      subCategoryId: undefined,
      brand: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      minRating: undefined,
      inStockOnly: undefined,
      onSaleOnly: undefined,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Category Banner / Header */}
      <div className="mb-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-900 to-[#14532D] text-white relative overflow-hidden shadow-xs">
        <div className="relative z-10 max-w-2xl">
          {isMilletCategory && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-stone-950 text-xs font-extrabold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>தமிழர் பாரம்பரியம் • PRIMARY FOCUS</span>
            </div>
          )}
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {activeCategory ? activeCategory.name : 'All Amuthin Products'}
          </h1>
          {activeCategory?.tamilName && (
            <p className="text-sm sm:text-base text-amber-300 font-semibold mt-1">
              {activeCategory.tamilName}
            </p>
          )}
          <p className="text-xs sm:text-sm text-stone-200 mt-2 leading-relaxed">
            {activeCategory
              ? activeCategory.description
              : 'Explore our complete selection of authentic Tamil millets, wholesome heritage foods, and quality home essentials.'}
          </p>
        </div>
      </div>

      {/* Main Content Layout: Filters Sidebar + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Filter Panel */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-24">
          <FilterPanel
            filters={filters}
            categories={categories}
            brands={brands}
            onChange={setFilters}
            onReset={handleResetFilters}
          />
        </aside>

        {/* Product Listing Area */}
        <div className="lg:col-span-9 space-y-6">
          {/* Top Bar: Results Count, Mobile Filter Button, Sort Dropdown */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Mobile Filter Toggle */}
              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors cursor-pointer"
              >
                <Filter className="w-4 h-4 text-[#166534]" />
                <span>Filters</span>
              </button>

              <span className="text-xs sm:text-sm font-semibold text-stone-700">
                Showing <strong className="text-stone-950">{products.length}</strong> products
              </span>
            </div>

            <SortDropdown value={sort} onChange={setSort} />
          </div>

          {/* Products Grid or Loading State */}
          {loading ? (
            <div className="py-16">
              <LoadingSpinner size="lg" message="Filtering products..." />
            </div>
          ) : (
            <ProductGrid
              products={products}
              emptyTitle="No products match your filters"
              emptyDescription="Try clearing some filter options or search terms to see more products."
              columns={3}
            />
          )}
        </div>
      </div>

      {/* Mobile Filters Slide-over / Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-2xs"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-2xl p-5 overflow-y-auto z-10 animate-in slide-in-from-right duration-200">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-stone-200">
              <h3 className="font-bold text-base text-stone-900">Filter Products</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="text-stone-500 font-bold text-sm px-2 py-1 bg-stone-100 rounded-lg"
              >
                Done
              </button>
            </div>
            <FilterPanel
              filters={filters}
              categories={categories}
              brands={brands}
              onChange={setFilters}
              onReset={handleResetFilters}
            />
          </div>
        </div>
      )}
    </div>
  );
};
