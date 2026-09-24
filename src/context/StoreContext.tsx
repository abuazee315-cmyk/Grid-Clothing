import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../firebase';
import {
  Product,
  CartItem,
  Order,
  OrderStatus,
  ProductCategory,
  MonthlyFinancialRecord,
  CategoryMetric,
  StoreKPIs,
  CustomerUser,
  CustomerAccount,
  DeliverySettings,
} from '../types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, HISTORICAL_FINANCIALS, CATEGORY_NAMES } from '../data/mockData';

export const ADMIN_PASSCODE = 'shaadhshaasgri123';

interface StoreContextType {
  // Storefront navigation & state
  activeMode: 'storefront' | 'admin';
  setActiveMode: (mode: 'storefront' | 'admin') => void;
  adminTab: 'dashboard' | 'inventory' | 'orders' | 'settings';
  setAdminTab: (tab: 'dashboard' | 'inventory' | 'orders' | 'settings') => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Cart
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  lastPlacedOrder: Order | null;
  setLastPlacedOrder: (order: Order | null) => void;
  addToCart: (product: Product, size: Product['sizes'][number], color: string, qty?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  promoCode: string;
  promoDiscount: number;
  promoError: string | null;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
  cartCount: number;
  cartSubtotal: number;
  cartDiscountAmount: number;
  cartShipping: number;
  cartTax: number;
  cartTotal: number;

  // Customer Authentication & Profile
  currentCustomer: CustomerUser | null;
  isCustomerAuthOpen: boolean;
  setIsCustomerAuthOpen: (open: boolean) => void;
  customerAuthTab: 'signin' | 'signup' | 'profile' | 'orders' | 'admin';
  setCustomerAuthTab: (tab: 'signin' | 'signup' | 'profile' | 'orders' | 'admin') => void;
  customerSignIn: (email: string, password: string) => { success: boolean; error?: string };
  customerSignUp: (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  }) => { success: boolean; error?: string };
  customerSignOut: () => void;
  updateCustomerProfile: (updates: Partial<CustomerUser>) => void;
  customerOrders: Order[];

  // Admin Access & Passcode Security (passcode: shaadhshaasgri123)
  isAdminAuthenticated: boolean;
  adminPasscodeError: string | null;
  verifyAdminPasscode: (passcode: string) => boolean;
  logoutAdmin: () => void;
  isAdminPasscodeModalOpen: boolean;
  setIsAdminPasscodeModalOpen: (open: boolean) => void;
  requestAdminAccess: () => void;

  // Checkout
  createOrder: (orderData: {
    customerName: string;
    customerEmail: string;
    shippingAddress: Order['shippingAddress'];
    paymentMethod: string;
    shippingOption?: string;
    shippingFee?: number;
  }) => Order;

  // Inventory / Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Orders
  orders: Order[];
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateOrderDates: (orderId: string, dates: { createdAt?: string; dispatchDate?: string }) => void;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;

  // Analytics
  kpis: StoreKPIs;
  monthlyFinancials: MonthlyFinancialRecord[];
  categoryPerformance: CategoryMetric[];

  // Delivery & Shipping Controls (Free delivery vs custom delivery fee)
  deliverySettings: DeliverySettings;
  updateDeliverySettings: (newSettings: Partial<DeliverySettings>) => void;

  // Print Products Bill / Invoice
  printingBillOrder: Order | null;
  openPrintBill: (order: Order) => void;
  closePrintBill: () => void;

