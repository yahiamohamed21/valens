import { useCallback, useMemo } from "react";
import type { Dispatch, SetStateAction } from "react";
import { api, mapApiProductToClient } from "@/lib/api";
import { getStockStatus } from "@/lib/product-utils";
import { showToast } from "@/lib/toast";
import type { Product } from "@/types/store";

interface ProductActionDeps {
  products: Product[];
  setProducts: Dispatch<SetStateAction<Product[]>>;
}

/**
 * Builds a JSON payload for creating or updating a product.
 * Uses the JSON endpoint option from the API guide:
 *   Create: POST /api/products/create-product (Content-Type: application/json)
 *   Update: POST /api/products/update-product (Content-Type: application/json)
 *
 * Images are sent as base64 strings (new images) or as their existing URL strings
 * (unchanged images the server already has).
 */
export const buildProductJsonPayload = (
  prod: Partial<Product>,
  isUpdate: boolean
): Record<string, unknown> => {
  const prodObj = prod as Record<string, unknown>;
  const variantType = prod.variantType || "none";
  const hasVariants = variantType !== "none";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload: Record<string, any> = {
    name: prod.name || "",
    nameAr: prod.name_ar || (prodObj.nameAr as string) || prod.name || "",
    category: prod.category || "",
    description: prod.description || "",
    descriptionAr: prod.description_ar || (prodObj.descriptionAr as string) || prod.description || "",
    featured: Boolean(prod.featured),
    bestSeller: Boolean(prod.bestSeller),
    newArrival: Boolean(prod.newArrival),
    visible: prod.visible !== undefined ? Boolean(prod.visible) : true,
    variantType,
    price: Number(prod.price) || 0,
    discountPrice: Number(prod.discountPrice) || 0,
    size: prod.size || "",
    stock: Number(prod.stock) || 0,
    sku: prod.sku || "",
    imageType: prod.imageType || "powder",
    imageColor: prod.imageColor || "#FF8A75",
    usage: prod.usage || "",
    usageAr: prod.usage_ar || (prodObj.usageAr as string) || prod.usage || "",
  };

  // Main image: send as base64 string or existing URL as-is
  if (prod.mainImage) {
    payload.mainImage = prod.mainImage;
  }

  // Gallery images: send as base64 strings or existing URLs
  if (prod.images && prod.images.length > 0) {
    payload.images = prod.images.filter(Boolean);
  }

  // Ingredients
  const ingredients = Array.isArray(prod.ingredients) ? prod.ingredients.filter(Boolean) : [];
  if (ingredients.length > 0) {
    payload.ingredients = ingredients;
  }

  const ingredientsAr = Array.isArray(prod.ingredients_ar)
    ? prod.ingredients_ar.filter(Boolean)
    : Array.isArray(prodObj.ingredientsAr)
    ? (prodObj.ingredientsAr as string[]).filter(Boolean)
    : ingredients;
  if (ingredientsAr.length > 0) {
    payload.ingredientsAr = ingredientsAr;
  }

  // Benefits
  const benefits = Array.isArray(prod.benefits) ? prod.benefits.filter(Boolean) : [];
  if (benefits.length > 0) {
    payload.benefits = benefits;
  }

  const benefitsAr = Array.isArray(prod.benefits_ar)
    ? prod.benefits_ar.filter(Boolean)
    : Array.isArray(prodObj.benefitsAr)
    ? (prodObj.benefitsAr as string[]).filter(Boolean)
    : benefits;
  if (benefitsAr.length > 0) {
    payload.benefitsAr = benefitsAr;
  }

  // Variants
  if (hasVariants && prod.variants && prod.variants.length > 0) {
    payload.variants = prod.variants.map((v) => ({
      ...(v.id ? { id: v.id } : {}),
      size: v.size || "",
      flavor: v.flavor || "",
      price: Number(v.price) || 0,
      discountPrice: Number(v.discountPrice) || 0,
      stockQuantity: Number(v.stockQuantity) || 0,
      sku: v.sku || "",
      image: v.image || "",
      isAvailable: v.isAvailable !== undefined ? Boolean(v.isAvailable) : true,
    }));
  }

  // Add product ID for updates
  if (isUpdate && prod.id) {
    payload.id = prod.id.trim();
  }

  return payload;
};

export const useProductActions = ({ products, setProducts }: ProductActionDeps) => {
  const addProduct = useCallback(async (prodData: Omit<Product, "id" | "reviews">) => {
    try {
      const jsonPayload = buildProductJsonPayload(prodData, false);

      // Debug: log payload
      console.log("=== Product Create JSON Debug ===", jsonPayload);

      const created = await api.products.create(jsonPayload);
      if (created) {
        const mapped = mapApiProductToClient(created as Record<string, unknown>);
        setProducts((prev) => [...prev, mapped]);
        showToast(`Product "${mapped.name}" added`, "success");
      } else {
        const newProduct: Product = {
          ...prodData,
          id: `prod-${Date.now()}`,
          reviews: [],
          stockStatus: getStockStatus(prodData.stock),
        };
        setProducts((prev) => [...prev, newProduct]);
        showToast(`Product "${newProduct.name}" added`, "success");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to add product";
      showToast(message, "error");
    }
  }, [setProducts]);

  const editProduct = useCallback(async (productId: string, updatedFields: Partial<Product>) => {
    try {
      const existing = products.find((p) => p.id === productId);
      if (!existing) return;

      const isToggleOnly = Object.keys(updatedFields).length === 1 && "visible" in updatedFields;

      if (isToggleOnly) {
        await api.products.toggle(productId);
        setProducts((prev) =>
          prev.map((prod) => {
            if (prod.id === productId) {
              const merged: Product = { ...prod, ...updatedFields };
              merged.stockStatus = getStockStatus(merged.stock);
              return merged;
            }
            return prod;
          })
        );
      } else {
        const merged = { ...existing, ...updatedFields };
        const jsonPayload = buildProductJsonPayload(merged, true);

        // Debug: log payload
        console.log("=== Product Update JSON Debug ===", jsonPayload);

        const updated = await api.products.update(jsonPayload);
        if (updated) {
          const mapped = mapApiProductToClient(updated as Record<string, unknown>);
          setProducts((prev) =>
            prev.map((prod) => (prod.id === productId ? mapped : prod))
          );
        } else {
          setProducts((prev) =>
            prev.map((prod) => {
              if (prod.id === productId) {
                const mergedProd: Product = { ...prod, ...updatedFields };
                mergedProd.stockStatus = getStockStatus(mergedProd.stock);
                return mergedProd;
              }
              return prod;
            })
          );
        }
      }
      showToast("Product updated successfully", "success");
    } catch (error) {
      console.error("=== Product Update Error ===", error);
      const message = error instanceof Error ? error.message : "Failed to update product";
      showToast(message, "error");
    }
  }, [products, setProducts]);

  const deleteProduct = useCallback(async (productId: string) => {
    try {
      await api.products.delete(productId);
      setProducts((prev) => prev.filter((prod) => prod.id !== productId));
      showToast("Product deleted", "error");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete product";
      showToast(message, "error");
    }
  }, [setProducts]);

  return useMemo(
    () => ({ addProduct, editProduct, deleteProduct }),
    [addProduct, editProduct, deleteProduct]
  );
};
