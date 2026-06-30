"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useCartActions } from "@/context/actions/cart-actions";
import { useCategoryActions } from "@/context/actions/category-actions";
import { useCouponActions } from "@/context/actions/coupon-actions";
import { useExpenseActions } from "@/context/actions/expense-actions";
import { useOrderActions } from "@/context/actions/order-actions";
import { useProductActions } from "@/context/actions/product-actions";
import { useSettingsActions } from "@/context/actions/settings-actions";
import { STORAGE_KEYS } from "@/lib/constants";
import { getStorageItem, setStorageItem } from "@/lib/storage";
import { showToast } from "@/lib/toast";
import {
  api,
  decodeJwt,
  mapApiProductToClient,
  mapApiCategoryToClient,
  mapApiCouponToClient,
  mapApiCustomerToClient,
  mapApiExpenseToClient,
  mapApiOrderToClient,
  safeArray,
} from "@/lib/api";
import en from "@/data/translations/en.json";
import ar from "@/data/translations/ar.json";
import type {
  AppContextType,
  CartItem,
  Category,
  Coupon,
  Customer,
  Expense,
  HomePageSettings,
  Order,
  Product,
  StoreSettings,
} from "@/types/store";

export type {
  AppContextType,
  CartItem,
  Category,
  Coupon,
  Customer,
  Expense,
  HomePageSettings,
  Order,
  Product,
  Review,
  StoreSettings,
} from "@/types/store";

const AppContext = createContext<AppContextType | undefined>(undefined);

const emptyHomePageSettings: HomePageSettings = {
  brandName: "",
  logoText: "",
  heroTitle: "",
  heroSubtitle: "",
  heroCtaText: "",
  heroCtaLink: "",
  firstBannerTitle: "",
  firstBannerSubtitle: "",
  firstBannerCtaText: "",
  promoBadge: "",
};

