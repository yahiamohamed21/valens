"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { Icon } from "@/components/SvgIcons";
import { api } from "@/lib/api";
import { showConfirmToast } from "@/lib/toast";

interface AdminReview {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
}

export default function AdminReviewsPage() {
  const { locale, showToast } = useApp();
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "approved" | "pending">("all");

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await api.reviews.listAdmin();
      if (res && (res as any).success) {
        setReviews((res as any).data || []);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load reviews";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleToggleApprove = async (id: string) => {
    try {
      const res = await api.reviews.toggleApprove(id);
      if (res && (res as any).success) {
        setReviews((prev) =>
          prev.map((r) =>
            r.id === id ? { ...r, isApproved: !r.isApproved } : r
          )
        );
        showToast(
          locale === "ar" ? "تم تحديث حالة الموافقة" : "Approval status updated",
          "success"
        );
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update review";
      showToast(msg, "error");
    }
  };

  const handleDeleteReview = async (id: string) => {
    try {
      const res = await api.reviews.delete(id);
      if (res && (res as any).success) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
        showToast(
          locale === "ar" ? "تم حذف التقييم" : "Review deleted successfully",
          "success"
        );
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete review";
      showToast(msg, "error");
    }
  };

  // Filtering & Search
  const filteredReviews = reviews.filter((r) => {
    const matchesSearch =
      r.customerName.toLowerCase().includes(search.toLowerCase()) ||
      r.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
      r.productName.toLowerCase().includes(search.toLowerCase()) ||
      r.comment.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "approved" && r.isApproved) ||
      (statusFilter === "pending" && !r.isApproved);

    return matchesSearch && matchesStatus;
  });

  const getLabels = () => {
    if (locale === "ar") {
      return {
        title: "إدارة مراجعات المنتجات",
        subtitle: "تقييمات وملاحظات العملاء",
        searchPlaceholder: "البحث بالاسم، البريد الإلكتروني، المنتج أو التعليق...",
        all: "الكل",
        approved: "نشط",
        pending: "قيد المراجعة",
        reviewer: "العميل",
        productName: "المنتج",
        rating: "التقييم",
        comment: "التعليق",
        date: "التاريخ",
        status: "الحالة",
        actions: "الإجراءات",
        unapproved: "مخفي",
        approveAction: "تفعيل التقييم",
        unapproveAction: "إخفاء التقييم",
        deleteConfirm: "تأكيد حذف هذا التقييم نهائياً؟",
        emptyReviews: "لا توجد مراجعات تطابق البحث الحالي.",
        loading: "جاري تحميل المراجعات..."
      };
    }
    return {
      title: "Product Reviews Management",
      subtitle: "Customer feedback and ratings",
      searchPlaceholder: "Search by reviewer, email, product or comment...",
      all: "All Reviews",
      approved: "Approved",
      pending: "Pending",
      reviewer: "Reviewer",
      productName: "Product",
      rating: "Rating",
      comment: "Comment",
      date: "Date",
      status: "Status",
      actions: "Actions",
      unapproved: "Moderated",
      approveAction: "Approve Review",
      unapproveAction: "Moderate/Hide",
      deleteConfirm: "Confirm permanent deletion of this review?",
      emptyReviews: "No reviews matched the current filter criteria.",
      loading: "Loading reviews..."
    };
  };

  const labels = getLabels();

  return (
    <div className={`flex flex-col gap-6 ${locale === "ar" ? "text-right" : "text-left"}`}>
      {/* Header */}
      <div className="flex flex-col gap-1.5 border-b border-border-color pb-4">
        <span className="text-2xs font-extrabold uppercase tracking-widest text-primary-coral">
          {labels.subtitle}
        </span>
        <h1 className="text-2xl font-black uppercase tracking-wider text-white">
          {labels.title}
        </h1>
      </div>

      {/* Filters and Search */}
      <div className={`flex flex-col md:flex-row gap-4 items-center justify-between ${
        locale === "ar" ? "md:flex-row-reverse" : ""
      }`}>
        {/* Search */}
        <div className="relative w-full md:max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={labels.searchPlaceholder}
            className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 pl-10 text-xs text-white placeholder-muted-text/50 focus:border-primary-coral focus:outline-none transition-luxury"
          />
          <div className="absolute left-3 top-3 text-muted-text/50">
            <Icon name="search" size={14} />
          </div>
        </div>

        {/* Status Filters */}
        <div className={`flex gap-2 w-full md:w-auto ${
          locale === "ar" ? "flex-row-reverse" : ""
        }`}>
          {(["all", "approved", "pending"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`rounded-xl border px-4 py-2 text-xs font-bold uppercase tracking-wider transition-luxury cursor-pointer ${
                statusFilter === filter
                  ? "border-primary-coral bg-primary-coral/10 text-primary-coral"
                  : "border-border-color bg-card-bg text-muted-text hover:text-white"
              }`}
            >
              {labels[filter]}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="py-20 text-center text-xs text-muted-text">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary-coral border-t-transparent inline-block mb-3" />
          <p>{labels.loading}</p>
        </div>
      ) : filteredReviews.length > 0 ? (
        <div className="rounded-2xl border border-border-color bg-card-bg/25 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className={`border-b border-border-color bg-surface-deep/45 text-[10px] font-black uppercase tracking-wider text-muted-text ${
                  locale === "ar" ? "text-right" : ""
                }`}>
                  <th className="px-6 py-4">{labels.reviewer}</th>
                  <th className="px-6 py-4">{labels.productName}</th>
                  <th className="px-6 py-4">{labels.rating}</th>
                  <th className="px-6 py-4">{labels.comment}</th>
                  <th className="px-6 py-4">{labels.date}</th>
                  <th className="px-6 py-4">{labels.status}</th>
                  <th className="px-6 py-4 text-right">{labels.actions}</th>
                </tr>
              </thead>
              <tbody className={`divide-y divide-border-color/30 text-xs text-white font-bold ${
                locale === "ar" ? "text-right" : ""
              }`}>
                {filteredReviews.map((review) => (
                  <tr
                    key={review.id}
                    className="hover:bg-surface-sec/15 transition-colors duration-200"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span>{review.customerName}</span>
                        <span className="text-4xs font-mono text-muted-text font-normal">
                          {review.customerEmail}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-[150px] truncate">
                      {review.productName}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex text-primary-coral gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Icon
                            key={i}
                            name="star"
                            size={10}
                            className={i < review.rating ? "text-primary-coral fill-primary-coral" : "text-border-color"}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate" title={review.comment}>
                      {review.comment}
                    </td>
                    <td className="px-6 py-4 font-mono text-[10px] text-muted-text">
                      {new Date(review.createdAt).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-4xs font-extrabold uppercase ${
                        review.isApproved 
                          ? "bg-success-green/10 text-success-green border border-success-green/20" 
                          : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                      }`}>
                        {review.isApproved ? labels.approved : labels.unapproved}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className={`flex gap-2 justify-end ${
                        locale === "ar" ? "flex-row-reverse" : ""
                      }`}>
                        <button
                          onClick={() => handleToggleApprove(review.id)}
                          className={`rounded-lg border px-2.5 py-1 text-4xs font-extrabold uppercase transition-luxury cursor-pointer ${
                            review.isApproved
                              ? "border-amber-500/20 bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white"
                              : "border-success-green/20 bg-success-green/10 text-success-green hover:bg-success-green hover:text-white"
                          }`}
                          title={review.isApproved ? labels.unapproveAction : labels.approveAction}
                        >
                          {review.isApproved
                            ? (locale === "ar" ? "إخفاء" : "MODERATE")
                            : (locale === "ar" ? "تفعيل" : "APPROVE")}
                        </button>
                        <button
                          onClick={() => showConfirmToast(
                            labels.deleteConfirm,
                            () => handleDeleteReview(review.id)
                          )}
                          className="rounded-lg border cursor-pointer border-border-color bg-surface-deep p-1.5 text-muted-text hover:text-accent-orange hover:border-accent-orange transition-luxury"
                        >
                          <Icon name="trash" size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-border-color border-dashed bg-card-bg/20 py-20 text-center text-xs text-muted-text">
          {labels.emptyReviews}
        </div>
      )}
    </div>
  );
}
