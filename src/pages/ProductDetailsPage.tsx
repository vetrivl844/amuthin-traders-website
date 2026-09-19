import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Zap,
  Truck,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  Send,
} from 'lucide-react';
import { Product, Review } from '../types';
import { productService } from '../services/productService';
import { reviewService } from '../services/reviewService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { WishlistButton } from '../components/ui/WishlistButton';
import { PriceDisplay } from '../components/ui/PriceDisplay';
import { RatingStars } from '../components/ui/RatingStars';
import { DiscountBadge } from '../components/ui/DiscountBadge';
import { QuantitySelector } from '../components/ui/QuantitySelector';
import { AddToCartButton } from '../components/ui/AddToCartButton';
import { ProductCard } from '../components/product/ProductCard';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { EmptyState } from '../components/ui/EmptyState';

export const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated, openAuthModal } = useAuth();
  const { showToast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Gallery state
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Selection state
  const [selectedWeight, setSelectedWeight] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  // Pincode delivery checker
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);

  // Tabs: 'description' | 'benefits' | 'recipes' | 'reviews'
  const [activeTab, setActiveTab] = useState<'description' | 'benefits' | 'recipes' | 'reviews'>('description');

  // New review form
  const [reviewerName, setReviewerName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const prod = await productService.getProductById(id);
        if (prod) {
          setProduct(prod);
          setSelectedWeight(prod.weight || '1 kg');
          setActiveImageIndex(0);

          const [related, revs] = await Promise.all([
            productService.getRelatedProducts(prod.id, prod.categoryId),
            reviewService.getReviewsByProductId(prod.id),
          ]);
          setRelatedProducts(related);
          setReviews(revs);
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error('Failed to load product details', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading product details..." />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-16">
        <EmptyState
          title="Product not found"
          description="The product you are looking for might have been moved or is currently unavailable."
          actionText="Browse All Millets"
          actionLink="/products/millets-traditional"
        />
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const isMillet = product.categoryId === 'millets-traditional';

  const handleBuyNow = async () => {
    if (isOutOfStock) return;
    if (!isAuthenticated) {
      openAuthModal('customer', async () => {
        await addToCart(product, quantity, selectedWeight);
        showToast(`Added ${product.name} to cart`, 'success');
        navigate('/checkout');
      });
      return;
    }
    await addToCart(product, quantity, selectedWeight);
    showToast(`Added ${product.name} to cart`, 'success');
    navigate('/checkout');
  };

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode || pincode.length < 6) {
      setPincodeStatus('Please enter a valid 6-digit Indian PIN code');
      return;
    }
    // Realistic Tamil Nadu & India delivery simulation
    if (pincode.startsWith('6')) {
      setPincodeStatus('Fast Delivery to your address in 24-48 Hours! Free delivery applicable.');
    } else {
      setPincodeStatus('Standard Express Delivery available in 3-5 days across India.');
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) return;

    await reviewService.addReview({
      productId: product.id,
      productName: product.name,
      userName: reviewerName.trim(),
      userLocation: 'Tamil Nadu, India',
      rating: reviewRating,
      comment: reviewComment.trim(),
    });

    const updatedRevs = await reviewService.getReviewsByProductId(product.id);
    setReviews(updatedRevs);
    setReviewSubmitted(true);
    setReviewComment('');
    setReviewerName('');
    setTimeout(() => setReviewSubmitted(false), 3500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-stone-600 font-medium">
        <Link to="/" className="hover:text-[#166534]">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        <Link to={`/products/${product.categoryId}`} className="hover:text-[#166534] capitalize">
          {product.categoryId.replace('-', ' ')}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        <span className="text-stone-900 font-semibold truncate max-w-xs">
          {product.name}
        </span>
      </nav>

      {/* Main Product Layout: Gallery (Left) & Buy Box (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-stone-100 border border-stone-200 shadow-xs">
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <DiscountBadge discount={product.discount} size="md" />
              {isMillet && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#166534] text-white text-xs font-bold shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>தமிழர் பாரம்பரியம்</span>
                </span>
              )}
            </div>

            <div className="absolute top-4 right-4">
              <WishlistButton productId={product.id} size="lg" />
            </div>
          </div>

          {/* Thumbnail Strip */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
              {product.images.map((img, idx) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                    activeImageIndex === idx
                      ? 'border-[#166534] ring-2 ring-emerald-600/30'
                      : 'border-stone-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Info & Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#4D7C0F]">
              {product.brand || 'Amuthin Traders'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
              {product.name}
            </h1>
            {product.tamilName && (
              <p className="text-base sm:text-lg font-bold text-[#166534] mt-1">
                {product.tamilName}
              </p>
            )}

            <div className="flex items-center gap-4 mt-3">
              <RatingStars rating={product.rating} reviewCount={product.reviews} size="md" />
              <span className="text-stone-300">|</span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Verified Traditional
              </span>
            </div>
          </div>

          {/* Price Box */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-baseline justify-between flex-wrap gap-2">
            <PriceDisplay
              salePrice={product.salePrice}
              mrp={product.mrp}
              size="xl"
            />
            {product.discount > 0 && (
              <span className="text-xs font-bold text-[#EA580C]">
                Save ₹{product.mrp - product.salePrice} ({product.discount}% OFF)
              </span>
            )}
          </div>

          {/* Weight / Pack Options */}
          {product.availableWeights && product.availableWeights.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-2 uppercase tracking-wider">
                Select Pack Size:
              </label>
              <div className="flex flex-wrap gap-2">
                {product.availableWeights.map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setSelectedWeight(w)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                      selectedWeight === w
                        ? 'bg-[#166534] text-white border-[#166534] shadow-xs'
                        : 'bg-white text-stone-700 border-stone-300 hover:border-stone-400'
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock Status Indicator */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-stone-700">Availability:</span>
            {product.stock > 10 ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                In Stock Ready to Ship
              </span>
            ) : product.stock > 0 ? (
              <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded">
                Only {product.stock} units remaining!
              </span>
            ) : (
              <span className="text-rose-600 font-bold">Currently Out of Stock</span>
            )}
          </div>

          {/* Quantity & Actions */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-stone-700">Quantity:</span>
              <QuantitySelector
                quantity={quantity}
                onChange={setQuantity}
                min={1}
                max={product.stock > 0 ? Math.min(10, product.stock) : 1}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <AddToCartButton
                product={product}
                quantity={quantity}
                selectedWeight={selectedWeight}
                variant="primary"
                className="w-full py-3.5 text-sm"
              />
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="w-full py-3.5 rounded-xl bg-[#EAB308] hover:bg-[#CA8A04] text-stone-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                <span>Buy Now</span>
              </button>
            </div>
          </div>

          {/* Pincode Delivery Estimate (Section 19) */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
              <Truck className="w-4 h-4 text-[#166534]" />
              <span>Check Doorstep Delivery &amp; Cash On Delivery</span>
            </div>
            <form onSubmit={handleCheckPincode} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter 6-digit PIN code (e.g. 624001)"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                maxLength={6}
                className="flex-1 px-3 py-2 text-xs bg-white border border-stone-300 rounded-xl outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#166534] hover:bg-[#14532D] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Check
              </button>
            </form>
            {pincodeStatus && (
              <p className="text-[11px] font-semibold text-[#14532D]">{pincodeStatus}</p>
            )}
          </div>

          {/* Highlights Checklist */}
          <div className="grid grid-cols-2 gap-2 text-xs text-stone-700 pt-2 border-t border-stone-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100% Traditional</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Naturally Unpolished</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Direct Farm Sourced</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Zero Preservatives</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section: Description, Health Benefits, Recipes, Reviews (Section 20) */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs">
        {/* Tab Headers */}
        <div className="flex gap-2 border-b border-stone-200 overflow-x-auto scrollbar-none pb-2">
          {[
            { id: 'description', label: 'Description' },
            { id: 'benefits', label: 'Health Benefits & Nutrition' },
            { id: 'recipes', label: 'Traditional Recipes & Usage' },
            { id: 'reviews', label: `Customer Reviews (${reviews.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#166534] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="pt-6">
          {activeTab === 'description' && (
            <div className="space-y-4 max-w-3xl text-sm sm:text-base text-stone-700 leading-relaxed">
              <p>{product.description}</p>
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2 text-xs sm:text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-stone-500">Brand:</span>
                  <span className="font-bold text-stone-900">{product.brand || 'Amuthin Traders'}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-stone-500">Category:</span>
                  <span className="font-bold text-stone-900 capitalize">{product.categoryId.replace('-', ' ')}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-stone-500">Origin:</span>
                  <span className="font-bold text-stone-900">Tamil Nadu, India</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-stone-500">Storage:</span>
                  <span className="font-bold text-stone-900">Store in an airtight container in a cool, dry place.</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'benefits' && (
            <div className="space-y-4 max-w-3xl">
              <h3 className="font-bold text-stone-900 text-base">
                Nutritional &amp; Ayurvedic Advantages
              </h3>
              {product.benefits && product.benefits.length > 0 ? (
                <ul className="space-y-2.5">
                  {product.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700">
                      <CheckCircle2 className="w-4 h-4 text-[#166534] shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs sm:text-sm text-stone-600">
                  Rich in natural dietary fibers, micro-minerals, and slow-burning complex carbohydrates ideal for sustained all-day energy.
                </p>
              )}
            </div>
          )}

          {activeTab === 'recipes' && (
            <div className="space-y-4 max-w-3xl">
              <h3 className="font-bold text-stone-900 text-base">
                Traditional Preparation Guide (பாரம்பரிய செய்முறை)
              </h3>
              {product.recipes && product.recipes.length > 0 ? (
                <div className="space-y-3">
                  {product.recipes.map((r, i) => (
                    <div key={i} className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs sm:text-sm text-stone-800">
                      <span className="font-bold text-[#166534] block mb-1">Serving Method {i + 1}:</span>
                      {r}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs sm:text-sm text-stone-800">
                  Wash and soak grains for 2-3 hours before cooking. Prepare delicious Upma, Pongal, Idli-Dosa batter, or wholesome millet rice porridge with 1:2.5 water ratio.
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-8 max-w-3xl">
              {/* Existing Reviews List */}
              <div className="space-y-4">
                <h3 className="font-bold text-stone-900 text-base">Customer Feedback</h3>
                {reviews.length === 0 ? (
                  <p className="text-xs sm:text-sm text-stone-500">
                    No reviews yet. Be the first to share your experience with this traditional harvest!
                  </p>
                ) : (
                  reviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs sm:text-sm text-stone-900">{rev.userName}</span>
                        <span className="text-[11px] text-stone-500">{rev.date}</span>
                      </div>
                      <RatingStars rating={rev.rating} size="sm" showCount={false} />
                      <p className="text-xs sm:text-sm text-stone-700 italic">&ldquo;{rev.comment}&rdquo;</p>
                    </div>
                  ))
                )}
              </div>

              {/* Write a Review Form */}
              <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-4">
                <h4 className="font-bold text-sm text-stone-900">Write a Review for {product.name}</h4>
                <form onSubmit={handleSubmitReview} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-stone-600 block mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        value={reviewerName}
                        onChange={(e) => setReviewerName(e.target.value)}
                        placeholder="e.g. Meenakshi Sundaram"
                        className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-stone-600 block mb-1">Rating</label>
                      <select
                        value={reviewRating}
                        onChange={(e) => setReviewRating(Number(e.target.value))}
                        className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl outline-none"
                      >
                        <option value={5}>★★★★★ (5 Stars - Excellent)</option>
                        <option value={4}>★★★★☆ (4 Stars - Very Good)</option>
                        <option value={3}>★★★☆☆ (3 Stars - Good)</option>
                        <option value={2}>★★☆☆☆ (2 Stars - Fair)</option>
                        <option value={1}>★☆☆☆☆ (1 Star - Poor)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-600 block mb-1">Your Review &amp; Experience</label>
                    <textarea
                      required
                      rows={3}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Describe the grain aroma, cooking quality, or traditional taste..."
                      className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#166534] hover:bg-[#14532D] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <span>Submit Review</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>

                  {reviewSubmitted && (
                    <p className="text-xs font-bold text-emerald-700">
                      Nandri! Your review has been added.
                    </p>
                  )}
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Carousel/Grid (Section 21) */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
              Related Traditional Products
            </h2>
            <Link
              to={`/products/${product.categoryId}`}
              className="text-xs font-bold text-[#166534] hover:underline"
            >
              See More
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
