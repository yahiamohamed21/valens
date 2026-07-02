import React from "react";
import { Coupon, Order } from "@/types/store";
import { Icon } from "@/components/SvgIcons";

interface CouponDetailsModalProps {
  coupon: Coupon;
  orders: Order[];
  onClose: () => void;
  locale: "en" | "ar";
}

export const CouponDetailsModal: React.FC<CouponDetailsModalProps> = ({
  coupon,
  orders,
  onClose,
  locale,
}) => {
  // Filter all orders that used this coupon code
  const couponOrders = orders.filter(
    (o) => o.couponCode?.toUpperCase() === coupon.code.toUpperCase()
  );

  const totalUsage = couponOrders.length;

  // Completed (Delivered) orders using this coupon
  const completedOrders = couponOrders.filter((o) => o.status === "Delivered");
  const completedCount = completedOrders.length;

  // Returned orders using this coupon
  const returnedOrders = couponOrders.filter((o) => o.status === "Returned");
  const returnedCount = returnedOrders.length;

  // Revenue calculations - only completed delivered orders
  const totalGrossSales = completedOrders.reduce((acc, o) => {
    const beforeDiscount =
      o.couponTotalBeforeDiscount !== undefined
        ? o.couponTotalBeforeDiscount
        : (o.totalPrice + o.discountAmount - o.shippingCost);
    return acc + beforeDiscount;
  }, 0);

  const totalDiscount = completedOrders.reduce((acc, o) => acc + o.discountAmount, 0);

  const totalNetSales = completedOrders.reduce((acc, o) => acc + o.totalPrice, 0);

  const averageOrderValue = completedCount > 0 ? totalNetSales / completedCount : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
      <div className="w-full max-w-4xl rounded-3xl border border-border-color bg-card-bg p-6 shadow-2xl glass-panel animate-slide-in relative text-left">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-text hover:text-gray-800 cursor-pointer animate-luxury"
        >
          <Icon name="close" size={20} />
        </button>

        <div className="border-b border-border-color pb-3 mb-5">
          <h2 className="text-base font-black uppercase tracking-wider text-white">
            {locale === "ar" ? "تفاصيل الكوبون والتحليلات" : "Coupon Analytics & Ledger"}:{" "}
            <span className="text-primary-coral font-mono">{coupon.code}</span>
          </h2>
          <p className="text-3xs text-muted-text mt-1">
            {locale === "ar"
              ? "تحليلات المبيعات والإيرادات وقائمة الطلبات التي استخدمت هذا الكود."
              : "Financial metrics and customer orders utilizing this promotional code."}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-6">
          <div className="rounded-2xl border border-border-color bg-surface-deep/40 p-4">
            <span className="text-4xs font-extrabold uppercase tracking-widest text-muted-text block">
              {locale === "ar" ? "إجمالي الاستخدام" : "TOTAL USAGES"}
            </span>
            <span className="mt-1 text-lg font-black text-white">{totalUsage}</span>
            <span className="text-4xs text-muted-text block mt-0.5">
              {completedCount} {locale === "ar" ? "مكتملة" : "completed"} • {returnedCount}{" "}
              {locale === "ar" ? "مرتجعة" : "returned"}
            </span>
          </div>

          <div className="rounded-2xl border border-border-color bg-surface-deep/40 p-4">
            <span className="text-4xs font-extrabold uppercase tracking-widest text-muted-text block">
              {locale === "ar" ? "إجمالي المبيعات" : "GROSS SALES"}
            </span>
            <span className="mt-1 text-lg font-black text-white">
              {Math.round(totalGrossSales).toLocaleString()} {locale === "ar" ? "ج.م" : "EGP"}
            </span>
            <span className="text-4xs text-success-green block mt-0.5">
              {locale === "ar" ? "قبل خصم الكوبونات" : "Before discount applied"}
            </span>
          </div>

          <div className="rounded-2xl border border-border-color bg-surface-deep/40 p-4">
            <span className="text-4xs font-extrabold uppercase tracking-widest text-muted-text block">
              {locale === "ar" ? "الخصم الممنوح" : "DISCOUNT GIVEN"}
            </span>
            <span className="mt-1 text-lg font-black text-accent-orange">
              {Math.round(totalDiscount).toLocaleString()} {locale === "ar" ? "ج.م" : "EGP"}
            </span>
            <span className="text-4xs text-muted-text block mt-0.5">
              {locale === "ar" ? "قيمة الخصومات الإجمالية" : "Accumulated discount value"}
            </span>
          </div>

          <div className="rounded-2xl border border-border-color bg-surface-deep/40 p-4">
            <span className="text-4xs font-extrabold uppercase tracking-widest text-muted-text block">
              {locale === "ar" ? "صافي الإيرادات" : "NET REVENUE"}
            </span>
            <span className="mt-1 text-lg font-black text-success-green">
              {Math.round(totalNetSales).toLocaleString()} {locale === "ar" ? "ج.م" : "EGP"}
            </span>
            <span className="text-4xs text-muted-text block mt-0.5">
              Avg: {Math.round(averageOrderValue).toLocaleString()} {locale === "ar" ? "ج.م" : "EGP"} / {locale === "ar" ? "طلب" : "order"}
            </span>
          </div>
        </div>

        {/* Orders List Table */}
        <h3 className="text-xs font-black uppercase tracking-widest text-white mb-3">
          {locale === "ar" ? "قائمة طلبات الكوبون" : "Orders Using This Coupon"}
        </h3>
        <div className="rounded-2xl border border-border-color bg-surface-deep/20 overflow-hidden">
          <div className="max-h-72 overflow-y-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border-color bg-surface-deep/60 text-muted-text uppercase tracking-wider">
                  <th className="p-3 font-extrabold">{locale === "ar" ? "رقم الطلب" : "Order Number"}</th>
                  <th className="p-3 font-extrabold">{locale === "ar" ? "العميل" : "Customer"}</th>
                  <th className="p-3 font-extrabold">{locale === "ar" ? "الهاتف" : "Phone"}</th>
                  <th className="p-3 font-extrabold">{locale === "ar" ? "التاريخ" : "Date"}</th>
                  <th className="p-3 font-extrabold text-right">{locale === "ar" ? "الإجمالي" : "Gross Total"}</th>
                  <th className="p-3 font-extrabold text-right">{locale === "ar" ? "الخصم" : "Discount"}</th>
                  <th className="p-3 font-extrabold text-right">{locale === "ar" ? "المدفوع" : "Paid Amount"}</th>
                  <th className="p-3 font-extrabold text-center">{locale === "ar" ? "الحالة" : "Status"}</th>
                </tr>
              </thead>
              <tbody>
                {couponOrders.map((ord) => {
                  const grossTotal =
                    ord.couponTotalBeforeDiscount !== undefined
                      ? ord.couponTotalBeforeDiscount
                      : (ord.totalPrice + ord.discountAmount - ord.shippingCost);
                  return (
                    <tr
                      key={ord.id}
                      className="border-b border-border-color/30 last:border-0 hover:bg-surface-deep/40 text-white"
                    >
                      <td className="p-3 font-bold">{ord.orderName}</td>
                      <td className="p-3">{ord.customerName}</td>
                      <td className="p-3 text-muted-text">{ord.customerPhone}</td>
                      <td className="p-3 text-3xs text-muted-text">
                        {new Date(ord.orderDate).toLocaleDateString(
                          locale === "ar" ? "ar-EG" : "en-US",
                          { dateStyle: "medium" }
                        )}
                      </td>
                      <td className="p-3 text-right font-bold">
                        {Math.round(grossTotal).toLocaleString()} {locale === "ar" ? "ج" : "EGP"}
                      </td>
                      <td className="p-3 text-right text-accent-orange font-bold">
                        -{Math.round(ord.discountAmount).toLocaleString()} {locale === "ar" ? "ج" : "EGP"}
                      </td>
                      <td className="p-3 text-right text-primary-coral font-bold">
                        {Math.round(ord.totalPrice).toLocaleString()} {locale === "ar" ? "ج" : "EGP"}
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-4xs font-extrabold uppercase ${ord.status === "Delivered"
                              ? "bg-success-green/10 text-success-green border border-success-green/20"
                              : ord.status === "Returned"
                                ? "bg-red-500/10 text-red-500 border border-red-500/20"
                                : "bg-primary-coral/10 text-primary-coral border border-primary-coral/20"
                            }`}
                        >
                          {ord.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {couponOrders.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-12 text-center text-xs text-muted-text font-bold uppercase">
                      {locale === "ar" ? "لا توجد طلبات مسجلة لهذا الكوبون بعد." : "No orders found using this coupon code."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 border-t border-border-color pt-4">
          <button
            onClick={onClose}
            className="rounded-full border border-border-color bg-surface-deep px-6 py-2.5 text-2xs font-extrabold text-[#180f0d] dark:text-white hover:bg-white hover:text-[#180f0d] transition-all duration-300 cursor-pointer uppercase"
          >
            {locale === "ar" ? "إغلاق Ledger" : "Close Ledger"}
          </button>
        </div>
      </div>
    </div>
  );
};
