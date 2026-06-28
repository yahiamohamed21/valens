"use client";

export const dynamic = "force-dynamic";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";

export default function AdminCustomersPage() {
  const appContext = useApp();
  const customers = appContext?.customers ?? [];
  const [search, setSearch] = useState("");

  const filtered = customers?.filter(
    (c) =>
      c?.name?.toLowerCase()?.includes(search?.toLowerCase()) ||
      c?.email?.toLowerCase()?.includes(search?.toLowerCase())
  );

  const totalRevenue = customers?.reduce((sum, c) => sum + c?.totalSpent, 0);
  const totalOrders = customers?.reduce((sum, c) => sum + c?.orderCount, 0);

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border-color">
        <div>
          <h1 className="text-xl font-black text-white tracking-tight">Customers</h1>
          <p className="text-xs text-muted-text mt-1">{customers?.length} registered clients</p>
        </div>
        <div className="relative">
          <input
            type="search"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e?.target?.value)}
            className="w-full sm:w-64 rounded-xl border border-border-color bg-surface-deep pl-4 pr-4 py-2.5 text-xs text-white placeholder-muted-text/50 focus:outline-none focus:border-primary-coral/60 focus:ring-1 focus:ring-primary-coral/20 transition-all"
          />
        </div>
      </header>
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: "Total Customers", display: customers?.length?.toString(), color: "text-white" },
          { label: "Total Orders", display: totalOrders?.toString(), color: "text-primary-coral" },
          { label: "Total Revenue", display: `$${totalRevenue?.toFixed(0)}`, color: "text-green-400" },
        ]?.map((s) => (
          <div key={s?.label} className="rounded-xl border border-border-color bg-card-bg px-4 py-3">
            <span className="text-3xs font-extrabold uppercase tracking-widest text-muted-text block">{s?.label}</span>
            <span className={`text-lg font-black mt-1 block ${s?.color}`}>{s?.display}</span>
          </div>
        ))}
      </div>
      {/* Table */}
      <section aria-label="Customer list" className="rounded-2xl border border-border-color bg-card-bg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border-color bg-surface-deep/40">
                <th className="px-5 py-3.5 font-extrabold uppercase tracking-wider text-muted-text">Customer</th>
                <th className="px-5 py-3.5 font-extrabold uppercase tracking-wider text-muted-text hidden sm:table-cell">Contact</th>
                <th className="px-5 py-3.5 font-extrabold uppercase tracking-wider text-muted-text hidden md:table-cell">Location</th>
                <th className="px-5 py-3.5 font-extrabold uppercase tracking-wider text-muted-text">Orders</th>
                <th className="px-5 py-3.5 font-extrabold uppercase tracking-wider text-muted-text">Spent</th>
                <th className="px-5 py-3.5 font-extrabold uppercase tracking-wider text-muted-text hidden lg:table-cell">Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-muted-text">
                    {search ? "No customers match your search." : "No customers yet."}
                  </td>
                </tr>
              ) : (
                filtered?.map((cust) => (
                  <tr key={cust?.id} className="border-b border-border-color/30 last:border-0 hover:bg-surface-deep/20 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="h-8 w-8 rounded-full bg-primary-coral/10 border border-primary-coral/20 flex items-center justify-center text-primary-coral font-black text-xs uppercase flex-shrink-0"
                          aria-hidden="true"
                        >
                          {cust?.name?.[0]}
                        </div>
                        <span className="font-bold text-white truncate max-w-[120px]">{cust?.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <span className="block font-medium text-white">{cust?.email}</span>
                      <span className="text-3xs text-muted-text">{cust?.phone}</span>
                    </td>
                    <td className="px-5 py-4 text-muted-text hidden md:table-cell max-w-[160px] truncate">
                      {cust?.city}
                    </td>
                    <td className="px-5 py-4 font-bold text-soft-text">{cust?.orderCount}</td>
                    <td className="px-5 py-4 font-black text-primary-coral">${cust?.totalSpent?.toFixed(2)}</td>
                    <td className="px-5 py-4 text-muted-text hidden lg:table-cell">{cust?.joinDate}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
