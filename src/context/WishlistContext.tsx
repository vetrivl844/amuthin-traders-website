import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { wishlistService } from '../services/wishlistService';
import { productService } from '../services/productService';
import { Product } from '../types';
import { useCart } from './CartContext';

interface WishlistContextType {
  wishlistIds: string[];
  wishlistCount: number;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: string) => Promise<void>;
  moveToCart: (productId: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const { addToCart } = useCart();

  const loadWishlist = useCallback(async () => {
    try {
      const ids = await wishlistService.getWishlistIds();
      setWishlistIds(ids);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  const isInWishlist = (productId: string) => {
    return wishlistIds.includes(productId);
  };

  const toggleWishlist = async (productId: string) => {
    const result = await wishlistService.toggleWishlist(productId);
    setWishlistIds(result.ids);
  };

  const moveToCart = async (productId: string) => {
    const product = await productService.getProductById(productId);
    if (product) {
      await addToCart(product, 1);
      await wishlistService.removeFromWishlist(productId);
      setWishlistIds((prev) => prev.filter((id) => id !== productId));
    }
  };

  const clearWishlist = async () => {
    await wishlistService.clearWishlist();
    setWishlistIds([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistCount: wishlistIds.length,
        isInWishlist,
        toggleWishlist,
        moveToCart,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
