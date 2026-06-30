"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Icon } from "@/components/SvgIcons";
import { showConfirmToast } from "@/lib/toast";

export default function AdminCouponsPage() {
  const {
    coupons,
    addCoupon,
    editCoupon,
    deleteCoupon,
    locale,
  } = useApp();

  // Coupon modal state
  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [editingCouponId, setEditingCouponId] = useState<string | null>(null);

  // Form states - Coupons
  const [coupCode, setCoupCode] = useState("");
  const [coupType, setCoupType] = useState<"percentage" | "fixed">("percentage");
  const [coupValue, setCoupValue] = useState("");
  const [coupExpiry, setCoupExpiry] = useState("");
  const [coupLimit, setCoupLimit] = useState("");
  const [coupMinOrder, setCoupMinOrder] = useState("");
  const [coupActive, setCoupActive] = useState(true);

  // Coupon Form Submit
  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coupCode || !coupValue || !coupExpiry) return;

    const payload = {
      code: coupCode.trim().toUpperCase(),
      discountType: coupType,
      discountValue: parseFloat(coupValue),
      expiryDate: coupExpiry,
      usageLimit: parseInt(coupLimit) || 100,
      minOrderAmount: parseFloat(coupMinOrder) || 0,
      active: coupActive
    };

    if (editingCouponId) {
      editCoupon(editingCouponId, payload);
      setEditingCouponId(null);
    } else {
      addCoupon(payload);
    }
    setCoupCode("");
    setCoupValue("");
    setCoupExpiry("");
    setCoupLimit("");
    setCoupMinOrder("");
    setCouponModalOpen(false);
  };

  return (
    <div className={`flex flex-col gap-6 ${locale === "ar" ? "text-right" : "text-left"}`}>
      <div className="flex items-center justify-between border-b border-border-color pb-4">
        <span className="text-xs font-bold text-white uppercase">
          {locale === "ar" ? "كوبونات الخصم وقواعد العروض" : "Promotional Discounts Builder"}
        </span>
        <button
          onClick={() => {
            setEditingCouponId(null);
            setCoupCode("");
            setCoupType("percentage");
            setCoupValue("");
            setCoupExpiry("");
            setCoupLimit("");
            setCoupMinOrder("");
            setCoupActive(true);
            setCouponModalOpen(true);
          }}
          className="flex items-center cursor-pointer gap-2 rounded-xl bg-primary-coral px-4 py-2.5 text-xs font-black tracking-widest text-main-bg hover:bg-gray-600 transition-luxury shadow-lg"
        >
          <Icon className="cursor-pointer" name="plus" size={14} />
          {locale === "ar" ? "إضافة كوبون" : "ADD COUPON"}
        </button>
      </div>

      {/* Coupons display table */}
      <div className="rounded-2xl border border-border-color bg-card-bg p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border-color text-muted-text uppercase tracking-wider">
                <th className="pb-3 font-extrabold">{locale === "ar" ? "كود الخصم" : "Promo Code"}</th>
                <th className="pb-3 font-extrabold">{locale === "ar" ? "قيمة الخصم" : "Discount Value"}</th>
                <th className="pb-3 font-extrabold">{locale === "ar" ? "الحد الأدنى للطلب" : "Min Total Limit"}</th>
                <th className="pb-3 font-extrabold">{locale === "ar" ? "تاريخ الانتهاء" : "Expiry Term"}</th>
                <th className="pb-3 font-extrabold">{locale === "ar" ? "إحصائيات الاستخدام" : "Usage Stats"}</th>
                <th className="pb-3 font-extrabold">{locale === "ar" ? "الحالة" : "Status"}</th>
                <th className="pb-3 font-extrabold text-right">{locale === "ar" ? "إجراءات" : "Actions"}</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.id} className="border-b border-border-color/30 last:border-0 hover:bg-surface-deep/20">
                  <td className="py-3.5 font-bold text-white font-mono">{c.code}</td>
                  <td className="py-3.5 font-bold">
                    {c.discountType === "percentage"
                      ? (locale === "ar" ? `خصم ${c.discountValue}%` : `${c.discountValue}% Off`)
                      : (locale === "ar" ? `${c.discountValue} ج.م ثابت` : `${c.discountValue} EGP Fixed`)}
                  </td>
                  <td className="py-3.5 text-muted-text font-bold">
                    {c.minOrderAmount} {locale === "ar" ? "ج.م كحد أدنى" : "EGP min"}
                  </td>
                  <td className="py-3.5 text-3xs font-semibold text-muted-text">{c.expiryDate}</td>
                  <td className="py-3.5">
                    {c.usageCount} / {c.usageLimit}
                  </td>
                  <td className="py-3.5">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-4xs font-extrabold uppercase ${c.active && new Date(c.expiryDate) > new Date()
                        ? "bg-success-green/10 text-success-green"
                        : "bg-red-500/10 text-red-500"
                      }`}>
                      {c.active && new Date(c.expiryDate) > new Date()
                        ? (locale === "ar" ? "نشط" : "ACTIVE")
                        : (locale === "ar" ? "منتهي/غير نشط" : "EXPIRED/INACTIVE")}
                    </span>
                  </td>
                  <td className="py-3.5 text-right flex justify-end gap-3.5">
                    <button
                      onClick={() => editCoupon(c.id, { active: !c.active })}
                      className="rounded-lg border border-border-color cursor-pointer bg-surface-deep px-3 py-1.5 text-2xs font-extrabold text-white hover:text-gray-800"
                    >
                      {locale === "ar" ? "تبديل" : "Toggle"}
                    </button>
                    <button
                      onClick={() => {
                        setEditingCouponId(c.id);
                        setCoupCode(c.code);
                        setCoupType(c.discountType);
                        setCoupValue(c.discountValue.toString());
                        setCoupExpiry(c.expiryDate);
                        setCoupLimit(c.usageLimit.toString());
                        setCoupMinOrder(c.minOrderAmount.toString());
                        setCoupActive(c.active);
                        setCouponModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg cursor-pointer border border-border-color bg-surface-deep text-white hover:text-primary-coral"
                    >
                      <Icon name="edit" size={14} />
                    </button>
                    <button
                      onClick={() => showConfirmToast(
                        locale === "ar" ? `حذف كوبون ${c.code}؟` : `Delete coupon ${c.code}?`,
                        () => deleteCoupon(c.id)
                      )}
                      className="p-1.5 rounded-lg cursor-pointer border border-border-color bg-surface-deep text-muted-text hover:text-accent-orange"
                    >
                      <Icon className="cursor-pointer" name="trash" size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* COUPON BUILDER MODAL */}
      {couponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-border-color bg-card-bg p-6 shadow-2xl glass-panel animate-slide-in relative">
            <button
              onClick={() => setCouponModalOpen(false)}
              className="absolute cursor-pointer right-4 top-4 text-muted-text hover:text-gray-800"
            >
              <Icon className="cursor-pointer" name="close" size={20} />
            </button>
            <h2 className="text-base font-black uppercase tracking-wider text-white border-b border-border-color pb-3 mb-5">
              {editingCouponId
                ? (locale === "ar" ? "تعديل قواعد الكوبون" : "Modify Coupon Rules")
                : (locale === "ar" ? "إنشاء كوبون خصم" : "Create Promo Coupon")}
            </h2>

            <form onSubmit={handleCouponSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">
                  {locale === "ar" ? "كود الكوبون *" : "Coupon Code *"}
                </label>
                <input
                  type="text"
                  required
                  placeholder="VALENS25"
                  value={coupCode}
                  onChange={(e) => setCoupCode(e.target.value)}
                  className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">
                    {locale === "ar" ? "نوع الخصم" : "Discount Type"}
                  </label>
                  <select
                    value={coupType}
                    onChange={(e) => setCoupType(e.target.value as "percentage" | "fixed")}
                    className="w-full rounded-xl border border-border-color bg-surface-deep px-3 py-2 text-xs text-white"
                  >
                    <option value="percentage">{locale === "ar" ? "نسبة (%)" : "Percentage (%)"}</option>
                    <option value="fixed">{locale === "ar" ? "قيمة ثابتة ($)" : "Fixed ($)"}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">
                    {locale === "ar" ? "قيمة الخصم *" : "Discount Value *"}
                  </label>
                  <input
                    type="number"
                    required
                    value={coupValue}
                    onChange={(e) => setCoupValue(e.target.value)}
                    className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">
                    {locale === "ar" ? "الحد الأدنى للطلب (ج.م)" : "Min Order (EGP)"}
                  </label>
                  <input
                    type="number"
                    value={coupMinOrder}
                    onChange={(e) => setCoupMinOrder(e.target.value)}
                    className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">
                    {locale === "ar" ? "الحد الأقصى للاستخدام" : "Usage Limit"}
                  </label>
                  <input
                    type="number"
                    value={coupLimit}
                    onChange={(e) => setCoupLimit(e.target.value)}
                    className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">
                  {locale === "ar" ? "تاريخ الانتهاء *" : "Expiry Date *"}
                </label>
                <input
                  type="date"
                  required
                  value={coupExpiry}
                  onChange={(e) => setCoupExpiry(e.target.value)}
                  className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-4xs font-extrabold uppercase tracking-widest text-muted-text mt-2">
                <input
                  type="checkbox"
                  checked={coupActive}
                  onChange={(e) => setCoupActive(e.target.checked)}
                  className="rounded border-border-color bg-surface-deep text-primary-coral focus:ring-0 h-4 w-4"
                />
                {locale === "ar" ? "تفعيل فوري" : "Active immediately"}
              </label>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 cursor-pointer rounded-full bg-primary-coral py-3.5 text-xs font-black tracking-widest text-main-bg hover:bg-gray-600 transition-luxury shadow-lg mt-4"
              >
                {locale === "ar" ? "حفظ الكوبون" : "SAVE COUPON"}
                <Icon className="cursor-pointer" name="check" size={14} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}