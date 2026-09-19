import { initialReviews } from '../data/initialData';
import { Review } from '../types';

let reviewsStore: Review[] = [...initialReviews];

export const reviewService = {
  getReviews: async (): Promise<Review[]> => {
    await new Promise((resolve) => setTimeout(resolve, 40));
    return [...reviewsStore];
  },

  getReviewsByProduct: async (productId: string): Promise<Review[]> => {
    await new Promise((resolve) => setTimeout(resolve, 40));
    return reviewsStore.filter((r) => r.productId === productId);
  },

  getReviewsByProductId: async (productId: string): Promise<Review[]> => {
    return reviewService.getReviewsByProduct(productId);
  },

  addReview: async (reviewData: Partial<Review> & { comment: string; rating: number; userName: string }): Promise<Review> => {
    await new Promise((resolve) => setTimeout(resolve, 60));
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      productId: reviewData.productId,
      productName: reviewData.productName,
      userName: reviewData.userName,
      userLocation: reviewData.userLocation,
      rating: reviewData.rating,
      comment: reviewData.comment,
      verifiedPurchase: reviewData.verifiedPurchase ?? true,
      date: dateStr,
    };
    reviewsStore = [newRev, ...reviewsStore];
    return newRev;
  },
};
