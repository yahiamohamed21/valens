import type { Product, Category, Coupon, Customer, Expense, Order } from "@/types/store";

const BASE_URL = "http://valens-api.runasp.net";

export function decodeJwt(token: string): any {
  if (typeof window === "undefined") return null;
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Failed to decode JWT token:", e);
    return null;
  }
}

export const objectToFormData = (obj: any): FormData => {
  const formData = new FormData();
  if (!obj) return formData;
  
  const appendForm = (key: string, value: any) => {
    if (value === null || value === undefined) return;
    
    if (typeof File !== "undefined" && value instanceof File) {
      formData.append(key, value);
    } else if (typeof Blob !== "undefined" && value instanceof Blob) {
      formData.append(key, value);
    } else if (Array.isArray(value)) {
      if (value.length === 0) return;
      value.forEach((item, index) => {
        if (item === null || item === undefined) return;
        if (typeof item === "object" && !(typeof File !== "undefined" && item instanceof File) && !(typeof Blob !== "undefined" && item instanceof Blob)) {
          Object.keys(item).forEach((subKey) => {
            const val = item[subKey];
            if (val !== null && val !== undefined) {
              appendForm(`${key}[${index}].${subKey}`, val);
            }
          });
        } else {
          formData.append(key, String(item));
        }
      });
    } else if (typeof value === "boolean") {
      formData.append(key, value ? "true" : "false");
    } else if (typeof value === "number") {
      formData.append(key, String(value));
    } else if (typeof value === "object" && !(value instanceof Date)) {
      Object.keys(value).forEach((subKey) => {
        appendForm(`${key}.${subKey}`, value[subKey]);
      });
    } else {
      formData.append(key, String(value));
    }
  };

  Object.keys(obj).forEach((key) => {
    appendForm(key, obj[key]);
  });

  return formData;
};

