import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import { ProductSortOption } from '../../services/productService';

interface SortDropdownProps {
  value: ProductSortOption;
  onChange: (value: ProductSortOption) => void;
}

export const SortDropdown: React.FC<SortDropdownProps> = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-stone-600 hidden sm:inline-flex items-center gap-1">
        <ArrowUpDown className="w-3.5 h-3.5" />
        Sort:
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as ProductSortOption)}
        className="text-xs sm:text-sm font-medium bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#166534] shadow-2xs cursor-pointer"
      >
        <option value="popular">Most Popular</option>
        <option value="newest">Newest First</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="rating">Highest Customer Rating</option>
        <option value="discount">Biggest Discount (%)</option>
      </select>
    </div>
  );
};
