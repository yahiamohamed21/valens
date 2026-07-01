import Link from "next/link";
import { Icon } from "@/components/SvgIcons";
import { useState } from "react";
import { useApp } from "@/context/AppContext";

export interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

import { usePathname, useRouter } from 'next/navigation';

export const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const { locale, logoutUser } = useApp();
  const router = useRouter();
  
  const tabs = [
    { id: "overview", label: "Overview", icon: "dashboard" },
    { id: "products", label: "Products", icon: "products" },
    { id: "categories", label: "Categories", icon: "category" },
    { id: "orders", label: "Orders", icon: "orders" },
    { id: "customers", label: "Customers", icon: "user" },
    { id: "homepage", label: "Home Control", icon: "edit" },
    { id: "coupons", label: "Coupons", icon: "tag" },
    { id: "reviews", label: "Reviews", icon: "star" },
    { id: "messages", label: "Messages", icon: "mail" },
    { id: "expenses", label: "Expenses", icon: "expense" },
    { id: "reports", label: "Reports", icon: "report" },
    { id: "goverment", label: "Goverment", icon: "location" },
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
      case "reviews": return "المراجعات";
      case "messages": return "الرسائل";
      case "expenses": return "المصاريف";
      case "reports": return "التقارير";
      case "goverment": return "المحافظات";
      case "settings": return "الإعدادات";
      
      default: return defaultLabel;
    }
  };

  const pathname = usePathname();
  const isActive = (id: string) => pathname === `/admin/${id}` || (id === 'overview' && pathname === '/admin');

  const handleLogout = () => {
    logoutUser();
    router.push("/login");
  };

  return (
    <aside
      className={`
        fixed inset-y-0 z-50 flex flex-col justify-between bg-surface-deep transition-all duration-300 ease-in-out shrink-0
        md:relative md:inset-auto md:z-auto
        ${locale === "ar" 
          ? `right-0 border-l border-border-color ${sidebarOpen ? "w-64 translate-x-0" : "w-64 translate-x-full md:w-20 md:translate-x-0"}` 
          : `left-0 border-r border-border-color ${sidebarOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full md:w-20 md:translate-x-0"}`
        }
      `}
    >
      <div className="flex flex-col gap-6 pt-6">
        {/* Dashboard Header */}
        <div className="flex items-center justify-between px-4 border-b border-border-color pb-5">
          <Link href="/" className="flex items-center gap-2">
            <span className={`text-glow font-black tracking-widest text-primary-coral transition-luxury ${sidebarOpen ? "text-xl" : "text-sm"}`}>
              {sidebarOpen ? "VALENS ADMIN" : "VL"}
            </span>
          </Link>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-muted-text hover:text-primary-coral">
            <Icon name={sidebarOpen ? "chevron-left" : "menu"} size={16} />
          </button>
        </div>
        {/* Navigation Links */}
        <nav className="flex flex-col gap-1 px-2">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={tab.id === "overview" ? "/admin" : `/admin/${tab.id}`}
              onClick={() => {
                if (window.innerWidth < 768) {
                  setSidebarOpen(false);
                }
              }}
              className={`flex items-center gap-3.5 rounded-xl px-3 py-3 text-xs font-bold uppercase tracking-wider transition-luxury ${
                locale === "ar" ? "flex-row-reverse text-right" : ""
              } ${isActive(tab.id)
                  ? "bg-primary-coral/10 text-primary-coral border border-primary-coral/20"
                  : "text-white hover:bg-surface-sec hover:text-primary-coral"}
                `}
            >
              <Icon name={tab.icon as any} size={18} />
              {sidebarOpen && <span>{getTabLabel(tab.id, tab.label)}</span>}
            </Link>
          ))}        </nav>
      </div>
      {/* Exit back to store / Logout */}
      <div className="p-4 border-t border-border-color flex flex-col gap-2">
        <Link href="/" className={`flex items-center justify-center gap-2 rounded-xl border border-border-color bg-surface-sec py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:text-primary-coral hover:border-primary-coral transition-luxury w-full ${
          sidebarOpen && locale === "ar" ? "flex-row-reverse" : ""
        }`}>
          <Icon name="logout" size={14} className="rotate-180" />
          {sidebarOpen && <span>{locale === "ar" ? "العودة للمتجر" : "Back to store"}</span>}
        </Link>
        <button 
          onClick={handleLogout}
          className={`flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 py-2.5 text-xs font-bold uppercase tracking-wider text-red-500 hover:text-white hover:bg-red-500 hover:border-red-500 transition-luxury w-full cursor-pointer ${
            sidebarOpen && locale === "ar" ? "flex-row-reverse" : ""
          }`}
        >
          <Icon name="power" size={14} />
          {sidebarOpen && <span>{locale === "ar" ? "تسجيل الخروج" : "Logout"}</span>}
        </button>
      </div>
    </aside>
  );
};
