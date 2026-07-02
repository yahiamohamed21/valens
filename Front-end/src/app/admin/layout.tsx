"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { decodeJwt } from "@/lib/api";
import { Icon } from "@/components/SvgIcons";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { locale, changeLanguage, fetchAdminData, currentUserRole } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("valens_jwt_token");
    const claims = decodeJwt(storedToken);
    const role = claims?.role || claims?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    if (role && role.toString().toLowerCase() === "admin") {
      setCheckingAuth(false);
    } else {
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
    if (lastSegment === "messages") return locale === "ar" ? "الرسائل" : "MESSAGES";
    if (lastSegment === "reports") return locale === "ar" ? "التقارير" : "REPORTS";
    if (lastSegment === "goverment") return locale === "ar" ? "المحافظات" : "GOVERNORATES";
    if (lastSegment === "settings") return locale === "ar" ? "الإعدادات" : "SETTINGS";
    return lastSegment.toUpperCase();
  };

  if (checkingAuth) {
    return (
      <div className="flex h-screen items-center justify-center bg-main-bg text-foreground">
        <div className="flex flex-col items-center gap-3">
          <span className="text-3xs font-extrabold uppercase tracking-widest text-primary-coral animate-pulse">
            Verifying Admin Authorization...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-main-bg text-foreground font-sans antialiased">
      {/* Mobile Floating Drawer Toggle Button */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-30 p-2.5 rounded-xl bg-surface-deep/80 border border-border-color/50 text-white hover:text-primary-coral md:hidden cursor-pointer shadow-lg backdrop-blur-md"
        >
          <Icon name="menu" size={18} />
        </button>
      )}

      {/* Mobile Sidebar Overlay Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden cursor-pointer"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main className="flex-1 flex flex-col overflow-y-auto">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
