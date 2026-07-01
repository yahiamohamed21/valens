import type { Product } from "@/types/store";

export const getStockStatus = (stock: number): Product["stockStatus"] => {
  if (stock === 0) return "Out of Stock";
  if (stock <= 10) return "Low Stock";
  return "In Stock";
};