const emptyStoreSettings: StoreSettings = {
  brandName: "",
  logoText: "",
  contactEmail: "",
  contactPhone: "",
  address: "",
  shippingCost: 0,
  taxRate: 0,
  socialInstagram: "",
  socialTwitter: "",
  socialFacebook: "",
};

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [homePageSettings, setHomePageSettings] = useState<HomePageSettings>(emptyHomePageSettings);
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(emptyStoreSettings);
  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<"Admin" | "Customer" | null>(null);

  const [locale, setLocale] = useState<"en" | "ar">("en");

  useEffect(() => {
    const storedLocale = localStorage.getItem("valens_locale") as "en" | "ar";
    if (storedLocale === "en" || storedLocale === "ar") {
      setLocale(storedLocale);
    }
  }, []);

  const changeLanguage = useCallback((newLocale: "en" | "ar") => {
    setLocale(newLocale);
    localStorage.setItem("valens_locale", newLocale);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = locale;
    }
  }, [locale]);

  const t = useCallback((key: string, variables?: Record<string, string | number>) => {
    const dict = locale === "ar" ? ar : en;
    const keys = key.split(".");
    let val: any = dict;
    for (const k of keys) {
      if (val && typeof val === "object" && k in val) {
        val = val[k];
      } else {
        return key;
      }
    }
    if (typeof val === "string") {
      let result = val;
      if (variables) {
        Object.entries(variables).forEach(([k, v]) => {
          result = result.replace(`{${k}}`, String(v));
        });
      }
      return result;
    }
    return key;
  }, [locale]);

  const fetchPublicData = useCallback(async () => {
    try {
      const data = await api.settings.homepageOverview();
      if (data) {
        if (data.products) {
          setProducts(safeArray<Record<string, unknown>>(data.products).map(mapApiProductToClient));
        }
        if (data.categories) {
          setCategories(safeArray<Record<string, unknown>>(data.categories).map(mapApiCategoryToClient));
        }
        const homeConfig = data.homePageSettings || data.homepageConfig;
        if (homeConfig) {
          setHomePageSettings(homeConfig as HomePageSettings);
        }
        const storeConfig = data.storeSettings || data.storeConfig;
        if (storeConfig) {
          setStoreSettings(storeConfig as StoreSettings);
        }
      }
    } catch (err) {
      console.error("Failed to fetch public homepage overview, falling back to active lists:", err);
      try {
        const prodList = await api.products.list({});
        if (prodList) {
          setProducts(safeArray<Record<string, unknown>>(prodList).map(mapApiProductToClient));
        }
        const catList = await api.categories.listActive();
        if (catList) {
          setCategories(safeArray<Record<string, unknown>>(catList).map(mapApiCategoryToClient));
        }
        const storeConf = await api.settings.storeConfig();
        if (storeConf) {
          setStoreSettings(storeConf);
        }
        const homeConf = await api.settings.homepageConfig();
        if (homeConf) {
          setHomePageSettings(homeConf);
        }
      } catch (fallbackErr) {
        console.error("All fetch fallbacks failed:", fallbackErr);
      }
    }
  }, []);

  const fetchAdminData = useCallback(async () => {
    const results = await Promise.allSettled([
      api.categories.listAdmin(),
      api.coupons.listAdmin(),
      api.customers.listAdmin({ search: "" }),
      api.expenses.listAdmin({}),
      api.orders.listAdmin({}),
      api.products.list({}),
    ]);

    const [adminCats, adminCoupons, adminCustomers, adminExpenses, adminOrders, adminProducts] = results;

    if (adminCats.status === "fulfilled" && adminCats.value)
      setCategories(safeArray(adminCats.value).map(mapApiCategoryToClient));
    else if (adminCats.status === "rejected")
      console.error("Failed to load admin categories:", adminCats.reason);

    if (adminCoupons.status === "fulfilled" && adminCoupons.value)
      setCoupons(safeArray(adminCoupons.value).map(mapApiCouponToClient));
    else if (adminCoupons.status === "rejected")
      console.error("Failed to load admin coupons:", adminCoupons.reason);

    if (adminCustomers.status === "fulfilled" && adminCustomers.value)
      setCustomers(safeArray(adminCustomers.value).map(mapApiCustomerToClient));
    else if (adminCustomers.status === "rejected")
      console.error("Failed to load admin customers:", adminCustomers.reason);

    if (adminExpenses.status === "fulfilled" && adminExpenses.value)
      setExpenses(safeArray(adminExpenses.value).map(mapApiExpenseToClient));
    else if (adminExpenses.status === "rejected")
      console.error("Failed to load admin expenses:", adminExpenses.reason);

    if (adminOrders.status === "fulfilled" && adminOrders.value)
      setOrders(safeArray(adminOrders.value).map(mapApiOrderToClient));
    else if (adminOrders.status === "rejected")
      console.error("Failed to load admin orders:", adminOrders.reason);

    if (adminProducts.status === "fulfilled" && adminProducts.value)
      setProducts(safeArray(adminProducts.value).map(mapApiProductToClient));
    else if (adminProducts.status === "rejected")
      console.error("Failed to load admin products:", adminProducts.reason);
  }, []);

  const fetchCustomerData = useCallback(async () => {
    try {
      const history = await api.orders.myHistory();
      if (history) setOrders(safeArray(history).map(mapApiOrderToClient));
    } catch (err) {
      console.error("Failed to load customer order history:", err);
    }
  }, []);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const storedCart = getStorageItem<CartItem[]>(STORAGE_KEYS.CART);
    if (storedCart !== undefined) setCart(storedCart);

    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("valens_jwt_token");
      if (storedToken) {
        setToken(storedToken);
        const claims = decodeJwt(storedToken);
        if (claims) {
          const email = (claims.email || claims["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"]) as string | undefined;
          const role = (claims.role || claims["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]) as "Admin" | "Customer" | undefined;
          setCurrentUserEmail(email || null);
          setCurrentUserRole(role || null);
        }
      }
    }

    fetchPublicData();
  }, [fetchPublicData]);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (token && currentUserRole === "Admin") {
      fetchAdminData();
    } else if (token && currentUserRole === "Customer") {
      fetchCustomerData();
    }
  }, [token, currentUserRole, fetchAdminData, fetchCustomerData]);

  const appToast: AppContextType["toast"] = useCallback((msg, type = "info") => {
    showToast(msg, type);
  }, []);

  const cartActions = useCartActions({ cart, setCart, coupons, setActiveCoupon });
  const orderActions = useOrderActions({
    orders,
    setOrders,
    customers,
    setCustomers,
    products,
    setProducts,
    coupons,
    setCoupons,
    activeCoupon,
    setActiveCoupon,
    clearCart: cartActions.clearCart,
    setCurrentUserEmail,
  });

  const loginUser = useCallback(async (email: string, password: string) => {
    try {
      const response = await api.auth.login({ email, password });
      const jwtToken = response.token;
      if (jwtToken) {
        localStorage.setItem("valens_jwt_token", jwtToken);
        setToken(jwtToken);
        const claims = decodeJwt(jwtToken);
        if (claims) {
          const parsedEmail = (claims.email || claims["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || email) as string;
          const parsedRole = (claims.role || claims["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "Customer") as "Admin" | "Customer";
          setCurrentUserEmail(parsedEmail);
          setCurrentUserRole(parsedRole);
        } else {
          setCurrentUserEmail(email);
          setCurrentUserRole("Customer");
        }
        showToast("Authenticated successfully!", "success");
        return true;
      }
      return false;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to authenticate";
      showToast(message, "error");
      return false;
    }
  }, []);

  const registerCustomer = useCallback(async (email: string, password: string, name: string) => {
    try {
      const response = await api.auth.registerCustomer({
        email,
        password,
        firstName: name.split(" ")[0] || name,
        lastName: name.split(" ").slice(1).join(" ") || "Customer",
      });
      const jwtToken = response.token;
      if (jwtToken) {
        localStorage.setItem("valens_jwt_token", jwtToken);
        setToken(jwtToken);
        const claims = decodeJwt(jwtToken);
        if (claims) {
          const parsedEmail = (claims.email || claims["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || email) as string;
          setCurrentUserEmail(parsedEmail);
          setCurrentUserRole("Customer");
        } else {
          setCurrentUserEmail(email);
          setCurrentUserRole("Customer");
        }
        showToast("Account registered successfully!", "success");
        return true;
      }
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Registration failed";
      showToast(message, "error");
      return false;
    }
  }, []);

  const logoutUser = useCallback(() => {
    setCurrentUserEmail(null);
    setCurrentUserRole(null);
    setToken(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("valens_jwt_token");
      localStorage.removeItem("valens_current_user");
    }
    showToast("Logged out successfully", "info");
  }, []);

  const updateCustomer = useCallback(async (email: string, updatedDetails: Partial<Customer>) => {
    try {
      await api.customers.updateProfile({
        name: updatedDetails.name,
        phone: updatedDetails.phone,
        address: updatedDetails.address,
        city: updatedDetails.city,
      });

      const updated = customers.map(c => {
        if (c.email.toLowerCase() === email.toLowerCase()) {
          return { ...c, ...updatedDetails };
        }
        return c;
      });
      setCustomers(updated);
      showToast("Profile updated successfully", "success");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update profile";
      showToast(message, "error");
    }
  }, [customers]);

  const productActions = useProductActions({ products, setProducts });
  const categoryActions = useCategoryActions({ categories, setCategories });
  const couponActions = useCouponActions({ coupons, setCoupons });
  const expenseActions = useExpenseActions({ expenses, setExpenses });
  const settingsActions = useSettingsActions({ setHomePageSettings, setStoreSettings });

  const value = useMemo<AppContextType>(() => ({
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
    currentUserEmail,
    token,
    currentUserRole,
    toast: appToast,
    showToast: appToast,
    loginUser,
    registerCustomer,
    logoutUser,
    updateCustomer,
    locale,
    changeLanguage,
    t,
    fetchAdminData,
    fetchCustomerData,
    ...cartActions,
    ...orderActions,
    ...productActions,
    ...categoryActions,
    ...couponActions,
    ...expenseActions,
    ...settingsActions,
  }), [
    activeCoupon,
    currentUserEmail,
    token,
    currentUserRole,
    appToast,
    cart,
    cartActions,
    categories,
    categoryActions,
    couponActions,
    coupons,
    customers,
    expenseActions,
    expenses,
    homePageSettings,
    orderActions,
    orders,
    productActions,
    products,
    settingsActions,
    storeSettings,
    loginUser,
    registerCustomer,
    logoutUser,
    updateCustomer,
    locale,
    changeLanguage,
    t,
    fetchAdminData,
    fetchCustomerData,
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppContextProvider");
  }
  return context;
};
