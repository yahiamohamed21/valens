"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { useApp, Product } from "@/context/AppContext";
import type { ProductVariant } from "@/types/store";
import { Icon } from "@/components/SvgIcons";
import { ProductImage } from "@/components/ProductCard";
import { useTranslation } from "@/context/LanguageContext";
import { Toolbar } from "@/components/pagination/Toolbar";
import { PerPageSelect } from "@/components/pagination/PerPageSelect";
import { LoadingSkeleton } from "@/components/pagination/LoadingSkeleton";
import { Pagination } from "@/components/pagination/Pagination";



type StockStatus = "In Stock" | "Low Stock" | "Out of Stock";
type VariantType = "none" | "size" | "flavor" | "both";
type TabType = "general" | "pricing" | "media" | "specs";

export default function AdminProductsPage() {
  const { t } = useTranslation();
  const {
    products,
    categories,
    addProduct,
    editProduct,
    deleteProduct,
    showToast,
  } = useApp();

  // --- Pagination & Filter States ---
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(8);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading effect for UX
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleSearchQueryChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  };

  const handlePerPageChange = (value: number) => {
    setPerPage(value);
    setCurrentPage(1);
  };

  // --- Modal & Form States ---
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("general");

  const [prodName, setProdName] = useState("");
  const [prodNameAr, setProdNameAr] = useState("");
  const [prodCategory, setProdCategory] = useState("Protein");
  const [prodPrice, setProdPrice] = useState("");
  const [prodDiscountPrice, setProdDiscountPrice] = useState("");
  const [prodDiscountPercent, setProdDiscountPercent] = useState("");
  const [prodSize, setProdSize] = useState("");
  const [prodStock, setProdStock] = useState("");
  const [prodSku, setProdSku] = useState("");
  const [prodDesc, setProdDesc] = useState("");
  const [prodDescAr, setProdDescAr] = useState("");
  const [prodIngredients, setProdIngredients] = useState("");
  const [prodIngredientsAr, setProdIngredientsAr] = useState("");
  const [prodUsage, setProdUsage] = useState("");
  const [prodUsageAr, setProdUsageAr] = useState("");
  const [prodBenefits, setProdBenefits] = useState("");
  const [prodBenefitsAr, setProdBenefitsAr] = useState("");
  const [prodImgColor, setProdImgColor] = useState("#FF8A75");
  const [prodImgType, setProdImgType] = useState<"powder" | "capsule" | "liquid">("powder");
  const [prodFeatured, setProdFeatured] = useState(false);
  const [prodBestSeller, setProdBestSeller] = useState(false);
  const [prodNewArrival, setProdNewArrival] = useState(false);
  const [prodVisible, setProdVisible] = useState(true);
  const [prodMainImage, setProdMainImage] = useState("");
  const [prodImages, setProdImages] = useState<string[]>([]);
  const [prodVariantType, setProdVariantType] = useState<VariantType>("none");
  const [prodVariantsList, setProdVariantsList] = useState<ProductVariant[]>([]);

  // --- Filtered & Paginated Products ---
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           (p.name_ar && p.name_ar.includes(searchQuery));
      const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * perPage;
    return filteredProducts.slice(startIndex, startIndex + perPage);
  }, [filteredProducts, currentPage, perPage]);

  // --- Handlers ---
  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProdMainImage(base64String);
        setProdImages((prev) =>
          prev.includes(base64String) ? prev : [base64String, ...prev]
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          setProdImages((prev) =>
            prev.includes(base64String) ? prev : [...prev, base64String]
          );
          setProdMainImage((curr) => curr || base64String);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleVariantTypeChange = (type: VariantType) => {
    setProdVariantType(type);
    if (type === "none") {
      setProdVariantsList([]);
    } else {
      const base: ProductVariant = {
        id: `var-${Date.now()}-1`,
        price: parseFloat(prodPrice) || 29.99,
        stockQuantity: parseInt(prodStock) || 10,
        sku: prodSku || "VL-SKU-1",
        isAvailable: true,
        size: type === "size" || type === "both" ? "1kg" : undefined,
        flavor: type === "flavor" || type === "both" ? "Gourmet Chocolate" : undefined,
      };
      setProdVariantsList([base]);
    }
  };

  const handlePriceChange = (val: string) => {
    setProdPrice(val);
    const p = parseFloat(val);
    const pct = parseFloat(prodDiscountPercent);
    if (!isNaN(p) && !isNaN(pct) && pct > 0) {
      setProdDiscountPrice((p - (p * pct) / 100).toFixed(2));
    } else {
      setProdDiscountPrice("");
    }
  };

  const handleDiscountPercentChange = (val: string) => {
    setProdDiscountPercent(val);
    const p = parseFloat(prodPrice);
    const pct = parseFloat(val);
    if (!isNaN(p) && !isNaN(pct) && pct > 0) {
      setProdDiscountPrice((p - (p * pct) / 100).toFixed(2));
    } else {
      setProdDiscountPrice("");
    }
  };

  const addVariantItem = () => {
    const newVar: ProductVariant = {
      id: `var-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      size: prodVariantType === "size" || prodVariantType === "both" ? "1kg" : undefined,
      flavor: prodVariantType === "flavor" || prodVariantType === "both" ? "Gourmet Chocolate" : undefined,
      price: parseFloat(prodPrice) || 0,
      discountPrice: prodDiscountPrice ? parseFloat(prodDiscountPrice) : undefined,
      stockQuantity: parseInt(prodStock) || 0,
      sku: `${prodSku || "VL"}-${Date.now().toString().slice(-4)}`,
      isAvailable: true,
    };
    setProdVariantsList([...prodVariantsList, newVar]);
  };

  const updateVariantItem = (id: string, fields: Partial<ProductVariant>) => {
    setProdVariantsList(
      prodVariantsList.map((v) => (v.id === id ? { ...v, ...fields } : v))
    );
  };

  const deleteVariantItem = (id: string) => {
    setProdVariantsList(prodVariantsList.filter((v) => v.id !== id));
  };

  const openProductForm = (prod: Product | null = null) => {
    setActiveTab("general");
    if (prod) {
      setEditingProductId(prod.id);
      setProdName(prod.name);
      setProdNameAr(prod.name_ar || "");
      setProdCategory(prod.category);
      setProdPrice(prod.price.toString());
      setProdDiscountPrice(prod.discountPrice?.toString() || "");
      if (prod.price && prod.discountPrice) {
        setProdDiscountPercent(
          Math.round(((prod.price - prod.discountPrice) / prod.price) * 100).toString()
        );
      } else {
        setProdDiscountPercent("");
      }
      setProdSize(prod.size);
      setProdStock(prod.stock.toString());
      setProdSku(prod.sku);
      setProdDesc(prod.description);
      setProdDescAr(prod.description_ar || "");
      setProdIngredients(prod.ingredients.join(", "));
      setProdIngredientsAr(prod.ingredients_ar?.join(", ") || "");
      setProdUsage(prod.usage);
      setProdUsageAr(prod.usage_ar || "");
      setProdBenefits(prod.benefits.join("\n"));
      setProdBenefitsAr(prod.benefits_ar?.join("\n") || "");
      setProdImgColor(prod.imageColor);
      setProdImgType(prod.imageType);
      setProdFeatured(prod.featured);
      setProdBestSeller(prod.bestSeller);
      setProdNewArrival(prod.newArrival);
      setProdVisible(prod.visible);
      setProdMainImage(prod.mainImage || "");
      setProdImages(prod.images || []);
      setProdVariantType(prod.variantType || "none");
      setProdVariantsList(prod.variants || []);
    } else {
      setEditingProductId(null);
      setProdName("");
      setProdNameAr("");
      setProdCategory(categories[0]?.name || "Protein");
      setProdPrice("");
      setProdDiscountPrice("");
      setProdDiscountPercent("");
      setProdSize("");
      setProdStock("");
      setProdSku("");
      setProdDesc("");
      setProdDescAr("");
      setProdIngredients("");
      setProdIngredientsAr("");
      setProdUsage("");
      setProdUsageAr("");
      setProdBenefits("");
      setProdBenefitsAr("");
      setProdImgColor("#FF8A75");
      setProdImgType("powder");
      setProdFeatured(false);
      setProdBestSeller(false);
      setProdNewArrival(false);
      setProdVisible(true);
      setProdMainImage("");
      setProdImages([]);
      setProdVariantType("none");
      setProdVariantsList([]);
    }
    setProductModalOpen(true);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!prodName) {
      setActiveTab("general");
      showToast(t("messages.required_fields"), "error");
      return;
    }

    if (prodVariantType === "none") {
      if (!prodPrice || isNaN(parseFloat(prodPrice)) || parseFloat(prodPrice) <= 0) {
        setActiveTab("pricing");
        showToast(t("messages.required_fields"), "error");
        return;
      }
      if (!prodStock || isNaN(parseInt(prodStock)) || parseInt(prodStock) < 0) {
        setActiveTab("pricing");
        showToast(t("messages.required_fields"), "error");
        return;
      }
      if (!prodSize) {
        setActiveTab("pricing");
        showToast(t("messages.required_fields"), "error");
        return;
      }
    } else {
      if (prodVariantsList.length === 0) {
        setActiveTab("pricing");
        showToast(t("messages.no_variants_alert"), "error");
        return;
      }
      const invalidVariant = prodVariantsList.some(
        (v) =>
          !v.price ||
          v.stockQuantity === undefined ||
          (prodVariantType === "size" && !v.size) ||
          (prodVariantType === "flavor" && !v.flavor) ||
          (prodVariantType === "both" && (!v.size || !v.flavor))
      );
      if (invalidVariant) {
        setActiveTab("pricing");
        showToast(t("messages.required_fields"), "error");
        return;
      }
    }

    let finalVariants: ProductVariant[] = [];
    let derivedPrice = parseFloat(prodPrice) || 0;
    let derivedDiscount: number | undefined = prodDiscountPrice
      ? parseFloat(prodDiscountPrice)
      : undefined;
    let derivedStock = parseInt(prodStock) || 0;
    let derivedSku = prodSku;
    let derivedSize = prodSize || "1 Tub";

    if (prodVariantType === "none") {
      finalVariants = [
        {
          id: `var-default-${Date.now()}`,
          price: derivedPrice,
          discountPrice: derivedDiscount,
          stockQuantity: derivedStock,
          sku: derivedSku || `VL-${prodName.slice(0, 3).toUpperCase()}`,
          isAvailable: derivedStock > 0,
          size: derivedSize,
        },
      ];
    } else {
      finalVariants = prodVariantsList;
      const prices = finalVariants.map((v) => v.price);
      derivedPrice = Math.min(...prices);
      const discounts = finalVariants
        .map((v) => v.discountPrice)
        .filter((p): p is number => p !== undefined && p > 0);
      derivedDiscount = discounts.length > 0 ? Math.min(...discounts) : undefined;
      derivedStock = finalVariants.reduce((sum, v) => sum + v.stockQuantity, 0);
      derivedSku = finalVariants[0]?.sku || prodSku;
      const uniqueSizes = Array.from(
        new Set(finalVariants.map((v) => v.size).filter((s): s is string => Boolean(s)))
      );
      derivedSize = uniqueSizes.length > 0 ? uniqueSizes.join(", ") : prodSize || "1 Tub";
    }

    const stockStatus: StockStatus =
      derivedStock === 0 ? "Out of Stock" : derivedStock <= 10 ? "Low Stock" : "In Stock";

    const payload = {
      name: prodName,
      category: prodCategory,
      price: derivedPrice,
      discountPrice: derivedDiscount,
      size: derivedSize,
      variants: finalVariants,
      stock: derivedStock,
      stockStatus,
      sku: derivedSku,
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
      rating: 5.0,
      mainImage: prodMainImage,
      images: prodImages,
      variantType: prodVariantType,
      name_ar: prodNameAr || undefined,
      description_ar: prodDescAr || undefined,
      ingredients_ar: prodIngredientsAr
        ? prodIngredientsAr.split(",").map((i) => i.trim()).filter(Boolean)
        : undefined,
      usage_ar: prodUsageAr || undefined,
      benefits_ar: prodBenefitsAr
        ? prodBenefitsAr.split("\n").map((b) => b.trim()).filter(Boolean)
        : undefined,
    };

    if (editingProductId) {
      editProduct(editingProductId, payload);
    } else {
      addProduct(payload);
    }
    setProductModalOpen(false);
  };

  const stockStatusClass = (status: string) => {
    if (status === "In Stock") return "bg-success-green/10 text-success-green border border-success-green/20";
    if (status === "Low Stock") return "bg-accent-orange/10 text-accent-orange border border-accent-orange/20";
    return "bg-red-500/10 text-red-500 border border-red-500/20";
  };

  const tabConfig: { key: TabType; label: string; icon: "settings" | "report" | "box" | "edit" }[] = [
    { key: "general", label: t("admin.modal.tab_general"), icon: "settings" },
    { key: "pricing", label: t("admin.modal.tab_pricing"), icon: "report" },
    { key: "media", label: t("admin.modal.tab_media"), icon: "box" },
    { key: "specs", label: t("admin.modal.tab_specs"), icon: "edit" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-color pb-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold text-white uppercase tracking-widest">
            {t("admin.products.title")}
          </span>
          <span className="text-[10px] text-muted-text">
            {filteredProducts.length} {t("common.total_products") || "Products Total"}
          </span>
        </div>
        <button
          onClick={() => openProductForm(null)}
          className="flex items-center gap-2 rounded-xl bg-primary-coral px-4 py-2.5 text-xs font-black tracking-widest text-main-bg hover:bg-gray-600 transition-luxury shadow-lg"
        >
          <Icon name="plus" size={14} />
          {t("admin.products.add_btn")}
        </button>
      </div>

      {/* Toolbar & PerPage */}
      <div className="flex flex-col gap-4">
        <Toolbar 
          searchQuery={searchQuery}
          onSearchChange={handleSearchQueryChange}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          categories={categories}
        />
        <div className="flex justify-end">
          <PerPageSelect value={perPage} onChange={handlePerPageChange} />
        </div>
      </div>

      {/* Main Content: Grid System */}
      {isLoading ? (
        <LoadingSkeleton />
      ) : filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-border-color rounded-3xl bg-surface-deep/20">
          <Icon name="box" size={48} className="text-muted-text/30 mb-4" />
          <p className="text-sm text-muted-text font-medium">{t("common.no_products") || "No products found"}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
            {paginatedProducts.map((product) => (
              <div 
                key={product.id} 
                className="group relative flex flex-col bg-card-bg border border-border-color/50 rounded-2xl overflow-hidden hover:border-primary-coral/30 transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-primary-coral/5"
              >
                <div className="relative h-52 bg-surface-deep/30 p-4 flex items-center justify-center overflow-hidden">
                  <ProductImage 
                    color={product.imageColor} 
                    type={product.imageType} 
                    className="h-full w-auto object-contain transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter border ${stockStatusClass(product.stockStatus)}`}>
                      {product.stockStatus}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    <button 
                      onClick={() => openProductForm(product)}
                      className="p-2.5 bg-white text-main-bg rounded-xl hover:bg-primary-coral hover:text-white transition-colors"
                    >
                      <Icon name="edit" size={16} />
                    </button>
                    <button 
                      onClick={() => deleteProduct(product.id)}
                      className="p-2.5 bg-white text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-colors"
                    >
                      <Icon name="trash" size={16} />
                    </button>
                  </div>
                </div>
                <div className="p-5 flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-primary-coral uppercase tracking-widest">{product.category}</span>
                    <h3 className="text-sm font-black text-white line-clamp-1">{product.name}</h3>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-white">${product.price.toFixed(2)}</span>
                      {product.discountPrice && (
                        <span className="text-[10px] text-muted-text line-through">${product.discountPrice.toFixed(2)}</span>
                      )}
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] text-muted-text font-bold uppercase">{t("admin.modal.stock_qty")}: {product.stock}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Pagination 
            totalItems={filteredProducts.length}
            currentPage={currentPage}
            perPage={perPage}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      {/* Product Modal */}
      {productModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden bg-main-bg border border-border-color rounded-3xl shadow-2xl flex flex-col animate-slide-up">
            <div className="flex items-center justify-between p-5 border-b border-border-color bg-card-bg/30">
              <div className="flex flex-col">
                <h2 className="text-sm font-black text-white uppercase tracking-widest">
                  {editingProductId ? t("admin.products.edit_btn") : t("admin.products.add_btn")}
                </h2>
                <span className="text-[10px] text-muted-text font-bold uppercase tracking-tighter mt-0.5">
                  Product Management System v2.0
                </span>
              </div>
              <button onClick={() => setProductModalOpen(false)} className="p-2 text-muted-text hover:text-white transition-colors">
                <Icon name="close" size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                {tabConfig.map(({ key, label, icon }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 border shrink-0 ${
                      activeTab === key
                        ? "border-primary-coral bg-primary-coral/10 text-primary-coral shadow-[0_0_10px_rgba(251,146,60,0.15)]"
                        : "border-border-color bg-surface-deep/40 text-muted-text hover:text-gray-800"
                    }`}
                  >
                    <Icon name={icon} size={11} />
                    {label}
                  </button>
                ))}
              </div>

              <form onSubmit={handleProductSubmit} className="flex flex-col gap-5">
                {activeTab === "general" && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 animate-fade-in">
                    <div>
                      <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">{t("admin.modal.prod_name_en")}</label>
                      <input type="text" value={prodName} onChange={(e) => setProdName(e.target.value)} placeholder="e.g. ISO-WHEY PREMIUM ISOLATE" className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white focus:border-primary-coral focus:outline-none transition-all duration-300 placeholder-muted-text/50" />
                    </div>
                    <div>
                      <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">{t("admin.modal.prod_name_ar")}</label>
                      <input type="text" value={prodNameAr} onChange={(e) => setProdNameAr(e.target.value)} placeholder="مثال: أيزو-واي بروتين معزول فاخر" dir="rtl" className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white focus:border-primary-coral focus:outline-none transition-all duration-300 placeholder-muted-text/50" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">{t("admin.modal.category_sector")}</label>
                      <select value={prodCategory} onChange={(e) => setProdCategory(e.target.value)} className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white focus:border-primary-coral focus:outline-none uppercase">
                        {categories.map((c) => (<option key={c.id} value={c.name}>{c.name}</option>))}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">{t("admin.modal.desc_en")}</label>
                      <textarea value={prodDesc} onChange={(e) => setProdDesc(e.target.value)} placeholder="Explain the product features in English..." className="w-full h-24 rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white focus:border-primary-coral focus:outline-none resize-none placeholder-muted-text/50" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">{t("admin.modal.desc_ar")}</label>
                      <textarea value={prodDescAr} onChange={(e) => setProdDescAr(e.target.value)} placeholder="اشرح مميزات المنتج باللغة العربية..." dir="rtl" className="w-full h-24 rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white focus:border-primary-coral focus:outline-none resize-none placeholder-muted-text/50" />
                    </div>
                    <div className="sm:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-1">
                      {[
                        { label: t("admin.modal.featured"), state: prodFeatured, setter: setProdFeatured },
                        { label: t("admin.modal.bestseller"), state: prodBestSeller, setter: setProdBestSeller },
                        { label: t("admin.modal.new_arrival"), state: prodNewArrival, setter: setProdNewArrival },
                        { label: t("admin.modal.visible"), state: prodVisible, setter: setProdVisible },
                      ].map((item) => (
                        <button key={item.label} type="button" onClick={() => item.setter(!item.state)} className={`flex flex-col justify-between p-3.5 rounded-2xl border text-left transition-all duration-300 min-h-18 relative overflow-hidden group ${item.state ? "border-primary-coral bg-primary-coral/5 text-white" : "border-border-color bg-surface-deep text-muted-text hover:text-gray-800"}`}>
                          <span className="text-4xs font-black uppercase tracking-wider">{item.label}</span>
                          <div className="flex items-center justify-between w-full mt-2">
                            <span className="text-5xs font-bold text-muted-text uppercase">{t("common.status")}</span>
                            <div className={`w-8 h-4 rounded-full p-0.5 transition-colors duration-300 flex items-center ${item.state ? "bg-primary-coral justify-end" : "bg-border-color justify-start"}`}>
                              <div className="w-3 h-3 rounded-full bg-main-bg shadow" />
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "pricing" && (
                  <div className="flex flex-col gap-4 animate-fade-in">
                    <div className="border border-border-color bg-card-bg/60 p-5 rounded-2xl flex flex-col gap-4">
                      <div className="flex justify-between items-center border-b border-border-color/30 pb-3">
                        <div className="flex flex-col">
                          <span className="text-xs font-black uppercase tracking-widest text-white">{t("admin.modal.variant_type")}</span>
                          <span className="text-[10px] text-muted-text mt-0.5">{t("admin.modal.no_variants_explain")}</span>
                        </div>
                        <select value={prodVariantType} onChange={(e) => handleVariantTypeChange(e.target.value as VariantType)} className="rounded-xl border border-border-color bg-surface-deep px-3 py-1.5 text-2xs font-extrabold text-white focus:outline-none uppercase">
                          <option value="none">{t("admin.modal.no_variants")}</option>
                          <option value="size">{t("admin.modal.size_only")}</option>
                          <option value="flavor">{t("admin.modal.flavor_only")}</option>
                          <option value="both">{t("admin.modal.both_variants")}</option>
                        </select>
                      </div>
                      {prodVariantType !== "none" ? (
                        <div className="flex flex-col gap-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[45vh] overflow-y-auto pr-1">
                            {prodVariantsList.map((v, index) => (
                              <div key={v.id} className="border border-border-color bg-surface-deep/40 p-4 rounded-2xl flex flex-col gap-3 relative group">
                                <div className="flex justify-between items-center border-b border-border-color/20 pb-2">
                                  <span className="text-3xs font-black uppercase tracking-widest text-primary-coral">Variant Spec #{index + 1}</span>
                                  <button type="button" onClick={() => deleteVariantItem(v.id)} className="text-muted-text hover:text-red-500 transition-colors p-1"><Icon name="trash" size={12} /></button>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                  {(prodVariantType === "size" || prodVariantType === "both") && (
                                    <div>
                                      <label className="block text-[9px] font-extrabold uppercase tracking-wider text-muted-text mb-1.5">{t("admin.modal.size_opt")}</label>
                                      <input type="text" value={v.size || ""} onChange={(e) => updateVariantItem(v.id, { size: e.target.value })} placeholder="e.g. 1kg" className="w-full rounded-xl border border-border-color bg-surface-deep px-3 py-2 text-2xs text-white focus:outline-none placeholder-muted-text/50" />
                                    </div>
                                  )}
                                  {(prodVariantType === "flavor" || prodVariantType === "both") && (
                                    <div>
                                      <label className="block text-[9px] font-extrabold uppercase tracking-wider text-muted-text mb-1.5">{t("admin.modal.flavor_opt")}</label>
                                      <input type="text" value={v.flavor || ""} onChange={(e) => updateVariantItem(v.id, { flavor: e.target.value })} placeholder="e.g. Chocolate" className="w-full rounded-xl border border-border-color bg-surface-deep px-3 py-2 text-2xs text-white focus:outline-none placeholder-muted-text/50" />
                                    </div>
                                  )}
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-[9px] font-extrabold uppercase tracking-wider text-muted-text mb-1.5">{t("admin.modal.base_price")}</label>
                                    <input type="number" step="0.01" value={v.price || ""} onChange={(e) => updateVariantItem(v.id, { price: parseFloat(e.target.value) || 0 })} className="w-full rounded-xl border border-border-color bg-surface-deep px-3 py-2 text-2xs text-white focus:outline-none" />
                                  </div>
                                  <div>
                                    <label className="block text-[9px] font-extrabold uppercase tracking-wider text-muted-text mb-1.5">{t("admin.modal.stock_qty")}</label>
                                    <input type="number" value={v.stockQuantity} onChange={(e) => updateVariantItem(v.id, { stockQuantity: parseInt(e.target.value) || 0 })} className="w-full rounded-xl border border-border-color bg-surface-deep px-3 py-2 text-2xs text-white focus:outline-none" />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <button type="button" onClick={addVariantItem} className="self-start flex items-center gap-1.5 rounded-xl border border-border-color bg-surface-deep px-3 py-1.5 text-4xs font-black tracking-widest text-white hover:border-primary-coral transition-luxury"><Icon name="plus" size={10} />{t("admin.modal.add_variant")}</button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">{t("admin.modal.base_price")}</label>
                            <input type="number" step="0.01" value={prodPrice} onChange={(e) => handlePriceChange(e.target.value)} className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white focus:outline-none placeholder-muted-text/50" />
                          </div>
                          <div>
                            <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">{t("admin.modal.discount_percent")}</label>
                            <input type="number" min="0" max="100" placeholder="%" value={prodDiscountPercent} onChange={(e) => handleDiscountPercentChange(e.target.value)} className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white focus:outline-none placeholder-muted-text/50" />
                          </div>
                          <div>
                            <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Serving Weight *</label>
                            <input type="text" placeholder="e.g. 2kg" value={prodSize} onChange={(e) => setProdSize(e.target.value)} className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white focus:outline-none placeholder-muted-text/50" />
                          </div>
                          <div>
                            <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">{t("admin.modal.stock_qty")}</label>
                            <input type="number" value={prodStock} onChange={(e) => setProdStock(e.target.value)} className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white focus:outline-none placeholder-muted-text/50" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "media" && (
                  <div className="flex flex-col gap-4 animate-fade-in">
                    <div className="border border-border-color bg-card-bg/60 p-5 rounded-2xl flex flex-col gap-4">
                      <span className="text-xs font-black uppercase tracking-widest text-white border-b border-border-color/30 pb-2">{t("admin.modal.media_title")}</span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <label className="text-4xs font-extrabold uppercase tracking-widest text-muted-text">{t("admin.modal.main_image")}</label>
                          <div className="relative border border-dashed border-border-color hover:border-primary-coral/50 transition-luxury rounded-xl h-44 flex flex-col items-center justify-center bg-surface-deep/40 overflow-hidden group">
                            {prodMainImage ? (
                              <>
                                <div className="relative h-full w-full p-2">
                                  <Image src={prodMainImage} alt="Main" fill className="object-contain" />
                                </div>
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-luxury">
                                  <label className="p-2 rounded-lg bg-primary-coral text-main-bg cursor-pointer hover:bg-gray-600 transition-luxury"><Icon name="edit" size={14} /><input type="file" accept="image/*" onChange={handleMainImageChange} className="hidden" /></label>
                                  <button type="button" onClick={() => setProdMainImage("")} className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-luxury"><Icon name="trash" size={14} /></button>
                                </div>
                              </>
                            ) : (
                              <label className="flex flex-col items-center justify-center gap-2 cursor-pointer w-full h-full text-muted-text hover:text-gray-800"><Icon name="box" size={24} /><span className="text-3xs font-bold uppercase tracking-wider">{t("admin.modal.main_image")}</span><input type="file" accept="image/*" onChange={handleMainImageChange} className="hidden" /></label>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-4xs font-extrabold uppercase tracking-widest text-muted-text">{t("admin.modal.gallery_images")}</label>
                          <div className="border border-border-color bg-surface-deep/20 rounded-xl p-3 h-44 overflow-y-auto flex flex-col gap-2">
                            <label className="border border-dashed border-border-color hover:border-primary-coral/40 transition-luxury rounded-lg py-2 flex items-center justify-center gap-2 cursor-pointer text-muted-text hover:text-gray-800 shrink-0"><Icon name="plus" size={12} /><span className="text-4xs font-bold uppercase tracking-wider">{t("admin.modal.gallery_images")}</span><input type="file" accept="image/*" multiple onChange={handleGalleryImagesChange} className="hidden" /></label>
                            <div className="grid grid-cols-4 gap-2">
                              {prodImages.map((img, idx) => (
                                <div key={idx} className="relative group rounded-lg border border-border-color bg-surface-deep h-12 w-12 overflow-hidden shrink-0">
                                  <Image src={img} alt={`gallery-${idx}`} fill className="object-contain" />
                                  <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1 transition-luxury">
                                    <button type="button" onClick={() => setProdMainImage(img)} className={`p-0.5 rounded ${prodMainImage === img ? "bg-primary-coral text-main-bg" : "bg-surface-sec text-white"}`}><Icon name="check" size={8} /></button>
                                    <button type="button" onClick={() => setProdImages((prev) => prev.filter((image) => image !== img))} className="p-0.5 rounded bg-red-500 text-white"><Icon name="trash" size={8} /></button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "specs" && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 animate-fade-in">
                    <div>
                      <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">{t("admin.modal.ingredients_en")}</label>
                      <input type="text" placeholder="e.g. Whey Isolate" value={prodIngredients} onChange={(e) => setProdIngredients(e.target.value)} className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white focus:outline-none placeholder-muted-text/50" />
                    </div>
                    <div>
                      <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">{t("admin.modal.ingredients_ar")}</label>
                      <input type="text" placeholder="مثال: واي بروتين" value={prodIngredientsAr} onChange={(e) => setProdIngredientsAr(e.target.value)} dir="rtl" className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white focus:outline-none placeholder-muted-text/50" />
                    </div>
                    <div>
                      <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">{t("admin.modal.usage_en")}</label>
                      <input type="text" placeholder="e.g. Mix 1 scoop" value={prodUsage} onChange={(e) => setProdUsage(e.target.value)} className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white focus:outline-none placeholder-muted-text/50" />
                    </div>
                    <div>
                      <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">{t("admin.modal.usage_ar")}</label>
                      <input type="text" placeholder="مثال: امزج مكيالًا" value={prodUsageAr} onChange={(e) => setProdUsageAr(e.target.value)} dir="rtl" className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white focus:outline-none placeholder-muted-text/50" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">{t("admin.modal.render_type")}</label>
                      <select value={prodImgType} onChange={(e) => setProdImgType(e.target.value as "powder" | "capsule" | "liquid")} className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white focus:outline-none">
                        <option value="powder">Powder</option>
                        <option value="capsule">Capsules</option>
                        <option value="liquid">Liquid</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="border-t border-border-color/30 pt-4 mt-2 flex justify-between items-center">
                  <span className="text-[10px] text-muted-text font-bold">* {t("common.required")}</span>
                  <button type="submit" className="flex items-center gap-2 rounded-full bg-primary-coral px-8 py-3.5 text-xs font-black tracking-widest text-main-bg hover:bg-gray-600 transition-luxury shadow-lg">
                    {t("admin.modal.save_btn")}
                    <Icon name="check" size={14} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
