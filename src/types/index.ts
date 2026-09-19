export interface Product {
  id: string;
  name: string;
  tamilName?: string;
  categoryId: string;
  subCategoryId?: string;
  brand?: string;
  images: string[];
  description: string;
  weight?: string;
  weightOptions?: string[];
  availableWeights?: string[];
  mrp: number;
  salePrice: number;
  discount: number;
  stock: number;
  sku: string;
  rating: number;
  reviews: number;
  featured: boolean;
  saleProduct: boolean;
  newProduct: boolean;
  tags: string[];
  ingredients?: string;
  nutrition?: Record<string, string>;
  storageInstructions?: string;
  cookingInstructions?: string;
  benefits?: string[];
  recipes?: string[];
}

export interface Category {
  id: string;
  name: string;
  tamilName?: string;
  description: string;
  image: string;
  featured?: boolean;
  isPrimary?: boolean;
  subCategories: string[];
  subcategories?: string[];
  productCount?: number;
}

export interface SubCategory {
  id: string;
  categoryId: string;
  name: string;
}

export interface Brand {
  id: string;
  name: string;
}

export interface Review {
  id: string;
  productId?: string;
  productName?: string;
  userName: string;
  userLocation?: string;
  rating: number;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  discountPercentage: number;
  discountPercent?: number;
  code: string;
  validUntil: string;
  validTill?: string;
  minOrderAmount?: number;
  bannerImage?: string;
  applicableCategories?: string[];
  featuredProductIds?: string[];
  active: boolean;
}

export interface Address {
  id?: string;
  fullName: string;
  phone: string;
  email?: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  isDefault?: boolean;
  type?: 'Home' | 'Work';
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  role?: 'customer' | 'admin';
  addresses: Address[];
  joinedDate?: string;
  createdAt?: string;
  totalOrders?: number;
  totalSpent?: number;
  orderHistory?: string[];
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  weight: string;
  price: number;
  quantity: number;
  total: number;
  product?: Product;
  selectedWeight?: string;
}

export type OrderStatus =
  | 'Pending'
  | 'Placed'
  | 'Confirmed'
  | 'Packed'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export interface OrderTrackingStep {
  status: OrderStatus;
  date: string;
  completed: boolean;
  note?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customer?: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: Address;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  deliveryFee?: number;
  totalAmount: number;
  paymentMethod: 'UPI' | 'Credit Card' | 'Debit Card' | 'Net Banking' | 'Cash on Delivery';
  paymentStatus: 'Paid' | 'Pending';
  orderStatus: OrderStatus;
  createdAt: string;
  trackingSteps: OrderTrackingStep[];
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  image: string;
  badge?: string;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  minOrderAmount: number;
  description: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedWeight: string;
}

export interface NavItem {
  title: string;
  tamilSubtitle?: string;
  path: string;
  badge?: string;
  isHighlight?: boolean;
}

export interface SiteConfig {
  name: string;
  tagline: string;
  tamilTagline: string;
  phone: string;
  email: string;
  address: string;
  whatsapp: string;
  operatingHours: string;
  socials: {
    instagram: string;
    facebook: string;
    youtube: string;
    whatsapp: string;
  };
}

export interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  lowStockCount: number;
  todayRevenue: number;
}
