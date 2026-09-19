import { initialProducts } from '../data/initialData';
import { Product } from '../types';

export interface ProductFilters {
  categoryId?: string;
  subCategoryId?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStockOnly?: boolean;
  onSaleOnly?: boolean;
  tags?: string[];
  searchQuery?: string;
}

export type ProductSortOption =
  | 'popular'
  | 'newest'
  | 'price-asc'
  | 'price-desc'
  | 'rating'
  | 'discount';

// In-memory products store to simulate backend state mutations (persisted in localStorage if available)
const STORAGE_KEY = 'amuthin_products';

const getStoredProducts = (): Product[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fallback to initial
  }
  return [...initialProducts];
};

const saveProducts = (products: Product[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch {
    // storage not available
  }
};

let productsStore: Product[] = getStoredProducts();

export const productService = {
  getProducts: async (
    filters?: ProductFilters,
    sortBy: ProductSortOption = 'popular'
  ): Promise<Product[]> => {
    if (filters) {
      return productService.filterAndSortProducts(filters, sortBy);
    }
    // Simulating async network delay
    await new Promise((resolve) => setTimeout(resolve, 80));
    return [...productsStore];
  },

  getBrands: async (): Promise<{ id: string; name: string }[]> => {
    await new Promise((resolve) => setTimeout(resolve, 40));
    const set = new Set<string>();
    productsStore.forEach((p) => {
      if (p.brand) set.add(p.brand);
    });
    return Array.from(set).map((b) => ({ id: b, name: b }));
  },

  getProductById: async (id: string): Promise<Product | undefined> => {
    await new Promise((resolve) => setTimeout(resolve, 60));
    return productsStore.find((p) => p.id === id);
  },

  getProductsByCategory: async (categoryId: string): Promise<Product[]> => {
    await new Promise((resolve) => setTimeout(resolve, 80));
    if (!categoryId || categoryId === 'all') return [...productsStore];
    return productsStore.filter((p) => p.categoryId === categoryId);
  },

  getFeaturedProducts: async (): Promise<Product[]> => {
    await new Promise((resolve) => setTimeout(resolve, 80));
    return productsStore.filter((p) => p.featured);
  },

  getSaleProducts: async (): Promise<Product[]> => {
    await new Promise((resolve) => setTimeout(resolve, 80));
    return productsStore.filter((p) => p.saleProduct || p.discount > 0);
  },

  getNewArrivals: async (): Promise<Product[]> => {
    await new Promise((resolve) => setTimeout(resolve, 80));
    return productsStore.filter((p) => p.newProduct);
  },

  searchProducts: async (query: string): Promise<Product[]> => {
    await new Promise((resolve) => setTimeout(resolve, 60));
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];
    return productsStore.filter((p) => {
      const matchName = p.name.toLowerCase().includes(trimmed);
      const matchTamil = p.tamilName ? p.tamilName.toLowerCase().includes(trimmed) : false;
      const matchCategory = p.categoryId.toLowerCase().includes(trimmed);
      const matchSubcategory = p.subCategoryId ? p.subCategoryId.toLowerCase().includes(trimmed) : false;
      const matchBrand = p.brand ? p.brand.toLowerCase().includes(trimmed) : false;
      const matchTags = p.tags.some((t) => t.toLowerCase().includes(trimmed));
      const matchDescription = p.description.toLowerCase().includes(trimmed);
      return matchName || matchTamil || matchCategory || matchSubcategory || matchBrand || matchTags || matchDescription;
    });
  },

  getRelatedProducts: async (
    productId: string,
    limitOrCategory: number | string = 4,
    explicitLimit = 4
  ): Promise<Product[]> => {
    await new Promise((resolve) => setTimeout(resolve, 60));
    const limit = typeof limitOrCategory === 'number' ? limitOrCategory : explicitLimit;
    const current = productsStore.find((p) => p.id === productId);
    const categoryId = typeof limitOrCategory === 'string' ? limitOrCategory : current?.categoryId;
    return productsStore
      .filter((p) => p.id !== productId && (!categoryId || p.categoryId === categoryId))
      .slice(0, limit);
  },

  filterAndSortProducts: async (
    filters: ProductFilters,
    sortBy: ProductSortOption = 'popular'
  ): Promise<Product[]> => {
    await new Promise((resolve) => setTimeout(resolve, 90));
    let result = [...productsStore];

    if (filters.categoryId && filters.categoryId !== 'all') {
      result = result.filter((p) => p.categoryId === filters.categoryId);
    }
    if (filters.subCategoryId && filters.subCategoryId !== 'all') {
      result = result.filter((p) => p.subCategoryId === filters.subCategoryId);
    }
    if (filters.brand && filters.brand !== 'all') {
      result = result.filter((p) => p.brand === filters.brand);
    }
    if (typeof filters.minPrice === 'number') {
      result = result.filter((p) => p.salePrice >= filters.minPrice!);
    }
    if (typeof filters.maxPrice === 'number') {
      result = result.filter((p) => p.salePrice <= filters.maxPrice!);
    }
    if (typeof filters.minRating === 'number') {
      result = result.filter((p) => p.rating >= filters.minRating!);
    }
    if (filters.inStockOnly) {
      result = result.filter((p) => p.stock > 0);
    }
    if (filters.onSaleOnly) {
      result = result.filter((p) => p.saleProduct || p.discount > 0);
    }
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.tamilName && p.tamilName.toLowerCase().includes(q)) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => (b.newProduct ? 1 : 0) - (a.newProduct ? 1 : 0));
        break;
      case 'price-asc':
        result.sort((a, b) => a.salePrice - b.salePrice);
        break;
      case 'price-desc':
        result.sort((a, b) => b.salePrice - a.salePrice);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'discount':
        result.sort((a, b) => b.discount - a.discount);
        break;
      case 'popular':
      default:
        result.sort((a, b) => b.reviews - a.reviews);
        break;
    }

    return result;
  },

  // Admin Mutations
  addProduct: async (productData: Partial<Product>): Promise<Product> => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      name: productData.name || 'Untitled Product',
      tamilName: productData.tamilName || '',
      categoryId: productData.categoryId || 'millets-traditional',
      subCategoryId: productData.subCategoryId,
      brand: productData.brand || 'Amuthin Heritage',
      images: productData.images && productData.images.length > 0
        ? productData.images
        : ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=700&auto=format&fit=crop&q=80'],
      description: productData.description || 'Nutrient-rich traditional product.',
      weight: productData.weight || '500g',
      weightOptions: productData.weightOptions || ['500g', '1kg'],
      mrp: Number(productData.mrp) || 199,
      salePrice: Number(productData.salePrice) || 149,
      discount: Number(productData.discount) || Math.round((((Number(productData.mrp) || 199) - (Number(productData.salePrice) || 149)) / (Number(productData.mrp) || 199)) * 100),
      stock: Number(productData.stock) || 50,
      sku: productData.sku || `AT-${Date.now().toString().slice(-5)}`,
      rating: 5.0,
      reviews: 1,
      featured: Boolean(productData.featured),
      saleProduct: Boolean(productData.saleProduct),
      newProduct: true,
      tags: productData.tags || ['traditional', 'healthy'],
      ingredients: productData.ingredients,
      storageInstructions: productData.storageInstructions,
      cookingInstructions: productData.cookingInstructions,
    };
    productsStore = [newProduct, ...productsStore];
    saveProducts(productsStore);
    return newProduct;
  },

  updateProduct: async (id: string, updates: Partial<Product>): Promise<Product> => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const index = productsStore.findIndex((p) => p.id === id);
    if (index === -1) throw new Error(`Product ${id} not found`);
    const updated = { ...productsStore[index], ...updates };
    // Recalculate discount if mrp or salePrice changed
    if (updates.mrp || updates.salePrice) {
      const mrp = updated.mrp;
      const sale = updated.salePrice;
      if (mrp > sale) {
        updated.discount = Math.round(((mrp - sale) / mrp) * 100);
      }
    }
    productsStore[index] = updated;
    saveProducts(productsStore);
    return updated;
  },

  deleteProduct: async (id: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 80));
    productsStore = productsStore.filter((p) => p.id !== id);
    saveProducts(productsStore);
    return true;
  },

  updateStock: async (id: string, newStock: number): Promise<Product> => {
    return productService.updateProduct(id, { stock: newStock });
  },

  updatePrice: async (id: string, mrp: number, salePrice: number): Promise<Product> => {
    return productService.updateProduct(id, { mrp, salePrice });
  },

  resetDefaults: async (): Promise<Product[]> => {
    productsStore = [...initialProducts];
    saveProducts(productsStore);
    return productsStore;
  },
};