async function request<T>(
  path: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: any
): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const headers: HeadersInit = {};

  if (!(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("valens_jwt_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const options: RequestInit = {
    method,
    headers,
  };

  if (body !== undefined) {
    options.body = body instanceof FormData ? body : JSON.stringify(body);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    let errorMessage = `API Request failed with status ${response.status}`;
    try {
      const responseText = await response.text();
      if (responseText) {
        try {
          const errorData = JSON.parse(responseText);
          if (errorData.errors) {
            errorMessage = typeof errorData.errors === "object"
              ? Object.values(errorData.errors).flat().join(", ")
              : JSON.stringify(errorData.errors);
          } else {
            errorMessage = errorData.message || responseText;
          }
        } catch {
          errorMessage = responseText;
        }
      }
    } catch {}
    throw new Error(errorMessage);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}

export const api = {
  auth: {
    login: (body: any) => request<any>("/api/auth/login-user", "POST", body),
    registerCustomer: (body: any) =>
      request<any>("/api/auth/register-customer", "POST", body),
    forgotPassword: (body: { email: string }) =>
      request<any>("/api/auth/forgot-password", "POST", body),
    resetPasswordOtp: (body: any) =>
      request<any>("/api/auth/reset-password-otp", "POST", body),
    changeCustomerPassword: (body: any) =>
      request<any>("/api/auth/change-customer-password", "POST", body),
    changeAdminPassword: (body: any) =>
      request<any>("/api/auth/change-admin-password", "POST", body),
    refreshToken: (body: any) =>
      request<any>("/api/auth/refresh-token", "POST", body),
    revokeToken: (body: any) =>
      request<any>("/api/auth/revoke-token", "POST", body),
  },

  categories: {
    listActive: () =>
      request<any[]>("/api/categories/list-active-product-categories", "GET"),
    listAdmin: () =>
      request<any[]>("/api/categories/list-admin-product-categories", "GET"),
    create: (body: any) =>
      request<any>("/api/categories/create-product-category", "POST", body),
    update: (body: any) =>
      request<void>("/api/categories/update-product-category", "POST", body),
    delete: (id: string) =>
      request<void>("/api/categories/delete-product-category", "POST", { id }),
    toggle: (id: string) =>
      request<void>("/api/categories/toggle-product-category", "POST", { id }),
  },

  coupons: {
    validate: (body: any) =>
      request<any>("/api/coupons/validate-coupon", "POST", body),
    listAdmin: () => request<any[]>("/api/coupons/list-admin", "GET"),
    create: (body: any) =>
      request<any>("/api/coupons/create-coupon", "POST", body),
    update: (body: any) =>
      request<void>("/api/coupons/update-coupon", "POST", body),
    delete: (id: string) =>
      request<void>("/api/coupons/delete-coupon", "POST", { id }),
    toggle: (id: string) =>
      request<void>("/api/coupons/toggle-coupon", "POST", { id }),
  },

  customers: {
    listAdmin: (body: any = {}) =>
      request<any>("/api/customers/list-admin-customers", "POST", body),
    detailAdmin: (id: string) =>
      request<any>("/api/customers/detail-admin-customer", "POST", { id }),
    updateProfile: (body: any) =>
      request<void>("/api/customers/update-profile", "PUT", body),
  },

  expenses: {
    listAdmin: (body: any = {}) =>
      request<any>("/api/expenses/list-admin-expenses", "POST", body),
    create: (body: any) =>
      request<any>("/api/expenses/create-expense", "POST", body),
    update: (body: any) =>
      request<void>("/api/expenses/update-expense", "POST", body),
    delete: (id: string) =>
      request<void>("/api/expenses/delete-expense", "POST", { id }),
  },

  orders: {
    checkout: (body: any) =>
      request<any>("/api/orders/checkout-order", "POST", body),
    myHistory: (pageNumber = 1, pageSize = 100) =>
      request<any>(`/api/orders/my-history?pageNumber=${pageNumber}&pageSize=${pageSize}`, "GET"),
    listAdmin: (body: any = {}) =>
      request<any>("/api/orders/list-admin-orders", "POST", body),
    updateStatus: (body: any) =>
      request<void>("/api/orders/update-order-status", "POST", body),
    updateDetails: (body: any) =>
      request<void>("/api/orders/update-order-details", "POST", body),
    previewCheckout: (body: any) =>
      request<any>("/api/orders/preview-checkout", "POST", body),
    updateStatusByNumber: (body: any) =>
      request<void>("/api/orders/update-order-status-by-number", "POST", body),
  },

  products: {
    list: (body: any = {}) =>
      request<any>("/api/products/list-products", "POST", body),
    listHomepageSections: () =>
      request<any>("/api/products/list-homepage-sections", "POST"),
    detail: (id: string) =>
      request<any>("/api/products/detail-product", "POST", { id }),
    create: (body: any) =>
      request<any>("/api/products/create-product", "POST", body),
    update: (body: any) =>
      request<void>("/api/products/update-product", "POST", body),
    delete: (id: string) =>
      request<void>("/api/products/delete-product", "POST", { id }),
    toggle: (id: string) =>
      request<void>("/api/products/toggle-product", "POST", { id }),
  },

  reports: {
    dashboardSummary: () =>
      request<any>("/api/reports/dashboard-summary", "GET"),
  },

  settings: {
    storeConfig: () => request<any>("/api/settings/store-config", "GET"),
    homepageConfig: () => request<any>("/api/settings/homepage-config", "GET"),
    updateStoreConfig: (body: any) =>
      request<void>("/api/settings/update-store-config", "PUT", body),
    updateHomepageConfig: (body: any) =>
      request<void>("/api/settings/update-homepage-config", "PUT", body instanceof FormData ? body : objectToFormData(body)),
    homepageOverview: () =>
      request<any>("/api/settings/homepage-overview", "POST", {}),
    governorates: () => request<any[]>("/api/settings/governorates", "GET"),
    updateGovernorateShipping: (body: any) =>
      request<void>("/api/settings/update-governorate-shipping", "PUT", body),
    createGovernorateShipping: (body: any) =>
      request<any>("/api/settings/create-governorate-shipping", "POST", body),
    createAdminAccount: (body: any) =>
      request<any>("/api/settings/create-admin-account", "POST", body),
  },
};

// Helper to safely resolve standard arrays or .NET ReferenceHandler.Preserve wrapped arrays
export const safeArray = (val: any): any[] => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === "object") {
    if (val.items) {
      if (Array.isArray(val.items)) return val.items;
      if (typeof val.items === "object" && Array.isArray((val.items as any).$values)) {
        return (val.items as any).$values;
      }
    }
    if (Array.isArray((val as any).$values)) {
      return (val as any).$values;
    }
  }
  return [];
};

