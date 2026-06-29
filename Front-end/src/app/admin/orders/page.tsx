"use client";

import React, { useState } from "react";
import { useApp, Order } from "@/context/AppContext";
import { OrderDetailsModal } from "@/app/admin/components/OrderDetailsModal";

export default function AdminOrdersPage() {
  const {
    orders,
    confirmOrder,
    cancelOrder,
    updateOrderStatus,
  } = useApp();

  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <div className="border-b border-border-color pb-4">
        <span className="text-xs font-bold text-soft-text uppercase font-semibold">Secure Purchases Ledger</span>
      </div>

      <div className="rounded-2xl border border-border-color bg-card-bg p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border-color text-muted-text uppercase tracking-wider">
                <th className="pb-3 font-extrabold">Order Name</th>
                <th className="pb-3 font-extrabold">Client</th>
                <th className="pb-3 font-extrabold">Date</th>
                <th className="pb-3 font-extrabold">Total Cost</th>
                <th className="pb-3 font-extrabold">Method</th>
                <th className="pb-3 font-extrabold">Order Status</th>
                <th className="pb-3 font-extrabold text-right">Ledger Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((ord) => (
                <tr key={ord.id} className="border-b border-border-color/30 last:border-0 hover:bg-surface-deep/20">
                  <td className="py-3.5 font-bold text-white">{ord.orderName || ord.id}</td>
                  <td className="py-3.5">
                    <div>
                      <span className="block font-semibold text-white">{ord.customerName}</span>
                      <span className="text-3xs text-muted-text">{ord.customerPhone}</span>
                    </div>
                  </td>
                  <td className="py-3.5 text-muted-text text-3xs font-semibold">
                    {new Date(ord.orderDate).toLocaleString()}
                  </td>
                  <td className="py-3.5 text-primary-coral font-bold">{Math.round(ord.totalPrice).toLocaleString()} EGP</td>
                  <td className="py-3.5 uppercase">{ord.paymentMethod}</td>
                  <td className="py-3.5">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-3xs font-extrabold uppercase ${ord.status === "Delivered"
                        ? "bg-success-green/10 text-success-green border border-success-green/20 shadow-[0_0_6px_#10D9811A]"
                        : ord.status === "Cancelled" || ord.status === "Rejected"
                          ? "bg-red-500/10 text-red-500 border border-red-500/20"
                          : "bg-primary-coral/10 text-primary-coral border border-primary-coral/20"
                      }`}>
                      {ord.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right flex justify-end gap-3">
                    <button
                      onClick={() => setSelectedOrderDetails(ord)}
                      className="rounded-lg border border-border-color bg-surface-deep px-3 py-1.5 text-2xs font-extrabold text-soft-text hover:text-white"
                    >
                      Verify Details
                    </button>
                    {ord.status === "New Order" && (
                      <button
                        onClick={() => confirmOrder(ord.id)}
                        className="rounded-lg bg-success-green/10 border border-success-green/20 px-3 py-1.5 text-2xs font-extrabold text-success-green hover:bg-success-green hover:text-main-bg transition-luxury"
                      >
                        Confirm
                      </button>
                    )}
                    {ord.status !== "Cancelled" && ord.status !== "Delivered" && (
                      <button
                        onClick={() => cancelOrder(ord.id)}
                        className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-1.5 text-2xs font-extrabold text-red-500 hover:bg-red-500 hover:text-white transition-luxury"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrderDetails && (
        <OrderDetailsModal
          order={selectedOrderDetails}
          onClose={() => setSelectedOrderDetails(null)}
          updateOrderStatus={updateOrderStatus}
          onUpdateLocalOrder={(updatedOrder) => {
            setSelectedOrderDetails(updatedOrder);
          }}
        />
      )}
    </div>
  );
}
