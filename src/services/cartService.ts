import { initialCart } from '../data/initialData';
import { CartItem, Product } from '../types';

const STORAGE_KEY_CART = 'amuthin_cart';

const getStoredCart = (): CartItem[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_CART);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // fallback
  }
  return [...initialCart];
};

const saveCart = (cart: CartItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cart));
  } catch {
    // storage not available
  }
};

let cartStore: CartItem[] = getStoredCart();

export interface CartTotals {
  itemCount: number;
  subtotal: number;
  discount: number;
  delivery: number;
  total: number;
  savings: number;
}

export const cartService = {
  getCart: async (): Promise<CartItem[]> => {
    await new Promise((resolve) => setTimeout(resolve, 30));
    return [...cartStore];
  },

  addToCart: async (product: Product, quantity = 1, selectedWeight?: string): Promise<CartItem[]> => {
    await new Promise((resolve) => setTimeout(resolve, 40));
    const weight = selectedWeight || product.weight || '500g';
    const existingIndex = cartStore.findIndex(
      (item) => item.product.id === product.id && item.selectedWeight === weight
    );

    if (existingIndex > -1) {
      cartStore[existingIndex].quantity += quantity;
    } else {
      cartStore.push({
        product,
        quantity,
        selectedWeight: weight,
      });
    }

    saveCart(cartStore);
    return [...cartStore];
  },

  updateQuantity: async (productId: string, selectedWeight: string, quantity: number): Promise<CartItem[]> => {
    await new Promise((resolve) => setTimeout(resolve, 30));
    if (quantity <= 0) {
      cartStore = cartStore.filter(
        (item) => !(item.product.id === productId && item.selectedWeight === selectedWeight)
      );
    } else {
      const item = cartStore.find(
        (i) => i.product.id === productId && i.selectedWeight === selectedWeight
      );
      if (item) {
        item.quantity = quantity;
      }
    }
    saveCart(cartStore);
    return [...cartStore];
  },

  removeFromCart: async (productId: string, selectedWeight: string): Promise<CartItem[]> => {
    await new Promise((resolve) => setTimeout(resolve, 30));
    cartStore = cartStore.filter(
      (item) => !(item.product.id === productId && item.selectedWeight === selectedWeight)
    );
    saveCart(cartStore);
    return [...cartStore];
  },

  clearCart: async (): Promise<CartItem[]> => {
    await new Promise((resolve) => setTimeout(resolve, 30));
    cartStore = [];
    saveCart(cartStore);
    return [];
  },

  calculateTotals: (cartItems: CartItem[], couponDiscountPercent = 0): CartTotals => {
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cartItems.reduce((sum, item) => sum + item.product.salePrice * item.quantity, 0);
    const mrpTotal = cartItems.reduce((sum, item) => sum + item.product.mrp * item.quantity, 0);
    
    // Additional coupon discount
    const discount = couponDiscountPercent > 0 ? Math.round((subtotal * couponDiscountPercent) / 100) : 0;
    
    // Free delivery on orders > ₹499, otherwise ₹49
    const delivery = subtotal > 499 || subtotal === 0 ? 0 : 49;
    const total = Math.max(0, subtotal - discount + delivery);
    const savings = (mrpTotal - subtotal) + discount;

    return {
      itemCount,
      subtotal,
      discount,
      delivery,
      total,
      savings,
    };
  },
};
