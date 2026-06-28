"use client";

export const dynamic = "force-dynamic";

import React, { useState } from "react";
import { useApp, Expense } from "@/context/AppContext";
import { useAdminStats } from "@/app/admin/hooks/useAdminStats";
import { Icon } from "@/components/SvgIcons";
import { showConfirmToast } from "@/lib/toast";

const EXPENSE_CATEGORIES: Expense["category"][] = [
  "Product purchasing cost",
  "Shipping expenses",
  "Marketing and ads",
  "Packaging",
  "Website maintenance",
  "Staff salaries",
  "Storage / warehouse",
  "Delivery company fees",
  "Miscellaneous expenses",
];

const PAYMENT_METHODS = ["Bank Transfer", "Credit Card", "PayPal", "Cash"];

export default function AdminExpensesPage() {
  const appContext = useApp();
  const expenses = appContext?.expenses ?? [];
  const orders = appContext?.orders ?? [];
  const products = appContext?.products ?? [];
  const customers = appContext?.customers ?? [];
  const addExpense = appContext?.addExpense ?? (() => {});
  const editExpense = appContext?.editExpense ?? (() => {});
  const deleteExpense = appContext?.deleteExpense ?? (() => {});

  const { totals, expensesByCategory } = useAdminStats(orders, expenses, products, customers) ?? { totals: { totalExpenses: 0 }, expensesByCategory: [] };

  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  const [expTitle, setExpTitle] = useState("");
  const [expCategory, setExpCategory] = useState<Expense["category"]>("Product purchasing cost");
  const [expAmount, setExpAmount] = useState("");
  const [expDate, setExpDate] = useState("");
  const [expPayMethod, setExpPayMethod] = useState("Bank Transfer");
  const [expNotes, setExpNotes] = useState("");

  const openCreateModal = () => {
    setEditingExpenseId(null);
    setExpTitle("");
    setExpCategory("Product purchasing cost");
    setExpAmount("");
    setExpDate("");
    setExpPayMethod("Bank Transfer");
    setExpNotes("");
    setExpenseModalOpen(true);
  };

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expTitle || !expAmount || !expDate) return;

    const payload = {
      title: expTitle,
      category: expCategory,
      amount: parseFloat(expAmount),
      date: expDate,
      paymentMethod: expPayMethod,
      notes: expNotes || undefined,
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

  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthlyTotal = expenses
    .filter((e) => e.date.startsWith(currentMonth))
    .reduce((acc, curr) => acc + curr.amount, 0);

  const inputClass =
    "w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white placeholder-muted-text/40 focus:outline-none focus:border-primary-coral/60 focus:ring-1 focus:ring-primary-coral/20 transition-all";

  return (
    <>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border-color">
          <div>
            <h1 className="text-xl font-black text-white tracking-tight">Expenses</h1>
            <p className="text-xs text-muted-text mt-1">{expenses.length} records logged</p>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 rounded-xl bg-primary-coral px-5 py-2.5 text-xs font-black tracking-widest text-main-bg hover:opacity-90 active:scale-95 transition-all shadow-md whitespace-nowrap"
          >
            <Icon name="plus" size={14} />
            ADD EXPENSE
          </button>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border-color bg-card-bg px-5 py-4">
            <span className="text-3xs font-extrabold uppercase tracking-widest text-muted-text block">Total Outflows</span>
            <span className="text-xl font-black text-white mt-1 block">{Math.round(totals.totalExpenses).toLocaleString()} EGP</span>
          </div>
          <div className="rounded-xl border border-border-color bg-card-bg px-5 py-4">
            <span className="text-3xs font-extrabold uppercase tracking-widest text-muted-text block">Top Category</span>
            <span className="text-sm font-black text-primary-coral mt-1 block truncate uppercase">
              {expensesByCategory[0]?.[0] || "—"}
            </span>
          </div>
          <div className="rounded-xl border border-border-color bg-card-bg px-5 py-4">
            <span className="text-3xs font-extrabold uppercase tracking-widest text-muted-text block">This Month</span>
            <span className="text-xl font-black text-white mt-1 block">{Math.round(monthlyTotal).toLocaleString()} EGP</span>
          </div>
        </div>

        {/* Table */}
        <section aria-label="Expenses ledger" className="rounded-2xl border border-border-color bg-card-bg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border-color bg-surface-deep/40">
                  <th className="px-5 py-3.5 font-extrabold uppercase tracking-wider text-muted-text">Title</th>
                  <th className="px-5 py-3.5 font-extrabold uppercase tracking-wider text-muted-text hidden sm:table-cell">Category</th>
                  <th className="px-5 py-3.5 font-extrabold uppercase tracking-wider text-muted-text">Amount</th>
                  <th className="px-5 py-3.5 font-extrabold uppercase tracking-wider text-muted-text hidden md:table-cell">Date</th>
                  <th className="px-5 py-3.5 font-extrabold uppercase tracking-wider text-muted-text hidden lg:table-cell">Method</th>
                  <th className="px-5 py-3.5 font-extrabold uppercase tracking-wider text-muted-text hidden xl:table-cell">Notes</th>
                  <th className="px-5 py-3.5 font-extrabold uppercase tracking-wider text-muted-text text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-muted-text">
                      No expenses logged yet.
                    </td>
                  </tr>
                ) : (
                  expenses.map((e) => (
                    <tr key={e.id} className="border-b border-border-color/30 last:border-0 hover:bg-surface-deep/20 transition-colors">
                      <td className="px-5 py-4 font-bold text-white max-w-[160px] truncate">{e.title}</td>
                      <td className="px-5 py-4 text-muted-text hidden sm:table-cell">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-surface-deep border border-border-color text-3xs font-semibold uppercase">
                          {e.category}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-black text-accent-orange">{e.amount.toLocaleString()} EGP</td>
                      <td className="px-5 py-4 text-muted-text hidden md:table-cell">{e.date}</td>
                      <td className="px-5 py-4 text-muted-text hidden lg:table-cell">{e.paymentMethod}</td>
                      <td className="px-5 py-4 text-muted-text hidden xl:table-cell max-w-[140px] truncate">{e.notes || "—"}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
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
                            className="rounded-lg border border-border-color bg-surface-deep p-1.5 text-soft-text hover:text-primary-coral hover:border-primary-coral/40 transition-all"
                            aria-label={`Edit ${e.title}`}
                          >
                            <Icon name="edit" size={14} />
                          </button>
                          <button
                            onClick={() => showConfirmToast(`Delete "${e.title}"?`, () => deleteExpense(e.id))}
                            className="rounded-lg border border-border-color bg-surface-deep p-1.5 text-muted-text hover:text-red-400 hover:border-red-400/40 transition-all"
                            aria-label={`Delete ${e.title}`}
                          >
                            <Icon name="trash" size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Modal */}
      {expenseModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="expense-modal-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-border-color bg-card-bg p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setExpenseModalOpen(false)}
              className="absolute right-4 top-4 p-1.5 rounded-lg text-muted-text hover:text-white hover:bg-surface-deep transition-all"
              aria-label="Close modal"
            >
              <Icon name="close" size={18} />
            </button>

            <h2 id="expense-modal-title" className="text-base font-black text-white mb-5 pb-4 border-b border-border-color">
              {editingExpenseId ? "Edit Expense" : "Log Expense"}
            </h2>

            <form onSubmit={handleExpenseSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-3xs font-extrabold uppercase tracking-widest text-muted-text mb-2">
                  Title <span className="text-primary-coral">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Packaging materials"
                  value={expTitle}
                  onChange={(e) => setExpTitle(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-3xs font-extrabold uppercase tracking-widest text-muted-text mb-2">
                  Category <span className="text-primary-coral">*</span>
                </label>
                <select
                  value={expCategory}
                  onChange={(e) => setExpCategory(e.target.value as Expense["category"])}
                  className={inputClass}
                >
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-3xs font-extrabold uppercase tracking-widest text-muted-text mb-2">
                    Amount (EGP) <span className="text-primary-coral">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    min="0"
                    value={expAmount}
                    onChange={(e) => setExpAmount(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-3xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Payment Method</label>
                  <select
                    value={expPayMethod}
                    onChange={(e) => setExpPayMethod(e.target.value)}
                    className={inputClass}
                  >
                    {PAYMENT_METHODS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-3xs font-extrabold uppercase tracking-widest text-muted-text mb-2">
                  Date <span className="text-primary-coral">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={expDate}
                  onChange={(e) => setExpDate(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-3xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Notes</label>
                <input
                  type="text"
                  placeholder="Reference numbers, details…"
                  value={expNotes}
                  onChange={(e) => setExpNotes(e.target.value)}
                  className={inputClass}
                />
              </div>

              <button
                type="submit"
                className="mt-1 w-full rounded-xl bg-primary-coral py-3 text-xs font-black tracking-widest text-main-bg hover:opacity-90 active:scale-[0.98] transition-all shadow-md"
              >
                {editingExpenseId ? "SAVE CHANGES" : "LOG EXPENSE"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
