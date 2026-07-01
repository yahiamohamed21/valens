"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Icon } from "@/components/SvgIcons";
import { showConfirmToast } from "@/lib/toast";
import { CouponDetailsModal } from "@/app/admin/components/CouponDetailsModal";

export default function AdminCouponsPage() {
  const {
    coupons,
    orders,
    addCoupon,
    editCoupon,
    deleteCoupon,
    showToast,
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

  // Search and analytics filters
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("2026-06-01");
  const [endDate, setEndDate] = useState("2026-12-31");
  const [selectedCouponForDetails, setSelectedCouponForDetails] = useState<any>(null);

  // Coupon Form Submit
  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coupCode || !coupValue || !coupExpiry) return;

    if (coupCode.trim().length < 3 || coupCode.trim().length > 20) {
      showToast(
        locale === "ar"
          ? "يجب أن يكون رمز الكوبون بين 3 و 20 حرفًا."
          : "Coupon code must be between 3 and 20 characters.",
        "error"
      );
      return;
    }

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

  const filteredCoupons = coupons.filter((c) =>
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

      {/* Search & Date Filter Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-surface-deep/30 border border-border-color/30 rounded-2xl p-4">
        <div className="flex flex-1 items-center gap-3 max-w-sm">
          <span className="text-3xs font-black uppercase tracking-widest text-muted-text">Search:</span>
          <input
            type="text"
            placeholder="Search by code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-1.5 text-xs text-white"
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-3xs font-black uppercase tracking-widest text-muted-text">Analytics Range:</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="rounded-xl border border-border-color bg-surface-deep px-3 py-1.5 text-xs text-white"
          />
          <span className="text-muted-text">—</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="rounded-xl border border-border-color bg-surface-deep px-3 py-1.5 text-xs text-white"
          />
        </div>
      </div>

      {/* Coupons display table */}
      <div className="rounded-2xl border border-border-color bg-card-bg p-6">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border-color text-muted-text uppercase tracking-wider">
                <th className="pb-3 font-extrabold">{locale === "ar" ? "كود الخصم" : "Promo Code"}</th>
                <th className="pb-3 font-extrabold">{locale === "ar" ? "قيمة الخصم" : "Discount"}</th>
                <th className="pb-3 font-extrabold">{locale === "ar" ? "الاستخدام" : "Usages (Del/Ret)"}</th>
                <th className="pb-3 font-extrabold text-right">{locale === "ar" ? "المبيعات" : "Gross Sales"}</th>
                <th className="pb-3 font-extrabold text-right">{locale === "ar" ? "الخصم الممنوح" : "Discount Given"}</th>
                <th className="pb-3 font-extrabold text-right">{locale === "ar" ? "صافي الإيرادات" : "Net Revenue"}</th>
                <th className="pb-3 font-extrabold">{locale === "ar" ? "تاريخ الانتهاء" : "Expiry"}</th>
                <th className="pb-3 font-extrabold">{locale === "ar" ? "الحالة" : "Status"}</th>
                <th className="pb-3 font-extrabold text-right">{locale === "ar" ? "إجراءات" : "Actions"}</th>
              </tr>
            </thead>
            <tbody>
              {filteredCoupons.map((c) => {
                const couponOrders = orders.filter(
                  (o) =>
                    o.couponCode?.toUpperCase() === c.code.toUpperCase() &&
                    (!startDate || o.orderDate.split("T")[0] >= startDate) &&
                    (!endDate || o.orderDate.split("T")[0] <= endDate)
                );
                const completedOrders = couponOrders.filter((o) => o.status === "Delivered");
                const returnedOrders = couponOrders.filter((o) => o.status === "Returned");
                
                const grossSales = completedOrders.reduce((acc, o) => {
                  const beforeDiscount =
                    o.couponTotalBeforeDiscount !== undefined
                      ? o.couponTotalBeforeDiscount
                      : (o.totalPrice + o.discountAmount - o.shippingCost);
                  return acc + beforeDiscount;
                }, 0);

                const totalDiscount = completedOrders.reduce((acc, o) => acc + o.discountAmount, 0);
                const netRevenue = completedOrders.reduce((acc, o) => acc + o.totalPrice, 0);

                const expiryFormatted = c.expiryDate
                  ? new Date(c.expiryDate).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
                      dateStyle: "medium",
                    })
                  : "—";

                return (
                  <tr key={c.id} className="border-b border-border-color/30 last:border-0 hover:bg-surface-deep/20 text-white">
                    <td className="py-3.5 font-bold text-white font-mono">
                      <button
                        onClick={() => setSelectedCouponForDetails(c)}
                        className="hover:text-primary-coral underline cursor-pointer text-left font-mono font-bold"
                      >
                        {c.code}
                      </button>
                    </td>
                    <td className="py-3.5 font-bold">
                      {c.discountType === "percentage"
                        ? (locale === "ar" ? `خصم ${c.discountValue}%` : `${c.discountValue}% Off`)
                        : (locale === "ar" ? `${c.discountValue} ج.م` : `${c.discountValue} EGP`)}
                    </td>
                    <td className="py-3.5 font-semibold text-muted-text">
                      {couponOrders.length} / {c.usageLimit}
                      <span className="block text-4xs text-muted-text">
                        (Del: {completedOrders.length} • Ret: {returnedOrders.length})
                      </span>
                    </td>
                    <td className="py-3.5 text-right font-bold text-white font-mono">
                      {Math.round(grossSales).toLocaleString()} {locale === "ar" ? "ج" : "EGP"}
                    </td>
                    <td className="py-3.5 text-right font-bold text-accent-orange font-mono">
                      -{Math.round(totalDiscount).toLocaleString()} {locale === "ar" ? "ج" : "EGP"}
                    </td>
                    <td className="py-3.5 text-right font-bold text-success-green font-mono">
                      {Math.round(netRevenue).toLocaleString()} {locale === "ar" ? "ج" : "EGP"}
                    </td>
                    <td className="py-3.5 text-3xs font-semibold text-muted-text font-mono">{expiryFormatted}</td>
                    <td className="py-3.5">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-4xs font-extrabold uppercase ${c.active && new Date(c.expiryDate) > new Date()
                          ? "bg-success-green/10 text-success-green"
                          : "bg-red-500/10 text-red-500"
                        }`}>
                        {c.active && new Date(c.expiryDate) > new Date()
                          ? (locale === "ar" ? "نشط" : "ACTIVE")
                          : (locale === "ar" ? "منتهي" : "EXPIRED")}
                      </span>
                    </td>
                    <td className="py-3.5 text-right flex justify-end gap-3.5">
                      <button
                        onClick={() => setSelectedCouponForDetails(c)}
                        className="rounded-lg border border-border-color cursor-pointer bg-surface-deep px-3 py-1.5 text-2xs font-extrabold text-white hover:text-gray-800"
                      >
                        {locale === "ar" ? "تفاصيل" : "Details"}
                      </button>
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
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* COUPON BUILDER MODAL */}
      {couponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-border-color bg-card-bg p-6 shadow-2xl glass-panel animate-slide-in relative text-left">
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
                    <option value="fixed">{locale === "ar" ? "قيمة ثابتة (ج.م)" : "Fixed (EGP)"}</option>
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

      {/* Coupon details modal */}
      {selectedCouponForDetails && (
        <CouponDetailsModal
          coupon={selectedCouponForDetails}
          orders={orders}
          onClose={() => setSelectedCouponForDetails(null)}
          locale={locale}
        />
      )}
    </div>
  );
}