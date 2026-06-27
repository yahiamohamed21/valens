export interface ProductVariant {
  id: string;
  size?: string;
  flavor?: string;
  price: number;
  discountPrice?: number;
  stockQuantity: number;
  sku: string;
  image?: string;
  isAvailable: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  discountPrice?: number;
  size: string;
  variants: ProductVariant[];
  stock: number;
  stockStatus: "In Stock" | "Low Stock" | "Out of Stock";
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
  imageType: "powder" | "capsule" | "liquid";
  images: string[];
  mainImage: string;
  variantType: "none" | "size" | "flavor" | "both";
  name_ar?: string;
  description_ar?: string;
  ingredients_ar?: string[];
  usage_ar?: string;
  benefits_ar?: string[];
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
  selectedSize?: string;
  selectedVariant?: string;
  selectedVariantPrice: number;
  sku: string;
  image?: string;
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
    imageType: "powder" | "capsule" | "liquid";
  }[];
  totalPrice: number;
  paymentMethod: string;
  shippingMethod: string;
  shippingCost: number;
  discountAmount: number;
  couponCode?: string;
  orderDate: string;
  status:
    | "New Order"
    | "Confirmed"
    | "Preparing"
    | "Shipped / Out for Delivery"
    | "Delivered"
    | "Cancelled"
    | "Rejected"
    | "Returned";
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
  discountType: "percentage" | "fixed";
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
  category:
    | "Product purchasing cost"
    | "Shipping expenses"
    | "Marketing and ads"
    | "Packaging"
    | "Website maintenance"
    | "Staff salaries"
    | "Storage / warehouse"
    | "Delivery company fees"
    | "Miscellaneous expenses";
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
  heroTitle_ar?: string;
  heroSubtitle_ar?: string;
  heroCtaText_ar?: string;
  firstBannerTitle_ar?: string;
  firstBannerSubtitle_ar?: string;
  firstBannerCtaText_ar?: string;
  promoBadge_ar?: string;
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

export interface AppContextType {
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
  currentUserEmail: string | null;
  toast: (msg: string, type?: "success" | "error" | "info") => void;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
  locale: "en" | "ar";
  changeLanguage: (newLocale: "en" | "ar") => void;
  t: (key: string, variables?: Record<string, string | number>) => string;

  loginUser: (email: string, name?: string) => void;
  logoutUser: () => void;
  updateCustomer: (email: string, updatedDetails: Partial<Customer>) => void;

  // Cart operations
  addToCart: (
    product: Product,
    quantity: number,
    size?: string,
    variant?: string,
    price?: number,
    sku?: string,
    image?: string
  ) => void;
  updateCartQuantity: (index: number, quantity: number) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;

  // Order operations
  placeOrder: (orderData: Omit<Order, "id" | "orderDate" | "status">) => Order;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
  confirmOrder: (orderId: string) => void;
  cancelOrder: (orderId: string) => void;

  // Admin CRUD operations
  addProduct: (product: Omit<Product, "id" | "reviews">) => void;
  editProduct: (productId: string, updatedProduct: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;

  addCategory: (category: Omit<Category, "id" | "slug">) => void;
  editCategory: (categoryId: string, updatedCategory: Partial<Category>) => void;
  deleteCategory: (categoryId: string) => void;

  addCoupon: (coupon: Omit<Coupon, "id" | "usageCount">) => void;
  editCoupon: (couponId: string, updatedCoupon: Partial<Coupon>) => void;
  deleteCoupon: (couponId: string) => void;

  addExpense: (expense: Omit<Expense, "id">) => void;
  editExpense: (expenseId: string, updatedExpense: Partial<Expense>) => void;
  deleteExpense: (expenseId: string) => void;

  updateHomePageSettings: (settings: HomePageSettings) => void;
  updateStoreSettings: (settings: StoreSettings) => void;
}
