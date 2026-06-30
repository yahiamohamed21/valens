import { useCallback, useMemo } from "react";
import type { Dispatch, SetStateAction } from "react";
import { api } from "@/lib/api";
import { showToast } from "@/lib/toast";
import type { Category } from "@/types/store";

interface CategoryActionDeps {
  categories: Category[];
  setCategories: Dispatch<SetStateAction<Category[]>>;
}

export const useCategoryActions = ({ categories, setCategories }: CategoryActionDeps) => {
  const addCategory = useCallback(async (catData: Omit<Category, "id" | "slug">) => {
    try {
      const created = await api.categories.create({
        name: catData.name,
        imageColor: catData.imageColor,
        visible: catData.visible,
      });
      const newCat: Category = {
        id: created.id || `cat-${Date.now()}`,
        name: created.name || catData.name,
        slug: created.slug || catData.name.toLowerCase().replace(/\s+/g, "-"),
        imageColor: created.imageColor || catData.imageColor,
        visible: created.visible !== undefined ? created.visible : catData.visible,
      };
      setCategories((prev) => [...prev, newCat]);
      showToast(`Category "${newCat.name}" created`, "success");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create category";
      showToast(message, "error");
    }
  }, [setCategories]);

  const editCategory = useCallback(async (categoryId: string, updatedFields: Partial<Category>) => {
    try {
      const existing = categories.find((c) => c.id === categoryId);
      if (!existing) return;

      const isToggleOnly = Object.keys(updatedFields).length === 1 && "visible" in updatedFields;

      if (isToggleOnly) {
        await api.categories.toggle(categoryId);
      } else {
        await api.categories.update({
          id: categoryId,
          name: updatedFields.name !== undefined ? updatedFields.name : existing.name,
          imageColor: updatedFields.imageColor !== undefined ? updatedFields.imageColor : existing.imageColor,
          visible: updatedFields.visible !== undefined ? updatedFields.visible : existing.visible,
        });
      }

      setCategories((prev) =>
        prev.map((cat) => {
          if (cat.id === categoryId) {
            const merged = { ...cat, ...updatedFields };
            if (updatedFields.name) {
              merged.slug = updatedFields.name.toLowerCase().replace(/\s+/g, "-");
            }
            return merged;
          }
          return cat;
        })
      );
      showToast("Category updated", "success");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update category";
      showToast(message, "error");
    }
  }, [categories, setCategories]);

  const deleteCategory = useCallback(async (categoryId: string) => {
    try {
      await api.categories.delete(categoryId);
      setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
      showToast("Category removed", "error");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete category";
      showToast(message, "error");
    }
  }, [setCategories]);

  return useMemo(
    () => ({ addCategory, editCategory, deleteCategory }),
    [addCategory, editCategory, deleteCategory]
  );
};
