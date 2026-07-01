"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { useApp, Product, Review } from "@/context/AppContext";
import { ProductImage } from "@/components/ProductCard";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Icon } from "@/components/SvgIcons";
import Link from "next/link";
import { api, mapApiProductToClient } from "@/lib/api";

export default function ProductDetailsPage() {
  const params = useParams();
  const { products, addToCart, locale, showToast, currentUserEmail } = useApp();
  
  const id = params?.id as string;
  const cachedProduct = useMemo(() => products.find((p: Product) => p.id === id), [products, id]);

  const [localProduct, setLocalProduct] = useState<Product | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const fetchDetails = useCallback(async () => {
    if (!id) return;
    setLoadingDetails(true);
    try {
      const data = await api.products.detail(id);
      if (data) {
        setLocalProduct(mapApiProductToClient(data as Record<string, unknown>));
      }
    } catch (err) {
      console.error("Failed to load product details from server:", err);
    } finally {
      setLoadingDetails(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  // Review Form States
  const [reviewName, setReviewName] = useState("");
  const [reviewEmail, setReviewEmail] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Sync review email and name if logged in
  useEffect(() => {
    if (currentUserEmail) {
      setReviewEmail(currentUserEmail);
      setReviewName(currentUserEmail.split("@")[0]);
    } else {
      setReviewEmail("");
      setReviewName("");
    }
  }, [currentUserEmail]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewEmail.trim() || !reviewComment.trim()) {
      showToast(locale === "ar" ? "برجاء ملء جميع الحقول (الاسم، البريد والتعليق)" : "Please fill out all fields (name, email and comment).", "error");
      return;
    }
    setSubmittingReview(true);
    try {
      const res = await api.reviews.submitReview(id, {
        customerName: reviewName.trim(),
        customerEmail: reviewEmail.trim(),
        rating: reviewRating,
        comment: reviewComment.trim(),
      });
      if (res && (res as any).success) {
        setReviewName("");
        setReviewEmail("");
        setReviewRating(5);
        setReviewComment("");
        await fetchDetails();
        showToast(locale === "ar" ? "تم إرسال تقييمك بنجاح!" : "Review submitted successfully!", "success");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to submit review";
      showToast(msg, "error");
    } finally {
      setSubmittingReview(false);
    }
  };

  const [submittingDirectRating, setSubmittingDirectRating] = useState(false);

  const handleDirectRate = async (ratingVal: number) => {
    if (!currentUserEmail) {
      showToast(
        locale === "ar" ? "برجاء تسجيل الدخول أولاً لتتمكن من تقييم المنتج." : "Please log in first to rate this product.",
        "error"
      );
      return;
    }

    setSubmittingDirectRating(true);
    
    const name = currentUserEmail.split("@")[0];
    const email = currentUserEmail;

    try {
      const res = await api.reviews.submitReview(id, {
        customerName: name,
        customerEmail: email,
        rating: ratingVal,
        comment: "", // empty comment for direct rating
      });
      if (res && (res as any).success) {
        await fetchDetails();
        showToast(
          locale === "ar" ? "تم تسجيل تقييمك بنجاح! شكراً لك." : "Your rating has been saved! Thank you.",
          "success"
        );
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save rating";
      showToast(msg, "error");
    } finally {
      setSubmittingDirectRating(false);
    }
  };

  const product = localProduct || cachedProduct;

  // Gallery tabs: "front", "label"
  const [activeTab, setActiveTab] = useState<"front" | "label">("front");
  const [quantity, setQuantity] = useState(1);
  const [activeAccordion, setActiveAccordion] = useState<string>("benefits");

  // Selection states
  const [selectedSize, setSelectedSize] = useState(() => product?.variants?.[0]?.size || "");
  const [selectedFlavor, setSelectedFlavor] = useState(() => product?.variants?.[0]?.flavor || "");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Sync selection states when product loads
  useEffect(() => {
    if (product?.variants?.[0]) {
      setSelectedSize((prev) => prev || product.variants[0].size || "");
      setSelectedFlavor((prev) => prev || product.variants[0].flavor || "");
    }
  }, [product]);

  // All unique sizes and flavors for the active product
  const availableSizes = useMemo(() => {
    if (!product || !product.variants) return [];
    return Array.from(
      new Set(product.variants.map((v) => v.size).filter(Boolean))
    ) as string[];
  }, [product]);

  const availableFlavors = useMemo(() => {
    if (!product || !product.variants) return [];
    return Array.from(
      new Set(product.variants.map((v) => v.flavor).filter(Boolean))
    ) as string[];
  }, [product]);

  // Filtered sizes based on selected flavor
  const filteredSizes = useMemo(() => {
    if (!selectedFlavor) return availableSizes;
    return (
      product?.variants?.
        filter((v) => v.flavor === selectedFlavor && v.size).
        map((v) => v.size!).
        filter(Boolean) as string[]
    ) ?? [];
  }, [product, selectedFlavor, availableSizes]);

  // Filtered flavors based on selected size
  const filteredFlavors = useMemo(() => {
    if (!selectedSize) return availableFlavors;
    return (
      product?.variants?.
        filter((v) => v.size === selectedSize && v.flavor).
        map((v) => v.flavor!).
        filter(Boolean) as string[]
    ) ?? [];
  }, [product, selectedSize, availableFlavors]);



  // Gallery images list (main image + other gallery images)
  const productImages = useMemo(() => {
    if (!product) return [];
    const list = [];
    if (product.mainImage) list.push(product.mainImage);
    if (product.images) {
      product.images.forEach((img) => {
        if (img !== product.mainImage) list.push(img);
      });
    }
    return list;
  }, [product]);

  // Derive active variant
  const matchedVariant = useMemo(() => {
    if (!product || !product.variants) return null;
    return (
      product.variants.find((v) => {
        const matchSize = !selectedSize || v.size === selectedSize;
        const matchFlavor = !selectedFlavor || v.flavor === selectedFlavor;
        return matchSize && matchFlavor;
      }) || null
    );
  }, [product, selectedSize, selectedFlavor]);

  if (loadingDetails) {
    return (
      <div className="flex min-h-screen flex-col bg-main-bg text-foreground font-sans animate-fade-in">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center py-24 text-center">
          <span className="h-10 w-10 animate-spin rounded-full border-4 border-primary-coral border-t-transparent inline-block mb-4 shadow-[0_0_15px_rgba(255,138,117,0.4)]" />
          <h2 className="text-sm font-black uppercase tracking-widest text-white">
            {locale === "ar" ? "جاري تحميل تفاصيل المنتج..." : "Loading Product Details..."}
          </h2>
          <p className="mt-2 text-4xs text-muted-text uppercase tracking-widest">
            {locale === "ar" ? "جاري جلب أحدث المواصفات المخبرية" : "Fetching clinical specifications..."}
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col bg-main-bg text-foreground">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center py-24 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-deep border border-border-color text-primary-coral mb-4">
            <Icon name="close" size={28} />
          </div>
          <h2 className="text-xl font-bold uppercase tracking-wider text-white">Product Not Found</h2>
          <p className="mt-2 text-xs text-muted-text max-w-xs">
            The supplement formulation you are looking for does not exist or has been archived.
          </p>
          <Link
            href="/products"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary-coral px-6 py-2.5 text-xs font-black tracking-widest text-[#180f0d] hover:bg-white hover:text-[#180f0d] transition-all duration-300"
          >
            RETURN TO SHOP
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Related products (same category, excluding current product)
  const relatedProducts = products
    .filter((p: Product) => p.category === product.category && p.id !== product.id && p.visible)
    .slice(0, 3);

  const isOutOfStock = product.variantType !== "none"
    ? (!matchedVariant || matchedVariant.stockQuantity === 0)
    : (product.stock === 0);
  const isLowStock = product.variantType !== "none"
    ? (!!matchedVariant && matchedVariant.stockQuantity > 0 && matchedVariant.stockQuantity <= 10)
    : (product.stock > 0 && product.stock <= 10);
  const stockText = isOutOfStock ? "Out of Stock" : isLowStock ? "Low Stock" : "In Stock";
  const matchedSku = matchedVariant ? matchedVariant.sku : product.sku;
  const stockCount = matchedVariant ? matchedVariant.stockQuantity : (product.variantType !== "none" ? 0 : product.stock);

  const hasDiscount = matchedVariant ? !!matchedVariant.discountPrice : !!product.discountPrice;
  const currentPrice = matchedVariant 
    ? (matchedVariant.discountPrice || matchedVariant.price) 
    : (product.discountPrice || product.price);
  const originalPrice = matchedVariant ? matchedVariant.price : product.price;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(
      product,
      quantity,
      selectedSize || undefined,
      selectedFlavor || undefined,
      currentPrice,
      matchedSku,
      matchedVariant?.image || product.mainImage || undefined
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-main-bg text-foreground">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-2xs font-extrabold uppercase tracking-widest text-muted-text hover:text-primary-coral mb-8 transition-luxury"
        >
          <Icon name="chevron-left" size={12} />
          Back to supplements
        </Link>

        {/* Product Split Columns */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 mb-16">
          
          {/* Left Column: Image Gallery & Facts */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="relative rounded-3xl border border-border-color bg-card-bg/60 p-8 flex items-center justify-center min-h-[400px] overflow-hidden glass-panel">
              {activeTab === "front" && (
                <div className="h-full w-full flex items-center justify-center relative">
                  {(matchedVariant?.image || productImages[selectedImageIndex]) ? (
                    <img
                      src={matchedVariant?.image || productImages[selectedImageIndex]}
                      alt={product.name}
                      className="h-96 w-full object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.6)]"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100'%20height='100'%20fill='%231e1310'/%3E%3Ctext%20x='50'%20y='55'%20font-family='sans-serif'%20font-size='10'%20fill='%238d7b73'%20text-anchor='middle'%3ENo%20Image%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  ) : (
                    <ProductImage color={product.imageColor} type={product.imageType} glow={true} className="h-96 w-full" />
                  )}
                </div>
              )}

              {activeTab === "label" && (
                <div className="w-full max-w-md bg-surface-deep border border-border-color rounded-2xl p-6 font-mono text-xs text-white text-left leading-relaxed">
                  <div className="border-b border-border-color pb-3 mb-3 text-center">
                    <span className="text-sm font-black tracking-widest text-white uppercase">{product.name}</span>
                    <span className="block text-4xs text-muted-text mt-1 uppercase tracking-widest">Active Ingredient Spectrum</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {product.ingredients.map((ing: string, i: number) => (
                      <div key={i} className="flex justify-between border-b border-border-color/30 pb-1 text-3xs">
                        <span>{ing}</span>
                        <span className="text-primary-coral font-bold">Clinical Dose</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-4xs text-muted-text leading-normal">
                    * Valens strictly guarantees complete ingredient listing. Zero chemical binders, proprietary formulas, or artificial colorings are present.
                  </p>
                </div>
              )}


            </div>

            {/* Custom Gallery Image Thumbnails */}
            {activeTab === "front" && productImages.length > 1 && (
              <div className="flex gap-2.5 justify-center py-2 flex-wrap">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`h-12 w-10 rounded-xl border p-0.5 bg-card-bg overflow-hidden transition-luxury shrink-0 ${
                      selectedImageIndex === idx ? "border-primary-coral scale-105" : "border-border-color hover:border-white"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Product variation ${idx + 1}`}
                      className="h-full w-full object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100'%20height='100'%20fill='%231e1310'/%3E%3Ctext%20x='50'%20y='55'%20font-family='sans-serif'%20font-size='10'%20fill='%238d7b73'%20text-anchor='middle'%3ENo%20Image%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setActiveTab("front")}
                className={`rounded-xl border p-3 text-xs font-bold uppercase tracking-wider transition-luxury flex flex-col items-center gap-1.5 ${
                  activeTab === "front"
                    ? "border-primary-coral bg-primary-coral/5 text-primary-coral"
                    : "border-border-color bg-card-bg text-muted-text hover:text-primary-coral hover:border-primary-coral/40 dark:hover:text-white"
                }`}
              >
                <Icon name="box" size={14} />
                Bottle View
              </button>
              <button
                onClick={() => setActiveTab("label")}
                className={`rounded-xl border p-3 text-xs font-bold uppercase tracking-wider transition-luxury flex flex-col items-center gap-1.5 ${
                  activeTab === "label"
                    ? "border-primary-coral bg-primary-coral/5 text-primary-coral"
                    : "border-border-color bg-card-bg text-muted-text hover:text-primary-coral hover:border-primary-coral/40 dark:hover:text-white"
                }`}
              >
                <Icon name="tag" size={14} />
                Ingredients
              </button>
            </div>
          </div>

          {/* Right Column: Order Configuration */}
          <div className="lg:col-span-6 flex flex-col justify-start">
            <span className="text-2xs font-extrabold uppercase tracking-widest text-primary-coral">{product.category}</span>
            <h1 className="mt-2 text-3xl font-black uppercase tracking-wider text-white sm:text-4xl">{product.name}</h1>
            
            {/* Rating summary */}
            <div className="mt-4 flex items-center gap-2 border-b border-border-color pb-4">
              <div className="flex text-primary-coral gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    disabled={submittingDirectRating}
                    onClick={() => {
                      handleDirectRate(star);
                    }}
                    className="text-primary-coral hover:scale-125 transition-transform duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    title={locale === "ar" ? `تقييم ${star} نجوم` : `Rate ${star} Stars`}
                  >
                    <Icon
                      name="star"
                      size={14}
                      className={star <= Math.round(product.rating) ? "text-primary-coral fill-primary-coral" : "text-border-color"}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold text-white">{product.rating.toFixed(1)}</span>
              <button
                onClick={() => {
                  const reviewsSection = document.getElementById("reviews-section");
                  if (reviewsSection) {
                    reviewsSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="text-2xs text-muted-text font-bold hover:text-primary-coral transition-colors cursor-pointer"
              >
                ({product.reviews.length} {locale === "ar" ? "تقييمات عملاء موثقة" : "verified customer reviews"})
              </button>
            </div>

            {/* Pricing Panel */}
            <div className="mt-6 flex items-baseline gap-4">
              {hasDiscount ? (
                <>
                  <span className="text-3xl font-black text-primary-coral">{Math.round(currentPrice).toLocaleString(locale)} EGP</span>
                  <span className="text-lg text-muted-text line-through">{Math.round(originalPrice).toLocaleString(locale)} EGP</span>
                  <span className="rounded-full bg-accent-orange px-2.5 py-0.5 text-3xs font-extrabold text-white">
                    SAVE {Math.round(originalPrice - currentPrice).toLocaleString(locale)} EGP
                  </span>
                </>
              ) : (
                <span className="text-3xl font-black text-white">{Math.round(currentPrice).toLocaleString(locale)} EGP</span>
              )}
            </div>

            <p className="mt-6 text-sm leading-relaxed text-white">
              {product.description}
            </p>

            {/* Selection Area */}
            <div className="mt-8 flex flex-col gap-6 border-t border-border-color pt-6">
              
              {/* Dynamic Size & Flavor Selectors */}
              <div className="flex flex-col gap-5">
                {/* Size Selector */}
                {(product.variantType === "size" || product.variantType === "both") && availableSizes.length > 0 && (
                  <div>
                    <h4 className="text-2xs font-extrabold uppercase tracking-widest text-muted-text mb-3">
                      Select Serving Size
                    </h4>
                    <div className="flex flex-wrap gap-2.5">
                      {availableSizes.map((size) => {
                        const isAvailable = filteredSizes.includes(size);
                        return (
                          <button
                            key={size}
                            onClick={() => isAvailable && setSelectedSize(size)}
                            disabled={!isAvailable}
                            className={`rounded-xl border px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-luxury ${
                              selectedSize === size
                                ? "border-primary-coral bg-primary-coral/10 text-primary-coral"
                                : !isAvailable
                                ? "border-border-color/30 bg-card-bg/30 text-muted-text/40 cursor-not-allowed opacity-40 line-through"
                                : "border-border-color bg-card-bg text-white hover:text-gray-800"
                            }`}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Flavor Selector */}
                {(product.variantType === "flavor" || product.variantType === "both") && availableFlavors.length > 0 && (
                  <div>
                    <h4 className="text-2xs font-extrabold uppercase tracking-widest text-muted-text mb-3">
                      Select Flavor Option
                    </h4>
                    <div className="flex flex-wrap gap-2.5">
                      {availableFlavors.map((flavor) => {
                        const isAvailable = filteredFlavors.includes(flavor);
                        return (
                          <button
                            key={flavor}
                            onClick={() => isAvailable && setSelectedFlavor(flavor)}
                            disabled={!isAvailable}
                            className={`rounded-xl border px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-luxury ${
                              selectedFlavor === flavor
                                ? "border-primary-coral bg-primary-coral/10 text-primary-coral"
                                : !isAvailable
                                ? "border-border-color/30 bg-card-bg/30 text-muted-text/40 cursor-not-allowed opacity-40 line-through"
                                : "border-border-color bg-card-bg text-white hover:text-gray-800"
                            }`}
                          >
                            {flavor}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Stock SKU Details */}
                <div className="flex justify-between items-center text-xs border-t border-border-color/30 pt-4">
                  <div className="flex flex-col gap-1">
                    <span className="font-extrabold text-muted-text uppercase tracking-wider text-4xs">Stock Availability</span>
                    <span className={`inline-block w-fit px-2.5 py-0.5 rounded-full text-3xs font-extrabold uppercase ${
                      isOutOfStock
                        ? "bg-red-500/10 text-red-500 border border-red-500/20"
                        : isLowStock
                          ? "bg-accent-orange/10 text-accent-orange border border-accent-orange/20"
                          : "bg-success-green/10 text-success-green border border-success-green/20"
                    }`}>
                      {stockText} {stockCount > 0 ? `(${stockCount} left)` : ""}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="font-extrabold text-muted-text uppercase tracking-wider text-4xs">SKU Code</span>
                    <span className="font-mono text-3xs text-white uppercase tracking-wider bg-surface-deep px-3 py-1 border border-border-color rounded-lg">
                      {matchedSku}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quantity Selector & Add to Cart */}
              <div className="flex flex-col gap-4 sm:flex-row mt-4">
                {/* Quantity adjustments */}
                <div className="flex items-center justify-between rounded-full border border-border-color bg-surface-deep p-1.5 w-full sm:w-36">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-surface-sec text-white hover:text-gray-800"
                  >
                    <Icon name="minus" size={14} />
                  </button>
                  <span className="text-sm font-black text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-surface-sec text-white hover:text-gray-800"
                  >
                    <Icon name="plus" size={14} />
                  </button>
                </div>

                {/* Add to Cart CTA */}
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-full py-4 text-sm font-black tracking-widest transition-luxury shadow-xl ${
                    isOutOfStock
                      ? "bg-border-color text-muted-text cursor-not-allowed"
                      : "bg-primary-coral text-[#180f0d] hover:bg-white hover:text-[#180f0d] hover:scale-102 hover:shadow-[0_0_20px_rgba(255,255,255,0.45)] cursor-pointer"
                  }`}
                >
                  <Icon name="cart" size={18} />
                  {isOutOfStock ? "OUT OF STOCK" : "ADD TO CART"}
                </button>
              </div>

            </div>

            {/* Accordion panel */}
            <div className="mt-8 border-t border-border-color pt-6 flex flex-col gap-3">
              
              {/* Accordion 1: Benefits */}
              <div className="border border-border-color bg-surface-deep/40 rounded-xl overflow-hidden">
                <button
                  onClick={() => setActiveAccordion(activeAccordion === "benefits" ? "" : "benefits")}
                  className="flex w-full items-center justify-between px-4 py-3.5 text-xs font-black uppercase tracking-wider text-white hover:bg-surface-sec transition-luxury"
                >
                  Pillars & Benefits
                  <Icon name={activeAccordion === "benefits" ? "chevron-up" : "chevron-down"} size={16} />
                </button>
                {activeAccordion === "benefits" && (
                  <div className="px-4 pb-4 text-xs text-white border-t border-border-color/30 pt-3 leading-relaxed flex flex-col gap-2.5">
                    {product.benefits.map((b: string, i: number) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <Icon name="check" size={14} className="text-success-green mt-0.5 shrink-0" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Accordion 2: Usage */}
              <div className="border border-border-color bg-surface-deep/40 rounded-xl overflow-hidden">
                <button
                  onClick={() => setActiveAccordion(activeAccordion === "usage" ? "" : "usage")}
                  className="flex w-full items-center justify-between px-4 py-3.5 text-xs font-black uppercase tracking-wider text-white hover:bg-surface-sec transition-luxury"
                >
                  Suggested Use
                  <Icon name={activeAccordion === "usage" ? "chevron-up" : "chevron-down"} size={16} />
                </button>
                {activeAccordion === "usage" && (
                  <div className="px-4 pb-4 text-xs text-white border-t border-border-color/30 pt-3 leading-relaxed">
                    <p className="bg-main-bg p-3 border border-border-color rounded-lg">{product.usage}</p>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>

        {/* Reviews Modules */}
        <section id="reviews-section" className="border-t border-border-color pt-12 mb-16">
          <h3 className="text-xl font-black uppercase tracking-wider text-white mb-8">
            {locale === "ar" ? "تقييمات العملاء الموثقة" : "Verified Customer Reviews"}
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Reviews List Column */}
            <div className="lg:col-span-7">
              {product.reviews && product.reviews.length > 0 ? (
                <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {product.reviews.map((rev: Review) => (
                    <div key={rev.id} className="rounded-2xl border border-border-color bg-card-bg p-6 transition-luxury hover:border-primary-coral/20">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary-coral/10 border border-primary-coral/30 flex items-center justify-center font-bold text-primary-coral text-xs uppercase">
                            {rev.author ? rev.author[0] : "C"}
                          </div>
                          <div>
                            <span className="block text-xs font-bold text-white">{rev.author}</span>
                            {rev.rating > 0 && (
                              <div className="flex text-primary-coral mt-0.5 gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Icon key={i} name="star" size={10} className={i < rev.rating ? "text-primary-coral fill-primary-coral" : "text-border-color"} />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <span className="text-3xs text-muted-text font-bold uppercase">
                          {new Date(rev.date).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-xs text-white leading-relaxed font-bold">
                        {rev.comment}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-border-color border-dashed bg-card-bg/20 py-12 text-center text-xs text-muted-text">
                  {locale === "ar" 
                    ? "لا توجد تقييمات لهذا المنتج بعد. كن أول من يكتب تقييماً!"
                    : "No reviews written for this formulation yet. Try this product and be the first to write review!"}
                </div>
              )}
            </div>

            {/* Write a Review Column */}
            <div className="lg:col-span-5">
              {!currentUserEmail ? (
                <div className="rounded-2xl border border-border-color bg-card-bg/40 p-8 glass-panel text-center py-10 sticky top-4">
                  <Icon name="lock" size={32} className="text-primary-coral mb-4 mx-auto animate-pulse" />
                  <h4 className="text-sm font-black uppercase tracking-wider text-white mb-2">
                    {locale === "ar" ? "تسجيل الدخول مطلوب" : "Authentication Required"}
                  </h4>
                  <p className="text-xs text-muted-text mb-6 uppercase font-bold tracking-wide">
                    {locale === "ar" 
                      ? "يجب عليك تسجيل الدخول بحسابك لتتمكن من كتابة مراجعة أو تقييم هذا المنتج." 
                      : "You must be logged in to write a review or rate this product."}
                  </p>
                  <Link
                    href="/login"
                    className="inline-flex w-full justify-center items-center rounded-xl bg-primary-coral py-3 text-xs font-black uppercase tracking-wider text-main-bg hover:opacity-90 transition-luxury shadow-lg shadow-primary-coral/25"
                  >
                    {locale === "ar" ? "تسجيل الدخول الآن" : "LOG IN NOW"}
                  </Link>
                </div>
              ) : (
                <div className="rounded-2xl border border-border-color bg-card-bg/40 p-6 glass-panel sticky top-4">
                  <h4 className="text-sm font-black uppercase tracking-wider text-white mb-4">
                    {locale === "ar" ? "شاركنا تجربتك ورأيك" : "Share Your Experience"}
                  </h4>
                  <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
                    {/* Stars input */}
                    <div>
                      <label className="block text-3xs font-bold uppercase tracking-wider text-muted-text mb-1.5">
                        {locale === "ar" ? "تقييمك بالنجوم" : "Your Rating"}
                      </label>
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewRating(star)}
                            className="text-primary-coral focus:outline-none transition-transform duration-200 hover:scale-125 cursor-pointer"
                          >
                            <Icon
                              name="star"
                              size={20}
                              className={star <= reviewRating ? "text-primary-coral fill-primary-coral" : "text-border-color"}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Name Input */}
                    <div>
                      <label className="block text-3xs font-bold uppercase tracking-wider text-muted-text mb-1.5">
                        {locale === "ar" ? "الاسم" : "Your Name"}
                      </label>
                      <input
                        id="review-name-input"
                        type="text"
                        required
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                        placeholder={locale === "ar" ? "أدخل اسمك الكريم" : "Enter your name"}
                        className="w-full rounded-xl border border-border-color bg-surface-deep/80 px-4 py-2.5 text-xs text-white placeholder-muted-text/50 focus:border-primary-coral focus:outline-none transition-luxury"
                      />
                    </div>

                    {/* Comment Input */}
                    <div>
                      <label className="block text-3xs font-bold uppercase tracking-wider text-muted-text mb-1.5">
                        {locale === "ar" ? "تعليقك" : "Comment"}
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder={locale === "ar" ? "ما هو رأيك في المنتج؟" : "Write your review details here..."}
                        className="w-full rounded-xl border border-border-color bg-surface-deep/80 px-4 py-2.5 text-xs text-white placeholder-muted-text/50 focus:border-primary-coral focus:outline-none transition-luxury resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="w-full rounded-xl bg-primary-coral py-3 text-xs font-black uppercase tracking-wider text-main-bg hover:opacity-90 active:scale-98 transition-luxury disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-primary-coral/25"
                    >
                      {submittingReview ? (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-main-bg border-t-transparent" />
                      ) : (
                        locale === "ar" ? "إرسال التقييم" : "Submit Review"
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Related Products Grid */}
        {relatedProducts.length > 0 && (
          <section className="border-t border-border-color pt-12">
            <h3 className="text-xl font-black uppercase tracking-wider text-white mb-8">Related Formulations</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((prod: Product) => (
                <div key={prod.id} className="group relative flex flex-col rounded-2xl border border-border-color bg-card-bg p-4 transition-luxury hover:border-primary-coral/40 hover:bg-surface-sec">
                  <div className="mb-4 mt-2 h-44 overflow-hidden flex items-center justify-center bg-surface-deep/40 rounded-xl">
                    {prod.mainImage ? (
                      <img
                        src={prod.mainImage}
                        alt={prod.name}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <ProductImage color={prod.imageColor} type={prod.imageType} glow={false} className="h-44 w-full" />
                    )}
                  </div>
                  <div className="flex-1">
                    <span className="text-3xs font-extrabold uppercase tracking-widest text-muted-text">{prod.category}</span>
                    <h4 className="mt-0.5 text-sm font-bold text-white group-hover:text-primary-coral transition-luxury leading-snug">
                      <Link href={`/products/${prod.id}`}>{prod.name}</Link>
                    </h4>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-border-color pt-3">
                    <span className="text-sm font-extrabold text-primary-coral">{Math.round(prod.discountPrice || prod.price).toLocaleString(locale)} EGP</span>
                    <Link
                      href={`/products/${prod.id}`}
                      className="text-3xs font-bold uppercase tracking-widest text-white hover:text-primary-coral transition-luxury"
                    >
                      VIEW DETAIL
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      <Footer />
    </div>
  );
}
