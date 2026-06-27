import { useCallback, useMemo } from "react";
import type { Dispatch, SetStateAction } from "react";
import { STORAGE_KEYS } from "@/lib/constants";
import { setStorageItem } from "@/lib/storage";
import { showToast } from "@/lib/toast";
import type { CartItem, Coupon, Product } from "@/types/store";

interface CartActionDeps {
  cart: CartItem[];
  setCart: Dispatch<SetStateAction<CartItem[]>>;
  coupons: Coupon[];
  setActiveCoupon: Dispatch<SetStateAction<Coupon | null>>;
}

export const useCartActions = ({ cart, setCart, coupons, setActiveCoupon }: CartActionDeps) => {
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

  const applyCoupon = useCallback((code: string) => {
    const formattedCode = code.trim().toUpperCase();
    const coupon = coupons.find((c) => c.code === formattedCode && c.active);

    if (!coupon) {
      showToast("Invalid or inactive coupon code", "error");
      return false;
    }

    const expiry = new Date(coupon.expiryDate);
    if (expiry < new Date()) {
      showToast("This coupon has expired", "error");
      return false;
    }

    if (coupon.usageCount >= coupon.usageLimit) {
      showToast("Coupon usage limit reached", "error");
      return false;
    }

    setActiveCoupon(coupon);
    showToast(`Coupon ${formattedCode} applied successfully!`, "success");
    return true;
  }, [coupons, setActiveCoupon]);

  const removeCoupon = useCallback(() => {
    setActiveCoupon(null);
    showToast("Coupon removed", "info");
  }, [setActiveCoupon]);

  return useMemo(
    () => ({ addToCart, updateCartQuantity, removeFromCart, clearCart, applyCoupon, removeCoupon }),
    [addToCart, updateCartQuantity, removeFromCart, clearCart, applyCoupon, removeCoupon]
  );
};
