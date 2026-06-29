"use client";

import React, { useEffect } from "react";
import { useApp } from "@/context/AppContext";

export default function AdminCustomersPage() {
  const { customers, orders, fetchAdminData, locale } = useApp();

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  return (
    <div className="flex flex-col gap-6">
      <div className="border-b border-border-color pb-4">
        <span className="text-xs font-bold text-soft-text uppercase font-semibold">Active Client Base</span>
      </div>

      <div className="rounded-2xl border border-border-color bg-card-bg p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border-color text-muted-text uppercase tracking-wider">
                <th className="pb-3 font-extrabold">Customer Name</th>
                <th className="pb-3 font-extrabold">Contact Info</th>
                <th className="pb-3 font-extrabold">Delivery Base</th>
                <th className="pb-3 font-extrabold">Order Count</th>
                <th className="pb-3 font-extrabold">Total stack Spent</th>
                <th className="pb-3 font-extrabold">Join Date</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((cust) => {
                const customerOrders = orders.filter(
                  (o) => (o.customerEmail || "").toLowerCase() === (cust.email || "").toLowerCase()
                );
                const orderCount = customerOrders.length || cust.orderCount || 0;
                const totalSpent = cust.totalSpent || customerOrders.reduce((acc, curr) => acc + curr.totalPrice, 0);

                return (
                  <tr key={cust.id} className="border-b border-border-color/30 last:border-0 hover:bg-surface-deep/20">
                    <td className="py-3.5 font-bold text-white flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary-coral/10 border border-primary-coral/30 flex items-center justify-center text-primary-coral font-bold text-xs uppercase">
                        {cust.name ? cust.name[0] : ""}
                      </div>
                      {cust.name || "No Name"}
                    </td>
                    <td className="py-3.5">
                      <div>
                        <span className="block font-medium text-white">{cust.email}</span>
                        <span className="text-3xs text-muted-text">{cust.phone}</span>
                      </div>
                    </td>
                    <td className="py-3.5 text-muted-text max-w-xs truncate">{cust.address}, {cust.city}</td>
                    <td className="py-3.5 font-bold">{orderCount} {locale === "ar" ? "طلبات" : "Orders"}</td>
                    <td className="py-3.5 text-primary-coral font-bold">{Math.round(totalSpent).toLocaleString()} EGP</td>
                    <td className="py-3.5 text-muted-text text-3xs font-semibold">
                      {(() => {
                        try {
                          return new Date(cust.joinDate).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric"
                          });
                        } catch {
                          return cust.joinDate;
                        }
                      })()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
