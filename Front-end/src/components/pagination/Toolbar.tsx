import React, { useState, useRef, useEffect } from "react";
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
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

      <div ref={dropdownRef} className="relative flex items-center gap-3 w-full md:w-auto">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full md:w-48 flex items-center justify-between gap-3 rounded-xl border border-border-color bg-surface-deep px-4 py-2.5 text-xs font-extrabold text-white hover:border-primary-coral hover:text-primary-coral transition-luxury cursor-pointer select-none uppercase"
        >
          <span>
            {selectedCategory === "All"
              ? (t("common.all_categories") || "All Categories")
              : selectedCategory}
          </span>
          <Icon 
            name="chevron-down" 
            size={10} 
            className={`text-muted-text transition-transform duration-300 ${isOpen ? "rotate-180 text-primary-coral" : ""}`} 
          />
        </button>

        {isOpen && (
          <div className="absolute left-0 md:right-0 md:left-auto top-full mt-2 z-50 w-full md:w-48 bg-white border border-border-color/40 dark:bg-surface-deep dark:border-border-color/60 rounded-xl p-1.5 shadow-xl shadow-black/10 dark:shadow-black/40 backdrop-blur-md animate-fade-in flex flex-col gap-1">
            <button
              type="button"
              onClick={() => {
                onCategoryChange("All");
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-xs font-extrabold rounded-lg transition-colors cursor-pointer flex items-center justify-between gap-2 uppercase
                ${selectedCategory === "All" 
                  ? "bg-primary-coral/10 text-primary-coral dark:bg-primary-coral/25" 
                  : "text-neutral-700 hover:bg-neutral-100 hover:text-primary-coral dark:text-white dark:hover:bg-surface-sec dark:hover:text-primary-coral"
                }
              `}
            >
              <span>{t("common.all_categories") || "All Categories"}</span>
              {selectedCategory === "All" && <Icon name="check" size={10} className="text-primary-coral" />}
            </button>
            {categories.map((c) => {
              const isSelected = selectedCategory === c.name;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    onCategoryChange(c.name);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-extrabold rounded-lg transition-colors cursor-pointer flex items-center justify-between gap-2 uppercase
                    ${isSelected 
                      ? "bg-primary-coral/10 text-primary-coral dark:bg-primary-coral/25" 
                      : "text-neutral-700 hover:bg-neutral-100 hover:text-primary-coral dark:text-white dark:hover:bg-surface-sec dark:hover:text-primary-coral"
                    }
                  `}
                >
                  <span>{c.name}</span>
                  {isSelected && <Icon name="check" size={10} className="text-primary-coral" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
