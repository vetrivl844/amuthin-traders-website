import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { productService, ProductSortOption } from '../services/productService';
import { ProductGrid } from '../components/product/ProductGrid';
import { SortDropdown } from '../components/product/SortDropdown';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<ProductSortOption>('popular');

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const results = await productService.searchProducts(query);
        setProducts(results);
      } catch (err) {
        console.error('Search error', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Search Header */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#166534] flex items-center justify-center">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
              Search Results for &ldquo;{query}&rdquo;
            </h1>
            <p className="text-xs sm:text-sm text-stone-500">
              Found <strong className="text-stone-900">{products.length}</strong> matching products
            </p>
          </div>
        </div>

        {products.length > 0 && <SortDropdown value={sort} onChange={setSort} />}
      </div>

      {/* Suggested Popular Searches if few results */}
      {products.length === 0 && !loading && (
        <div className="p-6 bg-amber-50 rounded-2xl border border-amber-200 text-center space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-[#166534]">
            Popular Traditional Searches
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {['Foxtail Millet', 'Kavuni Rice', 'Finger Millet', 'Cast Iron Pan', 'Cold Pressed Oil'].map((term) => (
              <Link
                key={term}
                to={`/search?q=${encodeURIComponent(term)}`}
                className="px-3 py-1.5 rounded-full bg-white text-stone-800 text-xs font-semibold border border-amber-300 hover:bg-[#166534] hover:text-white transition-colors"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Results Grid */}
      {loading ? (
        <div className="py-16">
          <LoadingSpinner size="lg" message="Searching Amuthin Traders catalog..." />
        </div>
      ) : (
        <ProductGrid
          products={products}
          emptyTitle={`No products found for "${query}"`}
          emptyDescription="Please check the spelling or search for broader traditional food terms like 'Millet', 'Rice', or 'Clay'."
        />
      )}
    </div>
  );
};
