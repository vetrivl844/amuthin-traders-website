import { initialOrders } from '../data/initialData';
import { Order, OrderItem, OrderStatus, OrderTrackingStep, CartItem } from '../types';

const STORAGE_KEY_ORDERS = 'amuthin_orders';

const getStoredOrders = (): Order[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_ORDERS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fallback
  }
  return [...initialOrders];
};

const saveOrders = (orders: Order[]) => {
  try {
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
  } catch {
    // storage not available
  }
};

let ordersStore: Order[] = getStoredOrders();

export interface CreateOrderPayload {
  customer?: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  customerId?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  items: (OrderItem | CartItem)[];
  shippingAddress: any;
  paymentMethod: any;
  subtotal: number;
  deliveryFee?: number;
  shippingFee?: number;
  discount: number;
  totalAmount: number;
}

export const orderService = {
  getOrders: async (): Promise<Order[]> => {
    await new Promise((resolve) => setTimeout(resolve, 60));
    return [...ordersStore];
  },

  getOrderById: async (idOrNumber: string): Promise<Order | undefined> => {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return ordersStore.find(
      (o) => o.id === idOrNumber || o.orderNumber?.toLowerCase() === idOrNumber.toLowerCase()
    );
  },

  getOrdersByCustomer: async (customerId: string): Promise<Order[]> => {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return ordersStore.filter((o) => o.customerId === customerId);
  },

  createOrder: async (orderData: CreateOrderPayload): Promise<Order> => {
    await new Promise((resolve) => setTimeout(resolve, 120));
    const now = new Date();
    const orderNum = `AT-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const formattedDate = `${now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const initialTracking: OrderTrackingStep[] = [
      { status: 'Placed', date: formattedDate, completed: true, note: 'Order placed & payment verified' },
      { status: 'Confirmed', date: 'Processing', completed: false, note: 'Amuthin farm fulfillment verified' },
      { status: 'Packed', date: 'Upcoming', completed: false, note: 'Triple cleaned and eco-sealed' },
      { status: 'Shipped', date: 'Upcoming', completed: false, note: 'Dispatched via express logistics' },
      { status: 'Delivered', date: 'Upcoming', completed: false, note: 'Delivered to door' },
    ];

    // Normalize items if passed from CartItem
    const normalizedItems: OrderItem[] = orderData.items.map((it: any) => {
      if (it.product) {
        return {
          productId: it.product.id,
          productName: it.product.name,
          productImage: it.product.images[0],
          weight: it.selectedWeight || it.product.weight || '1 kg',
          price: it.product.salePrice,
          quantity: it.quantity,
          total: it.product.salePrice * it.quantity,
          product: it.product,
          selectedWeight: it.selectedWeight,
        };
      }
      return it as OrderItem;
    });

    const cId = orderData.customer?.id || orderData.customerId || 'cust-1';
    const cName = orderData.customer?.name || orderData.customerName || 'Karthick Raja';
    const cEmail = orderData.customer?.email || orderData.customerEmail || 'karthickrajasitpl@gmail.com';
    const cPhone = orderData.customer?.phone || orderData.customerPhone || '+91 98421 54321';
    const fee = typeof orderData.deliveryFee === 'number' ? orderData.deliveryFee : (orderData.shippingFee || 0);

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      customerId: cId,
      customerName: cName,
      customerEmail: cEmail,
      customerPhone: cPhone,
      customer: {
        id: cId,
        name: cName,
        email: cEmail,
        phone: cPhone,
      },
      shippingAddress: orderData.shippingAddress,
      items: normalizedItems,
      subtotal: orderData.subtotal,
      discount: orderData.discount,
      shippingFee: fee,
      deliveryFee: fee,
      totalAmount: orderData.totalAmount,
      paymentMethod: orderData.paymentMethod || 'UPI',
      paymentStatus: orderData.paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
      orderStatus: 'Placed',
      createdAt: now.toISOString(),
      trackingSteps: initialTracking,
    };

    ordersStore = [newOrder, ...ordersStore];
    saveOrders(ordersStore);
    return newOrder;
  },

  updateOrderStatus: async (orderId: string, status: OrderStatus, note?: string): Promise<Order> => {
    await new Promise((resolve) => setTimeout(resolve, 80));
    const index = ordersStore.findIndex((o) => o.id === orderId);
    if (index === -1) throw new Error(`Order ${orderId} not found`);

    const order = ordersStore[index];
    order.orderStatus = status;

    const nowFormatted = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });

    const statusLevels: OrderStatus[] = ['Pending', 'Placed', 'Confirmed', 'Packed', 'Processing', 'Shipped', 'Delivered'];
    const currentIdx = statusLevels.indexOf(status);

    order.trackingSteps = order.trackingSteps.map((step) => {
      const stepIdx = statusLevels.indexOf(step.status);
      if (stepIdx <= currentIdx && stepIdx !== -1) {
        return {
          ...step,
          completed: true,
          date: step.completed ? step.date : nowFormatted,
          note: step.status === status && note ? note : step.note,
        };
      }
      return step;
    });

    ordersStore[index] = { ...order };
    saveOrders(ordersStore);
    return order;
  },
};
