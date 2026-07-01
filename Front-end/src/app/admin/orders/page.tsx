"use client";

import React, { useState } from "react";
import { useApp, Order } from "@/context/AppContext";
import { OrderDetailsModal } from "@/app/admin/components/OrderDetailsModal";
import { useTranslation } from "@/context/LanguageContext";


type OrderStatus =
  | "New Order"
  | "Confirmed"
  | "Preparing"
  | "Shipped"
  | "Delivered"
  | "Cancelled"
  | "Rejected"
  | "Returned"
  | string;

export default function AdminOrdersPage() {
  const { t } = useTranslation();
  const { orders, confirmOrder, cancelOrder, updateOrderStatus, setOrders, locale } = useApp();
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  // Map order status → i18n key
  const statusTranslationKey: Record<string, string> = {
    "New Order": "common.status_new",
    Confirmed: "common.status_confirmed",
    Preparing: "common.status_preparing",
    Shipped: "common.status_shipped",
    Delivered: "common.status_delivered",
    Cancelled: "common.status_cancelled",
    Rejected: "common.status_rejected",
    Returned: "common.status_returned",
  };

  const translateStatus = (status: OrderStatus): string => {
    const key = statusTranslationKey[status];
    return key ? t(key) : status;
  };

  const getStatusClass = (status: OrderStatus): string => {
    if (status === "Delivered")
      return "bg-success-green/10 text-success-green border border-success-green/20 shadow-[0_0_6px_#10D9811A]";
    if (status === "Cancelled" || status === "Rejected")
      return "bg-red-500/10 text-red-500 border border-red-500/20";
    return "bg-primary-coral/10 text-primary-coral border border-primary-coral/20";
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="border-b border-border-color pb-4">
        <span className="text-xs font-bold text-white uppercase font-semibold">
          {t("admin.orders.title")}
        </span>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl border border-border-color bg-card-bg p-6">
        <div className="overflow-x-auto">
          <table className={`w-full text-xs border-collapse ${locale === "ar" ? "text-right" : "text-left"}`}>
            <thead>
              <tr className="border-b border-border-color text-muted-text uppercase tracking-wider">
                <th className="pb-3 px-4 font-extrabold">{t("admin.orders.order_id")}</th>
                <th className="pb-3 px-4 font-extrabold">{t("admin.orders.customer")}</th>
                <th className="pb-3 px-4 font-extrabold">{t("admin.orders.date")}</th>
                <th className="pb-3 px-4 font-extrabold">{t("admin.orders.total")} ({t("common.egp")})</th>
                <th className="pb-3 px-4 font-extrabold">{locale === "ar" ? "طريقة الدفع" : "Payment Method"}</th>
                <th className="pb-3 px-4 font-extrabold">{t("admin.orders.status_col")}</th>
                <th className={`pb-3 px-4 font-extrabold ${locale === "ar" ? "text-left" : "text-right"}`}>{t("common.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((ord) => (
                <tr
                  key={ord.id}
                  className="border-b border-border-color/30 last:border-0 hover:bg-surface-deep/20"
                >
                  {/* Order Name / ID */}
                  <td className="py-3.5 px-4 font-bold text-white">
                    {ord.orderName || ord.id}
                  </td>

                  {/* Customer */}
                  <td className="py-3.5 px-4">
                    <div>
                      <span className="block font-semibold text-white">{ord.customerName}</span>
                      <span className="text-3xs text-muted-text">{ord.customerPhone}</span>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-4 text-muted-text text-3xs font-semibold">
                    {new Date(ord.orderDate).toLocaleString()}
                  </td>

                  {/* Total */}
                  <td className="py-3.5 px-4 text-primary-coral font-bold">
                    {Math.round(ord.totalPrice).toLocaleString()} {t("common.egp")}
                  </td>

                  {/* Payment Method */}
                  <td className="py-3.5 px-4 uppercase">{ord.paymentMethod}</td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-3xs font-extrabold uppercase ${getStatusClass(ord.status)}`}>
                      {translateStatus(ord.status)}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className={`py-3.5 px-4 text-right flex gap-3 ${locale === "ar" ? "justify-start" : "justify-end"}`}>
                    <button
                      onClick={() => setSelectedOrderDetails(ord)}
                      className="rounded-lg border border-border-color bg-surface-deep px-3 py-1.5 text-2xs font-extrabold text-white hover:text-primary-coral transition-luxury"
                    >
                      {t("common.view_details")}
                    </button>

                    {ord.status === "New Order" && (
                      <button
                        onClick={() => confirmOrder(ord.id)}
                        className="rounded-lg bg-success-green/10 border border-success-green/20 px-3 py-1.5 text-2xs font-extrabold text-success-green hover:bg-success-green hover:text-main-bg transition-luxury"
                      >
                        {t("common.status_confirmed")}
                      </button>
                    )}

                    {ord.status !== "Cancelled" && ord.status !== "Delivered" && (
                      <button
                        onClick={() => cancelOrder(ord.id)}
                        className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-1.5 text-2xs font-extrabold text-red-500 hover:bg-red-500 hover:text-white transition-luxury"
                      >
                        {t("common.cancel")}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrderDetails && (
        <OrderDetailsModal
          order={selectedOrderDetails}
          onClose={() => setSelectedOrderDetails(null)}
          updateOrderStatus={updateOrderStatus}
          onUpdateLocalOrder={(updatedOrder: Order) => {
            setSelectedOrderDetails(updatedOrder);
            setOrders((prev) => prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)));
          }}
        />
      )}
    </div>
  );
}