import { useCallback, useMemo } from "react";
import type { Dispatch, SetStateAction } from "react";
import { STORAGE_KEYS } from "@/lib/constants";
import { setStorageItem } from "@/lib/storage";
import { api } from "@/lib/api";
import { showToast } from "@/lib/toast";
import type { CartItem, Coupon, Product } from "@/types/store";

interface CartActionDeps {
  cart: CartItem[];
  setCart: Dispatch<SetStateAction<CartItem[]>>;
  setActiveCoupon: Dispatch<SetStateAction<Coupon | null>>;
}

export const useCartActions = ({ cart, setCart, setActiveCoupon }: CartActionDeps) => {
  const addToCart = useCallback((
    product: Product,
    quantity: number,
    size?: string,
    variant?: string,
    price?: number,
    sku?: string,
    image?: string
  ) => {
    const newCart = [...cart];
    const existingIndex = newCart.findIndex(
      (item) =>
        item.product.id === product.id &&
        item.selectedSize === size &&
        item.selectedVariant === variant
    );

    const variantPrice = price !== undefined ? price : (product.discountPrice || product.price);
    const itemSku = sku || product.sku;
    const itemImage = image || product.mainImage || "";

    if (existingIndex > -1) {
      newCart[existingIndex].quantity += quantity;
    } else {
      newCart.push({
        product,
        quantity,
        selectedSize: size,
        selectedVariant: variant,
        selectedVariantPrice: variantPrice,
        sku: itemSku,
        image: itemImage,
      });
    }

    setCart(newCart);
    setStorageItem(STORAGE_KEYS.CART, newCart);
    showToast(`Added ${quantity}x ${product.name} to Cart`, "success");
  }, [cart, setCart]);

  const removeFromCart = useCallback((index: number) => {
    const removedName = cart[index].product.name;
    const newCart = cart.filter((_, idx) => idx !== index);
    setCart(newCart);
    setStorageItem(STORAGE_KEYS.CART, newCart);
    showToast(`Removed ${removedName} from Cart`, "info");
  }, [cart, setCart]);

  const updateCartQuantity = useCallback((index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }

    const newCart = [...cart];
    newCart[index].quantity = quantity;
    setCart(newCart);
    setStorageItem(STORAGE_KEYS.CART, newCart);
  }, [cart, removeFromCart, setCart]);

  const clearCart = useCallback(() => {
    setCart([]);
    setStorageItem(STORAGE_KEYS.CART, []);
  }, [setCart]);

  const applyCoupon = useCallback(async (code: string) => {
    try {
      const cartItemsDto = cart.map((item) => {
        const matchingVariant = item.product.variants?.find(
          (v) => v.size === item.selectedSize && v.flavor === item.selectedVariant
        );
        return {
          productId: item.product.id,
          variantId: matchingVariant?.id || null,
          size: item.selectedSize || undefined,
          flavor: item.selectedVariant || undefined,
          quantity: item.quantity,
        };
      });

      const response = await api.coupons.validate({
        code,
        items: cartItemsDto,
      });

      const coupon: Coupon = {
        id: `validated-${response.code}`,
        code: response.code,
        discountType: response.discountType.toLowerCase() === "fixed" ? "fixed" : "percentage",
        discountValue: Number(response.discountValue),
        expiryDate: new Date(Date.now() + 86400000).toISOString(),
        usageLimit: 99999,
        usageCount: 0,
        minOrderAmount: Number(response.minOrderAmount),
        active: true,
      };

      setActiveCoupon(coupon);
      showToast(`Coupon ${response.code} applied successfully!`, "success");
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid or inactive coupon code";
      showToast(message, "error");
      return false;
    }
  }, [cart, setActiveCoupon]);

  const removeCoupon = useCallback(() => {
    setActiveCoupon(null);
    showToast("Coupon removed", "info");
  }, [setActiveCoupon]);

  return useMemo(
    () => ({ addToCart, updateCartQuantity, removeFromCart, clearCart, applyCoupon, removeCoupon }),
    [addToCart, updateCartQuantity, removeFromCart, clearCart, applyCoupon, removeCoupon]
  );
};
