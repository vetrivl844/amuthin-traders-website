import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CartItem, Product } from '../types';
import { cartService, CartTotals } from '../services/cartService';
import { offerService } from '../services/offerService';

interface CartContextType {
  cart: CartItem[];
  totals: CartTotals;
  itemCount: number;
  couponCode: string;
  couponMessage: string;
  isCartDrawerOpen: boolean;
  isLoading: boolean;
  addToCart: (product: Product, quantity?: number, selectedWeight?: string) => Promise<void>;
  updateQuantity: (productId: string, selectedWeight: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string, selectedWeight: string) => Promise<void>;
  clearCart: () => Promise<void>;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState<string>('');
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [couponMessage, setCouponMessage] = useState<string>('');
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadCart = useCallback(async () => {
    setIsLoading(true);
    try {
      const items = await cartService.getCart();
      setCart(items);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const totals = cartService.calculateTotals(cart, couponDiscount);
  const itemCount = totals.itemCount;

  const addToCart = async (product: Product, quantity = 1, selectedWeight?: string) => {
    const updated = await cartService.addToCart(product, quantity, selectedWeight);
    setCart([...updated]);
    setIsCartDrawerOpen(true);
  };

  const updateQuantity = async (productId: string, selectedWeight: string, quantity: number) => {
    const updated = await cartService.updateQuantity(productId, selectedWeight, quantity);
    setCart([...updated]);
  };

  const removeFromCart = async (productId: string, selectedWeight: string) => {
    const updated = await cartService.removeFromCart(productId, selectedWeight);
    setCart([...updated]);
  };

  const clearCart = async () => {
    const updated = await cartService.clearCart();
    setCart([...updated]);
    setCouponCode('');
    setCouponDiscount(0);
    setCouponMessage('');
  };

  const applyCoupon = async (code: string) => {
    const currentSubtotal = cart.reduce((sum, i) => sum + i.product.salePrice * i.quantity, 0);
    const result = await offerService.validateCoupon(code, currentSubtotal);
    if (result.valid) {
      setCouponCode(code.toUpperCase());
      setCouponDiscount(result.discountPercent);
      setCouponMessage(result.message);
      return { success: true, message: result.message };
    } else {
      setCouponMessage(result.message);
      return { success: false, message: result.message };
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setCouponDiscount(0);
    setCouponMessage('');
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        totals,
        itemCount,
        couponCode,
        couponMessage,
        isCartDrawerOpen,
        isLoading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        openCartDrawer: () => setIsCartDrawerOpen(true),
        closeCartDrawer: () => setIsCartDrawerOpen(false),
        refreshCart: loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
