"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp, Order } from "@/context/AppContext";
import { useAdminStats } from "@/app/admin/hooks/useAdminStats";
import { Icon } from "@/components/SvgIcons";
import { OrderDetailsModal } from "@/app/admin/components/OrderDetailsModal";

export default function AdminDashboard() {
  const {
    products,
    orders,
    expenses,
    customers,
    updateOrderStatus,
    locale,
  } = useApp();

  const { totals } = useAdminStats(orders, expenses, products, customers);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  return (
    <div className="flex flex-col gap-6">
      {/* Stat HUD grid */}
      <div className={`grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6 ${locale === "ar" ? "text-right" : "text-left"}`}>

        <div className="rounded-2xl border border-border-color bg-card-bg p-4 flex flex-col justify-between">
          <span className="text-4xs font-extrabold uppercase tracking-widest text-muted-text">
            {locale === "ar" ? "إجمالي الإيرادات" : "TOTAL REVENUES"}
          </span>
          <span className="mt-1.5 text-lg font-black text-white">
            {Math.round(totals.totalSales).toLocaleString()} {locale === "ar" ? "ج.م" : "EGP"}
          </span>
          <span className="text-4xs text-success-green mt-1">
            {locale === "ar" ? "طلبات مؤكدة" : "Confirmed orders"}
          </span>
        </div>

        <div className="rounded-2xl border border-border-color bg-card-bg p-4 flex flex-col justify-between">
          <span className="text-4xs font-extrabold uppercase tracking-widest text-muted-text">
            {locale === "ar" ? "إجمالي المصاريف" : "TOTAL EXPENSES"}
          </span>
          <span className="mt-1.5 text-lg font-black text-accent-orange">
            {Math.round(totals.totalExpenses).toLocaleString()} {locale === "ar" ? "ج.م" : "EGP"}
          </span>
          <span className="text-4xs text-muted-text mt-1">
            {locale === "ar" ? "شراء وتوريد" : "Brand procurement"}
          </span>
        </div>

        <div className="rounded-2xl border border-border-color bg-card-bg p-4 flex flex-col justify-between">
          <span className="text-4xs font-extrabold uppercase tracking-widest text-muted-text">
            {locale === "ar" ? "صافي الأرباح" : "NET PROFITS"}
          </span>
          <span className={`mt-1.5 text-lg font-black ${totals.netProfit >= 0 ? "text-success-green" : "text-red-500"}`}>
            {Math.round(totals.netProfit).toLocaleString()} {locale === "ar" ? "ج.م" : "EGP"}
          </span>
          <span className="text-4xs text-muted-text mt-1">
            {locale === "ar" ? "المبيعات - المصاريف" : "Sales - Expenses"}
          </span>
        </div>

        <div className="rounded-2xl border border-border-color bg-card-bg p-4 flex flex-col justify-between">
          <span className="text-4xs font-extrabold uppercase tracking-widest text-muted-text">
            {locale === "ar" ? "الطلبات النشطة" : "ACTIVE ORDERS"}
          </span>
          <span className="mt-1.5 text-lg font-black text-white">{totals.totalOrdersCount}</span>
          <span className="text-4xs text-primary-coral mt-1">
            {totals.newOrders} {locale === "ar" ? "طلبات جديدة واردة" : "New Order arrivals"}
          </span>
        </div>

        <div className="rounded-2xl border border-border-color bg-card-bg p-4 flex flex-col justify-between">
          <span className="text-4xs font-extrabold uppercase tracking-widest text-muted-text">
            {locale === "ar" ? "مخزون المنتجات" : "PRODUCT INVENTORY"}
          </span>
          <span className="mt-1.5 text-lg font-black text-white">{totals.totalProducts}</span>
          <span className="text-4xs text-muted-text mt-1">
            {locale === "ar" ? "تركيبة علاجية" : "Formulations"}
          </span>
        </div>

        <div className="rounded-2xl border border-border-color bg-card-bg p-4 flex flex-col justify-between">
          <span className="text-4xs font-extrabold uppercase tracking-widest text-muted-text">
            {locale === "ar" ? "تنبيهات المخزون" : "LOW STOCK WARNS"}
          </span>
          <span className={`mt-1.5 text-lg font-black ${totals.lowStockProducts > 0 ? "text-accent-orange" : "text-success-green"}`}>
            {totals.lowStockProducts}
          </span>
          <span className="text-4xs text-muted-text mt-1">
            {locale === "ar" ? "منتجات منخفضة/نافدة" : "Low/Out products"}
          </span>
        </div>

      </div>

      {/* Graphical representation bar & Low stock alert panel */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">

        {/* Sales vs Expenses Custom SVG Graph */}
        <div className="lg:col-span-8 rounded-2xl border border-border-color bg-card-bg p-6">
          <h3 className={`text-xs font-black uppercase tracking-widest text-white mb-6 ${locale === "ar" ? "text-right" : ""}`}>
            {locale === "ar" ? "مخطط التوازن المالي" : "Financial Balance Chart"}
          </h3>

          {/* SVG Bar Chart */}
          <div className={`w-full h-64 relative flex items-end justify-between px-6 pt-4 border-b border-border-color pb-1 ${
            locale === "ar" ? "flex-row-reverse" : ""
          }`}>
            {/* Background ticks */}
            <div className="absolute inset-0 flex flex-col justify-between py-4 pointer-events-none pr-6">
              <div className="border-b border-border-color/10 w-full" />
              <div className="border-b border-border-color/10 w-full" />
              <div className="border-b border-border-color/10 w-full" />
              <div className="border-b border-border-color/10 w-full" />
            </div>

            {/* Sales Column */}
            <div className="flex flex-col items-center gap-2 z-10 w-1/3">
              <div
                className="w-16 rounded-t-xl bg-gradient-to-t from-primary-coral to-accent-orange shadow-[0_0_15px_rgba(255,138,117,0.2)]"
                style={{ height: `${Math.min(180, (totals.totalSales / Math.max(1, totals.totalSales + totals.totalExpenses)) * 180)}px` }}
              />
              <span className="text-4xs font-black uppercase tracking-widest text-white">
                {locale === "ar" ? "الإيرادات" : "REVENUES"}
              </span>
              <span className="text-2xs font-extrabold text-primary-coral">
                {Math.round(totals.totalSales).toLocaleString()} {locale === "ar" ? "ج.م" : "EGP"}
              </span>
            </div>

            {/* Expenses Column */}
            <div className="flex flex-col items-center gap-2 z-10 w-1/3">
              <div
                className="w-16 rounded-t-xl bg-surface-sec border border-border-color"
                style={{ height: `${Math.min(180, (totals.totalExpenses / Math.max(1, totals.totalSales + totals.totalExpenses)) * 180)}px` }}
              />
              <span className="text-4xs font-black uppercase tracking-widest text-muted-text">
                {locale === "ar" ? "المصاريف" : "EXPENSES"}
              </span>
              <span className="text-2xs font-extrabold text-white">
                {Math.round(totals.totalExpenses).toLocaleString()} {locale === "ar" ? "ج.م" : "EGP"}
              </span>
            </div>

            {/* Net Profit Column */}
            <div className="flex flex-col items-center gap-2 z-10 w-1/3">
              <div
                className={`w-16 rounded-t-xl ${totals.netProfit >= 0 ? "bg-[#10D981] shadow-[0_0_15px_rgba(16,217,129,0.2)]" : "bg-red-500"}`}
                style={{ height: `${Math.min(180, (Math.abs(totals.netProfit) / Math.max(1, totals.totalSales + totals.totalExpenses)) * 180)}px` }}
              />
              <span className="text-4xs font-black uppercase tracking-widest text-white">
                {locale === "ar" ? "صافي الربح" : "NET PROFIT"}
              </span>
              <span className="text-2xs font-extrabold text-white">
                {Math.round(totals.netProfit).toLocaleString()} {locale === "ar" ? "ج.م" : "EGP"}
              </span>
            </div>

          </div>
        </div>

        {/* Low Stock Warning Alert List */}
        <div className="lg:col-span-4 rounded-2xl border border-border-color bg-card-bg p-6 flex flex-col justify-between">
          <div>
            <h3 className={`text-xs font-black uppercase tracking-widest text-white mb-4 ${locale === "ar" ? "text-right" : ""}`}>
              {locale === "ar" ? "إنذارات المخزون" : "Stock Alarms"}
            </h3>
            <div className="flex flex-col gap-3">
              {products.filter((p) => p.stockStatus !== "In Stock").slice(0, 4).map((p) => (
                <div key={p.id} className={`flex justify-between items-center bg-surface-deep border border-border-color rounded-xl p-3 ${
                  locale === "ar" ? "flex-row-reverse" : ""
                }`}>
                  <div className={locale === "ar" ? "text-right" : ""}>
                    <span className="block text-2xs font-bold text-white truncate max-w-[120px]">
                      {locale === "ar" && p.name_ar ? p.name_ar : p.name}
                    </span>
                    <span className="text-3xs text-muted-text font-bold">SKU: {p.sku}</span>
                  </div>
                  <span className={`text-3xs font-extrabold uppercase px-2 py-0.5 rounded-full ${p.stock === 0 ? "bg-red-500/10 text-red-500" : "bg-primary-coral/10 text-primary-coral"
                    }`}>
                    {p.stock === 0 
                      ? (locale === "ar" ? "نفد" : "OUT") 
                      : `${p.stock} ${locale === "ar" ? "متبقي" : "LEFT"}`
                    }
                  </span>
                </div>
              ))}
              {products.filter((p) => p.stockStatus !== "In Stock").length === 0 && (
                <div className="text-center text-xs text-muted-text py-10 uppercase font-bold">
                  {locale === "ar" ? "جميع المنتجات متوفرة بأمان." : "All inventory stocked safely."}
                </div>
              )}
            </div>
          </div>

          <Link
            href="/admin/products"
            className="mt-6 text-center text-2xs font-extrabold uppercase tracking-widest text-primary-coral hover:text-white"
          >
            {locale === "ar" ? "إدارة كتالوج المنتجات >" : "MANAGE PRODUCTS CATALOG >"}
          </Link>
        </div>

      </div>

      {/* Recent Orders List overview */}
      <div className="rounded-2xl border border-border-color bg-card-bg p-6">
        <div className={`flex items-center justify-between border-b border-border-color pb-4 mb-4 ${
          locale === "ar" ? "flex-row-reverse" : ""
        }`}>
          <h3 className="text-xs font-black uppercase tracking-widest text-white">
            {locale === "ar" ? "المشتريات الأخيرة" : "Recent Purchases"}
          </h3>
          <Link
            href="/admin/orders"
            className="text-2xs font-extrabold uppercase tracking-wide text-primary-coral hover:underline"
          >
            {locale === "ar" ? "عرض جميع الطلبات" : "View All Orders"}
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className={`w-full text-xs border-collapse ${locale === "ar" ? "text-right" : "text-left"}`}>
            <thead>
              <tr className={`border-b border-border-color text-muted-text uppercase tracking-wider ${
                locale === "ar" ? "flex-row-reverse" : ""
              }`}>
                <th className="pb-3 font-extrabold">{locale === "ar" ? "الطلب" : "Order"}</th>
                <th className="pb-3 font-extrabold">{locale === "ar" ? "العميل" : "Customer"}</th>
                <th className="pb-3 font-extrabold">{locale === "ar" ? "الإجمالي" : "Total"}</th>
                <th className="pb-3 font-extrabold">{locale === "ar" ? "طريقة الدفع" : "Payment"}</th>
                <th className="pb-3 font-extrabold">{locale === "ar" ? "الحالة" : "Status"}</th>
                <th className="pb-3 font-extrabold">{locale === "ar" ? "الإجراء" : "Action"}</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((ord) => (
                <tr key={ord.id} className="border-b border-border-color/30 last:border-0">
                  <td className="py-3.5 font-bold text-white">{ord.id}</td>
                  <td className="py-3.5">{ord.customerName}</td>
                  <td className="py-3.5 text-primary-coral font-bold">
                    {Math.round(ord.totalPrice).toLocaleString()} {locale === "ar" ? "ج.م" : "EGP"}
                  </td>
                  <td className="py-3.5 uppercase">
                    {ord.paymentMethod === "Cash On Delivery" || ord.paymentMethod?.toLowerCase().includes("cash")
                      ? (locale === "ar" ? "الدفع عند الاستلام" : "Cash On Delivery")
                      : ord.paymentMethod === "Credit Card"
                        ? (locale === "ar" ? "بطاقة ائتمان" : "Credit Card")
                        : ord.paymentMethod === "PayPal"
                          ? (locale === "ar" ? "بايبال" : "PayPal")
                          : ord.paymentMethod
                    }
                  </td>
                  <td className="py-3.5">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-3xs font-extrabold uppercase ${ord.status === "Delivered"
                        ? "bg-success-green/10 text-success-green border border-success-green/20"
                        : ord.status === "Cancelled"
                          ? "bg-red-500/10 text-red-500 border border-red-500/20"
                          : "bg-primary-coral/10 text-primary-coral border border-primary-coral/20"
                      }`}>
                      {ord.status === "New Order"
                        ? (locale === "ar" ? "طلب جديد" : "New Order")
                        : ord.status === "Preparing"
                          ? (locale === "ar" ? "جاري التجهيز" : "Preparing")
                          : ord.status === "Shipped / Out for Delivery"
                            ? (locale === "ar" ? "تم الشحن" : "Shipped / Out for Delivery")
                            : ord.status === "Delivered"
                              ? (locale === "ar" ? "تم التوصيل" : "Delivered")
                              : ord.status === "Cancelled"
                                ? (locale === "ar" ? "ملغي" : "Cancelled")
                                : ord.status}
                    </span>
                  </td>
                  <td className="py-3.5">
                    <button
                      onClick={() => setSelectedOrderDetails(ord)}
                      className="text-2xs font-black uppercase text-primary-coral hover:text-white"
                    >
                      {locale === "ar" ? "التفاصيل" : "Details"}
                    </button>
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
