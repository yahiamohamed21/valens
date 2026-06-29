import { useCallback, useMemo } from "react";
import type { Dispatch, SetStateAction } from "react";
import { api } from "@/lib/api";
import { showToast } from "@/lib/toast";
import type { Coupon } from "@/types/store";

interface CouponActionDeps {
  coupons: Coupon[];
  setCoupons: Dispatch<SetStateAction<Coupon[]>>;
}

export const useCouponActions = ({ coupons, setCoupons }: CouponActionDeps) => {
  const addCoupon = useCallback(async (coupData: Omit<Coupon, "id" | "usageCount">) => {
    try {
      const created = await api.coupons.create({
        code: coupData.code,
        discountType: coupData.discountType,
        discountValue: Number(coupData.discountValue),
        expiryDate: coupData.expiryDate,
        usageLimit: Number(coupData.usageLimit),
        minOrderAmount: Number(coupData.minOrderAmount),
        isActive: coupData.active,
      });

      const newCoup: Coupon = {
        ...coupData,
        id: created.id || `coup-${Date.now()}`,
        usageCount: created.usageCount !== undefined ? created.usageCount : 0,
      };

      setCoupons((prev) => [...prev, newCoup]);
      showToast(`Coupon code ${newCoup.code} created`, "success");
    } catch (error: any) {
      showToast(error.message || "Failed to create coupon", "error");
    }
  }, [setCoupons]);

  const editCoupon = useCallback(async (couponId: string, updatedFields: Partial<Coupon>) => {
    try {
      const existing = coupons.find((c) => c.id === couponId);
      if (!existing) return;

      const isToggleOnly = Object.keys(updatedFields).length === 1 && "active" in updatedFields;

      if (isToggleOnly) {
        await api.coupons.toggle(couponId);
      } else {
        const merged = { ...existing, ...updatedFields };
        await api.coupons.update({
          id: couponId,
          code: merged.code,
          discountType: merged.discountType,
          discountValue: Number(merged.discountValue),
          expiryDate: merged.expiryDate,
          usageLimit: Number(merged.usageLimit),
          minOrderAmount: Number(merged.minOrderAmount),
          isActive: merged.active,
        });
      }

      setCoupons((prev) =>
        prev.map((c) => {
          if (c.id === couponId) {
            return { ...c, ...updatedFields };
          }
          return c;
        })
      );
      showToast("Coupon updated", "success");
    } catch (error: any) {
      showToast(error.message || "Failed to update coupon", "error");
    }
  }, [coupons, setCoupons]);

  const deleteCoupon = useCallback(async (couponId: string) => {
    try {
      await api.coupons.delete(couponId);
      setCoupons((prev) => prev.filter((c) => c.id !== couponId));
      showToast("Coupon deleted", "error");
    } catch (error: any) {
      showToast(error.message || "Failed to delete coupon", "error");
    }
  }, [setCoupons]);

  return useMemo(
    () => ({ addCoupon, editCoupon, deleteCoupon }),
    [addCoupon, editCoupon, deleteCoupon]
  );
};
