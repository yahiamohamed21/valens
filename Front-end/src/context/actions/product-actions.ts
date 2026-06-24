import { useCallback, useMemo } from "react";
import type { Dispatch, SetStateAction } from "react";
import { STORAGE_KEYS } from "@/lib/constants";
import { getStockStatus } from "@/lib/product-utils";
import { setStorageItem } from "@/lib/storage";
import { showToast } from "@/lib/toast";
import type { Product } from "@/types/store";

interface ProductActionDeps {
  products: Product[];
  setProducts: Dispatch<SetStateAction<Product[]>>;
}

export const useProductActions = ({ products, setProducts }: ProductActionDeps) => {
  const addProduct = useCallback((prodData: Omit<Product, "id" | "reviews">) => {
    const newProduct: Product = {
      ...prodData,
      id: `prod-${Date.now()}`,
      reviews: [],
    };
    const newProducts = [...products, newProduct];
    setProducts(newProducts);
    setStorageItem(STORAGE_KEYS.PRODUCTS, newProducts);
    showToast(`Product "${newProduct.name}" added`, "success");
  }, [products, setProducts]);

  const editProduct = useCallback((productId: string, updatedFields: Partial<Product>) => {
    const newProducts = products.map((prod) => {
      if (prod.id === productId) {
        const merged: Product = { ...prod, ...updatedFields };
        merged.stockStatus = getStockStatus(merged.stock);
        return merged;
      }
      return prod;
    });
    setProducts(newProducts);
    setStorageItem(STORAGE_KEYS.PRODUCTS, newProducts);
    showToast("Product updated successfully", "success");
  }, [products, setProducts]);

  const deleteProduct = useCallback((productId: string) => {
    const newProducts = products.filter((prod) => prod.id !== productId);
    setProducts(newProducts);
    setStorageItem(STORAGE_KEYS.PRODUCTS, newProducts);
    showToast("Product deleted", "error");
  }, [products, setProducts]);

  return useMemo(
    () => ({ addProduct, editProduct, deleteProduct }),
    [addProduct, editProduct, deleteProduct]
  );
};
