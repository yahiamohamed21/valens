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
      <div className="flex flex-col gap-8 px-1">
        {/* Stat HUD grid - Enhanced with better spacing and visual hierarchy */}
        <div className={`grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6 ${locale === "ar" ? "text-right" : "text-left"}`}>

          {/* Total Revenues Card */}
          <div className="rounded-2xl border border-border-color bg-card-bg p-5 flex flex-col justify-between hover:border-primary-coral/30 transition-all duration-300 shadow-sm hover:shadow-md">
            <span className="text-3xs font-extrabold uppercase tracking-widest text-muted-text block mb-3">
              {locale === "ar" ? "إجمالي الإيرادات" : "TOTAL REVENUES"}
            </span>
            <span className="text-xl font-black text-white leading-tight mb-2">
              {Math.round(totals.totalSales).toLocaleString()} {locale === "ar" ? "ج.م" : "EGP"}
            </span>
            <span className="text-3xs text-success-green font-semibold">
              {locale === "ar" ? "طلبات مؤكدة" : "Confirmed orders"}
            </span>
          </div>

          {/* Total Expenses Card */}
          <div className="rounded-2xl border border-border-color bg-card-bg p-5 flex flex-col justify-between hover:border-accent-orange/30 transition-all duration-300 shadow-sm hover:shadow-md">
            <span className="text-3xs font-extrabold uppercase tracking-widest text-muted-text block mb-3">
              {locale === "ar" ? "إجمالي المصاريف" : "TOTAL EXPENSES"}
            </span>
            <span className="text-xl font-black text-accent-orange leading-tight mb-2">
              {Math.round(totals.totalExpenses).toLocaleString()} {locale === "ar" ? "ج.م" : "EGP"}
            </span>
            <span className="text-3xs text-muted-text font-semibold">
              {locale === "ar" ? "شراء وتوريد" : "Brand procurement"}
            </span>
          </div>

          {/* Net Profits Card */}
          <div className="rounded-2xl border border-border-color bg-card-bg p-5 flex flex-col justify-between hover:border-success-green/30 transition-all duration-300 shadow-sm hover:shadow-md">
            <span className="text-3xs font-extrabold uppercase tracking-widest text-muted-text block mb-3">
              {locale === "ar" ? "صافي الأرباح" : "NET PROFITS"}
            </span>
            <span className={`text-xl font-black leading-tight mb-2 ${totals.netProfit >= 0 ? "text-success-green" : "text-red-500"}`}>
              {Math.round(totals.netProfit).toLocaleString()} {locale === "ar" ? "ج.م" : "EGP"}
            </span>
            <span className="text-3xs text-muted-text font-semibold">
              {locale === "ar" ? "المبيعات - المصاريف" : "Sales - Expenses"}
            </span>
          </div>

          {/* Active Orders Card */}
          <div className="rounded-2xl border border-border-color bg-card-bg p-5 flex flex-col justify-between hover:border-primary-coral/30 transition-all duration-300 shadow-sm hover:shadow-md">
            <span className="text-3xs font-extrabold uppercase tracking-widest text-muted-text block mb-3">
              {locale === "ar" ? "الطلبات النشطة" : "ACTIVE ORDERS"}
            </span>
            <span className="text-xl font-black text-white leading-tight mb-2">{totals.totalOrdersCount}</span>
            <span className="text-3xs text-primary-coral font-semibold">
              {totals.newOrders} {locale === "ar" ? "طلبات جديدة" : "New arrivals"}
            </span>
          </div>

          {/* Product Inventory Card */}
          <div className="rounded-2xl border border-border-color bg-card-bg p-5 flex flex-col justify-between hover:border-primary-coral/30 transition-all duration-300 shadow-sm hover:shadow-md">
            <span className="text-3xs font-extrabold uppercase tracking-widest text-muted-text block mb-3">
              {locale === "ar" ? "مخزون المنتجات" : "PRODUCT INVENTORY"}
            </span>
            <span className="text-xl font-black text-white leading-tight mb-2">{totals.totalProducts}</span>
            <span className="text-3xs text-muted-text font-semibold">
              {locale === "ar" ? "تركيبة علاجية" : "Formulations"}
            </span>
          </div>

          {/* Low Stock Warnings Card */}
          <div className="rounded-2xl border border-border-color bg-card-bg p-5 flex flex-col justify-between hover:border-accent-orange/30 transition-all duration-300 shadow-sm hover:shadow-md">
            <span className="text-3xs font-extrabold uppercase tracking-widest text-muted-text block mb-3">
              {locale === "ar" ? "تنبيهات المخزون" : "LOW STOCK WARNS"}
            </span>
            <span className={`text-xl font-black leading-tight mb-2 ${totals.lowStockProducts > 0 ? "text-accent-orange" : "text-success-green"}`}>
              {totals.lowStockProducts}
            </span>
            <span className="text-3xs text-muted-text font-semibold">
              {locale === "ar" ? "منتجات منخفضة/نافدة" : "Low/Out products"}
            </span>
          </div>

        </div>

        {/* Graphical representation bar & Low stock alert panel */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">

          {/* Sales vs Expenses Custom SVG Graph */}
          <div className="lg:col-span-8 rounded-2xl border border-border-color bg-card-bg p-7 shadow-sm">
            <h3 className={`text-sm font-black uppercase tracking-widest text-white mb-8 ${locale === "ar" ? "text-right" : ""}`}>
              {locale === "ar" ? "مخطط التوازن المالي" : "Financial Balance Chart"}
            </h3>

            {/* SVG Bar Chart */}
            <div className={`w-full h-72 relative flex items-end justify-between px-8 pt-6 border-b border-border-color pb-2 gap-8 ${
              locale === "ar" ? "flex-row-reverse" : ""
            }`}>
              {/* Background ticks */}
              <div className="absolute inset-0 flex flex-col justify-between py-6 pointer-events-none pr-8">
                <div className="border-b border-border-color/15 w-full" />
                <div className="border-b border-border-color/15 w-full" />
                <div className="border-b border-border-color/15 w-full" />
                <div className="border-b border-border-color/15 w-full" />
              </div>

              {/* Sales Column */}
              <div className="flex flex-col items-center gap-3 z-10 flex-1">
                <div
                  className="w-20 rounded-t-2xl bg-gradient-to-t from-primary-coral to-accent-orange shadow-[0_0_20px_rgba(255,138,117,0.25)] transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,138,117,0.35)]"
                  style={{ height: `${Math.min(200, (totals.totalSales / Math.max(1, totals.totalSales + totals.totalExpenses)) * 200)}px` }}
                />
                <span className="text-3xs font-black uppercase tracking-widest text-white">
                  {locale === "ar" ? "الإيرادات" : "REVENUES"}
                </span>
                <span className="text-xs font-extrabold text-primary-coral">
                  {Math.round(totals.totalSales).toLocaleString()} {locale === "ar" ? "ج.م" : "EGP"}
                </span>
              </div>

              {/* Expenses Column */}
              <div className="flex flex-col items-center gap-3 z-10 flex-1">
                <div
                  className="w-20 rounded-t-2xl bg-surface-sec border border-border-color transition-all duration-300 hover:border-border-color/60"
                  style={{ height: `${Math.min(200, (totals.totalExpenses / Math.max(1, totals.totalSales + totals.totalExpenses)) * 200)}px` }}
                />
                <span className="text-3xs font-black uppercase tracking-widest text-muted-text">
                  {locale === "ar" ? "المصاريف" : "EXPENSES"}
                </span>
                <span className="text-xs font-extrabold text-white">
                  {Math.round(totals.totalExpenses).toLocaleString()} {locale === "ar" ? "ج.م" : "EGP"}
                </span>
              </div>

              {/* Net Profit Column */}
              <div className="flex flex-col items-center gap-3 z-10 flex-1">
                <div
                  className={`w-20 rounded-t-2xl transition-all duration-300 ${totals.netProfit >= 0 ? "bg-[#10D981] shadow-[0_0_20px_rgba(16,217,129,0.25)] hover:shadow-[0_0_25px_rgba(16,217,129,0.35)]" : "bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.25)]"}`}
                  style={{ height: `${Math.min(200, (Math.abs(totals.netProfit) / Math.max(1, totals.totalSales + totals.totalExpenses)) * 200)}px` }}
                />
                <span className="text-3xs font-black uppercase tracking-widest text-white">
                  {locale === "ar" ? "صافي الربح" : "NET PROFIT"}
                </span>
                <span className="text-xs font-extrabold text-white">
                  {Math.round(totals.netProfit).toLocaleString()} {locale === "ar" ? "ج.م" : "EGP"}
                </span>
              </div>

            </div>
          </div>

          {/* Low Stock Warning Alert List */}
          <div className="lg:col-span-4 rounded-2xl border border-border-color bg-card-bg p-7 flex flex-col justify-between shadow-sm">
            <div>
              <h3 className={`text-sm font-black uppercase tracking-widest text-white mb-6 ${locale === "ar" ? "text-right" : ""}`}>
                {locale === "ar" ? "إنذارات المخزون" : "Stock Alarms"}
              </h3>
              <div className="flex flex-col gap-3">
                {products.filter((p) => p.stockStatus !== "In Stock").slice(0, 4).map((p) => (
                  <div key={p.id} className={`flex justify-between items-center bg-surface-deep border border-border-color/60 rounded-xl p-4 transition-all duration-200 hover:border-border-color/100 hover:bg-surface-deep/80 ${
                    locale === "ar" ? "flex-row-reverse" : ""
                  }`}>
                    <div className={locale === "ar" ? "text-right" : ""}>
                      <span className="block text-xs font-bold text-white truncate max-w-[140px] mb-1">
                        {locale === "ar" && p.name_ar ? p.name_ar : p.name}
                      </span>
                      <span className="text-3xs text-muted-text font-semibold">SKU: {p.sku}</span>
                    </div>
                    <span className={`text-3xs font-extrabold uppercase px-3 py-1 rounded-full transition-all duration-200 ${p.stock === 0 ? "bg-red-500/15 text-red-500 border border-red-500/20" : "bg-primary-coral/15 text-primary-coral border border-primary-coral/20"
                      }`}>
                      {p.stock === 0 
                        ? (locale === "ar" ? "نفد" : "OUT") 
                        : `${p.stock} ${locale === "ar" ? "متبقي" : "LEFT"}`
                      }
                    </span>
                  </div>
                ))}
                {products.filter((p) => p.stockStatus !== "In Stock").length === 0 && (
                  <div className="text-center text-sm text-muted-text py-12 uppercase font-semibold">
                    {locale === "ar" ? "جميع المنتجات متوفرة بأمان." : "All inventory stocked safely."}
                  </div>
                )}
              </div>
            </div>

            <Link
              href="/admin/products"
              className="mt-8 text-center text-xs font-extrabold uppercase tracking-widest text-primary-coral hover:text-white transition-colors duration-200 py-2"
            >
              {locale === "ar" ? "إدارة كتالوج المنتجات >" : "MANAGE PRODUCTS CATALOG >"}
            </Link>
          </div>

        </div>

        {/* Recent Orders List overview */}
        <div className="rounded-2xl border border-border-color bg-card-bg p-7 shadow-sm">
          <div className={`flex items-center justify-between border-b border-border-color pb-5 mb-6 ${
            locale === "ar" ? "flex-row-reverse" : ""
          }`}>
            <h3 className="text-sm font-black uppercase tracking-widest text-white">
              {locale === "ar" ? "المشتريات الأخيرة" : "Recent Purchases"}
            </h3>
            <Link
              href="/admin/orders"
              className="text-xs font-extrabold uppercase tracking-wide text-primary-coral hover:text-white transition-colors duration-200"
            >
              {locale === "ar" ? "عرض جميع الطلبات" : "View All Orders"}
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className={`w-full text-xs border-collapse ${locale === "ar" ? "text-right" : "text-left"}`}>
              <thead>
                <tr className={`border-b border-border-color text-muted-text uppercase tracking-wider font-semibold ${
                  locale === "ar" ? "flex-row-reverse" : ""
                }`}>
                  <th className="pb-4 font-extrabold text-left">{locale === "ar" ? "الطلب" : "Order"}</th>
                  <th className="pb-4 font-extrabold text-left">{locale === "ar" ? "العميل" : "Customer"}</th>
                  <th className="pb-4 font-extrabold text-left">{locale === "ar" ? "الإجمالي" : "Total"}</th>
                  <th className="pb-4 font-extrabold text-left">{locale === "ar" ? "طريقة الدفع" : "Payment"}</th>
                  <th className="pb-4 font-extrabold text-left">{locale === "ar" ? "الحالة" : "Status"}</th>
                  <th className="pb-4 font-extrabold text-left">{locale === "ar" ? "الإجراء" : "Action"}</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((ord) => (
                  <tr key={ord.id} className="border-b border-border-color/20 last:border-0 hover:bg-surface-sec/30 transition-colors duration-150">
                    <td className="py-4 font-bold text-white">{ord.id}</td>
                    <td className="py-4 text-white">{ord.customerName}</td>
                    <td className="py-4 text-primary-coral font-bold">
                      {Math.round(ord.totalPrice).toLocaleString()} {locale === "ar" ? "ج.م" : "EGP"}
                    </td>
                    <td className="py-4 uppercase text-sm">
                      {ord.paymentMethod === "Cash On Delivery" || ord.paymentMethod?.toLowerCase().includes("cash")
                        ? (locale === "ar" ? "الدفع عند الاستلام" : "Cash On Delivery")
                        : ord.paymentMethod === "Credit Card"
                          ? (locale === "ar" ? "بطاقة ائتمان" : "Credit Card")
                          : ord.paymentMethod === "PayPal"
                            ? (locale === "ar" ? "بايبال" : "PayPal")
                            : ord.paymentMethod
                      }
                    </td>
                    <td className="py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-3xs font-extrabold uppercase transition-all duration-200 ${ord.status === "Delivered"
                          ? "bg-success-green/15 text-success-green border border-success-green/30"
                          : ord.status === "Cancelled"
                            ? "bg-red-500/15 text-red-500 border border-red-500/30"
                            : "bg-primary-coral/15 text-primary-coral border border-primary-coral/30"
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
                                  ? (locale === "ar" ? "ملغى" : "Cancelled")
                                  : ord.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <button
                        onClick={() => setSelectedOrderDetails(ord)}
                        className="text-xs font-black uppercase text-primary-coral hover:text-white transition-colors duration-200"
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
