"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useApp, Product, Review } from "@/context/AppContext";
import { ProductImage } from "@/components/ProductCard";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Icon } from "@/components/SvgIcons";
import Link from "next/link";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { products, addToCart } = useApp();
  
  const id = params?.id as string;
  const product = useMemo(() => products.find((p: Product) => p.id === id), [products, id]);

  // Gallery tabs: "front", "label", "facts"
  const [activeTab, setActiveTab] = useState<"front" | "label" | "facts">("front");
  const [quantity, setQuantity] = useState(1);
  const [activeAccordion, setActiveAccordion] = useState<string>("benefits");

  // Selection states
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedFlavor, setSelectedFlavor] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Find all unique sizes and flavors for the active product
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

  // Pre-populate selectors when product details page loads
  useEffect(() => {
    if (product) {
      if (product.variants && product.variants.length > 0) {
        setSelectedSize(product.variants[0].size || "");
        setSelectedFlavor(product.variants[0].flavor || "");
      } else {
        setSelectedSize("");
        setSelectedFlavor("");
      }
      setSelectedImageIndex(0);
      setActiveTab("front");
    }
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

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col bg-main-bg text-white">
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
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary-coral px-6 py-2.5 text-xs font-black tracking-widest text-main-bg hover:bg-white transition-luxury"
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

  const isOutOfStock = matchedVariant ? matchedVariant.stockQuantity === 0 : product.stock === 0;
  const isLowStock = matchedVariant ? (matchedVariant.stockQuantity > 0 && matchedVariant.stockQuantity <= 10) : (product.stock > 0 && product.stock <= 10);
  const stockText = isOutOfStock ? "Out of Stock" : isLowStock ? "Low Stock" : "In Stock";
  const matchedSku = matchedVariant ? matchedVariant.sku : product.sku;
  const stockCount = matchedVariant ? matchedVariant.stockQuantity : product.stock;

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
    <div className="flex min-h-screen flex-col bg-main-bg text-white">
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
                    />
                  ) : (
                    <ProductImage color={product.imageColor} type={product.imageType} glow={true} className="h-96 w-full" />
                  )}
                </div>
              )}

              {activeTab === "label" && (
                <div className="w-full max-w-md bg-surface-deep border border-border-color rounded-2xl p-6 font-mono text-xs text-soft-text text-left leading-relaxed">
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

              {activeTab === "facts" && (
                <div className="w-full max-w-sm border-2 border-white bg-black p-4 text-white text-left font-sans select-none">
                  <div className="border-b-4 border-white pb-1">
                    <h3 className="text-xl font-black uppercase leading-none tracking-tight">Supplement Facts</h3>
                    <span className="text-3xs">Serving Size 1 Scoop ({product.size === "120 Capsules" || product.size === "90 Capsules" ? "3-4 Capsules" : "15-30g"})</span>
                  </div>
                  <div className="border-b-2 border-white text-3xs py-1 flex justify-between font-bold">
                    <span>Amount Per Serving</span>
                    <span>% Daily Value*</span>
                  </div>
                  <div className="border-b border-white py-1 flex justify-between text-2xs font-semibold">
                    <span>Calories</span>
                    <span>{product.category === "Protein" ? "120" : "15"}</span>
                  </div>
                  <div className="border-b border-white py-1 flex justify-between text-2xs">
                    <span>Total Fat {product.category === "Protein" ? "0.5g" : "0g"}</span>
                    <span>{product.category === "Protein" ? "1%" : "0%"}</span>
                  </div>
                  <div className="border-b border-white py-1 flex justify-between text-2xs">
                    <span>Total Carbohydrates {product.category === "Protein" ? "1g" : "0g"}</span>
                    <span>{product.category === "Protein" ? "<1%" : "0%"}</span>
                  </div>
                  <div className="border-b border-white py-1 flex justify-between text-2xs">
                    <span>Sodium 120mg</span>
                    <span>5%</span>
                  </div>
                  <div className="border-b-4 border-white py-1 flex justify-between text-2xs font-bold">
                    <span>Protein {product.category === "Protein" ? "26g" : "0g"}</span>
                    <span>{product.category === "Protein" ? "52%" : "0%"}</span>
                  </div>
                  <p className="text-4xs pt-2 leading-none">
                    * Percent Daily Values are based on a 2,000 calorie diet. Your daily values may be higher or lower depending on your calorie needs.
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
                    <img src={img} className="h-full w-full object-contain" />
                  </button>
                ))}
              </div>
            )}

            {/* Gallery Thumbnail Toggles */}
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => setActiveTab("front")}
                className={`rounded-xl border p-3 text-xs font-bold uppercase tracking-wider transition-luxury flex flex-col items-center gap-1.5 ${
                  activeTab === "front"
                    ? "border-primary-coral bg-primary-coral/5 text-primary-coral"
                    : "border-border-color bg-card-bg text-muted-text hover:text-white"
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
                    : "border-border-color bg-card-bg text-muted-text hover:text-white"
                }`}
              >
                <Icon name="tag" size={14} />
                Ingredients
              </button>
              <button
                onClick={() => setActiveTab("facts")}
                className={`rounded-xl border p-3 text-xs font-bold uppercase tracking-wider transition-luxury flex flex-col items-center gap-1.5 ${
                  activeTab === "facts"
                    ? "border-primary-coral bg-primary-coral/5 text-primary-coral"
                    : "border-border-color bg-card-bg text-muted-text hover:text-white"
                }`}
              >
                <Icon name="report" size={14} />
                Nutrition facts
              </button>
            </div>
          </div>

          {/* Right Column: Order Configuration */}
          <div className="lg:col-span-6 flex flex-col justify-start">
            <span className="text-2xs font-extrabold uppercase tracking-widest text-primary-coral">{product.category}</span>
            <h1 className="mt-2 text-3xl font-black uppercase tracking-wider text-white sm:text-4xl">{product.name}</h1>
            
            {/* Rating summary */}
            <div className="mt-4 flex items-center gap-2 border-b border-border-color pb-4">
              <div className="flex text-primary-coral">
                {[...Array(5)].map((_, i) => (
                  <Icon key={i} name="star" size={14} className={i < Math.floor(product.rating) ? "text-primary-coral" : "text-border-color"} />
                ))}
              </div>
              <span className="text-xs font-bold text-white">{product.rating.toFixed(1)}</span>
              <span className="text-2xs text-muted-text font-bold">({product.reviews.length || 3} verified customer reviews)</span>
            </div>

            {/* Pricing Panel */}
            <div className="mt-6 flex items-baseline gap-4">
              {hasDiscount ? (
                <>
                  <span className="text-3xl font-black text-primary-coral">{Math.round(currentPrice).toLocaleString()} EGP</span>
                  <span className="text-lg text-muted-text line-through">{Math.round(originalPrice).toLocaleString()} EGP</span>
                  <span className="rounded-full bg-accent-orange px-2.5 py-0.5 text-3xs font-extrabold text-white">
                    SAVE {Math.round(originalPrice - currentPrice).toLocaleString()} EGP
                  </span>
                </>
              ) : (
                <span className="text-3xl font-black text-white">{Math.round(currentPrice).toLocaleString()} EGP</span>
              )}
            </div>

            <p className="mt-6 text-sm leading-relaxed text-soft-text">
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
                      {availableSizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`rounded-xl border px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-luxury ${
                            selectedSize === size
                              ? "border-primary-coral bg-primary-coral/10 text-primary-coral"
                              : "border-border-color bg-card-bg text-soft-text hover:text-white"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
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
                      {availableFlavors.map((flavor) => (
                        <button
                          key={flavor}
                          onClick={() => setSelectedFlavor(flavor)}
                          className={`rounded-xl border px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-luxury ${
                            selectedFlavor === flavor
                              ? "border-primary-coral bg-primary-coral/10 text-primary-coral"
                              : "border-border-color bg-card-bg text-soft-text hover:text-white"
                          }`}
                        >
                          {flavor}
                        </button>
                      ))}
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
                    className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-surface-sec text-soft-text hover:text-white"
                  >
                    <Icon name="minus" size={14} />
                  </button>
                  <span className="text-sm font-black text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-surface-sec text-soft-text hover:text-white"
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
                      : "bg-primary-coral text-main-bg hover:bg-white hover:scale-102 hover:shadow-[0_0_20px_rgba(255,138,117,0.3)]"
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
                  <div className="px-4 pb-4 text-xs text-soft-text border-t border-border-color/30 pt-3 leading-relaxed flex flex-col gap-2.5">
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
                  <div className="px-4 pb-4 text-xs text-soft-text border-t border-border-color/30 pt-3 leading-relaxed">
                    <p className="bg-main-bg p-3 border border-border-color rounded-lg">{product.usage}</p>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>

        {/* Reviews Modules */}
        <section className="border-t border-border-color pt-12 mb-16">
          <h3 className="text-xl font-black uppercase tracking-wider text-white mb-8">Verified Customer Reviews</h3>
          
          {product.reviews.length > 0 ? (
            <div className="flex flex-col gap-4">
              {product.reviews.map((rev: Review) => (
                <div key={rev.id} className="rounded-2xl border border-border-color bg-card-bg p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary-coral/10 border border-primary-coral/30 flex items-center justify-center font-bold text-primary-coral text-xs">
                        {rev.author[0]}
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-white">{rev.author}</span>
                        <div className="flex text-primary-coral mt-0.5 gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Icon key={i} name="star" size={10} className={i < rev.rating ? "text-primary-coral" : "text-border-color"} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-3xs text-muted-text font-bold uppercase">{rev.date}</span>
                  </div>
                  <p className="text-xs text-soft-text leading-relaxed font-bold">
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-border-color border-dashed bg-card-bg/20 py-10 text-center text-xs text-muted-text">
              No reviews written for this formulation yet. Try this product and be the first to write review!
            </div>
          )}
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
                      <img src={prod.mainImage} alt={prod.name} className="h-full w-full object-contain" />
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
                    <span className="text-sm font-extrabold text-primary-coral">{Math.round(prod.discountPrice || prod.price).toLocaleString()} EGP</span>
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
