"use client";

import React from "react";
import { usePathname } from "next/navigation";

// Reusable components for skeleton layout
const CardSkeleton = () => (
  <div className="rounded-2xl border border-border-color bg-card-bg p-6 flex flex-col gap-3 animate-pulse">
    <div className="h-4 w-24 bg-surface-deep/50 rounded" />
    <div className="h-8 w-16 bg-primary-coral/10 dark:bg-primary-coral/20 rounded-lg" />
    <div className="h-3.5 w-36 bg-surface-deep/30 rounded" />
  </div>
);

const TableRowSkeleton = () => (
  <div className="flex items-center justify-between py-4 border-b border-border-color/30 animate-pulse">
    <div className="flex items-center gap-4 w-1/3">
      <div className="h-12 w-10 bg-surface-deep/50 rounded-lg shrink-0" />
      <div className="flex flex-col gap-2 flex-1">
        <div className="h-4 w-36 bg-surface-deep/50 rounded" />
        <div className="h-3 w-24 bg-surface-deep/30 rounded" />
      </div>
    </div>
    <div className="h-4 w-24 bg-surface-deep/40 rounded hidden md:block" />
    <div className="h-4 w-16 bg-surface-deep/40 rounded" />
    <div className="flex items-center gap-2">
      <div className="h-8 w-8 bg-surface-deep/40 rounded-lg" />
      <div className="h-8 w-8 bg-surface-deep/40 rounded-lg" />
    </div>
  </div>
);

const FormCardSkeleton = () => (
  <div className="rounded-2xl border border-border-color bg-card-bg p-6 flex flex-col gap-5 animate-pulse">
    <div className="h-5 w-48 bg-surface-deep/60 rounded mb-2" />
    <div className="flex flex-col gap-2">
      <div className="h-3 w-24 bg-surface-deep/45 rounded" />
      <div className="h-10 w-full bg-surface-deep/20 rounded-xl" />
    </div>
    <div className="flex flex-col gap-2">
      <div className="h-3 w-36 bg-surface-deep/45 rounded" />
      <div className="h-20 w-full bg-surface-deep/20 rounded-xl resize-none" />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="flex flex-col gap-2">
        <div className="h-3 w-20 bg-surface-deep/45 rounded" />
        <div className="h-10 w-full bg-surface-deep/20 rounded-xl" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="h-3 w-20 bg-surface-deep/45 rounded" />
        <div className="h-10 w-full bg-surface-deep/20 rounded-xl" />
      </div>
    </div>
    <div className="h-12 w-full bg-primary-coral/10 dark:bg-primary-coral/20 rounded-full mt-2" />
  </div>
);

export default function AdminContentLoader() {
  const pathname = usePathname();

  // 1. Home Control CMS page skeleton
  if (pathname.includes("/homepage")) {
    return (
      <div className="flex flex-col gap-8 w-full">
        <div className="flex justify-between items-center border-b border-border-color pb-5 animate-pulse">
          <div className="flex flex-col gap-2">
            <div className="h-6 w-64 bg-surface-deep/60 rounded" />
            <div className="h-3.5 w-96 bg-surface-deep/30 rounded" />
          </div>
          <div className="h-10 w-64 bg-surface-deep/40 rounded-xl" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 flex flex-col gap-6">
            <FormCardSkeleton />
            <FormCardSkeleton />
          </div>
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-border-color bg-card-bg p-6 flex flex-col gap-4 sticky top-6 animate-pulse">
              <div className="h-5 w-40 bg-surface-deep/60 rounded" />
              <div className="h-96 w-full bg-surface-deep/20 rounded-3xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Settings / Reports page skeleton
  if (pathname.includes("/settings") || pathname.includes("/reports")) {
    return (
      <div className="flex flex-col gap-8 w-full">
        <div className="flex justify-between items-center border-b border-border-color pb-5 animate-pulse">
          <div className="flex flex-col gap-2">
            <div className="h-6 w-48 bg-surface-deep/60 rounded" />
            <div className="h-3.5 w-80 bg-surface-deep/30 rounded" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormCardSkeleton />
          <div className="flex flex-col gap-6">
            <div className="rounded-2xl border border-border-color bg-card-bg p-6 h-64 animate-pulse flex flex-col gap-4">
              <div className="h-5 w-36 bg-surface-deep/60 rounded" />
              <div className="h-4 w-full bg-surface-deep/20 rounded" />
              <div className="h-4 w-5/6 bg-surface-deep/20 rounded" />
            </div>
            <div className="rounded-2xl border border-border-color bg-card-bg p-6 h-64 animate-pulse flex flex-col gap-4">
              <div className="h-5 w-36 bg-surface-deep/60 rounded" />
              <div className="h-4 w-full bg-surface-deep/20 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Products / Orders / Customers / Categories / Coupons / Expenses list tables skeleton
  if (
    pathname.includes("/products") ||
    pathname.includes("/orders") ||
    pathname.includes("/customers") ||
    pathname.includes("/categories") ||
    pathname.includes("/coupons") ||
    pathname.includes("/expenses") ||
    pathname.includes("/goverment")
  ) {
    return (
      <div className="flex flex-col gap-6 w-full">
        {/* Table Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-border-color pb-5 gap-4 animate-pulse">
          <div className="flex flex-col gap-2">
            <div className="h-6 w-40 bg-surface-deep/60 rounded" />
            <div className="h-3.5 w-64 bg-surface-deep/30 rounded" />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="h-10 w-48 bg-surface-deep/20 rounded-xl" />
            <div className="h-10 w-28 bg-primary-coral/10 dark:bg-primary-coral/20 rounded-xl" />
          </div>
        </div>

        {/* Mock table skeleton */}
        <div className="rounded-2xl border border-border-color bg-card-bg p-6 flex flex-col gap-2">
          {/* Table Headers */}
          <div className="flex items-center justify-between py-3 border-b border-border-color/50 text-xs font-bold text-muted-text uppercase animate-pulse mb-2">
            <div className="w-1/3 h-4 bg-surface-deep/40 rounded" />
            <div className="h-4 w-24 bg-surface-deep/40 rounded hidden md:block" />
            <div className="h-4 w-16 bg-surface-deep/40 rounded" />
            <div className="h-4 w-20 bg-surface-deep/40 rounded" />
          </div>

          {/* Table rows */}
          <TableRowSkeleton />
          <TableRowSkeleton />
          <TableRowSkeleton />
          <TableRowSkeleton />
          <TableRowSkeleton />
        </div>
      </div>
    );
  }

  // 4. Overview page (root "/admin") skeleton
  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Page Header */}
      <div className="flex justify-between items-center border-b border-border-color pb-5 animate-pulse">
        <div className="flex flex-col gap-2">
          <div className="h-6 w-48 bg-surface-deep/60 rounded" />
          <div className="h-3.5 w-80 bg-surface-deep/30 rounded" />
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>

      {/* Overview Analytics Details */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8 rounded-2xl border border-border-color bg-card-bg p-6 h-96 animate-pulse flex flex-col gap-4">
          <div className="h-5 w-32 bg-surface-deep/60 rounded" />
          <div className="flex-1 bg-surface-deep/10 rounded-xl" />
        </div>
        <div className="lg:col-span-4 rounded-2xl border border-border-color bg-card-bg p-6 h-96 animate-pulse flex flex-col gap-4">
          <div className="h-5 w-40 bg-surface-deep/60 rounded" />
          <div className="flex-1 rounded-full border-8 border-surface-deep/30 max-h-56 mx-auto aspect-square" />
        </div>
      </div>
    </div>
  );
}
