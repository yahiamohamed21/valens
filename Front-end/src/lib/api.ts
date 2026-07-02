import type { Product, Category, Coupon, Customer, Expense, Order, Review, HomePageSettings, StoreSettings, OrderReturn, HomeBanner, HomeStory, HomeCuratedProduct } from "@/types/store";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://valens-api.runasp.net";

// Resolve a possibly‑relative image URL to an absolute URL for Next.js Image component
export const resolveImageUrl = (url: string): string => {
  if (!url) return "";
  // Rewrite /uploads/, /home/, or /products/ URLs on any host to the current BASE_URL
  const uploadMatch = url.match(/^https?:\/\/[^\/]+(\/(uploads|home|products)\/.*)$/i);
  if (uploadMatch) {
    const path = uploadMatch[1];
    return `${BASE_URL.replace(/\/+$/, '')}${path}`;
  }
  // Return if already absolute
  if (/^https?:\/\//i.test(url)) return url;
  // Ensure leading slash
  const path = url.startsWith('/') ? url : `/${url}`;
  // Remove trailing slash from BASE_URL then concatenate
  return `${BASE_URL.replace(/\/+$/, '')}${path}`;
};
 
/**
 * Interface for JWT Payload
 */
interface JwtPayload {
  exp: number;
  iat: number;
  [key: string]: unknown;
}

/**
 * Interface for API Error responses
 */
interface ApiErrorResponse {
  errors?: Record<string, string[]> | string | unknown;
  message?: string;
}

/**
 * Generic Interface for API Response wrappers (if applicable)
 */
/**
 * Decodes a JWT token and returns the payload.
 */
export function decodeJwt(token: string): JwtPayload | null {
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
    return JSON.parse(jsonPayload) as JwtPayload;
  } catch (e) {
    console.error("Failed to decode JWT token:", e);
    return null;
  }
}

/**
 * Converts an object to FormData for multipart/form-data requests.
 */
