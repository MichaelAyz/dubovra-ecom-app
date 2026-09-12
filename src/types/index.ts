export type UserRole = 'customer' | 'seller' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  sellerId?: string;
  createdAt: string;
}

export interface DeliveryOption {
  id: string;
  zone: string;
  name: string;
  fee: number;
  duration: string;
}

export interface Seller {
  id: string;
  ownerId: string;
  businessName: string;
  slug: string;
  tagline: string;
  description: string;
  logo: string;
  coverImage: string;
  location: string;
  rating: number;
  reviewCount: number;
  categories: string[];
  deliveryOptions: DeliveryOption[];
  policies: {
    returns: string;
    dispatch: string;
  };
  totalSalesCount: number;
  totalRevenue: number;
  createdAt: string;
}

export interface Product {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerSlug: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: string;
  stock: number;
  variants: {
    sizes?: string[];
    colors?: string[];
  };
  sku: string;
  rating: number;
  reviewCount: number;
  isFeatured?: boolean;
  badge?: string;
  colorDots?: string[]; // hex codes for swatches as seen in reference design
  features?: string[];
  createdAt: string;
}

export interface CartItem {
  productId: string;
  sellerId: string;
  sellerName: string;
  sellerSlug: string;
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  price: number;
}

export interface Cart {
  sellerId: string | null;
  sellerName: string | null;
  items: CartItem[];
}

export type OrderStatus =
  | 'pending'
  | 'payment_confirmed'
  | 'processing'
  | 'ready_for_delivery'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface OrderTimelineStep {
  status: OrderStatus;
  label: string;
  description: string;
  timestamp: string | null;
  completed: boolean;
  current: boolean;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  instructions?: string;
}

export interface Order {
  id: string; // e.g. "MS-1042"
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
  total: number;
  shippingAddress: ShippingAddress;
  deliveryMethod: DeliveryOption;
  paymentMethod: 'card' | 'bank_transfer' | 'wallet';
  paymentStatus: 'paid' | 'pending' | 'failed';
  orderStatus: OrderStatus;
  timeline: OrderTimelineStep[];
  createdAt: string;
}
