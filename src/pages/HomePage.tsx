import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Flame,
  ShieldCheck,
  Award,
  Truck,
  CreditCard,
  Headphones,
  HeartHandshake,
} from 'lucide-react';
import { Product, Category, Review } from '../types';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { reviewService } from '../services/reviewService';
import { HeroSection } from '../components/home/HeroSection';
import { ProductCard } from '../components/product/ProductCard';
import { ReviewCard } from '../components/home/ReviewCard';
import { Newsletter } from '../components/home/Newsletter';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export const HomePage: React.FC = () => {
  const [milletProducts, setMilletProducts] = useState<Product[]>([]);
  const [dealProducts, setDealProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      setLoading(true);
      try {
        const [millets, sales, cats, revs] = await Promise.all([
          productService.getProductsByCategory('millets-traditional'),
          productService.getSaleProducts(),
          categoryService.getCategories(),
          reviewService.getReviews(),
        ]);
        setMilletProducts(millets);
        setDealProducts(sales);
        setCategories(cats);
        setReviews(revs);
      } catch (err) {
        console.error('Failed to load homepage data', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading traditional goodness from Amuthin Traders..." />
      </div>
    );
  }

  // Why shop with us configurable cards (Section 26)
  const whyShopCards = [
    {
      title: 'Traditional Products',
      desc: '100% native Tamil millets and unpolished heritage rice varieties.',
      icon: Award,
    },
    {
      title: 'Quality Assured',
      desc: 'Cleaned, triple-graded, and free from synthetic preservatives.',
      icon: ShieldCheck,
    },
    {
      title: 'Best Prices',
      desc: 'Direct-from-farm collective pricing without middlemen inflation.',
      icon: HeartHandshake,
    },
    {
      title: 'Fast Delivery',
      desc: 'Safe doorstep transit across India, free on orders above ₹499.',
      icon: Truck,
    },
    {
      title: 'Secure Payments',
      desc: 'UPI, Credit/Debit cards, Net Banking & Cash on Delivery supported.',
      icon: CreditCard,
    },
    {
      title: 'Customer Support',
      desc: 'Dedicated phone and WhatsApp assistance for recipes and orders.',
      icon: Headphones,
    },
  ];

  return (
    <div className="space-y-12 sm:space-y-16 pb-12">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Traditional Millet Collection (PRIMARY EMPHASIS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#166534] bg-emerald-100/70 px-3 py-1 rounded-full mb-2">
              <Sparkles className="w-3.5 h-3.5 fill-[#166534]" />
              <span>தமிழர் பாரம்பரியம் • PRIMARY FOCUS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight">
              Our Traditional Millet Collection
            </h2>
            <p className="text-sm sm:text-base text-stone-600 mt-1">
              Naturally nutritious grains for a healthier lifestyle.
            </p>
          </div>

          <Link
            to="/products/millets-traditional"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#166534] hover:text-[#14532D] group"
          >
            <span>View All Millets &amp; Grains</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Millet Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {milletProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 3. Shop By Category (Millet First, Secondary Categories Elegant) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#4D7C0F]">
            Organized Living
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
            Shop By Category
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Millet &amp; traditional healthy foods at the core, complemented by quality essentials.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((cat) => {
            const isMillets = cat.id === 'millets-traditional';

            return (
              <Link
                key={cat.id}
                to={`/products/${cat.id}`}
                className={`group flex flex-col items-center p-4 rounded-2xl border transition-all text-center ${
                  isMillets
                    ? 'bg-amber-50/90 border-amber-300 shadow-xs ring-2 ring-amber-400/40 hover:scale-105'
                    : 'bg-white border-stone-200/90 hover:border-amber-300 hover:shadow-md'
                }`}
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden mb-3 bg-stone-100 shrink-0">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-stone-900 line-clamp-1 group-hover:text-[#166534]">
                  {cat.name}
                </h3>
                {cat.tamilName && (
                  <p className="text-[10px] text-[#4D7C0F] font-medium mt-0.5 line-clamp-1">
                    {cat.tamilName}
                  </p>
                )}
                {isMillets && (
                  <span className="mt-2 text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-[#166534] text-white">
                    Core Heritage
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. Today's Best Deals (Section 24) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 p-6 sm:p-8 rounded-3xl border border-amber-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EA580C] text-white flex items-center justify-center shadow-xs">
                <Flame className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
                  TODAY&apos;S BEST DEALS
                </h2>
                <p className="text-xs sm:text-sm text-stone-600">
                  Special harvest discounts on selected positive millets &amp; traditional items.
                </p>
              </div>
            </div>

            <Link
              to="/offers"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold transition-colors shrink-0"
            >
              <span>View All Offers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {dealProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. About Section (Section 25) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-stone-200/90 p-8 sm:p-12 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#166534]">
              Our Heritage &amp; Promise
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              From Traditional Grains to Modern Homes
            </h2>
            <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
              Amuthin Traders was founded with a single mission: to reintroduce ancient Tamil millet wisdom and unpolished native grains to modern dining tables without compromising quality, authenticity, or taste.
            </p>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              For generations, traditional millets like Foxtail (Thinai), Little Millet (Saamai), Finger Millet (Ragi), and heritage rice like Black Kavuni fueled extraordinary strength and wellness. We source directly from native farming collectives in Tamil Nadu to deliver unpolished goodness to your doorstep.
            </p>

            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#166534] hover:underline"
              >
                <span>Read the complete Amuthin Story</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="rounded-2xl overflow-hidden border-2 border-amber-200 shadow-md">
              <img
                src="https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=800&auto=format&fit=crop&q=80"
                alt="Traditional Tamil grains and farming"
                className="w-full h-72 object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-amber-400 text-stone-950 font-bold px-4 py-2 rounded-xl text-xs shadow-md">
              100% Farm Sourced
            </div>
          </div>
        </div>
      </section>

      {/* 6. Why Shop With Us (Section 26) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#4D7C0F]">
            Trust &amp; Transparency
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
            Why Shop With Us
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Rooted in Tamil farming traditions, engineered for modern customer delight.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {whyShopCards.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-xs hover:border-amber-300 transition-colors flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#166534] flex items-center justify-center shrink-0 border border-amber-200">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-sm sm:text-base">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. Customer Reviews (Section 27) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#4D7C0F]">
              Verified Feedback
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
              What Our Customers Say
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Real reviews from families embracing traditional healthy living.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.slice(0, 3).map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </section>

      {/* 8. Newsletter (Section 28) */}
      <Newsletter />
    </div>
  );
};
