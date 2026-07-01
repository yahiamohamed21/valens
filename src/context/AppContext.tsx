"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState, useRef } from "react";
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
  mapApiReturnToClient,
  mapApiBannerToClient,
  mapApiStoryToClient,
  mapApiSectionProductToClient,
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
  HomeBanner,
  HomeStory,
  HomeCuratedProduct,
  OrderReturn,
  CarouselItem,
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
  HomeBanner,
  HomeStory,
  HomeCuratedProduct,
  OrderReturn,
  CarouselItem,
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

const defaultHomeBanners: HomeBanner[] = [
  {
    id: "default-banner-1",
    title: "YOUR PREMIUM ENERGY STACK",
    subtitle: "Clinically dosed ingredients to elevate performance.",
    image: "powder",
    ctaText: "SHOP PERFORMANCE",
    ctaLink: "/products",
    isActive: true,
    displayOrder: 1,
  },
  {
    id: "default-banner-2",
    title: "CREATINE MONOHYDRATE PURE",
    subtitle: "100% Lab Certified Purity. Zero Proprietary Blends.",
    image: "capsule",
    ctaText: "DISCOVER CREATINE",
    ctaLink: "/products",
    isActive: true,
    displayOrder: 2,
  }
];

const defaultHomeStories: HomeStory[] = [
  {
    id: "performance-lab",
    title: "Performance Lab",
    description: "Clinical-grade formulas built for measurable strength, endurance, and recovery.",
    image: "https://picsum.photos/id/1048/1200/900",
    link: "/about",
    isActive: true,
    displayOrder: 1,
  },
  {
    id: "daily-recovery",
    title: "Daily Recovery",
    description: "Support the reset phase with transparent ingredients and consistent routines.",
    image: "https://picsum.photos/id/1060/1200/900",
    link: "/products",
    isActive: true,
    displayOrder: 2,
  },
  {
    id: "clean-energy",
    title: "Clean Energy",
    description: "Focused, smooth output without relying on hidden proprietary blends.",
    image: "https://picsum.photos/id/1076/1200/900",
    link: "/products",
    isActive: true,
    displayOrder: 3,
  },
  {
    id: "strength-stack",
    title: "Strength Stack",
    description: "Temporary product imagery while the final backend media API is prepared.",
    image: "https://picsum.photos/id/1084/1200/900",
    link: "/products",
    isActive: true,
    displayOrder: 4,
  },
  {
    id: "sleep-reset",
    title: "Sleep Reset",
    description: "A calmer end-of-day ritual designed around better readiness tomorrow.",
    image: "https://picsum.photos/id/1025/1200/900",
    link: "/products",
    isActive: true,
    displayOrder: 5,
  }
];

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [rawOrders, setRawOrders] = useState<Order[]>([]);
  const [returnsList, setReturnsList] = useState<OrderReturn[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [homePageSettings, setHomePageSettings] = useState<HomePageSettings>(emptyHomePageSettings);
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(emptyStoreSettings);
  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<"Admin" | "Customer" | null>(null);

  const [homeBanners, setHomeBanners] = useState<HomeBanner[]>([]);
  const [homeStories, setHomeStories] = useState<HomeStory[]>([]);
  const [homeFeaturedProducts, setHomeFeaturedProducts] = useState<HomeCuratedProduct[]>([]);
  const [homeBestSellers, setHomeBestSellers] = useState<HomeCuratedProduct[]>([]);


  const setOrders = useCallback((update: React.SetStateAction<Order[]>) => {
    setRawOrders((prev) => {
      return typeof update === "function" ? (update as any)(prev) : update;
    });
  }, []);

  const orders = useMemo(() => {
    let list = rawOrders;
    if (typeof window !== "undefined") {
      try {
        const extraMetadataStr = localStorage.getItem("valens_orders_extra_metadata");
        if (extraMetadataStr) {
          const extraMetadata = JSON.parse(extraMetadataStr) as Record<string, any>;
          list = rawOrders.map((order) => {
            const meta = extraMetadata[order.id];
            if (meta) {
              return { ...order, ...meta };
            }
            return order;
          });
        }
      } catch (e) {
        console.error("Failed to parse extraMetadata", e);
      }
    }

    // Auto-resolve coupon info for initial mockup orders if missing
    return list.map((order) => {
      if (order.couponCode && !order.couponId && coupons.length > 0) {
        const cop = coupons.find((c) => c.code.toUpperCase() === order.couponCode?.toUpperCase());
        if (cop) {
          return {
            ...order,
            couponId: cop.id,
            couponDiscountType: cop.discountType,
            couponDiscountValue: cop.discountValue,
            couponDiscountAmountApplied: order.discountAmount,
            couponTotalBeforeDiscount: order.totalPrice + order.discountAmount - order.shippingCost,
            couponFinalTotalAfterDiscount: order.totalPrice,
          };
        }
      }
      return order;
    });
  }, [rawOrders, coupons]);


  // Auto-save homepage CMS changes reactively
  useEffect(() => {
    if (homeBanners.length > 0) {
      localStorage.setItem("valens_home_banners", JSON.stringify(homeBanners));
    }
  }, [homeBanners]);

  useEffect(() => {
    if (homeStories.length > 0) {
      localStorage.setItem("valens_home_stories", JSON.stringify(homeStories));
    }
  }, [homeStories]);

  useEffect(() => {
    localStorage.setItem("valens_home_featured", JSON.stringify(homeFeaturedProducts));
  }, [homeFeaturedProducts]);

  useEffect(() => {
    localStorage.setItem("valens_home_bestsellers", JSON.stringify(homeBestSellers));
  }, [homeBestSellers]);

  const [locale, setLocale] = useState<"en" | "ar">("en");

  useEffect(() => {
    const storedLocale = localStorage.getItem("valens_locale") as "en" | "ar";
    if (storedLocale === "en" || storedLocale === "ar") {
      setLocale(storedLocale);
    }

    // Load homepage CMS data
    try {
      const savedBanners = localStorage.getItem("valens_home_banners");
      setHomeBanners(savedBanners ? JSON.parse(savedBanners) : defaultHomeBanners);

      const savedStories = localStorage.getItem("valens_home_stories");
      setHomeStories(savedStories ? JSON.parse(savedStories) : defaultHomeStories);

      const savedFeatured = localStorage.getItem("valens_home_featured");
      setHomeFeaturedProducts(savedFeatured ? JSON.parse(savedFeatured) : []);

      const savedBestSellers = localStorage.getItem("valens_home_bestsellers");
      setHomeBestSellers(savedBestSellers ? JSON.parse(savedBestSellers) : []);
    } catch (err) {
      console.error("Failed to load homepage CMS data from local storage:", err);
      setHomeBanners(defaultHomeBanners);
      setHomeStories(defaultHomeStories);
      setHomeFeaturedProducts([]);
      setHomeBestSellers([]);
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
      const homeOverview = await api.homeControl.getOverview();
      if (homeOverview && (homeOverview as any).success) {
        const payload = (homeOverview as any).data;
        if (payload.heroBanners) {
          setHomeBanners(safeArray<Record<string, unknown>>(payload.heroBanners).map(mapApiBannerToClient));
        }
        if (payload.performanceStories) {
          setHomeStories(safeArray<Record<string, unknown>>(payload.performanceStories).map(mapApiStoryToClient));
        }
        if (payload.featuredFormulas) {
          setHomeFeaturedProducts(safeArray<Record<string, unknown>>(payload.featuredFormulas).map(mapApiSectionProductToClient));
        }
        if (payload.bestSellingFormulas) {
          setHomeBestSellers(safeArray<Record<string, unknown>>(payload.bestSellingFormulas).map(mapApiSectionProductToClient));
        }
      }
    } catch (err) {
      console.warn("Failed to fetch backend homepage overview, using local storage or defaults", err);
    }

    try {
      const data = await api.settings.homepageOverview();
      if (data) {
        if (data.categories) {
          setCategories(safeArray<Record<string, unknown>>(data.categories).map(mapApiCategoryToClient));
        }
        const homeConfig = (data.settings || data.Settings || data.homePageSettings || data.homepageConfig) as any;
        if (homeConfig) {
          setHomePageSettings({
            brandName: "Valens",
            logoText: "VALENS",
            heroTitle: homeConfig.homepageHeroTitle || "FORGED IN SCIENCE, UNLEASHED IN PERFORMANCE",
            heroSubtitle: homeConfig.homepageHeroSubtitle || "Fuel your body with the highest quality formulations.",
            heroCtaText: "SHOP PERFORMANCE",
            heroCtaLink: "/products",
            firstBannerTitle: homeConfig.homepageHeroTitle || "Purity & Potency",
            firstBannerSubtitle: homeConfig.homepageHeroSubtitle || "Clinically dosed ingredients to elevate performance.",
            firstBannerCtaText: "SHOP NOW",
            promoBadge: homeConfig.homepageDiscountBannerText || "VALENS LABS",
            heroTitle_ar: homeConfig.homepageHeroTitle_ar || homeConfig.homepageHeroTitle || "مُصمم برؤية علمية، مُنفجر بقوة الأداء",
            heroSubtitle_ar: homeConfig.homepageHeroSubtitle_ar || homeConfig.homepageHeroSubtitle || "ادعم جسمك بتركيبات عالية الجودة.",
            promoBadge_ar: homeConfig.homepageDiscountBannerText_ar || homeConfig.homepageDiscountBannerText || "مختبرات فالنز"
          });
        }
      }
      // Load store settings separately as they are not inside homepageOverview in backend DTO
      const storeConf = await api.settings.storeConfig();
      if (storeConf) {
        setStoreSettings(storeConf);
      }
      // Load products separately to ensure we get the full list of products
      const prodList = await api.products.list({ pageSize: 1000 });
      if (prodList) {
        setProducts(safeArray<Record<string, unknown>>(prodList).map(mapApiProductToClient));
      }
    } catch (err) {
      console.warn("Homepage overview unavailable, trying individual endpoints...");
      try {
        const prodList = await api.products.list({ pageSize: 1000 });
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
          setHomePageSettings({
            brandName: "Valens",
            logoText: "VALENS",
            heroTitle: homeConf.heroTitle || "FORGED IN SCIENCE, UNLEASHED IN PERFORMANCE",
            heroSubtitle: homeConf.heroSubtitle || "Fuel your body with the highest quality formulations.",
            heroCtaText: homeConf.heroCtaText || "SHOP PERFORMANCE",
            heroCtaLink: homeConf.heroCtaLink || "/products",
            firstBannerTitle: homeConf.firstBannerTitle || "Purity & Potency",
            firstBannerSubtitle: homeConf.firstBannerSubtitle || "Clinically dosed ingredients to elevate performance.",
            firstBannerCtaText: homeConf.firstBannerCtaText || "SHOP NOW",
            promoBadge: homeConf.promoBadge || "VALENS LABS",
            heroTitle_ar: homeConf.heroTitle_ar || homeConf.heroTitle || "مُصمم برؤية علمية، مُنفجر بقوة الأداء",
            heroSubtitle_ar: homeConf.heroSubtitle_ar || homeConf.heroSubtitle || "ادعم جسمك بتركيبات عالية الجودة.",
            promoBadge_ar: homeConf.promoBadge_ar || homeConf.promoBadge || "مختبرات فالنز"
          });
        }
      } catch (fallbackErr) {
        console.warn("Backend unreachable — data will load when connection is restored.");
      }
    }
  }, []);

  const lastAdminFetchRef = useRef<number>(0);

  const fetchAdminData = useCallback(async (force = false) => {
    const now = Date.now();
    if (!force && now - lastAdminFetchRef.current < 20000) {
      return;
    }
    lastAdminFetchRef.current = now;

    const results = await Promise.allSettled([
      api.categories.listAdmin(),
      api.coupons.listAdmin(),
      api.customers.listAdmin({ search: "" }),
      api.expenses.listAdmin({}),
      api.orders.listAdmin({}),
      api.products.list({}),
      api.returns.list(),
      api.homeControl.banners.list(),
      api.homeControl.stories.list(),
      api.homeControl.sections.listProducts("featured_formulas"),
      api.homeControl.sections.listProducts("best_selling_formulas"),
    ]);

    const [
      adminCats,
      adminCoupons,
      adminCustomers,
      adminExpenses,
      adminOrders,
      adminProducts,
      adminReturns,
      adminBanners,
      adminStories,
      adminFeatured,
      adminBestsellers
    ] = results;

    // Check if ALL requests failed (server unreachable) - log only once
    const allFailed = results.every((r) => r.status === "rejected");
    if (allFailed) {
      console.warn("Admin data: backend unreachable, will retry when connection is restored.");
      return;
    }

    if (adminCats.status === "fulfilled" && adminCats.value)
      setCategories(safeArray(adminCats.value).map(mapApiCategoryToClient));

    if (adminCoupons.status === "fulfilled" && adminCoupons.value)
      setCoupons(safeArray(adminCoupons.value).map(mapApiCouponToClient));

    if (adminCustomers.status === "fulfilled" && adminCustomers.value)
      setCustomers(safeArray(adminCustomers.value).map(mapApiCustomerToClient));

    if (adminExpenses.status === "fulfilled" && adminExpenses.value)
      setExpenses(safeArray(adminExpenses.value).map(mapApiExpenseToClient));

    if (adminOrders.status === "fulfilled" && adminOrders.value)
      setOrders(safeArray(adminOrders.value).map(mapApiOrderToClient));

    if (adminProducts.status === "fulfilled" && adminProducts.value)
      setProducts(safeArray(adminProducts.value).map(mapApiProductToClient));

    if (adminReturns.status === "fulfilled" && adminReturns.value)
      setReturnsList(safeArray(adminReturns.value).map(mapApiReturnToClient));

    if (adminBanners.status === "fulfilled" && adminBanners.value) {
      const data = (adminBanners.value as any).data || adminBanners.value;
      setHomeBanners(safeArray(data).map(mapApiBannerToClient));
    }

    if (adminStories.status === "fulfilled" && adminStories.value) {
      const data = (adminStories.value as any).data || adminStories.value;
      setHomeStories(safeArray(data).map(mapApiStoryToClient));
    }

    if (adminFeatured.status === "fulfilled" && adminFeatured.value) {
      const data = (adminFeatured.value as any).data || adminFeatured.value;
      setHomeFeaturedProducts(safeArray(data).map(mapApiSectionProductToClient));
    }

    if (adminBestsellers.status === "fulfilled" && adminBestsellers.value) {
      const data = (adminBestsellers.value as any).data || adminBestsellers.value;
      setHomeBestSellers(safeArray(data).map(mapApiSectionProductToClient));
    }
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

  const productActions = useProductActions({ products, setProducts });
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
    editProduct: productActions.editProduct,
    setReturnsList,
  });

  const loginUser = useCallback(async (email: string, password: string) => {
    try {
      const response = await api.auth.login({ email, password });
      const jwtToken = response.token;
      if (jwtToken) {
        localStorage.setItem("valens_jwt_token", jwtToken);
        if (response.refreshToken) {
          localStorage.setItem("valens_refresh_token", response.refreshToken);
        }
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
        fullName: name,
        phone: "",
        address: "",
        city: "",
      });
      const jwtToken = response.token;
      if (jwtToken) {
        localStorage.setItem("valens_jwt_token", jwtToken);
        if (response.refreshToken) {
          localStorage.setItem("valens_refresh_token", response.refreshToken);
        }
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
    if (typeof window !== "undefined") {
      const refreshToken = localStorage.getItem("valens_refresh_token");
      if (refreshToken) {
        api.auth.revokeToken({ refreshToken }).catch((err) => {
          console.error("Failed to revoke token on backend", err);
        });
      }
      localStorage.removeItem("valens_jwt_token");
      localStorage.removeItem("valens_refresh_token");
      localStorage.removeItem("valens_current_user");
    }
    setCurrentUserEmail(null);
    setCurrentUserRole(null);
    setToken(null);
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


  const categoryActions = useCategoryActions({ categories, setCategories });
  const couponActions = useCouponActions({ coupons, setCoupons });
  const expenseActions = useExpenseActions({ expenses, setExpenses });
  const settingsActions = useSettingsActions({ setHomePageSettings, setStoreSettings });

  const value = useMemo<AppContextType>(() => ({
    homeBanners,
    setHomeBanners,
    homeStories,
    setHomeStories,
    homeFeaturedProducts,
    setHomeFeaturedProducts,
    homeBestSellers,
    setHomeBestSellers,
    returnsList,
    setReturnsList,
    products,
    setProducts,
    categories,
    cart,
    orders,
    setOrders,
    customers,
    setCustomers,
    coupons,
    setCoupons,
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
    homeBanners,
    homeStories,
    homeFeaturedProducts,
    homeBestSellers,
    returnsList,
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
    setCustomers,
    setProducts,
    setOrders,
    setCoupons,
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
