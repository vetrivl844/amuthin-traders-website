import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight } from 'lucide-react';
import { productService } from '../../services/productService';
import { Product } from '../../types';

interface SearchBarProps {
  onSearchSubmit?: () => void;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearchSubmit, className = '' }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const results = await productService.searchProducts(query);
        setSuggestions(results.slice(0, 5));
        setIsOpen(true);
      } catch {
        setSuggestions([]);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsOpen(false);
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    if (onSearchSubmit) onSearchSubmit();
  };

  const handleSelectProduct = (productId: string) => {
    setIsOpen(false);
    setQuery('');
    navigate(`/products/${productId}`);
    if (onSearchSubmit) onSearchSubmit();
  };

  return (
    <div ref={containerRef} className={`relative w-full max-w-lg ${className}`}>
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setIsOpen(true)}
          placeholder="Search Foxtail Millet, Black Kavuni, Cast Iron..."
          className="w-full pl-10 pr-10 py-2.5 bg-stone-50 hover:bg-white focus:bg-white text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 rounded-full border border-stone-300 focus:border-[#166534] focus:ring-2 focus:ring-emerald-600/20 transition-all outline-none shadow-2xs"
        />
        <Search className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setSuggestions([]);
            }}
            className="absolute right-3 p-0.5 rounded-full text-stone-400 hover:text-stone-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* Live Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="p-2 border-b border-stone-100 flex items-center justify-between text-xs text-stone-500 font-semibold px-3">
            <span>Instant Product Suggestions</span>
            <span className="text-[11px] text-[#166534]">Amuthin Direct</span>
          </div>
          <div className="max-h-72 overflow-y-auto divide-y divide-stone-100">
            {suggestions.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelectProduct(p.id)}
                className="w-full flex items-center gap-3 p-2.5 hover:bg-amber-50/60 transition-colors text-left cursor-pointer"
              >
                <img
                  src={p.images[0]}
                  alt={p.name}
                  className="w-10 h-10 object-cover rounded-lg border border-stone-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs sm:text-sm font-bold text-stone-900 truncate">
                    {p.name}
                  </div>
                  <div className="text-[11px] text-[#4D7C0F] truncate">
                    {p.tamilName || p.brand}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-[#14532D]">
                    ₹{p.salePrice}
                  </span>
                  {p.mrp > p.salePrice && (
                    <div className="text-[10px] text-stone-400 line-through">
                      ₹{p.mrp}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full p-2.5 bg-stone-50 hover:bg-stone-100 text-xs font-bold text-[#166534] flex items-center justify-center gap-1.5 transition-colors border-t border-stone-100 cursor-pointer"
          >
            <span>View all search results for &ldquo;{query}&rdquo;</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
