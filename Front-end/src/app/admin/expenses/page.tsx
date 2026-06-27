"use client";

import React, { useState } from "react";
import { useApp, Expense } from "@/context/AppContext";
import { useAdminStats } from "@/app/admin/hooks/useAdminStats";
import { Icon } from "@/components/SvgIcons";
import { showConfirmToast } from "@/lib/toast";

export default function AdminExpensesPage() {
  const {
    expenses,
    orders,
    products,
    customers,
    addExpense,
    editExpense,
    deleteExpense,
  } = useApp();

  const { totals, expensesByCategory } = useAdminStats(orders, expenses, products, customers);

  // Expense modal state
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);

  // Form states - Expenses
  const [expTitle, setExpTitle] = useState("");
  const [expCategory, setExpCategory] = useState<Expense["category"]>("Product purchasing cost");
  const [expAmount, setExpAmount] = useState("");
  const [expDate, setExpDate] = useState("");
  const [expPayMethod, setExpPayMethod] = useState("Bank Transfer");
  const [expNotes, setExpNotes] = useState("");

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
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-border-color pb-4">
        <span className="text-xs font-bold text-soft-text uppercase font-semibold">Operational Brand Expenses</span>
        <button
          onClick={() => {
            setEditingExpenseId(null);
            setExpTitle("");
            setExpCategory("Product purchasing cost");
            setExpAmount("");
            setExpDate("");
            setExpPayMethod("Bank Transfer");
            setExpNotes("");
            setExpenseModalOpen(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-primary-coral px-4 py-2.5 text-xs font-black tracking-widest text-main-bg hover:bg-white transition-luxury shadow-lg"
        >
          <Icon name="plus" size={14} />
          ADD EXPENSE
        </button>
      </div>

      {/* Exp summary stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border-color bg-card-bg p-5 text-center">
          <span className="text-4xs font-extrabold uppercase tracking-widest text-muted-text">TOTAL OUTFLOWS</span>
          <span className="block mt-2 text-xl font-black text-white">{Math.round(totals.totalExpenses).toLocaleString()} EGP</span>
        </div>
        <div className="rounded-2xl border border-border-color bg-card-bg p-5 text-center">
          <span className="text-4xs font-extrabold uppercase tracking-widest text-muted-text">HIGHEST OUTFLOW CATEGORY</span>
          <span className="block mt-2 text-sm font-black text-primary-coral uppercase truncate">
            {expensesByCategory[0]?.[0] || "None"}
          </span>
        </div>
        <div className="rounded-2xl border border-border-color bg-card-bg p-5 text-center">
          <span className="text-4xs font-extrabold uppercase tracking-widest text-muted-text">MONTHLY EXPENSES</span>
          <span className="block mt-2 text-xl font-black text-white">
            {Math.round(expenses.filter(e => e.date.includes("2026-06")).reduce((acc, curr) => acc + curr.amount, 0)).toLocaleString()} EGP
          </span>
        </div>
      </div>

      {/* Table Ledger list */}
      <div className="rounded-2xl border border-border-color bg-card-bg p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border-color text-muted-text uppercase tracking-wider">
                <th className="pb-3 font-extrabold">Expense Purpose</th>
                <th className="pb-3 font-extrabold">Category classification</th>
                <th className="pb-3 font-extrabold">Amount paid</th>
                <th className="pb-3 font-extrabold">Date</th>
                <th className="pb-3 font-extrabold">Method</th>
                <th className="pb-3 font-extrabold">Notes</th>
                <th className="pb-3 font-extrabold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((e) => (
                <tr key={e.id} className="border-b border-border-color/30 last:border-0 hover:bg-surface-deep/20">
                  <td className="py-3.5 font-bold text-white">{e.title}</td>
                  <td className="py-3.5 uppercase text-3xs font-semibold text-muted-text">{e.category}</td>
                  <td className="py-3.5 font-black text-accent-orange">{e.amount.toLocaleString()} EGP</td>
                  <td className="py-3.5 text-muted-text text-3xs font-semibold">{e.date}</td>
                  <td className="py-3.5 uppercase">{e.paymentMethod}</td>
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
                      className="p-1.5 rounded-lg border border-border-color bg-surface-deep text-soft-text hover:text-primary-coral"
                    >
                      <Icon name="edit" size={14} />
                    </button>
                    <button
                      onClick={() => showConfirmToast(`Remove expense record for ${e.title}?`, () => deleteExpense(e.id))}
                      className="p-1.5 rounded-lg border border-border-color bg-surface-deep text-muted-text hover:text-accent-orange"
                    >
                      <Icon name="trash" size={14} />
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
              className="absolute right-4 top-4 text-muted-text hover:text-white"
            >
              <Icon name="close" size={20} />
            </button>
            <h2 className="text-base font-black uppercase tracking-wider text-white border-b border-border-color pb-3 mb-5">
              {editingExpenseId ? "Edit Expense Entry" : "Log Expense outflow"}
            </h2>

            <form onSubmit={handleExpenseSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Expense Description Title *</label>
                <input
                  type="text"
                  required
                  placeholder="E.g. Matte Black plastic caps procurement"
                  value={expTitle}
                  onChange={(e) => setExpTitle(e.target.value)}
                  className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Expense Category *</label>
                <select
                  value={expCategory}
                  onChange={(e) => setExpCategory(e.target.value as any)}
                  className="w-full rounded-xl border border-border-color bg-surface-deep px-3 py-2 text-xs text-white"
                >
                  <option value="Product purchasing cost">Product purchasing cost</option>
                  <option value="Shipping expenses">Shipping expenses</option>
                  <option value="Marketing and ads">Marketing and ads</option>
                  <option value="Packaging">Packaging</option>
                  <option value="Website maintenance">Website maintenance</option>
                  <option value="Staff salaries">Staff salaries</option>
                  <option value="Storage / warehouse">Storage / warehouse</option>
                  <option value="Delivery company fees">Delivery company fees</option>
                  <option value="Miscellaneous expenses">Miscellaneous expenses</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Amount (EGP) *</label>
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
                  <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Payment Method</label>
                  <select
                    value={expPayMethod}
                    onChange={(e) => setExpPayMethod(e.target.value)}
                    className="w-full rounded-xl border border-border-color bg-surface-deep px-3 py-2 text-xs text-white"
                  >
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Expense Log Date *</label>
                <input
                  type="date"
                  required
                  value={expDate}
                  onChange={(e) => setExpDate(e.target.value)}
                  className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Notes</label>
                <input
                  type="text"
                  placeholder="Provide reference numbers, details..."
                  value={expNotes}
                  onChange={(e) => setExpNotes(e.target.value)}
                  className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white"
                />
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-primary-coral py-3.5 text-xs font-black tracking-widest text-main-bg hover:bg-white transition-luxury shadow-lg mt-4"
              >
                LOG EXPENSE RECORD
                <Icon name="check" size={14} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
