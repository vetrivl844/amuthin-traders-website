import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Zap } from 'lucide-react';
import { Product } from '../../types';
import { LazyImage } from '../ui/LazyImage';
import { PriceDisplay } from '../ui/PriceDisplay';
import { RatingStars } from '../ui/RatingStars';
import { DiscountBadge } from '../ui/DiscountBadge';
import { WishlistButton } from '../ui/WishlistButton';
import { AddToCartButton } from '../ui/AddToCartButton';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, className = '' }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated, openAuthModal } = useAuth();
  const { showToast } = useToast();
  const isOutOfStock = product.stock <= 0;

  const handleBuyNow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    if (!isAuthenticated) {
      openAuthModal('customer', async () => {
        await addToCart(product, 1);
        showToast(`Added ${product.name} to cart`, 'success');
        navigate('/checkout');
      });
      return;
    }

    await addToCart(product, 1);
    showToast(`Added ${product.name} to cart`, 'success');
    navigate('/checkout');
  };

  const isMillet = product.categoryId === 'millets-traditional';

  return (
    <div
      className={`group relative flex flex-col justify-between bg-white rounded-2xl border border-stone-200/90 hover:border-amber-400/80 shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden ${className}`}
    >
      {/* Top Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-stone-100">
        <Link to={`/products/${product.id}`} className="block w-full h-full">
          <LazyImage
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          <DiscountBadge discount={product.discount} />
          {isMillet && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#166534] text-white shadow-2xs">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>பாரம்பரியம்</span>
            </span>
          )}
          {product.newProduct && !product.discount && (
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-500 text-stone-900 shadow-2xs">
              New
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <div className="absolute top-2.5 right-2.5 z-10">
          <WishlistButton productId={product.id} size="sm" />
        </div>

        {/* Weight Tag */}
        {product.weight && (
          <div className="absolute bottom-2.5 left-2.5 z-10 px-2 py-0.5 rounded-md bg-stone-900/70 backdrop-blur-xs text-white text-[11px] font-medium">
            {product.weight}
          </div>
        )}

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-2xs flex items-center justify-center z-15">
            <span className="px-3 py-1 bg-rose-600 text-white text-xs font-bold rounded-full">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="flex flex-col flex-1 p-4 justify-between gap-3">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-[11px] text-stone-600 mb-1">
            <span className="font-medium tracking-wide uppercase truncate max-w-[65%]">
              {product.brand || 'Amuthin Traders'}
            </span>
            <RatingStars rating={product.rating} reviewCount={product.reviews} size="sm" />
          </div>

          {/* Title */}
          <Link to={`/products/${product.id}`} className="block group-hover:text-[#166534] transition-colors">
            <h3 className="font-bold text-stone-900 text-sm sm:text-base leading-snug line-clamp-1">
              {product.name}
            </h3>
            {product.tamilName && (
              <p className="text-xs text-[#4D7C0F] font-medium mt-0.5 line-clamp-1">
                {product.tamilName}
              </p>
            )}
          </Link>
        </div>

        {/* Price & Action Area */}
        <div className="pt-2 border-t border-stone-100 flex flex-col gap-2.5">
          <div className="flex items-baseline justify-between">
            <PriceDisplay
              salePrice={product.salePrice}
              mrp={product.mrp}
              size="md"
            />
            {product.stock > 0 && product.stock <= 15 && (
              <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.5 rounded">
                Only {product.stock} left!
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <AddToCartButton
              product={product}
              variant="outline"
              className="w-full text-xs py-2 px-2"
              showText={true}
            />
            <button
              type="button"
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className="inline-flex items-center justify-center gap-1 w-full text-xs font-bold py-2 px-2 rounded-xl bg-[#166534] hover:bg-[#14532D] text-white transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Buy Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
