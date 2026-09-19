import React from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';

interface WishlistButtonProps {
  productId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const WishlistButton: React.FC<WishlistButtonProps> = ({
  productId,
  className = '',
  size = 'md',
}) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();
  const inWishlist = isInWishlist(productId);

  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4.5 h-4.5',
    lg: 'w-5.5 h-5.5',
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(productId);
    showToast(inWishlist ? 'Removed from wishlist' : 'Wishlist updated', 'info');
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      className={`rounded-full flex items-center justify-center transition-all shadow-xs cursor-pointer ${
        inWishlist
          ? 'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100'
          : 'bg-white/90 backdrop-blur-xs text-stone-600 border border-stone-200/80 hover:text-rose-600 hover:bg-white'
      } ${sizeClasses[size]} ${className}`}
    >
      <Heart
        className={`${iconSizes[size]} transition-transform active:scale-125 ${
          inWishlist ? 'fill-rose-500 text-rose-500' : ''
        }`}
      />
    </button>
  );
};
