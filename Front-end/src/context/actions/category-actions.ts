import { useCallback, useMemo } from "react";
import type { Dispatch, SetStateAction } from "react";
import { STORAGE_KEYS } from "@/lib/constants";
import { setStorageItem } from "@/lib/storage";
import { showToast } from "@/lib/toast";
import type { Category } from "@/types/store";

interface CategoryActionDeps {
  categories: Category[];
  setCategories: Dispatch<SetStateAction<Category[]>>;
}

export const useCategoryActions = ({ categories, setCategories }: CategoryActionDeps) => {
  const addCategory = useCallback((catData: Omit<Category, "id" | "slug">) => {
    const newCat: Category = {
      ...catData,
      id: `cat-${Date.now()}`,
      slug: catData.name.toLowerCase().replace(/\s+/g, "-"),
    };
    const newCats = [...categories, newCat];
    setCategories(newCats);
    setStorageItem(STORAGE_KEYS.CATEGORIES, newCats);
    showToast(`Category "${newCat.name}" created`, "success");
  }, [categories, setCategories]);

  const editCategory = useCallback((categoryId: string, updatedFields: Partial<Category>) => {
    const newCats = categories.map((cat) => {
      if (cat.id === categoryId) {
        const merged = { ...cat, ...updatedFields };
        if (updatedFields.name) {
          merged.slug = updatedFields.name.toLowerCase().replace(/\s+/g, "-");
        }
        return merged;
      }
      return cat;
    });
    setCategories(newCats);
    setStorageItem(STORAGE_KEYS.CATEGORIES, newCats);
    showToast("Category updated", "success");
  }, [categories, setCategories]);

  const deleteCategory = useCallback((categoryId: string) => {
    const newCats = categories.filter((cat) => cat.id !== categoryId);
    setCategories(newCats);
    setStorageItem(STORAGE_KEYS.CATEGORIES, newCats);
    showToast("Category removed", "error");
  }, [categories, setCategories]);

  return useMemo(
    () => ({ addCategory, editCategory, deleteCategory }),
    [addCategory, editCategory, deleteCategory]
  );
};
