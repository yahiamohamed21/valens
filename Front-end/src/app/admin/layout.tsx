"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Sidebar } from "./components/Sidebar";
import { ADMIN_NAV_ITEMS, getActiveAdminNavItem, getAdminNavLabel } from "@/lib/admin-nav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { locale, changeLanguage } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  const activeItem = getActiveAdminNavItem(pathname) ?? ADMIN_NAV_ITEMS[0];
  const activeLabel = getAdminNavLabel(activeItem, locale).toUpperCase();
  const isRtl = locale === "ar";

  return (
    <div className="flex h-screen overflow-hidden bg-main-bg text-white font-sans antialiased">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="flex-1 flex flex-col overflow-y-auto">
        <header
          className={`flex h-16 items-center justify-between border-b border-border-color bg-surface-deep/30 px-6 ${
            isRtl ? "flex-row-reverse" : ""
          }`}
        >
          <h1 className="text-sm font-black uppercase tracking-widest text-muted-text">
            {isRtl ? "لوحة التحكم بالنظام" : "SYSTEMS CONTROL PANEL"}
            <span aria-hidden="true"> &gt; </span>
            <span className="text-white">{activeLabel}</span>
          </h1>

          <button
            type="button"
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