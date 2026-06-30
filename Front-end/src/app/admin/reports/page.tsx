"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { useAdminStats } from "@/app/admin/hooks/useAdminStats";

export default function AdminReportsPage() {
  const {
    orders,
    expenses,
    products,
    customers,
  } = useApp();

  const { totals, expensesByCategory } = useAdminStats(orders, expenses, products, customers);

  // Reports Date Filters
  const [reportStartDate, setReportStartDate] = useState("2026-06-01");
  const [reportEndDate, setReportEndDate] = useState("2026-06-30");

  return (
    <div className="flex flex-col gap-6">
      {/* Date Filters bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border-color pb-4">
        <span className="text-xs font-bold text-white uppercase font-semibold">Brand Diagnostic Reports</span>

        <div className="flex items-center gap-3">
          <span className="text-3xs font-black uppercase tracking-widest text-muted-text">Range:</span>
          <input
            type="date"
            value={reportStartDate}
            onChange={(e) => setReportStartDate(e.target.value)}
            className="rounded-xl border border-border-color bg-surface-deep px-3 py-1.5 text-xs text-white"
          />
          <span className="text-muted-text">—</span>
          <input
            type="date"
            value={reportEndDate}
            onChange={(e) => setReportEndDate(e.target.value)}
            className="rounded-xl border border-border-color bg-surface-deep px-3 py-1.5 text-xs text-white"
          />
        </div>
      </div>

      {/* Reports dynamic HUD calculations */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Profit calculations breakdowns */}
        <div className="rounded-2xl border border-border-color bg-card-bg p-6 flex flex-col gap-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-white border-b border-border-color pb-3">Net Profit Calculations</h3>

          <div className="flex justify-between items-center text-xs text-white border-b border-border-color/30 pb-3">
            <span>Gross Sales Revenues</span>
            <span className="font-extrabold text-white">{Math.round(totals.totalSales).toLocaleString()} EGP</span>
          </div>

          <div className="flex justify-between items-center text-xs text-white border-b border-border-color/30 pb-3">
            <span>Operational Business Expenses</span>
            <span className="font-extrabold text-accent-orange">-{Math.round(totals.totalExpenses).toLocaleString()} EGP</span>
          </div>

          <div className="flex justify-between items-center text-sm font-black uppercase tracking-wider py-2">
            <span>Real Net Profit</span>
            <span className={`text-lg font-black ${totals.netProfit >= 0 ? "text-success-green" : "text-red-500"}`}>
              {Math.round(totals.netProfit).toLocaleString()} EGP
            </span>
          </div>

          <div className="bg-surface-deep rounded-xl p-4 border border-border-color mt-2 flex flex-col gap-2">
            <span className="text-4xs font-extrabold uppercase tracking-widest text-muted-text">PROFIT MARGIN RATIO</span>
            <span className="text-xl font-black text-white">
              {totals.totalSales > 0 ? `${((totals.netProfit / totals.totalSales) * 100).toFixed(1)}%` : "0.0%"}
            </span>
          </div>
        </div>

        {/* Expense allocations graph classifications */}
        <div className="rounded-2xl border border-border-color bg-card-bg p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-white border-b border-border-color pb-3 mb-4">Expenses Allocations by Category</h3>
            <div className="flex flex-col gap-3 max-h-56 overflow-y-auto pr-1">
              {expensesByCategory.map(([category, amount]) => (
                <div key={category} className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-3xs font-bold text-white uppercase">
                    <span>{category}</span>
                    <span>{Math.round(amount).toLocaleString()} EGP ({((amount / Math.max(1, totals.totalExpenses)) * 100).toFixed(0)}%)</span>
                  </div>
                  {/* percentage indicator strip */}
                  <div className="w-full bg-surface-deep h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-primary-coral h-full rounded-full"
                      style={{ width: `${(amount / Math.max(1, totals.totalExpenses)) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
              {expensesByCategory.length === 0 && (
                <div className="text-center text-xs text-muted-text py-10 uppercase font-bold">
                  No expense logs written yet.
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}