"use client";

import React, { useState, useMemo } from "react";
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
  
  // Selection states
  const [selectedVariant, setSelectedVariant] = useState(() => {
    // derive initial selected variant from available products to avoid setting state inside an effect
    const initialProduct = products?.find((p: Product) => p.id === id);
    return initialProduct && initialProduct.variants.length > 0 ? initialProduct.variants[0] : "";
  });
  const [quantity, setQuantity] = useState(1);
  const [activeAccordion, setActiveAccordion] = useState<string>("benefits");

  // NOTE: selectedVariant is initialized from products above to avoid synchronous setState in effect

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

  const handleAddToCart = () => {
    if (product.stockStatus === "Out of Stock") return;
    addToCart(product, quantity, product.size, selectedVariant);
  };

  const hasDiscount = !!product.discountPrice;
  const currentPrice = product.discountPrice || product.price;

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
                <ProductImage color={product.imageColor} type={product.imageType} glow={true} className="h-96 w-full" />
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
                  <span className="text-3xl font-black text-primary-coral">${product.discountPrice?.toFixed(2)}</span>
                  <span className="text-lg text-muted-text line-through">${product.price.toFixed(2)}</span>
                  <span className="rounded-full bg-accent-orange px-2.5 py-0.5 text-3xs font-extrabold text-white">
                    SAVE ${Math.round(product.price - (product.discountPrice || 0))}
                  </span>
                </>
              ) : (
                <span className="text-3xl font-black text-white">${product.price.toFixed(2)}</span>
              )}
            </div>

            <p className="mt-6 text-sm leading-relaxed text-soft-text">
              {product.description}
            </p>

            {/* Selection Area */}
            <div className="mt-8 flex flex-col gap-6 border-t border-border-color pt-6">
              
              {/* Size variant list */}
              <div className="flex justify-between items-center text-xs">
                <span className="font-extrabold text-muted-text uppercase tracking-wider">Serving weight</span>
                <span className="font-bold text-white uppercase tracking-wider bg-surface-deep px-3 py-1 border border-border-color rounded-lg">{product.size}</span>
              </div>

              {/* Flavors Select */}
              {product.variants.length > 0 && (
                <div>
                  <h4 className="text-2xs font-extrabold uppercase tracking-widest text-muted-text mb-3">
                    Choose Flavor / Option
                  </h4>
                  <div className="flex flex-wrap gap-2.5">
                    {product.variants.map((v: string) => (
                      <button
                        key={v}
                        onClick={() => setSelectedVariant(v)}
                        className={`rounded-xl border px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-luxury ${
                          selectedVariant === v
                            ? "border-primary-coral bg-primary-coral/10 text-primary-coral"
                            : "border-border-color bg-card-bg text-soft-text hover:text-white"
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              )}

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
                  disabled={product.stockStatus === "Out of Stock"}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-full py-4 text-sm font-black tracking-widest transition-luxury shadow-xl ${
                    product.stockStatus === "Out of Stock"
                      ? "bg-border-color text-muted-text cursor-not-allowed"
                      : "bg-primary-coral text-main-bg hover:bg-white hover:scale-102 hover:shadow-[0_0_20px_rgba(255,138,117,0.3)]"
                  }`}
                >
                  <Icon name="cart" size={18} />
                  {product.stockStatus === "Out of Stock" ? "OUT OF STOCK" : "ADD TO CART"}
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
                <div key={prod.id} className="group relative flex flex-col rounded-2xl border border-border-color bg-card-bg p-4 transition-luxury hover:border-primary-coral/40 hover:bg-[#1f1614]">
                  <div className="mb-4 mt-2">
                    <ProductImage color={prod.imageColor} type={prod.imageType} glow={false} className="h-44 w-full" />
                  </div>
                  <div className="flex-1">
                    <span className="text-3xs font-extrabold uppercase tracking-widest text-muted-text">{prod.category}</span>
                    <h4 className="mt-0.5 text-sm font-bold text-white group-hover:text-primary-coral transition-luxury leading-snug">
                      <Link href={`/products/${prod.id}`}>{prod.name}</Link>
                    </h4>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-border-color pt-3">
                    <span className="text-sm font-extrabold text-primary-coral">${(prod.discountPrice || prod.price).toFixed(2)}</span>
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
