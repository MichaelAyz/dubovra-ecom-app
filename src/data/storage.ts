import { Seller, Product, Order, OrderStatus, OrderTimelineStep } from '../types';
import { SEED_SELLERS } from './seed/sellers';
import { SEED_PRODUCTS } from './seed/products';
import { SEED_ORDERS } from './seed/orders';

const STORAGE_KEYS = {
  SELLERS: 'dubovra_sellers_v1',
  PRODUCTS: 'dubovra_products_v1',
  ORDERS: 'dubovra_orders_v1',
};

// Cross-tab broadcast channel for real-time reactivity
let broadcastChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel('dubovra_marketplace_events');
  }
} catch (e) {
  console.warn('BroadcastChannel unavailable', e);
}

// Internal event bus for same-window instant dispatch
class EventBus extends EventTarget {
  emit(event: string, detail?: any) {
    this.dispatchEvent(new CustomEvent(event, { detail }));
    if (broadcastChannel) {
      broadcastChannel.postMessage({ event, detail });
    }
  }
}

export const marketplaceEvents = new EventBus();

if (broadcastChannel) {
  broadcastChannel.onmessage = (msg) => {
    if (msg.data && msg.data.event) {
      marketplaceEvents.dispatchEvent(new CustomEvent(msg.data.event, { detail: msg.data.detail }));
    }
  };
}

// Storage helpers
function getFromStorage<T>(key: string, defaultData: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultData));
      return defaultData;
    }
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return defaultData;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error saving ${key} to localStorage:`, err);
  }
}

// Storage API
export const Storage = {
  // SELLERS
  getSellers(): Seller[] {
    return getFromStorage<Seller[]>(STORAGE_KEYS.SELLERS, SEED_SELLERS);
  },

  getSellerBySlug(slug: string): Seller | undefined {
    const sellers = this.getSellers();
    return sellers.find(s => s.slug.toLowerCase() === slug.toLowerCase());
  },

  getSellerById(id: string): Seller | undefined {
    const sellers = this.getSellers();
    return sellers.find(s => s.id === id);
  },

  saveSeller(seller: Seller): void {
    const sellers = this.getSellers();
    const index = sellers.findIndex(s => s.id === seller.id);
    if (index >= 0) {
      sellers[index] = seller;
    } else {
      sellers.unshift(seller);
    }
    saveToStorage(STORAGE_KEYS.SELLERS, sellers);
    marketplaceEvents.emit('sellers_updated', seller);
  },

  // PRODUCTS
  getProducts(sellerId?: string): Product[] {
    const products = getFromStorage<Product[]>(STORAGE_KEYS.PRODUCTS, SEED_PRODUCTS);
    if (sellerId) {
      return products.filter(p => p.sellerId === sellerId);
    }
    return products;
  },

  getProductById(id: string): Product | undefined {
    const products = this.getProducts();
    return products.find(p => p.id === id);
  },

  getProductBySlug(slug: string): Product | undefined {
    const products = this.getProducts();
    return products.find(p => p.slug === slug);
  },

  saveProduct(product: Product): void {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index >= 0) {
      products[index] = product;
    } else {
      products.unshift(product);
    }
    saveToStorage(STORAGE_KEYS.PRODUCTS, products);
    marketplaceEvents.emit('products_updated', product);
  },

  deleteProduct(id: string): void {
    const products = this.getProducts();
    const filtered = products.filter(p => p.id !== id);
    saveToStorage(STORAGE_KEYS.PRODUCTS, filtered);
    marketplaceEvents.emit('products_updated', { deletedId: id });
  },

  // ORDERS
  getOrders(sellerId?: string, customerId?: string): Order[] {
    const orders = getFromStorage<Order[]>(STORAGE_KEYS.ORDERS, SEED_ORDERS);
    if (sellerId) {
      return orders.filter(o => o.sellerId === sellerId);
    }
    if (customerId) {
      return orders.filter(o => o.customerId === customerId);
    }
    return orders;
  },

  getOrderById(id: string): Order | undefined {
    const orders = this.getOrders();
    const cleanSearchId = id.replace(/^#/, '').toLowerCase();
    return orders.find(o => o.id.toLowerCase() === cleanSearchId || o.id.toLowerCase() === id.toLowerCase());
  },

  saveOrder(order: Order): void {
    const orders = this.getOrders();
    const index = orders.findIndex(o => o.id === order.id);
    if (index >= 0) {
      orders[index] = order;
    } else {
      orders.unshift(order);
    }
    saveToStorage(STORAGE_KEYS.ORDERS, orders);
    marketplaceEvents.emit('orders_updated', order);
  },

  updateOrderStatus(orderId: string, newStatus: OrderStatus): Order | undefined {
    const orders = this.getOrders();
    const cleanId = orderId.replace(/^#/, '').toLowerCase();
    const index = orders.findIndex(o => o.id.toLowerCase() === cleanId);
    if (index === -1) return undefined;

    const order = { ...orders[index] };
    order.orderStatus = newStatus;

    // Update timeline stages
    const stages: { status: OrderStatus; label: string; desc: string }[] = [
      { status: 'pending', label: 'Order Placed', desc: 'Order placed by customer.' },
      { status: 'payment_confirmed', label: 'Payment Confirmed', desc: 'Escrow payment verified.' },
      { status: 'processing', label: 'Order Processing', desc: `${order.sellerName} is preparing package.` },
      { status: 'ready_for_delivery', label: 'Ready for Dispatch', desc: 'Packaged and awaiting rider pickup.' },
      { status: 'out_for_delivery', label: 'Out for Delivery', desc: 'Courier is in transit to delivery address.' },
      { status: 'delivered', label: 'Delivered', desc: 'Package delivered and confirmed.' },
    ];

    const currentStageIndex = stages.findIndex(s => s.status === newStatus);

    const nowFormatted = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(new Date());

    order.timeline = stages.map((stage, idx) => {
      const isCompleted = currentStageIndex >= 0 && idx <= currentStageIndex;
      const isCurrent = idx === currentStageIndex;
      
      // Preserve existing timestamp if previously completed, or set current time
      const existingStep = order.timeline?.find(t => t.status === stage.status);
      let timestamp = existingStep?.timestamp || null;
      if (isCurrent && !timestamp) {
        timestamp = nowFormatted;
      } else if (isCompleted && !timestamp) {
        timestamp = nowFormatted;
      }

      return {
        status: stage.status,
        label: stage.label,
        description: stage.desc,
        timestamp,
        completed: isCompleted,
        current: isCurrent,
      };
    });

    orders[index] = order;
    saveToStorage(STORAGE_KEYS.ORDERS, orders);
    marketplaceEvents.emit('orders_updated', order);
    marketplaceEvents.emit(`order_${order.id}_updated`, order);
    return order;
  },

  resetDefaults(): void {
    localStorage.removeItem(STORAGE_KEYS.SELLERS);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.setItem(STORAGE_KEYS.SELLERS, JSON.stringify(SEED_SELLERS));
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(SEED_PRODUCTS));
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(SEED_ORDERS));
    marketplaceEvents.emit('reset_defaults');
  },
};
