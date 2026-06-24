import { useCallback, useMemo } from "react";
import type { Dispatch, SetStateAction } from "react";
import { STORAGE_KEYS } from "@/lib/constants";
import { setStorageItem } from "@/lib/storage";
import { showToast } from "@/lib/toast";
import type { Expense } from "@/types/store";

interface ExpenseActionDeps {
  expenses: Expense[];
  setExpenses: Dispatch<SetStateAction<Expense[]>>;
}

export const useExpenseActions = ({ expenses, setExpenses }: ExpenseActionDeps) => {
  const addExpense = useCallback((expData: Omit<Expense, "id">) => {
    const newExp: Expense = {
      ...expData,
      id: `exp-${Date.now()}`,
    };
    const newExps = [newExp, ...expenses];
    setExpenses(newExps);
    setStorageItem(STORAGE_KEYS.EXPENSES, newExps);
    showToast(`Expense for "${newExp.title}" added`, "success");
  }, [expenses, setExpenses]);

  const editExpense = useCallback((expenseId: string, updatedFields: Partial<Expense>) => {
    const newExps = expenses.map((e) => {
      if (e.id === expenseId) {
        return { ...e, ...updatedFields };
      }
      return e;
    });
    setExpenses(newExps);
    setStorageItem(STORAGE_KEYS.EXPENSES, newExps);
    showToast("Expense item updated", "success");
  }, [expenses, setExpenses]);

  const deleteExpense = useCallback((expenseId: string) => {
    const newExps = expenses.filter((e) => e.id !== expenseId);
    setExpenses(newExps);
    setStorageItem(STORAGE_KEYS.EXPENSES, newExps);
    showToast("Expense item deleted", "error");
  }, [expenses, setExpenses]);

  return useMemo(
    () => ({ addExpense, editExpense, deleteExpense }),
    [addExpense, editExpense, deleteExpense]
  );
};
