import React from "react";
import { Icon } from "@/components/SvgIcons";
import { useTranslation } from "@/context/LanguageContext";

interface ToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: { id: string; name: string }[];
}

export const Toolbar: React.FC<ToolbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card-bg/40 p-4 rounded-2xl border border-border-color/30 mb-6">
      <div className="relative w-full md:w-72">
        <Icon
          name="search"
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-text"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t("common.search") || "Search products..."}
          className="w-full rounded-xl border border-border-color bg-surface-deep pl-10 pr-4 py-2.5 text-xs text-white focus:border-primary-coral focus:outline-none transition-all"
        />
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full md:w-48 rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs text-white focus:outline-none uppercase"
        >
          <option value="All">{t("common.all_categories") || "All Categories"}</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
