import { initialOffers, initialCoupons } from '../data/initialData';
import { Offer, Coupon } from '../types';

let offersStore: Offer[] = [...initialOffers];
let couponsStore: Coupon[] = [...initialCoupons];

export const offerService = {
  getOffers: async (): Promise<Offer[]> => {
    await new Promise((resolve) => setTimeout(resolve, 40));
    return [...offersStore];
  },

  getActiveOffers: async (): Promise<Offer[]> => {
    await new Promise((resolve) => setTimeout(resolve, 40));
    return offersStore.filter((o) => o.active);
  },

  getCoupons: async (): Promise<Coupon[]> => {
    await new Promise((resolve) => setTimeout(resolve, 30));
    return [...couponsStore];
  },

  validateCoupon: async (
    code: string,
    cartAmount: number
  ): Promise<{ valid: boolean; discountPercent: number; message: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 60));
    const trimmed = code.trim().toUpperCase();
    const coupon = couponsStore.find((c) => c.code.toUpperCase() === trimmed);

    if (!coupon) {
      return { valid: false, discountPercent: 0, message: 'Invalid coupon code.' };
    }

    if (cartAmount < coupon.minOrderAmount) {
      return {
        valid: false,
        discountPercent: 0,
        message: `Minimum cart value of ₹${coupon.minOrderAmount} required for coupon ${coupon.code}.`,
      };
    }

    return {
      valid: true,
      discountPercent: coupon.discountPercent,
      message: `Coupon ${coupon.code} applied! (${coupon.discountPercent}% OFF)`,
    };
  },

  createOffer: async (offerData: Partial<Offer>): Promise<Offer> => {
    await new Promise((resolve) => setTimeout(resolve, 60));
    const newOffer: Offer = {
      id: `off-${Date.now()}`,
      title: offerData.title || 'Special Promotion',
      description: offerData.description || '',
      discountPercentage: offerData.discountPercentage || 10,
      code: offerData.code || 'PROMO10',
      validUntil: offerData.validUntil || '2026-12-31',
      bannerImage: offerData.bannerImage || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=1000&auto=format&fit=crop&q=80',
      active: offerData.active !== undefined ? offerData.active : true,
      applicableCategories: offerData.applicableCategories || [],
      featuredProductIds: offerData.featuredProductIds || [],
    };
    offersStore = [newOffer, ...offersStore];
    return newOffer;
  },

  updateOffer: async (id: string, updates: Partial<Offer>): Promise<Offer> => {
    await new Promise((resolve) => setTimeout(resolve, 60));
    const idx = offersStore.findIndex((o) => o.id === id);
    if (idx === -1) throw new Error(`Offer ${id} not found`);
    offersStore[idx] = { ...offersStore[idx], ...updates };
    return offersStore[idx];
  },

  deleteOffer: async (id: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 50));
    offersStore = offersStore.filter((o) => o.id !== id);
    return true;
  },
};
