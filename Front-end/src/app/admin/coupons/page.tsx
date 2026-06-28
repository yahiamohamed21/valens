"use client";

export const dynamic = "force-dynamic";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Icon } from "@/components/SvgIcons";
import { showConfirmToast } from "@/lib/toast";

export default function AdminCouponsPage() {
  const appContext = useApp();
  const coupons = appContext?.coupons ?? [];
  const addCoupon = appContext?.addCoupon ?? (() => {});
  const editCoupon = appContext?.editCoupon ?? (() => {});
  const deleteCoupon = appContext?.deleteCoupon ?? (() => {});

  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [editingCouponId, setEditingCouponId] = useState<string | null>(null);
  const [coupCode, setCoupCode] = useState("");
  const [coupType, setCoupType] = useState<"percentage" | "fixed">("percentage");
  const [coupValue, setCoupValue] = useState("");
  const [coupExpiry, setCoupExpiry] = useState("");
  const [coupLimit, setCoupLimit] = useState("");
  const [coupMinOrder, setCoupMinOrder] = useState("");
  const [coupActive, setCoupActive] = useState(true);

  const openCreateModal = () => {
    setEditingCouponId(null);
    setCoupCode("");
    setCoupType("percentage");
    setCoupValue("");
    setCoupExpiry("");
    setCoupLimit("");
    setCoupMinOrder("");
    setCoupActive(true);
    setCouponModalOpen(true);
  };

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
      active: coupActive,
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

  const activeCoupons = coupons.filter((c) => c.active && new Date(c.expiryDate) > new Date()).length;

  const inputClass =
    "w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white placeholder-muted-text/40 focus:outline-none focus:border-primary-coral/60 focus:ring-1 focus:ring-primary-coral/20 transition-all";

  return (
    <>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border-color">
          <div>
            <h1 className="text-xl font-black text-white tracking-tight">Promotional Coupons</h1>
            <p className="text-xs text-muted-text mt-1">
              {coupons.length} total &middot; {activeCoupons} active
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 rounded-xl bg-primary-coral px-5 py-2.5 text-xs font-black tracking-widest text-main-bg hover:opacity-90 active:scale-95 transition-all shadow-md whitespace-nowrap"
          >
            <Icon name="plus" size={14} />
            ADD COUPON
          </button>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: "Total Coupons", value: coupons.length.toString(), color: "text-white" },
            { label: "Active", value: activeCoupons.toString(), color: "text-green-400" },
            { label: "Expired / Off", value: (coupons.length - activeCoupons).toString(), color: "text-red-400" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-border-color bg-card-bg px-4 py-3">
              <span className="text-3xs font-extrabold uppercase tracking-widest text-muted-text block">{s.label}</span>
              <span className={`text-lg font-black mt-1 block ${s.color}`}>{s.value}</span>
            </div>
          ))}
        </div>

        {/* Table */}
        <section aria-label="Coupons list" className="rounded-2xl border border-border-color bg-card-bg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border-color bg-surface-deep/40">
                  <th className="px-5 py-3.5 font-extrabold uppercase tracking-wider text-muted-text">Code</th>
                  <th className="px-5 py-3.5 font-extrabold uppercase tracking-wider text-muted-text">Discount</th>
                  <th className="px-5 py-3.5 font-extrabold uppercase tracking-wider text-muted-text hidden sm:table-cell">Min Order</th>
                  <th className="px-5 py-3.5 font-extrabold uppercase tracking-wider text-muted-text hidden md:table-cell">Expiry</th>
                  <th className="px-5 py-3.5 font-extrabold uppercase tracking-wider text-muted-text hidden lg:table-cell">Usage</th>
                  <th className="px-5 py-3.5 font-extrabold uppercase tracking-wider text-muted-text">Status</th>
                  <th className="px-5 py-3.5 font-extrabold uppercase tracking-wider text-muted-text text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-muted-text">
                      No coupons yet. Create your first promotional coupon.
                    </td>
                  </tr>
                ) : (
                  coupons.map((c) => {
                    const isActive = c.active && new Date(c.expiryDate) > new Date();
                    return (
                      <tr key={c.id} className="border-b border-border-color/30 last:border-0 hover:bg-surface-deep/20 transition-colors">
                        <td className="px-5 py-4 font-black text-white font-mono tracking-wider">{c.code}</td>
                        <td className="px-5 py-4 font-bold text-soft-text">
                          {c.discountType === "percentage" ? `${c.discountValue}% Off` : `${c.discountValue} EGP`}
                        </td>
                        <td className="px-5 py-4 text-muted-text hidden sm:table-cell">{c.minOrderAmount} EGP</td>
                        <td className="px-5 py-4 text-muted-text hidden md:table-cell">{c.expiryDate}</td>
                        <td className="px-5 py-4 text-muted-text hidden lg:table-cell">
                          {c.usageCount} / {c.usageLimit}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-3xs font-extrabold uppercase border ${
                              isActive
                                ? "bg-green-500/10 text-green-400 border-green-500/20" :"bg-red-500/10 text-red-400 border-red-500/20"
                            }`}
                          >
                            {isActive ? "Active" : "Expired"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => editCoupon(c.id, { active: !c.active })}
                              className="rounded-lg border border-border-color bg-surface-deep px-3 py-1.5 text-2xs font-bold text-soft-text hover:text-white transition-all"
                            >
                              {c.active ? "Disable" : "Enable"}
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
                              className="rounded-lg border border-border-color bg-surface-deep p-1.5 text-soft-text hover:text-primary-coral hover:border-primary-coral/40 transition-all"
                              aria-label={`Edit ${c.code}`}
                            >
                              <Icon name="edit" size={14} />
                            </button>
                            <button
                              onClick={() => showConfirmToast(`Delete coupon ${c.code}?`, () => deleteCoupon(c.id))}
                              className="rounded-lg border border-border-color bg-surface-deep p-1.5 text-muted-text hover:text-red-400 hover:border-red-400/40 transition-all"
                              aria-label={`Delete ${c.code}`}
                            >
                              <Icon name="trash" size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Modal */}
      {couponModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="coupon-modal-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-border-color bg-card-bg p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setCouponModalOpen(false)}
              className="absolute right-4 top-4 p-1.5 rounded-lg text-muted-text hover:text-white hover:bg-surface-deep transition-all"
              aria-label="Close modal"
            >
              <Icon name="close" size={18} />
            </button>

            <h2 id="coupon-modal-title" className="text-base font-black text-white mb-5 pb-4 border-b border-border-color">
              {editingCouponId ? "Edit Coupon" : "New Coupon"}
            </h2>

            <form onSubmit={handleCouponSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-3xs font-extrabold uppercase tracking-widest text-muted-text mb-2">
                  Coupon Code <span className="text-primary-coral">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="SAVE25"
                  value={coupCode}
                  onChange={(e) => setCoupCode(e.target.value.toUpperCase())}
                  className={inputClass + " uppercase font-mono tracking-widest"}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-3xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Type</label>
                  <select
                    value={coupType}
                    onChange={(e) => setCoupType(e.target.value as "percentage" | "fixed")}
                    className={inputClass}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed (EGP)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-3xs font-extrabold uppercase tracking-widest text-muted-text mb-2">
                    Value <span className="text-primary-coral">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={coupValue}
                    onChange={(e) => setCoupValue(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-3xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Min Order (EGP)</label>
                  <input
                    type="number"
                    min="0"
                    value={coupMinOrder}
                    onChange={(e) => setCoupMinOrder(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-3xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Usage Limit</label>
                  <input
                    type="number"
                    min="1"
                    value={coupLimit}
                    onChange={(e) => setCoupLimit(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="block text-3xs font-extrabold uppercase tracking-widest text-muted-text mb-2">
                  Expiry Date <span className="text-primary-coral">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={coupExpiry}
                  onChange={(e) => setCoupExpiry(e.target.value)}
                  className={inputClass}
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-border-color hover:bg-surface-deep/60 transition-all">
                <input
                  type="checkbox"
                  checked={coupActive}
                  onChange={(e) => setCoupActive(e.target.checked)}
                  className="h-4 w-4 rounded border-border-color bg-surface-deep text-primary-coral focus:ring-0 cursor-pointer"
                />
                <span className="text-xs font-semibold text-soft-text">Activate immediately</span>
              </label>

              <button
                type="submit"
                className="mt-1 w-full rounded-xl bg-primary-coral py-3 text-xs font-black tracking-widest text-main-bg hover:opacity-90 active:scale-[0.98] transition-all shadow-md"
              >
                {editingCouponId ? "SAVE CHANGES" : "CREATE COUPON"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
