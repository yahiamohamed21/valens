"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { decodeJwt } from "@/lib/api";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { locale, changeLanguage, fetchAdminData, currentUserRole } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const [checkingAuth] = useState(() => {
    if (typeof window === "undefined") return true;
    const storedToken = localStorage.getItem("valens_jwt_token");
    const claims = decodeJwt(storedToken);
    const role = claims?.role || claims?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    return !(role && role.toString().toLowerCase() === "admin");
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedToken = localStorage.getItem("valens_jwt_token");
    const claims = decodeJwt(storedToken);
    const role = claims?.role || claims?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    if (!role || role.toString().toLowerCase() !== "admin") {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    if (!checkingAuth && currentUserRole === "Admin") {
      fetchAdminData();
    }
  }, [pathname, checkingAuth, currentUserRole, fetchAdminData]);

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
    if (lastSegment === "goverment") return locale === "ar" ? "المحافظات" : "GOVERNORATES";
    if (lastSegment === "settings") return locale === "ar" ? "الإعدادات" : "SETTINGS";
    return lastSegment.toUpperCase();
  };

  if (checkingAuth) {
    return (
      <div className="flex h-screen items-center justify-center bg-main-bg text-white">
        <div className="flex flex-col items-center gap-3">
          <span className="text-3xs font-extrabold uppercase tracking-widest text-primary-coral animate-pulse">
            Verifying Admin Authorization...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-main-bg text-white font-sans antialiased">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className={`flex h-16 items-center justify-between border-b border-border-color bg-surface-deep/30 px-6 ${locale === "ar" ? "flex-row-reverse" : ""
          }`}>
          <h2 className="text-sm font-black uppercase tracking-widest text-muted-text">
            {locale === "ar" ? "لوحة التحكم بالنظام" : "SYSTEMS CONTROL PANEL"} &gt; <span className="text-white">{getActiveTabName()}</span>
          </h2>

          {/* Language Switcher */}
          <button
            onClick={() => changeLanguage(locale === "en" ? "ar" : "en")}
            className="text-2xs font-extrabold tracking-widest text-white hover:text-primary-coral border border-border-color/30 rounded-full px-3 py-1.5 bg-surface-deep hover:bg-surface-deep/80 transition-luxury uppercase cursor-pointer"
          >
            {locale === "en" ? "العربية" : "English"}
          </button>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
