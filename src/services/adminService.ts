import { productService } from './productService';
import { orderService } from './orderService';
import { customerService } from './customerService';
import { DashboardStats } from '../types';

export const adminService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    await new Promise((resolve) => setTimeout(resolve, 70));
    const [products, orders, customers] = await Promise.all([
      productService.getProducts(),
      orderService.getOrders(),
      customerService.getCustomers(),
    ]);

    const totalSales = orders.reduce((sum, o) => (o.paymentStatus === 'Paid' ? sum + o.totalAmount : sum), 0);
    const lowStockCount = products.filter((p) => p.stock <= 25).length;
    const todayRevenue = orders
      .filter((o) => o.createdAt.startsWith(new Date().toISOString().split('T')[0]))
      .reduce((sum, o) => sum + o.totalAmount, 0) || Math.round(totalSales * 0.18);

    return {
      totalSales,
      totalOrders: orders.length,
      totalProducts: products.length,
      totalCustomers: customers.length,
      lowStockCount,
      todayRevenue,
    };
  },

  getCustomers: async () => {
    return customerService.getCustomers();
  },
};