export const objectToFormData = (obj: Record<string, unknown>): FormData => {
  const formData = new FormData();
  if (!obj) return formData;
  
  const appendForm = (key: string, value: unknown) => {
    if (value === null || value === undefined) return;
    
    if (typeof File !== "undefined" && value instanceof File) {
      formData.append(key, value);
    } else if (typeof Blob !== "undefined" && value instanceof Blob) {
      formData.append(key, value);
    } else if (Array.isArray(value)) {
      if (value.length === 0) return;
      value.forEach((item, index) => {
        if (item === null || item === undefined) return;
        if (typeof item === "object" && !(item instanceof File) && !(item instanceof Blob)) {
          const itemObj = item as Record<string, unknown>;
          Object.keys(itemObj).forEach((subKey) => {
            const val = itemObj[subKey];
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
      const valObj = value as Record<string, unknown>;
      Object.keys(valObj).forEach((subKey) => {
        appendForm(`${key}.${subKey}`, valObj[subKey]);
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

/**
 * Refreshes the JWT token pair on the backend.
 */
async function performTokenRefresh(accessToken: string, refreshToken: string): Promise<{ token: string; refreshToken: string } | null> {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ accessToken, refreshToken }),
    });
    if (response.ok) {
      const data = await response.json();
      return {
        token: data.token,
        refreshToken: data.refreshToken,
      };
    }
  } catch (err) {
    console.error("Failed to refresh token:", err);
  }
  return null;
}

/**
 * Base request function with generics and strict typing.
 */
async function request<T>(
  path: string,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" = "GET",
  body?: unknown,
  requireAuth = true
): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const headers: HeadersInit = {};

  if (!(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (requireAuth && typeof window !== "undefined") {
    let token = localStorage.getItem("valens_jwt_token");
    if (token) {
      const claims = decodeJwt(token);
      const isExpired = claims && claims.exp * 1000 < Date.now();
      if (isExpired && path !== "/api/auth/refresh-token" && path !== "/api/auth/revoke-token") {
        const refreshToken = localStorage.getItem("valens_refresh_token");
        if (refreshToken) {
          const newTokens = await performTokenRefresh(token, refreshToken);
          if (newTokens) {
            localStorage.setItem("valens_jwt_token", newTokens.token);
            localStorage.setItem("valens_refresh_token", newTokens.refreshToken);
            token = newTokens.token;
          } else {
            localStorage.removeItem("valens_jwt_token");
            localStorage.removeItem("valens_refresh_token");
            token = null;
          }
        }
      }
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }
  }

  const options: RequestInit = {
    method,
    headers,
  };

  if (body !== undefined) {
    options.body = body instanceof FormData ? body : JSON.stringify(body);
  }

  try {
    let response = await fetch(url, options);

    if (response.status === 401 && requireAuth && typeof window !== "undefined" && path !== "/api/auth/refresh-token" && path !== "/api/auth/revoke-token") {
      const token = localStorage.getItem("valens_jwt_token");
      const refreshToken = localStorage.getItem("valens_refresh_token");
      if (token && refreshToken) {
        const newTokens = await performTokenRefresh(token, refreshToken);
        if (newTokens) {
          localStorage.setItem("valens_jwt_token", newTokens.token);
          localStorage.setItem("valens_refresh_token", newTokens.refreshToken);
          headers["Authorization"] = `Bearer ${newTokens.token}`;
          options.headers = headers;
          response = await fetch(url, options);
        }
      }
    }

    if (!response.ok) {
      // Construct a more informative error message
      let errorMessage = `API Request failed with status ${response.status}`;
      // Attempt to extract error details from response body
      try {
        const responseText = await response.text();
        console.warn(`[API ERROR] ${method} ${path} → ${response.status}`, responseText);
        if (responseText) {
          try {
            const errorData = JSON.parse(responseText) as ApiErrorResponse;
            if (errorData.errors) {
              if (typeof errorData.errors === "object") {
                errorMessage = Object.values(errorData.errors as Record<string, string[]>).flat().join(", ");
              } else {
                errorMessage = String(errorData.errors);
              }
            } else if (errorData.message) {
              errorMessage = errorData.message;
            } else {
              // Fallback to raw response text if JSON parsing fails or no specific fields
              errorMessage = responseText;
            }
          } catch {
            // If response is not JSON, use raw text
            errorMessage = responseText;
          }
        }
      } catch {
        // If reading response text fails, retain the generic status message
        // No additional action needed
      }
      throw new Error(errorMessage);

    }

    if (response.status === 204) {
      return {} as T;
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("Failed to fetch")) {
        throw new Error("Unable to connect to the server. Please check if the backend is running.");
      }
      throw error;
    }
    throw new Error("An unknown error occurred during the API request.");
  }
}

/**
 * Safely resolves arrays from .NET ReferenceHandler.Preserve wrapped objects.
 */
export const safeArray = <T>(val: unknown): T[] => {
  if (!val) return [];
  if (Array.isArray(val)) return val as T[];
  if (typeof val === "object" && val !== null) {
    const obj = val as Record<string, unknown>;
    if (obj.items) {
      if (Array.isArray(obj.items)) return obj.items as T[];
      if (typeof obj.items === "object" && obj.items !== null) {
        const itemsObj = obj.items as Record<string, unknown>;
        if (Array.isArray(itemsObj.$values)) return itemsObj.$values as T[];
      }
    }
    if (Array.isArray(obj.$values)) {
      return obj.$values as T[];
    }
  }
  return [];
};

const productImageTypes = ["powder", "capsule", "liquid"] as const;
const productVariantTypes = ["none", "size", "flavor", "both"] as const;
const orderStatuses = [
  "New Order",
  "Confirmed",
  "Preparing",
  "Shipped / Out for Delivery",
  "Delivered",
  "Cancelled",
  "Rejected",
  "Returned",
] as const;
const expenseCategories = [
  "Advertising",
  "Salaries",
  "Shipping",
  "Rent",
  "Other",
] as const;

const isProductImageType = (value: unknown): value is Product["imageType"] =>
  typeof value === "string" && productImageTypes.includes(value as Product["imageType"]);

const isProductVariantType = (value: unknown): value is Product["variantType"] =>
  typeof value === "string" && productVariantTypes.includes(value as Product["variantType"]);

const isOrderStatus = (value: unknown): value is Order["status"] =>
  typeof value === "string" && orderStatuses.includes(value as Order["status"]);

const isExpenseCategory = (value: unknown): value is Expense["category"] =>
  typeof value === "string" && expenseCategories.includes(value as Expense["category"]);

const toStringValue = (value: unknown, fallback = ""): string =>
  value === undefined || value === null ? fallback : String(value);

const toNumberValue = (value: unknown, fallback = 0): number => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const toBooleanValue = (value: unknown, fallback = false): boolean =>
  value === undefined || value === null ? fallback : Boolean(value);

const mapApiReviewToClient = (review: Record<string, unknown>): Review => ({
  id: toStringValue(review.id),
  author: toStringValue(review.author),
  rating: toNumberValue(review.rating),
  comment: toStringValue(review.comment),
  date: toStringValue(review.date, new Date().toISOString()),
});

/**
 * API service definition
 */
export const api = {
  auth: {
    login: (body: Record<string, unknown>) => request<{ token: string; refreshToken?: string; role?: string; email?: string; fullName?: string }>("/api/auth/login-user", "POST", body, false),
    registerCustomer: (body: Record<string, unknown>) =>
      request<{ token?: string; refreshToken?: string }>("/api/auth/register-customer", "POST", body, false),
    registerNewAdmin: (body: Record<string, unknown>) =>
      request<{ token: string; refreshToken?: string }>("/api/auth/register-new-admin", "POST", body),
    forgotPassword: (body: { email: string }) =>
      request<unknown>("/api/auth/forgot-password", "POST", body, false),
    resetPasswordOtp: (body: Record<string, unknown>) =>
      request<unknown>("/api/auth/reset-password-otp", "POST", body, false),
    changeCustomerPassword: (body: Record<string, unknown>) =>
      request<void>("/api/auth/change-customer-password", "POST", body),
    changeAdminPassword: (body: Record<string, unknown>) =>
      request<void>("/api/auth/change-admin-password", "POST", body),
    refreshToken: (body: Record<string, unknown>) =>
      request<{ token: string }>("/api/auth/refresh-token", "POST", body),
    revokeToken: (body: Record<string, unknown>) =>
      request<void>("/api/auth/revoke-token", "POST", body),
  },

  categories: {
    listActive: () =>
      request<unknown[]>("/api/categories/list-active-product-categories", "GET", undefined, false),
    listAdmin: () =>
      request<unknown[]>("/api/categories/list-admin-product-categories", "GET"),
    create: (body: Record<string, unknown>) =>
      request<{ id?: string; name?: string; slug?: string; imageColor?: string; visible?: boolean }>("/api/categories/create-product-category", "POST", body),
    update: (body: Record<string, unknown>) =>
      request<void>("/api/categories/update-product-category", "POST", body),
    delete: (id: string) =>
      request<void>("/api/categories/delete-product-category", "POST", { id }),
    toggle: (id: string) =>
      request<void>("/api/categories/toggle-product-category", "POST", { id }),
  },

  coupons: {
    validate: (body: Record<string, unknown>) =>
      request<{ code: string; discountType: string; discountValue: number | string; minOrderAmount: number | string }>("/api/coupons/validate-coupon", "POST", body),
    listAdmin: () => request<unknown[]>("/api/coupons/list-admin", "GET"),
    create: (body: Record<string, unknown>) =>
      request<{ id?: string; usageCount?: number }>("/api/coupons/create-coupon", "POST", body),
    update: (body: Record<string, unknown>) =>
      request<void>("/api/coupons/update-coupon", "POST", body),
    delete: (id: string) =>
      request<void>("/api/coupons/delete-coupon", "POST", { id }),
    toggle: (id: string) =>
      request<void>("/api/coupons/toggle-coupon", "POST", { id }),
  },

  customers: {
    listAdmin: (body: Record<string, unknown> = {}) =>
      request<unknown>("/api/customers/list-admin-customers", "POST", body),
    detailAdmin: (id: string) =>
      request<unknown>("/api/customers/detail-admin-customer", "POST", { id }),
    updateProfile: (body: Record<string, unknown>) =>
      request<void>("/api/customers/update-profile", "PUT", body),
  },

  expenses: {
    listAdmin: (body: Record<string, unknown> = {}) =>
      request<unknown>("/api/expenses/list-admin-expenses", "POST", body),
    create: (body: Record<string, unknown>) =>
      request<{ id?: string }>("/api/expenses/create-expense", "POST", body),
    update: (body: Record<string, unknown>) =>
      request<void>("/api/expenses/update-expense", "POST", body),
    delete: (id: string) =>
      request<void>("/api/expenses/delete-expense", "POST", { id }),
  },

  returns: {
    create: (body: Record<string, unknown>) =>
      request<unknown>("/api/returns/create", "POST", body),
    list: () =>
      request<unknown[]>("/api/returns/list", "GET"),
  },

  orders: {
    checkout: (body: Record<string, unknown>) =>
      request<Record<string, unknown>>("/api/orders/checkout-order", "POST", body),
    myHistory: (pageNumber = 1, pageSize = 100) =>
      request<unknown>(`/api/orders/my-history?pageNumber=${pageNumber}&pageSize=${pageSize}`, "GET"),
    listAdmin: (body: Record<string, unknown> = {}) =>
      request<unknown>("/api/orders/list-admin-orders", "POST", body),
    updateStatus: (body: Record<string, unknown>) =>
      request<void>("/api/orders/update-order-status", "POST", body),
    updateDetails: (body: Record<string, unknown>) =>
      request<void>("/api/orders/update-order-details", "POST", body),
    previewCheckout: (body: Record<string, unknown>) =>
      request<unknown>("/api/orders/preview-checkout", "POST", body),
    updateStatusByNumber: (body: Record<string, unknown>) =>
      request<void>("/api/orders/update-order-status-by-number", "POST", body),
  },

  products: {
    list: (body: Record<string, unknown> = {}) =>
      request<unknown>("/api/products/list-products", "POST", body, false),
    listHomepageSections: () =>
      request<unknown>("/api/products/list-homepage-sections", "POST", undefined, false),
    detail: (id: string) =>
      request<unknown>("/api/products/detail-product", "POST", { id }, false),
    create: (body: Record<string, unknown>) =>
      request<unknown>("/api/products/create-product", "POST", body),
    update: (body: Record<string, unknown>) =>
      request<unknown>("/api/products/update-product", "POST", body),
    delete: (id: string) =>
      request<void>("/api/products/delete-product", "POST", { id }),
    toggle: (id: string) =>
      request<void>("/api/products/toggle-product", "POST", { id }),
    searchAdmin: (query: string, limit = 20) =>
      request<unknown>(`/api/admin/products/search?query=${encodeURIComponent(query)}&limit=${limit}`, "GET"),
  },

  reports: {
    dashboardSummary: () =>
      request<unknown>("/api/reports/dashboard-summary", "GET"),
  },

  settings: {
    storeConfig: () => request<StoreSettings>("/api/settings/store-config", "GET", undefined, false),
    homepageConfig: () => request<HomePageSettings>("/api/settings/homepage-config", "GET", undefined, false),
    updateStoreConfig: (body: StoreSettings | Record<string, unknown>) =>
      request<void>("/api/settings/update-store-config", "PUT", body),
    updateHomepageConfig: (body: HomePageSettings | Record<string, unknown> | FormData) =>
      request<void>("/api/settings/update-homepage-config", "PUT", body instanceof FormData ? body : objectToFormData(body as Record<string, unknown>)),
    homepageOverview: () =>
      request<Record<string, unknown>>("/api/settings/homepage-overview", "POST", {}, false),
    governorates: () => request<{ id: string; governorateName: string }[]>("/api/settings/governorates", "GET", undefined, false),
    updateGovernorateShipping: (body: Record<string, unknown>) =>
      request<void>("/api/settings/update-governorate-shipping", "PUT", body),
    createGovernorateShipping: (body: Record<string, unknown>) =>
      request<unknown>("/api/settings/create-governorate-shipping", "POST", body),
    createAdminAccount: (body: Record<string, unknown>) =>
      request<unknown>("/api/settings/create-admin-account", "POST", body),
  },

  homeControl: {
    getOverview: () => request<unknown>("/api/home", "GET", undefined, false),
    banners: {
      list: () => request<unknown>("/api/admin/home-control/hero-banners", "GET"),
      create: (body: Record<string, unknown>) => request<unknown>("/api/admin/home-control/hero-banners", "POST", body),
      update: (id: string, body: Record<string, unknown>) => request<unknown>(`/api/admin/home-control/hero-banners/${id}`, "PATCH", body),
      delete: (id: string) => request<unknown>(`/api/admin/home-control/hero-banners/${id}`, "DELETE"),
      toggle: (id: string, isActive: boolean) => request<unknown>(`/api/admin/home-control/hero-banners/${id}/toggle`, "PATCH", { isActive }),
      reorder: (items: { id: string; displayOrder: number }[]) => request<unknown>("/api/admin/home-control/hero-banners/reorder", "PATCH", { items }),
    },
    sections: {
      listProducts: (sectionKey: string) => request<unknown>(`/api/admin/home-control/sections/${sectionKey}/products`, "GET"),
      addProduct: (sectionKey: string, body: Record<string, unknown>) => request<unknown>(`/api/admin/home-control/sections/${sectionKey}/products`, "POST", body),
      updateProduct: (id: string, body: Record<string, unknown>) => request<unknown>(`/api/admin/home-control/section-products/${id}`, "PATCH", body),
      deleteProduct: (id: string) => request<unknown>(`/api/admin/home-control/section-products/${id}`, "DELETE"),
      toggleProduct: (id: string, isActive: boolean) => request<unknown>(`/api/admin/home-control/section-products/${id}/toggle`, "PATCH", { isActive }),
      reorder: (sectionKey: string, items: { id: string; displayOrder: number }[]) => request<unknown>(`/api/admin/home-control/sections/${sectionKey}/products/reorder`, "PATCH", { items }),
    },
    stories: {
      list: () => request<unknown>("/api/admin/home-control/stories", "GET"),
      create: (body: Record<string, unknown>) => request<unknown>("/api/admin/home-control/stories", "POST", body),
      update: (id: string, body: Record<string, unknown>) => request<unknown>(`/api/admin/home-control/stories/${id}`, "PATCH", body),
      delete: (id: string) => request<unknown>(`/api/admin/home-control/stories/${id}`, "DELETE"),
      toggle: (id: string, isActive: boolean) => request<unknown>(`/api/admin/home-control/stories/${id}/toggle`, "PATCH", { isActive }),
      reorder: (items: { id: string; displayOrder: number }[]) => request<unknown>("/api/admin/home-control/stories/reorder", "PATCH", { items }),
    }
  },

  reviews: {
    submitReview: (productId: string, body: Record<string, unknown>) =>
      request<unknown>(`/api/reviews/products/${productId}`, "POST", body),
    listAdmin: () => request<unknown>("/api/reviews/admin", "GET"),
    toggleApprove: (id: string) => request<unknown>(`/api/reviews/admin/${id}/toggle-approve`, "PATCH"),
    delete: (id: string) => request<unknown>(`/api/reviews/admin/${id}`, "DELETE"),
  },

  uploads: {
    uploadFile: (formData: FormData) => request<unknown>("/api/admin/uploads", "POST", formData),
  },
};

/**
 * Mappers for API to Client models with strict types
 */
export const mapApiProductToClient = (p: Record<string, unknown>): Product => ({
  id: toStringValue(p.id),
  name: toStringValue(p.name),
  category:
    typeof p.category === "object" && p.category !== null
      ? toStringValue((p.category as Record<string, unknown>).name)
      : toStringValue(p.category ?? (p as Record<string, unknown>).categoryName),
  price: toNumberValue(p.price),
  discountPrice:
    p.discountPrice !== undefined && p.discountPrice !== null
      ? toNumberValue((p as Record<string, unknown>).discountPrice)
      : undefined,
  size: toStringValue(p.size),
  variants: safeArray<Record<string, unknown>>(p.variants).map((v) => ({
    id: toStringValue(v.variantId ?? v.id),
    size: toStringValue(v.size),
    flavor: toStringValue(v.flavor),
    price: toNumberValue(v.price),
    discountPrice:
      v.discountPrice !== undefined && v.discountPrice !== null
        ? toNumberValue(v.discountPrice)
        : undefined,
    stockQuantity: toNumberValue(v.stockQuantity),
    sku: toStringValue(v.sku),
    image: resolveImageUrl(toStringValue(v.image)),
    isAvailable: v.isAvailable !== undefined ? Boolean(v.isAvailable) : true,
  })),
  stock: toNumberValue(p.stock),
  stockStatus: ((): Product["stockStatus"] => {
    const status = toStringValue(p.stockStatus);
    if (status === "In Stock" || status === "Low Stock" || status === "Out of Stock") {
      return status;
    }
    const stock = toNumberValue(p.stock);
    return stock > 10 ? "In Stock" : stock > 0 ? "Low Stock" : "Out of Stock";
  })(),
  sku: toStringValue(p.sku),
  description: toStringValue(p.description),
  ingredients: safeArray<string>(p.ingredients),
  usage: toStringValue(p.usage),
  benefits: safeArray<string>(p.benefits),
  rating: toNumberValue(p.rating, 5),
  reviews: safeArray<Record<string, unknown>>(p.reviews).map(mapApiReviewToClient),
  featured: toBooleanValue(p.featured),
  bestSeller: toBooleanValue(p.bestSeller),
  newArrival: toBooleanValue(p.newArrival),
  visible:
    p.visible !== undefined
      ? Boolean(p.visible)
      : p.isActive !== undefined
      ? Boolean(p.isActive)
      : true,
  imageColor: toStringValue(p.imageColor, "#FF8A75"),
  imageType: isProductImageType(p.imageType) ? p.imageType : "powder",
  images: safeArray<string>(p.images).map(resolveImageUrl),
  mainImage: resolveImageUrl(toStringValue(p.mainImage)),
  variantType: isProductVariantType(p.variantType) ? p.variantType : "none",
  name_ar: toStringValue((p as Record<string, unknown>).nameAr ?? (p as Record<string, unknown>).name_ar),
  description_ar: toStringValue((p as Record<string, unknown>).descriptionAr ?? (p as Record<string, unknown>).description_ar),
  ingredients_ar: safeArray<string>((p as Record<string, unknown>).ingredientsAr ?? (p as Record<string, unknown>).ingredients_ar),
  usage_ar: toStringValue((p as Record<string, unknown>).usageAr ?? (p as Record<string, unknown>).usage_ar),
  benefits_ar: safeArray<string>((p as Record<string, unknown>).benefitsAr ?? (p as Record<string, unknown>).benefits_ar),
});

export const mapApiCategoryToClient = (cat: Record<string, unknown>): Category => ({
  id: toStringValue(cat.id),
  name: toStringValue(cat.name),
  slug: toStringValue(cat.slug) || toStringValue(cat.name).toLowerCase().replace(/\s+/g, "-"),
  imageColor: toStringValue(cat.imageColor, "#FF8A75"),
  visible:
    cat.visible !== undefined
      ? Boolean(cat.visible)
      : cat.isActive !== undefined
      ? Boolean(cat.isActive)
      : true,
});

export const mapApiCouponToClient = (c: Record<string, unknown>): Coupon => ({
  id: toStringValue(c.id),
  code: toStringValue(c.code),
  discountType: String(c.discountType).toLowerCase() === "fixed" ? "fixed" : "percentage",
  discountValue: toNumberValue(c.discountValue),
  expiryDate: toStringValue(c.expiryDate),
  usageLimit: toNumberValue((c as Record<string, unknown>).maxUsage ?? c.usageLimit),
  usageCount: toNumberValue(c.usageCount),
  minOrderAmount: toNumberValue(c.minOrderAmount),
  active:
    c.active !== undefined
      ? Boolean(c.active)
      : c.isActive !== undefined
      ? Boolean(c.isActive)
      : true,
});

export const mapApiCustomerToClient = (c: Record<string, unknown>): Customer => ({
  id: toStringValue(c.id),
  name: toStringValue((c as Record<string, unknown>).fullName ?? c.name),
  email: toStringValue(c.email),
  phone: toStringValue(c.phone),
  address: toStringValue((c as Record<string, unknown>).address ?? (c as Record<string, unknown>).shippingAddress),
  city: toStringValue((c as Record<string, unknown>).city ?? (c as Record<string, unknown>).shippingCity),
  orderCount: toNumberValue((c as Record<string, unknown>).totalOrders ?? (c as Record<string, unknown>).orderCount ?? (c as Record<string, unknown>).ordersCount),
  totalSpent: toNumberValue(c.totalSpent),
  joinDate: toStringValue((c as Record<string, unknown>).joinDate ?? (c as Record<string, unknown>).createdAt, new Date().toISOString().split("T")[0]),
});

export const mapApiExpenseToClient = (e: Record<string, unknown>): Expense => ({
  id: toStringValue(e.id),
  title: toStringValue(e.title),
  category: isExpenseCategory(e.category)
    ? e.category
    : "Other",
  amount: toNumberValue(e.amount),
  date: toStringValue(e.date, new Date().toISOString()),
  paymentMethod: toStringValue(e.paymentMethod, "Bank Transfer"),
  notes: toStringValue(e.notes),
});

export const mapApiOrderToClient = (ord: Record<string, unknown>): Order => ({
  id: toStringValue((ord as Record<string, unknown>).id ?? (ord as Record<string, unknown>).orderName ?? (ord as Record<string, unknown>).orderNumber),
  orderName: toStringValue((ord as Record<string, unknown>).orderName ?? (ord as Record<string, unknown>).orderNumber ?? (ord as Record<string, unknown>).id),
  customerName: toStringValue(ord.customerName),
  customerPhone: toStringValue(ord.customerPhone),
  customerEmail: toStringValue(ord.customerEmail),
  customerAddress: toStringValue((ord as Record<string, unknown>).customerAddress ?? (ord as Record<string, unknown>).shippingAddress),
  customerCity: toStringValue((ord as Record<string, unknown>).customerCity ?? (ord as Record<string, unknown>).shippingCity),
  notes: toStringValue(ord.notes),
  items: safeArray<Record<string, unknown>>(ord.items).map((item) => {
    const productObj =
      typeof item.product === "object" && item.product !== null
        ? (item.product as Record<string, unknown>)
        : undefined;

    return {
      productId: toStringValue(item.productId),
      productName:
        toStringValue(item.productName) || toStringValue(productObj?.name),
      price: toNumberValue(item.price),
      quantity: toNumberValue(item.quantity, 1),
      size: toStringValue(item.size),
      variant: toStringValue(item.variant ?? item.flavor),
      imageColor:
        toStringValue(item.imageColor) ||
        toStringValue(productObj?.imageColor, "#FF8A75"),
      imageType:
        isProductImageType(item.imageType)
          ? item.imageType
          : isProductImageType(productObj?.imageType)
          ? productObj.imageType
          : "powder",
      image: resolveImageUrl(toStringValue(item.image ?? productObj?.mainImage)),
    };
  }),
  totalPrice:
    (ord as Record<string, unknown>).totalPrice !== undefined
      ? toNumberValue((ord as Record<string, unknown>).totalPrice)
      : toNumberValue((ord as Record<string, unknown>).total),
  paymentMethod: toStringValue(ord.paymentMethod, "Cash On Delivery"),
  shippingMethod: toStringValue(ord.shippingMethod, "Standard Shipping"),
  status: ((): Order["status"] => {
    const raw = toStringValue(ord.status);
    // Normalize backend "NEW ORDER" to frontend "New Order", etc.
    const statusMap: Record<string, Order["status"]> = {
      "new order": "New Order",
      "confirmed": "Confirmed",
      "preparing": "Preparing",
      "shipped / out for delivery": "Shipped / Out for Delivery",
      "delivered": "Delivered",
      "cancelled": "Cancelled",
      "rejected": "Rejected",
      "returned": "Returned",
    };
    return statusMap[raw.toLowerCase()] || (isOrderStatus(raw) ? raw : "New Order");
  })(),
  shippingCost: toNumberValue((ord as Record<string, unknown>).shippingCost),
  discountAmount: toNumberValue((ord as Record<string, unknown>).discountAmount),
  couponCode: toStringValue((ord as Record<string, unknown>).couponCode),
  orderDate: toStringValue((ord as Record<string, unknown>).orderDate ?? (ord as Record<string, unknown>).createdAt, new Date().toISOString()),
});

export const mapApiReturnToClient = (ret: Record<string, unknown>): OrderReturn => ({
  id: toStringValue(ret.id),
  orderId: toStringValue(ret.orderId),
  orderNumber: toStringValue(ret.orderNumber),
  returnDate: toStringValue(ret.returnDate, new Date().toISOString()),
  customerName: toStringValue(ret.customerName),
  returnedFormulations: toStringValue(ret.returnedFormulations),
  returnReason: toStringValue(ret.returnReason),
  isRestoredToStock: toBooleanValue(ret.isRestoredToStock ?? ret.isRestoredToStock),
  refundAmount: toNumberValue(ret.refundAmount),
  notes: toStringValue(ret.notes),
  createdAt: toStringValue(ret.createdAt, new Date().toISOString()),
  updatedAt: toStringValue(ret.updatedAt, new Date().toISOString()),
});

export const mapApiBannerToClient = (b: Record<string, unknown>): HomeBanner => ({
  id: toStringValue(b.id),
  title: toStringValue(b.title),
  subtitle: toStringValue(b.subtitle),
  image: resolveImageUrl(toStringValue(b.desktopImage ?? b.image)),
  mobileImage: b.mobileImage ? resolveImageUrl(toStringValue(b.mobileImage)) : undefined,
  ctaText: toStringValue(b.ctaText),
  ctaLink: toStringValue(b.ctaLink),
  isActive: toBooleanValue(b.isActive ?? b.active, true),
  displayOrder: toNumberValue(b.displayOrder),
  altText: b.altText ? toStringValue(b.altText) : undefined,
});

export const mapApiStoryToClient = (s: Record<string, unknown>): HomeStory => ({
  id: toStringValue(s.id),
  title: toStringValue(s.title),
  description: toStringValue(s.description),
  image: resolveImageUrl(toStringValue(s.image)),
  link: s.link ? toStringValue(s.link) : undefined,
  isActive: toBooleanValue(s.isActive ?? s.active, true),
  displayOrder: toNumberValue(s.displayOrder),
  altText: s.altText ? toStringValue(s.altText) : undefined,
});

export const mapApiSectionProductToClient = (sp: Record<string, unknown>): HomeCuratedProduct => ({
  id: toStringValue(sp.id),
  productId: toStringValue(sp.productId),
  isActive: toBooleanValue(sp.isActive ?? sp.active, true),
  displayOrder: toNumberValue(sp.displayOrder),
});