export const mapApiProductToClient = (p: any): Product => ({
  id: p.id || "",
  name: p.name || "",
  category: typeof p.category === "object" && p.category !== null ? (p.category.name || "") : (p.category || p.categoryName || ""),
  price: Number(p.price) || 0,
  discountPrice: p.discountPrice !== undefined && p.discountPrice !== null ? Number(p.discountPrice) : undefined,
  size: p.size || "",
  variants: safeArray(p.variants).map((v: any) => ({
    id: v.id || "",
    size: v.size || "",
    flavor: v.flavor || "",
    price: Number(v.price) || 0,
    discountPrice: v.discountPrice !== undefined && v.discountPrice !== null ? Number(v.discountPrice) : undefined,
    stockQuantity: Number(v.stockQuantity) || 0,
    sku: v.sku || "",
    image: v.image || "",
    isAvailable: v.isAvailable !== undefined ? v.isAvailable : true,
  })),
  stock: Number(p.stock) || 0,
  stockStatus: p.stockStatus || (Number(p.stock) > 10 ? "In Stock" : (Number(p.stock) > 0 ? "Low Stock" : "Out of Stock")),
  sku: p.sku || "",
  description: p.description || "",
  ingredients: safeArray(p.ingredients),
  usage: p.usage || "",
  benefits: safeArray(p.benefits),
  rating: p.rating || 5,
  reviews: safeArray(p.reviews),
  featured: p.featured || false,
  bestSeller: p.bestSeller || false,
  newArrival: p.newArrival || false,
  visible: p.visible !== undefined ? p.visible : (p.isActive !== undefined ? p.isActive : true),
  imageColor: p.imageColor || "#FF8A75",
  imageType: p.imageType || "powder",
  images: safeArray(p.images),
  mainImage: p.mainImage || "",
  variantType: p.variantType || "none",
  name_ar: p.nameAr || p.name_ar || "",
  description_ar: p.descriptionAr || p.description_ar || "",
  ingredients_ar: safeArray(p.ingredientsAr || p.ingredients_ar),
  usage_ar: p.usageAr || p.usage_ar || "",
  benefits_ar: safeArray(p.benefitsAr || p.benefits_ar),
});

export const mapApiCategoryToClient = (cat: any): Category => ({
  id: cat.id || "",
  name: cat.name || "",
  slug: cat.slug || cat.name?.toLowerCase().replace(/\s+/g, "-") || "",
  imageColor: cat.imageColor || "#FF8A75",
  visible: cat.visible !== undefined ? cat.visible : (cat.isActive !== undefined ? cat.isActive : true),
});

export const mapApiCouponToClient = (c: any): Coupon => ({
  id: c.id || "",
  code: c.code || "",
  discountType: c.discountType || "percentage",
  discountValue: Number(c.discountValue) || 0,
  expiryDate: c.expiryDate || "",
  usageLimit: Number(c.usageLimit) || 0,
  usageCount: Number(c.usageCount) || 0,
  minOrderAmount: Number(c.minOrderAmount) || 0,
  active: c.active !== undefined ? c.active : (c.isActive !== undefined ? c.isActive : true),
});

export const mapApiCustomerToClient = (c: any): Customer => ({
  id: c.id || "",
  name: c.fullName || c.name || "",
  email: c.email || "",
  phone: c.phone || "",
  address: c.address || c.shippingAddress || "",
  city: c.city || c.shippingCity || "",
  orderCount: Number(c.orderCount !== undefined ? c.orderCount : c.ordersCount) || 0,
  totalSpent: Number(c.totalSpent) || 0,
  joinDate: c.joinDate || c.createdAt || new Date().toISOString().split("T")[0],
});

export const mapApiExpenseToClient = (e: any): Expense => ({
  id: e.id || "",
  title: e.title || "",
  category: e.category || "Miscellaneous expenses",
  amount: Number(e.amount) || 0,
  date: e.date || new Date().toISOString(),
  paymentMethod: e.paymentMethod || "Bank Transfer",
  notes: e.notes || "",
});

export const mapApiOrderToClient = (ord: any): Order => ({
  id: ord.id || ord.orderName || ord.orderNumber || "",
  orderName: ord.orderName || ord.orderNumber || ord.id || "",
  customerName: ord.customerName || "",
  customerPhone: ord.customerPhone || "",
  customerEmail: ord.customerEmail || "",
  customerAddress: ord.customerAddress || ord.shippingAddress || "",
  customerCity: ord.customerCity || ord.shippingCity || "",
  notes: ord.notes || "",
  items: safeArray(ord.items).map((item: any) => ({
    productId: item.productId || "",
    productName: item.productName || item.product?.name || "",
    price: Number(item.price) || 0,
    quantity: Number(item.quantity) || 1,
    size: item.size || "",
    variant: item.variant || item.flavor || "",
    imageColor: item.imageColor || item.product?.imageColor || "#FF8A75",
    imageType: item.imageType || item.product?.imageType || "powder",
    image: item.image || item.product?.mainImage || "",
  })),
  totalPrice: ord.totalPrice !== undefined ? Number(ord.totalPrice) : (ord.total !== undefined ? Number(ord.total) : 0),
  paymentMethod: ord.paymentMethod || "Cash On Delivery",
  shippingMethod: ord.shippingMethod || "Standard Shipping",
  shippingCost: Number(ord.shippingCost) || 0,
  discountAmount: Number(ord.discountAmount) || 0,
  couponCode: ord.couponCode || "",
  orderDate: ord.orderDate || ord.createdAt || new Date().toISOString(),
  status: ord.status || "New Order",
});
