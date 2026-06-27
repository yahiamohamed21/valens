import type { Coupon } from "@/types/store";

export const initialCoupons: Coupon[] = [
  {
    id: "coup-1",
    code: "VALENS10",
    discountType: "percentage",
    discountValue: 10,
    expiryDate: "2026-12-31",
    usageLimit: 500,
    usageCount: 45,
    minOrderAmount: 300,
    active: true,
  },
  {
    id: "coup-2",
    code: "BUILD20",
    discountType: "percentage",
    discountValue: 20,
    expiryDate: "2026-08-31",
    usageLimit: 100,
    usageCount: 88,
    minOrderAmount: 800,
    active: true,
  },
  {
    id: "coup-3",
    code: "FITFIXED",
    discountType: "fixed",
    discountValue: 150,
    expiryDate: "2026-10-15",
    usageLimit: 200,
    usageCount: 12,
    minOrderAmount: 500,
    active: true,
  },
];
