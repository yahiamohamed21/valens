import { useState } from "react";
import { Product, Category, Coupon, Expense } from "@/context/AppContext";

export const useAdminForms = () => {
  // Product modal state
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Category modal state
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

  // Coupon modal state
  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [editingCouponId, setEditingCouponId] = useState<string | null>(null);

  // Expense modal state
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);

  // Functions to open modals (reset or pre‑fill)
  const openProductForm = (prod: Product | null = null) => {
    if (prod) {
      setEditingProductId(prod.id);
    } else {
      setEditingProductId(null);
    }
    setProductModalOpen(true);
  };

  const openCategoryForm = (cat: Category | null = null) => {
    if (cat) {
      setEditingCategoryId(cat.id);
    } else {
      setEditingCategoryId(null);
    }
    setCategoryModalOpen(true);
  };

  const openCouponForm = (coup: Coupon | null = null) => {
    if (coup) {
      setEditingCouponId(coup.id);
    } else {
      setEditingCouponId(null);
    }
    setCouponModalOpen(true);
  };

  const openExpenseForm = (exp: Expense | null = null) => {
    if (exp) {
      setEditingExpenseId(exp.id);
    } else {
      setEditingExpenseId(null);
    }
    setExpenseModalOpen(true);
  };

  return {
    // State values
    productModalOpen,
    setProductModalOpen,
    editingProductId,
    setEditingProductId,
    categoryModalOpen,
    setCategoryModalOpen,
    editingCategoryId,
    setEditingCategoryId,
    couponModalOpen,
    setCouponModalOpen,
    editingCouponId,
    setEditingCouponId,
    expenseModalOpen,
    setExpenseModalOpen,
    editingExpenseId,
    setEditingExpenseId,
    // Open helpers
    openProductForm,
    openCategoryForm,
    openCouponForm,
    openExpenseForm,
  };
};
