import { useCallback, useMemo } from "react";
import type { Dispatch, SetStateAction } from "react";
import { api } from "@/lib/api";
import { showToast } from "@/lib/toast";
import type { Expense } from "@/types/store";

interface ExpenseActionDeps {
  expenses: Expense[];
  setExpenses: Dispatch<SetStateAction<Expense[]>>;
}

export const useExpenseActions = ({ expenses, setExpenses }: ExpenseActionDeps) => {
  const addExpense = useCallback(async (expData: Omit<Expense, "id">) => {
    try {
      const created = await api.expenses.create({
        title: expData.title,
        category: expData.category,
        amount: Number(expData.amount),
        date: expData.date,
        paymentMethod: expData.paymentMethod,
        notes: expData.notes,
      });

      const newExp: Expense = {
        ...expData,
        id: created.id || `exp-${Date.now()}`,
      };

      setExpenses((prev) => [newExp, ...prev]);
      showToast(`Expense for "${newExp.title}" added`, "success");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to add expense";
      showToast(message, "error");
    }
  }, [setExpenses]);

  const editExpense = useCallback(async (expenseId: string, updatedFields: Partial<Expense>) => {
    try {
      const existing = expenses.find((e) => e.id === expenseId);
      if (!existing) return;

      const merged = { ...existing, ...updatedFields };
      await api.expenses.update({
        id: expenseId,
        title: merged.title,
        category: merged.category,
        amount: Number(merged.amount),
        date: merged.date,
        paymentMethod: merged.paymentMethod,
        notes: merged.notes,
      });

      setExpenses((prev) =>
        prev.map((e) => {
          if (e.id === expenseId) {
            return { ...e, ...updatedFields };
          }
          return e;
        })
      );
      showToast("Expense item updated", "success");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update expense";
      showToast(message, "error");
    }
  }, [expenses, setExpenses]);

  const deleteExpense = useCallback(async (expenseId: string) => {
    try {
      await api.expenses.delete(expenseId);
      setExpenses((prev) => prev.filter((e) => e.id !== expenseId));
      showToast("Expense item deleted", "error");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete expense";
      showToast(message, "error");
    }
  }, [setExpenses]);

  return useMemo(
    () => ({ addExpense, editExpense, deleteExpense }),
    [addExpense, editExpense, deleteExpense]
  );
};
