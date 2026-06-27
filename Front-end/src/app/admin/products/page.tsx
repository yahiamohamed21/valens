"use client";

import React, { useState } from "react";
import { useApp, Product } from "@/context/AppContext";
import type { ProductVariant } from "@/types/store";
import { Icon } from "@/components/SvgIcons";
import { ProductImage } from "@/components/ProductCard";
import { showConfirmToast } from "@/lib/toast";

export default function AdminProductsPage() {
  const {
    products,
    categories,
    addProduct,
    editProduct,
    deleteProduct,
    showToast,
  } = useApp();

  // Modal / Form triggers
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"general" | "pricing" | "media" | "specs">("general");

  // Form states - Products
  const [prodName, setProdName] = useState("");
  const [prodCategory, setProdCategory] = useState("Protein");
  const [prodPrice, setProdPrice] = useState("");
  const [prodDiscountPrice, setProdDiscountPrice] = useState("");
  const [prodDiscountPercent, setProdDiscountPercent] = useState("");
  const [prodSize, setProdSize] = useState("");
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

  // Images state
  const [prodMainImage, setProdMainImage] = useState("");
  const [prodImages, setProdImages] = useState<string[]>([]);

  // Variants state
  const [prodVariantType, setProdVariantType] = useState<"none" | "size" | "flavor" | "both">("none");
  const [prodVariantsList, setProdVariantsList] = useState<ProductVariant[]>([]);

  // Image upload helpers
  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProdMainImage(base64String);
        setProdImages((prev) => {
          if (!prev.includes(base64String)) {
            return [base64String, ...prev];
          }
          return prev;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      fileArray.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          setProdImages((prev) => {
            if (!prev.includes(base64String)) {
              return [...prev, base64String];
            }
            return prev;
          });
          setProdMainImage((curr) => curr || base64String);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Variant list helpers
  const handleVariantTypeChange = (type: "none" | "size" | "flavor" | "both") => {
    setProdVariantType(type);
    if (type === "none") {
      setProdVariantsList([]);
    } else if (type === "size") {
      setProdVariantsList([
        { id: `var-${Date.now()}-1`, size: "1kg", price: parseFloat(prodPrice) || 29.99, stockQuantity: parseInt(prodStock) || 10, sku: prodSku || "VL-SKU-1", isAvailable: true }
      ]);
    } else if (type === "flavor") {
      setProdVariantsList([
        { id: `var-${Date.now()}-1`, flavor: "Gourmet Chocolate", price: parseFloat(prodPrice) || 29.99, stockQuantity: parseInt(prodStock) || 10, sku: prodSku || "VL-SKU-1", isAvailable: true }
      ]);
    } else if (type === "both") {
      setProdVariantsList([
        { id: `var-${Date.now()}-1`, size: "1kg", flavor: "Gourmet Chocolate", price: parseFloat(prodPrice) || 29.99, stockQuantity: parseInt(prodStock) || 10, sku: prodSku || "VL-SKU-1", isAvailable: true }
      ]);
    }
  };

  const handlePriceChange = (val: string) => {
    setProdPrice(val);
    const p = parseFloat(val);
    const pct = parseFloat(prodDiscountPercent);
    if (!isNaN(p) && !isNaN(pct) && pct > 0) {
      setProdDiscountPrice((p - (p * pct / 100)).toFixed(2));
    } else {
      setProdDiscountPrice("");
    }
  };

  const handleDiscountPercentChange = (val: string) => {
    setProdDiscountPercent(val);
    const p = parseFloat(prodPrice);
    const pct = parseFloat(val);
    if (!isNaN(p) && !isNaN(pct) && pct > 0) {
      setProdDiscountPrice((p - (p * pct / 100)).toFixed(2));
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
      isAvailable: true
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

  // Product modal open handler (reset or pre-fill)
  const openProductForm = (prod: Product | null = null) => {
    setActiveTab("general");
    if (prod) {
      setEditingProductId(prod.id);
      setProdName(prod.name);
      setProdCategory(prod.category);
      setProdPrice(prod.price.toString());
      setProdDiscountPrice(prod.discountPrice?.toString() || "");
      if (prod.price && prod.discountPrice) {
        setProdDiscountPercent(Math.round(((prod.price - prod.discountPrice) / prod.price) * 100).toString());
      } else {
        setProdDiscountPercent("");
      }
      setProdSize(prod.size);
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
      setProdMainImage(prod.mainImage || "");
      setProdImages(prod.images || []);
      setProdVariantType(prod.variantType || "none");
      setProdVariantsList(prod.variants || []);
    } else {
      setEditingProductId(null);
      setProdName("");
      setProdCategory(categories[0]?.name || "Protein");
      setProdPrice("");
      setProdDiscountPrice("");
      setProdDiscountPercent("");
      setProdSize("");
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
      showToast("Please enter a supplement name.", "error");
      return;
    }

    if (prodVariantType === "none") {
      if (!prodPrice || isNaN(parseFloat(prodPrice)) || parseFloat(prodPrice) <= 0) {
        setActiveTab("pricing");
        showToast("Please enter a valid base price.", "error");
        return;
      }
      if (!prodStock || isNaN(parseInt(prodStock)) || parseInt(prodStock) < 0) {
        setActiveTab("pricing");
        showToast("Please enter a valid stock quantity.", "error");
        return;
      }
      if (!prodSize) {
        setActiveTab("pricing");
        showToast("Please specify the serving weight.", "error");
        return;
      }
    } else {
      if (prodVariantsList.length === 0) {
        setActiveTab("pricing");
        showToast("Please add at least one variant configuration.", "error");
        return;
      }
      const invalidVariant = prodVariantsList.some(v => !v.price || v.stockQuantity === undefined || (prodVariantType === "size" && !v.size) || (prodVariantType === "flavor" && !v.flavor) || (prodVariantType === "both" && (!v.size || !v.flavor)));
      if (invalidVariant) {
        setActiveTab("pricing");
        showToast("Please fill in all variant pricing, sizes, flavors, and stock requirements.", "error");
        return;
      }
    }

    let finalVariants: ProductVariant[] = [];
    let derivedPrice = parseFloat(prodPrice) || 0;
    let derivedDiscount: number | undefined = prodDiscountPrice ? parseFloat(prodDiscountPrice) : undefined;
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
        }
      ];
    } else {
      finalVariants = prodVariantsList;

      const prices = finalVariants.map((v) => v.price);
      derivedPrice = Math.min(...prices);

      const discounts = finalVariants.map((v) => v.discountPrice).filter((p): p is number => p !== undefined && p > 0);
      derivedDiscount = discounts.length > 0 ? Math.min(...discounts) : undefined;

      derivedStock = finalVariants.reduce((sum, v) => sum + v.stockQuantity, 0);
      derivedSku = finalVariants[0]?.sku || prodSku;

      const uniqueSizes = Array.from(new Set(finalVariants.map((v) => v.size).filter(Boolean)));
      derivedSize = uniqueSizes.length > 0 ? uniqueSizes.join(", ") : prodSize || "1 Tub";
    }

    const payload = {
      name: prodName,
      category: prodCategory,
      price: derivedPrice,
      discountPrice: derivedDiscount,
      size: derivedSize,
      variants: finalVariants,
      stock: derivedStock,
      stockStatus: derivedStock === 0 ? "Out of Stock" : derivedStock <= 10 ? "Low Stock" : "In Stock" as any,
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
    };

    if (editingProductId) {
      editProduct(editingProductId, payload);
    } else {
      addProduct(payload);
    }
    setProductModalOpen(false);
  };

  return (
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
                <th className="pb-3 font-extrabold">Base Price (EGP)</th>
                <th className="pb-3 font-extrabold">Stock Count</th>
                <th className="pb-3 font-extrabold">Status</th>
                <th className="pb-3 font-extrabold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod) => (
                <tr key={prod.id} className="border-b border-border-color/30 last:border-0 hover:bg-surface-deep/20">
                  <td className="py-3.5 flex items-center gap-3">
                    <div className="h-10 w-8 bg-surface-deep border border-border-color rounded p-0.5 flex items-center justify-center shrink-0 overflow-hidden">
                      {prod.mainImage ? (
                        <img src={prod.mainImage} alt={prod.name} className="h-full w-full object-contain" />
                      ) : (
                        <ProductImage color={prod.imageColor} type={prod.imageType} glow={false} className="h-8 w-full" />
                      )}
                    </div>
                    <div>
                      <span className="block font-bold text-white">{prod.name}</span>
                      <span className="text-3xs text-muted-text font-bold uppercase">{prod.size}</span>
                    </div>
                  </td>
                  <td className="py-3.5 uppercase">{prod.category}</td>
                  <td className="py-3.5 font-mono text-3xs text-muted-text">{prod.sku}</td>
                  <td className="py-3.5 text-primary-coral font-bold">{Math.round(prod.price).toLocaleString()} EGP</td>
                  <td className="py-3.5">{prod.stock}</td>
                  <td className="py-3.5">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-3xs font-extrabold uppercase ${prod.stockStatus === "In Stock"
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
                      className={`p-1.5 rounded-lg border ${prod.visible
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
                      onClick={() => showConfirmToast(`Confirm deletion of ${prod.name}?`, () => deleteProduct(prod.id))}
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

      {/* PRODUCT ADD / EDIT MODAL */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-3xl rounded-3xl border border-border-color bg-card-bg p-6 sm:p-8 shadow-2xl glass-panel max-h-[90vh] overflow-y-auto animate-slide-in relative">
            <button
              onClick={() => setProductModalOpen(false)}
              className="absolute right-4 top-4 text-muted-text hover:text-white"
            >
              <Icon name="close" size={20} />
            </button>
            <div className="flex flex-col gap-1 border-b border-border-color pb-3 mb-5">
              <span className="text-4xs font-extrabold uppercase tracking-widest text-primary-coral">Formulations Spec Panel</span>
              <h2 className="text-base font-black uppercase tracking-wider text-white">
                {editingProductId ? "Modify Formulation Specifications" : "Create New Supplement Formulation"}
              </h2>
            </div>

            {/* Premium Tab Navigation */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-b border-border-color/30 pb-3 mb-5 shrink-0">
              {(["general", "pricing", "media", "specs"] as const).map((tab) => {
                const labelMap = {
                  general: "General Info",
                  pricing: "Pricing & Variants",
                  media: "Media Assets",
                  specs: "Specifications"
                };
                const iconMap = {
                  general: "info" as const,
                  pricing: "report" as const,
                  media: "box" as const,
                  specs: "edit" as const
                };
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-3xs font-extrabold uppercase tracking-widest border transition-all duration-300 ${activeTab === tab
                        ? "border-primary-coral bg-primary-coral/10 text-primary-coral shadow-[0_0_10px_rgba(251,146,60,0.15)]"
                        : "border-border-color bg-surface-deep/40 text-muted-text hover:text-white"
                      }`}
                  >
                    <Icon name={iconMap[tab]} size={11} />
                    {labelMap[tab]}
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleProductSubmit} className="flex flex-col gap-5">
              {/* Tab 1: General info */}
              {activeTab === "general" && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 animate-fade-in">
                  <div>
                    <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Supplement Name *</label>
                    <input
                      type="text"
                      value={prodName}
                      onChange={(e) => setProdName(e.target.value)}
                      placeholder="e.g. ISO-WHEY PREMIUM ISOLATE"
                      className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white focus:border-primary-coral focus:outline-none focus:ring-1 focus:ring-primary-coral/25 transition-all duration-300 placeholder-muted-text/50"
                    />
                  </div>

                  <div>
                    <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Category Sector *</label>
                    <select
                      value={prodCategory}
                      onChange={(e) => setProdCategory(e.target.value)}
                      className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white focus:border-primary-coral focus:outline-none uppercase"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Product Description *</label>
                    <textarea
                      value={prodDesc}
                      onChange={(e) => setProdDesc(e.target.value)}
                      placeholder="Explain the product features and formulation highlights..."
                      className="w-full h-24 rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white focus:border-primary-coral focus:outline-none resize-none placeholder-muted-text/50"
                    />
                  </div>

                  {/* Gorgeous toggle switches for status */}
                  <div className="sm:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-1">
                    {[
                      { label: "Featured", state: prodFeatured, setter: setProdFeatured },
                      { label: "Bestseller", state: prodBestSeller, setter: setProdBestSeller },
                      { label: "New Arrival", state: prodNewArrival, setter: setProdNewArrival },
                      { label: "Visible", state: prodVisible, setter: setProdVisible }
                    ].map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => item.setter(!item.state)}
                        className={`flex flex-col justify-between p-3.5 rounded-2xl border text-left transition-all duration-300 min-h-[72px] relative overflow-hidden group ${item.state
                            ? "border-primary-coral bg-primary-coral/5 text-white"
                            : "border-border-color bg-surface-deep text-muted-text hover:text-white"
                          }`}
                      >
                        <span className="text-4xs font-black uppercase tracking-wider">{item.label}</span>
                        <div className="flex items-center justify-between w-full mt-2">
                          <span className="text-5xs font-bold text-muted-text uppercase">Status</span>
                          <div className={`w-8 h-4 rounded-full p-0.5 transition-colors duration-300 flex items-center ${item.state ? "bg-primary-coral justify-end" : "bg-border-color justify-start"}`}>
                            <div className="w-3 h-3 rounded-full bg-main-bg shadow" />
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 2: Pricing & Variants */}
              {activeTab === "pricing" && (
                <div className="flex flex-col gap-4 animate-fade-in">
                  <div className="border border-border-color bg-card-bg/60 p-5 rounded-2xl flex flex-col gap-4">
                    <div className="flex justify-between items-center border-b border-border-color/30 pb-3">
                      <div className="flex flex-col">
                        <span className="text-xs font-black uppercase tracking-widest text-white">
                          Product Options & Variants
                        </span>
                        <span className="text-[10px] text-muted-text mt-0.5">Define variant parameters or stick to basic values</span>
                      </div>
                      <select
                        value={prodVariantType}
                        onChange={(e) => handleVariantTypeChange(e.target.value as any)}
                        className="rounded-xl border border-border-color bg-surface-deep px-3 py-1.5 text-2xs font-extrabold text-white focus:outline-none uppercase"
                      >
                        <option value="none">No variants</option>
                        <option value="size">Size only</option>
                        <option value="flavor">Flavor only</option>
                        <option value="both">Size and flavor</option>
                      </select>
                    </div>

                    {prodVariantType !== "none" ? (
                      <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[45vh] overflow-y-auto pr-1">
                          {prodVariantsList.map((v, index) => (
                            <div key={v.id} className="border border-border-color bg-surface-deep/40 p-4 rounded-2xl flex flex-col gap-3 relative group">
                              {/* Card Header: Title & Remove button */}
                              <div className="flex justify-between items-center border-b border-border-color/20 pb-2">
                                <span className="text-3xs font-black uppercase tracking-widest text-primary-coral">
                                  Variant Spec #{index + 1}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => deleteVariantItem(v.id)}
                                  className="text-muted-text hover:text-red-500 transition-colors p-1"
                                  title="Remove variant"
                                >
                                  <Icon name="trash" size={12} />
                                </button>
                              </div>

                              {/* Options (Size / Flavor) Selectors */}
                              <div className="grid grid-cols-2 gap-3">
                                {(prodVariantType === "size" || prodVariantType === "both") && (
                                  <div>
                                    <label className="block text-[9px] font-extrabold uppercase tracking-wider text-muted-text mb-1.5">Size Option *</label>
                                    <input
                                      type="text"
                                      value={v.size || ""}
                                      onChange={(e) => updateVariantItem(v.id, { size: e.target.value })}
                                      placeholder="e.g. 1kg, 2kg, 90 Caps"
                                      className="w-full rounded-xl border border-border-color bg-surface-deep px-3 py-2 text-2xs text-white focus:border-primary-coral focus:outline-none focus:ring-1 focus:ring-primary-coral/20 placeholder-muted-text/50"
                                    />
                                  </div>
                                )}
                                {(prodVariantType === "flavor" || prodVariantType === "both") && (
                                  <div>
                                    <label className="block text-[9px] font-extrabold uppercase tracking-wider text-muted-text mb-1.5">Flavor Option *</label>
                                    <input
                                      type="text"
                                      value={v.flavor || ""}
                                      onChange={(e) => updateVariantItem(v.id, { flavor: e.target.value })}
                                      placeholder="e.g. Chocolate, Vanilla"
                                      className="w-full rounded-xl border border-border-color bg-surface-deep px-3 py-2 text-2xs text-white focus:border-primary-coral focus:outline-none focus:ring-1 focus:ring-primary-coral/20 placeholder-muted-text/50"
                                    />
                                  </div>
                                )}
                              </div>

                              {/* Details (Price, Discount, Stock, SKU) */}
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-[9px] font-extrabold uppercase tracking-wider text-muted-text mb-1.5">Base Price (EGP) *</label>
                                  <input
                                    type="number"
                                    step="0.01"
                                    value={v.price || ""}
                                    onChange={(e) => {
                                      const priceVal = parseFloat(e.target.value) || 0;
                                      const currentPercent = v.price && v.discountPrice ? ((v.price - v.discountPrice) / v.price) : 0;
                                      const computedDiscountPrice = currentPercent > 0 ? (priceVal - (priceVal * currentPercent)) : undefined;
                                      updateVariantItem(v.id, { price: priceVal, discountPrice: computedDiscountPrice });
                                    }}
                                    className="w-full rounded-xl border border-border-color bg-surface-deep px-3 py-2 text-2xs text-white focus:border-primary-coral focus:outline-none focus:ring-1 focus:ring-primary-coral/20 placeholder-muted-text/50"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[9px] font-extrabold uppercase tracking-wider text-muted-text mb-1.5">Discount (%)</label>
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    placeholder="%"
                                    value={v.price && v.discountPrice ? Math.round(((v.price - v.discountPrice) / v.price) * 100) : ""}
                                    onChange={(e) => {
                                      const percentVal = parseFloat(e.target.value) || 0;
                                      const computedDiscountPrice = percentVal > 0 ? (v.price - (v.price * percentVal / 100)) : undefined;
                                      updateVariantItem(v.id, { discountPrice: computedDiscountPrice });
                                    }}
                                    className="w-full rounded-xl border border-border-color bg-surface-deep px-3 py-2 text-2xs text-white focus:border-primary-coral focus:outline-none focus:ring-1 focus:ring-primary-coral/20 placeholder-muted-text/50"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[9px] font-extrabold uppercase tracking-wider text-muted-text mb-1.5">Stock Qty *</label>
                                  <input
                                    type="number"
                                    value={v.stockQuantity}
                                    onChange={(e) => {
                                      const qty = parseInt(e.target.value) || 0;
                                      updateVariantItem(v.id, { stockQuantity: qty, isAvailable: qty > 0 });
                                    }}
                                    className="w-full rounded-xl border border-border-color bg-surface-deep px-3 py-2 text-2xs text-white focus:border-primary-coral focus:outline-none focus:ring-1 focus:ring-primary-coral/20 placeholder-muted-text/50"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[9px] font-extrabold uppercase tracking-wider text-muted-text mb-1.5">SKU *</label>
                                  <input
                                    type="text"
                                    value={v.sku || ""}
                                    onChange={(e) => updateVariantItem(v.id, { sku: e.target.value })}
                                    className="w-full rounded-xl border border-border-color bg-surface-deep px-3 py-2 text-2xs text-white focus:border-primary-coral focus:outline-none focus:ring-1 focus:ring-primary-coral/20 placeholder-muted-text/50"
                                  />
                                </div>
                              </div>

                              {/* Image picker for variant */}
                              <div className="flex items-center gap-3 bg-surface-deep/30 p-2 rounded-xl border border-border-color/10 mt-1">
                                <span className="text-[9px] font-extrabold uppercase tracking-wider text-muted-text">Image Assets:</span>
                                {v.image ? (
                                  <div className="relative group h-10 w-10 rounded-lg border border-border-color overflow-hidden bg-surface-deep">
                                    <img src={v.image} className="h-full w-full object-contain p-1" />
                                    <button
                                      type="button"
                                      onClick={() => updateVariantItem(v.id, { image: undefined })}
                                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-500 transition-opacity"
                                    >
                                      <Icon name="close" size={10} />
                                    </button>
                                  </div>
                                ) : (
                                  <label className="cursor-pointer flex items-center gap-1 px-3 py-1.5 border border-border-color hover:border-primary-coral/40 rounded-lg bg-surface-deep text-4xs font-bold uppercase tracking-wider text-muted-text hover:text-white transition-all">
                                    <Icon name="plus" size={10} />
                                    <span>Upload Image</span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          const reader = new FileReader();
                                          reader.onloadend = () => {
                                            updateVariantItem(v.id, { image: reader.result as string });
                                          };
                                          reader.readAsDataURL(file);
                                        }
                                      }}
                                      className="hidden"
                                    />
                                  </label>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={addVariantItem}
                          className="self-start flex items-center gap-1.5 rounded-xl border border-border-color bg-surface-deep px-3 py-1.5 text-4xs font-black tracking-widest text-white hover:border-primary-coral hover:bg-primary-coral/5 transition-luxury"
                        >
                          <Icon name="plus" size={10} />
                          ADD VARIANT COMBINATION
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Base Price (EGP) *</label>
                          <input
                            type="number"
                            step="0.01"
                            value={prodPrice}
                            onChange={(e) => handlePriceChange(e.target.value)}
                            className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white focus:outline-none placeholder-muted-text/50"
                          />
                        </div>
                        <div>
                          <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Discount (%)</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            placeholder="%"
                            value={prodDiscountPercent}
                            onChange={(e) => handleDiscountPercentChange(e.target.value)}
                            className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white focus:outline-none placeholder-muted-text/50"
                          />
                        </div>
                        <div>
                          <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Serving weight *</label>
                          <input
                            type="text"
                            placeholder="E.g. 2kg, 400g, 120 Caps"
                            value={prodSize}
                            onChange={(e) => setProdSize(e.target.value)}
                            className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white focus:outline-none placeholder-muted-text/50"
                          />
                        </div>
                        <div>
                          <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Initial Stock Quantity *</label>
                          <input
                            type="number"
                            value={prodStock}
                            onChange={(e) => setProdStock(e.target.value)}
                            className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white focus:outline-none placeholder-muted-text/50"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Product SKU</label>
                          <input
                            type="text"
                            placeholder="E.g. VL-ISO-2KG"
                            value={prodSku}
                            onChange={(e) => setProdSku(e.target.value)}
                            className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white focus:outline-none placeholder-muted-text/50"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 3: Media Assets */}
              {activeTab === "media" && (
                <div className="flex flex-col gap-4 animate-fade-in">
                  <div className="border border-border-color bg-card-bg/60 p-5 rounded-2xl flex flex-col gap-4">
                    <span className="text-xs font-black uppercase tracking-widest text-white border-b border-border-color/30 pb-2">
                      Product Images / Media
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Main Image Upload Box */}
                      <div className="flex flex-col gap-2">
                        <label className="text-4xs font-extrabold uppercase tracking-widest text-muted-text">
                          Main Product Image
                        </label>
                        <div className="relative border border-dashed border-border-color hover:border-primary-coral/50 transition-luxury rounded-xl h-44 flex flex-col items-center justify-center bg-surface-deep/40 overflow-hidden group">
                          {prodMainImage ? (
                            <>
                              <img src={prodMainImage} alt="Main" className="h-full w-full object-contain p-2" />
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-luxury">
                                <label className="p-2 rounded-lg bg-primary-coral text-main-bg cursor-pointer hover:bg-white transition-luxury">
                                  <Icon name="edit" size={14} />
                                  <input type="file" accept="image/*" onChange={handleMainImageChange} className="hidden" />
                                </label>
                                <button
                                  type="button"
                                  onClick={() => setProdMainImage("")}
                                  className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-luxury"
                                >
                                  <Icon name="trash" size={14} />
                                </button>
                              </div>
                            </>
                          ) : (
                            <label className="flex flex-col items-center justify-center gap-2 cursor-pointer w-full h-full text-muted-text hover:text-white">
                              <Icon name="box" size={24} className="text-muted-text group-hover:text-primary-coral transition-colors" />
                              <span className="text-3xs font-bold uppercase tracking-wider">Upload Main Image</span>
                              <input type="file" accept="image/*" onChange={handleMainImageChange} className="hidden" />
                            </label>
                          )}
                        </div>
                      </div>

                      {/* Gallery Images Upload Box */}
                      <div className="flex flex-col gap-2">
                        <label className="text-4xs font-extrabold uppercase tracking-widest text-muted-text">
                          Gallery Images
                        </label>
                        <div className="border border-border-color bg-surface-deep/20 rounded-xl p-3 h-44 overflow-y-auto flex flex-col gap-2">
                          <label className="border border-dashed border-border-color hover:border-primary-coral/40 transition-luxury rounded-lg py-2 flex items-center justify-center gap-2 cursor-pointer text-muted-text hover:text-white shrink-0">
                            <Icon name="plus" size={12} />
                            <span className="text-4xs font-bold uppercase tracking-wider">Add Gallery Images</span>
                            <input type="file" accept="image/*" multiple onChange={handleGalleryImagesChange} className="hidden" />
                          </label>
                          <div className="grid grid-cols-4 gap-2">
                            {prodImages.map((img, idx) => (
                              <div key={idx} className="relative group rounded-lg border border-border-color bg-surface-deep h-12 w-12 overflow-hidden shrink-0">
                                <img src={img} className="h-full w-full object-contain" />
                                <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1 transition-luxury">
                                  <button
                                    type="button"
                                    onClick={() => setProdMainImage(img)}
                                    title="Make Main Image"
                                    className={`p-0.5 rounded ${prodMainImage === img ? 'bg-primary-coral text-main-bg' : 'bg-surface-sec text-white hover:bg-primary-coral hover:text-main-bg'}`}
                                  >
                                    <Icon name="check" size={8} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setProdImages(prev => prev.filter(image => image !== img))}
                                    title="Remove Image"
                                    className="p-0.5 rounded bg-red-500 text-white hover:bg-red-600"
                                  >
                                    <Icon name="trash" size={8} />
                                  </button>
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

              {/* Tab 4: Specifications */}
              {activeTab === "specs" && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 animate-fade-in">
                  <div className="sm:col-span-2">
                    <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Active Ingredients (comma separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. Whey Isolate, Creatine, Ashwagandha"
                      value={prodIngredients}
                      onChange={(e) => setProdIngredients(e.target.value)}
                      className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white focus:outline-none placeholder-muted-text/50"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Suggested Usage instructions</label>
                    <input
                      type="text"
                      placeholder="e.g. Mix 1 scoop with 300ml of cold water post-workout"
                      value={prodUsage}
                      onChange={(e) => setProdUsage(e.target.value)}
                      className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white focus:outline-none placeholder-muted-text/50"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Formulation Benefits (one per line)</label>
                    <textarea
                      value={prodBenefits}
                      onChange={(e) => setProdBenefits(e.target.value)}
                      placeholder="e.g. Accelerates muscle protein synthesis&#10;Enhances physical strength output"
                      className="w-full h-24 rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white focus:outline-none resize-none placeholder-muted-text/50"
                    />
                  </div>

                  <div>
                    <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Render Type</label>
                    <select
                      value={prodImgType}
                      onChange={(e) => setProdImgType(e.target.value as any)}
                      className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white focus:outline-none"
                    >
                      <option value="powder">Powder</option>
                      <option value="capsule">Capsules</option>
                      <option value="liquid">Liquid</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Modal Save Button */}
              <div className="border-t border-border-color/30 pt-4 mt-2 flex justify-between items-center">
                <span className="text-[10px] text-muted-text font-bold">
                  * indicates required parameter
                </span>
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-full bg-primary-coral px-8 py-3.5 text-xs font-black tracking-widest text-main-bg hover:bg-white transition-luxury shadow-lg shadow-primary-coral/10 hover:scale-102 cursor-pointer"
                >
                  SAVE SPECIFICATIONS
                  <Icon name="check" size={14} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
