import React, { useEffect, useState } from 'react';
import { Tag, Copy, Check, Sparkles, Flame } from 'lucide-react';
import { Offer, Product } from '../types';
import { offerService } from '../services/offerService';
import { productService } from '../services/productService';
import { ProductCard } from '../components/product/ProductCard';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export const OffersPage: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [saleProducts, setSaleProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    const loadOffersData = async () => {
      setLoading(true);
      try {
        const [offList, prods] = await Promise.all([
          offerService.getOffers(),
          productService.getSaleProducts(),
        ]);
        setOffers(offList);
        setSaleProducts(prods);
      } catch (err) {
        console.error('Failed to load offers', err);
      } finally {
        setLoading(false);
      }
    };
    loadOffersData();
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading active offers and coupons..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#EA580C] via-[#F97316] to-[#EAB308] rounded-3xl p-8 sm:p-12 text-white shadow-md relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-white text-xs font-bold">
            <Flame className="w-4 h-4" />
            <span>HARVEST SEASON SAVINGS</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Special Millet Deals &amp; Coupon Codes
          </h1>
          <p className="text-xs sm:text-base text-white/90 leading-relaxed">
            Apply active promo codes at checkout to enjoy up to 25% extra discount on genuine Tamil traditional foods and heirloom grains.
          </p>
        </div>
      </div>

      {/* Active Coupons Grid */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Tag className="w-5 h-5 text-[#166534]" />
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
            Verified Coupon Codes
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="bg-white p-5 rounded-2xl border-2 border-dashed border-amber-300 hover:border-[#166534] shadow-xs flex flex-col justify-between gap-4 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    {offer.discountPercent}% Instant OFF
                  </span>
                  <span className="text-[10px] text-stone-400">
                    Valid till {offer.validTill}
                  </span>
                </div>
                <h3 className="font-bold text-stone-900 text-base">{offer.title}</h3>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  {offer.description}
                </p>
                <p className="text-[11px] text-stone-400 mt-2">
                  Min order: ₹{offer.minOrderAmount}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="font-mono text-sm font-extrabold tracking-widest text-[#166534] bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                  {offer.code}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(offer.code)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-stone-700 hover:text-[#166534] p-1.5 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  {copiedCode === offer.code ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* On-Sale Products Showcase */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#EA580C]" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
              Products with Extra Discount
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {saleProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
};
