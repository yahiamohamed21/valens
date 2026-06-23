"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Types definition
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  discountPrice?: number;
  size: string;
  variants: string[];
  stock: number;
  stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
  sku: string;
  description: string;
  ingredients: string[];
  usage: string;
  benefits: string[];
  rating: number;
  reviews: Review[];
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  visible: boolean;
  imageColor: string; // hex color for cap/accent
  imageType: 'powder' | 'capsule' | 'liquid';
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  imageColor: string;
  visible: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedVariant: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  customerCity: string;
  notes?: string;
  items: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    size: string;
    variant: string;
    imageColor: string;
    imageType: 'powder' | 'capsule' | 'liquid';
  }[];
  totalPrice: number;
  paymentMethod: string;
  shippingMethod: string;
  shippingCost: number;
  discountAmount: number;
  couponCode?: string;
  orderDate: string;
  status: 'New Order' | 'Confirmed' | 'Preparing' | 'Shipped / Out for Delivery' | 'Delivered' | 'Cancelled' | 'Rejected' | 'Returned';
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  orderCount: number;
  totalSpent: number;
  joinDate: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  expiryDate: string;
  usageLimit: number;
  usageCount: number;
  minOrderAmount: number;
  active: boolean;
}

export interface Expense {
  id: string;
  title: string;
  category: 'Product purchasing cost' | 'Shipping expenses' | 'Marketing and ads' | 'Packaging' | 'Website maintenance' | 'Staff salaries' | 'Storage / warehouse' | 'Delivery company fees' | 'Miscellaneous expenses';
  amount: number;
  date: string;
  paymentMethod: string;
  notes?: string;
}

export interface HomePageSettings {
  brandName: string;
  logoText: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCtaText: string;
  heroCtaLink: string;
  firstBannerTitle: string;
  firstBannerSubtitle: string;
  firstBannerCtaText: string;
  promoBadge: string;
}

export interface StoreSettings {
  brandName: string;
  logoText: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  shippingCost: number;
  taxRate: number;
  socialInstagram: string;
  socialTwitter: string;
  socialFacebook: string;
}

interface AppContextType {
  products: Product[];
  categories: Category[];
  cart: CartItem[];
  orders: Order[];
  customers: Customer[];
  coupons: Coupon[];
  expenses: Expense[];
  homePageSettings: HomePageSettings;
  storeSettings: StoreSettings;
  activeCoupon: Coupon | null;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;

  // Cart operations
  addToCart: (product: Product, quantity: number, size: string, variant: string) => void;
  updateCartQuantity: (index: number, quantity: number) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;

  // Order operations
  placeOrder: (orderData: Omit<Order, 'id' | 'orderDate' | 'status'>) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  confirmOrder: (orderId: string) => void;
  cancelOrder: (orderId: string) => void;

