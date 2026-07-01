"use client";

import React, { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import { api, mapApiCustomerToClient, mapApiOrderToClient } from "@/lib/api";
import { Icon } from "@/components/SvgIcons";

export default function AdminCustomersPage() {
  const { customers, orders, fetchAdminData, locale } = useApp();

  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [customerDetails, setCustomerDetails] = useState<any | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  const handleViewCustomerDetails = async (id: string) => {
    setSelectedCustomerId(id);
    setDetailsLoading(true);
    try {
      const data = await api.customers.detailAdmin(id);
      if (data && typeof data === "object" && "customer" in data) {
        const rawCustomer = (data as any).customer;
        const rawOrders = (data as any).orders || [];
        
        const mappedCustomer = mapApiCustomerToClient(rawCustomer);
        // Safely extract orders
        const mappedOrders = Array.isArray(rawOrders) 
          ? rawOrders.map(mapApiOrderToClient) 
          : typeof rawOrders === "object" && rawOrders !== null && Array.isArray((rawOrders as any).$values)
            ? (rawOrders as any).$values.map(mapApiOrderToClient)
            : [];
        
        setCustomerDetails({
          ...mappedCustomer,
          orderCount: mappedOrders.length || mappedCustomer.orderCount,
          totalSpent: mappedOrders.length > 0 
            ? mappedOrders.reduce((sum: number, o: any) => sum + (o.totalPrice || 0), 0)
            : mappedCustomer.totalSpent,
          orders: mappedOrders
        });
      } else {
        const mappedCustomer = mapApiCustomerToClient(data as any);
        setCustomerDetails({
          ...mappedCustomer,
          orders: []
        });
      }
    } catch (err) {
      console.error("Failed to load customer details:", err);
      // fallback to basic local info
      const basic = customers.find(c => c.id === id);
      setCustomerDetails(basic ? { ...basic, orders: [] } : null);
    } finally {
      setDetailsLoading(false);
    }
  };

  return (
    <div className={`flex flex-col gap-6 ${locale === "ar" ? "text-right" : "text-left"}`}>
      <div className="border-b border-border-color pb-4">
        <span className="text-xs font-bold text-white uppercase font-semibold">
          {locale === "ar" ? "دفتر العملاء النشطين" : "Active Client Base"}
        </span>
      </div>

      <div className="rounded-2xl border border-border-color bg-card-bg p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border-color text-muted-text uppercase tracking-wider">
                <th className="pb-3 font-extrabold">{locale === "ar" ? "اسم العميل" : "Customer Name"}</th>
                <th className="pb-3 font-extrabold">{locale === "ar" ? "بيانات التواصل" : "Contact Info"}</th>
                <th className="pb-3 font-extrabold">{locale === "ar" ? "عنوان التوصيل" : "Delivery Base"}</th>
                <th className="pb-3 font-extrabold">{locale === "ar" ? "عدد الطلبات" : "Order Count"}</th>
                <th className="pb-3 font-extrabold">{locale === "ar" ? "إجمالي ما تم إنفاقه" : "Total stack Spent"}</th>
                <th className="pb-3 font-extrabold">{locale === "ar" ? "تاريخ الانضمام" : "Join Date"}</th>
                <th className="pb-3 font-extrabold text-right">{locale === "ar" ? "إجراءات" : "Actions"}</th>
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
                      {cust.name || (locale === "ar" ? "بدون اسم" : "No Name")}
                    </td>
                    <td className="py-3.5">
                      <div>
                        <span className="block font-medium text-white">{cust.email}</span>
                        <span className="text-3xs text-muted-text">{cust.phone}</span>
                      </div>
                    </td>
                    <td className="py-3.5 text-muted-text max-w-xs truncate">{cust.address}, {cust.city}</td>
                    <td className="py-3.5 font-bold">{orderCount} {locale === "ar" ? "طلبات" : "Orders"}</td>
                    <td className="py-3.5 text-primary-coral font-bold">
                      {Math.round(totalSpent).toLocaleString()} {locale === "ar" ? "ج.م" : "EGP"}
                    </td>
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
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => handleViewCustomerDetails(cust.id)}
                        className="rounded-lg border border-border-color bg-surface-deep px-3 py-1.5 text-2xs font-extrabold text-white hover:text-primary-coral transition-all duration-300"
                      >
                        {locale === "ar" ? "تفاصيل" : "View Details"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Details Modal */}
      {selectedCustomerId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-3xl border border-border-color bg-card-bg p-6 shadow-2xl glass-panel relative animate-slide-up">
            <button
              onClick={() => {
                setSelectedCustomerId(null);
                setCustomerDetails(null);
              }}
              className="absolute right-4 top-4 text-muted-text hover:text-white"
            >
              <Icon name="close" size={20} />
            </button>

            <h2 className="text-base font-black uppercase tracking-wider text-white border-b border-border-color pb-3 mb-5 flex items-center gap-2">
              <Icon name="user" size={18} className="text-primary-coral" />
              Customer Profile Ledger
            </h2>

            {detailsLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-primary-coral border-r-2 mb-3"></div>
                <span className="text-3xs uppercase tracking-widest text-muted-text font-bold">
                  {locale === "ar" ? "جاري استرداد السجلات..." : "Retrieving records..."}
                </span>
              </div>
            ) : customerDetails ? (
              <div className="flex flex-col gap-4 text-xs">
                <div className={`flex items-center gap-4 border-b border-border-color/30 pb-4 ${locale === "ar" ? "flex-row-reverse" : ""}`}>
                  <div className="h-12 w-12 rounded-full bg-primary-coral/10 border border-primary-coral/30 flex items-center justify-center text-primary-coral font-bold text-lg uppercase shrink-0">
                    {customerDetails.name ? customerDetails.name[0] : "?"}
                  </div>
                  <div className={locale === "ar" ? "text-right" : "text-left"}>
                    <span className="text-sm font-black text-white block">{customerDetails.name}</span>
                    <span className="text-3xs text-muted-text uppercase font-semibold">
                      {locale === "ar" ? "انضم: " : "Joined: "}
                      {(() => {
                        const d = customerDetails.joinDate;
                        if (!d) return "N/A";
                        try {
                          return new Date(d).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric"
                          });
                        } catch {
                          return d;
                        }
                      })()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  <div className="col-span-2">
                    <span className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-1">
                      {locale === "ar" ? "البريد الإلكتروني" : "Email Address"}
                    </span>
                    <span className="font-bold text-white block truncate text-left">{customerDetails.email}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-1">
                      {locale === "ar" ? "رقم الهاتف" : "Phone Contact"}
                    </span>
                    <span className="font-bold text-white block">{customerDetails.phone || "N/A"}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-1">
                      {locale === "ar" ? "المحافظة / المدينة" : "Base Governorate/City"}
                    </span>
                    <span className="font-bold text-white block">{customerDetails.city || "N/A"}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-1">
                      {locale === "ar" ? "عنوان التوصيل" : "Delivery Address"}
                    </span>
                    <span className="font-bold text-white block leading-relaxed">{customerDetails.address || "N/A"}</span>
                  </div>
                  <div className="rounded-xl border border-border-color/30 bg-surface-deep/45 p-3 text-center">
                    <span className="block text-4xs font-bold text-muted-text uppercase tracking-wider">
                      {locale === "ar" ? "الطلبات المسجلة" : "Orders Stacked"}
                    </span>
                    <span className="block text-base font-black text-white mt-1">{customerDetails.orderCount || 0}</span>
                  </div>
                  <div className="rounded-xl border border-border-color/30 bg-surface-deep/45 p-3 text-center">
                    <span className="block text-4xs font-bold text-muted-text uppercase tracking-wider">
                      {locale === "ar" ? "إجمالي الإنفاق" : "Total Spent"}
                    </span>
                    <span className="block text-base font-black text-primary-coral mt-1">{Math.round(customerDetails.totalSpent || 0).toLocaleString()} EGP</span>
                  </div>

                  {/* Customer Orders History scrollable section */}
                  {customerDetails.orders && customerDetails.orders.length > 0 && (
                    <div className="col-span-2 border-t border-border-color/30 pt-3 mt-1 flex flex-col gap-2">
                      <span className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text">
                        {locale === "ar" ? "سجل الطلبات" : "Order History"}
                      </span>
                      <div className="flex flex-col gap-2 max-h-36 overflow-y-auto pr-1">
                        {customerDetails.orders.map((o: any) => (
                          <div key={o.id} className="flex justify-between items-center rounded-xl border border-border-color/20 bg-surface-deep/30 p-2 text-3xs">
                            <div className={locale === "ar" ? "text-right" : "text-left"}>
                              <span className="font-extrabold text-white block">#{o.orderName || o.id?.slice(0, 8)}</span>
                              <span className="text-4xs text-muted-text">
                                {(() => {
                                  try {
                                    return new Date(o.orderDate || o.createdAt).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric"
                                    });
                                  } catch {
                                    return o.orderDate;
                                  }
                                })()}
                              </span>
                            </div>
                            <div className={locale === "ar" ? "text-left" : "text-right"}>
                              <span className="font-extrabold text-primary-coral block">{Math.round(o.totalPrice).toLocaleString()} EGP</span>
                              <span className={`text-[8px] font-bold uppercase ${
                                o.status === "Delivered" ? "text-success-green" :
                                o.status === "Cancelled" || o.status === "Rejected" ? "text-red-500" : "text-accent-orange"
                              }`}>
                                {o.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    setSelectedCustomerId(null);
                    setCustomerDetails(null);
                  }}
                  className="mt-6 w-full rounded-full bg-primary-coral py-2.5 text-3xs font-black tracking-widest text-main-bg hover:bg-white transition-all duration-300 uppercase"
                >
                  {locale === "ar" ? "إغلاق السجل" : "CLOSE LEDGER"}
                </button>
              </div>
            ) : (
              <p className="text-center text-muted-text py-6 uppercase tracking-wider text-2xs">
                {locale === "ar" ? "فشل تحميل سجل العميل." : "Failed to load customer record."}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}