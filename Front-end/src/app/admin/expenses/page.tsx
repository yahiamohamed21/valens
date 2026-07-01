"use client";

import React, { useState } from "react";
import { useApp, Expense } from "@/context/AppContext";
import { useAdminStats } from "@/app/admin/hooks/useAdminStats";
import { Icon } from "@/components/SvgIcons";
import { showConfirmToast } from "@/lib/toast";
const EXPENSE_CATEGORIES: Expense["category"][] = [
  "Advertising",
  "Salaries",
  "Shipping",
  "Rent",
  "Other",
];

const CATEGORY_LABELS_AR: Record<string, string> = {
  "Advertising": "التسويق والإعلانات والترويج",
  "Salaries": "مرتبات الموظفين والعمال",
  "Shipping": "تكاليف ومصاريف الشحن والتوصيل",
  "Rent": "إيجار المستودعات والمقرات",
  "Other": "مصاريف ونفقات أخرى متنوعة",
};

export default function AdminExpensesPage() {
  const {
    expenses,
    orders,
    products,
    customers,
    addExpense,
    editExpense,
    deleteExpense,
    locale,
  } = useApp();

  const { totals, expensesByCategory } = useAdminStats(orders, expenses, products, customers);

  // Expense modal state
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  // Form states - Expenses
  const [expTitle, setExpTitle] = useState("");
  const [expCategory, setExpCategory] = useState<Expense["category"]>("Other");
  const [expAmount, setExpAmount] = useState("");
  const [expDate, setExpDate] = useState("");
  const [expPayMethod, setExpPayMethod] = useState("Bank Transfer");
  const [expNotes, setExpNotes] = useState("");

  const categoryLabel = (cat: string) => (locale === "ar" ? (CATEGORY_LABELS_AR[cat] || cat) : cat);

  const paymentMethodLabel = (method: string) => {
    if (locale !== "ar") return method;
    const map: Record<string, string> = {
      "Bank Transfer": "حوالة بنكية",
      "Credit Card": "بطاقة ائتمانية",
      "PayPal": "باي بال",
      "Cash": "نقدي",
    };
    return map[method] || method;
  };

  // Expense Form Submit
  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expTitle || !expAmount || !expDate) return;

    const payload = {
      title: expTitle,
      category: expCategory,
      amount: parseFloat(expAmount),
      date: expDate,
      paymentMethod: expPayMethod,
      notes: expNotes || undefined
    };

    if (editingExpenseId) {
      editExpense(editingExpenseId, payload);
      setEditingExpenseId(null);
    } else {
      addExpense(payload);
    }
    setExpTitle("");
    setExpAmount("");
    setExpDate("");
    setExpNotes("");
    setExpenseModalOpen(false);
  };

  return (
    <div className={`flex flex-col gap-6 ${locale === "ar" ? "text-right" : "text-left"}`}>
      <div className="flex items-center justify-between border-b border-border-color pb-4">
        <span className="text-xs font-bold text-white uppercase">
          {locale === "ar" ? "دفتر النفقات والمصاريف التشغيلية" : "Operational Brand Expenses"}
        </span>
        <button
          onClick={() => {
            setEditingExpenseId(null);
            setExpTitle("");
            setExpCategory("Other");
            setExpAmount("");
            setExpDate("");
            setExpPayMethod("Bank Transfer");
            setExpNotes("");
            setExpenseModalOpen(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-primary-coral px-4 py-2.5 text-xs font-black tracking-widest text-[#180f0d] hover:bg-white hover:text-[#180f0d] hover:scale-102 transition-luxury shadow-lg cursor-pointer"
        >
          <Icon className="cursor-pointer" name="plus" size={14} />
          {locale === "ar" ? "إضافة مصروف" : "ADD EXPENSE"}
        </button>
      </div>

      {/* Exp summary stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border-color bg-card-bg p-5 text-center">
          <span className="text-4xs font-extrabold uppercase tracking-widest text-muted-text">
            {locale === "ar" ? "إجمالي المصروفات" : "TOTAL OUTFLOWS"}
          </span>
          <span className="block mt-2 text-xl font-black text-white">
            {Math.round(totals.totalExpenses).toLocaleString()} {locale === "ar" ? "ج.م" : "EGP"}
          </span>
        </div>
        <div className="rounded-2xl border border-border-color bg-card-bg p-5 text-center">
          <span className="text-4xs font-extrabold uppercase tracking-widest text-muted-text">
            {locale === "ar" ? "أعلى بند مصروفات" : "HIGHEST OUTFLOW CATEGORY"}
          </span>
          <span className="block mt-2 text-sm font-black text-primary-coral uppercase truncate">
            {expensesByCategory[0]?.[0]
              ? categoryLabel(expensesByCategory[0][0])
              : (locale === "ar" ? "لا يوجد" : "None")}
          </span>
        </div>
        <div className="rounded-2xl border border-border-color bg-card-bg p-5 text-center">
          <span className="text-4xs font-extrabold uppercase tracking-widest text-muted-text">
            {locale === "ar" ? "المصروفات الشهرية" : "MONTHLY EXPENSES"}
          </span>
          <span className="block mt-2 text-xl font-black text-white">
            {Math.round(expenses.filter(e => e.date.includes("2026-06")).reduce((acc, curr) => acc + curr.amount, 0)).toLocaleString()} {locale === "ar" ? "ج.م" : "EGP"}
          </span>
        </div>
      </div>

      {/* Table Ledger list */}
      <div className="rounded-2xl border border-border-color bg-card-bg p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border-color text-muted-text uppercase tracking-wider">
                <th className="pb-3 font-extrabold">{locale === "ar" ? "غرض المصروف" : "Expense Purpose"}</th>
                <th className="pb-3 font-extrabold">{locale === "ar" ? "البند التشغيلي" : "Category classification"}</th>
                <th className="pb-3 font-extrabold">{locale === "ar" ? "القيمة المدفوعة" : "Amount paid"}</th>
                <th className="pb-3 font-extrabold">{locale === "ar" ? "التاريخ" : "Date"}</th>
                <th className="pb-3 font-extrabold">{locale === "ar" ? "طريقة الدفع" : "Method"}</th>
                <th className="pb-3 font-extrabold">{locale === "ar" ? "ملاحظات" : "Notes"}</th>
                <th className="pb-3 font-extrabold text-right">{locale === "ar" ? "إجراءات" : "Actions"}</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((e) => (
                <tr key={e.id} className="border-b border-border-color/30 last:border-0 hover:bg-surface-deep/20">
                  <td className="py-3.5 font-bold text-white">{e.title}</td>
                  <td className="py-3.5 uppercase text-3xs font-semibold text-muted-text">{categoryLabel(e.category)}</td>
                  <td className="py-3.5 font-black text-accent-orange">
                    {e.amount.toLocaleString()} {locale === "ar" ? "ج.م" : "EGP"}
                  </td>
                  <td className="py-3.5 text-muted-text text-3xs font-semibold">{e.date}</td>
                  <td className="py-3.5 uppercase">{paymentMethodLabel(e.paymentMethod)}</td>
                  <td className="py-3.5 text-muted-text max-w-xs truncate">{e.notes || "—"}</td>
                  <td className="py-3.5 text-right flex justify-end gap-3">
                    <button
                      onClick={() => {
                        setEditingExpenseId(e.id);
                        setExpTitle(e.title);
                        setExpCategory(e.category);
                        setExpAmount(e.amount.toString());
                        setExpDate(e.date);
                        setExpPayMethod(e.paymentMethod);
                        setExpNotes(e.notes || "");
                        setExpenseModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg cursor-pointer border border-border-color bg-surface-deep text-white hover:text-primary-coral"
                    >
                      <Icon className="cursor-pointer" name="edit" size={14} />
                    </button>
                    <button
                      onClick={() => showConfirmToast(
                        locale === "ar" ? `حذف سجل المصروف "${e.title}"؟` : `Remove expense record for ${e.title}?`,
                        () => deleteExpense(e.id)
                      )}
                      className="p-1.5 rounded-lg border border-border-color bg-surface-deep text-muted-text hover:text-accent-orange"
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

      {/* EXPENSE ADD / EDIT MODAL */}
      {expenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-border-color bg-card-bg p-6 shadow-2xl glass-panel animate-slide-in relative">
            <button
              onClick={() => setExpenseModalOpen(false)}
              className="absolute cursor-pointer right-4 top-4 text-muted-text hover:text-gray-800"
            >
              <Icon className="cursor-pointer" name="close" size={20} />
            </button>
            <h2 className="text-base font-black uppercase tracking-wider text-white border-b border-border-color pb-3 mb-5">
              {editingExpenseId
                ? (locale === "ar" ? "تعديل سجل المصروف" : "Edit Expense Entry")
                : (locale === "ar" ? "تسجيل مصروف جديد" : "Log Expense outflow")}
            </h2>

            <form onSubmit={handleExpenseSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">
                  {locale === "ar" ? "عنوان المصروف *" : "Expense Description Title *"}
                </label>
                <input
                  type="text"
                  required
                  placeholder={locale === "ar" ? "مثال: شراء أغطية بلاستيك أسود مطفي" : "E.g. Matte Black plastic caps procurement"}
                  value={expTitle}
                  onChange={(e) => setExpTitle(e.target.value)}
                  className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">
                  {locale === "ar" ? "البند التشغيلي *" : "Expense Category *"}
                </label>
                <select
                  value={expCategory}
                  onChange={(e) => setExpCategory(e.target.value as Expense["category"])}
                  className="w-full rounded-xl border border-border-color bg-surface-deep px-3 py-2 text-xs text-white"
                >
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{categoryLabel(cat)}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">
                    {locale === "ar" ? "القيمة (ج.م) *" : "Amount (EGP) *"}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={expAmount}
                    onChange={(e) => setExpAmount(e.target.value)}
                    className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">
                    {locale === "ar" ? "طريقة الدفع" : "Payment Method"}
                  </label>
                  <select
                    value={expPayMethod}
                    onChange={(e) => setExpPayMethod(e.target.value)}
                    className="w-full rounded-xl border border-border-color bg-surface-deep px-3 py-2 text-xs text-white"
                  >
                    <option value="Bank Transfer">{locale === "ar" ? "حوالة بنكية" : "Bank Transfer"}</option>
                    <option value="Credit Card">{locale === "ar" ? "بطاقة ائتمانية" : "Credit Card"}</option>
                    <option value="PayPal">{locale === "ar" ? "باي بال" : "PayPal"}</option>
                    <option value="Cash">{locale === "ar" ? "نقدي" : "Cash"}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">
                  {locale === "ar" ? "تاريخ المصروف *" : "Expense Log Date *"}
                </label>
                <input
                  type="date"
                  required
                  value={expDate}
                  onChange={(e) => setExpDate(e.target.value)}
                  className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">
                  {locale === "ar" ? "ملاحظات" : "Notes"}
                </label>
                <input
                  type="text"
                  placeholder={locale === "ar" ? "أضف أرقام مرجعية، تفاصيل..." : "Provide reference numbers, details..."}
                  value={expNotes}
                  onChange={(e) => setExpNotes(e.target.value)}
                  className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white"
                />
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-primary-coral py-3.5 text-xs font-black tracking-widest text-[#180f0d] hover:bg-white hover:text-[#180f0d] hover:scale-102 transition-luxury shadow-lg mt-4 cursor-pointer"
              >
                {locale === "ar" ? "تسجيل المصروف" : "LOG EXPENSE RECORD"}
                <Icon name="check" size={14} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}