import type { ComponentProps } from "react";
import type { Icon } from "@/components/SvgIcons";

// Derived directly from <Icon name="..." /> so this stays in sync
// automatically if the icon set ever changes shape.
type IconName = ComponentProps<typeof Icon>["name"];

export interface AdminNavItem {
  id: string;
  href: string;
  icon: IconName;
  label: string;
  labelAr: string;
}

/**
 * Single source of truth for admin navigation.
 * Used by <Sidebar /> (to render links) and <AdminLayout /> (to render the
 * breadcrumb / page title). Add a new admin page here once — both consumers
 * stay in sync automatically.
 */
export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { id: "overview", href: "/admin", icon: "dashboard", label: "Overview", labelAr: "نظرة عامة" },
  { id: "products", href: "/admin/products", icon: "products", label: "Products", labelAr: "المنتجات" },
  { id: "categories", href: "/admin/categories", icon: "category", label: "Categories", labelAr: "التصنيفات" },
  { id: "orders", href: "/admin/orders", icon: "orders", label: "Orders", labelAr: "الطلبات" },
  { id: "customers", href: "/admin/customers", icon: "user", label: "Customers", labelAr: "العملاء" },
  { id: "homepage", href: "/admin/homepage", icon: "edit", label: "Home Control", labelAr: "التحكم بالرئيسية" },
  { id: "coupons", href: "/admin/coupons", icon: "tag", label: "Coupons", labelAr: "الكوبونات" },
  { id: "expenses", href: "/admin/expenses", icon: "expense", label: "Expenses", labelAr: "المصاريف" },
  { id: "reports", href: "/admin/reports", icon: "report", label: "Reports", labelAr: "التقارير" },
  { id: "settings", href: "/admin/settings", icon: "settings", label: "Settings", labelAr: "الإعدادات" },
];

/** Resolve which nav item matches the current pathname (handles nested routes too). */
export function getActiveAdminNavItem(pathname: string): AdminNavItem | undefined {
  if (pathname === "/admin") {
    return ADMIN_NAV_ITEMS.find((item) => item.id === "overview");
  }
  return ADMIN_NAV_ITEMS.find(
    (item) => item.id !== "overview" && (pathname === item.href || pathname.startsWith(`${item.href}/`))
  );
}

export function getAdminNavLabel(item: AdminNavItem, locale: string): string {
  return locale === "ar" ? item.labelAr : item.label;
}