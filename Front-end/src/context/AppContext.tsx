"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useCartActions } from "@/context/actions/cart-actions";
import { useCategoryActions } from "@/context/actions/category-actions";
import { useCouponActions } from "@/context/actions/coupon-actions";
import { useExpenseActions } from "@/context/actions/expense-actions";
import { useOrderActions } from "@/context/actions/order-actions";
import { useProductActions } from "@/context/actions/product-actions";
import { useSettingsActions } from "@/context/actions/settings-actions";
import { initialCategories } from "@/data/categories";
import { initialCoupons } from "@/data/coupons";
import { initialCustomers } from "@/data/customers";
import { initialExpenses } from "@/data/expenses";
import { initialOrders } from "@/data/orders";
import { initialProducts } from "@/data/products";
import { defaultHomePageSettings, defaultStoreSettings } from "@/data/settings";
import { STORAGE_KEYS } from "@/lib/constants";
import { getStorageItem, setStorageItem } from "@/lib/storage";
import { showToast } from "@/lib/toast";
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
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const storedProducts = getStorageItem<Product[]>(STORAGE_KEYS.PRODUCTS);
    const storedCategories = getStorageItem<Category[]>(STORAGE_KEYS.CATEGORIES);
    const storedCart = getStorageItem<CartItem[]>(STORAGE_KEYS.CART);
    const storedOrders = getStorageItem<Order[]>(STORAGE_KEYS.ORDERS);
    const storedCustomers = getStorageItem<Customer[]>(STORAGE_KEYS.CUSTOMERS);
    const storedCoupons = getStorageItem<Coupon[]>(STORAGE_KEYS.COUPONS);
    const storedExpenses = getStorageItem<Expense[]>(STORAGE_KEYS.EXPENSES);
    const storedHomePage = getStorageItem<HomePageSettings>(STORAGE_KEYS.HOMEPAGE);
    const storedSettings = getStorageItem<StoreSettings>(STORAGE_KEYS.SETTINGS);

    if (storedProducts !== undefined) setProducts(storedProducts);
    if (storedCategories !== undefined) {
      const updated = storedCategories.map(cat => {
        if (cat.id === "cat-4" || cat.slug === "recovery") {
          return { ...cat, visible: true };
        }
        return cat;
      });
      if (!updated.some(c => c.id === "cat-4")) {
        const recoveryCat = initialCategories.find(c => c.id === "cat-4");
        if (recoveryCat) updated.push(recoveryCat);
      }
      setCategories(updated);
      try {
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to sync category visible state", e);
      }
    } else {
      setCategories(initialCategories);
    }
    if (storedCart !== undefined) setCart(storedCart);
    if (storedOrders !== undefined) setOrders(storedOrders);
    if (storedCustomers !== undefined) setCustomers(storedCustomers);
    if (storedCoupons !== undefined) setCoupons(storedCoupons);
    if (storedExpenses !== undefined) setExpenses(storedExpenses);
    if (storedHomePage !== undefined) setHomePageSettings(storedHomePage);
    if (storedSettings !== undefined) setStoreSettings(storedSettings);
    const storedUser = getStorageItem<string>(STORAGE_KEYS.CURRENT_USER);
    if (storedUser !== undefined) setCurrentUserEmail(storedUser);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

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

  const loginUser = useCallback((email: string, name?: string) => {
    setCurrentUserEmail(email);
    setStorageItem(STORAGE_KEYS.CURRENT_USER, email);

    // If the customer doesn't exist, create one
    const exists = customers.some(c => c.email.toLowerCase() === email.toLowerCase());
    if (!exists) {
      const newCustomer: Customer = {
        id: `cust-${Date.now()}`,
        name: name || email.split("@")[0],
        email: email,
        phone: "",
        address: "",
        city: "",
        orderCount: 0,
        totalSpent: 0,
        joinDate: new Date().toISOString().split("T")[0]
      };
      const updated = [...customers, newCustomer];
      setCustomers(updated);
      setStorageItem(STORAGE_KEYS.CUSTOMERS, updated);
    }
  }, [customers]);

  const logoutUser = useCallback(() => {
    setCurrentUserEmail(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }, []);

  const updateCustomer = useCallback((email: string, updatedDetails: Partial<Customer>) => {
    const updated = customers.map(c => {
      if (c.email.toLowerCase() === email.toLowerCase()) {
        return { ...c, ...updatedDetails };
      }
      return c;
    });
    setCustomers(updated);
    setStorageItem(STORAGE_KEYS.CUSTOMERS, updated);
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
    toast: appToast,
    showToast: appToast,
    loginUser,
    logoutUser,
    updateCustomer,
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
    logoutUser,
    updateCustomer,
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
