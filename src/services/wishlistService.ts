import { initialWishlist } from '../data/initialData';
import { productService } from './productService';
import { Product } from '../types';

const STORAGE_KEY_WISHLIST = 'amuthin_wishlist';

const getStoredWishlist = (): string[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_WISHLIST);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // fallback
  }
  return [...initialWishlist];
};

const saveWishlist = (list: string[]) => {
  try {
    localStorage.setItem(STORAGE_KEY_WISHLIST, JSON.stringify(list));
  } catch {
    // storage not available
  }
};

let wishlistStore: string[] = getStoredWishlist();

export const wishlistService = {
  getWishlistIds: async (): Promise<string[]> => {
    await new Promise((resolve) => setTimeout(resolve, 30));
    return [...wishlistStore];
  },

  getWishlistProducts: async (): Promise<Product[]> => {
    await new Promise((resolve) => setTimeout(resolve, 60));
    const allProducts = await productService.getProducts();
    return allProducts.filter((p) => wishlistStore.includes(p.id));
  },

  isInWishlist: async (productId: string): Promise<boolean> => {
    return wishlistStore.includes(productId);
  },

  addToWishlist: async (productId: string): Promise<string[]> => {
    await new Promise((resolve) => setTimeout(resolve, 30));
    if (!wishlistStore.includes(productId)) {
      wishlistStore.push(productId);
      saveWishlist(wishlistStore);
    }
    return [...wishlistStore];
  },

  removeFromWishlist: async (productId: string): Promise<string[]> => {
    await new Promise((resolve) => setTimeout(resolve, 30));
    wishlistStore = wishlistStore.filter((id) => id !== productId);
    saveWishlist(wishlistStore);
    return [...wishlistStore];
  },

  toggleWishlist: async (productId: string): Promise<{ inWishlist: boolean; ids: string[] }> => {
    await new Promise((resolve) => setTimeout(resolve, 30));
    const exists = wishlistStore.includes(productId);
    if (exists) {
      wishlistStore = wishlistStore.filter((id) => id !== productId);
    } else {
      wishlistStore.push(productId);
    }
    saveWishlist(wishlistStore);
    return { inWishlist: !exists, ids: [...wishlistStore] };
  },

  clearWishlist: async (): Promise<string[]> => {
    wishlistStore = [];
    saveWishlist(wishlistStore);
    return [];
  },
};
