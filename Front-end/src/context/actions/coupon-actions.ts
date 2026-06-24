import { useCallback, useMemo } from "react";
import type { Dispatch, SetStateAction } from "react";
import { STORAGE_KEYS } from "@/lib/constants";
import { setStorageItem } from "@/lib/storage";
import { showToast } from "@/lib/toast";
import type { Coupon } from "@/types/store";

interface CouponActionDeps {
  coupons: Coupon[];
  setCoupons: Dispatch<SetStateAction<Coupon[]>>;
}

export const useCouponActions = ({ coupons, setCoupons }: CouponActionDeps) => {
  const addCoupon = useCallback((coupData: Omit<Coupon, "id" | "usageCount">) => {
    const newCoup: Coupon = {
      ...coupData,
      id: `coup-${Date.now()}`,
      usageCount: 0,
    };
    const newCoups = [...coupons, newCoup];
    setCoupons(newCoups);
    setStorageItem(STORAGE_KEYS.COUPONS, newCoups);
    showToast(`Coupon code ${newCoup.code} created`, "success");
  }, [coupons, setCoupons]);

  const editCoupon = useCallback((couponId: string, updatedFields: Partial<Coupon>) => {
    const newCoups = coupons.map((c) => {
      if (c.id === couponId) {
        return { ...c, ...updatedFields };
      }
      return c;
    });
    setCoupons(newCoups);
    setStorageItem(STORAGE_KEYS.COUPONS, newCoups);
    showToast("Coupon updated", "success");
  }, [coupons, setCoupons]);

  const deleteCoupon = useCallback((couponId: string) => {
    const newCoups = coupons.filter((c) => c.id !== couponId);
    setCoupons(newCoups);
    setStorageItem(STORAGE_KEYS.COUPONS, newCoups);
    showToast("Coupon deleted", "error");
  }, [coupons, setCoupons]);

  return useMemo(
    () => ({ addCoupon, editCoupon, deleteCoupon }),
    [addCoupon, editCoupon, deleteCoupon]
  );
};