  // Admin CRUD operations
  addProduct: (product: Omit<Product, 'id' | 'reviews'>) => void;
  editProduct: (productId: string, updatedProduct: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  
  addCategory: (category: Omit<Category, 'id' | 'slug'>) => void;
  editCategory: (categoryId: string, updatedCategory: Partial<Category>) => void;
  deleteCategory: (categoryId: string) => void;

  addCoupon: (coupon: Omit<Coupon, 'id' | 'usageCount'>) => void;
  editCoupon: (couponId: string, updatedCoupon: Partial<Coupon>) => void;
  deleteCoupon: (couponId: string) => void;

  addExpense: (expense: Omit<Expense, 'id'>) => void;
  editExpense: (expenseId: string, updatedExpense: Partial<Expense>) => void;
  deleteExpense: (expenseId: string) => void;

  updateHomePageSettings: (settings: HomePageSettings) => void;
  updateStoreSettings: (settings: StoreSettings) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

// Initial Mock Data
const initialProducts: Product[] = [
  {
    id: "prod-1",
    name: "ISO-WHEY PREMIUM ISOLATE",
    category: "Protein",
    price: 64.99,
    discountPrice: 59.99,
    size: "2kg",
    variants: ["Gourmet Chocolate", "Madagascar Vanilla", "Salted Caramel"],
    stock: 45,
    stockStatus: "In Stock",
    sku: "VL-WH-2KG",
    description: "Valens ISO-WHEY is a state-of-the-art cold-processed cross-flow microfiltered whey protein isolate designed for rapid absorption, muscle repair, and maximum performance. Pure, clean, and formulated with zero fillers.",
    ingredients: ["Cross-flow Microfiltered Whey Protein Isolate", "Natural Cocoa Powder", "Organic Stevia Leaf Extract", "Digestive Enzyme Complex (Lactase, Protease)"],
    usage: "Mix one rounded scoop (30g) with 250ml of cold water or almond milk. Shake for 20 seconds. Consume immediately post-workout or throughout the day to hit protein targets.",
    benefits: [
      "26g of ultra-pure protein isolate per scoop",
      "Less than 1g of fat, sugars, and carbohydrates",
      "Rich in natural BCAAs for muscle protein synthesis",
      "Enhanced with digestive enzymes for zero bloating"
    ],
    rating: 4.8,
    reviews: [
      { id: "rev-1", author: "Alex K.", rating: 5, comment: "Hands down the best mixing isolate I've ever had. Chocolate flavor is rich but not artificially sweet.", date: "2026-05-14" },
      { id: "rev-2", author: "Sarah M.", rating: 4, comment: "Mixes cleanly and digests extremely well. Looking forward to trying Vanilla.", date: "2026-06-02" }
    ],
    featured: true,
    bestSeller: true,
    newArrival: false,
    visible: true,
    imageColor: "#FF8A75",
    imageType: "powder"
  },
  {
    id: "prod-2",
    name: "PRE-CHARGE ELITE CATALYST",
    category: "Performance",
    price: 44.99,
    size: "400g",
    variants: ["Sour Coral Apple", "Blue Raspberry Ice", "Citrus Fury"],
    stock: 12,
    stockStatus: "Low Stock",
    sku: "VL-PR-400G",
    description: "Engineered for athletes who demand focused energy, skin-splitting muscle pumps, and enhanced endurance. Valens PRE-CHARGE combines clinical dosages of L-Citrulline, Beta-Alanine, and Organic Caffeine for clean power without the crash.",
    ingredients: ["L-Citrulline Malate 2:1", "Beta-Alanine", "Betaine Anhydrous", "L-Tyrosine", "Organic Caffeine (Green Coffee Bean)", "Pink Himalayan Salt"],
    usage: "Mix 1 scoop with 300ml of cold water 15-20 minutes prior to training. First-time users should assess tolerance with half a scoop.",
    benefits: [
      "Clinical 8g Citrulline Malate for massive blood flow",
      "3.2g Beta-Alanine to delay muscular fatigue",
      "Laser focus matrix with Tyrosine and Huperzine A",
      "Zero artificial dyes or standard crash-inducing stimulants"
    ],
    rating: 4.9,
    reviews: [
      { id: "rev-3", author: "David T.", rating: 5, comment: "Unbelievable energy and focus. The pump is insane. Sour Coral Apple is incredible.", date: "2026-06-10" }
    ],
    featured: true,
    bestSeller: false,
    newArrival: true,
    visible: true,
    imageColor: "#FF5226",
    imageType: "powder"
  },
  {
    id: "prod-3",
    name: "PURE MICRONIZED CREATINE",
    category: "Performance",
    price: 29.99,
    size: "500g",
    variants: ["Pure Unflavored"],
    stock: 80,
    stockStatus: "In Stock",
    sku: "VL-CR-500G",
    description: "100% pure pharmaceutical-grade micronized creatine monohydrate. Clinically proven to increase strength, power, and cellular hydration. Soluble, flavorless, and perfect for stacking with your daily protein.",
    ingredients: ["100% Micronized Creatine Monohydrate"],
    usage: "Add 1 scoop (5g) to water, juice, or your protein shake. Consumed daily. Drink plenty of water throughout the day.",
    benefits: [
      "5g pure Micronized Creatine Monohydrate per serving",
      "Micronized for effortless mixing and superior absorption",
      "Increases raw muscle power, ATP recovery, and volume",
      "Completely unflavored with zero additives or sweeteners"
    ],
    rating: 4.7,
    reviews: [
      { id: "rev-4", author: "Marcus G.", rating: 5, comment: "Pure, high-grade creatine. Dissolves fully in water with no grit. Unbeatable price.", date: "2026-06-18" }
    ],
    featured: false,
    bestSeller: true,
    newArrival: false,
    visible: true,
    imageColor: "#D8C9C3",
    imageType: "powder"
  },
  {
    id: "prod-4",
    name: "DAILY MULTI-OPTIMIZER",
    category: "Wellness",
    price: 34.99,
    discountPrice: 29.99,
    size: "120 Capsules",
    variants: ["Standard 30-Day Pack"],
    stock: 5,
    stockStatus: "Low Stock",
    sku: "VL-MV-120C",
    description: "An advanced multivitamin, mineral, and antioxidant formula engineered specifically for active lifestyles. Covers nutritional gaps, promotes immune function, and supports hormonal balance and joint wellness.",
    ingredients: ["Vitamin A, C, D3, E, K2", "B-Complex (Active Methylated forms)", "Zinc Glycinate", "Magnesium Bisglycinate", "Turmeric Extract", "CoQ10"],
    usage: "Take 4 capsules daily with your morning meal or split 2 capsules with breakfast and 2 with dinner.",
    benefits: [
      "Highly bioavailable chelated minerals and vitamins",
      "Methylated B-Vitamins for superior energy conversion",
      "Antioxidant support with Turmeric, Ginger, and CoQ10",
      "Vegetarian capsules with no chemical coatings or binders"
    ],
    rating: 4.6,
    reviews: [],
    featured: false,
    bestSeller: false,
    newArrival: false,
    visible: true,
    imageColor: "#10D981",
    imageType: "capsule"
  },
  {
    id: "prod-5",
    name: "DEEP SLEEP & RECOVERY",
    category: "Wellness",
    price: 39.99,
    size: "90 Capsules",
    variants: ["Standard"],
    stock: 0,
    stockStatus: "Out of Stock",
    sku: "VL-DS-90C",
    description: "Formulated to optimize natural sleep cycles, reduce stress, and maximize nighttime muscle recovery. Valens Deep Sleep combines botanical adaptogens with magnesium and melatonin for deep, non-groggy sleep.",
    ingredients: ["Magnesium Bisglycinate", "L-Theanine", "Ashwagandha KSM-66", "Valerian Root Extract", "5-HTP", "Melatonin (3mg)"],
    usage: "Take 3 capsules with water 30-45 minutes before sleep. For best results, avoid screen exposure after consuming.",
    benefits: [
      "Deepens REM sleep and speeds overnight recovery",
      "KSM-66 Ashwagandha reduces bedtime cortisol spikes",
      "Supports neural relaxation and calms muscle cramps",
      "Wakes you up feeling refreshed, energized, and ready"
    ],
    rating: 4.8,
    reviews: [
      { id: "rev-5", author: "Emma L.", rating: 5, comment: "I struggle with insomnia, but this knocks me out naturally. Waking up feels amazing now.", date: "2026-06-15" }
    ],
    featured: true,
    bestSeller: false,
    newArrival: false,
    visible: true,
    imageColor: "#8D7B73",
    imageType: "capsule"
  },
  {
    id: "prod-6",
    name: "MARINE COLLAGEN PEPTIDES",
    category: "Recovery",
    price: 49.99,
    size: "300g",
    variants: ["Natural Peach", "Pure Unflavored"],
    stock: 35,
    stockStatus: "In Stock",
    sku: "VL-COL-300",
    description: "Premium wild-caught hydrolyzed marine collagen peptides. Designed to restore skin elasticity, strengthen hair and nails, and support joint cartilage repair. Highly soluble and easily digested.",
    ingredients: ["Hydrolyzed Wild-Caught Cod Collagen Peptides", "Natural Flavors", "Citric Acid", "Stevia Extract"],
    usage: "Stir 1 scoop into water, coffee, tea, or smoothies daily. Dissolves instantly in hot or cold liquids.",
    benefits: [
      "10g wild-caught marine collagen per serving",
      "Type I & III collagen for optimal skin and joint health",
      "Enzymatically hydrolyzed for instant absorption",
      "Sustainably sourced from cold Atlantic deep ocean waters"
    ],
    rating: 4.5,
    reviews: [],
    featured: false,
    bestSeller: false,
    newArrival: true,
    visible: true,
    imageColor: "#FF8A75",
    imageType: "powder"
  }
];

const initialCategories: Category[] = [
  { id: "cat-1", name: "Protein", slug: "protein", imageColor: "#FF8A75", visible: true },
  { id: "cat-2", name: "Performance", slug: "performance", imageColor: "#FF5226", visible: true },
  { id: "cat-3", name: "Wellness", slug: "wellness", imageColor: "#10D981", visible: true },
  { id: "cat-4", name: "Recovery", slug: "recovery", imageColor: "#8D7B73", visible: true }
];

const initialCustomers: Customer[] = [
  { id: "cust-1", name: "Yahia Mohamed", email: "yahia@valens.com", phone: "+20100998877", address: "12 El-Galaa St, Heliopolis", city: "Cairo", orderCount: 3, totalSpent: 264.96, joinDate: "2026-02-10" },
  { id: "cust-2", name: "John Doe", email: "john@doe.com", phone: "+155501992", address: "742 Evergreen Terrace", city: "Springfield", orderCount: 1, totalSpent: 59.99, joinDate: "2026-04-15" },
  { id: "cust-3", name: "Sarah Smith", email: "sarah@gmail.com", phone: "+4479111234", address: "42 Baker St", city: "London", orderCount: 2, totalSpent: 104.98, joinDate: "2026-05-20" },
  { id: "cust-4", name: "James Williams", email: "james.w@yahoo.com", phone: "+13125550012", address: "555 Michigan Ave", city: "Chicago", orderCount: 0, totalSpent: 0, joinDate: "2026-06-18" }
];

const initialCoupons: Coupon[] = [
  { id: "coup-1", code: "VALENS10", discountType: "percentage", discountValue: 10, expiryDate: "2026-12-31", usageLimit: 500, usageCount: 45, minOrderAmount: 30, active: true },
  { id: "coup-2", code: "BUILD20", discountType: "percentage", discountValue: 20, expiryDate: "2026-08-31", usageLimit: 100, usageCount: 88, minOrderAmount: 80, active: true },
  { id: "coup-3", code: "FITFIXED", discountType: "fixed", discountValue: 15, expiryDate: "2026-10-15", usageLimit: 200, usageCount: 12, minOrderAmount: 50, active: true }
];

const initialExpenses: Expense[] = [
  { id: "exp-1", title: "Whey Protein Sourcing", category: "Product purchasing cost", amount: 1500, date: "2026-06-01", paymentMethod: "Bank Transfer", notes: "Procurement of 100kg Whey Isolate base raw materials." },
  { id: "exp-2", title: "Instagram Ads Camp - June", category: "Marketing and ads", amount: 450, date: "2026-06-05", paymentMethod: "Credit Card", notes: "Sponsored posts targeting fitness demographics." },
  { id: "exp-3", title: "Matte Black Product Jars", category: "Packaging", amount: 300, date: "2026-06-08", paymentMethod: "PayPal", notes: "500 units of custom 2kg jars and lids." },
  { id: "exp-4", title: "Server Maintenance & Shopify API", category: "Website maintenance", amount: 80, date: "2026-06-10", paymentMethod: "Credit Card" },
  { id: "exp-5", title: "Local Courier Fees", category: "Delivery company fees", amount: 180, date: "2026-06-12", paymentMethod: "Cash" },
  { id: "exp-6", title: "Staff Wages - Warehousing", category: "Staff salaries", amount: 1200, date: "2026-06-15", paymentMethod: "Bank Transfer", notes: "Bi-weekly warehouse supervisor wages." }
];

const initialOrders: Order[] = [
  {
    id: "VL-1001",
    customerName: "Yahia Mohamed",
    customerPhone: "+20100998877",
    customerEmail: "yahia@valens.com",
    customerAddress: "12 El-Galaa St, Heliopolis",
    customerCity: "Cairo",
    items: [
      { productId: "prod-1", productName: "ISO-WHEY PREMIUM ISOLATE", price: 59.99, quantity: 2, size: "2kg", variant: "Gourmet Chocolate", imageColor: "#FF8A75", imageType: "powder" },
      { productId: "prod-3", productName: "PURE MICRONIZED CREATINE", price: 29.99, quantity: 1, size: "500g", variant: "Pure Unflavored", imageColor: "#D8C9C3", imageType: "powder" }
    ],
    totalPrice: 144.97,
    paymentMethod: "Credit Card",
    shippingMethod: "Standard Express",
    shippingCost: 10,
    discountAmount: 15,
    couponCode: "FITFIXED",
    orderDate: "2026-06-12T14:32:00Z",
    status: "Delivered"
  },
  {
    id: "VL-1002",
    customerName: "John Doe",
    customerPhone: "+155501992",
    customerEmail: "john@doe.com",
    customerAddress: "742 Evergreen Terrace",
    customerCity: "Springfield",
    items: [
      { productId: "prod-1", productName: "ISO-WHEY PREMIUM ISOLATE", price: 59.99, quantity: 1, size: "2kg", variant: "Salted Caramel", imageColor: "#FF8A75", imageType: "powder" }
    ],
    totalPrice: 69.99,
    paymentMethod: "Cash on Delivery",
    shippingMethod: "Standard Express",
    shippingCost: 10,
    discountAmount: 0,
    orderDate: "2026-06-20T10:15:00Z",
    status: "Confirmed"
  },
  {
    id: "VL-1003",
    customerName: "Sarah Smith",
    customerPhone: "+4479111234",
    customerEmail: "sarah@gmail.com",
    customerAddress: "42 Baker St",
    customerCity: "London",
    items: [
      { productId: "prod-2", productName: "PRE-CHARGE ELITE CATALYST", price: 44.99, quantity: 1, size: "400g", variant: "Sour Coral Apple", imageColor: "#FF5226", imageType: "powder" },
      { productId: "prod-4", productName: "DAILY MULTI-OPTIMIZER", price: 29.99, quantity: 2, size: "120 Capsules", variant: "Standard 30-Day Pack", imageColor: "#10D981", imageType: "capsule" }
    ],
    totalPrice: 94.97,
    paymentMethod: "PayPal",
    shippingMethod: "Priority Air",
    shippingCost: 15,
    discountAmount: 20,
    couponCode: "BUILD20",
    orderDate: "2026-06-22T18:45:00Z",
    status: "Preparing"
  },
  {
    id: "VL-1004",
    customerName: "Yahia Mohamed",
    customerPhone: "+20100998877",
    customerEmail: "yahia@valens.com",
    customerAddress: "12 El-Galaa St, Heliopolis",
    customerCity: "Cairo",
    items: [
      { productId: "prod-2", productName: "PRE-CHARGE ELITE CATALYST", price: 44.99, quantity: 1, size: "400g", variant: "Blue Raspberry Ice", imageColor: "#FF5226", imageType: "powder" }
    ],
    totalPrice: 54.99,
    paymentMethod: "Credit Card",
    shippingMethod: "Standard Express",
    shippingCost: 10,
    discountAmount: 0,
    orderDate: "2026-06-23T12:00:00Z",
    status: "New Order"
  }
];

const defaultHomePageSettings: HomePageSettings = {
  brandName: "VALENS",
  logoText: "VALENS",
  heroTitle: "FORGED IN SCIENCE, UNLEASHED IN PERFORMANCE",
  heroSubtitle: "Engineered for elite athletes. Premium supplements formulated with clinical dosages, clean ingredients, and zero compromises.",
  heroCtaText: "SHOP THE NUTRITION",
  heroCtaLink: "/products",
  firstBannerTitle: "THE VALENS FORMULA",
  firstBannerSubtitle: "Cold-filtered processing, zero artificial coloring, complete transparency. We don't hide behind proprietary blends. What you see is exactly what powers you.",
  firstBannerCtaText: "DISCOVER THE SCIENCE",
  promoBadge: "ELITE PERFORMANCE LINE"
};

const defaultStoreSettings: StoreSettings = {
  brandName: "VALENS",
  logoText: "VALENS",
  contactEmail: "elite@valens.com",
  contactPhone: "+1 (800) 825-3677",
  address: "88 Science & Athletics Drive, Sector 4, CA 90210",
  shippingCost: 10,
  taxRate: 5,
  socialInstagram: "@valens_nutrition",
  socialTwitter: "@valens_performance",
  socialFacebook: "valens.elite"
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [homePageSettings, setHomePageSettings] = useState<HomePageSettings>(defaultHomePageSettings);
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(defaultStoreSettings);
  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Sync state from LocalStorage on client mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedProducts = localStorage.getItem("valens_products");
      const storedCategories = localStorage.getItem("valens_categories");
      const storedCart = localStorage.getItem("valens_cart");
      const storedOrders = localStorage.getItem("valens_orders");
      const storedCustomers = localStorage.getItem("valens_customers");
      const storedCoupons = localStorage.getItem("valens_coupons");
      const storedExpenses = localStorage.getItem("valens_expenses");
      const storedHomePage = localStorage.getItem("valens_homepage");
      const storedSettings = localStorage.getItem("valens_settings");

      if (storedProducts) setProducts(JSON.parse(storedProducts));
      if (storedCategories) setCategories(JSON.parse(storedCategories));
      if (storedCart) setCart(JSON.parse(storedCart));
      if (storedOrders) setOrders(JSON.parse(storedOrders));
      if (storedCustomers) setCustomers(JSON.parse(storedCustomers));
      if (storedCoupons) setCoupons(JSON.parse(storedCoupons));
      if (storedExpenses) setExpenses(JSON.parse(storedExpenses));
      if (storedHomePage) setHomePageSettings(JSON.parse(storedHomePage));
      if (storedSettings) setStoreSettings(JSON.parse(storedSettings));
    }
  }, []);

  // Save updates to LocalStorage when states change
  const syncToLocalStorage = (key: string, data: any) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(data));
    }
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // Cart operations
  const addToCart = (product: Product, quantity: number, size: string, variant: string) => {
    const newCart = [...cart];
    const existingIndex = newCart.findIndex(
      (item) => item.product.id === product.id && item.selectedSize === size && item.selectedVariant === variant
    );

    if (existingIndex > -1) {
      newCart[existingIndex].quantity += quantity;
    } else {
      newCart.push({ product, quantity, selectedSize: size, selectedVariant: variant });
    }

    setCart(newCart);
    syncToLocalStorage("valens_cart", newCart);
    showToast(`Added ${quantity}x ${product.name} to Cart`, 'success');
  };

  const updateCartQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }
    const newCart = [...cart];
    newCart[index].quantity = quantity;
    setCart(newCart);
    syncToLocalStorage("valens_cart", newCart);
  };

  const removeFromCart = (index: number) => {
    const removedName = cart[index].product.name;
    const newCart = cart.filter((_, idx) => idx !== index);
    setCart(newCart);
    syncToLocalStorage("valens_cart", newCart);
    showToast(`Removed ${removedName} from Cart`, 'info');
  };

  const clearCart = () => {
    setCart([]);
    syncToLocalStorage("valens_cart", []);
  };

  const applyCoupon = (code: string) => {
    const formattedCode = code.trim().toUpperCase();
    const coupon = coupons.find((c) => c.code === formattedCode && c.active);

    if (!coupon) {
      showToast("Invalid or inactive coupon code", "error");
      return false;
    }

    // Check expiry
    const expiry = new Date(coupon.expiryDate);
    if (expiry < new Date()) {
      showToast("This coupon has expired", "error");
      return false;
    }

    // Check usage limit
    if (coupon.usageCount >= coupon.usageLimit) {
      showToast("Coupon usage limit reached", "error");
      return false;
    }

    setActiveCoupon(coupon);
    showToast(`Coupon ${formattedCode} applied successfully!`, "success");
    return true;
  };

  const removeCoupon = () => {
    setActiveCoupon(null);
    showToast("Coupon removed", "info");
  };

  // Order operations
  const placeOrder = (orderData: Omit<Order, 'id' | 'orderDate' | 'status'>) => {
    const newId = `VL-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      ...orderData,
      id: newId,
      orderDate: new Date().toISOString(),
      status: "New Order"
    };

    const newOrders = [newOrder, ...orders];
    setOrders(newOrders);
    syncToLocalStorage("valens_orders", newOrders);

    // Track/update customer count or add new customer if doesn't exist
    const customerIndex = customers.findIndex(
      (c) => c.email.toLowerCase() === orderData.customerEmail.toLowerCase()
    );

    let updatedCustomers = [...customers];
    if (customerIndex > -1) {
      updatedCustomers[customerIndex].orderCount += 1;
      updatedCustomers[customerIndex].totalSpent += orderData.totalPrice;
    } else {
      updatedCustomers.push({
        id: `cust-${Date.now()}`,
        name: orderData.customerName,
        email: orderData.customerEmail,
        phone: orderData.customerPhone,
        address: orderData.customerAddress,
        city: orderData.customerCity,
        orderCount: 1,
        totalSpent: orderData.totalPrice,
        joinDate: new Date().toISOString().split('T')[0]
      });
    }
    setCustomers(updatedCustomers);
    syncToLocalStorage("valens_customers", updatedCustomers);

    // Subtract stock quantities
    const updatedProducts = products.map((prod) => {
      const orderItem = orderData.items.find(item => item.productId === prod.id);
      if (orderItem) {
        const remainingStock = Math.max(0, prod.stock - orderItem.quantity);
        return {
          ...prod,
          stock: remainingStock,
          stockStatus: remainingStock === 0 ? "Out of Stock" : remainingStock <= 10 ? "Low Stock" : "In Stock" as any
        };
      }
      return prod;
    });
    setProducts(updatedProducts);
    syncToLocalStorage("valens_products", updatedProducts);

    // Increment coupon usage count if active
    if (activeCoupon) {
      const updatedCoupons = coupons.map((c) => {
        if (c.id === activeCoupon.id) {
          return { ...c, usageCount: c.usageCount + 1 };
        }
        return c;
      });
      setCoupons(updatedCoupons);
      syncToLocalStorage("valens_coupons", updatedCoupons);
      setActiveCoupon(null);
    }

    clearCart();
    showToast(`Order ${newId} placed successfully!`, "success");
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    const newOrders = orders.map((ord) => {
      if (ord.id === orderId) {
        return { ...ord, status };
      }
      return ord;
    });
    setOrders(newOrders);
    syncToLocalStorage("valens_orders", newOrders);
    showToast(`Order ${orderId} marked as ${status}`, "info");
  };

  const confirmOrder = (orderId: string) => {
    updateOrderStatus(orderId, "Confirmed");
  };

  const cancelOrder = (orderId: string) => {
    updateOrderStatus(orderId, "Cancelled");
  };

  // Product CRUD
  const addProduct = (prodData: Omit<Product, 'id' | 'reviews'>) => {
    const newProduct: Product = {
      ...prodData,
      id: `prod-${Date.now()}`,
      reviews: []
    };
    const newProducts = [...products, newProduct];
    setProducts(newProducts);
    syncToLocalStorage("valens_products", newProducts);
    showToast(`Product "${newProduct.name}" added`, "success");
  };

  const editProduct = (productId: string, updatedFields: Partial<Product>) => {
    const newProducts = products.map((prod) => {
      if (prod.id === productId) {
        const merged = { ...prod, ...updatedFields };
        // compute status
        if (merged.stock === 0) merged.stockStatus = "Out of Stock";
        else if (merged.stock <= 10) merged.stockStatus = "Low Stock";
        else merged.stockStatus = "In Stock";
        return merged;
      }
      return prod;
    });
    setProducts(newProducts);
    syncToLocalStorage("valens_products", newProducts);
    showToast("Product updated successfully", "success");
  };

  const deleteProduct = (productId: string) => {
    const newProducts = products.filter((prod) => prod.id !== productId);
    setProducts(newProducts);
    syncToLocalStorage("valens_products", newProducts);
    showToast("Product deleted", "error");
  };

  // Categories CRUD
  const addCategory = (catData: Omit<Category, 'id' | 'slug'>) => {
    const newCat: Category = {
      ...catData,
      id: `cat-${Date.now()}`,
      slug: catData.name.toLowerCase().replace(/\s+/g, '-')
    };
    const newCats = [...categories, newCat];
    setCategories(newCats);
    syncToLocalStorage("valens_categories", newCats);
    showToast(`Category "${newCat.name}" created`, "success");
  };

  const editCategory = (categoryId: string, updatedFields: Partial<Category>) => {
    const newCats = categories.map((cat) => {
      if (cat.id === categoryId) {
        const merged = { ...cat, ...updatedFields };
        if (updatedFields.name) {
          merged.slug = updatedFields.name.toLowerCase().replace(/\s+/g, '-');
        }
        return merged;
      }
      return cat;
    });
    setCategories(newCats);
    syncToLocalStorage("valens_categories", newCats);
    showToast("Category updated", "success");
  };

  const deleteCategory = (categoryId: string) => {
    const newCats = categories.filter((cat) => cat.id !== categoryId);
    setCategories(newCats);
    syncToLocalStorage("valens_categories", newCats);
    showToast("Category removed", "error");
  };

  // Coupons CRUD
  const addCoupon = (coupData: Omit<Coupon, 'id' | 'usageCount'>) => {
    const newCoup: Coupon = {
      ...coupData,
      id: `coup-${Date.now()}`,
      usageCount: 0
    };
    const newCoups = [...coupons, newCoup];
    setCoupons(newCoups);
    syncToLocalStorage("valens_coupons", newCoups);
    showToast(`Coupon code ${newCoup.code} created`, "success");
  };

  const editCoupon = (couponId: string, updatedFields: Partial<Coupon>) => {
    const newCoups = coupons.map((c) => {
      if (c.id === couponId) {
        return { ...c, ...updatedFields };
      }
      return c;
    });
    setCoupons(newCoups);
    syncToLocalStorage("valens_coupons", newCoups);
    showToast("Coupon updated", "success");
  };

  const deleteCoupon = (couponId: string) => {
    const newCoups = coupons.filter((c) => c.id !== couponId);
    setCoupons(newCoups);
    syncToLocalStorage("valens_coupons", newCoups);
    showToast("Coupon deleted", "error");
  };

  // Expenses CRUD
  const addExpense = (expData: Omit<Expense, 'id'>) => {
    const newExp: Expense = {
      ...expData,
      id: `exp-${Date.now()}`
    };
    const newExps = [newExp, ...expenses];
    setExpenses(newExps);
    syncToLocalStorage("valens_expenses", newExps);
    showToast(`Expense for "${newExp.title}" added`, "success");
  };

  const editExpense = (expenseId: string, updatedFields: Partial<Expense>) => {
    const newExps = expenses.map((e) => {
      if (e.id === expenseId) {
        return { ...e, ...updatedFields };
      }
      return e;
    });
    setExpenses(newExps);
    syncToLocalStorage("valens_expenses", newExps);
    showToast("Expense item updated", "success");
  };

  const deleteExpense = (expenseId: string) => {
    const newExps = expenses.filter((e) => e.id !== expenseId);
    setExpenses(newExps);
    syncToLocalStorage("valens_expenses", newExps);
    showToast("Expense item deleted", "error");
  };

  // CMS controls
  const updateHomePageSettings = (newSettings: HomePageSettings) => {
    setHomePageSettings(newSettings);
    syncToLocalStorage("valens_homepage", newSettings);
    showToast("Homepage layout updated", "success");
  };

  const updateStoreSettings = (newSettings: StoreSettings) => {
    setStoreSettings(newSettings);
    syncToLocalStorage("valens_settings", newSettings);
    showToast("Global store settings updated", "success");
  };

  return (
    <AppContext.Provider
      value={{
        products,
        categories,
        cart,
        orders,
        customers,
        coupons,
        expenses,
        homePageSettings,
        storeSettings,
        activeCoupon,
        toast,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        placeOrder,
        updateOrderStatus,
        confirmOrder,
        cancelOrder,
        addProduct,
        editProduct,
        deleteProduct,
        addCategory,
        editCategory,
        deleteCategory,
        addCoupon,
        editCoupon,
        deleteCoupon,
        addExpense,
        editExpense,
        deleteExpense,
        updateHomePageSettings,
        updateStoreSettings,
        showToast
      }}
    >
      {children}
      
      {/* Toast Notification HUD */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[9999] flex items-center gap-3 rounded-lg border border-border-color bg-surface-deep px-5 py-4 text-sm font-semibold tracking-wide text-white shadow-2xl transition-all duration-300 animate-slide-in glow-coral-sm">
          <div
            className={`h-2.5 w-2.5 rounded-full ${
              toast.type === "success"
                ? "bg-success-green shadow-[0_0_8px_#10D981]"
                : toast.type === "error"
                ? "bg-accent-orange shadow-[0_0_8px_#FF5226]"
                : "bg-primary-coral shadow-[0_0_8px_#FF8A75]"
            }`}
          />
          {toast.message}
        </div>
      )}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppContextProvider");
  }
  return context;
};
