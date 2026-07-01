import { useState } from "react";

export type AdminTab =
  | "overview"
  | "products"
  | "categories"
  | "orders"
  | "customers"
  | "homepage"
  | "coupons"
  | "expenses"
  | "reports"
  | "settings";

export const useAdminUI = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return { activeTab, setActiveTab, sidebarOpen, setSidebarOpen };
};
