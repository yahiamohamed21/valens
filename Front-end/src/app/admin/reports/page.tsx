"use client";

import React, { useState, useMemo } from "react";
import { useApp } from "@/context/AppContext";
import { useAdminStats } from "@/app/admin/hooks/useAdminStats";

export default function AdminReportsPage() {
  const {
    orders,
    expenses,
    products,
    customers,
    returnsList,
    locale,
  } = useApp();

  // Reports Date Filters
  const [reportStartDate, setReportStartDate] = useState("2026-06-01");
  const [reportEndDate, setReportEndDate] = useState("2026-07-31");

  // Tab State
  const [activeTab, setActiveTab] = useState<"profit" | "sales" | "returns">("profit");

  // Filter orders and expenses by date range
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const orderDateStr = o.orderDate.split("T")[0]; // YYYY-MM-DD
      return orderDateStr >= reportStartDate && orderDateStr <= reportEndDate;
    });
  }, [orders, reportStartDate, reportEndDate]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      const expenseDateStr = e.date.split("T")[0]; // YYYY-MM-DD
      return expenseDateStr >= reportStartDate && expenseDateStr <= reportEndDate;
    });
  }, [expenses, reportStartDate, reportEndDate]);

  const filteredReturns = useMemo(() => {
    return returnsList.filter((ret) => {
      const dateStr = ret.returnDate.split("T")[0];
      return dateStr >= reportStartDate && dateStr <= reportEndDate;
    });
  }, [returnsList, reportStartDate, reportEndDate]);

  // Compute stats on filtered datasets
  const { totals, expensesByCategory } = useAdminStats(
    filteredOrders,
    filteredExpenses,
    products,
    customers
  );

  // Chronological transaction ledger (Sales & Expenses)
  const cashflowLedger = useMemo(() => {
    const ledger: {
      id: string;
      date: string;
      type: "Sale" | "Expense" | "Return";
      description: string;
      amount: number;
    }[] = [];

    // Add sales
    filteredOrders.forEach((o) => {
      if (o.status === "Delivered" || o.status === "Returned") {
        ledger.push({
          id: o.id,
          date: o.orderDate.split("T")[0],
          type: "Sale",
          description: `Order from ${o.customerName}`,
          amount: o.totalPrice,
        });
      }
    });

    // Add returns
    filteredReturns.forEach((ret) => {
      ledger.push({
        id: ret.id,
        date: ret.returnDate.split("T")[0],
        type: "Return",
        description: `Returned Order ${ret.orderNumber}: ${ret.returnedFormulations}`,
        amount: -ret.refundAmount,
      });
    });

    // Add expenses
    filteredExpenses.forEach((e) => {
      ledger.push({
        id: e.id,
        date: e.date.split("T")[0],
        type: "Expense",
        description: `${e.category}: ${e.title}`,
        amount: -e.amount,
      });
    });

    // Sort chronologically
    return ledger.sort((a, b) => b.date.localeCompare(a.date));
  }, [filteredOrders, filteredExpenses, filteredReturns]);

  // Sales Ledger statistics
  const salesTotals = useMemo(() => {
    let subtotal = 0;
    let discount = 0;
    let shipping = 0;
    let total = 0;

    filteredOrders.forEach((o) => {
      if (o.status === "Delivered" || o.status === "Returned") {
        const orderSubtotal =
          o.couponTotalBeforeDiscount !== undefined
            ? o.couponTotalBeforeDiscount
            : (o.totalPrice + o.discountAmount - o.shippingCost);
        subtotal += orderSubtotal;
        discount += o.discountAmount;
        shipping += o.shippingCost;
        total += o.totalPrice;
      }
    });

    return { subtotal, discount, shipping, total };
  }, [filteredOrders]);

  // Returns Ledger statistics
  const returnsTotals = useMemo(() => {
    return filteredReturns.reduce((acc, ret) => acc + ret.refundAmount, 0);
  }, [filteredReturns]);

  return (
    <div className={`flex flex-col gap-6 ${locale === "ar" ? "text-right" : "text-left"}`}>
      {/* Date Filters bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border-color pb-4">
        <span className="text-xs font-bold text-white uppercase tracking-wider font-semibold">
          {locale === "ar" ? "التقارير المالية والتحليلات" : "Valens Diagnostic Ledgers"}
        </span>

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

      {/* Tabs */}
      <div className="flex border-b border-border-color gap-4">
        <button
          onClick={() => setActiveTab("profit")}
          className={`pb-3 text-xs font-black uppercase tracking-widest cursor-pointer transition-all ${
            activeTab === "profit"
              ? "text-primary-coral border-b-2 border-primary-coral"
              : "text-muted-text hover:text-white"
          }`}
        >
          {locale === "ar" ? "الأرباح والمصاريف" : "Profit & Cashflow"}
        </button>
        <button
          onClick={() => setActiveTab("sales")}
          className={`pb-3 text-xs font-black uppercase tracking-widest cursor-pointer transition-all ${
            activeTab === "sales"
              ? "text-primary-coral border-b-2 border-primary-coral"
              : "text-muted-text hover:text-white"
          }`}
        >
          {locale === "ar" ? "دفتر المبيعات" : "Sales Ledger"}
        </button>
        <button
          onClick={() => setActiveTab("returns")}
          className={`pb-3 text-xs font-black uppercase tracking-widest cursor-pointer transition-all ${
            activeTab === "returns"
              ? "text-primary-coral border-b-2 border-primary-coral"
              : "text-muted-text hover:text-white"
          }`}
        >
          {locale === "ar" ? "دفتر المرتجعات" : "Returns Ledger"}
        </button>
      </div>

      {/* Dynamic Content */}
      {activeTab === "profit" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Profit calculations breakdowns */}
          <div className="rounded-2xl border border-border-color bg-card-bg p-6 flex flex-col gap-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-white border-b border-border-color pb-3">
              {locale === "ar" ? "حسابات صافي الأرباح" : "Net Profit Ledger"}
            </h3>

            <div className="flex justify-between items-center text-xs text-white border-b border-border-color/30 pb-3">
              <span>{locale === "ar" ? "إجمالي مبيعات المنتجات (Gross)" : "Gross Sales Revenues"}</span>
              <span className="font-extrabold text-white">{Math.round(totals.grossSales).toLocaleString()} EGP</span>
            </div>

            <div className="flex justify-between items-center text-xs text-white border-b border-border-color/30 pb-3">
              <span>{locale === "ar" ? "إجمالي المرتجعات المستردة" : "Returned Orders Value"}</span>
              <span className="font-extrabold text-red-500">-{Math.round(totals.returnedOrdersValue).toLocaleString()} EGP</span>
            </div>

            <div className="flex justify-between items-center text-xs text-white border-b border-border-color/30 pb-3">
              <span>{locale === "ar" ? "صافي قيمة المبيعات" : "Net Sales Revenues"}</span>
              <span className="font-extrabold text-success-green">{Math.round(totals.netSales).toLocaleString()} EGP</span>
            </div>

            <div className="flex justify-between items-center text-xs text-white border-b border-border-color/30 pb-3">
              <span>{locale === "ar" ? "المصاريف التشغيلية" : "Operational Expenses"}</span>
              <span className="font-extrabold text-accent-orange">-{Math.round(totals.totalExpenses).toLocaleString()} EGP</span>
            </div>

            <div className="flex justify-between items-center text-sm font-black uppercase tracking-wider py-2">
              <span>{locale === "ar" ? "صافي الربح الفعلي" : "Real Net Profit"}</span>
              <span className={`text-lg font-black ${totals.netProfit >= 0 ? "text-success-green" : "text-red-500"}`}>
                {Math.round(totals.netProfit).toLocaleString()} EGP
              </span>
            </div>

            <div className="bg-surface-deep rounded-xl p-4 border border-border-color mt-2 flex flex-col gap-2">
              <span className="text-4xs font-extrabold uppercase tracking-widest text-muted-text">
                {locale === "ar" ? "نسبة هامش الربح" : "PROFIT MARGIN RATIO"}
              </span>
              <span className="text-xl font-black text-white">
                {totals.netSales > 0 ? `${((totals.netProfit / totals.netSales) * 100).toFixed(1)}%` : "0.0%"}
              </span>
            </div>
          </div>

          {/* Expense allocations graph classifications */}
          <div className="rounded-2xl border border-border-color bg-card-bg p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-white border-b border-border-color pb-3 mb-4">
                {locale === "ar" ? "توزيع المصاريف حسب الفئة" : "Expenses Allocations by Category"}
              </h3>
              <div className="flex flex-col gap-3 max-h-56 overflow-y-auto pr-1">
                {expensesByCategory.map(([category, amount]) => (
                  <div key={category} className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-3xs font-bold text-white uppercase">
                      <span>{category}</span>
                      <span>
                        {Math.round(amount).toLocaleString()} EGP (
                        {((amount / Math.max(1, totals.totalExpenses)) * 100).toFixed(0)}%)
                      </span>
                    </div>
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
                    {locale === "ar" ? "لا توجد مصاريف مسجلة" : "No expense logs written yet."}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Chronological Transaction Cashflow Ledger */}
          <div className="lg:col-span-2 rounded-2xl border border-border-color bg-card-bg p-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-white border-b border-border-color pb-3 mb-4">
              {locale === "ar" ? "سجل المعاملات والتدفق النقدي" : "Cashflow Transaction History"}
            </h3>
            <div className="overflow-hidden rounded-xl border border-border-color/30">
              <div className="max-h-80 overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border-color bg-surface-deep/40 text-muted-text uppercase tracking-wider">
                      <th className="p-3 font-extrabold">{locale === "ar" ? "التاريخ" : "Date"}</th>
                      <th className="p-3 font-extrabold">{locale === "ar" ? "النوع" : "Type"}</th>
                      <th className="p-3 font-extrabold">{locale === "ar" ? "المعاملة" : "Transaction Ledger"}</th>
                      <th className="p-3 font-extrabold text-right">{locale === "ar" ? "المبلغ" : "Net Flow"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cashflowLedger.map((tx) => (
                      <tr
                        key={tx.id}
                        className="border-b border-border-color/20 last:border-0 hover:bg-surface-deep/20 text-white"
                      >
                        <td className="p-3 text-3xs text-muted-text">
                          {new Date(tx.date).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
                            dateStyle: "medium",
                          })}
                        </td>
                        <td className="p-3">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-4xs font-extrabold uppercase ${
                              tx.type === "Sale"
                                ? "bg-success-green/10 text-success-green border border-success-green/20"
                                : tx.type === "Return"
                                ? "bg-red-500/10 text-red-500 border border-red-500/20"
                                : "bg-accent-orange/10 text-accent-orange border border-accent-orange/20"
                            }`}
                          >
                            {tx.type}
                          </span>
                        </td>
                        <td className="p-3 font-semibold text-white">{tx.description}</td>
                        <td
                          className={`p-3 text-right font-black ${
                            tx.amount >= 0 ? "text-success-green" : "text-red-500"
                          }`}
                        >
                          {tx.amount >= 0 ? "+" : ""}
                          {Math.round(tx.amount).toLocaleString()} EGP
                        </td>
                      </tr>
                    ))}
                    {cashflowLedger.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-12 text-center text-xs text-muted-text font-bold uppercase">
                          {locale === "ar" ? "لا توجد معاملات في هذه الفترة" : "No cashflow transactions recorded in this date range."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "sales" && (
        <div className="rounded-2xl border border-border-color bg-card-bg p-6 flex flex-col gap-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-white border-b border-border-color pb-3">
            {locale === "ar" ? "تقرير المبيعات التفصيلي" : "Sales Report Ledger"}
          </h3>
          <div className="overflow-x-auto rounded-xl border border-border-color/30">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border-color bg-surface-deep/40 text-muted-text uppercase tracking-wider">
                  <th className="p-3 font-extrabold">{locale === "ar" ? "رقم الطلب" : "Order Number"}</th>
                  <th className="p-3 font-extrabold">{locale === "ar" ? "التاريخ" : "Date"}</th>
                  <th className="p-3 font-extrabold">{locale === "ar" ? "العميل" : "Customer"}</th>
                  <th className="p-3 font-extrabold text-center">{locale === "ar" ? "الكمية" : "Items Qty"}</th>
                  <th className="p-3 font-extrabold text-right">{locale === "ar" ? "الإجمالي قبل الخصم" : "Gross Subtotal"}</th>
                  <th className="p-3 font-extrabold text-right">{locale === "ar" ? "الخصم" : "Discount"}</th>
                  <th className="p-3 font-extrabold text-right">{locale === "ar" ? "الشحن" : "Shipping"}</th>
                  <th className="p-3 font-extrabold text-right">{locale === "ar" ? "المدفوع" : "Charged Total"}</th>
                  <th className="p-3 font-extrabold text-center">{locale === "ar" ? "الكود" : "Coupon"}</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders
                  .filter((o) => o.status === "Delivered" || o.status === "Returned")
                  .map((ord) => {
                    const grossSub =
                      ord.couponTotalBeforeDiscount !== undefined
                        ? ord.couponTotalBeforeDiscount
                        : (ord.totalPrice + ord.discountAmount - ord.shippingCost);
                    const qty = ord.items.reduce((sum, item) => sum + item.quantity, 0);

                    return (
                      <tr
                        key={ord.id}
                        className="border-b border-border-color/20 last:border-0 hover:bg-surface-deep/20 text-white"
                      >
                        <td className="p-3 font-bold">{ord.orderName}</td>
                        <td className="p-3 text-3xs text-muted-text">
                          {new Date(ord.orderDate).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
                            dateStyle: "medium",
                          })}
                        </td>
                        <td className="p-3 font-semibold">{ord.customerName}</td>
                        <td className="p-3 text-center">{qty}</td>
                        <td className="p-3 text-right">
                          {Math.round(grossSub).toLocaleString()} EGP
                        </td>
                        <td className="p-3 text-right text-accent-orange font-semibold">
                          {ord.discountAmount > 0 ? `-${Math.round(ord.discountAmount).toLocaleString()} EGP` : "—"}
                        </td>
                        <td className="p-3 text-right text-muted-text">
                          {ord.shippingCost > 0 ? `${Math.round(ord.shippingCost).toLocaleString()} EGP` : "FREE"}
                        </td>
                        <td className="p-3 text-right font-black text-primary-coral">
                          {Math.round(ord.totalPrice).toLocaleString()} EGP
                        </td>
                        <td className="p-3 text-center font-mono font-bold text-muted-text">
                          {ord.couponCode || "—"}
                        </td>
                      </tr>
                    );
                  })}
                {filteredOrders.filter((o) => o.status === "Delivered" || o.status === "Returned").length === 0 && (
                  <tr>
                    <td colSpan={9} className="p-12 text-center text-xs text-muted-text font-bold uppercase">
                      {locale === "ar" ? "لا توجد مبيعات في هذه الفترة" : "No delivered sales recorded in this date range."}
                    </td>
                  </tr>
                )}
              </tbody>
              {filteredOrders.filter((o) => o.status === "Delivered" || o.status === "Returned").length > 0 && (
                <tfoot>
                  <tr className="bg-surface-deep/60 text-white font-black text-xs border-t border-border-color uppercase">
                    <td colSpan={3} className="p-3">{locale === "ar" ? "المجموع" : "Cumulative Totals"}</td>
                    <td className="p-3 text-center">
                      {filteredOrders
                        .filter((o) => o.status === "Delivered" || o.status === "Returned")
                        .reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0)}
                    </td>
                    <td className="p-3 text-right">
                      {Math.round(salesTotals.subtotal).toLocaleString()} EGP
                    </td>
                    <td className="p-3 text-right text-accent-orange">
                      -{Math.round(salesTotals.discount).toLocaleString()} EGP
                    </td>
                    <td className="p-3 text-right">
                      {Math.round(salesTotals.shipping).toLocaleString()} EGP
                    </td>
                    <td className="p-3 text-right text-primary-coral text-sm">
                      {Math.round(salesTotals.total).toLocaleString()} EGP
                    </td>
                    <td className="p-3"></td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      )}

      {activeTab === "returns" && (
        <div className="rounded-2xl border border-border-color bg-card-bg p-6 flex flex-col gap-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-white border-b border-border-color pb-3">
            {locale === "ar" ? "تقرير المرتجعات والتسويات" : "Returns & Refund Ledger"}
          </h3>
          <div className="overflow-x-auto rounded-xl border border-border-color/30">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border-color bg-surface-deep/40 text-muted-text uppercase tracking-wider">
                  <th className="p-3 font-extrabold">{locale === "ar" ? "رقم الطلب" : "Order Number"}</th>
                  <th className="p-3 font-extrabold">{locale === "ar" ? "تاريخ الارتجاع" : "Return Date"}</th>
                  <th className="p-3 font-extrabold">{locale === "ar" ? "العميل" : "Customer"}</th>
                  <th className="p-3 font-extrabold">{locale === "ar" ? "المنتجات المرتجعة" : "Returned Formulations"}</th>
                  <th className="p-3 font-extrabold">{locale === "ar" ? "السبب" : "Return Reason"}</th>
                  <th className="p-3 font-extrabold text-center">{locale === "ar" ? "المخزون" : "Restored?"}</th>
                  <th className="p-3 font-extrabold text-right">{locale === "ar" ? "المبلغ المسترد" : "Refund Paid"}</th>
                  <th className="p-3 font-extrabold">{locale === "ar" ? "ملاحظات" : "Notes"}</th>
                </tr>
              </thead>
              <tbody>
                {filteredReturns.map((ret) => {
                  const returnDateStr = new Date(ret.returnDate).toLocaleDateString(
                    locale === "ar" ? "ar-EG" : "en-US",
                    { dateStyle: "medium" }
                  );

                  return (
                    <tr
                      key={ret.id}
                      className="border-b border-border-color/20 last:border-0 hover:bg-surface-deep/20 text-white"
                    >
                      <td className="p-3 font-bold">{ret.orderNumber || ret.id}</td>
                      <td className="p-3 text-3xs text-muted-text">{returnDateStr}</td>
                      <td className="p-3 font-semibold">{ret.customerName}</td>
                      <td className="p-3 text-3xs truncate max-w-[180px]" title={ret.returnedFormulations}>
                        {ret.returnedFormulations}
                      </td>
                      <td className="p-3 text-3xs text-white">{ret.returnReason || "Dissatisfied"}</td>
                      <td className="p-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-4xs font-extrabold ${
                            ret.isRestoredToStock
                              ? "bg-success-green/10 text-success-green"
                              : "bg-surface-deep text-muted-text"
                          }`}
                        >
                          {ret.isRestoredToStock ? (locale === "ar" ? "نعم" : "YES") : (locale === "ar" ? "لا" : "NO")}
                        </span>
                      </td>
                      <td className="p-3 text-right font-black text-red-500">
                        -{Math.round(ret.refundAmount).toLocaleString()} EGP
                      </td>
                      <td className="p-3 text-3xs text-muted-text max-w-[120px] truncate" title={ret.notes}>
                        {ret.notes || "—"}
                      </td>
                    </tr>
                  );
                })}
                {filteredReturns.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-12 text-center text-xs text-muted-text font-bold uppercase">
                      {locale === "ar" ? "لا توجد مرتجعات في هذه الفترة" : "No returns or refunds logged in this date range."}
                    </td>
                  </tr>
                )}
              </tbody>
              {filteredReturns.length > 0 && (
                <tfoot>
                  <tr className="bg-surface-deep/60 text-white font-black text-xs border-t border-border-color uppercase">
                    <td colSpan={6} className="p-3">
                      {locale === "ar" ? "إجمالي الترجيع" : "Total Refunded Amount"} (
                      {filteredReturns.length} {locale === "ar" ? "طلب" : "orders"})
                    </td>
                    <td className="p-3 text-right text-red-500 text-sm">
                      -{Math.round(returnsTotals).toLocaleString()} EGP
                    </td>
                    <td className="p-3"></td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      )}
    </div>
  );
}