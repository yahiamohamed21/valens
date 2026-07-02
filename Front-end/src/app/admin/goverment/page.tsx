"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { Icon } from "@/components/SvgIcons";
import { api, safeArray } from "@/lib/api";

interface GovernorateShipping {
  id: string;
  governorateName: string;
  shippingCost: number;
  createdAt: string;
  updatedAt: string;
}

const toStringValue = (value: unknown, fallback = ""): string =>
  value === undefined || value === null ? fallback : String(value);

const toNumberValue = (value: unknown, fallback = 0): number => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

export default function AdminGovermentPage() {
  const { locale, showToast } = useApp();
  const [governorates, setGovernorates] = useState<GovernorateShipping[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGov, setEditingGov] = useState<GovernorateShipping | null>(null);

  // Form States
  const [govName, setGovName] = useState("");
  const [shippingCost, setShippingCost] = useState("");
  const [saving, setSaving] = useState(false);

  // Fetch data
  const fetchGovernorates = async () => {
    setLoading(true);
    try {
      const data = await api.settings.governorates();
      const normalized = safeArray<Record<string, unknown>>(data).map((item) => ({
        id: toStringValue(item.id),
        governorateName: toStringValue(item.governorateName || item.name || item.governorate),
        shippingCost: toNumberValue(item.shippingCost || item.cost),
        createdAt: toStringValue(item.createdAt || item.created_at || item.createdAtUtc),
        updatedAt: toStringValue(item.updatedAt || item.updated_at || item.updatedAtUtc || item.createdAt || item.created_at),
      }));
      setGovernorates(normalized);
    } catch (err: unknown) {
      if (err instanceof Error) {
        showToast(err.message || "Failed to load governorates", "error");
      } else {
        showToast("Failed to load governorates", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await api.settings.governorates();
        const normalized = safeArray<Record<string, unknown>>(data).map((item) => ({
          id: toStringValue(item.id),
          governorateName: toStringValue(item.governorateName || item.name || item.governorate),
          shippingCost: toNumberValue(item.shippingCost || item.cost),
          createdAt: toStringValue(item.createdAt || item.created_at || item.createdAtUtc),
          updatedAt: toStringValue(item.updatedAt || item.updated_at || item.updatedAtUtc || item.createdAt || item.created_at),
        }));
        setGovernorates(normalized);
      } catch (err: unknown) {
        if (err instanceof Error) {
          showToast(err.message || "Failed to load governorates", "error");
        } else {
          showToast("Failed to load governorates", "error");
        }
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [showToast]);

  const handleOpenCreate = () => {
    setEditingGov(null);
    setGovName("");
    setShippingCost("");
    setModalOpen(true);
  };

  const handleOpenEdit = (gov: GovernorateShipping) => {
    setEditingGov(gov);
    setGovName(gov.governorateName);
    setShippingCost(gov.shippingCost.toString());
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!govName || shippingCost === "") return;

    const cost = parseFloat(shippingCost);
    if (isNaN(cost) || cost < 0) {
      showToast(locale === "ar" ? "يجب أن تكون التكلفة قيمة موجبة" : "Shipping cost must be a positive value", "error");
      return;
    }

    setSaving(true);
    try {
      if (editingGov) {
        // Update
        await api.settings.updateGovernorateShipping({
          id: editingGov.id,
          shippingCost: cost,
        });
        showToast(
          locale === "ar" ? "تم تحديث سعر الشحن بنجاح" : "Shipping rate updated successfully",
          "success"
        );
      } else {
        // Create
        await api.settings.createGovernorateShipping({
          governorateName: govName.trim(),
          shippingCost: cost,
        });
        showToast(
          locale === "ar" ? "تم إضافة المحافظة بنجاح" : "Governorate added successfully",
          "success"
        );
      }
      setModalOpen(false);
      fetchGovernorates();
    } catch (err: unknown) {
      if (err instanceof Error) {
        showToast(err.message || "Failed to save governorate", "error");
      } else {
        showToast("Failed to save governorate", "error");
      }
    } finally {
      setSaving(false);
    }
  };

  // Stats
  const avgCost = governorates.length > 0
    ? governorates.reduce((acc, curr) => acc + curr.shippingCost, 0) / governorates.length
    : 0;

  const maxCost = governorates.length > 0
    ? Math.max(...governorates.map(g => g.shippingCost))
    : 0;

  return (
    <div className={`flex flex-col gap-6 ${locale === "ar" ? "text-right" : "text-left"}`}>
      <div className="flex items-center justify-between border-b border-border-color pb-4">
        <div>
          <span className="text-xs font-bold text-white uppercase">
            {locale === "ar" ? "الشحن والتوصيل" : "Logistics & Shipping Ledger"}
          </span>
          <h1 className="text-lg font-black uppercase text-white tracking-wider mt-1">
            {locale === "ar" ? "إدارة شحن المحافظات" : "Governorate Shipping Manager"}
          </h1>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 rounded-xl bg-primary-coral px-4 py-2.5 text-xs font-black tracking-widest text-[#180f0d] hover:bg-white hover:text-[#180f0d] hover:scale-102 transition-luxury shadow-lg cursor-pointer"
        >
          <Icon name="plus" size={14} />
          {locale === "ar" ? "إضافة محافظة" : "ADD GOVERNORATE"}
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border-color bg-card-bg p-5 text-center">
          <span className="text-4xs font-extrabold uppercase tracking-widest text-muted-text">
            {locale === "ar" ? "إجمالي المحافظات" : "TOTAL GOVERNORATES"}
          </span>
          <span className="block mt-2 text-xl font-black text-white">{governorates.length}</span>
        </div>
        <div className="rounded-2xl border border-border-color bg-card-bg p-5 text-center">
          <span className="text-4xs font-extrabold uppercase tracking-widest text-muted-text">
            {locale === "ar" ? "متوسط تكلفة الشحن" : "AVERAGE SHIPPING FEE"}
          </span>
          <span className="block mt-2 text-xl font-black text-white">{Math.round(avgCost).toLocaleString()} EGP</span>
        </div>
        <div className="rounded-2xl border border-border-color bg-card-bg p-5 text-center">
          <span className="text-4xs font-extrabold uppercase tracking-widest text-muted-text">
            {locale === "ar" ? "أعلى تكلفة شحن" : "MAXIMUM SHIPPING FEE"}
          </span>
          <span className="block mt-2 text-xl font-black text-primary-coral">{maxCost.toLocaleString()} EGP</span>
        </div>
      </div>

      {/* Table grid */}
      <div className="rounded-2xl border border-border-color bg-card-bg p-6">
        {loading ? (
          <div className="text-center py-12 flex flex-col items-center justify-center gap-3">
            <span className="text-3xs font-extrabold uppercase tracking-widest text-primary-coral animate-pulse">
              {locale === "ar" ? "جاري تحميل البيانات..." : "Loading Logistics Data..."}
            </span>
          </div>
        ) : governorates.length === 0 ? (
          <div className="text-center py-12 text-muted-text uppercase text-xs">
            {locale === "ar" ? "لا توجد محافظات مضافة حالياً" : "No governorate rates defined yet"}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border-color text-muted-text uppercase tracking-wider">
                  <th className={`pb-3 font-extrabold ${locale === "ar" ? "text-right" : "text-left"}`}>
                    {locale === "ar" ? "المحافظة" : "Governorate Region"}
                  </th>
                  <th className={`pb-3 font-extrabold ${locale === "ar" ? "text-right" : "text-left"}`}>
                    {locale === "ar" ? "سعر الشحن" : "Shipping Rate"}
                  </th>
                  <th className={`pb-3 font-extrabold ${locale === "ar" ? "text-right" : "text-left"}`}>
                    {locale === "ar" ? "آخر تحديث" : "Last Updated"}
                  </th>
                  <th className={`pb-3 font-extrabold text-right`}>
                    {locale === "ar" ? "العمليات" : "Actions"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {governorates.map((gov) => (
                  <tr key={gov.id} className="border-b border-border-color/30 last:border-0 hover:bg-surface-deep/20">
                    <td className={`py-3.5 font-bold text-white ${locale === "ar" ? "text-right" : "text-left"}`}>
                      {gov.governorateName}
                    </td>
                    <td className={`py-3.5 font-extrabold text-primary-coral ${locale === "ar" ? "text-right" : "text-left"}`}>
                      {gov.shippingCost.toLocaleString()} EGP
                    </td>
                    <td className={`py-3.5 text-muted-text text-3xs font-semibold ${locale === "ar" ? "text-right" : "text-left"}`}>
                      {new Date(gov.updatedAt || gov.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3.5 text-right flex justify-end gap-3">
                      <button
                        onClick={() => handleOpenEdit(gov)}
                        className="p-1.5 rounded-lg border border-border-color bg-surface-deep text-white hover:text-primary-coral cursor-pointer"
                        title={locale === "ar" ? "تعديل السعر" : "Edit Shipping Cost"}
                      >
                        <Icon name="edit" size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-border-color bg-card-bg p-6 shadow-2xl glass-panel animate-slide-in relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-4 top-4 text-muted-text hover:text-gray-800 cursor-pointer"
            >
              <Icon name="close" size={20} />
            </button>
            <h2 className={`text-base font-black uppercase tracking-wider text-white border-b border-border-color pb-3 mb-5 ${
              locale === "ar" ? "text-right" : "text-left"
            }`}>
              {editingGov
                ? (locale === "ar" ? "تعديل سعر شحن المحافظة" : "Edit Shipping Rate")
                : (locale === "ar" ? "إضافة محافظة جديدة" : "Add New Governorate")}
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
              <div>
                <label className={`block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2 ${
                  locale === "ar" ? "text-right" : "text-left"
                }`}>
                  {locale === "ar" ? "اسم المحافظة" : "Governorate Name *"}
                </label>
                <input
                  type="text"
                  required
                  disabled={!!editingGov}
                  placeholder={locale === "ar" ? "مثال: القاهرة" : "E.g. Alexandria"}
                  value={govName}
                  onChange={(e) => setGovName(e.target.value)}
                  className={`w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white disabled:opacity-50 disabled:cursor-not-allowed ${
                    locale === "ar" ? "text-right" : "text-left"
                  }`}
                />
              </div>

              <div>
                <label className={`block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2 ${
                  locale === "ar" ? "text-right" : "text-left"
                }`}>
                  {locale === "ar" ? "تكلفة الشحن (جنيه)" : "Shipping Cost (EGP) *"}
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  placeholder="E.g. 50"
                  value={shippingCost}
                  onChange={(e) => setShippingCost(e.target.value)}
                  className={`w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white ${
                    locale === "ar" ? "text-right" : "text-left"
                  }`}
                />
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 rounded-full bg-primary-coral py-3 text-xs font-black tracking-widest text-[#180f0d] hover:bg-white hover:text-[#180f0d] hover:scale-102 transition-luxury shadow-lg cursor-pointer disabled:opacity-50"
                >
                  {saving ? (locale === "ar" ? "جاري الحفظ..." : "SAVING...") : (locale === "ar" ? "حفظ الإعدادات" : "SAVE SETTINGS")}
                  <Icon name="check" size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-full border border-border-color bg-surface-deep/60 px-5 py-3 text-xs font-black tracking-widest text-white hover:border-primary-coral transition-luxury"
                >
                  {locale === "ar" ? "إلغاء" : "CANCEL"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
