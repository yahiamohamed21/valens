import type { Category } from "@/types/store";

export const initialCategories: Category[] = [
  { id: "cat-1", name: "Protein", slug: "protein", imageColor: "#FF8A75", visible: true },
  { id: "cat-2", name: "Performance", slug: "performance", imageColor: "#FF5226", visible: true },
  { id: "cat-3", name: "Wellness", slug: "wellness", imageColor: "#10D981", visible: true },
  { id: "cat-4", name: "Recovery", slug: "recovery", imageColor: "#8D7B73", visible: true },
];
