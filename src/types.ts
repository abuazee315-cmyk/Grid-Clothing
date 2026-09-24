export interface CustomerAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  savedAddress?: CustomerAddress;
  createdAt: string;
}

export interface CustomerAccount extends CustomerUser {
  password: string; // stored for demo persistence
}

export type ProductCategory = 'hoodies' | 'tees' | 'pants' | 'jackets' | 'accessories';

export type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface ProductColor {
  name: string;
  hex: string;
  classBg?: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: ProductCategory;
  price: number;
  costPrice: number;
  stock: number;
  rating: number;
  reviewsCount: number;
  isTrending: boolean;
  isNewArrival: boolean;
  colors: ProductColor[];
  sizes: ProductSize[];
  images: string[];
  description: string;
  fabricDetails: string;
  fitDetails: string;
  careInstructions?: string;
  badge?: string;
}

export interface CartItem {
  id: string; // unique cart entry id
  product: Product;
  selectedColor: string;
  selectedSize: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
  quantity: number;
}

export type OrderStatus = 'Processing' | 'Shipped' | 'On the way' | 'Delivered' | 'Cancelled';

export interface OrderItemSummary {
  productId: string;
  productName: string;
  sku: string;
  price: number;
  costPrice: number;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  items: OrderItemSummary[];
  subtotal: number;
  discount: number;
  shipping: number;
  shippingOption?: string;
  tax: number;
  total: number;
  status: OrderStatus;
  createdAt: string; // Date of Ordered
  dispatchDate?: string; // Date of Dispatch
  paymentMethod: string;
  trackingNumber?: string;
}

export interface MonthlyFinancialRecord {
  month: string;
  revenue: number;
  profit: number;
  costOfGoods: number;
  orders: number;
}

export interface CategoryMetric {
  category: ProductCategory;
  categoryName: string;
  volume: number;
  revenue: number;
  profit: number;
}

export interface StoreKPIs {
  totalSales: number;
  netProfit: number;
  activeOrders: number;
  lowStockCount: number;
  averageOrderValue: number;
  profitMarginPercent: number;
}

export interface DeliverySettings {
  isFreeDelivery: boolean; // When true, all orders receive 100% free delivery
  deliveryFee: number; // Standard delivery fee in INR (e.g. 149, 250)
  enableFreeDeliveryThreshold: boolean; // Whether free delivery applies above threshold
  freeDeliveryThreshold: number; // Order amount in INR to qualify for free delivery
  expressCourierName?: string;
}