  // Utilities
  resetStoreData: () => void;
  notification: string | null;
  setNotification: (msg: string | null) => void;
  firestoreConnected: boolean;
  firestoreDbId: string;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_PRODUCTS = 'grid_clothing_products_v2';
const LOCAL_STORAGE_KEY_ORDERS = 'grid_clothing_orders_v2';
const LOCAL_STORAGE_KEY_CART = 'grid_clothing_cart_v2';
const LOCAL_STORAGE_KEY_CUSTOMERS = 'grid_clothing_customers_v1';
const LOCAL_STORAGE_KEY_CURRENT_CUSTOMER = 'grid_clothing_current_cust_v1';
const LOCAL_STORAGE_KEY_DELIVERY = 'grid_clothing_delivery_config_v2';
const SESSION_STORAGE_KEY_ADMIN_AUTH = 'grid_clothing_admin_auth_v1';

const INITIAL_DELIVERY_SETTINGS: DeliverySettings = {
  isFreeDelivery: false,
  deliveryFee: 149,
  enableFreeDeliveryThreshold: true,
  freeDeliveryThreshold: 4999,
  expressCourierName: 'FedEx / Bluedart Express',
};

const INITIAL_DEMO_CUSTOMERS: CustomerAccount[] = [
  {
    id: 'cust_demo_01',
    name: 'Arjun Mehta',
    email: 'arjun@gridclothing.ai',
    password: 'customer123',
    phone: '+91 98765 43210',
    savedAddress: {
      street: 'Flat 4B, Sky Towers, 12th Main',
      city: 'Bengaluru',
      state: 'Karnataka',
      zip: '560038',
      country: 'India',
    },
    createdAt: '2026-08-15T10:00:00Z',
  },
];

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [activeMode, setActiveMode] = useState<'storefront' | 'admin'>('storefront');
  const [adminTab, setAdminTab] = useState<'dashboard' | 'inventory' | 'orders' | 'settings'>('dashboard');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Cart & Checkout
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);
  const [promoCode, setPromoCode] = useState<string>('');
  const [promoDiscount, setPromoDiscount] = useState<number>(0);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Customer Authentication state
  const [customerAccounts, setCustomerAccounts] = useState<CustomerAccount[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_CUSTOMERS);
      return saved ? JSON.parse(saved) : INITIAL_DEMO_CUSTOMERS;
    } catch {
      return INITIAL_DEMO_CUSTOMERS;
    }
  });

  const [currentCustomer, setCurrentCustomer] = useState<CustomerUser | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_CURRENT_CUSTOMER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isCustomerAuthOpen, setIsCustomerAuthOpen] = useState(false);
  const [customerAuthTab, setCustomerAuthTab] = useState<'signin' | 'signup' | 'profile' | 'orders' | 'admin'>('signin');

  // Admin Passcode Authentication state (passcode: shaadhshaasgri123)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(SESSION_STORAGE_KEY_ADMIN_AUTH) === 'true';
    } catch {
      return false;
    }
  });
  const [adminPasscodeError, setAdminPasscodeError] = useState<string | null>(null);
  const [isAdminPasscodeModalOpen, setIsAdminPasscodeModalOpen] = useState(false);

  // Core Data
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PRODUCTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((p: Product) => {
            const initial = INITIAL_PRODUCTS.find((item) => item.id === p.id);
            if (initial && (!p.images || p.images.length < 4)) {
              return { ...p, images: initial.images };
            }
            return p;
          });
        }
      }
      return INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_ORDERS);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Product Bill Print State
  const [printingBillOrder, setPrintingBillOrder] = useState<Order | null>(null);

  const openPrintBill = (order: Order) => {
    setPrintingBillOrder(order);
  };

  const closePrintBill = () => {
    setPrintingBillOrder(null);
  };

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_PRODUCTS, JSON.stringify(products));
    } catch {
      // ignore
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_ORDERS, JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_CART, JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_CUSTOMERS, JSON.stringify(customerAccounts));
    } catch {
      // ignore
    }
  }, [customerAccounts]);

  useEffect(() => {
    try {
      if (currentCustomer) {
        localStorage.setItem(LOCAL_STORAGE_KEY_CURRENT_CUSTOMER, JSON.stringify(currentCustomer));
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEY_CURRENT_CUSTOMER);
      }
    } catch {
      // ignore
    }
  }, [currentCustomer]);

  useEffect(() => {
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY_ADMIN_AUTH, isAdminAuthenticated ? 'true' : 'false');
    } catch {
      // ignore
    }
  }, [isAdminAuthenticated]);

  // Delivery & Shipping fee settings state
  const [deliverySettings, setDeliverySettings] = useState<DeliverySettings>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_DELIVERY);
      return saved ? { ...INITIAL_DELIVERY_SETTINGS, ...JSON.parse(saved) } : INITIAL_DELIVERY_SETTINGS;
    } catch {
      return INITIAL_DELIVERY_SETTINGS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_DELIVERY, JSON.stringify(deliverySettings));
    } catch {
      // ignore
    }
  }, [deliverySettings]);

  // Cloud Firestore Database connection & sync
  const [firestoreConnected, setFirestoreConnected] = useState<boolean>(false);
  const firestoreDbId = 'ai-studio-gridclothing-db80b41b-ecc7-4101-b273-7c8c16a94f2a';

  // Firestore Real-Time Sync for Products
  useEffect(() => {
    let isInitial = true;
    const unsub = onSnapshot(
      collection(db, 'products'),
      async (snapshot) => {
        setFirestoreConnected(true);
        if (snapshot.empty && isInitial) {
          isInitial = false;
          try {
            const batch = writeBatch(db);
            INITIAL_PRODUCTS.forEach((p) => {
              const docRef = doc(db, 'products', p.id);
              batch.set(docRef, p);
            });
            await batch.commit();
          } catch (err) {
            console.warn('[Firestore] Error seeding initial products:', err);
          }
        } else if (!snapshot.empty) {
          isInitial = false;
          const items: Product[] = [];
          snapshot.forEach((d) => {
            items.push(d.data() as Product);
          });
          setProducts(items);
        }
      },
      (error) => {
        console.warn('[Firestore] Products listener error:', error);
      }
    );

    return () => unsub();
  }, []);

  // Firestore Real-Time Sync for Orders
  useEffect(() => {
    let isInitial = true;
    const unsub = onSnapshot(
      collection(db, 'orders'),
      async (snapshot) => {
        if (snapshot.empty && isInitial) {
          isInitial = false;
          try {
            const batch = writeBatch(db);
            INITIAL_ORDERS.forEach((o) => {
              const docRef = doc(db, 'orders', o.id);
              batch.set(docRef, o);
            });
            await batch.commit();
          } catch (err) {
            console.warn('[Firestore] Error seeding initial orders:', err);
          }
        } else if (!snapshot.empty) {
          isInitial = false;
          const items: Order[] = [];
          snapshot.forEach((d) => {
            items.push(d.data() as Order);
          });
          setOrders(items);
        }
      },
      (error) => {
        console.warn('[Firestore] Orders listener error:', error);
      }
    );

    return () => unsub();
  }, []);

  // Firestore Sync for Store Delivery Settings
  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, 'settings', 'delivery'),
      (snapshot) => {
        if (snapshot.exists()) {
          setDeliverySettings((prev) => ({
            ...prev,
            ...(snapshot.data() as Partial<DeliverySettings>),
          }));
        }
      },
      (error) => {
        console.warn('[Firestore] Settings listener error:', error);
      }
    );

    return () => unsub();
  }, []);

  // Flash notification helper
  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  const updateDeliverySettings = (newSettings: Partial<DeliverySettings>) => {
    setDeliverySettings((prev) => {
      const updated = { ...prev, ...newSettings };
      setDoc(doc(db, 'settings', 'delivery'), updated, { merge: true }).catch((err) =>
        console.warn('[Firestore] updateDeliverySettings error:', err)
      );
      return updated;
    });
    triggerNotification('Delivery & shipping fee configuration updated successfully.');
  };

  // Customer Authentication methods
  const customerSignIn = (email: string, password: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    const account = customerAccounts.find((acc) => acc.email.toLowerCase() === trimmedEmail);
    if (!account) {
      return { success: false, error: 'No customer account found with this email address.' };
    }
    if (account.password !== password) {
      return { success: false, error: 'Incorrect password. Please verify and try again.' };
    }
    const { password: _, ...userProfile } = account;
    setCurrentCustomer(userProfile);
    setIsCustomerAuthOpen(false);
    triggerNotification(`Welcome back, ${userProfile.name}!`);
    return { success: true };
  };

  const customerSignUp = (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  }) => {
    const trimmedEmail = userData.email.trim().toLowerCase();
    if (!userData.name.trim()) {
      return { success: false, error: 'Please enter your full name.' };
    }
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!userData.password || userData.password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }
    const exists = customerAccounts.some((acc) => acc.email.toLowerCase() === trimmedEmail);
    if (exists) {
      return { success: false, error: 'An account with this email already exists. Please sign in.' };
    }

    const newAccount: CustomerAccount = {
      id: `cust_${Date.now()}`,
      name: userData.name.trim(),
      email: trimmedEmail,
      password: userData.password,
      phone: userData.phone?.trim() || '',
      savedAddress: userData.street
        ? {
            street: userData.street.trim(),
            city: userData.city?.trim() || '',
            state: userData.state?.trim() || '',
            zip: userData.zip?.trim() || '',
            country: userData.country?.trim() || 'India',
          }
        : undefined,
      createdAt: new Date().toISOString(),
    };

    setCustomerAccounts((prev) => [...prev, newAccount]);
    const { password: _, ...userProfile } = newAccount;
    setCurrentCustomer(userProfile);
    setIsCustomerAuthOpen(false);
    triggerNotification(`Account created! Welcome to GRID CLOTHING, ${userProfile.name}.`);
    return { success: true };
  };

  const customerSignOut = () => {
    setCurrentCustomer(null);
    setIsCustomerAuthOpen(false);
    triggerNotification('You have been signed out.');
  };

  const updateCustomerProfile = (updates: Partial<CustomerUser>) => {
    if (!currentCustomer) return;
    const updated = { ...currentCustomer, ...updates };
    setCurrentCustomer(updated);
    setCustomerAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === updated.id) {
          return { ...acc, ...updates };
        }
        return acc;
      })
    );
    triggerNotification('Customer profile and address details saved.');
  };

  const customerOrders = useMemo(() => {
    if (!currentCustomer) return [];
    return orders.filter(
      (o) => o.customerEmail.toLowerCase() === currentCustomer.email.toLowerCase()
    );
  }, [orders, currentCustomer]);

  // Admin Passcode Security methods (Passcode: shaadhshaasgri123)
  const verifyAdminPasscode = (passcode: string) => {
    if (passcode.trim() === ADMIN_PASSCODE) {
      setIsAdminAuthenticated(true);
      setAdminPasscodeError(null);
      setIsAdminPasscodeModalOpen(false);
      setActiveMode('admin');
      triggerNotification('Admin security verified. Access granted to ERP.');
      return true;
    } else {
      setAdminPasscodeError('Invalid passcode. Access to Administrator Panel denied.');
      return false;
    }
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    setAdminPasscodeError(null);
    setActiveMode('storefront');
    triggerNotification('Admin locked. Returned to storefront.');
  };

  const requestAdminAccess = () => {
    if (isAdminAuthenticated) {
      setActiveMode('admin');
    } else {
      setAdminPasscodeError(null);
      setIsAdminPasscodeModalOpen(true);
    }
  };

  // Cart logic
  const addToCart = (
    product: Product,
    size: Product['sizes'][number],
    color: string,
    quantity: number = 1
  ) => {
    if (product.stock <= 0) {
      triggerNotification('Sorry, this item is currently out of stock.');
      return;
    }

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === size &&
          item.selectedColor === color
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = Math.min(updated[existingIndex].quantity + quantity, product.stock);
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
        };
        return updated;
      } else {
        const newItem: CartItem = {
          id: `${product.id}-${size}-${color}-${Date.now()}`,
          product,
          selectedSize: size,
          selectedColor: color,
          quantity: Math.min(quantity, product.stock),
        };
        return [...prev, newItem];
      }
    });

    triggerNotification(`Added "${product.name}" (${size} / ${color}) to cart`);
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === cartItemId) {
            const nextQty = item.quantity + delta;
            if (nextQty <= 0) return null;
            const maxAllowed = item.product.stock;
            return {
              ...item,
              quantity: Math.min(nextQty, maxAllowed),
            };
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const clearCart = () => {
    setCart([]);
    setPromoCode('');
    setPromoDiscount(0);
  };

  const applyPromoCode = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    if (clean === 'GRID10' || clean === 'STREET10') {
      setPromoCode(clean);
      setPromoDiscount(0.1); // 10%
      setPromoError(null);
      triggerNotification(`10% discount promo code "${clean}" applied!`);
      return true;
    } else if (clean === 'VIP20' || clean === 'MONOLITH20') {
      setPromoCode(clean);
      setPromoDiscount(0.2); // 20%
      setPromoError(null);
      triggerNotification(`20% VIP discount promo code "${clean}" applied!`);
      return true;
    } else {
      setPromoError('Invalid coupon. Try code "GRID10" or "VIP20"');
      return false;
    }
  };

  const removePromoCode = () => {
    setPromoCode('');
    setPromoDiscount(0);
    setPromoError(null);
  };

  // Cart calculations
  const cartCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  }, [cart]);

  const cartDiscountAmount = useMemo(() => {
    return Math.round(cartSubtotal * promoDiscount * 100) / 100;
  }, [cartSubtotal, promoDiscount]);

  const cartShipping = useMemo(() => {
    if (cartSubtotal === 0) return 0;
    // 1. If admin set 100% Free Delivery storewide
    if (deliverySettings.isFreeDelivery) {
      return 0;
    }
    // 2. If admin enabled free delivery threshold and cart subtotal meets it
    if (
      deliverySettings.enableFreeDeliveryThreshold &&
      cartSubtotal >= deliverySettings.freeDeliveryThreshold
    ) {
      return 0;
    }
    // 3. Otherwise charge configured delivery fee (e.g. ₹149, ₹250, or custom fee)
    return Math.max(0, Number(deliverySettings.deliveryFee) || 0);
  }, [cartSubtotal, deliverySettings]);

  const cartTax = useMemo(() => {
    const taxable = Math.max(0, cartSubtotal - cartDiscountAmount);
    return Math.round(taxable * 0.12 * 100) / 100; // 12% GST on apparel
  }, [cartSubtotal, cartDiscountAmount]);

  const cartTotal = useMemo(() => {
    if (cartSubtotal === 0) return 0;
    return Math.round((cartSubtotal - cartDiscountAmount + cartShipping + cartTax) * 100) / 100;
  }, [cartSubtotal, cartDiscountAmount, cartShipping, cartTax]);

  // Checkout & order creation
  const createOrder = (orderData: {
    customerName: string;
    customerEmail: string;
    shippingAddress: Order['shippingAddress'];
    paymentMethod: string;
    shippingOption?: string;
    shippingFee?: number;
  }): Order => {
    const orderNum = `GRD-${Math.floor(8900 + Math.random() * 1000)}`;

    const orderItems = cart.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      sku: item.product.sku,
      price: item.product.price,
      costPrice: item.product.costPrice,
      selectedColor: item.selectedColor,
      selectedSize: item.selectedSize,
      quantity: item.quantity,
      image: item.product.images[0] || '',
    }));

    const finalShipping = typeof orderData.shippingFee === 'number' ? orderData.shippingFee : cartShipping;
    const finalTotal = Math.round((cartSubtotal - cartDiscountAmount + finalShipping + cartTax) * 100) / 100;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      shippingAddress: orderData.shippingAddress,
      items: orderItems,
      subtotal: cartSubtotal,
      discount: cartDiscountAmount,
      shipping: finalShipping,
      shippingOption: orderData.shippingOption || (finalShipping === 0 ? '1. Free Delivery' : '2. Delivery Charge'),
      tax: cartTax,
      total: finalTotal,
      status: 'Processing',
      createdAt: new Date().toISOString(),
      paymentMethod: orderData.paymentMethod,
    };

    // Deduct stock in real-time
    setProducts((prev) =>
      prev.map((prod) => {
        const purchased = cart.filter((c) => c.product.id === prod.id);
        if (purchased.length > 0) {
          const qtySum = purchased.reduce((acc, c) => acc + c.quantity, 0);
          return {
            ...prod,
            stock: Math.max(0, prod.stock - qtySum),
          };
        }
        return prod;
      })
    );

    // Save order
    setOrders((prev) => [newOrder, ...prev]);
    setLastPlacedOrder(newOrder);
    clearCart();

    // Persist order to Firestore
    setDoc(doc(db, 'orders', newOrder.id), newOrder).catch((err) =>
      console.warn('[Firestore] createOrder sync error:', err)
    );

    triggerNotification(`Order #${orderNum} confirmed! Placed into processing queue.`);
    return newOrder;
  };

  // Inventory management
  const addProduct = (productData: Omit<Product, 'id'>): Product => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
    };
    setProducts((prev) => [newProduct, ...prev]);
    setDoc(doc(db, 'products', newProduct.id), newProduct).catch((err) =>
      console.warn('[Firestore] addProduct sync error:', err)
    );
    triggerNotification(`Product "${newProduct.name}" (${newProduct.sku}) added to catalog.`);
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    updateDoc(doc(db, 'products', id), updates).catch((err) =>
      console.warn('[Firestore] updateProduct sync error:', err)
    );
    triggerNotification('Product details updated successfully.');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    deleteDoc(doc(db, 'products', id)).catch((err) =>
      console.warn('[Firestore] deleteProduct sync error:', err)
    );
    triggerNotification('Product removed from active catalog.');
  };

  // Orders fulfillment
  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    let updatedDispatchDate: string | undefined;
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const updated: Order = { ...o, status };
          // If status changes to Shipped or On the way or Delivered and dispatchDate is not yet set, set to current ISO date
          if ((status === 'Shipped' || status === 'On the way' || status === 'Delivered') && !updated.dispatchDate) {
            updated.dispatchDate = new Date().toISOString();
          }
          updatedDispatchDate = updated.dispatchDate;
          return updated;
        }
        return o;
      })
    );
    updateDoc(doc(db, 'orders', orderId), {
      status,
      ...(updatedDispatchDate ? { dispatchDate: updatedDispatchDate } : {}),
    }).catch((err) => console.warn('[Firestore] updateOrderStatus sync error:', err));
    triggerNotification(`Order status updated to "${status}".`);
  };

  const updateOrderDates = (
    orderId: string,
    dates: { createdAt?: string; dispatchDate?: string }
  ) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            ...(dates.createdAt !== undefined ? { createdAt: dates.createdAt } : {}),
            ...(dates.dispatchDate !== undefined ? { dispatchDate: dates.dispatchDate } : {}),
          };
        }
        return o;
      })
    );
    updateDoc(doc(db, 'orders', orderId), dates).catch((err) =>
      console.warn('[Firestore] updateOrderDates sync error:', err)
    );
    triggerNotification('Order timeline dates updated.');
  };

  const updateOrder = (orderId: string, updates: Partial<Order>) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, ...updates } : o))
    );
    updateDoc(doc(db, 'orders', orderId), updates).catch((err) =>
      console.warn('[Firestore] updateOrder sync error:', err)
    );
    triggerNotification('Order updated.');
  };

  // Reset to defaults
  const resetStoreData = () => {
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setCart([]);
    setDeliverySettings(INITIAL_DELIVERY_SETTINGS);
    localStorage.removeItem(LOCAL_STORAGE_KEY_PRODUCTS);
    localStorage.removeItem(LOCAL_STORAGE_KEY_ORDERS);
    localStorage.removeItem(LOCAL_STORAGE_KEY_CART);
    localStorage.removeItem(LOCAL_STORAGE_KEY_DELIVERY);
    triggerNotification('Store data reset to initial showcase demo state.');
  };

  // Financial & Analytics Calculations
  const kpis: StoreKPIs = useMemo(() => {
    // Total sales from delivered and processing orders + baseline
    const completedOrders = orders.filter((o) => o.status !== 'Cancelled');
    const orderSales = completedOrders.reduce((acc, o) => acc + o.total, 0);
    const orderCost = completedOrders.reduce((acc, o) => {
      const itemsCost = o.items.reduce((sum, item) => sum + item.costPrice * item.quantity, 0);
      return acc + itemsCost;
    }, 0);

    // Baseline historical September addition (in INR)
    const totalSales = 7489000 + Math.round(orderSales);
    const totalCost = 2750000 + Math.round(orderCost);
    const netProfit = totalSales - totalCost;
    const activeOrders = orders.filter(
      (o) => o.status === 'Processing' || o.status === 'Shipped' || o.status === 'On the way'
    ).length;
    const lowStockCount = products.filter((p) => p.stock <= 15).length;
    const averageOrderValue = Math.round(totalSales / (1065 + orders.length));
    const profitMarginPercent = Math.round((netProfit / totalSales) * 1000) / 10;

    return {
      totalSales,
      netProfit,
      activeOrders,
      lowStockCount,
      averageOrderValue,
      profitMarginPercent,
    };
  }, [orders, products]);

  const monthlyFinancials: MonthlyFinancialRecord[] = useMemo(() => {
    // Base 6-month historical, with dynamic Sep 2026 reflecting live state
    const currentOrdersRevenue = orders
      .filter((o) => o.status !== 'Cancelled')
      .reduce((acc, o) => acc + o.total, 0);

    const currentOrdersCost = orders
      .filter((o) => o.status !== 'Cancelled')
      .reduce((acc, o) => {
        return acc + o.items.reduce((sum, item) => sum + item.costPrice * item.quantity, 0);
      }, 0);

    return HISTORICAL_FINANCIALS.map((rec) => {
      if (rec.month === 'Sep 2026') {
        const dynamicRev = 7489000 + Math.round(currentOrdersRevenue);
        const dynamicCost = 2750000 + Math.round(currentOrdersCost);
        return {
          ...rec,
          revenue: dynamicRev,
          costOfGoods: dynamicCost,
          profit: dynamicRev - dynamicCost,
          orders: 1065 + orders.length,
        };
      }
      return rec;
    });
  }, [orders]);

  const categoryPerformance: CategoryMetric[] = useMemo(() => {
    const categories: ProductCategory[] = ['hoodies', 'tees', 'pants', 'jackets', 'accessories'];

    return categories.map((cat) => {
      // Calculate from live orders
      let volume = 0;
      let revenue = 0;
      let profit = 0;

      orders.forEach((o) => {
        if (o.status === 'Cancelled') return;
        o.items.forEach((item) => {
          const prod = products.find((p) => p.id === item.productId);
          if (prod?.category === cat || (!prod && item.sku.includes(cat.toUpperCase().slice(0, 2)))) {
            volume += item.quantity;
            revenue += item.price * item.quantity;
            profit += (item.price - item.costPrice) * item.quantity;
          }
        });
      });

      // Add baseline category distribution to make charts rich and realistic immediately (in INR)
      const baselineMap: Record<ProductCategory, { vol: number; rev: number; prof: number }> = {
        hoodies: { vol: 420, rev: 2840000, prof: 1950000 },
        tees: { vol: 610, rev: 1980000, prof: 1430000 },
        pants: { vol: 285, rev: 2350000, prof: 1610000 },
        jackets: { vol: 195, rev: 2390000, prof: 1560000 },
        accessories: { vol: 540, rev: 1350000, prof: 970000 },
      };

      const base = baselineMap[cat];

      return {
        category: cat,
        categoryName: CATEGORY_NAMES[cat] || cat,
        volume: base.vol + volume,
        revenue: base.rev + Math.round(revenue),
        profit: base.prof + Math.round(profit),
      };
    });
  }, [orders, products]);

  return (
    <StoreContext.Provider
      value={{
        activeMode,
        setActiveMode,
        adminTab,
        setAdminTab,
        selectedProduct,
        setSelectedProduct,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        cart,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        lastPlacedOrder,
        setLastPlacedOrder,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        promoCode,
        promoDiscount,
        promoError,
        applyPromoCode,
        removePromoCode,
        cartCount,
        cartSubtotal,
        cartDiscountAmount,
        cartShipping,
        cartTax,
        cartTotal,
        // Customer auth
        currentCustomer,
        isCustomerAuthOpen,
        setIsCustomerAuthOpen,
        customerAuthTab,
        setCustomerAuthTab,
        customerSignIn,
        customerSignUp,
        customerSignOut,
        updateCustomerProfile,
        customerOrders,
        // Admin passcode security
        isAdminAuthenticated,
        adminPasscodeError,
        verifyAdminPasscode,
        logoutAdmin,
        isAdminPasscodeModalOpen,
        setIsAdminPasscodeModalOpen,
        requestAdminAccess,
        createOrder,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        orders,
        updateOrderStatus,
        updateOrderDates,
        updateOrder,
        kpis,
        monthlyFinancials,
        categoryPerformance,
        // Delivery & Shipping Controls
        deliverySettings,
        updateDeliverySettings,
        // Print Products Bill
        printingBillOrder,
        openPrintBill,
        closePrintBill,
        resetStoreData,
        notification,
        setNotification,
        firestoreConnected,
        firestoreDbId,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
