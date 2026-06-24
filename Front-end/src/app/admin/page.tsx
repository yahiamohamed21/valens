"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useApp, Product, Category, Coupon, Order, Expense } from "@/context/AppContext";
import { Icon } from "@/components/SvgIcons";
import { ProductImage } from "@/components/ProductCard";

export default function AdminDashboard() {
  const {
    products,
    categories,
    orders,
    customers,
    coupons,
    expenses,
    homePageSettings,
    storeSettings,
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
    updateOrderStatus,
    confirmOrder,
    cancelOrder,
    showToast
  } = useApp();

  // Navigation active tab
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "products"
    | "categories"
    | "orders"
    | "customers"
    | "homepage"
    | "coupons"
    | "expenses"
    | "reports"
    | "settings"
  >("overview");

  // Collapse sidebar on small screens
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Modal / Form triggers
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [editingCouponId, setEditingCouponId] = useState<string | null>(null);

  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);

  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  // Form states - Products
  const [prodName, setProdName] = useState("");
  const [prodCategory, setProdCategory] = useState("Protein");
  const [prodPrice, setProdPrice] = useState("");
  const [prodDiscountPrice, setProdDiscountPrice] = useState("");
  const [prodSize, setProdSize] = useState("");
  const [prodVariants, setProdVariants] = useState("");
  const [prodStock, setProdStock] = useState("");
  const [prodSku, setProdSku] = useState("");
  const [prodDesc, setProdDesc] = useState("");
  const [prodIngredients, setProdIngredients] = useState("");
  const [prodUsage, setProdUsage] = useState("");
  const [prodBenefits, setProdBenefits] = useState("");
  const [prodImgColor, setProdImgColor] = useState("#FF8A75");
  const [prodImgType, setProdImgType] = useState<"powder" | "capsule" | "liquid">("powder");
  const [prodFeatured, setProdFeatured] = useState(false);
  const [prodBestSeller, setProdBestSeller] = useState(false);
  const [prodNewArrival, setProdNewArrival] = useState(false);
  const [prodVisible, setProdVisible] = useState(true);

  // Form states - Categories
  const [catName, setCatName] = useState("");
  const [catColor, setCatColor] = useState("#FF8A75");
  const [catVisible, setCatVisible] = useState(true);

  // Form states - Coupons
  const [coupCode, setCoupCode] = useState("");
  const [coupType, setCoupType] = useState<"percentage" | "fixed">("percentage");
  const [coupValue, setCoupValue] = useState("");
  const [coupExpiry, setCoupExpiry] = useState("");
  const [coupLimit, setCoupLimit] = useState("");
  const [coupMinOrder, setCoupMinOrder] = useState("");
  const [coupActive, setCoupActive] = useState(true);

  // Form states - Expenses
  const [expTitle, setExpTitle] = useState("");
  const [expCategory, setExpCategory] = useState<Expense["category"]>("Product purchasing cost");
  const [expAmount, setExpAmount] = useState("");
  const [expDate, setExpDate] = useState("");
  const [expPayMethod, setExpPayMethod] = useState("Bank Transfer");
  const [expNotes, setExpNotes] = useState("");

  // Form states - Homepage CMS
  const [cmsBrand, setCmsBrand] = useState(homePageSettings.brandName);
  const [cmsLogo, setCmsLogo] = useState(homePageSettings.logoText);
  const [cmsHeroTitle, setCmsHeroTitle] = useState(homePageSettings.heroTitle);
  const [cmsHeroSubtitle, setCmsHeroSubtitle] = useState(homePageSettings.heroSubtitle);
  const [cmsHeroCtaText, setCmsHeroCtaText] = useState(homePageSettings.heroCtaText);
  const [cmsHeroCtaLink, setCmsHeroCtaLink] = useState(homePageSettings.heroCtaLink);
  const [cmsFirstTitle, setCmsFirstTitle] = useState(homePageSettings.firstBannerTitle);
  const [cmsFirstSubtitle, setCmsFirstSubtitle] = useState(homePageSettings.firstBannerSubtitle);
  const [cmsFirstCtaText, setCmsFirstCtaText] = useState(homePageSettings.firstBannerCtaText);
  const [cmsPromoBadge, setCmsPromoBadge] = useState(homePageSettings.promoBadge);

  // Form states - Store Settings
  const [setContactEmail, setSetContactEmail] = useState(storeSettings.contactEmail);
  const [setContactPhone, setSetContactPhone] = useState(storeSettings.contactPhone);
  const [setAddress, setSetAddress] = useState(storeSettings.address);
  const [setShipping, setSetShipping] = useState(storeSettings.shippingCost.toString());
  const [setTax, setSetTax] = useState(storeSettings.taxRate.toString());

  // Reports Date Filters
  const [reportStartDate, setReportStartDate] = useState("2026-06-01");
  const [reportEndDate, setReportEndDate] = useState("2026-06-30");

  // Calculations for Admin Stats Panel
  const totals = useMemo(() => {
    // Orders filters
    const totalOrdersCount = orders.length;
    const newOrders = orders.filter((o) => o.status === "New Order").length;
    const confirmedOrders = orders.filter((o) => o.status === "Confirmed").length;
    const preparingOrders = orders.filter((o) => o.status === "Preparing").length;
    const deliveredOrders = orders.filter((o) => o.status === "Delivered").length;
    const cancelledOrders = orders.filter((o) => o.status === "Cancelled").length;

    // Financial calculations
    const totalSales = orders
      .filter((o) => o.status !== "Cancelled" && o.status !== "Rejected")
      .reduce((acc, curr) => acc + curr.totalPrice, 0);

    const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const netProfit = totalSales - totalExpenses;

    // Inventory calculations
    const totalProducts = products.length;
    const lowStockProducts = products.filter((p) => p.stockStatus === "Low Stock" || p.stock === 0).length;
    const totalCustomers = customers.length;

    return {
      totalOrdersCount,
      newOrders,
      confirmedOrders,
      preparingOrders,
      deliveredOrders,
      cancelledOrders,
      totalSales,
      totalExpenses,
      netProfit,
      totalProducts,
      lowStockProducts,
      totalCustomers
    };
  }, [orders, expenses, products, customers]);

  // Product modal open handler (reset or pre-fill)
  const openProductForm = (prod: Product | null = null) => {
    if (prod) {
      setEditingProductId(prod.id);
      setProdName(prod.name);
      setProdCategory(prod.category);
      setProdPrice(prod.price.toString());
      setProdDiscountPrice(prod.discountPrice?.toString() || "");
      setProdSize(prod.size);
      setProdVariants(prod.variants.join(", "));
      setProdStock(prod.stock.toString());
      setProdSku(prod.sku);
      setProdDesc(prod.description);
      setProdIngredients(prod.ingredients.join(", "));
      setProdUsage(prod.usage);
      setProdBenefits(prod.benefits.join("\n"));
      setProdImgColor(prod.imageColor);
      setProdImgType(prod.imageType);
      setProdFeatured(prod.featured);
      setProdBestSeller(prod.bestSeller);
      setProdNewArrival(prod.newArrival);
      setProdVisible(prod.visible);
    } else {
      setEditingProductId(null);
      setProdName("");
      setProdCategory("Protein");
      setProdPrice("");
      setProdDiscountPrice("");
      setProdSize("");
      setProdVariants("");
      setProdStock("");
      setProdSku("");
      setProdDesc("");
      setProdIngredients("");
      setProdUsage("");
      setProdBenefits("");
      setProdImgColor("#FF8A75");
      setProdImgType("powder");
      setProdFeatured(false);
      setProdBestSeller(false);
      setProdNewArrival(false);
      setProdVisible(true);
    }
    setProductModalOpen(true);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodPrice || !prodStock || !prodSku) {
      alert("Please fill in core product requirements.");
      return;
    }

    const payload = {
      name: prodName,
      category: prodCategory,
      price: parseFloat(prodPrice),
      discountPrice: prodDiscountPrice ? parseFloat(prodDiscountPrice) : undefined,
      size: prodSize || "1 Tub",
      variants: prodVariants.split(",").map((v) => v.trim()).filter(Boolean),
      stock: parseInt(prodStock),
      stockStatus: parseInt(prodStock) === 0 ? "Out of Stock" : parseInt(prodStock) <= 10 ? "Low Stock" : "In Stock" as any,
      sku: prodSku,
      description: prodDesc,
      ingredients: prodIngredients.split(",").map((i) => i.trim()).filter(Boolean),
      usage: prodUsage,
      benefits: prodBenefits.split("\n").map((b) => b.trim()).filter(Boolean),
      imageColor: prodImgColor,
      imageType: prodImgType,
      featured: prodFeatured,
      bestSeller: prodBestSeller,
      newArrival: prodNewArrival,
      visible: prodVisible,
      rating: 5.0
    };

    if (editingProductId) {
      editProduct(editingProductId, payload);
    } else {
      addProduct(payload);
    }
    setProductModalOpen(false);
  };

  // Category Form Submit
  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName) return;

    if (editingCategoryId) {
      editCategory(editingCategoryId, { name: catName, imageColor: catColor, visible: catVisible });
      setEditingCategoryId(null);
    } else {
      addCategory({ name: catName, imageColor: catColor, visible: catVisible });
    }
    setCatName("");
    setCategoryModalOpen(false);
  };

  // Coupon Form Submit
  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coupCode || !coupValue || !coupExpiry) return;

    const payload = {
      code: coupCode.trim().toUpperCase(),
      discountType: coupType,
      discountValue: parseFloat(coupValue),
      expiryDate: coupExpiry,
      usageLimit: parseInt(coupLimit) || 100,
      minOrderAmount: parseFloat(coupMinOrder) || 0,
      active: coupActive
    };

    if (editingCouponId) {
      editCoupon(editingCouponId, payload);
      setEditingCouponId(null);
    } else {
      addCoupon(payload);
    }
    setCoupCode("");
    setCoupValue("");
    setCoupExpiry("");
    setCoupLimit("");
    setCoupMinOrder("");
    setCouponModalOpen(false);
  };

  // Expense Form Submit
  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expTitle || !expAmount || !expDate) return;

    const payload = {
      title: expTitle,
      category: expCategory,
      amount: parseFloat(expAmount),
      date: expDate,
      paymentMethod: expPayMethod,
      notes: expNotes || undefined
    };

    if (editingExpenseId) {
      editExpense(editingExpenseId, payload);
      setEditingExpenseId(null);
    } else {
      addExpense(payload);
    }
    setExpTitle("");
    setExpAmount("");
    setExpDate("");
    setExpNotes("");
    setExpenseModalOpen(false);
  };

  // CMS Settings submit
  const handleCmsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateHomePageSettings({
      brandName: cmsBrand,
      logoText: cmsLogo,
      heroTitle: cmsHeroTitle,
      heroSubtitle: cmsHeroSubtitle,
      heroCtaText: cmsHeroCtaText,
      heroCtaLink: cmsHeroCtaLink,
      firstBannerTitle: cmsFirstTitle,
      firstBannerSubtitle: cmsFirstSubtitle,
      firstBannerCtaText: cmsFirstCtaText,
      promoBadge: cmsPromoBadge
    });
  };

  // Global settings submit
  const handleGlobalSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreSettings({
      brandName: storeSettings.brandName,
      logoText: storeSettings.logoText,
      contactEmail: setContactEmail,
      contactPhone: setContactPhone,
      address: setAddress,
      shippingCost: parseFloat(setShipping) || 0,
      taxRate: parseFloat(setTax) || 0,
      socialInstagram: storeSettings.socialInstagram,
      socialTwitter: storeSettings.socialTwitter,
      socialFacebook: storeSettings.socialFacebook
    });
  };

  // Expense breakdown calculations for reports
  const expensesByCategory = useMemo(() => {
    const categoriesMap: Record<string, number> = {};
    expenses.forEach((e) => {
      categoriesMap[e.category] = (categoriesMap[e.category] || 0) + e.amount;
    });
    return Object.entries(categoriesMap).sort((a, b) => b[1] - a[1]);
  }, [expenses]);

  return (
    <div className="flex h-screen overflow-hidden bg-main-bg text-white">
      
      {/* Sidebar Panel */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } shrink-0 border-r border-border-color bg-surface-deep transition-luxury flex flex-col justify-between`}
      >
        <div className="flex flex-col gap-6 pt-6">
          {/* Dashboard Header */}
          <div className="flex items-center justify-between px-4 border-b border-border-color pb-5">
            <Link href="/" className="flex items-center gap-2">
              <span className={`text-glow font-black tracking-widest text-primary-coral transition-luxury ${
                sidebarOpen ? "text-xl" : "text-sm"
              }`}>
                {sidebarOpen ? "VALENS ADMIN" : "VL"}
              </span>
            </Link>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-muted-text hover:text-white">
              <Icon name={sidebarOpen ? "chevron-left" : "menu"} size={16} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1 px-2">
            {[
              { id: "overview", label: "Overview", icon: "dashboard" },
              { id: "products", label: "Products", icon: "products" },
              { id: "categories", label: "Categories", icon: "category" },
              { id: "orders", label: "Orders", icon: "orders" },
              { id: "customers", label: "Customers", icon: "user" },
              { id: "homepage", label: "Home Control", icon: "edit" },
              { id: "coupons", label: "Coupons", icon: "tag" },
              { id: "expenses", label: "Expenses", icon: "expense" },
              { id: "reports", label: "Reports", icon: "report" },
              { id: "settings", label: "Settings", icon: "settings" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-3.5 rounded-xl px-3 py-3 text-xs font-bold uppercase tracking-wider transition-luxury ${
                  activeTab === tab.id
                    ? "bg-primary-coral/10 text-primary-coral border border-primary-coral/20"
                    : "text-soft-text hover:bg-surface-sec hover:text-white"
                }`}
              >
                <Icon name={tab.icon as any} size={18} />
                {sidebarOpen && <span>{tab.label}</span>}
              </button>
            ))}
          </nav>
        </div>

        {/* Exit back to store */}
        <div className="p-4 border-t border-border-color">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-xl border border-border-color bg-surface-sec py-2.5 text-xs font-bold uppercase tracking-wider text-soft-text hover:text-white hover:border-primary-coral transition-luxury w-full"
          >
            <Icon name="logout" size={14} />
            {sidebarOpen && <span>Back to store</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b border-border-color bg-surface-deep/30 px-6">
          <h2 className="text-sm font-black uppercase tracking-widest text-muted-text">
            SYSTEMS CONTROL PANEL &gt; <span className="text-white">{activeTab}</span>
          </h2>
          <div className="flex items-center gap-4">
            <span className="rounded-full bg-success-green/10 border border-success-green/20 px-3 py-1 text-4xs font-bold text-success-green uppercase tracking-wider">
              Secure Live Database Link
            </span>
          </div>
        </header>

        {/* Dynamic Panel Views */}
        <div className="p-6">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="flex flex-col gap-6">
              {/* Stat HUD grid */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
                
                <div className="rounded-2xl border border-border-color bg-card-bg p-4 flex flex-col">
                  <span className="text-4xs font-extrabold uppercase tracking-widest text-muted-text">TOTAL REVENUES</span>
                  <span className="mt-1.5 text-lg font-black text-white">${totals.totalSales.toFixed(2)}</span>
                  <span className="text-4xs text-success-green mt-1">Confirmed orders</span>
                </div>

                <div className="rounded-2xl border border-border-color bg-card-bg p-4 flex flex-col">
                  <span className="text-4xs font-extrabold uppercase tracking-widest text-muted-text">TOTAL EXPENSES</span>
                  <span className="mt-1.5 text-lg font-black text-accent-orange">${totals.totalExpenses.toFixed(2)}</span>
                  <span className="text-4xs text-muted-text mt-1">Brand procurement</span>
                </div>

                <div className="rounded-2xl border border-border-color bg-card-bg p-4 flex flex-col">
                  <span className="text-4xs font-extrabold uppercase tracking-widest text-muted-text">NET PROFITS</span>
                  <span className={`mt-1.5 text-lg font-black ${totals.netProfit >= 0 ? "text-success-green" : "text-red-500"}`}>
                    ${totals.netProfit.toFixed(2)}
                  </span>
                  <span className="text-4xs text-muted-text mt-1">Sales - Expenses</span>
                </div>

                <div className="rounded-2xl border border-border-color bg-card-bg p-4 flex flex-col">
                  <span className="text-4xs font-extrabold uppercase tracking-widest text-muted-text">ACTIVE ORDERS</span>
                  <span className="mt-1.5 text-lg font-black text-white">{totals.totalOrdersCount}</span>
                  <span className="text-4xs text-primary-coral mt-1">{totals.newOrders} New Order arrivals</span>
                </div>

                <div className="rounded-2xl border border-border-color bg-card-bg p-4 flex flex-col">
                  <span className="text-4xs font-extrabold uppercase tracking-widest text-muted-text">PRODUCT INVENTORY</span>
                  <span className="mt-1.5 text-lg font-black text-white">{totals.totalProducts}</span>
                  <span className="text-4xs text-muted-text mt-1">Formulations</span>
                </div>

                <div className="rounded-2xl border border-border-color bg-card-bg p-4 flex flex-col">
                  <span className="text-4xs font-extrabold uppercase tracking-widest text-muted-text">LOW STOCK WARNS</span>
                  <span className={`mt-1.5 text-lg font-black ${totals.lowStockProducts > 0 ? "text-accent-orange" : "text-success-green"}`}>
                    {totals.lowStockProducts}
                  </span>
                  <span className="text-4xs text-muted-text mt-1">Low/Out products</span>
                </div>

              </div>

              {/* Graphical representation bar & Low stock alert panel */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                
                {/* Sales vs Expenses Custom SVG Graph */}
                <div className="lg:col-span-8 rounded-2xl border border-border-color bg-card-bg p-6">
                  <h3 className="text-xs font-black uppercase tracking-widest text-white mb-6">Financial Balance Chart</h3>
                  
                  {/* SVG Bar Chart */}
                  <div className="w-full h-64 relative flex items-end justify-between px-6 pt-4 border-b border-border-color pb-1">
                    {/* Background ticks */}
                    <div className="absolute inset-0 flex flex-col justify-between py-4 pointer-events-none pr-6">
                      <div className="border-b border-border-color/10 w-full" />
                      <div className="border-b border-border-color/10 w-full" />
                      <div className="border-b border-border-color/10 w-full" />
                      <div className="border-b border-border-color/10 w-full" />
                    </div>

                    {/* Sales Column */}
                    <div className="flex flex-col items-center gap-2 z-10 w-1/3">
                      <div
                        className="w-16 rounded-t-xl bg-gradient-to-t from-primary-coral to-accent-orange shadow-[0_0_15px_rgba(255,138,117,0.2)]"
                        style={{ height: `${Math.min(180, (totals.totalSales / Math.max(1, totals.totalSales + totals.totalExpenses)) * 180)}px` }}
                      />
                      <span className="text-4xs font-black uppercase tracking-widest text-white">REVENUES</span>
                      <span className="text-2xs font-extrabold text-primary-coral">${totals.totalSales.toFixed(0)}</span>
                    </div>

                    {/* Expenses Column */}
                    <div className="flex flex-col items-center gap-2 z-10 w-1/3">
                      <div
                        className="w-16 rounded-t-xl bg-surface-sec border border-border-color"
                        style={{ height: `${Math.min(180, (totals.totalExpenses / Math.max(1, totals.totalSales + totals.totalExpenses)) * 180)}px` }}
                      />
                      <span className="text-4xs font-black uppercase tracking-widest text-muted-text">EXPENSES</span>
                      <span className="text-2xs font-extrabold text-white">${totals.totalExpenses.toFixed(0)}</span>
                    </div>

                    {/* Net Profit Column */}
                    <div className="flex flex-col items-center gap-2 z-10 w-1/3">
                      <div
                        className={`w-16 rounded-t-xl ${totals.netProfit >= 0 ? "bg-[#10D981] shadow-[0_0_15px_rgba(16,217,129,0.2)]" : "bg-red-500"}`}
                        style={{ height: `${Math.min(180, (Math.abs(totals.netProfit) / Math.max(1, totals.totalSales + totals.totalExpenses)) * 180)}px` }}
                      />
                      <span className="text-4xs font-black uppercase tracking-widest text-white">NET PROFIT</span>
                      <span className="text-2xs font-extrabold text-white">${totals.netProfit.toFixed(0)}</span>
                    </div>

                  </div>
                </div>

                {/* Low Stock Warning Alert List */}
                <div className="lg:col-span-4 rounded-2xl border border-border-color bg-card-bg p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-white mb-4">Stock Alarms</h3>
                    <div className="flex flex-col gap-3">
                      {products.filter((p) => p.stockStatus !== "In Stock").slice(0, 4).map((p) => (
                        <div key={p.id} className="flex justify-between items-center bg-surface-deep border border-border-color rounded-xl p-3">
                          <div>
                            <span className="block text-2xs font-bold text-white truncate max-w-[120px]">{p.name}</span>
                            <span className="text-3xs text-muted-text">SKU: {p.sku}</span>
                          </div>
                          <span className={`text-3xs font-extrabold uppercase px-2 py-0.5 rounded-full ${
                            p.stock === 0 ? "bg-red-500/10 text-red-500" : "bg-primary-coral/10 text-primary-coral"
                          }`}>
                            {p.stock === 0 ? "OUT" : `${p.stock} LEFT`}
                          </span>
                        </div>
                      ))}
                      {products.filter((p) => p.stockStatus !== "In Stock").length === 0 && (
                        <div className="text-center text-xs text-muted-text py-10 uppercase font-bold">
                          All inventory stocked safely.
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab("products")}
                    className="mt-6 text-center text-2xs font-extrabold uppercase tracking-widest text-primary-coral hover:text-white"
                  >
                    MANAGE PRODUCTS CATALOG &gt;
                  </button>
                </div>

              </div>

              {/* Recent Orders List overview */}
              <div className="rounded-2xl border border-border-color bg-card-bg p-6">
                <div className="flex items-center justify-between border-b border-border-color pb-4 mb-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-white">Recent Purchases</h3>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="text-2xs font-extrabold uppercase tracking-wide text-primary-coral hover:underline"
                  >
                    View All Orders
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-border-color text-muted-text uppercase tracking-wider">
                        <th className="pb-3 font-extrabold">Order</th>
                        <th className="pb-3 font-extrabold">Customer</th>
                        <th className="pb-3 font-extrabold">Total</th>
                        <th className="pb-3 font-extrabold">Payment</th>
                        <th className="pb-3 font-extrabold">Status</th>
                        <th className="pb-3 font-extrabold">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map((ord) => (
                        <tr key={ord.id} className="border-b border-border-color/30 last:border-0">
                          <td className="py-3.5 font-bold text-white">{ord.id}</td>
                          <td className="py-3.5">{ord.customerName}</td>
                          <td className="py-3.5 text-primary-coral font-bold">${ord.totalPrice.toFixed(2)}</td>
                          <td className="py-3.5 uppercase">{ord.paymentMethod}</td>
                          <td className="py-3.5">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-3xs font-extrabold uppercase ${
                              ord.status === "Delivered"
                                ? "bg-success-green/10 text-success-green border border-success-green/20"
                                : ord.status === "Cancelled"
                                ? "bg-red-500/10 text-red-500 border border-red-500/20"
                                : "bg-primary-coral/10 text-primary-coral border border-primary-coral/20"
                            }`}>
                              {ord.status}
                            </span>
                          </td>
                          <td className="py-3.5">
                            <button
                              onClick={() => setSelectedOrderDetails(ord)}
                              className="text-2xs font-black uppercase text-primary-coral hover:text-white"
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: PRODUCT MANAGEMENT */}
          {activeTab === "products" && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between border-b border-border-color pb-4">
                <span className="text-xs font-bold text-soft-text uppercase">Inventory Database</span>
                <button
                  onClick={() => openProductForm(null)}
                  className="flex items-center gap-2 rounded-xl bg-primary-coral px-4 py-2.5 text-xs font-black tracking-widest text-main-bg hover:bg-white transition-luxury shadow-lg"
                >
                  <Icon name="plus" size={14} />
                  ADD FORMULATION
                </button>
              </div>

              {/* Data Table */}
              <div className="rounded-2xl border border-border-color bg-card-bg p-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-border-color text-muted-text uppercase tracking-wider">
                        <th className="pb-3 font-extrabold">Formulation</th>
                        <th className="pb-3 font-extrabold">Category</th>
                        <th className="pb-3 font-extrabold">SKU</th>
                        <th className="pb-3 font-extrabold">Base Price</th>
                        <th className="pb-3 font-extrabold">Stock Count</th>
                        <th className="pb-3 font-extrabold">Status</th>
                        <th className="pb-3 font-extrabold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((prod) => (
                        <tr key={prod.id} className="border-b border-border-color/30 last:border-0 hover:bg-surface-deep/20">
                          <td className="py-3.5 flex items-center gap-3">
                            <div className="h-10 w-8 bg-surface-deep border border-border-color rounded p-0.5 flex items-center justify-center shrink-0">
                              <ProductImage color={prod.imageColor} type={prod.imageType} glow={false} className="h-8 w-full" />
                            </div>
                            <div>
                              <span className="block font-bold text-white">{prod.name}</span>
                              <span className="text-3xs text-muted-text font-bold uppercase">{prod.size}</span>
                            </div>
                          </td>
                          <td className="py-3.5 uppercase">{prod.category}</td>
                          <td className="py-3.5 font-mono text-3xs text-muted-text">{prod.sku}</td>
                          <td className="py-3.5 text-primary-coral font-bold">${prod.price.toFixed(2)}</td>
                          <td className="py-3.5">{prod.stock}</td>
                          <td className="py-3.5">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-3xs font-extrabold uppercase ${
                              prod.stockStatus === "In Stock"
                                ? "bg-success-green/10 text-success-green border border-success-green/20"
                                : prod.stockStatus === "Low Stock"
                                ? "bg-accent-orange/10 text-accent-orange border border-accent-orange/20"
                                : "bg-red-500/10 text-red-500 border border-red-500/20"
                            }`}>
                              {prod.stockStatus}
                            </span>
                          </td>
                          <td className="py-3.5 text-right flex justify-end gap-3.5">
                            <button
                              onClick={() => editProduct(prod.id, { visible: !prod.visible })}
                              className={`p-1.5 rounded-lg border ${
                                prod.visible
                                  ? "border-success-green/20 bg-success-green/5 text-success-green hover:bg-success-green/10"
                                  : "border-border-color bg-surface-deep text-muted-text hover:text-white"
                              }`}
                              title={prod.visible ? "Deactivate Visibility" : "Activate Visibility"}
                            >
                              <Icon name="power" size={14} />
                            </button>
                            <button
                              onClick={() => openProductForm(prod)}
                              className="p-1.5 rounded-lg border border-border-color bg-surface-deep text-soft-text hover:text-primary-coral hover:border-primary-coral transition-luxury"
                              title="Edit product details"
                            >
                              <Icon name="edit" size={14} />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Confirm deletion of ${prod.name}?`)) deleteProduct(prod.id);
                              }}
                              className="p-1.5 rounded-lg border border-border-color bg-surface-deep text-muted-text hover:text-accent-orange hover:border-accent-orange/40 transition-luxury"
                              title="Delete product"
                            >
                              <Icon name="trash" size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CATEGORY MANAGEMENT */}
          {activeTab === "categories" && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between border-b border-border-color pb-4">
                <span className="text-xs font-bold text-soft-text uppercase font-semibold">Goal Sectors</span>
                <button
                  onClick={() => {
                    setEditingCategoryId(null);
                    setCatName("");
                    setCatColor("#FF8A75");
                    setCatVisible(true);
                    setCategoryModalOpen(true);
                  }}
                  className="flex items-center gap-2 rounded-xl bg-primary-coral px-4 py-2.5 text-xs font-black tracking-widest text-main-bg hover:bg-white transition-luxury shadow-lg"
                >
                  <Icon name="plus" size={14} />
                  CREATE CATEGORY
                </button>
              </div>

              {/* Grid categories panel */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((cat) => (
                  <div key={cat.id} className="rounded-2xl border border-border-color bg-card-bg p-5 flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="h-10 w-10 rounded-xl flex items-center justify-center border border-border-color"
                          style={{ backgroundColor: `${cat.imageColor}10` }}
                        >
                          <Icon name="category" size={18} style={{ color: cat.imageColor }} />
                        </div>
                        <div>
                          <h3 className="text-xs font-black uppercase tracking-wider text-white">{cat.name}</h3>
                          <span className="text-4xs font-mono text-muted-text">SLUG: {cat.slug}</span>
                        </div>
                      </div>
                      
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-4xs font-extrabold uppercase ${
                        cat.visible ? "bg-success-green/10 text-success-green" : "bg-muted-text/10 text-muted-text"
                      }`}>
                        {cat.visible ? "ACTIVE" : "HIDDEN"}
                      </span>
                    </div>

                    <div className="mt-6 flex gap-2 justify-end border-t border-border-color pt-4">
                      <button
                        onClick={() => editCategory(cat.id, { visible: !cat.visible })}
                        className="rounded-lg border border-border-color bg-surface-deep px-3 py-1.5 text-2xs font-extrabold text-soft-text hover:text-white"
                      >
                        {cat.visible ? "Hide from Shop" : "Show in Shop"}
                      </button>
                      <button
                        onClick={() => {
                          setEditingCategoryId(cat.id);
                          setCatName(cat.name);
                          setCatColor(cat.imageColor);
                          setCatVisible(cat.visible);
                          setCategoryModalOpen(true);
                        }}
                        className="rounded-lg border border-border-color bg-surface-deep p-1.5 text-soft-text hover:text-primary-coral hover:border-primary-coral"
                      >
                        <Icon name="edit" size={14} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Confirm deletion of ${cat.name}?`)) deleteCategory(cat.id);
                        }}
                        className="rounded-lg border border-border-color bg-surface-deep p-1.5 text-muted-text hover:text-accent-orange"
                      >
                        <Icon name="trash" size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ORDER MANAGEMENT */}
          {activeTab === "orders" && (
            <div className="flex flex-col gap-6">
              <div className="border-b border-border-color pb-4">
                <span className="text-xs font-bold text-soft-text uppercase font-semibold">Secure Purchases Ledger</span>
              </div>

              <div className="rounded-2xl border border-border-color bg-card-bg p-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-border-color text-muted-text uppercase tracking-wider">
                        <th className="pb-3 font-extrabold">Order ID</th>
                        <th className="pb-3 font-extrabold">Client</th>
                        <th className="pb-3 font-extrabold">Date</th>
                        <th className="pb-3 font-extrabold">Total Cost</th>
                        <th className="pb-3 font-extrabold">Method</th>
                        <th className="pb-3 font-extrabold">Order Status</th>
                        <th className="pb-3 font-extrabold text-right">Ledger Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((ord) => (
                        <tr key={ord.id} className="border-b border-border-color/30 last:border-0 hover:bg-surface-deep/20">
                          <td className="py-3.5 font-bold text-white">{ord.id}</td>
                          <td className="py-3.5">
                            <div>
                              <span className="block font-semibold text-white">{ord.customerName}</span>
                              <span className="text-3xs text-muted-text">{ord.customerPhone}</span>
                            </div>
                          </td>
                          <td className="py-3.5 text-muted-text text-3xs font-semibold">
                            {new Date(ord.orderDate).toLocaleString()}
                          </td>
                          <td className="py-3.5 text-primary-coral font-bold">${ord.totalPrice.toFixed(2)}</td>
                          <td className="py-3.5 uppercase">{ord.paymentMethod}</td>
                          <td className="py-3.5">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-3xs font-extrabold uppercase ${
                              ord.status === "Delivered"
                                ? "bg-success-green/10 text-success-green border border-success-green/20 shadow-[0_0_6px_#10D9811A]"
                                : ord.status === "Cancelled" || ord.status === "Rejected"
                                ? "bg-red-500/10 text-red-500 border border-red-500/20"
                                : "bg-primary-coral/10 text-primary-coral border border-primary-coral/20"
                            }`}>
                              {ord.status}
                            </span>
                          </td>
                          <td className="py-3.5 text-right flex justify-end gap-3">
                            <button
                              onClick={() => setSelectedOrderDetails(ord)}
                              className="rounded-lg border border-border-color bg-surface-deep px-3 py-1.5 text-2xs font-extrabold text-soft-text hover:text-white"
                            >
                              Verify Details
                            </button>
                            {ord.status === "New Order" && (
                              <button
                                onClick={() => confirmOrder(ord.id)}
                                className="rounded-lg bg-success-green/10 border border-success-green/20 px-3 py-1.5 text-2xs font-extrabold text-success-green hover:bg-success-green hover:text-main-bg transition-luxury"
                              >
                                Confirm
                              </button>
                            )}
                            {ord.status !== "Cancelled" && ord.status !== "Delivered" && (
                              <button
                                onClick={() => cancelOrder(ord.id)}
                                className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-1.5 text-2xs font-extrabold text-red-500 hover:bg-red-500 hover:text-white transition-luxury"
                              >
                                Cancel
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CUSTOMER MANAGEMENT */}
          {activeTab === "customers" && (
            <div className="flex flex-col gap-6">
              <div className="border-b border-border-color pb-4">
                <span className="text-xs font-bold text-soft-text uppercase font-semibold">Active Client Base</span>
              </div>

              <div className="rounded-2xl border border-border-color bg-card-bg p-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-border-color text-muted-text uppercase tracking-wider">
                        <th className="pb-3 font-extrabold">Customer Name</th>
                        <th className="pb-3 font-extrabold">Contact Info</th>
                        <th className="pb-3 font-extrabold">Delivery Base</th>
                        <th className="pb-3 font-extrabold">Order Count</th>
                        <th className="pb-3 font-extrabold">Total stack Spent</th>
                        <th className="pb-3 font-extrabold">Join Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customers.map((cust) => (
                        <tr key={cust.id} className="border-b border-border-color/30 last:border-0 hover:bg-surface-deep/20">
                          <td className="py-3.5 font-bold text-white flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary-coral/10 border border-primary-coral/30 flex items-center justify-center text-primary-coral font-bold text-xs uppercase">
                              {cust.name[0]}
                            </div>
                            {cust.name}
                          </td>
                          <td className="py-3.5">
                            <div>
                              <span className="block font-medium text-white">{cust.email}</span>
                              <span className="text-3xs text-muted-text">{cust.phone}</span>
                            </div>
                          </td>
                          <td className="py-3.5 text-muted-text max-w-xs truncate">{cust.address}, {cust.city}</td>
                          <td className="py-3.5 font-bold">{cust.orderCount} Orders</td>
                          <td className="py-3.5 text-primary-coral font-bold">${cust.totalSpent.toFixed(2)}</td>
                          <td className="py-3.5 text-muted-text text-3xs font-semibold">{cust.joinDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: HOME PAGE CONTROL (CMS) */}
          {activeTab === "homepage" && (
            <div className="flex flex-col gap-6">
              <div className="border-b border-border-color pb-4">
                <span className="text-xs font-bold text-soft-text uppercase font-semibold">Storefront layout CMS Control</span>
              </div>

              <form onSubmit={handleCmsSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Banner contents */}
                <div className="rounded-2xl border border-border-color bg-card-bg p-6 flex flex-col gap-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-white border-b border-border-color pb-3">Hero Section Configurations</h3>
                  
                  <div>
                    <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Promo badge label</label>
                    <input
                      type="text"
                      value={cmsPromoBadge}
                      onChange={(e) => setCmsPromoBadge(e.target.value)}
                      className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Hero main title</label>
                    <input
                      type="text"
                      value={cmsHeroTitle}
                      onChange={(e) => setCmsHeroTitle(e.target.value)}
                      className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Hero subtitle description</label>
                    <textarea
                      value={cmsHeroSubtitle}
                      onChange={(e) => setCmsHeroSubtitle(e.target.value)}
                      className="w-full h-24 rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Hero CTA Button Label</label>
                      <input
                        type="text"
                        value={cmsHeroCtaText}
                        onChange={(e) => setCmsHeroCtaText(e.target.value)}
                        className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Hero CTA Button Link</label>
                      <input
                        type="text"
                        value={cmsHeroCtaLink}
                        onChange={(e) => setCmsHeroCtaLink(e.target.value)}
                        className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Science banner CMS */}
                <div className="rounded-2xl border border-border-color bg-card-bg p-6 flex flex-col gap-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-white border-b border-border-color pb-3">Science Banner Configurations</h3>

                  <div>
                    <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Science Section Title</label>
                    <input
                      type="text"
                      value={cmsFirstTitle}
                      onChange={(e) => setCmsFirstTitle(e.target.value)}
                      className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Science Section Subtitle</label>
                    <textarea
                      value={cmsFirstSubtitle}
                      onChange={(e) => setCmsFirstSubtitle(e.target.value)}
                      className="w-full h-24 rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Science Section CTA Label</label>
                    <input
                      type="text"
                      value={cmsFirstCtaText}
                      onChange={(e) => setCmsFirstCtaText(e.target.value)}
                      className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white"
                    />
                  </div>

                  {/* Logo CMS */}
                  <div className="grid grid-cols-2 gap-3 border-t border-border-color/30 pt-4 mt-2">
                    <div>
                      <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Brand logo header text</label>
                      <input
                        type="text"
                        value={cmsLogo}
                        onChange={(e) => setCmsLogo(e.target.value)}
                        className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Brand Name reference</label>
                      <input
                        type="text"
                        value={cmsBrand}
                        onChange={(e) => setCmsBrand(e.target.value)}
                        className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-primary-coral py-3.5 text-xs font-black tracking-widest text-main-bg hover:bg-white transition-luxury shadow-lg mt-auto"
                  >
                    SYNC STOREFRONT BANNERS
                    <Icon name="check" size={14} />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 7: COUPON MANAGEMENT */}
          {activeTab === "coupons" && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between border-b border-border-color pb-4">
                <span className="text-xs font-bold text-soft-text uppercase font-semibold">Promotional Discounts Builder</span>
                <button
                  onClick={() => {
                    setEditingCouponId(null);
                    setCoupCode("");
                    setCoupType("percentage");
                    setCoupValue("");
                    setCoupExpiry("");
                    setCoupLimit("");
                    setCoupMinOrder("");
                    setCoupActive(true);
                    setCouponModalOpen(true);
                  }}
                  className="flex items-center gap-2 rounded-xl bg-primary-coral px-4 py-2.5 text-xs font-black tracking-widest text-main-bg hover:bg-white transition-luxury shadow-lg"
                >
                  <Icon name="plus" size={14} />
                  ADD COUPON
                </button>
              </div>

              {/* Coupons display table */}
              <div className="rounded-2xl border border-border-color bg-card-bg p-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-border-color text-muted-text uppercase tracking-wider">
                        <th className="pb-3 font-extrabold">Promo Code</th>
                        <th className="pb-3 font-extrabold">Discount Value</th>
                        <th className="pb-3 font-extrabold">Min Total Limit</th>
                        <th className="pb-3 font-extrabold">Expiry Term</th>
                        <th className="pb-3 font-extrabold">Usage Stats</th>
                        <th className="pb-3 font-extrabold">Status</th>
                        <th className="pb-3 font-extrabold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {coupons.map((c) => (
                        <tr key={c.id} className="border-b border-border-color/30 last:border-0 hover:bg-surface-deep/20">
                          <td className="py-3.5 font-bold text-white font-mono">{c.code}</td>
                          <td className="py-3.5 font-bold">
                            {c.discountType === "percentage" ? `${c.discountValue}% Off` : `$${c.discountValue} Fixed`}
                          </td>
                          <td className="py-3.5 text-muted-text font-bold">${c.minOrderAmount} min</td>
                          <td className="py-3.5 text-3xs font-semibold text-muted-text">{c.expiryDate}</td>
                          <td className="py-3.5">
                            {c.usageCount} / {c.usageLimit}
                          </td>
                          <td className="py-3.5">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-4xs font-extrabold uppercase ${
                              c.active && new Date(c.expiryDate) > new Date()
                                ? "bg-success-green/10 text-success-green"
                                : "bg-red-500/10 text-red-500"
                            }`}>
                              {c.active && new Date(c.expiryDate) > new Date() ? "ACTIVE" : "EXPIRED/INACTIVE"}
                            </span>
                          </td>
                          <td className="py-3.5 text-right flex justify-end gap-3.5">
                            <button
                              onClick={() => editCoupon(c.id, { active: !c.active })}
                              className="rounded-lg border border-border-color bg-surface-deep px-3 py-1.5 text-2xs font-extrabold text-soft-text hover:text-white"
                            >
                              Toggle
                            </button>
                            <button
                              onClick={() => {
                                setEditingCouponId(c.id);
                                setCoupCode(c.code);
                                setCoupType(c.discountType);
                                setCoupValue(c.discountValue.toString());
                                setCoupExpiry(c.expiryDate);
                                setCoupLimit(c.usageLimit.toString());
                                setCoupMinOrder(c.minOrderAmount.toString());
                                setCoupActive(c.active);
                                setCouponModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg border border-border-color bg-surface-deep text-soft-text hover:text-primary-coral"
                            >
                              <Icon name="edit" size={14} />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete coupon ${c.code}?`)) deleteCoupon(c.id);
                              }}
                              className="p-1.5 rounded-lg border border-border-color bg-surface-deep text-muted-text hover:text-accent-orange"
                            >
                              <Icon name="trash" size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: EXPENSES MANAGEMENT */}
          {activeTab === "expenses" && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between border-b border-border-color pb-4">
                <span className="text-xs font-bold text-soft-text uppercase font-semibold">Operational Brand Expenses</span>
                <button
                  onClick={() => {
                    setEditingExpenseId(null);
                    setExpTitle("");
                    setExpCategory("Product purchasing cost");
                    setExpAmount("");
                    setExpDate("");
                    setExpPayMethod("Bank Transfer");
                    setExpNotes("");
                    setExpenseModalOpen(true);
                  }}
                  className="flex items-center gap-2 rounded-xl bg-primary-coral px-4 py-2.5 text-xs font-black tracking-widest text-main-bg hover:bg-white transition-luxury shadow-lg"
                >
                  <Icon name="plus" size={14} />
                  ADD EXPENSE
                </button>
              </div>

              {/* Exp summary stats */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-border-color bg-card-bg p-5 text-center">
                  <span className="text-4xs font-extrabold uppercase tracking-widest text-muted-text">TOTAL OUTFLOWS</span>
                  <span className="block mt-2 text-xl font-black text-white">${totals.totalExpenses.toFixed(2)}</span>
                </div>
                <div className="rounded-2xl border border-border-color bg-card-bg p-5 text-center">
                  <span className="text-4xs font-extrabold uppercase tracking-widest text-muted-text">HIGHEST OUTFLOW CATEGORY</span>
                  <span className="block mt-2 text-sm font-black text-primary-coral uppercase truncate">
                    {expensesByCategory[0]?.[0] || "None"}
                  </span>
                </div>
                <div className="rounded-2xl border border-border-color bg-card-bg p-5 text-center">
                  <span className="text-4xs font-extrabold uppercase tracking-widest text-muted-text">MONTHLY EXPENSES</span>
                  <span className="block mt-2 text-xl font-black text-white">
                    ${expenses.filter(e => e.date.includes("2026-06")).reduce((acc, curr) => acc + curr.amount, 0).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Table Ledger list */}
              <div className="rounded-2xl border border-border-color bg-card-bg p-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-border-color text-muted-text uppercase tracking-wider">
                        <th className="pb-3 font-extrabold">Expense Purpose</th>
                        <th className="pb-3 font-extrabold">Category classification</th>
                        <th className="pb-3 font-extrabold">Amount paid</th>
                        <th className="pb-3 font-extrabold">Date</th>
                        <th className="pb-3 font-extrabold">Method</th>
                        <th className="pb-3 font-extrabold">Notes</th>
                        <th className="pb-3 font-extrabold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expenses.map((e) => (
                        <tr key={e.id} className="border-b border-border-color/30 last:border-0 hover:bg-surface-deep/20">
                          <td className="py-3.5 font-bold text-white">{e.title}</td>
                          <td className="py-3.5 uppercase text-3xs font-semibold text-muted-text">{e.category}</td>
                          <td className="py-3.5 font-black text-accent-orange">${e.amount.toFixed(2)}</td>
                          <td className="py-3.5 text-muted-text text-3xs font-semibold">{e.date}</td>
                          <td className="py-3.5 uppercase">{e.paymentMethod}</td>
                          <td className="py-3.5 text-muted-text max-w-xs truncate">{e.notes || "—"}</td>
                          <td className="py-3.5 text-right flex justify-end gap-3">
                            <button
                              onClick={() => {
                                setEditingExpenseId(e.id);
                                setExpTitle(e.title);
                                setExpCategory(e.category);
                                setExpAmount(e.amount.toString());
                                setExpDate(e.date);
                                setExpPayMethod(e.paymentMethod);
                                setExpNotes(e.notes || "");
                                setExpenseModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg border border-border-color bg-surface-deep text-soft-text hover:text-primary-coral"
                            >
                              <Icon name="edit" size={14} />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Remove expense record for ${e.title}?`)) deleteExpense(e.id);
                              }}
                              className="p-1.5 rounded-lg border border-border-color bg-surface-deep text-muted-text hover:text-accent-orange"
                            >
                              <Icon name="trash" size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: REPORTS */}
          {activeTab === "reports" && (
            <div className="flex flex-col gap-6">
              {/* Date Filters bar */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border-color pb-4">
                <span className="text-xs font-bold text-soft-text uppercase font-semibold">Brand Diagnostic Reports</span>
                
                <div className="flex items-center gap-3">
                  <span className="text-3xs font-black uppercase tracking-widest text-muted-text">Range:</span>
                  <input
                    type="date"
                    value={reportStartDate}
                    onChange={(e) => setReportStartDate(e.target.value)}
                    className="rounded-xl border border-border-color bg-surface-deep px-3 py-1.5 text-xs text-white"
                  />
                  <span className="text-muted-text">—</span>
                  <input
                    type="date"
                    value={reportEndDate}
                    onChange={(e) => setReportEndDate(e.target.value)}
                    className="rounded-xl border border-border-color bg-surface-deep px-3 py-1.5 text-xs text-white"
                  />
                </div>
              </div>

              {/* Reports dynamic HUD calculations */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                
                {/* Profit calculations breakdowns */}
                <div className="rounded-2xl border border-border-color bg-card-bg p-6 flex flex-col gap-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-white border-b border-border-color pb-3">Net Profit Calculations</h3>
                  
                  <div className="flex justify-between items-center text-xs text-soft-text border-b border-border-color/30 pb-3">
                    <span>Gross Sales Revenues</span>
                    <span className="font-extrabold text-white">${totals.totalSales.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center text-xs text-soft-text border-b border-border-color/30 pb-3">
                    <span>Operational Business Expenses</span>
                    <span className="font-extrabold text-accent-orange">-${totals.totalExpenses.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center text-sm font-black uppercase tracking-wider py-2">
                    <span>Real Net Profit</span>
                    <span className={`text-lg font-black ${totals.netProfit >= 0 ? "text-success-green" : "text-red-500"}`}>
                      ${totals.netProfit.toFixed(2)}
                    </span>
                  </div>

                  <div className="bg-surface-deep rounded-xl p-4 border border-border-color mt-2 flex flex-col gap-2">
                    <span className="text-4xs font-extrabold uppercase tracking-widest text-muted-text">PROFIT MARGIN RATIO</span>
                    <span className="text-xl font-black text-white">
                      {totals.totalSales > 0 ? `${((totals.netProfit / totals.totalSales) * 100).toFixed(1)}%` : "0.0%"}
                    </span>
                  </div>
                </div>

                {/* Expense allocations graph classifications */}
                <div className="rounded-2xl border border-border-color bg-card-bg p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-white border-b border-border-color pb-3 mb-4">Expenses Allocations by Category</h3>
                    <div className="flex flex-col gap-3 max-h-56 overflow-y-auto pr-1">
                      {expensesByCategory.map(([category, amount]) => (
                        <div key={category} className="flex flex-col gap-1.5">
                          <div className="flex justify-between text-3xs font-bold text-soft-text uppercase">
                            <span>{category}</span>
                            <span>${amount.toFixed(0)} ({((amount / Math.max(1, totals.totalExpenses)) * 100).toFixed(0)}%)</span>
                          </div>
                          {/* percentage indicator strip */}
                          <div className="w-full bg-surface-deep h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-primary-coral h-full rounded-full"
                              style={{ width: `${(amount / Math.max(1, totals.totalExpenses)) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                      {expensesByCategory.length === 0 && (
                        <div className="text-center text-xs text-muted-text py-10 uppercase font-bold">
                          No expense logs written yet.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 10: SETTINGS */}
          {activeTab === "settings" && (
            <div className="flex flex-col gap-6">
              <div className="border-b border-border-color pb-4">
                <span className="text-xs font-bold text-soft-text uppercase font-semibold">Store configurations</span>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                
                {/* Store variables settings */}
                <form onSubmit={handleGlobalSettingsSubmit} className="rounded-2xl border border-border-color bg-card-bg p-6 flex flex-col gap-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-white border-b border-border-color pb-3">Operational Taxes & Delivery fees</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Base Shipping Cost ($)</label>
                      <input
                        type="number"
                        value={setShipping}
                        onChange={(e) => setSetShipping(e.target.value)}
                        className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">State Tax Rate (%)</label>
                      <input
                        type="number"
                        value={setTax}
                        onChange={(e) => setSetTax(e.target.value)}
                        className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="border-t border-border-color/30 pt-4 mt-2 flex flex-col gap-4">
                    <h4 className="text-2xs font-black uppercase tracking-widest text-white">Support Channels Contact</h4>
                    <div>
                      <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Customer Service Email</label>
                      <input
                        type="email"
                        value={setContactEmail}
                        onChange={(e) => setSetContactEmail(e.target.value)}
                        className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Support Helpline Phone</label>
                      <input
                        type="text"
                        value={setContactPhone}
                        onChange={(e) => setSetContactPhone(e.target.value)}
                        className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Office Address</label>
                      <input
                        type="text"
                        value={setAddress}
                        onChange={(e) => setSetAddress(e.target.value)}
                        className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-primary-coral py-3.5 text-xs font-black tracking-widest text-main-bg hover:bg-white transition-luxury shadow-lg mt-4"
                  >
                    SYNC OPERATION VARIABLES
                    <Icon name="check" size={14} />
                  </button>
                </form>

                {/* Profile credentials configurations */}
                <div className="rounded-2xl border border-border-color bg-card-bg p-6 flex flex-col gap-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-white border-b border-border-color pb-3">Admin Profile Credentials</h3>

                  <div>
                    <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Registered Admin Email</label>
                    <input
                      type="email"
                      disabled
                      value="admin@valens.com"
                      className="w-full rounded-xl border border-border-color bg-surface-deep/40 px-4 py-2.5 text-xs text-muted-text cursor-not-allowed"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 mt-2">
                    <div>
                      <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">New Password Key</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Confirm New Password Key</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => showToast("Admin profile credentials saved", "success")}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-primary-coral py-3.5 text-xs font-black tracking-widest text-main-bg hover:bg-white transition-luxury shadow-lg mt-auto"
                  >
                    SAVE PROFILE CREDENTIALS
                    <Icon name="check" size={14} />
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>

      </main>

      {/* ----------------- POPUP MODALS ----------------- */}
      
      {/* 1. PRODUCT ADD / EDIT MODAL */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl border border-border-color bg-card-bg p-6 shadow-2xl glass-panel max-h-[90vh] overflow-y-auto animate-slide-in relative">
            <button
              onClick={() => setProductModalOpen(false)}
              className="absolute right-4 top-4 text-muted-text hover:text-white"
            >
              <Icon name="close" size={20} />
            </button>
            <h2 className="text-base font-black uppercase tracking-wider text-white border-b border-border-color pb-3 mb-5">
              {editingProductId ? "Modify Formulation Specifications" : "Create New Supplement Formulation"}
            </h2>

            <form onSubmit={handleProductSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Supplement Name *</label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  className="w-full rounded-xl border border-border-color bg-surface-deep px-3.5 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Category Sector *</label>
                <select
                  value={prodCategory}
                  onChange={(e) => setProdCategory(e.target.value)}
                  className="w-full rounded-xl border border-border-color bg-surface-deep px-3.5 py-2 text-xs text-white focus:outline-none uppercase"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 col-span-1">
                <div>
                  <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Base Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    className="w-full rounded-xl border border-border-color bg-surface-deep px-3.5 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Discount Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={prodDiscountPrice}
                    onChange={(e) => setProdDiscountPrice(e.target.value)}
                    className="w-full rounded-xl border border-border-color bg-surface-deep px-3.5 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 col-span-1">
                <div>
                  <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Serving weight *</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. 2kg, 400g, 120 Caps"
                    value={prodSize}
                    onChange={(e) => setProdSize(e.target.value)}
                    className="w-full rounded-xl border border-border-color bg-surface-deep px-3.5 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">SKU Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="VL-WH-2KG"
                    value={prodSku}
                    onChange={(e) => setProdSku(e.target.value)}
                    className="w-full rounded-xl border border-border-color bg-surface-deep px-3.5 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Flavors (comma separated) *</label>
                <input
                  type="text"
                  required
                  placeholder="Gourmet Chocolate, Rich Vanilla"
                  value={prodVariants}
                  onChange={(e) => setProdVariants(e.target.value)}
                  className="w-full rounded-xl border border-border-color bg-surface-deep px-3.5 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Initial Stock Quantity *</label>
                <input
                  type="number"
                  required
                  value={prodStock}
                  onChange={(e) => setProdStock(e.target.value)}
                  className="w-full rounded-xl border border-border-color bg-surface-deep px-3.5 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Product Description *</label>
                <textarea
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  className="w-full h-20 rounded-xl border border-border-color bg-surface-deep px-3.5 py-2 text-xs text-white focus:outline-none resize-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Active Ingredients (comma separated)</label>
                <input
                  type="text"
                  placeholder="Whey Isolate, Stevia, Cocoa"
                  value={prodIngredients}
                  onChange={(e) => setProdIngredients(e.target.value)}
                  className="w-full rounded-xl border border-border-color bg-surface-deep px-3.5 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Suggested Usage instructions</label>
                <input
                  type="text"
                  value={prodUsage}
                  onChange={(e) => setProdUsage(e.target.value)}
                  className="w-full rounded-xl border border-border-color bg-surface-deep px-3.5 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Formulation Benefits (one per line)</label>
                <textarea
                  value={prodBenefits}
                  onChange={(e) => setProdBenefits(e.target.value)}
                  className="w-full h-20 rounded-xl border border-border-color bg-surface-deep px-3.5 py-2 text-xs text-white focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 col-span-1">
                <div>
                  <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Cap Render Color</label>
                  <input
                    type="color"
                    value={prodImgColor}
                    onChange={(e) => setProdImgColor(e.target.value)}
                    className="w-full h-9 rounded-xl border border-border-color bg-surface-deep px-2 py-1 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Render Type</label>
                  <select
                    value={prodImgType}
                    onChange={(e) => setProdImgType(e.target.value as any)}
                    className="w-full rounded-xl border border-border-color bg-surface-deep px-3.5 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="powder">Powder</option>
                    <option value="capsule">Capsules</option>
                    <option value="liquid">Liquid</option>
                  </select>
                </div>
              </div>

              {/* Status toggles grid */}
              <div className="grid grid-cols-2 gap-3 col-span-1 justify-center py-2.5">
                <label className="flex items-center gap-2 cursor-pointer text-4xs font-extrabold uppercase tracking-widest text-muted-text">
                  <input
                    type="checkbox"
                    checked={prodFeatured}
                    onChange={(e) => setProdFeatured(e.target.checked)}
                    className="rounded border-border-color bg-surface-deep text-primary-coral focus:ring-0 h-4 w-4"
                  />
                  Featured
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-4xs font-extrabold uppercase tracking-widest text-muted-text">
                  <input
                    type="checkbox"
                    checked={prodBestSeller}
                    onChange={(e) => setProdBestSeller(e.target.checked)}
                    className="rounded border-border-color bg-surface-deep text-primary-coral focus:ring-0 h-4 w-4"
                  />
                  Bestseller
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-4xs font-extrabold uppercase tracking-widest text-muted-text">
                  <input
                    type="checkbox"
                    checked={prodNewArrival}
                    onChange={(e) => setProdNewArrival(e.target.checked)}
                    className="rounded border-border-color bg-surface-deep text-primary-coral focus:ring-0 h-4 w-4"
                  />
                  New Arrival
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-4xs font-extrabold uppercase tracking-widest text-muted-text">
                  <input
                    type="checkbox"
                    checked={prodVisible}
                    onChange={(e) => setProdVisible(e.target.checked)}
                    className="rounded border-border-color bg-surface-deep text-primary-coral focus:ring-0 h-4 w-4"
                  />
                  Visible
                </label>
              </div>

              <div className="sm:col-span-2 mt-4">
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-primary-coral py-3.5 text-xs font-black tracking-widest text-main-bg hover:bg-white transition-luxury shadow-lg"
                >
                  SAVE SPECIFICATIONS
                  <Icon name="check" size={14} />
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 2. CATEGORY ADD / EDIT MODAL */}
      {categoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-border-color bg-card-bg p-6 shadow-2xl glass-panel animate-slide-in relative">
            <button
              onClick={() => setCategoryModalOpen(false)}
              className="absolute right-4 top-4 text-muted-text hover:text-white"
            >
              <Icon name="close" size={20} />
            </button>
            <h2 className="text-base font-black uppercase tracking-wider text-white border-b border-border-color pb-3 mb-5">
              {editingCategoryId ? "Edit Goal Category" : "Add Goal Category"}
            </h2>

            <form onSubmit={handleCategorySubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="E.g. Endurance, Power"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Accent Theme Color</label>
                <input
                  type="color"
                  value={catColor}
                  onChange={(e) => setCatColor(e.target.value)}
                  className="w-full h-10 rounded-xl border border-border-color bg-surface-deep px-2 py-1 cursor-pointer"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-4xs font-extrabold uppercase tracking-widest text-muted-text mt-2">
                <input
                  type="checkbox"
                  checked={catVisible}
                  onChange={(e) => setCatVisible(e.target.checked)}
                  className="rounded border-border-color bg-surface-deep text-primary-coral focus:ring-0 h-4 w-4"
                />
                Show Category in Shop Menu
              </label>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-primary-coral py-3.5 text-xs font-black tracking-widest text-main-bg hover:bg-white transition-luxury shadow-lg mt-4"
              >
                SAVE CATEGORY
                <Icon name="check" size={14} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. COUPON BUILDER MODAL */}
      {couponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-border-color bg-card-bg p-6 shadow-2xl glass-panel animate-slide-in relative">
            <button
              onClick={() => setCouponModalOpen(false)}
              className="absolute right-4 top-4 text-muted-text hover:text-white"
            >
              <Icon name="close" size={20} />
            </button>
            <h2 className="text-base font-black uppercase tracking-wider text-white border-b border-border-color pb-3 mb-5">
              {editingCouponId ? "Modify Coupon Rules" : "Create Promo Coupon"}
            </h2>

            <form onSubmit={handleCouponSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="VALENS25"
                  value={coupCode}
                  onChange={(e) => setCoupCode(e.target.value)}
                  className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Discount Type</label>
                  <select
                    value={coupType}
                    onChange={(e) => setCoupType(e.target.value as any)}
                    className="w-full rounded-xl border border-border-color bg-surface-deep px-3 py-2 text-xs text-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed ($)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Discount Value *</label>
                  <input
                    type="number"
                    required
                    value={coupValue}
                    onChange={(e) => setCoupValue(e.target.value)}
                    className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Min Order ($)</label>
                  <input
                    type="number"
                    value={coupMinOrder}
                    onChange={(e) => setCoupMinOrder(e.target.value)}
                    className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Usage Limit</label>
                  <input
                    type="number"
                    value={coupLimit}
                    onChange={(e) => setCoupLimit(e.target.value)}
                    className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Expiry Date *</label>
                <input
                  type="date"
                  required
                  value={coupExpiry}
                  onChange={(e) => setCoupExpiry(e.target.value)}
                  className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2 text-xs text-white"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-4xs font-extrabold uppercase tracking-widest text-muted-text mt-2">
                <input
                  type="checkbox"
                  checked={coupActive}
                  onChange={(e) => setCoupActive(e.target.checked)}
                  className="rounded border-border-color bg-surface-deep text-primary-coral focus:ring-0 h-4 w-4"
                />
                Active immediately
              </label>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-primary-coral py-3.5 text-xs font-black tracking-widest text-main-bg hover:bg-white transition-luxury shadow-lg mt-4"
              >
                SAVE COUPON
                <Icon name="check" size={14} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 4. EXPENSE ADD / EDIT MODAL */}
      {expenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-border-color bg-card-bg p-6 shadow-2xl glass-panel animate-slide-in relative">
            <button
              onClick={() => setExpenseModalOpen(false)}
              className="absolute right-4 top-4 text-muted-text hover:text-white"
            >
              <Icon name="close" size={20} />
            </button>
            <h2 className="text-base font-black uppercase tracking-wider text-white border-b border-border-color pb-3 mb-5">
              {editingExpenseId ? "Edit Expense Entry" : "Log Expense outflow"}
            </h2>

            <form onSubmit={handleExpenseSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Expense Description Title *</label>
                <input
                  type="text"
                  required
                  placeholder="E.g. Matte Black plastic caps procurement"
                  value={expTitle}
                  onChange={(e) => setExpTitle(e.target.value)}
                  className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Expense Category *</label>
                <select
                  value={expCategory}
                  onChange={(e) => setExpCategory(e.target.value as any)}
                  className="w-full rounded-xl border border-border-color bg-surface-deep px-3 py-2 text-xs text-white"
                >
                  <option value="Product purchasing cost">Product purchasing cost</option>
                  <option value="Shipping expenses">Shipping expenses</option>
                  <option value="Marketing and ads">Marketing and ads</option>
                  <option value="Packaging">Packaging</option>
                  <option value="Website maintenance">Website maintenance</option>
                  <option value="Staff salaries">Staff salaries</option>
                  <option value="Storage / warehouse">Storage / warehouse</option>
                  <option value="Delivery company fees">Delivery company fees</option>
                  <option value="Miscellaneous expenses">Miscellaneous expenses</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Amount ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={expAmount}
                    onChange={(e) => setExpAmount(e.target.value)}
                    className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Payment Method</label>
                  <select
                    value={expPayMethod}
                    onChange={(e) => setExpPayMethod(e.target.value)}
                    className="w-full rounded-xl border border-border-color bg-surface-deep px-3 py-2 text-xs text-white"
                  >
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Expense Log Date *</label>
                <input
                  type="date"
                  required
                  value={expDate}
                  onChange={(e) => setExpDate(e.target.value)}
                  className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Notes</label>
                <input
                  type="text"
                  placeholder="Provide reference numbers, details..."
                  value={expNotes}
                  onChange={(e) => setExpNotes(e.target.value)}
                  className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white"
                />
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-primary-coral py-3.5 text-xs font-black tracking-widest text-main-bg hover:bg-white transition-luxury shadow-lg mt-4"
              >
                LOG EXPENSE RECORD
                <Icon name="check" size={14} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 5. ORDER DETAILS VERIFY DRAWER */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl rounded-3xl border border-border-color bg-card-bg p-6 shadow-2xl glass-panel animate-slide-in relative">
            <button
              onClick={() => setSelectedOrderDetails(null)}
              className="absolute right-4 top-4 text-muted-text hover:text-white"
            >
              <Icon name="close" size={20} />
            </button>
            
            <h2 className="text-base font-black uppercase tracking-wider text-white border-b border-border-color pb-3 mb-5">
              Order Details: {selectedOrderDetails.id}
            </h2>

            {/* Client address summary */}
            <div className="grid grid-cols-2 gap-4 text-xs mb-6">
              <div>
                <span className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-1">Customer Name</span>
                <span className="font-bold text-white">{selectedOrderDetails.customerName}</span>
              </div>
              <div>
                <span className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-1">Contact Phone</span>
                <span className="font-bold text-white">{selectedOrderDetails.customerPhone}</span>
              </div>
              <div className="col-span-2">
                <span className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-1">Shipping Destination</span>
                <span className="font-bold text-white">{selectedOrderDetails.customerAddress}, {selectedOrderDetails.customerCity}</span>
              </div>
              <div>
                <span className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-1">Payment Method</span>
                <span className="font-bold text-white uppercase">{selectedOrderDetails.paymentMethod}</span>
              </div>
              <div>
                <span className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-1">Delivery Method</span>
                <span className="font-bold text-white uppercase">{selectedOrderDetails.shippingMethod}</span>
              </div>
              {selectedOrderDetails.notes && (
                <div className="col-span-2 bg-surface-deep p-3 border border-border-color rounded-xl">
                  <span className="block text-4xs font-extrabold uppercase tracking-widest text-primary-coral mb-1">Customer Delivery Notes</span>
                  <p className="italic text-muted-text text-3xs leading-relaxed">"{selectedOrderDetails.notes}"</p>
                </div>
              )}
            </div>

            {/* Products grid */}
            <h4 className="text-3xs font-extrabold uppercase tracking-widest text-muted-text mb-3">Formulations Ordered</h4>
            <div className="flex flex-col gap-2 mb-6 max-h-40 overflow-y-auto pr-1">
              {selectedOrderDetails.items.map((item) => (
                <div key={`${item.productId}-${item.size}-${item.variant}`} className="flex items-center justify-between border-b border-border-color/30 pb-2 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-8 bg-surface-deep border border-border-color rounded p-0.5 flex items-center justify-center shrink-0">
                      <ProductImage color={item.imageColor} type={item.imageType} glow={false} className="h-8 w-full" />
                    </div>
                    <div>
                      <span className="font-bold text-white block truncate max-w-[150px]">{item.productName}</span>
                      <span className="text-4xs text-muted-text uppercase font-semibold">Qty: {item.quantity} • {item.variant} • {item.size}</span>
                    </div>
                  </div>
                  <span className="font-bold text-soft-text">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Calculations summaries */}
            <div className="flex flex-col gap-2 border-t border-border-color pt-4 text-xs text-soft-text mb-6">
              <div className="flex justify-between">
                <span>Coupons Discount</span>
                <span className="text-success-green">-${selectedOrderDetails.discountAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping cost</span>
                <span>${selectedOrderDetails.shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-white text-sm border-t border-border-color/30 pt-2">
                <span>Total Amount Charged</span>
                <span className="text-primary-coral">${selectedOrderDetails.totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Actions workflow */}
            <div className="flex flex-wrap gap-2 justify-end border-t border-border-color pt-4">
              {/* Order Status updates */}
              <div className="flex items-center gap-2 mr-auto">
                <span className="text-4xs font-extrabold uppercase tracking-widest text-muted-text">Change status:</span>
                <select
                  value={selectedOrderDetails.status}
                  onChange={(e) => {
                    updateOrderStatus(selectedOrderDetails.id, e.target.value as any);
                    setSelectedOrderDetails({ ...selectedOrderDetails, status: e.target.value as any });
                  }}
                  className="rounded-lg border border-border-color bg-surface-deep px-2.5 py-1 text-3xs font-bold text-white uppercase"
                >
                  <option value="New Order">New Order</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Preparing">Preparing</option>
                  <option value="Shipped / Out for Delivery">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Returned">Returned</option>
                </select>
              </div>

              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="rounded-full border border-border-color bg-surface-deep px-5 py-2.5 text-2xs font-extrabold text-soft-text hover:text-white"
              >
                CLOSE LEDGER
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
