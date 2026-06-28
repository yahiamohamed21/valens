"use client";

export const dynamic = "force-dynamic";

import React, { useMemo, useState } from "react";
import { useApp, Order, OrderStatus } from "@/context/AppContext";
import { OrderDetailsModal } from "@/app/admin/components/OrderDetailsModal";

const STATUS_STYLES: Record<string, string> = {
  Delivered: "bg-green-500/10 text-green-400 border-green-500/20",
  Cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
  Rejected: "bg-red-500/10 text-red-400 border-red-500/20",
};

const DEFAULT_STATUS_STYLE = "bg-primary-coral/10 text-primary-coral border-primary-coral/20";

function getStatusStyle(status: string): string {
  return STATUS_STYLES[status] ?? DEFAULT_STATUS_STYLE;
}

export default function AdminOrdersPage() {
  const { orders, confirmOrder, cancelOrder, updateOrderStatus } = useApp();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const stats = useMemo(
    () => ({
      total: orders.length,
      new: orders.filter((o) => o.status === "New Order").length,
      delivered: orders.filter((o) => o.status === "Delivered").length,
      cancelled: orders.filter((o) => o.status === "Cancelled" || o.status === "Rejected").length,
    }),
    [orders]
  );

  const statCards = [
    { label: "Total Orders", value: stats.total, color: "text-white" },
    { label: "New", value: stats.new, color: "text-primary-coral" },
    { label: "Delivered", value: stats.delivered, color: "text-green-400" },
    { label: "Cancelled", value: stats.cancelled, color: "text-red-400" },
  ];

  return (
    <>
      <div className="flex flex-col gap-8">
        <header className="pb-6 border-b border-border-color">
          <h1 className="text-xl font-black text-white tracking-tight">Orders</h1>
          <p className="text-xs text-muted-text mt-1">Secure purchases ledger</p>
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" role="region" aria-label="Order statistics">
          {statCards.map((stat) => (
            <div key={stat.label} className="rounded-xl border border-border-color bg-card-bg px-4 py-3 flex flex-col gap-1">
              <span className="text-3xs font-extrabold uppercase tracking-widest text-muted-text">{stat.label}</span>
              <span className={`text-lg font-black ${stat.color}`}>{stat.value}</span>
            </div>
          ))}
        </div>

        <section aria-label="Orders list" className="rounded-2xl border border-border-color bg-card-bg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border-color bg-surface-deep/40">
                  <th scope="col" className="px-5 py-3.5 font-extrabold uppercase tracking-wider text-muted-text">Order ID</th>
                  <th scope="col" className="px-5 py-3.5 font-extrabold uppercase tracking-wider text-muted-text">Client</th>
                  <th scope="col" className="px-5 py-3.5 font-extrabold uppercase tracking-wider text-muted-text hidden md:table-cell">Date</th>
                  <th scope="col" className="px-5 py-3.5 font-extrabold uppercase tracking-wider text-muted-text">Total</th>
                  <th scope="col" className="px-5 py-3.5 font-extrabold uppercase tracking-wider text-muted-text hidden lg:table-cell">Method</th>
                  <th scope="col" className="px-5 py-3.5 font-extrabold uppercase tracking-wider text-muted-text">Status</th>
                  <th scope="col" className="px-5 py-3.5 font-extrabold uppercase tracking-wider text-muted-text text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-muted-text text-sm">
                      No orders yet.
                    </td>
                  </tr>
                ) : (
                  orders.map((ord) => (
                    <tr
                      key={ord.id}
                      className="border-b border-border-color/30 last:border-0 hover:bg-surface-deep/20 transition-colors"
                    >
                      <td className="px-5 py-4 font-bold text-white">{ord.id}</td>
                      <td className="px-5 py-4">
                        <span className="block font-semibold text-white">{ord.customerName}</span>
                        {ord.customerPhone && <span className="text-3xs text-muted-text">{ord.customerPhone}</span>}
                      </td>
                      <td className="px-5 py-4 text-muted-text hidden md:table-cell">
                        {new Date(ord.orderDate).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4 font-bold text-primary-coral">
                        {Math.round(ord.totalPrice).toLocaleString()} EGP
                      </td>
                      <td className="px-5 py-4 text-soft-text hidden lg:table-cell">{ord.paymentMethod}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-3xs font-extrabold uppercase border ${getStatusStyle(ord.status)}`}>
                          {ord.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(ord)}
                            className="rounded-lg border border-border-color bg-surface-deep px-3 py-1.5 text-2xs font-extrabold text-soft-text hover:text-white hover:border-white/20 transition-all"
                            aria-label={`View details for order ${ord.id}`}
                          >
                            Details
                          </button>
                          {ord.status === "New Order" && (
                            <button
                              type="button"
                              onClick={() => confirmOrder(ord.id)}
                              className="rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-1.5 text-2xs font-extrabold text-green-400 hover:bg-green-500 hover:text-white transition-all"
                              aria-label={`Confirm order ${ord.id}`}
                            >
                              Confirm
                            </button>
                          )}
                          {ord.status !== "Cancelled" && ord.status !== "Delivered" && (
                            <button
                              type="button"
                              onClick={() => cancelOrder(ord.id)}
                              className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-2xs font-extrabold text-red-400 hover:bg-red-500 hover:text-white transition-all"
                              aria-label={`Cancel order ${ord.id}`}
                            >
                              Cancel
                            </button>
                          )}
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

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          updateOrderStatus={updateOrderStatus}
          onUpdateLocalOrder={(updatedOrder: Order) => setSelectedOrder(updatedOrder)}
        />
      )}
    </>
  );
}