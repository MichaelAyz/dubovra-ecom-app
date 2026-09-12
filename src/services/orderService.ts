import { Order, OrderStatus, CartItem, ShippingAddress, DeliveryOption, OrderTimelineStep } from '../types';
import { Storage, marketplaceEvents } from '../data/storage';

function generateOrderId(sellerName: string): string {
  const words = sellerName.trim().split(/\s+/);
  let prefix = 'ORD';
  if (words.length >= 2) {
    prefix = (words[0][0] + words[1][0]).toUpperCase();
  } else if (words.length === 1 && words[0].length >= 2) {
    prefix = words[0].slice(0, 2).toUpperCase();
  }
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${randomNum}`;
}

export const orderService = {
  async getOrders(sellerId?: string, customerId?: string): Promise<Order[]> {
    return Storage.getOrders(sellerId, customerId);
  },

  async getOrderById(id: string): Promise<Order | null> {
    return Storage.getOrderById(id) || null;
  },

  async createOrder(params: {
    customerId: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    sellerId: string;
    sellerName: string;
    sellerSlug: string;
    items: CartItem[];
    subtotal: number;
    deliveryFee: number;
    shippingAddress: ShippingAddress;
    deliveryMethod: DeliveryOption;
    paymentMethod: 'card' | 'bank_transfer' | 'wallet';
  }): Promise<Order> {
    const orderId = generateOrderId(params.sellerName);
    const nowFormatted = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(new Date());

    const timeline: OrderTimelineStep[] = [
      {
        status: 'pending',
        label: 'Order Placed',
        description: 'Order received and verified.',
        timestamp: nowFormatted,
        completed: true,
        current: false,
      },
      {
        status: 'payment_confirmed',
        label: 'Payment Confirmed',
        description: `Simulated payment of ₦${(params.subtotal + params.deliveryFee).toLocaleString()} verified.`,
        timestamp: nowFormatted,
        completed: true,
        current: false,
      },
      {
        status: 'processing',
        label: 'Order Processing',
        description: `${params.sellerName} is preparing footwear and packing box.`,
        timestamp: nowFormatted,
        completed: true,
        current: true,
      },
      {
        status: 'ready_for_delivery',
        label: 'Ready for Dispatch',
        description: 'Packed and waiting for rider pickup.',
        timestamp: null,
        completed: false,
        current: false,
      },
      {
        status: 'out_for_delivery',
        label: 'Out for Delivery',
        description: 'Rider is en route to destination address.',
        timestamp: null,
        completed: false,
        current: false,
      },
      {
        status: 'delivered',
        label: 'Delivered',
        description: 'Package delivered to recipient.',
        timestamp: null,
        completed: false,
        current: false,
      },
    ];

    const newOrder: Order = {
      id: orderId,
      customerId: params.customerId,
      customerName: params.customerName,
      customerPhone: params.customerPhone,
      customerEmail: params.customerEmail,
      sellerId: params.sellerId,
      sellerName: params.sellerName,
      sellerSlug: params.sellerSlug,
      items: params.items,
      subtotal: params.subtotal,
      deliveryFee: params.deliveryFee,
      total: params.subtotal + params.deliveryFee,
      shippingAddress: params.shippingAddress,
      deliveryMethod: params.deliveryMethod,
      paymentMethod: params.paymentMethod,
      paymentStatus: 'paid',
      orderStatus: 'processing',
      timeline,
      createdAt: new Date().toISOString(),
    };

    Storage.saveOrder(newOrder);
    return newOrder;
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order | null> {
    const updated = Storage.updateOrderStatus(orderId, status);
    return updated || null;
  },

  subscribeToOrderUpdates(orderId: string, callback: (order: Order) => void): () => void {
    const handler = (e: any) => {
      const cleanTarget = orderId.replace(/^#/, '').toLowerCase();
      const updatedOrder = e.detail as Order;
      if (updatedOrder && updatedOrder.id.toLowerCase() === cleanTarget) {
        callback(updatedOrder);
      }
    };

    marketplaceEvents.addEventListener('orders_updated', handler);
    marketplaceEvents.addEventListener(`order_${orderId}_updated`, handler);

    return () => {
      marketplaceEvents.removeEventListener('orders_updated', handler);
      marketplaceEvents.removeEventListener(`order_${orderId}_updated`, handler);
    };
  },
};
