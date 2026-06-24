"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useApp, Product, Category } from "@/context/AppContext";
import { ProductCard } from "@/components/ProductCard";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Icon } from "@/components/SvgIcons";

export default function ProductsPage() {
  const { products, categories } = useApp();
  const searchParams = useSearchParams();

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [maxPrice, setMaxPrice] = useState(100);
  const [selectedStock, setSelectedStock] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("best-selling");

  // Read URL query parameters if present
  useEffect(() => {
    const catQuery = searchParams.get("category");
    const searchQ = searchParams.get("q");
    if (catQuery) setSelectedCategory(catQuery);
    if (searchQ) setSearchQuery(searchQ);
  }, [searchParams]);

  // Handle stock filter check
  const handleStockChange = (status: string) => {
    if (selectedStock.includes(status)) {
      setSelectedStock(selectedStock.filter((s: string) => s !== status));
    } else {
      setSelectedStock([...selectedStock, status]);
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setMaxPrice(100);
    setSelectedStock([]);
    setSortBy("best-selling");
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((product: Product) => {
        // Visible toggle controlled by admin
        if (!product.visible) return false;

        // Search query filter
        const matchesSearch =
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.ingredients.some((i: string) => i.toLowerCase().includes(searchQuery.toLowerCase()));

        // Category filter
        const matchesCategory =
          selectedCategory === "all" ||
          product.category.toLowerCase() === selectedCategory.toLowerCase();

        // Price filter (uses discount price if available)
        const priceToCompare = product.discountPrice || product.price;
        const matchesPrice = priceToCompare <= maxPrice;

        // Stock status filter
        const matchesStock =
          selectedStock.length === 0 || selectedStock.includes(product.stockStatus);

        return matchesSearch && matchesCategory && matchesPrice && matchesStock;
      })
      .sort((a: Product, b: Product) => {
        const priceA = a.discountPrice || a.price;
        const priceB = b.discountPrice || b.price;

        if (sortBy === "price-low") return priceA - priceB;
        if (sortBy === "price-high") return priceB - priceA;
        if (sortBy === "best-selling") {
          // Sort by rating & bestseller tag
          const scoreA = a.rating + (a.bestSeller ? 2 : 0);
          const scoreB = b.rating + (b.bestSeller ? 2 : 0);
          return scoreB - scoreA;
        }
        if (sortBy === "latest") {
          // New arrivals first
          return (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0);
        }
        return 0;
      });
  }, [products, searchQuery, selectedCategory, maxPrice, selectedStock, sortBy]);

  return (
    <div className="flex min-h-screen flex-col bg-main-bg text-white">
      <Navbar />
      
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Page Title & Search Bar */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-border-color pb-6 mb-8">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-wider text-white">
              VALENS FORMULAS
            </h1>
            <p className="mt-1 text-xs text-muted-text uppercase tracking-widest font-semibold">
              Advanced supplement science for peak athleticism
            </p>
          </div>
          
          <div className="relative w-full max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search supplement ingredients or names..."
              className="w-full rounded-full border border-border-color bg-surface-deep px-4 py-3 pl-11 text-xs text-white placeholder-muted-text focus:border-primary-coral focus:outline-none focus:ring-1 focus:ring-primary-coral/30 transition-luxury"
            />
            <Icon name="search" size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-text" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-text hover:text-white"
              >
                <Icon name="close" size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Layout Grid: Filters (Left) + Products Grid (Right) */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          
          {/* Filters Sidebar */}
          <aside className="lg:col-span-3 flex flex-col gap-6">
            <div className="rounded-2xl border border-border-color bg-card-bg p-5">
              <div className="flex items-center justify-between border-b border-border-color pb-4 mb-4">
                <span className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                  <Icon name="settings" size={14} />
                  Filters
                </span>
                <button
                  onClick={resetFilters}
                  className="text-2xs font-extrabold uppercase tracking-wide text-primary-coral hover:text-white transition-luxury"
                >
                  Reset All
                </button>
              </div>

              {/* 1. Category Filter */}
              <div className="mb-6">
                <h4 className="text-2xs font-black uppercase tracking-widest text-muted-text mb-3">Category</h4>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-luxury text-left ${
                      selectedCategory === "all"
                        ? "bg-primary-coral/10 text-primary-coral border border-primary-coral/20"
                        : "bg-surface-deep text-soft-text hover:bg-surface-sec border border-transparent"
                    }`}
                  >
                    All Formulas
                    <span className="text-3xs bg-main-bg px-2 py-0.5 rounded-full text-muted-text">
                      {products.filter((p: Product) => p.visible).length}
                    </span>
                  </button>
                  {categories.filter((c: Category) => c.visible).map((cat: Category) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-luxury text-left ${
                        selectedCategory === cat.slug
                          ? "bg-primary-coral/10 text-primary-coral border border-primary-coral/20"
                          : "bg-surface-deep text-soft-text hover:bg-surface-sec border border-transparent"
                      }`}
                    >
                      {cat.name}
                      <span className="text-3xs bg-main-bg px-2 py-0.5 rounded-full text-muted-text font-bold">
                        {products.filter((p: Product) => p.category.toLowerCase() === cat.slug && p.visible).length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Price Range Filter */}
              <div className="mb-6 border-t border-border-color pt-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-2xs font-black uppercase tracking-widest text-muted-text">Max Price</h4>
                  <span className="text-sm font-black text-primary-coral">${maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-primary-coral h-1 bg-border-color rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-4xs text-muted-text mt-1 uppercase font-bold">
                  <span>$10</span>
                  <span>$100</span>
                </div>
              </div>

              {/* 3. Availability Filter */}
              <div className="border-t border-border-color pt-4">
                <h4 className="text-2xs font-black uppercase tracking-widest text-muted-text mb-3">Availability</h4>
                <div className="flex flex-col gap-2">
                  {["In Stock", "Low Stock", "Out of Stock"].map((status: string) => (
                    <label
                      key={status}
                      className="flex items-center gap-3 cursor-pointer text-xs font-semibold text-soft-text hover:text-white uppercase tracking-wider"
                    >
                      <input
                        type="checkbox"
                        checked={selectedStock.includes(status)}
                        onChange={() => handleStockChange(status)}
                        className="rounded border-border-color bg-surface-deep text-primary-coral focus:ring-0 cursor-pointer h-4 w-4"
                      />
                      {status}
                    </label>
                  ))}
                </div>
              </div>

            </div>
          </aside>

          {/* Product Grid Area */}
          <section className="lg:col-span-9 flex flex-col gap-6">
            
            {/* Sorting & Result Count Bar */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-border-color bg-card-bg p-4">
              <span className="text-xs font-bold text-soft-text">
                Showing <span className="font-extrabold text-white">{filteredProducts.length}</span> supplements
              </span>
              
              <div className="flex items-center gap-2">
                <span className="text-2xs font-black uppercase tracking-widest text-muted-text">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-xl border border-border-color bg-surface-deep px-3 py-1.5 text-xs font-semibold text-white focus:outline-none focus:border-primary-coral cursor-pointer uppercase tracking-wider"
                >
                  <option value="best-selling">Best Sellers</option>
                  <option value="latest">New Arrivals</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product: Product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="rounded-3xl border border-border-color border-dashed bg-card-bg/25 py-24 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-deep border border-border-color text-muted-text mb-4">
                  <Icon name="search" size={28} />
                </div>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">No Supplements Found</h3>
                <p className="mt-1 text-xs text-muted-text max-w-xs mx-auto">
                  We couldn't find any products matching your active filters. Try adjusting your queries or price limits.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary-coral px-6 py-2.5 text-xs font-black tracking-widest text-main-bg hover:bg-white transition-luxury"
                >
                  RESET ALL FILTERS
                </button>
              </div>
            )}

          </section>
        </div>

      </main>

      <Footer />
    </div>
  );
}
