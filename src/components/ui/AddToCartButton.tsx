import React, { useState } from 'react';
import { ShoppingBag, Check } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
  selectedWeight?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'compact';
  className?: string;
  showText?: boolean;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  quantity = 1,
  selectedWeight,
  variant = 'primary',
  className = '',
  showText = true,
}) => {
  const { addToCart } = useCart();
  const { isAuthenticated, openAuthModal } = useAuth();
  const { showToast } = useToast();
  const [added, setAdded] = useState(false);
  const isOutOfStock = product.stock <= 0;

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    if (!isAuthenticated) {
      openAuthModal('customer', async () => {
        await addToCart(product, quantity, selectedWeight);
        setAdded(true);
        showToast(`Added ${product.name} to cart`, 'success');
        setTimeout(() => setAdded(false), 1400);
      });
      return;
    }

    await addToCart(product, quantity, selectedWeight);
    setAdded(true);
    showToast(`Added ${product.name} to cart`, 'success');
    setTimeout(() => setAdded(false), 1400);
  };

  const baseStyles =
    'relative inline-flex items-center justify-center font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-[#166534] hover:bg-[#14532D] text-white shadow-xs rounded-xl active:scale-95 px-4 py-2.5 text-sm gap-2',
    secondary:
      'bg-[#EAB308] hover:bg-[#CA8A04] text-stone-900 shadow-xs rounded-xl active:scale-95 px-4 py-2.5 text-sm gap-2',
    outline:
      'border-2 border-[#166534] text-[#166534] hover:bg-emerald-50 rounded-xl px-4 py-2 text-sm gap-2',
    compact:
      'w-9 h-9 rounded-full bg-[#166534] hover:bg-[#14532D] text-white shadow-xs active:scale-90 p-0',
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isOutOfStock}
      aria-label={added ? 'Added to cart' : `Add ${product.name} to cart`}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {added ? (
        <>
          <Check className="w-4 h-4 text-emerald-300 animate-in zoom-in-50" />
          {showText && variant !== 'compact' && <span>Added!</span>}
        </>
      ) : isOutOfStock ? (
        <span>Out of Stock</span>
      ) : (
        <>
          <ShoppingBag className="w-4 h-4" />
          {showText && variant !== 'compact' && <span>Add to Cart</span>}
        </>
      )}
    </button>
  );
};
