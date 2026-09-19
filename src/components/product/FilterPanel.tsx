import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import { ProductFilters } from '../../services/productService';
import { Category, Brand } from '../../types';

interface FilterPanelProps {
  filters: ProductFilters;
  categories: Category[];
  brands: Brand[];
  onChange: (newFilters: ProductFilters) => void;
  onReset: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  categories,
  brands,
  onChange,
  onReset,
}) => {
  const currentCategory = categories.find((c) => c.id === filters.categoryId);

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-xs flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2 text-stone-900 font-bold text-sm sm:text-base">
          <Filter className="w-4 h-4 text-[#166534]" />
          <span>Filters</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-stone-500 hover:text-rose-600 flex items-center gap-1 font-medium transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Category Filter */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2.5">
          Category
        </h4>
        <div className="flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => onChange({ ...filters, categoryId: undefined, subCategoryId: undefined })}
            className={`text-left text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
              !filters.categoryId
                ? 'bg-[#166534] text-white font-semibold'
                : 'text-stone-700 hover:bg-amber-50'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onChange({ ...filters, categoryId: cat.id, subCategoryId: undefined })}
              className={`text-left text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
                filters.categoryId === cat.id
                  ? 'bg-[#166534] text-white font-semibold'
                  : 'text-stone-700 hover:bg-amber-50'
              }`}
            >
              <span>{cat.name}</span>
              {cat.id === 'millets-traditional' && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-400 text-stone-950 font-bold">
                  Focus
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Subcategory Filter (if category selected) */}
      {currentCategory && currentCategory.subCategories.length > 0 && (
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2.5">
            Subcategory
          </h4>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => onChange({ ...filters, subCategoryId: undefined })}
              className={`text-xs px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                !filters.subCategoryId
                  ? 'bg-amber-100 text-amber-900 font-bold border border-amber-300'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              All
            </button>
            {currentCategory.subCategories.map((sub) => (
              <button
                key={sub}
                type="button"
                onClick={() => onChange({ ...filters, subCategoryId: sub })}
                className={`text-xs px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  filters.subCategoryId === sub
                    ? 'bg-[#166534] text-white font-bold'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2.5">
          Price Range (₹)
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[11px] text-stone-400">Min (₹)</label>
            <input
              type="number"
              min={0}
              placeholder="0"
              value={filters.minPrice || ''}
              onChange={(e) =>
                onChange({ ...filters, minPrice: e.target.value ? Number(e.target.value) : undefined })
              }
              className="w-full text-xs p-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-[#166534] outline-none"
            />
          </div>
          <div>
            <label className="text-[11px] text-stone-400">Max (₹)</label>
            <input
              type="number"
              min={0}
              placeholder="5000"
              value={filters.maxPrice || ''}
              onChange={(e) =>
                onChange({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined })
              }
              className="w-full text-xs p-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-[#166534] outline-none"
            />
          </div>
        </div>
      </div>

      {/* Brand Selection */}
      {brands.length > 0 && (
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2.5">
            Brand
          </h4>
          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
              <input
                type="radio"
                name="brand"
                checked={!filters.brand}
                onChange={() => onChange({ ...filters, brand: undefined })}
                className="text-[#166534] focus:ring-[#166534]"
              />
              <span>All Brands</span>
            </label>
            {brands.map((b) => (
              <label key={b.id} className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                <input
                  type="radio"
                  name="brand"
                  checked={filters.brand === b.name}
                  onChange={() => onChange({ ...filters, brand: b.name })}
                  className="text-[#166534] focus:ring-[#166534]"
                />
                <span>{b.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Rating Filter */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
          Customer Rating
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {[4.5, 4.0, 3.5].map((stars) => (
            <button
              key={stars}
              type="button"
              onClick={() =>
                onChange({
                  ...filters,
                  minRating: filters.minRating === stars ? undefined : stars,
                })
              }
              className={`text-xs px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                filters.minRating === stars
                  ? 'bg-amber-400 border-amber-500 text-stone-950 font-bold'
                  : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-50'
              }`}
            >
              ★ {stars}+
            </button>
          ))}
        </div>
      </div>

      {/* Availability & Offers */}
      <div className="pt-2 border-t border-stone-100 flex flex-col gap-2">
        <label className="flex items-center gap-2 text-xs text-stone-700 font-medium cursor-pointer">
          <input
            type="checkbox"
            checked={Boolean(filters.inStockOnly)}
            onChange={(e) => onChange({ ...filters, inStockOnly: e.target.checked })}
            className="rounded text-[#166534] focus:ring-[#166534] w-3.5 h-3.5"
          />
          <span>In Stock Only</span>
        </label>
        <label className="flex items-center gap-2 text-xs text-stone-700 font-medium cursor-pointer">
          <input
            type="checkbox"
            checked={Boolean(filters.onSaleOnly)}
            onChange={(e) => onChange({ ...filters, onSaleOnly: e.target.checked })}
            className="rounded text-[#166534] focus:ring-[#166534] w-3.5 h-3.5"
          />
          <span>Special Offers Only</span>
        </label>
      </div>
    </div>
  );
};
