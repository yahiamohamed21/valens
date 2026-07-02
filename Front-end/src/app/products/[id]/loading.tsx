"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function ProductDetailsLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-main-bg text-foreground font-sans">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Link Skeleton */}
        <div className="h-4 w-32 bg-surface-deep/40 rounded animate-pulse mb-8" />

        {/* Product Split Columns Skeleton */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 mb-16">
          
          {/* Left Column: Image Gallery & Facts */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="relative rounded-3xl border border-border-color bg-card-bg/60 p-8 flex flex-col items-center justify-center min-h-[400px] overflow-hidden glass-panel animate-pulse">
              <div className="h-80 w-56 bg-surface-deep/30 rounded-2xl" />
            </div>

            {/* Gallery tabs skeletons */}
            <div className="flex justify-center gap-3 animate-pulse">
              <div className="h-10 w-24 bg-surface-deep/40 rounded-xl" />
              <div className="h-10 w-24 bg-surface-deep/40 rounded-xl" />
              <div className="h-10 w-24 bg-surface-deep/40 rounded-xl" />
            </div>
          </div>

          {/* Right Column: Product Info & Purchase Form */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="flex flex-col gap-3 animate-pulse">
              {/* Category Tag */}
              <div className="h-4 w-20 bg-surface-deep/50 rounded" />
              
              {/* Product Title */}
              <div className="h-10 w-3/4 bg-surface-deep/60 rounded" />
              
              {/* Ratings */}
              <div className="flex items-center gap-1">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-3 w-3 bg-surface-deep/40 rounded-full" />
                  ))}
                </div>
                <div className="h-3 w-20 bg-surface-deep/40 rounded ml-2" />
              </div>

              {/* Price Tag */}
              <div className="h-8 w-32 bg-primary-coral/10 dark:bg-primary-coral/20 rounded-lg mt-2" />
            </div>

            {/* Selector sections */}
            <div className="border-t border-b border-border-color/30 py-6 flex flex-col gap-6 animate-pulse">
              {/* Size Selectors */}
              <div className="flex flex-col gap-2.5">
                <div className="h-3.5 w-16 bg-surface-deep/40 rounded" />
                <div className="flex gap-2">
                  <div className="h-10 w-16 bg-surface-deep/30 rounded-xl" />
                  <div className="h-10 w-16 bg-surface-deep/30 rounded-xl" />
                </div>
              </div>

              {/* Flavor Selectors */}
              <div className="flex flex-col gap-2.5">
                <div className="h-3.5 w-20 bg-surface-deep/40 rounded" />
                <div className="flex gap-2">
                  <div className="h-10 w-24 bg-surface-deep/30 rounded-xl" />
                  <div className="h-10 w-24 bg-surface-deep/30 rounded-xl" />
                </div>
              </div>
            </div>

            {/* Quantity and Cart Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-pulse">
              <div className="h-14 w-32 bg-surface-deep/30 rounded-full" />
              <div className="h-14 flex-1 bg-primary-coral/10 dark:bg-primary-coral/20 rounded-full" />
            </div>

            {/* Accordion List Skeletons */}
            <div className="flex flex-col gap-3 mt-4 border-t border-border-color/30 pt-6 animate-pulse">
              <div className="flex justify-between items-center py-3 border-b border-border-color/20">
                <div className="h-4 w-28 bg-surface-deep/45 rounded" />
                <div className="h-4 w-4 bg-surface-deep/45 rounded" />
              </div>
              <div className="flex justify-between items-center py-3 border-b border-border-color/20">
                <div className="h-4 w-24 bg-surface-deep/45 rounded" />
                <div className="h-4 w-4 bg-surface-deep/45 rounded" />
              </div>
              <div className="flex justify-between items-center py-3 border-b border-border-color/20">
                <div className="h-4 w-32 bg-surface-deep/45 rounded" />
                <div className="h-4 w-4 bg-surface-deep/45 rounded" />
              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
