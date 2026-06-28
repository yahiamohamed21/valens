"use client";

import React, { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { locale, changeLanguage } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  const getActiveTabName = () => {
    const segments = pathname.split("/");
    const lastSegment = segments[segments.length - 1];
    if (lastSegment === "admin" || !lastSegment) return locale === "ar" ? "نظرة عامة" : "OVERVIEW";
    if (lastSegment === "homepage") return locale === "ar" ? "التحكم بالرئيسية" : "HOME CONTROL";
    if (lastSegment === "products") return locale === "ar" ? "المنتجات" : "PRODUCTS";
    if (lastSegment === "categories") return locale === "ar" ? "التصنيفات" : "CATEGORIES";
    if (lastSegment === "orders") return locale === "ar" ? "الطلبات" : "ORDERS";
    if (lastSegment === "customers") return locale === "ar" ? "العملاء" : "CUSTOMERS";
    if (lastSegment === "coupons") return locale === "ar" ? "الكوبونات" : "COUPONS";
    if (lastSegment === "expenses") return locale === "ar" ? "المصاريف" : "EXPENSES";
    if (lastSegment === "reports") return locale === "ar" ? "التقارير" : "REPORTS";
    if (lastSegment === "settings") return locale === "ar" ? "الإعدادات" : "SETTINGS";
    return lastSegment.toUpperCase();
  };

  return (
    <div className="flex h-screen overflow-hidden bg-main-bg text-white font-sans antialiased">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className={`flex h-16 items-center justify-between border-b border-border-color bg-surface-deep/30 px-6 ${
          locale === "ar" ? "flex-row-reverse" : ""
        }`}>
          <h2 className="text-sm font-black uppercase tracking-widest text-muted-text">
            {locale === "ar" ? "لوحة التحكم بالنظام" : "SYSTEMS CONTROL PANEL"} &gt; <span className="text-white">{getActiveTabName()}</span>
          </h2>

          {/* Language Switcher */}
          <button
            onClick={() => changeLanguage(locale === "en" ? "ar" : "en")}
            className="text-2xs font-extrabold tracking-widest text-soft-text hover:text-primary-coral border border-border-color/30 rounded-full px-3 py-1.5 bg-surface-deep hover:bg-surface-deep/80 transition-luxury uppercase cursor-pointer"
          >
            {locale === "en" ? "العربية" : "English"}
          </button>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
