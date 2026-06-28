"use client";

export const dynamic = "force-dynamic";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { useAdminStats } from "@/app/admin/hooks/useAdminStats";

export default function AdminReportsPage() {
  const appContext = useApp();
  const orders = appContext?.orders ?? [];
  const expenses = appContext?.expenses ?? [];
  const products = appContext?.products ?? [];
  const customers = appContext?.customers ?? [];

  const statsResult = useAdminStats(orders, expenses, products, customers);
  const totals = statsResult?.totals ?? {
    totalSales: 0,
    totalExpenses: 0,
    netProfit: 0,
  };
  const expensesByCategory: [string, number][] = statsResult?.expensesByCategory ?? [];

  const [reportStartDate, setReportStartDate] = useState("2026-06-01");
  const [reportEndDate, setReportEndDate] = useState("2026-06-30");

  const profitMargin =
    totals.totalSales > 0
      ? ((totals.netProfit / totals.totalSales) * 100).toFixed(1)
      : "0.0";

  return (
    <div className="flex flex-col gap-8">
      {/* Page Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border-color">
        <div>
          <h1 className="text-xl font-black text-white tracking-tight">Brand Reports</h1>
          <p className="text-xs text-muted-text mt-1">Diagnostic financial overview</p>
        </div>

        {/* Date Range Filter */}
        <div className="flex items-center gap-2" role="group" aria-label="Report date range filter">
          <span className="text-3xs font-extrabold uppercase tracking-widest text-muted-text hidden sm:block">Range</span>
          <input
            type="date"
            value={reportStartDate}
            onChange={(e) => setReportStartDate(e.target.value)}
            aria-label="Report start date"
            className="rounded-xl border border-border-color bg-surface-deep px-3 py-2 text-xs text-white focus:outline-none focus:border-primary-coral/60 focus:ring-1 focus:ring-primary-coral/20 transition-all"
          />
          <span className="text-muted-text text-xs" aria-hidden="true">—</span>
          <input
            type="date"
            value={reportEndDate}
            onChange={(e) => setReportEndDate(e.target.value)}
            aria-label="Report end date"
            className="rounded-xl border border-border-color bg-surface-deep px-3 py-2 text-xs text-white focus:outline-none focus:border-primary-coral/60 focus:ring-1 focus:ring-primary-coral/20 transition-all"
          />
        </div>
      </header>

      {/* Summary Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" role="region" aria-label="Financial summary">
        {[
          { label: "Gross Sales", value: `${Math.round(totals.totalSales).toLocaleString()} EGP`, color: "text-white" },
          { label: "Total Expenses", value: `${Math.round(totals.totalExpenses).toLocaleString()} EGP`, color: "text-accent-orange" },
          { label: "Net Profit", value: `${Math.round(totals.netProfit).toLocaleString()} EGP`, color: totals.netProfit >= 0 ? "text-green-400" : "text-red-400" },
          { label: "Profit Margin", value: `${profitMargin}%`, color: "text-primary-coral" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border-color bg-card-bg px-4 py-4 flex flex-col gap-1">
            <span className="text-3xs font-extrabold uppercase tracking-widest text-muted-text">{stat.label}</span>
            <span className={`text-base font-black mt-1 ${stat.color}`}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Main Report Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Net Profit Breakdown */}
        <section aria-labelledby="profit-calc-heading" className="rounded-2xl border border-border-color bg-card-bg p-6 flex flex-col gap-5">
          <h2 id="profit-calc-heading" className="text-sm font-black text-white pb-4 border-b border-border-color">
            Net Profit Calculations
          </h2>

          <dl className="flex flex-col gap-4">
            <div className="flex justify-between items-center pb-4 border-b border-border-color/30">
              <dt className="text-xs text-soft-text">Gross Sales Revenues</dt>
              <dd className="text-xs font-extrabold text-white">{Math.round(totals.totalSales).toLocaleString()} EGP</dd>
            </div>

            <div className="flex justify-between items-center pb-4 border-b border-border-color/30">
              <dt className="text-xs text-soft-text">Operational Business Expenses</dt>
              <dd className="text-xs font-extrabold text-accent-orange">−{Math.round(totals.totalExpenses).toLocaleString()} EGP</dd>
            </div>

            <div className="flex justify-between items-center py-1">
              <dt className="text-sm font-black text-white uppercase tracking-wider">Real Net Profit</dt>
              <dd className={`text-xl font-black ${totals.netProfit >= 0 ? "text-green-400" : "text-red-400"}`}>
                {Math.round(totals.netProfit).toLocaleString()} EGP
              </dd>
            </div>
          </dl>

          {/* Profit Margin Callout */}
          <div className="mt-auto rounded-xl bg-surface-deep border border-border-color p-4 flex items-center justify-between">
            <div>
              <p className="text-3xs font-extrabold uppercase tracking-widest text-muted-text">Profit Margin Ratio</p>
              <p className="text-2xl font-black text-white mt-1">{profitMargin}%</p>
            </div>
            <div
              className={`h-14 w-14 rounded-full border-4 flex items-center justify-center ${
                totals.netProfit >= 0 ? "border-green-400/30" : "border-red-400/30"
              }`}
              aria-hidden="true"
            >
              <span className={`text-xs font-black ${totals.netProfit >= 0 ? "text-green-400" : "text-red-400"}`}>
                {profitMargin}%
              </span>
            </div>
          </div>
        </section>

        {/* Expense Allocations */}
        <section aria-labelledby="expense-alloc-heading" className="rounded-2xl border border-border-color bg-card-bg p-6 flex flex-col gap-5">
          <h2 id="expense-alloc-heading" className="text-sm font-black text-white pb-4 border-b border-border-color">
            Expenses by Category
          </h2>

          {expensesByCategory.length > 0 ? (
            <div className="flex flex-col gap-4 overflow-y-auto max-h-72 pr-1" role="list" aria-label="Expense categories breakdown">
              {expensesByCategory.map(([category, amount]) => {
                const pct = ((amount / Math.max(1, totals.totalExpenses)) * 100).toFixed(0);
                return (
                  <div key={category} role="listitem" className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-soft-text font-semibold truncate max-w-[60%]">{category}</span>
                      <span className="text-3xs font-extrabold text-muted-text">
                        {Math.round(amount).toLocaleString()} EGP &middot; {pct}%
                      </span>
                    </div>
                    <div
                      className="w-full bg-surface-deep h-1.5 rounded-full overflow-hidden"
                      role="progressbar"
                      aria-valuenow={Number(pct)}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${category} expense share`}
                    >
                      <div
                        className="bg-primary-coral h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center py-12 text-center">
              <div>
                <p className="text-sm font-bold text-muted-text">No expense records yet</p>
                <p className="text-xs text-muted-text/60 mt-1">Add expenses to see category breakdown.</p>
              </div>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
