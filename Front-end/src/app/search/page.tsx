"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useApp, Product } from "@/context/AppContext";
import { ProductCard } from "@/components/ProductCard";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Icon } from "@/components/SvgIcons";
import Link from "next/link";

export default function SearchPage() {
  const { products } = useApp();
  const searchParams = useSearchParams();
  const router = useRouter();

  const query = searchParams.get("q") || "";
  const [searchVal, setSearchVal] = useState(query);

  // Sync state when query parameter updates
  useEffect(() => {
    setSearchVal(query);
  }, [query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(searchVal.trim())}`);
  };

  // Perform search query matches on product catalog
  const matchingProducts = useMemo(() => {
    if (!query.trim()) return [];
    
    return products.filter((product: Product) => {
      if (!product.visible) return false;
      
      const searchStr = query.toLowerCase();
      return (
        product.name.toLowerCase().includes(searchStr) ||
        product.category.toLowerCase().includes(searchStr) ||
        product.description.toLowerCase().includes(searchStr) ||
        product.ingredients.some((i: string) => i.toLowerCase().includes(searchStr)) ||
        product.sku.toLowerCase().includes(searchStr)
      );
    });
  }, [products, query]);

  return (
    <div className="flex min-h-screen flex-col bg-main-bg text-foreground">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Search header container */}
        <div className="rounded-3xl border border-border-color bg-surface-deep/40 px-6 py-10 md:p-12 mb-10 text-center glass-panel">
          <span className="text-2xs font-extrabold uppercase tracking-widest text-primary-coral">Search Engine</span>
          <h1 className="mt-2 text-2xl font-black uppercase tracking-wider text-white">
            {query.trim() ? `Search Results for "${query}"` : "Search Valens Formulations"}
          </h1>
          
          <form onSubmit={handleSearchSubmit} className="relative mt-8 max-w-xl mx-auto">
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Search by product name, category, or active ingredient (e.g. Whey, Creatine, Ashwagandha)..."
              className="w-full rounded-full border border-border-color bg-surface-deep px-6 py-4 pl-12 text-xs text-white placeholder-muted-text focus:border-primary-coral focus:outline-none focus:ring-1 focus:ring-primary-coral/30 transition-luxury"
            />
            <Icon name="search" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-text" />
            {searchVal && (
              <button
                type="button"
                onClick={() => setSearchVal("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-text hover:text-gray-800"
              >
                <Icon name="close" size={16} />
              </button>
            )}
          </form>
        </div>

        {/* Results Render */}
        {query.trim() ? (
          matchingProducts.length > 0 ? (
            <div>
              <div className="flex items-center justify-between border-b border-border-color pb-4 mb-8">
                <span className="text-xs font-bold text-white">
                  Found <span className="font-extrabold text-white">{matchingProducts.length}</span> matching formulations
                </span>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {matchingProducts.map((product: Product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="rounded-3xl border border-border-color border-dashed bg-card-bg/25 py-24 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-deep border border-border-color text-primary-coral mb-4">
                <Icon name="close" size={28} />
              </div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wider">No Formulations Match</h3>
              <p className="mt-2 text-xs text-muted-text max-w-sm mx-auto leading-relaxed">
                We couldn't find any supplements containing matches for <span className="text-white font-bold font-bold">"{query}"</span>. Try searching other search keywords.
              </p>
              
              {/* Helpful suggestions */}
              <div className="mt-8 max-w-md mx-auto">
                <span className="text-2xs font-extrabold uppercase tracking-widest text-muted-text">Suggested search shortcuts</span>
                <div className="mt-3 flex flex-wrap justify-center gap-2">
                  {["Whey", "Creatine", "Pre-workout", "Capsules", "Wellness", "BCAAs"].map((kw: string) => (
                    <button
                      key={kw}
                      onClick={() => {
                        setSearchVal(kw);
                        router.push(`/search?q=${encodeURIComponent(kw)}`);
                      }}
                      className="rounded-xl border border-border-color bg-surface-deep px-3.5 py-1.5 text-2xs font-bold text-white hover:border-primary-coral hover:text-primary-coral transition-luxury"
                    >
                      {kw}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )
        ) : (
          /* Landing search guidance */
          <div className="rounded-3xl border border-border-color bg-card-bg/40 py-20 text-center">
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-muted-text">Awaiting Query Input</h3>
            <p className="mt-2 text-xs text-muted-text max-w-xs mx-auto">
              Please enter search terms above to query the active Valens pharmaceutical database.
            </p>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
