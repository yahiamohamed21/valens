import { useCallback, useMemo } from "react";
import type { Dispatch, SetStateAction } from "react";
import { api } from "@/lib/api";
import { getStockStatus } from "@/lib/product-utils";
import { showToast } from "@/lib/toast";
import type { Product } from "@/types/store";

interface ProductActionDeps {
  products: Product[];
  setProducts: Dispatch<SetStateAction<Product[]>>;
}

const isGuid = (str: string): boolean => {
  if (!str) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
};

/**
 * Builds a FormData object matching the backend ProductUpsertDto exactly.
 * Docs: POST /api/products/create-product  &  POST /api/products/update-product
 *
 * - String arrays (ingredients, benefits, etc.) → repeated same-key appends
 * - Nested variants → dot-notation: variants[0].size, variants[0].price, etc.
 * - Booleans → explicit "true" / "false" strings
 * - id → only included for updates (must be valid GUID)
 */
const dataURLtoFile = (dataurl: string, filename: string): File | null => {
  if (!dataurl || !dataurl.startsWith("data:")) return null;
  try {
    const arr = dataurl.split(",");
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) return null;
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  } catch (e) {
    console.error("Failed to convert base64 to file:", e);
    return null;
  }
};

const cleanImageUrl = (url: string): string => {
  if (!url) return "";
  const domain = "http://valens-api.runasp.net";
  if (url.startsWith(domain)) {
    return url.substring(domain.length);
  }
  if (url.startsWith("http://") || url.startsWith("https://")) {
    try {
      return new URL(url).pathname;
    } catch {
      return url;
    }
  }
  return url;
};

/**
 * Builds a FormData object matching the backend ProductUpsertDto exactly.
 * Docs: POST /api/products/create-product  &  POST /api/products/update-product
 */
const buildProductFormData = (prod: Partial<Product>, isUpdate: boolean): FormData => {
  const fd = new FormData();

  // Resolve English values (used as Arabic fallbacks when Arabic is empty)
  const name = prod.name || "";
  const description = prod.description || "";
  const ingredients: string[] = Array.isArray(prod.ingredients) ? prod.ingredients : [];
  const usage = prod.usage || "";
  const benefits: string[] = Array.isArray(prod.benefits) ? prod.benefits : [];

  // ── ID (only for update, must be valid GUID) ──
  if (isUpdate && prod.id && isGuid(prod.id)) {
    fd.append("id", prod.id);
  }

  // ── Required string fields ──
  fd.append("name", name);
  fd.append("nameAr", prod.name_ar || (prod as any).nameAr || name);
  fd.append("category", prod.category || "");
  fd.append("description", description);
  fd.append("descriptionAr", prod.description_ar || (prod as any).descriptionAr || description);

  // ── Boolean fields ──
  fd.append("featured", String(prod.featured ?? false));
  fd.append("bestSeller", String(prod.bestSeller ?? false));
  fd.append("newArrival", String(prod.newArrival ?? false));
  fd.append("visible", String(prod.visible ?? true));

  // ── Variant type (required: none | size | flavor | both) ──
  const variantType = prod.variantType || "none";
  fd.append("variantType", variantType);

  // ── Numeric fields ──
  const hasVariants = variantType !== "none";
  fd.append("price", hasVariants ? "0" : String(Number(prod.price) || 0));
  fd.append("stock", hasVariants ? "0" : String(Number(prod.stock) || 0));

  if (!hasVariants && prod.discountPrice !== undefined && prod.discountPrice !== null && Number(prod.discountPrice) > 0) {
    fd.append("discountPrice", String(Number(prod.discountPrice)));
  } else {
    fd.append("discountPrice", "0");
  }

  // ── Simple string fields ──
  fd.append("size", prod.size || "");
  fd.append("sku", prod.sku || "");
  fd.append("imageType", prod.imageType || "powder");
  fd.append("imageColor", prod.imageColor || "#FF8A75");
  fd.append("usage", usage);
  fd.append("usageAr", prod.usage_ar || (prod as any).usageAr || usage);

  // ── Main Image File upload ──
  if (prod.mainImage) {
    if (prod.mainImage.startsWith("data:")) {
      const mainFile = dataURLtoFile(prod.mainImage, "main-image.png");
      if (mainFile) {
        fd.append("mainImageFile", mainFile);
      }
    } else {
      fd.append("mainImage", cleanImageUrl(prod.mainImage));
    }
  }

  // ── String array fields ──
  ingredients.forEach((item) => {
    if (item) fd.append("ingredients", item);
  });

  const ingredientsAr: string[] = prod.ingredients_ar || (prod as any).ingredientsAr || ingredients;
  if (Array.isArray(ingredientsAr)) {
    ingredientsAr.forEach((item: string) => {
      if (item) fd.append("ingredientsAr", item);
    });
  }

  benefits.forEach((item) => {
    if (item) fd.append("benefits", item);
  });

  const benefitsAr: string[] = prod.benefits_ar || (prod as any).benefitsAr || benefits;
  if (Array.isArray(benefitsAr)) {
    benefitsAr.forEach((item: string) => {
      if (item) fd.append("benefitsAr", item);
    });
  }

  // ── Gallery Images & Files ──
  const galleryImages = prod.images || [];
  if (Array.isArray(galleryImages)) {
    galleryImages.forEach((img, index) => {
      if (img && typeof img === "string") {
        if (img.startsWith("data:")) {
          const file = dataURLtoFile(img, `gallery-image-${index}.png`);
          if (file) {
            fd.append("imageFiles", file);
          }
        } else {
          fd.append("existingImages", cleanImageUrl(img));
        }
      }
    });
  }

  // ── Variants ──
  const variants = prod.variants || [];
  variants.forEach((v, i) => {
    if (v.id && isGuid(v.id)) {
      fd.append(`variants[${i}].id`, v.id);
    }
    fd.append(`variants[${i}].size`, v.size || "");
    fd.append(`variants[${i}].flavor`, v.flavor || "");
    fd.append(`variants[${i}].price`, String(Number(v.price) || 0));
    if (v.discountPrice !== undefined && v.discountPrice !== null && Number(v.discountPrice) > 0) {
      fd.append(`variants[${i}].discountPrice`, String(Number(v.discountPrice)));
    } else {
      fd.append(`variants[${i}].discountPrice`, "0");
    }
    fd.append(`variants[${i}].stockQuantity`, String(Number(v.stockQuantity) || 0));
    fd.append(`variants[${i}].sku`, v.sku || "");

    if (v.image) {
      if (v.image.startsWith("data:")) {
        const file = dataURLtoFile(v.image, `variant-image-${i}.png`);
        if (file) {
          fd.append(`variants[${i}].imageFile`, file);
        }
      } else {
        fd.append(`variants[${i}].image`, cleanImageUrl(v.image));
      }
    }
    fd.append(`variants[${i}].isAvailable`, String(v.isAvailable ?? true));
  });

  return fd;
};

