import Link from "next/link";
import { Icon } from "@/components/SvgIcons";
import { useState } from "react";
import { useApp } from "@/context/AppContext";

export interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

import { usePathname } from 'next/navigation';

export const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const { locale } = useApp();
  
  const tabs = [
    { id: "overview", label: "Overview", icon: "dashboard" },
    { id: "products", label: "Products", icon: "products" },
    { id: "categories", label: "Categories", icon: "category" },
    { id: "orders", label: "Orders", icon: "orders" },
    { id: "customers", label: "Customers", icon: "user" },
    { id: "homepage", label: "Home Control", icon: "edit" },
    { id: "coupons", label: "Coupons", icon: "tag" },
    { id: "expenses", label: "Expenses", icon: "expense" },
    { id: "reports", label: "Reports", icon: "report" },
    { id: "settings", label: "Settings", icon: "settings" },
  ];
  
  const getTabLabel = (id: string, defaultLabel: string) => {
    if (locale !== "ar") return defaultLabel;
    switch (id) {
      case "overview": return "نظرة عامة";
      case "products": return "المنتجات";
      case "categories": return "التصنيفات";
      case "orders": return "الطلبات";
      case "customers": return "العملاء";
      case "homepage": return "التحكم بالرئيسية";
      case "coupons": return "الكوبونات";
      case "expenses": return "المصاريف";
      case "reports": return "التقارير";
      case "settings": return "الإعدادات";
      default: return defaultLabel;
    }
  };

  const pathname = usePathname();
  const isActive = (id: string) => pathname === `/admin/${id}` || (id === 'overview' && pathname === '/admin');

  return (
    <aside
      className={`${sidebarOpen ? "w-64" : "w-20"} shrink-0 border-r border-border-color bg-surface-deep transition-luxury flex flex-col justify-between`}
    >
      <div className="flex flex-col gap-6 pt-6">
        {/* Dashboard Header */}
        <div className="flex items-center justify-between px-4 border-b border-border-color pb-5">
          <Link href="/" className="flex items-center gap-2">
            <span className={`text-glow font-black tracking-widest text-primary-coral transition-luxury ${sidebarOpen ? "text-xl" : "text-sm"}`}>
              {sidebarOpen ? "VALENS ADMIN" : "VL"}
            </span>
          </Link>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-muted-text hover:text-white">
            <Icon name={sidebarOpen ? "chevron-left" : "menu"} size={16} />
          </button>
        </div>
        {/* Navigation Links */}
        <nav className="flex flex-col gap-1 px-2">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={tab.id === "overview" ? "/admin" : `/admin/${tab.id}`}
              className={`flex items-center gap-3.5 rounded-xl px-3 py-3 text-xs font-bold uppercase tracking-wider transition-luxury ${
                locale === "ar" ? "flex-row-reverse text-right" : ""
              } ${isActive(tab.id)
                  ? "bg-primary-coral/10 text-primary-coral border border-primary-coral/20"
                  : "text-soft-text hover:bg-surface-sec hover:text-white"}
                `}
            >
              <Icon name={tab.icon as any} size={18} />
              {sidebarOpen && <span>{getTabLabel(tab.id, tab.label)}</span>}
            </Link>
          ))}        </nav>
      </div>
      {/* Exit back to store */}
      <div className="p-4 border-t border-border-color">
        <Link href="/" className={`flex items-center justify-center gap-2 rounded-xl border border-border-color bg-surface-sec py-2.5 text-xs font-bold uppercase tracking-wider text-soft-text hover:text-white hover:border-primary-coral transition-luxury w-full ${
          locale === "ar" ? "flex-row-reverse" : ""
        }`}>
          <Icon name="logout" size={14} />
          {sidebarOpen && <span>{locale === "ar" ? "العودة للمتجر" : "Back to store"}</span>}
        </Link>
      </div>
    </aside>
  );
};