export const useProductActions = ({ products, setProducts }: ProductActionDeps) => {
  const addProduct = useCallback(async (prodData: Omit<Product, "id" | "reviews">) => {
    try {
      const formData = buildProductFormData(prodData, false);
      const created = await api.products.create(formData);

      const newProduct: Product = {
        ...prodData,
        id: created.id || `prod-${Date.now()}`,
        reviews: [],
        stockStatus: getStockStatus(created.stock !== undefined ? created.stock : prodData.stock),
      };
      setProducts((prev) => [...prev, newProduct]);
      showToast(`Product "${newProduct.name}" added`, "success");
    } catch (error: any) {
      showToast(error.message || "Failed to add product", "error");
    }
  }, [setProducts]);

  const editProduct = useCallback(async (productId: string, updatedFields: Partial<Product>) => {
    try {
      const existing = products.find((p) => p.id === productId);
      if (!existing) return;

      const isToggleOnly = Object.keys(updatedFields).length === 1 && "visible" in updatedFields;

      if (isToggleOnly) {
        await api.products.toggle(productId);
      } else {
        const merged = { ...existing, ...updatedFields };
        const formData = buildProductFormData(merged, true);
        await api.products.update(formData);
      }

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
      showToast("Product updated successfully", "success");
    } catch (error: any) {
      showToast(error.message || "Failed to update product", "error");
    }
  }, [products, setProducts]);

  const deleteProduct = useCallback(async (productId: string) => {
    try {
      await api.products.delete(productId);
      setProducts((prev) => prev.filter((prod) => prod.id !== productId));
      showToast("Product deleted", "error");
    } catch (error: any) {
      showToast(error.message || "Failed to delete product", "error");
    }
  }, [setProducts]);

  return useMemo(
    () => ({ addProduct, editProduct, deleteProduct }),
    [addProduct, editProduct, deleteProduct]
  );
};
